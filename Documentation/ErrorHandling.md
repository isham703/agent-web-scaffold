# Error Handling

## Error Type Hierarchy

```typescript
// Base error — all custom errors extend this
AppError
  ├── ApiError          // HTTP errors from API calls (status, body, endpoint)
  ├── NetworkError      // Fetch failures, timeouts, offline
  ├── AuthError         // Auth-specific (expired, invalid, unauthorized)
  ├── ValidationError   // Form/input validation failures
  └── ContentError      // Content loading/parsing failures
```

## Error Handling Patterns

### Services
- Services throw typed errors (e.g., `AuthError`, `ApiError`)
- Never catch-and-swallow — always rethrow or transform
- Include context: endpoint, status code, original error

### Hooks
- Hooks catch service errors and expose via `{ error, isError }` state
- Map service errors to user-facing messages at the hook level
- Provide `retry()` function when the operation is retryable

### Components
- Components read error state from hooks
- Display errors via toast, inline message, or error boundary
- Never try/catch in render — use error boundaries for unexpected errors

### API Client
- Retries: 3 attempts with exponential backoff for 5xx and network errors
- No retry for 4xx (client errors are not transient)
- Timeout: 30s default, configurable per request

## Error Boundary Strategy

| Scope | Boundary | Fallback |
|-------|----------|----------|
| App root | `AppErrorBoundary` | "Something went wrong" + reload button |
| Feature route | `FeatureErrorBoundary` | Feature-specific error UI + retry |
| Component | `ComponentErrorBoundary` | Graceful degradation (hide component) |
