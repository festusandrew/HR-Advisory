import { useState } from "react";
import {
    ArrowLeft,
    Building2,
    Users,
    Briefcase,
    Shield,
    FileText,
    CheckSquare,
    MessageSquare,
    StickyNote,
    TrendingUp,
    DollarSign,
    Clock,
    AlertTriangle,
    Edit,
    UserPlus,
    Plus,
    Upload,
    Download,
    Archive,
    MapPin,
    Phone,
    Mail,
    Globe,
    Calendar,
    MoreHorizontal,
    ChevronRight,
    ExternalLink,
    CircleDot,
    Star,
    BarChart3,
    Settings,
} from "lucide-react";
import type { Client } from "./mock-data";
import type { Document as DocType } from "./mock-data";
import {
    CreateTaskModal,
    UploadDocumentModal,
    AssignAdvisorModal,
    AddContactModal,
    AddServiceModal,
    DocumentDetailModal,
    LogInteractionModal,
} from "./ClientProfileModals";

interface ClientProfileProps {
    client: Client;
    onBack: () => void;
}

type TabKey =
    | "overview"
    | "contacts"
    | "engagement"
    | "services"
    | "compliance"
    | "documents"
    | "tasks"
    | "communications"
    | "notes"
    | "performance"
    | "billing"
    | "timeline";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: Building2 },
    { key: "contacts", label: "Contacts", icon: Users },
    { key: "engagement", label: "Engagement", icon: Briefcase },
    { key: "services", label: "Services", icon: Settings },
    { key: "compliance", label: "Compliance", icon: Shield },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "tasks", label: "Tasks", icon: CheckSquare },
    { key: "communications", label: "Comms", icon: MessageSquare },
    { key: "notes", label: "Notes", icon: StickyNote },
    { key: "performance", label: "Performance", icon: TrendingUp },
    { key: "billing", label: "Billing", icon: DollarSign },
    { key: "timeline", label: "Timeline", icon: Clock },
];

function InfoRow({ label, value }: { label: string; value: string | number | React.ReactNode }) {
    return (
        <div className="flex items-start py-2.5 border-b border-[#F3F4F6] last:border-0">
            <span className="text-[12px] text-[#6B7280] font-[500] w-44 min-w-44">{label}</span>
            <span className="text-[13px] text-foreground font-[500] flex-1">{value}</span>
        </div>
    );
}

