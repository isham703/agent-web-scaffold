#!/usr/bin/env node

/**
 * Health check for Cloudscape + JS project conventions.
 * Validates steering rules are actually followed.
 *
 * Run: node scripts/health-check.js
 * Add to package.json: "health-gate": "node scripts/health-check.js"
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const results = [];

function check(name, fn) {
  try {
    const result = fn();
    results.push({ name, status: result.status, detail: result.detail });
  } catch (e) {
    results.push({ name, status: 'FAIL', detail: e.message });
  }
}

// --- Checks ---

check('Steering files present', () => {
  const steeringDir = resolve(root, '.kiro/steering');
  if (!existsSync(steeringDir)) return { status: 'FAIL', detail: '.kiro/steering/ missing' };

  const required = ['design-system.md', 'git-workflow.md'];
  const files = readdirSync(steeringDir);
  const missing = required.filter(f => !files.includes(f));

  if (missing.length > 0) return { status: 'FAIL', detail: `Missing: ${missing.join(', ')}` };
  return { status: 'PASS', detail: `${files.length} steering files` };
});

check('Context modules present', () => {
  const dir = resolve(root, 'context-modules');
  if (!existsSync(dir)) return { status: 'WARN', detail: 'context-modules/ not found' };

  const expected = ['pitfalls.md', 'route-map.md', 'data-layer.md', 'component-index.md'];
  const missing = expected.filter(f => !existsSync(resolve(dir, f)));

  if (missing.length === 0) return { status: 'PASS', detail: `All ${expected.length} modules` };
  if (missing.length <= 2) return { status: 'WARN', detail: `Missing: ${missing.join(', ')}` };
  return { status: 'FAIL', detail: `Missing: ${missing.join(', ')}` };
});

check('No hardcoded colors in JSX', () => {
  try {
    // Search for hex colors in JSX files (excluding tokens.js and CSS files)
    const output = execSync(
      `grep -rn "#[0-9a-fA-F]\\{3,6\\}" src/ --include="*.jsx" --include="*.js" -l 2>/dev/null || true`,
      { cwd: root, encoding: 'utf-8' }
    ).trim();

    if (!output) return { status: 'PASS', detail: 'No hardcoded hex colors found' };

    const files = output.split('\n').filter(f =>
      !f.includes('tokens.js') && !f.includes('node_modules')
    );

    if (files.length === 0) return { status: 'PASS', detail: 'Colors only in tokens.js' };
    return { status: 'WARN', detail: `Hardcoded colors in: ${files.slice(0, 3).join(', ')}${files.length > 3 ? ` (+${files.length - 3} more)` : ''}` };
  } catch {
    return { status: 'SKIP', detail: 'Could not run grep' };
  }
});

check('No hardcoded spacing in JSX', () => {
  try {
    // Search for pixel values in style props (rough heuristic)
    const output = execSync(
      `grep -rn "padding:\\|margin:\\|gap:" src/ --include="*.jsx" --include="*.js" -l 2>/dev/null || true`,
      { cwd: root, encoding: 'utf-8' }
    ).trim();

    if (!output) return { status: 'PASS', detail: 'No inline spacing found' };

    const files = output.split('\n').filter(f =>
      !f.includes('tokens.js') && !f.includes('node_modules')
    );

    // Just warn — too noisy to fail on
    if (files.length > 0) {
      return { status: 'WARN', detail: `Check spacing tokens in: ${files.slice(0, 3).join(', ')}${files.length > 3 ? ` (+${files.length - 3} more)` : ''}` };
    }
    return { status: 'PASS', detail: 'Spacing looks clean' };
  } catch {
    return { status: 'SKIP', detail: 'Could not run grep' };
  }
});

check('No react-router navigation in courtyard', () => {
  try {
    const output = execSync(
      `grep -rn "useNavigate\\|<Link\\b" src/courtyard/ --include="*.jsx" --include="*.js" -l 2>/dev/null || true`,
      { cwd: root, encoding: 'utf-8' }
    ).trim();

    if (!output) return { status: 'PASS', detail: 'Courtyard uses hash routing only' };
    const files = output.split('\n').filter(Boolean);
    return { status: 'WARN', detail: `react-router in courtyard: ${files.join(', ')}` };
  } catch {
    return { status: 'SKIP', detail: 'Could not run grep' };
  }
});

check('Design tokens file exists', () => {
  const tokensPath = resolve(root, 'src/styles/tokens.js');
  return existsSync(tokensPath)
    ? { status: 'PASS', detail: 'src/styles/tokens.js found' }
    : { status: 'FAIL', detail: 'src/styles/tokens.js missing' };
});

check('AGENTS.md exists', () => {
  return existsSync(resolve(root, 'AGENTS.md'))
    ? { status: 'PASS', detail: 'Found' }
    : { status: 'WARN', detail: 'AGENTS.md missing (cross-IDE agent instructions)' };
});

// --- Report ---

const failures = results.filter(r => r.status === 'FAIL');
const warnings = results.filter(r => r.status === 'WARN');
const passes = results.filter(r => r.status === 'PASS');
const skips = results.filter(r => r.status === 'SKIP');

console.log('\n=== Health Gate ===\n');

for (const r of results) {
  console.log(`  [${r.status}] ${r.name}: ${r.detail}`);
}

console.log(`\n  ${passes.length} passed, ${warnings.length} warnings, ${failures.length} failures, ${skips.length} skipped\n`);

if (failures.length > 0) {
  console.log('Gate: FAILED\n');
  process.exit(1);
} else {
  console.log('Gate: PASSED\n');
  process.exit(0);
}
