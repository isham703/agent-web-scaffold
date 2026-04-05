# Service Index

Quick reference for finding the right service. For full dependency graph, see `ServiceDependencyMap.md`.

## Core Services

| Service | Path | Purpose |
|---------|------|---------|
| ApiClient | `src/core/services/api-client.ts` | Base HTTP client with auth, retry, error normalization |
| AuthService | `src/core/services/auth.service.ts` | Login, register, refresh, logout |
| SessionStore | `src/core/services/session-store.ts` | Token persistence (localStorage + memory) |
| TokenManager | `src/core/services/token-manager.ts` | JWT decode, expiry, refresh orchestration |

## Feature Services

| Service | Feature | Path | Purpose |
|---------|---------|------|---------|
| (add as features grow) | | | |

## Error Types

| Error | Thrown by | When |
|-------|----------|------|
| ApiError | ApiClient | HTTP error response (4xx, 5xx) |
| NetworkError | ApiClient | Fetch failure, timeout, offline |
| AuthError | AuthService | Expired token, invalid credentials, unauthorized |
| ValidationError | Form hooks | Input validation failure |

## Common Patterns

- **All services** are plain classes/modules — no React dependency
- **Hooks** wrap services for React integration (`useAuth` wraps `AuthService`)
- **Services** throw typed errors; hooks catch and expose error state
- **ApiClient** is the only module that calls `fetch()` directly
