import { useState } from "react";
import {
    Users,
    AlertTriangle,
    Clock,
    TrendingUp,
    Shield,
    DollarSign,
    CheckSquare,
    FileText,
    MessageSquare,
    ChevronRight,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    MapPin,
    Building2,
    BarChart3,
    Activity,
    CircleDot,
    Star,
    Bell,
} from "lucide-react";
import { advisors } from "./mock-data";
import type { Client } from "./mock-data";
import type { Task, Alert } from "./mock-data";
import { useApi } from "../context/ApiContext";
import {
    GenerateReportModal,
    AllAlertsModal,
    AlertDetailModal,
    TaskDetailModal,
} from "./DashboardModals";

interface DashboardProps {
    onNavigateToClient: (client: Client) => void;
    onNavigateToClients: () => void;
    onNavigateToTasks: () => void;
}

/* ---- helpers ---- */
const now = new Date("2026-02-06T12:00:00Z");

function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
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
    const d = new Date(iso);
    return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

/* ---- mini-components ---- */
function KPICard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    bgColor,
    trend,
    trendUp,
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    trend?: string;
    trendUp?: boolean;
}) {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-0.5 text-[11px] font-[600] ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
                        {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-[24px] font-[800] text-foreground mt-2.5">{value}</p>
            <p className="text-[12px] text-[#6B7280] font-[500] mt-0.5">{title}</p>
            {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
    );
}

function RiskBadge({ level }: { level: string }) {
    const colors: Record<string, string> = {
        Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Medium: "bg-amber-50 text-amber-700 border-amber-200",
        High: "bg-red-50 text-red-700 border-red-200",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-[600] border ${colors[level] || ""}`}>
            {level}
        </span>
    );
}

function StatusBadge({ status, small }: { status: string; small?: boolean }) {
    const colors: Record<string, string> = {
        Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        "On Hold": "bg-amber-50 text-amber-700 border-amber-200",
        Completed: "bg-blue-50 text-blue-700 border-blue-200",
        Good: "bg-emerald-50 text-emerald-700 border-emerald-200",
        "Attention Needed": "bg-amber-50 text-amber-700 border-amber-200",
        Open: "bg-blue-50 text-blue-700 border-blue-200",
        "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
        Overdue: "bg-red-50 text-red-700 border-red-200",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-[600] border ${small ? "text-[9px]" : "text-[10px]"} ${colors[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
            {status}
        </span>
    );
}

function ScoreBar({ score, color, height }: { score: number; color: string; height?: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`flex-1 ${height || "h-1.5"} bg-[#F3F4F6] rounded-full overflow-hidden`}>
                <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
            </div>
            <span className="text-[11px] font-[700] text-foreground w-8 text-right">{score}%</span>
        </div>
    );
}

/* ---- computed data ---- */
export function Dashboard({ onNavigateToClient, onNavigateToClients, onNavigateToTasks }: DashboardProps) {
    const { clients } = useApi();
    const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("week");
    const [showReportModal, setShowReportModal] = useState(false);
    const [showAllAlertsModal, setShowAllAlertsModal] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
    const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
    const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
    const [inProgressOverrides, setInProgressOverrides] = useState<Set<string>>(new Set());

    /* ---- computed data ---- */
    const activeClients = clients.filter((c) => c.engagementStatus === "Active");
    const onHoldClients = clients.filter((c) => c.engagementStatus === "On Hold");
    const completedClients = clients.filter((c) => c.engagementStatus === "Completed");
    const highRiskClients = clients.filter((c) => c.riskLevel === "High");
    const mediumRiskClients = clients.filter((c) => c.riskLevel === "Medium");
    const lowRiskClients = clients.filter((c) => c.riskLevel === "Low");
    const complianceAttention = clients.filter((c) => c.complianceStatus === "Attention Needed");

    const allTasks = clients.flatMap((c) => c.tasks.map((t) => ({ ...t, clientName: c.name, clientId: c.id })));
    const overdueTasks = allTasks.filter((t) => t.status === "Overdue");
    const inProgressTasks = allTasks.filter((t) => t.status === "In Progress");
    const openTasks = allTasks.filter((t) => t.status === "Open");

    const allAlerts = clients.flatMap((c) => c.alerts.map((a) => ({ ...a, clientName: c.name, clientId: c.id })));
    const criticalAlerts = allAlerts.filter((a) => a.severity === "Critical");

    const allTimelineEvents = clients
        .flatMap((c) => c.timeline.map((t) => ({ ...t, clientName: c.name, clientId: c.id })))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const upcomingReviews = clients
        .filter((c) => c.nextReviewDate)
        .map((c) => ({ client: c, daysUntil: daysUntil(c.nextReviewDate) }))
        .filter((r) => r.daysUntil > 0 && r.daysUntil <= 90)
        .sort((a, b) => a.daysUntil - b.daysUntil);

    const totalContractValue = clients
        .filter((c) => c.engagementStatus === "Active")
        .reduce((sum, c) => {
            const match = c.contractValue.match(/[\d,]+/);
            return sum + (match ? parseInt(match[0].replace(/,/g, "")) : 0);
        }, 0);

    const totalOutstanding = clients.reduce((sum, c) => {
        const match = c.outstandingPayments.match(/[\d,.]+/);
        return sum + (match ? parseFloat(match[0].replace(/,/g, "")) : 0);
    }, 0);

    const avgHealthScore = activeClients.length > 0 ? Math.round(
        clients.filter((c) => c.engagementStatus === "Active").reduce((s, c) => s + c.clientHealthScore, 0) /
        activeClients.length
    ) : 0;

    const avgSatisfaction = activeClients.length > 0 ? Math.round(
        clients.filter((c) => c.engagementStatus === "Active").reduce((s, c) => s + c.satisfactionScore, 0) /
        activeClients.length
    ) : 0;

    // Advisor workload
    const advisorWorkload = advisors.map((name) => {
        const advisorClientsList = clients.filter((c) => c.assignedAdvisors.includes(name) && c.engagementStatus === "Active");
        const tasks = allTasks.filter((t) => t.assignedTo === name && t.status !== "Completed");
        const highRisk = advisorClientsList.filter((c) => c.riskLevel === "High").length;
        return { name, clientCount: advisorClientsList.length, taskCount: tasks.length, highRisk };
    });

    const visibleAlerts = allAlerts.filter((a) => !dismissedAlerts.has(a.id + a.clientId));

    const handleDismissAlert = (alertId: string, clientId: string) => {
        setDismissedAlerts((prev) => new Set(prev).add(alertId + clientId));
    };

    const handleAcknowledgeAlert = (alertId: string, clientId: string) => {
        setAcknowledgedAlerts((prev) => new Set(prev).add(alertId + clientId));
    };

    const handleTaskStatusChange = (taskId: string, clientId: string, newStatus: string) => {
        const key = taskId + clientId;
        if (newStatus === "Completed") {
            setCompletedTasks((prev) => new Set(prev).add(key));
        } else if (newStatus === "In Progress") {
            setInProgressOverrides((prev) => new Set(prev).add(key));
        }
    };

    const getEffectiveOverdueTasks = overdueTasks.filter(
        (t) => !completedTasks.has(t.id + t.clientId) && !inProgressOverrides.has(t.id + t.clientId)
    );
    const getEffectiveInProgressTasks = [
        ...inProgressTasks.filter((t) => !completedTasks.has(t.id + t.clientId)),
        ...overdueTasks.filter((t) => inProgressOverrides.has(t.id + t.clientId) && !completedTasks.has(t.id + t.clientId)),
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            <div className="p-6 max-w-[1440px] mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-[22px] font-[800] text-foreground">
                            Good afternoon, Aoife
                        </h1>
                        <p className="text-[13px] text-muted-foreground mt-0.5">
                            Friday, 6 February 2026 &middot; 12:00 IST &middot; HR Advisory Dashboard
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#F3F4F6] rounded-lg p-0.5 text-[11px] font-[600]">
                            {(["today", "week", "month"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setTimeFilter(f)}
                                    className={`px-3 py-1.5 rounded-md capitalize cursor-pointer transition-colors ${timeFilter === f ? "bg-white shadow-sm text-foreground" : "text-[#6B7280]"
                                        }`}
                                >
                                    {f === "today" ? "Today" : f === "week" ? "This Week" : "This Month"}
                                </button>
                            ))}
                        </div>
                        <button className="px-3 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer" onClick={() => setShowReportModal(true)}>
                            <FileText className="w-3.5 h-3.5" /> Generate Report
                        </button>
                    </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-6 gap-4 mb-6">
                    <KPICard title="Active Clients" value={activeClients.length} icon={Users} color="text-[#4F46E5]" bgColor="bg-[#EEF2FF]" trend="+2 this month" trendUp />
                    <KPICard title="Compliance Risks" value={complianceAttention.length} icon={AlertTriangle} color="text-amber-600" bgColor="bg-amber-50" subtitle="3 clients need attention" />
                    <KPICard title="Overdue Tasks" value={getEffectiveOverdueTasks.length} icon={Clock} color="text-red-600" bgColor="bg-red-50" trend="+1 this week" trendUp={false} />
                    <KPICard title="Critical Alerts" value={criticalAlerts.length} icon={Bell} color="text-red-600" bgColor="bg-red-50" subtitle="Across all clients" />
                    <KPICard title="Avg Health Score" value={`${avgHealthScore}%`} icon={TrendingUp} color="text-emerald-600" bgColor="bg-emerald-50" trend="+3% vs last month" trendUp />
                    <KPICard title="Active Revenue (ARR)" value={`€${(totalContractValue / 1000).toFixed(0)}k`} icon={DollarSign} color="text-[#4F46E5]" bgColor="bg-[#EEF2FF]" subtitle={`€${totalOutstanding.toLocaleString("en-IE")} outstanding`} />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-3 gap-5">
                    {/* Left Column (2 cols) */}
                    <div className="col-span-2 space-y-5">

                        {/* Alerts & Flags */}
                        {visibleAlerts.length > 0 && (
                            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        <h3 className="text-[14px] font-[700] text-foreground">Active Alerts & Flags</h3>
                                        <span className="ml-1 w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] font-[700] flex items-center justify-center">{visibleAlerts.length}</span>
                                    </div>
                                    <button className="text-[11px] font-[600] text-[#4F46E5] hover:underline cursor-pointer" onClick={() => setShowAllAlertsModal(true)}>View All</button>
                                </div>
                                <div className="px-5 py-3 space-y-2 max-h-[220px] overflow-y-auto">
                                    {visibleAlerts
                                        .sort((a, b) => (a.severity === "Critical" ? -1 : 1))
                                        .map((alert) => (
                                            <div
                                                key={alert.id + alert.clientId}
                                                onClick={() => setSelectedAlert(alert)}
                                                className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${alert.severity === "Critical"
                                                        ? "bg-red-50 border-red-200 hover:bg-red-100"
                                                        : alert.severity === "Warning"
                                                            ? "bg-amber-50 border-amber-200 hover:bg-amber-100"
                                                            : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                                    }`}
                                            >
                                                <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 ${alert.severity === "Critical" ? "text-red-600" : alert.severity === "Warning" ? "text-amber-600" : "text-blue-600"}`} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-[700] uppercase ${alert.severity === "Critical" ? "text-red-600" : alert.severity === "Warning" ? "text-amber-600" : "text-blue-600"}`}>{alert.severity}</span>
                                                        <span className="text-[10px] text-muted-foreground">&middot;</span>
                                                        <span className="text-[10px] font-[600] text-[#4B5563]">{alert.clientName}</span>
                                                        <span className="text-[10px] text-muted-foreground ml-auto">{relativeTime(alert.timestamp)}</span>
                                                    </div>
                                                    <p className="text-[12px] text-foreground font-[500] mt-0.5">{alert.message}</p>
                                                    <span className={`inline-block mt-1 text-[9px] font-[600] px-1.5 py-0.5 rounded ${alert.severity === "Critical" ? "bg-red-100 text-red-700" : alert.severity === "Warning" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{alert.type}</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Client Overview Table */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[#4F46E5]" />
                                    <h3 className="text-[14px] font-[700] text-foreground">Client Health Overview</h3>
                                </div>
                                <button onClick={onNavigateToClients} className="text-[11px] font-[600] text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer">
                                    View All Clients <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#F3F4F6]">
                                            <th className="px-5 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Client</th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Status</th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Risk</th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Health</th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Compliance</th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Tasks</th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Last Activity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients
                                            .sort((a, b) => a.clientHealthScore - b.clientHealthScore)
                                            .map((client) => {
                                                const clientOverdue = client.tasks.filter((t) => t.status === "Overdue").length;
                                                const clientOpen = client.tasks.filter((t) => t.status !== "Completed").length;
                                                return (
                                                    <tr
                                                        key={client.id}
                                                        className="border-b border-[#F9FAFB] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                                                        onClick={() => onNavigateToClient(client)}
                                                    >
                                                        <td className="px-5 py-2.5">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[10px] font-[700] text-[#4F46E5]">
                                                                    {client.tradingName.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[12px] font-[600] text-foreground">{client.tradingName}</p>
                                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{client.location}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2.5"><StatusBadge status={client.engagementStatus} small /></td>
                                                        <td className="px-3 py-2.5"><RiskBadge level={client.riskLevel} /></td>
                                                        <td className="px-3 py-2.5">
                                                            <div className="w-20">
                                                                <ScoreBar
                                                                    score={client.clientHealthScore}
                                                                    color={client.clientHealthScore >= 80 ? "bg-emerald-500" : client.clientHealthScore >= 60 ? "bg-amber-500" : "bg-red-500"}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2.5"><StatusBadge status={client.complianceStatus} small /></td>
                                                        <td className="px-3 py-2.5">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-[11px] font-[600] text-foreground">{clientOpen}</span>
                                                                {clientOverdue > 0 && (
                                                                    <span className="text-[9px] font-[700] text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200">{clientOverdue} overdue</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2.5">
                                                            <span className="text-[11px] text-muted-foreground">{relativeTime(client.lastActivityTimestamp)}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tasks Overview */}
                        <div className="grid grid-cols-2 gap-5">
                            {/* Overdue & Priority Tasks */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-red-500" />
                                        <h3 className="text-[14px] font-[700] text-foreground">Overdue Tasks</h3>
                                        <span className="ml-1 w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] font-[700] flex items-center justify-center">{getEffectiveOverdueTasks.length}</span>
                                    </div>
                                    <button className="text-[11px] font-[600] text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer" onClick={onNavigateToTasks}>
                                        View All <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="px-5 py-3 space-y-2.5 max-h-[280px] overflow-y-auto">
                                    {getEffectiveOverdueTasks.map((task) => {
                                        const daysPast = Math.abs(daysUntil(task.dueDate));
                                        return (
                                            <div key={task.id + task.clientId} onClick={() => setSelectedTask(task)} className="flex items-start gap-3 p-2.5 rounded-lg bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                                                    <Clock className="w-3 h-3 text-red-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12px] font-[600] text-foreground truncate">{task.title}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                                                        <span className="font-[600] text-[#4B5563]">{task.clientName}</span>
                                                        <span>&middot;</span>
                                                        <span>{task.assignedTo}</span>
                                                    </div>
                                                    <span className="text-[9px] font-[700] text-red-700 bg-red-100 px-1.5 py-0.5 rounded mt-1 inline-block">{daysPast} day{daysPast > 1 ? "s" : ""} overdue</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {getEffectiveOverdueTasks.length === 0 && (
                                        <div className="text-center py-6 text-[12px] text-muted-foreground">No overdue tasks</div>
                                    )}
                                </div>
                            </div>

                            {/* In Progress Tasks */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                    <div className="flex items-center gap-2">
                                        <CheckSquare className="w-4 h-4 text-indigo-500" />
                                        <h3 className="text-[14px] font-[700] text-foreground">In Progress</h3>
                                        <span className="ml-1 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-[700] flex items-center justify-center">{getEffectiveInProgressTasks.length}</span>
                                    </div>
                                    <button className="text-[11px] font-[600] text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer" onClick={onNavigateToTasks}>
                                        View All <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="px-5 py-3 space-y-2.5 max-h-[280px] overflow-y-auto">
                                    {getEffectiveInProgressTasks.map((task) => {
                                        const dueDays = daysUntil(task.dueDate);
                                        return (
                                            <div key={task.id + task.clientId} onClick={() => setSelectedTask(task)} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#F0EFFE] border border-[#F3F4F6] cursor-pointer transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                                                    <Activity className="w-3 h-3 text-indigo-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12px] font-[600] text-foreground truncate">{task.title}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                                                        <span className="font-[600] text-[#4B5563]">{task.clientName}</span>
                                                        <span>&middot;</span>
                                                        <span>{task.assignedTo}</span>
                                                    </div>
                                                    <span className={`text-[9px] font-[600] mt-1 inline-block ${dueDays <= 7 ? "text-amber-600" : "text-[#6B7280]"}`}>
                                                        Due in {dueDays} day{dueDays > 1 ? "s" : ""}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Compliance Overview */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-[#4F46E5]" />
                                    <h3 className="text-[14px] font-[700] text-foreground">Compliance & Regulatory Overview</h3>
                                </div>
                                <span className="text-[10px] text-muted-foreground">EU / Irish Employment Law</span>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                        <p className="text-[22px] font-[800] text-emerald-700">{clients.filter((c) => c.complianceStatus === "Good").length}</p>
                                        <p className="text-[11px] text-emerald-600 font-[600]">Fully Compliant</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-200">
                                        <p className="text-[22px] font-[800] text-amber-700">{complianceAttention.length}</p>
                                        <p className="text-[11px] text-amber-600 font-[600]">Attention Needed</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                                        <p className="text-[22px] font-[800] text-red-700">{clients.reduce((s, c) => s + c.complianceGaps.length, 0)}</p>
                                        <p className="text-[11px] text-red-600 font-[600]">Open Gaps</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                                        <p className="text-[22px] font-[800] text-blue-700">{activeClients.length > 0 ? Math.round(clients.filter((c) => c.engagementStatus === "Active").reduce((s, c) => s + c.auditReadinessScore, 0) / activeClients.length) : 0}%</p>
                                        <p className="text-[11px] text-blue-600 font-[600]">Avg Audit Readiness</p>
                                    </div>
                                </div>
                                {complianceAttention.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Clients Requiring Attention</p>
                                        {complianceAttention.map((client) => (
                                            <div
                                                key={client.id}
                                                className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
                                                onClick={() => onNavigateToClient(client)}
                                            >
                                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[12px] font-[700] text-foreground">{client.tradingName}</p>
                                                        <span className="text-[10px] text-amber-700 font-[600]">{client.complianceGaps.length} gap{client.complianceGaps.length > 1 ? "s" : ""}</span>
                                                    </div>
                                                    <ul className="mt-1 space-y-0.5">
                                                        {client.complianceGaps.slice(0, 2).map((gap, i) => (
                                                            <li key={i} className="text-[11px] text-amber-800 flex items-start gap-1.5">
                                                                <span className="text-amber-500 mt-1">&#8226;</span>
                                                                {gap}
                                                            </li>
                                                        ))}
                                                        {client.complianceGaps.length > 2 && (
                                                            <li className="text-[10px] text-amber-600 font-[600]">+{client.complianceGaps.length - 2} more</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">

                        {/* Task Summary Ring */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                <div className="flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4 text-[#4F46E5]" />
                                    <h3 className="text-[14px] font-[700] text-foreground">Task Summary</h3>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center justify-center gap-8">
                                    <div className="relative w-28 h-28">
                                        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="10" />
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="10"
                                                strokeDasharray={`${(getEffectiveOverdueTasks.length / allTasks.length) * 251.2} 251.2`} strokeLinecap="round" />
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#6366F1" strokeWidth="10"
                                                strokeDasharray={`${(getEffectiveInProgressTasks.length / allTasks.length) * 251.2} 251.2`}
                                                strokeDashoffset={`${-(getEffectiveOverdueTasks.length / allTasks.length) * 251.2}`} strokeLinecap="round" />
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="10"
                                                strokeDasharray={`${(openTasks.length / allTasks.length) * 251.2} 251.2`}
                                                strokeDashoffset={`${-((getEffectiveOverdueTasks.length + getEffectiveInProgressTasks.length) / allTasks.length) * 251.2}`} strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-[20px] font-[800] text-foreground">{allTasks.length}</p>
                                                <p className="text-[9px] text-muted-foreground font-[500]">Total</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                            <span className="text-[11px] text-[#4B5563]">Overdue</span>
                                            <span className="text-[12px] font-[700] text-foreground ml-auto">{getEffectiveOverdueTasks.length}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                            <span className="text-[11px] text-[#4B5563]">In Progress</span>
                                            <span className="text-[12px] font-[700] text-foreground ml-auto">{getEffectiveInProgressTasks.length}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                            <span className="text-[11px] text-[#4B5563]">Open</span>
                                            <span className="text-[12px] font-[700] text-foreground ml-auto">{openTasks.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Risk Distribution */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-[#4F46E5]" />
                                    <h3 className="text-[14px] font-[700] text-foreground">Risk Distribution</h3>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] text-[#6B7280] font-[500]">High Risk</span>
                                        <span className="text-[12px] font-[700] text-red-600">{highRiskClients.length}</span>
                                    </div>
                                    <div className="h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${clients.length > 0 ? (highRiskClients.length / clients.length) * 100 : 0}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] text-[#6B7280] font-[500]">Medium Risk</span>
                                        <span className="text-[12px] font-[700] text-amber-600">{mediumRiskClients.length}</span>
                                    </div>
                                    <div className="h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${clients.length > 0 ? (mediumRiskClients.length / clients.length) * 100 : 0}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] text-[#6B7280] font-[500]">Low Risk</span>
                                        <span className="text-[12px] font-[700] text-emerald-600">{lowRiskClients.length}</span>
                                    </div>
                                    <div className="h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${clients.length > 0 ? (lowRiskClients.length / clients.length) * 100 : 0}%` }} />
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-[#F3F4F6]">
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                        <span>Total clients: {clients.length}</span>
                                        <span>Active: {activeClients.length} &middot; On Hold: {onHoldClients.length} &middot; Completed: {completedClients.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advisor Workload */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-[#4F46E5]" />
                                    <h3 className="text-[14px] font-[700] text-foreground">Advisor Workload</h3>
                                </div>
                            </div>
                            <div className="px-5 py-3 space-y-2.5">
                                {advisorWorkload.map((advisor) => (
                                    <div key={advisor.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F9FAFB]">
                                        <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[10px] font-[700] text-[#4F46E5]">
                                            {advisor.name.split(" ").map((n) => n[0]).join("")}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-[600] text-foreground">{advisor.name}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                                <span>{advisor.clientCount} client{advisor.clientCount !== 1 ? "s" : ""}</span>
                                                <span>&middot;</span>
                                                <span>{advisor.taskCount} task{advisor.taskCount !== 1 ? "s" : ""}</span>
                                                {advisor.highRisk > 0 && (
                                                    <>
                                                        <span>&middot;</span>
                                                        <span className="text-red-600 font-[600]">{advisor.highRisk} high risk</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-16">
                                            <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${advisor.taskCount > 4 ? "bg-red-500" : advisor.taskCount > 2 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min((advisor.taskCount / 6) * 100, 100)}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Reviews & Renewals */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#4F46E5]" />
                                    <h3 className="text-[14px] font-[700] text-foreground">Upcoming Reviews</h3>
                                </div>
                            </div>
                            <div className="px-5 py-3 space-y-2">
                                {upcomingReviews.map(({ client, daysUntil: days }) => (
                                    <div
                                        key={client.id}
                                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#F9FAFB] border border-[#F3F4F6] cursor-pointer"
                                        onClick={() => onNavigateToClient(client)}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-[800] ${days <= 14 ? "bg-red-100 text-red-600" : days <= 30 ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>
                                            {days}d
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-[600] text-foreground truncate">{client.tradingName}</p>
                                            <p className="text-[10px] text-muted-foreground">{formatDate(client.nextReviewDate)}</p>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Satisfaction Summary */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500" />
                                    <h3 className="text-[14px] font-[700] text-foreground">Client Satisfaction</h3>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] text-[#6B7280]">Avg Satisfaction</span>
                                        <span className="text-[16px] font-[800] text-foreground">{avgSatisfaction}%</span>
                                    </div>
                                    <ScoreBar score={avgSatisfaction} color={avgSatisfaction >= 80 ? "bg-emerald-500" : "bg-amber-500"} height="h-2" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] text-[#6B7280]">Avg Health Score</span>
                                        <span className="text-[16px] font-[800] text-foreground">{avgHealthScore}%</span>
                                    </div>
                                    <ScoreBar score={avgHealthScore} color={avgHealthScore >= 80 ? "bg-emerald-500" : avgHealthScore >= 60 ? "bg-amber-500" : "bg-red-500"} height="h-2" />
                                </div>
                                <div className="pt-2 border-t border-[#F3F4F6]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-[#6B7280]">Avg NPS</span>
                                        <span className="text-[14px] font-[800] text-foreground">{activeClients.length > 0 ? (clients.filter((c) => c.engagementStatus === "Active").reduce((s, c) => s + c.npsRating, 0) / activeClients.length).toFixed(1) : "0.0"}/10</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Timeline */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-[#4F46E5]" />
                                    <h3 className="text-[14px] font-[700] text-foreground">Recent Activity</h3>
                                </div>
                            </div>
                            <div className="px-5 py-3 space-y-0">
                                {allTimelineEvents.slice(0, 6).map((event) => {
                                    const typeColors: Record<string, string> = {
                                        Document: "bg-blue-100 text-blue-600",
                                        Task: "bg-purple-100 text-purple-600",
                                        Meeting: "bg-emerald-100 text-emerald-600",
                                        Compliance: "bg-amber-100 text-amber-600",
                                        Communication: "bg-pink-100 text-pink-600",
                                    };
                                    const typeIcons: Record<string, React.ElementType> = {
                                        Document: FileText,
                                        Task: CheckSquare,
                                        Meeting: Users,
                                        Compliance: Shield,
                                        Communication: MessageSquare,
                                    };
                                    const Icon = typeIcons[event.type] || CircleDot;
                                    const colorClass = typeColors[event.type] || "bg-gray-100 text-gray-600";
                                    return (
                                        <div key={event.id + event.clientId} className="flex items-start gap-2.5 py-2.5 border-b border-[#F9FAFB] last:border-0">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${colorClass}`}>
                                                <Icon className="w-3 h-3" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-[600] text-foreground truncate">{event.title}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                                                    <span className="font-[500] text-[#4B5563]">{event.clientName}</span>
                                                    <span>&middot;</span>
                                                    <span>{event.user}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[10px] text-muted-foreground">{relativeTime(event.timestamp)}</p>
                                                <p className="text-[9px] text-muted-foreground">{formatTime(event.timestamp)} IST</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>HR Advisory Dashboard &middot; Dublin, Ireland &middot; Last updated: 06 Feb 2026, 12:00 IST</span>
                    <span>GDPR Compliant &middot; Data Protection Act 2018 &middot; EU General Data Protection Regulation</span>
                </div>
            </div>

            {/* Modals */}
            {showReportModal && (
                <GenerateReportModal onClose={() => setShowReportModal(false)} />
            )}
            {showAllAlertsModal && (
                <AllAlertsModal
                    alerts={visibleAlerts}
                    onClose={() => setShowAllAlertsModal(false)}
                    onSelectAlert={(alert) => {
                        setShowAllAlertsModal(false);
                        setSelectedAlert(alert);
                    }}
                    onNavigateToClient={onNavigateToClient}
                />
            )}
            {selectedAlert && (
                <AlertDetailModal
                    alert={selectedAlert}
                    onClose={() => setSelectedAlert(null)}
                    onNavigateToClient={onNavigateToClient}
                    onDismiss={handleDismissAlert}
                    onAcknowledge={handleAcknowledgeAlert}
                />
            )}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onNavigateToClient={onNavigateToClient}
                    onStatusChange={handleTaskStatusChange}
                />
            )}
        </div>
    );
}