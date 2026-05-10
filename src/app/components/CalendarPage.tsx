import { useState, useMemo } from "react";
import {
    Calendar as CalendarIcon,
    Clock,
    Users,
    Building2,
    MapPin,
    Search,
    X,
    Filter,
    ChevronLeft,
    ChevronRight,
    Plus,
    Video,
    Phone,
    Mail,
    FileText,
    AlertCircle,
    CheckCircle2,
    Scale,
    Shield,
    HardHat,
    Briefcase,
    Target,
    TrendingUp,
    Download,
    ChevronDown,
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    ExternalLink,
    Activity,
    Save,
    Bell,
    BellOff,
    Link,
    Palette,
    UserPlus,
    XCircle,
} from "lucide-react";
import { mockClients } from "./mock-data";
import type { Client } from "./mock-data";

/* ===== Constants ===== */
const NOW = new Date("2026-02-06T12:00:00Z");
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

/* ===== Types & Interfaces ===== */

type EventType =
    | "Client Meeting"
    | "Audit"
    | "WRC Hearing"
    | "HSA Inspection"
    | "Compliance Deadline"
    | "Training Session"
    | "Internal Review"
    | "Public Holiday"
    | "Court Date"
    | "Consultation"
    | "Site Visit";

type EventStatus = "Scheduled" | "Confirmed" | "Tentative" | "Completed" | "Cancelled";

interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    type: EventType;
    status: EventStatus;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location: string;
    locationType: "In-Person" | "Virtual" | "Hybrid" | "Phone" | "N/A";
    client?: string;
    clientId?: string;
    attendees: string[];
    organizer: string;
    meetingLink?: string;
    notes?: string;
    reminderSet: boolean;
    regulatoryRef?: string;
    color: string;
}

/* ===== Mock Data ===== */

