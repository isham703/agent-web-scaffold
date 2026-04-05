# Golden Path: Auth Login Flow

Step-by-step trace of a successful email/password login.

## Steps

1. **User submits login form**
   - `LoginForm.tsx` calls `useAuth().login(email, password)`

2. **useAuth hook delegates to AuthService**
   - `useAuth.ts` sets `isLoading: true`
   - Calls `AuthService.login(email, password)`

3. **AuthService calls API**
   - `auth.service.ts` calls `ApiClient.post('/api/auth/login', { email, password })`
   - Returns `{ accessToken, refreshToken, user }`

4. **Tokens are stored**
   - `AuthService` calls `TokenManager.setTokens(accessToken, refreshToken)`
   - `TokenManager` stores in memory + `SessionStore.persist()`
   - `SessionStore` writes to localStorage

5. **Auth state updates**
   - `AuthService.login()` resolves with `user`
   - `useAuth` sets `user` in `AuthContext`
   - `isLoading: false`, `isAuthenticated: true`

6. **Router redirects**
   - `LoginPage` reads `isAuthenticated` from `useAuth()`
   - Redirects to `/dashboard` (or stored return URL)

## Error Paths

| Error | Where caught | User sees |
|-------|-------------|-----------|
| Invalid credentials (401) | `useAuth` | "Invalid email or password" inline |
| Rate limited (429) | `useAuth` | "Too many attempts, try again in X minutes" |
| Network error | `useAuth` | "Unable to connect. Check your connection." |
| Server error (5xx) | `useAuth` | "Something went wrong. Please try again." |

## Key Files

- `src/features/auth/components/LoginForm.tsx`
- `src/features/auth/hooks/useAuth.ts`
- `src/core/services/auth.service.ts`
- `src/core/services/api-client.ts`
- `src/core/services/token-manager.ts`
- `src/core/services/session-store.ts`
