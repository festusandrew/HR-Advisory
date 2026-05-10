import { useState, useMemo, useCallback } from "react";
import {
    FileText,
    Search,
    Download,
    Upload,
    ChevronDown,
    MoreHorizontal,
    ArrowUpDown,
    X,
    Building2,
    User,
    Tag,
    Clock,
    AlertTriangle,
    Shield,
    Scale,
    Eye,
    Archive,
    ExternalLink,
    File,
    FolderOpen,
    CheckCircle2,
    Lock,
    Info,
    Briefcase,
    ClipboardCheck,
    BookOpen,
    HardHat,
    FileCheck,
    FileLock2,
    FileWarning,
    Layers,
} from "lucide-react";
import type { Client, Document } from "./mock-data";
import { useApi } from "../context/ApiContext";
import { UploadDocumentModal } from "./ClientProfileModals";

/* ===== Constants ===== */
const NOW = new Date("2026-02-06T12:00:00Z");

type DocType =
    | "Contract"
    | "HR Policy"
    | "Audit Report"
    | "GDPR Record"
    | "H&S Report"
    | "Advisory"
    | "Compliance Report"
    | "Legal";

const DOC_TYPE_CONFIG: Record<
    string,
    { icon: React.ElementType; color: string; bg: string; border: string }
> = {
    Contract: { icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    "HR Policy": { icon: BookOpen, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
    "Audit Report": { icon: ClipboardCheck, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
    "GDPR Record": { icon: FileLock2, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
    "H&S Report": { icon: HardHat, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
    Advisory: { icon: FileCheck, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
    "Compliance Report": { icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    Legal: { icon: Scale, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
};

const CONFIDENTIALITY_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
    Public: { color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: Eye },
    Internal: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: Info },
    Confidential: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Lock },
    Restricted: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: Shield },
};

/* ===== Types ===== */
interface EnrichedDocument extends Document {
    clientId: string;
    clientName: string;
    clientTradingName: string;
    clientIndustry: string;
    clientLocation: string;
    clientRiskLevel: string;
}

type TabId = "all" | "contracts" | "policies" | "compliance" | "gdpr" | "hAndS" | "expiring" | "recent";
type SortField = "name" | "type" | "client" | "uploadDate" | "expiryDate" | "uploadedBy" | "version";
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

function getDocTypeConf(type: string) {
    return DOC_TYPE_CONFIG[type] || { icon: FileText, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" };
}

/* ===== Sub-components ===== */
function DocTypeBadge({ type }: { type: string }) {
    const conf = getDocTypeConf(type);
    const Icon = conf.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-[600] border ${conf.bg} ${conf.color} ${conf.border}`}>
            <Icon className="w-3 h-3" />
            {type}
        </span>
    );
}

function ConfidentialityBadge({ level }: { level?: string }) {
    if (!level) return null;
    const conf = CONFIDENTIALITY_CONFIG[level];
    if (!conf) return null;
    const Icon = conf.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-[600] border ${conf.bg} ${conf.color} ${conf.border}`}>
            <Icon className="w-2.5 h-2.5" />
            {level}
        </span>
    );
}

function ExpiryLabel({ expiryDate }: { expiryDate: string | null }) {
    if (!expiryDate) return <span className="text-[11px] text-[#9CA3AF]">—</span>;
    const days = daysUntil(expiryDate);
    if (days < 0)
        return <span className="text-[11px] text-red-600 font-[600]">Expired {Math.abs(days)}d ago</span>;
    if (days <= 30)
        return <span className="text-[11px] text-red-600 font-[600]">Expires in {days}d</span>;
    if (days <= 90)
        return <span className="text-[11px] text-amber-600 font-[500]">Expires in {days}d</span>;
    return <span className="text-[11px] text-[#6B7280] font-[500]">{formatShortDate(expiryDate)}</span>;
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
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#9CA3AF] -ml-2" />
            </div>
        </div>
    );
}



/* ===== Document Preview Modal ===== */
function DocumentPreviewModal({ doc, onClose }: { doc: EnrichedDocument; onClose: () => void }) {
    const conf = getDocTypeConf(doc.type);
    const TypeIcon = conf.icon;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = doc.type === "Contract" ? 12 : doc.type === "HR Policy" ? 8 : doc.type === "Audit Report" ? 15 : doc.type === "GDPR Record" ? 6 : 10;

    const sampleContent: Record<string, string[]> = {
        Contract: [
            "SERVICE AGREEMENT",
            "",
            `This Service Agreement ("Agreement") is entered into as of ${formatDate(doc.uploadDate)} between ${doc.clientName} ("Client") and Peninsula HR Advisory ("Provider").`,
            "",
            "1. SCOPE OF SERVICES",
            "The Provider agrees to deliver the following HR advisory and compliance services to the Client, as outlined in Schedule A attached hereto:",
            "  a) Employment law compliance advisory",
            "  b) Workplace relations support and representation",
            "  c) Health & Safety compliance management",
            "  d) HR policy development and review",
            "  e) GDPR and data protection advisory",
            "",
            "2. TERM AND DURATION",
            "This Agreement shall commence on the Effective Date and continue for a period of twelve (12) months unless terminated earlier in accordance with Section 8.",
            "",
            "3. SERVICE LEVEL AGREEMENT",
            "The Provider shall respond to all Client queries within 4 business hours during standard business hours (09:00-17:30 IST, Monday to Friday).",
            "Critical/urgent matters: 1-hour response time.",
            "Standard advisory requests: 24-hour turnaround.",
        ],
        "HR Policy": [
            "EMPLOYEE HANDBOOK — WORKPLACE POLICIES",
            "",
            `Document Reference: ${doc.clientId}-POL-${doc.id}`,
            `Effective Date: ${formatDate(doc.uploadDate)}`,
            `Version: ${doc.version}`,
            "",
            "1. PURPOSE AND SCOPE",
            "This policy document outlines the organisation's commitment to maintaining a safe, respectful, and legally compliant workplace. It applies to all employees, contractors, and third parties engaged by the organisation.",
            "",
            "2. EQUAL OPPORTUNITIES",
            "The organisation is committed to providing equal opportunities in employment and to avoiding unlawful discrimination, in line with the Employment Equality Acts 1998-2015.",
            "",
            "3. GRIEVANCE PROCEDURE",
            "Employees who have a concern or complaint regarding their employment should raise it through the formal grievance process outlined below:",
            "  Step 1: Informal discussion with line manager",
            "  Step 2: Formal written grievance to HR department",
            "  Step 3: Appeal to senior management panel",
        ],
        "Audit Report": [
            "COMPLIANCE AUDIT REPORT",
            "",
            `Client: ${doc.clientName}`,
            "Audit Period: Q4 2025 - Q1 2026",
            `Auditor: ${doc.uploadedBy}`,
            `Classification: ${doc.confidentiality || "Internal"}`,
            "",
            "EXECUTIVE SUMMARY",
            "This report presents the findings of the scheduled compliance audit conducted across all operational areas. The audit assessed adherence to regulatory obligations including WRC requirements, GDPR compliance, Health & Safety legislation, and internal policy standards.",
            "",
            "KEY FINDINGS",
            "  Overall compliance score: 87% (Good)",
            "  3 minor non-conformances identified",
            "  1 observation requiring attention within 30 days",
            "  Data protection practices rated: Satisfactory",
            "  H&S documentation: Up to date",
            "",
            "RECOMMENDATIONS",
            "1. Update DPIA register to include new processing activities identified in Q4",
            "2. Schedule refresher training on grievance handling procedures",
        ],
    };

    const content = sampleContent[doc.type] || [
        doc.name.toUpperCase(),
        "",
        `Document Reference: ${doc.clientId}-${doc.id}`,
        `Version: ${doc.version}`,
        `Client: ${doc.clientName}`,
        `Prepared by: ${doc.uploadedBy}`,
        `Date: ${formatDate(doc.uploadDate)}`,
        `Classification: ${doc.confidentiality || "Internal"}`,
        "",
        "1. OVERVIEW",
        `This document has been prepared for ${doc.clientTradingName} as part of the ongoing HR advisory engagement. It addresses the requirements and obligations relevant to the ${doc.type.toLowerCase()} category.`,
        "",
        "2. SCOPE",
        "The contents of this document are applicable to all employees, management personnel, and designated officers within the organisation.",
        "",
        "3. KEY PROVISIONS",
        "The following sections outline the principal requirements and recommended actions. Detailed guidance is provided in the appendices.",
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#E5E7EB] bg-[#FAFAFA] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${conf.bg} flex items-center justify-center`}>
                            <TypeIcon className={`w-4 h-4 ${conf.color}`} />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-[700] text-foreground">{doc.name}</h3>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <span>v{doc.version}</span>
                                <span>&middot;</span>
                                <span>{doc.clientTradingName}</span>
                                <span>&middot;</span>
                                <DocTypeBadge type={doc.type} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[11px] font-[600] text-[#4B5563] hover:bg-gray-100 cursor-pointer flex items-center gap-1.5">
                            <Download className="w-3 h-3" /> Download
                        </button>
                        <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center cursor-pointer">
                            <X className="w-4 h-4 text-[#6B7280]" />
                        </button>
                    </div>
                </div>

                {/* Document Body */}
                <div className="flex-1 overflow-hidden flex min-h-0">
                    {/* Sidebar Info */}
                    <div className="w-[220px] bg-[#F9FAFB] border-r border-[#E5E7EB] p-4 space-y-4 flex-shrink-0 overflow-y-auto">
                        <div>
                            <p className="text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Document Info</p>
                            <div className="space-y-2.5">
                                <div><p className="text-[10px] text-muted-foreground">Type</p><p className="text-[11px] font-[600] text-foreground">{doc.type}</p></div>
                                <div><p className="text-[10px] text-muted-foreground">Version</p><p className="text-[11px] font-[600] text-foreground">v{doc.version}</p></div>
                                <div><p className="text-[10px] text-muted-foreground">Uploaded</p><p className="text-[11px] font-[600] text-foreground">{formatDate(doc.uploadDate)}</p></div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground">Uploaded By</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-5 h-5 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[8px] font-[700] text-[#4F46E5]">{doc.uploadedBy.split(" ").map((n) => n[0]).join("")}</div>
                                        <p className="text-[11px] font-[600] text-foreground">{doc.uploadedBy}</p>
                                    </div>
                                </div>
                                {doc.fileSize && <div><p className="text-[10px] text-muted-foreground">File Size</p><p className="text-[11px] font-[600] text-foreground">{doc.fileSize}</p></div>}
                                {doc.expiryDate && <div><p className="text-[10px] text-muted-foreground">Expires</p><p className="text-[11px] font-[600] text-foreground">{formatDate(doc.expiryDate)}</p><ExpiryLabel expiryDate={doc.expiryDate} /></div>}
                                {doc.confidentiality && <div><p className="text-[10px] text-muted-foreground mb-1">Classification</p><ConfidentialityBadge level={doc.confidentiality} /></div>}
                            </div>
                        </div>
                        {doc.regulatoryRef && doc.regulatoryRef !== "N/A" && (
                            <div>
                                <p className="text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Regulatory</p>
                                <div className="flex items-start gap-1.5"><Scale className="w-3 h-3 text-[#6B7280] mt-0.5 flex-shrink-0" /><p className="text-[11px] text-[#4B5563]">{doc.regulatoryRef}</p></div>
                            </div>
                        )}
                        <div>
                            <p className="text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Client</p>
                            <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-[#4F46E5]" /><span className="text-[11px] font-[600] text-[#4F46E5]">{doc.clientTradingName}</span></div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{doc.clientIndustry} &middot; {doc.clientLocation}</p>
                        </div>
                    </div>

                    {/* Document Content Area */}
                    <div className="flex-1 p-8 overflow-y-auto bg-white">
                        <div className="max-w-[540px] mx-auto">
                            <div className="mb-6 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-700 font-[500]">
                                <Eye className="w-3.5 h-3.5" />
                                Preview Mode — This is a simulated preview of the document content
                            </div>
                            <div className="space-y-1">
                                {content.map((line, i) => {
                                    if (line === "") return <div key={i} className="h-4" />;
                                    if (i === 0) return <h2 key={i} className="text-[18px] font-[700] text-foreground tracking-wide mb-2">{line}</h2>;
                                    if (/^\d+\.\s/.test(line) || line === "EXECUTIVE SUMMARY" || line === "KEY FINDINGS" || line === "RECOMMENDATIONS")
                                        return <h3 key={i} className="text-[14px] font-[700] text-foreground mt-4 mb-1">{line}</h3>;
                                    if (line.startsWith("  "))
                                        return <p key={i} className="text-[12px] text-[#4B5563] leading-relaxed pl-6">{line.trim()}</p>;
                                    return <p key={i} className="text-[12px] text-[#4B5563] leading-relaxed">{line}</p>;
                                })}
                            </div>
                            <div className="mt-8 pt-6 border-t border-dashed border-[#D1D5DB]">
                                <div className="space-y-2.5 opacity-40">
                                    <div className="h-3 bg-[#E5E7EB] rounded w-full" />
                                    <div className="h-3 bg-[#E5E7EB] rounded w-[92%]" />
                                    <div className="h-3 bg-[#E5E7EB] rounded w-[85%]" />
                                    <div className="h-3 bg-[#E5E7EB] rounded w-full" />
                                    <div className="h-3 bg-[#E5E7EB] rounded w-[78%]" />
                                    <div className="h-6" />
                                    <div className="h-3 bg-[#E5E7EB] rounded w-[60%]" />
                                    <div className="h-3 bg-[#E5E7EB] rounded w-full" />
                                    <div className="h-3 bg-[#E5E7EB] rounded w-[88%]" />
                                    <div className="h-3 bg-[#E5E7EB] rounded w-[95%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-[#E5E7EB] bg-[#FAFAFA] rounded-b-2xl">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-2.5 py-1 rounded-md border border-[#E5E7EB] text-[11px] font-[600] text-[#4B5563] hover:bg-gray-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
                        <span className="text-[11px] text-[#6B7280] font-[500]">Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-2.5 py-1 rounded-md border border-[#E5E7EB] text-[11px] font-[600] text-[#4B5563] hover:bg-gray-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{doc.confidentiality || "Internal"} — {doc.clientTradingName}</span>
                        <span>&middot;</span>
                        <span>Document ID: {doc.clientId}-{doc.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== Upload New Version Modal ===== */
function UploadNewVersionModal({ doc, onClose }: { doc: EnrichedDocument; onClose: () => void }) {
    const conf = getDocTypeConf(doc.type);
    const TypeIcon = conf.icon;
    const currentVer = parseFloat(doc.version);
    const [versionType, setVersionType] = useState<"minor" | "major">("minor");
    const [changeNotes, setChangeNotes] = useState("");
    const [fileName, setFileName] = useState("");
    const [phase, setPhase] = useState<"form" | "uploading" | "done">("form");
    const [uploadProgress, setUploadProgress] = useState(0);

    const newVersion = versionType === "minor" ? (currentVer + 0.1).toFixed(1) : (Math.floor(currentVer) + 1).toFixed(1);

    const handleUpload = () => {
        setPhase("uploading");
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress((p) => {
                if (p >= 100) { clearInterval(interval); setTimeout(() => setPhase("done"), 300); return 100; }
                return p + Math.random() * 25 + 10;
            });
        }, 200);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center"><Upload className="w-4.5 h-4.5 text-[#4F46E5]" /></div>
                        <div><h2 className="text-[16px] font-[700] text-foreground">Upload New Version</h2><p className="text-[11px] text-muted-foreground">Replace with an updated revision</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"><X className="w-4 h-4 text-[#6B7280]" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {phase === "form" && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                                <div className={`w-10 h-10 rounded-lg ${conf.bg} flex items-center justify-center flex-shrink-0`}><TypeIcon className={`w-5 h-5 ${conf.color}`} /></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-[700] text-foreground truncate">{doc.name}</p>
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5"><span>Current: v{doc.version}</span><span>&middot;</span><span>{doc.clientTradingName}</span><span>&middot;</span><DocTypeBadge type={doc.type} /></div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-2">Version Increment</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${versionType === "minor" ? "border-[#4F46E5] bg-[#F0EFFE]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]"}`}>
                                        <input type="radio" name="verType" checked={versionType === "minor"} onChange={() => setVersionType("minor")} className="mt-0.5 accent-[#4F46E5]" />
                                        <div><p className="text-[12px] font-[700] text-foreground">Minor Update</p><p className="text-[10px] text-muted-foreground mt-0.5">v{doc.version} → v{(currentVer + 0.1).toFixed(1)}</p><p className="text-[10px] text-[#6B7280] mt-0.5">Small corrections, typo fixes</p></div>
                                    </label>
                                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${versionType === "major" ? "border-[#4F46E5] bg-[#F0EFFE]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]"}`}>
                                        <input type="radio" name="verType" checked={versionType === "major"} onChange={() => setVersionType("major")} className="mt-0.5 accent-[#4F46E5]" />
                                        <div><p className="text-[12px] font-[700] text-foreground">Major Revision</p><p className="text-[10px] text-muted-foreground mt-0.5">v{doc.version} → v{(Math.floor(currentVer) + 1).toFixed(1)}</p><p className="text-[10px] text-[#6B7280] mt-0.5">Significant changes, restructured</p></div>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1.5">Upload File <span className="text-red-500">*</span></label>
                                <div className="border-2 border-dashed border-[#D1D5DB] rounded-xl p-5 text-center hover:border-[#4F46E5] hover:bg-[#EEF2FF]/20 transition-colors cursor-pointer relative">
                                    <Upload className="w-7 h-7 text-[#9CA3AF] mx-auto mb-1.5" />
                                    <p className="text-[12px] font-[600] text-[#4B5563]">Drop file here or click to browse</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">PDF, DOC, DOCX, XLS, XLSX up to 25MB</p>
                                    {fileName && (
                                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#EEF2FF] rounded-lg text-[11px] font-[600] text-[#4F46E5]">
                                            <FileText className="w-3.5 h-3.5" /> {fileName}
                                            <button onClick={(e) => { e.stopPropagation(); setFileName(""); }} className="hover:text-red-500 cursor-pointer"><X className="w-3 h-3" /></button>
                                        </div>
                                    )}
                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-[#374151] block mb-1.5">Change Notes <span className="text-red-500">*</span></label>
                                <textarea rows={3} value={changeNotes} onChange={(e) => setChangeNotes(e.target.value)} placeholder="Describe what changed in this version (e.g. 'Updated Section 3 re: new WRC guidelines effective Jan 2026')" className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] resize-none" />
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                                <p className="text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Version Summary</p>
                                <div className="flex items-center gap-4 text-[12px]">
                                    <div className="flex items-center gap-1.5"><span className="text-muted-foreground">Current:</span><span className="font-[600] text-foreground px-1.5 py-0.5 bg-gray-100 rounded text-[11px]">v{doc.version}</span></div>
                                    <span className="text-[#9CA3AF]">→</span>
                                    <div className="flex items-center gap-1.5"><span className="text-muted-foreground">New:</span><span className="font-[700] text-[#4F46E5] px-1.5 py-0.5 bg-[#EEF2FF] rounded text-[11px]">v{newVersion}</span></div>
                                    <span className={`ml-auto text-[10px] font-[600] px-1.5 py-0.5 rounded-full ${versionType === "major" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>{versionType === "major" ? "Major" : "Minor"}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {phase === "uploading" && (
                        <div className="py-12 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto"><Upload className="w-7 h-7 text-[#4F46E5] animate-pulse" /></div>
                            <div><p className="text-[14px] font-[700] text-foreground">Uploading v{newVersion}...</p><p className="text-[12px] text-muted-foreground mt-1">{fileName || doc.name}</p></div>
                            <div className="max-w-[300px] mx-auto">
                                <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden"><div className="h-full bg-[#4F46E5] rounded-full transition-all duration-200" style={{ width: `${Math.min(uploadProgress, 100)}%` }} /></div>
                                <p className="text-[11px] text-muted-foreground mt-2">{Math.min(Math.round(uploadProgress), 100)}%</p>
                            </div>
                        </div>
                    )}
                    {phase === "done" && (
                        <div className="py-10 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                            <div><p className="text-[16px] font-[700] text-foreground">Version Uploaded Successfully</p><p className="text-[13px] text-muted-foreground mt-1.5"><span className="font-[600] text-foreground">{doc.name}</span> has been updated to <span className="font-[700] text-[#4F46E5]">v{newVersion}</span></p></div>
                            <div className="max-w-[320px] mx-auto p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-left space-y-1.5 text-[11px]">
                                <div className="flex justify-between"><span className="text-muted-foreground">Previous version</span><span className="text-[#6B7280] font-[500]">v{doc.version} (archived)</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">New version</span><span className="text-[#4F46E5] font-[700]">v{newVersion} (current)</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground font-[500]">{versionType === "major" ? "Major revision" : "Minor update"}</span></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                    {phase === "form" && (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={handleUpload} disabled={!changeNotes.trim()} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"><Upload className="w-3.5 h-3.5" /> Upload v{newVersion}</button>
                        </>
                    )}
                    {phase === "done" && (
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ===== Document Detail Panel ===== */
function DocumentDetailPanel({
    doc,
    onClose,
    onNavigateToClient,
}: {
    doc: EnrichedDocument;
    onClose: () => void;
    onNavigateToClient: (client: Client) => void;
}) {
    const { clients } = useApi();
    const conf = getDocTypeConf(doc.type);
    const TypeIcon = conf.icon;
    const client = clients.find((c) => c.id === doc.clientId);
    const expiryDays = doc.expiryDate ? daysUntil(doc.expiryDate) : null;
    const [showPreview, setShowPreview] = useState(false);
    const [showUploadVersion, setShowUploadVersion] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/30" onClick={onClose} />
            <div className="w-[520px] bg-white shadow-2xl overflow-y-auto border-l border-[#E5E7EB] animate-slide-in">
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 border-b border-[#E5E7EB]">
                    <div className="flex items-start justify-between px-6 py-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <DocTypeBadge type={doc.type} />
                                <ConfidentialityBadge level={doc.confidentiality} />
                                <span className="text-[10px] text-muted-foreground font-[500]">{doc.clientId}-{doc.id}</span>
                            </div>
                            <h3 className="text-[16px] font-[700] text-foreground pr-4">{doc.name}</h3>
                        </div>
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer flex-shrink-0">
                            <X className="w-4 h-4 text-[#6B7280]" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 px-6 pb-3">
                        <button className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[11px] font-[600] hover:bg-[#4338CA] cursor-pointer flex items-center gap-1.5">
                            <Download className="w-3 h-3" /> Download
                        </button>
                        <button onClick={() => setShowPreview(true)} className="px-3 py-1.5 rounded-lg bg-gray-50 text-[#4B5563] text-[11px] font-[600] hover:bg-gray-100 cursor-pointer border border-gray-200 flex items-center gap-1.5">
                            <Eye className="w-3 h-3" /> Preview
                        </button>
                        <button onClick={() => setShowUploadVersion(true)} className="px-3 py-1.5 rounded-lg bg-gray-50 text-[#4B5563] text-[11px] font-[600] hover:bg-gray-100 cursor-pointer border border-gray-200 flex items-center gap-1.5">
                            <Upload className="w-3 h-3" /> New Version
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer ml-auto">
                            <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                        </button>
                    </div>
                </div>

                {showPreview && <DocumentPreviewModal doc={doc} onClose={() => setShowPreview(false)} />}
                {showUploadVersion && <UploadNewVersionModal doc={doc} onClose={() => setShowUploadVersion(false)} />}

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Expiry Warning */}
                    {expiryDays !== null && expiryDays <= 90 && (
                        <div className={`flex items-center gap-2.5 p-3 rounded-lg border ${expiryDays < 0 ? "bg-red-50 border-red-200" : expiryDays <= 30 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                            <AlertTriangle className={`w-4 h-4 ${expiryDays <= 30 ? "text-red-600" : "text-amber-600"}`} />
                            <span className={`text-[12px] font-[600] ${expiryDays <= 30 ? "text-red-700" : "text-amber-700"}`}>
                                {expiryDays < 0
                                    ? `This document expired ${Math.abs(expiryDays)} day${Math.abs(expiryDays) > 1 ? "s" : ""} ago`
                                    : `This document expires in ${expiryDays} day${expiryDays > 1 ? "s" : ""}`}
                            </span>
                        </div>
                    )}

                    {/* Description */}
                    {doc.description && (
                        <div>
                            <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider mb-2">Description</h4>
                            <p className="text-[13px] text-[#4B5563] leading-relaxed">{doc.description}</p>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="space-y-3">
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Document Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1">Document Type</p>
                                <div className="flex items-center gap-1.5">
                                    <TypeIcon className={`w-3.5 h-3.5 ${conf.color}`} />
                                    <span className="text-[12px] font-[600] text-foreground">{doc.type}</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1">Version</p>
                                <p className="text-[12px] font-[600] text-foreground">v{doc.version}</p>
                                {parseFloat(doc.version) < 1 && (
                                    <span className="text-[9px] text-amber-600 font-[600]">Draft</span>
                                )}
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1">Uploaded By</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[8px] font-[700] text-[#4F46E5]">
                                        {doc.uploadedBy.split(" ").map((n) => n[0]).join("")}
                                    </div>
                                    <span className="text-[12px] font-[600] text-foreground">{doc.uploadedBy}</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1">File Size</p>
                                <p className="text-[12px] font-[600] text-foreground">{doc.fileSize || "—"}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1">Upload Date</p>
                                <p className="text-[12px] font-[600] text-foreground">{formatDate(doc.uploadDate)}</p>
                                <p className="text-[10px] text-muted-foreground">{formatTimestamp(doc.uploadTimestamp)}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1">Expiry Date</p>
                                {doc.expiryDate ? (
                                    <>
                                        <p className="text-[12px] font-[600] text-foreground">{formatDate(doc.expiryDate)}</p>
                                        <ExpiryLabel expiryDate={doc.expiryDate} />
                                    </>
                                ) : (
                                    <p className="text-[12px] text-[#9CA3AF]">No expiry</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Confidentiality & Regulatory */}
                    <div className="space-y-3">
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Classification & Regulation</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1.5">Confidentiality</p>
                                <ConfidentialityBadge level={doc.confidentiality} />
                            </div>
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                <p className="text-[10px] text-muted-foreground font-[600] mb-1.5">Regulatory Reference</p>
                                {doc.regulatoryRef && doc.regulatoryRef !== "N/A" ? (
                                    <div className="flex items-start gap-1.5">
                                        <Scale className="w-3 h-3 text-[#6B7280] mt-0.5 flex-shrink-0" />
                                        <p className="text-[11px] text-[#4B5563] font-[500]">{doc.regulatoryRef}</p>
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-[#9CA3AF]">N/A</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Client Context */}
                    <div className="space-y-3">
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Client</h4>
                        <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                            <div className="flex items-center justify-between mb-2">
                                <button
                                    className="flex items-center gap-1.5 text-[12px] font-[600] text-[#4F46E5] hover:underline cursor-pointer"
                                    onClick={() => client && onNavigateToClient(client)}
                                >
                                    <Building2 className="w-3.5 h-3.5" />
                                    {doc.clientTradingName}
                                    <ExternalLink className="w-3 h-3" />
                                </button>
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-[600] border ${doc.clientRiskLevel === "High"
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : doc.clientRiskLevel === "Medium"
                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        }`}
                                >
                                    {doc.clientRiskLevel} Risk
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                <span>{doc.clientIndustry}</span>
                                <span>&middot;</span>
                                <span>{doc.clientLocation}</span>
                            </div>
                        </div>
                    </div>

                    {/* Version History (simulated) */}
                    <div className="space-y-3">
                        <h4 className="text-[12px] font-[700] text-[#6B7280] uppercase tracking-wider">Version History</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#EEF2FF] border border-[#C7D2FE]">
                                <div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] font-[600] text-foreground">v{doc.version} — Current</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        Uploaded by {doc.uploadedBy} &middot; {formatDate(doc.uploadDate)}
                                    </p>
                                </div>
                            </div>
                            {parseFloat(doc.version) > 1 && (
                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6]">
                                    <div className="w-5 h-5 rounded-full bg-[#D1D5DB] flex items-center justify-center">
                                        <File className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-[600] text-[#6B7280]">v{(parseFloat(doc.version) - 1).toFixed(1)} — Previous</p>
                                        <p className="text-[10px] text-muted-foreground">Superseded</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== Main Component ===== */
interface DocumentsPageProps {
    onNavigateToClient: (client: Client) => void;
}

export function DocumentsPage({ onNavigateToClient }: DocumentsPageProps) {
    const { clients, addDocument } = useApi();
    const [activeTab, setActiveTab] = useState<TabId>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterClient, setFilterClient] = useState("");
    const [filterUploadedBy, setFilterUploadedBy] = useState("");
    const [filterConfidentiality, setFilterConfidentiality] = useState("");
    const [sortField, setSortField] = useState<SortField>("uploadDate");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [selectedDoc, setSelectedDoc] = useState<EnrichedDocument | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

    // Enrich documents
    const allDocs: EnrichedDocument[] = useMemo(() => {
        return clients.flatMap((c) =>
            c.documents.map((d) => ({
                ...d,
                clientId: c.id,
                clientName: c.name,
                clientTradingName: c.tradingName,
                clientIndustry: c.industry,
                clientLocation: c.location,
                clientRiskLevel: c.riskLevel,
            }))
        );
    }, [clients]);

    // Active filter count
    const activeFilterCount = [filterType, filterClient, filterUploadedBy, filterConfidentiality].filter(Boolean).length;

    // Stats
    const stats = useMemo(() => {
        const expiringSoon = allDocs.filter((d) => {
            if (!d.expiryDate) return false;
            const days = daysUntil(d.expiryDate);
            return days >= 0 && days <= 90;
        }).length;
        const expired = allDocs.filter((d) => d.expiryDate && daysUntil(d.expiryDate) < 0).length;
        const recent = allDocs.filter((d) => {
            const days = Math.ceil((NOW.getTime() - new Date(d.uploadDate).getTime()) / 86400000);
            return days <= 30;
        }).length;
        const drafts = allDocs.filter((d) => parseFloat(d.version) < 1).length;
        const restricted = allDocs.filter((d) => d.confidentiality === "Restricted" || d.confidentiality === "Confidential").length;

        // Type breakdown
        const typeMap = new Map<string, number>();
        allDocs.forEach((d) => typeMap.set(d.type, (typeMap.get(d.type) || 0) + 1));
        const typeBreakdown = Array.from(typeMap.entries()).sort((a, b) => b[1] - a[1]);

        return { total: allDocs.length, expiringSoon, expired, recent, drafts, restricted, typeBreakdown };
    }, [allDocs]);

    // Filter
    const filteredDocs = useMemo(() => {
        let docs = [...allDocs];

        // Tab filters
        switch (activeTab) {
            case "contracts":
                docs = docs.filter((d) => d.type === "Contract");
                break;
            case "policies":
                docs = docs.filter((d) => d.type === "HR Policy");
                break;
            case "compliance":
                docs = docs.filter((d) => d.type === "Compliance Report" || d.type === "Audit Report");
                break;
            case "gdpr":
                docs = docs.filter((d) => d.type === "GDPR Record");
                break;
            case "hAndS":
                docs = docs.filter((d) => d.type === "H&S Report");
                break;
            case "expiring":
                docs = docs.filter((d) => d.expiryDate && daysUntil(d.expiryDate) <= 180);
                break;
            case "recent":
                docs = docs.filter((d) => {
                    const days = Math.ceil((NOW.getTime() - new Date(d.uploadDate).getTime()) / 86400000);
                    return days <= 60;
                });
                break;
        }

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            docs = docs.filter(
                (d) =>
                    d.name.toLowerCase().includes(q) ||
                    (d.description || "").toLowerCase().includes(q) ||
                    d.clientTradingName.toLowerCase().includes(q) ||
                    d.uploadedBy.toLowerCase().includes(q) ||
                    d.type.toLowerCase().includes(q) ||
                    (d.regulatoryRef || "").toLowerCase().includes(q)
            );
        }

        // Dropdown filters
        if (filterType) docs = docs.filter((d) => d.type === filterType);
        if (filterClient) docs = docs.filter((d) => d.clientTradingName === filterClient);
        if (filterUploadedBy) docs = docs.filter((d) => d.uploadedBy === filterUploadedBy);
        if (filterConfidentiality) docs = docs.filter((d) => d.confidentiality === filterConfidentiality);

        // Sort
        docs.sort((a, b) => {
            let valA: string = "";
            let valB: string = "";
            switch (sortField) {
                case "name": valA = a.name; valB = b.name; break;
                case "type": valA = a.type; valB = b.type; break;
                case "client": valA = a.clientTradingName; valB = b.clientTradingName; break;
                case "uploadDate": valA = a.uploadDate; valB = b.uploadDate; break;
                case "expiryDate": valA = a.expiryDate || "9999"; valB = b.expiryDate || "9999"; break;
                case "uploadedBy": valA = a.uploadedBy; valB = b.uploadedBy; break;
                case "version": valA = a.version; valB = b.version; break;
            }
            if (valA < valB) return sortDir === "asc" ? -1 : 1;
            if (valA > valB) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

        return docs;
    }, [allDocs, activeTab, searchQuery, filterType, filterClient, filterUploadedBy, filterConfidentiality, sortField, sortDir]);

    const toggleSort = useCallback(
        (field: SortField) => {
            if (sortField === field) {
                setSortDir((d) => (d === "asc" ? "desc" : "asc"));
            } else {
                setSortField(field);
                setSortDir(field === "uploadDate" || field === "expiryDate" ? "desc" : "asc");
            }
        },
        [sortField]
    );

    const clearFilters = () => {
        setFilterType("");
        setFilterClient("");
        setFilterUploadedBy("");
        setFilterConfidentiality("");
        setSearchQuery("");
    };

    const toggleDocSelection = (docKey: string) => {
        setSelectedDocs((prev) => {
            const next = new Set(prev);
            if (next.has(docKey)) next.delete(docKey);
            else next.add(docKey);
            return next;
        });
    };

    const clientNames = useMemo(() => [...new Set(clients.map((c) => c.tradingName))], [clients]);
    const uploaders = useMemo(() => [...new Set(allDocs.map((d) => d.uploadedBy))], [allDocs]);
    const docTypes = useMemo(() => [...new Set(allDocs.map((d) => d.type))], [allDocs]);

    const tabs: { id: TabId; label: string; count: number; color?: string }[] = [
        { id: "all", label: "All Documents", count: stats.total },
        { id: "contracts", label: "Contracts", count: allDocs.filter((d) => d.type === "Contract").length },
        { id: "policies", label: "Policies", count: allDocs.filter((d) => d.type === "HR Policy").length },
        { id: "compliance", label: "Compliance & Audit", count: allDocs.filter((d) => d.type === "Compliance Report" || d.type === "Audit Report").length },
        { id: "gdpr", label: "GDPR", count: allDocs.filter((d) => d.type === "GDPR Record").length },
        { id: "hAndS", label: "H&S", count: allDocs.filter((d) => d.type === "H&S Report").length },
        { id: "expiring", label: "Expiring", count: stats.expiringSoon + stats.expired, color: "text-red-600 bg-red-50 border-red-200" },
        { id: "recent", label: "Recent", count: stats.recent },
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            <div className="p-6 max-w-[1440px] mx-auto">
                {/* Page Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-[22px] font-[800] text-foreground">Documents & Records</h1>
                        <p className="text-[13px] text-muted-foreground mt-0.5">
                            Friday, 6 February 2026 &middot; 12:00 IST &middot; Centralised document management across all client engagements
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <Download className="w-3.5 h-3.5" /> Export All
                        </button>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="px-3 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer"
                        >
                            <Upload className="w-3.5 h-3.5" /> Upload Document
                        </button>
                    </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-6 gap-3 mb-5">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                                <FolderOpen className="w-4 h-4 text-[#4F46E5]" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.total}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Total Documents</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.recent}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Uploaded (30d)</p>
                    </div>
                    <div className={`bg-white rounded-xl border ${stats.expiringSoon > 0 ? "border-amber-200 bg-amber-50/30" : "border-[#E5E7EB]"} p-3.5 hover:shadow-sm transition-shadow`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg ${stats.expiringSoon > 0 ? "bg-amber-100" : "bg-gray-100"} flex items-center justify-center`}>
                                <Clock className={`w-4 h-4 ${stats.expiringSoon > 0 ? "text-amber-600" : "text-gray-500"}`} />
                            </div>
                        </div>
                        <p className={`text-[22px] font-[800] ${stats.expiringSoon > 0 ? "text-amber-700" : "text-foreground"}`}>{stats.expiringSoon}</p>
                        <p className={`text-[11px] font-[500] ${stats.expiringSoon > 0 ? "text-amber-600" : "text-[#6B7280]"}`}>Expiring Soon</p>
                    </div>
                    <div className={`bg-white rounded-xl border ${stats.expired > 0 ? "border-red-200 bg-red-50/30" : "border-[#E5E7EB]"} p-3.5 hover:shadow-sm transition-shadow`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg ${stats.expired > 0 ? "bg-red-100" : "bg-gray-100"} flex items-center justify-center`}>
                                <FileWarning className={`w-4 h-4 ${stats.expired > 0 ? "text-red-600" : "text-gray-500"}`} />
                            </div>
                        </div>
                        <p className={`text-[22px] font-[800] ${stats.expired > 0 ? "text-red-700" : "text-foreground"}`}>{stats.expired}</p>
                        <p className={`text-[11px] font-[500] ${stats.expired > 0 ? "text-red-600" : "text-[#6B7280]"}`}>Expired</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                <Layers className="w-4 h-4 text-violet-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.drafts}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Drafts</p>
                    </div>
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-red-600" />
                            </div>
                        </div>
                        <p className="text-[22px] font-[800] text-foreground">{stats.restricted}</p>
                        <p className="text-[11px] text-[#6B7280] font-[500]">Conf. / Restricted</p>
                    </div>
                </div>

                {/* Document Type Breakdown */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-5">
                    <div className="flex items-center gap-6 overflow-x-auto">
                        {stats.typeBreakdown.map(([type, count]) => {
                            const conf = getDocTypeConf(type);
                            const TypeIcon = conf.icon;
                            return (
                                <button
                                    key={type}
                                    onClick={() => { setActiveTab("all"); setFilterType(type); }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#F9FAFB] cursor-pointer transition-colors flex-shrink-0"
                                >
                                    <div className={`w-7 h-7 rounded-lg ${conf.bg} flex items-center justify-center`}>
                                        <TypeIcon className={`w-3.5 h-3.5 ${conf.color}`} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[12px] font-[700] text-foreground">{count}</p>
                                        <p className="text-[10px] text-muted-foreground">{type}{count !== 1 ? "s" : ""}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-4 border-b border-[#E5E7EB] overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setFilterType(""); }}
                            className={`flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-[600] border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === tab.id ? "border-[#4F46E5] text-[#4F46E5]" : "border-transparent text-[#6B7280] hover:text-[#4B5563]"
                                }`}
                        >
                            {tab.label}
                            <span
                                className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-[700] border ${tab.color && activeTab === tab.id
                                        ? tab.color
                                        : activeTab === tab.id
                                            ? "bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]"
                                            : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <div className="relative flex-1 max-w-[280px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search documents, clients, regulations..."
                            className="w-full pl-9 pr-3 py-2 text-[12px] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]/40"
                        />
                    </div>
                    <FilterDropdown label="Type" options={docTypes} value={filterType} onChange={setFilterType} icon={Tag} />
                    <FilterDropdown label="Client" options={clientNames} value={filterClient} onChange={setFilterClient} icon={Building2} />
                    <FilterDropdown label="Uploaded By" options={uploaders} value={filterUploadedBy} onChange={setFilterUploadedBy} icon={User} />
                    <FilterDropdown
                        label="Confidentiality"
                        options={["Public", "Internal", "Confidential", "Restricted"]}
                        value={filterConfidentiality}
                        onChange={setFilterConfidentiality}
                        icon={Lock}
                    />

                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-[600] text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                            <X className="w-3 h-3" /> Clear ({activeFilterCount})
                        </button>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">
                            {filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedDocs.size > 0 && (
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg mb-4">
                        <span className="text-[12px] font-[600] text-[#4F46E5]">{selectedDocs.size} selected</span>
                        <div className="flex items-center gap-2 ml-2">
                            <button className="px-2.5 py-1 rounded-md bg-white text-[11px] font-[600] text-[#4B5563] border border-[#E5E7EB] hover:bg-gray-50 cursor-pointer flex items-center gap-1">
                                <Download className="w-3 h-3" /> Download
                            </button>
                            <button className="px-2.5 py-1 rounded-md bg-white text-[11px] font-[600] text-[#4B5563] border border-[#E5E7EB] hover:bg-gray-50 cursor-pointer flex items-center gap-1">
                                <Archive className="w-3 h-3" /> Archive
                            </button>
                        </div>
                        <button onClick={() => setSelectedDocs(new Set())} className="ml-auto text-[11px] font-[600] text-[#6B7280] hover:text-foreground cursor-pointer">
                            Clear
                        </button>
                    </div>
                )}

                {/* Documents Table */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
                                    <th className="w-10 px-3 py-2.5">
                                        <input
                                            type="checkbox"
                                            className="w-3.5 h-3.5 rounded border-[#D1D5DB] accent-[#4F46E5] cursor-pointer"
                                            checked={selectedDocs.size === filteredDocs.length && filteredDocs.length > 0}
                                            onChange={() => {
                                                if (selectedDocs.size === filteredDocs.length) {
                                                    setSelectedDocs(new Set());
                                                } else {
                                                    setSelectedDocs(new Set(filteredDocs.map((d) => d.clientId + d.id)));
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider min-w-[260px]">
                                        <button onClick={() => toggleSort("name")} className="flex items-center gap-1 cursor-pointer">
                                            Document <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                        <button onClick={() => toggleSort("type")} className="flex items-center gap-1 cursor-pointer">
                                            Type <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                        <button onClick={() => toggleSort("client")} className="flex items-center gap-1 cursor-pointer">
                                            Client <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                        <button onClick={() => toggleSort("version")} className="flex items-center gap-1 cursor-pointer">
                                            Ver. <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                        <button onClick={() => toggleSort("uploadedBy")} className="flex items-center gap-1 cursor-pointer">
                                            Uploaded By <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                        <button onClick={() => toggleSort("uploadDate")} className="flex items-center gap-1 cursor-pointer">
                                            Upload Date <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-3 py-2.5 text-left text-[10px] font-[700] text-[#6B7280] uppercase tracking-wider">
                                        <button onClick={() => toggleSort("expiryDate")} className="flex items-center gap-1 cursor-pointer">
                                            Expiry <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-3 py-2.5 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocs.map((doc) => {
                                    const docKey = doc.clientId + doc.id;
                                    const isSelected = selectedDocs.has(docKey);
                                    const conf = getDocTypeConf(doc.type);
                                    const TypeIcon = conf.icon;
                                    const isDraft = parseFloat(doc.version) < 1;
                                    return (
                                        <tr
                                            key={docKey}
                                            className={`border-b border-[#F3F4F6] hover:bg-[#F9FAFB] cursor-pointer transition-colors ${isSelected ? "bg-[#EEF2FF]/40" : ""}`}
                                            onClick={() => setSelectedDoc(doc)}
                                        >
                                            <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    className="w-3.5 h-3.5 rounded border-[#D1D5DB] accent-[#4F46E5] cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() => toggleDocSelection(docKey)}
                                                />
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex items-start gap-2.5">
                                                    <div className={`w-8 h-8 rounded-lg ${conf.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                        <TypeIcon className={`w-4 h-4 ${conf.color}`} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[12px] font-[600] text-foreground truncate">{doc.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {doc.confidentiality && <ConfidentialityBadge level={doc.confidentiality} />}
                                                            {doc.fileSize && <span className="text-[9px] text-muted-foreground">{doc.fileSize}</span>}
                                                            {isDraft && (
                                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-[600] bg-amber-50 text-amber-600 border border-amber-200">Draft</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <DocTypeBadge type={doc.type} />
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className="text-[11px] font-[600] text-[#4B5563]">{doc.clientTradingName}</span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className="text-[11px] text-[#4B5563] font-[500]">v{doc.version}</span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[8px] font-[700] text-[#4F46E5]">
                                                        {doc.uploadedBy.split(" ").map((n) => n[0]).join("")}
                                                    </div>
                                                    <span className="text-[11px] text-[#4B5563]">{doc.uploadedBy.split(" ")[0]}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className="text-[11px] text-[#4B5563]">{formatShortDate(doc.uploadDate)}</span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <ExpiryLabel expiryDate={doc.expiryDate} />
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

                    {filteredDocs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-3">
                                <FolderOpen className="w-6 h-6 text-[#9CA3AF]" />
                            </div>
                            <p className="text-[14px] font-[600] text-[#4B5563]">No documents found</p>
                            <p className="text-[12px] text-muted-foreground mt-1">
                                {activeFilterCount > 0 || searchQuery
                                    ? "Try adjusting your filters or search terms"
                                    : "No documents to display"}
                            </p>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-3 px-3 py-1.5 rounded-lg text-[12px] font-[600] text-[#4F46E5] hover:bg-[#EEF2FF] cursor-pointer"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Summary */}
                <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                        Showing {filteredDocs.length} of {allDocs.length} documents &middot; Last updated: 06 Feb 2026, 12:00 IST
                    </span>
                    <span>
                        Data Protection Act 2018 &middot; GDPR Compliant &middot; Document retention per Irish regulatory requirements
                    </span>
                </div>
            </div>

            {/* Modals & Panels */}
            {selectedDoc && (
                <DocumentDetailPanel doc={selectedDoc} onClose={() => setSelectedDoc(null)} onNavigateToClient={onNavigateToClient} />
            )}
            {showUploadModal && (
                <UploadDocumentModal
                    onClose={() => setShowUploadModal(false)}
                    onAdd={async (docData, selectedClientId) => {
                        if (selectedClientId) {
                            await addDocument(selectedClientId, docData);
                        }
                        setShowUploadModal(false);
                    }}
                />
            )}
        </div>
    );
}