const CALENDAR_EVENTS: CalendarEvent[] = [
    // February 2026
    {
        id: "EVT-001",
        title: "Monthly Advisory Review — Crestfield Tech",
        description: "Discuss Q1 compliance priorities, GDPR DPIA progress, and Working Time Act policy update",
        type: "Client Meeting",
        status: "Confirmed",
        startDate: "2026-02-10",
        startTime: "10:00",
        endDate: "2026-02-10",
        endTime: "11:30",
        location: "Crestfield Tech HQ, Fitzwilliam Square, Dublin 2",
        locationType: "In-Person",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        attendees: ["Aoife Brennan", "Cian Murphy", "Siobhán Doyle", "Niamh Kavanagh"],
        organizer: "Aoife Brennan",
        notes: "Bring updated compliance matrix and DPIA draft for review",
        reminderSet: true,
        color: "#6366F1",
    },
    {
        id: "EVT-002",
        title: "HSA Site Inspection — Stronghold Waterford",
        description: "Health & Safety Authority inspection of Waterford construction site",
        type: "HSA Inspection",
        status: "Confirmed",
        startDate: "2026-02-15",
        startTime: "09:00",
        endDate: "2026-02-15",
        endTime: "14:00",
        location: "Stronghold Construction Site, Waterford City",
        locationType: "In-Person",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        attendees: ["Declan Byrne", "Shane Nolan (H&S Manager)", "HSA Inspector"],
        organizer: "Declan Byrne",
        notes: "Safety Statement and risk assessments must be ready; site managers briefed",
        reminderSet: true,
        regulatoryRef: "Safety, Health and Welfare at Work Act 2005",
        color: "#F59E0B",
    },
    {
        id: "EVT-003",
        title: "SIPTU Collective Agreement Negotiation",
        description: "Second round of collective bargaining negotiations with SIPTU representative",
        type: "Consultation",
        status: "Scheduled",
        startDate: "2026-02-18",
        startTime: "14:00",
        endDate: "2026-02-18",
        endTime: "16:00",
        location: "Harbour Fresh HQ, Marina Commercial Park, Cork",
        locationType: "In-Person",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        attendees: ["Saoirse O'Neill", "Deirdre Lynch", "Padraig O'Sullivan", "John Healy (SIPTU)"],
        organizer: "Saoirse O'Neill",
        notes: "Review draft agreement terms; aim to finalise pay and conditions clauses",
        reminderSet: true,
        regulatoryRef: "Industrial Relations Acts 1946–2015",
        color: "#10B981",
    },
    {
        id: "EVT-004",
        title: "WRC Compliance Review — Crestfield Tech",
        description: "Quarterly Workplace Relations Commission compliance review and gap analysis",
        type: "Audit",
        status: "Scheduled",
        startDate: "2026-02-20",
        startTime: "10:00",
        endDate: "2026-02-20",
        endTime: "13:00",
        location: "Virtual Meeting",
        locationType: "Virtual",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        attendees: ["Aoife Brennan", "Siobhán Doyle"],
        organizer: "Aoife Brennan",
        meetingLink: "https://teams.microsoft.com/meet/wrc-review-q1",
        notes: "Review all WRC obligations and recent adjudication precedents",
        reminderSet: true,
        regulatoryRef: "Workplace Relations Act 2015",
        color: "#8B5CF6",
    },
    {
        id: "EVT-005",
        title: "Employment Law Update Webinar",
        description: "Internal training on recent WRC adjudications and 2026 legislative updates",
        type: "Training Session",
        status: "Confirmed",
        startDate: "2026-02-25",
        startTime: "09:30",
        endDate: "2026-02-25",
        endTime: "11:00",
        location: "Virtual Webinar",
        locationType: "Virtual",
        attendees: ["Aoife Brennan", "Cian Murphy", "Saoirse O'Neill", "Declan Byrne"],
        organizer: "Cian Murphy",
        meetingLink: "https://zoom.us/j/employment-law-update-2026",
        notes: "Mandatory for all advisors; CPD credits available",
        reminderSet: true,
        color: "#3B82F6",
    },
    {
        id: "EVT-006",
        title: "GDPR DPIA Sign-Off Meeting",
        description: "Final review and sign-off of Data Protection Impact Assessment for HR systems",
        type: "Compliance Deadline",
        status: "Scheduled",
        startDate: "2026-02-28",
        startTime: "15:00",
        endDate: "2026-02-28",
        endTime: "16:00",
        location: "Virtual Meeting",
        locationType: "Virtual",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        attendees: ["Cian Murphy", "Siobhán Doyle", "Ronan Walsh (CFO)"],
        organizer: "Cian Murphy",
        meetingLink: "https://teams.microsoft.com/meet/dpia-signoff",
        notes: "DPIA must be finalised today — deadline is EOD",
        reminderSet: true,
        regulatoryRef: "GDPR Article 35 / Data Protection Act 2018",
        color: "#EF4444",
    },
    // March 2026
    {
        id: "EVT-007",
        title: "Q1 Client Portfolio Review",
        description: "Internal review of all client engagements, compliance status, and renewal pipeline",
        type: "Internal Review",
        status: "Scheduled",
        startDate: "2026-03-05",
        startTime: "10:00",
        endDate: "2026-03-05",
        endTime: "12:00",
        location: "Office — Dublin HQ",
        locationType: "In-Person",
        attendees: ["Aoife Brennan", "Cian Murphy", "Saoirse O'Neill", "Declan Byrne"],
        organizer: "Aoife Brennan",
        notes: "Review KPIs, client health scores, and upcoming renewals",
        reminderSet: true,
        color: "#6366F1",
    },
    {
        id: "EVT-008",
        title: "Crestfield Tech Contract Renewal Discussion",
        description: "Discuss contract renewal terms and scope for 2026–2028 period",
        type: "Client Meeting",
        status: "Tentative",
        startDate: "2026-03-13",
        startTime: "14:00",
        endDate: "2026-03-13",
        endTime: "15:30",
        location: "Crestfield Tech HQ, Fitzwilliam Square, Dublin 2",
        locationType: "In-Person",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        attendees: ["Aoife Brennan", "Cian Murphy", "Eoin Gallagher (CEO)", "Siobhán Doyle"],
        organizer: "Aoife Brennan",
        notes: "Prepare renewal proposal and pricing options; highlight Q4 2025 & Q1 2026 achievements",
        reminderSet: true,
        color: "#6366F1",
    },
    {
        id: "EVT-009",
        title: "SIPTU Agreement Finalisation",
        description: "Final negotiation session to close collective agreement with SIPTU",
        type: "Consultation",
        status: "Scheduled",
        startDate: "2026-03-12",
        startTime: "10:00",
        endDate: "2026-03-12",
        endTime: "13:00",
        location: "Harbour Fresh HQ, Marina Commercial Park, Cork",
        locationType: "In-Person",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        attendees: ["Saoirse O'Neill", "Deirdre Lynch", "John Healy (SIPTU)"],
        organizer: "Saoirse O'Neill",
        notes: "Agreement must be finalised before 15 March expiry",
        reminderSet: true,
        regulatoryRef: "Industrial Relations Acts 1946–2015",
        color: "#10B981",
    },
    {
        id: "EVT-010",
        title: "St. Patrick's Day",
        description: "National Public Holiday — Office Closed",
        type: "Public Holiday",
        status: "Confirmed",
        startDate: "2026-03-17",
        startTime: "00:00",
        endDate: "2026-03-17",
        endTime: "23:59",
        location: "N/A",
        locationType: "N/A",
        attendees: [],
        organizer: "System",
        notes: "National public holiday — no client meetings scheduled",
        reminderSet: false,
        color: "#10B981",
    },
    {
        id: "EVT-011",
        title: "Stronghold H&S Policy Review",
        description: "Review updated Health & Safety policies post-HSA inspection",
        type: "Client Meeting",
        status: "Scheduled",
        startDate: "2026-03-20",
        startTime: "11:00",
        endDate: "2026-03-20",
        endTime: "12:30",
        location: "Virtual Meeting",
        locationType: "Virtual",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        attendees: ["Declan Byrne", "Karen Molloy", "Shane Nolan"],
        organizer: "Declan Byrne",
        meetingLink: "https://teams.microsoft.com/meet/stronghold-hs-review",
        notes: "Review post-inspection remediation and policy updates",
        reminderSet: true,
        color: "#F59E0B",
    },
    {
        id: "EVT-012",
        title: "GDPR Data Processing Audit — Crestfield Tech",
        description: "Scheduled GDPR data processing compliance audit",
        type: "Audit",
        status: "Scheduled",
        startDate: "2026-03-15",
        startTime: "09:00",
        endDate: "2026-03-15",
        endTime: "12:00",
        location: "Crestfield Tech HQ, Fitzwilliam Square, Dublin 2",
        locationType: "In-Person",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        attendees: ["Cian Murphy", "Siobhán Doyle"],
        organizer: "Cian Murphy",
        notes: "Audit all data processing activities and controller-processor agreements",
        reminderSet: true,
        regulatoryRef: "GDPR / Data Protection Act 2018",
        color: "#8B5CF6",
    },
    // April 2026
    {
        id: "EVT-013",
        title: "Q2 Compliance Planning Session",
        description: "Plan Q2 compliance activities, audits, and client reviews",
        type: "Internal Review",
        status: "Scheduled",
        startDate: "2026-04-02",
        startTime: "14:00",
        endDate: "2026-04-02",
        endTime: "16:00",
        location: "Office — Dublin HQ",
        locationType: "In-Person",
        attendees: ["Aoife Brennan", "Cian Murphy", "Saoirse O'Neill", "Declan Byrne"],
        organizer: "Aoife Brennan",
        notes: "Set Q2 priorities and allocate audit schedule",
        reminderSet: true,
        color: "#6366F1",
    },
    {
        id: "EVT-014",
        title: "Harbour Fresh Site Visit — Midleton",
        description: "Site visit to Midleton facility to review workforce planning and seasonal staffing",
        type: "Site Visit",
        status: "Scheduled",
        startDate: "2026-04-08",
        startTime: "10:00",
        endDate: "2026-04-08",
        endTime: "14:00",
        location: "Harbour Fresh Midleton Facility, Co. Cork",
        locationType: "In-Person",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        attendees: ["Saoirse O'Neill", "Padraig O'Sullivan"],
        organizer: "Saoirse O'Neill",
        notes: "Review production schedule and seasonal worker compliance",
        reminderSet: true,
        color: "#10B981",
    },
    {
        id: "EVT-015",
        title: "WRC Adjudication Hearing — Stronghold",
        description: "WRC hearing for unfair dismissal claim — observer attendance",
        type: "WRC Hearing",
        status: "Confirmed",
        startDate: "2026-04-14",
        startTime: "10:30",
        endDate: "2026-04-14",
        endTime: "15:00",
        location: "WRC Offices, O'Brien Road, Carlow",
        locationType: "In-Person",
        client: "Stronghold Construction Group Ltd",
        clientId: "CLT-003",
        attendees: ["Aoife Brennan", "Karen Molloy", "Legal Counsel"],
        organizer: "Aoife Brennan",
        notes: "Provide HR advisory support; legal counsel will represent",
        reminderSet: true,
        regulatoryRef: "Unfair Dismissals Acts 1977–2015",
        color: "#EF4444",
    },
    {
        id: "EVT-016",
        title: "Easter Monday",
        description: "National Public Holiday — Office Closed",
        type: "Public Holiday",
        status: "Confirmed",
        startDate: "2026-04-06",
        startTime: "00:00",
        endDate: "2026-04-06",
        endTime: "23:59",
        location: "N/A",
        locationType: "N/A",
        attendees: [],
        organizer: "System",
        notes: "National public holiday — no client meetings scheduled",
        reminderSet: false,
        color: "#10B981",
    },
    {
        id: "EVT-017",
        title: "Employment Equality Compliance Review",
        description: "Review all client policies for Employment Equality Acts compliance",
        type: "Audit",
        status: "Scheduled",
        startDate: "2026-04-22",
        startTime: "09:00",
        endDate: "2026-04-22",
        endTime: "12:00",
        location: "Virtual Meeting",
        locationType: "Virtual",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        attendees: ["Aoife Brennan", "Siobhán Doyle"],
        organizer: "Aoife Brennan",
        meetingLink: "https://teams.microsoft.com/meet/equality-review",
        notes: "Review recruitment, promotion, and pay equity policies",
        reminderSet: true,
        regulatoryRef: "Employment Equality Acts 1998–2015",
        color: "#8B5CF6",
    },
    // January 2026 (past events)
    {
        id: "EVT-018",
        title: "New Year's Day",
        description: "National Public Holiday — Office Closed",
        type: "Public Holiday",
        status: "Completed",
        startDate: "2026-01-01",
        startTime: "00:00",
        endDate: "2026-01-01",
        endTime: "23:59",
        location: "N/A",
        locationType: "N/A",
        attendees: [],
        organizer: "System",
        notes: "National public holiday",
        reminderSet: false,
        color: "#10B981",
    },
    {
        id: "EVT-019",
        title: "Monthly Advisory Review — Crestfield Tech",
        description: "January monthly review completed",
        type: "Client Meeting",
        status: "Completed",
        startDate: "2026-01-28",
        startTime: "10:00",
        endDate: "2026-01-28",
        endTime: "11:00",
        location: "Virtual Meeting",
        locationType: "Virtual",
        client: "Crestfield Technologies DAC",
        clientId: "CLT-001",
        attendees: ["Aoife Brennan", "Cian Murphy", "Siobhán Doyle"],
        organizer: "Aoife Brennan",
        notes: "Reviewed Q4 2025 compliance gaps and Q1 2026 priorities",
        reminderSet: false,
        color: "#6366F1",
    },
    {
        id: "EVT-020",
        title: "Industrial Relations Compliance Review",
        description: "Completed IR compliance audit for Harbour Fresh",
        type: "Audit",
        status: "Completed",
        startDate: "2026-01-30",
        startTime: "11:00",
        endDate: "2026-01-30",
        endTime: "13:00",
        location: "Harbour Fresh HQ, Cork",
        locationType: "In-Person",
        client: "Harbour Fresh Foods Ltd",
        clientId: "CLT-002",
        attendees: ["Saoirse O'Neill", "Deirdre Lynch"],
        organizer: "Saoirse O'Neill",
        notes: "Audit score: 87/100; 3 findings, 0 critical",
        reminderSet: false,
        regulatoryRef: "Industrial Relations Acts 1946–2015",
        color: "#8B5CF6",
    },
];

