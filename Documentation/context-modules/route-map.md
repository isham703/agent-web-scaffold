# Route Map

Page/route inventory for agent navigation. Update when adding or moving routes.

## Routes

| Path | Component | Guard | Layout | Lazy |
|------|-----------|-------|--------|------|
| `/` | `HomePage` | none | `MainLayout` | yes |
| `/login` | `LoginPage` | `GuestOnly` | `AuthLayout` | yes |
| `/register` | `RegisterPage` | `GuestOnly` | `AuthLayout` | yes |
| `/dashboard` | `DashboardPage` | `AuthGuard` | `MainLayout` | yes |
| `/settings` | `SettingsPage` | `AuthGuard` | `MainLayout` | yes |
| `*` | `NotFoundPage` | none | `MinimalLayout` | no |

## Layouts

| Layout | Purpose | Includes |
|--------|---------|----------|
| `MainLayout` | Authenticated pages | Header, sidebar, footer |
| `AuthLayout` | Login/register pages | Centered card, no nav |
| `MinimalLayout` | Error pages | Logo only |

## Guards

| Guard | Logic | Redirect |
|-------|-------|----------|
| `AuthGuard` | Requires valid session | `/login` |
| `GuestOnly` | Rejects authenticated users | `/dashboard` |

## Adding a New Route

1. Create page component in `src/features/{feature}/pages/`
2. Add route entry in `src/App.tsx`
3. Update this document
4. If guarded, wrap with appropriate guard component
