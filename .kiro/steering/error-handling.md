---
inclusion: auto
name: error-handling
description: Error handling patterns and error type hierarchy. Load when implementing error handling, creating services, or debugging error flows.
---

# Error Handling

See `Documentation/ErrorHandling.md` for the full error type hierarchy and patterns.

Key rules:

- **Services** throw typed errors (AuthError, ApiError, etc.)
- **Hooks** catch service errors and expose via `{ error, isError }` state
- **Components** read error state from hooks — never try/catch in render
- **ApiClient** retries 3x for 5xx/network errors, never retries 4xx
- **Error boundaries** at app root, feature route, and component level
