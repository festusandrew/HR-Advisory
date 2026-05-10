import { useState } from "react";
import {
    Users,
    UserPlus,
    Briefcase,
    AlertTriangle,
    Clock,
    Search,
    Filter,
    LayoutGrid,
    List,
    ChevronDown,
    MoreHorizontal,
    ArrowUpDown,
    Download,
    Mail,
    UserCheck,
    Archive,
    CheckSquare,
    X,
} from "lucide-react";
import { mockClients, advisors, industries, locations, Client } from "./mock-data";
import { AddClientModal } from "./ClientProfileModals";

interface ClientDirectoryProps {
    onSelectClient: (client: Client) => void;
    searchValue: string;
}

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
    change,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    change?: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="flex-1">
                <p className="text-[12px] text-[#6B7280] font-[500]">{title}</p>
                <p className="text-[22px] font-[700] text-foreground mt-0.5">{value}</p>
                {change && (
                    <p className="text-[11px] text-emerald-600 font-[500] mt-0.5">
                        <span className="text-emerald-500">&#9650;</span> {change}
                    </p>
                )}
            </div>
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
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-[600] border ${colors[level] || ""}`}>
            {level}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        "On Hold": "bg-amber-50 text-amber-700 border-amber-200",
        Completed: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-[600] border ${colors[status] || ""}`}>
            {status}
        </span>
    );
}

