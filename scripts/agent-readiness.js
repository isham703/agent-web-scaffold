#!/usr/bin/env node

/**
 * Agent readiness scorecard — ranks documentation health across dimensions.
 *
 * Equivalent to `make health` in the iOS project.
 * Scores: 100 - (high * 5 + medium * 2 + low * 0.5)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const findings = [];

function finding(severity, dimension, message) {
  findings.push({ severity, dimension, message });
}

// --- 1. Service Coverage ---

const catalogPath = resolve(root, 'Documentation/ai/component_catalog.yaml');
if (!existsSync(catalogPath)) {
  finding('high', 'Service Coverage', 'component_catalog.yaml missing');
} else {
  const catalog = readFileSync(catalogPath, 'utf-8');
  const services = (catalog.match(/^  \w+:/gm) || []).length;
  if (services === 0) finding('medium', 'Service Coverage', 'No services in catalog');
  else if (services < 3) finding('low', 'Service Coverage', `Only ${services} service(s) in catalog`);
}

// --- 2. Golden Path Coverage ---

const goldenDir = resolve(root, 'Documentation/golden_paths');
if (!existsSync(goldenDir)) {
  finding('high', 'Golden Paths', 'golden_paths/ directory missing');
} else {
  const paths = readdirSync(goldenDir).filter(f => f.endsWith('.md'));
  if (paths.length === 0) finding('medium', 'Golden Paths', 'No golden path traces');
  else if (paths.length < 3) finding('low', 'Golden Paths', `Only ${paths.length} golden path(s) — aim for key user flows`);
}

// --- 3. Feature Metadata ---

const featuresDir = resolve(root, 'Documentation/features');
if (!existsSync(featuresDir)) {
  finding('high', 'Feature Metadata', 'features/ directory missing');
} else {
  const features = readdirSync(featuresDir).filter(f => {
    const yamlPath = join(featuresDir, f, 'feature.yaml');
    return existsSync(yamlPath);
  });
  if (features.length === 0) finding('medium', 'Feature Metadata', 'No feature.yaml files');

  // Check required fields
  for (const f of features) {
    const yaml = readFileSync(join(featuresDir, f, 'feature.yaml'), 'utf-8');
    const required = ['name:', 'purpose:', 'entry_point:', 'services_used:'];
    const missing = required.filter(field => !yaml.includes(field));
    if (missing.length > 0) {
      finding('medium', 'Feature Metadata', `${f}/feature.yaml missing fields: ${missing.join(', ')}`);
    }
  }
}

// --- 4. Documentation Sync ---

const errorDocPath = resolve(root, 'Documentation/ErrorHandling.md');
if (!existsSync(errorDocPath)) {
  finding('high', 'Documentation Sync', 'ErrorHandling.md missing');
}

const depMapPath = resolve(root, 'Documentation/ServiceDependencyMap.md');
if (!existsSync(depMapPath)) {
  finding('high', 'Documentation Sync', 'ServiceDependencyMap.md missing');
}

// --- 5. Context Modules ---

const contextDir = resolve(root, 'Documentation/context-modules');
const requiredModules = ['pitfalls.md', 'service-index.md', 'route-map.md', 'data-layer.md'];
for (const mod of requiredModules) {
  if (!existsSync(resolve(contextDir, mod))) {
    finding('medium', 'Context Modules', `Missing context module: ${mod}`);
  }
}

// --- 6. CLAUDE.md Quality ---

const claudePath = resolve(root, 'CLAUDE.md');
if (!existsSync(claudePath)) {
  finding('high', 'Context Delivery', 'CLAUDE.md missing');
} else {
  const claude = readFileSync(claudePath, 'utf-8');
  const lines = claude.split('\n').length;
  if (lines > 200) finding('medium', 'Context Delivery', `CLAUDE.md is ${lines} lines (target: <=150)`);

  // Check for key sections
  if (!claude.includes('Context Modules')) finding('medium', 'Context Delivery', 'CLAUDE.md missing Context Modules table');
  if (!claude.includes('Doc Comments')) finding('medium', 'Context Delivery', 'CLAUDE.md missing doc comment rule');
  if (!claude.includes('Reference Implementations')) finding('low', 'Context Delivery', 'CLAUDE.md missing Reference Implementations');
}

// --- 7. ADRs ---

const adrDir = resolve(root, 'Documentation/ADRs');
if (!existsSync(adrDir)) {
  finding('low', 'ADRs', 'ADRs/ directory missing');
} else {
  const adrs = readdirSync(adrDir).filter(f => f.startsWith('ADR-'));
  if (adrs.length === 0) finding('low', 'ADRs', 'No ADR files — document key decisions');
}

// --- Report ---

const high = findings.filter(f => f.severity === 'high');
const medium = findings.filter(f => f.severity === 'medium');
const low = findings.filter(f => f.severity === 'low');

const score = Math.max(0, 100 - (high.length * 5 + medium.length * 2 + low.length * 0.5));

let rating = 'GREEN';
if (score < 90) rating = 'YELLOW';
if (score < 70) rating = 'RED';

console.log('\n=== Agent Readiness Scorecard ===\n');
console.log(`  Score: ${score}/100 (${rating})`);
console.log(`  Findings: ${high.length} high | ${medium.length} medium | ${low.length} low\n`);

if (high.length > 0) {
  console.log('  HIGH:');
  high.forEach(f => console.log(`    - [${f.dimension}] ${f.message}`));
}

if (medium.length > 0) {
  console.log('  MEDIUM:');
  medium.forEach(f => console.log(`    - [${f.dimension}] ${f.message}`));
}

if (low.length > 0) {
  console.log('  LOW:');
  low.forEach(f => console.log(`    - [${f.dimension}] ${f.message}`));
}

if (findings.length === 0) {
  console.log('  No findings. Documentation is in good shape.\n');
}

console.log('');