function SectionCard({ title, icon: Icon, children, action }: { title: string; icon: React.ElementType; children: React.ReactNode; action?: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3F4F6]">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="text-[14px] font-[700] text-foreground">{title}</h3>
                </div>
                {action}
            </div>
            <div className="px-5 py-4">{children}</div>
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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-[600] border ${colors[level] || ""}`}>
            {level}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        "On Hold": "bg-amber-50 text-amber-700 border-amber-200",
        Completed: "bg-blue-50 text-blue-700 border-blue-200",
        Good: "bg-emerald-50 text-emerald-700 border-emerald-200",
        "Attention Needed": "bg-amber-50 text-amber-700 border-amber-200",
        Open: "bg-blue-50 text-blue-700 border-blue-200",
        "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
        Overdue: "bg-red-50 text-red-700 border-red-200",
        Planned: "bg-gray-50 text-gray-600 border-gray-200",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-[600] border ${colors[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
            {status}
        </span>
    );
}

function PriorityBadge({ priority }: { priority: string }) {
    const colors: Record<string, string> = {
        High: "text-red-600",
        Medium: "text-amber-600",
        Low: "text-emerald-600",
    };
    return <span className={`text-[11px] font-[600] ${colors[priority] || ""}`}>{priority}</span>;
}

function ScoreBar({ score, color }: { score: number; color: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
            </div>
            <span className="text-[13px] font-[700] text-foreground w-10 text-right">{score}%</span>
        </div>
    );
}

export function ClientProfile({ client, onBack }: ClientProfileProps) {
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [showUploadDoc, setShowUploadDoc] = useState(false);
    const [showAssignAdvisor, setShowAssignAdvisor] = useState(false);
    const [showAddContact, setShowAddContact] = useState(false);
    const [showAddService, setShowAddService] = useState(false);
    const [showLogInteraction, setShowLogInteraction] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<DocType | null>(null);

    const openTasks = client.tasks.filter((t) => t.status !== "Completed").length;
    const overdueTasks = client.tasks.filter((t) => t.status === "Overdue").length;

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            {/* Header */}
            <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
                <div className="flex items-center gap-3 mb-3">
                    <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                        <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
                    </button>
                    <span className="text-[12px] text-muted-foreground">Back to Client Directory</span>
                </div>

                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white text-[16px] font-[700]">
                            {client.name
                                .split(" ")
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-[20px] font-[700] text-foreground">{client.name}</h1>
                                <StatusBadge status={client.engagementStatus} />
                                <RiskBadge level={client.riskLevel} />
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-[12px] text-muted-foreground">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {client.location}</span>
                                <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {client.industry}</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {client.companySize} employees</span>
                                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {client.contractType}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] font-[600] text-[#374151] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => setShowAssignAdvisor(true)} className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] font-[600] text-[#374151] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <UserPlus className="w-3.5 h-3.5" /> Assign Advisor
                        </button>
                        <button onClick={() => setShowUploadDoc(true)} className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[12px] font-[600] text-[#374151] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <Upload className="w-3.5 h-3.5" /> Upload
                        </button>
                        <button onClick={() => setShowCreateTask(true)} className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer">
                            <Plus className="w-3.5 h-3.5" /> Create Task
                        </button>
                        <button className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 cursor-pointer">
                            <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                        </button>
                    </div>
                </div>

                {/* Alerts Banner */}
                {client.alerts.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                        {client.alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-[600] ${alert.severity === "Critical"
                                        ? "bg-red-50 text-red-700 border border-red-200"
                                        : alert.severity === "Warning"
                                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                                            : "bg-blue-50 text-blue-700 border border-blue-200"
                                    }`}
                            >
                                <AlertTriangle className="w-3 h-3" />
                                {alert.message}
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex items-center gap-0 mt-4 -mb-4 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[12.5px] font-[600] border-b-2 transition-colors whitespace-nowrap cursor-pointer ${isActive
                                        ? "border-[#4F46E5] text-[#4F46E5]"
                                        : "border-transparent text-[#6B7280] hover:text-foreground hover:border-[#D1D5DB]"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === "overview" && <OverviewTab client={client} openTasks={openTasks} overdueTasks={overdueTasks} />}
                {activeTab === "contacts" && <ContactsTab client={client} onAddContact={() => setShowAddContact(true)} />}
                {activeTab === "engagement" && <EngagementTab client={client} />}
                {activeTab === "services" && <ServicesTab client={client} onAddService={() => setShowAddService(true)} />}
                {activeTab === "compliance" && <ComplianceTab client={client} />}
                {activeTab === "documents" && <DocumentsTab client={client} onUpload={() => setShowUploadDoc(true)} onSelectDoc={setSelectedDoc} />}
                {activeTab === "tasks" && <TasksTab client={client} onCreateTask={() => setShowCreateTask(true)} />}
                {activeTab === "communications" && <CommunicationsTab client={client} onLogInteraction={() => setShowLogInteraction(true)} />}
                {activeTab === "notes" && <NotesTab client={client} />}
                {activeTab === "performance" && <PerformanceTab client={client} />}
                {activeTab === "billing" && <BillingTab client={client} />}
                {activeTab === "timeline" && <TimelineTab client={client} />}
            </div>

            {/* Modals */}
            {showCreateTask && <CreateTaskModal onClose={() => setShowCreateTask(false)} onAdd={() => { }} clientName={client.tradingName} />}
            {showUploadDoc && <UploadDocumentModal onClose={() => setShowUploadDoc(false)} onAdd={() => { }} clientName={client.tradingName} />}
            {showAssignAdvisor && <AssignAdvisorModal onClose={() => setShowAssignAdvisor(false)} onAssign={() => { }} currentAdvisors={client.assignedAdvisors} />}
            {showAddContact && <AddContactModal onClose={() => setShowAddContact(false)} onAdd={() => { }} clientName={client.tradingName} />}
            {showAddService && <AddServiceModal onClose={() => setShowAddService(false)} onAdd={() => { }} clientName={client.tradingName} />}
            {showLogInteraction && <LogInteractionModal onClose={() => setShowLogInteraction(false)} onAdd={() => { }} clientName={client.tradingName} />}
            {selectedDoc && <DocumentDetailModal doc={selectedDoc} clientName={client.tradingName} onClose={() => setSelectedDoc(null)} />}
        </div>
    );
}

