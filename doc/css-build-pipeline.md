# CSS Build Pipeline: Vite + Tailwind CSS + Flowbite

This document describes how Vite, Tailwind CSS v4, and Flowbite are configured and how they interact during development and production builds.

## Architecture Overview

```
                         ┌──────────────────────┐
                         │        Vite           │
                         │    (build tool)       │
                         └──────┬───────────────┘
                                │ plugins: [...]
                    ┌───────────┴───────────┐
                    ▼                       ▼
         ┌─────────────────┐      ┌────────────────┐
         │ @tailwindcss/vite│      │ @vitejs/       │
         │  (CSS pipeline)  │      │ plugin-react   │
         └────────┬────────┘      └────────────────┘
                  │ depends on
                  ▼
         ┌─────────────────┐
         │ tailwindcss v4   │
         │   (core engine)  │
         └────────┬────────┘
                  │ reads
                  ▼
     ┌────────────────────────┐
     │  src/styles/index.css   │
     │                         │
     │  @import "tailwindcss"  │─── loads base, components, utilities
     │  @config "../../tw..."  │─┐
     │  @source "…/flowbite"   │─┤
     │  @source "…/flowbite-   │─┤
     │          react"         │ │
     └─────────────────────────┘ │
                                 │
          ┌──────────────────────┘
          │ @config loads
          ▼
  ┌──────────────────────┐
  │ tailwind.config.cjs   │
  │                       │
  │  theme.extend: {      │─── custom colors, fonts, keyframes
  │    colors.ledger…     │
  │  }                    │
  │  darkMode: 'class'    │
  │  plugins: [           │
  │    flowbite/plugin ───┤
  │  ]                    │
  └───────────────────────┘
                          │
                          │ registers base styles,
                          │ dark mode variants
                          ▼
               ┌────────────────────┐
               │   flowbite v4.0.1   │
               │  (vanilla JS + CSS) │
               └────────┬───────────┘
                        │ wrapped by
                        ▼
               ┌────────────────────┐
               │ flowbite-react      │
               │  v0.12.17           │
               │                     │
               │  Navbar, Table,     │
               │  Badge, Spinner,    │
               │  TextInput…         │
               └────────┬───────────┘
                        │ used in
                        ▼
               ┌────────────────────┐
               │   src/**/*.jsx      │
               │  (React components) │
               └────────────────────┘
```

## Build-Time Data Flow

1. **Vite** invokes `@tailwindcss/vite` when it encounters a CSS import.
2. Tailwind reads `src/styles/index.css` and follows the `@config` directive to load the JS config and the Flowbite plugin.
3. The `@source` directives tell Tailwind's scanner to also look inside `node_modules/flowbite/` and `node_modules/flowbite-react/` for utility class usage. Tailwind auto-scans `src/` but skips `node_modules/` by default.
4. Tailwind generates CSS only for classes actually used across all scanned files.
5. Vite bundles the output CSS and JS into `dist/`.

## Key Files

### `vite.config.js`

Registers both the Tailwind and React plugins. `@tailwindcss/vite` replaces the older PostCSS-based setup and handles CSS processing and vendor prefixing in a single pass.

```js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: { port: 3000 },
});
```

### `src/styles/index.css`

The CSS entry point. The directives at the top wire everything together:

| Directive | Purpose |
|---|---|
| `@import "tailwindcss"` | Loads Tailwind's base reset, component layer, and utility layer |
| `@config "../../tailwind.config.cjs"` | Points to the JS config for theme customization and plugins (v4 no longer auto-detects JS config files) |
| `@source "../../node_modules/flowbite/**/*.js"` | Tells the class scanner to include Flowbite's JS so its utility classes are generated |
| `@source "../../node_modules/flowbite-react/**/*.js"` | Same for Flowbite React components |

Custom CSS (`:root` variables, body styles, scrollbar overrides) follows below these directives.

### `tailwind.config.cjs`

A standard v3-style JS config loaded through the `@config` bridge. Tailwind v4 maintains backward compatibility with this format.

| Section | What it configures |
|---|---|
| `darkMode: 'class'` | Dark mode toggled by a `dark` class on `<html>`, required by Flowbite's internal `dark:` variants |
| `content` | Source paths for class scanning (supplemented by `@source` in CSS) |
| `theme.extend.colors.ledger` | Custom color palette for the app's dark theme |
| `theme.extend.fontFamily` | DM Sans (body) and JetBrains Mono (financial figures) |
| `theme.extend.keyframes` / `animation` | `fade-slide-in` for transaction rows, `expand-down` for edit panels |
| `plugins: [flowbite/plugin]` | Registers Flowbite's base styles, dark mode support, and component classes |

## How Flowbite Integrates

Flowbite connects at two levels:

1. **Tailwind plugin** (`flowbite/plugin`) -- registered in `tailwind.config.cjs`, it extends Tailwind with Flowbite's base styles and dark mode component variants. This runs at build time during CSS generation.

2. **React components** (`flowbite-react`) -- provides pre-built React components (`Navbar`, `Table`, `Badge`, `Spinner`, `TextInput`, `Button`, etc.) that use Tailwind utility classes internally. The `@source` directive in `index.css` ensures Tailwind's scanner sees the classes these components use, so the corresponding CSS is generated.

### Overriding Flowbite Styles

Flowbite components have their own default styles. This project overrides them with the custom ledger theme using Tailwind's `!important` modifier (suffix syntax):

```jsx
<TableHeadCell className="bg-ledger-surface! text-ledger-text-secondary!">
```

The `!` at the end of a utility class compiles to `!important`, ensuring the custom style takes precedence over Flowbite's defaults.
