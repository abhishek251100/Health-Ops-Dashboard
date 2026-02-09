## UI + Tailwind + components (simple)

### What is Tailwind
Tailwind is a utility CSS framework.
Instead of writing CSS files, you use classes in the JSX.

Example:
```tsx
<div className="flex items-center gap-2 rounded-md border p-4">
  <p className="text-sm text-muted-foreground">Hello</p>
</div>
```

### Shadcn UI
We use small, reusable components:
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/table.tsx`

These are just React components with Tailwind classes.

### Why this is professional
Real teams build design systems like this.
You can move fast and keep the look consistent.

### Common Tailwind classes (learn these)
- `flex`, `grid`: layout
- `gap-4`: spacing between items
- `p-4`, `px-6`, `py-2`: padding
- `text-sm`, `text-xl`: font size
- `bg-background`, `text-muted-foreground`: theme colors
- `rounded-md`, `border`, `shadow-sm`: surface styling

### Practice tasks
- Create a new Card with custom text in any page.
- Add `hover:bg-muted` to a button.

### Reference docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/docs
