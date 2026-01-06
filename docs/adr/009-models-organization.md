# ADR-009: Models Organization and Type System Standardization

## Status

Accepted

## Context

As the project grew, we needed a clear and consistent way to organize TypeScript types, interfaces, constants, enums, and validation schemas. Without a standardized structure, it becomes difficult to:

- Find where specific types are defined
- Understand the relationship between different type definitions
- Maintain consistency across the codebase
- Onboard new developers
- Scale the type system as the application grows

## Decision

We established a standardized organization structure under `src/models/` with clear separation of concerns:

```
src/models/
├── constants/     # Immutable constant values
├── enums/         # TypeScript enums
├── interfaces/    # TypeScript interfaces (object shapes)
├── schemas/       # Zod validation schemas
└── types/         # TypeScript type aliases (unions, intersections, etc.)
```

### Directory Structure

#### `constants/`

Contains immutable constant values organized by domain:

- `dashboard.ts` - Dashboard UI constants
- `locale.ts` - Locale-related constants
- `responsive.ts` - Responsive breakpoint constants
- `subscription.ts` - Subscription status constants
- `theme.ts` - Theme-related constants
- `trials.ts` - Trial period constants
- `validation.ts` - Validation rule constants

**Example:**

```typescript
/**
 * Subscription status constants
 *
 * Provides reusable constants for subscription status checks.
 */
import { SubscriptionStatus } from "@/models/enums/subscription-status";

export const PAYMENT_ISSUE_STATUSES: readonly SubscriptionStatus[] = [
  SubscriptionStatus.PAST_DUE,
  SubscriptionStatus.UNPAID,
  SubscriptionStatus.INCOMPLETE,
  SubscriptionStatus.INCOMPLETE_EXPIRED,
] as const;
```

#### `enums/`

Contains TypeScript enums for enumerated values:

- `error-codes.ts` - Application error codes
- `frontend-routes.ts` - Frontend route paths
- `subscription-status.ts` - Stripe subscription status values

**Example:**

```typescript
/**
 * Stripe subscription status enum
 *
 * Possible values according to Stripe documentation.
 */
export enum SubscriptionStatus {
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",
  TRIALING = "trialing",
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
  UNPAID = "unpaid",
  PAUSED = "paused",
}
```

#### `interfaces/`

Contains TypeScript interfaces (object shapes) organized by context:

- `components/` - Component prop interfaces organized by component type
  - `dashboard/` - Dashboard component interfaces
  - `dynamics/` - Dynamic component interfaces
  - `features/` - Feature component interfaces
  - `forms/` - Form component interfaces
  - `generic/` - Generic/reusable component interfaces
  - `sidebar/` - Sidebar component interfaces
- `layout/` - Layout-related interfaces
- `server/` - Server-side interfaces
- `services/` - Service layer interfaces
- `subscription.ts` - Subscription-related interfaces

**Example:**

```typescript
/**
 * Calendar interfaces
 *
 * Interfaces for date range picker component props.
 */
import { type DateRange } from "react-day-picker";
import { LocaleType } from "@/models/types/locale";

export interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultRange?: DateRange;
  onRangeChange?: (range: DateRange | undefined) => void;
  locale?: LocaleType;
  translations: DateRangePickerTranslations;
}
```

#### `types/`

Contains TypeScript type aliases (unions, intersections, result types, etc.) organized by context:

- `components/` - Component-related types
- `i18n.ts` - Internationalization types
- `layout.ts` - Layout types
- `locale.ts` - Locale types
- `payment.ts` - Payment-related types
- `server/` - Server-side types
- `services/` - Service layer types
- `sitemap.ts` - Sitemap types

**Example:**

```typescript
/**
 * Auth result types
 *
 * Result types for Supabase Auth user operations.
 */
import type { User } from "@supabase/supabase-js";

export type UserSyncResult =
  | { user: User; isNew: boolean; error?: never }
  | { user?: never; isNew?: never; error: Error };
```

#### `schemas/`

Contains Zod validation schemas organized by context:

- `api/` - API endpoint validation schemas
  - `checkout.schema.ts` - Checkout API schema
  - `resend.schema.ts` - Resend API schema
  - `subscription.schema.ts` - Subscription API schema
- `auth.ts` - Authentication schemas

**Example:**

```typescript
/**
 * Authentication schemas
 *
 * Zod schemas for validating authentication form data.
 */
import { z } from "@/lib/zod";

const AuthSignInSchema = z.object({
  email: z.string().email(),
});

type AuthSignInSchemaType = z.infer<typeof AuthSignInSchema>;

export { AuthSignInSchema, type AuthSignInSchemaType };
```

### Naming Conventions

