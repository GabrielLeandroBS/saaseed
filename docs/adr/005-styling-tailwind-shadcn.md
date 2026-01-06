# ADR-005: Tailwind CSS + shadcn/ui for Styling

## Status

Accepted

## Context

The project needs:

- Consistent design system
- Accessible components
- Theming (light/dark mode)
- Fast developer experience
- Easy customization

## Decision

We adopted **Tailwind CSS** with **shadcn/ui** as the design system.

### Stack

- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: Radix UI components + Tailwind
- **class-variance-authority (cva)**: Variants for components
- **tailwind-merge**: Merge classes without conflicts
- **Lucide React**: Consistent icons

## Alternatives Considered

### Chakra UI

- **Pros**: Ready components, good DX, accessible
- **Cons**: Larger bundle size, less customizable

### Material UI (MUI)

- **Pros**: Very popular, many components
- **Cons**: Large bundle size, Google style, difficult to customize

### Mantine

- **Pros**: Modern, many components, good DX
- **Cons**: Less popular, specific style

### Radix UI + CSS Modules

- **Pros**: Maximum control, no Tailwind
- **Cons**: More work, less consistency

## Consequences

### Positive

1. **Customization**: Components are copied to the project
2. **Accessibility**: Radix primitives are WCAG compliant
3. **Performance**: Tree-shaking works well
4. **Theming**: CSS variables for light/dark mode
5. **DX**: Utility classes are fast to use
6. **Consistency**: Ready design system

### Negative

1. **Learning curve**: Tailwind has its own syntax
2. **Verbose HTML**: Many inline classes
3. **Maintenance**: Copied components need manual updates

## Implementation

### Structure

```
src/components/
├── ui/           # shadcn/ui components (generated)
├── containers/   # Composite components
├── features/     # Feature components
├── dynamics/     # Components with dynamic import
└── providers/    # Context providers
```

### Utility Function

```typescript
// src/lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Component Pattern

Following [Vercel Academy - shadcn/ui](https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components):

```typescript
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "compact";
}

function MyComponent({
  variant = "default",
  className,
  ...props
}: MyComponentProps) {
  return (
    <div
      className={cn(
        "base-classes",
        variant === "compact" && "compact-classes",
        className
      )}
      {...props}
    />
  );
}

MyComponent.displayName = "MyComponent";

export { MyComponent };
```

### Theming

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

### Consistency Pillars

1. **Visual**: Shared design tokens
2. **Behavioral**: Similar APIs between components
3. **Accessibility**: ARIA labels, keyboard navigation
4. **Theming**: CSS custom properties
5. **Developer Experience**: TypeScript, JSDoc, props patterns

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Vercel Academy - shadcn/ui](https://vercel.com/academy/shadcn-ui)
