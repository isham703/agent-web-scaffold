# Pitfalls and Gotchas

Known patterns and tribal knowledge. Load when debugging, writing new code, or onboarding to an unfamiliar area.

## Cloudscape / Components

### SpendLimitModal ownership
- **Rule:** SpendLimitModal is owned by BillingPage, not child components
- **Why:** Modal state and submission logic live at the page level. Child components trigger it via callback props, never render it themselves.
- **Wrong:** Rendering `<SpendLimitModal>` inside a billing card component
- **Right:** Pass `onSetSpendLimit` callback down, BillingPage renders the modal

### Use `fmt` for currency formatting
- **Rule:** Always use the shared `fmt` utility for currency display, never `toFixed()` or template literals
- **Why:** Consistent formatting across billing, spend limits, and cost breakdowns
- **Wrong:** `` `$${amount.toFixed(2)}` ``
- **Right:** `fmt(amount)` or the appropriate fmt variant

### Cloudscape component props gotcha
- **Rule:** Don't pass HTML attributes directly to Cloudscape components
- **Why:** Cloudscape components have their own prop APIs. `className`, `style`, `onClick` etc. may not work as expected or may be silently ignored.
- **Right:** Use Cloudscape's documented props. Wrap in a `<div>` if you need custom styling around a component.

### Design token usage
- **Rule:** All spacing, colors, and typography must come from `src/styles/tokens.js`
- **Why:** Enforced by design-system.md steering. Hardcoded values break theme consistency.
- **Wrong:** `style={{ padding: '16px', color: '#333' }}`
- **Right:** `style={{ padding: tokens.spaceScaledM, color: tokens.colorTextBodyDefault }}`

## Routing

### Hash-based routing via activeHref
- **Rule:** Navigation uses hash-based routing (`#/path`), not React Router
- **Why:** Prototype architecture uses `activeHref` state in App.jsx and CourtyardApp.jsx
- **Gotcha:** Don't import `useNavigate` or `<Link>` from react-router-dom for courtyard navigation. Use the `activeHref` pattern.

### Route ownership split
- **Rule:** Top-level routes are in `App.jsx`, courtyard routes are in `CourtyardApp.jsx`
- **Gotcha:** Adding a new courtyard page? Add the route in `CourtyardApp.jsx`, not `App.jsx`

## Data

### Billing data shape
- **Rule:** Cost records follow the CostRecord shape defined in the billing triage spec
- **Gotcha:** `workspaceCostData.js`, `billingScenarios.js`, and `bcmData.js` all have cost data but in slightly different shapes. Check which file you're reading from and normalize if needed.

### Workspace context
- **Rule:** Workspace data flows through context. Don't import workspace data files directly in components.
- **Why:** The workspace selector in the courtyard affects which data is shown. Direct imports bypass this.

## Testing

### Property-based testing with fast-check
- **Rule:** Use fast-check for data invariants (billing calculations, cost aggregations)
- **Why:** Catches edge cases that example-based tests miss (negative amounts, zero workspaces, large numbers)
- **Gotcha:** fast-check arbitraries must match your actual data shapes. If CostRecord changes, update the arbitrary too.

### Playwright visual validation
- **Rule:** Figma implementation changes require Playwright screenshot comparison
- **Why:** CLAUDE.md enforces pixel-accurate Figma matching. Visual regressions are caught by screenshot diffs.

## File Organization

### Where does new code go?
- **Console-level components** (top nav, search, CloudShell, Q chat) → `src/components/`
- **Courtyard pages** (Billing, Workspaces, Teams) → `src/courtyard/pages/`
- **Courtyard shared components** (modals, layout pieces) → `src/courtyard/components/`
- **Full-page flows** (sign-up, sign-in, invitations) → `src/flows/`
- **Shared hooks** → `src/hooks/`
- **React Context providers** → `src/contexts/`
- **Static data / scenarios** → `src/data/` or `src/courtyard/data/`
- **Design tokens** → `src/styles/tokens.js`
- **Cross-cutting utilities** → `src/utils/` or `src/shared/`
