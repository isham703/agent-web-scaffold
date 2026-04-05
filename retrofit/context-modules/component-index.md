# Component Index

Inventory of reusable components and where to find them. Check here before building something new.

## Console-Level Components (`src/components/`)

| Component | Purpose |
|-----------|---------|
| Top Navigation | Global nav bar with search, notifications, account |
| Search Panel | Global service/resource search |
| CloudShell | Terminal panel at bottom of console |
| BCM | Budget and cost management widgets |
| Q Chat | Amazon Q chat panel |
| Window System | Draggable/resizable window containers |

## Courtyard Components (`src/courtyard/components/`)

| Component | Purpose | Used by |
|-----------|---------|---------|
| SpendLimitModal | Set/edit spend limits | BillingPage (owns modal state) |
| Layout components | Page shell, sidebar, content area | All courtyard pages |
| (audit and add others here) | | |

## Courtyard Pages (`src/courtyard/pages/`)

| Page | Route | Key data sources |
|------|-------|-----------------|
| BillingPage | `#/billing` | workspaceCostData, billingScenarios |
| WorkspacesPage | `#/workspaces` | workspaces |
| TeamsPage | `#/teams` | workspaces (team membership) |
| (add new pages here) | | |

## Flows (`src/flows/`)

| Flow | Route | Description |
|------|-------|-------------|
| Sign-up | `#/signup` | Account creation |
| Sign-in | `#/signin` | Authentication |
| Invitations | `#/invitations` | Accept/manage invitations |
| Console Home | `#/console-home` | Landing after sign-in |

## Shared Hooks (`src/hooks/`)

| Hook | Purpose |
|------|---------|
| useEscapeKey | Close modal/panel on Escape |
| useOutsideClick | Close dropdown/popover on outside click |
| useWindowWidth | Responsive breakpoint detection |

## Services (`src/services/`)

| Service | Purpose |
|---------|---------|
| BedrockService | Amazon Bedrock API integration |

## Utilities (`src/utils/`)

| Utility | Purpose |
|---------|---------|
| fmt | Currency formatting (use this, never toFixed) |
| (audit and add others here) | |

## Design Tokens (`src/styles/`)

| File | Purpose |
|------|---------|
| tokens.js | Cloudscape design token values (spacing, colors, typography) |

---

**Maintaining this index:** When adding a new component, hook, or utility, add it here. When searching for something to reuse, check here first before building new.
