---
name: health-check
description: >
  Agent readiness and documentation health check for the web app codebase.
  Use to audit doc quality, service coverage, and gate status.
user-invocable: false
---

# $health-check

Agent readiness and documentation health check. Designed for both interactive use and unattended automations.

## Usage

```
$health-check
```

## Workflow

### 1. Run Agent Readiness Scorecard

```bash
npm run health
```

This produces a ranked list of findings across 7 dimensions:
- Service Coverage (catalog completeness)
- Golden Path Coverage (key user flows documented)
- Feature Metadata (feature.yaml completeness)
- Documentation Sync (error types, dependency map)
- Context Modules (pitfalls, service index, route map, data layer)
- Context Delivery (CLAUDE.md quality)
- ADRs (architectural decisions documented)

Score: `100 - (high * 5 + medium * 2 + low * 0.5)`

### 2. Run Health Gate

```bash
npm run health-gate
```

Pass/fail validation checks:
- CLAUDE.md exists and is under 150 lines
- Component catalog exists
- Service dependency map exists
- Feature YAMLs present with required fields
- All 4 context modules present
- ESLint jsdoc rules configured
- Doc quality (0 new violations vs baseline)

### 3. Evaluate Results

#### Nothing to report (auto-archive):

All of these must be true:
- Readiness score >= 90
- 0 high-severity findings
- 0 medium-severity findings
- Health gate: 0 failures, 0 warnings

#### Findings to report:

```
## Health Check Results

### Readiness Score: {score}/100 ({rating})

**Findings:** {high} high | {medium} medium | {low} low

#### High Priority
- [list each with fix recommendation]

#### Medium Priority
- [list each with fix recommendation]

### Gate Status: {pass}/{total} passed

#### Failures
- [list any failures]

### Recommended Actions
1. [most impactful fix first]
2. [next most impactful]
```

## Thresholds

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Readiness score | >= 90 | 70-89 | < 70 |
| High findings | 0 | 1-2 | 3+ |
| Medium findings | 0-3 | 4-10 | 11+ |
| Gate failures | 0 | 0 | 1+ |

## Automation Notes

- Both commands are **read-only** — no files modified
- `npm run health` completes in <1 second
- `npm run health-gate` completes in <5 seconds (longer if ESLint runs)
- No network access required
- No build required

## Related Files

- `scripts/agent-readiness.js` — Readiness scorecard engine
- `scripts/health-check.js` — Gate validation engine
- `Documentation/ai/component_catalog.yaml` — Service catalog
- `Documentation/features/*/feature.yaml` — Feature metadata
- `Documentation/golden_paths/*.md` — Golden path traces
- `Documentation/ErrorHandling.md` — Error type documentation
- `eslint.config.js` — ESLint jsdoc rules (doc quality enforcement)
