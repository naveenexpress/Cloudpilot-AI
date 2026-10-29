/**
 * CloudPilot AI - Headless Chrome End-to-End Navigation & Render Test
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:8080/index.html";

console.log('====================================================');
console.log('Running CloudPilot AI Headless Chrome E2E Test');
console.log('====================================================\n');

// 1. Verify Chrome executable exists
assert.ok(fs.existsSync(CHROME_PATH), 'Chrome executable not found at ' + CHROME_PATH);

// 2. Dump rendered DOM from running HTTP server
const tempDumpPath = path.join(__dirname, '.temp-e2e-dump.html');
const cmd = `"${CHROME_PATH}" --headless --disable-gpu --dump-dom --virtual-time-budget=4000 "${BASE_URL}"`;

try {
  const domOutput = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.writeFileSync(tempDumpPath, domOutput, 'utf8');

  // Assertions on rendered DOM
  assert.ok(domOutput.includes('id="root"'), 'Root element missing');
  assert.ok(domOutput.includes('Welcome back'), 'Dashboard welcome header missing');
  assert.ok(domOutput.includes('Active Projects'), 'KPI Active Projects missing');
  assert.ok(domOutput.includes('Evaluation Date: Jan 15, 2026'), 'Evaluation date missing in Dashboard header');
  assert.ok(domOutput.includes('CloudPilot AI'), 'Branding title missing');
  assert.ok(domOutput.includes('Ask AI Copilot'), 'AI Copilot shortcut missing');
  assert.ok(domOutput.includes('recharts-layer'), 'Recharts SVG charts failed to render');

  console.log('[PASS] Baseline page render and Recharts SVG generation verified in Headless Chrome');
} catch (err) {
  console.error('[FAIL] Chrome DOM dump failed:', err.message);
  process.exit(1);
}

// 3. Verify console output has zero errors
try {
  const consoleCmd = `"${CHROME_PATH}" --headless --disable-gpu --enable-logging=stderr --v=1 --virtual-time-budget=3000 "${BASE_URL}" 2>&1`;
  const consoleOutput = execSync(consoleCmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

  const fatalErrors = consoleOutput
    .split('\n')
    .filter(line => line.includes('Uncaught') || line.includes('TypeError') || line.includes('ReferenceError') || line.includes('SyntaxError'));

  assert.strictEqual(fatalErrors.length, 0, `Detected unexpected console errors: ${fatalErrors.join(', ')}`);
  console.log('[PASS] Browser console reports 0 runtime errors (Recharts and PropTypes clean)');
} catch (err) {
  console.error('[FAIL] Console error check failed:', err.message);
  process.exit(1);
}

// Clean up temp file
try { fs.unlinkSync(tempDumpPath); } catch (e) {}

console.log('\n====================================================');
console.log('All Headless Browser E2E Checks Passed Successfully!');
console.log('====================================================');
process.exit(0);

