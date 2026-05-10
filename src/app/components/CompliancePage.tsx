import { useState, useMemo } from "react";
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Search,
    X,
    Filter,
    ChevronDown,
    ChevronRight,
    Download,
    Upload,
    FileText,
    Scale,
    Eye,
    MoreHorizontal,
    Clock,
    TrendingUp,
    TrendingDown,
    Activity,
    Target,
    Building2,
    Users,
    Zap,
    BookOpen,
    Lock,
    Unlock,
    CircleDot,
    XCircle,
    CheckCircle,
    HardHat,
    DollarSign,
    FileCheck,
    BarChart3,
    Pencil,
    Plus,
    Save,
    ClipboardList,
    Info,
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
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    AreaChart,
    Area,
    LineChart,
    Line,
} from "recharts";
import { mockClients } from "./mock-data";
import type { Client } from "./mock-data";

/* ===== Constants ===== */
const NOW = new Date("2026-02-06T12:00:00Z");

/* ===== Types & Interfaces ===== */

type ComplianceCategory =
    | "GDPR & Data Protection"
    | "WRC & Employment Law"
    | "Health & Safety"
    | "Industrial Relations"
    | "Payroll & Revenue"
    | "Employee Equality"
    | "Working Time"
    | "General Compliance";

type ComplianceStatus = "Compliant" | "At Risk" | "Non-Compliant" | "Pending Review";
type AuditStatus = "Scheduled" | "In Progress" | "Completed" | "Overdue";
type RiskLevel = "Critical" | "High" | "Medium" | "Low";

interface ComplianceRequirement {
    id: string;
    title: string;
    description: string;
    category: ComplianceCategory;
    legislation: string;
    status: ComplianceStatus;
    riskLevel: RiskLevel;
    client: string;
    clientId: string;
    owner: string;
    lastReviewed: string;
    nextReview: string;
    dueDate: string;
    completionRate: number;
    actionItems: number;
    notes?: string;
}

interface AuditRecord {
    id: string;
    title: string;
    type: string;
    client: string;
    clientId: string;
    auditor: string;
    status: AuditStatus;
    scheduledDate: string;
    completedDate?: string;
    score?: number;
    findings: number;
    criticalFindings: number;
    category: ComplianceCategory;
    regulatoryRef: string;
}

interface ComplianceGap {
    id: string;
    title: string;
    description: string;
    client: string;
    clientId: string;
    category: ComplianceCategory;
    severity: RiskLevel;
    identifiedDate: string;
    dueDate: string;
    status: "Open" | "In Progress" | "Resolved" | "Deferred";
    assignedTo: string;
    remediationPlan?: string;
    legislation: string;
}

/* ===== Mock Data ===== */

const COMPLIANCE_REQUIREMENTS: ComplianceRequirement[] = [
    {
        id: "CR-001",
        title: "GDPR Data Protection Impact Assessment",
        description: "Complete DPIA for all HR systems processing employee personal data under Article 35 GDPR",
        category: "GDPR & Data Protection",
        legislation: "GDPR Article 35 / Data Protection Act 2018",
        status: "At Risk",
        riskLevel: "High",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        owner: "Cian Murphy",
        lastReviewed: "2026-01-15",
        nextReview: "2026-04-15",
        dueDate: "2026-02-28",
        completionRate: 65,
        actionItems: 3,
        notes: "Draft DPIA in progress, awaiting system inventory from client IT team",
    },
    {
        id: "CR-002",
        title: "Working Time Act Compliance Review",
        description: "Ensure rest breaks, maximum hours, and annual leave comply with Organisation of Working Time Act 1997",
        category: "Working Time",
        legislation: "Organisation of Working Time Act 1997",
        status: "Compliant",
        riskLevel: "Low",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        owner: "Saoirse O'Neill",
        lastReviewed: "2026-01-20",
        nextReview: "2026-07-20",
        dueDate: "2026-07-31",
        completionRate: 100,
        actionItems: 0,
        notes: "All policies updated and compliant; seasonal workers properly documented",
    },
    {
        id: "CR-003",
        title: "Safety Statement & Risk Assessments",
        description: "Maintain current Safety Statement and conduct site-specific risk assessments per Safety, Health and Welfare at Work Act 2005",
        category: "Health & Safety",
        legislation: "Safety, Health and Welfare at Work Act 2005",
        status: "Non-Compliant",
        riskLevel: "Critical",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        owner: "Declan Byrne",
        lastReviewed: "2025-12-10",
        nextReview: "2026-02-15",
        dueDate: "2026-02-10",
        completionRate: 45,
        actionItems: 7,
        notes: "HSA inspection scheduled 15 Feb; urgent update required for Waterford site",
    },
    {
        id: "CR-004",
        title: "Employment Equality Acts Compliance",
        description: "Review policies for compliance with Employment Equality Acts 1998–2015, including anti-discrimination and reasonable accommodation",
        category: "Employee Equality",
        legislation: "Employment Equality Acts 1998–2015",
        status: "Compliant",
        riskLevel: "Low",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        owner: "Aoife Brennan",
        lastReviewed: "2026-01-28",
        nextReview: "2026-04-28",
        dueDate: "2026-04-30",
        completionRate: 100,
        actionItems: 0,
        notes: "Dignity at Work policy updated and all staff trained in Q4 2025",
    },
    {
        id: "CR-005",
        title: "PAYE Modernisation Compliance",
        description: "Ensure real-time PAYE reporting to Revenue Commissioners per PAYE Modernisation requirements",
        category: "Payroll & Revenue",
        legislation: "Finance Act 2017 (PAYE Modernisation)",
        status: "Compliant",
        riskLevel: "Medium",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        owner: "Saoirse O'Neill",
        lastReviewed: "2026-02-01",
        nextReview: "2026-08-01",
        dueDate: "2026-12-31",
        completionRate: 100,
        actionItems: 0,
        notes: "Payroll system integrated with ROS; all submissions timely",
    },
    {
        id: "CR-006",
        title: "Unfair Dismissals Acts Compliance",
        description: "Review dismissal procedures and ensure compliance with Unfair Dismissals Acts 1977–2015",
        category: "WRC & Employment Law",
        legislation: "Unfair Dismissals Acts 1977–2015",
        status: "Pending Review",
        riskLevel: "Medium",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        owner: "Aoife Brennan",
        lastReviewed: "2025-11-10",
        nextReview: "2026-02-10",
        dueDate: "2026-03-31",
        completionRate: 80,
        actionItems: 2,
        notes: "Recent WRC case requires procedure update; awaiting legal review",
    },
    {
        id: "CR-007",
        title: "Terms of Employment Information Act",
        description: "Ensure all employees receive written terms of employment within 5 days per Terms of Employment (Information) Act 1994–2014",
        category: "WRC & Employment Law",
        legislation: "Terms of Employment (Information) Act 1994–2014",
        status: "Compliant",
        riskLevel: "Low",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        owner: "Cian Murphy",
        lastReviewed: "2026-01-25",
        nextReview: "2026-07-25",
        dueDate: "2026-12-31",
        completionRate: 100,
        actionItems: 0,
        notes: "Automated onboarding system ensures timely issuance",
    },
    {
        id: "CR-008",
        title: "Industrial Relations Acts Compliance",
        description: "Maintain compliant collective bargaining and dispute resolution per Industrial Relations Acts 1946–2015",
        category: "Industrial Relations",
        legislation: "Industrial Relations Acts 1946–2015",
        status: "At Risk",
        riskLevel: "High",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        owner: "Saoirse O'Neill",
        lastReviewed: "2026-02-04",
        nextReview: "2026-05-04",
        dueDate: "2026-03-15",
        completionRate: 70,
        actionItems: 4,
        notes: "SIPTU negotiations underway; agreement must be finalised by mid-March",
    },
    {
        id: "CR-009",
        title: "National Minimum Wage Act Compliance",
        description: "Verify all employee pay rates meet National Minimum Wage Act 2000 requirements including sub-minimum rates",
        category: "Payroll & Revenue",
        legislation: "National Minimum Wage Act 2000",
        status: "Compliant",
        riskLevel: "Low",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        owner: "Saoirse O'Neill",
        lastReviewed: "2025-12-18",
        nextReview: "2026-06-18",
        dueDate: "2026-12-31",
        completionRate: 100,
        actionItems: 0,
        notes: "All rates verified; seasonal workers compliant",
    },
    {
        id: "CR-010",
        title: "GDPR Data Subject Access Requests",
        description: "Maintain DSAR procedures and respond within 30 days per GDPR Article 15",
        category: "GDPR & Data Protection",
        legislation: "GDPR Article 15 / Data Protection Act 2018",
        status: "Compliant",
        riskLevel: "Medium",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        owner: "Cian Murphy",
        lastReviewed: "2026-02-03",
        nextReview: "2026-05-03",
        dueDate: "2026-12-31",
        completionRate: 100,
        actionItems: 0,
        notes: "DSAR log maintained; average response time 18 days",
    },
    {
        id: "CR-011",
        title: "HSA Construction Regulations",
        description: "Comply with HSA Construction Regulations 2013 including safety plans and site inspections",
        category: "Health & Safety",
        legislation: "Safety, Health and Welfare at Work (Construction) Regulations 2013",
        status: "At Risk",
        riskLevel: "High",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        owner: "Declan Byrne",
        lastReviewed: "2026-01-20",
        nextReview: "2026-02-20",
        dueDate: "2026-02-28",
        completionRate: 60,
        actionItems: 5,
        notes: "Two sites require updated safety plans ahead of HSA visit",
    },
    {
        id: "CR-012",
        title: "Parental Leave and Benefit Acts",
        description: "Ensure parental leave policies comply with Parental Leave Acts 1998–2006 and Work Life Balance Act 2023",
        category: "WRC & Employment Law",
        legislation: "Parental Leave Acts 1998–2006 / Work Life Balance Act 2023",
        status: "Compliant",
        riskLevel: "Low",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        owner: "Aoife Brennan",
        lastReviewed: "2026-01-22",
        nextReview: "2026-07-22",
        dueDate: "2026-12-31",
        completionRate: 100,
        actionItems: 0,
        notes: "Policies updated for 2023 Act amendments; employee handbook reflects changes",
    },
];