/* ===== Helper Functions ===== */

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
}

function getEventTypeColor(type: EventType): string {
    const colors: Record<EventType, string> = {
        "Client Meeting": "#6366F1",
        "Audit": "#8B5CF6",
        "WRC Hearing": "#EF4444",
        "HSA Inspection": "#F59E0B",
        "Compliance Deadline": "#EF4444",
        "Training Session": "#3B82F6",
        "Internal Review": "#6366F1",
        "Public Holiday": "#10B981",
        "Court Date": "#DC2626",
        "Consultation": "#10B981",
        "Site Visit": "#F59E0B",
    };
    return colors[type] || "#6366F1";
}

function getEventTypeIcon(type: EventType) {
    const icons: Record<EventType, any> = {
        "Client Meeting": Users,
        "Audit": FileText,
        "WRC Hearing": Scale,
        "HSA Inspection": HardHat,
        "Compliance Deadline": AlertCircle,
        "Training Session": Target,
        "Internal Review": Briefcase,
        "Public Holiday": CalendarIcon,
        "Court Date": Scale,
        "Consultation": Users,
        "Site Visit": MapPin,
    };
    return icons[type] || CalendarIcon;
}

function getLocationTypeIcon(type: CalendarEvent["locationType"]) {
    const icons = {
        "In-Person": MapPin,
        "Virtual": Video,
        "Hybrid": Video,
        "Phone": Phone,
        "N/A": CalendarIcon,
    };
    return icons[type] || MapPin;
}

