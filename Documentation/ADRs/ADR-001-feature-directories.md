# ADR-001: Feature-Based Directory Structure

## Status
Accepted

## Context
Need a directory structure that:
- Allows agents to scope work to a single feature without reading the entire codebase
- Keeps related files (components, hooks, services, tests) co-located
- Prevents cross-feature coupling
- Supports `feature.yaml` metadata for agent tooling

## Decision
Organize `src/` into `core/` (shared) and `features/{name}/` (self-contained modules). Each feature owns its components, hooks, services, and tests. Features import from `core/` but never from other features.

## Consequences
- **Easier:** Agent scoping (feature.yaml lists all files), parallel development, feature deletion
- **Harder:** Sharing UI between features (must extract to `core/components/`)
- **Trade-off:** Some duplication between features is acceptable to maintain isolation

## Alternatives Considered
- **Flat by type** (`components/`, `hooks/`, `services/`): Rejected because agents can't scope by feature
- **Domain-driven** (nested subdomains): Overkill for current size, adds navigation depth
