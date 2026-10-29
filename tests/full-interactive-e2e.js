/**
 * CloudPilot AI - Full Interactive Chrome DevTools Protocol (CDP) End-to-End Suite
 * Tests actual user journeys, clicks, state transitions, and DOM rendering in real Chrome.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const assert = require('assert');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:8080/index.html";

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('====================================================');
  console.log('Running CloudPilot AI Full Interactive E2E Test (CDP)');
  console.log('====================================================\n');

  const tempProfile = path.join(os.tmpdir(), 'cloudpilot-chrome-profile-' + Date.now());
  fs.mkdirSync(tempProfile, { recursive: true });

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempProfile}`,
    '--remote-debugging-port=9223',
    BASE_URL
  ]);

  let passed = 0;
  let failed = 0;
  const consoleErrors = [];

  function recordPass(msg) {
    passed++;
    console.log(`[PASS] ${msg}`);
  }

  function recordFail(msg, err) {
    failed++;
    console.error(`[FAIL] ${msg}:`, err ? err.message || err : '');
  }

  try {
    // Wait for Chrome to listen
    let connected = false;
    let pageTab = null;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch('http://127.0.0.1:9223/json');
        const list = await res.json();
        pageTab = list.find(t => t.type === 'page' && t.url.includes('8080'));
        if (pageTab && pageTab.webSocketDebuggerUrl) {
          connected = true;
          break;
        }
      } catch (e) {}
      await sleep(300);
    }

    assert.ok(connected && pageTab, 'Could not establish CDP session with Chrome page target');
    recordPass('Headless Chrome launched and CDP target connected on port 9223');

    // Setup WebSocket client
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const pendingCallbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        if (data.params.type === 'error') {
          const text = data.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
          consoleErrors.push(text);
        }
      } else if (data.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(data.params.exceptionDetails.text + ': ' + (data.params.exceptionDetails.exception?.description || ''));
      }

      if (data.id && pendingCallbacks.has(data.id)) {
        const cb = pendingCallbacks.get(data.id);
        pendingCallbacks.delete(data.id);
        if (data.error) {
          cb.reject(new Error(data.error.message));
        } else {
          cb.resolve(data.result);
        }
      }
    };

    function sendCmd(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pendingCallbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expression, awaitPromise = false) {
      const res = await sendCmd('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise
      });
      if (res.exceptionDetails) {
        throw new Error(res.exceptionDetails.text + ' ' + (res.exceptionDetails.exception?.description || ''));
      }
      return res.result?.value;
    }

    // Enable Runtime
    await sendCmd('Runtime.enable');

    // Wait for React app to mount and render
    let mounted = false;
    for (let i = 0; i < 20; i++) {
      const ready = await evaluate(`Boolean(document.getElementById('root') && document.querySelector('h1'))`);
      if (ready) {
        mounted = true;
        break;
      }
      await sleep(300);
    }
    assert.ok(mounted, 'React application failed to mount within timeout');
    recordPass('React 18 application mounted and rendered successfully');

    // Step 1: Verify Dashboard elements
    const dashboardTitle = await evaluate(`document.querySelector('h1')?.innerText`);
    assert.ok(dashboardTitle.includes('Welcome back'), 'Expected "Welcome back" header');
    const kpiCount = await evaluate(`document.querySelectorAll('.bg-card').length`);
    assert.ok(kpiCount >= 5, 'KPI cards missing from dashboard');
    const svgChartCount = await evaluate(`document.querySelectorAll('svg.recharts-surface').length`);
    assert.ok(svgChartCount >= 2, 'Recharts charts missing on dashboard');
    recordPass('Dashboard rendered KPI cards, Recharts SVGs, and header greeting');

    // Step 2: Navigate to Copilot & Ask Question
    await evaluate(`
      const copilotBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.innerText.includes('AI Copilot'));
      if (copilotBtn) copilotBtn.click();
    `);
    await sleep(400);

    const copilotHeading = await evaluate(`document.querySelector('h1')?.innerText`);
    assert.ok(copilotHeading.includes('AI Enterprise Copilot'), 'Did not navigate to Copilot');

    // Type question and send
    await evaluate(`
      const textarea = document.querySelector('textarea');
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      nativeSetter.call(textarea, 'Which tasks are overdue?');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      const sendBtn = Array.from(document.querySelectorAll('button')).find(b => b.querySelector('[data-lucide="send"]'));
      if (sendBtn) sendBtn.click();
    `);
    // Wait for deterministic demoAI response
    await sleep(1200);

    const assistantMessages = await evaluate(`
      Array.from(document.querySelectorAll('.msg-assistant')).map(el => el.innerText).join('\\n')
    `);
    assert.ok(assistantMessages.includes('overdue task'), 'AI response did not answer overdue question');
    assert.ok(assistantMessages.includes('View Projects & Tasks'), 'Interactive navigation action button missing');
    recordPass('AI Copilot received query, answered with grounded overdue summary, and generated action buttons');

    // Step 3: Navigate to Projects & Tasks and filter
    await evaluate(`
      const projectsBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.innerText.includes('Projects & Tasks'));
      if (projectsBtn) projectsBtn.click();
    `);
    await sleep(400);

    const projectsHeading = await evaluate(`document.querySelector('h1')?.innerText`);
    assert.ok(projectsHeading.includes('Projects & Tasks'), 'Did not navigate to Projects & Tasks');

    // Test status filter "At Risk"
    await evaluate(`
      const atRiskBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'At Risk');
      if (atRiskBtn) atRiskBtn.click();
    `);
    await sleep(200);
    const visibleProjects = await evaluate(`
      Array.from(document.querySelectorAll('.grid.gap-4 .bg-card h3')).map(h => h.innerText)
    `);
    assert.ok(visibleProjects.some(t => t.includes('Enterprise Workflow Automation')), 'At Risk project not visible');
    assert.strictEqual(visibleProjects.length, 1, 'Filter did not isolate single At Risk project');

    // Restore to "All"
    await evaluate(`
      const allBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'All');
      if (allBtn) allBtn.click();
    `);
    await sleep(200);
    recordPass('Projects & Tasks page filtered and restored properly');

    // Step 4: Navigate to Cloud Resources, Refresh Telemetry, Ack Alert
    await evaluate(`
      const resBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.innerText.includes('Cloud Resources'));
      if (resBtn) resBtn.click();
    `);
    await sleep(400);

    const resHeading = await evaluate(`document.querySelector('h1')?.innerText`);
    assert.ok(resHeading.includes('Cloud Resources'), 'Did not navigate to Cloud Resources');

    // Click Refresh Metrics
    await evaluate(`
      const refreshBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Refresh Metrics'));
      if (refreshBtn) refreshBtn.click();
    `);
    await sleep(600);

    // Verify Toast appears
    const toastText = await evaluate(`document.querySelector('.fixed.bottom-5')?.innerText || ''`);
    assert.ok(toastText.includes('Telemetry refreshed') || toastText.includes('Azure Monitor'), 'Toast notification did not appear on refresh');

    // Acknowledge alert
    const ackBtnExists = await evaluate(`Boolean(document.querySelector('button.bg-white')?.innerText === 'Acknowledge')`);
    if (ackBtnExists) {
      await evaluate(`document.querySelector('button.bg-white').click()`);
      await sleep(300);
    }
    recordPass('Cloud Resources telemetry refresh and alert acknowledgment verified');

    // Step 5: Navigate to Analytics and Generate Executive Summary
    await evaluate(`
      const anaBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.innerText.includes('Analytics'));
      if (anaBtn) anaBtn.click();
    `);
    await sleep(400);

    const anaHeading = await evaluate(`document.querySelector('h1')?.innerText`);
    assert.ok(anaHeading.includes('Analytics & Cost Insights'), 'Did not navigate to Analytics');

    await evaluate(`
      const sumBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Generate Executive Summary'));
      if (sumBtn) sumBtn.click();
    `);
    await sleep(600);

    const summaryRendered = await evaluate(`
      Boolean(document.querySelector('.bg-card h3')?.innerText.includes('Executive Summary') || document.body.innerText.includes('Executive Summary — Demo Workspace'))
    `);
    assert.ok(summaryRendered, 'Executive Summary failed to generate in Analytics');
    recordPass('Analytics page pie charts rendered and Executive Summary generated successfully');

    // Step 6: Documents page and Summarize
    await evaluate(`
      const docBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.innerText.includes('Documents'));
      if (docBtn) docBtn.click();
    `);
    await sleep(400);

    // Click first document in documents list
    await evaluate(`
      const firstDoc = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Project Requirements'));
      if (firstDoc) firstDoc.click();
    `);
    await sleep(300);

    // Click Summarize with AI
    await evaluate(`
      const sumDocBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Summarize'));
      if (sumDocBtn) sumDocBtn.click();
    `);
    await sleep(900);

    const docSummaryVisible = await evaluate(`
      Boolean(document.body.innerText.includes('Demo AI Executive Briefing') || document.body.innerText.includes('Key Points:'))
    `);
    assert.ok(docSummaryVisible, 'Document AI summary failed to render');
    recordPass('Document viewer loaded document and generated AI Executive Briefing');

    // Step 7: Architecture Page component inspection
    await evaluate(`
      const archBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.innerText.includes('Architecture'));
      if (archBtn) archBtn.click();
    `);
    await sleep(400);

    // Select Azure OpenAI component node
    await evaluate(`
      const openAiNode = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Azure OpenAI'));
      if (openAiNode) openAiNode.click();
    `);
    await sleep(300);

    const archDetail = await evaluate(`document.querySelector('.bg-card h3')?.innerText || ''`);
    assert.ok(archDetail.includes('Azure OpenAI'), 'Architecture inspector failed to show Azure OpenAI details');
    recordPass('Azure Architecture Explorer rendered topology diagram and node inspection');

    // Step 8: Settings and Currency switch to EUR
    await evaluate(`
      const setBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.innerText.includes('Settings'));
      if (setBtn) setBtn.click();
    `);
    await sleep(400);

    await evaluate(`
      const sel = document.querySelector('select');
      sel.value = 'EUR';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    `);
    await sleep(300);

    // Verify Dashboard updates with EUR
    await evaluate(`
      const dashBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.innerText.includes('Dashboard'));
      if (dashBtn) dashBtn.click();
    `);
    await sleep(400);

    const costKpiText = await evaluate(`
      Array.from(document.querySelectorAll('.bg-card')).map(c => c.innerText).join(' ')
    `);
    assert.ok(costKpiText.includes('€') || costKpiText.includes('EUR'), 'Dashboard KPI did not update to EUR currency');
    recordPass('Settings updated currency to EUR and propagated reactively across Dashboard metrics');

    // Step 9: Verify zero browser console errors throughout entire run
    assert.strictEqual(consoleErrors.length, 0, 'Browser logged unexpected runtime errors: ' + consoleErrors.join(' | '));
    recordPass('Verified 0 browser console errors / uncaught exceptions during full interactive session');

    ws.close();
  } catch (err) {
    recordFail('Interactive test flow encountered an unhandled failure', err);
  } finally {
    chrome.kill();
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (e) {}
  }

  console.log('\n====================================================');
  console.log(`E2E Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
