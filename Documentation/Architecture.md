# Architecture

## Stack

- **UI:** React 19 + TypeScript
- **Build:** Vite 6
- **Routing:** React Router 7
- **State:** React Context + hooks (upgrade path: Zustand)
- **Styling:** CSS Modules (upgrade path: Tailwind)
- **API:** Fetch + custom service layer
- **Testing:** Vitest + React Testing Library

## Directory Structure

```
src/
  core/                    # Shared across all features
    services/              # API clients, business logic
    models/                # TypeScript types and interfaces
    hooks/                 # Shared React hooks
    utils/                 # Pure utility functions
    components/            # Shared UI components
  features/                # Feature modules (self-contained)
    auth/
      components/          # Feature-specific UI
      hooks/               # Feature-specific hooks
      models/              # Feature-specific types
      services/            # Feature-specific API calls
      __tests__/           # Feature tests
    dashboard/
    settings/
  App.tsx                  # Root component + router
  main.tsx                 # Entry point
```

## Conventions

- **Feature isolation:** Features import from `core/` but never from other features
- **Service layer:** All API calls go through service classes, never called directly from components
- **Hook pattern:** Business logic lives in hooks, components are thin render layers
- **Error boundaries:** Each feature has its own error boundary wrapping the route
- **Lazy loading:** Feature routes are lazy-loaded via `React.lazy()`
