import { NextResponse } from "next/server";
import { redis } from "@/server/clients/redis";
import { supabaseAdmin } from "@/server/clients/supabase";
import { stripe } from "@/server/clients/stripe";

/**
 * Health check endpoint
 *
 * Checks the health of all external services:
 * - Redis (Upstash)
 * - Supabase
 * - Stripe
 *
 * Returns 200 if all services are healthy, 503 if any service is down.
 *
 * @returns Health status response
 */
export async function GET() {
  const checks = {
    redis: false,
    supabase: false,
    stripe: false,
  };

  const errors: string[] = [];

  // Check Redis
  try {
    // Upstash Redis doesn't have ping(), so we use a simple get operation
    await redis.get("health:check");
    checks.redis = true;
  } catch {
    errors.push("Redis is unavailable");
  }

  // Check Supabase
  try {
    const { error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    if (!error) {
      checks.supabase = true;
    } else {
      errors.push(`Supabase error: ${error.message}`);
    }
  } catch {
    errors.push("Supabase is unavailable");
  }

  // Check Stripe
  try {
    await stripe.balance.retrieve();
    checks.stripe = true;
  } catch {
    errors.push("Stripe is unavailable");
  }

  const allHealthy = Object.values(checks).every((check) => check === true);

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
      ...(errors.length > 0 && { errors }),
    },
    { status: allHealthy ? 200 : 503 }
  );
}
