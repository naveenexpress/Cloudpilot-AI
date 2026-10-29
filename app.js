const { useState, useEffect, useMemo, useCallback, useRef } = React;
const RechartsObj = typeof Recharts !== 'undefined' ? Recharts : (typeof window !== 'undefined' && window.Recharts ? window.Recharts : {});
const {
  BarChart = () => null,
  Bar = () => null,
  LineChart = () => null,
  Line = () => null,
  XAxis = () => null,
  YAxis = () => null,
  CartesianGrid = () => null,
  Tooltip = () => null,
  ResponsiveContainer = ({ children }) => children,
  PieChart = () => null,
  Pie = () => null,
  Cell = () => null,
  Legend = () => null,
  AreaChart = () => null,
  Area = () => null
} = RechartsObj;

// ===================== INITIAL DATA =====================
const INITIAL_PROJECTS = [
  { id: 'PRJ-001', name: 'Customer Portal Modernization', description: 'Rebuild the customer-facing portal with modern React frontend and Azure backend services for improved UX and scalability.', owner: 'Sarah Chen', startDate: '2025-11-01', targetDate: '2026-03-15', status: 'In Progress' },
  { id: 'PRJ-002', name: 'Cloud Analytics Platform', description: 'Centralized analytics platform integrating Azure Synapse and Power BI for real-time business insights.', owner: 'Marcus Rivera', startDate: '2025-10-15', targetDate: '2026-02-28', status: 'In Progress' },
  { id: 'PRJ-003', name: 'Intelligent Document Processing', description: 'AI-powered document ingestion, classification, and extraction pipeline using Azure AI Document Intelligence.', owner: 'Priya Sharma', startDate: '2025-12-01', targetDate: '2026-04-30', status: 'Planning' },
  { id: 'PRJ-004', name: 'Enterprise Workflow Automation', description: 'Automate internal approval and notification workflows with Azure Logic Apps and Power Automate.', owner: 'James Okonkwo', startDate: '2025-09-01', targetDate: '2026-01-15', status: 'At Risk' },
  { id: 'PRJ-005', name: 'Internal Operations Dashboard', description: 'Unified operations dashboard for monitoring KPIs, incidents, and team performance.', owner: 'Elena Petrova', startDate: '2025-11-20', targetDate: '2026-05-01', status: 'In Progress' },
];

const INITIAL_TASKS = [
  { id: 'TSK-001', title: 'Design new portal information architecture', projectId: 'PRJ-001', assignee: 'Alex Kim', priority: 'High', dueDate: '2025-12-15', status: 'Completed' },
  { id: 'TSK-002', title: 'Implement authentication with Entra ID', projectId: 'PRJ-001', assignee: 'Sarah Chen', priority: 'Critical', dueDate: '2026-01-10', status: 'In Progress' },
  { id: 'TSK-003', title: 'Build responsive dashboard components', projectId: 'PRJ-001', assignee: 'Alex Kim', priority: 'High', dueDate: '2026-01-25', status: 'In Progress' },
  { id: 'TSK-004', title: 'Integrate payment gateway API', projectId: 'PRJ-001', assignee: 'Marcus Rivera', priority: 'Medium', dueDate: '2026-02-05', status: 'To Do' },
  { id: 'TSK-005', title: 'Performance testing and optimization', projectId: 'PRJ-001', assignee: 'James Okonkwo', priority: 'High', dueDate: '2026-02-28', status: 'To Do' },
  { id: 'TSK-006', title: 'Provision Azure Synapse workspace', projectId: 'PRJ-002', assignee: 'Marcus Rivera', priority: 'Critical', dueDate: '2025-11-30', status: 'Completed' },
  { id: 'TSK-007', title: 'Design star schema data model', projectId: 'PRJ-002', assignee: 'Priya Sharma', priority: 'High', dueDate: '2025-12-20', status: 'Completed' },
  { id: 'TSK-008', title: 'Build ETL pipelines for CRM data', projectId: 'PRJ-002', assignee: 'Marcus Rivera', priority: 'High', dueDate: '2026-01-15', status: 'In Progress' },
  { id: 'TSK-009', title: 'Create executive Power BI dashboards', projectId: 'PRJ-002', assignee: 'Elena Petrova', priority: 'Medium', dueDate: '2026-02-10', status: 'To Do' },
  { id: 'TSK-010', title: 'Configure row-level security', projectId: 'PRJ-002', assignee: 'Sarah Chen', priority: 'High', dueDate: '2026-02-20', status: 'To Do' },
  { id: 'TSK-011', title: 'Evaluate Azure Document Intelligence models', projectId: 'PRJ-003', assignee: 'Priya Sharma', priority: 'High', dueDate: '2026-01-05', status: 'In Progress' },
  { id: 'TSK-012', title: 'Define document classification taxonomy', projectId: 'PRJ-003', assignee: 'Elena Petrova', priority: 'Medium', dueDate: '2026-01-20', status: 'To Do' },
  { id: 'TSK-013', title: 'Build ingestion API with Azure Functions', projectId: 'PRJ-003', assignee: 'James Okonkwo', priority: 'High', dueDate: '2026-02-15', status: 'To Do' },
  { id: 'TSK-014', title: 'Map existing approval workflows', projectId: 'PRJ-004', assignee: 'James Okonkwo', priority: 'Critical', dueDate: '2025-10-30', status: 'Completed' },
  { id: 'TSK-015', title: 'Implement Logic App for purchase approvals', projectId: 'PRJ-004', assignee: 'James Okonkwo', priority: 'Critical', dueDate: '2025-12-15', status: 'Blocked' },
  { id: 'TSK-016', title: 'Integrate with Teams notifications', projectId: 'PRJ-004', assignee: 'Alex Kim', priority: 'High', dueDate: '2025-12-20', status: 'Blocked' },
  { id: 'TSK-017', title: 'UAT with finance and HR teams', projectId: 'PRJ-004', assignee: 'Elena Petrova', priority: 'High', dueDate: '2026-01-05', status: 'To Do' },
  { id: 'TSK-018', title: 'Production deployment and cutover', projectId: 'PRJ-004', assignee: 'James Okonkwo', priority: 'Critical', dueDate: '2026-01-15', status: 'To Do' },
  { id: 'TSK-019', title: 'Define KPI requirements with stakeholders', projectId: 'PRJ-005', assignee: 'Elena Petrova', priority: 'High', dueDate: '2025-12-10', status: 'Completed' },
  { id: 'TSK-020', title: 'Design dashboard wireframes', projectId: 'PRJ-005', assignee: 'Alex Kim', priority: 'Medium', dueDate: '2025-12-28', status: 'Completed' },
  { id: 'TSK-021', title: 'Implement real-time metrics widgets', projectId: 'PRJ-005', assignee: 'Alex Kim', priority: 'High', dueDate: '2026-01-30', status: 'In Progress' },
  { id: 'TSK-022', title: 'Connect to Application Insights', projectId: 'PRJ-005', assignee: 'Marcus Rivera', priority: 'Medium', dueDate: '2026-02-15', status: 'To Do' },
  { id: 'TSK-023', title: 'Add alert acknowledgment workflows', projectId: 'PRJ-005', assignee: 'Sarah Chen', priority: 'Low', dueDate: '2026-03-01', status: 'To Do' },
  { id: 'TSK-024', title: 'Security review of portal authentication', projectId: 'PRJ-001', assignee: 'Sarah Chen', priority: 'Critical', dueDate: '2026-01-20', status: 'To Do' },
  { id: 'TSK-025', title: 'Cost optimization review for Synapse', projectId: 'PRJ-002', assignee: 'Marcus Rivera', priority: 'Medium', dueDate: '2026-01-08', status: 'In Progress' },
  { id: 'TSK-026', title: 'Document AI model fine-tuning guide', projectId: 'PRJ-003', assignee: 'Priya Sharma', priority: 'Low', dueDate: '2026-03-01', status: 'To Do' },
  { id: 'TSK-027', title: 'Resolve blocker on Logic App connectors', projectId: 'PRJ-004', assignee: 'James Okonkwo', priority: 'Critical', dueDate: '2025-12-22', status: 'Blocked' },
  { id: 'TSK-028', title: 'Mobile responsiveness audit', projectId: 'PRJ-005', assignee: 'Alex Kim', priority: 'Medium', dueDate: '2026-02-20', status: 'To Do' },
];

const INITIAL_RESOURCES = [
  { id: 'RES-001', name: 'nexora-portal-prod', service: 'Azure App Service', category: 'Compute', environment: 'Production', region: 'East US', status: 'Healthy', cpu: 42, memory: 58, storage: 35, monthlyCost: 185, description: 'Primary production web app hosting the customer portal frontend and API.', lastUpdated: '2026-10-28T10:00:00Z' },
  { id: 'RES-002', name: 'nexora-api-functions', service: 'Azure Functions', category: 'Compute', environment: 'Production', region: 'East US', status: 'Healthy', cpu: 28, memory: 41, storage: 12, monthlyCost: 62.5, description: 'Serverless functions for document processing triggers and background jobs.', lastUpdated: '2026-10-28T10:05:00Z' },
  { id: 'RES-003', name: 'nexora-storage-prod', service: 'Azure Blob Storage', category: 'Storage', environment: 'Production', region: 'East US', status: 'Healthy', cpu: 0, memory: 0, storage: 67, monthlyCost: 48.2, description: 'Document and media storage account with lifecycle management policies.', lastUpdated: '2026-10-28T09:55:00Z' },
  { id: 'RES-004', name: 'nexora-sql-prod', service: 'Azure SQL Database', category: 'Database', environment: 'Production', region: 'East US', status: 'Warning', cpu: 78, memory: 82, storage: 55, monthlyCost: 312, description: 'Primary relational database for customer and project data. Elevated CPU recently.', lastUpdated: '2026-10-28T10:10:00Z' },
  { id: 'RES-005', name: 'nexora-openai', service: 'Azure OpenAI', category: 'AI', environment: 'Production', region: 'East US', status: 'Healthy', cpu: 15, memory: 22, storage: 5, monthlyCost: 145, description: 'Azure OpenAI resource for enterprise copilot and document summarization.', lastUpdated: '2026-10-28T10:00:00Z' },
  { id: 'RES-006', name: 'nexora-portal-staging', service: 'Azure App Service', category: 'Compute', environment: 'Staging', region: 'East US', status: 'Healthy', cpu: 18, memory: 25, storage: 20, monthlyCost: 95, description: 'Staging slot for portal releases and UAT.', lastUpdated: '2026-10-28T09:40:00Z' },
  { id: 'RES-007', name: 'nexora-cosmos-analytics', service: 'Azure Cosmos DB', category: 'Database', environment: 'Production', region: 'East US', status: 'Healthy', cpu: 35, memory: 40, storage: 28, monthlyCost: 210, description: 'NoSQL store for high-volume analytics events and session data.', lastUpdated: '2026-10-28T10:02:00Z' },
  { id: 'RES-008', name: 'nexora-monitor-workspace', service: 'Azure Monitor', category: 'Monitoring', environment: 'Production', region: 'East US', status: 'Healthy', cpu: 8, memory: 12, storage: 40, monthlyCost: 55, description: 'Log Analytics workspace and Application Insights for observability.', lastUpdated: '2026-10-28T09:50:00Z' },
  { id: 'RES-009', name: 'nexora-keyvault', service: 'Azure Key Vault', category: 'Security', environment: 'Production', region: 'East US', status: 'Healthy', cpu: 2, memory: 5, storage: 1, monthlyCost: 12, description: 'Secrets and certificate management for application configuration.', lastUpdated: '2026-10-28T09:30:00Z' },
  { id: 'RES-010', name: 'nexora-dev-vm', service: 'Azure Virtual Machine', category: 'Compute', environment: 'Development', region: 'West US 2', status: 'Warning', cpu: 12, memory: 18, storage: 45, monthlyCost: 78, description: 'Developer jump box. Low utilization; candidate for auto-shutdown schedule.', lastUpdated: '2026-10-28T08:00:00Z' },
  { id: 'RES-011', name: 'nexora-functions-dev', service: 'Azure Functions', category: 'Compute', environment: 'Development', region: 'West US 2', status: 'Healthy', cpu: 5, memory: 10, storage: 3, monthlyCost: 15, description: 'Development functions for testing document pipelines.', lastUpdated: '2026-10-28T09:00:00Z' },
  { id: 'RES-012', name: 'nexora-cdn-endpoint', service: 'Azure CDN', category: 'Networking', environment: 'Production', region: 'Global', status: 'Healthy', cpu: 0, memory: 0, storage: 0, monthlyCost: 28.5, description: 'CDN fronting static assets for the customer portal.', lastUpdated: '2026-10-28T10:00:00Z' },
];

