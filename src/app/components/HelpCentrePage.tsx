import { useState } from "react";
import {
    HelpCircle,
    Search,
    X,
    Book,
    Video,
    FileText,
    MessageCircle,
    Mail,
    Phone,
    ExternalLink,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    Play,
    Download,
    BookOpen,
    Shield,
    Users,
    BarChart3,
    FileCheck,
    Calendar,
    Settings,
    Zap,
    Activity,
    Lock,
} from "lucide-react";

/* ===== Types & Interfaces ===== */

interface HelpArticle {
    id: string;
    title: string;
    description: string;
    category: string;
    views: number;
    helpful: number;
    lastUpdated: string;
    icon: React.ElementType;
    content?: string;
}

interface VideoTutorial {
    id: string;
    title: string;
    description: string;
    duration: string;
    views: number;
    category: string;
    thumbnail: string;
}

/* ===== Mock Data ===== */

const HELP_CATEGORIES = [
    { id: "getting-started", label: "Getting Started", icon: Zap, count: 12 },
    { id: "compliance", label: "Compliance & Regulatory", icon: Shield, count: 18 },
    { id: "clients", label: "Client Management", icon: Users, count: 15 },
    { id: "documents", label: "Documents & Records", icon: FileText, count: 10 },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3, count: 8 },
    { id: "calendar", label: "Calendar & Events", icon: Calendar, count: 6 },
    { id: "integrations", label: "Integrations", icon: Settings, count: 14 },
    { id: "account", label: "Account & Billing", icon: Activity, count: 9 },
];

const POPULAR_ARTICLES: HelpArticle[] = [
    {
        id: "ART-001",
        title: "Getting Started with HR Advisory Platform",
        description: "Complete guide to setting up your account and navigating the platform",
        category: "Getting Started",
        views: 2847,
        helpful: 234,
        lastUpdated: "2026-01-15",
        icon: Zap,
    },
    {
        id: "ART-002",
        title: "Understanding Irish GDPR Compliance Requirements",
        description: "Comprehensive guide to GDPR obligations under the Data Protection Act 2018",
        category: "Compliance & Regulatory",
        views: 1923,
        helpful: 189,
        lastUpdated: "2026-02-01",
        icon: Shield,
    },
    {
        id: "ART-003",
        title: "Creating and Managing Client Profiles",
        description: "Learn how to add clients, manage contacts, and track engagement",
        category: "Client Management",
        views: 1654,
        helpful: 156,
        lastUpdated: "2026-01-22",
        icon: Users,
    },
    {
        id: "ART-004",
        title: "Workplace Relations Commission (WRC) Compliance",
        description: "Guide to WRC obligations, adjudication preparation, and documentation",
        category: "Compliance & Regulatory",
        views: 1432,
        helpful: 142,
        lastUpdated: "2026-01-28",
        icon: Shield,
    },
    {
        id: "ART-005",
        title: "Generating Compliance Reports",
        description: "How to create, customize, and export compliance and audit reports",
        category: "Reports & Analytics",
        views: 1289,
        helpful: 128,
        lastUpdated: "2026-02-03",
        icon: BarChart3,
    },
    {
        id: "ART-006",
        title: "Connecting to Revenue ROS System",
        description: "Step-by-step guide to integrating with Revenue's Online Service for PAYE",
        category: "Integrations",
        views: 1156,
        helpful: 118,
        lastUpdated: "2026-01-10",
        icon: Settings,
    },
];

const VIDEO_TUTORIALS: VideoTutorial[] = [
    {
        id: "VID-001",
        title: "Platform Overview & Navigation",
        description: "A comprehensive tour of the HR Advisory platform interface and key features",
        duration: "12:45",
        views: 3421,
        category: "Getting Started",
        thumbnail: "🎥",
    },
    {
        id: "VID-002",
        title: "Managing Irish Compliance Requirements",
        description: "Learn how to track and manage Irish and EU regulatory compliance",
        duration: "18:30",
        views: 2154,
        category: "Compliance & Regulatory",
        thumbnail: "🎥",
    },
    {
        id: "VID-003",
        title: "Creating Custom Reports",
        description: "Build custom reports for WRC, GDPR, and H&S compliance",
        duration: "15:20",
        views: 1876,
        category: "Reports & Analytics",
        thumbnail: "🎥",
    },
    {
        id: "VID-004",
        title: "Setting Up Integrations",
        description: "Connect your payroll, HRIS, and accounting systems",
        duration: "20:15",
        views: 1543,
        category: "Integrations",
        thumbnail: "🎥",
    },
];

