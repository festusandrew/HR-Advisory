import { useState, useMemo, useCallback } from "react";
import {
    CheckSquare,
    Clock,
    AlertTriangle,
    Plus,
    Search,
    ChevronDown,
    MoreHorizontal,
    ArrowUpDown,
    Users,
    Shield,
    FileText,
    X,
    Tag,
    Building2,
    User,
    Briefcase,
    LayoutGrid,
    List,
    Download,
    ArrowUpRight,
    Activity,
    ExternalLink,
    BookOpen,
    Scale,
    HardHat,
    Heart,
    Landmark,
    Wallet,
    CircleDot,
} from "lucide-react";
import { advisors } from "./mock-data";
import type { Client, Task, TaskCategory } from "./mock-data";
import { useApi } from "../context/ApiContext";
import { CreateTaskModal } from "./ClientProfileModals";

/* ===== Constants ===== */
const NOW = new Date("2026-02-06T12:00:00Z");

const ALL_CATEGORIES: TaskCategory[] = [
    "GDPR & Data Protection",
    "WRC & Employment Law",
    "Health & Safety",
    "Employee Relations",
    "Industrial Relations",
    "Policy & Compliance",
    "Revenue & Payroll",
    "Workforce Planning",
    "HIQA Compliance",
    "CBI Compliance",
    "General Advisory",
];

