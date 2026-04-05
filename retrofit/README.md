# Retrofit: Agent Navigability for Existing Projects

Drop-in files to improve AI agent navigation in a Cloudscape + JS + Vite project.
These files ADD to your project — they don't overwrite anything.

## What's Included

| File | Where to put it | What it does |
|------|----------------|-------------|
| `AGENTS.md` | Project root | Cross-IDE agent instructions (Kiro, Claude Code, Cursor) |
| `context-modules/pitfalls.md` | `context-modules/` | Known gotchas and tribal knowledge |
| `context-modules/route-map.md` | `context-modules/` | Hash-based routing inventory |
| `context-modules/data-layer.md` | `context-modules/` | Data files, contexts, and relationships |
| `context-modules/component-index.md` | `context-modules/` | Inventory of reusable components |
| `scripts/health-check.js` | `scripts/` | Convention validation (tokens, routing, steering) |
| `eslint-jsdoc-config.js` | Reference only | ESLint rules to add for JSDoc enforcement |

## Install Steps

1. **Copy context-modules/** to your project root:
   ```bash
   cp -r context-modules/ /path/to/your/project/context-modules/
   ```

2. **Copy AGENTS.md** to your project root:
   ```bash
   cp AGENTS.md /path/to/your/project/
   ```

3. **Copy health-check.js** to your scripts directory:
   ```bash
   cp scripts/health-check.js /path/to/your/project/scripts/
   ```

4. **Add health-gate script** to your package.json:
   ```json
   "scripts": {
     "health-gate": "node scripts/health-check.js"
   }
   ```

5. **Optional: Add JSDoc enforcement** — install `eslint-plugin-jsdoc` and merge the rules from `eslint-jsdoc-config.js` into your ESLint config.

6. **Optional: Add context module steering** — create a new Kiro steering file to make agents load context modules on demand:

   `.kiro/steering/context-modules.md`:
   ```markdown
   ---
   inclusion: auto
   name: context-modules
   description: On-demand context modules for agent navigation. Load when working in unfamiliar areas, debugging, or adding new features.
   ---

   # Context Modules

   | Module | When to Load | Path |
   |--------|-------------|------|
   | Pitfalls | Debugging, common mistakes | context-modules/pitfalls.md |
   | Route Map | Adding pages, navigation | context-modules/route-map.md |
   | Data Layer | Working with billing/cost data | context-modules/data-layer.md |
   | Component Index | Finding reusable components | context-modules/component-index.md |
   ```

## After Install

1. Run `node scripts/health-check.js` to see current status
2. **Audit and update** the context modules — they're based on the project scan, not a full read. The agent on this machine should fill in the `(audit and add others here)` placeholders.
3. The pitfalls doc especially should grow over time as you discover new gotchas.

## What This Does NOT Do

- Does not change your existing code
- Does not add TypeScript
- Does not modify your Kiro steering files
- Does not add MCP servers (those are a separate concern)
- Does not conflict with your existing CLAUDE.md
