---
name: doc-quality-fix
description: >
  Iteratively fix TSDoc violations until the codebase reaches zero.
  Uses ESLint jsdoc plugin. Designed for unattended automations that commit and PR each batch.
user-invocable: false
---

# $doc-quality-fix

Iteratively fix TSDoc documentation violations until the codebase reaches zero. Uses `eslint-plugin-jsdoc` for detection. Designed for unattended automations that commit + PR each batch.

## Rationale

Doc comments exist for **AI agent navigability**, not just developer convenience. Measured impact: 51% to 67% improvement in doc-guided agent navigation across simulations. Services, hooks, and types benefit most.

## Usage

```
$doc-quality-fix
```

## Workflow

### 1. Discover Current Violations

Run ESLint with JSON output to get all jsdoc violations:

```bash
npx eslint --format json src/ 2>/dev/null | node -e "
  const data = JSON.parse(require('fs').readFileSync('/dev/stdin','utf-8'));
  const violations = data.flatMap(f =>
    f.messages.filter(m => m.ruleId?.startsWith('jsdoc/')).map(m => ({
      file: f.filePath, line: m.line, rule: m.ruleId, message: m.message
    }))
  );
  console.log(JSON.stringify({ total: violations.length, violations }, null, 2));
"
```

If total violations is 0, report success and stop.

### 2. Select Batch

Group violations by file. Sort files by violation count descending. Select the **top 5 files** for this batch.

**Skip these files:**
- `**/__tests__/**`, `**/*.test.*`, `**/*.spec.*` — test files
- `**/mocks/**` — mock data
- `**/*.d.ts` — type declarations

### 3. Fix Violations in Each File

For each file in the batch:

1. **Read the file** to understand the code
2. **Fix all violations in that file** following the rules below
3. **Move to the next file**

#### Violation Types and Fix Rules

| ESLint Rule | Equivalent | How to Fix |
|-------------|-----------|------------|
| `jsdoc/require-jsdoc` | DOC001 | Add a `/** */` TSDoc comment describing purpose, params, return |
| `jsdoc/check-param-names` | DOC003 | Fix the parameter name to match the function signature |
| `jsdoc/require-param` | DOC004 | Add `@param name - description` for each parameter |
| `jsdoc/require-returns` | DOC005 | Add `@returns description` line |
| `jsdoc/require-throws` | DOC005 | Add `@throws {ErrorType} description` line |

#### Documentation Quality Standards

- **Be specific, not generic.** Don't write "Creates a new instance" — describe what it does.
- **Describe behavior and purpose**, not just structure.
- **Document error conditions** with `@throws`.
- **Document return values** meaningfully.
- **Keep it concise.** One-line for simple items. Multi-line for complex.
- **Match existing style.** Look at documented symbols in the same file.
- **No types in TSDoc** — TypeScript handles types. Use `@param name - description` not `@param {string} name`.

### 4. Build Verification

```bash
npm run build
```

Fix any issues introduced by documentation changes.

### 5. Run Lint to Verify Improvement

```bash
npx eslint --format json src/ 2>/dev/null
```

Parse and report the delta.

### 6. Commit and Create PR

```bash
git add src/
git commit -m "Fix {N} TSDoc violations in {files summary}

Violations fixed:
- require-jsdoc: {count}
- require-param: {count}
- require-returns: {count}
- check-param-names: {count}

Remaining: {total} violations

Co-Authored-By: Claude <noreply@anthropic.com>"
```

Push and create PR.

### 7. Report Results

```
## Doc Quality Fix Results

**Violations fixed this run:** {N}
**Remaining:** {total} in {M} files
**PR:** {url}

### Files Fixed
{list with before/after counts per file}

### Remaining Top Files
{top 5 remaining files by violation count}
```

## Guardrails

| Control | Value |
|---------|-------|
| Batch size | 5 files per run |
| Skip list | Tests, mocks, .d.ts |
| Build gate | Must pass before commit |
| Max lines changed per file | No limit |
