# Agent Instructions

Cross-IDE agent instructions for AI coding tools (Kiro, Claude Code, Cursor, Copilot).

## Stack

React 18 + JavaScript (JSX) + Vite + Cloudscape Design System v3. No TypeScript. No Tailwind.

## Key Rules

### Cloudscape First
All UI must use Cloudscape components. No custom HTML elements for things Cloudscape provides (buttons, tables, forms, modals, alerts). See `.kiro/steering/design-system.md` for full rules.

### Design Tokens
All spacing, colors, and typography must come from `src/styles/tokens.js`. Never hardcode pixel values, hex colors, or font sizes. See `.kiro/steering/design-system.md`.

### Hash-Based Routing
Courtyard pages use `activeHref` state, not react-router-dom. Do not use `useNavigate` or `<Link>` in courtyard code.

### Doc Comments
Add JSDoc (`/** */`) comments to functions, components, and data shapes. This improves agent navigation — agents need fewer tool calls when code is self-describing.

### Currency Formatting
Always use `fmt()` for currency display. Never `toFixed()` or template strings.

## Where Things Live

| What | Where |
|------|-------|
| Console components | `src/components/` |
| Courtyard pages | `src/courtyard/pages/` |
| Courtyard components | `src/courtyard/components/` |
| Full-page flows | `src/flows/` |
| Context providers | `src/contexts/` |
| Shared hooks | `src/hooks/` |
| Static data | `src/data/`, `src/courtyard/data/` |
| Design tokens | `src/styles/tokens.js` |
| Utilities | `src/utils/`, `src/shared/` |
| Services | `src/services/` |

## Context for Deeper Work

| Topic | File |
|-------|------|
| Pitfalls/gotchas | `context-modules/pitfalls.md` |
| Route map | `context-modules/route-map.md` |
| Data layer | `context-modules/data-layer.md` |
| Component index | `context-modules/component-index.md` |

## Quality Gate

Run `node scripts/health-check.js` before marking tasks complete.