1. **File names**: Use kebab-case (e.g., `error-codes.ts`, `auth-form.ts`)
2. **Type/Interface names**: Use PascalCase (e.g., `DateRangePickerProps`, `UserSyncResult`)
3. **Constant names**: Use UPPER_SNAKE_CASE (e.g., `PAYMENT_ISSUE_STATUSES`, `COMMAND_SHORTCUT_KEY`)
4. **Enum names**: Use PascalCase (e.g., `SubscriptionStatus`)
5. **Schema names**: Use PascalCase with "Schema" suffix (e.g., `AuthSignInSchema`)

### When to Use Each Type

#### Use `interfaces/` when:

- Defining object shapes with properties
- Extending React component props
- Defining service method parameters
- Creating data transfer objects (DTOs)

#### Use `types/` when:

- Creating union types (e.g., `"sign-in" | "sign-up"`)
- Creating result types with discriminated unions
- Creating type aliases for complex types
- Creating utility types

#### Use `enums/` when:

- Defining a fixed set of string or number values
- Values need to be referenced across the codebase
- Type safety is needed for enumerated values

#### Use `constants/` when:

- Defining immutable values
- Creating arrays or objects of related constants
- Grouping related constant values together

#### Use `schemas/` when:

- Validating runtime data with Zod
- Need to infer types from validation schemas
- API request/response validation

### Documentation Standards

All model files should include:

1. **File-level JSDoc comment** describing the purpose:

   ```typescript
   /**
    * Calendar interfaces
    *
    * Interfaces for date range picker component props.
    */
   ```

2. **Item-level JSDoc comments** for exported items:

   ```typescript
   /**
    * Props for DateRangePicker component
    */
   export interface DateRangePickerProps { ... }
   ```

3. **Context comments** when needed for complex types or business logic

## Alternatives Considered

### Alternative 1: Flat Structure

All types in a single `types/` directory.

- **Pros**: Simple, easy to find files
- **Cons**: No clear separation, harder to organize as project grows, mixing concerns

### Alternative 2: Co-location with Components

Types defined next to components that use them.

- **Pros**: Types close to usage, easy to find
- **Cons**: Duplication, harder to share types, inconsistent organization

### Alternative 3: Single `types.ts` File

All types in one file.

- **Pros**: Very simple
- **Cons**: Unmaintainable for large projects, merge conflicts, poor discoverability

### Alternative 4: Domain-Driven Organization

Organize by domain (auth, payment, dashboard) rather than by type category.

- **Pros**: Related code grouped together
- **Cons**: Harder to find specific type categories, mixing interfaces/types/constants

## Consequences

### Positive

1. **Clear Organization**: Easy to find where types are defined
2. **Separation of Concerns**: Interfaces, types, constants, and schemas are clearly separated
3. **Scalability**: Structure supports growth without becoming messy
4. **Consistency**: Standardized naming and organization across the codebase
5. **Discoverability**: New developers can quickly understand the structure
6. **Type Safety**: Clear distinction between interfaces (object shapes) and types (unions, aliases)
7. **Reusability**: Types are centralized and can be easily imported

### Negative

1. **More Files**: More files to navigate (mitigated by good IDE search)
2. **Import Paths**: Longer import paths (e.g., `@/models/interfaces/components/generic/calendar`)
3. **Initial Setup**: Requires understanding the structure before contributing

### Mitigations

1. **IDE Support**: Modern IDEs provide excellent autocomplete and search
2. **Path Aliases**: Using `@/models` alias makes imports cleaner
3. **Documentation**: This ADR and code comments help onboard developers

## Implementation Guidelines

### Creating New Types

1. **Determine the category**: interface, type, enum, constant, or schema
2. **Choose the appropriate directory**: Based on context (components, server, services, etc.)
3. **Follow naming conventions**: kebab-case for files, PascalCase for types
4. **Add documentation**: File-level and item-level JSDoc comments
5. **Export properly**: Use named exports, export types with `type` keyword

### Import Patterns

```typescript
// Import interfaces
import type { DateRangePickerProps } from "@/models/interfaces/components/generic/calendar";

// Import types
import type { UserSyncResult } from "@/models/types/auth";

// Import enums
import { SubscriptionStatus } from "@/models/enums/subscription-status";

// Import constants
import { PAYMENT_ISSUE_STATUSES } from "@/models/constants/subscription";

// Import schemas
import {
  AuthSignInSchema,
  type AuthSignInSchemaType,
} from "@/models/schemas/auth";
```

### Best Practices

1. **Prefer `type` over `interface`** for unions, intersections, and aliases
2. **Use `interface` for object shapes** that might be extended
3. **Export inferred types from schemas** for type safety
4. **Group related constants** in the same file
5. **Use `as const`** for constant arrays/objects to preserve literal types
6. **Document complex types** with JSDoc comments
7. **Keep files focused** - one domain or component type per file

## References

- [TypeScript Handbook - Types vs Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)