const AUDIT_RECORDS: AuditRecord[] = [
    {
        id: "AUD-001",
        title: "Q4 2025 WRC Compliance Audit",
        type: "Workplace Relations Compliance",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        auditor: "Aoife Brennan",
        status: "Completed",
        scheduledDate: "2025-12-10",
        completedDate: "2025-12-18",
        score: 71,
        findings: 8,
        criticalFindings: 2,
        category: "WRC & Employment Law",
        regulatoryRef: "Workplace Relations Act 2015",
    },
    {
        id: "AUD-002",
        title: "HSA Site Inspection Readiness Review",
        type: "Health & Safety Audit",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        auditor: "Declan Byrne",
        status: "In Progress",
        scheduledDate: "2026-02-08",
        findings: 12,
        criticalFindings: 4,
        category: "Health & Safety",
        regulatoryRef: "Safety, Health and Welfare at Work Act 2005",
    },
    {
        id: "AUD-003",
        title: "GDPR Data Processing Audit",
        type: "Data Protection Compliance",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        auditor: "Cian Murphy",
        status: "Scheduled",
        scheduledDate: "2026-03-15",
        findings: 0,
        criticalFindings: 0,
        category: "GDPR & Data Protection",
        regulatoryRef: "GDPR / Data Protection Act 2018",
    },
    {
        id: "AUD-004",
        title: "Industrial Relations Compliance Review",
        type: "IR Compliance Audit",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        auditor: "Saoirse O'Neill",
        status: "Completed",
        scheduledDate: "2026-01-25",
        completedDate: "2026-01-30",
        score: 87,
        findings: 3,
        criticalFindings: 0,
        category: "Industrial Relations",
        regulatoryRef: "Industrial Relations Acts 1946–2015",
    },
    {
        id: "AUD-005",
        title: "Employment Equality Acts Review",
        type: "Equality & Diversity Audit",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        auditor: "Aoife Brennan",
        status: "Completed",
        scheduledDate: "2026-01-20",
        completedDate: "2026-01-28",
        score: 95,
        findings: 2,
        criticalFindings: 0,
        category: "Employee Equality",
        regulatoryRef: "Employment Equality Acts 1998–2015",
    },
    {
        id: "AUD-006",
        title: "Payroll & Revenue Compliance Check",
        type: "Payroll Audit",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        auditor: "Saoirse O'Neill",
        status: "Completed",
        scheduledDate: "2026-01-10",
        completedDate: "2026-01-15",
        score: 100,
        findings: 0,
        criticalFindings: 0,
        category: "Payroll & Revenue",
        regulatoryRef: "Finance Act 2017 (PAYE Modernisation)",
    },
    {
        id: "AUD-007",
        title: "Working Time Act Compliance Audit",
        type: "Working Time Compliance",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        auditor: "Aoife Brennan",
        status: "Overdue",
        scheduledDate: "2026-01-31",
        findings: 0,
        criticalFindings: 0,
        category: "Working Time",
        regulatoryRef: "Organisation of Working Time Act 1997",
    },
    {
        id: "AUD-008",
        title: "Terms of Employment Act Review",
        type: "Contract Compliance Audit",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        auditor: "Cian Murphy",
        status: "Completed",
        scheduledDate: "2026-01-18",
        completedDate: "2026-01-25",
        score: 100,
        findings: 0,
        criticalFindings: 0,
        category: "WRC & Employment Law",
        regulatoryRef: "Terms of Employment (Information) Act 1994–2014",
    },
];

const COMPLIANCE_GAPS: ComplianceGap[] = [
    {
        id: "GAP-001",
        title: "GDPR DPIA Overdue for HR Systems",
        description: "Data Protection Impact Assessment required for HRIS, payroll, and recruitment systems processing employee personal data",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        category: "GDPR & Data Protection",
        severity: "High",
        identifiedDate: "2026-01-15",
        dueDate: "2026-02-28",
        status: "In Progress",
        assignedTo: "Cian Murphy",
        remediationPlan: "Draft DPIA in progress; system inventory requested from IT team. Target completion 28 Feb 2026.",
        legislation: "GDPR Article 35 / Data Protection Act 2018",
    },
    {
        id: "GAP-002",
        title: "Safety Statement Update Required — Waterford Site",
        description: "Site-specific Safety Statement for Waterford construction site requires urgent update ahead of HSA inspection",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        category: "Health & Safety",
        severity: "Critical",
        identifiedDate: "2026-01-20",
        dueDate: "2026-02-10",
        status: "Open",
        assignedTo: "Declan Byrne",
        remediationPlan: "Safety consultant engaged to conduct risk assessment and update Safety Statement by 10 Feb.",
        legislation: "Safety, Health and Welfare at Work Act 2005",
    },
    {
        id: "GAP-003",
        title: "WRC Complaint Response Template Missing",
        description: "Standardised template for responding to WRC complaints not yet created",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        category: "WRC & Employment Law",
        severity: "Medium",
        identifiedDate: "2026-01-28",
        dueDate: "2026-02-20",
        status: "Open",
        assignedTo: "Cian Murphy",
        remediationPlan: "Draft template being prepared based on recent WRC adjudication precedents.",
        legislation: "Workplace Relations Act 2015",
    },
    {
        id: "GAP-004",
        title: "Rest-Break Policy Non-Compliance",
        description: "Current rest-break policy does not reflect recent WRC adjudication precedents on Organisation of Working Time Act",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        category: "Working Time",
        severity: "High",
        identifiedDate: "2026-01-15",
        dueDate: "2026-02-28",
        status: "In Progress",
        assignedTo: "Aoife Brennan",
        remediationPlan: "Policy update in progress; draft to be reviewed with client by 20 Feb.",
        legislation: "Organisation of Working Time Act 1997",
    },
    {
        id: "GAP-005",
        title: "Collective Agreement Nearing Expiry",
        description: "SIPTU collective agreement expires mid-March; renewal negotiations must be completed",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        category: "Industrial Relations",
        severity: "High",
        identifiedDate: "2026-02-04",
        dueDate: "2026-03-15",
        status: "In Progress",
        assignedTo: "Saoirse O'Neill",
        remediationPlan: "Negotiation strategy prepared; meetings scheduled with SIPTU rep for Feb and early March.",
        legislation: "Industrial Relations Acts 1946–2015",
    },
    {
        id: "GAP-006",
        title: "HSA Construction Regulations — Safety Plans",
        description: "Two construction sites require updated safety plans per HSA Construction Regulations 2013",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        category: "Health & Safety",
        severity: "Critical",
        identifiedDate: "2026-01-22",
        dueDate: "2026-02-15",
        status: "In Progress",
        assignedTo: "Declan Byrne",
        remediationPlan: "Site managers updating plans in collaboration with H&S consultant; target completion 12 Feb.",
        legislation: "Safety, Health and Welfare at Work (Construction) Regulations 2013",
    },
    {
        id: "GAP-007",
        title: "Unfair Dismissals Procedure Update",
        description: "Recent WRC adjudication requires update to dismissal procedures to ensure compliance",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        category: "WRC & Employment Law",
        severity: "Medium",
        identifiedDate: "2026-01-30",
        dueDate: "2026-03-31",
        status: "Open",
        assignedTo: "Aoife Brennan",
        remediationPlan: "Legal review in progress; procedure to be updated following counsel opinion.",
        legislation: "Unfair Dismissals Acts 1977–2015",
    },
];

/* ===== Chart Data ===== */

const complianceByCategory = [
    { category: "GDPR & Data Protection", compliant: 3, atRisk: 1, nonCompliant: 0 },
    { category: "WRC & Employment Law", compliant: 3, atRisk: 1, nonCompliant: 1 },
    { category: "Health & Safety", compliant: 0, atRisk: 1, nonCompliant: 2 },
    { category: "Industrial Relations", compliant: 1, atRisk: 1, nonCompliant: 0 },
    { category: "Payroll & Revenue", compliant: 2, atRisk: 0, nonCompliant: 0 },
    { category: "Employee Equality", compliant: 1, atRisk: 0, nonCompliant: 0 },
];

const complianceStatusPieData = [
    { name: "Compliant", value: 10, color: "#10B981" },
    { name: "At Risk", value: 4, color: "#F59E0B" },
    { name: "Non-Compliant", value: 3, color: "#EF4444" },
    { name: "Pending Review", value: 1, color: "#8B5CF6" },
];

const riskRadarData = [
    { subject: "GDPR", client1: 85, client2: 90, client3: 60 },
    { subject: "WRC", client1: 75, client2: 95, client3: 55 },
    { subject: "H&S", client1: 90, client2: 85, client3: 45 },
    { subject: "IR", client1: 80, client2: 70, client3: 80 },
    { subject: "Payroll", client1: 95, client2: 100, client3: 85 },
    { subject: "Equality", client1: 100, client2: 90, client3: 70 },
];

const complianceTrend = [
    { month: "Aug 2025", score: 68 },
    { month: "Sep 2025", score: 72 },
    { month: "Oct 2025", score: 75 },
    { month: "Nov 2025", score: 77 },
    { month: "Dec 2025", score: 80 },
    { month: "Jan 2026", score: 82 },
    { month: "Feb 2026", score: 78 },
];

const auditScoreData = [
    { client: "Crestfield Tech", score: 71 },
    { client: "Harbour Fresh", score: 87 },
    { client: "Stronghold", score: 55 },
];

/* ===== Helper Functions ===== */

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
}

function getStatusBadgeStyles(status: ComplianceStatus) {
    const styles = {
        Compliant: "bg-emerald-50 text-emerald-700 border-emerald-200",
        "At Risk": "bg-amber-50 text-amber-700 border-amber-200",
        "Non-Compliant": "bg-red-50 text-red-700 border-red-200",
        "Pending Review": "bg-violet-50 text-violet-700 border-violet-200",
    };
    return styles[status] || styles["Pending Review"];
}

function getRiskBadgeStyles(risk: RiskLevel) {
    const styles = {
        Critical: "bg-red-100 text-red-800 border-red-300",
        High: "bg-orange-100 text-orange-800 border-orange-300",
        Medium: "bg-amber-100 text-amber-800 border-amber-300",
        Low: "bg-emerald-100 text-emerald-800 border-emerald-300",
    };
    return styles[risk] || styles.Low;
}

function getAuditStatusBadgeStyles(status: AuditStatus) {
    const styles = {
        Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
        "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
        Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Overdue: "bg-red-50 text-red-700 border-red-200",
    };
    return styles[status] || styles.Scheduled;
}

function getGapStatusBadgeStyles(status: ComplianceGap["status"]) {
    const styles = {
        Open: "bg-red-50 text-red-700 border-red-200",
        "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
        Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Deferred: "bg-slate-50 text-slate-700 border-slate-200",
    };
    return styles[status] || styles.Open;
}

/* ===== Mock Audit Findings Data ===== */
interface AuditFinding {
    id: string;
    title: string;
    description: string;
    severity: RiskLevel;
    area: string;
    recommendation: string;
    status: "Open" | "In Progress" | "Resolved";
}