const INITIAL_DOCUMENTS = [
  { id: 'DOC-001', title: 'Project Requirements - Customer Portal', category: 'Requirements', lastUpdated: '2026-01-05', fileType: 'MD', status: 'Ready', content: '# Customer Portal Modernization Requirements\n\n## Overview\nThe Customer Portal Modernization project aims to replace the legacy portal with a modern, cloud-native solution hosted on Microsoft Azure.\n\n## Functional Requirements\n1. User authentication via Microsoft Entra ID (SSO).\n2. Dashboard showing order history, support tickets, and account status.\n3. Self-service password reset and profile management.\n4. Real-time chat support integration.\n5. Document upload for support cases with AI-assisted classification.\n\n## Non-Functional Requirements\n- Availability: 99.9% SLA.\n- Response time: < 2s for 95th percentile.\n- Support for 50,000 concurrent users.\n- WCAG 2.1 AA accessibility compliance.\n\n## Success Metrics\n- 40% reduction in support ticket volume via self-service.\n- Customer satisfaction score > 4.5/5.\n- Page load time under 1.5 seconds on 4G networks.\n\n## Stakeholders\nProduct Owner: Sarah Chen\nTech Lead: Alex Kim\nSecurity Review: Marcus Rivera' },
  { id: 'DOC-002', title: 'Cloud Deployment Plan', category: 'Architecture', lastUpdated: '2025-12-18', fileType: 'MD', status: 'Ready', content: '# Cloud Deployment Plan - Nexora Enterprise\n\n## Target Architecture\n- Frontend: Azure Static Web Apps\n- Backend API: Azure App Service (Linux, Node.js)\n- AI: Azure OpenAI Service\n- Database: Azure SQL Database (Business Critical tier)\n- Documents: Azure Blob Storage + Document Intelligence\n- Identity: Microsoft Entra ID\n- Monitoring: Application Insights + Azure Monitor\n- Secrets: Azure Key Vault\n\n## Environments\n1. Development - West US 2\n2. Staging - East US\n3. Production - East US (primary), West US 2 (DR)\n\n## Deployment Strategy\n- Infrastructure as Code with Bicep/ARM templates.\n- CI/CD via Azure DevOps pipelines.\n- Blue-green deployment for production releases.\n- Automated smoke tests after each deployment.\n\n## Cost Controls\n- Auto-shutdown for non-production VMs.\n- Reserved instances for production App Service.\n- Storage lifecycle policies (hot → cool → archive).\n- Budget alerts at 80% and 100% of monthly forecast.' },
  { id: 'DOC-003', title: 'Monthly Operations Report - Sep 2026', category: 'Operations', lastUpdated: '2026-10-05', fileType: 'MD', status: 'Ready', content: '# Monthly Operations Report - September 2026\n\n## Executive Summary\nOverall system health remained strong. One elevated CPU incident on the production SQL database was resolved by index optimization.\n\n## Key Metrics\n- Application Health Score: 92/100\n- Average API latency: 180ms\n- Error rate: 0.12%\n- Uptime: 99.97%\n\n## Incidents\n1. 2026-09-12: SQL CPU spike to 85% lasting 45 minutes. Root cause: missing index on Orders table. Resolved.\n2. 2026-09-22: Brief CDN cache miss increase after content update. Self-resolved.\n\n## Resource Utilization\n- App Service: avg 38% CPU\n- SQL Database: avg 52% CPU (peak 85%)\n- Blob Storage: 62% of provisioned capacity\n\n## Recommendations\n1. Add covering index on Orders.CustomerId + OrderDate.\n2. Enable auto-scaling rule for App Service at 70% CPU.\n3. Review underutilized development VM for shutdown schedule.' },
  { id: 'DOC-004', title: 'Business Process Spec - Approvals', category: 'Process', lastUpdated: '2025-11-22', fileType: 'MD', status: 'Ready', content: '# Business Process Specification - Purchase Approvals\n\n## Current State\nPurchase requests above $5,000 require sequential approval from Manager → Finance → Director.\n\n## Pain Points\n- Average cycle time: 4.2 days\n- Manual email chasing\n- No visibility into pending requests\n- Audit trail incomplete\n\n## Target Process\n1. Requester submits via portal form.\n2. System routes based on amount and cost center.\n3. Approvers receive Teams adaptive card + email.\n4. Escalation after 48 hours of inactivity.\n5. Approved requests auto-create PO in ERP.\n6. Full audit log written to Cosmos DB.\n\n## Integration Points\n- Microsoft Teams\n- Azure Logic Apps\n- SAP ERP (via API)\n- Entra ID groups for role resolution' },
  { id: 'DOC-005', title: 'Technical Architecture Notes', category: 'Technical', lastUpdated: '2026-01-12', fileType: 'MD', status: 'Ready', content: '# Technical Architecture Notes\n\n## Frontend\n- React 18 + TypeScript-compatible patterns\n- Tailwind CSS for styling\n- Recharts for visualization\n- Local storage for demo persistence\n\n## Backend (Proposed)\n- Azure Functions (HTTP triggers + Durable for long-running)\n- Azure App Service for stateful API if needed\n- Azure SQL for transactional data\n- Cosmos DB for activity and session logs\n\n## AI Layer\n- Azure OpenAI GPT-4o for copilot responses\n- Document Intelligence for extraction\n- Prompt engineering with grounding in application data\n\n## Security\n- All secrets in Key Vault\n- Managed Identity for service-to-service auth\n- Entra ID conditional access policies\n- Private endpoints for SQL and Storage in production\n\n## Observability\n- Application Insights distributed tracing\n- Custom metrics for business KPIs\n- Alert rules on error rate, latency, and cost anomalies' },
  { id: 'DOC-006', title: 'Risk Assessment - Workflow Automation', category: 'Process', lastUpdated: '2025-12-01', fileType: 'MD', status: 'Ready', content: '# Risk Assessment - Enterprise Workflow Automation\n\n## High Risks\n1. Dependency on third-party connector availability (Teams, ERP).\n2. Incomplete mapping of edge-case approval paths.\n3. Potential for approval loops if escalation rules misconfigured.\n\n## Medium Risks\n1. User adoption resistance to new digital process.\n2. Training overhead for approvers.\n3. Data privacy for sensitive purchase details.\n\n## Mitigation\n- Parallel run of old and new process for first 30 days.\n- Comprehensive UAT with all departments.\n- Role-based access and field-level encryption for sensitive fields.\n- Fallback manual override path retained.' },
];

const INITIAL_ACTIVITIES = [
  { id: 'ACT-001', type: 'resource', message: 'High CPU detected on nexora-sql-prod (78%)', timestamp: '2026-10-28T10:10:00Z', severity: 'warning' },
  { id: 'ACT-002', type: 'task', message: 'Task TSK-015 marked as Blocked', timestamp: '2026-10-27T16:22:00Z', severity: 'warning' },
  { id: 'ACT-003', type: 'project', message: 'Project PRJ-004 status changed to At Risk', timestamp: '2026-10-26T09:15:00Z', severity: 'error' },
  { id: 'ACT-004', type: 'system', message: 'Demo dataset loaded successfully', timestamp: '2026-10-28T08:00:00Z', severity: 'info' },
  { id: 'ACT-005', type: 'ai', message: 'AI Copilot generated executive summary', timestamp: '2026-10-27T14:30:00Z', severity: 'success' },
  { id: 'ACT-006', type: 'resource', message: 'nexora-dev-vm utilization remains low (12% CPU)', timestamp: '2026-10-28T08:00:00Z', severity: 'info' },
  { id: 'ACT-007', type: 'task', message: 'Task TSK-001 completed by Alex Kim', timestamp: '2026-10-25T11:45:00Z', severity: 'success' },
  { id: 'ACT-008', type: 'system', message: 'Simulated monitoring refresh completed', timestamp: '2026-10-28T10:15:00Z', severity: 'info' },
];

const INITIAL_ALERTS = [
  { id: 'ALT-001', title: 'Elevated CPU on Production SQL', message: 'nexora-sql-prod CPU utilization has been above 75% for the last 30 minutes. Consider reviewing query performance or scaling.', resourceId: 'RES-004', severity: 'warning', acknowledged: false, timestamp: '2026-10-28T10:10:00Z' },
  { id: 'ALT-002', title: 'Blocked Critical Tasks', message: 'Three critical tasks in Enterprise Workflow Automation are blocked. Project is at risk of missing target date.', severity: 'error', acknowledged: false, timestamp: '2026-10-27T16:30:00Z' },
  { id: 'ALT-003', title: 'Underutilized Development Resource', message: 'nexora-dev-vm shows consistently low utilization. Consider applying auto-shutdown schedule to reduce cost.', resourceId: 'RES-010', severity: 'info', acknowledged: true, timestamp: '2026-10-26T12:00:00Z' },
];

function createInitialData() {
  return {
    projects: JSON.parse(JSON.stringify(INITIAL_PROJECTS)),
    tasks: JSON.parse(JSON.stringify(INITIAL_TASKS)),
    resources: JSON.parse(JSON.stringify(INITIAL_RESOURCES)),
    documents: JSON.parse(JSON.stringify(INITIAL_DOCUMENTS)),
    activities: JSON.parse(JSON.stringify(INITIAL_ACTIVITIES)),
    alerts: JSON.parse(JSON.stringify(INITIAL_ALERTS)),
    settings: {
      workspaceName: 'Nexora Enterprise',
      currency: 'USD',
      theme: 'light',
      demoMode: true,
      aiMode: 'demo',
      referenceDateMode: 'demo',
      referenceDate: '2026-01-15'
    },
    chatHistory: [],
  };
}

// ===================== UTILS =====================
const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

function fmtCurrency(n, currency = 'USD') {
  const safeCurrency = (typeof currency === 'string' && SUPPORTED_CURRENCIES.includes(currency.toUpperCase()))
    ? currency.toUpperCase()
    : 'USD';
  const num = typeof n === 'number' && !isNaN(n) ? n : 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: safeCurrency === 'JPY' ? 0 : 2
    }).format(num);
  } catch (e) {
    return `${safeCurrency} ${num.toFixed(2)}`;
  }
}

function safeParseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function getReferenceDate(settings) {
  if (settings && settings.referenceDateMode === 'system') {
    return new Date();
  }
  const dateStr = settings && settings.referenceDate ? settings.referenceDate : '2026-01-15';
  const parsed = safeParseDate(dateStr);
  return parsed || new Date('2026-01-15');
}

function isTaskOverdue(task, refDate) {
  if (!task || task.status === 'Completed' || !task.dueDate) return false;
  const due = safeParseDate(task.dueDate);
  if (!due) return false;
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const refDay = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate()).getTime();
  return dueDay < refDay;
}

function calcProgress(projectId, tasks) {
  const pt = (tasks || []).filter(t => t.projectId === projectId);
  if (!pt.length) return 0;
  return Math.round((pt.filter(t => t.status === 'Completed').length / pt.length) * 100);
}

function getProjectsWithProgress(projects, tasks) {
  return (projects || []).map(p => ({
    ...p,
    progress: calcProgress(p.id, tasks),
    taskCount: (tasks || []).filter(t => t.projectId === p.id).length
  }));
}

function getOverdue(tasks, settings) {
  const refDate = getReferenceDate(settings);
  return (tasks || []).filter(t => isTaskOverdue(t, refDate));
}

function resourceStats(resources) {
  const list = resources || [];
  const total = list.length;
  const healthy = list.filter(r => r.status === 'Healthy').length;
  const attention = list.filter(r => r.status === 'Warning' || r.status === 'Critical').length;
  const avgCpu = total ? Math.round(list.reduce((s, r) => s + (r.cpu || 0), 0) / total) : 0;
  const avgMemory = total ? Math.round(list.reduce((s, r) => s + (r.memory || 0), 0) / total) : 0;
  const totalCost = list.reduce((s, r) => s + (r.monthlyCost || 0), 0);
  return { total, healthy, attention, avgCpu, avgMemory, totalCost };
}

function healthScore(resources, overdueCount, atRisk) {
  const list = resources || [];
  let s = 100;
  s -= list.filter(r => r.status === 'Warning').length * 5;
  s -= list.filter(r => r.status === 'Critical').length * 15;
  s -= Math.min((overdueCount || 0) * 3, 20);
  s -= (atRisk || 0) * 8;
  return Math.max(0, Math.min(100, s));
}

function genId(prefix) {
  return prefix + '-' + String(Math.floor(Math.random() * 900) + 100);
}

