---
inclusion: always
---

# Project Structure

## Directory Layout

```
src/
  core/                    # Shared across all features
    services/              # API clients, business logic (no React)
    models/                # TypeScript types and interfaces
    hooks/                 # Shared React hooks
    utils/                 # Pure utility functions
    components/            # Shared UI components
  features/                # Feature modules (self-contained)
    {feature}/
      components/          # Feature-specific UI
      hooks/               # Feature-specific hooks
      models/              # Feature-specific types
      services/            # Feature-specific API calls
      pages/               # Route-level page components
      __tests__/           # Feature tests
  App.tsx                  # Root component + router
  main.tsx                 # Entry point
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `LoginForm.tsx` |
| Hooks | camelCase, `use` prefix | `useAuth.ts` |
| Services | camelCase, `.service` suffix | `auth.service.ts` |
| Models/Types | camelCase, `.model` suffix | `user.model.ts` |
| Utils | camelCase, `.util` suffix | `date.util.ts` |
| Tests | match source, `.test` suffix | `auth.service.test.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |

## Import Rules

- Use path aliases: `@/core/services/auth.service`
- Features import from `@/core/` only — never cross-feature imports
- Prefer named exports over default exports
- No barrel files — import directly from source file

## Architecture Rules

- **Services** are plain TypeScript classes/modules — no React dependency
- **Hooks** wrap services for React integration
- **Components** are thin render layers — logic lives in hooks
- **Pages** compose components and hooks for a route
- Each feature owns its components, hooks, services, and tests
