#!/usr/bin/env node

/**
 * Generate local MCP configs for Claude Code and Kiro.
 *
 * Run once per machine: `npm run setup-mcp`
 *
 * Generated files are gitignored and contain machine-specific absolute paths.
 * Safe to re-run — overwrites existing configs.
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, copyFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const home = homedir();

// --- Step 0: Verify gitignore protects local files ---

function verifyGitignore() {
  const gitignorePath = resolve(root, '.gitignore');
  if (!existsSync(gitignorePath)) {
    console.error('FATAL: .gitignore missing. Refusing to generate local configs without gitignore protection.');
    process.exit(1);
  }

  const gitignore = readFileSync(gitignorePath, 'utf-8');
  const required = ['.mcp.json', '.kiro/settings/mcp.json', 'CLAUDE.local.md'];
  const missing = required.filter(f => !gitignore.includes(f));

  if (missing.length > 0) {
    console.error(`FATAL: .gitignore is missing entries for: ${missing.join(', ')}`);
    console.error('These files contain machine-specific paths and must never be committed.');
    console.error('Add them to .gitignore first, then re-run.');
    process.exit(1);
  }

  console.log('[OK] .gitignore protects all local config files\n');
}

// --- Step 1: Detect available tools ---

function which(cmd) {
  try {
    return execSync(`which ${cmd}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

function detectTools() {
  const tools = {};

  console.log('Detecting tools...\n');

  // TypeScript LSP
  tools.tsLspServer = which('typescript-language-server');
  tools.mcpLangServer = which('mcp-language-server');
  const haveLsp = !!(tools.tsLspServer && tools.mcpLangServer);
  console.log(`  ${haveLsp ? '[OK]' : '[SKIP]'} TypeScript LSP`);
  if (!haveLsp) {
    if (!tools.tsLspServer) console.log('         Install: npm i -g typescript typescript-language-server');
    if (!tools.mcpLangServer) console.log('         Install: go install github.com/isaacphi/mcp-language-server@latest');
  }

  // Zoekt (opt-in: run `npm run setup-mcp -- --zoekt` to enable)
  const zoektOptIn = process.argv.includes('--zoekt');
  if (zoektOptIn) {
    tools.zoektIndex = which('zoekt-git-index');
    tools.zoektWeb = which('zoekt-webserver');
    const zoektMcpDir = resolve(home, '.local/mcp-servers/zoekt-mcp');
    tools.zoektMcp = existsSync(resolve(zoektMcpDir, 'index.js')) ? zoektMcpDir : null;
    const haveZoekt = !!(tools.zoektIndex && tools.zoektWeb && tools.zoektMcp);
    console.log(`  ${haveZoekt ? '[OK]' : '[MISSING]'} Zoekt (opt-in)`);
    if (!haveZoekt) {
      if (!tools.zoektIndex) console.log('         Install: go install github.com/sourcegraph/zoekt/cmd/zoekt-git-index@latest');
      if (!tools.zoektWeb) console.log('         Install: go install github.com/sourcegraph/zoekt/cmd/zoekt-webserver@latest');
      if (!tools.zoektMcp) console.log('         Install: git clone https://github.com/cjlludwig/zoekt-mcp.git ~/.local/mcp-servers/zoekt-mcp');
    }
  } else {
    console.log('  [SKIP] Zoekt (opt-in: npm run setup-mcp -- --zoekt)');
  }

  // Scantool
  tools.uvx = which('uvx');
  console.log(`  ${tools.uvx ? '[OK]' : '[SKIP]'} Scantool (Tree-Sitter)`);
  if (!tools.uvx) console.log('         Install: pip install uv');

  // Minimal server
  const minimalPath = resolve(home, '.local/mcp-servers/minimal-server.py');
  tools.minimal = existsSync(minimalPath) ? minimalPath : null;
  tools.python = which('python3');
  const haveMinimal = !!(tools.minimal && tools.python);
  console.log(`  ${haveMinimal ? '[OK]' : '[SKIP]'} Minimal server (Knowledge, Mind, Features, Bundle, Impact)`);
  if (!haveMinimal) {
    if (!tools.python) console.log('         Install: python3 required');
    if (!tools.minimal) console.log('         Install: see Documentation/MCP-Setup.md');
  }

  console.log('');
  return tools;
}

// --- Step 2: Build MCP config ---

function buildConfig(tools) {
  const servers = {};

  // TypeScript LSP
  if (tools.tsLspServer && tools.mcpLangServer) {
    servers['typescript-lsp'] = {
      command: tools.mcpLangServer,
      args: ['-workspace', root, '-lsp', tools.tsLspServer, '--', '--stdio'],
    };
  }

  // Zoekt
  if (tools.zoektMcp) {
    servers['zoekt'] = {
      command: 'node',
      args: [resolve(tools.zoektMcp, 'index.js')],
      env: { ZOEKT_URL: 'http://127.0.0.1:6070' },
    };
  }

  // Scantool
  if (tools.uvx) {
    servers['treesitter'] = {
      command: tools.uvx,
      args: ['scantool'],
    };
  }

  // Minimal server identities
  if (tools.minimal && tools.python) {
    const indexDir = resolve(home, '.local/mcp-servers/knowledge-rag/vectordb/web-scaffold');
    const indexPath = resolve(indexDir, 'embeddings.json');

    // Ensure index directory exists
    mkdirSync(indexDir, { recursive: true });

    servers['knowledge'] = {
      command: tools.python,
      args: [tools.minimal, 'knowledge'],
      env: { PROJECT_ROOT: root, KNOWLEDGE_INDEX_PATH: indexPath },
    };

    servers['mind'] = {
      command: tools.python,
      args: [tools.minimal, 'mind'],
      env: { PROJECT_ROOT: root, KNOWLEDGE_INDEX_PATH: indexPath },
    };

    servers['feature-metadata'] = {
      command: tools.python,
      args: [tools.minimal, 'feature-metadata'],
      env: { FEATURE_META_PROJECT_ROOT: root },
    };

    servers['context-bundle'] = {
      command: tools.python,
      args: [tools.minimal, 'context-bundle'],
      env: { BUNDLE_PROJECT_ROOT: root },
    };

    servers['change-impact'] = {
      command: tools.python,
      args: [tools.minimal, 'change-impact'],
      env: { PROJECT_ROOT: root },
    };
  }

  return { mcpServers: servers };
}

// --- Step 3: Write configs ---

function writeConfigs(config) {
  const json = JSON.stringify(config, null, 2);
  const serverCount = Object.keys(config.mcpServers).length;

  // Claude Code
  const claudePath = resolve(root, '.mcp.json');
  writeFileSync(claudePath, json + '\n');
  console.log(`Wrote ${claudePath} (Claude Code) — ${serverCount} servers`);

  // Kiro
  const kiroDir = resolve(root, '.kiro/settings');
  mkdirSync(kiroDir, { recursive: true });
  const kiroPath = resolve(kiroDir, 'mcp.json');
  writeFileSync(kiroPath, json + '\n');
  console.log(`Wrote ${kiroPath} (Kiro) — ${serverCount} servers`);

  // CLAUDE.local.md
  const localMd = resolve(root, 'CLAUDE.local.md');
  const template = resolve(root, 'CLAUDE.local.md.template');
  if (!existsSync(localMd) && existsSync(template)) {
    copyFileSync(template, localMd);
    console.log(`Copied CLAUDE.local.md.template -> CLAUDE.local.md`);
  }
}

// --- Step 4: Initial Zoekt index (only if opted in) ---

function indexZoekt(tools) {
  if (!tools.zoektIndex) return;

  console.log('\nRunning initial Zoekt index...');
  try {
    execSync(`"${tools.zoektIndex}" -index ~/.zoekt/index -branches main "${root}"`, {
      stdio: 'pipe',
      timeout: 60000,
    });
    console.log('[OK] Zoekt index created');
  } catch (e) {
    console.log('[WARN] Zoekt index failed — run manually: zoekt-git-index -index ~/.zoekt/index -branches main .');
  }
}

// --- Step 5: Git hooks ---

function installHooks() {
  const hookScript = resolve(root, 'scripts/install-hooks.sh');
  if (existsSync(hookScript)) {
    console.log('\nInstalling git hooks...');
    try {
      execSync(`bash "${hookScript}"`, { stdio: 'inherit', cwd: root });
    } catch {
      console.log('[WARN] Hook install failed — run manually: bash scripts/install-hooks.sh');
    }
  }
}

// --- Main ---

console.log('=== MCP Setup ===\n');

verifyGitignore();
const tools = detectTools();
const config = buildConfig(tools);
writeConfigs(config);
indexZoekt(tools);
installHooks();

const serverCount = Object.keys(config.mcpServers).length;

console.log('\n=== Done ===\n');
console.log(`${serverCount} MCP servers configured for Claude Code and Kiro.`);
console.log('All generated files are gitignored.\n');

console.log('Next steps:');
console.log('  1. npm install');
console.log('  2. npm run health-gate');
if (tools.zoektWeb) {
  console.log('  3. Start Zoekt: zoekt-webserver -index ~/.zoekt/index -listen :6070 &');
}