function validateArray(arr, fallback) {
  return Array.isArray(arr) && arr.length > 0 ? arr : JSON.parse(JSON.stringify(fallback));
}

function loadData() {
  const initial = createInitialData();
  try {
    const raw = localStorage.getItem('cloudpilot_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          projects: validateArray(parsed.projects, INITIAL_PROJECTS),
          tasks: validateArray(parsed.tasks, INITIAL_TASKS),
          resources: validateArray(parsed.resources, INITIAL_RESOURCES),
          documents: validateArray(parsed.documents, INITIAL_DOCUMENTS),
          activities: Array.isArray(parsed.activities) ? parsed.activities : initial.activities,
          alerts: Array.isArray(parsed.alerts) ? parsed.alerts : initial.alerts,
          settings: {
            ...initial.settings,
            ...(parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : {})
          },
          chatHistory: Array.isArray(parsed.chatHistory) ? parsed.chatHistory : []
        };
      }
    }
  } catch (e) {
    console.warn('Recovered from corrupted localStorage data; restoring defaults.', e);
  }
  return initial;
}

function saveData(data) {
  try {
    localStorage.setItem('cloudpilot_data', JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage (storage quota or security restriction):', e);
  }
}

// ===================== DEMO AI =====================
function demoAI(question, data) {
  const q = question.toLowerCase();
  const currency = data?.settings?.currency || 'USD';
  const projects = getProjectsWithProgress(data.projects, data.tasks);
  const overdue = getOverdue(data.tasks, data.settings);
  const stats = resourceStats(data.resources);
  const atRisk = projects.filter(p => p.status === 'At Risk');
  const openTasks = (data.tasks || []).filter(t => t.status !== 'Completed');
  const completed = (data.tasks || []).filter(t => t.status === 'Completed');
  const refDate = getReferenceDate(data?.settings);
  const refDateFormatted = refDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (q.includes('overdue') || q.includes('late')) {
    if (overdue.length === 0) return { content: `There are currently no overdue tasks in the workspace (evaluated against ${refDateFormatted}).`, actions: [{ label: 'View Tasks', path: 'projects' }] };
    const list = overdue.map(t => `• **${t.id}** ${t.title} (Project: ${projects.find(p => p.id === t.projectId)?.name || t.projectId}, Due: ${t.dueDate}, Priority: ${t.priority})`).join('\n');
    return {
      content: `Found **${overdue.length} overdue task(s)** (evaluated against ${refDateFormatted}):\n\n${list}\n\nThese tasks are contributing to project risk, especially in Enterprise Workflow Automation.`,
      sources: ['Tasks dataset'],
      actions: [{ label: 'View Projects & Tasks', path: 'projects' }]
    };
  }

  if (q.includes('project status') || q.includes('project performance') || q.includes('summarize the current project')) {
    const lines = projects.map(p => `• **${p.name}** (${p.id}): ${p.progress}% complete, Status: ${p.status}, Owner: ${p.owner}, Tasks: ${p.taskCount}`).join('\n');
    return {
      content: `**Project Status Summary** (calculated from task completion):\n\n${lines}\n\n**Highlights:**\n- ${atRisk.length} project(s) At Risk\n- ${overdue.length} overdue tasks overall\n- Average progress: ${projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0}%`,
      sources: ['Projects', 'Tasks'],
      actions: [{ label: 'Open Projects', path: 'projects' }]
    };
  }

  if (q.includes('resource') || q.includes('utilization') || q.includes('cloud resource')) {
    const high = (data.resources || []).filter(r => r.cpu > 70 || r.memory > 70);
    const low = (data.resources || []).filter(r => r.cpu < 20 && r.environment !== 'Production' && r.category === 'Compute');
    return {
      content: `**Simulated Cloud Resource Utilization**\n\n- Total resources: ${stats.total}\n- Healthy: ${stats.healthy} | Attention: ${stats.attention}\n- Avg CPU: ${stats.avgCpu}% | Avg Memory: ${stats.avgMemory}%\n- Estimated monthly cost: ${fmtCurrency(stats.totalCost, currency)}\n\n**High utilization:**\n${high.map(r => `• ${r.name} (${r.service}): CPU ${r.cpu}%, Memory ${r.memory}%`).join('\n') || 'None'}\n\n**Potential underutilized (non-prod):**\n${low.map(r => `• ${r.name}: CPU ${r.cpu}% — consider auto-shutdown`).join('\n') || 'None'}\n\n*All values are simulated demo metrics, not live Azure data.*`,
      sources: ['Cloud Resources dataset'],
      actions: [{ label: 'View Resources', path: 'resources' }]
    };
  }

  if (q.includes('health score') || q.includes('application health') || q.includes('cause the application health') || q.includes('scoring formula')) {
    const score = healthScore(data.resources, overdue.length, atRisk.length);
    const warnCount = (data.resources || []).filter(r => r.status === 'Warning').length;
    const critCount = (data.resources || []).filter(r => r.status === 'Critical').length;
    return {
      content: `**Application Health Score: ${score}/100** (simulated)\n\n**Calculation Formula Breakdown:**\n- Base Score: **100**\n- Warning resources: ${warnCount} × (−5 pts) = −${warnCount * 5} pts\n- Critical resources: ${critCount} × (−15 pts) = −${critCount * 15} pts\n- Overdue tasks: ${overdue.length} × (−3 pts, max −20) = −${Math.min(overdue.length * 3, 20)} pts\n- At-Risk projects: ${atRisk.length} × (−8 pts) = −${atRisk.length * 8} pts\n\n**Primary risk drivers:** elevated CPU on **nexora-sql-prod** and blocked critical tasks in **Enterprise Workflow Automation**. Resolving these will restore the score toward 100.`,
      sources: ['Resources', 'Tasks', 'Projects'],
      actions: [{ label: 'Dashboard', path: 'dashboard' }, { label: 'View Resources', path: 'resources' }]
    };
  }

  if (q.includes('synapse') || q.includes('analytics platform') || q.includes('power bi')) {
    const prj2 = projects.find(p => p.id === 'PRJ-002');
    const tasks2 = (data.tasks || []).filter(t => t.projectId === 'PRJ-002');
    return {
      content: `**Cloud Analytics Platform (PRJ-002)**\n\n- Owner: **${prj2?.owner || 'Marcus Rivera'}**\n- Progress: **${prj2?.progress || 0}%** (Status: ${prj2?.status || 'In Progress'})\n- Scope: Centralized data pipeline integrating **Azure Synapse Analytics** with star-schema data modeling, ETL data flows, and executive **Power BI** dashboards.\n- Milestone status: Synapse workspace provisioned and star schema designed; ETL pipelines for CRM data currently in progress.`,
      sources: ['PRJ-002', 'Azure Architecture'],
      actions: [{ label: 'Open Projects', path: 'projects' }]
    };
  }

  if (q.includes('logic app') || q.includes('workflow') || q.includes('approval')) {
    const prj4 = projects.find(p => p.id === 'PRJ-004');
    const blocked = (data.tasks || []).filter(t => t.projectId === 'PRJ-004' && t.status === 'Blocked');
    return {
      content: `**Enterprise Workflow Automation (PRJ-004)**\n\n- Current Status: **${prj4?.status || 'At Risk'}** (Progress: ${prj4?.progress || 0}%)\n- Blocker Alert: **${blocked.length} blocked tasks** detected:\n${blocked.map(t => `  • ${t.id}: ${t.title} (Assigned to ${t.assignee})`).join('\n')}\n\n**Mitigation Strategy:** Reconfigure custom connector authentication in Azure Logic Apps and test Teams adaptive card webhook endpoints to resume cutover schedule.`,
      sources: ['PRJ-004', 'Tasks'],
      actions: [{ label: 'View Tasks', path: 'projects' }]
    };
  }

  if (q.includes('key vault') || q.includes('secret') || q.includes('security') || q.includes('credentials')) {
    return {
      content: `**Enterprise Security & Secret Management Architecture**\n\n- **Zero Hardcoded Secrets:** Client-side React code contains no live cloud API keys, secrets, or passwords.\n- **Azure Key Vault (RES-009):** In production deployment, all connection strings and tokens are stored in Azure Key Vault.\n- **Microsoft Entra ID:** Authentication utilizes OAuth2 / OpenID Connect with Managed Identity (system-assigned) for backend-to-backend communication without stored secrets.\n- **Network Isolation:** Private endpoints isolate Azure SQL and Cosmos DB from public internet traffic.`,
      sources: ['Azure Key Vault', 'Security Architecture'],
      actions: [{ label: 'Architecture Explorer', path: 'architecture' }]
    };
  }

  if (q.includes('cost') || q.includes('optimize') || q.includes('reduce') || q.includes('consumption')) {
    const byCat = {};
    (data.resources || []).forEach(r => { byCat[r.category] = (byCat[r.category] || 0) + r.monthlyCost; });
    const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    return {
      content: `**Cloud Cost Insights (Simulated)**\n\nEstimated monthly total: **${fmtCurrency(stats.totalCost, currency)}**\n\nBy category:\n${sorted.map(([c, v]) => `• ${c}: ${fmtCurrency(v, currency)}`).join('\n')}\n\n**Optimization suggestions grounded in demo data:**\n1. **nexora-dev-vm** (Dev, 12% CPU) — apply auto-shutdown schedule → potential ~${fmtCurrency(Math.round(78 * 0.6), currency)}/mo savings.\n2. Review **nexora-sql-prod** elevated CPU; index optimization or tier right-sizing may reduce cost spikes.\n3. Staging App Service shows moderate use; consider scale-down outside business hours.\n\n*Illustrative only — not a live Azure bill.*`,
      sources: ['Cloud Resources'],
      actions: [{ label: 'Analytics', path: 'analytics' }]
    };
  }

  if (q.includes('azure') || q.includes('architecture') || q.includes('deploy')) {
    return {
      content: `**Proposed Azure Deployment Architecture**\n\nThis prototype is designed to map onto the following Azure services:\n\n1. **Frontend** → Azure Static Web Apps or App Service\n2. **Backend API** → Azure Functions / App Service\n3. **AI** → Azure OpenAI (for Copilot) + Document Intelligence\n4. **Data** → Azure SQL Database + Cosmos DB\n5. **Documents** → Azure Blob Storage\n6. **Identity** → Microsoft Entra ID\n7. **Monitoring** → Azure Monitor + Application Insights\n8. **Secrets** → Azure Key Vault\n\nThe current prototype runs fully locally with simulated data. No Azure resources have been provisioned. See the Architecture page for an interactive diagram and component details.`,
      sources: ['Architecture design'],
      actions: [{ label: 'Open Architecture', path: 'architecture' }]
    };
  }

  if (q.includes('executive') || q.includes('summary') || q.includes('business performance') || q.includes('monthly')) {
    return {
      content: `**Executive Summary — Demo Workspace**\n\n**Overall Status:** ${atRisk.length ? 'Attention required' : 'On track'} (Health Score ${healthScore(data.resources, overdue.length, atRisk.length)}/100)\n\n**Projects:** ${projects.length} active | Avg progress ${projects.length ? Math.round(projects.reduce((s,p)=>s+p.progress,0)/projects.length) : 0}%\n- At Risk: ${atRisk.map(p => p.name).join(', ') || 'None'}\n\n**Tasks:** ${openTasks.length} open | ${completed.length} completed | ${overdue.length} overdue (as of ${refDateFormatted})\n\n**Cloud (simulated):** ${stats.total} resources | ${fmtCurrency(stats.totalCost, currency)}/mo est. | ${stats.attention} need attention\n\n**Recommended next steps:**\n1. Unblock Logic App tasks in Workflow Automation.\n2. Investigate SQL CPU on nexora-sql-prod.\n3. Schedule auto-shutdown for low-util dev VM.`,
      sources: ['All datasets'],
      actions: [{ label: 'Dashboard', path: 'dashboard' }, { label: 'Analytics', path: 'analytics' }]
    };
  }

  if (q.includes('risk') || q.includes('attention') || q.includes('need attention')) {
    return {
      content: `**Operational Risks Identified**\n\n1. **Project At Risk:** ${atRisk.map(p => p.name).join(', ') || 'None'}\n2. **Overdue / Blocked tasks:** ${overdue.length} items (as of ${refDateFormatted}), including critical Logic App work.\n3. **Resource Warning:** nexora-sql-prod (CPU 78%, Memory 82%)\n4. **Underutilized spend:** nexora-dev-vm\n\nAddressing the blocked tasks in PRJ-004 and the SQL performance issue would most improve the health score.`,
      sources: ['Projects', 'Tasks', 'Resources'],
      actions: [{ label: 'Projects', path: 'projects' }, { label: 'Resources', path: 'resources' }]
    };
  }

  if (q.includes('document') || q.includes('summarize this')) {
    return {
      content: `I can summarize any of the sample documents in the Documents section. Select a document there and click **Summarize** to get key points and action items grounded in the actual document content.\n\nAvailable samples: Project Requirements, Cloud Deployment Plan, Monthly Operations Report, Business Process Spec, Technical Architecture Notes, Risk Assessment.`,
      actions: [{ label: 'Open Documents', path: 'documents' }]
    };
  }

  // Default
  return {
    content: `I analyzed your question against the current demo data.\n\n**Quick snapshot:**\n- ${projects.length} projects (${atRisk.length} at risk)\n- ${openTasks.length} open tasks (${overdue.length} overdue as of ${refDateFormatted})\n- ${stats.total} simulated cloud resources (${fmtCurrency(stats.totalCost, currency)}/mo)\n- Health score: ${healthScore(data.resources, overdue.length, atRisk.length)}/100\n\nTry asking about overdue tasks, project status, resource utilization, cost optimization, Azure architecture, or generating an executive summary.`,
    sources: ['Demo dataset'],
    actions: [{ label: 'Dashboard', path: 'dashboard' }]
  };
}

function summarizeDocument(doc) {
  if (!doc || !doc.content) return { summary: 'No document content available to summarize.' };
  const lines = doc.content.split('\n').filter(l => l.trim());
  const headings = lines.filter(l => l.startsWith('#')).map(l => l.replace(/^#+\s*/, ''));
  const bullets = lines.filter(l => l.startsWith('-') || l.match(/^\d+\./)).slice(0, 8);
  const keyPoints = headings.slice(0, 5).concat(bullets.map(b => b.replace(/^[-*\d.]+\s*/, ''))).slice(0, 6);
  const actions = lines.filter(l => /recommend|should|must|next|action/i.test(l)).slice(0, 4);
  return {
    summary: `**Summary of "${doc.title}"**\n\nThis ${doc.category.toLowerCase()} document covers: ${headings.slice(0, 3).join('; ') || 'core project and operational topics'}.\n\n**Key Points:**\n${keyPoints.map(k => `• ${k}`).join('\n')}\n\n${actions.length ? '**Potential Action Items:**\n' + actions.map(a => `• ${a.replace(/^[-*\d.]+\s*/, '')}`).join('\n') : ''}\n\n*Generated by Demo AI mode from the selected document content.*`,
  };
}

// ===================== COMPONENTS =====================
let lucideScheduleTimer = null;
function scheduleLucideBatch() {
  if (typeof window === 'undefined' || !window.lucide) return;
  if (lucideScheduleTimer) return;
  lucideScheduleTimer = requestAnimationFrame(() => {
    lucideScheduleTimer = null;
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  });
}

function Icon({ name, size = 18, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.lucide) return;
    if (containerRef.current && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons({
          root: containerRef.current,
          nameAttrs: { 'data-lucide': name },
          attrs: { width: size, height: size, class: className }
        });
        return;
      } catch (e) {}
    }
    scheduleLucideBatch();
  }, [name, size, className]);

  return (
    <span
      ref={containerRef}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <i data-lucide={name} style={{ width: size, height: size }}></i>
    </span>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const colors = {
    success: 'bg-emerald-600 text-white shadow-emerald-900/20',
    warning: 'bg-amber-600 text-white shadow-amber-900/20',
    error: 'bg-rose-600 text-white shadow-rose-900/20',
    info: 'bg-navy text-white shadow-slate-900/20'
  };
  const icons = {
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'alert-circle',
    info: 'info'
  };
  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm transition-all transform animate-fade-in border border-white/10 ${colors[toast.type] || colors.info}`}>
      <Icon name={icons[toast.type] || 'info'} size={18} />
      <span className="font-medium">{toast.message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded text-white/80 hover:text-white transition" aria-label="Close notification">
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}

function FormattedText({ text = '', className = '' }) {
  if (!text) return null;
  const lines = String(text).split('\n');

  const renderInline = (str, lineIdx) => {
    const parts = [];
    let lastIdx = 0;
    const regex = /\*\*(.*?)\*\*/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIdx) {
        parts.push(<span key={`txt-${lineIdx}-${lastIdx}`}>{str.substring(lastIdx, match.index)}</span>);
      }
      parts.push(<strong key={`bld-${lineIdx}-${match.index}`} className="font-semibold text-text">{match[1]}</strong>);
      lastIdx = regex.lastIndex;
    }

    if (lastIdx < str.length) {
      parts.push(<span key={`txt-${lineIdx}-${lastIdx}`}>{str.substring(lastIdx)}</span>);
    }

    return parts.length > 0 ? parts : str;
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={`empty-${idx}`} className="h-2" />;
        }
        return (
          <div key={`line-${idx}`} className="leading-relaxed">
            {renderInline(line, idx)}
          </div>
        );
      })}
    </div>
  );
}

function Badge({ children, color = 'gray' }) {
  const colors = {
    green: 'bg-green-100 text-success',
    yellow: 'bg-amber-100 text-warning',
    red: 'bg-red-100 text-error',
    blue: 'bg-blue-100 text-azure',
    purple: 'bg-purple-100 text-ai',
    gray: 'bg-gray-100 text-secondary',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[color] || colors.gray}`}>{children}</span>;
}

