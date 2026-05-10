import { useState } from "react";
import {
    Plug,
    Search,
    X,
    Check,
    AlertCircle,
    Settings,
    Download,
    RefreshCw,
    ExternalLink,
    ChevronRight,
    Calendar,
    FileText,
    Database,
    Mail,
    DollarSign,
    Users,
    Shield,
    Activity,
    Zap,
    Clock,
    TrendingUp,
    Key,
    Code,
    Webhook,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Play,
    Pause,
    Plus,
    Star,
    Globe,
    Sparkles,
    BarChart3,
    MessageSquare,
    Lock,
    Layers,
} from "lucide-react";

/* ===== Types & Interfaces ===== */

type IntegrationStatus = "Connected" | "Disconnected" | "Error" | "Syncing";
type IntegrationCategory =
    | "HRIS & Payroll"
    | "Document Management"
    | "Calendar & Scheduling"
    | "Communication"
    | "Compliance & Regulatory"
    | "Accounting & Finance"
    | "Analytics & Reporting"
    | "Developer Tools";

interface Integration {
    id: string;
    name: string;
    provider: string;
    description: string;
    category: IntegrationCategory;
    status: IntegrationStatus;
    logo: string;
    isConnected: boolean;
    lastSync?: string;
    syncFrequency?: string;
    features: string[];
    setupComplexity: "Easy" | "Medium" | "Advanced";
    dataShared?: string[];
    connectedDate?: string;
}

interface SyncLog {
    id: string;
    integration: string;
    timestamp: string;
    status: "Success" | "Failed" | "Partial";
    recordsSynced: number;
    duration: string;
    errors?: string[];
}

/* ===== Mock Data ===== */

const INTEGRATIONS: Integration[] = [
    {
        id: "INT-001",
        name: "Thrive HR",
        provider: "Thrive",
        description: "Sync employee data, contracts, and leave records with Ireland's leading HRIS platform",
        category: "HRIS & Payroll",
        status: "Connected",
        logo: "🏢",
        isConnected: true,
        lastSync: "2026-02-06T11:45:00Z",
        syncFrequency: "Every 4 hours",
        features: ["Employee data sync", "Contract management", "Leave tracking", "Performance reviews"],
        setupComplexity: "Easy",
        dataShared: ["Employee records", "Employment contracts", "Leave balances", "Performance data"],
        connectedDate: "2025-08-15",
    },
    {
        id: "INT-002",
        name: "Revenue ROS (Online Service)",
        provider: "Revenue Commissioners",
        description: "Direct integration with Revenue's ROS system for PAYE Modernisation compliance and real-time reporting",
        category: "Compliance & Regulatory",
        status: "Connected",
        logo: "🇮🇪",
        isConnected: true,
        lastSync: "2026-02-06T09:30:00Z",
        syncFrequency: "Daily",
        features: ["PAYE submissions", "Real-time reporting", "P45/P60 generation", "Tax compliance"],
        setupComplexity: "Advanced",
        dataShared: ["Payroll data", "Tax information", "Employee tax details"],
        connectedDate: "2024-11-20",
    },
    {
        id: "INT-003",
        name: "BrightPay",
        provider: "BrightPay",
        description: "Irish payroll software integration for automated payroll processing and reporting",
        category: "HRIS & Payroll",
        status: "Connected",
        logo: "💰",
        isConnected: true,
        lastSync: "2026-02-06T08:00:00Z",
        syncFrequency: "Weekly",
        features: ["Payroll processing", "Payslip generation", "Pension integration", "Leave calculations"],
        setupComplexity: "Medium",
        dataShared: ["Payroll data", "Employee salaries", "Deductions", "Pension contributions"],
        connectedDate: "2025-01-10",
    },
    {
        id: "INT-004",
        name: "Microsoft 365",
        provider: "Microsoft",
        description: "Connect Outlook calendar, Teams, and OneDrive for seamless document and meeting management",
        category: "Calendar & Scheduling",
        status: "Connected",
        logo: "🔷",
        isConnected: true,
        lastSync: "2026-02-06T12:00:00Z",
        syncFrequency: "Real-time",
        features: ["Calendar sync", "Teams meetings", "Document storage", "Email integration"],
        setupComplexity: "Easy",
        dataShared: ["Calendar events", "Meeting invites", "Documents", "Contact data"],
        connectedDate: "2024-06-15",
    },
    {
        id: "INT-005",
        name: "DocuSign",
        provider: "DocuSign",
        description: "Electronic signature integration for employment contracts, policies, and compliance documents",
        category: "Document Management",
        status: "Connected",
        logo: "✍️",
        isConnected: true,
        lastSync: "2026-02-05T16:20:00Z",
        syncFrequency: "On-demand",
        features: ["E-signatures", "Contract workflow", "Audit trails", "Template management"],
        setupComplexity: "Easy",
        dataShared: ["Signed documents", "Signature status", "Audit logs"],
        connectedDate: "2025-03-22",
    },
    {
        id: "INT-006",
        name: "Xero",
        provider: "Xero",
        description: "Accounting software integration for invoicing, expense tracking, and financial reporting",
        category: "Accounting & Finance",
        status: "Disconnected",
        logo: "📊",
        isConnected: false,
        features: ["Invoice generation", "Expense tracking", "Financial reports", "Bank reconciliation"],
        setupComplexity: "Medium",
    },
    {
        id: "INT-007",
        name: "Slack",
        provider: "Slack",
        description: "Team communication platform for instant notifications, updates, and collaboration",
        category: "Communication",
        status: "Disconnected",
        logo: "💬",
        isConnected: false,
        features: ["Real-time notifications", "Channel integration", "File sharing", "Bot commands"],
        setupComplexity: "Easy",
    },
    {
        id: "INT-008",
        name: "Google Workspace",
        provider: "Google",
        description: "Integrate Google Calendar, Drive, and Gmail for enhanced productivity",
        category: "Calendar & Scheduling",
        status: "Disconnected",
        logo: "🔴",
        isConnected: false,
        features: ["Calendar sync", "Drive integration", "Gmail connectivity", "Docs collaboration"],
        setupComplexity: "Easy",
    },
    {
        id: "INT-009",
        name: "Sage Business Cloud",
        provider: "Sage",
        description: "Irish accounting and payroll software for comprehensive financial management",
        category: "Accounting & Finance",
        status: "Error",
        logo: "🟢",
        isConnected: true,
        lastSync: "2026-02-04T14:30:00Z",
        syncFrequency: "Daily",
        features: ["Payroll integration", "Accounting sync", "VAT reporting", "Expense management"],
        setupComplexity: "Advanced",
        dataShared: ["Payroll data", "Invoice data", "Expense records"],
        connectedDate: "2025-07-18",
    },
    {
        id: "INT-010",
        name: "Zapier",
        provider: "Zapier",
        description: "Automation platform to connect your HR Advisory system with 5000+ apps",
        category: "Developer Tools",
        status: "Disconnected",
        logo: "⚡",
        isConnected: false,
        features: ["Workflow automation", "Custom triggers", "Multi-app workflows", "Data routing"],
        setupComplexity: "Medium",
    },
    {
        id: "INT-011",
        name: "WRC eForms",
        provider: "Workplace Relations Commission",
        description: "Direct submission of WRC forms and adjudication documentation",
        category: "Compliance & Regulatory",
        status: "Disconnected",
        logo: "⚖️",
        isConnected: false,
        features: ["Form submission", "Case tracking", "Document upload", "Adjudication monitoring"],
        setupComplexity: "Advanced",
    },
    {
        id: "INT-012",
        name: "Power BI",
        provider: "Microsoft",
        description: "Advanced analytics and business intelligence reporting for HR metrics",
        category: "Analytics & Reporting",
        status: "Disconnected",
        logo: "📈",
        isConnected: false,
        features: ["Custom dashboards", "Data visualization", "Advanced analytics", "Report scheduling"],
        setupComplexity: "Advanced",
    },
];

