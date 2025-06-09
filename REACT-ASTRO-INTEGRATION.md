# React-Astro Integration Guide

## Solving Context-Related Errors in Astro with React Components

This guide explains how to properly integrate React components that rely on context (like Radix UI components) within Astro templates without encountering the common `"X must be used within Y"` errors.

## Background: The Problem

When migrating from a React application to Astro, you may encounter errors like:
- `"DialogTrigger must be used within Dialog"`
- `"DialogPortal must be used within Dialog"`

These errors occur because:
1. Astro's `client:only="react"` directive creates isolated React "islands"
2. When you use this on individual components from a component library that relies on React Context (like Radix UI), each component becomes isolated from its parent context
3. The components can't communicate with each other through context, causing the errors

## Solution: Context-Aware Component Wrappers

We've implemented a solution with three levels of integration:

### 1. ReactIsland Bridge

The foundation of our solution is the `ReactIslandBridge` component that ensures proper context providers are in place:

```tsx
// src/client/src/components/ui/ReactIslandBridge.tsx
export function ReactIslandBridge({ children, defaultTheme = 'light' }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

This is wrapped by an Astro component:

```astro
<!-- src/components/ReactIsland.astro -->
<ReactIslandBridge client:only="react">
  <slot />
</ReactIslandBridge>
```

### 2. Specialized Component Wrappers

For common UI components like Dialog/Sheet and DropdownMenu, we've created special wrappers:

```astro
<!-- DialogWrapper.astro -->
<DialogBridge client:only="react">
  <Sheet>
    <SheetTrigger>
      <slot name="trigger" />
    </SheetTrigger>
    <SheetContent>
      <slot />
    </SheetContent>
  </Sheet>
</DialogBridge>
```

### 3. Comprehensive Component Wrappers

For complex UI interactions, use our SheetWrapper or DropdownMenuWrapper components:

```tsx
// SheetWrapper.tsx
export function SheetWrapper({trigger, content, ...props}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>{content}</SheetContent>
    </Sheet>
  );
}
```

## Usage Examples

### Example 1: Using a Sheet/Dialog

```astro
<DialogWrapper>
  <Button slot="trigger">Open Sheet</Button>
  <div>
    <h3>Sheet Content</h3>
    <p>This maintains proper React context.</p>
  </div>
</DialogWrapper>
```

### Example 2: Using a DropdownMenu

```astro
<DropdownWrapper>
  <Button slot="trigger">Open Dropdown</Button>
  <div>Menu content here</div>
</DropdownWrapper>
```

### Example 3: Using SheetWrapper for Complex Needs

```astro
<SheetWrapper
  trigger={<Button>Open Complex Sheet</Button>}
  title="Sheet Title"
  content={<YourContentComponent />}
  client:only="react"
/>
```

## Best Practices

1. **Single React Tree** - Always ensure related components are part of the same React tree
2. **Use Wrappers** - Use our specialized wrappers instead of individual components
3. **Only One `client:only`** - Apply `client:only="react"` only to the top-level wrapper, not to individual components
4. **Pure React Components** - For complex UIs, consider using pure React components instead of mixing Astro and React

## Troubleshooting

If you still encounter context errors:

1. Check that you're using our wrapper components, not individual Radix UI components
2. Ensure you're only using `client:only="react"` on the top-level wrapper
3. Consider converting the entire section to a pure React component

By following these guidelines, you'll be able to use Radix UI (and other context-based React libraries) within Astro without context-related errors.