function getStatusBadgeStyles(status: EventStatus) {
    const styles = {
        Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
        Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Tentative: "bg-amber-50 text-amber-700 border-amber-200",
        Completed: "bg-slate-50 text-slate-700 border-slate-200",
        Cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return styles[status] || styles.Scheduled;
}

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Monday=0
}

function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

/* ===== Main Component ===== */

interface CalendarPageProps {
    onNavigateToClient?: (client: Client) => void;
}

export function CalendarPage({ onNavigateToClient }: CalendarPageProps) {
    const [currentDate, setCurrentDate] = useState(NOW);
    const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">("month");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEventType, setSelectedEventType] = useState<EventType | "All">("All");
    const [selectedClient, setSelectedClient] = useState<string>("All");
    const [selectedStatus, setSelectedStatus] = useState<EventStatus | "All">("All");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Navigation
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(NOW);
    };

    // Filtered events
    const filteredEvents = useMemo(() => {
        return CALENDAR_EVENTS.filter((event) => {
            const matchesSearch =
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedEventType === "All" || event.type === selectedEventType;
            const matchesClient = selectedClient === "All" || event.client === selectedClient;
            const matchesStatus = selectedStatus === "All" || event.status === selectedStatus;
            return matchesSearch && matchesType && matchesClient && matchesStatus;
        });
    }, [searchQuery, selectedEventType, selectedClient, selectedStatus]);

    // Events by date
    const eventsByDate = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        filteredEvents.forEach((event) => {
            const dateKey = event.startDate;
            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }
            map.get(dateKey)!.push(event);
        });
        return map;
    }, [filteredEvents]);

    // Calendar grid
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);
    const calendarDays: (number | null)[] = [
        ...Array(firstDayOfWeek).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    // KPIs
    const upcomingEvents = CALENDAR_EVENTS.filter(
        (e) => new Date(e.startDate) >= NOW && e.status !== "Completed" && e.status !== "Cancelled"
    );
    const thisWeekEvents = upcomingEvents.filter((e) => {
        const eventDate = new Date(e.startDate);
        const weekFromNow = new Date(NOW);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return eventDate <= weekFromNow;
    });
    const overdueEvents = CALENDAR_EVENTS.filter(
        (e) => new Date(e.startDate) < NOW && e.status !== "Completed" && e.status !== "Cancelled"
    );
    const clientMeetings = upcomingEvents.filter((e) => e.type === "Client Meeting").length;

    const clients = ["All", ...Array.from(new Set(mockClients.map((c) => c.name)))];
    const eventTypes: (EventType | "All")[] = [
        "All",
        "Client Meeting",
        "Audit",
        "WRC Hearing",
        "HSA Inspection",
        "Compliance Deadline",
        "Training Session",
        "Internal Review",
        "Public Holiday",
        "Court Date",
        "Consultation",
        "Site Visit",
    ];

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    const handleCloseEventDetail = () => {
        setSelectedEvent(null);
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
                                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-[24px] font-[700] text-foreground">
                                    Calendar & Events
                                </h1>
                                <p className="text-[13px] text-muted-foreground">
                                    Client meetings, audits, compliance deadlines, and regulatory dates
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="h-9 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export Calendar
                            </button>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Event
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <CalendarIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex items-center gap-1 text-blue-600 text-[12px] font-[500]">
                                <TrendingUp className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">{upcomingEvents.length}</div>
                        <div className="text-[13px] text-muted-foreground">Upcoming Events</div>
                        <div className="text-[12px] text-muted-foreground mt-1">
                            Next 30 days scheduled
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex items-center gap-1 text-indigo-600 text-[12px] font-[500]">
                                <Activity className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">{thisWeekEvents.length}</div>
                        <div className="text-[13px] text-muted-foreground">This Week</div>
                        <div className="text-[12px] text-muted-foreground mt-1">
                            Next 7 days · {clientMeetings} client meetings
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <Users className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 text-[12px] font-[500]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">{clientMeetings}</div>
                        <div className="text-[13px] text-muted-foreground">Client Meetings</div>
                        <div className="text-[12px] text-muted-foreground mt-1">
                            Upcoming scheduled meetings
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex items-center gap-1 text-red-600 text-[12px] font-[500]">
                                {overdueEvents.length > 0 && <AlertCircle className="w-3.5 h-3.5" />}
                            </div>
                        </div>
                        <div className="text-[28px] font-[700] text-foreground">{overdueEvents.length}</div>
                        <div className="text-[13px] text-muted-foreground">Overdue Items</div>
                        <div className="text-[12px] text-muted-foreground mt-1">
                            Require immediate attention
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
                                placeholder="Search events, meetings, deadlines..."
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
                            {(selectedEventType !== "All" ||
                                selectedClient !== "All" ||
                                selectedStatus !== "All") && (
                                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-[600] flex items-center justify-center">
                                        {[selectedEventType, selectedClient, selectedStatus].filter((f) => f !== "All")
                                            .length}
                                    </span>
                                )}
                        </button>
                        <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                            {(["month", "week", "day", "agenda"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-3 h-10 text-[13px] font-[500] capitalize transition-colors ${viewMode === mode
                                            ? "bg-indigo-600 text-white"
                                            : "bg-background text-muted-foreground hover:bg-accent"
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[12px] font-[500] text-muted-foreground mb-1.5 block">
                                    Event Type
                                </label>
                                <select
                                    value={selectedEventType}
                                    onChange={(e) => setSelectedEventType(e.target.value as any)}
                                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {eventTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
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
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Tentative">Tentative</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Calendar Navigation */}
                <div className="bg-white rounded-xl border border-border mb-6">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={goToToday}
                                className="h-9 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors"
                            >
                                Today
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={goToPreviousMonth}
                                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                                </button>
                                <button
                                    onClick={goToNextMonth}
                                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                            <h2 className="text-[18px] font-[600] text-foreground">
                                {MONTHS[currentMonth]} {currentYear}
                            </h2>
                        </div>
                        <div className="text-[13px] text-muted-foreground">
                            {filteredEvents.length} events this month
                        </div>
                    </div>

                    {/* Month View */}
                    {viewMode === "month" && (
                        <div className="p-6">
                            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                                {/* Day headers */}
                                {DAYS_OF_WEEK.map((day) => (
                                    <div
                                        key={day}
                                        className="bg-slate-50 px-3 py-2 text-center text-[12px] font-[600] text-muted-foreground"
                                    >
                                        {day}
                                    </div>
                                ))}
                                {/* Calendar days */}
                                {calendarDays.map((day, index) => {
                                    if (day === null) {
                                        return <div key={`empty-${index}`} className="bg-slate-50 min-h-[120px]" />;
                                    }

                                    const dateKey = `${currentYear}-${(currentMonth + 1)
                                        .toString()
                                        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                                    const dayEvents = eventsByDate.get(dateKey) || [];
                                    const cellDate = new Date(currentYear, currentMonth, day);
                                    const isToday = isSameDay(cellDate, NOW);

                                    return (
                                        <div
                                            key={dateKey}
                                            className={`bg-white min-h-[120px] p-2 border-l border-t border-border ${isToday ? "ring-2 ring-indigo-600 ring-inset" : ""
                                                }`}
                                        >
                                            <div
                                                className={`text-[13px] font-[600] mb-2 ${isToday
                                                        ? "w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center"
                                                        : "text-foreground"
                                                    }`}
                                            >
                                                {day}
                                            </div>
                                            <div className="space-y-1">
                                                {dayEvents.slice(0, 3).map((event) => {
                                                    const Icon = getEventTypeIcon(event.type);
                                                    return (
                                                        <button
                                                            key={event.id}
                                                            onClick={() => handleEventClick(event)}
                                                            className="w-full text-left px-2 py-1 rounded text-[11px] font-[500] truncate hover:opacity-80 transition-opacity"
                                                            style={{
                                                                backgroundColor: `${event.color}15`,
                                                                color: event.color,
                                                                borderLeft: `3px solid ${event.color}`,
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-1.5">
                                                                <Icon className="w-3 h-3 flex-shrink-0" />
                                                                <span className="truncate">
                                                                    {formatTime(event.startTime)} {event.title}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                                {dayEvents.length > 3 && (
                                                    <div className="text-[11px] text-muted-foreground px-2">
                                                        +{dayEvents.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Agenda View */}
                    {viewMode === "agenda" && (
                        <div className="p-6">
                            <div className="space-y-4">
                                {filteredEvents
                                    .filter((e) => new Date(e.startDate) >= new Date(currentYear, currentMonth, 1))
                                    .sort(
                                        (a, b) =>
                                            new Date(a.startDate + " " + a.startTime).getTime() -
                                            new Date(b.startDate + " " + b.startTime).getTime()
                                    )
                                    .slice(0, 20)
                                    .map((event) => {
                                        const Icon = getEventTypeIcon(event.type);
                                        const LocationIcon = getLocationTypeIcon(event.locationType);
                                        return (
                                            <div
                                                key={event.id}
                                                onClick={() => handleEventClick(event)}
                                                className="bg-slate-50 rounded-lg p-4 border border-border hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                                                            style={{ backgroundColor: `${event.color}15` }}
                                                        >
                                                            <Icon className="w-6 h-6" style={{ color: event.color }} />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <div>
                                                                <h3 className="text-[14px] font-[600] text-foreground mb-1">
                                                                    {event.title}
                                                                </h3>
                                                                <p className="text-[12px] text-muted-foreground line-clamp-2">
                                                                    {event.description}
                                                                </p>
                                                            </div>
                                                            <span
                                                                className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-[500] border flex-shrink-0 ${getStatusBadgeStyles(
                                                                    event.status
                                                                )}`}
                                                            >
                                                                {event.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <CalendarIcon className="w-3.5 h-3.5" />
                                                                {formatDate(event.startDate)}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <LocationIcon className="w-3.5 h-3.5" />
                                                                {event.location}
                                                            </div>
                                                            {event.client && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <Building2 className="w-3.5 h-3.5" />
                                                                    {event.client}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Week View */}
                    {viewMode === "week" && (
                        <div className="p-6">
                            <div className="text-center text-[13px] text-muted-foreground py-12">
                                Week view coming soon
                            </div>
                        </div>
                    )}

                    {/* Day View */}
                    {viewMode === "day" && (
                        <div className="p-6">
                            <div className="text-center text-[13px] text-muted-foreground py-12">
                                Day view coming soon
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Event Detail Slide-Out Panel */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-end">
                    <div className="absolute inset-0" onClick={handleCloseEventDetail} />
                    <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${selectedEvent.color}15` }}
                                >
                                    {(() => {
                                        const Icon = getEventTypeIcon(selectedEvent.type);
                                        return <Icon className="w-5 h-5" style={{ color: selectedEvent.color }} />;
                                    })()}
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-[600] text-foreground">Event Details</h2>
                                    <p className="text-[12px] text-muted-foreground">{selectedEvent.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseEventDetail}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <div className="text-[20px] font-[600] text-foreground mb-2">
                                    {selectedEvent.title}
                                </div>
                                <p className="text-[13px] text-muted-foreground leading-relaxed">
                                    {selectedEvent.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                        Event Type
                                    </div>
                                    <div
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-[500]"
                                        style={{
                                            backgroundColor: `${selectedEvent.color}15`,
                                            color: selectedEvent.color,
                                        }}
                                    >
                                        {selectedEvent.type}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[12px] font-[500] text-muted-foreground mb-1">Status</div>
                                    <span
                                        className={`inline-flex px-3 py-1.5 rounded-md text-[13px] font-[500] border ${getStatusBadgeStyles(
                                            selectedEvent.status
                                        )}`}
                                    >
                                        {selectedEvent.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[12px] font-[500] text-muted-foreground mb-1">Date</div>
                                    <div className="flex items-center gap-2 text-[13px] text-foreground">
                                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                        {formatDate(selectedEvent.startDate)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[12px] font-[500] text-muted-foreground mb-1">Time</div>
                                    <div className="flex items-center gap-2 text-[13px] text-foreground">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-[12px] font-[500] text-muted-foreground mb-1">Location</div>
                                <div className="flex items-center gap-2 text-[13px] text-foreground">
                                    {(() => {
                                        const Icon = getLocationTypeIcon(selectedEvent.locationType);
                                        return <Icon className="w-4 h-4 text-muted-foreground" />;
                                    })()}
                                    {selectedEvent.location}
                                </div>
                                <div className="text-[12px] text-muted-foreground mt-1">
                                    {selectedEvent.locationType}
                                </div>
                            </div>

                            {selectedEvent.client && (
                                <div>
                                    <div className="text-[12px] font-[500] text-muted-foreground mb-1">Client</div>
                                    <button
                                        onClick={() =>
                                            selectedEvent.clientId && handleNavigateToClient(selectedEvent.clientId)
                                        }
                                        className="flex items-center gap-2 text-[13px] text-indigo-600 hover:text-indigo-700 font-[500]"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        {selectedEvent.client}
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            <div>
                                <div className="text-[12px] font-[500] text-muted-foreground mb-2">Attendees</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedEvent.attendees.map((attendee, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-[12px] text-foreground"
                                        >
                                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                            {attendee}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-[12px] font-[500] text-muted-foreground mb-1">Organizer</div>
                                <div className="text-[13px] text-foreground">{selectedEvent.organizer}</div>
                            </div>

                            {selectedEvent.meetingLink && (
                                <div>
                                    <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                        Meeting Link
                                    </div>
                                    <a
                                        href={selectedEvent.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[13px] text-indigo-600 hover:text-indigo-700 font-[500]"
                                    >
                                        <Video className="w-4 h-4" />
                                        Join Virtual Meeting
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            )}

                            {selectedEvent.regulatoryRef && (
                                <div>
                                    <div className="text-[12px] font-[500] text-muted-foreground mb-1">
                                        Regulatory Reference
                                    </div>
                                    <div className="text-[13px] text-foreground bg-slate-50 px-3 py-2 rounded-lg border border-border">
                                        {selectedEvent.regulatoryRef}
                                    </div>
                                </div>
                            )}

                            {selectedEvent.notes && (
                                <div>
                                    <div className="text-[12px] font-[500] text-muted-foreground mb-2">Notes</div>
                                    <div className="text-[13px] text-foreground bg-amber-50 px-4 py-3 rounded-lg border border-amber-200 leading-relaxed">
                                        {selectedEvent.notes}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t border-border">
                                <button className="flex-1 h-10 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors flex items-center justify-center gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit Event
                                </button>
                                <button className="h-10 px-4 rounded-lg text-[13px] font-[500] border border-red-200 text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <CreateEventModal onClose={() => setShowCreateModal(false)} />
            )}
        </div>
    );
}

/* ===== Create Event Modal ===== */

const EVENT_COLORS = [
    { label: "Indigo", value: "#6366F1" },
    { label: "Blue", value: "#3B82F6" },
    { label: "Emerald", value: "#10B981" },
    { label: "Amber", value: "#F59E0B" },
    { label: "Red", value: "#EF4444" },
    { label: "Violet", value: "#8B5CF6" },
    { label: "Rose", value: "#F43F5E" },
    { label: "Teal", value: "#14B8A6" },
];

const ALL_ADVISORS = ["Aoife Brennan", "Cian Murphy", "Saoirse O'Neill", "Declan Byrne"];

function CreateEventModal({ onClose }: { onClose: () => void }) {
    const [done, setDone] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventType, setEventType] = useState<EventType>("Client Meeting");
    const [status, setStatus] = useState<EventStatus>("Scheduled");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("10:00");
    const [locationType, setLocationType] = useState<CalendarEvent["locationType"]>("In-Person");
    const [location, setLocation] = useState("");
    const [client, setClient] = useState("");
    const [organizer, setOrganizer] = useState("Aoife Brennan");
    const [attendees, setAttendees] = useState<string[]>(["Aoife Brennan"]);
    const [attendeeInput, setAttendeeInput] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [regulatoryRef, setRegulatoryRef] = useState("");
    const [notes, setNotes] = useState("");
    const [reminderSet, setReminderSet] = useState(true);
    const [color, setColor] = useState("#6366F1");

    const [activeSection, setActiveSection] = useState<"details" | "schedule" | "people" | "extra">("details");

    const isValid = title.trim() && startDate && endDate && startTime && endTime;

    const handleStartDateChange = (val: string) => {
        setStartDate(val);
        if (!endDate || endDate < val) setEndDate(val);
    };

    const handleEventTypeChange = (type: EventType) => {
        setEventType(type);
        setColor(getEventTypeColor(type));
    };

    const addAttendee = (name: string) => {
        const trimmed = name.trim();
        if (trimmed && !attendees.includes(trimmed)) {
            setAttendees([...attendees, trimmed]);
        }
        setAttendeeInput("");
    };

    const removeAttendee = (name: string) => {
        setAttendees(attendees.filter((a) => a !== name));
    };

    const handleSubmit = () => {
        setDone(true);
    };

    const sections = [
        { id: "details" as const, label: "Event Details", icon: CalendarIcon },
        { id: "schedule" as const, label: "Date & Time", icon: Clock },
        { id: "people" as const, label: "People", icon: Users },
        { id: "extra" as const, label: "Additional", icon: FileText },
    ];

    const selectedClient = client ? mockClients.find((c) => c.name === client) : null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[680px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                            <Plus className="w-5 h-5" style={{ color }} />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-[700] text-foreground">Create Event</h2>
                            <p className="text-[12px] text-muted-foreground">Schedule a new calendar event</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {!done ? (
                    <>
                        {/* Section tabs */}
                        <div className="flex border-b border-border px-6 gap-1">
                            {sections.map((sec) => (
                                <button
                                    key={sec.id}
                                    onClick={() => setActiveSection(sec.id)}
                                    className={`flex items-center gap-1.5 px-3 h-10 text-[12px] font-[500] border-b-2 transition-colors cursor-pointer ${activeSection === sec.id
                                            ? "border-indigo-600 text-indigo-600"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <sec.icon className="w-3.5 h-3.5" />
                                    {sec.label}
                                </button>
                            ))}
                        </div>

                        {/* Form content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Section 1: Event Details */}
                            {activeSection === "details" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[12px] font-[600] text-foreground block mb-1.5">Event Title <span className="text-red-500">*</span></label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Monthly Advisory Review — Crestfield Tech"
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[12px] font-[600] text-foreground block mb-1.5">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={3}
                                            placeholder="What is this event about?"
                                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[12px] font-[600] text-foreground block mb-1.5">Event Type</label>
                                            <select
                                                value={eventType}
                                                onChange={(e) => handleEventTypeChange(e.target.value as EventType)}
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                                            >
                                                <option>Client Meeting</option>
                                                <option>Audit</option>
                                                <option>WRC Hearing</option>
                                                <option>HSA Inspection</option>
                                                <option>Compliance Deadline</option>
                                                <option>Training Session</option>
                                                <option>Internal Review</option>
                                                <option>Court Date</option>
                                                <option>Consultation</option>
                                                <option>Site Visit</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[12px] font-[600] text-foreground block mb-1.5">Status</label>
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value as EventStatus)}
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                                            >
                                                <option>Scheduled</option>
                                                <option>Confirmed</option>
                                                <option>Tentative</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[12px] font-[600] text-foreground block mb-1.5">Client (optional)</label>
                                        <select
                                            value={client}
                                            onChange={(e) => setClient(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                                        >
                                            <option value="">No client (internal event)</option>
                                            {mockClients.map((c) => (
                                                <option key={c.id} value={c.name}>{c.tradingName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Color picker */}
                                    <div>
                                        <label className="text-[12px] font-[600] text-foreground block mb-2">
                                            <span className="flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Event Colour</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            {EVENT_COLORS.map((c) => (
                                                <button
                                                    key={c.value}
                                                    type="button"
                                                    onClick={() => setColor(c.value)}
                                                    className={`w-8 h-8 rounded-full cursor-pointer transition-all flex items-center justify-center ${color === c.value ? "ring-2 ring-offset-2 ring-indigo-600" : "hover:scale-110"
                                                        }`}
                                                    style={{ backgroundColor: c.value }}
                                                    title={c.label}
                                                >
                                                    {color === c.value && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section 2: Schedule */}
                            {activeSection === "schedule" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[12px] font-[600] text-foreground block mb-1.5">Start Date <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => handleStartDateChange(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[12px] font-[600] text-foreground block mb-1.5">Start Time <span className="text-red-500">*</span></label>
                                            <input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[12px] font-[600] text-foreground block mb-1.5">End Date <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                min={startDate}
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[12px] font-[600] text-foreground block mb-1.5">End Time <span className="text-red-500">*</span></label>
                                            <input
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[12px] font-[600] text-foreground block mb-1.5">Location Type</label>
                                            <select
                                                value={locationType}
                                                onChange={(e) => setLocationType(e.target.value as CalendarEvent["locationType"])}
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                                            >
                                                <option>In-Person</option>
                                                <option>Virtual</option>
                                                <option>Hybrid</option>
                                                <option>Phone</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[12px] font-[600] text-foreground block mb-1.5">Location</label>
                                            <input
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder={locationType === "Virtual" ? "e.g. Virtual Meeting" : "e.g. Office — Dublin HQ"}
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>
                                    {(locationType === "Virtual" || locationType === "Hybrid") && (
                                        <div>
                                            <label className="text-[12px] font-[600] text-foreground block mb-1.5">
                                                <span className="flex items-center gap-1.5"><Link className="w-3.5 h-3.5" /> Meeting Link</span>
                                            </label>
                                            <input
                                                value={meetingLink}
                                                onChange={(e) => setMeetingLink(e.target.value)}
                                                placeholder="https://teams.microsoft.com/meet/..."
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    )}
                                    {/* Reminder toggle */}
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-slate-50">
                                        <div className="flex items-center gap-2.5">
                                            {reminderSet ? <Bell className="w-4 h-4 text-indigo-600" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
                                            <div>
                                                <p className="text-[13px] font-[500] text-foreground">Reminder</p>
                                                <p className="text-[11px] text-muted-foreground">{reminderSet ? "You'll be notified before this event" : "No reminder set"}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setReminderSet(!reminderSet)}
                                            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${reminderSet ? "bg-indigo-600" : "bg-slate-300"}`}
                                        >
                                            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${reminderSet ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                                        </button>
                                    </div>

                                    {/* Duration hint */}
                                    {startDate && startTime && endTime && (
                                        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                                            <p className="text-[12px] text-indigo-700 flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                Duration: {(() => {
                                                    const [sh, sm] = startTime.split(":").map(Number);
                                                    const [eh, em] = endTime.split(":").map(Number);
                                                    const diffMins = (eh * 60 + em) - (sh * 60 + sm);
                                                    if (diffMins <= 0) return "Invalid time range";
                                                    const hours = Math.floor(diffMins / 60);
                                                    const mins = diffMins % 60;
                                                    return `${hours > 0 ? `${hours}h ` : ""}${mins > 0 ? `${mins}m` : ""}`.trim();
                                                })()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Section 3: People */}
                            {activeSection === "people" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[12px] font-[600] text-foreground block mb-1.5">Organizer</label>
                                        <select
                                            value={organizer}
                                            onChange={(e) => {
                                                setOrganizer(e.target.value);
                                                if (!attendees.includes(e.target.value)) {
                                                    setAttendees([e.target.value, ...attendees]);
                                                }
                                            }}
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                                        >
                                            {ALL_ADVISORS.map((a) => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[12px] font-[600] text-foreground block mb-1.5">
                                            <span className="flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5" /> Attendees ({attendees.length})</span>
                                        </label>
                                        {/* Quick-add advisor buttons */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {ALL_ADVISORS.filter((a) => !attendees.includes(a)).map((advisor) => (
                                                <button
                                                    key={advisor}
                                                    type="button"
                                                    onClick={() => addAttendee(advisor)}
                                                    className="px-2.5 py-1 rounded-md text-[11px] font-[500] border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer flex items-center gap-1"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    {advisor}
                                                </button>
                                            ))}
                                        </div>
                                        {/* Custom attendee input */}
                                        <div className="flex items-center gap-2">
                                            <input
                                                value={attendeeInput}
                                                onChange={(e) => setAttendeeInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addAttendee(attendeeInput);
                                                    }
                                                }}
                                                placeholder="Add external attendee name..."
                                                className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addAttendee(attendeeInput)}
                                                disabled={!attendeeInput.trim()}
                                                className="h-10 px-3 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {/* Current attendees */}
                                        {attendees.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {attendees.map((attendee) => (
                                                    <div
                                                        key={attendee}
                                                        className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-lg bg-slate-100 text-[12px] text-foreground"
                                                    >
                                                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {attendee}
                                                        {attendee === organizer && (
                                                            <span className="text-[10px] font-[600] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Organizer</span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeAttendee(attendee)}
                                                            className="w-5 h-5 rounded-full hover:bg-slate-200 flex items-center justify-center cursor-pointer ml-0.5"
                                                        >
                                                            <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Section 4: Additional */}
                            {activeSection === "extra" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[12px] font-[600] text-foreground block mb-1.5">Regulatory Reference</label>
                                        <input
                                            value={regulatoryRef}
                                            onChange={(e) => setRegulatoryRef(e.target.value)}
                                            placeholder="e.g. GDPR Article 35 / Data Protection Act 2018"
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[12px] font-[600] text-foreground block mb-1.5">Notes</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={4}
                                            placeholder="Any preparation notes, agenda items, or reminders..."
                                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                        />
                                    </div>

                                    {/* Summary Preview */}
                                    {title && (
                                        <div className="p-4 rounded-lg bg-slate-50 border border-border">
                                            <p className="text-[10px] font-[700] text-muted-foreground uppercase tracking-wider mb-3">Event Summary</p>
                                            <div className="space-y-2 text-[12px]">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: color }} />
                                                    <div className="flex-1">
                                                        <p className="font-[600] text-foreground">{title}</p>
                                                        {description && <p className="text-muted-foreground mt-0.5 line-clamp-2">{description}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 ml-6 text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {startDate ? formatDate(startDate) : "No date"}</span>
                                                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {startTime} – {endTime}</span>
                                                    {location && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>}
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 ml-6 text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1" style={{ color }}>{eventType}</span>
                                                    <span>{status}</span>
                                                    {selectedClient && <span className="inline-flex items-center gap-1"><Building2 className="w-3 h-3" /> {selectedClient.tradingName}</span>}
                                                    <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {attendees.length} attendee{attendees.length !== 1 ? "s" : ""}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                            <div className="flex items-center gap-2">
                                {activeSection !== "details" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const idx = sections.findIndex((s) => s.id === activeSection);
                                            if (idx > 0) setActiveSection(sections[idx - 1].id);
                                        }}
                                        className="h-10 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors cursor-pointer"
                                    >
                                        Back
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button onClick={onClose} className="h-10 px-5 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors cursor-pointer">
                                    Cancel
                                </button>
                                {activeSection !== "extra" ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const idx = sections.findIndex((s) => s.id === activeSection);
                                            if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id);
                                        }}
                                        className="h-10 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!isValid}
                                        className="h-10 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" />
                                        Create Event
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Success state */
                    <>
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="py-10 text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[16px] font-[700] text-foreground">Event Created</p>
                                    <p className="text-[13px] text-muted-foreground mt-1.5">
                                        <span className="font-[600] text-foreground">{title}</span>
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-[12px] text-muted-foreground">
                                        <span className="inline-flex items-center gap-1">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                            {eventType}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            {formatDate(startDate)}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {startTime} – {endTime}
                                        </span>
                                    </div>
                                    {selectedClient && (
                                        <p className="text-[12px] text-muted-foreground mt-1 flex items-center justify-center gap-1">
                                            <Building2 className="w-3.5 h-3.5" />
                                            {selectedClient.tradingName}
                                        </p>
                                    )}
                                    <p className="text-[12px] text-muted-foreground mt-1">
                                        {organizer} · {attendees.length} attendee{attendees.length !== 1 ? "s" : ""} · {status}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end px-6 py-4 border-t border-border">
                            <button onClick={onClose} className="h-10 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer">
                                Done
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}