export function ClientDirectory({ onSelectClient, searchValue }: ClientDirectoryProps) {
    const [viewMode, setViewMode] = useState<"table" | "card">("table");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedClients, setSelectedClients] = useState<string[]>([]);
    const [showAddClient, setShowAddClient] = useState(false);
    const [filters, setFilters] = useState({
        industry: "",
        engagementStatus: "",
        riskLevel: "",
        assignedAdvisor: "",
        location: "",
        contractType: "",
    });
    const [sortField, setSortField] = useState<string>("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const filteredClients = mockClients.filter((c) => {
        if (searchValue && !c.name.toLowerCase().includes(searchValue.toLowerCase()) && !c.industry.toLowerCase().includes(searchValue.toLowerCase())) return false;
        if (filters.industry && c.industry !== filters.industry) return false;
        if (filters.engagementStatus && c.engagementStatus !== filters.engagementStatus) return false;
        if (filters.riskLevel && c.riskLevel !== filters.riskLevel) return false;
        if (filters.assignedAdvisor && !c.assignedAdvisors.includes(filters.assignedAdvisor)) return false;
        if (filters.location && c.location !== filters.location) return false;
        if (filters.contractType && c.contractType !== filters.contractType) return false;
        return true;
    });

    const sortedClients = [...filteredClients].sort((a, b) => {
        let valA: string | number = "";
        let valB: string | number = "";
        switch (sortField) {
            case "name": valA = a.name; valB = b.name; break;
            case "industry": valA = a.industry; valB = b.industry; break;
            case "companySize": valA = a.companySize; valB = b.companySize; break;
            case "riskLevel": { const order = { Low: 0, Medium: 1, High: 2 }; valA = order[a.riskLevel]; valB = order[b.riskLevel]; break; }
            case "lastActivityDate": valA = a.lastActivityDate; valB = b.lastActivityDate; break;
            default: valA = a.name; valB = b.name;
        }
        if (typeof valA === "string") return sortDir === "asc" ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
        return sortDir === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    const toggleSort = (field: string) => {
        if (sortField === field) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    const toggleSelectAll = () => {
        if (selectedClients.length === sortedClients.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(sortedClients.map((c) => c.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedClients((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    };

    const activeCount = mockClients.filter((c) => c.engagementStatus === "Active").length;
    const newThisMonth = 2;
    const complianceRisks = mockClients.filter((c) => c.complianceStatus === "Attention Needed").length;
    const overdueActions = mockClients.reduce((sum, c) => sum + c.tasks.filter((t) => t.status === "Overdue").length, 0);

    const clearFilters = () => {
        setFilters({ industry: "", engagementStatus: "", riskLevel: "", assignedAdvisor: "", location: "", contractType: "" });
    };

    const hasActiveFilters = Object.values(filters).some((v) => v !== "");

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-[22px] font-[700] text-foreground flex items-center gap-2">
                            Client Directory
                            <span className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center">
                                <CheckSquare className="w-3 h-3 text-white" />
                            </span>
                        </h1>
                        <p className="text-[13px] text-muted-foreground mt-0.5">Manage all client organizations receiving HR advisory services</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-[600] text-[#374151] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button
                            onClick={() => setShowAddClient(true)}
                            className="px-3 py-2 rounded-lg bg-[#4F46E5] text-white text-[13px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Client
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                    <StatCard title="Total Active Clients" value={activeCount} icon={Users} color="text-[#4F46E5]" bgColor="bg-[#EEF2FF]" />
                    <StatCard title="New This Month" value={newThisMonth} icon={UserPlus} color="text-emerald-600" bgColor="bg-emerald-50" change="2 new clients" />
                    <StatCard title="Under Engagement" value={activeCount} icon={Briefcase} color="text-blue-600" bgColor="bg-blue-50" />
                    <StatCard title="Compliance Risks" value={complianceRisks} icon={AlertTriangle} color="text-amber-600" bgColor="bg-amber-50" />
                    <StatCard title="Overdue Actions" value={overdueActions} icon={Clock} color="text-red-600" bgColor="bg-red-50" />
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] mb-0">
                    <div className="flex items-center justify-between p-4 border-b border-[#F3F4F6]">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search clients..."
                                    className="pl-9 pr-4 py-1.5 text-[13px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]/40"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-3 py-1.5 rounded-lg border text-[13px] font-[600] flex items-center gap-1.5 cursor-pointer transition-colors ${showFilters || hasActiveFilters ? "border-[#4F46E5] text-[#4F46E5] bg-[#EEF2FF]" : "border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
                                    }`}
                            >
                                <Filter className="w-3.5 h-3.5" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="ml-1 w-4 h-4 rounded-full bg-[#4F46E5] text-white text-[10px] flex items-center justify-center">
                                        {Object.values(filters).filter((v) => v !== "").length}
                                    </span>
                                )}
                            </button>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="text-[12px] text-[#4F46E5] font-[600] hover:underline cursor-pointer flex items-center gap-1">
                                    <X className="w-3 h-3" />
                                    Clear all
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedClients.length > 0 && (
                                <div className="flex items-center gap-1.5 mr-3 pr-3 border-r border-[#E5E7EB]">
                                    <span className="text-[12px] text-muted-foreground font-[500]">{selectedClients.length} selected</span>
                                    <button className="p-1.5 rounded hover:bg-gray-50 text-[#6B7280] cursor-pointer" title="Assign Advisor">
                                        <UserCheck className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-gray-50 text-[#6B7280] cursor-pointer" title="Send Communication">
                                        <Mail className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-gray-50 text-[#6B7280] cursor-pointer" title="Export">
                                        <Download className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-gray-50 text-[#6B7280] cursor-pointer" title="Archive">
                                        <Archive className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center bg-[#F3F4F6] rounded-lg p-0.5">
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`p-1.5 rounded-md cursor-pointer ${viewMode === "table" ? "bg-white shadow-sm" : ""}`}
                                >
                                    <List className="w-4 h-4 text-[#6B7280]" />
                                </button>
                                <button
                                    onClick={() => setViewMode("card")}
                                    className={`p-1.5 rounded-md cursor-pointer ${viewMode === "card" ? "bg-white shadow-sm" : ""}`}
                                >
                                    <LayoutGrid className="w-4 h-4 text-[#6B7280]" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters panel */}
                    {showFilters && (
                        <div className="p-4 border-b border-[#F3F4F6] bg-[#FAFBFC] grid grid-cols-6 gap-3">
                            <div>
                                <label className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider mb-1 block">Industry</label>
                                <select
                                    value={filters.industry}
                                    onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                                    className="w-full text-[12px] border border-[#E5E7EB] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                >
                                    <option value="">All</option>
                                    {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider mb-1 block">Status</label>
                                <select
                                    value={filters.engagementStatus}
                                    onChange={(e) => setFilters({ ...filters, engagementStatus: e.target.value })}
                                    className="w-full text-[12px] border border-[#E5E7EB] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                >
                                    <option value="">All</option>
                                    <option value="Active">Active</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider mb-1 block">Risk Level</label>
                                <select
                                    value={filters.riskLevel}
                                    onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                                    className="w-full text-[12px] border border-[#E5E7EB] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                >
                                    <option value="">All</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider mb-1 block">Advisor</label>
                                <select
                                    value={filters.assignedAdvisor}
                                    onChange={(e) => setFilters({ ...filters, assignedAdvisor: e.target.value })}
                                    className="w-full text-[12px] border border-[#E5E7EB] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                >
                                    <option value="">All</option>
                                    {advisors.map((a) => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider mb-1 block">Location</label>
                                <select
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    className="w-full text-[12px] border border-[#E5E7EB] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                >
                                    <option value="">All</option>
                                    {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider mb-1 block">Contract Type</label>
                                <select
                                    value={filters.contractType}
                                    onChange={(e) => setFilters({ ...filters, contractType: e.target.value })}
                                    className="w-full text-[12px] border border-[#E5E7EB] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                >
                                    <option value="">All</option>
                                    <option value="Retainer">Retainer</option>
                                    <option value="Project">Project</option>
                                    <option value="Advisory">Advisory</option>
                                    <option value="Compliance-only">Compliance-only</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Table View */}
                    {viewMode === "table" ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#F3F4F6]">
                                        <th className="pl-4 pr-2 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedClients.length === sortedClients.length && sortedClients.length > 0}
                                                onChange={toggleSelectAll}
                                                className="rounded border-[#D1D5DB] cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-3 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider cursor-pointer" onClick={() => toggleSort("name")}>
                                            <span className="flex items-center gap-1">Client Name <ArrowUpDown className="w-3 h-3" /></span>
                                        </th>
                                        <th className="px-3 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider cursor-pointer" onClick={() => toggleSort("industry")}>
                                            <span className="flex items-center gap-1">Industry <ArrowUpDown className="w-3 h-3" /></span>
                                        </th>
                                        <th className="px-3 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider cursor-pointer" onClick={() => toggleSort("companySize")}>
                                            <span className="flex items-center gap-1">Size <ArrowUpDown className="w-3 h-3" /></span>
                                        </th>
                                        <th className="px-3 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Advisor(s)</th>
                                        <th className="px-3 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider cursor-pointer" onClick={() => toggleSort("riskLevel")}>
                                            <span className="flex items-center gap-1">Risk <ArrowUpDown className="w-3 h-3" /></span>
                                        </th>
                                        <th className="px-3 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Contract</th>
                                        <th className="px-3 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Next Review</th>
                                        <th className="px-3 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider cursor-pointer" onClick={() => toggleSort("lastActivityDate")}>
                                            <span className="flex items-center gap-1">Last Activity <ArrowUpDown className="w-3 h-3" /></span>
                                        </th>
                                        <th className="px-3 py-3 text-right text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedClients.map((client) => (
                                        <tr
                                            key={client.id}
                                            className="border-b border-[#F9FAFB] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                                            onClick={() => onSelectClient(client)}
                                        >
                                            <td className="pl-4 pr-2 py-3" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClients.includes(client.id)}
                                                    onChange={() => toggleSelect(client.id)}
                                                    className="rounded border-[#D1D5DB] cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-3 py-3">
                                                <div>
                                                    <p className="text-[13px] font-[600] text-foreground">{client.name}</p>
                                                    <p className="text-[11px] text-muted-foreground">{client.location}</p>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-[12px] text-[#4B5563]">{client.industry}</td>
                                            <td className="px-3 py-3 text-[12px] text-[#4B5563]">{client.companySize}</td>
                                            <td className="px-3 py-3"><StatusBadge status={client.engagementStatus} /></td>
                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-1">
                                                    {client.assignedAdvisors.map((advisor, i) => (
                                                        <span key={i} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EEF2FF] text-[10px] font-[700] text-[#4F46E5] border-2 border-white" style={{ marginLeft: i > 0 ? -6 : 0 }}>
                                                            {advisor.split(" ").map((n) => n[0]).join("")}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3"><RiskBadge level={client.riskLevel} /></td>
                                            <td className="px-3 py-3 text-[12px] text-[#4B5563]">{client.contractType}</td>
                                            <td className="px-3 py-3 text-[12px] text-[#4B5563]">{client.nextReviewDate || "—"}</td>
                                            <td className="px-3 py-3 text-[12px] text-[#4B5563]">{client.lastActivityDate} <span className="text-[10px] text-muted-foreground">{new Date(client.lastActivityTimestamp).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false })}</span></td>
                                            <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                                <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                                                    <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {sortedClients.length === 0 && (
                                <div className="py-12 text-center text-[14px] text-muted-foreground">
                                    No clients found matching your criteria.
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Card View */
                        <div className="p-4 grid grid-cols-3 gap-4">
                            {sortedClients.map((client) => (
                                <div
                                    key={client.id}
                                    className="border border-[#E5E7EB] rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                                    onClick={() => onSelectClient(client)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-[14px] font-[700] text-foreground">{client.name}</h3>
                                            <p className="text-[12px] text-muted-foreground">{client.industry} &middot; {client.location}</p>
                                        </div>
                                        <RiskBadge level={client.riskLevel} />
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <StatusBadge status={client.engagementStatus} />
                                        <span className="text-[11px] text-muted-foreground">{client.companySize} employees</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                                        <div>
                                            <span className="text-[#9CA3AF]">Contract:</span>
                                            <span className="ml-1 text-[#4B5563] font-[500]">{client.contractType}</span>
                                        </div>
                                        <div>
                                            <span className="text-[#9CA3AF]">Review:</span>
                                            <span className="ml-1 text-[#4B5563] font-[500]">{client.nextReviewDate || "—"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                                        <div className="flex items-center gap-1">
                                            {client.assignedAdvisors.map((advisor, i) => (
                                                <span key={i} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EEF2FF] text-[9px] font-[700] text-[#4F46E5] border-2 border-white" style={{ marginLeft: i > 0 ? -6 : 0 }}>
                                                    {advisor.split(" ").map((n) => n[0]).join("")}
                                                </span>
                                            ))}
                                            <span className="text-[11px] text-muted-foreground ml-1">{client.assignedAdvisors[0]}</span>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground">{client.lastActivityDate}</span>
                                    </div>
                                    {client.alerts.length > 0 && (
                                        <div className="mt-3 pt-2 border-t border-[#F3F4F6]">
                                            <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-[500]">
                                                <AlertTriangle className="w-3 h-3" />
                                                {client.alerts.length} alert{client.alerts.length > 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {sortedClients.length === 0 && (
                                <div className="col-span-3 py-12 text-center text-[14px] text-muted-foreground">
                                    No clients found matching your criteria.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#F3F4F6]">
                        <p className="text-[12px] text-muted-foreground">
                            Showing <span className="font-[600] text-foreground">{sortedClients.length}</span> of{" "}
                            <span className="font-[600] text-foreground">{mockClients.length}</span> clients
                        </p>
                        <div className="flex items-center gap-1">
                            <button className="px-3 py-1 text-[12px] rounded-md border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50 cursor-pointer">Previous</button>
                            <button className="px-3 py-1 text-[12px] rounded-md bg-[#4F46E5] text-white cursor-pointer">1</button>
                            <button className="px-3 py-1 text-[12px] rounded-md border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50 cursor-pointer">Next</button>
                        </div>
                    </div>
                </div>
            </div>
            {showAddClient && <AddClientModal onClose={() => setShowAddClient(false)} onAdd={() => { }} />}
        </div>
    );
}