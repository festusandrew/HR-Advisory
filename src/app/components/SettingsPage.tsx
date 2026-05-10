import { useState } from "react";
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    CreditCard,
    Users,
    Globe,
    Lock,
    Eye,
    EyeOff,
    Check,
    X,
    Mail,
    Phone,
    MapPin,
    Building2,
    Download,
    Upload,
    Trash2,
    Key,
    Smartphone,
    AlertTriangle,
    CheckCircle2,
    Clock,
    DollarSign,
    FileText,
    Save,
    Send,
    RefreshCw,
    UserMinus,
    UserPlus,
    Copy,
} from "lucide-react";

/* ===== Types & Interfaces ===== */

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
    company: string;
    location: string;
    timezone: string;
    language: string;
    avatar?: string;
}

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Advisor" | "Viewer";
    status: "Active" | "Invited" | "Suspended";
    lastActive: string;
    avatar?: string;
}

/* ===== Mock Data ===== */

const CURRENT_USER: UserProfile = {
    firstName: "Aoife",
    lastName: "Brennan",
    email: "aoife.brennan@hradvisory.ie",
    phone: "+353 1 234 5678",
    jobTitle: "Senior HR Advisor",
    company: "HR Advisory Ireland",
    location: "Dublin, Ireland",
    timezone: "Europe/Dublin (IST/GMT)",
    language: "English (Ireland)",
};

const TEAM_MEMBERS: TeamMember[] = [
    {
        id: "TM-001",
        name: "Aoife Brennan",
        email: "aoife.brennan@hradvisory.ie",
        role: "Admin",
        status: "Active",
        lastActive: "2026-02-06T12:00:00Z",
    },
    {
        id: "TM-002",
        name: "Cian Murphy",
        email: "cian.murphy@hradvisory.ie",
        role: "Advisor",
        status: "Active",
        lastActive: "2026-02-06T11:30:00Z",
    },
    {
        id: "TM-003",
        name: "Saoirse O'Neill",
        email: "saoirse.oneill@hradvisory.ie",
        role: "Advisor",
        status: "Active",
        lastActive: "2026-02-05T16:45:00Z",
    },
    {
        id: "TM-004",
        name: "Declan Byrne",
        email: "declan.byrne@hradvisory.ie",
        role: "Advisor",
        status: "Active",
        lastActive: "2026-02-06T09:15:00Z",
    },
    {
        id: "TM-005",
        name: "Niamh Walsh",
        email: "niamh.walsh@hradvisory.ie",
        role: "Viewer",
        status: "Invited",
        lastActive: "Never",
    },
];

/* ===== Helper Functions ===== */

function formatDateTime(dateStr: string): string {
    if (dateStr === "Never") return "Never";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IE", { day: "numeric", month: "short" });
}

function getRoleBadgeStyles(role: TeamMember["role"]) {
    const styles = {
        Admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
        Advisor: "bg-blue-50 text-blue-700 border-blue-200",
        Viewer: "bg-slate-50 text-slate-700 border-slate-200",
    };
    return styles[role];
}

function getStatusBadgeStyles(status: TeamMember["status"]) {
    const styles = {
        Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Invited: "bg-amber-50 text-amber-700 border-amber-200",
        Suspended: "bg-red-50 text-red-700 border-red-200",
    };
    return styles[status];
}

