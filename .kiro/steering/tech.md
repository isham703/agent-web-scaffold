---
inclusion: always
---

# Technology Stack

## Frontend
- **Framework:** React 19
- **Build Tool:** Vite 6
- **Language:** TypeScript 5.6+ (strict mode)
- **Routing:** React Router 7
- **Styling:** CSS Modules (upgrade path: Tailwind)

## State Management
- **Local state:** React useState/useReducer
- **Shared state:** React Context + custom hooks
- **Upgrade path:** Zustand for complex state

## API & Data
- **HTTP Client:** Custom ApiClient wrapping fetch
- **Auth:** JWT (access + refresh tokens)
- **API Style:** RESTful JSON

## Testing
- **Unit:** Vitest + React Testing Library
- **E2E:** Playwright (when needed)
- **Coverage:** Vitest built-in

## Dev Tools
- **Linting:** ESLint 9 (flat config) with eslint-plugin-jsdoc
- **Formatting:** Prettier
- **CI:** GitHub Actions

## Technical Constraints
- No `any` types — use `unknown` + type guards at boundaries
- No barrel files (`index.ts` re-exports) — direct imports only
- Features import from `core/` but never from other features
- All API calls go through ApiClient — no direct `fetch()` in components
