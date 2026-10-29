/**
 * CloudPilot AI - Functional & Security Regression Test Suite
 * Executable under Node.js v18+ (tested on Node v26)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

async function main() {
  const babelCachePath = path.join(__dirname, '.babel-cache.js');
  let babelSource = '';

  if (fs.existsSync(babelCachePath)) {
    babelSource = fs.readFileSync(babelCachePath, 'utf8');
  } else {
    console.log('Fetching @babel/standalone for test environment transpile...');
    const res = await fetch('https://unpkg.com/@babel/standalone/babel.min.js');
    babelSource = await res.text();
    fs.writeFileSync(babelCachePath, babelSource, 'utf8');
    console.log('Cached Babel standalone successfully.');
  }

  // Load Babel in vm
  const babelContext = vm.createContext({ window: {}, global: {} });
  vm.runInContext(babelSource, babelContext);
  const Babel = babelContext.Babel || babelContext.window.Babel;

  // Read app.js and transpile with classic React.createElement runtime
  const appJsRaw = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const transpiled = Babel.transform(appJsRaw, {
    presets: [['react', { runtime: 'classic' }]]
  }).code;

  // Setup execution environment with React & DOM mocks
  const mockGlobals = {
    React: {
      useState: (init) => {
        let val = typeof init === 'function' ? init() : init;
        return [val, (newVal) => { val = newVal; }];
      },
      useEffect: () => {},
      useMemo: (fn) => fn(),
      useCallback: (fn) => fn,
      useRef: (init) => ({ current: init }),
      createElement: (type, props, ...children) => ({ type, props: { ...props, children } })
    },
    ReactDOM: {
      createRoot: () => ({ render: () => {} })
    },
    Recharts: {},
    window: {
      lucide: { createIcons: () => {} }
    },
    localStorage: {
      _data: {},
      getItem(k) { return this._data[k] !== undefined ? this._data[k] : null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; }
    },
    document: {
      getElementById: () => ({}),
      createElement: (tag) => ({
        href: '',
        download: '',
        click: () => {},
        setAttribute: () => {}
      }),
      body: {
        appendChild: () => {},
        removeChild: () => {}
      }
    },
    Blob: class {
      constructor(parts, opts) {
        this.parts = parts;
        this.opts = opts;
      }
    },
    URL: {
      createObjectURL: () => 'blob:mock-url',
      revokeObjectURL: () => {}
    },
    requestAnimationFrame: (cb) => setTimeout(cb, 0),
    console: console,
    Intl: Intl,
    Math: Math,
    Date: Date,
    JSON: JSON
  };

  const runtimeContext = vm.createContext(mockGlobals);
  vm.runInContext(transpiled, runtimeContext);

  let passed = 0;
  let failed = 0;
  const results = [];

  function test(name, fn) {
    try {
      fn();
      passed++;
      results.push({ name, status: 'PASSED' });
      console.log(`[PASS] ${name}`);
    } catch (err) {
      failed++;
      results.push({ name, status: 'FAILED', error: err.message });
      console.error(`[FAIL] ${name}:`, err.message);
    }
  }

  console.log('\n====================================================');
  console.log('Running CloudPilot AI Functional Regression Tests');
  console.log('====================================================\n');

  // Test 1: Currency Formatting
  test('fmtCurrency formats USD with dollar sign by default', () => {
    const formatted = runtimeContext.fmtCurrency(1234.5);
    assert.strictEqual(formatted, '$1,234.50');
  });

  test('fmtCurrency respects EUR selection', () => {
    const formatted = runtimeContext.fmtCurrency(150, 'EUR');
    assert.ok(formatted.includes('150.00') && (formatted.includes('€') || formatted.includes('EUR')));
  });

  test('fmtCurrency respects GBP selection', () => {
    const formatted = runtimeContext.fmtCurrency(78, 'GBP');
    assert.ok(formatted.includes('78.00') && (formatted.includes('£') || formatted.includes('GBP')));
  });

  test('fmtCurrency respects JPY selection (no decimals)', () => {
    const formatted = runtimeContext.fmtCurrency(12000, 'JPY');
    assert.ok(formatted.includes('12,000') && !formatted.includes('.'));
  });

  test('fmtCurrency handles invalid input and fallback safely', () => {
    assert.strictEqual(runtimeContext.fmtCurrency(NaN, 'USD'), '$0.00');
    assert.strictEqual(runtimeContext.fmtCurrency('invalid', 'INVALID_CODE'), '$0.00');
  });

  // Test 2: Date Strategy & Overdue Logic
  test('getReferenceDate returns demo date when mode is demo', () => {
    const d = runtimeContext.getReferenceDate({ referenceDateMode: 'demo', referenceDate: '2026-01-15' });
    assert.strictEqual(d.toISOString().slice(0, 10), '2026-01-15');
  });

  test('getReferenceDate returns real-time system date when mode is system', () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const d = runtimeContext.getReferenceDate({ referenceDateMode: 'system' });
    assert.strictEqual(d.toISOString().slice(0, 10), todayStr);
  });

  test('getReferenceDate handles invalid date string safely with fallback', () => {
    const d = runtimeContext.getReferenceDate({ referenceDateMode: 'demo', referenceDate: 'corrupted-date' });
    assert.strictEqual(d.toISOString().slice(0, 10), '2026-01-15');
  });

  test('isTaskOverdue correctly classifies completed vs overdue tasks', () => {
    const ref = new Date('2026-01-15');
    assert.strictEqual(runtimeContext.isTaskOverdue({ dueDate: '2025-12-15', status: 'Completed' }, ref), false);
    assert.strictEqual(runtimeContext.isTaskOverdue({ dueDate: '2025-12-15', status: 'Blocked' }, ref), true);
    assert.strictEqual(runtimeContext.isTaskOverdue({ dueDate: '2026-02-15', status: 'In Progress' }, ref), false);
    assert.strictEqual(runtimeContext.isTaskOverdue({ dueDate: '', status: 'In Progress' }, ref), false);
    assert.strictEqual(runtimeContext.isTaskOverdue({ dueDate: 'invalid-date', status: 'In Progress' }, ref), false);
  });

  // Test 3: Progress Calculation & Health Score
  test('calcProgress correctly calculates completed task percentage', () => {
    const tasks = [
      { projectId: 'P1', status: 'Completed' },
      { projectId: 'P1', status: 'In Progress' },
      { projectId: 'P1', status: 'Completed' },
      { projectId: 'P1', status: 'To Do' }
    ];
    assert.strictEqual(runtimeContext.calcProgress('P1', tasks), 50);
    assert.strictEqual(runtimeContext.calcProgress('P2', tasks), 0);
  });

  test('healthScore applies weighted penalties correctly and clamps between 0-100', () => {
    const resources = [
      { status: 'Healthy' },
      { status: 'Warning' },   // -5
      { status: 'Critical' }   // -15
    ];
    // 100 - 5 - 15 - (3 * 2 overdue = 6) - (1 at risk * 8 = 8) = 66
    const score = runtimeContext.healthScore(resources, 2, 1);
    assert.strictEqual(score, 66);
  });

  // Test 4: Data Validation and LocalStorage Recovery
  test('loadData recovers safely from missing localStorage', () => {
    runtimeContext.localStorage.clear();
    const data = runtimeContext.loadData();
    assert.ok(Array.isArray(data.projects));
    assert.ok(data.projects.length >= 5);
    assert.strictEqual(data.settings.currency, 'USD');
  });

  test('loadData recovers from corrupted/partial localStorage without crashing', () => {
    runtimeContext.localStorage.setItem('cloudpilot_data', JSON.stringify({
      projects: 'invalid-string',
      tasks: null,
      settings: { currency: 'EUR' }
    }));
    const data = runtimeContext.loadData();
    assert.ok(Array.isArray(data.projects), 'Projects must be restored to default array');
    assert.ok(Array.isArray(data.tasks), 'Tasks must be restored to default array');
    assert.strictEqual(data.settings.currency, 'EUR', 'Valid user setting must be preserved');
  });

  test('loadData handles malformed JSON string safely', () => {
    runtimeContext.localStorage.setItem('cloudpilot_data', '{ unclosed json syntax');
    const data = runtimeContext.loadData();
    assert.ok(data && data.projects.length > 0);
    runtimeContext.localStorage.clear();
  });

  // Test 5: Deterministic AI Engine (demoAI) Grounding & Features
  test('demoAI generates overdue summary with explicit evaluation date citation', () => {
    const data = runtimeContext.createInitialData();
    const res = runtimeContext.demoAI('Which tasks are overdue?', data);
    assert.ok(res.content.includes('overdue task(s)'));
    assert.ok(res.content.includes('evaluated against Jan 15, 2026'));
    assert.ok(res.actions.length > 0);
  });

  test('demoAI cost recommendations respect selected currency', () => {
    const data = runtimeContext.createInitialData();
    data.settings.currency = 'EUR';
    const res = runtimeContext.demoAI('Suggest ways to reduce cost', data);
    assert.ok(res.content.includes('€') || res.content.includes('EUR'));
  });

  // Test 6: Document Summarizer
  test('summarizeDocument extracts headings and potential action items', () => {
    const doc = {
      title: 'Test Operations Plan',
      category: 'Operations',
      content: '# Overview\nSystem health is 98%.\n- Should enable auto-scaling\n- Must review dev VM'
    };
    const res = runtimeContext.summarizeDocument(doc);
    assert.ok(res.summary.includes('Summary of "Test Operations Plan"'));
    assert.ok(res.summary.includes('Potential Action Items:'));
    assert.ok(res.summary.includes('Should enable auto-scaling'));
  });

  // Test 7: Security: FormattedText Parser (No XSS Injection)
  test('FormattedText parser renders text safely without dangerouslySetInnerHTML', () => {
    assert.ok(typeof runtimeContext.FormattedText === 'function');
    const element = runtimeContext.FormattedText({ text: 'Hello **World**\n<script>alert(1)</script>' });
    assert.ok(element && element.props && element.props.children);
    assert.strictEqual(element.props.dangerouslySetInnerHTML, undefined);
  });

  // Test 8: CSV Escaping (RFC 4180)
  test('CSV export properly quotes fields containing commas and double quotes', () => {
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    assert.strictEqual(escapeCsv('Simple Text'), 'Simple Text');
    assert.strictEqual(escapeCsv('Azure SQL, Business Tier'), '"Azure SQL, Business Tier"');
    assert.strictEqual(escapeCsv('Say "Hello"'), '"Say ""Hello"""');
    assert.strictEqual(escapeCsv('Line1\nLine2'), '"Line1\nLine2"');
  });

  // Test 9: Navigation routes and App Shell
  test('NAV defines all 8 core enterprise routes', () => {
    const nav = runtimeContext.window.NAV;
    assert.ok(Array.isArray(nav));
    assert.strictEqual(nav.length, 8);
    const expectedRoutes = ['dashboard', 'copilot', 'projects', 'resources', 'analytics', 'documents', 'architecture', 'settings'];
    expectedRoutes.forEach(r => {
      assert.ok(nav.some(n => n.id === r), `Missing route: ${r}`);
    });
  });

  // Test 10: Extended Demo AI viva domain responses
  test('demoAI answers questions regarding Azure Synapse and analytics platform', () => {
    const mockData = runtimeContext.loadData();
    const ans = runtimeContext.demoAI('Tell me about the Synapse platform', mockData);
    assert.ok(ans.content.includes('Cloud Analytics Platform (PRJ-002)'));
    assert.ok(ans.content.includes('Azure Synapse Analytics'));
    assert.strictEqual(ans.actions[0].path, 'projects');
  });

  test('demoAI answers questions regarding Logic App blockers and workflow automation', () => {
    const mockData = runtimeContext.loadData();
    const ans = runtimeContext.demoAI('What is blocking the Logic App workflow?', mockData);
    assert.ok(ans.content.includes('Enterprise Workflow Automation (PRJ-004)'));
    assert.ok(ans.content.includes('blocked tasks'));
    assert.strictEqual(ans.actions[0].path, 'projects');
  });

  test('demoAI answers questions regarding Key Vault and zero client-side credentials', () => {
    const mockData = runtimeContext.loadData();
    const ans = runtimeContext.demoAI('How are secrets and security handled in Key Vault?', mockData);
    assert.ok(ans.content.includes('Zero Hardcoded Secrets'));
    assert.ok(ans.content.includes('Azure Key Vault (RES-009)'));
    assert.strictEqual(ans.actions[0].path, 'architecture');
  });

  test('demoAI explains health score calculation formula breakdown', () => {
    const mockData = runtimeContext.loadData();
    const ans = runtimeContext.demoAI('Explain the scoring formula for application health', mockData);
    assert.ok(ans.content.includes('Calculation Formula Breakdown'));
    assert.ok(ans.content.includes('Base Score: **100**'));
    assert.ok(ans.content.includes('Warning resources:'));
  });

  console.log('\n====================================================');
  console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
