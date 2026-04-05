# Web App

A React + Vite + TypeScript web application.

**Substantive sessions**: Write a decision log to `.agent/decision_logs/` when you edit files, debug, or make architectural decisions.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint (includes doc quality) |
| `npm run health` | Agent readiness scorecard |
| `npm run health-gate` | Pass/fail validation gate |
| `npm run setup-mcp` | Generate local MCP configs (run once per machine) |

## First-Time Machine Setup

If `.mcp.json` does not exist, run: `npm run setup-mcp`. This detects installed tools and generates local MCP configs for Claude Code and Kiro. Generated files are **gitignored** — they contain machine-specific paths and must never be committed.

## Architecture

React + Vite + TypeScript. Feature-based directory structure under `src/features/`. Shared services and models under `src/core/`. See [Architecture.md](Documentation/Architecture.md) for details.

## Doc Comments for Agent Navigation

**All exported functions, components, hooks, types, and constants must have TSDoc (`/** */`) comments.** This is intentional — structured documentation measurably improves AI agent navigation (51% to 67% doc-guided in measured simulations). Enforced by `eslint-plugin-jsdoc`.

Prioritize:
- **Services, hooks, and utilities** — highest agent value
- **Types and interfaces** — agents infer architecture from these
- **Component props** — agents need to understand the contract
- Thin wrapper components can be lighter

Do NOT strip existing doc comments from code you're working in. Add them to new code you write.

## Do Not Edit Directly

- `.env` / `.env.local` — Contains API keys
- `public/` assets — Coordinate changes with design

## Testing

Unit tests with Vitest in `__tests__/` directories. Integration tests in `tests/`. Mocks in `tests/mocks/`.

## Context Modules

| Module | When to Load | Path |
|--------|-------------|------|
| **Pitfalls** | Debugging, hydration, state bugs, async issues | `Documentation/context-modules/pitfalls.md` |
| **Service Index** | Finding services, API routes, error handling | `Documentation/context-modules/service-index.md` |
| **Route Map** | Finding pages, layouts, navigation, guards | `Documentation/context-modules/route-map.md` |
| **Data Layer** | API calls, caching, state management | `Documentation/context-modules/data-layer.md` |

**Full graph:** `Documentation/ServiceDependencyMap.md` | **Machine-readable:** `Documentation/ai/component_catalog.yaml`

## Reference Implementations

| Pattern | File |
|---------|------|
| Service | `src/core/services/example.service.ts` |
| Hook | `src/core/hooks/example.hook.ts` |
| Component | `src/features/auth/components/LoginForm.tsx` |
| Type/Model | `src/core/models/example.model.ts` |
| Feature YAML | `Documentation/features/Auth/feature.yaml` |

## Planning Rules

Every plan **must** include a "Documentation Impact" step:

1. **Identify affected docs:**
   - Services — `component_catalog.yaml`, `ServiceDependencyMap.md`
   - Error handling — `ErrorHandling.md`
   - Architecture — `Architecture.md`, relevant ADR
   - Routes/pages — `context-modules/route-map.md`
   - State/data — `context-modules/data-layer.md`
   - Pitfalls — `context-modules/pitfalls.md`
   - Features — `features/{Module}/feature.yaml`
2. **Add a doc update task per affected file**
3. **If no docs affected**, state "No documentation impact"

## End-of-Task Quality Gate

Run `npm run health-gate` before marking any task complete. Fix failures; assess warnings.

## MCP Servers

7 MCP servers provide fast code navigation (Zoekt available as opt-in for large projects). See [MCP-Setup.md](Documentation/MCP-Setup.md) for installation. Machine-specific config in `.mcp.json` (gitignored). Tool priority in `CLAUDE.local.md` (copy from `CLAUDE.local.md.template`).

| Server | Tools | Purpose |
|--------|-------|---------|
| TypeScript LSP | `definition`, `references`, `hover`, `diagnostics` | Semantic navigation |
| Scantool | `search_structures`, `scan_file` | Structural pattern search |
| Knowledge RAG | `knowledge_search` | Semantic doc search |
| Mind | `mind_search` | Cross-system unified search |
| Feature Metadata | `feature_get`, `component_get` | Feature scope + service info |
| Context Bundle | `bundle_load`, `bundle_save` | Session state persistence |
| Change-Impact | `impact_query`, `impact_from_files` | Blast radius analysis |
| Zoekt (opt-in) | `search` | Indexed code search — `npm run setup-mcp -- --zoekt` |

## First-Time Orientation

1. This file -> 2. `component_catalog.yaml` -> 3. `ServiceDependencyMap.md` -> 4. `golden_paths/` -> 5. `ADRs/` -> 6. `ErrorHandling.md` -> 7. `MCP-Setup.md`
