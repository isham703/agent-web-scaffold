# Data Layer

How data flows through the application — API calls, caching, and state management.

## Data Flow

```
Component -> Hook -> Service -> ApiClient -> Backend API
                                    |
                              TokenManager (auth headers)
```

- **Components** call hooks, never services directly
- **Hooks** manage loading/error/data state, call services
- **Services** contain business logic, call ApiClient
- **ApiClient** handles HTTP, auth headers, retries, error normalization

## State Management

| State Type | Where it Lives | Example |
|------------|---------------|---------|
| Server state | Hook (fetch + cache) | User profile, content lists |
| UI state | Component `useState` | Modal open, form input |
| Auth state | Context (`AuthProvider`) | Current user, session |
| Form state | Hook (`useForm`) | Validation, dirty tracking |

## Caching Strategy

Currently: no client-side cache beyond React state. When data is needed:
1. Hook fetches on mount
2. Data lives in hook state for component lifetime
3. Re-fetches on remount

**Upgrade path:** Add React Query or SWR for:
- Automatic background refetch
- Cache invalidation on mutation
- Optimistic updates
- Deduplication of parallel requests

## API Conventions

| Method | Use for | Body | Response |
|--------|---------|------|----------|
| GET | Read/list | none | `{ data: T }` |
| POST | Create | JSON | `{ data: T }` |
| PUT | Full update | JSON | `{ data: T }` |
| PATCH | Partial update | JSON | `{ data: T }` |
| DELETE | Remove | none | `{ success: true }` |

All responses include `{ error?: { code, message } }` on failure.