const SYNC_LOGS: SyncLog[] = [
    {
        id: "LOG-001",
        integration: "Thrive HR",
        timestamp: "2026-02-06T11:45:00Z",
        status: "Success",
        recordsSynced: 1247,
        duration: "2m 15s",
    },
    {
        id: "LOG-002",
        integration: "Microsoft 365",
        timestamp: "2026-02-06T12:00:00Z",
        status: "Success",
        recordsSynced: 89,
        duration: "45s",
    },
    {
        id: "LOG-003",
        integration: "Revenue ROS",
        timestamp: "2026-02-06T09:30:00Z",
        status: "Success",
        recordsSynced: 342,
        duration: "3m 42s",
    },
    {
        id: "LOG-004",
        integration: "Sage Business Cloud",
        timestamp: "2026-02-04T14:30:00Z",
        status: "Failed",
        recordsSynced: 0,
        duration: "1m 10s",
        errors: ["Authentication failed", "API rate limit exceeded"],
    },
    {
        id: "LOG-005",
        integration: "BrightPay",
        timestamp: "2026-02-06T08:00:00Z",
        status: "Success",
        recordsSynced: 523,
        duration: "1m 55s",
    },
    {
        id: "LOG-006",
        integration: "DocuSign",
        timestamp: "2026-02-05T16:20:00Z",
        status: "Partial",
        recordsSynced: 12,
        duration: "38s",
        errors: ["2 documents pending signature"],
    },
];

/* ===== Helper Functions ===== */