const FAQ_ITEMS = [
    {
        question: "How do I add a new client to the platform?",
        answer: "Navigate to the Client Directory, click 'Add Client' in the top right, and fill in the required information including company details, contacts, and engagement scope.",
        category: "Client Management",
    },
    {
        question: "What Irish regulations does the platform track?",
        answer: "The platform tracks all major Irish employment and HR regulations including WRC obligations, GDPR/Data Protection Act 2018, Health & Safety Acts, Employment Equality Acts, Working Time Act, Industrial Relations Acts, and Revenue PAYE requirements.",
        category: "Compliance & Regulatory",
    },
    {
        question: "How do I integrate with Revenue ROS?",
        answer: "Go to Settings > Integrations, find Revenue ROS, and click 'Connect'. You'll need your ROS credentials and will go through OAuth authentication with Revenue Commissioners.",
        category: "Integrations",
    },
    {
        question: "Can I export compliance reports to PDF?",
        answer: "Yes, all reports can be exported to PDF, Excel (XLSX), or CSV formats. Click the 'Export' button on any report and select your preferred format.",
        category: "Reports & Analytics",
    },
    {
        question: "How are Irish public holidays handled in the calendar?",
        answer: "Irish public holidays are automatically included in the calendar system. You can view them in the Calendar page and they're marked as 'Public Holiday' events.",
        category: "Calendar & Events",
    },
    {
        question: "Is my data GDPR compliant?",
        answer: "Yes, the platform is fully GDPR compliant and follows the Irish Data Protection Act 2018. All data is encrypted, stored securely in EU data centers, and you have full control over data access and deletion.",
        category: "Account & Billing",
    },
];

const REGULATORY_RESOURCES = [
    {
        title: "Workplace Relations Commission",
        description: "Official WRC website for adjudications, complaints, and guidance",
        url: "https://www.workplacerelations.ie",
        icon: Shield,
    },
    {
        title: "Data Protection Commission",
        description: "Irish DPC for GDPR guidance and compliance resources",
        url: "https://www.dataprotection.ie",
        icon: Lock,
    },
    {
        title: "Health & Safety Authority",
        description: "HSA resources for workplace health and safety compliance",
        url: "https://www.hsa.ie",
        icon: AlertCircle,
    },
    {
        title: "Revenue Commissioners",
        description: "Revenue guidance on PAYE, tax, and employer obligations",
        url: "https://www.revenue.ie",
        icon: FileCheck,
    },
    {
        title: "Citizens Information",
        description: "Comprehensive guide to Irish employment rights and obligations",
        url: "https://www.citizensinformation.ie",
        icon: BookOpen,
    },
];

/* ===== Helper Functions ===== */

function formatNumber(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
}

/* ===== Main Component ===== */

