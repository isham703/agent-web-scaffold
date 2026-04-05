# Service Dependency Map

Machine-readable dependency graph for agent consumption.

## AuthService
- path: `src/core/services/auth.service.ts`
- depends_on: [ApiClient, SessionStore, TokenManager]
- depended_on_by: [AuthGuard, useAuth, ProfileService]
- api_routes: [POST /api/auth/login, POST /api/auth/register, POST /api/auth/refresh, DELETE /api/auth/session]
- error_types: [AuthError]

## ApiClient
- path: `src/core/services/api-client.ts`
- depends_on: [TokenManager]
- depended_on_by: [AuthService, UserService, ContentService]
- description: Base HTTP client with auth headers, retry logic, and error normalization
- error_types: [ApiError, NetworkError]

## SessionStore
- path: `src/core/services/session-store.ts`
- depends_on: []
- depended_on_by: [AuthService, AuthGuard]
- description: Manages session token persistence (localStorage + memory cache)

## TokenManager
- path: `src/core/services/token-manager.ts`
- depends_on: []
- depended_on_by: [ApiClient, AuthService]
- description: JWT decode, expiry check, refresh orchestration

<!-- Add new services following this format:
## ServiceName
- path: `src/...`
- depends_on: [...]
- depended_on_by: [...]
- api_routes: [...] (if applicable)
- error_types: [...] (if applicable)
- description: One-line purpose
-->
