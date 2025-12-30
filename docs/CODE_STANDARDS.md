# Code Standards & Structure Guidelines

**Project**: SaaS Seed  
**Version**: 1.0.0  
**Last Updated**: 2024-12-30

## Table of Contents

1. [Project Structure](#project-structure)
2. [Naming Conventions](#naming-conventions)
3. [Component Patterns](#component-patterns)
4. [File Organization](#file-organization)
5. [TypeScript Standards](#typescript-standards)
6. [Styling Guidelines](#styling-guidelines)
7. [Import Organization](#import-organization)
8. [Form Patterns](#form-patterns)
9. [React Hooks Patterns](#react-hooks-patterns)
10. [Error Handling & Loading States](#error-handling--loading-states)
11. [Server Actions & API Routes](#server-actions--api-routes)
12. [Code Quality](#code-quality)
13. [Best Practices](#best-practices)

---

## Project Structure

### Directory Layout

```
/
├── proxy.ts                    # Next.js 16 proxy for auth & i18n
├── src/
│   ├── app/                    # Next.js App Router pages & layouts
│   │   ├── [lang]/            # Internationalized routes
│   │   │   ├── (auth)/        # Auth route group
│   │   │   └── dashboard/     # Protected dashboard routes
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── container/         # Layout & form components
│   │   │   ├── dashboard/    # Dashboard-specific components
│   │   │   ├── forms/        # Form components
│   │   │   ├── generic/      # Reusable generic components
│   │   │   ├── sidebar/      # Sidebar components
│   │   │   └── user/         # User-related components
│   │   ├── features/          # Feature-specific components
│   │   ├── providers/         # React context providers
│   │   └── ui/               # Shadcn/UI base components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities & configurations
│   │   ├── auth/             # Authentication utilities
│   │   └── get/              # Data fetching utilities
│   ├── locales/               # i18n translation files
│   │   ├── en/               # English translations
│   │   └── pt/               # Portuguese translations
│   ├── models/                # TypeScript models & types
│   │   ├── constants/        # Application constants
│   │   ├── enums/            # TypeScript enums
│   │   ├── interfaces/       # TypeScript interfaces
│   │   │   ├── components/   # Component prop interfaces
│   │   │   └── services/    # Service interfaces
│   │   ├── mocks/            # Mock data for development
│   │   ├── schemas/          # Zod validation schemas
│   │   └── types/            # TypeScript type definitions
│   ├── services/             # API & business logic services
│   └── server/               # Server-side utilities
```

### Key Principles

1. **Separation of Concerns**: Clear boundaries between UI, business logic, and data
2. **Component Isolation**: Each component has its own interface file
3. **Type Safety**: Full TypeScript coverage with interfaces for all components
4. **Internationalization**: All user-facing text in locale files
5. **Reusability**: Generic components in `components/container/generic/`

---

## Naming Conventions

### Files & Directories

- **Components**: `kebab-case.tsx` (e.g., `user-menu.tsx`, `recent-invoices.tsx`)
- **Interfaces**: `kebab-case.ts` (e.g., `user-menu.ts`, `recent-invoices.ts`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-mobile.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `get-dictionaries.ts`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- **Directories**: `kebab-case` (e.g., `generic/`, `recent-invoices/`)

### Code Elements

- **Components**: `PascalCase` (e.g., `UserMenu`, `RecentInvoices`)
- **Interfaces**: `PascalCase` with `Props` suffix (e.g., `UserMenuProps`, `RecentInvoicesProps`)
- **Types**: `PascalCase` (e.g., `InvoiceStatus`, `MetricTrend`)
- **Functions**: `camelCase` (e.g., `getDictionary`, `formatValue`)
- **Variables**: `camelCase` (e.g., `selectedTab`, `chartData`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)

### Component Naming Rules

- **NO hyphens in component file names**: Use `kebab-case` for files, but component names are `PascalCase`
- **Mirror structure**: Component files mirror interface files
  - Component: `src/components/container/generic/table/recent-invoices.tsx`
  - Interface: `src/models/interfaces/components/generic/table/recent-invoices.ts`

---

## Component Patterns

### Component Architecture Principles

Custom components that extend shadcn/ui must maintain:

1. **Visual consistency** through shared design tokens and styling patterns
2. **Behavioral consistency** via similar APIs and interaction patterns
3. **Accessibility consistency** by following WCAG guidelines and ARIA standards
4. **Theming consistency** through CSS custom properties and theme integration
5. **Developer experience consistency** with familiar prop patterns and TypeScript support

### Component Structure

Every custom component MUST follow this structure:

```typescript
"use client"; // Only if component uses client-side features

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// Shadcn/UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Utilities
import { cn } from "@/lib/utils";

// Interfaces
import { type ComponentNameProps } from "@/models/interfaces/components/generic/component-name";

// Variant system using class-variance-authority
const componentNameVariants = cva(
  "transition-all duration-200", // Base styles
  {
    variants: {
      variant: {
        default: "p-6",
        compact: "p-4",
        detailed: "p-6 space-y-4",
      },
      status: {
        success: "border-primary/20 bg-primary/5",
        warning: "border-warning/20 bg-warning/5",
        error: "border-destructive/20 bg-destructive/5",
        info: "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50",
        neutral: "",
      },
    },
    defaultVariants: {
      variant: "default",
      status: "neutral",
    },
  }
);

// Helper functions for data formatting and visualization
const formatValue = (val: string | number) => {
  if (typeof val === "number") {
    return new Intl.NumberFormat().format(val);
  }
  return val;
};

const getTrendIcon = (trend: "up" | "down" | "neutral") => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-primary" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    case "neutral":
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const getTrendColor = (trend: "up" | "down" | "neutral") => {
  switch (trend) {
    case "up":
      return "text-primary";
    case "down":
      return "text-destructive";
    case "neutral":
      return "text-muted-foreground";
  }
};

// Main component
export function ComponentName({
  title,
  description,
  value,
  change,
  variant = "default",
  status = "neutral",
  className,
  ...props
}: ComponentNameProps) {
  return (
    <Card
      className={cn(
        componentNameVariants({ variant, status }),
        className
      )}
      {...props}
    >
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0",
        variant === "compact" && "pb-2"
      )}>
        <div className="space-y-1">
          <CardTitle className={cn(
            variant === "compact" ? "text-sm" : "text-base"
          )}>
            <Text as="h3" size="lg" weight="semibold">
              {title}
            </Text>
          </CardTitle>
          {description && (
            <CardDescription className={cn(
              variant === "compact" && "text-xs"
            )}>
              <Text as="p" size="sm" color="muted">
                {description}
              </Text>
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn(
        variant === "compact" && "pt-0"
      )}>
        <div className="flex items-baseline gap-2">
          <div className={cn(
            "font-bold",
            variant === "compact" ? "text-xl" : "text-2xl lg:text-3xl"
          )}>
            <Text as="span" size="xl" weight="bold">
              {formatValue(value)}
            </Text>
          </div>

          {change && (
            <div className={cn(
              "flex items-center gap-1 text-sm",
              getTrendColor(change.trend)
            )}>
              {getTrendIcon(change.trend)}
              <Text as="span" size="sm" weight="medium">
                {Math.abs(change.value)}%
              </Text>
              <Text as="span" size="sm" color="muted">
                {change.period}
              </Text>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

ComponentName.displayName = "ComponentName";

export { ComponentName };
```

### Component Rules

1. **Composition over Inheritance**: Build on existing shadcn/ui components (Card, CardHeader, CardContent) rather than creating everything from scratch
2. **Always use `Text` component** for all text content (never raw HTML tags)
3. **Always use `Button` component** for buttons (never `<button>` tags)
4. **Use variant system**: Implement variants using `class-variance-authority` (cva) for consistent styling
5. **Use standard shadcn/ui colors** only (no custom color classes)
6. **Use Tailwind classes** instead of fixed pixel values
7. **Export displayName** for better debugging
8. **Spread props** to allow className and other HTML attributes
9. **Theme integration**: Use CSS custom properties and semantic color classes for light/dark themes
10. **Helper functions**: Extract formatting and visualization logic into helper functions
11. **Type safety**: Comprehensive TypeScript interfaces for excellent developer experience
12. **Accessibility**: Proper semantic HTML structure, ARIA labels, and keyboard navigation support

### Variant System Pattern

All components with multiple visual styles MUST use `class-variance-authority`:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const componentVariants = cva(
  "base-classes", // Always applied
  {
    variants: {
      variant: {
        default: "default-classes",
        compact: "compact-classes",
        detailed: "detailed-classes",
      },
      size: {
        sm: "small-classes",
        md: "medium-classes",
        lg: "large-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
```

### Helper Functions Pattern

Extract reusable logic into helper functions:

```typescript
// Formatting helpers
const formatValue = (val: string | number) => {
  if (typeof val === "number") {
    return new Intl.NumberFormat().format(val);
  }
  return val;
};

// Visualization helpers
const getTrendIcon = (trend: "up" | "down" | "neutral") => {
  // Return appropriate icon component
};

// Color helpers
const getStatusColor = (status: "success" | "warning" | "error") => {
  // Return appropriate color classes
};
```

### Complex Component Patterns

For advanced components (file uploads, timelines, data visualizations):

1. **State Management**:
   - Use multiple related state pieces thoughtfully
   - Implement proper cleanup for event listeners and async operations
   - Consider state reduction patterns for complex interactions

2. **Event Handling**:
   - Optimize callbacks with `useCallback` to prevent unnecessary re-renders
   - Handle browser events properly (`preventDefault`, `stopPropagation`)
   - Implement accessibility patterns (keyboard navigation, screen reader support)

3. **Progressive Enhancement**:
   - Start with basic functionality that works without JavaScript
   - Layer on enhanced interactions (drag-and-drop, real-time updates)
   - Provide fallbacks for unsupported features

4. **Component Architecture**:
   - Break complex components into smaller, focused sub-components
   - Use composition patterns to allow customization
   - Provide render props or children functions for maximum flexibility

### Component API Design Principles

When creating custom shadcn/ui components:

1. **Follow familiar patterns** from existing shadcn/ui components
2. **Use consistent component patterns** for proper composition
3. **Implement variant props** with `class-variance-authority`
4. **Support theming** through CSS custom properties
5. **Maintain accessibility** with proper ARIA attributes and keyboard navigation
6. **Provide extensibility** through render props or composition patterns

### Key Architectural Decisions

Custom components should demonstrate:

- **Composition over Inheritance**: Build on existing shadcn/ui components rather than creating everything from scratch
- **Type Safety First**: Comprehensive TypeScript interfaces provide excellent developer experience
- **Theme Integration**: Using CSS custom properties and semantic color classes ensures seamless light/dark theme support
- **Variant System**: The `class-variance-authority` pattern allows for flexible styling while maintaining consistency
- **Accessibility by Default**: Proper semantic HTML structure, ARIA labels, and keyboard navigation support

### Chart Components Standards

**IMPORTANT**: All chart components MUST follow the original shadcn/ui patterns exactly.

#### MCP Server Integration

- **Cursor MCP Server**: The project uses the shadcn/ui MCP server available in Cursor
- **Reference Source**: Always use the official shadcn/ui charts documentation as the source of truth
- **Documentation**: [shadcn/ui Charts](https://ui.shadcn.com/charts/area#charts)

#### Chart Component Rules

1. **Follow Original Patterns**: All charts MUST follow the exact structure and patterns from shadcn/ui charts documentation
2. **Use ChartContainer**: Always wrap charts with `ChartContainer` from `@/components/ui/chart`
3. **ChartConfig**: Define `chartConfig` using the `satisfies ChartConfig` pattern
4. **Recharts Integration**: Use Recharts components (AreaChart, BarChart, LineChart, etc.) as shown in shadcn/ui examples
5. **Tooltip & Legend**: Use `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent` from shadcn/ui
6. **Color System**: Use CSS custom properties from chart config (`var(--color-*)`) for colors
7. **Gradients**: Follow shadcn/ui gradient patterns for area charts (linearGradient with stopColor using CSS variables)
8. **Responsive**: Use `ResponsiveContainer` from Recharts for responsive behavior
9. **Accessibility**: Include `accessibilityLayer` prop on chart components when available

#### Chart Component Structure

```typescript
"use client";

import * as React from "react";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartComponent({ data }: ChartComponentProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="desktop"
          type="natural"
          fill="url(#fillDesktop)"
          stroke="var(--color-desktop)"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
```

#### Chart Types Reference

When implementing charts, refer to the official shadcn/ui documentation for:

- **Area Charts**: [Area Charts Documentation](https://ui.shadcn.com/charts/area#charts)
- **Bar Charts**: Follow shadcn/ui bar chart patterns
- **Line Charts**: Follow shadcn/ui line chart patterns
- **Pie Charts**: Follow shadcn/ui pie chart patterns
- **Radar Charts**: Follow shadcn/ui radar chart patterns
- **Radial Charts**: Follow shadcn/ui radial chart patterns

**CRITICAL**: Never deviate from shadcn/ui chart patterns. Always copy the structure from the official documentation and adapt only the data and labels.

### Interface Structure

Every component MUST have a corresponding interface file:

```typescript
import { DictionaryType } from "@/lib/get/dictionaries";

export interface ComponentData {
  // Data structure
}

export interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ComponentData;
  translation?: DictionaryType;
  // Other props
}
```

---

## File Organization

### Component Files

```
src/components/container/generic/
├── chart/
│   ├── churn-rate.tsx
│   ├── user-growth.tsx
│   └── conversion-funnel.tsx
├── table/
│   └── recent-invoices.tsx
└── product-performance.tsx
```

### Interface Files

```
src/models/interfaces/components/generic/
├── chart/
│   ├── churn-rate.ts
│   ├── user-growth.ts
│   └── conversion-funnel.ts
├── table/
│   └── recent-invoices.ts
└── product-performance.ts
```

### Mirror Structure Rule

- Component files and interface files MUST mirror each other's directory structure
- If component is at `components/container/generic/table/recent-invoices.tsx`
- Interface MUST be at `models/interfaces/components/generic/table/recent-invoices.ts`

---

## TypeScript Standards

### Type Safety Requirements

1. **All components MUST be typed** with TypeScript interfaces
2. **No `any` types** - use proper types or `unknown`
3. **Use type imports** for interfaces: `import type { ... }`
4. **Export types** from interface files for reuse

### Interface Patterns

```typescript
// ✅ GOOD: Proper interface with extension
export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ComponentData;
  translation?: DictionaryType;
}

// ❌ BAD: Missing extension or any types
export interface ComponentProps {
  data: any; // ❌
  translation?: any; // ❌
}
```

### Type Definitions

```typescript
// ✅ GOOD: Union types for status
export type InvoiceStatus = "complete" | "pending" | "cancelled";

// ✅ GOOD: Enum for constants
export enum UserRole {
  VIEWER = "viewer",
  DEVELOPER = "developer",
  OWNER = "owner",
}
```

---

## Styling Guidelines

### Tailwind CSS Rules

1. **Use Tailwind classes** instead of fixed pixel values
   - ✅ `w-40` instead of `w-[160px]`
   - ✅ `min-h-[60px]` for custom values (only when no standard class exists)
   - ❌ `style={{ minHeight: "60px" }}` (use className instead)

2. **Use standard shadcn/ui color classes**:
   - ✅ `bg-card`, `text-foreground`, `bg-primary/10`, `text-primary`
   - ✅ `bg-destructive/10`, `text-destructive`
   - ✅ `bg-muted`, `text-muted-foreground`
   - ❌ Custom colors like `bg-gray-800`, `text-blue-500`

3. **Responsive design**:
   - Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
   - Mobile-first approach

### Component Styling

```typescript
// ✅ GOOD: Using Tailwind and shadcn/ui classes
<Card className={cn("rounded-2xl border bg-card p-6", className)}>
  <Text className="text-foreground">Content</Text>
</Card>

// ❌ BAD: Custom colors and inline styles
<Card className="bg-white dark:bg-gray-800" style={{ padding: "24px" }}>
  <p className="text-gray-800">Content</p>
</Card>
```

---

## Import Organization

### Import Order

1. React and React-related
2. External libraries (lucide-react, recharts, etc.)
3. Shadcn/UI components
4. Internal utilities (`@/lib/utils`)
5. Interfaces and types
6. Relative imports (if any)

### Import Example

```typescript
"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { type ComponentProps } from "@/models/interfaces/components/generic/component";
```

### Import Rules

- Use `import type` for TypeScript types and interfaces
- Group imports with blank lines between groups
- Use absolute imports with `@/` alias
- Sort imports alphabetically within groups

---

## Code Quality

### ESLint & Prettier

- **ESLint**: Configured with Next.js and custom rules
- **Prettier**: Automatic code formatting
- **Run before commit**: `pnpm lint` and `pnpm format`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Code Review Checklist

- [ ] Component uses `Text` component for all text
- [ ] Component uses `Button` component for buttons
- [ ] No custom color classes (only shadcn/ui standard)
- [ ] No fixed pixel values (use Tailwind classes)
- [ ] Interface file exists and mirrors component structure
- [ ] TypeScript types are properly defined
- [ ] Imports are organized correctly
- [ ] Component has `displayName` export
- [ ] Props are spread correctly
- [ ] Variant system implemented with `cva` (if multiple styles needed)
- [ ] Helper functions extracted for formatting/visualization logic
- [ ] Theme integration (light/dark mode support)
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Composition pattern used (builds on shadcn/ui components)
- [ ] **For Charts**: Follows exact shadcn/ui chart patterns from [official documentation](https://ui.shadcn.com/charts/area#charts)
- [ ] **For Charts**: Uses `ChartContainer`, `ChartTooltip`, `ChartLegend` from shadcn/ui
- [ ] **For Charts**: Uses CSS custom properties (`var(--color-*)`) for colors
- [ ] **For Charts**: Uses `chartConfig` with `satisfies ChartConfig` pattern
- [ ] **For Forms**: Uses shadcn/ui Field components (`Field`, `FieldSet`, `FieldGroup`, `FieldLabel`, etc.)
- [ ] **For Forms**: Follows exact shadcn/ui Field patterns from [official documentation](https://ui.shadcn.com/docs/components/field)
- [ ] **For Forms**: Uses `htmlFor`/`id` relationships correctly
- [ ] **For Forms**: Uses `data-invalid` and `aria-invalid` for error states
- [ ] **For Forms**: Uses `FieldError` with errors array from React Hook Form
- [ ] No ESLint errors or warnings

---

## Form Patterns

**IMPORTANT**: All forms MUST follow the shadcn/ui Field component patterns exactly.

### Field Component Integration

All forms MUST use the `Field` component family from shadcn/ui for accessible form composition. Reference: [shadcn/ui Field Documentation](https://ui.shadcn.com/docs/components/field)

### React Hook Form with Field Components

All forms MUST use React Hook Form with Zod validation and shadcn/ui Field components:

```typescript
"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { FormSchema, type FormSchemaType } from "@/models/schemas/form";

export function FormComponent({ translation }: FormComponentProps) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const validatedData = FormSchema.parse(data);

    if (!validatedData) {
      return;
    }

    setLoading(true);

    const submitPromise = submitAction(validatedData)
      .then((result) => {
        if (result.error) {
          throw new Error(result.error.message || "Operation failed");
        }
        return result;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });

    toast.promise(submitPromise, {
      loading: translation?.generic.loading,
      success: () => translation?.success.operationSuccess || "Success!",
      error: (error: Error | string) => {
        const errorMessage = typeof error === "string" ? error : error.message;
        return translation?.errors.operationFailed || errorMessage;
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldLegend>
            <Text as="span" size="lg" weight="semibold">
              {translation?.form.title || "Form Title"}
            </Text>
          </FieldLegend>
          <FieldDescription>
            <Text as="p" size="sm" color="muted">
              {translation?.form.description || "Form description"}
            </Text>
          </FieldDescription>
          <FieldGroup>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.email}>
                  <FieldLabel htmlFor="email">
                    <Text as="span" size="sm" weight="medium">
                      {translation?.common.email || "Email"}
                    </Text>
                  </FieldLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      aria-invalid={!!form.formState.errors.email}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.email && (
                    <FieldError errors={[form.formState.errors.email]} />
                  )}
                </Field>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="name">
                    <Text as="span" size="sm" weight="medium">
                      {translation?.common.name || "Name"}
                    </Text>
                  </FieldLabel>
                  <FormControl>
                    <Input id="name" {...field} />
                  </FormControl>
                  <FieldDescription>
                    <Text as="p" size="xs" color="muted">
                      {translation?.form.nameDescription || "Enter your full name"}
                    </Text>
                  </FieldDescription>
                  {form.formState.errors.name && (
                    <FieldError errors={[form.formState.errors.name]} />
                  )}
                </Field>
              )}
            />
            <Field orientation="horizontal">
              <Button type="submit" disabled={loading}>
                <Text as="span" size="sm">
                  {loading ? translation?.generic.loading : translation?.form.submit || "Submit"}
                </Text>
              </Button>
              <Button type="button" variant="outline">
                <Text as="span" size="sm">
                  {translation?.form.cancel || "Cancel"}
                </Text>
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </Form>
  );
}
```

### Field Component Structure

Every form field MUST follow this structure using shadcn/ui Field components:

```typescript
<FieldSet>
  <FieldLegend>Section Title</FieldLegend>
  <FieldDescription>Section description</FieldDescription>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="input-id">Label</FieldLabel>
      <Input id="input-id" />
      <FieldDescription>Helper text</FieldDescription>
      <FieldError>Validation message</FieldError>
    </Field>
  </FieldGroup>
</FieldSet>
```

### Field Component Rules

1. **Always use Field components**: Use `Field`, `FieldSet`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError` from shadcn/ui
2. **FieldSet for grouping**: Use `FieldSet` with `FieldLegend` for semantic grouping of related fields
3. **FieldGroup for layout**: Use `FieldGroup` to stack `Field` components
4. **FieldLabel with htmlFor**: Always use `htmlFor` attribute matching input `id`
5. **FieldDescription for help**: Use `FieldDescription` for helper text
6. **FieldError for validation**: Use `FieldError` with `errors` array from React Hook Form
7. **data-invalid attribute**: Add `data-invalid` to `Field` for error state styling
8. **aria-invalid attribute**: Add `aria-invalid` to input for assistive technologies
9. **Orientation control**: Use `orientation="horizontal"` for side-by-side layouts, `orientation="responsive"` for automatic layouts
10. **FieldSeparator**: Use `FieldSeparator` to visually separate sections

### Form Rules

1. **Always use Zod schemas** for validation (place in `src/models/schemas/`)
2. **Use React Hook Form** with `zodResolver` for form management
3. **Use Field components**: Always use shadcn/ui Field components for form structure
4. **Loading states**: Always provide loading feedback during async operations
5. **Error handling**: Use `toast.promise` for async operations with loading/success/error states
6. **Type safety**: Use `z.infer<typeof Schema>` for form types
7. **Validation**: Parse data with Zod schema before submission
8. **Internationalization**: All form labels and messages from translation prop
9. **Accessibility**: Use proper `htmlFor`/`id` relationships and ARIA attributes
10. **Reference documentation**: Always follow [shadcn/ui Field Documentation](https://ui.shadcn.com/docs/components/field)

### Field Orientation Patterns

```typescript
// Vertical (default) - stacks label, control, and helper text
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" />
  <FieldDescription>Enter your email address</FieldDescription>
</Field>

// Horizontal - label and control side-by-side
<Field orientation="horizontal">
  <FieldLabel htmlFor="remember">Remember me</FieldLabel>
  <Switch id="remember" />
</Field>

// Responsive - automatic column layouts
<FieldGroup className="@container/field-group">
  <Field orientation="responsive">
    <FieldLabel htmlFor="name">Name</FieldLabel>
    <Input id="name" />
  </Field>
</FieldGroup>
```

### Validation with FieldError

```typescript
// Single error
<FieldError>Enter a valid email address.</FieldError>

// Multiple errors from React Hook Form
<FieldError errors={[form.formState.errors.email]} />

// With data-invalid for styling
<Field data-invalid={!!form.formState.errors.email}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" aria-invalid={!!form.formState.errors.email} />
  <FieldError errors={[form.formState.errors.email]} />
</Field>
```

### Zod Schema Pattern

```typescript
// src/models/schemas/form.ts
import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
```

---

## React Hooks Patterns

### useState Pattern

```typescript
// ✅ GOOD: Descriptive state names
const [loading, setLoading] = React.useState(false);
const [selectedTab, setSelectedTab] = React.useState("daily");

// ❌ BAD: Vague state names
const [state, setState] = React.useState(false);
```

### useCallback Pattern

Use `useCallback` for event handlers passed to child components:

```typescript
const handleClick = React.useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### useMemo Pattern

Use `useMemo` for expensive computations:

```typescript
const computedValue = React.useMemo(() => {
  // Expensive computation
  return expensiveCalculation(data);
}, [data]);
```

### useEffect Pattern

Always include cleanup for subscriptions and event listeners:

```typescript
React.useEffect(() => {
  const subscription = subscribe();
  return () => {
    subscription.unsubscribe();
  };
}, [dependencies]);
```

---

## Error Handling & Loading States

### Toast Notifications Pattern

Always use `toast.promise` for async operations:

```typescript
import { toast } from "sonner";

const operationPromise = asyncOperation()
  .then((result) => {
    if (result.error) {
      throw new Error(result.error.message || "Operation failed");
    }
    return result;
  })
  .catch((error) => {
    throw error;
  })
  .finally(() => {
    setLoading(false);
  });

toast.promise(operationPromise, {
  loading: translation?.generic.loading || "Loading...",
  success: () => translation?.success.operationSuccess || "Success!",
  error: (error: Error | string) => {
    const errorMessage = typeof error === "string" ? error : error.message;
    return translation?.errors.operationFailed || errorMessage;
  },
});
```

### Loading State Pattern

```typescript
const [loading, setLoading] = React.useState(false);

// In async function
setLoading(true);
try {
  await asyncOperation();
} finally {
  setLoading(false);
}

// In JSX
<Button disabled={loading}>
  {loading ? translation?.generic.loading : "Submit"}
</Button>
```

### Error Handling Rules

1. **Always handle errors**: Use try/catch or .catch() for async operations
2. **User-friendly messages**: Use translation keys for error messages
3. **Toast notifications**: Use `toast.promise` for async operations
4. **Loading states**: Always provide visual feedback during operations
5. **Error boundaries**: Consider error boundaries for component-level error handling

---

## Server Actions & API Routes

### Server Actions Pattern

```typescript
// src/server/actions.ts
"use server";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

export const requireAuth = cache(async () => {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
});
```

### Server Action Rules

1. **Always use `"use server"`** directive at the top of server action files
2. **Use `cache`** from React for functions that can be cached
3. **Use `headers()`** from Next.js for accessing request headers
4. **Type safety**: Always type return values and parameters
5. **Error handling**: Handle errors gracefully and return appropriate responses

### API Routes Pattern

```typescript
// src/app/api/endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process request
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

### API Route Rules

1. **Always handle errors**: Use try/catch blocks
2. **Type safety**: Validate request body with Zod schemas
3. **HTTP status codes**: Use appropriate status codes (200, 400, 401, 500, etc.)
4. **Response format**: Consistent JSON response format
5. **Authentication**: Verify authentication for protected routes

---

## Best Practices

### Component Development

1. **Start with interface**: Define props interface first
2. **Use composition**: Compose smaller components
3. **Keep components focused**: One responsibility per component
4. **Reuse generic components**: Use `components/container/generic/` when possible
5. **Test independently**: Each component should work standalone

### Data Handling

1. **Mock data**: Place in `src/models/mocks/`
2. **Type safety**: All data structures must be typed
3. **Validation**: Use Zod schemas for runtime validation
4. **Formatting**: Use `Intl.NumberFormat` for locale-aware formatting

### Internationalization

1. **All text in locale files**: Never hardcode user-facing text
2. **Use translation prop**: Pass `translation` to components
3. **Locale-aware formatting**: Use `Intl` APIs for dates/numbers
4. **Translation keys**: Use nested keys for organization (e.g., `translation?.common.email`)
5. **Fallback values**: Always provide fallback strings for missing translations

---

## Examples

### Complete Component Example

See existing components for reference:

- `src/components/container/generic/chart/churn-rate.tsx`
- `src/components/container/generic/table/recent-invoices.tsx`
- `src/components/container/generic/product-performance.tsx`

### Interface Example

See existing interfaces for reference:

- `src/models/interfaces/components/generic/chart/churn-rate.ts`
- `src/models/interfaces/components/generic/table/recent-invoices.ts`

---

## Version History

- **1.0.0** (2024-12-30): Initial code standards document

---

**Note**: This document should be updated as the project evolves. All team members should follow these standards to maintain code consistency and quality.
