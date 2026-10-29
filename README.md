# CloudPilot AI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Intelligent enterprise operational governance prototype featuring simulated Azure infrastructure telemetry, dynamic portfolio delivery metrics, and a deterministically grounded AI Copilot running 100% locally.

---

## Overview

**CloudPilot AI** is a client-side enterprise Single-Page Application (SPA) designed to demonstrate unified project governance, cloud infrastructure observability, and artificial intelligence integration inspired by Microsoft Azure reference architectures.

The application allows engineering leaders, project managers, and cloud architects to:
* **Track multi-project portfolios**: Monitor delivery milestones, track team work items, and dynamically calculate completion progress from granular task statuses.
* **Observe cloud infrastructure telemetry**: Inspect virtualized Azure resources (App Service, Functions, SQL Database, Blob Storage, Cosmos DB, Azure OpenAI, Key Vault) with realistic APM load simulation and alert acknowledgment workflows.
* **Interact with an AI Enterprise Copilot**: Natural language question-answering grounded deterministically in local workspace data without requiring external paid API keys or cloud connections.
* **Analyze cloud costs & delivery trends**: Evaluate spend by Azure service category, generate automated executive summaries, and export RFC 4180-compliant CSV reports.
* **Explore Azure deployment blueprints**: Review interactive architectural topologies mapping frontend, backend API, data storage, identity (Entra ID), observability (Azure Monitor), and secrets management (Key Vault).
* **Operate 100% offline**: Self-contained local vendor bundle eliminates any dependency on campus Wi-Fi or internet access during live demonstrations.

---

## Features

### 1. Executive Operations Dashboard
* Real-time portfolio progress bar charts and 6-week task velocity trend powered by Recharts.
* 6 executive KPI cards: Active Projects, Open Tasks, Completed Tasks, Overdue Tasks, Cloud Resources, and Application Health Score.
* Heuristic Application Health Score formula (0–100) dynamically penalized by warning resources, critical resources, overdue tasks, and at-risk initiatives.
* Actionable AI business insight cards with deep navigation links.

### 2. AI Enterprise Copilot
* Deterministic heuristic question-answering grounded strictly in local workspace telemetry and tasks.
* Answer generation for overdue analysis, project blockers (e.g. Logic App connectors in PRJ-004), Synapse star-schema status (PRJ-002), Key Vault zero-secret security models, and cost optimization.
* Deep-linking action buttons (`View Projects & Tasks →`, `Analytics →`, `Dashboard →`).
* One-click clipboard copy with animated toast notification feedback.

### 3. Projects & Work Item Governance
* Project portfolio tracking with reactive progress calculation (`calcProgress`) updated automatically when task statuses change.
* Task management with inline status dropdowns (`To Do`, `In Progress`, `Blocked`, `Completed`) and priority badges (`Critical`, `High`, `Medium`, `Low`).
* Project and task creation/editing modals with field validation (empty title prevention).
* Overdue detection evaluated against a configurable timeline anchor.

### 4. Cloud Infrastructure Telemetry
* 12 virtualized Azure cloud services categorized across Compute, Database, Storage, AI, Security, and Monitoring.
* **"Refresh Metrics"** interaction that simulates ARM REST polling with realistic CPU and memory jitter.
* Operational alert monitoring and acknowledgment workflow with transition to a verified healthy status banner.
* Architectural resource inspection modal detailing service tiers, environments, regions, and integration blueprints.

### 5. Analytics & Cost Intelligence
* Spend distribution by service category rendered via Recharts PieChart.
* Task status distribution breakdown.
* Automated **Executive Summary** generator summarizing high-risk blockers and operational recommendations.
* RFC 4180-compliant **CSV Export** with comma/quote escaping and automatic object URL cleanup.

### 6. Documents & AI Briefings
* In-browser markdown document viewer for requirements specifications, deployment plans, operations reports, and risk assessments.
* Pre-loaded default selection on view with auto-generated **Demo AI Executive Briefing** extracting key points and potential action directives.

### 7. Azure Architecture Explorer
* Interactive topology diagram mapping the request flow:
  $$\text{User} \longrightarrow \text{Microsoft Entra ID} \longrightarrow \text{Frontend (Static Web Apps)} \longrightarrow \text{Backend API (Functions)} \longrightarrow \text{Data / AI / Secrets}$$
* Clickable nodes for Azure SQL, Cosmos DB, Azure OpenAI, Blob Storage, Azure Monitor / Application Insights, and Azure Key Vault.

### 8. Settings & Workspace Configuration
* Workspace branding customization reflected live in the application header.
* Multi-currency switcher with `Intl.NumberFormat` support: `USD ($)`, `EUR (€)`, `GBP (£)`, `CAD (C$)`, `AUD (A$)`, `JPY (¥)`.
* Timeline evaluation date strategy: Configurable **Demo Anchor** (`2026-01-15`) vs. **System Real-Time**.
* Two-step confirmed **Reset Dataset** restoring factory demo state in browser `localStorage`.

---

## Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (UMD) | Hooks-based architecture (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`) |
| **Component Validation** | PropTypes 15.8.1 (UMD) | Bundled before Recharts to guarantee stable runtime mounting |
| **Styling & Theme** | Tailwind CSS (Standalone Play) | Custom Nexora Enterprise corporate color palette |
| **Data Visualization** | Recharts 2.12.7 (UMD) | Responsive bar charts, line trends, and category pie charts |
| **Iconography** | Lucide Icons (UMD) | Batched rendering via `requestAnimationFrame` to prevent DOM layout thrashing |
| **Compilation** | @babel/standalone | Zero-build JSX compilation directly in the browser runtime |
| **Storage & Persistence**| Browser `localStorage` | Resilient JSON schema validation with fallback recovery |
| **Offline Dependencies** | Local `vendor/` bundle | All 7 libraries stored locally with CDN fallbacks |

---

## Project Structure

```
cloudpilot/
├── index.html                   # HTML5 application shell & offline vendor imports
├── app.js                       # React 18 components, seed data & business logic
├── package.json                 # Project metadata & test scripts
├── LICENSE                      # MIT License
├── README.md                    # Comprehensive documentation & presentation guide
├── vendor/                      # 100% offline vendor libraries
│   ├── react.production.min.js  # React 18 core
│   ├── react-dom.production.min.js # React 18 DOM renderer
│   ├── prop-types.min.js        # PropTypes 15.8.1 runtime
│   ├── babel.min.js             # @babel/standalone JSX browser compiler
│   ├── Recharts.js              # Recharts 2.12.7 chart engine
│   ├── lucide.js                # Lucide icons runtime
│   └── tailwind.js              # Tailwind CSS runtime engine
└── tests/                       # Automated regression & end-to-end test suites
    ├── run-tests.js             # 24 Functional, logic, schema & security unit tests
    ├── e2e-browser-test.js      # Headless Chrome DOM rendering & 0 console error audit
    └── full-interactive-e2e.js  # 11 Interactive user journey tests via Chrome DevTools Protocol
```

---

## Prerequisites

* A modern web browser: **Google Chrome**, **Microsoft Edge**, **Mozilla Firefox**, or **Brave**.
* Any basic HTTP static server (e.g., Python 3 or Node.js).
* Node.js v18+ (tested up to Node v26) is required only for running the automated test suites.

---

## Installation & Local Startup

1. Clone the repository:
   ```bash
   git clone https://github.com/naveenexpress/Cloudpilot-AI.git
   cd Cloudpilot-AI
   ```

2. Start the local server:

   **Using Python 3 (Recommended):**
   ```bash
   python -m http.server 8080
   ```

   **Using Node.js:**
   ```bash
   npx serve -l 8080 .
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## Automated Testing

CloudPilot AI includes three automated test suites:

### 1. Unit & Security Regression Tests (24 Checks)
Tests currency formatting across 6 ISO currencies, date anchor calculations, task overdue classifications, progress percentages, health score mathematical formulas, corrupted `localStorage` recovery, safe text rendering (XSS prevention), RFC 4180 CSV escaping, and domain Q&A grounding:
```bash
node tests/run-tests.js
```

### 2. Headless Chrome Baseline & Console Audit (2 Checks)
Launches headless Google Chrome, captures rendered DOM, verifies Recharts SVG generation, and verifies 0 runtime console errors:
```bash
node tests/e2e-browser-test.js
```

### 3. Interactive User Journey E2E Tests via CDP (11 Checks)
Uses the Chrome DevTools Protocol (CDP) to automate real user journeys: navigation across all 8 views, Copilot Q&A submission, project filtering, metrics refresh, alert acknowledgment, executive summary generation, document viewing, and settings currency switching:
```bash
node tests/full-interactive-e2e.js
```

---

## Distribution & Release

Release archive bundles for offline deployment can be generated directly:

```bash
# Create zip release archive
powershell Compress-Archive -Path index.html, app.js, vendor, tests, package.json, README.md, LICENSE -DestinationPath release/cloudpilot-ai-v1.0.0.zip
```

Download pre-packaged release archives from the [GitHub Releases](https://github.com/naveenexpress/Cloudpilot-AI/releases) page.

---

## Limitations

* **Simulated Telemetry:** Infrastructure metrics (CPU, RAM, storage) and cost values are simulated client-side for academic presentation; they do not incur live Azure subscription charges.
* **In-Browser Babel Transpilation:** For zero-setup academic portability, JSX is compiled in the browser by `@babel/standalone`. In a commercial enterprise release, ahead-of-time (AOT) bundling (e.g. Vite) is recommended.
* **Storage Boundary:** User modifications and new tasks are persisted in browser `localStorage`. A production rollout would connect to an authenticated Azure Functions API with Azure SQL / Cosmos DB.

---

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Ensure all tests pass (`node tests/run-tests.js && node tests/e2e-browser-test.js`).
4. Commit your changes (`git commit -m 'feat: add amazing feature'`).
5. Push to the branch (`git push origin feature/amazing-feature`).
6. Open a Pull Request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