/* ==================== OVERVIEW TAB ==================== */
function OverviewTab({ client, openTasks, overdueTasks }: { client: Client; openTasks: number; overdueTasks: number }) {
    return (
        <div className="grid grid-cols-3 gap-5">
            {/* Left Column - Company Info */}
            <div className="col-span-2 space-y-5">
                <SectionCard title="Company Information" icon={Building2}>
                    <div className="grid grid-cols-2 gap-x-8">
                        <div>
                            <InfoRow label="Legal Name" value={client.name} />
                            <InfoRow label="Trading Name" value={client.tradingName} />
                            <InfoRow label="Parent Company" value={client.parentCompany || "—"} />
                            <InfoRow label="Subsidiaries" value={client.subsidiaries.length > 0 ? client.subsidiaries.join(", ") : "None"} />
                            <InfoRow label="Business Structure" value={client.businessStructure} />
                            <InfoRow label="Year Established" value={client.yearEstablished} />
                            <InfoRow label="Market Sector" value={client.marketSector} />
                        </div>
                        <div>
                            <InfoRow label="Industry" value={client.industry} />
                            <InfoRow label="Headcount" value={`${client.companySize} (${client.companySizeLabel})`} />
                            <InfoRow label="Multi-site" value={client.multiSite ? "Yes" : "No"} />
                            <InfoRow label="Unionised" value={client.unionised} />
                            <InfoRow label="Registration No." value={client.registrationNumber} />
                            <InfoRow label="Jurisdiction" value={client.jurisdiction} />
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Locations & Addresses" icon={MapPin}>
                    <InfoRow label="Registered Office" value={client.registeredAddress} />
                    <InfoRow label="Head Office" value={client.headOfficeAddress} />
                    <InfoRow label="Primary Location" value={client.primaryLocation} />
                    <InfoRow label="Branch Locations" value={client.branchLocations.length > 0 ? client.branchLocations.join(" | ") : "None"} />
                </SectionCard>

                <SectionCard title="Business Profile" icon={Globe}>
                    <p className="text-[13px] text-[#4B5563] leading-relaxed">{client.businessDescription}</p>
                </SectionCard>

                <SectionCard title="Registration & Legal Identifiers" icon={FileText}>
                    <div className="grid grid-cols-2 gap-x-8">
                        <div>
                            <InfoRow label="Registration Number" value={client.registrationNumber} />
                            <InfoRow label="Tax ID" value={client.taxId} />
                            <InfoRow label="VAT / GST" value={client.vatNumber} />
                        </div>
                        <div>
                            <InfoRow label="Incorporation No." value={client.incorporationNumber} />
                            <InfoRow label="Jurisdiction" value={client.jurisdiction} />
                            <InfoRow label="Incorporation Date" value={client.incorporationDate} />
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* Right Column - Quick Info */}
            <div className="space-y-5">
                {/* Risk & Governance */}
                <SectionCard title="Risk & Governance" icon={Shield}>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#6B7280]">Risk Level</span>
                            <RiskBadge level={client.riskLevel} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#6B7280]">Risk Category</span>
                            <span className="text-[12px] font-[600] text-foreground">{client.riskCategory}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#6B7280]">Compliance Status</span>
                            <StatusBadge status={client.complianceStatus} />
                        </div>
                        <div>
                            <span className="text-[12px] text-[#6B7280] block mb-1.5">Audit Readiness</span>
                            <ScoreBar score={client.auditReadinessScore} color={client.auditReadinessScore >= 80 ? "bg-emerald-500" : client.auditReadinessScore >= 60 ? "bg-amber-500" : "bg-red-500"} />
                        </div>
                    </div>
                </SectionCard>

                {/* Contract & Reviews */}
                <SectionCard title="Contract & Reviews" icon={FileText}>
                    <InfoRow label="Contract Type" value={client.contractType} />
                    <InfoRow label="Contract Value" value={client.contractValue} />
                    <InfoRow label="Renewal Date" value={client.renewalDate || "—"} />
                    <InfoRow label="Next Review" value={client.nextReviewDate || "—"} />
                </SectionCard>

                {/* Activity Signals */}
                <SectionCard title="Activity Signals" icon={Clock}>
                    <InfoRow label="Last Activity" value={`${client.lastActivityDate} at ${new Date(client.lastActivityTimestamp).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false })} IST`} />
                    <InfoRow label="Open Tasks" value={<span className={openTasks > 0 ? "font-[700] text-[#4F46E5]" : ""}>{openTasks}</span>} />
                    <InfoRow label="Overdue Items" value={
                        overdueTasks > 0 ? (
                            <span className="inline-flex items-center gap-1 text-red-600 font-[700]">
                                <AlertTriangle className="w-3 h-3" /> {overdueTasks}
                            </span>
                        ) : (
                            <span className="text-emerald-600 font-[600]">None</span>
                        )
                    } />
                </SectionCard>

                {/* Relationship Health */}
                <SectionCard title="Relationship Health" icon={TrendingUp}>
                    <div className="space-y-3">
                        <div>
                            <span className="text-[12px] text-[#6B7280] block mb-1.5">Health Score</span>
                            <ScoreBar score={client.clientHealthScore} color={client.clientHealthScore >= 80 ? "bg-emerald-500" : client.clientHealthScore >= 60 ? "bg-amber-500" : "bg-red-500"} />
                        </div>
                        <div>
                            <span className="text-[12px] text-[#6B7280] block mb-1.5">Satisfaction</span>
                            <ScoreBar score={client.satisfactionScore} color={client.satisfactionScore >= 80 ? "bg-emerald-500" : client.satisfactionScore >= 60 ? "bg-amber-500" : "bg-red-500"} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#6B7280]">NPS Rating</span>
                            <span className="text-[14px] font-[700] text-foreground">{client.npsRating}/10</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#6B7280]">Renewal Likelihood</span>
                            <span className={`text-[12px] font-[600] ${client.renewalLikelihood === "Very Likely" ? "text-emerald-600" : client.renewalLikelihood === "Likely" ? "text-blue-600" : "text-amber-600"}`}>
                                {client.renewalLikelihood}
                            </span>
                        </div>
                    </div>
                </SectionCard>

                {/* Assigned Advisors */}
                <SectionCard title="Assigned Advisors" icon={Users}>
                    <div className="space-y-2.5">
                        {client.assignedAdvisors.map((advisor, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[11px] font-[700] text-[#4F46E5]">
                                    {advisor.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div>
                                    <p className="text-[13px] font-[600] text-foreground">{advisor}</p>
                                    <p className="text-[11px] text-muted-foreground">HR Advisor</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}

/* ==================== CONTACTS TAB ==================== */
function ContactsTab({ client, onAddContact }: { client: Client; onAddContact: () => void }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-[16px] font-[700] text-foreground">Authorised Contacts ({client.contacts.length})</h2>
                <button onClick={onAddContact} className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Add Contact
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {client.contacts.map((contact) => (
                    <div key={contact.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[12px] font-[700] text-[#4F46E5]">
                                    {contact.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div>
                                    <p className="text-[14px] font-[700] text-foreground">{contact.name}</p>
                                    <p className="text-[12px] text-muted-foreground">{contact.jobTitle}</p>
                                </div>
                            </div>
                            <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                                <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                            </button>
                        </div>
                        <div className="space-y-2 text-[12px]">
                            <div className="flex items-center gap-2 text-[#4B5563]">
                                <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                <a href={`mailto:${contact.email}`} className="hover:text-[#4F46E5] hover:underline">{contact.email}</a>
                            </div>
                            <div className="flex items-center gap-2 text-[#4B5563]">
                                <Phone className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                {contact.phone}
                            </div>
                            <div className="flex items-center gap-2 text-[#4B5563]">
                                <MessageSquare className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                Preferred: {contact.preferredContact}
                            </div>
                            <div className="flex items-center gap-2 text-[#4B5563]">
                                <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                {contact.availabilityNotes}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ==================== ENGAGEMENT TAB ==================== */
function EngagementTab({ client }: { client: Client }) {
    return (
        <div className="grid grid-cols-2 gap-5">
            <SectionCard title="Engagement Details" icon={Briefcase}>
                <InfoRow label="Engagement Type" value={client.engagementType} />
                <InfoRow label="Start Date" value={client.engagementStartDate} />
                <InfoRow label="End Date" value={client.engagementEndDate} />
                <InfoRow label="Service Scope" value={client.serviceScope} />
                <InfoRow label="SLA Details" value={client.slaDetails} />
                <InfoRow label="Escalation Path" value={client.escalationPath} />
                <InfoRow label="Contract Value" value={client.contractValue} />
            </SectionCard>

            <div className="space-y-5">
                <SectionCard title="Assigned Advisors" icon={Users}>
                    <div className="space-y-3">
                        {client.assignedAdvisors.map((advisor, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F9FAFB]">
                                <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[11px] font-[700] text-[#4F46E5]">
                                    {advisor.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div>
                                    <p className="text-[13px] font-[600] text-foreground">{advisor}</p>
                                    <p className="text-[11px] text-muted-foreground">Senior HR Advisor</p>
                                </div>
                                <button className="ml-auto p-1 rounded hover:bg-gray-100 cursor-pointer">
                                    <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF]" />
                                </button>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard title="Contract Summary" icon={FileText}>
                    <InfoRow label="Contract Type" value={client.contractType} />
                    <InfoRow label="Contract Value" value={client.contractValue} />
                    <InfoRow label="Billing Model" value={client.billingModel} />
                    <InfoRow label="Renewal Date" value={client.renewalDate || "—"} />
                </SectionCard>
            </div>
        </div>
    );
}

/* ==================== SERVICES TAB ==================== */
function ServicesTab({ client, onAddService }: { client: Client; onAddService: () => void }) {
    const activeServices = client.services.filter((s) => s.status === "Active");
    const completedServices = client.services.filter((s) => s.status === "Completed");
    const plannedServices = client.services.filter((s) => s.status === "Planned");

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-[700] text-foreground">Services & Workstreams</h2>
                <button onClick={onAddService} className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Add Service
                </button>
            </div>

            {activeServices.length > 0 && (
                <SectionCard title={`Active Services (${activeServices.length})`} icon={CircleDot}>
                    <div className="space-y-0">
                        {activeServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between py-3 border-b border-[#F3F4F6] last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <div>
                                        <p className="text-[13px] font-[600] text-foreground">{service.name}</p>
                                        <p className="text-[11px] text-muted-foreground">{service.timeline} &middot; Dependencies: {service.dependencies}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PriorityBadge priority={service.priority} />
                                    <StatusBadge status={service.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            {plannedServices.length > 0 && (
                <SectionCard title={`Planned Services (${plannedServices.length})`} icon={Calendar}>
                    <div className="space-y-0">
                        {plannedServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between py-3 border-b border-[#F3F4F6] last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                    <div>
                                        <p className="text-[13px] font-[600] text-foreground">{service.name}</p>
                                        <p className="text-[11px] text-muted-foreground">{service.timeline} &middot; Dependencies: {service.dependencies}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PriorityBadge priority={service.priority} />
                                    <StatusBadge status={service.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            {completedServices.length > 0 && (
                <SectionCard title={`Completed Services (${completedServices.length})`} icon={CheckSquare}>
                    <div className="space-y-0">
                        {completedServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between py-3 border-b border-[#F3F4F6] last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="text-[13px] font-[600] text-foreground line-through opacity-60">{service.name}</p>
                                        <p className="text-[11px] text-muted-foreground">{service.timeline}</p>
                                    </div>
                                </div>
                                <StatusBadge status={service.status} />
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}
        </div>
    );
}

/* ==================== COMPLIANCE TAB ==================== */
function ComplianceTab({ client }: { client: Client }) {
    return (
        <div className="grid grid-cols-2 gap-5">
            <div className="space-y-5">
                <SectionCard title="Compliance Status Summary" icon={Shield}>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] text-[#6B7280]">Overall Status</span>
                            <StatusBadge status={client.complianceStatus} />
                        </div>
                        <div>
                            <span className="text-[12px] text-[#6B7280] block mb-1.5">Audit Readiness Score</span>
                            <ScoreBar score={client.auditReadinessScore} color={client.auditReadinessScore >= 80 ? "bg-emerald-500" : client.auditReadinessScore >= 60 ? "bg-amber-500" : "bg-red-500"} />
                        </div>
                        <InfoRow label="Review Schedule" value={client.complianceReviewSchedule} />
                        <InfoRow label="Incident History" value={`${client.incidentHistory} incident${client.incidentHistory !== 1 ? "s" : ""}`} />
                    </div>
                </SectionCard>

                <SectionCard title="Regulatory Obligations" icon={FileText}>
                    <div className="space-y-2">
                        {client.regulatoryObligations.map((obligation, i) => (
                            <div key={i} className="flex items-center gap-2 py-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                                <span className="text-[13px] text-[#4B5563]">{obligation}</span>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>

            <div className="space-y-5">
                <SectionCard title="Open Compliance Gaps" icon={AlertTriangle}>
                    {client.complianceGaps.length > 0 ? (
                        <div className="space-y-2">
                            {client.complianceGaps.map((gap, i) => (
                                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5" />
                                    <span className="text-[12px] text-amber-800 font-[500]">{gap}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                            <p className="text-[13px] text-emerald-600 font-[600]">No compliance gaps</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">All areas compliant</p>
                        </div>
                    )}
                </SectionCard>

                <SectionCard title="Risk Assessment" icon={BarChart3}>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#6B7280]">Risk Level</span>
                            <RiskBadge level={client.riskLevel} />
                        </div>
                        <InfoRow label="Risk Category" value={client.riskCategory} />
                        <InfoRow label="Incidents (Total)" value={client.incidentHistory} />
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}

/* ==================== DOCUMENTS TAB ==================== */
function DocumentsTab({ client, onUpload, onSelectDoc }: { client: Client; onUpload: () => void; onSelectDoc: (doc: DocType) => void }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-[700] text-foreground">Documents & Records ({client.documents.length})</h2>
                <button onClick={onUpload} className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Document
                </button>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#F3F4F6]">
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Version</th>
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Uploaded</th>
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Expiry</th>
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">By</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {client.documents.map((doc) => (
                            <tr key={doc.id} className="border-b border-[#F9FAFB] hover:bg-[#F9FAFB] cursor-pointer transition-colors" onClick={() => onSelectDoc(doc)}>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-[#4F46E5]" />
                                        <span className="text-[13px] font-[600] text-foreground">{doc.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-[12px] text-[#4B5563]">{doc.type}</td>
                                <td className="px-4 py-3 text-[12px] text-[#4B5563]">v{doc.version}</td>
                                <td className="px-4 py-3 text-[12px] text-[#4B5563]">{doc.uploadDate} <span className="text-[10px] text-muted-foreground">{new Date(doc.uploadTimestamp).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false })}</span></td>
                                <td className="px-4 py-3 text-[12px] text-[#4B5563]">{doc.expiryDate || "—"}</td>
                                <td className="px-4 py-3 text-[12px] text-[#4B5563]">{doc.uploadedBy}</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                                        <Download className="w-4 h-4 text-[#9CA3AF]" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ==================== TASKS TAB ==================== */
function TasksTab({ client, onCreateTask }: { client: Client; onCreateTask: () => void }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-[700] text-foreground">Tasks & Action Items ({client.tasks.length})</h2>
                <button onClick={onCreateTask} className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Create Task
                </button>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 text-center">
                    <p className="text-[20px] font-[700] text-foreground">{client.tasks.length}</p>
                    <p className="text-[11px] text-muted-foreground font-[500]">Total Tasks</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 text-center">
                    <p className="text-[20px] font-[700] text-blue-600">{client.tasks.filter((t) => t.status === "Open").length}</p>
                    <p className="text-[11px] text-muted-foreground font-[500]">Open</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 text-center">
                    <p className="text-[20px] font-[700] text-indigo-600">{client.tasks.filter((t) => t.status === "In Progress").length}</p>
                    <p className="text-[11px] text-muted-foreground font-[500]">In Progress</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 text-center">
                    <p className="text-[20px] font-[700] text-red-600">{client.tasks.filter((t) => t.status === "Overdue").length}</p>
                    <p className="text-[11px] text-muted-foreground font-[500]">Overdue</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#F3F4F6]">
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Task</th>
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Assigned To</th>
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Priority</th>
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Due Date</th>
                            <th className="px-4 py-3 text-left text-[11px] font-[700] text-[#6B7280] uppercase tracking-wider">Created</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {client.tasks.map((task) => (
                            <tr key={task.id} className="border-b border-[#F9FAFB] hover:bg-[#F9FAFB]">
                                <td className="px-4 py-3">
                                    <span className="text-[13px] font-[600] text-foreground">{task.title}</span>
                                    {task.regulatoryRef && task.regulatoryRef !== "N/A" && (
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{task.regulatoryRef}</p>
                                    )}
                                </td>
                                <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                                <td className="px-4 py-3 text-[12px] text-[#4B5563]">{task.assignedTo}</td>
                                <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                                <td className="px-4 py-3 text-[12px] text-[#4B5563]">{task.dueDate}</td>
                                <td className="px-4 py-3 text-[12px] text-[#4B5563]">{task.createdDate} <span className="text-[10px] text-muted-foreground">{new Date(task.createdTimestamp).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false })}</span></td>
                                <td className="px-4 py-3 text-right">
                                    <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                                        <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {client.tasks.length === 0 && (
                    <div className="py-10 text-center text-[13px] text-muted-foreground">No tasks assigned to this client.</div>
                )}
            </div>
        </div>
    );
}

/* ==================== COMMUNICATIONS TAB ==================== */
function CommunicationsTab({ client, onLogInteraction }: { client: Client; onLogInteraction: () => void }) {
    const typeIcons: Record<string, React.ElementType> = {
        Email: Mail,
        Meeting: Users,
        Call: Phone,
        "Advisory Update": FileText,
        "Client Request": MessageSquare,
    };

    const typeColors: Record<string, string> = {
        Email: "bg-blue-50 text-blue-600",
        Meeting: "bg-purple-50 text-purple-600",
        Call: "bg-emerald-50 text-emerald-600",
        "Advisory Update": "bg-amber-50 text-amber-600",
        "Client Request": "bg-pink-50 text-pink-600",
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-[700] text-foreground">Communication Log ({client.communications.length})</h2>
                <button onClick={onLogInteraction} className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Log Interaction
                </button>
            </div>

            <div className="space-y-3">
                {client.communications.map((comm) => {
                    const Icon = typeIcons[comm.type] || MessageSquare;
                    const colorClass = typeColors[comm.type] || "bg-gray-50 text-gray-600";
                    return (
                        <div key={comm.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[11px] font-[600] px-2 py-0.5 rounded-full ${colorClass}`}>{comm.type}</span>
                                            <span className="text-[11px] text-muted-foreground">{comm.date} at {new Date(comm.timestamp).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false })} IST</span>
                                            {comm.hasAttachment && (
                                                <span className="text-[10px] text-[#6B7280] bg-[#F3F4F6] px-1.5 py-0.5 rounded font-[500]">Attachment</span>
                                            )}
                                        </div>
                                        <p className="text-[13px] font-[600] text-foreground mt-1">{comm.subject}</p>
                                        <p className="text-[12px] text-[#4B5563] mt-1">{comm.summary}</p>
                                        <p className="text-[11px] text-muted-foreground mt-1.5">Participants: {comm.participants}</p>
                                    </div>
                                </div>
                                <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                                    <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ==================== NOTES TAB ==================== */
function NotesTab({ client }: { client: Client }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-[700] text-foreground">Notes & Internal Commentary</h2>
                <button className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Add Note
                </button>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                <div className="mb-4">
                    <textarea
                        className="w-full h-24 px-3 py-2 text-[13px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]/40"
                        placeholder="Add a new note..."
                    />
                    <div className="flex justify-end mt-2">
                        <button className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">
                            Save Note
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {client.notes.map((note, i) => (
                    <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                        <div className="flex items-start gap-3">
                            <StickyNote className="w-4 h-4 text-amber-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-[13px] text-[#4B5563] leading-relaxed">{note}</p>
                                <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                                    <span>Added by Aoife Brennan</span>
                                    <span>&middot;</span>
                                    <span>Internal Only</span>
                                </div>
                            </div>
                            <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                                <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ==================== PERFORMANCE TAB ==================== */
function PerformanceTab({ client }: { client: Client }) {
    return (
        <div className="grid grid-cols-2 gap-5">
            <SectionCard title="Client Satisfaction" icon={Star}>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[12px] text-[#6B7280]">Satisfaction Score</span>
                            <span className="text-[20px] font-[700] text-foreground">{client.satisfactionScore}%</span>
                        </div>
                        <ScoreBar score={client.satisfactionScore} color={client.satisfactionScore >= 80 ? "bg-emerald-500" : client.satisfactionScore >= 60 ? "bg-amber-500" : "bg-red-500"} />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[12px] text-[#6B7280]">NPS Rating</span>
                            <span className="text-[20px] font-[700] text-foreground">{client.npsRating}/10</span>
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 h-3 rounded-sm ${i < client.npsRating ? (client.npsRating >= 9 ? "bg-emerald-500" : client.npsRating >= 7 ? "bg-blue-500" : client.npsRating >= 5 ? "bg-amber-500" : "bg-red-500") : "bg-[#F3F4F6]"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Engagement Health" icon={TrendingUp}>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[12px] text-[#6B7280]">Health Score</span>
                            <span className="text-[20px] font-[700] text-foreground">{client.clientHealthScore}%</span>
                        </div>
                        <ScoreBar score={client.clientHealthScore} color={client.clientHealthScore >= 80 ? "bg-emerald-500" : client.clientHealthScore >= 60 ? "bg-amber-500" : "bg-red-500"} />
                    </div>
                    <div className="flex items-center justify-between py-2.5 border-t border-[#F3F4F6]">
                        <span className="text-[12px] text-[#6B7280]">Renewal Likelihood</span>
                        <span className={`text-[13px] font-[700] ${client.renewalLikelihood === "Very Likely" ? "text-emerald-600" : client.renewalLikelihood === "Likely" ? "text-blue-600" : "text-amber-600"}`}>
                            {client.renewalLikelihood}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 border-t border-[#F3F4F6]">
                        <span className="text-[12px] text-[#6B7280]">Feedback Status</span>
                        <span className="text-[12px] font-[600] text-emerald-600">Active</span>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}

/* ==================== BILLING TAB ==================== */
function BillingTab({ client }: { client: Client }) {
    return (
        <div className="grid grid-cols-2 gap-5">
            <SectionCard title="Billing & Commercials" icon={DollarSign}>
                <InfoRow label="Contract Value" value={client.contractValue} />
                <InfoRow label="Billing Model" value={client.billingModel} />
                <InfoRow label="Outstanding Payments" value={
                    <span className={client.outstandingPayments !== "$0.00" ? "text-red-600 font-[700]" : "text-emerald-600 font-[600]"}>
                        {client.outstandingPayments}
                    </span>
                } />
                <InfoRow label="Renewal Date" value={client.renewalDate || "—"} />
            </SectionCard>

            <SectionCard title="Invoice History" icon={FileText}>
                <div className="space-y-2">
                    <div className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6]">
                        <div>
                            <p className="text-[13px] font-[600] text-foreground">INV-2026-001</p>
                            <p className="text-[11px] text-muted-foreground">January 2026</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[13px] font-[600] text-foreground">{client.contractType === "Retainer" ? "$12,083.33" : "$15,500.00"}</p>
                            <span className="text-[10px] font-[600] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Paid</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6]">
                        <div>
                            <p className="text-[13px] font-[600] text-foreground">INV-2026-002</p>
                            <p className="text-[11px] text-muted-foreground">February 2026</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[13px] font-[600] text-foreground">{client.contractType === "Retainer" ? "$12,083.33" : "$15,500.00"}</p>
                            <span className={`text-[10px] font-[600] px-1.5 py-0.5 rounded-full ${client.outstandingPayments !== "$0.00" ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"}`}>
                                {client.outstandingPayments !== "$0.00" ? "Pending" : "Paid"}
                            </span>
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Upsell Opportunities" icon={TrendingUp}>
                <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-[#F0EFFE] border border-[#DDD6FE]">
                        <p className="text-[13px] font-[600] text-[#4F46E5]">Workforce Planning Module</p>
                        <p className="text-[11px] text-[#6B7280] mt-0.5">Client expressed interest in strategic workforce planning</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#F0EFFE] border border-[#DDD6FE]">
                        <p className="text-[13px] font-[600] text-[#4F46E5]">Training & Development</p>
                        <p className="text-[11px] text-[#6B7280] mt-0.5">Potential for leadership development program</p>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}

/* ==================== TIMELINE TAB ==================== */
function TimelineTab({ client }: { client: Client }) {
    const [filter, setFilter] = useState<string>("All");
    const filterOptions = ["All", "Documents", "Tasks", "Meetings", "Compliance", "Communications"];

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

    const filteredTimeline = filter === "All"
        ? client.timeline
        : client.timeline.filter((e) => e.type === filter.slice(0, -1));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-[700] text-foreground">Activity Timeline</h2>
                <div className="flex items-center gap-1.5">
                    {filterOptions.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-[600] cursor-pointer transition-colors ${filter === opt ? "bg-[#4F46E5] text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#E5E7EB]" />
                <div className="space-y-0">
                    {filteredTimeline.map((event) => {
                        const Icon = typeIcons[event.type] || CircleDot;
                        const colorClass = typeColors[event.type] || "bg-gray-100 text-gray-600";
                        return (
                            <div key={event.id} className="relative pl-12 pb-6">
                                <div className={`absolute left-2 top-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center ${colorClass}`}>
                                    <Icon className="w-3 h-3" />
                                </div>
                                <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[13px] font-[600] text-foreground">{event.title}</p>
                                            <p className="text-[12px] text-[#4B5563] mt-0.5">{event.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] text-muted-foreground">{event.date}</p>
                                            <p className="text-[10px] text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false })} IST &middot; {event.user}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {filteredTimeline.length === 0 && (
                    <div className="pl-12 py-10 text-center text-[13px] text-muted-foreground">
                        No activity found for this filter.
                    </div>
                )}
            </div>
        </div>
    );
}