function KPI({ title, value, sub, icon, color = 'azure' }) {
  const bg = { azure: 'bg-blue-50 text-azure', success: 'bg-green-50 text-success', warning: 'bg-amber-50 text-warning', error: 'bg-red-50 text-error', ai: 'bg-purple-50 text-ai' };
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-secondary uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-heading font-semibold text-text mt-1">{value}</p>
          {sub && <p className="text-xs text-secondary mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${bg[color] || bg.azure}`}>
          <Icon name={icon} size={20} />
        </div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto ${wide ? 'w-full max-w-3xl' : 'w-full max-w-lg'}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-heading font-semibold text-text">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><Icon name="x" size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ===================== PAGES =====================
function Dashboard({ data, setPage }) {
  const currency = data?.settings?.currency || 'USD';
  const projects = getProjectsWithProgress(data.projects, data.tasks);
  const overdue = getOverdue(data.tasks, data.settings);
  const stats = resourceStats(data.resources);
  const atRisk = projects.filter(p => p.status === 'At Risk').length;
  const score = healthScore(data.resources, overdue.length, atRisk);
  const open = (data.tasks || []).filter(t => t.status !== 'Completed').length;
  const completed = (data.tasks || []).filter(t => t.status === 'Completed').length;
  const refDate = getReferenceDate(data?.settings);
  const refDateFormatted = refDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const progressData = projects.map(p => ({ name: p.name.split(' ').slice(0, 2).join(' '), progress: p.progress }));
  const taskTrend = [
    { week: 'W1', completed: 2 }, { week: 'W2', completed: 4 }, { week: 'W3', completed: 3 },
    { week: 'W4', completed: 5 }, { week: 'W5', completed: 4 }, { week: 'W6', completed: 6 },
  ];
  const utilData = [
    { name: 'CPU', value: stats.avgCpu },
    { name: 'Memory', value: stats.avgMemory },
    { name: 'Storage', value: (data.resources || []).length ? Math.round((data.resources || []).reduce((s, r) => s + (r.storage || 0), 0) / data.resources.length) : 0 },
  ];

  const insights = [
    { type: 'calculated', title: 'Overdue tasks', text: `${overdue.length} tasks past due (evaluated ${refDateFormatted})`, path: 'projects', color: 'error' },
    { type: 'calculated', title: 'At-risk project', text: atRisk ? projects.find(p => p.status === 'At Risk')?.name : 'None', path: 'projects', color: 'warning' },
    { type: 'simulated', title: 'High CPU resource', text: 'nexora-sql-prod at 78% CPU', path: 'resources', color: 'warning' },
    { type: 'ai', title: 'Optimization opportunity', text: 'Dev VM underutilized — auto-shutdown candidate', path: 'analytics', color: 'ai' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-text">Welcome back</h1>
          <p className="text-secondary text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · {data.settings?.workspaceName || 'Nexora Enterprise'} · <span className="text-xs bg-gray-100 text-secondary px-2 py-0.5 rounded font-medium">Evaluation Date: {refDateFormatted} ({data.settings?.referenceDateMode === 'system' ? 'System Today' : 'Demo Anchor'})</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded bg-amber-50 text-warning border border-amber-200">Demo Environment</span>
          <button onClick={() => setPage('copilot')} className="flex items-center gap-2 px-4 py-2 bg-ai text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
            <Icon name="sparkles" size={16} /> Ask AI Copilot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI title="Active Projects" value={projects.length} icon="folder-kanban" />
        <KPI title="Open Tasks" value={open} icon="list-todo" color="azure" />
        <KPI title="Completed" value={completed} icon="check-circle" color="success" />
        <KPI title="Overdue" value={overdue.length} sub={`As of ${refDateFormatted}`} icon="alert-triangle" color={overdue.length > 0 ? "error" : "success"} />
        <KPI title="Cloud Resources" value={stats.total} sub={fmtCurrency(stats.totalCost, currency) + '/mo'} icon="cloud" />
        <KPI title="Health Score" value={score} sub="Simulated indicators" icon="activity" color={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="font-heading font-semibold text-text mb-3">Project Progress</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="progress" fill="#0078D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="font-heading font-semibold text-text mb-3">Task Completion Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={taskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E8F0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#16865B" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="font-heading font-semibold text-text mb-3">Resource Utilization (Avg)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={utilData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E8F0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#163A5F" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-secondary mt-2">Simulated averages across demo resources</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm lg:col-span-2">
          <h3 className="font-heading font-semibold text-text mb-3">AI Business Insights</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <button key={i} onClick={() => setPage(ins.path)} className="insight-card text-left p-3 rounded-lg bg-purple-50/50 hover:bg-purple-50 border border-purple-100 transition">
                <div className="flex items-center gap-2 mb-1">
                  <Badge color={ins.color === 'ai' ? 'purple' : ins.color === 'error' ? 'red' : 'yellow'}>{ins.type}</Badge>
                </div>
                <p className="text-sm font-medium text-text">{ins.title}</p>
                <p className="text-xs text-secondary mt-0.5">{ins.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <h3 className="font-heading font-semibold text-text mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {(data.activities || []).slice(0, 6).map(a => (
            <div key={a.id} className="flex items-start gap-3 text-sm">
              <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${a.severity === 'error' ? 'bg-error' : a.severity === 'warning' ? 'bg-warning' : a.severity === 'success' ? 'bg-success' : 'bg-azure'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-text">{a.message}</p>
                <p className="text-xs text-secondary">{new Date(a.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Copilot({ data, setPage, updateData, showToast }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const history = data.chatHistory || [];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history, loading]);

  const suggestions = [
    'Summarize the current project status',
    'Which tasks are overdue?',
    'Explain the cloud resource usage',
    'How is the application health score calculated?',
    'Explain the Synapse analytics platform progress',
    'What is blocking the Workflow Automation Logic App?',
    'Suggest three ways to reduce cloud costs',
    'Explain how secrets are managed in Key Vault',
    'Explain how this application could be deployed on Azure',
  ];

  const send = (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    const userMsg = { id: genId('MSG'), role: 'user', content: q, timestamp: new Date().toISOString() };
    const newHistory = [...history, userMsg];
    updateData({ chatHistory: newHistory });
    setLoading(true);
    setTimeout(() => {
      const result = demoAI(q, data);
      const asst = { id: genId('MSG'), role: 'assistant', content: result.content, timestamp: new Date().toISOString(), sources: result.sources, actions: result.actions };
      updateData({ chatHistory: [...newHistory, asst] });
      setLoading(false);
    }, 600 + Math.random() * 400);
  };

  const clear = () => {
    updateData({ chatHistory: [] });
    if (showToast) showToast('Conversation cleared', 'info');
  };

  const copyResponse = (content) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(content).then(() => {
        if (showToast) showToast('Copied to clipboard', 'info');
      }).catch(() => {});
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-text flex items-center gap-2">
            <Icon name="sparkles" size={24} className="text-ai" /> AI Enterprise Copilot
          </h1>
          <p className="text-sm text-secondary mt-1">Demo AI mode · Grounded in client-side workspace telemetry & tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="purple">Deterministic Grounding</Badge>
          <button onClick={clear} className="text-sm text-secondary hover:text-text px-3 py-1.5 rounded border border-border">Clear</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {history.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex p-3 rounded-full bg-purple-50 text-ai mb-3"><Icon name="bot" size={28} /></div>
            <p className="text-text font-medium">Ask about projects, tasks, cloud resources, costs, or Azure architecture</p>
            <p className="text-sm text-secondary mt-1">All answers are safely grounded in the active local dataset (zero paid external API calls)</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl mx-auto">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border border-border bg-white hover:border-ai hover:text-ai transition">{s}</button>
              ))}
            </div>
          </div>
        )}
        {history.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 text-sm ${m.role === 'user' ? 'msg-user' : 'msg-assistant'}`}>
              <FormattedText text={m.content} />
              {m.actions && m.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-border/50">
                  {m.actions.map((a, i) => (
                    <button key={i} onClick={() => setPage(a.path)} className="text-xs px-2 py-1 rounded bg-azure/10 text-azure hover:bg-azure/20 font-medium">{a.label} →</button>
                  ))}
                </div>
              )}
              {m.role === 'assistant' && (
                <div className="flex items-center justify-between text-[10px] text-secondary mt-2 pt-1 border-t border-border/40">
                  <span>{m.sources ? `Sources: ${m.sources.join(', ')}` : 'Grounded in client dataset'}</span>
                  <button onClick={() => copyResponse(m.content)} className="hover:text-text flex items-center gap-1 p-0.5">
                    <Icon name="copy" size={11} /> Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="msg-assistant px-4 py-3 text-sm text-secondary flex items-center gap-2">
              <Icon name="loader-2" size={16} className="animate-spin text-ai" /> Analyzing local workspace dataset…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about projects, resources, costs, architecture…"
          rows={2}
          className="flex-1 resize-none rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-azure/30"
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} className="px-4 rounded-xl bg-ai text-white hover:bg-purple-700 disabled:opacity-50 self-end transition">
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  );
}

function ProjectsPage({ data, updateData, showToast, initialSearch = '' }) {
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [taskSearch, setTaskSearch] = useState('');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('All');
  const [taskStatusFilter, setTaskStatusFilter] = useState('All');

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [taskForm, setTaskForm] = useState({});
  const [taskFormError, setTaskFormError] = useState('');
  const [viewProject, setViewProject] = useState(null);

  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
  }, [initialSearch]);

  const projects = getProjectsWithProgress(data.projects, data.tasks);
  const filtered = projects.filter(p => {
    const matchS = statusFilter === 'All' || p.status === statusFilter;
    const matchQ = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return matchS && matchQ;
  });

  const filteredTasks = (data.tasks || []).filter(t => {
    const matchQ = !taskSearch || t.title.toLowerCase().includes(taskSearch.toLowerCase()) || (t.assignee && t.assignee.toLowerCase().includes(taskSearch.toLowerCase())) || t.id.toLowerCase().includes(taskSearch.toLowerCase());
    const matchP = taskPriorityFilter === 'All' || t.priority === taskPriorityFilter;
    const matchS = taskStatusFilter === 'All' || t.status === taskStatusFilter;
    return matchQ && matchP && matchS;
  });

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setForm({ name: '', description: '', owner: '', startDate: '', targetDate: '', status: 'Planning' });
    setShowProjectModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setFormError('');
    setForm({ ...p });
    setShowProjectModal(true);
  };

  const saveProject = () => {
    if (!form.name || !form.name.trim()) {
      setFormError('Project title is required.');
      return;
    }
    if (editing) {
      updateData({
        projects: data.projects.map(p => p.id === editing.id ? { ...p, ...form } : p),
        activities: [{ id: genId('ACT'), type: 'project', message: `Project ${editing.id} updated: ${form.name}`, timestamp: new Date().toISOString(), severity: 'info' }, ...(data.activities || [])].slice(0, 20)
      });
      if (showToast) showToast(`Project "${form.name}" updated successfully`, 'success');
    } else {
      const newId = genId('PRJ');
      updateData({
        projects: [...data.projects, { ...form, id: newId }],
        activities: [{ id: genId('ACT'), type: 'project', message: `New project created: ${form.name} (${newId})`, timestamp: new Date().toISOString(), severity: 'success' }, ...(data.activities || [])].slice(0, 20)
      });
      if (showToast) showToast(`Project "${form.name}" created successfully`, 'success');
    }
    setShowProjectModal(false);
  };

  const deleteProject = (id) => {
    const p = data.projects.find(x => x.id === id);
    if (!confirm(`Delete project "${p?.name || id}" and all its associated tasks?`)) return;
    updateData({
      projects: data.projects.filter(p => p.id !== id),
      tasks: data.tasks.filter(t => t.projectId !== id),
      activities: [{ id: genId('ACT'), type: 'project', message: `Deleted project ${id}`, timestamp: new Date().toISOString(), severity: 'warning' }, ...(data.activities || [])].slice(0, 20)
    });
    if (showToast) showToast('Project and related tasks deleted', 'info');
  };

  const openCreateTask = (projectId) => {
    setTaskFormError('');
    setTaskForm({
      title: '',
      projectId: projectId || data.projects[0]?.id || '',
      assignee: '',
      priority: 'Medium',
      dueDate: '',
      status: 'To Do'
    });
    setShowTaskModal(true);
  };

  const saveTask = () => {
    if (!taskForm.title || !taskForm.title.trim()) {
      setTaskFormError('Task title is required.');
      return;
    }
    if (taskForm.id) {
      updateData({
        tasks: data.tasks.map(t => t.id === taskForm.id ? { ...t, ...taskForm } : t),
        activities: [{ id: genId('ACT'), type: 'task', message: `Task ${taskForm.id} updated: ${taskForm.title}`, timestamp: new Date().toISOString(), severity: 'info' }, ...(data.activities || [])].slice(0, 20)
      });
      if (showToast) showToast(`Task ${taskForm.id} updated successfully`, 'success');
    } else {
      const newId = genId('TSK');
      updateData({
        tasks: [...data.tasks, { ...taskForm, id: newId }],
        activities: [{ id: genId('ACT'), type: 'task', message: `New task added: ${taskForm.title} (${newId})`, timestamp: new Date().toISOString(), severity: 'success' }, ...(data.activities || [])].slice(0, 20)
      });
      if (showToast) showToast(`Task ${newId} created successfully`, 'success');
    }
    setShowTaskModal(false);
  };

  const updateTaskStatus = (id, status) => {
    updateData({
      tasks: data.tasks.map(t => t.id === id ? { ...t, status } : t),
      activities: [{ id: genId('ACT'), type: 'task', message: `Task ${id} marked as ${status}`, timestamp: new Date().toISOString(), severity: status === 'Completed' ? 'success' : status === 'Blocked' ? 'warning' : 'info' }, ...(data.activities || [])].slice(0, 20)
    });
    if (showToast) showToast(`Task ${id} marked as ${status}`, 'success');
  };

  const deleteTask = (id) => {
    if (!window.confirm(`Delete task ${id}?`)) return;
    updateData({
      tasks: data.tasks.filter(t => t.id !== id),
      activities: [{ id: genId('ACT'), type: 'task', message: `Deleted task ${id}`, timestamp: new Date().toISOString(), severity: 'warning' }, ...(data.activities || [])].slice(0, 20)
    });
    if (showToast) showToast(`Task ${id} deleted`, 'info');
  };

  const statusColor = s => s === 'Completed' ? 'green' : s === 'At Risk' || s === 'Blocked' ? 'red' : s === 'In Progress' ? 'blue' : 'gray';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-text">Projects & Tasks</h1>
          <p className="text-sm text-secondary">Manage enterprise initiatives, delivery milestones, and work items</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openCreate} className="px-3 py-2 bg-azure text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-1.5">
            <Icon name="plus" size={16} /> Project
          </button>
          <button onClick={() => openCreateTask()} className="px-3 py-2 border border-border bg-card rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-1.5">
            <Icon name="plus" size={16} /> Task
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search projects…"
          className="px-3 py-2 border border-border rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-azure/30 bg-card"
        />
        {['All', 'Planning', 'In Progress', 'At Risk', 'Completed', 'On Hold'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${statusFilter === s ? 'bg-navy text-white' : 'bg-card border border-border text-secondary hover:border-gray-400'}`}>{s}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-dashed border-border p-8 text-center">
          <div className="inline-flex p-3 rounded-full bg-blue-50 text-azure mb-2"><Icon name="folder" size={24} /></div>
          <p className="text-sm font-medium text-text">No projects match your filter</p>
          <p className="text-xs text-secondary mt-1">Adjust search keyword or select "All" status.</p>
          <button onClick={() => { setSearch(''); setStatusFilter('All'); }} className="mt-3 text-xs px-3 py-1.5 bg-azure text-white rounded-lg">Reset Filters</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-secondary font-mono">{p.id}</p>
                    <h3 className="font-heading font-semibold text-text text-base">{p.name}</h3>
                  </div>
                  <Badge color={statusColor(p.status)}>{p.status}</Badge>
                </div>
                <p className="text-xs text-secondary line-clamp-2 mb-3">{p.description}</p>
                <div className="flex items-center justify-between text-xs text-secondary mb-2">
                  <span>Owner: <strong className="text-text font-normal">{p.owner}</strong></span>
                  <span>{p.taskCount} tasks</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                  <div className={`h-2 rounded-full transition-all ${p.status === 'At Risk' ? 'bg-rose-500' : p.progress === 100 ? 'bg-emerald-500' : 'bg-azure'}`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-sm font-semibold text-text">{p.progress}% complete</span>
                <div className="flex gap-1">
                  <button onClick={() => setViewProject(p)} className="p-1.5 rounded hover:bg-gray-100 text-secondary hover:text-text" title="View Details"><Icon name="eye" size={15} /></button>
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-gray-100 text-secondary hover:text-text" title="Edit"><Icon name="pencil" size={15} /></button>
                  <button onClick={() => deleteProject(p.id)} className="p-1.5 rounded hover:bg-red-50 text-error" title="Delete"><Icon name="trash-2" size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tasks Table Section */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-text">All Tasks</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-secondary font-medium">{filteredTasks.length} shown / {data.tasks.length} total</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={taskSearch}
              onChange={e => setTaskSearch(e.target.value)}
              placeholder="Filter tasks or assignee…"
              className="px-2.5 py-1.5 border border-border rounded-lg text-xs w-44 bg-white"
            />
            <select
              value={taskPriorityFilter}
              onChange={e => setTaskPriorityFilter(e.target.value)}
              className="px-2 py-1.5 border border-border rounded-lg text-xs bg-white text-secondary"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={taskStatusFilter}
              onChange={e => setTaskStatusFilter(e.target.value)}
              className="px-2 py-1.5 border border-border rounded-lg text-xs bg-white text-secondary"
            >
              <option value="All">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Blocked">Blocked</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-secondary text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-2.5">ID</th>
                <th className="text-left px-4 py-2.5">Title</th>
                <th className="text-left px-4 py-2.5">Project</th>
                <th className="text-left px-4 py-2.5">Assignee</th>
                <th className="text-left px-4 py-2.5">Priority</th>
                <th className="text-left px-4 py-2.5">Due Date</th>
                <th className="text-left px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-secondary text-xs">
                    No tasks match the active filter criteria. Click below to clear filters.
                    <div className="mt-2">
                      <button onClick={() => { setTaskSearch(''); setTaskPriorityFilter('All'); setTaskStatusFilter('All'); }} className="text-xs text-azure hover:underline">Clear task filters</button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map(t => {
                  const proj = data.projects.find(p => p.id === t.projectId);
                  const isOverdue = isTaskOverdue(t, getReferenceDate(data.settings));
                  return (
                    <tr key={t.id} className="border-t border-border hover:bg-gray-50/60 transition">
                      <td className="px-4 py-2.5 text-secondary text-xs font-mono">{t.id}</td>
                      <td className="px-4 py-2.5 font-medium text-text max-w-xs">{t.title}</td>
                      <td className="px-4 py-2.5 text-secondary text-xs">{proj?.name || t.projectId}</td>
                      <td className="px-4 py-2.5 text-xs">{t.assignee || 'Unassigned'}</td>
                      <td className="px-4 py-2.5"><Badge color={t.priority === 'Critical' ? 'red' : t.priority === 'High' ? 'yellow' : 'gray'}>{t.priority}</Badge></td>
                      <td className={`px-4 py-2.5 text-xs ${isOverdue ? 'text-error font-semibold flex items-center gap-1' : 'text-secondary'}`}>
                        {isOverdue && <Icon name="alert-triangle" size={12} />}
                        {t.dueDate || 'Unset'}
                      </td>
                      <td className="px-4 py-2.5">
                        <select
                          value={t.status}
                          onChange={e => updateTaskStatus(t.id, e.target.value)}
                          className={`text-xs border rounded px-1.5 py-0.5 font-medium ${t.status === 'Completed' ? 'border-green-300 bg-green-50 text-success' : t.status === 'Blocked' ? 'border-red-300 bg-red-50 text-error' : 'border-border bg-white text-text'}`}
                        >
                          {['To Do', 'In Progress', 'Blocked', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setTaskForm({ ...t }); setTaskFormError(''); setShowTaskModal(true); }} className="p-1 hover:bg-gray-100 rounded text-secondary hover:text-text" title="Edit Task"><Icon name="pencil" size={13} /></button>
                          <button onClick={() => deleteTask(t.id)} className="p-1 hover:bg-red-50 text-error rounded" title="Delete Task"><Icon name="trash-2" size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Modal */}
      <Modal open={showProjectModal} onClose={() => setShowProjectModal(false)} title={editing ? `Edit Project: ${editing.id}` : 'Create New Project'}>
        <div className="space-y-3">
          {formError && <p className="text-xs text-error font-medium">{formError}</p>}
          <div><label className="text-xs text-secondary font-medium">Project Name *</label><input value={form.name || ''} onChange={e => { setForm({ ...form, name: e.target.value }); setFormError(''); }} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-azure/30" placeholder="e.g. NextGen Microservices Platform" /></div>
          <div><label className="text-xs text-secondary font-medium">Description</label><textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-azure/30" placeholder="Brief architectural and business goals..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-secondary font-medium">Owner</label><input value={form.owner || ''} onChange={e => setForm({ ...form, owner: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm" placeholder="Lead Engineer" /></div>
            <div><label className="text-xs text-secondary font-medium">Status</label>
              <select value={form.status || 'Planning'} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-white">
                {['Planning', 'In Progress', 'On Hold', 'Completed', 'At Risk'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-secondary font-medium">Start Date</label><input type="date" value={form.startDate || ''} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-white" /></div>
            <div><label className="text-xs text-secondary font-medium">Target Date</label><input type="date" value={form.targetDate || ''} onChange={e => setForm({ ...form, targetDate: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-white" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button onClick={() => setShowProjectModal(false)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={saveProject} className="px-4 py-2 text-sm bg-azure text-white rounded-lg hover:bg-blue-600 transition font-medium">Save Project</button>
          </div>
        </div>
      </Modal>

      {/* Task Modal */}
      <Modal open={showTaskModal} onClose={() => setShowTaskModal(false)} title={taskForm.id ? `Edit Task: ${taskForm.id}` : 'Create New Task'}>
        <div className="space-y-3">
          {taskFormError && <p className="text-xs text-error font-medium">{taskFormError}</p>}
          <div><label className="text-xs text-secondary font-medium">Task Title *</label><input value={taskForm.title || ''} onChange={e => { setTaskForm({ ...taskForm, title: e.target.value }); setTaskFormError(''); }} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-azure/30" placeholder="e.g. Implement Azure Key Vault access policies" /></div>
          <div><label className="text-xs text-secondary font-medium">Parent Project</label>
            <select value={taskForm.projectId || ''} onChange={e => setTaskForm({ ...taskForm, projectId: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-white">
              {data.projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-secondary font-medium">Assignee</label><input value={taskForm.assignee || ''} onChange={e => setTaskForm({ ...taskForm, assignee: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm" placeholder="Assignee Name" /></div>
            <div><label className="text-xs text-secondary font-medium">Priority</label>
              <select value={taskForm.priority || 'Medium'} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-white">
                {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-secondary font-medium">Due Date</label><input type="date" value={taskForm.dueDate || ''} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-white" /></div>
            <div><label className="text-xs text-secondary font-medium">Status</label>
              <select value={taskForm.status || 'To Do'} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-white">
                {['To Do', 'In Progress', 'Blocked', 'Completed'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={saveTask} className="px-4 py-2 text-sm bg-azure text-white rounded-lg hover:bg-blue-600 transition font-medium">Save Task</button>
          </div>
        </div>
      </Modal>

      {/* Project Detail Modal */}
      <Modal open={!!viewProject} onClose={() => setViewProject(null)} title={viewProject?.name || ''} wide>
        {viewProject && (
          <div className="space-y-4">
            <p className="text-sm text-secondary">{viewProject.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm p-3 bg-gray-50 rounded-lg">
              <div><span className="text-xs text-secondary block">Owner</span> <strong className="text-text">{viewProject.owner}</strong></div>
              <div><span className="text-xs text-secondary block">Status</span> <Badge color={statusColor(viewProject.status)}>{viewProject.status}</Badge></div>
              <div><span className="text-xs text-secondary block">Progress</span> <strong className="text-text">{viewProject.progress}%</strong></div>
              <div><span className="text-xs text-secondary block">Target Date</span> <strong className="text-text">{viewProject.targetDate}</strong></div>
            </div>
            <h4 className="font-heading font-semibold text-text pt-2">Associated Work Items ({data.tasks.filter(t => t.projectId === viewProject.id).length})</h4>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {data.tasks.filter(t => t.projectId === viewProject.id).map(t => (
                <div key={t.id} className="flex items-center justify-between border border-border rounded-lg p-2.5 text-xs bg-white">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-secondary">{t.id}</span>
                    <span className="font-medium text-text">{t.title}</span>
                    <span className="text-secondary">({t.assignee})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary">{t.dueDate}</span>
                    <Badge color={statusColor(t.status)}>{t.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ResourcesPage({ data, updateData, showToast }) {
  const [search, setSearch] = useState('');
  const [envFilter, setEnvFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currency = data?.settings?.currency || 'USD';
  const stats = resourceStats(data.resources);

  const filtered = (data.resources || []).filter(r => {
    const matchQ = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.service.toLowerCase().includes(search.toLowerCase());
    const matchE = envFilter === 'All' || r.environment === envFilter;
    const matchS = statusFilter === 'All' || r.status === statusFilter;
    return matchQ && matchE && matchS;
  });

  const refresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const updated = (data.resources || []).map(r => {
        if (r.status === 'Healthy' && Math.random() > 0.6) {
          const delta = Math.floor(Math.random() * 8) - 3;
          return { ...r, cpu: Math.max(0, Math.min(100, r.cpu + delta)), memory: Math.max(0, Math.min(100, r.memory + delta)), lastUpdated: new Date().toISOString() };
        }
        return { ...r, lastUpdated: new Date().toISOString() };
      });
      updateData({
        resources: updated,
        activities: [{ id: genId('ACT'), type: 'system', message: 'Simulated monitoring telemetry refreshed via ARM monitor stub', timestamp: new Date().toISOString(), severity: 'info' }, ...(data.activities || [])].slice(0, 20)
      });
      setIsRefreshing(false);
      if (showToast) showToast('Telemetry refreshed from simulated Azure Monitor', 'success');
    }, 450);
  };

  const ack = (id) => {
    updateData({
      alerts: (data.alerts || []).map(a => a.id === id ? { ...a, acknowledged: true } : a),
      activities: [{ id: genId('ACT'), type: 'resource', message: `Alert ${id} acknowledged by operator`, timestamp: new Date().toISOString(), severity: 'info' }, ...(data.activities || [])].slice(0, 20)
    });
    if (showToast) showToast('Alert acknowledged', 'info');
  };

  const activeAlerts = (data.alerts || []).filter(a => !a.acknowledged);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-text">Cloud Resources</h1>
          <p className="text-sm text-secondary">Simulated demo telemetry & health diagnostics · Zero paid cloud billing</p>
        </div>
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 border border-border bg-card rounded-lg text-sm hover:bg-gray-50 transition shadow-sm font-medium"
        >
          <Icon name="refresh-cw" size={14} className={isRefreshing ? 'animate-spin text-azure' : ''} />
          {isRefreshing ? 'Polling ARM Telemetry…' : 'Refresh Metrics'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI title="Total Resources" value={stats.total} icon="server" />
        <KPI title="Healthy" value={stats.healthy} icon="check-circle" color="success" />
        <KPI title="Attention" value={stats.attention} icon="alert-triangle" color="warning" />
        <KPI title="Avg CPU" value={`${stats.avgCpu}%`} icon="cpu" />
        <KPI title="Avg Memory" value={`${stats.avgMemory}%`} icon="memory-stick" />
        <KPI title="Est. Monthly Cost" value={fmtCurrency(stats.totalCost, currency)} sub="Simulated" icon="dollar-sign" />
      </div>

      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources…" className="px-3 py-2 border border-border rounded-lg text-sm w-52 bg-card" />
        {['All', 'Production', 'Staging', 'Development'].map(e => (
          <button key={e} onClick={() => setEnvFilter(e)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${envFilter === e ? 'bg-navy text-white' : 'bg-card border border-border text-secondary'}`}>{e}</button>
        ))}
        {['All', 'Healthy', 'Warning', 'Critical'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${statusFilter === s ? 'bg-navy text-white' : 'bg-card border border-border text-secondary'}`}>{s}</button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-secondary text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-2.5">Resource Name</th>
                <th className="text-left px-4 py-2.5">Service Type</th>
                <th className="text-left px-4 py-2.5">Environment</th>
                <th className="text-left px-4 py-2.5">Region</th>
                <th className="text-left px-4 py-2.5">Status</th>
                <th className="text-left px-4 py-2.5">CPU</th>
                <th className="text-left px-4 py-2.5">Memory</th>
                <th className="text-left px-4 py-2.5">Cost / Mo</th>
                <th className="text-left px-4 py-2.5">Telemetry Origin</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-secondary text-xs">
                    No resources match the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="border-t border-border hover:bg-blue-50/40 cursor-pointer transition" onClick={() => setSelected(r)}>
                    <td className="px-4 py-2.5 font-medium text-text font-mono text-xs">{r.name}</td>
                    <td className="px-4 py-2.5 text-secondary">{r.service}</td>
                    <td className="px-4 py-2.5 text-xs">{r.environment}</td>
                    <td className="px-4 py-2.5 text-secondary text-xs">{r.region}</td>
                    <td className="px-4 py-2.5"><Badge color={r.status === 'Healthy' ? 'green' : r.status === 'Warning' ? 'yellow' : 'red'}>{r.status}</Badge></td>
                    <td className="px-4 py-2.5 text-xs font-medium">{r.cpu}%</td>
                    <td className="px-4 py-2.5 text-xs font-medium">{r.memory}%</td>
                    <td className="px-4 py-2.5 text-xs font-medium">{fmtCurrency(r.monthlyCost, currency)}</td>
                    <td className="px-4 py-2.5"><span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-secondary">ARM Simulation</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts Section */}
      {activeAlerts.length > 0 ? (
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-text flex items-center gap-2">
              <Icon name="alert-triangle" size={18} className="text-warning" /> Active Telemetry Alerts (Simulated)
            </h3>
            <span className="text-xs text-secondary">{activeAlerts.length} pending review</span>
          </div>
          <div className="space-y-2">
            {activeAlerts.map(a => (
              <div key={a.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge color={a.severity === 'error' ? 'red' : 'yellow'}>{a.severity.toUpperCase()}</Badge>
                    <p className="text-sm font-semibold text-text">{a.title}</p>
                  </div>
                  <p className="text-xs text-secondary mt-1">{a.message}</p>
                </div>
                <button onClick={() => ack(a.id)} className="text-xs px-3 py-1.5 bg-white border border-border rounded-md hover:bg-gray-50 shadow-sm font-medium flex-shrink-0">Acknowledge</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-green-50/80 border border-green-200 rounded-xl p-4 flex items-center justify-between text-success">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg text-success">
              <Icon name="check-circle" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">All System Alerts Acknowledged</p>
              <p className="text-xs text-secondary">Zero unacknowledged high-severity telemetry alerts require investigation.</p>
            </div>
          </div>
          <Badge color="green">Healthy</Badge>
        </div>
      )}

      {/* Resource Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} wide>
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-secondary">{selected.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm p-3 bg-gray-50 rounded-lg">
              <div><span className="text-xs text-secondary block">Service</span><p className="font-medium text-text">{selected.service}</p></div>
              <div><span className="text-xs text-secondary block">Environment</span><p className="font-medium text-text">{selected.environment}</p></div>
              <div><span className="text-xs text-secondary block">Region</span><p className="font-medium text-text">{selected.region}</p></div>
              <div><span className="text-xs text-secondary block">Status</span><Badge color={selected.status === 'Healthy' ? 'green' : 'yellow'}>{selected.status}</Badge></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-secondary">CPU Load</p><p className="text-xl font-semibold text-text mt-0.5">{selected.cpu}%</p></div>
              <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-secondary">Memory Load</p><p className="text-xl font-semibold text-text mt-0.5">{selected.memory}%</p></div>
              <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-secondary">Est. Monthly Cost</p><p className="text-xl font-semibold text-text mt-0.5">{fmtCurrency(selected.monthlyCost, currency)}</p></div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-secondary leading-relaxed">
              <strong className="text-text block mb-1">Production Azure Integration Blueprint:</strong>
              In live enterprise deployment, this component would query the Azure Resource Manager (ARM) REST API or Azure Monitor Metrics endpoint (`https://management.azure.com/subscriptions/{subId}/resourceGroups/{rg}/providers/.../providers/microsoft.insights/metrics`). In this academic prototype, all values are deterministically simulated.
            </div>
            {selected.cpu < 20 && selected.environment === 'Development' && (
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg text-xs leading-relaxed">
                <strong className="text-ai block mb-1">AI Cost Optimization Suggestion:</strong>
                Low utilization detected on a non-production resource. Configuring an automated shutdown schedule outside standard operating hours can yield approximately ~{fmtCurrency(Math.round(selected.monthlyCost * 0.6), currency)}/month in cloud savings.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function AnalyticsPage({ data, showToast }) {
  const currency = data?.settings?.currency || 'USD';
  const projects = getProjectsWithProgress(data.projects, data.tasks);
  const stats = resourceStats(data.resources);
  const overdue = getOverdue(data.tasks, data.settings);
  const byCat = {};
  (data.resources || []).forEach(r => { byCat[r.category] = (byCat[r.category] || 0) + r.monthlyCost; });
  const costData = Object.entries(byCat).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0078D4', '#163A5F', '#16865B', '#D97706', '#6750A4', '#DC2626'];

  const taskDist = [
    { name: 'To Do', value: (data.tasks || []).filter(t => t.status === 'To Do').length },
    { name: 'In Progress', value: (data.tasks || []).filter(t => t.status === 'In Progress').length },
    { name: 'Blocked', value: (data.tasks || []).filter(t => t.status === 'Blocked').length },
    { name: 'Completed', value: (data.tasks || []).filter(t => t.status === 'Completed').length },
  ];

  const [summary, setSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const genSummary = () => {
    setIsGeneratingSummary(true);
    setTimeout(() => {
      const result = demoAI('Generate an Executive Summary', data);
      setSummary(result.content);
      setIsGeneratingSummary(false);
      if (showToast) showToast('Executive summary generated from workspace data', 'success');
    }, 450);
  };

  const exportCSV = () => {
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    const headers = ['ID', 'Name', 'Service', 'Category', 'Environment', 'Region', 'Status', 'CPU (%)', 'Memory (%)', 'Storage (%)', `Monthly Cost (${currency})`];
    const rows = [
      headers,
      ...(data.resources || []).map(r => [
        r.id,
        r.name,
        r.service,
        r.category,
        r.environment,
        r.region,
        r.status,
        r.cpu,
        r.memory,
        r.storage,
        r.monthlyCost
      ])
    ];
    const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudpilot-resources-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (showToast) showToast('CSV export downloaded successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-text">Analytics & Cost Insights</h1>
          <p className="text-sm text-secondary">Resource consumption, project velocity, and exportable financial telemetry</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={genSummary}
            disabled={isGeneratingSummary}
            className="px-3.5 py-2 bg-ai text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition flex items-center gap-1.5"
          >
            <Icon name="sparkles" size={15} className={isGeneratingSummary ? 'animate-spin' : ''} />
            {isGeneratingSummary ? 'Generating…' : 'Generate Executive Summary'}
          </button>
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 border border-border bg-card rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-1.5 shadow-sm"
          >
            <Icon name="download" size={15} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="font-heading font-semibold text-text mb-3">Cost by Service Category (Simulated)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={costData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {costData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => fmtCurrency(v, currency)} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-secondary text-center mt-1">Total estimated: {fmtCurrency(stats.totalCost, currency)} / month · Illustrative simulation</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="font-heading font-semibold text-text mb-3">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={taskDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {taskDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <h3 className="font-heading font-semibold text-text mb-3">Project Completion Overview</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={projects.map(p => ({ name: p.name.split(' ').slice(0, 2).join(' '), progress: p.progress }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E1E8F0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="progress" fill="#0078D4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {summary && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-heading font-semibold text-text mb-3 flex items-center gap-2">
            <Icon name="file-text" size={18} className="text-ai" /> Executive Summary
          </h3>
          <FormattedText text={summary} className="text-sm" />
          <p className="text-xs text-secondary mt-3 pt-2 border-t border-border">Generated by Demo AI from calculated metrics · Ready for viva review</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-sm font-medium text-secondary mb-1">Overdue Tasks</h4>
          <p className="text-2xl font-heading font-semibold text-error">{overdue.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-sm font-medium text-secondary mb-1">Resources Needing Attention</h4>
          <p className="text-2xl font-heading font-semibold text-warning">{stats.attention}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-sm font-medium text-secondary mb-1">Est. Monthly Cloud Cost</h4>
          <p className="text-2xl font-heading font-semibold text-text">{fmtCurrency(stats.totalCost, currency)}</p>
        </div>
      </div>
    </div>
  );
}

function DocumentsPage({ data, showToast }) {
  const documents = (data && Array.isArray(data.documents) && data.documents.length > 0) ? data.documents : INITIAL_DOCUMENTS;
  const [selected, setSelected] = useState(() => documents[0] || null);
  const [summary, setSummary] = useState(() => (documents[0] ? summarizeDocument(documents[0]) : null));
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = documents.filter(d => {
    const matchQ = !search || d.title.toLowerCase().includes(search.toLowerCase());
    const matchC = cat === 'All' || d.category === cat;
    return matchQ && matchC;
  });

  // Automatically select the first available document so the inspector is never empty
  useEffect(() => {
    if ((!selected || !filtered.some(d => d.id === selected.id)) && filtered.length > 0) {
      setSelected(filtered[0]);
      setSummary(summarizeDocument(filtered[0]));
    }
  }, [filtered, selected]);

  const doSummarize = () => {
    if (!selected) return;
    setIsSummarizing(true);
    setSummary(null);
    setTimeout(() => {
      setSummary(summarizeDocument(selected));
      setIsSummarizing(false);
      if (showToast) showToast(`Document "${selected.title}" analyzed`, 'success');
    }, 450);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold text-text">Documents</h1>
        <p className="text-sm text-secondary">Sample requirements, architecture notes, and operations reports with Demo AI summarization</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents…" className="px-3 py-2 border border-border rounded-lg text-sm w-52 bg-card" />
        {['All', 'Requirements', 'Architecture', 'Operations', 'Process', 'Technical'].map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${cat === c ? 'bg-navy text-white' : 'bg-card border border-border text-secondary'}`}>{c}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="p-4 bg-card rounded-xl border border-dashed border-border text-center text-xs text-secondary">
              <p className="font-medium text-text mb-1">No documents match this category</p>
              <button onClick={() => { setSearch(''); setCat('All'); }} className="mt-2 text-xs text-azure hover:underline font-medium">Reset filter</button>
            </div>
          ) : (
            filtered.map(d => (
              <button
                key={d.id}
                onClick={() => {
                  setSelected(d);
                  setSummary(summarizeDocument(d));
                }}
                className={`w-full text-left p-3 rounded-xl border transition ${selected?.id === d.id ? 'border-azure bg-blue-50/70 shadow-sm' : 'border-border bg-card hover:border-azure/40'}`}
              >
                <p className="text-sm font-semibold text-text">{d.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge color="gray">{d.category}</Badge>
                  <span className="text-xs text-secondary">{d.lastUpdated}</span>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4 shadow-sm min-h-[400px]">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                <div>
                  <h3 className="font-heading font-semibold text-text text-base">{selected.title}</h3>
                  <p className="text-xs text-secondary mt-0.5">Category: {selected.category} · File Format: {selected.fileType}</p>
                </div>
                <button
                  onClick={doSummarize}
                  disabled={isSummarizing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-ai text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition shadow-sm"
                >
                  <Icon name="sparkles" size={14} className={isSummarizing ? 'animate-spin' : ''} />
                  {isSummarizing ? 'Summarizing…' : 'Summarize with AI'}
                </button>
              </div>
              <pre className="text-xs text-secondary whitespace-pre-wrap font-body max-h-64 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-border/50">{selected.content}</pre>
              {summary && (
                <div className="mt-4 p-4 bg-purple-50/80 rounded-xl border border-purple-200 shadow-sm">
                  <p className="text-xs text-ai font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Icon name="sparkles" size={13} /> Demo AI Executive Briefing
                  </p>
                  <FormattedText text={summary.summary} className="text-sm" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-secondary text-sm py-12 px-4 text-center">
              <div className="p-3 bg-blue-50 text-azure rounded-xl mb-3">
                <Icon name="file-text" size={32} />
              </div>
              <h4 className="font-heading font-semibold text-text text-base">Select a Project Document</h4>
              <p className="text-xs text-secondary max-w-sm mt-1">Choose any technical document to inspect requirements and generate an AI briefing.</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-md">
                {documents.map(d => (
                  <button
                    key={d.id}
                    onClick={() => { setSelected(d); setSummary(summarizeDocument(d)); }}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border bg-white hover:border-azure hover:text-azure transition shadow-sm"
                  >
                    {d.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArchitecturePage() {
  const components = [
    { id: 'frontend', name: 'Azure Static Web Apps / App Service', role: 'Hosts the React frontend', useCase: 'Serve SPA with global CDN and Microsoft Entra ID authentication', flow: 'User → Static Web App CDN → React SPA', config: 'Static Web App connected to repository or Linux App Service plan', simulated: true },
    { id: 'api', name: 'Azure Functions / App Service', role: 'Backend API and business logic', useCase: 'REST endpoints, durable workflows, scheduled telemetry polling', flow: 'Frontend → API (OAuth2) → Data / AI Services', config: 'Function App or App Service with System-Assigned Managed Identity', simulated: true },
    { id: 'ai', name: 'Azure OpenAI', role: 'Enterprise Copilot and summarization', useCase: 'Grounded chat, document summarization, operational insights', flow: 'API → Azure OpenAI GPT-4o → Response payload', config: 'Cognitive Services resource + deployed model + RBAC Cognitive Services User', simulated: true },
    { id: 'sql', name: 'Azure SQL Database', role: 'Transactional data store', useCase: 'Projects, tasks, users, and relational governance records', flow: 'API ↔ Azure SQL via Managed Identity connection', config: 'General Purpose / Business Critical SQL, VNet Private Endpoint', simulated: true },
    { id: 'cosmos', name: 'Azure Cosmos DB', role: 'Activity, telemetry, and high-volume events', useCase: 'Activity audit logs, chat conversation histories, live event stream', flow: 'API ↔ Cosmos DB (SQL API container)', config: 'Cosmos DB account + autoscale RU provisioning', simulated: true },
    { id: 'blob', name: 'Azure Blob Storage', role: 'Document and binary storage', useCase: 'Uploaded project briefs, specifications, architecture diagrams', flow: 'API ↔ Azure Blob Storage (hot tier with lifecycle archive policies)', config: 'Storage Account (V2) + container SAS / Managed Identity tokens', simulated: true },
    { id: 'entra', name: 'Microsoft Entra ID (Azure AD)', role: 'Identity, authentication, and RBAC', useCase: 'Single Sign-On (SSO), user roles, conditional access policies', flow: 'User Browser → Entra ID OAuth2 login → JWT token', config: 'App Registration with authorized API scopes and group assignments', simulated: true },
    { id: 'monitor', name: 'Azure Monitor + Application Insights', role: 'Telemetry and observability', useCase: 'Distributed request tracing, error rate thresholds, resource alerts', flow: 'All services → Application Insights SDK → Log Analytics', config: 'Log Analytics Workspace + Application Insights connection string', simulated: true },
    { id: 'vault', name: 'Azure Key Vault', role: 'Secrets and cryptographic key management', useCase: 'Connection strings, certificates, encryption keys (zero client-side secrets)', flow: 'API / Functions → Key Vault via Managed Identity', config: 'Azure Key Vault with RBAC Key Vault Secrets User', simulated: true },
  ];

  const [selected, setSelected] = useState(() => components[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold text-text">Azure Architecture Explorer</h1>
        <p className="text-sm text-secondary mt-1">Proposed cloud deployment topology for this enterprise prototype · Safe academic simulation</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setSelected(components.find(c => c.id === 'entra'))}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${selected?.id === 'entra' ? 'ring-2 ring-azure border-navy bg-navy/15 text-navy font-bold' : 'border-navy bg-navy/5 text-navy hover:bg-navy/10'}`}
            >
              User + Microsoft Entra ID (SSO / IAM)
            </button>
            <div className="text-secondary text-xs">↓</div>
            <button
              onClick={() => setSelected(components.find(c => c.id === 'frontend'))}
              className={`px-6 py-3 rounded-xl border-2 text-sm font-medium transition ${selected?.id === 'frontend' ? 'ring-2 ring-azure border-azure bg-azure/15 font-bold' : 'border-azure bg-azure/5 hover:bg-azure/10'}`}
            >
              Frontend: Azure Static Web Apps / App Service (React)
            </button>
            <div className="text-secondary text-xs">↓</div>
            <button
              onClick={() => setSelected(components.find(c => c.id === 'api'))}
              className={`px-6 py-3 rounded-xl border-2 text-sm font-medium transition ${selected?.id === 'api' ? 'ring-2 ring-azure border-azure bg-azure/20 font-bold' : 'border-azure bg-azure/10 hover:bg-azure/20'}`}
            >
              Backend API: Azure Functions / App Service
            </button>
            <div className="flex gap-6 mt-2">
              <div className="flex flex-col items-center gap-2">
                <div className="text-secondary text-xs">↓</div>
                <button
                  onClick={() => setSelected(components.find(c => c.id === 'sql'))}
                  className={`px-3 py-2 rounded-lg border text-xs transition ${selected?.id === 'sql' ? 'ring-2 ring-azure border-azure bg-blue-50 font-bold' : 'border-border bg-white hover:border-azure'}`}
                >
                  Azure SQL Database
                </button>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-secondary text-xs">↓</div>
                <button
                  onClick={() => setSelected(components.find(c => c.id === 'cosmos'))}
                  className={`px-3 py-2 rounded-lg border text-xs transition ${selected?.id === 'cosmos' ? 'ring-2 ring-azure border-azure bg-blue-50 font-bold' : 'border-border bg-white hover:border-azure'}`}
                >
                  Cosmos DB (Logs)
                </button>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-secondary text-xs">↓</div>
                <button
                  onClick={() => setSelected(components.find(c => c.id === 'ai'))}
                  className={`px-3 py-2 rounded-lg border text-xs transition ${selected?.id === 'ai' ? 'ring-2 ring-ai border-ai bg-purple-100 font-bold' : 'border-ai bg-purple-50 text-ai hover:bg-purple-100'}`}
                >
                  Azure OpenAI
                </button>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-secondary text-xs">↓</div>
                <button
                  onClick={() => setSelected(components.find(c => c.id === 'blob'))}
                  className={`px-3 py-2 rounded-lg border text-xs transition ${selected?.id === 'blob' ? 'ring-2 ring-azure border-azure bg-blue-50 font-bold' : 'border-border bg-white hover:border-azure'}`}
                >
                  Blob Storage
                </button>
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <button
                onClick={() => setSelected(components.find(c => c.id === 'monitor'))}
                className={`px-3 py-2 rounded-lg border text-xs transition ${selected?.id === 'monitor' ? 'ring-2 ring-azure border-azure bg-blue-50 font-bold' : 'border-border bg-white hover:border-azure'}`}
              >
                Azure Monitor + App Insights
              </button>
              <button
                onClick={() => setSelected(components.find(c => c.id === 'vault'))}
                className={`px-3 py-2 rounded-lg border text-xs transition ${selected?.id === 'vault' ? 'ring-2 ring-azure border-azure bg-blue-50 font-bold' : 'border-border bg-white hover:border-azure'}`}
              >
                Azure Key Vault (Secrets)
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-secondary text-center mt-6">Click any node to inspect role, architectural flow, and configuration blueprint.</p>
      </div>

      {selected && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-secondary font-mono">{selected.id.toUpperCase()} COMPONENT</span>
              <h3 className="font-heading font-semibold text-text text-lg mt-0.5">{selected.name}</h3>
            </div>
            <Badge color="gray">{selected.simulated ? 'Simulated Architecture' : 'Connected'}</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">Role in Enterprise Topology</span>
              <p className="font-medium text-text">{selected.role}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">Primary Use Case</span>
              <p className="font-medium text-text">{selected.useCase}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">Architectural Data Flow</span>
              <p className="font-medium text-text font-mono text-xs">{selected.flow}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-secondary font-medium uppercase tracking-wider block mb-1">Production Configuration Blueprint</span>
              <p className="font-medium text-text text-xs">{selected.config}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage({ data, updateData, resetData, showToast }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const s = data.settings || {};

  const handleReset = () => {
    resetData();
    setConfirmReset(false);
    if (showToast) showToast('Workspace demo dataset restored to factory defaults', 'success');
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-heading font-semibold text-text">Settings</h1>
        <p className="text-sm text-secondary">Demonstration preferences, currency, and timeline evaluation parameters</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
        <div>
          <label className="text-xs text-secondary font-medium">Workspace Name</label>
          <input
            value={s.workspaceName || ''}
            onChange={e => updateData({ settings: { ...s, workspaceName: e.target.value } })}
            placeholder="e.g. Nexora Enterprise"
            className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-azure/30 bg-card"
          />
        </div>
        <div>
          <label className="text-xs text-secondary font-medium">Preferred Currency</label>
          <select
            value={s.currency || 'USD'}
            onChange={e => {
              updateData({ settings: { ...s, currency: e.target.value } });
              if (showToast) showToast(`Currency updated to ${e.target.value}`, 'info');
            }}
            className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-white"
          >
            <option value="USD">USD ($) — United States Dollar</option>
            <option value="EUR">EUR (€) — Euro</option>
            <option value="GBP">GBP (£) — British Pound</option>
            <option value="CAD">CAD (C$) — Canadian Dollar</option>
            <option value="AUD">AUD (A$) — Australian Dollar</option>
            <option value="JPY">JPY (¥) — Japanese Yen</option>
          </select>
          <p className="text-[11px] text-secondary mt-1">Updates cost metrics, charts, tables, and AI Copilot responses in real time.</p>
        </div>

        <div className="py-2 border-t border-border">
          <label className="text-xs text-secondary font-medium">Timeline Evaluation Date Strategy</label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input
                type="radio"
                name="referenceDateMode"
                value="demo"
                checked={s.referenceDateMode !== 'system'}
                onChange={() => updateData({ settings: { ...s, referenceDateMode: 'demo' } })}
              />
              <span>Demo Timeline Anchor (Recommended for Academic Viva)</span>
            </label>
            {s.referenceDateMode !== 'system' && (
              <div className="ml-6 flex items-center gap-2 mt-1">
                <span className="text-xs text-secondary">Anchor Date:</span>
                <input
                  type="date"
                  value={s.referenceDate || '2026-01-15'}
                  onChange={e => updateData({ settings: { ...s, referenceDate: e.target.value } })}
                  className="px-2 py-1 border border-border rounded text-xs bg-white"
                />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input
                type="radio"
                name="referenceDateMode"
                value="system"
                checked={s.referenceDateMode === 'system'}
                onChange={() => updateData({ settings: { ...s, referenceDateMode: 'system' } })}
              />
              <span>System Real-Time ({new Date().toISOString().slice(0, 10)})</span>
            </label>
          </div>
          <p className="text-[11px] text-secondary mt-2">Controls the reference timestamp used to calculate overdue tasks and project delivery risk.</p>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border">
          <div>
            <p className="text-sm font-medium text-text">Demo Environment</p>
            <p className="text-xs text-secondary">Academic demonstration sandbox (no cloud billing)</p>
          </div>
          <Badge color="yellow">Active</Badge>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-border">
          <div>
            <p className="text-sm font-medium text-text">AI Mode</p>
            <p className="text-xs text-secondary">Deterministic grounding over client-side dataset</p>
          </div>
          <Badge color="purple">Demo AI</Badge>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-border">
          <div>
            <p className="text-sm font-medium text-text">Cloud Integration Status</p>
            <p className="text-xs text-secondary">Simulated metrics (ARM / Azure Monitor blueprint)</p>
          </div>
          <Badge color="gray">Simulated</Badge>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="font-heading font-semibold text-text mb-2">About CloudPilot AI</h3>
        <p className="text-sm text-secondary">CloudPilot AI — Academic prototype for “Cloud-Based Intelligent Enterprise Application Development Using Azure and AI.” Demonstrates unified enterprise dashboard, project governance, simulated cloud infrastructure observability, and deterministic AI copilot insights. Developed for research and architectural exploration.</p>
      </div>

      <div className="bg-card rounded-xl border border-error/30 p-5 shadow-sm">
        <h3 className="font-heading font-semibold text-error mb-2">Reset Demo Data</h3>
        <p className="text-sm text-secondary mb-3">Restores the original projects, tasks, resources, documents, settings, and clears chat history in browser localStorage.</p>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="px-4 py-2 border border-error text-error rounded-lg text-sm hover:bg-red-50 font-medium transition">Reset Dataset</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleReset} className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">Confirm Reset</button>
            <button onClick={() => setConfirmReset(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== APP SHELL =====================
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'copilot', label: 'AI Copilot', icon: 'sparkles' },
  { id: 'projects', label: 'Projects & Tasks', icon: 'folder-kanban' },
  { id: 'resources', label: 'Cloud Resources', icon: 'cloud' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart-3' },
  { id: 'documents', label: 'Documents', icon: 'file-text' },
  { id: 'architecture', label: 'Architecture', icon: 'network' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];
if (typeof window !== 'undefined') {
  window.NAV = NAV;
}

function App() {
  const [data, setData] = useState(() => loadData());
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [headerSearch, setHeaderSearch] = useState('');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  useEffect(() => { saveData(data); }, [data]);
  useEffect(() => {
    scheduleLucideBatch();
  }, [page]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(current => current && current.message === message ? null : current);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  const updateData = useCallback((partial) => {
    setData(prev => ({ ...prev, ...partial }));
  }, []);

  const resetData = useCallback(() => {
    try {
      localStorage.removeItem('cloudpilot_data');
    } catch (e) {}
    setData(createInitialData());
  }, []);

  const handleHeaderSearch = (e) => {
    if (e.key === 'Enter') {
      const q = headerSearch.trim();
      if (q) {
        setProjectSearchQuery(q);
        setPage('projects');
        showToast(`Searching projects for "${q}"`, 'info');
      }
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard data={data} setPage={setPage} />;
      case 'copilot': return <Copilot data={data} setPage={setPage} updateData={updateData} showToast={showToast} />;
      case 'projects': return <ProjectsPage data={data} updateData={updateData} showToast={showToast} initialSearch={projectSearchQuery} />;
      case 'resources': return <ResourcesPage data={data} updateData={updateData} showToast={showToast} />;
      case 'analytics': return <AnalyticsPage data={data} showToast={showToast} />;
      case 'documents': return <DocumentsPage data={data} showToast={showToast} />;
      case 'architecture': return <ArchitecturePage />;
      case 'settings': return <SettingsPage data={data} updateData={updateData} resetData={resetData} showToast={showToast} />;
      default: return <Dashboard data={data} setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-navy text-white sidebar-transition ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-2 px-4 h-14 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-azure flex items-center justify-center font-heading font-bold text-sm shadow-sm">CP</div>
          <div className="min-w-0">
            <p className="font-heading font-semibold text-sm">CloudPilot AI</p>
            <p className="text-[10px] text-white/60 truncate max-w-[140px]" title={data.settings?.workspaceName || 'Nexora Enterprise'}>
              {data.settings?.workspaceName || 'Nexora Enterprise'}
            </p>
          </div>
        </div>
        <nav className="p-3 space-y-0.5">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => { setPage(n.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${page === n.id ? 'bg-white/15 text-white font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon name={n.icon} size={18} />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/70 leading-relaxed">
            <div className="font-semibold text-white/90 mb-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> College Demo Sandbox
            </div>
            Simulated cloud telemetry · No real Azure billing
          </div>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded hover:bg-gray-100" aria-label="Toggle navigation"><Icon name="menu" size={20} /></button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-secondary bg-gray-50 border border-border px-3 py-1.5 rounded-lg">
              <Icon name="search" size={15} />
              <input
                value={headerSearch}
                onChange={e => setHeaderSearch(e.target.value)}
                onKeyDown={handleHeaderSearch}
                placeholder="Search projects (Press Enter)…"
                className="bg-transparent outline-none w-52 text-text placeholder:text-secondary text-xs"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-azure border border-blue-200 font-medium">
              <Icon name="award" size={13} /> College Project Demonstration
            </span>
            <button onClick={() => setPage('copilot')} className="p-2 rounded-lg hover:bg-purple-50 text-ai transition" title="Open AI Copilot"><Icon name="sparkles" size={18} /></button>
            <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-semibold shadow-sm" title={data.settings?.workspaceName || 'Nexora Enterprise'}>NE</div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
