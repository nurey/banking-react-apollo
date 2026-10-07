# CSS Build Pipeline: Vite + Tailwind CSS + Flowbite React

This document describes how Vite, Tailwind CSS v4, and Flowbite React are configured and how they interact during development and production builds.

## Architecture Overview

```
                    ┌───────────────────────┐
                    │        Vite v8        │
                    │   (Rolldown + Oxc)    │
                    └───────────┬───────────┘
                                │ plugins: [...]
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ @tailwindcss/vite │ │ @vitejs/          │ │ flowbite-react/   │
│  (CSS pipeline)   │ │ plugin-react      │ │ plugin/vite       │
└─────────┬─────────┘ └───────────────────┘ └─────────┬─────────┘
          │ runs tailwindcss v4 on                    │ scans src/ for flowbite-react
          ▼                                           │ imports, writes
┌─────────────────────────────────────────┐           ▼
│ src/styles/index.css                    │ ┌───────────────────────────────┐
│                                         │ │ .flowbite-react/              │
│ @import "tailwindcss"                   │ │   class-list.json (generated) │
│ @import "flowbite-react/plugin/         │ │   config.json                 │
│          tailwindcss" ── flowbite theme │ │   init.jsx (ThemeInit)        │
│ @source "…/class-list.json" ◄───────────┼─┤                               │
│ @config "../../tailwind.config.cjs" ──┐ │ └───────────────────────────────┘
└───────────────────────────────────────┼─┘
                                        ▼
                         ┌──────────────────────────────┐
                         │ tailwind.config.cjs          │
                         │  theme.extend: ledger colors,│
                         │  fonts, keyframes            │
                         │  darkMode: 'class'           │
                         └──────────────────────────────┘
```

## Build-Time Data Flow

1. At the start of every build (and when the dev server starts), the **flowbite-react Vite plugin** scans `src/` for components imported from `flowbite-react` and writes the Tailwind classes those components use to `.flowbite-react/class-list.json`. In dev it keeps watching, so importing a new component updates the list.
2. **`@tailwindcss/vite`** processes `src/styles/index.css`. Tailwind scans `src/` automatically, plus `class-list.json` via `@source`, and generates CSS only for the classes it finds. It never scans `node_modules/flowbite-react/` itself, so unused components add no CSS.
3. `@import "flowbite-react/plugin/tailwindcss"` adds Flowbite's theme (its color palette, including `primary`), and `@config` loads the project's own theme from `tailwind.config.cjs`.
4. Vite bundles the output CSS and JS into `dist/` using Rolldown and minifies JS with Oxc.

## Key Files

### `vite.config.js`

```js
plugins: [
  tailwindcss(),
  react(),
  !process.env.VITEST && flowbiteReact(),
],
resolve: {
  alias: { 'tailwind-merge-v2': 'tailwind-merge-v3' },
},
```

- **`flowbiteReact()` is skipped under Vitest.** Its dev hook starts a project-wide file watcher that never closes, which keeps Vitest from exiting. Tests don't need the class list.
- **The `tailwind-merge-v2` alias** removes a dead dependency. flowbite-react bundles tailwind-merge v2 (for Tailwind 3) alongside v3 and only uses v2 when its version is set to 3. Aliasing v2 to v3 saves about 20 kB of JS.

### `src/styles/index.css`

| Directive | Purpose |
|---|---|
| `@import "tailwindcss"` | Tailwind's base reset, components and utilities |
| `@import "flowbite-react/plugin/tailwindcss"` | Flowbite's theme: its color palette and `primary` color |
| `@source "../../.flowbite-react/class-list.json"` | Classes used by the flowbite-react components the app imports |
| `@config "../../tailwind.config.cjs"` | The project's theme (Tailwind v4 doesn't auto-detect JS config files) |

The flowbite-react plugin added the first `@import` and the `@source` line, and checks for them on each build; it leaves the file alone once they're present. Custom CSS (`:root` variables, body styles, scrollbar overrides) follows the directives.

### `.flowbite-react/`

| File | Tracked | Purpose |
|---|---|---|
| `config.json` | yes | Plugin settings: Tailwind `version: 4`, `dark: true`, `tsx: false` (so it generates `init.jsx`) |
| `init.jsx` | yes | Generated from `config.json`; exports `ThemeInit`, rendered in `src/index.jsx` to pass those settings to flowbite-react at runtime |
| `class-list.json` | no | Regenerated on every build, including inside the Docker build |

Edit `config.json`, not `init.jsx`; the plugin rewrites `init.jsx` to match.

### `tailwind.config.cjs`

A v3-style JS config loaded through `@config`.

| Section | What it configures |
|---|---|
| `darkMode: 'class'` | Dark mode toggled by a `dark` class on `<html>`, which flowbite-react's `dark:` variants rely on |
| `content` | `src/` only; flowbite-react's classes come from `class-list.json` |
| `theme.extend.colors.ledger` | Custom color palette for the app's dark theme |
| `theme.extend.fontFamily` | DM Sans (body) and JetBrains Mono (financial figures) |
| `theme.extend.keyframes` / `animation` | `fade-slide-in` for transaction rows, `expand-down` for edit panels |

## Overriding Flowbite Styles

flowbite-react components have their own default styles. This project overrides them with the ledger theme using Tailwind's `!important` modifier (suffix syntax):

```jsx
<TableHeadCell className="bg-ledger-surface! text-ledger-text-secondary!">
```

The `!` at the end of a utility class compiles to `!important`, so the custom style wins over Flowbite's defaults.

Anything not overridden uses Flowbite's palette. For example, the active tab label uses Flowbite's `primary` blue (`text-primary-600 dark:text-primary-500`).
