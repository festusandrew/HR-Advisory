import { useState, useMemo } from "react";
import {
    FileText,
    Download,
    Calendar,
    Shield,
    Users,
    AlertTriangle,
    Search,
    X,
    Play,
    RefreshCw,
    CheckCircle2,
    Building2,
    Scale,
    Briefcase,
    ClipboardCheck,
    Mail,
    MoreHorizontal,
    Activity,
    Target,
    BookOpen,
    HardHat,
    DollarSign,
    Zap,
    BarChart3,
    Clock,
    Send,
    Trash2,
    Power,
    Pencil,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPie,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
} from "recharts";
import { mockClients } from "./mock-data";
import type { Client } from "./mock-data";

/* ===== Constants ===== */
const NOW = new Date("2026-02-06T12:00:00Z");

/* ===== Mock Report Data ===== */

// Report templates
interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    category: ReportCategory;
    frequency: "Weekly" | "Monthly" | "Quarterly" | "Annual" | "On-Demand";
    lastGenerated: string | null;
    nextDue: string | null;
    regulatoryRef?: string;
    icon: React.ElementType;
    color: string;
    bg: string;
}

type ReportCategory =
    | "Compliance & Regulatory"
    | "Client Engagement"
    | "Financial"
    | "Task & Productivity"
    | "Risk & Audit";

