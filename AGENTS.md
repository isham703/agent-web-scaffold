# Agent Instructions

Cross-IDE agent instructions. Read by Claude Code (CLAUDE.md), Kiro (.kiro/steering/), Cursor, Copilot, and other AI coding tools that support the AGENTS.md standard.

## Project

React + Vite + TypeScript web application. Feature-based architecture under `src/features/`, shared code in `src/core/`.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Type-check + production build
- `npm run lint` — ESLint (includes doc quality checks)
- `npm run health` — Agent readiness scorecard
- `npm run health-gate` — Pass/fail validation gate
- `npm run setup-mcp` — Generate local MCP configs (run once per machine)

## First-Time Machine Setup

If `.mcp.json` does not exist, run `npm run setup-mcp`. This detects installed tools and generates local MCP configs for both Claude Code and Kiro. Generated files are **gitignored** — they contain machine-specific paths and must never be committed. Do NOT `git add` these files: `.mcp.json`, `.kiro/settings/mcp.json`, `CLAUDE.local.md`.

## Key Rules

### Doc Comments for Agent Navigation
All exported functions, components, hooks, types, and constants must have TSDoc (`/** */`) comments. This improves AI agent navigation measurably. Enforced by `eslint-plugin-jsdoc`. Do NOT strip existing doc comments.

### Architecture
- Features import from `core/` but never from other features
- Services are plain TypeScript — no React dependency
- Hooks wrap services for React integration
- Components are thin render layers — logic lives in hooks
- All API calls go through ApiClient — no direct `fetch()`

### Do Not Edit
- `.env` / `.env.local` — Contains API keys
- `public/` assets — Coordinate changes with design

## Context for Deeper Work

| Topic | File |
|-------|------|
| Pitfalls/gotchas | `Documentation/context-modules/pitfalls.md` |
| Service index | `Documentation/context-modules/service-index.md` |
| Route map | `Documentation/context-modules/route-map.md` |
| Data layer | `Documentation/context-modules/data-layer.md` |
| Service dependencies | `Documentation/ServiceDependencyMap.md` |
| Component catalog | `Documentation/ai/component_catalog.yaml` |
| Error handling | `Documentation/ErrorHandling.md` |
| Architecture | `Documentation/Architecture.md` |
| Feature metadata | `Documentation/features/*/feature.yaml` |
| Golden path traces | `Documentation/golden_paths/*.md` |
| ADRs | `Documentation/ADRs/` |

## Planning

Every plan must include a "Documentation Impact" step — identify which docs are affected and add update tasks. If none affected, state "No documentation impact."

## Quality Gate

Run `npm run health-gate` before marking any task complete.