function getAuditFindings(audit: AuditRecord): AuditFinding[] {
    const baseFindingsMap: Record<string, AuditFinding[]> = {
        "AUD-001": [
            { id: "F-001", title: "Incomplete grievance procedure documentation", description: "Grievance procedures do not reference SI 146/2000 Code of Practice on Grievance and Disciplinary Procedures. Two of five reviewed policies missing required steps.", severity: "High", area: "Grievance Procedures", recommendation: "Update grievance procedure template to include SI 146/2000 references and distribute to all managers within 30 days.", status: "In Progress" },
            { id: "F-002", title: "Written terms of employment delayed issuance", description: "Three new hires in Q4 2025 received written terms beyond the 5-day statutory requirement under Terms of Employment (Information) Act.", severity: "Critical", area: "Employment Contracts", recommendation: "Implement automated onboarding trigger to generate and issue terms within 3 days of start date.", status: "Open" },
            { id: "F-003", title: "Annual leave records incomplete", description: "Leave tracking system shows gaps in recorded annual leave for 12 employees, risking non-compliance with Organisation of Working Time Act 1997.", severity: "Medium", area: "Working Time", recommendation: "Reconcile leave records with payroll data and implement monthly reconciliation process.", status: "In Progress" },
            { id: "F-004", title: "WRC complaint response timeline exceeded", description: "Response to WRC ADJ-00045123 exceeded 42-day target by 8 days due to delayed internal investigation.", severity: "High", area: "WRC Compliance", recommendation: "Establish escalation protocol for WRC complaints with 7-day internal review milestones.", status: "Open" },
            { id: "F-005", title: "Employee handbook outdated sections", description: "Sections on parental leave and remote working do not reflect Work Life Balance Act 2023 amendments.", severity: "Medium", area: "Policy Documentation", recommendation: "Commission handbook review and update with external employment law firm by Q1 2026.", status: "In Progress" },
            { id: "F-006", title: "Disciplinary records missing sign-off", description: "Two disciplinary actions in 2025 are missing employee acknowledgement signatures.", severity: "Low", area: "Disciplinary Procedures", recommendation: "Introduce digital sign-off process for all disciplinary documentation.", status: "Resolved" },
            { id: "F-007", title: "Fixed-term contract renewals not formalised", description: "Three fixed-term contracts automatically renewed without formal documentation, risking deemed permanent employment status.", severity: "High", area: "Contract Management", recommendation: "Implement renewal tracking with 60-day advance notifications and mandatory written renewals.", status: "Open" },
            { id: "F-008", title: "Probation review meetings not documented", description: "Probation review meetings conducted verbally for two recent hires without written records.", severity: "Low", area: "Probation Management", recommendation: "Create standard probation review form and require written summary within 48 hours of each meeting.", status: "Resolved" },
        ],
        "AUD-002": [
            { id: "F-009", title: "Safety Statement not updated for Waterford site", description: "Waterford construction site Safety Statement last updated August 2025; does not reflect current site conditions or new subcontractors.", severity: "Critical", area: "Safety Statements", recommendation: "Immediate Safety Statement update required ahead of HSA inspection on 15 Feb.", status: "Open" },
            { id: "F-010", title: "PPE compliance gaps on two sites", description: "Site inspections revealed 4 workers without required PPE on Dublin and Waterford sites.", severity: "Critical", area: "PPE Compliance", recommendation: "Enforce zero-tolerance PPE policy with daily site checks and immediate stand-down for violations.", status: "In Progress" },
            { id: "F-011", title: "Risk assessments overdue for new activities", description: "Three new construction activities commenced without completing required risk assessments.", severity: "Critical", area: "Risk Assessments", recommendation: "Halt new activities until risk assessments completed; implement pre-commencement checklist.", status: "Open" },
            { id: "F-012", title: "First aid kit inspection records missing", description: "First aid kits on 2 of 4 sites do not have current inspection records.", severity: "Medium", area: "First Aid", recommendation: "Assign weekly first aid kit inspection responsibility to site supervisors with log sheet.", status: "In Progress" },
            { id: "F-013", title: "Toolbox talks not consistently recorded", description: "Toolbox talk attendance records missing for 6 of 12 sessions in January 2026.", severity: "Medium", area: "Safety Training", recommendation: "Implement digital sign-in for all toolbox talks with automatic reporting.", status: "In Progress" },
            { id: "F-014", title: "Scaffold inspection certificates expired", description: "Two scaffold structures on Dublin site have expired inspection certificates.", severity: "Critical", area: "Scaffold Safety", recommendation: "Immediate re-inspection required; remove scaffolds from use until certified.", status: "Open" },
            { id: "F-015", title: "Emergency evacuation plan not tested", description: "Emergency evacuation drill not conducted in Q4 2025 at Waterford site.", severity: "High", area: "Emergency Procedures", recommendation: "Schedule evacuation drill within 2 weeks; document results and remediate gaps.", status: "Open" },
            { id: "F-016", title: "Noise assessment not conducted", description: "Occupational noise assessment overdue for Galway site where power tools are used continuously.", severity: "Medium", area: "Occupational Health", recommendation: "Commission noise assessment survey and implement controls as required.", status: "In Progress" },
            { id: "F-017", title: "Safety induction records incomplete", description: "Three new subcontractor workers commenced without completing site safety induction.", severity: "High", area: "Safety Induction", recommendation: "No worker to access site without completed induction; implement badge system.", status: "In Progress" },
            { id: "F-018", title: "CSCS card verification gaps", description: "Two workers on site without valid Safe Pass or CSCS cards verified.", severity: "High", area: "Worker Competency", recommendation: "Implement card verification at site entry points with daily register checks.", status: "Open" },
            { id: "F-019", title: "Welfare facilities below standard", description: "Toilet and washing facilities at Waterford site below Construction Regulations 2013 standards.", severity: "Medium", area: "Welfare", recommendation: "Upgrade welfare facilities within 7 days to meet regulatory requirements.", status: "In Progress" },
            { id: "F-020", title: "PSDP appointment documentation", description: "Project Supervisor Design Process appointment letter not on file for one project.", severity: "Medium", area: "Regulatory Appointments", recommendation: "Obtain and file PSDP appointment documentation immediately.", status: "Open" },
        ],
        "AUD-004": [
            { id: "F-021", title: "Collective agreement clause ambiguity", description: "Section 4.3 of SIPTU agreement contains ambiguous language regarding overtime calculation during peak season.", severity: "Medium", area: "Collective Agreement", recommendation: "Clarify clause with union representative during upcoming March negotiations.", status: "In Progress" },
            { id: "F-022", title: "Shop steward communication protocol", description: "No formal protocol for management-shop steward communication; ad-hoc arrangements causing delays.", severity: "Low", area: "Industrial Relations", recommendation: "Establish monthly scheduled consultation meetings with documented agenda and minutes.", status: "Open" },
            { id: "F-023", title: "Grievance escalation timeline", description: "Internal grievance escalation to Labour Court took 45 days vs. 28-day target.", severity: "Medium", area: "Dispute Resolution", recommendation: "Implement stage-gated grievance process with escalation triggers at 7, 14, and 21 days.", status: "In Progress" },
        ],
        "AUD-005": [
            { id: "F-024", title: "Diversity metrics reporting gap", description: "Gender diversity metrics collected but not formally reported to board on quarterly basis.", severity: "Low", area: "Diversity Reporting", recommendation: "Include diversity dashboard in quarterly board report pack.", status: "In Progress" },
            { id: "F-025", title: "Reasonable accommodation procedure update", description: "Reasonable accommodation request procedure does not reference latest IHREC guidance (2025).", severity: "Low", area: "Disability Accommodation", recommendation: "Update procedure to incorporate IHREC Code of Practice on Employment of People with Disabilities.", status: "Open" },
        ],
    };

    return baseFindingsMap[audit.id] || Array.from({ length: audit.findings }, (_, i) => ({
        id: `F-GEN-${i + 1}`,
        title: `Finding ${i + 1} — ${audit.category}`,
        description: `Identified during ${audit.title}: area requires attention per ${audit.regulatoryRef}.`,
        severity: (i < audit.criticalFindings ? "Critical" : i < audit.criticalFindings + 2 ? "High" : i < audit.findings - 1 ? "Medium" : "Low") as RiskLevel,
        area: audit.category,
        recommendation: `Address finding in line with ${audit.regulatoryRef} requirements.`,
        status: (i < 2 ? "Open" : i < 4 ? "In Progress" : "Resolved") as "Open" | "In Progress" | "Resolved",
    }));
}