interface GeneratedReport {
    id: string;
    templateId: string;
    name: string;
    category: ReportCategory;
    generatedDate: string;
    generatedTimestamp: string;
    generatedBy: string;
    format: "PDF" | "XLSX" | "CSV" | "DOCX";
    fileSize: string;
    status: "Completed" | "Processing" | "Scheduled" | "Failed";
    client?: string;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
    {
        id: "RPT-01",
        name: "WRC Compliance Summary",
        description: "Workplace Relations Commission compliance status across all clients, including adjudication risks, employment law obligations, and remediation progress.",
        category: "Compliance & Regulatory",
        frequency: "Monthly",
        lastGenerated: "2026-01-31",
        nextDue: "2026-02-28",
        regulatoryRef: "Workplace Relations Act 2015",
        icon: Scale,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },
    {
        id: "RPT-02",
        name: "GDPR & Data Protection Report",
        description: "GDPR compliance metrics including DPIA status, data processing agreements, privacy notice reviews, and Data Protection Commission (DPC) reporting readiness.",
        category: "Compliance & Regulatory",
        frequency: "Quarterly",
        lastGenerated: "2025-12-31",
        nextDue: "2026-03-31",
        regulatoryRef: "GDPR / Data Protection Act 2018",
        icon: Shield,
        color: "text-violet-600",
        bg: "bg-violet-50",
    },
    {
        id: "RPT-03",
        name: "HSA Incident & Safety Report",
        description: "Health & Safety Authority incident reporting summary, Safety Statement compliance, and workplace injury trends per the Safety, Health and Welfare at Work Act 2005.",
        category: "Compliance & Regulatory",
        frequency: "Monthly",
        lastGenerated: "2026-01-31",
        nextDue: "2026-02-28",
        regulatoryRef: "Safety, Health and Welfare at Work Act 2005",
        icon: HardHat,
        color: "text-orange-600",
        bg: "bg-orange-50",
    },
    {
        id: "RPT-04",
        name: "Revenue & Payroll Compliance",
        description: "Revenue Commissioners compliance status including PAYE, PRSI obligations, employment status classifications, and payroll audit readiness across clients.",
        category: "Compliance & Regulatory",
        frequency: "Monthly",
        lastGenerated: "2026-01-31",
        nextDue: "2026-02-28",
        regulatoryRef: "Revenue Commissioners Code of Practice",
        icon: DollarSign,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        id: "RPT-05",
        name: "Client Engagement Overview",
        description: "Comprehensive engagement metrics across all 8 clients including health scores, satisfaction ratings, NPS, activity levels, and review schedules.",
        category: "Client Engagement",
        frequency: "Monthly",
        lastGenerated: "2026-01-31",
        nextDue: "2026-02-28",
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        id: "RPT-06",
        name: "Client Health & Satisfaction",
        description: "Client health scores, satisfaction ratings, NPS trends, and renewal likelihood analysis with Irish industry benchmarks.",
        category: "Client Engagement",
        frequency: "Quarterly",
        lastGenerated: "2025-12-31",
        nextDue: "2026-03-31",
        icon: Activity,
        color: "text-teal-600",
        bg: "bg-teal-50",
    },
    {
        id: "RPT-07",
        name: "Revenue & Billing Analysis",
        description: "Financial report covering retainer income, project fees, outstanding payments, billing models, and revenue forecasts (EUR) across the client portfolio.",
        category: "Financial",
        frequency: "Monthly",
        lastGenerated: "2026-01-31",
        nextDue: "2026-02-28",
        icon: DollarSign,
        color: "text-green-600",
        bg: "bg-green-50",
    },
    {
        id: "RPT-08",
        name: "Retainer Utilisation Report",
        description: "Analysis of retainer hours consumed vs. allocated across client engagements, advisor capacity, and over/under utilisation patterns.",
        category: "Financial",
        frequency: "Monthly",
        lastGenerated: "2026-01-31",
        nextDue: "2026-02-28",
        icon: Briefcase,
        color: "text-amber-600",
        bg: "bg-amber-50",
    },
    {
        id: "RPT-09",
        name: "Task Completion & Productivity",
        description: "Task completion rates, overdue analysis, advisor workload distribution, and time-to-resolution metrics per Irish regulatory category.",
        category: "Task & Productivity",
        frequency: "Weekly",
        lastGenerated: "2026-02-03",
        nextDue: "2026-02-10",
        icon: CheckCircle2,
        color: "text-cyan-600",
        bg: "bg-cyan-50",
    },
    {
        id: "RPT-10",
        name: "Advisor Workload Analysis",
        description: "Workload distribution across Aoife Brennan, Cian Murphy, Saoirse O'Neill, and Declan Byrne — task allocation, client assignments, and capacity analysis.",
        category: "Task & Productivity",
        frequency: "Monthly",
        lastGenerated: "2026-01-31",
        nextDue: "2026-02-28",
        icon: Users,
        color: "text-pink-600",
        bg: "bg-pink-50",
    },
    {
        id: "RPT-11",
        name: "Audit Readiness Assessment",
        description: "Audit readiness scores across all clients with gap analysis, remediation recommendations, and regulatory inspection preparedness ratings.",
        category: "Risk & Audit",
        frequency: "Quarterly",
        lastGenerated: "2025-12-31",
        nextDue: "2026-03-31",
        icon: ClipboardCheck,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },
    {
        id: "RPT-12",
        name: "Risk & Incident Trend Analysis",
        description: "Risk level trends, incident history, compliance gap patterns, and predictive risk indicators across the client portfolio.",
        category: "Risk & Audit",
        frequency: "Quarterly",
        lastGenerated: "2025-12-31",
        nextDue: "2026-03-31",
        icon: AlertTriangle,
        color: "text-red-600",
        bg: "bg-red-50",
    },
    {
        id: "RPT-13",
        name: "Employment Equality Report",
        description: "Employment Equality Acts compliance analysis, diversity metrics, reasonable accommodation audit, and equal pay assessment across clients.",
        category: "Compliance & Regulatory",
        frequency: "Annual",
        lastGenerated: "2025-12-15",
        nextDue: "2026-12-15",
        regulatoryRef: "Employment Equality Acts 1998–2015",
        icon: Scale,
        color: "text-purple-600",
        bg: "bg-purple-50",
    },
    {
        id: "RPT-14",
        name: "Protected Disclosures Annual Summary",
        description: "Annual summary of protected disclosures (whistleblowing) obligations, policy compliance, and reporting statistics per the Protected Disclosures (Amendment) Act 2022.",
        category: "Compliance & Regulatory",
        frequency: "Annual",
        lastGenerated: "2025-12-31",
        nextDue: "2026-12-31",
        regulatoryRef: "Protected Disclosures (Amendment) Act 2022",
        icon: BookOpen,
        color: "text-slate-600",
        bg: "bg-slate-50",
    },
    {
        id: "RPT-15",
        name: "Contract & Renewal Pipeline",
        description: "Upcoming contract renewals, expiring engagements, pipeline value (EUR), and renewal likelihood for the advisory portfolio.",
        category: "Financial",
        frequency: "Quarterly",
        lastGenerated: "2025-12-31",
        nextDue: "2026-03-31",
        icon: FileText,
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
];

const GENERATED_REPORTS: GeneratedReport[] = [
    { id: "GR-01", templateId: "RPT-09", name: "Task Completion & Productivity – W/E 03 Feb 2026", category: "Task & Productivity", generatedDate: "2026-02-03", generatedTimestamp: "2026-02-03T17:00:00Z", generatedBy: "Aoife Brennan", format: "PDF", fileSize: "2.4 MB", status: "Completed" },
    { id: "GR-02", templateId: "RPT-01", name: "WRC Compliance Summary – January 2026", category: "Compliance & Regulatory", generatedDate: "2026-01-31", generatedTimestamp: "2026-01-31T16:30:00Z", generatedBy: "Aoife Brennan", format: "PDF", fileSize: "3.1 MB", status: "Completed" },
    { id: "GR-03", templateId: "RPT-03", name: "HSA Incident & Safety Report – January 2026", category: "Compliance & Regulatory", generatedDate: "2026-01-31", generatedTimestamp: "2026-01-31T16:45:00Z", generatedBy: "Declan Byrne", format: "PDF", fileSize: "1.8 MB", status: "Completed" },
    { id: "GR-04", templateId: "RPT-04", name: "Revenue & Payroll Compliance – January 2026", category: "Compliance & Regulatory", generatedDate: "2026-01-31", generatedTimestamp: "2026-01-31T17:00:00Z", generatedBy: "Saoirse O'Neill", format: "XLSX", fileSize: "4.2 MB", status: "Completed" },
    { id: "GR-05", templateId: "RPT-07", name: "Revenue & Billing Analysis – January 2026", category: "Financial", generatedDate: "2026-01-31", generatedTimestamp: "2026-01-31T17:15:00Z", generatedBy: "Aoife Brennan", format: "XLSX", fileSize: "1.5 MB", status: "Completed" },
    { id: "GR-06", templateId: "RPT-05", name: "Client Engagement Overview – January 2026", category: "Client Engagement", generatedDate: "2026-01-31", generatedTimestamp: "2026-01-31T17:30:00Z", generatedBy: "Cian Murphy", format: "PDF", fileSize: "5.6 MB", status: "Completed" },
    { id: "GR-07", templateId: "RPT-08", name: "Retainer Utilisation Report – January 2026", category: "Financial", generatedDate: "2026-01-31", generatedTimestamp: "2026-01-31T17:45:00Z", generatedBy: "Aoife Brennan", format: "PDF", fileSize: "1.2 MB", status: "Completed" },
    { id: "GR-08", templateId: "RPT-10", name: "Advisor Workload Analysis – January 2026", category: "Task & Productivity", generatedDate: "2026-01-31", generatedTimestamp: "2026-01-31T18:00:00Z", generatedBy: "Aoife Brennan", format: "PDF", fileSize: "2.8 MB", status: "Completed" },
    { id: "GR-09", templateId: "RPT-09", name: "Task Completion & Productivity – W/E 27 Jan 2026", category: "Task & Productivity", generatedDate: "2026-01-27", generatedTimestamp: "2026-01-27T17:00:00Z", generatedBy: "Aoife Brennan", format: "PDF", fileSize: "2.1 MB", status: "Completed" },
    { id: "GR-10", templateId: "RPT-02", name: "GDPR & Data Protection Report – Q4 2025", category: "Compliance & Regulatory", generatedDate: "2025-12-31", generatedTimestamp: "2025-12-31T16:00:00Z", generatedBy: "Cian Murphy", format: "PDF", fileSize: "4.7 MB", status: "Completed" },
    { id: "GR-11", templateId: "RPT-11", name: "Audit Readiness Assessment – Q4 2025", category: "Risk & Audit", generatedDate: "2025-12-31", generatedTimestamp: "2025-12-31T15:30:00Z", generatedBy: "Aoife Brennan", format: "PDF", fileSize: "6.3 MB", status: "Completed" },
    { id: "GR-12", templateId: "RPT-12", name: "Risk & Incident Trend Analysis – Q4 2025", category: "Risk & Audit", generatedDate: "2025-12-31", generatedTimestamp: "2025-12-31T15:00:00Z", generatedBy: "Declan Byrne", format: "PDF", fileSize: "3.4 MB", status: "Completed" },
];

const SCHEDULED_REPORTS = [
    { templateId: "RPT-09", nextRun: "2026-02-10T17:00:00Z", frequency: "Weekly", recipient: "All Advisors" },
    { templateId: "RPT-01", nextRun: "2026-02-28T17:00:00Z", frequency: "Monthly", recipient: "Aoife Brennan" },
    { templateId: "RPT-03", nextRun: "2026-02-28T17:00:00Z", frequency: "Monthly", recipient: "Declan Byrne" },
    { templateId: "RPT-04", nextRun: "2026-02-28T17:00:00Z", frequency: "Monthly", recipient: "Saoirse O'Neill" },
    { templateId: "RPT-05", nextRun: "2026-02-28T17:00:00Z", frequency: "Monthly", recipient: "All Advisors" },
    { templateId: "RPT-07", nextRun: "2026-02-28T17:00:00Z", frequency: "Monthly", recipient: "Aoife Brennan" },
    { templateId: "RPT-08", nextRun: "2026-02-28T17:00:00Z", frequency: "Monthly", recipient: "Aoife Brennan" },
    { templateId: "RPT-10", nextRun: "2026-02-28T17:00:00Z", frequency: "Monthly", recipient: "All Advisors" },
    { templateId: "RPT-02", nextRun: "2026-03-31T17:00:00Z", frequency: "Quarterly", recipient: "Cian Murphy" },
    { templateId: "RPT-06", nextRun: "2026-03-31T17:00:00Z", frequency: "Quarterly", recipient: "All Advisors" },
    { templateId: "RPT-11", nextRun: "2026-03-31T17:00:00Z", frequency: "Quarterly", recipient: "Aoife Brennan" },
    { templateId: "RPT-15", nextRun: "2026-03-31T17:00:00Z", frequency: "Quarterly", recipient: "Aoife Brennan" },
];

/* ===== Chart Data (derived from mockClients) ===== */
function buildChartData() {
    const clients = mockClients;

    // Client Health Scores
    const clientHealth = clients
        .filter((c) => c.engagementStatus !== "Completed")
        .map((c) => ({
            name: c.tradingName.length > 14 ? c.tradingName.slice(0, 14) + "…" : c.tradingName,
            health: c.clientHealthScore,
            satisfaction: c.satisfactionScore * 10,
            audit: c.auditReadinessScore,
        }));

    // Risk distribution
    const riskDist = [
        { name: "Low", value: clients.filter((c) => c.riskLevel === "Low").length, color: "#10B981" },
        { name: "Medium", value: clients.filter((c) => c.riskLevel === "Medium").length, color: "#F59E0B" },
        { name: "High", value: clients.filter((c) => c.riskLevel === "High").length, color: "#EF4444" },
    ];

    // Task status across all clients
    const allTasks = clients.flatMap((c) => c.tasks);
    const taskStatus = [
        { name: "Completed", value: allTasks.filter((t) => t.status === "Completed").length, color: "#10B981" },
        { name: "In Progress", value: allTasks.filter((t) => t.status === "In Progress").length, color: "#3B82F6" },
        { name: "Open", value: allTasks.filter((t) => t.status === "Open").length, color: "#6B7280" },
        { name: "Overdue", value: allTasks.filter((t) => t.status === "Overdue").length, color: "#EF4444" },
    ];

    // Tasks by category
    const catMap = new Map<string, number>();
    allTasks.forEach((t) => catMap.set(t.category, (catMap.get(t.category) || 0) + 1));
    const tasksByCategory = Array.from(catMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([cat, count]) => ({ category: cat.length > 20 ? cat.slice(0, 20) + "…" : cat, count }));

    // Compliance scores
    const complianceRadar = clients
        .filter((c) => c.engagementStatus === "Active")
        .map((c) => ({
            client: c.tradingName.length > 12 ? c.tradingName.slice(0, 12) + "…" : c.tradingName,
            audit: c.auditReadinessScore,
            health: c.clientHealthScore,
            nps: Math.max(0, (c.npsRating + 100) / 2), // normalize -100 to 100 -> 0 to 100
        }));

    // Advisor workload
    const advisorTasks = new Map<string, { open: number; progress: number; overdue: number; completed: number }>();
    allTasks.forEach((t) => {
        const current = advisorTasks.get(t.assignedTo) || { open: 0, progress: 0, overdue: 0, completed: 0 };
        if (t.status === "Open") current.open++;
        else if (t.status === "In Progress") current.progress++;
        else if (t.status === "Overdue") current.overdue++;
        else if (t.status === "Completed") current.completed++;
        advisorTasks.set(t.assignedTo, current);
    });
    const advisorWorkload = Array.from(advisorTasks.entries()).map(([name, data]) => ({
        name: name.split(" ")[0],
        fullName: name,
        ...data,
    }));

    // Monthly engagement trend (mock for Sep 2025 – Feb 2026)
    const engagementTrend = [
        { month: "Sep '25", tasks: 18, documents: 5, communications: 22 },
        { month: "Oct '25", tasks: 22, documents: 8, communications: 19 },
        { month: "Nov '25", tasks: 19, documents: 6, communications: 25 },
        { month: "Dec '25", tasks: 26, documents: 12, communications: 28 },
        { month: "Jan '26", tasks: 31, documents: 10, communications: 24 },
        { month: "Feb '26", tasks: 14, documents: 7, communications: 11 },
    ];

    // Industry breakdown
    const industryMap = new Map<string, number>();
    clients.forEach((c) => industryMap.set(c.industry, (industryMap.get(c.industry) || 0) + 1));
    const INDUSTRY_COLORS = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#6B7280"];
    const industryDist = Array.from(industryMap.entries()).map(([name, value], i) => ({
        name,
        value,
        color: INDUSTRY_COLORS[i % INDUSTRY_COLORS.length],
    }));

    return { clientHealth, riskDist, taskStatus, tasksByCategory, complianceRadar, advisorWorkload, engagementTrend, industryDist };
}

/* ===== Helpers ===== */
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
}

function formatShortDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short" });
}

function daysUntil(iso: string) {
    return Math.ceil((new Date(iso).getTime() - NOW.getTime()) / 86400000);
}

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
    "Compliance & Regulatory": { color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
    "Client Engagement": { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
    Financial: { color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
    "Task & Productivity": { color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200" },
    "Risk & Audit": { color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
};

function getCategoryConf(cat: string) {
    return CATEGORY_CONFIG[cat] || { color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" };
}

const FORMAT_COLORS: Record<string, string> = {
    PDF: "bg-red-100 text-red-700",
    XLSX: "bg-green-100 text-green-700",
    CSV: "bg-blue-100 text-blue-700",
    DOCX: "bg-indigo-100 text-indigo-700",
};

/* ===== Types ===== */
type TabId = "overview" | "compliance" | "engagement" | "financial" | "productivity" | "risk" | "history";

/* ===== Sub-components ===== */

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-lg px-3 py-2 text-[11px]">
            <p className="font-[600] text-foreground mb-1">{label}</p>
            {payload.map((entry: any, i: number) => (
                <p key={i} style={{ color: entry.color }} className="font-[500]">
                    {entry.name}: {entry.value}
                </p>
            ))}
        </div>
    );
}

function ReportTemplateCard({
    template,
    onGenerate,
}: {
    template: ReportTemplate;
    onGenerate: (t: ReportTemplate) => void;
}) {
    const Icon = template.icon;
    const catConf = getCategoryConf(template.category);
    const dueIn = template.nextDue ? daysUntil(template.nextDue) : null;
    const isOverdue = dueIn !== null && dueIn < 0;
    const isDueSoon = dueIn !== null && dueIn >= 0 && dueIn <= 7;

    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-md transition-shadow group">
            <div className="flex items-start gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg ${template.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${template.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-[700] text-foreground">{template.name}</h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-[600] border ${catConf.bg} ${catConf.color} ${catConf.border}`}>
                            {template.category}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-[500] bg-[#F3F4F6] px-1.5 py-0.5 rounded">
                            {template.frequency}
                        </span>
                    </div>
                </div>
            </div>
            <p className="text-[11px] text-[#6B7280] leading-relaxed mb-3 line-clamp-2">{template.description}</p>
            {template.regulatoryRef && (
                <div className="flex items-center gap-1 mb-3 text-[10px] text-[#9CA3AF]">
                    <Scale className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{template.regulatoryRef}</span>
                </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                <div className="text-[10px] text-muted-foreground space-y-0.5">
                    {template.lastGenerated && (
                        <p>Last: {formatShortDate(template.lastGenerated)}</p>
                    )}
                    {template.nextDue && (
                        <p className={isOverdue ? "text-red-600 font-[600]" : isDueSoon ? "text-amber-600 font-[600]" : ""}>
                            Due: {formatShortDate(template.nextDue)}
                            {isOverdue && " (overdue)"}
                            {isDueSoon && ` (${dueIn}d)`}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => onGenerate(template)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[10px] font-[600] hover:bg-[#4338CA] cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
                >
                    <Play className="w-3 h-3" /> Generate
                </button>
            </div>
        </div>
    );
}

/* ===== Manage Schedules Modal ===== */
function ManageSchedulesModal({ onClose }: { onClose: () => void }) {
    const [schedules, setSchedules] = useState(
        SCHEDULED_REPORTS.map((sr) => {
            const t = REPORT_TEMPLATES.find((t) => t.id === sr.templateId);
            return { ...sr, enabled: true, template: t };
        })
    );
    const [editingId, setEditingId] = useState<string | null>(null);

    const toggleSchedule = (templateId: string) => {
        setSchedules((prev) =>
            prev.map((s) => (s.templateId === templateId ? { ...s, enabled: !s.enabled } : s))
        );
    };

    const deleteSchedule = (templateId: string) => {
        setSchedules((prev) => prev.filter((s) => s.templateId !== templateId));
    };

    const updateFrequency = (templateId: string, frequency: string) => {
        setSchedules((prev) =>
            prev.map((s) => (s.templateId === templateId ? { ...s, frequency } : s))
        );
        setEditingId(null);
    };

    const enabledCount = schedules.filter((s) => s.enabled).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[680px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center"><Calendar className="w-4.5 h-4.5 text-[#4F46E5]" /></div>
                        <div><h2 className="text-[16px] font-[700] text-foreground">Manage Report Schedules</h2><p className="text-[11px] text-muted-foreground">{enabledCount} of {schedules.length} schedules active</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4 text-[#6B7280]" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    {schedules.map((sr) => {
                        if (!sr.template) return null;
                        const Icon = sr.template.icon;
                        const dueIn = daysUntil(sr.nextRun);
                        return (
                            <div key={sr.templateId} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${sr.enabled ? "bg-white border-[#E5E7EB]" : "bg-[#F9FAFB] border-[#F3F4F6] opacity-60"}`}>
                                <div className={`w-8 h-8 rounded-lg ${sr.template.bg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-4 h-4 ${sr.template.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-[600] text-foreground truncate">{sr.template.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                                        {editingId === sr.templateId ? (
                                            <select
                                                defaultValue={sr.frequency}
                                                onChange={(e) => updateFrequency(sr.templateId, e.target.value)}
                                                onBlur={() => setEditingId(null)}
                                                autoFocus
                                                className="text-[10px] bg-white border border-[#4F46E5] rounded px-1 py-0.5 focus:outline-none"
                                            >
                                                <option>Weekly</option>
                                                <option>Monthly</option>
                                                <option>Quarterly</option>
                                                <option>Annual</option>
                                            </select>
                                        ) : (
                                            <span className="font-[500]">{sr.frequency}</span>
                                        )}
                                        <span>&middot;</span>
                                        <span>To: {sr.recipient}</span>
                                        <span>&middot;</span>
                                        <span className={dueIn <= 7 ? "text-amber-600 font-[600]" : ""}>Next: {dueIn}d</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button onClick={() => setEditingId(sr.templateId)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer" title="Edit frequency"><Pencil className="w-3 h-3 text-[#9CA3AF]" /></button>
                                    <button
                                        onClick={() => toggleSchedule(sr.templateId)}
                                        className={`p-1.5 rounded-lg cursor-pointer ${sr.enabled ? "hover:bg-amber-50" : "hover:bg-emerald-50"}`}
                                        title={sr.enabled ? "Disable" : "Enable"}
                                    >
                                        <Power className={`w-3.5 h-3.5 ${sr.enabled ? "text-emerald-600" : "text-[#D1D5DB]"}`} />
                                    </button>
                                    <button onClick={() => deleteSchedule(sr.templateId)} className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer" title="Remove"><Trash2 className="w-3 h-3 text-[#D1D5DB] hover:text-red-500" /></button>
                                </div>
                            </div>
                        );
                    })}
                    {schedules.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="w-8 h-8 text-[#D1D5DB] mx-auto mb-2" />
                            <p className="text-[13px] font-[600] text-[#4B5563]">No schedules configured</p>
                            <p className="text-[11px] text-muted-foreground mt-1">Use the Schedule button on any report template to create one</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
                    <p className="text-[10px] text-muted-foreground">{enabledCount} active &middot; Reports auto-generated at scheduled intervals</p>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                </div>
            </div>
        </div>
    );
}

/* ===== Run All Due Reports Modal ===== */
function RunAllDueModal({ onClose }: { onClose: () => void }) {
    const dueReports = REPORT_TEMPLATES.filter((t) => t.nextDue && daysUntil(t.nextDue) <= 7);
    const [phase, setPhase] = useState<"confirm" | "running" | "done">("confirm");
    const [progress, setProgress] = useState<Record<string, number>>({});
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    const startRun = () => {
        setPhase("running");
        const ids = dueReports.map((r) => r.id);
        let idx = 0;

        const runNext = () => {
            if (idx >= ids.length) {
                setTimeout(() => setPhase("done"), 500);
                return;
            }
            const currentId = ids[idx];
            let prog = 0;
            const interval = setInterval(() => {
                prog += Math.random() * 30 + 15;
                if (prog >= 100) {
                    prog = 100;
                    clearInterval(interval);
                    setProgress((p) => ({ ...p, [currentId]: 100 }));
                    setCompleted((c) => new Set([...c, currentId]));
                    idx++;
                    setTimeout(runNext, 300);
                } else {
                    setProgress((p) => ({ ...p, [currentId]: prog }));
                }
            }, 150);
        };
        runNext();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[540px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center"><Play className="w-4.5 h-4.5 text-[#4F46E5]" /></div>
                        <div><h2 className="text-[16px] font-[700] text-foreground">Run All Due Reports</h2><p className="text-[11px] text-muted-foreground">{dueReports.length} report{dueReports.length !== 1 ? "s" : ""} due within 7 days</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4 text-[#6B7280]" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {phase === "confirm" && (
                        <div className="space-y-3">
                            <p className="text-[12px] text-[#4B5563] mb-3">The following reports are due for generation. This will create new report instances using the latest data.</p>
                            {dueReports.map((t) => {
                                const Icon = t.icon;
                                const catConf = getCategoryConf(t.category);
                                const dueIn = t.nextDue ? daysUntil(t.nextDue) : 0;
                                return (
                                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-white">
                                        <div className={`w-8 h-8 rounded-lg ${t.bg} flex items-center justify-center flex-shrink-0`}><Icon className={`w-4 h-4 ${t.color}`} /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-[600] text-foreground truncate">{t.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-[600] border ${catConf.bg} ${catConf.color} ${catConf.border}`}>{t.category}</span>
                                                <span className="text-[9px] text-muted-foreground">{t.frequency}</span>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-[600] ${dueIn <= 0 ? "text-red-600" : dueIn <= 3 ? "text-amber-600" : "text-[#6B7280]"}`}>
                                            {dueIn <= 0 ? "Overdue" : `Due in ${dueIn}d`}
                                        </span>
                                    </div>
                                );
                            })}
                            {dueReports.length === 0 && (
                                <div className="text-center py-10">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                                    <p className="text-[14px] font-[700] text-foreground">All caught up!</p>
                                    <p className="text-[12px] text-muted-foreground mt-1">No reports are due within the next 7 days</p>
                                </div>
                            )}
                        </div>
                    )}
                    {phase === "running" && (
                        <div className="space-y-3">
                            <p className="text-[12px] text-[#4B5563] mb-2">Generating reports using latest client data...</p>
                            {dueReports.map((t) => {
                                const Icon = t.icon;
                                const prog = Math.min(Math.round(progress[t.id] || 0), 100);
                                const isDone = completed.has(t.id);
                                return (
                                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB]">
                                        <div className={`w-8 h-8 rounded-lg ${isDone ? "bg-emerald-100" : t.bg} flex items-center justify-center flex-shrink-0`}>
                                            {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Icon className={`w-4 h-4 ${t.color} ${prog > 0 && !isDone ? "animate-pulse" : ""}`} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-[600] text-foreground truncate">{t.name}</p>
                                            <div className="mt-1.5 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-200 ${isDone ? "bg-emerald-500" : "bg-[#4F46E5]"}`} style={{ width: `${prog}%` }} />
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-[600] w-[40px] text-right ${isDone ? "text-emerald-600" : "text-[#6B7280]"}`}>{prog}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {phase === "done" && (
                        <div className="py-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                            <div>
                                <p className="text-[16px] font-[700] text-foreground">All Reports Generated</p>
                                <p className="text-[13px] text-muted-foreground mt-1.5">{dueReports.length} report{dueReports.length !== 1 ? "s" : ""} successfully generated with latest data</p>
                            </div>
                            <div className="max-w-[360px] mx-auto space-y-1.5">
                                {dueReports.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between text-[11px] p-2 rounded bg-[#F9FAFB]">
                                        <span className="font-[500] text-[#4B5563] truncate">{t.name}</span>
                                        <span className="text-emerald-600 font-[600] flex-shrink-0 ml-2">Completed</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                    {phase === "confirm" && dueReports.length > 0 && (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={startRun} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer"><Play className="w-3.5 h-3.5" /> Generate {dueReports.length} Report{dueReports.length !== 1 ? "s" : ""}</button>
                        </>
                    )}
                    {(phase === "done" || (phase === "confirm" && dueReports.length === 0)) && (
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ===== Email Report Modal ===== */
function EmailReportModal({ template, onClose }: { template: ReportTemplate; onClose: () => void }) {
    const Icon = template.icon;
    const [phase, setPhase] = useState<"form" | "sending" | "done">("form");
    const [recipients, setRecipients] = useState("aoife.brennan@peninsula.ie");
    const [cc, setCc] = useState("");
    const [subject, setSubject] = useState(`${template.name} — ${formatDate(NOW.toISOString())}`);
    const [message, setMessage] = useState(`Hi,\n\nPlease find attached the latest ${template.name} generated on ${formatDate(NOW.toISOString())}.\n\nThis report covers all active client engagements and is provided for your review.\n\nRegards,\nPeninsula HR Advisory`);
    const [format, setFormat] = useState("PDF");
    const [includeCharts, setIncludeCharts] = useState(true);

    const handleSend = () => {
        setPhase("sending");
        setTimeout(() => setPhase("done"), 1800);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><Mail className="w-4.5 h-4.5 text-blue-600" /></div>
                        <div><h2 className="text-[16px] font-[700] text-foreground">Email Report</h2><p className="text-[11px] text-muted-foreground">Send {template.name} via email</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4 text-[#6B7280]" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {phase === "form" && (
                        <div className="space-y-4">
                            {/* Report Info */}
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                                <div className={`w-8 h-8 rounded-lg ${template.bg} flex items-center justify-center flex-shrink-0`}><Icon className={`w-4 h-4 ${template.color}`} /></div>
                                <div className="flex-1 min-w-0"><p className="text-[12px] font-[700] text-foreground truncate">{template.name}</p><p className="text-[10px] text-muted-foreground">{template.category} &middot; {template.frequency}</p></div>
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1">To <span className="text-red-500">*</span></label>
                                <input value={recipients} onChange={(e) => setRecipients(e.target.value)} className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" placeholder="email@example.com, email2@example.com" />
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1">CC</label>
                                <input value={cc} onChange={(e) => setCc(e.target.value)} className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" placeholder="Optional cc recipients" />
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1">Subject</label>
                                <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1">Message</label>
                                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-[600] text-[#374151] block mb-1.5">Attachment Format</label>
                                    <div className="flex items-center gap-2">
                                        {["PDF", "XLSX", "CSV", "DOCX"].map((fmt) => (
                                            <button key={fmt} onClick={() => setFormat(fmt)} className={`px-3 py-1.5 rounded-lg text-[11px] font-[600] border cursor-pointer transition-colors ${format === fmt ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]" : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"}`}>{fmt}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-[#374151] block mb-1.5">Options</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={includeCharts} onChange={(e) => setIncludeCharts(e.target.checked)} className="w-3.5 h-3.5 rounded accent-[#4F46E5]" />
                                        <span className="text-[12px] text-[#4B5563]">Include charts & visualisations</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                    {phase === "sending" && (
                        <div className="py-16 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto"><Send className="w-7 h-7 text-blue-600 animate-pulse" /></div>
                            <div><p className="text-[14px] font-[700] text-foreground">Sending report...</p><p className="text-[12px] text-muted-foreground mt-1">Generating {format} and sending to {recipients.split(",").length} recipient{recipients.split(",").length > 1 ? "s" : ""}</p></div>
                        </div>
                    )}
                    {phase === "done" && (
                        <div className="py-12 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                            <div><p className="text-[16px] font-[700] text-foreground">Report Sent Successfully</p><p className="text-[13px] text-muted-foreground mt-1.5"><span className="font-[600] text-foreground">{template.name}</span> ({format}) sent to <span className="font-[600] text-foreground">{recipients}</span></p></div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                    {phase === "form" && (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={handleSend} disabled={!recipients.trim()} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"><Send className="w-3.5 h-3.5" /> Send Email</button>
                        </>
                    )}
                    {phase === "done" && <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>}
                </div>
            </div>
        </div>
    );
}

/* ===== Schedule Report Modal ===== */
function ScheduleReportModal({ template, onClose }: { template: ReportTemplate; onClose: () => void }) {
    const Icon = template.icon;
    const existing = SCHEDULED_REPORTS.find((s) => s.templateId === template.id);
    const [frequency, setFrequency] = useState(existing?.frequency || template.frequency);
    const [recipient, setRecipient] = useState(existing?.recipient || "Aoife Brennan");
    const [autoEmail, setAutoEmail] = useState(true);
    const [emailAddr, setEmailAddr] = useState("aoife.brennan@peninsula.ie");
    const [format, setFormat] = useState("PDF");
    const [done, setDone] = useState(false);

    const nextRunDate = () => {
        const d = new Date(NOW);
        switch (frequency) {
            case "Weekly": d.setDate(d.getDate() + 7); break;
            case "Monthly": d.setMonth(d.getMonth() + 1); break;
            case "Quarterly": d.setMonth(d.getMonth() + 3); break;
            case "Annual": d.setFullYear(d.getFullYear() + 1); break;
        }
        return formatDate(d.toISOString());
    };

    const handleSave = () => { setDone(true); };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center"><Calendar className="w-4.5 h-4.5 text-[#4F46E5]" /></div>
                        <div><h2 className="text-[16px] font-[700] text-foreground">{existing ? "Edit" : "Create"} Schedule</h2><p className="text-[11px] text-muted-foreground">{template.name}</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4 text-[#6B7280]" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {!done ? (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                                <div className={`w-8 h-8 rounded-lg ${template.bg} flex items-center justify-center flex-shrink-0`}><Icon className={`w-4 h-4 ${template.color}`} /></div>
                                <div className="flex-1"><p className="text-[12px] font-[700] text-foreground">{template.name}</p><p className="text-[10px] text-muted-foreground">{template.category}</p></div>
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-2">Frequency</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {["Weekly", "Monthly", "Quarterly", "Annual"].map((f) => (
                                        <button key={f} onClick={() => setFrequency(f)} className={`py-2 rounded-lg text-[11px] font-[600] border cursor-pointer transition-colors ${frequency === f ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]" : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"}`}>{f}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1">Assigned To</label>
                                <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] appearance-none cursor-pointer">
                                    <option>Aoife Brennan</option>
                                    <option>Cian Murphy</option>
                                    <option>Saoirse O'Neill</option>
                                    <option>Declan Byrne</option>
                                    <option>All Advisors</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1">Export Format</label>
                                <div className="flex items-center gap-2">
                                    {["PDF", "XLSX", "CSV", "DOCX"].map((fmt) => (
                                        <button key={fmt} onClick={() => setFormat(fmt)} className={`px-3 py-1.5 rounded-lg text-[11px] font-[600] border cursor-pointer transition-colors ${format === fmt ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]" : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"}`}>{fmt}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={autoEmail} onChange={(e) => setAutoEmail(e.target.checked)} className="w-3.5 h-3.5 rounded accent-[#4F46E5]" />
                                    <span className="text-[12px] font-[600] text-[#374151]">Auto-email on generation</span>
                                </label>
                                {autoEmail && (
                                    <input value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)} className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" placeholder="Email address" />
                                )}
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                                <p className="text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Schedule Summary</p>
                                <div className="space-y-1.5 text-[11px]">
                                    <div className="flex justify-between"><span className="text-muted-foreground">Frequency</span><span className="font-[600] text-foreground">{frequency}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Next Run</span><span className="font-[600] text-[#4F46E5]">{nextRunDate()}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span className="font-[500] text-foreground">{format}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Auto-email</span><span className="font-[500] text-foreground">{autoEmail ? "Yes" : "No"}</span></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                            <div><p className="text-[16px] font-[700] text-foreground">Schedule {existing ? "Updated" : "Created"}</p><p className="text-[13px] text-muted-foreground mt-1.5"><span className="font-[600] text-foreground">{template.name}</span> will run <span className="font-[600] text-[#4F46E5]">{frequency.toLowerCase()}</span></p><p className="text-[12px] text-muted-foreground mt-0.5">Next: {nextRunDate()} &middot; {recipient}</p></div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                    {!done ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer"><Calendar className="w-3.5 h-3.5" /> {existing ? "Update" : "Create"} Schedule</button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ===== Report Detail Panel (with functional Generate, Email, Schedule) ===== */
function ReportDetailPanel({
    template,
    onClose,
}: {
    template: ReportTemplate;
    onClose: () => void;
}) {
    const Icon = template.icon;
    const catConf = getCategoryConf(template.category);
    const relatedHistory = GENERATED_REPORTS.filter((r) => r.templateId === template.id).slice(0, 5);
    const [showEmail, setShowEmail] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [genPhase, setGenPhase] = useState<"idle" | "generating" | "done">("idle");
    const [genProgress, setGenProgress] = useState(0);

    const handleGenerate = () => {
        setGenPhase("generating");
        setGenProgress(0);
        const interval = setInterval(() => {
            setGenProgress((p) => {
                if (p >= 100) { clearInterval(interval); setTimeout(() => setGenPhase("done"), 400); return 100; }
                return p + Math.random() * 20 + 8;
            });
        }, 180);
    };

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/30" onClick={onClose} />
            <div className="w-[520px] bg-white shadow-2xl overflow-y-auto border-l border-[#E5E7EB]">
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 border-b border-[#E5E7EB]">
                    <div className="flex items-start justify-between px-6 py-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-[600] border ${catConf.bg} ${catConf.color} ${catConf.border}`}>
                                    {template.category}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-[500]">{template.id}</span>
                            </div>
                            <h3 className="text-[16px] font-[700] text-foreground pr-4">{template.name}</h3>
                        </div>
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer flex-shrink-0">
                            <X className="w-4 h-4 text-[#6B7280]" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 px-6 pb-3">
                        <button
                            onClick={handleGenerate}
                            disabled={genPhase === "generating"}
                            className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[11px] font-[600] hover:bg-[#4338CA] cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {genPhase === "generating" ? <RefreshCw className="w-3 h-3 animate-spin" /> : genPhase === "done" ? <CheckCircle2 className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            {genPhase === "generating" ? "Generating..." : genPhase === "done" ? "Generated" : "Generate Now"}
                        </button>
                        <button onClick={() => setShowSchedule(true)} className="px-3 py-1.5 rounded-lg bg-gray-50 text-[#4B5563] text-[11px] font-[600] hover:bg-gray-100 cursor-pointer border border-gray-200 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> Schedule
                        </button>
                        <button onClick={() => setShowEmail(true)} className="px-3 py-1.5 rounded-lg bg-gray-50 text-[#4B5563] text-[11px] font-[600] hover:bg-gray-100 cursor-pointer border border-gray-200 flex items-center gap-1.5">
                            <Mail className="w-3 h-3" /> Email
                        </button>
                    </div>

                    {/* Generation progress bar */}
                    {genPhase === "generating" && (
                        <div className="px-6 pb-3">
                            <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                <div className="h-full bg-[#4F46E5] rounded-full transition-all duration-200" style={{ width: `${Math.min(Math.round(genProgress), 100)}%` }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">Generating report using latest data... {Math.min(Math.round(genProgress), 100)}%</p>
                        </div>
                    )}
                    {genPhase === "done" && (
                        <div className="mx-6 mb-3 flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-700 font-[600]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Report generated successfully — {formatDate(NOW.toISOString())} at 12:00 IST
                        </div>
                    )}
                </div>

                {showEmail && <EmailReportModal template={template} onClose={() => setShowEmail(false)} />}
                {showSchedule && <ScheduleReportModal template={template} onClose={() => setShowSchedule(false)} />}

                <div className="px-6 py-5 space-y-5">
                    <div>
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-[13px] text-[#4B5563] leading-relaxed">{template.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                            <p className="text-[10px] text-muted-foreground font-[600] mb-1">Frequency</p>
                            <p className="text-[12px] font-[600] text-foreground">{template.frequency}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                            <p className="text-[10px] text-muted-foreground font-[600] mb-1">Last Generated</p>
                            <p className="text-[12px] font-[600] text-foreground">{template.lastGenerated ? formatDate(template.lastGenerated) : "Never"}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                            <p className="text-[10px] text-muted-foreground font-[600] mb-1">Next Due</p>
                            <p className="text-[12px] font-[600] text-foreground">{template.nextDue ? formatDate(template.nextDue) : "—"}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                            <p className="text-[10px] text-muted-foreground font-[600] mb-1">Regulatory Ref.</p>
                            {template.regulatoryRef ? (
                                <div className="flex items-start gap-1">
                                    <Scale className="w-3 h-3 text-[#6B7280] mt-0.5 flex-shrink-0" />
                                    <p className="text-[11px] text-[#4B5563] font-[500]">{template.regulatoryRef}</p>
                                </div>
                            ) : (
                                <p className="text-[11px] text-[#9CA3AF]">N/A</p>
                            )}
                        </div>
                    </div>

                    {/* Export Options */}
                    <div>
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Export Options</h4>
                        <div className="flex items-center gap-2">
                            {["PDF", "XLSX", "CSV", "DOCX"].map((fmt) => (
                                <button
                                    key={fmt}
                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-[600] border border-[#E5E7EB] hover:border-[#D1D5DB] cursor-pointer ${FORMAT_COLORS[fmt] || "bg-gray-100 text-gray-700"}`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generation History */}
                    <div>
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Recent History</h4>
                        {relatedHistory.length > 0 ? (
                            <div className="space-y-2">
                                {relatedHistory.map((r) => (
                                    <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${r.status === "Completed" ? "bg-emerald-100" : "bg-gray-100"}`}>
                                            {r.status === "Completed" ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            ) : (
                                                <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-[600] text-foreground truncate">{r.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{formatDate(r.generatedDate)} &middot; {r.generatedBy} &middot; {r.fileSize}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-[600] ${FORMAT_COLORS[r.format]}`}>{r.format}</span>
                                            <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                                                <Download className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[11px] text-muted-foreground">No reports generated yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== Main Component ===== */
interface ReportsPageProps {
    onNavigateToClient: (client: Client) => void;
}

export function ReportsPage({ onNavigateToClient }: ReportsPageProps) {
    const [activeTab, setActiveTab] = useState<TabId>("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterFrequency, setFilterFrequency] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
    const [showManageSchedules, setShowManageSchedules] = useState(false);
    const [showRunAllDue, setShowRunAllDue] = useState(false);

    const chartData = useMemo(() => buildChartData(), []);

    // Computed stats
    const stats = useMemo(() => {
        const totalGenerated = GENERATED_REPORTS.length;
        const scheduledCount = SCHEDULED_REPORTS.length;
        const thisMonthExports = GENERATED_REPORTS.filter((r) => r.generatedDate >= "2026-02-01").length;
        const complianceDue = REPORT_TEMPLATES.filter(
            (t) => t.category === "Compliance & Regulatory" && t.nextDue && daysUntil(t.nextDue) <= 30 && daysUntil(t.nextDue) >= 0
        ).length;
        const clientCoverage = mockClients.filter((c) => c.engagementStatus !== "Completed").length;
        const avgAudit = Math.round(
            mockClients.filter((c) => c.engagementStatus !== "Completed").reduce((sum, c) => sum + c.auditReadinessScore, 0) /
            mockClients.filter((c) => c.engagementStatus !== "Completed").length
        );
        return { totalGenerated, scheduledCount, thisMonthExports, complianceDue, clientCoverage, avgAudit };
    }, []);

    // Filtered templates
    const filteredTemplates = useMemo(() => {
        let templates = [...REPORT_TEMPLATES];
        if (activeTab !== "overview" && activeTab !== "history") {
            const tabCategory: Record<string, string> = {
                compliance: "Compliance & Regulatory",
                engagement: "Client Engagement",
                financial: "Financial",
                productivity: "Task & Productivity",
                risk: "Risk & Audit",
            };
            if (tabCategory[activeTab]) {
                templates = templates.filter((t) => t.category === tabCategory[activeTab]);
            }
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            templates = templates.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.category.toLowerCase().includes(q) ||
                    (t.regulatoryRef || "").toLowerCase().includes(q)
            );
        }
        if (filterCategory) templates = templates.filter((t) => t.category === filterCategory);
        if (filterFrequency) templates = templates.filter((t) => t.frequency === filterFrequency);
        return templates;
    }, [activeTab, searchQuery, filterCategory, filterFrequency]);

    const activeFilterCount = [filterCategory, filterFrequency].filter(Boolean).length;

    const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "compliance", label: "Compliance", icon: Shield },
        { id: "engagement", label: "Engagement", icon: Users },
        { id: "financial", label: "Financial", icon: DollarSign },
        { id: "productivity", label: "Productivity", icon: Zap },
        { id: "risk", label: "Risk & Audit", icon: AlertTriangle },
        { id: "history", label: "History", icon: Clock },
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            <div className="p-6 max-w-[1440px] mx-auto">
                {/* Page Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-[22px] font-[800] text-foreground">Reports & Analytics</h1>
                        <p className="text-[13px] text-muted-foreground mt-0.5">
                            Friday, 6 February 2026 &middot; 12:00 IST &middot; Advisory reporting across {mockClients.length} client engagements
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowManageSchedules(true)} className="px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <Calendar className="w-3.5 h-3.5" /> Manage Schedules
                        </button>
                        <button onClick={() => setShowRunAllDue(true)} className="px-3 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer">
                            <Play className="w-3.5 h-3.5" /> Run All Due Reports
                        </button>
                    </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-6 gap-3 mb-5">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                                <FileText className="w-4 h-4 text-[#4F46E5]" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{REPORT_TEMPLATES.length}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Report Templates</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.totalGenerated}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Generated (All Time)</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.scheduledCount}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Scheduled</p>
                    </div>
                    <div className={`bg-white rounded-xl border ${stats.complianceDue > 0 ? "border-amber-200 bg-amber-50/30" : "border-[#E5E7EB]"} p-3.5 hover:shadow-sm transition-shadow`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg ${stats.complianceDue > 0 ? "bg-amber-100" : "bg-gray-100"} flex items-center justify-center`}>
                                <Shield className={`w-4 h-4 ${stats.complianceDue > 0 ? "text-amber-600" : "text-gray-500"}`} />
                            </div>
                        </div>
                        <p className={`text-[22px] font-[800] ${stats.complianceDue > 0 ? "text-amber-700" : "text-foreground"}`}>{stats.complianceDue}</p>
                        <p className={`text-[11px] font-[500] ${stats.complianceDue > 0 ? "text-amber-600" : "text-[#6B7280]"}`}>Compliance Due</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-teal-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.clientCoverage}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Active Clients</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                <Target className="w-4 h-4 text-violet-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.avgAudit}%</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Avg Audit Readiness</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-5 border-b border-[#E5E7EB] overflow-x-auto">
                    {tabs.map((tab) => {
                        const TabIcon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-[600] border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === tab.id ? "border-[#4F46E5] text-[#4F46E5]" : "border-transparent text-[#6B7280] hover:text-[#4B5563]"
                                    }`}
                            >
                                <TabIcon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Overview Tab — Charts */}
                {activeTab === "overview" && (
                    <div className="space-y-5">
                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Client Health Scores */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 col-span-2 min-w-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-[14px] font-[700] text-foreground">Client Health & Audit Readiness</h3>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Active client scores comparison</p>
                                    </div>
                                    <button className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                                        <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                                    </button>
                                </div>
                                <div className="h-[220px]">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <BarChart data={chartData.clientHealth} barGap={2} barCategoryGap="20%">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                                            <Bar dataKey="health" name="Health Score" fill="#4F46E5" radius={[3, 3, 0, 0]} />
                                            <Bar dataKey="audit" name="Audit Readiness" fill="#0EA5E9" radius={[3, 3, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Risk Distribution */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 min-w-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-[14px] font-[700] text-foreground">Risk Distribution</h3>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Client portfolio risk levels</p>
                                    </div>
                                </div>
                                <div className="h-[180px]">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <RechartsPie>
                                            <Pie
                                                data={chartData.riskDist}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={45}
                                                outerRadius={70}
                                                paddingAngle={3}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {chartData.riskDist.map((entry, idx) => (
                                                    <Cell key={idx} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex items-center justify-center gap-4 mt-1">
                                    {chartData.riskDist.map((r) => (
                                        <div key={r.name} className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                                            <span className="text-[10px] text-[#6B7280] font-[500]">{r.name} ({r.value})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Charts Row 2 */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Task Status */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 min-w-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-[14px] font-[700] text-foreground">Task Status</h3>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">All clients combined</p>
                                    </div>
                                </div>
                                <div className="h-[180px]">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <RechartsPie>
                                            <Pie
                                                data={chartData.taskStatus}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={45}
                                                outerRadius={70}
                                                paddingAngle={3}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {chartData.taskStatus.map((entry, idx) => (
                                                    <Cell key={idx} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex items-center justify-center gap-3 mt-1 flex-wrap">
                                    {chartData.taskStatus.map((s) => (
                                        <div key={s.name} className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                                            <span className="text-[10px] text-[#6B7280] font-[500]">{s.name} ({s.value})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Engagement Trend */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 col-span-2 min-w-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-[14px] font-[700] text-foreground">Engagement Activity Trend</h3>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Sep 2025 – Feb 2026</p>
                                    </div>
                                </div>
                                <div className="h-[220px]">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <AreaChart data={chartData.engagementTrend}>
                                            <defs>
                                                <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="docGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                                            <Area type="monotone" dataKey="tasks" name="Tasks" stroke="#4F46E5" fill="url(#taskGrad)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="documents" name="Documents" stroke="#10B981" fill="url(#docGrad)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="communications" name="Comms" stroke="#F59E0B" fill="url(#commGrad)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Charts Row 3 */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Advisor Workload */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 min-w-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-[14px] font-[700] text-foreground">Advisor Workload</h3>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Task distribution by advisor</p>
                                    </div>
                                </div>
                                <div className="h-[220px]">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <BarChart data={chartData.advisorWorkload} layout="vertical" barGap={1} barCategoryGap="20%">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                            <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={60} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                                            <Bar dataKey="completed" name="Completed" stackId="a" fill="#10B981" radius={0} />
                                            <Bar dataKey="progress" name="In Progress" stackId="a" fill="#3B82F6" radius={0} />
                                            <Bar dataKey="open" name="Open" stackId="a" fill="#6B7280" radius={0} />
                                            <Bar dataKey="overdue" name="Overdue" stackId="a" fill="#EF4444" radius={[0, 3, 3, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Tasks by Category */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 min-w-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-[14px] font-[700] text-foreground">Tasks by Regulatory Category</h3>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Irish regulatory compliance breakdown</p>
                                    </div>
                                </div>
                                <div className="h-[220px]">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <BarChart data={chartData.tasksByCategory} layout="vertical" barCategoryGap="15%">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                            <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                            <YAxis type="category" dataKey="category" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={110} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="count" name="Tasks" fill="#4F46E5" radius={[0, 3, 3, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Industry & Client Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Industry Breakdown */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 min-w-0">
                                <h3 className="text-[14px] font-[700] text-foreground mb-1">Industry Coverage</h3>
                                <p className="text-[11px] text-muted-foreground mb-4">Client portfolio by sector</p>
                                <div className="h-[160px]">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <RechartsPie>
                                            <Pie
                                                data={chartData.industryDist}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={38}
                                                outerRadius={60}
                                                paddingAngle={3}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {chartData.industryDist.map((entry, idx) => (
                                                    <Cell key={idx} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
                                    {chartData.industryDist.map((ind) => (
                                        <div key={ind.name} className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ind.color }} />
                                            <span className="text-[9px] text-[#6B7280] font-[500] truncate">{ind.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Client Performance Table */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 col-span-2 min-w-0">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="text-[14px] font-[700] text-foreground">Client Performance Summary</h3>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Key metrics across active clients</p>
                                    </div>
                                    <button className="px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] text-[10px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer flex items-center gap-1">
                                        <Download className="w-3 h-3" /> Export
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[#E5E7EB]">
                                                <th className="py-2 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Client</th>
                                                <th className="py-2 text-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Health</th>
                                                <th className="py-2 text-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Audit</th>
                                                <th className="py-2 text-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">NPS</th>
                                                <th className="py-2 text-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Risk</th>
                                                <th className="py-2 text-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Tasks</th>
                                                <th className="py-2 text-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Compliance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockClients
                                                .filter((c) => c.engagementStatus !== "Completed")
                                                .sort((a, b) => b.clientHealthScore - a.clientHealthScore)
                                                .map((c) => (
                                                    <tr key={c.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                                        <td className="py-2">
                                                            <button
                                                                onClick={() => onNavigateToClient(c)}
                                                                className="text-[11px] font-[600] text-[#4F46E5] hover:underline cursor-pointer"
                                                            >
                                                                {c.tradingName}
                                                            </button>
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <span className={`text-[11px] font-[700] ${c.clientHealthScore >= 80 ? "text-emerald-600" : c.clientHealthScore >= 60 ? "text-amber-600" : "text-red-600"}`}>
                                                                {c.clientHealthScore}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <span className={`text-[11px] font-[700] ${c.auditReadinessScore >= 80 ? "text-emerald-600" : c.auditReadinessScore >= 60 ? "text-amber-600" : "text-red-600"}`}>
                                                                {c.auditReadinessScore}%
                                                            </span>
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <span className={`text-[11px] font-[700] ${c.npsRating >= 50 ? "text-emerald-600" : c.npsRating >= 0 ? "text-amber-600" : "text-red-600"}`}>
                                                                {c.npsRating > 0 ? "+" : ""}{c.npsRating}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-[600] ${c.riskLevel === "High" ? "bg-red-50 text-red-700" : c.riskLevel === "Medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                                                                }`}>
                                                                {c.riskLevel}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <span className="text-[11px] text-[#4B5563]">{c.tasks.length}</span>
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-[600] ${c.complianceStatus === "Good" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                                                }`}>
                                                                {c.complianceStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Report Templates Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[15px] font-[700] text-foreground">Report Templates</h3>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9CA3AF]" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search reports..."
                                            className="pl-7 pr-3 py-1.5 text-[11px] bg-white border border-[#E5E7EB] rounded-lg w-[200px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {filteredTemplates.map((t) => (
                                    <ReportTemplateCard key={t.id} template={t} onGenerate={setSelectedTemplate} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Tabs (compliance, engagement, financial, productivity, risk) */}
                {activeTab !== "overview" && activeTab !== "history" && (
                    <div className="space-y-5">
                        {/* Category-Specific Charts */}
                        {activeTab === "compliance" && (
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                                    <h3 className="text-[14px] font-[700] text-foreground mb-1">Compliance Status</h3>
                                    <p className="text-[11px] text-muted-foreground mb-4">Good vs. Attention Needed by client</p>
                                    <div className="space-y-2.5">
                                        {mockClients.filter((c) => c.engagementStatus !== "Completed").map((c) => (
                                            <div key={c.id} className="flex items-center gap-3">
                                                <span className="text-[11px] font-[500] text-[#4B5563] w-[120px] truncate">{c.tradingName}</span>
                                                <div className="flex-1 h-5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${c.complianceStatus === "Good" ? "bg-emerald-500" : "bg-amber-500"}`}
                                                        style={{ width: `${c.auditReadinessScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-[600] text-[#6B7280] w-[36px] text-right">{c.auditReadinessScore}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                                    <h3 className="text-[14px] font-[700] text-foreground mb-1">Compliance Gaps Summary</h3>
                                    <p className="text-[11px] text-muted-foreground mb-4">Outstanding gaps by client</p>
                                    <div className="space-y-2">
                                        {mockClients.filter((c) => c.complianceGaps.length > 0).map((c) => (
                                            <div key={c.id} className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                                    <span className="text-[11px] font-[600] text-amber-800">{c.tradingName}</span>
                                                    <span className="text-[9px] text-amber-600 font-[600] ml-auto">{c.complianceGaps.length} gap{c.complianceGaps.length !== 1 ? "s" : ""}</span>
                                                </div>
                                                {c.complianceGaps.slice(0, 2).map((gap, i) => (
                                                    <p key={i} className="text-[10px] text-amber-700 ml-5 leading-tight">&bull; {gap}</p>
                                                ))}
                                                {c.complianceGaps.length > 2 && (
                                                    <p className="text-[9px] text-amber-600 ml-5 mt-0.5">+{c.complianceGaps.length - 2} more</p>
                                                )}
                                            </div>
                                        ))}
                                        {mockClients.filter((c) => c.complianceGaps.length > 0).length === 0 && (
                                            <div className="text-center py-8">
                                                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                                <p className="text-[12px] text-[#6B7280] font-[500]">No outstanding compliance gaps</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "engagement" && (
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 col-span-2 min-w-0">
                                    <h3 className="text-[14px] font-[700] text-foreground mb-1">Client Health Trends</h3>
                                    <p className="text-[11px] text-muted-foreground mb-4">Engagement activity over 6 months</p>
                                    <div className="h-[220px]">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                            <AreaChart data={chartData.engagementTrend}>
                                                <defs>
                                                    <linearGradient id="taskGrad2" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                                                <Area type="monotone" dataKey="tasks" name="Tasks Created" stroke="#4F46E5" fill="url(#taskGrad2)" strokeWidth={2} />
                                                <Area type="monotone" dataKey="communications" name="Communications" stroke="#F59E0B" fill="none" strokeWidth={2} strokeDasharray="4 4" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 min-w-0">
                                    <h3 className="text-[14px] font-[700] text-foreground mb-1">NPS Ratings</h3>
                                    <p className="text-[11px] text-muted-foreground mb-4">Net Promoter Scores</p>
                                    <div className="space-y-3">
                                        {mockClients
                                            .filter((c) => c.engagementStatus !== "Completed")
                                            .sort((a, b) => b.npsRating - a.npsRating)
                                            .map((c) => (
                                                <div key={c.id} className="flex items-center gap-2">
                                                    <span className="text-[10px] font-[500] text-[#4B5563] w-[90px] truncate">{c.tradingName}</span>
                                                    <div className="flex-1 h-4 bg-[#F3F4F6] rounded-full overflow-hidden relative">
                                                        <div
                                                            className={`h-full rounded-full ${c.npsRating >= 50 ? "bg-emerald-500" : c.npsRating >= 0 ? "bg-amber-500" : "bg-red-500"}`}
                                                            style={{ width: `${Math.max(5, ((c.npsRating + 100) / 200) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-[10px] font-[700] w-[30px] text-right ${c.npsRating >= 50 ? "text-emerald-600" : c.npsRating >= 0 ? "text-amber-600" : "text-red-600"}`}>
                                                        {c.npsRating > 0 ? "+" : ""}{c.npsRating}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "financial" && (
                            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-5">
                                <h3 className="text-[14px] font-[700] text-foreground mb-1">Financial Summary</h3>
                                <p className="text-[11px] text-muted-foreground mb-4">Billing model, contract value, and outstanding payments (EUR)</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[#E5E7EB]">
                                                <th className="py-2 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Client</th>
                                                <th className="py-2 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Billing Model</th>
                                                <th className="py-2 text-right text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Contract Value</th>
                                                <th className="py-2 text-right text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Outstanding</th>
                                                <th className="py-2 text-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Renewal</th>
                                                <th className="py-2 text-center text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Likelihood</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockClients.map((c) => (
                                                <tr key={c.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                                    <td className="py-2.5">
                                                        <button onClick={() => onNavigateToClient(c)} className="text-[11px] font-[600] text-[#4F46E5] hover:underline cursor-pointer">
                                                            {c.tradingName}
                                                        </button>
                                                    </td>
                                                    <td className="py-2.5 text-[11px] text-[#4B5563]">{c.billingModel}</td>
                                                    <td className="py-2.5 text-[11px] font-[600] text-foreground text-right">{c.contractValue}</td>
                                                    <td className="py-2.5 text-right">
                                                        <span className={`text-[11px] font-[600] ${c.outstandingPayments === "€0" || c.outstandingPayments === "€0.00" ? "text-emerald-600" : "text-amber-600"}`}>
                                                            {c.outstandingPayments}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 text-center text-[11px] text-[#4B5563]">{formatShortDate(c.renewalDate)}</td>
                                                    <td className="py-2.5 text-center">
                                                        <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-[600] ${c.renewalLikelihood === "High" ? "bg-emerald-50 text-emerald-700" : c.renewalLikelihood === "Medium" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                                                            }`}>
                                                            {c.renewalLikelihood}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "productivity" && (
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 min-w-0">
                                    <h3 className="text-[14px] font-[700] text-foreground mb-1">Advisor Workload</h3>
                                    <p className="text-[11px] text-muted-foreground mb-4">Task allocation by status</p>
                                    <div className="h-[220px]">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                            <BarChart data={chartData.advisorWorkload} layout="vertical" barGap={1} barCategoryGap="20%">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={60} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                                                <Bar dataKey="completed" name="Completed" stackId="a" fill="#10B981" />
                                                <Bar dataKey="progress" name="In Progress" stackId="a" fill="#3B82F6" />
                                                <Bar dataKey="open" name="Open" stackId="a" fill="#6B7280" />
                                                <Bar dataKey="overdue" name="Overdue" stackId="a" fill="#EF4444" radius={[0, 3, 3, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 min-w-0">
                                    <h3 className="text-[14px] font-[700] text-foreground mb-1">Tasks by Category</h3>
                                    <p className="text-[11px] text-muted-foreground mb-4">Irish regulatory task breakdown</p>
                                    <div className="h-[220px]">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                            <BarChart data={chartData.tasksByCategory} layout="vertical" barCategoryGap="15%">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                                <YAxis type="category" dataKey="category" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={110} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="count" name="Tasks" fill="#0EA5E9" radius={[0, 3, 3, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "risk" && (
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 min-w-0">
                                    <h3 className="text-[14px] font-[700] text-foreground mb-1">Risk Distribution</h3>
                                    <p className="text-[11px] text-muted-foreground mb-4">Client risk levels</p>
                                    <div className="h-[180px]">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                            <RechartsPie>
                                                <Pie data={chartData.riskDist} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                                                    {chartData.riskDist.map((entry, idx) => (
                                                        <Cell key={idx} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                            </RechartsPie>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex items-center justify-center gap-4 mt-1">
                                        {chartData.riskDist.map((r) => (
                                            <div key={r.name} className="flex items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                                                <span className="text-[10px] text-[#6B7280] font-[500]">{r.name} ({r.value})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 col-span-2 min-w-0">
                                    <h3 className="text-[14px] font-[700] text-foreground mb-1">Incident History & Risk Categories</h3>
                                    <p className="text-[11px] text-muted-foreground mb-4">Active clients ranked by incident count</p>
                                    <div className="space-y-2.5">
                                        {mockClients
                                            .filter((c) => c.engagementStatus !== "Completed")
                                            .sort((a, b) => b.incidentHistory - a.incidentHistory)
                                            .map((c) => (
                                                <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F9FAFB]">
                                                    <button onClick={() => onNavigateToClient(c)} className="text-[11px] font-[600] text-[#4F46E5] hover:underline cursor-pointer w-[120px] truncate text-left">
                                                        {c.tradingName}
                                                    </button>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-1 flex-wrap">
                                                            {c.riskCategory.split(", ").map((cat) => (
                                                                <span key={cat} className="px-1.5 py-0.5 rounded text-[8px] font-[600] bg-[#F3F4F6] text-[#6B7280]">{cat}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[11px] font-[700] ${c.incidentHistory === 0 ? "text-emerald-600" : c.incidentHistory <= 2 ? "text-amber-600" : "text-red-600"}`}>
                                                            {c.incidentHistory} incident{c.incidentHistory !== 1 ? "s" : ""}
                                                        </span>
                                                        <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-[600] ${c.riskLevel === "High" ? "bg-red-50 text-red-700" : c.riskLevel === "Medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                                                            }`}>
                                                            {c.riskLevel}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Filter and Templates Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[15px] font-[700] text-foreground">
                                    {activeTab === "compliance" && "Compliance & Regulatory Reports"}
                                    {activeTab === "engagement" && "Client Engagement Reports"}
                                    {activeTab === "financial" && "Financial Reports"}
                                    {activeTab === "productivity" && "Task & Productivity Reports"}
                                    {activeTab === "risk" && "Risk & Audit Reports"}
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9CA3AF]" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="pl-7 pr-3 py-1.5 text-[11px] bg-white border border-[#E5E7EB] rounded-lg w-[180px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {filteredTemplates.map((t) => (
                                    <ReportTemplateCard key={t.id} template={t} onGenerate={setSelectedTemplate} />
                                ))}
                            </div>
                            {filteredTemplates.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
                                    <FileText className="w-8 h-8 text-[#D1D5DB] mx-auto mb-2" />
                                    <p className="text-[13px] font-[600] text-[#4B5563]">No reports found</p>
                                    <p className="text-[11px] text-muted-foreground mt-1">Try adjusting your search terms</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <div className="space-y-5">
                        {/* Scheduled Reports */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-[14px] font-[700] text-foreground">Scheduled Reports</h3>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{SCHEDULED_REPORTS.length} reports scheduled for auto-generation</p>
                                </div>
                                <button className="px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] text-[10px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Manage
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {SCHEDULED_REPORTS.slice(0, 8).map((sr) => {
                                    const template = REPORT_TEMPLATES.find((t) => t.id === sr.templateId);
                                    if (!template) return null;
                                    const Icon = template.icon;
                                    const dueIn = daysUntil(sr.nextRun);
                                    return (
                                        <div key={sr.templateId} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                            <div className={`w-7 h-7 rounded-lg ${template.bg} flex items-center justify-center flex-shrink-0`}>
                                                <Icon className={`w-3.5 h-3.5 ${template.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-[600] text-foreground truncate">{template.name}</p>
                                                <p className="text-[9px] text-muted-foreground">{sr.frequency} &middot; {dueIn}d</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Report History Table */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
                                <div>
                                    <h3 className="text-[14px] font-[700] text-foreground">Report History</h3>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Previously generated reports</p>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9CA3AF]" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search history..."
                                        className="pl-7 pr-3 py-1.5 text-[11px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg w-[200px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                    />
                                </div>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
                                        <th className="px-4 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Report</th>
                                        <th className="px-4 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Generated</th>
                                        <th className="px-4 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">By</th>
                                        <th className="px-4 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Format</th>
                                        <th className="px-4 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Size</th>
                                        <th className="px-4 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-2.5 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {GENERATED_REPORTS.filter((r) => {
                                        if (!searchQuery.trim()) return true;
                                        const q = searchQuery.toLowerCase();
                                        return r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.generatedBy.toLowerCase().includes(q);
                                    }).map((r) => {
                                        const catConf = getCategoryConf(r.category);
                                        return (
                                            <tr key={r.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-[#4F46E5]" />
                                                        <span className="text-[11px] font-[600] text-foreground">{r.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-[600] border ${catConf.bg} ${catConf.color} ${catConf.border}`}>
                                                        {r.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-[11px] text-[#4B5563]">{formatDate(r.generatedDate)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-5 h-5 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[8px] font-[700] text-[#4F46E5]">
                                                            {r.generatedBy.split(" ").map((n) => n[0]).join("")}
                                                        </div>
                                                        <span className="text-[11px] text-[#4B5563]">{r.generatedBy.split(" ")[0]}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-[600] ${FORMAT_COLORS[r.format]}`}>{r.format}</span>
                                                </td>
                                                <td className="px-4 py-3 text-[11px] text-[#4B5563]">{r.fileSize}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-[600] ${r.status === "Completed" ? "bg-emerald-50 text-emerald-700" : r.status === "Processing" ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-700"
                                                        }`}>
                                                        {r.status === "Completed" && <CheckCircle2 className="w-3 h-3" />}
                                                        {r.status === "Processing" && <RefreshCw className="w-3 h-3 animate-spin" />}
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                                                        <Download className="w-4 h-4 text-[#9CA3AF]" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Bottom */}
                <div className="mt-5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                        {REPORT_TEMPLATES.length} report templates &middot; {GENERATED_REPORTS.length} reports generated &middot; Last updated: 06 Feb 2026, 12:00 IST
                    </span>
                    <span>
                        Data Protection Act 2018 &middot; GDPR Compliant &middot; Irish regulatory reporting standards
                    </span>
                </div>
            </div>

            {/* Detail Panel */}
            {selectedTemplate && (
                <ReportDetailPanel template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
            )}
            {showManageSchedules && <ManageSchedulesModal onClose={() => setShowManageSchedules(false)} />}
            {showRunAllDue && <RunAllDueModal onClose={() => setShowRunAllDue(false)} />}
        </div>
    );
}
