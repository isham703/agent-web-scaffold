---
inclusion: always
---

# Documentation Comments for Agent Navigation

## Why We Document

All exported functions, components, hooks, types, and constants must have TSDoc (`/** */`) comments. This is intentional — structured documentation measurably improves AI agent navigation (51% to 67% doc-guided in measured simulations). Agents that can read doc comments need fewer tool calls and make fewer mistakes.

## What to Document

### Always document (high agent value):
- Services and their methods
- Custom hooks (purpose, params, return shape)
- TypeScript interfaces and type aliases
- Exported constants and configuration
- Component props interfaces

### Document with purpose, not just structure:
```typescript
// BAD: restates the obvious
/** Gets the user. */
function getUser(id: string): Promise<User>

// GOOD: explains behavior
/** Fetches user profile by ID from the API, returning cached version if available and fresh. */
function getUser(id: string): Promise<User>
```

### Lighter documentation acceptable for:
- Thin wrapper components
- Re-exported types
- Internal helper functions (still document if logic is non-obvious)

## Enforcement

- **ESLint:** `eslint-plugin-jsdoc` rules enforce presence and correctness
- **Health gate:** `npm run health-gate` checks for doc quality
- **CI:** Lint runs on every PR

## Do NOT:
- Strip existing doc comments from code you're working in
- Add `@type` annotations (TypeScript handles types)
- Write generic descriptions ("Creates an instance", "Returns the result")
- Document private implementation details that change frequently
