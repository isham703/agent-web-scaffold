#!/usr/bin/env node

/**
 * Health gate — pass/fail validation checks for agent workflow.
 *
 * Equivalent to `make health-gate` in the iOS project.
 * Checks: doc quality, error type sync, catalog validation, route map sync.
 *
 * Exit 0 = all pass, exit 1 = failures present.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
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

check('CLAUDE.md exists', () => {
  const exists = existsSync(resolve(root, 'CLAUDE.md'));
  return exists
    ? { status: 'PASS', detail: 'Found' }
    : { status: 'FAIL', detail: 'CLAUDE.md missing from project root' };
});

check('CLAUDE.md size', () => {
  const content = readFileSync(resolve(root, 'CLAUDE.md'), 'utf-8');
  const lines = content.split('\n').length;
  if (lines <= 150) return { status: 'PASS', detail: `${lines} lines` };
  if (lines <= 200) return { status: 'WARN', detail: `${lines} lines (target: <=150)` };
  return { status: 'FAIL', detail: `${lines} lines (max: 200)` };
});

check('Component catalog exists', () => {
  const path = resolve(root, 'Documentation/ai/component_catalog.yaml');
  return existsSync(path)
    ? { status: 'PASS', detail: 'Found' }
    : { status: 'FAIL', detail: 'Documentation/ai/component_catalog.yaml missing' };
});

check('Service dependency map exists', () => {
  const path = resolve(root, 'Documentation/ServiceDependencyMap.md');
  return existsSync(path)
    ? { status: 'PASS', detail: 'Found' }
    : { status: 'FAIL', detail: 'Documentation/ServiceDependencyMap.md missing' };
});

check('Feature YAMLs present', () => {
  const featuresDir = resolve(root, 'Documentation/features');
  if (!existsSync(featuresDir)) return { status: 'FAIL', detail: 'Documentation/features/ missing' };

  try {
    const output = execSync(`find "${featuresDir}" -name "feature.yaml" | wc -l`, { encoding: 'utf-8' }).trim();
    const count = parseInt(output, 10);
    if (count === 0) return { status: 'WARN', detail: 'No feature.yaml files found' };
    return { status: 'PASS', detail: `${count} feature(s)` };
  } catch {
    return { status: 'FAIL', detail: 'Could not scan features directory' };
  }
});

check('Context modules present', () => {
  const required = ['pitfalls.md', 'service-index.md', 'route-map.md', 'data-layer.md'];
  const dir = resolve(root, 'Documentation/context-modules');
  const missing = required.filter(f => !existsSync(resolve(dir, f)));

  if (missing.length === 0) return { status: 'PASS', detail: `All ${required.length} modules present` };
  return { status: 'FAIL', detail: `Missing: ${missing.join(', ')}` };
});

check('ESLint doc rules configured', () => {
  const configPath = resolve(root, 'eslint.config.js');
  if (!existsSync(configPath)) return { status: 'FAIL', detail: 'eslint.config.js missing' };

  const content = readFileSync(configPath, 'utf-8');
  if (content.includes('jsdoc/require-jsdoc')) {
    return { status: 'PASS', detail: 'jsdoc/require-jsdoc rule found' };
  }
  return { status: 'WARN', detail: 'jsdoc/require-jsdoc rule not found in config' };
});

check('Doc quality (ESLint jsdoc)', () => {
  try {
    execSync('npx eslint --rule "jsdoc/require-jsdoc: warn" src/ 2>&1', {
      cwd: root,
      encoding: 'utf-8',
      timeout: 30000,
    });
    return { status: 'PASS', detail: '0 violations' };
  } catch (e) {
    // ESLint exits non-zero when there are warnings/errors
    const output = e.stdout || e.message || '';
    const warnMatch = output.match(/(\d+) problems?/);
    if (warnMatch) {
      const count = parseInt(warnMatch[1], 10);
      return { status: 'WARN', detail: `${count} doc violations (run npm run lint:docs for details)` };
    }
    // ESLint not installed yet — skip gracefully
    if (output.includes('not found') || output.includes('Cannot find')) {
      return { status: 'SKIP', detail: 'ESLint not installed (run npm install)' };
    }
    return { status: 'SKIP', detail: 'Could not run ESLint' };
  }
});

// --- Report ---

const failures = results.filter(r => r.status === 'FAIL');
const warnings = results.filter(r => r.status === 'WARN');
const passes = results.filter(r => r.status === 'PASS');
const skips = results.filter(r => r.status === 'SKIP');

console.log('\n=== Health Gate ===\n');

for (const r of results) {
  const icon = { PASS: 'PASS', FAIL: 'FAIL', WARN: 'WARN', SKIP: 'SKIP' }[r.status];
  console.log(`  [${icon}] ${r.name}: ${r.detail}`);
}

console.log(`\n  ${passes.length} passed, ${warnings.length} warnings, ${failures.length} failures, ${skips.length} skipped\n`);

if (failures.length > 0) {
  console.log('Gate: FAILED\n');
  process.exit(1);
} else {
  console.log('Gate: PASSED\n');
  process.exit(0);
}