export function HelpCentrePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
    const [activeTab, setActiveTab] = useState<"articles" | "videos" | "faq" | "resources">(
        "articles"
    );

    const filteredArticles = POPULAR_ARTICLES.filter((article) => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredVideos = VIDEO_TUTORIALS.filter((video) => {
        const matchesSearch =
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || video.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredFAQs = FAQ_ITEMS.filter((faq) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            <div className="max-w-[1600px] mx-auto p-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-[24px] font-[700] text-foreground">Help Centre</h1>
                            <p className="text-[13px] text-muted-foreground">
                                Documentation, guides, and resources for HR advisory
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-xl border border-border p-6 mb-6">
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search for help articles, guides, FAQs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-14 pl-12 pr-12 rounded-lg border-2 border-input bg-background text-[15px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-indigo-600"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center mt-4">
                            <span className="text-[12px] text-muted-foreground">Popular searches:</span>
                            {["GDPR compliance", "WRC deadlines", "Client setup", "Export reports"].map(
                                (term) => (
                                    <button
                                        key={term}
                                        onClick={() => setSearchQuery(term)}
                                        className="text-[12px] text-indigo-600 hover:text-indigo-700 font-[500]"
                                    >
                                        {term}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {HELP_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() =>
                                    setSelectedCategory(
                                        selectedCategory === category.label ? null : category.label
                                    )
                                }
                                className={`bg-white rounded-xl border p-5 hover:border-indigo-200 hover:shadow-sm transition-all text-left ${selectedCategory === category.label ? "border-indigo-600 shadow-sm" : "border-border"
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selectedCategory === category.label ? "bg-indigo-50" : "bg-slate-50"
                                        }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${selectedCategory === category.label ? "text-indigo-600" : "text-muted-foreground"
                                            }`}
                                    />
                                </div>
                                <div className="text-[14px] font-[600] text-foreground mb-1">
                                    {category.label}
                                </div>
                                <div className="text-[12px] text-muted-foreground">{category.count} articles</div>
                            </button>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-[16px] font-[600] mb-2">Live Chat Support</h3>
                        <p className="text-[13px] opacity-90 mb-4">
                            Chat with our support team Monday–Friday, 9am–6pm IST
                        </p>
                        <button className="h-10 px-4 rounded-lg bg-white/20 hover:bg-white/30 text-[13px] font-[500] transition-colors flex items-center gap-2">
                            Start Chat
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-[16px] font-[600] mb-2">Email Support</h3>
                        <p className="text-[13px] opacity-90 mb-4">
                            Get help via email — we typically respond within 4 hours
                        </p>
                        <button className="h-10 px-4 rounded-lg bg-white/20 hover:bg-white/30 text-[13px] font-[500] transition-colors flex items-center gap-2">
                            Send Email
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="text-[16px] font-[600] mb-2">Phone Support</h3>
                        <p className="text-[13px] opacity-90 mb-4">
                            Call us at +353 1 234 5678 for urgent assistance
                        </p>
                        <button className="h-10 px-4 rounded-lg bg-white/20 hover:bg-white/30 text-[13px] font-[500] transition-colors flex items-center gap-2">
                            Call Now
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-border">
                    <div className="border-b border-border px-6">
                        <div className="flex gap-1 -mb-px overflow-x-auto">
                            {[
                                { id: "articles", label: "Help Articles", count: filteredArticles.length },
                                { id: "videos", label: "Video Tutorials", count: filteredVideos.length },
                                { id: "faq", label: "FAQs", count: filteredFAQs.length },
                                { id: "resources", label: "Irish Regulatory Resources" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 h-12 text-[13px] font-[500] border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? "border-indigo-600 text-indigo-600"
                                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                        }`}
                                >
                                    {tab.label}
                                    {tab.count !== undefined && (
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-[600]">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Articles Tab */}
                        {activeTab === "articles" && (
                            <div className="space-y-4">
                                {filteredArticles.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                            <Book className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-[15px] font-[600] text-foreground mb-1">
                                            No articles found
                                        </h3>
                                        <p className="text-[13px] text-muted-foreground">
                                            Try adjusting your search or browse by category
                                        </p>
                                    </div>
                                ) : (
                                    filteredArticles.map((article) => {
                                        const Icon = article.icon;
                                        return (
                                            <div
                                                key={article.id}
                                                onClick={() => setSelectedArticle(article)}
                                                className="bg-slate-50 rounded-lg p-5 border border-border hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0">
                                                        <Icon className="w-6 h-6 text-indigo-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-[15px] font-[600] text-foreground mb-1">
                                                            {article.title}
                                                        </h3>
                                                        <p className="text-[13px] text-muted-foreground mb-3">
                                                            {article.description}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <Activity className="w-3.5 h-3.5" />
                                                                {formatNumber(article.views)} views
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                {article.helpful} helpful
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                Updated {formatDate(article.lastUpdated)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {/* Videos Tab */}
                        {activeTab === "videos" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredVideos.map((video) => (
                                    <div
                                        key={video.id}
                                        className="bg-white rounded-lg border border-border hover:border-indigo-200 hover:shadow-sm transition-all overflow-hidden cursor-pointer"
                                    >
                                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative group">
                                            <div className="text-[48px]">{video.thumbnail}</div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                                                    <Play className="w-8 h-8 text-indigo-600 ml-1" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-[11px] font-[500]">
                                                {video.duration}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-[14px] font-[600] text-foreground mb-1">
                                                {video.title}
                                            </h3>
                                            <p className="text-[12px] text-muted-foreground mb-3 line-clamp-2">
                                                {video.description}
                                            </p>
                                            <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Activity className="w-3.5 h-3.5" />
                                                    {formatNumber(video.views)} views
                                                </div>
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-[500]">
                                                    {video.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* FAQ Tab */}
                        {activeTab === "faq" && (
                            <div className="space-y-3">
                                {filteredFAQs.map((faq, index) => (
                                    <details
                                        key={index}
                                        className="group bg-slate-50 rounded-lg border border-border overflow-hidden"
                                    >
                                        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-3 flex-1">
                                                <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                                <span className="text-[14px] font-[500] text-foreground">
                                                    {faq.question}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                                        </summary>
                                        <div className="px-4 pb-4 pl-12">
                                            <p className="text-[13px] text-muted-foreground leading-relaxed">
                                                {faq.answer}
                                            </p>
                                            <div className="mt-3 pt-3 border-t border-border">
                                                <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-[500] bg-white border border-border">
                                                    {faq.category}
                                                </span>
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        )}

                        {/* Resources Tab */}
                        {activeTab === "resources" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[15px] font-[600] text-foreground mb-3">
                                        Irish Regulatory Bodies
                                    </h3>
                                    <p className="text-[13px] text-muted-foreground mb-4">
                                        Official government resources for Irish employment law and compliance
                                    </p>
                                    <div className="space-y-3">
                                        {REGULATORY_RESOURCES.map((resource, index) => {
                                            const Icon = resource.icon;
                                            return (
                                                <a
                                                    key={index}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-indigo-200 hover:shadow-sm transition-all bg-white"
                                                >
                                                    <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                                                        <Icon className="w-6 h-6 text-indigo-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[14px] font-[600] text-foreground mb-1">
                                                            {resource.title}
                                                        </div>
                                                        <div className="text-[12px] text-muted-foreground">
                                                            {resource.description}
                                                        </div>
                                                    </div>
                                                    <ExternalLink className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border">
                                    <h3 className="text-[15px] font-[600] text-foreground mb-3">
                                        Downloadable Resources
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            "Irish Employment Law Quick Reference Guide",
                                            "GDPR Compliance Checklist for HR",
                                            "WRC Adjudication Preparation Template",
                                            "Health & Safety Risk Assessment Template",
                                        ].map((resource, index) => (
                                            <button
                                                key={index}
                                                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-indigo-200 hover:shadow-sm transition-all text-left bg-white"
                                            >
                                                <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                                <span className="text-[13px] font-[500] text-foreground flex-1">
                                                    {resource}
                                                </span>
                                                <Download className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-xl border border-border p-6 mt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                            <div>
                                <div className="text-[14px] font-[600] text-foreground">
                                    All Systems Operational
                                </div>
                                <div className="text-[12px] text-muted-foreground">
                                    Last checked: 2 minutes ago
                                </div>
                            </div>
                        </div>
                        <button className="text-[13px] font-[500] text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5">
                            View Status Page
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Article Detail Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-end">
                    <div className="absolute inset-0" onClick={() => setSelectedArticle(null)} />
                    <div className="relative w-full max-w-3xl h-full bg-white shadow-2xl overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    {(() => {
                                        const Icon = selectedArticle.icon;
                                        return <Icon className="w-5 h-5 text-indigo-600" />;
                                    })()}
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-[600] text-foreground">
                                        {selectedArticle.title}
                                    </h2>
                                    <p className="text-[12px] text-muted-foreground">
                                        Updated {formatDate(selectedArticle.lastUpdated)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-border">
                                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                                    <Activity className="w-4 h-4" />
                                    {formatNumber(selectedArticle.views)} views
                                </div>
                                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {selectedArticle.helpful} found this helpful
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none">
                                <p className="text-[14px] text-muted-foreground leading-relaxed">
                                    {selectedArticle.description}
                                </p>
                                <p className="text-[14px] text-foreground leading-relaxed mt-4">
                                    This is a placeholder for the full article content. In a real implementation,
                                    this would contain the complete help article with detailed instructions,
                                    screenshots, code examples, and step-by-step guides relevant to Irish HR
                                    advisory and compliance requirements.
                                </p>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <div className="text-[14px] font-[600] text-foreground mb-3">
                                    Was this article helpful?
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 h-10 px-4 rounded-lg text-[13px] font-[500] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Yes, helpful
                                    </button>
                                    <button className="flex-1 h-10 px-4 rounded-lg text-[13px] font-[500] bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                                        <X className="w-4 h-4" />
                                        Not helpful
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}