/* ===== Schedule Audit Modal ===== */
function ScheduleAuditModal({ onClose }: { onClose: () => void }) {
    const [done, setDone] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Workplace Relations Compliance");
    const [client, setClient] = useState("");
    const [auditor, setAuditor] = useState("Aoife Brennan");
    const [scheduledDate, setScheduledDate] = useState("");
    const [category, setCategory] = useState<ComplianceCategory>("WRC & Employment Law");
    const [regulatoryRef, setRegulatoryRef] = useState("");
    const [notes, setNotes] = useState("");

    const isValid = title.trim() && client && scheduledDate;

    const handleSave = () => { setDone(true); };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center"><FileCheck className="w-5 h-5 text-indigo-600" /></div>
                        <div><h2 className="text-[16px] font-[700] text-foreground">Schedule Audit</h2><p className="text-[12px] text-muted-foreground">Create a new compliance audit</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {!done ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-[12px] font-[600] text-foreground block mb-1.5">Audit Title <span className="text-red-500">*</span></label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Q1 2026 GDPR Compliance Review" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Audit Type</label>
                                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option>Workplace Relations Compliance</option>
                                        <option>Health & Safety Audit</option>
                                        <option>Data Protection Compliance</option>
                                        <option>IR Compliance Audit</option>
                                        <option>Equality & Diversity Audit</option>
                                        <option>Payroll Audit</option>
                                        <option>Working Time Compliance</option>
                                        <option>Contract Compliance Audit</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value as ComplianceCategory)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option>GDPR & Data Protection</option>
                                        <option>WRC & Employment Law</option>
                                        <option>Health & Safety</option>
                                        <option>Industrial Relations</option>
                                        <option>Payroll & Revenue</option>
                                        <option>Employee Equality</option>
                                        <option>Working Time</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Client <span className="text-red-500">*</span></label>
                                    <select value={client} onChange={(e) => setClient(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option value="">Select client...</option>
                                        {mockClients.map((c) => <option key={c.id} value={c.name}>{c.tradingName}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Lead Auditor</label>
                                    <select value={auditor} onChange={(e) => setAuditor(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option>Aoife Brennan</option>
                                        <option>Cian Murphy</option>
                                        <option>Saoirse O'Neill</option>
                                        <option>Declan Byrne</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Scheduled Date <span className="text-red-500">*</span></label>
                                    <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring" />
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Regulatory Reference</label>
                                    <input value={regulatoryRef} onChange={(e) => setRegulatoryRef(e.target.value)} placeholder="e.g. GDPR Article 35" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-foreground block mb-1.5">Notes</label>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any additional context or preparation notes..." className="w-full px-3 py-2 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                            </div>
                            {/* Summary card */}
                            {title && client && scheduledDate && (
                                <div className="p-3 rounded-lg bg-slate-50 border border-border">
                                    <p className="text-[10px] font-[700] text-muted-foreground uppercase tracking-wider mb-2">Audit Summary</p>
                                    <div className="space-y-1 text-[12px]">
                                        <div className="flex justify-between"><span className="text-muted-foreground">Title</span><span className="font-[600] text-foreground">{title}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">Client</span><span className="font-[500] text-foreground">{mockClients.find(c => c.name === client)?.tradingName || client}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">Auditor</span><span className="font-[500] text-foreground">{auditor}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-[500] text-indigo-600">{formatDate(scheduledDate)}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-10 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                            <div><p className="text-[16px] font-[700] text-foreground">Audit Scheduled</p><p className="text-[13px] text-muted-foreground mt-1.5"><span className="font-[600] text-foreground">{title}</span></p><p className="text-[12px] text-muted-foreground mt-0.5">{auditor} · {formatDate(scheduledDate)} · {mockClients.find(c => c.name === client)?.tradingName || client}</p></div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border">
                    {!done ? (
                        <>
                            <button onClick={onClose} className="h-10 px-5 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors cursor-pointer">Cancel</button>
                            <button onClick={handleSave} disabled={!isValid} className="h-10 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"><Calendar className="w-4 h-4" /> Schedule Audit</button>
                        </>
                    ) : (
                        <button onClick={onClose} className="h-10 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ===== Add / Edit Requirement Modal ===== */
function RequirementModal({ existing, onClose }: { existing?: ComplianceRequirement | null; onClose: () => void }) {
    const isEdit = !!existing;
    const [done, setDone] = useState(false);
    const [title, setTitle] = useState(existing?.title || "");
    const [description, setDescription] = useState(existing?.description || "");
    const [category, setCategory] = useState<ComplianceCategory>(existing?.category || "GDPR & Data Protection");
    const [legislation, setLegislation] = useState(existing?.legislation || "");
    const [status, setStatus] = useState<ComplianceStatus>(existing?.status || "Pending Review");
    const [riskLevel, setRiskLevel] = useState<RiskLevel>(existing?.riskLevel || "Medium");
    const [client, setClient] = useState(existing?.client || "");
    const [owner, setOwner] = useState(existing?.owner || "Aoife Brennan");
    const [dueDate, setDueDate] = useState(existing?.dueDate || "");
    const [completionRate, setCompletionRate] = useState(existing?.completionRate ?? 0);
    const [notes, setNotes] = useState(existing?.notes || "");

    const isValid = title.trim() && client && legislation.trim() && dueDate;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[640px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">{isEdit ? <Pencil className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}</div>
                        <div><h2 className="text-[16px] font-[700] text-foreground">{isEdit ? "Edit" : "Add"} Requirement</h2><p className="text-[12px] text-muted-foreground">{isEdit ? `Editing ${existing?.id}` : "Create a new compliance requirement"}</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {!done ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-[12px] font-[600] text-foreground block mb-1.5">Title <span className="text-red-500">*</span></label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. GDPR Data Protection Impact Assessment" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-foreground block mb-1.5">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe the compliance requirement..." className="w-full px-3 py-2 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value as ComplianceCategory)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option>GDPR & Data Protection</option>
                                        <option>WRC & Employment Law</option>
                                        <option>Health & Safety</option>
                                        <option>Industrial Relations</option>
                                        <option>Payroll & Revenue</option>
                                        <option>Employee Equality</option>
                                        <option>Working Time</option>
                                        <option>General Compliance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Legislation <span className="text-red-500">*</span></label>
                                    <input value={legislation} onChange={(e) => setLegislation(e.target.value)} placeholder="e.g. GDPR Article 35" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Client <span className="text-red-500">*</span></label>
                                    <select value={client} onChange={(e) => setClient(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option value="">Select client...</option>
                                        {mockClients.map((c) => <option key={c.id} value={c.name}>{c.tradingName}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Owner</label>
                                    <select value={owner} onChange={(e) => setOwner(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option>Aoife Brennan</option>
                                        <option>Cian Murphy</option>
                                        <option>Saoirse O'Neill</option>
                                        <option>Declan Byrne</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Status</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value as ComplianceStatus)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option>Compliant</option>
                                        <option>At Risk</option>
                                        <option>Non-Compliant</option>
                                        <option>Pending Review</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Risk Level</label>
                                    <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option>Critical</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Due Date <span className="text-red-500">*</span></label>
                                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring" />
                                </div>
                            </div>
                            {isEdit && (
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Completion: {completionRate}%</label>
                                    <input type="range" min={0} max={100} value={completionRate} onChange={(e) => setCompletionRate(Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                                </div>
                            )}
                            <div>
                                <label className="text-[12px] font-[600] text-foreground block mb-1.5">Notes</label>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Additional notes or context..." className="w-full px-3 py-2 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                            <div><p className="text-[16px] font-[700] text-foreground">Requirement {isEdit ? "Updated" : "Created"}</p><p className="text-[13px] text-muted-foreground mt-1.5"><span className="font-[600] text-foreground">{title}</span></p><p className="text-[12px] text-muted-foreground mt-0.5">{category} · {owner} · {riskLevel} risk</p></div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border">
                    {!done ? (
                        <>
                            <button onClick={onClose} className="h-10 px-5 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors cursor-pointer">Cancel</button>
                            <button onClick={() => setDone(true)} disabled={!isValid} className="h-10 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"><Save className="w-4 h-4" /> {isEdit ? "Save Changes" : "Add Requirement"}</button>
                        </>
                    ) : (
                        <button onClick={onClose} className="h-10 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ===== View Findings Modal ===== */
function ViewFindingsModal({ audit, onClose }: { audit: AuditRecord; onClose: () => void }) {
    const findings = useMemo(() => getAuditFindings(audit), [audit]);
    const [filterSeverity, setFilterSeverity] = useState<RiskLevel | "All">("All");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = filterSeverity === "All" ? findings : findings.filter((f) => f.severity === filterSeverity);
    const criticalCount = findings.filter((f) => f.severity === "Critical").length;
    const highCount = findings.filter((f) => f.severity === "High").length;
    const openCount = findings.filter((f) => f.status === "Open").length;

    const getFindingSeverityStyles = (sev: RiskLevel) => getRiskBadgeStyles(sev);
    const getFindingStatusStyles = (status: string) => {
        if (status === "Open") return "bg-red-50 text-red-700 border-red-200";
        if (status === "In Progress") return "bg-amber-50 text-amber-700 border-amber-200";
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[720px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-indigo-600" /></div>
                        <div>
                            <h2 className="text-[16px] font-[700] text-foreground">Audit Findings</h2>
                            <p className="text-[12px] text-muted-foreground">{audit.title} · {audit.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>

                {/* Stats row */}
                <div className="px-6 py-3 border-b border-border flex items-center gap-3">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="text-center"><p className="text-[18px] font-[700] text-foreground">{findings.length}</p><p className="text-[10px] text-muted-foreground font-[500]">Total</p></div>
                        <div className="w-px h-8 bg-border" />
                        <div className="text-center"><p className="text-[18px] font-[700] text-red-600">{criticalCount}</p><p className="text-[10px] text-muted-foreground font-[500]">Critical</p></div>
                        <div className="text-center"><p className="text-[18px] font-[700] text-orange-600">{highCount}</p><p className="text-[10px] text-muted-foreground font-[500]">High</p></div>
                        <div className="w-px h-8 bg-border" />
                        <div className="text-center"><p className="text-[18px] font-[700] text-amber-600">{openCount}</p><p className="text-[10px] text-muted-foreground font-[500]">Open</p></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {(["All", "Critical", "High", "Medium", "Low"] as const).map((sev) => (
                            <button key={sev} onClick={() => setFilterSeverity(sev)} className={`px-2.5 py-1 rounded-md text-[11px] font-[500] border cursor-pointer transition-colors ${filterSeverity === sev ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-border text-muted-foreground hover:bg-slate-50"}`}>{sev}</button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    {filtered.map((finding) => {
                        const isExpanded = expandedId === finding.id;
                        return (
                            <div key={finding.id} className={`border rounded-lg transition-colors ${finding.severity === "Critical" ? "border-red-200 bg-red-50/30" : "border-border bg-white"}`}>
                                <button onClick={() => setExpandedId(isExpanded ? null : finding.id)} className="w-full flex items-center gap-3 p-3.5 text-left cursor-pointer">
                                    <div className="flex-shrink-0">{isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[11px] text-muted-foreground font-[500]">{finding.id}</span>
                                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-[500] border ${getFindingSeverityStyles(finding.severity)}`}>{finding.severity}</span>
                                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-[500] border ${getFindingStatusStyles(finding.status)}`}>{finding.status}</span>
                                        </div>
                                        <p className="text-[13px] font-[500] text-foreground">{finding.title}</p>
                                    </div>
                                    <span className="text-[11px] text-muted-foreground font-[500] flex-shrink-0">{finding.area}</span>
                                </button>
                                {isExpanded && (
                                    <div className="px-3.5 pb-3.5 pt-0 ml-7 space-y-3 border-t border-border mt-0 pt-3">
                                        <div>
                                            <p className="text-[11px] font-[600] text-muted-foreground mb-1">Description</p>
                                            <p className="text-[12px] text-foreground leading-relaxed">{finding.description}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                            <p className="text-[11px] font-[600] text-blue-700 mb-1 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Recommendation</p>
                                            <p className="text-[12px] text-blue-800 leading-relaxed">{finding.recommendation}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="text-center py-10">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                            <p className="text-[14px] font-[600] text-foreground">No findings matching filter</p>
                            <p className="text-[12px] text-muted-foreground mt-1">Try changing the severity filter</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                    <p className="text-[11px] text-muted-foreground">{filtered.length} of {findings.length} findings shown · {audit.regulatoryRef}</p>
                    <button onClick={onClose} className="h-10 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer">Close</button>
                </div>
            </div>
        </div>
    );
}

/* ===== Edit Gap Modal ===== */
function EditGapModal({ gap, onClose }: { gap: ComplianceGap; onClose: () => void }) {
    const [done, setDone] = useState(false);
    const [title, setTitle] = useState(gap.title);
    const [description, setDescription] = useState(gap.description);
    const [severity, setSeverity] = useState<RiskLevel>(gap.severity);
    const [status, setStatus] = useState<ComplianceGap["status"]>(gap.status);
    const [assignedTo, setAssignedTo] = useState(gap.assignedTo);
    const [dueDate, setDueDate] = useState(gap.dueDate);
    const [remediationPlan, setRemediationPlan] = useState(gap.remediationPlan || "");

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[580px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center"><Pencil className="w-5 h-5 text-amber-600" /></div>
                        <div><h2 className="text-[16px] font-[700] text-foreground">Edit Compliance Gap</h2><p className="text-[12px] text-muted-foreground">{gap.id} · {gap.client}</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer"><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {!done ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-[12px] font-[600] text-foreground block mb-1.5">Title</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-foreground block mb-1.5">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Severity</label>
                                    <select value={severity} onChange={(e) => setSeverity(e.target.value as RiskLevel)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option>Critical</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Status</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value as ComplianceGap["status"])} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                        <option>Open</option>
                                        <option>In Progress</option>
                                        <option>Resolved</option>
                                        <option>Deferred</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-[600] text-foreground block mb-1.5">Due Date</label>
                                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-foreground block mb-1.5">Assigned To</label>
                                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                                    <option>Aoife Brennan</option>
                                    <option>Cian Murphy</option>
                                    <option>Saoirse O'Neill</option>
                                    <option>Declan Byrne</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[12px] font-[600] text-foreground block mb-1.5">Remediation Plan</label>
                                <textarea value={remediationPlan} onChange={(e) => setRemediationPlan(e.target.value)} rows={3} placeholder="Describe the remediation approach..." className="w-full px-3 py-2 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 border border-border">
                                <p className="text-[10px] font-[700] text-muted-foreground uppercase tracking-wider mb-2">Metadata</p>
                                <div className="space-y-1 text-[12px]">
                                    <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-[500] text-foreground">{gap.category}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Legislation</span><span className="font-[500] text-foreground">{gap.legislation}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Identified</span><span className="font-[500] text-foreground">{formatDate(gap.identifiedDate)}</span></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                            <div><p className="text-[16px] font-[700] text-foreground">Gap Updated</p><p className="text-[13px] text-muted-foreground mt-1.5"><span className="font-[600] text-foreground">{title}</span></p><p className="text-[12px] text-muted-foreground mt-0.5">{severity} · {status} · {assignedTo}</p></div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border">
                    {!done ? (
                        <>
                            <button onClick={onClose} className="h-10 px-5 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors cursor-pointer">Cancel</button>
                            <button onClick={() => setDone(true)} className="h-10 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer"><Save className="w-4 h-4" /> Save Changes</button>
                        </>
                    ) : (
                        <button onClick={onClose} className="h-10 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ===== Main Component ===== */

interface CompliancePageProps {
    onNavigateToClient?: (client: Client) => void;
}

export function CompliancePage({ onNavigateToClient }: CompliancePageProps) {
    const [activeTab, setActiveTab] = useState<
        "overview" | "requirements" | "audits" | "gaps" | "risk" | "reports" | "legislation"
    >("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<ComplianceCategory | "All">("All");
    const [selectedClient, setSelectedClient] = useState<string>("All");
    const [selectedStatus, setSelectedStatus] = useState<ComplianceStatus | "All">("All");
    const [selectedRisk, setSelectedRisk] = useState<RiskLevel | "All">("All");
    const [showFilters, setShowFilters] = useState(false);
    const [detailPanelItem, setDetailPanelItem] = useState<any | null>(null);
    const [detailPanelType, setDetailPanelType] = useState<
        "requirement" | "audit" | "gap" | null
    >(null);
    const [showScheduleAudit, setShowScheduleAudit] = useState(false);
    const [showAddRequirement, setShowAddRequirement] = useState(false);
    const [showEditRequirement, setShowEditRequirement] = useState(false);
    const [showViewFindings, setShowViewFindings] = useState(false);
    const [showEditGap, setShowEditGap] = useState(false);

    // Filtered data
    const filteredRequirements = useMemo(() => {
        return COMPLIANCE_REQUIREMENTS.filter((req) => {
            const matchesSearch =
                req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.legislation.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || req.category === selectedCategory;
            const matchesClient = selectedClient === "All" || req.client === selectedClient;
            const matchesStatus = selectedStatus === "All" || req.status === selectedStatus;
            const matchesRisk = selectedRisk === "All" || req.riskLevel === selectedRisk;
            return matchesSearch && matchesCategory && matchesClient && matchesStatus && matchesRisk;
        });
    }, [searchQuery, selectedCategory, selectedClient, selectedStatus, selectedRisk]);

    const filteredAudits = useMemo(() => {
        return AUDIT_RECORDS.filter((audit) => {
            const matchesSearch =
                audit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                audit.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                audit.client.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || audit.category === selectedCategory;
            const matchesClient = selectedClient === "All" || audit.client === selectedClient;
            return matchesSearch && matchesCategory && matchesClient;
        });
    }, [searchQuery, selectedCategory, selectedClient]);

    const filteredGaps = useMemo(() => {
        return COMPLIANCE_GAPS.filter((gap) => {
            const matchesSearch =
                gap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                gap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                gap.client.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || gap.category === selectedCategory;
            const matchesClient = selectedClient === "All" || gap.client === selectedClient;
            const matchesRisk = selectedRisk === "All" || gap.severity === selectedRisk;
            return matchesSearch && matchesCategory && matchesClient && matchesRisk;
        });
    }, [searchQuery, selectedCategory, selectedClient, selectedRisk]);

    // KPIs
    const totalRequirements = COMPLIANCE_REQUIREMENTS.length;
    const compliantCount = COMPLIANCE_REQUIREMENTS.filter((r) => r.status === "Compliant").length;
    const atRiskCount = COMPLIANCE_REQUIREMENTS.filter((r) => r.status === "At Risk").length;
    const nonCompliantCount = COMPLIANCE_REQUIREMENTS.filter((r) => r.status === "Non-Compliant").length;
    const complianceRate = Math.round((compliantCount / totalRequirements) * 100);

    const totalAudits = AUDIT_RECORDS.length;
    const auditsDue = AUDIT_RECORDS.filter(
        (a) => a.status === "Scheduled" || a.status === "In Progress"
    ).length;
    const overdueAudits = AUDIT_RECORDS.filter((a) => a.status === "Overdue").length;

    const totalGaps = COMPLIANCE_GAPS.length;
    const openGaps = COMPLIANCE_GAPS.filter((g) => g.status === "Open" || g.status === "In Progress").length;
    const criticalGaps = COMPLIANCE_GAPS.filter((g) => g.severity === "Critical").length;

    const avgAuditScore = Math.round(
        AUDIT_RECORDS.filter((a) => a.score).reduce((sum, a) => sum + (a.score || 0), 0) /
        AUDIT_RECORDS.filter((a) => a.score).length
    );

    const clients = ["All", ...Array.from(new Set(mockClients.map((c) => c.name)))];
    const categories: (ComplianceCategory | "All")[] = [
        "All",
        "GDPR & Data Protection",
        "WRC & Employment Law",
        "Health & Safety",
        "Industrial Relations",
        "Payroll & Revenue",
        "Employee Equality",
        "Working Time",
        "General Compliance",
    ];

    const handleRowClick = (item: any, type: "requirement" | "audit" | "gap") => {
        setDetailPanelItem(item);
        setDetailPanelType(type);
    };

    const handleCloseDetailPanel = () => {
        setDetailPanelItem(null);
        setDetailPanelType(null);
    };

    const handleNavigateToClient = (clientId: string) => {
        const client = mockClients.find((c) => c.id === clientId);
        if (client && onNavigateToClient) {
            onNavigateToClient(client);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            <div className="max-w-[1600px] mx-auto p-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                                <Shield className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-[24px] font-[700] text-foreground">
                                    Compliance & Risk Management
                                </h1>
                                <p className="text-[13px] text-muted-foreground">
                                    Regulatory compliance tracking and audit management
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="h-9 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export Report
                            </button>
                            <button onClick={() => setShowScheduleAudit(true)} className="h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer">
                                <FileCheck className="w-4 h-4" />
                                Schedule Audit
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
                                +5%
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">{complianceRate}%</div>
                        <div className="text-[13px] text-muted-foreground">Overall Compliance Rate</div>
                        <div className="text-[12px] text-muted-foreground mt-1">
                            {compliantCount}/{totalRequirements} requirements met
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex items-center gap-1 text-slate-600 text-[12px] font-[500]">
                                <Activity className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">{auditsDue}</div>
                        <div className="text-[13px] text-muted-foreground">Audits Due/In Progress</div>
                        <div className="text-[12px] text-muted-foreground mt-1">
                            {overdueAudits} overdue · {totalAudits} total
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex items-center gap-1 text-red-600 text-[12px] font-[500]">
                                <TrendingDown className="w-3.5 h-3.5" />
                                +2
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">{openGaps}</div>
                        <div className="text-[13px] text-muted-foreground">Open Compliance Gaps</div>
                        <div className="text-[12px] text-muted-foreground mt-1">
                            {criticalGaps} critical · {totalGaps} total
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-violet-600" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 text-[12px] font-[500]">
                                <TrendingUp className="w-3.5 h-3.5" />
                                +8%
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">{avgAuditScore}</div>
                        <div className="text-[13px] text-muted-foreground">Avg. Audit Score</div>
                        <div className="text-[12px] text-muted-foreground mt-1">
                            Last 6 completed audits
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-xl border border-border p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search compliance requirements, audits, legislation..."
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
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`h-10 px-4 rounded-lg text-[13px] font-[500] border transition-colors flex items-center gap-2 ${showFilters
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                    : "border-input bg-background hover:bg-accent"
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {(selectedCategory !== "All" ||
                                selectedClient !== "All" ||
                                selectedStatus !== "All" ||
                                selectedRisk !== "All") && (
                                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-[600] flex items-center justify-center">
                                        {[selectedCategory, selectedClient, selectedStatus, selectedRisk].filter(
                                            (f) => f !== "All"
                                        ).length}
                                    </span>
                                )}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-[12px] font-[500] text-muted-foreground mb-1.5 block">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[12px] font-[500] text-muted-foreground mb-1.5 block">
                                    Client
                                </label>
                                <select
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {clients.map((client) => (
                                        <option key={client} value={client}>
                                            {client}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[12px] font-[500] text-muted-foreground mb-1.5 block">
                                    Status
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Compliant">Compliant</option>
                                    <option value="At Risk">At Risk</option>
                                    <option value="Non-Compliant">Non-Compliant</option>
                                    <option value="Pending Review">Pending Review</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[12px] font-[500] text-muted-foreground mb-1.5 block">
                                    Risk Level
                                </label>
                                <select
                                    value={selectedRisk}
                                    onChange={(e) => setSelectedRisk(e.target.value as any)}
                                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="All">All Risk Levels</option>
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-border mb-6">
                    <div className="border-b border-border px-6">
                        <div className="flex gap-1 -mb-px overflow-x-auto">
                            {[
                                { id: "overview", label: "Overview", icon: Activity },
                                { id: "requirements", label: "Requirements", icon: Shield },
                                { id: "audits", label: "Audits", icon: FileCheck },
                                { id: "gaps", label: "Compliance Gaps", icon: AlertTriangle },
                                { id: "risk", label: "Risk Assessment", icon: Target },
                                { id: "reports", label: "Reports", icon: FileText },
                                { id: "legislation", label: "Legislation Guide", icon: BookOpen },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 h-12 text-[13px] font-[500] border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? "border-indigo-600 text-indigo-600"
                                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Charts Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Compliance by Category */}
                                    <div className="bg-slate-50 rounded-lg p-5 border border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground mb-4">
                                            Compliance by Category
                                        </h3>
                                        <ResponsiveContainer width="100%" height={260} minWidth={0}>
                                            <BarChart data={complianceByCategory}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                                <XAxis
                                                    dataKey="category"
                                                    tick={{ fontSize: 11 }}
                                                    angle={-15}
                                                    textAnchor="end"
                                                    height={80}
                                                />
                                                <YAxis tick={{ fontSize: 11 }} />
                                                <Tooltip
                                                    contentStyle={{
                                                        fontSize: "12px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #E2E8F0",
                                                    }}
                                                />
                                                <Legend wrapperStyle={{ fontSize: "12px" }} />
                                                <Bar dataKey="compliant" fill="#10B981" name="Compliant" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="atRisk" fill="#F59E0B" name="At Risk" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="nonCompliant" fill="#EF4444" name="Non-Compliant" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Compliance Status Distribution */}
                                    <div className="bg-slate-50 rounded-lg p-5 border border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground mb-4">
                                            Compliance Status Distribution
                                        </h3>
                                        <ResponsiveContainer width="100%" height={260} minWidth={0}>
                                            <RechartsPie>
                                                <Pie
                                                    data={complianceStatusPieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) =>
                                                        `${name} ${(percent * 100).toFixed(0)}%`
                                                    }
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {complianceStatusPieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        fontSize: "12px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #E2E8F0",
                                                    }}
                                                />
                                            </RechartsPie>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Compliance Trend */}
                                    <div className="bg-slate-50 rounded-lg p-5 border border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground mb-4">
                                            Compliance Score Trend
                                        </h3>
                                        <ResponsiveContainer width="100%" height={260} minWidth={0}>
                                            <AreaChart data={complianceTrend}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                                                <Tooltip
                                                    contentStyle={{
                                                        fontSize: "12px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #E2E8F0",
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="score"
                                                    stroke="#6366F1"
                                                    fill="#C7D2FE"
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Risk Radar */}
                                    <div className="bg-slate-50 rounded-lg p-5 border border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground mb-4">
                                            Risk Assessment Radar
                                        </h3>
                                        <ResponsiveContainer width="100%" height={260} minWidth={0}>
                                            <RadarChart data={riskRadarData}>
                                                <PolarGrid stroke="#E2E8F0" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                                                <PolarRadiusAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                                                <Radar
                                                    name="Crestfield Tech"
                                                    dataKey="client1"
                                                    stroke="#6366F1"
                                                    fill="#6366F1"
                                                    fillOpacity={0.4}
                                                />
                                                <Radar
                                                    name="Harbour Fresh"
                                                    dataKey="client2"
                                                    stroke="#10B981"
                                                    fill="#10B981"
                                                    fillOpacity={0.4}
                                                />
                                                <Radar
                                                    name="Stronghold"
                                                    dataKey="client3"
                                                    stroke="#F59E0B"
                                                    fill="#F59E0B"
                                                    fillOpacity={0.4}
                                                />
                                                <Legend wrapperStyle={{ fontSize: "12px" }} />
                                                <Tooltip
                                                    contentStyle={{
                                                        fontSize: "12px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #E2E8F0",
                                                    }}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Client Summary */}
                                <div className="bg-white border border-border rounded-lg">
                                    <div className="px-5 py-4 border-b border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground">
                                            Client Compliance Summary
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-border">
                                                <tr>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Client
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Compliance Rate
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Open Gaps
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Pending Audits
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Risk Level
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Last Audit Score
                                                    </th>
                                                    <th className="text-right text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {mockClients.slice(0, 3).map((client) => {
                                                    const clientReqs = COMPLIANCE_REQUIREMENTS.filter(
                                                        (r) => r.clientId === client.id
                                                    );
                                                    const clientCompliant = clientReqs.filter((r) => r.status === "Compliant").length;
                                                    const clientRate = clientReqs.length
                                                        ? Math.round((clientCompliant / clientReqs.length) * 100)
                                                        : 0;
                                                    const clientGaps = COMPLIANCE_GAPS.filter((g) => g.clientId === client.id && (g.status === "Open" || g.status === "In Progress")).length;
                                                    const clientAudits = AUDIT_RECORDS.filter(
                                                        (a) => a.clientId === client.id && (a.status === "Scheduled" || a.status === "In Progress")
                                                    ).length;
                                                    const lastAudit = AUDIT_RECORDS.filter((a) => a.clientId === client.id && a.score)
                                                        .sort((a, b) => new Date(b.completedDate || "").getTime() - new Date(a.completedDate || "").getTime())[0];

                                                    return (
                                                        <tr
                                                            key={client.id}
                                                            className="hover:bg-slate-50 cursor-pointer transition-colors"
                                                            onClick={() => handleNavigateToClient(client.id)}
                                                        >
                                                            <td className="px-5 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                                        <Building2 className="w-4 h-4 text-indigo-600" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[13px] font-[500] text-foreground">
                                                                            {client.tradingName}
                                                                        </div>
                                                                        <div className="text-[12px] text-muted-foreground">
                                                                            {client.location}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full ${clientRate >= 80
                                                                                    ? "bg-emerald-500"
                                                                                    : clientRate >= 60
                                                                                        ? "bg-amber-500"
                                                                                        : "bg-red-500"
                                                                                }`}
                                                                            style={{ width: `${clientRate}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-[13px] font-[600] text-foreground w-10 text-right">
                                                                        {clientRate}%
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <span
                                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-[500] ${clientGaps > 0
                                                                            ? "bg-red-50 text-red-700"
                                                                            : "bg-emerald-50 text-emerald-700"
                                                                        }`}
                                                                >
                                                                    {clientGaps > 0 && <AlertCircle className="w-3.5 h-3.5" />}
                                                                    {clientGaps}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <span className="text-[13px] text-foreground">{clientAudits}</span>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <span
                                                                    className={`inline-flex px-2.5 py-1 rounded-md text-[12px] font-[500] border ${getRiskBadgeStyles(
                                                                        client.riskLevel as RiskLevel
                                                                    )}`}
                                                                >
                                                                    {client.riskLevel}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                {lastAudit ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[13px] font-[600] text-foreground">
                                                                            {lastAudit.score}
                                                                        </span>
                                                                        <span className="text-[12px] text-muted-foreground">/100</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[12px] text-muted-foreground">N/A</span>
                                                                )}
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                        }}
                                                                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                                                    >
                                                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Requirements Tab */}
                        {activeTab === "requirements" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-[13px] text-muted-foreground">
                                        Showing {filteredRequirements.length} of {totalRequirements} requirements
                                    </div>
                                    <button onClick={() => setShowAddRequirement(true)} className="h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer">
                                        <Shield className="w-4 h-4" />
                                        Add Requirement
                                    </button>
                                </div>

                                <div className="bg-white border border-border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-border">
                                                <tr>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Requirement
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Client
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Category
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Status
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Risk
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Progress
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Next Review
                                                    </th>
                                                    <th className="text-right text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {filteredRequirements.map((req) => (
                                                    <tr
                                                        key={req.id}
                                                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                                                        onClick={() => handleRowClick(req, "requirement")}
                                                    >
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] font-[500] text-foreground mb-1">
                                                                {req.title}
                                                            </div>
                                                            <div className="text-[12px] text-muted-foreground line-clamp-1">
                                                                {req.legislation}
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] text-foreground">{req.client}</div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="text-[12px] text-muted-foreground">{req.category}</div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`inline-flex px-2.5 py-1 rounded-md text-[12px] font-[500] border ${getStatusBadgeStyles(
                                                                    req.status
                                                                )}`}
                                                            >
                                                                {req.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`inline-flex px-2.5 py-1 rounded-md text-[12px] font-[500] border ${getRiskBadgeStyles(
                                                                    req.riskLevel
                                                                )}`}
                                                            >
                                                                {req.riskLevel}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[80px]">
                                                                    <div
                                                                        className="h-full bg-indigo-500"
                                                                        style={{ width: `${req.completionRate}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-[13px] font-[500] text-foreground">
                                                                    {req.completionRate}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] text-foreground">
                                                                {formatDate(req.nextReview)}
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                    }}
                                                                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                                                >
                                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Audits Tab */}
                        {activeTab === "audits" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-[13px] text-muted-foreground">
                                        Showing {filteredAudits.length} of {totalAudits} audits
                                    </div>
                                    <button onClick={() => setShowScheduleAudit(true)} className="h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer">
                                        <FileCheck className="w-4 h-4" />
                                        Schedule Audit
                                    </button>
                                </div>

                                <div className="bg-white border border-border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-border">
                                                <tr>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Audit
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Client
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Auditor
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Status
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Scheduled
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Score
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Findings
                                                    </th>
                                                    <th className="text-right text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {filteredAudits.map((audit) => (
                                                    <tr
                                                        key={audit.id}
                                                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                                                        onClick={() => handleRowClick(audit, "audit")}
                                                    >
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] font-[500] text-foreground mb-1">
                                                                {audit.title}
                                                            </div>
                                                            <div className="text-[12px] text-muted-foreground">{audit.type}</div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] text-foreground">{audit.client}</div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] text-foreground">{audit.auditor}</div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`inline-flex px-2.5 py-1 rounded-md text-[12px] font-[500] border ${getAuditStatusBadgeStyles(
                                                                    audit.status
                                                                )}`}
                                                            >
                                                                {audit.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] text-foreground">
                                                                {formatDate(audit.scheduledDate)}
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {audit.score !== undefined ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[13px] font-[600] text-foreground">
                                                                        {audit.score}
                                                                    </span>
                                                                    <span className="text-[12px] text-muted-foreground">/100</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[12px] text-muted-foreground">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[13px] text-foreground">{audit.findings}</span>
                                                                {audit.criticalFindings > 0 && (
                                                                    <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-[500] bg-red-50 text-red-700">
                                                                        {audit.criticalFindings} critical
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                    }}
                                                                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                                                >
                                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Gaps Tab */}
                        {activeTab === "gaps" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-[13px] text-muted-foreground">
                                        Showing {filteredGaps.length} of {totalGaps} compliance gaps
                                    </div>
                                    <button className="h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Report Gap
                                    </button>
                                </div>

                                <div className="bg-white border border-border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-border">
                                                <tr>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Gap
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Client
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Category
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Severity
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Status
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Assigned To
                                                    </th>
                                                    <th className="text-left text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Due Date
                                                    </th>
                                                    <th className="text-right text-[12px] font-[600] text-muted-foreground px-5 py-3">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {filteredGaps.map((gap) => (
                                                    <tr
                                                        key={gap.id}
                                                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                                                        onClick={() => handleRowClick(gap, "gap")}
                                                    >
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] font-[500] text-foreground mb-1">
                                                                {gap.title}
                                                            </div>
                                                            <div className="text-[12px] text-muted-foreground line-clamp-1">
                                                                {gap.description}
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] text-foreground">{gap.client}</div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="text-[12px] text-muted-foreground">{gap.category}</div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`inline-flex px-2.5 py-1 rounded-md text-[12px] font-[500] border ${getRiskBadgeStyles(
                                                                    gap.severity
                                                                )}`}
                                                            >
                                                                {gap.severity}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`inline-flex px-2.5 py-1 rounded-md text-[12px] font-[500] border ${getGapStatusBadgeStyles(
                                                                    gap.status
                                                                )}`}
                                                            >
                                                                {gap.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] text-foreground">{gap.assignedTo}</div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] text-foreground">
                                                                {formatDate(gap.dueDate)}
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                    }}
                                                                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                                                >
                                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Risk Assessment Tab */}
                        {activeTab === "risk" && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Risk Radar */}
                                    <div className="bg-slate-50 rounded-lg p-5 border border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground mb-4">
                                            Multi-Client Risk Assessment
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300} minWidth={0}>
                                            <RadarChart data={riskRadarData}>
                                                <PolarGrid stroke="#E2E8F0" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                                                <PolarRadiusAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                                                <Radar
                                                    name="Crestfield Tech"
                                                    dataKey="client1"
                                                    stroke="#6366F1"
                                                    fill="#6366F1"
                                                    fillOpacity={0.4}
                                                />
                                                <Radar
                                                    name="Harbour Fresh"
                                                    dataKey="client2"
                                                    stroke="#10B981"
                                                    fill="#10B981"
                                                    fillOpacity={0.4}
                                                />
                                                <Radar
                                                    name="Stronghold"
                                                    dataKey="client3"
                                                    stroke="#F59E0B"
                                                    fill="#F59E0B"
                                                    fillOpacity={0.4}
                                                />
                                                <Legend wrapperStyle={{ fontSize: "12px" }} />
                                                <Tooltip
                                                    contentStyle={{
                                                        fontSize: "12px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #E2E8F0",
                                                    }}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Audit Scores */}
                                    <div className="bg-slate-50 rounded-lg p-5 border border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground mb-4">
                                            Latest Audit Scores by Client
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300} minWidth={0}>
                                            <BarChart data={auditScoreData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                                                <YAxis type="category" dataKey="client" tick={{ fontSize: 11 }} width={120} />
                                                <Tooltip
                                                    contentStyle={{
                                                        fontSize: "12px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #E2E8F0",
                                                    }}
                                                />
                                                <Bar dataKey="score" fill="#6366F1" radius={[0, 4, 4, 0]}>
                                                    {auditScoreData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.score >= 80 ? "#10B981" : entry.score >= 60 ? "#F59E0B" : "#EF4444"}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Risk Matrix */}
                                <div className="bg-white border border-border rounded-lg p-6">
                                    <h3 className="text-[15px] font-[600] text-foreground mb-4">
                                        Risk Heat Map by Category
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {categories.slice(1, 7).map((category) => {
                                            const categoryReqs = COMPLIANCE_REQUIREMENTS.filter((r) => r.category === category);
                                            const critical = categoryReqs.filter((r) => r.riskLevel === "Critical").length;
                                            const high = categoryReqs.filter((r) => r.riskLevel === "High").length;
                                            const medium = categoryReqs.filter((r) => r.riskLevel === "Medium").length;
                                            const low = categoryReqs.filter((r) => r.riskLevel === "Low").length;
                                            const total = categoryReqs.length;

                                            const riskScore = (critical * 4 + high * 3 + medium * 2 + low * 1) / (total * 4) * 100;

                                            return (
                                                <div key={category} className="border border-border rounded-lg p-4">
                                                    <div className="text-[13px] font-[600] text-foreground mb-3">
                                                        {category}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-[12px]">
                                                            <span className="text-muted-foreground">Critical</span>
                                                            <span className="font-[500] text-red-700">{critical}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-[12px]">
                                                            <span className="text-muted-foreground">High</span>
                                                            <span className="font-[500] text-orange-700">{high}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-[12px]">
                                                            <span className="text-muted-foreground">Medium</span>
                                                            <span className="font-[500] text-amber-700">{medium}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-[12px]">
                                                            <span className="text-muted-foreground">Low</span>
                                                            <span className="font-[500] text-emerald-700">{low}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t border-border">
                                                        <div className="flex items-center justify-between text-[12px] mb-2">
                                                            <span className="text-muted-foreground">Risk Score</span>
                                                            <span className="font-[600] text-foreground">{Math.round(riskScore)}%</span>
                                                        </div>
                                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${riskScore >= 75
                                                                        ? "bg-red-500"
                                                                        : riskScore >= 50
                                                                            ? "bg-orange-500"
                                                                            : riskScore >= 25
                                                                                ? "bg-amber-500"
                                                                                : "bg-emerald-500"
                                                                    }`}
                                                                style={{ width: `${riskScore}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reports Tab */}
                        {activeTab === "reports" && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        {
                                            title: "Full Compliance Report",
                                            description: "Comprehensive compliance status across all clients and categories",
                                            icon: FileText,
                                            color: "indigo",
                                        },
                                        {
                                            title: "Audit Summary Report",
                                            description: "Summary of all completed audits with scores and findings",
                                            icon: FileCheck,
                                            color: "blue",
                                        },
                                        {
                                            title: "Compliance Gaps Report",
                                            description: "Detailed report of all open compliance gaps and remediation plans",
                                            icon: AlertTriangle,
                                            color: "red",
                                        },
                                        {
                                            title: "Risk Assessment Report",
                                            description: "Risk analysis across all compliance categories and clients",
                                            icon: Target,
                                            color: "amber",
                                        },
                                        {
                                            title: "WRC Compliance Report",
                                            description: "Workplace Relations Commission compliance status and obligations",
                                            icon: Scale,
                                            color: "emerald",
                                        },
                                        {
                                            title: "H&S Audit Report",
                                            description: "Health & Safety compliance and HSA inspection readiness",
                                            icon: HardHat,
                                            color: "orange",
                                        },
                                    ].map((report, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-border rounded-lg p-5 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
                                        >
                                            <div className={`w-10 h-10 rounded-lg bg-${report.color}-50 flex items-center justify-center mb-4`}>
                                                <report.icon className={`w-5 h-5 text-${report.color}-600`} />
                                            </div>
                                            <h3 className="text-[14px] font-[600] text-foreground mb-2">
                                                {report.title}
                                            </h3>
                                            <p className="text-[12px] text-muted-foreground mb-4">
                                                {report.description}
                                            </p>
                                            <button className="w-full h-9 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors flex items-center justify-center gap-2">
                                                <Download className="w-4 h-4" />
                                                Generate Report
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Legislation Guide Tab */}
                        {activeTab === "legislation" && (
                            <div className="space-y-4">
                                {[
                                    {
                                        title: "GDPR / Data Protection Act 2018",
                                        description: "EU General Data Protection Regulation and Irish Data Protection Act 2018",
                                        category: "GDPR & Data Protection",
                                        keyRequirements: [
                                            "Data Protection Impact Assessments (DPIA) for high-risk processing",
                                            "Data Subject Access Requests (DSAR) — 30-day response time",
                                            "Records of Processing Activities (ROPA)",
                                            "Data breach notification within 72 hours",
                                        ],
                                    },
                                    {
                                        title: "Workplace Relations Act 2015",
                                        description: "Framework for workplace relations and WRC adjudication",
                                        category: "WRC & Employment Law",
                                        keyRequirements: [
                                            "Complaints adjudicated by Workplace Relations Commission (WRC)",
                                            "6-month limitation period for most complaints",
                                            "Written statements of terms of employment required",
                                            "Grievance and disciplinary procedures must comply with SI 146/2000",
                                        ],
                                    },
                                    {
                                        title: "Safety, Health and Welfare at Work Act 2005",
                                        description: "Primary health and safety legislation in Ireland",
                                        category: "Health & Safety",
                                        keyRequirements: [
                                            "Safety Statement required for all employers",
                                            "Risk assessments must be conducted and documented",
                                            "HSA inspections and enforcement powers",
                                            "Employee consultation and training obligations",
                                        ],
                                    },
                                    {
                                        title: "Employment Equality Acts 1998–2015",
                                        description: "Prohibits discrimination on 9 grounds in employment",
                                        category: "Employee Equality",
                                        keyRequirements: [
                                            "9 protected grounds: gender, civil status, family status, age, disability, race, religion, sexual orientation, membership of the Traveller community",
                                            "Reasonable accommodation for employees with disabilities",
                                            "Equal pay for like work",
                                            "Harassment and sexual harassment policies required",
                                        ],
                                    },
                                    {
                                        title: "Organisation of Working Time Act 1997",
                                        description: "Regulates working hours, rest breaks, and annual leave",
                                        category: "Working Time",
                                        keyRequirements: [
                                            "Maximum 48-hour average working week",
                                            "Rest breaks: 15 min after 4.5 hrs, 30 min after 6 hrs",
                                            "11 consecutive hours rest in 24-hour period",
                                            "4 weeks annual leave minimum",
                                        ],
                                    },
                                    {
                                        title: "Industrial Relations Acts 1946–2015",
                                        description: "Framework for collective bargaining and industrial relations",
                                        category: "Industrial Relations",
                                        keyRequirements: [
                                            "Collective bargaining and trade union recognition",
                                            "Labour Court conciliation and adjudication",
                                            "Registered employment agreements (REAs)",
                                            "Sectoral Employment Orders (SEOs)",
                                        ],
                                    },
                                    {
                                        title: "Terms of Employment (Information) Act 1994–2014",
                                        description: "Requires written statement of terms of employment",
                                        category: "WRC & Employment Law",
                                        keyRequirements: [
                                            "Written statement within 5 days (core terms)",
                                            "Full written statement within 2 months",
                                            "Must include job title, pay, hours, holidays, notice periods",
                                            "Changes must be notified in writing within 1 month",
                                        ],
                                    },
                                    {
                                        title: "National Minimum Wage Act 2000",
                                        description: "Sets minimum wage rates for employees",
                                        category: "Payroll & Revenue",
                                        keyRequirements: [
                                            "€12.70/hour for experienced adults (2024 rate)",
                                            "Sub-minimum rates for under-18s and first 2 years of employment",
                                            "NERA enforcement and inspections",
                                            "Payslips must clearly show hours and pay rates",
                                        ],
                                    },
                                ].map((legislation, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-border rounded-lg p-5 hover:border-indigo-200 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-[14px] font-[600] text-foreground mb-1">
                                                    {legislation.title}
                                                </h3>
                                                <p className="text-[12px] text-muted-foreground mb-3">
                                                    {legislation.description}
                                                </p>
                                                <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-[500] bg-slate-100 text-slate-700">
                                                    {legislation.category}
                                                </span>
                                            </div>
                                            <button className="ml-4 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <div className="text-[12px] font-[600] text-foreground mb-2">
                                                Key Requirements
                                            </div>
                                            <ul className="space-y-1.5">
                                                {legislation.keyRequirements.map((req, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Slide-Out Panel */}
            {detailPanelItem && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-end">
                    <div
                        className="absolute inset-0"
                        onClick={handleCloseDetailPanel}
                    />
                    <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    {detailPanelType === "requirement" && <Shield className="w-5 h-5 text-indigo-600" />}
                                    {detailPanelType === "audit" && <FileCheck className="w-5 h-5 text-indigo-600" />}
                                    {detailPanelType === "gap" && <AlertTriangle className="w-5 h-5 text-indigo-600" />}
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-[600] text-foreground">
                                        {detailPanelType === "requirement" && "Compliance Requirement"}
                                        {detailPanelType === "audit" && "Audit Details"}
                                        {detailPanelType === "gap" && "Compliance Gap"}
                                    </h2>
                                    <p className="text-[12px] text-muted-foreground">
                                        {detailPanelItem.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseDetailPanel}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Requirement Details */}
                            {detailPanelType === "requirement" && (
                                <>
                                    <div>
                                        <div className="text-[18px] font-[600] text-foreground mb-2">
                                            {detailPanelItem.title}
                                        </div>
                                        <p className="text-[13px] text-muted-foreground leading-relaxed">
                                            {detailPanelItem.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Status
                                            </div>
                                            <span
                                                className={`inline-flex px-3 py-1.5 rounded-md text-[13px] font-[500] border ${getStatusBadgeStyles(
                                                    detailPanelItem.status
                                                )}`}
                                            >
                                                {detailPanelItem.status}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Risk Level
                                            </div>
                                            <span
                                                className={`inline-flex px-3 py-1.5 rounded-md text-[13px] font-[500] border ${getRiskBadgeStyles(
                                                    detailPanelItem.riskLevel
                                                )}`}
                                            >
                                                {detailPanelItem.riskLevel}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[12px] font-[500] text-muted-foreground mb-2">
                                            Completion Progress
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500"
                                                    style={{ width: `${detailPanelItem.completionRate}%` }}
                                                />
                                            </div>
                                            <span className="text-[14px] font-[600] text-foreground">
                                                {detailPanelItem.completionRate}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Client
                                            </div>
                                            <div className="text-[13px] text-foreground">{detailPanelItem.client}</div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Category
                                            </div>
                                            <div className="text-[13px] text-foreground">{detailPanelItem.category}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                            Legislation
                                        </div>
                                        <div className="text-[13px] text-foreground bg-slate-50 px-3 py-2 rounded-lg border border-border">
                                            {detailPanelItem.legislation}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Owner
                                            </div>
                                            <div className="text-[13px] text-foreground">{detailPanelItem.owner}</div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Action Items
                                            </div>
                                            <div className="text-[13px] text-foreground">{detailPanelItem.actionItems}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Last Reviewed
                                            </div>
                                            <div className="text-[13px] text-foreground">
                                                {formatDate(detailPanelItem.lastReviewed)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Next Review
                                            </div>
                                            <div className="text-[13px] text-foreground">
                                                {formatDate(detailPanelItem.nextReview)}
                                            </div>
                                        </div>
                                    </div>

                                    {detailPanelItem.notes && (
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Notes
                                            </div>
                                            <div className="text-[13px] text-muted-foreground bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                                {detailPanelItem.notes}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4 border-t border-border">
                                        <button onClick={() => setShowEditRequirement(true)} className="flex-1 h-10 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors cursor-pointer flex items-center justify-center gap-2">
                                            <Pencil className="w-4 h-4" />
                                            Edit Requirement
                                        </button>
                                        <button className="flex-1 h-10 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer">
                                            Mark Compliant
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Audit Details */}
                            {detailPanelType === "audit" && (
                                <>
                                    <div>
                                        <div className="text-[18px] font-[600] text-foreground mb-2">
                                            {detailPanelItem.title}
                                        </div>
                                        <p className="text-[13px] text-muted-foreground">
                                            {detailPanelItem.type}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Status
                                            </div>
                                            <span
                                                className={`inline-flex px-3 py-1.5 rounded-md text-[13px] font-[500] border ${getAuditStatusBadgeStyles(
                                                    detailPanelItem.status
                                                )}`}
                                            >
                                                {detailPanelItem.status}
                                            </span>
                                        </div>
                                        {detailPanelItem.score !== undefined && (
                                            <div>
                                                <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                    Audit Score
                                                </div>
                                                <div className="text-[24px] font-[700] text-foreground">
                                                    {detailPanelItem.score}<span className="text-[14px] text-muted-foreground">/100</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Client
                                            </div>
                                            <div className="text-[13px] text-foreground">{detailPanelItem.client}</div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Auditor
                                            </div>
                                            <div className="text-[13px] text-foreground">{detailPanelItem.auditor}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Scheduled Date
                                            </div>
                                            <div className="text-[13px] text-foreground">
                                                {formatDate(detailPanelItem.scheduledDate)}
                                            </div>
                                        </div>
                                        {detailPanelItem.completedDate && (
                                            <div>
                                                <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                    Completed Date
                                                </div>
                                                <div className="text-[13px] text-foreground">
                                                    {formatDate(detailPanelItem.completedDate)}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Total Findings
                                            </div>
                                            <div className="text-[20px] font-[700] text-foreground">
                                                {detailPanelItem.findings}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Critical Findings
                                            </div>
                                            <div className="text-[20px] font-[700] text-red-600">
                                                {detailPanelItem.criticalFindings}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                            Regulatory Reference
                                        </div>
                                        <div className="text-[13px] text-foreground bg-slate-50 px-3 py-2 rounded-lg border border-border">
                                            {detailPanelItem.regulatoryRef}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-border">
                                        <button className="flex-1 h-10 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                            <Download className="w-4 h-4" />
                                            Download Report
                                        </button>
                                        <button onClick={() => setShowViewFindings(true)} className="flex-1 h-10 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer flex items-center justify-center gap-2">
                                            <ClipboardList className="w-4 h-4" />
                                            View Findings
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Gap Details */}
                            {detailPanelType === "gap" && (
                                <>
                                    <div>
                                        <div className="text-[18px] font-[600] text-foreground mb-2">
                                            {detailPanelItem.title}
                                        </div>
                                        <p className="text-[13px] text-muted-foreground leading-relaxed">
                                            {detailPanelItem.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Status
                                            </div>
                                            <span
                                                className={`inline-flex px-3 py-1.5 rounded-md text-[13px] font-[500] border ${getGapStatusBadgeStyles(
                                                    detailPanelItem.status
                                                )}`}
                                            >
                                                {detailPanelItem.status}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Severity
                                            </div>
                                            <span
                                                className={`inline-flex px-3 py-1.5 rounded-md text-[13px] font-[500] border ${getRiskBadgeStyles(
                                                    detailPanelItem.severity
                                                )}`}
                                            >
                                                {detailPanelItem.severity}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Client
                                            </div>
                                            <div className="text-[13px] text-foreground">{detailPanelItem.client}</div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Category
                                            </div>
                                            <div className="text-[13px] text-foreground">{detailPanelItem.category}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                            Legislation
                                        </div>
                                        <div className="text-[13px] text-foreground bg-slate-50 px-3 py-2 rounded-lg border border-border">
                                            {detailPanelItem.legislation}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Identified
                                            </div>
                                            <div className="text-[13px] text-foreground">
                                                {formatDate(detailPanelItem.identifiedDate)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                                Due Date
                                            </div>
                                            <div className="text-[13px] text-foreground">
                                                {formatDate(detailPanelItem.dueDate)}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                            Assigned To
                                        </div>
                                        <div className="text-[13px] text-foreground">{detailPanelItem.assignedTo}</div>
                                    </div>

                                    {detailPanelItem.remediationPlan && (
                                        <div>
                                            <div className="text-[12px] font-[500] text-muted-foreground mb-2">
                                                Remediation Plan
                                            </div>
                                            <div className="text-[13px] text-foreground bg-blue-50 px-4 py-3 rounded-lg border border-blue-200 leading-relaxed">
                                                {detailPanelItem.remediationPlan}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4 border-t border-border">
                                        <button onClick={() => setShowEditGap(true)} className="flex-1 h-10 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors cursor-pointer flex items-center justify-center gap-2">
                                            <Pencil className="w-4 h-4" />
                                            Edit Gap
                                        </button>
                                        <button className="flex-1 h-10 px-4 rounded-lg text-[13px] font-[500] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer">
                                            Mark Resolved
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showScheduleAudit && <ScheduleAuditModal onClose={() => setShowScheduleAudit(false)} />}
            {showAddRequirement && <RequirementModal onClose={() => setShowAddRequirement(false)} />}
            {showEditRequirement && detailPanelItem && detailPanelType === "requirement" && (
                <RequirementModal existing={detailPanelItem as ComplianceRequirement} onClose={() => setShowEditRequirement(false)} />
            )}
            {showViewFindings && detailPanelItem && detailPanelType === "audit" && (
                <ViewFindingsModal audit={detailPanelItem as AuditRecord} onClose={() => setShowViewFindings(false)} />
            )}
            {showEditGap && detailPanelItem && detailPanelType === "gap" && (
                <EditGapModal gap={detailPanelItem as ComplianceGap} onClose={() => setShowEditGap(false)} />
            )}
        </div>
    );
}