const CATEGORY_CONFIG: Record<TaskCategory, { icon: React.ElementType; color: string; bg: string; border: string }> = {
    "GDPR & Data Protection": { icon: Shield, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
    "WRC & Employment Law": { icon: Scale, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    "Health & Safety": { icon: HardHat, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
    "Employee Relations": { icon: Users, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200" },
    "Industrial Relations": { icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
    "Policy & Compliance": { icon: BookOpen, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
    "Revenue & Payroll": { icon: Wallet, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
    "Workforce Planning": { icon: Activity, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
    "HIQA Compliance": { icon: Heart, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
    "CBI Compliance": { icon: Landmark, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
    "General Advisory": { icon: FileText, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
};

/* ===== Types ===== */
interface EnrichedTask extends Task {
    clientId: string;
    clientName: string;
    clientTradingName: string;
    clientLocation: string;
    clientRiskLevel: string;
    clientIndustry: string;
}

type TabId = "all" | "overdue" | "myTasks" | "byCategory" | "completed";
type SortField = "dueDate" | "priority" | "status" | "client" | "assignedTo" | "createdDate" | "category";
type SortDir = "asc" | "desc";

/* ===== Helpers ===== */
function daysUntil(iso: string) {
    return Math.ceil((new Date(iso).getTime() - NOW.getTime()) / 86400000);
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
}

function formatShortDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short" });
}

function formatTimestamp(iso: string) {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" })} at ${d.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false })} IST`;
}

function relativeTime(iso: string) {
    const diff = NOW.getTime() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return formatShortDate(iso);
}

/* ===== Sub-components ===== */
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        Open: "bg-blue-50 text-blue-700 border-blue-200",
        "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
        Overdue: "bg-red-50 text-red-700 border-red-200",
        Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-[600] border ${map[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
            {status}
        </span>
    );
}

function PriorityBadge({ priority }: { priority: string }) {
    const map: Record<string, { dot: string; text: string }> = {
        High: { dot: "bg-red-500", text: "text-red-700" },
        Medium: { dot: "bg-amber-500", text: "text-amber-700" },
        Low: { dot: "bg-emerald-500", text: "text-emerald-700" },
    };
    const c = map[priority] || { dot: "bg-gray-400", text: "text-gray-600" };
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-[600] ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {priority}
        </span>
    );
}

function CategoryTag({ category }: { category: TaskCategory }) {
    const conf = CATEGORY_CONFIG[category];
    const Icon = conf.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-[600] border ${conf.bg} ${conf.color} ${conf.border}`}>
            <Icon className="w-3 h-3" />
            {category}
        </span>
    );
}

function DueDateLabel({ dueDate, status }: { dueDate: string; status: string }) {
    if (status === "Completed") {
        return <span className="text-[11px] text-emerald-600 font-[500]">Completed</span>;
    }
    const days = daysUntil(dueDate);
    if (days < 0) {
        return <span className="text-[11px] text-red-600 font-[600]">{Math.abs(days)}d overdue</span>;
    }
    if (days === 0) {
        return <span className="text-[11px] text-red-600 font-[600]">Due today</span>;
    }
    if (days <= 3) {
        return <span className="text-[11px] text-red-500 font-[600]">Due in {days}d</span>;
    }
    if (days <= 7) {
        return <span className="text-[11px] text-amber-600 font-[500]">Due in {days}d</span>;
    }
    return <span className="text-[11px] text-[#6B7280] font-[500]">{formatShortDate(dueDate)}</span>;
}

function FilterDropdown({
    label,
    options,
    value,
    onChange,
    icon: Icon,
}: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
    icon: React.ElementType;
}) {
    return (
        <div className="relative">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-[11px] text-[#4B5563] font-[500] cursor-pointer hover:border-[#D1D5DB]">
                <Icon className="w-3 h-3 text-[#9CA3AF]" />
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none bg-transparent outline-none cursor-pointer pr-3 text-[11px]"
                >
                    <option value="">{label}</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#9CA3AF] -ml-2" />
            </div>
        </div>
    );
}



/* ===== Task Detail Panel ===== */
function TaskDetailPanel({
    task,
    onClose,
    onNavigateToClient,
}: {
    task: EnrichedTask;
    onClose: () => void;
    onNavigateToClient: (client: Client) => void;
}) {
    const { clients, updateTask } = useApi();
    const catConf = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG["General Advisory"];
    const CatIcon = catConf.icon;
    const days = daysUntil(task.dueDate);
    const client = clients.find((c) => c.id === task.clientId);

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/30" onClick={onClose} />
            <div className="w-[520px] bg-white shadow-2xl overflow-y-auto border-l border-[#E5E7EB] animate-slide-in">
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 border-b border-[#E5E7EB]">
                    <div className="flex items-start justify-between px-6 py-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <StatusBadge status={task.status} />
                                <PriorityBadge priority={task.priority} />
                                <span className="text-[10px] text-muted-foreground font-[500]">{task.clientId}-{task.id}</span>
                            </div>
                            <h3 className="text-[16px] font-[700] text-foreground pr-4">{task.title}</h3>
                        </div>
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer flex-shrink-0">
                            <X className="w-4 h-4 text-[#6B7280]" />
                        </button>
                    </div>
                    {/* Quick actions */}
                    <div className="flex items-center gap-2 px-6 pb-3">
                        {task.status === "Open" && (
                            <button
                                onClick={async () => {
                                    await updateTask(task.clientId, task.id, { status: "In Progress" });
                                    onClose();
                                }}
                                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-[600] hover:bg-indigo-100 cursor-pointer border border-indigo-200"
                            >
                                Start Task
                            </button>
                        )}
                        {(task.status === "In Progress" || task.status === "Overdue") && (
                            <button
                                onClick={async () => {
                                    await updateTask(task.clientId, task.id, {
                                        status: "Completed",
                                        completedDate: new Date().toISOString().split("T")[0],
                                        completedTimestamp: new Date().toISOString(),
                                    });
                                    onClose();
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-[600] hover:bg-emerald-100 cursor-pointer border border-emerald-200"
                            >
                                Mark Complete
                            </button>
                        )}
                        <button className="px-3 py-1.5 rounded-lg bg-gray-50 text-[#4B5563] text-[11px] font-[600] hover:bg-gray-100 cursor-pointer border border-gray-200">Edit</button>
                        <button className="px-3 py-1.5 rounded-lg bg-gray-50 text-[#4B5563] text-[11px] font-[600] hover:bg-gray-100 cursor-pointer border border-gray-200">Reassign</button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer ml-auto">
                            <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Due Date Alert */}
                    {task.status !== "Completed" && days <= 3 && (
                        <div className={`flex items-center gap-2.5 p-3 rounded-lg border ${days < 0 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                            <AlertTriangle className={`w-4 h-4 ${days < 0 ? "text-red-600" : "text-amber-600"}`} />
                            <span className={`text-[12px] font-[600] ${days < 0 ? "text-red-700" : "text-amber-700"}`}>
                                {days < 0 ? `This task is ${Math.abs(days)} day${Math.abs(days) > 1 ? "s" : ""} overdue` : days === 0 ? "Due today" : `Due in ${days} day${days > 1 ? "s" : ""}`}
                            </span>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-[13px] text-[#4B5563] leading-relaxed">{task.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3">
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1">Assigned To</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[9px] font-[700] text-[#4F46E5]">
                                        {task.assignedTo.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <span className="text-[12px] font-[600] text-foreground">{task.assignedTo}</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1">Client</p>
                                <button
                                    className="flex items-center gap-1.5 text-[12px] font-[600] text-[#4F46E5] hover:underline cursor-pointer"
                                    onClick={() => client && onNavigateToClient(client)}
                                >
                                    <Building2 className="w-3 h-3" />
                                    {task.clientTradingName}
                                    <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1">Due Date</p>
                                <p className="text-[12px] font-[600] text-foreground">{formatDate(task.dueDate)}</p>
                                <DueDateLabel dueDate={task.dueDate} status={task.status} />
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1">Created</p>
                                <p className="text-[12px] font-[600] text-foreground">{formatDate(task.createdDate)}</p>
                                <p className="text-[10px] text-muted-foreground">{formatTimestamp(task.createdTimestamp)}</p>
                            </div>
                        </div>
                        {task.completedDate && (
                            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                <p className="text-[10px] text-emerald-600 font-[600] mb-1">Completed On</p>
                                <p className="text-[12px] font-[600] text-emerald-700">{formatDate(task.completedDate)}</p>
                            </div>
                        )}
                    </div>

                    {/* Category & Regulatory */}
                    <div className="space-y-3">
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Category & Regulation</h4>
                        <div className={`p-3 rounded-lg border ${catConf.bg} ${catConf.border}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <CatIcon className={`w-4 h-4 ${catConf.color}`} />
                                <span className={`text-[13px] font-[700] ${catConf.color}`}>{task.category}</span>
                            </div>
                            {task.regulatoryRef !== "N/A" && (
                                <div className="flex items-start gap-2 mt-2">
                                    <Scale className="w-3.5 h-3.5 text-[#6B7280] mt-0.5" />
                                    <p className="text-[11px] text-[#4B5563] font-[500]">{task.regulatoryRef}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Client Context */}
                    <div className="space-y-3">
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Client Context</h4>
                        <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[12px] font-[600] text-foreground">{task.clientTradingName}</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-[600] border ${task.clientRiskLevel === "High" ? "bg-red-50 text-red-700 border-red-200" : task.clientRiskLevel === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                                    {task.clientRiskLevel} Risk
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                <span>{task.clientIndustry}</span>
                                <span>&middot;</span>
                                <span>{task.clientLocation}</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity Notes */}
                    <div className="space-y-3">
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Notes</h4>
                        <textarea
                            className="w-full h-20 px-3 py-2 text-[13px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]/40"
                            placeholder="Add a note or update to this task..."
                        />
                        <button className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[11px] font-[600] hover:bg-[#4338CA] cursor-pointer">Add Note</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== Main Component ===== */
interface TasksPageProps {
    onNavigateToClient: (client: Client) => void;
}

export function TasksPage({ onNavigateToClient }: TasksPageProps) {
    const { clients, addTask } = useApi();
    const [activeTab, setActiveTab] = useState<TabId>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterAssignee, setFilterAssignee] = useState("");
    const [filterClient, setFilterClient] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [sortField, setSortField] = useState<SortField>("dueDate");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [viewMode, setViewMode] = useState<"list" | "board">("list");
    const [selectedTask, setSelectedTask] = useState<EnrichedTask | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

    // Enrich tasks with client info
    const allTasks: EnrichedTask[] = useMemo(() => {
        return clients.flatMap((c) =>
            c.tasks.map((t) => ({
                ...t,
                clientId: c.id,
                clientName: c.name,
                clientTradingName: c.tradingName,
                clientLocation: c.location,
                clientRiskLevel: c.riskLevel,
                clientIndustry: c.industry,
            }))
        );
    }, [clients]);

    // Active filter count
    const activeFilterCount = [filterStatus, filterPriority, filterAssignee, filterClient, filterCategory].filter(Boolean).length;

    // Filter tasks
    const filteredTasks = useMemo(() => {
        let tasks = [...allTasks];

        // Tab filters
        if (activeTab === "overdue") tasks = tasks.filter((t) => t.status === "Overdue");
        else if (activeTab === "myTasks") tasks = tasks.filter((t) => t.assignedTo === "Aoife Brennan");
        else if (activeTab === "completed") tasks = tasks.filter((t) => t.status === "Completed");
        else if (activeTab === "all") tasks = tasks.filter((t) => t.status !== "Completed");

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            tasks = tasks.filter(
                (t) =>
                    t.title.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.clientTradingName.toLowerCase().includes(q) ||
                    t.assignedTo.toLowerCase().includes(q) ||
                    t.category.toLowerCase().includes(q) ||
                    t.regulatoryRef.toLowerCase().includes(q)
            );
        }

        // Dropdown filters
        if (filterStatus) tasks = tasks.filter((t) => t.status === filterStatus);
        if (filterPriority) tasks = tasks.filter((t) => t.priority === filterPriority);
        if (filterAssignee) tasks = tasks.filter((t) => t.assignedTo === filterAssignee);
        if (filterClient) tasks = tasks.filter((t) => t.clientTradingName === filterClient);
        if (filterCategory) tasks = tasks.filter((t) => t.category === filterCategory);

        // Sort
        const priorityOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
        const statusOrder: Record<string, number> = { Overdue: 4, "In Progress": 3, Open: 2, Completed: 1 };

        tasks.sort((a, b) => {
            let valA: string | number = "";
            let valB: string | number = "";
            switch (sortField) {
                case "dueDate": valA = a.dueDate; valB = b.dueDate; break;
                case "priority": valA = priorityOrder[a.priority] || 0; valB = priorityOrder[b.priority] || 0; break;
                case "status": valA = statusOrder[a.status] || 0; valB = statusOrder[b.status] || 0; break;
                case "client": valA = a.clientTradingName; valB = b.clientTradingName; break;
                case "assignedTo": valA = a.assignedTo; valB = b.assignedTo; break;
                case "createdDate": valA = a.createdDate; valB = b.createdDate; break;
                case "category": valA = a.category; valB = b.category; break;
            }
            if (valA < valB) return sortDir === "asc" ? -1 : 1;
            if (valA > valB) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

        return tasks;
    }, [allTasks, activeTab, searchQuery, filterStatus, filterPriority, filterAssignee, filterClient, filterCategory, sortField, sortDir]);

    // Stats
    const stats = useMemo(() => {
        const active = allTasks.filter((t) => t.status !== "Completed");
        return {
            total: allTasks.length,
            overdue: allTasks.filter((t) => t.status === "Overdue").length,
            inProgress: allTasks.filter((t) => t.status === "In Progress").length,
            open: allTasks.filter((t) => t.status === "Open").length,
            completed: allTasks.filter((t) => t.status === "Completed").length,
            highPriority: active.filter((t) => t.priority === "High").length,
            myTasks: allTasks.filter((t) => t.assignedTo === "Aoife Brennan" && t.status !== "Completed").length,
            dueSoon: active.filter((t) => { const d = daysUntil(t.dueDate); return d >= 0 && d <= 7; }).length,
        };
    }, [allTasks]);

    // Category stats
    const categoryStats = useMemo(() => {
        const activeTasks = allTasks.filter((t) => t.status !== "Completed");
        const catMap = new Map<string, number>();
        activeTasks.forEach((t) => catMap.set(t.category, (catMap.get(t.category) || 0) + 1));
        return Array.from(catMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([cat, count]) => ({ category: cat as TaskCategory, count }));
    }, [allTasks]);

    const toggleSort = useCallback((field: SortField) => {
        if (sortField === field) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    }, [sortField]);

    const clearFilters = () => {
        setFilterStatus("");
        setFilterPriority("");
        setFilterAssignee("");
        setFilterClient("");
        setFilterCategory("");
        setSearchQuery("");
    };

    const toggleTaskSelection = (taskKey: string) => {
        setSelectedTasks((prev) => {
            const next = new Set(prev);
            if (next.has(taskKey)) next.delete(taskKey);
            else next.add(taskKey);
            return next;
        });
    };

    const clientNames = useMemo(
        () => [...new Set(clients.filter((c) => c.engagementStatus !== "Completed").map((c) => c.tradingName))],
        [clients]
    );

    const tabs: { id: TabId; label: string; count: number; color?: string }[] = [
        { id: "all", label: "Active Tasks", count: stats.total - stats.completed },
        { id: "overdue", label: "Overdue", count: stats.overdue, color: "text-red-600 bg-red-50 border-red-200" },
        { id: "myTasks", label: "My Tasks", count: stats.myTasks },
        { id: "byCategory", label: "By Category", count: categoryStats.length },
        { id: "completed", label: "Completed", count: stats.completed },
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            <div className="p-6 max-w-[1440px] mx-auto">
                {/* Page Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-[22px] font-[800] text-foreground">Tasks & Action Items</h1>
                        <p className="text-[13px] text-muted-foreground mt-0.5">
                            Friday, 6 February 2026 &middot; 12:00 IST &middot; Manage all advisory tasks across client engagements
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <Download className="w-3.5 h-3.5" /> Export
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-3 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" /> Create Task
                        </button>
                    </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-6 gap-3 mb-5">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                                <CheckSquare className="w-4 h-4 text-[#4F46E5]" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.total}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Total Tasks</p>
                    </div>
                    <div className="bg-white rounded-xl border border-red-200 p-3.5 bg-red-50/30 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                            </div>
                            {stats.overdue > 0 && <span className="text-[10px] font-[700] text-red-600 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> Urgent</span>}
                        </div>
                        <p className="text-[22px] font-[800] text-red-700">{stats.overdue}</p>
                        <p className="text-[11px] text-red-600 font-[500]">Overdue</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-indigo-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.inProgress}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">In Progress</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <CircleDot className="w-4 h-4 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.open}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Open</p>
                    </div>
                    <div className="bg-white rounded-xl border border-amber-200 p-3.5 bg-amber-50/30 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-amber-700">{stats.dueSoon}</p>
                        <p className="text-[11px] text-amber-600 font-[500]">Due This Week</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-emerald-700">{stats.completed}</p>
                        <p className="text-[11px] text-emerald-600 font-[500]">Completed</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-4 border-b border-[#E5E7EB]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-[600] border-b-2 transition-colors cursor-pointer ${activeTab === tab.id
                                ? "border-[#4F46E5] text-[#4F46E5]"
                                : "border-transparent text-[#6B7280] hover:text-[#4B5563]"
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-[700] border ${tab.color && activeTab === tab.id
                                ? tab.color
                                : activeTab === tab.id
                                    ? "bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]"
                                    : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* By Category View */}
                {activeTab === "byCategory" ? (
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <p className="text-[13px] text-muted-foreground">{categoryStats.length} active categories across all client engagements</p>
                            <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-lg p-0.5">
                                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}>
                                    <List className="w-3.5 h-3.5 text-[#6B7280]" />
                                </button>
                                <button onClick={() => setViewMode("board")} className={`p-1.5 rounded-md cursor-pointer ${viewMode === "board" ? "bg-white shadow-sm" : ""}`}>
                                    <LayoutGrid className="w-3.5 h-3.5 text-[#6B7280]" />
                                </button>
                            </div>
                        </div>

                        {viewMode === "board" ? (
                            <div className="grid grid-cols-3 gap-4">
                                {categoryStats.map(({ category, count }) => {
                                    const conf = CATEGORY_CONFIG[category];
                                    const CatIcon = conf.icon;
                                    const catTasks = allTasks.filter((t) => t.category === category && t.status !== "Completed");
                                    const overdue = catTasks.filter((t) => t.status === "Overdue").length;
                                    return (
                                        <div key={category} className={`bg-white rounded-xl border ${conf.border} overflow-hidden`}>
                                            <div className={`flex items-center justify-between px-4 py-3 border-b ${conf.border} ${conf.bg}`}>
                                                <div className="flex items-center gap-2">
                                                    <CatIcon className={`w-4 h-4 ${conf.color}`} />
                                                    <span className={`text-[12px] font-[700] ${conf.color}`}>{category}</span>
                                                </div>
                                                <span className={`text-[10px] font-[700] ${conf.color}`}>{count}</span>
                                            </div>
                                            <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
                                                {catTasks.map((task) => (
                                                    <div
                                                        key={task.clientId + task.id}
                                                        className="p-2.5 rounded-lg border border-[#F3F4F6] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                                                        onClick={() => setSelectedTask(task)}
                                                    >
                                                        <p className="text-[11px] font-[600] text-foreground line-clamp-2">{task.title}</p>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <PriorityBadge priority={task.priority} />
                                                            <span className="text-[9px] text-muted-foreground">&middot;</span>
                                                            <span className="text-[10px] text-muted-foreground truncate">{task.clientTradingName}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-1.5">
                                                            <StatusBadge status={task.status} />
                                                            <DueDateLabel dueDate={task.dueDate} status={task.status} />
                                                        </div>
                                                    </div>
                                                ))}
                                                {catTasks.length === 0 && (
                                                    <p className="text-[11px] text-muted-foreground text-center py-4">No active tasks</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {categoryStats.map(({ category, count }) => {
                                    const conf = CATEGORY_CONFIG[category];
                                    const CatIcon = conf.icon;
                                    const catTasks = allTasks.filter((t) => t.category === category && t.status !== "Completed");
                                    return (
                                        <div key={category} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                                            <div className={`flex items-center justify-between px-5 py-3 border-b ${conf.border} ${conf.bg}`}>
                                                <div className="flex items-center gap-2">
                                                    <CatIcon className={`w-4 h-4 ${conf.color}`} />
                                                    <span className={`text-[13px] font-[700] ${conf.color}`}>{category}</span>
                                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-[700] border ${conf.bg} ${conf.color} ${conf.border}`}>{count}</span>
                                                </div>
                                            </div>
                                            <div className="divide-y divide-[#F3F4F6]">
                                                {catTasks.map((task) => (
                                                    <div
                                                        key={task.clientId + task.id}
                                                        className="flex items-center gap-4 px-5 py-3 hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                                                        onClick={() => setSelectedTask(task)}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[12px] font-[600] text-foreground truncate">{task.title}</p>
                                                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                                                                <span className="font-[500] text-[#4B5563]">{task.clientTradingName}</span>
                                                                <span>&middot;</span>
                                                                <span>{task.assignedTo}</span>
                                                                {task.regulatoryRef !== "N/A" && (
                                                                    <>
                                                                        <span>&middot;</span>
                                                                        <span className="truncate max-w-[200px]">{task.regulatoryRef}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <PriorityBadge priority={task.priority} />
                                                        <StatusBadge status={task.status} />
                                                        <DueDateLabel dueDate={task.dueDate} status={task.status} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Filter Bar */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <div className="relative flex-1 max-w-[280px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search tasks, clients, regulations..."
                                    className="w-full pl-9 pr-3 py-2 text-[12px] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]/40"
                                />
                            </div>
                            {activeTab !== "overdue" && activeTab !== "completed" && (
                                <FilterDropdown label="Status" options={["Open", "In Progress", "Overdue"]} value={filterStatus} onChange={setFilterStatus} icon={CircleDot} />
                            )}
                            <FilterDropdown label="Priority" options={["High", "Medium", "Low"]} value={filterPriority} onChange={setFilterPriority} icon={AlertTriangle} />
                            <FilterDropdown label="Advisor" options={advisors} value={filterAssignee} onChange={setFilterAssignee} icon={User} />
                            <FilterDropdown label="Client" options={clientNames} value={filterClient} onChange={setFilterClient} icon={Building2} />
                            <FilterDropdown label="Category" options={ALL_CATEGORIES.filter(c => allTasks.some(t => t.category === c))} value={filterCategory} onChange={setFilterCategory} icon={Tag} />

                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters} className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-[600] text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                                    <X className="w-3 h-3" /> Clear ({activeFilterCount})
                                </button>
                            )}

                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[11px] text-muted-foreground">{filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}</span>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedTasks.size > 0 && (
                            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg mb-4">
                                <span className="text-[12px] font-[600] text-[#4F46E5]">{selectedTasks.size} selected</span>
                                <div className="flex items-center gap-2 ml-2">
                                    <button className="px-2.5 py-1 rounded-md bg-white text-[11px] font-[600] text-[#4B5563] border border-[#E5E7EB] hover:bg-gray-50 cursor-pointer">Reassign</button>
                                    <button className="px-2.5 py-1 rounded-md bg-white text-[11px] font-[600] text-[#4B5563] border border-[#E5E7EB] hover:bg-gray-50 cursor-pointer">Change Priority</button>
                                    <button className="px-2.5 py-1 rounded-md bg-emerald-50 text-[11px] font-[600] text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer">Mark Complete</button>
                                </div>
                                <button onClick={() => setSelectedTasks(new Set())} className="ml-auto text-[11px] font-[600] text-[#6B7280] hover:text-foreground cursor-pointer">Clear</button>
                            </div>
                        )}

                        {/* Task Table */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
                                            <th className="w-10 px-3 py-2.5">
                                                <input
                                                    type="checkbox"
                                                    className="w-3.5 h-3.5 rounded border-[#D1D5DB] accent-[#4F46E5] cursor-pointer"
                                                    checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                                                    onChange={() => {
                                                        if (selectedTasks.size === filteredTasks.length) {
                                                            setSelectedTasks(new Set());
                                                        } else {
                                                            setSelectedTasks(new Set(filteredTasks.map((t) => t.clientId + t.id)));
                                                        }
                                                    }}
                                                />
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider min-w-[280px]">
                                                <button onClick={() => toggleSort("dueDate")} className="flex items-center gap-1 cursor-pointer">
                                                    Task <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                                <button onClick={() => toggleSort("category")} className="flex items-center gap-1 cursor-pointer">
                                                    Category <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                                <button onClick={() => toggleSort("client")} className="flex items-center gap-1 cursor-pointer">
                                                    Client <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                                <button onClick={() => toggleSort("assignedTo")} className="flex items-center gap-1 cursor-pointer">
                                                    Assigned <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                                <button onClick={() => toggleSort("priority")} className="flex items-center gap-1 cursor-pointer">
                                                    Priority <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                                <button onClick={() => toggleSort("status")} className="flex items-center gap-1 cursor-pointer">
                                                    Status <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                                <button onClick={() => toggleSort("dueDate")} className="flex items-center gap-1 cursor-pointer">
                                                    Due Date <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-3 py-2.5 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTasks.map((task) => {
                                            const taskKey = task.clientId + task.id;
                                            const isSelected = selectedTasks.has(taskKey);
                                            return (
                                                <tr
                                                    key={taskKey}
                                                    className={`border-b border-[#F3F4F6] hover:bg-[#F9FAFB] cursor-pointer transition-colors ${isSelected ? "bg-[#EEF2FF]/40" : ""}`}
                                                    onClick={() => setSelectedTask(task)}
                                                >
                                                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            className="w-3.5 h-3.5 rounded border-[#D1D5DB] accent-[#4F46E5] cursor-pointer"
                                                            checked={isSelected}
                                                            onChange={() => toggleTaskSelection(taskKey)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <p className={`text-[12px] font-[600] text-foreground ${task.status === "Completed" ? "line-through opacity-60" : ""}`}>{task.title}</p>
                                                        {task.regulatoryRef !== "N/A" && (
                                                            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                                                <Scale className="w-2.5 h-2.5" />
                                                                <span className="truncate max-w-[220px]">{task.regulatoryRef}</span>
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <CategoryTag category={task.category} />
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <span className="text-[11px] font-[600] text-[#4B5563]">{task.clientTradingName}</span>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-5 h-5 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[8px] font-[700] text-[#4F46E5]">
                                                                {task.assignedTo.split(" ").map(n => n[0]).join("")}
                                                            </div>
                                                            <span className="text-[11px] text-[#4B5563]">{task.assignedTo.split(" ")[0]}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3"><PriorityBadge priority={task.priority} /></td>
                                                    <td className="px-3 py-3"><StatusBadge status={task.status} /></td>
                                                    <td className="px-3 py-3">
                                                        <DueDateLabel dueDate={task.dueDate} status={task.status} />
                                                    </td>
                                                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                                                        <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                                                            <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {filteredTasks.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-3">
                                        <CheckSquare className="w-6 h-6 text-[#9CA3AF]" />
                                    </div>
                                    <p className="text-[14px] font-[600] text-[#4B5563]">No tasks found</p>
                                    <p className="text-[12px] text-muted-foreground mt-1">
                                        {activeFilterCount > 0 || searchQuery ? "Try adjusting your filters or search terms" : "All clear — no tasks to show"}
                                    </p>
                                    {activeFilterCount > 0 && (
                                        <button onClick={clearFilters} className="mt-3 px-3 py-1.5 rounded-lg text-[12px] font-[600] text-[#4F46E5] hover:bg-[#EEF2FF] cursor-pointer">
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bottom Summary */}
                        <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>Showing {filteredTasks.length} of {allTasks.length} tasks &middot; Last updated: 06 Feb 2026, 12:00 IST</span>
                            <span>Irish Employment Law & EU Regulatory Context &middot; GDPR Compliant</span>
                        </div>
                    </>
                )}
            </div>

            {/* Modals & Panels */}
            {selectedTask && (
                <TaskDetailPanel
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onNavigateToClient={onNavigateToClient}
                />
            )}
            {showCreateModal && (
                <CreateTaskModal
                    onClose={() => setShowCreateModal(false)}
                    onAdd={async (taskData, selectedClientId) => {
                        if (selectedClientId) {
                            await addTask(selectedClientId, taskData);
                        }
                        setShowCreateModal(false);
                    }}
                />
            )}
        </div>
    );
}