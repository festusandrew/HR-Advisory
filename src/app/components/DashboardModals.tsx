import { useState } from "react";
import {
    X,
    FileText,
    Download,
    AlertTriangle,
    Clock,
    CheckCircle2,
    ChevronRight,
    User,
    Calendar,
    Tag,
    Shield,
    Building2,
    Filter,
    Search,
    ExternalLink,
    CheckSquare,
    ArrowRight,
    Printer,
    Activity,
} from "lucide-react";
import { mockClients, advisors } from "./mock-data";
import type { Task, Alert, Client } from "./mock-data";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */
function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
    );
}

function SeverityBadge({ severity }: { severity: string }) {
    const colors: Record<string, string> = {
        Critical: "bg-red-100 text-red-700 border-red-200",
        Warning: "bg-amber-100 text-amber-700 border-amber-200",
        Info: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-[700] border ${colors[severity] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
            {severity}
        </span>
    );
}

function PriorityBadge({ priority }: { priority: string }) {
    const colors: Record<string, string> = {
        High: "bg-red-100 text-red-700 border-red-200",
        Medium: "bg-amber-100 text-amber-700 border-amber-200",
        Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-[700] border ${colors[priority] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
            {priority}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        Open: "bg-blue-100 text-blue-700 border-blue-200",
        "In Progress": "bg-indigo-100 text-indigo-700 border-indigo-200",
        Overdue: "bg-red-100 text-red-700 border-red-200",
        Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-[700] border ${colors[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
            {status}
        </span>
    );
}

const now = new Date("2026-02-06T12:00:00Z");

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(iso: string) {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" })} at ${d.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
}

function relativeTime(iso: string) {
    const d = new Date(iso);
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return formatDate(iso);
}

function daysUntil(iso: string) {
    return Math.ceil((new Date(iso).getTime() - now.getTime()) / 86400000);
}

/* ------------------------------------------------------------------ */
/*  1. Generate Report Modal                                           */
/* ------------------------------------------------------------------ */
const reportTypes = [
    "Client Summary Report",
    "Compliance Audit Report",
    "Task & Activity Report",
    "Risk Assessment Report",
    "Financial Summary Report",
    "Advisor Workload Report",
    "Regulatory Compliance Report",
    "Client Health Overview",
];

const reportFormats = [
    { id: "pdf", label: "PDF", icon: FileText },
    { id: "excel", label: "Excel (.xlsx)", icon: FileText },
    { id: "word", label: "Word (.docx)", icon: FileText },
];

export function GenerateReportModal({ onClose }: { onClose: () => void }) {
    const [reportType, setReportType] = useState(reportTypes[0]);
    const [selectedClient, setSelectedClient] = useState("all");
    const [dateFrom, setDateFrom] = useState("2026-01-01");
    const [dateTo, setDateTo] = useState("2026-02-06");
    const [format, setFormat] = useState("pdf");
    const [includeCharts, setIncludeCharts] = useState(true);
    const [includeRecommendations, setIncludeRecommendations] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setGenerated(true);
        }, 1500);
    };

    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                            <FileText className="w-4.5 h-4.5 text-[#4F46E5]" />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-[700] text-foreground">Generate Report</h2>
                            <p className="text-[11px] text-muted-foreground">Configure and generate advisory reports</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                        <X className="w-4 h-4 text-[#6B7280]" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {!generated ? (
                        <>
                            {/* Report Type */}
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1.5">Report Type</label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                >
                                    {reportTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Client */}
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1.5">Client</label>
                                <select
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                    className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                >
                                    <option value="all">All Clients</option>
                                    {mockClients.map((c) => (
                                        <option key={c.id} value={c.id}>{c.tradingName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[12px] font-[600] text-[#374151] block mb-1.5">From</label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-[#374151] block mb-1.5">To</label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                    />
                                </div>
                            </div>

                            {/* Format */}
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1.5">Output Format</label>
                                <div className="flex gap-2">
                                    {reportFormats.map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setFormat(f.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-[12px] font-[600] cursor-pointer transition-colors ${format === f.id
                                                    ? "border-[#4F46E5] bg-[#F0EFFE] text-[#4F46E5]"
                                                    : "border-[#D1D5DB] text-[#6B7280] hover:bg-gray-50"
                                                }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-2.5">
                                <label className="text-[12px] font-[600] text-[#374151] block">Options</label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includeCharts}
                                        onChange={(e) => setIncludeCharts(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                                    />
                                    <span className="text-[12px] text-[#4B5563]">Include charts and visualisations</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includeRecommendations}
                                        onChange={(e) => setIncludeRecommendations(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                                    />
                                    <span className="text-[12px] text-[#4B5563]">Include advisory recommendations</span>
                                </label>
                            </div>

                            {/* Summary */}
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                                <p className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider mb-2">Report Preview</p>
                                <div className="space-y-1 text-[12px] text-[#4B5563]">
                                    <p><span className="font-[600] text-foreground">Type:</span> {reportType}</p>
                                    <p><span className="font-[600] text-foreground">Scope:</span> {selectedClient === "all" ? "All Clients" : mockClients.find((c) => c.id === selectedClient)?.tradingName}</p>
                                    <p><span className="font-[600] text-foreground">Period:</span> {formatDate(dateFrom)} — {formatDate(dateTo)}</p>
                                    <p><span className="font-[600] text-foreground">Format:</span> {format.toUpperCase()}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Success State */
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-[16px] font-[700] text-foreground">Report Generated Successfully</h3>
                            <p className="text-[13px] text-muted-foreground mt-1.5 mb-6">
                                Your {reportType} has been generated and is ready for download.
                            </p>
                            <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] inline-flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-[#4F46E5]" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[13px] font-[600] text-foreground">{reportType.replace(/ /g, "_")}.{format}</p>
                                    <p className="text-[11px] text-muted-foreground">Generated {formatDateTime(now.toISOString())}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <button className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer">
                                    <Download className="w-3.5 h-3.5" /> Download
                                </button>
                                <button className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                                    <Printer className="w-3.5 h-3.5" /> Print
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!generated && (
                    <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">
                            Cancel
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                            {generating ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-3.5 h-3.5" /> Generate Report
                                </>
                            )}
                        </button>
                    </div>
                )}
                {generated && (
                    <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                        <button
                            onClick={() => { setGenerated(false); }}
                            className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer"
                        >
                            Generate Another
                        </button>
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">
                            Done
                        </button>
                    </div>
                )}
            </div>
        </Overlay>
    );
}

/* ------------------------------------------------------------------ */
/*  2. All Alerts Modal                                                */
/* ------------------------------------------------------------------ */
interface AllAlertsModalProps {
    alerts: (Alert & { clientName: string; clientId: string })[];
    onClose: () => void;
    onSelectAlert: (alert: Alert & { clientName: string; clientId: string }) => void;
    onNavigateToClient: (client: Client) => void;
}

export function AllAlertsModal({ alerts, onClose, onSelectAlert, onNavigateToClient }: AllAlertsModalProps) {
    const [filterSeverity, setFilterSeverity] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = alerts
        .filter((a) => filterSeverity === "all" || a.severity === filterSeverity)
        .filter((a) => searchTerm === "" || a.message.toLowerCase().includes(searchTerm.toLowerCase()) || a.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[680px] max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-4.5 h-4.5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-[700] text-foreground">All Alerts & Flags</h2>
                            <p className="text-[11px] text-muted-foreground">{alerts.length} alert{alerts.length !== 1 ? "s" : ""} across all clients</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                        <X className="w-4 h-4 text-[#6B7280]" />
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-3 border-b border-[#F3F4F6] flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                        <input
                            type="text"
                            placeholder="Search alerts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#E5E7EB] text-[12px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        {["all", "Critical", "Warning", "Info"].map((sev) => (
                            <button
                                key={sev}
                                onClick={() => setFilterSeverity(sev)}
                                className={`px-2.5 py-1.5 rounded-md text-[11px] font-[600] cursor-pointer transition-colors ${filterSeverity === sev
                                        ? "bg-[#F0EFFE] text-[#4F46E5]"
                                        : "text-[#6B7280] hover:bg-gray-50"
                                    }`}
                            >
                                {sev === "all" ? "All" : sev}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Alert List */}
                <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
                    {filtered
                        .sort((a, b) => {
                            const order = { Critical: 0, Warning: 1, Info: 2 };
                            return (order[a.severity as keyof typeof order] ?? 3) - (order[b.severity as keyof typeof order] ?? 3);
                        })
                        .map((alert) => (
                            <div
                                key={alert.id + alert.clientId}
                                onClick={() => onSelectAlert(alert)}
                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${alert.severity === "Critical"
                                        ? "bg-red-50 border-red-200 hover:bg-red-100"
                                        : alert.severity === "Warning"
                                            ? "bg-amber-50 border-amber-200 hover:bg-amber-100"
                                            : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                    }`}
                            >
                                <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.severity === "Critical" ? "text-red-600" : alert.severity === "Warning" ? "text-amber-600" : "text-blue-600"}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <SeverityBadge severity={alert.severity} />
                                        <span className="text-[10px] font-[600] text-[#4B5563] bg-white/60 px-1.5 py-0.5 rounded">{alert.type}</span>
                                        <span className="text-[10px] text-muted-foreground ml-auto">{relativeTime(alert.timestamp)}</span>
                                    </div>
                                    <p className="text-[12px] font-[600] text-foreground mt-1">{alert.message}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const client = mockClients.find((c) => c.id === alert.clientId);
                                                if (client) { onClose(); onNavigateToClient(client); }
                                            }}
                                            className="text-[10px] font-[600] text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <Building2 className="w-3 h-3" /> {alert.clientName}
                                        </button>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#9CA3AF] mt-1 flex-shrink-0" />
                            </div>
                        ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-10 text-[13px] text-muted-foreground">No alerts match your filters</div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-[#E5E7EB]">
                    <span className="text-[11px] text-muted-foreground">Showing {filtered.length} of {alerts.length} alerts</span>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        </Overlay>
    );
}

/* ------------------------------------------------------------------ */
/*  3. Alert Detail Modal                                              */
/* ------------------------------------------------------------------ */
interface AlertDetailModalProps {
    alert: Alert & { clientName: string; clientId: string };
    onClose: () => void;
    onNavigateToClient: (client: Client) => void;
    onDismiss: (alertId: string, clientId: string) => void;
    onAcknowledge: (alertId: string, clientId: string) => void;
}

export function AlertDetailModal({ alert, onClose, onNavigateToClient, onDismiss, onAcknowledge }: AlertDetailModalProps) {
    const [acknowledged, setAcknowledged] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const client = mockClients.find((c) => c.id === alert.clientId);

    const handleAcknowledge = () => {
        setAcknowledged(true);
        onAcknowledge(alert.id, alert.clientId);
    };

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss(alert.id, alert.clientId);
        setTimeout(onClose, 600);
    };

    const severityColors = {
        Critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", iconBg: "bg-red-100", icon: "text-red-600" },
        Warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", iconBg: "bg-amber-100", icon: "text-amber-600" },
        Info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", iconBg: "bg-blue-100", icon: "text-blue-600" },
    };
    const colors = severityColors[alert.severity as keyof typeof severityColors] || severityColors.Info;

    return (
        <Overlay onClose={onClose}>
            <div className={`bg-white rounded-2xl shadow-2xl w-[500px] max-h-[85vh] flex flex-col ${dismissed ? "opacity-50 scale-95 transition-all duration-300" : ""}`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${colors.border} ${colors.bg} rounded-t-2xl`}>
                    <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
                            <AlertTriangle className={`w-4.5 h-4.5 ${colors.icon}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-[15px] font-[700] text-foreground">Alert Detail</h2>
                                <SeverityBadge severity={alert.severity} />
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{alert.type}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/60 flex items-center justify-center cursor-pointer">
                        <X className="w-4 h-4 text-[#6B7280]" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Message */}
                    <div className={`p-4 rounded-lg ${colors.bg} ${colors.border} border`}>
                        <p className="text-[13px] font-[600] text-foreground">{alert.message}</p>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-[12px]">
                            <Building2 className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-24">Client</span>
                            <button
                                onClick={() => {
                                    if (client) { onClose(); onNavigateToClient(client); }
                                }}
                                className="font-[600] text-[#4F46E5] hover:underline cursor-pointer flex items-center gap-1"
                            >
                                {alert.clientName} <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                            <Tag className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-24">Type</span>
                            <span className="font-[600] text-foreground">{alert.type}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                            <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-24">Date</span>
                            <span className="font-[500] text-foreground">{formatDateTime(alert.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                            <Clock className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-24">Time Ago</span>
                            <span className="font-[500] text-foreground">{relativeTime(alert.timestamp)}</span>
                        </div>
                    </div>

                    {/* Client Context */}
                    {client && (
                        <div className="p-3.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                            <p className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider mb-2">Client Context</p>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <p className="text-[16px] font-[800] text-foreground">{client.clientHealthScore}%</p>
                                    <p className="text-[10px] text-muted-foreground">Health Score</p>
                                </div>
                                <div className="text-center">
                                    <p className={`text-[12px] font-[700] ${client.riskLevel === "High" ? "text-red-600" : client.riskLevel === "Medium" ? "text-amber-600" : "text-emerald-600"}`}>{client.riskLevel}</p>
                                    <p className="text-[10px] text-muted-foreground">Risk Level</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[12px] font-[700] text-foreground">{client.complianceGaps.length}</p>
                                    <p className="text-[10px] text-muted-foreground">Open Gaps</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status */}
                    {acknowledged && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-[12px] font-[600] text-emerald-700">Alert acknowledged</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
                    <button
                        onClick={handleDismiss}
                        disabled={dismissed}
                        className="px-3 py-2 rounded-lg text-[12px] font-[600] text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-40"
                    >
                        Dismiss
                    </button>
                    <div className="flex items-center gap-2.5">
                        {client && (
                            <button
                                onClick={() => { onClose(); onNavigateToClient(client); }}
                                className="px-3 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
                            >
                                <ArrowRight className="w-3.5 h-3.5" /> Go to Client
                            </button>
                        )}
                        <button
                            onClick={handleAcknowledge}
                            disabled={acknowledged}
                            className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" /> {acknowledged ? "Acknowledged" : "Acknowledge"}
                        </button>
                    </div>
                </div>
            </div>
        </Overlay>
    );
}

/* ------------------------------------------------------------------ */
/*  4. Task Detail Modal                                               */
/* ------------------------------------------------------------------ */
interface TaskDetailModalProps {
    task: Task & { clientName: string; clientId: string };
    onClose: () => void;
    onNavigateToClient: (client: Client) => void;
    onStatusChange: (taskId: string, clientId: string, newStatus: string) => void;
}

export function TaskDetailModal({ task, onClose, onNavigateToClient, onStatusChange }: TaskDetailModalProps) {
    const [status, setStatus] = useState(task.status);
    const [reassigning, setReassigning] = useState(false);
    const [assignee, setAssignee] = useState(task.assignedTo);
    const client = mockClients.find((c) => c.id === task.clientId);
    const dueDays = daysUntil(task.dueDate);
    const isOverdue = task.status === "Overdue";

    const handleMarkComplete = () => {
        setStatus("Completed");
        onStatusChange(task.id, task.clientId, "Completed");
    };

    const handleMarkInProgress = () => {
        setStatus("In Progress");
        onStatusChange(task.id, task.clientId, "In Progress");
    };

    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[540px] max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b rounded-t-2xl ${isOverdue ? "bg-red-50 border-red-200" : "border-[#E5E7EB]"}`}>
                    <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOverdue ? "bg-red-100" : "bg-indigo-100"}`}>
                            {isOverdue
                                ? <Clock className="w-4.5 h-4.5 text-red-600" />
                                : <Activity className="w-4.5 h-4.5 text-indigo-600" />
                            }
                        </div>
                        <div>
                            <h2 className="text-[15px] font-[700] text-foreground">Task Detail</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <StatusBadge status={status} />
                                <PriorityBadge priority={task.priority} />
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/60 flex items-center justify-center cursor-pointer">
                        <X className="w-4 h-4 text-[#6B7280]" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Title & Description */}
                    <div>
                        <h3 className="text-[14px] font-[700] text-foreground">{task.title}</h3>
                        <p className="text-[12px] text-[#6B7280] mt-1.5">{task.description}</p>
                    </div>

                    {/* Due Date Banner */}
                    {isOverdue && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                            <Clock className="w-4 h-4 text-red-600" />
                            <span className="text-[12px] font-[700] text-red-700">{Math.abs(dueDays)} day{Math.abs(dueDays) > 1 ? "s" : ""} overdue</span>
                            <span className="text-[11px] text-red-600 ml-auto">Due: {formatDate(task.dueDate)}</span>
                        </div>
                    )}
                    {!isOverdue && status !== "Completed" && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg border ${dueDays <= 7 ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"}`}>
                            <Calendar className="w-4 h-4 ${dueDays <= 7 ? 'text-amber-600' : 'text-blue-600'}" />
                            <span className={`text-[12px] font-[600] ${dueDays <= 7 ? "text-amber-700" : "text-blue-700"}`}>Due in {dueDays} day{dueDays > 1 ? "s" : ""}</span>
                            <span className={`text-[11px] ml-auto ${dueDays <= 7 ? "text-amber-600" : "text-blue-600"}`}>{formatDate(task.dueDate)}</span>
                        </div>
                    )}
                    {status === "Completed" && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-[12px] font-[700] text-emerald-700">Task completed</span>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-[12px]">
                            <Building2 className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-28">Client</span>
                            <button
                                onClick={() => {
                                    if (client) { onClose(); onNavigateToClient(client); }
                                }}
                                className="font-[600] text-[#4F46E5] hover:underline cursor-pointer flex items-center gap-1"
                            >
                                {task.clientName} <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                            <User className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-28">Assigned To</span>
                            {reassigning ? (
                                <select
                                    value={assignee}
                                    onChange={(e) => { setAssignee(e.target.value); setReassigning(false); }}
                                    className="border border-[#D1D5DB] rounded-lg px-2 py-1 text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                    autoFocus
                                >
                                    {advisors.map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="font-[600] text-foreground">{assignee}</span>
                                    <button onClick={() => setReassigning(true)} className="text-[10px] font-[600] text-[#4F46E5] hover:underline cursor-pointer">Reassign</button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                            <Tag className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-28">Category</span>
                            <span className="font-[500] text-foreground">{task.category}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                            <Shield className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-28">Regulatory Ref</span>
                            <span className="font-[500] text-foreground">{task.regulatoryRef}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                            <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-28">Created</span>
                            <span className="font-[500] text-foreground">{formatDate(task.createdDate)}</span>
                        </div>
                    </div>

                    {/* Client Context */}
                    {client && (
                        <div className="p-3.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                            <p className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider mb-2">Client Context</p>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <p className="text-[16px] font-[800] text-foreground">{client.clientHealthScore}%</p>
                                    <p className="text-[10px] text-muted-foreground">Health Score</p>
                                </div>
                                <div className="text-center">
                                    <p className={`text-[12px] font-[700] ${client.riskLevel === "High" ? "text-red-600" : client.riskLevel === "Medium" ? "text-amber-600" : "text-emerald-600"}`}>{client.riskLevel}</p>
                                    <p className="text-[10px] text-muted-foreground">Risk Level</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[12px] font-[700] text-foreground">{client.tasks.filter((t) => t.status !== "Completed").length}</p>
                                    <p className="text-[10px] text-muted-foreground">Open Tasks</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
                    <div>
                        {client && (
                            <button
                                onClick={() => { onClose(); onNavigateToClient(client); }}
                                className="px-3 py-2 rounded-lg text-[12px] font-[600] text-[#4F46E5] hover:bg-[#F0EFFE] flex items-center gap-1.5 cursor-pointer"
                            >
                                <ArrowRight className="w-3.5 h-3.5" /> Go to Client
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2.5">
                        {status === "Overdue" && (
                            <button
                                onClick={handleMarkInProgress}
                                className="px-3 py-2 rounded-lg border border-indigo-300 text-[12px] font-[600] text-indigo-600 hover:bg-indigo-50 flex items-center gap-1.5 cursor-pointer"
                            >
                                <Activity className="w-3.5 h-3.5" /> Mark In Progress
                            </button>
                        )}
                        {status !== "Completed" && (
                            <button
                                onClick={handleMarkComplete}
                                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-[12px] font-[600] hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
                            </button>
                        )}
                        {status === "Completed" && (
                            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Overlay>
    );
}