/* ===== Main Component ===== */

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState<
        "profile" | "team" | "security" | "notifications" | "billing" | "privacy" | "preferences"
    >("profile");
    const [showPassword, setShowPassword] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [userProfile, setUserProfile] = useState(CURRENT_USER);

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState({
        taskAssigned: true,
        documentUploaded: true,
        complianceAlert: true,
        clientMessage: true,
        weeklyDigest: true,
    });

    const [pushNotifications, setPushNotifications] = useState({
        taskReminders: true,
        upcomingDeadlines: true,
        complianceAlerts: true,
    });

    // Team state
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [memberSettingsId, setMemberSettingsId] = useState<string | null>(null);
    const [inviteEmails, setInviteEmails] = useState("");
    const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Advisor");
    const [inviteMessage, setInviteMessage] = useState("");
    const [inviteSending, setInviteSending] = useState(false);
    const [inviteSuccess, setInviteSuccess] = useState(false);
    const [inviteErrors, setInviteErrors] = useState<string[]>([]);
    const [confirmRemoveMemberId, setConfirmRemoveMemberId] = useState<string | null>(null);

    const selectedMember = memberSettingsId ? teamMembers.find(m => m.id === memberSettingsId) : null;

    const resetInviteForm = () => {
        setInviteEmails("");
        setInviteRole("Advisor");
        setInviteMessage("");
        setInviteSending(false);
        setInviteSuccess(false);
        setInviteErrors([]);
    };

    const handleSendInvites = () => {
        const emails = inviteEmails.split(/[,;\n]/).map(e => e.trim()).filter(Boolean);
        const errors: string[] = [];
        const validEmails: string[] = [];
        emails.forEach(email => {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push(`Invalid email: ${email}`);
            } else if (teamMembers.some(m => m.email.toLowerCase() === email.toLowerCase())) {
                errors.push(`Already on team: ${email}`);
            } else {
                validEmails.push(email);
            }
        });
        if (validEmails.length === 0 && errors.length === 0) {
            errors.push("Please enter at least one email address");
        }
        if (errors.length > 0 && validEmails.length === 0) {
            setInviteErrors(errors);
            return;
        }
        setInviteErrors(errors);
        setInviteSending(true);
        setTimeout(() => {
            const newMembers: TeamMember[] = validEmails.map((email, i) => ({
                id: `TM-${String(teamMembers.length + i + 1).padStart(3, "0")}`,
                name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                email,
                role: inviteRole,
                status: "Invited" as const,
                lastActive: "Never",
            }));
            setTeamMembers(prev => [...prev, ...newMembers]);
            setInviteSending(false);
            setInviteSuccess(true);
        }, 1500);
    };

    const handleChangeRole = (memberId: string, newRole: TeamMember["role"]) => {
        setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    };

    const handleToggleStatus = (memberId: string) => {
        setTeamMembers(prev => prev.map(m => {
            if (m.id !== memberId) return m;
            if (m.status === "Active") return { ...m, status: "Suspended" as const };
            if (m.status === "Suspended") return { ...m, status: "Active" as const };
            return m;
        }));
    };

    const handleResendInvite = (memberId: string) => {
        // Visual feedback only - would trigger email in real app
        setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, lastActive: "Never" } : m));
    };

    const handleRemoveMember = (memberId: string) => {
        setTeamMembers(prev => prev.filter(m => m.id !== memberId));
        setConfirmRemoveMemberId(null);
        setMemberSettingsId(null);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            <div className="max-w-[1400px] mx-auto p-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                            <SettingsIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-[24px] font-[700] text-foreground">Settings</h1>
                            <p className="text-[13px] text-muted-foreground">
                                Manage your account, team, security, and preferences
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-border p-2">
                            <nav className="space-y-1">
                                {[
                                    { id: "profile", label: "Profile", icon: User },
                                    { id: "team", label: "Team", icon: Users },
                                    { id: "security", label: "Security", icon: Shield },
                                    { id: "notifications", label: "Notifications", icon: Bell },
                                    { id: "billing", label: "Billing", icon: CreditCard },
                                    { id: "privacy", label: "Data & Privacy", icon: Lock },
                                    { id: "preferences", label: "Preferences", icon: Globe },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id as any)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-[500] transition-colors ${activeTab === item.id
                                                    ? "bg-indigo-50 text-indigo-700"
                                                    : "text-muted-foreground hover:bg-slate-50"
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-xl border border-border">
                            {/* Profile Tab */}
                            {activeTab === "profile" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-[18px] font-[600] text-foreground mb-1">
                                            Profile Information
                                        </h2>
                                        <p className="text-[13px] text-muted-foreground">
                                            Update your personal details and contact information
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-6 pb-6 border-b border-border">
                                        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-[28px] font-[600] text-indigo-600">
                                            AB
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex gap-3 mb-2">
                                                <button className="h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                                    <Upload className="w-4 h-4" />
                                                    Upload Photo
                                                </button>
                                                <button className="h-9 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors flex items-center gap-2">
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                            <p className="text-[12px] text-muted-foreground">
                                                JPG, PNG or GIF. Maximum file size 2MB.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={userProfile.firstName}
                                                onChange={(e) =>
                                                    setUserProfile({ ...userProfile, firstName: e.target.value })
                                                }
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={userProfile.lastName}
                                                onChange={(e) =>
                                                    setUserProfile({ ...userProfile, lastName: e.target.value })
                                                }
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="email"
                                                value={userProfile.email}
                                                onChange={(e) =>
                                                    setUserProfile({ ...userProfile, email: e.target.value })
                                                }
                                                className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="tel"
                                                value={userProfile.phone}
                                                onChange={(e) =>
                                                    setUserProfile({ ...userProfile, phone: e.target.value })
                                                }
                                                className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                Job Title
                                            </label>
                                            <input
                                                type="text"
                                                value={userProfile.jobTitle}
                                                onChange={(e) =>
                                                    setUserProfile({ ...userProfile, jobTitle: e.target.value })
                                                }
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                Company
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    value={userProfile.company}
                                                    onChange={(e) =>
                                                        setUserProfile({ ...userProfile, company: e.target.value })
                                                    }
                                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                            Location
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={userProfile.location}
                                                onChange={(e) =>
                                                    setUserProfile({ ...userProfile, location: e.target.value })
                                                }
                                                className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border flex justify-end gap-3">
                                        <button className="h-10 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors">
                                            Cancel
                                        </button>
                                        <button className="h-10 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Team Tab */}
                            {activeTab === "team" && (
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-[18px] font-[600] text-foreground mb-1">
                                                Team Members
                                            </h2>
                                            <p className="text-[13px] text-muted-foreground">
                                                Manage your team and their access levels
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => { resetInviteForm(); setShowInviteModal(true); }}
                                            className="h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Invite Member
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {teamMembers.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-indigo-200 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[14px] font-[600] text-indigo-600">
                                                    {member.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[14px] font-[500] text-foreground">
                                                        {member.name}
                                                    </div>
                                                    <div className="text-[12px] text-muted-foreground">{member.email}</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-md text-[11px] font-[500] border ${getRoleBadgeStyles(
                                                            member.role
                                                        )}`}
                                                    >
                                                        {member.role}
                                                    </span>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-md text-[11px] font-[500] border ${getStatusBadgeStyles(
                                                            member.status
                                                        )}`}
                                                    >
                                                        {member.status}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground min-w-[80px]">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {formatDateTime(member.lastActive)}
                                                    </div>
                                                    <button
                                                        onClick={() => setMemberSettingsId(member.id)}
                                                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                                    >
                                                        <SettingsIcon className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === "security" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-[18px] font-[600] text-foreground mb-1">
                                            Security Settings
                                        </h2>
                                        <p className="text-[13px] text-muted-foreground">
                                            Manage your password and two-factor authentication
                                        </p>
                                    </div>

                                    <div className="space-y-4 pb-6 border-b border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground">Change Password</h3>
                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="w-full h-10 pl-9 pr-10 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                                />
                                                <button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                                                />
                                            </div>
                                        </div>
                                        <button className="h-10 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                                            Update Password
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[15px] font-[600] text-foreground">
                                            Two-Factor Authentication
                                        </h3>
                                        <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-slate-50">
                                            <div
                                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${twoFactorEnabled ? "bg-emerald-50" : "bg-slate-100"
                                                    }`}
                                            >
                                                {twoFactorEnabled ? (
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                                ) : (
                                                    <Smartphone className="w-6 h-6 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-[14px] font-[600] text-foreground mb-1">
                                                    Authenticator App
                                                </h4>
                                                <p className="text-[12px] text-muted-foreground mb-3">
                                                    {twoFactorEnabled
                                                        ? "Two-factor authentication is currently enabled on your account"
                                                        : "Add an extra layer of security to your account"}
                                                </p>
                                                <button
                                                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                                    className={`h-9 px-4 rounded-lg text-[13px] font-[500] transition-colors ${twoFactorEnabled
                                                            ? "border border-red-200 text-red-700 hover:bg-red-50"
                                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                        }`}
                                                >
                                                    {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground mb-3">
                                            Recent Activity
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    action: "Logged in",
                                                    device: "Chrome on macOS",
                                                    location: "Dublin, Ireland",
                                                    time: "2 hours ago",
                                                },
                                                {
                                                    action: "Password changed",
                                                    device: "Chrome on macOS",
                                                    location: "Dublin, Ireland",
                                                    time: "3 days ago",
                                                },
                                                {
                                                    action: "Logged in",
                                                    device: "Safari on iPhone",
                                                    location: "Dublin, Ireland",
                                                    time: "5 days ago",
                                                },
                                            ].map((activity, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                                                >
                                                    <div>
                                                        <div className="text-[13px] font-[500] text-foreground">
                                                            {activity.action}
                                                        </div>
                                                        <div className="text-[12px] text-muted-foreground">
                                                            {activity.device} • {activity.location}
                                                        </div>
                                                    </div>
                                                    <div className="text-[12px] text-muted-foreground">{activity.time}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === "notifications" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-[18px] font-[600] text-foreground mb-1">
                                            Notification Preferences
                                        </h2>
                                        <p className="text-[13px] text-muted-foreground">
                                            Choose how you want to be notified about activity
                                        </p>
                                    </div>

                                    <div className="space-y-4 pb-6 border-b border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground">Email Notifications</h3>
                                        {[
                                            { key: "taskAssigned", label: "Task assigned to me", enabled: emailNotifications.taskAssigned },
                                            { key: "documentUploaded", label: "Document uploaded", enabled: emailNotifications.documentUploaded },
                                            { key: "complianceAlert", label: "Compliance alerts and deadlines", enabled: emailNotifications.complianceAlert },
                                            { key: "clientMessage", label: "Client messages and requests", enabled: emailNotifications.clientMessage },
                                            { key: "weeklyDigest", label: "Weekly summary digest", enabled: emailNotifications.weeklyDigest },
                                        ].map((item) => (
                                            <div
                                                key={item.key}
                                                className="flex items-center justify-between p-3 rounded-lg border border-border"
                                            >
                                                <div className="text-[13px] text-foreground">{item.label}</div>
                                                <button
                                                    onClick={() =>
                                                        setEmailNotifications({
                                                            ...emailNotifications,
                                                            [item.key]: !item.enabled,
                                                        })
                                                    }
                                                    className={`relative w-11 h-6 rounded-full transition-colors ${item.enabled ? "bg-indigo-600" : "bg-slate-300"
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${item.enabled ? "translate-x-5" : "translate-x-0"
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[15px] font-[600] text-foreground">Push Notifications</h3>
                                        {[
                                            { key: "taskReminders", label: "Task reminders", enabled: pushNotifications.taskReminders },
                                            { key: "upcomingDeadlines", label: "Upcoming deadlines", enabled: pushNotifications.upcomingDeadlines },
                                            { key: "complianceAlerts", label: "Critical compliance alerts", enabled: pushNotifications.complianceAlerts },
                                        ].map((item) => (
                                            <div
                                                key={item.key}
                                                className="flex items-center justify-between p-3 rounded-lg border border-border"
                                            >
                                                <div className="text-[13px] text-foreground">{item.label}</div>
                                                <button
                                                    onClick={() =>
                                                        setPushNotifications({
                                                            ...pushNotifications,
                                                            [item.key]: !item.enabled,
                                                        })
                                                    }
                                                    className={`relative w-11 h-6 rounded-full transition-colors ${item.enabled ? "bg-indigo-600" : "bg-slate-300"
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${item.enabled ? "translate-x-5" : "translate-x-0"
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-border flex justify-end gap-3">
                                        <button className="h-10 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors">
                                            Reset to Default
                                        </button>
                                        <button className="h-10 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Billing Tab */}
                            {activeTab === "billing" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-[18px] font-[600] text-foreground mb-1">
                                            Billing & Subscription
                                        </h2>
                                        <p className="text-[13px] text-muted-foreground">
                                            Manage your subscription and payment details
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="text-[14px] font-[500] opacity-90 mb-1">Current Plan</div>
                                                <div className="text-[24px] font-[700]">Professional</div>
                                            </div>
                                            <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-[13px] font-[500] transition-colors">
                                                Upgrade Plan
                                            </button>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <div className="text-[32px] font-[700]">€249</div>
                                            <div className="text-[14px] opacity-90">per month</div>
                                        </div>
                                        <div className="text-[13px] opacity-90 mt-2">
                                            Next billing date: March 15, 2026
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[15px] font-[600] text-foreground">Payment Method</h3>
                                        <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[14px] font-[500] text-foreground">
                                                    Visa ending in 4242
                                                </div>
                                                <div className="text-[12px] text-muted-foreground">Expires 12/2027</div>
                                            </div>
                                            <button className="h-9 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors">
                                                Update
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-[15px] font-[600] text-foreground">Billing History</h3>
                                        {[
                                            { date: "Feb 1, 2026", amount: "€249.00", status: "Paid", invoice: "INV-2026-02" },
                                            { date: "Jan 1, 2026", amount: "€249.00", status: "Paid", invoice: "INV-2026-01" },
                                            { date: "Dec 1, 2025", amount: "€249.00", status: "Paid", invoice: "INV-2025-12" },
                                        ].map((payment, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 rounded-lg border border-border"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <div className="text-[13px] font-[500] text-foreground">
                                                            {payment.date}
                                                        </div>
                                                        <div className="text-[12px] text-muted-foreground">
                                                            {payment.invoice}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-[14px] font-[600] text-foreground">
                                                        {payment.amount}
                                                    </div>
                                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-[500] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        {payment.status}
                                                    </span>
                                                    <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                                        <Download className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === "privacy" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-[18px] font-[600] text-foreground mb-1">
                                            Data & Privacy
                                        </h2>
                                        <p className="text-[13px] text-muted-foreground">
                                            Manage your data and GDPR compliance settings
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-[13px] font-[500] text-blue-900 mb-1">
                                                    GDPR Compliant
                                                </div>
                                                <p className="text-[12px] text-blue-700">
                                                    This platform is fully compliant with GDPR and Irish Data Protection Act
                                                    2018. All personal data is processed in accordance with EU regulations.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[15px] font-[600] text-foreground">Your Data Rights</h3>
                                        <div className="space-y-3">
                                            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-indigo-200 transition-colors text-left">
                                                <div className="flex items-center gap-3">
                                                    <Download className="w-5 h-5 text-indigo-600" />
                                                    <div>
                                                        <div className="text-[13px] font-[500] text-foreground">
                                                            Download Your Data
                                                        </div>
                                                        <div className="text-[12px] text-muted-foreground">
                                                            Export all your personal data
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-red-200 transition-colors text-left">
                                                <div className="flex items-center gap-3">
                                                    <Trash2 className="w-5 h-5 text-red-600" />
                                                    <div>
                                                        <div className="text-[13px] font-[500] text-foreground">
                                                            Delete Your Account
                                                        </div>
                                                        <div className="text-[12px] text-muted-foreground">
                                                            Permanently delete your account and data
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-border">
                                        <h3 className="text-[15px] font-[600] text-foreground">
                                            Privacy Preferences
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                "Allow analytics and performance tracking",
                                                "Share anonymized usage data",
                                                "Receive product updates and news",
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                                                >
                                                    <div className="text-[13px] text-foreground">{item}</div>
                                                    <button className="relative w-11 h-6 rounded-full bg-slate-300">
                                                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === "preferences" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-[18px] font-[600] text-foreground mb-1">Preferences</h2>
                                        <p className="text-[13px] text-muted-foreground">
                                            Customize your regional settings and preferences
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                Timezone
                                            </label>
                                            <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring">
                                                <option>Europe/Dublin (IST/GMT)</option>
                                                <option>Europe/London (GMT/BST)</option>
                                                <option>Europe/Paris (CET/CEST)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                Language
                                            </label>
                                            <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring">
                                                <option>English (Ireland)</option>
                                                <option>English (United Kingdom)</option>
                                                <option>Irish (Gaeilge)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                Currency
                                            </label>
                                            <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring">
                                                <option>EUR (€) - Euro</option>
                                                <option>GBP (£) - British Pound</option>
                                                <option>USD ($) - US Dollar</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                Date Format
                                            </label>
                                            <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring">
                                                <option>DD/MM/YYYY (Irish format)</option>
                                                <option>MM/DD/YYYY (US format)</option>
                                                <option>YYYY-MM-DD (ISO format)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                                Time Format
                                            </label>
                                            <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring">
                                                <option>24-hour</option>
                                                <option>12-hour (AM/PM)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border flex justify-end gap-3">
                                        <button className="h-10 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors">
                                            Cancel
                                        </button>
                                        <button className="h-10 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Member Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <UserPlus className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-[700] text-foreground">Invite Team Members</h2>
                                    <p className="text-[12px] text-muted-foreground">Send invitations to join your advisory team</p>
                                </div>
                            </div>
                            <button onClick={() => setShowInviteModal(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {inviteSuccess ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-[16px] font-[700] text-foreground mb-1">Invitations Sent</h3>
                                    <p className="text-[13px] text-muted-foreground mb-6">
                                        Your team invitations have been sent successfully. New members will receive an email with instructions to join.
                                    </p>
                                    {inviteErrors.length > 0 && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-left">
                                            <div className="text-[12px] font-[500] text-amber-800 mb-1">Some emails were skipped:</div>
                                            {inviteErrors.map((err, i) => (
                                                <div key={i} className="text-[11px] text-amber-700 flex items-center gap-1.5">
                                                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                                    {err}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={() => { resetInviteForm(); }}
                                            className="h-9 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors cursor-pointer"
                                        >
                                            Invite More
                                        </button>
                                        <button
                                            onClick={() => setShowInviteModal(false)}
                                            className="h-9 px-4 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {/* Email Input */}
                                    <div>
                                        <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                            Email Addresses <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <textarea
                                                value={inviteEmails}
                                                onChange={(e) => { setInviteEmails(e.target.value); setInviteErrors([]); }}
                                                placeholder="Enter email addresses separated by commas, semicolons, or new lines..."
                                                rows={3}
                                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                            />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-1.5">Separate multiple emails with commas, semicolons, or new lines</p>
                                    </div>

                                    {/* Role Selection */}
                                    <div>
                                        <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                            Role <span className="text-red-500">*</span>
                                        </label>
                                        <div className="space-y-2">
                                            {([
                                                { value: "Admin" as const, label: "Admin", desc: "Full access to all features, settings, and team management", icon: Shield },
                                                { value: "Advisor" as const, label: "Advisor", desc: "Manage clients, tasks, documents, and compliance workflows", icon: Users },
                                                { value: "Viewer" as const, label: "Viewer", desc: "Read-only access to dashboards, reports, and client data", icon: Eye },
                                            ]).map((role) => {
                                                const RoleIcon = role.icon;
                                                return (
                                                    <button
                                                        key={role.value}
                                                        onClick={() => setInviteRole(role.value)}
                                                        className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${inviteRole === role.value
                                                                ? "border-indigo-300 bg-indigo-50/50 ring-1 ring-indigo-200"
                                                                : "border-border hover:border-slate-300"
                                                            }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${inviteRole === role.value ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-muted-foreground"
                                                            }`}>
                                                            <RoleIcon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[13px] font-[600] text-foreground">{role.label}</span>
                                                                {inviteRole === role.value && <Check className="w-4 h-4 text-indigo-600" />}
                                                            </div>
                                                            <p className="text-[11px] text-muted-foreground mt-0.5">{role.desc}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Personal Message */}
                                    <div>
                                        <label className="text-[13px] font-[500] text-foreground mb-2 block">
                                            Personal Message <span className="text-[11px] text-muted-foreground font-[400]">(optional)</span>
                                        </label>
                                        <textarea
                                            value={inviteMessage}
                                            onChange={(e) => setInviteMessage(e.target.value)}
                                            placeholder="Add a personal note to the invitation email..."
                                            rows={2}
                                            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                        />
                                    </div>

                                    {/* Validation Errors */}
                                    {inviteErrors.length > 0 && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                            {inviteErrors.map((err, i) => (
                                                <div key={i} className="text-[12px] text-red-700 flex items-center gap-1.5">
                                                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                                    {err}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Preview */}
                                    {inviteEmails.trim() && (
                                        <div className="bg-slate-50 rounded-lg p-3 border border-border">
                                            <div className="text-[11px] font-[600] text-muted-foreground uppercase tracking-wider mb-2">Invitation Preview</div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {inviteEmails.split(/[,;\n]/).map(e => e.trim()).filter(Boolean).map((email, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-border text-[11px] text-foreground">
                                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                                        {email}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="mt-2 text-[11px] text-muted-foreground">
                                                Will be invited as <span className={`font-[600] ${inviteRole === "Admin" ? "text-indigo-600" : inviteRole === "Advisor" ? "text-blue-600" : "text-slate-600"}`}>{inviteRole}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {!inviteSuccess && (
                            <div className="px-6 py-4 border-t border-border flex justify-end gap-3 flex-shrink-0">
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="h-9 px-4 rounded-lg text-[13px] font-[500] border border-input bg-background hover:bg-accent transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendInvites}
                                    disabled={inviteSending}
                                    className="h-9 px-5 rounded-lg text-[13px] font-[500] bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {inviteSending ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Invitation{inviteEmails.split(/[,;\n]/).map(e => e.trim()).filter(Boolean).length > 1 ? "s" : ""}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Member Settings Panel */}
            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40 backdrop-blur-sm" onClick={() => { setMemberSettingsId(null); setConfirmRemoveMemberId(null); }}>
                    <div className="w-[400px] bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Panel Header */}
                        <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-center justify-between z-10">
                            <span className="text-[14px] font-[700] text-foreground">Member Settings</span>
                            <button onClick={() => { setMemberSettingsId(null); setConfirmRemoveMemberId(null); }} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-5 space-y-6">
                            {/* Member Info */}
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-border">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-[16px] font-[600] text-indigo-600 flex-shrink-0">
                                    {selectedMember.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[14px] font-[600] text-foreground">{selectedMember.name}</div>
                                    <div className="text-[12px] text-muted-foreground truncate">{selectedMember.email}</div>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-[500] border ${getRoleBadgeStyles(selectedMember.role)}`}>
                                            {selectedMember.role}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-[500] border ${getStatusBadgeStyles(selectedMember.status)}`}>
                                            {selectedMember.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Member Details */}
                            <div className="space-y-3">
                                <h4 className="text-[12px] font-[600] text-muted-foreground uppercase tracking-wider">Details</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[12px]">
                                        <span className="text-muted-foreground">Email</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-foreground">{selectedMember.email}</span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(selectedMember.email)}
                                                className="p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                                title="Copy email"
                                            >
                                                <Copy className="w-3 h-3 text-muted-foreground" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-[12px]">
                                        <span className="text-muted-foreground">Last Active</span>
                                        <span className="text-foreground">{formatDateTime(selectedMember.lastActive)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[12px]">
                                        <span className="text-muted-foreground">Member ID</span>
                                        <span className="text-foreground font-mono">{selectedMember.id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Change Role */}
                            <div className="space-y-3">
                                <h4 className="text-[12px] font-[600] text-muted-foreground uppercase tracking-wider">Access Role</h4>
                                <div className="space-y-2">
                                    {([
                                        { value: "Admin" as const, desc: "Full access & team management" },
                                        { value: "Advisor" as const, desc: "Client & workflow management" },
                                        { value: "Viewer" as const, desc: "Read-only access" },
                                    ]).map((role) => (
                                        <button
                                            key={role.value}
                                            onClick={() => handleChangeRole(selectedMember.id, role.value)}
                                            disabled={selectedMember.id === "TM-001" && role.value !== "Admin"}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${selectedMember.role === role.value
                                                    ? "border-indigo-300 bg-indigo-50/50"
                                                    : "border-border hover:border-slate-300"
                                                }`}
                                        >
                                            <div>
                                                <span className={`text-[12px] font-[600] ${selectedMember.role === role.value ? "text-indigo-700" : "text-foreground"}`}>
                                                    {role.value}
                                                </span>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">{role.desc}</p>
                                            </div>
                                            {selectedMember.role === role.value && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                                {selectedMember.id === "TM-001" && (
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Primary admin role cannot be changed
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <h4 className="text-[12px] font-[600] text-muted-foreground uppercase tracking-wider">Actions</h4>
                                <div className="space-y-2">
                                    {/* Resend Invite */}
                                    {selectedMember.status === "Invited" && (
                                        <button
                                            onClick={() => handleResendInvite(selectedMember.id)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer text-left"
                                        >
                                            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Send className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-[600] text-foreground">Resend Invitation</div>
                                                <div className="text-[10px] text-muted-foreground">Send another invitation email</div>
                                            </div>
                                        </button>
                                    )}

                                    {/* Suspend / Reactivate */}
                                    {selectedMember.id !== "TM-001" && (selectedMember.status === "Active" || selectedMember.status === "Suspended") && (
                                        <button
                                            onClick={() => handleToggleStatus(selectedMember.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${selectedMember.status === "Active"
                                                    ? "border-border hover:border-amber-200 hover:bg-amber-50/30"
                                                    : "border-border hover:border-emerald-200 hover:bg-emerald-50/30"
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${selectedMember.status === "Active" ? "bg-amber-50" : "bg-emerald-50"
                                                }`}>
                                                {selectedMember.status === "Active" ? (
                                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                                ) : (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-[600] text-foreground">
                                                    {selectedMember.status === "Active" ? "Suspend Access" : "Reactivate Access"}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {selectedMember.status === "Active"
                                                        ? "Temporarily disable this member's access"
                                                        : "Restore this member's access to the platform"}
                                                </div>
                                            </div>
                                        </button>
                                    )}

                                    {/* Remove Member */}
                                    {selectedMember.id !== "TM-001" && (
                                        <>
                                            {confirmRemoveMemberId === selectedMember.id ? (
                                                <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                                        <span className="text-[12px] font-[600] text-red-700">Confirm Removal</span>
                                                    </div>
                                                    <p className="text-[11px] text-red-600 mb-3">
                                                        Are you sure you want to remove <span className="font-[600]">{selectedMember.name}</span> from the team? They will immediately lose access to the platform.
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setConfirmRemoveMemberId(null)}
                                                            className="flex-1 h-8 rounded-md text-[12px] font-[500] border border-input bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveMember(selectedMember.id)}
                                                            className="flex-1 h-8 rounded-md text-[12px] font-[500] bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-1"
                                                        >
                                                            <UserMinus className="w-3.5 h-3.5" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmRemoveMemberId(selectedMember.id)}
                                                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-red-200 hover:bg-red-50/30 transition-all cursor-pointer text-left"
                                                >
                                                    <div className="w-8 h-8 rounded-md bg-red-50 flex items-center justify-center flex-shrink-0">
                                                        <UserMinus className="w-4 h-4 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[12px] font-[600] text-red-700">Remove from Team</div>
                                                        <div className="text-[10px] text-muted-foreground">Permanently remove this member</div>
                                                    </div>
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {selectedMember.id === "TM-001" && (
                                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                            <div className="flex items-start gap-2">
                                                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="text-[11px] font-[500] text-blue-900">Primary Administrator</div>
                                                    <p className="text-[10px] text-blue-700 mt-0.5">
                                                        This is the primary admin account and cannot be suspended or removed.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}