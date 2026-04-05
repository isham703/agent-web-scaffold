---
inclusion: auto
name: pitfalls
description: Known gotchas and common mistakes in the codebase. Load when debugging, fixing bugs, or writing new code to avoid known pitfalls.
---

# Pitfalls

See `Documentation/context-modules/pitfalls.md` for the full list of known gotchas organized by category (React, Async, TypeScript, Build).

Key ones to remember:

- **Stale closures:** Include values in useEffect/useCallback deps, or use useRef
- **Race conditions:** Use AbortController cleanup in useEffect for async operations
- **Conditional hooks:** Never call hooks inside if/loop/early return
- **Vite env vars:** Must use `VITE_` prefix for client-side access
- **Type assertions:** Prefer type guards over `as` casts at boundaries
