# Route Map

Page/route inventory. Uses hash-based routing (`#/path`) via `activeHref` state.

## Top-Level Routes (App.jsx)

| Hash | Component | Description |
|------|-----------|-------------|
| `#/` | CourtyardApp | Main courtyard experience |
| `#/signup` | Sign-up flow | `src/flows/` |
| `#/signin` | Sign-in flow | `src/flows/` |
| `#/invitations` | Invitation flow | `src/flows/` |
| `#/console-home` | Console home | `src/flows/` |

## Courtyard Routes (CourtyardApp.jsx)

| Hash | Page Component | Location |
|------|---------------|----------|
| `#/billing` | BillingPage | `src/courtyard/pages/` |
| `#/workspaces` | WorkspacesPage | `src/courtyard/pages/` |
| `#/teams` | TeamsPage | `src/courtyard/pages/` |
| (add new courtyard pages here) | | |

## Navigation Pattern

```jsx
// Reading the current route
const [activeHref, setActiveHref] = useState('#/billing');

// Navigating (in Cloudscape SideNavigation or links)
<SideNavigation
  activeHref={activeHref}
  onFollow={e => {
    e.preventDefault();
    setActiveHref(e.detail.href);
  }}
  items={[...]}
/>
```

**Do NOT use** `react-router-dom` navigation (`useNavigate`, `<Link>`) for courtyard pages. Use the `activeHref` pattern above.

## Adding a New Route

1. Create page component in `src/courtyard/pages/`
2. Add route case in `CourtyardApp.jsx`
3. Add sidebar navigation item
4. Update this document