function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString("en-IE", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getStatusBadgeStyles(status: IntegrationStatus) {
    const styles = {
        Connected: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Disconnected: "bg-slate-50 text-slate-700 border-slate-200",
        Error: "bg-red-50 text-red-700 border-red-200",
        Syncing: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return styles[status] || styles.Disconnected;
}

function getStatusIcon(status: IntegrationStatus) {
    const icons = {
        Connected: CheckCircle2,
        Disconnected: XCircle,
        Error: AlertCircle,
        Syncing: RefreshCw,
    };
    return icons[status] || XCircle;
}

function getSyncStatusBadgeStyles(status: SyncLog["status"]) {
    const styles = {
        Success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Failed: "bg-red-50 text-red-700 border-red-200",
        Partial: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return styles[status];
}

/* ===== Main Component ===== */

export function IntegrationsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | "All">("All");
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
    const [activeTab, setActiveTab] = useState<"connected" | "available" | "logs" | "api">(
        "connected"
    );
    const [showMarketplace, setShowMarketplace] = useState(false);

    const filteredIntegrations = INTEGRATIONS.filter((integration) => {
        const matchesSearch =
            integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            integration.provider.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const connectedIntegrations = filteredIntegrations.filter((i) => i.isConnected);
    const availableIntegrations = filteredIntegrations.filter((i) => !i.isConnected);
    const errorIntegrations = connectedIntegrations.filter((i) => i.status === "Error");

    const categories: (IntegrationCategory | "All")[] = [
        "All",
        "HRIS & Payroll",
        "Document Management",
        "Calendar & Scheduling",
        "Communication",
        "Compliance & Regulatory",
        "Accounting & Finance",
        "Analytics & Reporting",
        "Developer Tools",
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            <div className="max-w-[1600px] mx-auto p-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                                <Plug className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-[24px] font-[700] text-foreground">Integrations</h1>
                                <p className="text-[13px] text-muted-foreground">
                                    Connect your HR Advisory platform with payroll, compliance, and business tools
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="h-9 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export Config
                            </button>
                            <button
                                className="h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                onClick={() => setShowMarketplace(true)}
                            >
                                <Plug className="w-4 h-4" />
                                Browse Marketplace
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 text-[12px] font-[500]">
                                <TrendingUp className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">
                            {connectedIntegrations.length}
                        </div>
                        <div className="text-[13px] text-muted-foreground">Active Integrations</div>
                        <div className="text-[12px] text-muted-foreground mt-1">
                            {INTEGRATIONS.length} total available
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex items-center gap-1 text-blue-600 text-[12px] font-[500]">
                                <RefreshCw className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">
                            {SYNC_LOGS.filter((l) => l.status === "Success").length}
                        </div>
                        <div className="text-[13px] text-muted-foreground">Successful Syncs</div>
                        <div className="text-[12px] text-muted-foreground mt-1">Last 24 hours</div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex items-center gap-1 text-red-600 text-[12px] font-[500]">
                                {errorIntegrations.length > 0 && <AlertTriangle className="w-3.5 h-3.5" />}
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">
                            {errorIntegrations.length}
                        </div>
                        <div className="text-[13px] text-muted-foreground">Integration Errors</div>
                        <div className="text-[12px] text-muted-foreground mt-1">Require attention</div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                                <Database className="w-5 h-5 text-violet-600" />
                            </div>
                            <div className="flex items-center gap-1 text-violet-600 text-[12px] font-[500]">
                                <TrendingUp className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">
                            {SYNC_LOGS.reduce((sum, log) => sum + log.recordsSynced, 0).toLocaleString()}
                        </div>
                        <div className="text-[13px] text-muted-foreground">Records Synced</div>
                        <div className="text-[12px] text-muted-foreground mt-1">Last 24 hours</div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-xl border border-border p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search integrations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-9 pr-9 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as any)}
                            className="h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-border mb-6">
                    <div className="border-b border-border px-6">
                        <div className="flex gap-1 -mb-px overflow-x-auto">
                            {[
                                { id: "connected", label: "Connected", count: connectedIntegrations.length },
                                { id: "available", label: "Available", count: availableIntegrations.length },
                                { id: "logs", label: "Sync Logs", count: SYNC_LOGS.length },
                                { id: "api", label: "API & Webhooks" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 h-12 text-[13px] font-[500] border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? "border-indigo-600 text-indigo-600"
                                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                        }`}
                                >
                                    {tab.label}
                                    {tab.count !== undefined && (
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-[600]">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Connected Tab */}
                        {activeTab === "connected" && (
                            <div className="space-y-4">
                                {connectedIntegrations.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                            <Plug className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-[15px] font-[600] text-foreground mb-1">
                                            No integrations connected
                                        </h3>
                                        <p className="text-[13px] text-muted-foreground">
                                            Connect your first integration to get started
                                        </p>
                                    </div>
                                ) : (
                                    connectedIntegrations.map((integration) => {
                                        const StatusIcon = getStatusIcon(integration.status);
                                        return (
                                            <div
                                                key={integration.id}
                                                className="bg-slate-50 rounded-lg p-5 border border-border hover:border-indigo-200 hover:shadow-sm transition-all"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-white border border-border flex items-center justify-center text-[24px] flex-shrink-0">
                                                        {integration.logo}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="text-[15px] font-[600] text-foreground">
                                                                        {integration.name}
                                                                    </h3>
                                                                    <span
                                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-[500] border ${getStatusBadgeStyles(
                                                                            integration.status
                                                                        )}`}
                                                                    >
                                                                        <StatusIcon className="w-3 h-3" />
                                                                        {integration.status}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[13px] text-muted-foreground mb-3">
                                                                    {integration.description}
                                                                </p>
                                                                <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground">
                                                                    {integration.lastSync && (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Clock className="w-3.5 h-3.5" />
                                                                            Last sync: {formatDateTime(integration.lastSync)}
                                                                        </div>
                                                                    )}
                                                                    {integration.syncFrequency && (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <RefreshCw className="w-3.5 h-3.5" />
                                                                            {integration.syncFrequency}
                                                                        </div>
                                                                    )}
                                                                    {integration.connectedDate && (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Calendar className="w-3.5 h-3.5" />
                                                                            Connected since{" "}
                                                                            {new Date(integration.connectedDate).toLocaleDateString(
                                                                                "en-IE",
                                                                                { month: "short", year: "numeric" }
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => setSelectedIntegration(integration)}
                                                                    className="p-2 rounded-lg hover:bg-white transition-colors"
                                                                    title="Settings"
                                                                >
                                                                    <Settings className="w-4 h-4 text-muted-foreground" />
                                                                </button>
                                                                <button
                                                                    className="p-2 rounded-lg hover:bg-white transition-colors"
                                                                    title="Sync now"
                                                                >
                                                                    <RefreshCw className="w-4 h-4 text-muted-foreground" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {integration.features.slice(0, 4).map((feature, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-[500] bg-white border border-border"
                                                                >
                                                                    <Check className="w-3 h-3 text-emerald-600" />
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {/* Available Tab */}
                        {activeTab === "available" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableIntegrations.map((integration) => (
                                    <div
                                        key={integration.id}
                                        className="bg-white border border-border rounded-lg p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-border flex items-center justify-center text-[24px]">
                                                {integration.logo}
                                            </div>
                                            <span
                                                className={`text-[11px] font-[500] px-2.5 py-1 rounded-md ${integration.setupComplexity === "Easy"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : integration.setupComplexity === "Medium"
                                                            ? "bg-amber-50 text-amber-700"
                                                            : "bg-red-50 text-red-700"
                                                    }`}
                                            >
                                                {integration.setupComplexity}
                                            </span>
                                        </div>
                                        <h3 className="text-[14px] font-[600] text-foreground mb-1">
                                            {integration.name}
                                        </h3>
                                        <p className="text-[12px] text-muted-foreground mb-3 line-clamp-2">
                                            {integration.description}
                                        </p>
                                        <div className="space-y-2 mb-4">
                                            {integration.features.slice(0, 3).map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 text-[12px] text-muted-foreground"
                                                >
                                                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                            <Plug className="w-4 h-4" />
                                            Connect
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sync Logs Tab */}
                        {activeTab === "logs" && (
                            <div className="space-y-3">
                                {SYNC_LOGS.map((log) => (
                                    <div
                                        key={log.id}
                                        className="bg-slate-50 rounded-lg p-4 border border-border"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center">
                                                    <Database className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[14px] font-[600] text-foreground">
                                                        {log.integration}
                                                    </h3>
                                                    <p className="text-[12px] text-muted-foreground">
                                                        {formatDateTime(log.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-[500] border ${getSyncStatusBadgeStyles(
                                                    log.status
                                                )}`}
                                            >
                                                {log.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 text-[12px] text-muted-foreground ml-13">
                                            <div className="flex items-center gap-1.5">
                                                <Database className="w-3.5 h-3.5" />
                                                {log.recordsSynced.toLocaleString()} records
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {log.duration}
                                            </div>
                                        </div>
                                        {log.errors && log.errors.length > 0 && (
                                            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                                                {log.errors.map((error, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-2 text-[12px] text-red-700"
                                                    >
                                                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                                        <span>{error}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* API & Webhooks Tab */}
                        {activeTab === "api" && (
                            <div className="space-y-6">
                                <div className="bg-slate-50 rounded-lg p-6 border border-border">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                                            <Key className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-[15px] font-[600] text-foreground mb-1">API Access</h3>
                                            <p className="text-[13px] text-muted-foreground">
                                                Generate API keys to integrate with custom applications
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-white border border-border rounded-lg px-4 py-3 font-mono text-[12px] text-muted-foreground">
                                                sk_live_••••••••••••••••••••••••••••3k8j
                                            </div>
                                            <button className="h-10 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors">
                                                Copy
                                            </button>
                                        </div>
                                        <button className="h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            Generate New API Key
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-6 border border-border">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-violet-50 flex items-center justify-center">
                                            <Webhook className="w-6 h-6 text-violet-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-[15px] font-[600] text-foreground mb-1">Webhooks</h3>
                                            <p className="text-[13px] text-muted-foreground">
                                                Receive real-time notifications when events occur
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="bg-white border border-border rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <div className="text-[13px] font-[500] text-foreground mb-1">
                                                        Document Signed
                                                    </div>
                                                    <div className="text-[12px] text-muted-foreground font-mono">
                                                        https://api.hradvisory.ie/webhooks/doc-signed
                                                    </div>
                                                </div>
                                                <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-[500] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Active
                                                </span>
                                            </div>
                                            <div className="text-[12px] text-muted-foreground">
                                                Last triggered: 2 hours ago
                                            </div>
                                        </div>
                                        <button className="h-9 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors flex items-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            Add Webhook
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-start gap-3">
                                        <Code className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-[13px] font-[500] text-blue-900 mb-1">
                                                API Documentation
                                            </div>
                                            <p className="text-[12px] text-blue-700 mb-2">
                                                Learn how to integrate with our REST API and webhooks
                                            </p>
                                            <a
                                                href="#"
                                                className="inline-flex items-center gap-1.5 text-[12px] font-[500] text-blue-600 hover:text-blue-700"
                                            >
                                                View Documentation
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Integration Detail Modal */}
            {selectedIntegration && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0" onClick={() => setSelectedIntegration(null)} />
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-border flex items-center justify-center text-[20px]">
                                    {selectedIntegration.logo}
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-[600] text-foreground">
                                        {selectedIntegration.name}
                                    </h2>
                                    <p className="text-[12px] text-muted-foreground">
                                        {selectedIntegration.provider}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedIntegration(null)}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-[14px] font-[600] text-foreground mb-2">Description</h3>
                                <p className="text-[13px] text-muted-foreground">
                                    {selectedIntegration.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[14px] font-[600] text-foreground mb-3">Features</h3>
                                <div className="space-y-2">
                                    {selectedIntegration.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 text-[13px] text-foreground"
                                        >
                                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedIntegration.dataShared && (
                                <div>
                                    <h3 className="text-[14px] font-[600] text-foreground mb-3">Data Shared</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedIntegration.dataShared.map((data, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex px-2.5 py-1 rounded-md text-[12px] font-[500] bg-slate-100 text-slate-700"
                                            >
                                                {data}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-border flex gap-3">
                                <button className="flex-1 h-10 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors">
                                    Configure Settings
                                </button>
                                <button className="h-10 px-4 rounded-lg text-[13px] font-[500] border border-red-200 text-red-700 hover:bg-red-50 transition-colors">
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Marketplace Modal */}
            {showMarketplace && (
                <BrowseMarketplaceModal onClose={() => setShowMarketplace(false)} existingIntegrations={INTEGRATIONS} />
            )}
        </div>
    );
}

/* ===== Marketplace Types & Data ===== */

interface MarketplaceApp {
    id: string;
    name: string;
    provider: string;
    logo: string;
    description: string;
    category: IntegrationCategory;
    features: string[];
    setupComplexity: "Easy" | "Medium" | "Advanced";
    rating: number;
    reviews: number;
    installs: string;
    isFeatured?: boolean;
    isNew?: boolean;
    isPopular?: boolean;
    isPremium?: boolean;
}

const MARKETPLACE_APPS: MarketplaceApp[] = [
    { id: "MKT-001", name: "Xero", provider: "Xero", logo: "📊", description: "Accounting software integration for invoicing, expense tracking, and financial reporting", category: "Accounting & Finance", features: ["Invoice generation", "Expense tracking", "Financial reports", "Bank reconciliation"], setupComplexity: "Medium", rating: 4.7, reviews: 1240, installs: "48K+", isFeatured: true, isPopular: true },
    { id: "MKT-002", name: "Slack", provider: "Slack", logo: "💬", description: "Team communication platform for instant notifications, updates, and collaboration", category: "Communication", features: ["Real-time notifications", "Channel integration", "File sharing", "Bot commands"], setupComplexity: "Easy", rating: 4.8, reviews: 3150, installs: "120K+", isFeatured: true, isPopular: true },
    { id: "MKT-003", name: "Google Workspace", provider: "Google", logo: "🔴", description: "Integrate Google Calendar, Drive, and Gmail for enhanced productivity", category: "Calendar & Scheduling", features: ["Calendar sync", "Drive integration", "Gmail connectivity", "Docs collaboration"], setupComplexity: "Easy", rating: 4.6, reviews: 2870, installs: "95K+", isPopular: true },
    { id: "MKT-004", name: "Zapier", provider: "Zapier", logo: "⚡", description: "Automation platform to connect your HR Advisory system with 5000+ apps", category: "Developer Tools", features: ["Workflow automation", "Custom triggers", "Multi-app workflows", "Data routing"], setupComplexity: "Medium", rating: 4.5, reviews: 2100, installs: "76K+", isFeatured: true },
    { id: "MKT-005", name: "WRC eForms", provider: "Workplace Relations Commission", logo: "⚖️", description: "Direct submission of WRC forms and adjudication documentation", category: "Compliance & Regulatory", features: ["Form submission", "Case tracking", "Document upload", "Adjudication monitoring"], setupComplexity: "Advanced", rating: 4.2, reviews: 340, installs: "8.5K+" },
    { id: "MKT-006", name: "Power BI", provider: "Microsoft", logo: "📈", description: "Advanced analytics and business intelligence reporting for HR metrics", category: "Analytics & Reporting", features: ["Custom dashboards", "Data visualization", "Advanced analytics", "Report scheduling"], setupComplexity: "Advanced", rating: 4.6, reviews: 1890, installs: "62K+", isPopular: true },
    { id: "MKT-007", name: "HubSpot CRM", provider: "HubSpot", logo: "🟠", description: "CRM integration for managing client relationships, deal tracking, and sales pipeline automation", category: "Communication", features: ["Client contact management", "Deal pipeline tracking", "Email campaigns", "Reporting dashboards"], setupComplexity: "Medium", rating: 4.7, reviews: 4200, installs: "150K+", isFeatured: true, isPopular: true },
    { id: "MKT-008", name: "Notion", provider: "Notion Labs", logo: "📝", description: "Collaborative workspace for project documentation, wikis, and internal knowledge management", category: "Document Management", features: ["Wiki templates", "Project tracking", "Document collaboration", "Knowledge base"], setupComplexity: "Easy", rating: 4.8, reviews: 5600, installs: "200K+", isNew: true, isPopular: true },
    { id: "MKT-009", name: "Asana", provider: "Asana", logo: "🔶", description: "Project and task management platform for tracking advisory work and team deadlines", category: "Calendar & Scheduling", features: ["Task management", "Project timelines", "Team workload view", "Custom fields"], setupComplexity: "Easy", rating: 4.5, reviews: 3400, installs: "110K+", isPopular: true },
    { id: "MKT-010", name: "Jira", provider: "Atlassian", logo: "🔵", description: "Issue tracking and project management for technical compliance and audit work", category: "Developer Tools", features: ["Issue tracking", "Sprint planning", "Custom workflows", "Reporting"], setupComplexity: "Advanced", rating: 4.3, reviews: 2800, installs: "85K+" },
    { id: "MKT-011", name: "Greenhouse", provider: "Greenhouse Software", logo: "🌿", description: "Applicant tracking and recruitment management integrated with your HR advisory data", category: "HRIS & Payroll", features: ["Job posting", "Applicant tracking", "Interview scheduling", "Offer management"], setupComplexity: "Medium", rating: 4.6, reviews: 1560, installs: "42K+", isNew: true },
    { id: "MKT-012", name: "LegalSifter", provider: "LegalSifter", logo: "📜", description: "AI-powered contract review for employment agreements, NDAs, and compliance documentation", category: "Compliance & Regulatory", features: ["AI contract review", "Risk identification", "Clause library", "Compliance checks"], setupComplexity: "Medium", rating: 4.4, reviews: 680, installs: "15K+", isNew: true, isPremium: true },
    { id: "MKT-013", name: "Stripe Billing", provider: "Stripe", logo: "💳", description: "Automated invoicing and payment collection for advisory service fees and retainers", category: "Accounting & Finance", features: ["Automated invoicing", "Payment collection", "Revenue recognition", "Client billing portal"], setupComplexity: "Medium", rating: 4.8, reviews: 3900, installs: "130K+", isFeatured: true, isPopular: true },
    { id: "MKT-014", name: "Tableau", provider: "Salesforce", logo: "📉", description: "Enterprise data visualisation for workforce analytics, compliance reporting, and client insights", category: "Analytics & Reporting", features: ["Interactive dashboards", "Advanced calculations", "Data blending", "Scheduled reports"], setupComplexity: "Advanced", rating: 4.5, reviews: 2400, installs: "55K+", isPremium: true },
    { id: "MKT-015", name: "Mailchimp", provider: "Intuit", logo: "🐒", description: "Email marketing for client communications, policy updates, and newsletter distribution", category: "Communication", features: ["Email campaigns", "Audience segmentation", "A/B testing", "Automation flows"], setupComplexity: "Easy", rating: 4.4, reviews: 5100, installs: "180K+", isPopular: true },
    { id: "MKT-016", name: "Workday", provider: "Workday", logo: "🏛️", description: "Enterprise HRIS for large-scale client organisations with complex workforce structures", category: "HRIS & Payroll", features: ["Core HR", "Talent management", "Compensation planning", "Workforce analytics"], setupComplexity: "Advanced", rating: 4.3, reviews: 1200, installs: "38K+", isPremium: true },
    { id: "MKT-017", name: "Intercom", provider: "Intercom", logo: "💙", description: "Client messaging platform for real-time support, onboarding, and advisory communication", category: "Communication", features: ["Live chat", "Help centre", "Product tours", "Chatbot automation"], setupComplexity: "Easy", rating: 4.6, reviews: 2900, installs: "88K+", isNew: true },
    { id: "MKT-018", name: "Dropbox Business", provider: "Dropbox", logo: "📦", description: "Secure cloud storage for client documentation, policies, and shared advisory resources", category: "Document Management", features: ["Cloud storage", "File sharing", "Version history", "Team folders"], setupComplexity: "Easy", rating: 4.5, reviews: 4800, installs: "160K+", isPopular: true },
    { id: "MKT-019", name: "HSA Gateway", provider: "Health & Safety Authority", logo: "🏗️", description: "Direct integration with the HSA's systems for safety notifications and inspection management", category: "Compliance & Regulatory", features: ["Inspection scheduling", "Incident reporting", "Safety audit records", "Compliance certificates"], setupComplexity: "Advanced", rating: 4.1, reviews: 210, installs: "5.2K+" },
    { id: "MKT-020", name: "Monday.com", provider: "monday.com", logo: "🟣", description: "Work management platform for team coordination, client project tracking, and status reporting", category: "Calendar & Scheduling", features: ["Custom boards", "Timeline views", "Automations", "Integrations hub"], setupComplexity: "Easy", rating: 4.6, reviews: 3700, installs: "125K+", isPopular: true },
    { id: "MKT-021", name: "Calendly", provider: "Calendly", logo: "📅", description: "Scheduling automation for client meetings, advisory sessions, and audit bookings", category: "Calendar & Scheduling", features: ["Scheduling links", "Calendar sync", "Group scheduling", "Booking pages"], setupComplexity: "Easy", rating: 4.7, reviews: 4100, installs: "140K+", isFeatured: true },
    { id: "MKT-022", name: "Loom", provider: "Loom", logo: "🎥", description: "Video messaging for asynchronous advisory updates, training recordings, and client briefings", category: "Communication", features: ["Screen recording", "Video messaging", "Engagement analytics", "Team library"], setupComplexity: "Easy", rating: 4.7, reviews: 3200, installs: "105K+", isNew: true },
];

const MARKETPLACE_CATEGORIES: { id: IntegrationCategory | "All"; label: string; icon: any; count: number }[] = [
    { id: "All", label: "All Integrations", icon: Layers, count: MARKETPLACE_APPS.length },
    { id: "HRIS & Payroll", label: "HRIS & Payroll", icon: Users, count: MARKETPLACE_APPS.filter(a => a.category === "HRIS & Payroll").length },
    { id: "Document Management", label: "Documents", icon: FileText, count: MARKETPLACE_APPS.filter(a => a.category === "Document Management").length },
    { id: "Calendar & Scheduling", label: "Calendar", icon: Calendar, count: MARKETPLACE_APPS.filter(a => a.category === "Calendar & Scheduling").length },
    { id: "Communication", label: "Communication", icon: MessageSquare, count: MARKETPLACE_APPS.filter(a => a.category === "Communication").length },
    { id: "Compliance & Regulatory", label: "Compliance", icon: Shield, count: MARKETPLACE_APPS.filter(a => a.category === "Compliance & Regulatory").length },
    { id: "Accounting & Finance", label: "Finance", icon: DollarSign, count: MARKETPLACE_APPS.filter(a => a.category === "Accounting & Finance").length },
    { id: "Analytics & Reporting", label: "Analytics", icon: BarChart3, count: MARKETPLACE_APPS.filter(a => a.category === "Analytics & Reporting").length },
    { id: "Developer Tools", label: "Developer", icon: Code, count: MARKETPLACE_APPS.filter(a => a.category === "Developer Tools").length },
];

/* ===== Browse Marketplace Modal ===== */

function BrowseMarketplaceModal({ onClose, existingIntegrations }: { onClose: () => void; existingIntegrations: Integration[] }) {
    const [mkSearch, setMkSearch] = useState("");
    const [mkCategory, setMkCategory] = useState<IntegrationCategory | "All">("All");
    const [installStates, setInstallStates] = useState<Record<string, "idle" | "installing" | "done">>({});
    const [detailApp, setDetailApp] = useState<MarketplaceApp | null>(null);

    const connectedNames = new Set(existingIntegrations.filter(i => i.isConnected).map(i => i.name));

    const filtered = MARKETPLACE_APPS.filter((app) => {
        const matchSearch = app.name.toLowerCase().includes(mkSearch.toLowerCase()) || app.provider.toLowerCase().includes(mkSearch.toLowerCase()) || app.description.toLowerCase().includes(mkSearch.toLowerCase());
        const matchCat = mkCategory === "All" || app.category === mkCategory;
        return matchSearch && matchCat;
    });

    const featured = MARKETPLACE_APPS.filter(a => a.isFeatured);
    const newApps = MARKETPLACE_APPS.filter(a => a.isNew);

    const handleInstall = (appId: string) => {
        setInstallStates(prev => ({ ...prev, [appId]: "installing" }));
        setTimeout(() => setInstallStates(prev => ({ ...prev, [appId]: "done" })), 1800);
    };

    const renderStars = (rating: number) => {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < full ? "text-amber-400 fill-amber-400" : half && i === full ? "text-amber-400 fill-amber-400/50" : "text-slate-200"}`} />
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[960px] max-h-[92vh] flex flex-col relative" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-[700] text-foreground">Integration Marketplace</h2>
                            <p className="text-[12px] text-muted-foreground">{MARKETPLACE_APPS.length} integrations available across {MARKETPLACE_CATEGORIES.length - 1} categories</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden min-h-0">
                    {/* Sidebar */}
                    <div className="w-[200px] border-r border-border bg-slate-50/50 py-3 px-2 overflow-y-auto flex-shrink-0">
                        {MARKETPLACE_CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setMkCategory(cat.id)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-[500] transition-colors cursor-pointer mb-0.5 ${mkCategory === cat.id ? "bg-indigo-50 text-indigo-700" : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate flex-1 text-left">{cat.label}</span>
                                    <span className={`text-[10px] font-[600] px-1.5 py-0.5 rounded-full ${mkCategory === cat.id ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}`}>{cat.count}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Main panel */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Search */}
                        <div className="px-5 py-3 border-b border-border bg-white sticky top-0 z-10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={mkSearch}
                                    onChange={(e) => setMkSearch(e.target.value)}
                                    placeholder="Search marketplace..."
                                    className="w-full h-9 pl-9 pr-9 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {mkSearch && (
                                    <button onClick={() => setMkSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-5 space-y-6">
                            {/* Featured row */}
                            {!mkSearch && mkCategory === "All" && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                        <h3 className="text-[13px] font-[700] text-foreground">Featured</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {featured.slice(0, 4).map((app) => (
                                            <button
                                                key={app.id}
                                                onClick={() => setDetailApp(app)}
                                                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-gradient-to-r from-indigo-50/50 to-violet-50/30 hover:border-indigo-200 transition-all cursor-pointer text-left"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-[20px] flex-shrink-0">{app.logo}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[13px] font-[600] text-foreground truncate">{app.name}</span>
                                                        {app.isPremium && <Lock className="w-3 h-3 text-amber-500" />}
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground truncate">{app.provider}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {renderStars(app.rating)}
                                                        <span className="text-[10px] text-muted-foreground">{app.installs}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New arrivals */}
                            {!mkSearch && mkCategory === "All" && newApps.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Zap className="w-4 h-4 text-emerald-500" />
                                        <h3 className="text-[13px] font-[700] text-foreground">New Arrivals</h3>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-1">
                                        {newApps.map((app) => (
                                            <button
                                                key={app.id}
                                                onClick={() => setDetailApp(app)}
                                                className="flex-shrink-0 w-[180px] p-3 rounded-lg border border-border hover:border-emerald-200 transition-all cursor-pointer text-left bg-white"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-border flex items-center justify-center text-[20px] mb-2">{app.logo}</div>
                                                <span className="text-[12px] font-[600] text-foreground block truncate">{app.name}</span>
                                                <span className="text-[10px] text-muted-foreground block truncate">{app.provider}</span>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    {renderStars(app.rating)}
                                                    <span className="text-[10px] text-muted-foreground">({app.reviews})</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Full grid */}
                            <div>
                                {(mkSearch || mkCategory !== "All") ? (
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-[13px] font-[700] text-foreground">{mkCategory === "All" ? "Search Results" : mkCategory}</h3>
                                        <span className="text-[12px] text-muted-foreground">{filtered.length} integration{filtered.length !== 1 ? "s" : ""}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-[13px] font-[700] text-foreground">All Integrations</h3>
                                        <span className="text-[12px] text-muted-foreground">{filtered.length} available</span>
                                    </div>
                                )}

                                {filtered.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                            <Search className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-[13px] font-[500] text-foreground mb-1">No integrations found</p>
                                        <p className="text-[12px] text-muted-foreground">Try adjusting your search or category filter</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {filtered.map((app) => {
                                            const isConnected = connectedNames.has(app.name);
                                            const installState = installStates[app.id] || "idle";
                                            return (
                                                <div key={app.id} className="bg-white border border-border rounded-lg p-4 hover:border-indigo-200 hover:shadow-sm transition-all">
                                                    <div className="flex items-start gap-3">
                                                        <button onClick={() => setDetailApp(app)} className="w-11 h-11 rounded-lg bg-slate-50 border border-border flex items-center justify-center text-[22px] flex-shrink-0 cursor-pointer hover:border-indigo-200 transition-colors">
                                                            {app.logo}
                                                        </button>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                                <button onClick={() => setDetailApp(app)} className="text-[13px] font-[600] text-foreground truncate hover:text-indigo-600 cursor-pointer transition-colors">{app.name}</button>
                                                                {app.isNew && <span className="text-[9px] font-[700] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase">New</span>}
                                                                {app.isPremium && <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                                                            </div>
                                                            <p className="text-[11px] text-muted-foreground mb-1">{app.provider} · {app.category}</p>
                                                            <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{app.description}</p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    {renderStars(app.rating)}
                                                                    <span className="text-[10px] text-muted-foreground">{app.rating}</span>
                                                                    <span className="text-[10px] text-muted-foreground">({app.reviews})</span>
                                                                </div>
                                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Download className="w-3 h-3" />{app.installs}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t border-border">
                                                        {isConnected ? (
                                                            <div className="flex items-center justify-center gap-1.5 h-8 rounded-md bg-emerald-50 text-emerald-700 text-[12px] font-[500]">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                                                            </div>
                                                        ) : installState === "done" ? (
                                                            <div className="flex items-center justify-center gap-1.5 h-8 rounded-md bg-emerald-50 text-emerald-700 text-[12px] font-[500]">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Installed
                                                            </div>
                                                        ) : installState === "installing" ? (
                                                            <div className="flex items-center justify-center gap-1.5 h-8 rounded-md bg-indigo-50 text-indigo-700 text-[12px] font-[500]">
                                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Installing...
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-2">
                                                                <button onClick={() => setDetailApp(app)} className="flex-1 h-8 rounded-md text-[12px] font-[500] border border-input bg-background hover:bg-accent transition-colors cursor-pointer">View Details</button>
                                                                <button onClick={() => handleInstall(app.id)} className="flex-1 h-8 rounded-md text-[12px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer flex items-center justify-center gap-1">
                                                                    <Plus className="w-3.5 h-3.5" /> Install
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detail slide-over */}
                {detailApp && (
                    <div className="absolute inset-0 bg-black/20 z-20 flex items-stretch justify-end rounded-2xl overflow-hidden" onClick={() => setDetailApp(null)}>
                        <div className="w-[420px] bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-center justify-between z-10">
                                <span className="text-[14px] font-[700] text-foreground">Integration Details</span>
                                <button onClick={() => setDetailApp(null)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="p-5 space-y-5">
                                {/* Header */}
                                <div className="flex items-start gap-3">
                                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-border flex items-center justify-center text-[28px]">{detailApp.logo}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-[16px] font-[700] text-foreground">{detailApp.name}</h3>
                                            {detailApp.isPremium && <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-0.5"><Lock className="w-2.5 h-2.5" />Premium</span>}
                                        </div>
                                        <p className="text-[12px] text-muted-foreground">{detailApp.provider}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {renderStars(detailApp.rating)}
                                            <span className="text-[11px] text-muted-foreground">{detailApp.rating} ({detailApp.reviews} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-2.5 rounded-lg bg-slate-50 border border-border">
                                        <p className="text-[14px] font-[700] text-foreground">{detailApp.installs}</p>
                                        <p className="text-[10px] text-muted-foreground">Installs</p>
                                    </div>
                                    <div className="text-center p-2.5 rounded-lg bg-slate-50 border border-border">
                                        <p className="text-[14px] font-[700] text-foreground">{detailApp.rating}</p>
                                        <p className="text-[10px] text-muted-foreground">Rating</p>
                                    </div>
                                    <div className="text-center p-2.5 rounded-lg bg-slate-50 border border-border">
                                        <p className={`text-[14px] font-[700] ${detailApp.setupComplexity === "Easy" ? "text-emerald-600" : detailApp.setupComplexity === "Medium" ? "text-amber-600" : "text-red-600"}`}>{detailApp.setupComplexity}</p>
                                        <p className="text-[10px] text-muted-foreground">Setup</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h4 className="text-[12px] font-[600] text-foreground mb-1.5">About</h4>
                                    <p className="text-[12px] text-muted-foreground leading-relaxed">{detailApp.description}</p>
                                </div>

                                {/* Category */}
                                <div>
                                    <h4 className="text-[12px] font-[600] text-foreground mb-1.5">Category</h4>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-[500]">{detailApp.category}</span>
                                </div>

                                {/* Features */}
                                <div>
                                    <h4 className="text-[12px] font-[600] text-foreground mb-2">Features</h4>
                                    <div className="space-y-1.5">
                                        {detailApp.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[12px] text-foreground">
                                                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="pt-3 border-t border-border">
                                    {connectedNames.has(detailApp.name) ? (
                                        <div className="flex items-center justify-center gap-2 h-10 rounded-lg bg-emerald-50 text-emerald-700 text-[13px] font-[500]">
                                            <CheckCircle2 className="w-4 h-4" /> Already Connected
                                        </div>
                                    ) : (installStates[detailApp.id] || "idle") === "done" ? (
                                        <div className="flex items-center justify-center gap-2 h-10 rounded-lg bg-emerald-50 text-emerald-700 text-[13px] font-[500]">
                                            <CheckCircle2 className="w-4 h-4" /> Successfully Installed
                                        </div>
                                    ) : (installStates[detailApp.id] || "idle") === "installing" ? (
                                        <div className="flex items-center justify-center gap-2 h-10 rounded-lg bg-indigo-50 text-indigo-600 text-[13px] font-[500]">
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Installing...
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleInstall(detailApp.id)}
                                            className="w-full h-10 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Install Integration
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}