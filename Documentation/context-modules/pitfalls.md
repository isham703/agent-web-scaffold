# Pitfalls and Gotchas

Known issues that agents (and developers) hit repeatedly. Organized by category.

## React / Component Patterns

### Stale closure in useEffect / event handlers
- **Symptom:** Handler reads old state value, UI doesn't reflect latest state
- **Root cause:** Closure captured stale variable; deps array missing the value
- **Correct pattern:** Include the value in deps, or use `useRef` for mutable latest-value
- **Example:** `src/core/hooks/useDebounce.ts`

### Unnecessary re-renders from object/array props
- **Symptom:** Child component re-renders on every parent render despite same data
- **Root cause:** New object/array reference created each render (`filter()`, `map()`, `{}`)
- **Correct pattern:** `useMemo` for derived data, stable references for callbacks via `useCallback`

### Conditional hook calls
- **Symptom:** "Rendered more hooks than during the previous render"
- **Root cause:** Hook called inside `if`, loop, or early return
- **Correct pattern:** Hooks must be called unconditionally at the top level. Move the condition inside the hook or after all hook calls.

## Async / Data Fetching

### Race condition on rapid navigation
- **Symptom:** Stale data appears after navigating away and back quickly
- **Root cause:** Previous fetch resolves after new one, overwrites newer state
- **Correct pattern:** AbortController cleanup in useEffect, or check component mounted

### Missing error handling on fire-and-forget
- **Symptom:** Unhandled promise rejection warning, silent failures
- **Root cause:** `async` function called without `.catch()` or `try/catch`
- **Correct pattern:** Always handle errors, even for "background" operations. Use `.catch(console.error)` as minimum.

## TypeScript

### Type assertion masking real errors
- **Symptom:** Runtime crash on property access that TypeScript didn't catch
- **Root cause:** `as` assertion told TypeScript to trust the shape
- **Correct pattern:** Use type guards (`if ('field' in obj)`) or `zod` for runtime validation at boundaries

### Implicit `any` from untyped libraries
- **Symptom:** No type errors but runtime crashes
- **Root cause:** Library missing `@types/*` package, everything inferred as `any`
- **Correct pattern:** Install `@types/*` or add a minimal `.d.ts` declaration

## Build / Vite

### Environment variable not available in client
- **Symptom:** `undefined` when reading `process.env.X` or `import.meta.env.X`
- **Root cause:** Vite only exposes env vars prefixed with `VITE_`
- **Correct pattern:** Use `VITE_` prefix for client-side vars. Server-only secrets stay unprefixed.

### HMR not updating after file move/rename
- **Symptom:** Old version of component still renders after rename
- **Root cause:** Vite's module graph has stale entry
- **Correct pattern:** Restart dev server (`ctrl+c`, `npm run dev`)
