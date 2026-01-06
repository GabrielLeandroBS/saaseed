# ADR-008: State Management

## Status

Accepted (Updated)

## Context

The project needs:

- Server state management (API calls)
- Data caching
- Global UI state (modals, sidebars)
- User preference persistence
- Local component state

## Decision

We adopted a hybrid approach:

- **React Query (TanStack Query)**: For server state (API calls, cache)
- **Zustand**: For global client state (UI, preferences)
- **React useState/useReducer**: For local component state
- **localStorage persistence**: Via Zustand persist middleware

### Why Zustand?

Zustand was chosen because it is:

1. **Simple**: Minimalist API, no boilerplate
2. **Small**: ~1KB gzipped
3. **Flexible**: Middlewares for devtools, persist, etc.
4. **TypeScript-first**: Excellent typing
5. **React 18+**: Support for concurrent features

## Alternatives Considered

### Redux Toolkit

- **Pros**: Very popular, excellent DevTools, predictable
- **Cons**: Boilerplate, overkill for MVP, larger bundle size

### Jotai

- **Pros**: Atomic, simple, good for React
- **Cons**: Different paradigm (atoms), learning curve

### Recoil

- **Pros**: Facebook, atoms, selectors
- **Cons**: Experimental, bundle size, less active

### Valtio

- **Pros**: Proxy-based, very simple
- **Cons**: Less popular, fewer middlewares

## Consequences

### Positive

1. **Simplicity**: Intuitive and minimalist API
2. **Performance**: Granular subscriptions, minimal re-renders
3. **DevTools**: Integration with Redux DevTools
4. **Persistence**: Easy localStorage with middleware
5. **Bundle size**: Very small (~1KB)
6. **TypeScript**: Excellent typing out-of-the-box

### Negative

1. **Less structure**: Can be too flexible for large teams
2. **Less popular**: Smaller community than Redux

## Implementation

### Store Structure

```
src/stores/
├── index.ts          # Central export
├── ui-store.ts       # UI state (modals, loading)
└── user-store.ts     # User preferences (persisted)
```

### UI Store

Manages global UI state (not persisted):

```typescript
// src/stores/ui-store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  isCommandDialogOpen: boolean;
  openCommandDialog: () => void;
  closeCommandDialog: () => void;
  toggleCommandDialog: () => void;
  // ...
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isCommandDialogOpen: false,
      openCommandDialog: () => set({ isCommandDialogOpen: true }),
      closeCommandDialog: () => set({ isCommandDialogOpen: false }),
      toggleCommandDialog: () =>
        set((state) => ({ isCommandDialogOpen: !state.isCommandDialogOpen })),
    }),
    { name: "ui-store" }
  )
);
```

### User Store (Persisted)

Manages user preferences with localStorage:

```typescript
// src/stores/user-store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserPreferencesState {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  isSidebarCollapsed: boolean;
  // ...
}

export const useUserStore = create<UserPreferencesState>()(
  devtools(
    persist(
      (set) => ({
        locale: "pt",
        setLocale: (locale) => set({ locale }),
        // ...
      }),
      {
        name: "user-preferences",
        partialize: (state) => ({
          locale: state.locale,
          isSidebarCollapsed: state.isSidebarCollapsed,
        }),
      }
    ),
    { name: "user-store" }
  )
);
```

### Selector Hooks

For better performance, use selector hooks:

```typescript
// Selector hook - only re-renders when isOpen changes
export const useCommandDialog = () =>
  useUIStore((state) => ({
    isOpen: state.isCommandDialogOpen,
    open: state.openCommandDialog,
    close: state.closeCommandDialog,
    toggle: state.toggleCommandDialog,
  }));
```

### Usage in Components

```typescript
// Import from index
import { useCommandDialog, useLocale } from "@/stores";

function MyComponent() {
  // UI state
  const { isOpen, open, close } = useCommandDialog();

  // User preferences (persisted)
  const { locale, setLocale } = useLocale();

  return (
    <button onClick={open}>
      Open Dialog ({locale})
    </button>
  );
}
```

### Responsibility Separation

| State Type       | Solution             | Example             | Persistence     |
| ---------------- | -------------------- | ------------------- | --------------- |
| Server State     | React Query          | Subscription data   | In-memory cache |
| UI State         | Zustand (ui-store)   | Modal open, loading | No              |
| User Preferences | Zustand (user-store) | Locale, sidebar     | localStorage    |
| Form State       | React Hook Form      | AuthForm            | No              |
| Theme            | next-themes          | Light/dark mode     | localStorage    |
| Session          | Better Auth          | useSession hook     | Cookie          |
| Local State      | useState             | Component-specific  | No              |

### Used Middlewares

1. **devtools**: Integration with Redux DevTools
2. **persist**: Persistence in localStorage (user-store)

### Best Practices

1. **Selector hooks**: Use for granular subscriptions
2. **Colocation**: Keep state close to where it's used
3. **Immutability**: Zustand uses immer internally
4. **Naming**: Prefix hooks with `use` (ex: `useCommandDialog`)
5. **Typing**: Always define interfaces for state

## References

- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
