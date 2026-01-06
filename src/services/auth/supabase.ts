import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/server/clients/supabase";
import type { UserSyncResult } from "@/models/types/auth";
import type { UserResult } from "@/models/types/services/auth";
import type { SyncUserParams } from "@/models/interfaces/services/auth";
import { createRedisCache } from "@/server/utils/redis/cache";
import {
  REDIS_PREFIXES,
  DEFAULT_CACHE_TTL,
} from "@/server/utils/redis/constants";
import {
  validateEmail,
  validateNonEmptyString,
} from "@/server/utils/validation";
import {
  normalizeEmail,
  sanitizeName,
  sanitizeImageUrl,
} from "@/server/utils/sanitization";
import { toError, createError } from "@/server/utils/errors";

const userCache = createRedisCache<User>(
  DEFAULT_CACHE_TTL,
  REDIS_PREFIXES.CACHE
);

/**
 * Finds a Supabase user by email address
 *
 * Uses Redis cache to reduce API calls.
 * Returns cached user if available, otherwise queries Supabase Admin API.
 *
 * @param email - User email address
 * @returns Promise resolving to user result or error
 */
async function findUserByEmail(email: string): Promise<UserResult> {
  const cached = await userCache.get(email);
  if (cached) {
    return { user: cached };
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return { error: createError(error.message) };
    }

    const user = data.users.find((u) => u.email === email);

    if (!user) {
      return { error: createError("User not found") };
    }

    await userCache.set(email, user);
    return { user };
  } catch (error) {
    return { error: toError(error) };
  }
}

/**
 * Creates a new user in Supabase Auth
 *
 * Sets email_confirm to true for immediate access.
 * Stores Better Auth user ID in user_metadata.
 * Caches the created user in Redis.
 *
 * @param userId - Better Auth user ID
 * @param email - User email address
 * @param name - User name (optional)
 * @param image - User avatar URL (optional)
 * @returns Promise resolving to user sync result
 */
async function createUser({
  userId,
  email,
  name,
  image,
}: SyncUserParams): Promise<UserSyncResult> {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        betterAuthUserId: userId,
        name: name ?? null,
        image: image ?? null,
        createdAt: new Date().toISOString(),
      },
    });

    if (error) {
      const isDuplicateError =
        error.message.includes("already registered") ||
        error.message.includes("already exists");

      if (isDuplicateError) {
        const existingUser = await findUserByEmail(email);
        if (existingUser.user) {
          return { user: existingUser.user, isNew: false };
        }
      }
      return { error: createError(error.message) };
    }

    if (!data?.user) {
      return {
        error: createError("Failed to create user: no user data returned"),
      };
    }

    await userCache.set(email, data.user);
    return { user: data.user, isNew: true };
  } catch (error) {
    return { error: toError(error) };
  }
}

/**
 * Updates an existing Supabase Auth user
 *
 * Preserves existing user_metadata and merges new values.
 * Caches the updated user in Redis.
 *
 * @param supabaseUserId - Supabase user ID
 * @param userId - Better Auth user ID
 * @param email - User email address
 * @param name - User name (optional)
 * @param image - User avatar URL (optional)
 * @returns Promise resolving to user sync result
 */
async function updateUser({
  supabaseUserId,
  userId,
  email,
  name,
  image,
}: SyncUserParams & { supabaseUserId: string }): Promise<UserSyncResult> {
  try {
    const existingUserResult = await findUserByEmail(email);
    const existingMetadata = existingUserResult.user?.user_metadata || {};

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      supabaseUserId,
      {
        email,
        user_metadata: {
          ...existingMetadata,
          betterAuthUserId: userId,
          name: name ?? null,
          image: image ?? null,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (error) {
      return { error: createError(error.message) };
    }

    if (!data?.user) {
      return {
        error: createError("Failed to update user: no user data returned"),
      };
    }

    await userCache.set(email, data.user);
    return { user: data.user, isNew: false };
  } catch (error) {
    return { error: toError(error) };
  }
}

/**
 * Syncs user from Better Auth to Supabase Auth
 *
 * This function:
 * - Creates user in Supabase Auth if it doesn't exist
 * - Updates user data if it exists and needs update
 * - Preserves existing user_metadata (including subscription data)
 * - Uses Redis cache to reduce API calls (distributed cache)
 *
 * @param userId - Better Auth user ID (stored in user_metadata.betterAuthUserId)
 * @param email - User email (used as unique identifier)
 * @param name - User name (optional)
 * @param image - User avatar URL (optional)
 * @returns UserSyncResult with user data and sync status
 */
export async function syncUserToSupabase({
  userId,
  email,
  name,
  image,
}: SyncUserParams): Promise<UserSyncResult> {
  if (!validateNonEmptyString(userId)) {
    return { error: createError("Invalid userId") };
  }

  if (!validateEmail(email)) {
    return { error: createError("Invalid email") };
  }

  const normalizedEmail = normalizeEmail(email);
  const sanitizedName = sanitizeName(name);
  const sanitizedImage = sanitizeImageUrl(image);

  try {
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser.error) {
      const isNotFoundError = existingUser.error.message === "User not found";
      if (isNotFoundError) {
        return createUser({
          userId,
          email: normalizedEmail,
          name: sanitizedName,
          image: sanitizedImage,
        });
      }
      return { error: existingUser.error };
    }

    if (!existingUser.user) {
      return createUser({
        userId,
        email: normalizedEmail,
        name: sanitizedName,
        image: sanitizedImage,
      });
    }

    const needsUpdate =
      existingUser.user.email !== normalizedEmail ||
      existingUser.user.user_metadata?.betterAuthUserId !== userId ||
      existingUser.user.user_metadata?.name !== sanitizedName ||
      existingUser.user.user_metadata?.image !== sanitizedImage;

    if (!needsUpdate) {
      return { user: existingUser.user, isNew: false };
    }

    await userCache.delete(normalizedEmail);
    return updateUser({
      supabaseUserId: existingUser.user.id,
      userId,
      email: normalizedEmail,
      name: sanitizedName,
      image: sanitizedImage,
    });
  } catch (error) {
    return { error: toError(error) };
  }
}
