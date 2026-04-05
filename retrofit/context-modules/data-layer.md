# Data Layer

How data flows through the prototype. Static data files, context providers, and their relationships.

## Data Sources

| File | Location | Contains | Used by |
|------|----------|----------|---------|
| workspaceCostData.js | `src/shared/` | Workspace cost records, aggregations | BillingPage, BCM, cost charts |
| billingScenarios.js | `src/courtyard/data/` | Billing scenario configurations | BillingPage |
| workspaces.js | `src/courtyard/data/` | Workspace metadata and membership | WorkspacesPage, workspace selector |
| bcmData.js | `src/courtyard/data/` or `src/data/` | Budget/cost management data | BCM components |
| services.js | `src/data/` | AWS service list | Service selector, search |
| cohorts.js | `src/data/` | User cohort definitions | Analytics, personalization |

## Data Flow

```
Static data files (src/data/, src/courtyard/data/, src/shared/)
    |
    v
Context Providers (src/contexts/)
    |
    v
Page Components (src/courtyard/pages/)
    |
    v
Child Components (display, charts, modals)
```

## Context Providers

| Context | Location | Provides | Used by |
|---------|----------|----------|---------|
| ChatContext | `src/contexts/` | Q chat state and actions | Q chat panel, CloudShell |
| CloudShellContext | `src/contexts/` | CloudShell open/close state | CloudShell component |
| FlashbarContext | `src/contexts/` | Notification queue and dismissal | Any component showing alerts |
| WizardContext | `src/contexts/` | Multi-step wizard state | Onboarding, creation flows |

## Key Data Shapes

### CostRecord (billing triage)
```js
{
  workspaceId: string,
  workspaceName: string,
  service: string,
  cost: number,          // Use fmt() for display
  previousCost: number,
  changePercent: number,
  period: string,        // e.g. "2024-03"
}
```

### Workspace
```js
{
  id: string,
  name: string,
  members: number,
  role: string,          // "admin" | "member" | "viewer"
  // ... see workspaces.js for full shape
}
```

## Rules

- **Don't import data files directly in components** — go through context or page-level props
- **Use `fmt()` for all currency display** — never `toFixed()` or template strings
- **Cost data shapes vary between files** — normalize when combining data from different sources
- **Workspace context affects data scope** — the workspace selector filters what's shown
