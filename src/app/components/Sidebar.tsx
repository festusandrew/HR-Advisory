import {
    LayoutDashboard,
    FolderOpen,
    CheckSquare,
    FileText,
    BarChart3,
    Shield,
    Calendar,
    Settings,
    HelpCircle,
    Zap,
    ChevronDown,
    Users,
} from "lucide-react";

interface SidebarProps {
    activeView: string;
    onNavigate: (view: string) => void;
}

const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clients", label: "Client Directory", icon: FolderOpen },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "compliance", label: "Compliance", icon: Shield },
    { id: "calendar", label: "Calendar", icon: Calendar },
];

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
    return (
        <aside className="w-[250px] min-w-[250px] h-screen bg-white border-r border-border flex flex-col">
            {/* Logo */}
            <div className="px-4 py-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-[15px] font-[700] text-foreground">HR Advisory</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-2 mt-1">
                <div className="space-y-0.5">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] transition-colors cursor-pointer ${isActive
                                        ? "bg-[#F0EFFE] text-[#4F46E5] font-[600]"
                                        : "text-[#4B5563] hover:bg-gray-50 font-[500]"
                                    }`}
                            >
                                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-[#4F46E5]" : "text-[#9CA3AF]"}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom items */}
            <div className="border-t border-border px-2 py-2 space-y-0.5">
                <button
                    onClick={() => onNavigate("integrations")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] transition-colors font-[500] cursor-pointer ${activeView === "integrations"
                            ? "bg-[#F0EFFE] text-[#4F46E5] font-[600]"
                            : "text-[#4B5563] hover:bg-gray-50"
                        }`}
                >
                    <Zap
                        className={`w-[18px] h-[18px] ${activeView === "integrations" ? "text-[#4F46E5]" : "text-[#9CA3AF]"
                            }`}
                    />
                    Integrations
                </button>
                <button
                    onClick={() => onNavigate("settings")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] transition-colors font-[500] cursor-pointer ${activeView === "settings"
                            ? "bg-[#F0EFFE] text-[#4F46E5] font-[600]"
                            : "text-[#4B5563] hover:bg-gray-50"
                        }`}
                >
                    <Settings
                        className={`w-[18px] h-[18px] ${activeView === "settings" ? "text-[#4F46E5]" : "text-[#9CA3AF]"
                            }`}
                    />
                    Settings
                </button>
                <button
                    onClick={() => onNavigate("helpcentre")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] transition-colors font-[500] cursor-pointer ${activeView === "helpcentre"
                            ? "bg-[#F0EFFE] text-[#4F46E5] font-[600]"
                            : "text-[#4B5563] hover:bg-gray-50"
                        }`}
                >
                    <HelpCircle
                        className={`w-[18px] h-[18px] ${activeView === "helpcentre" ? "text-[#4F46E5]" : "text-[#9CA3AF]"
                            }`}
                    />
                    Help Center
                </button>
            </div>

            {/* User */}
            <div className="border-t border-border px-3 py-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-[12px] font-[700]">
                    AB
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-[600] text-foreground truncate">Aoife Brennan</p>
                    <p className="text-[11px] text-muted-foreground truncate">Senior HR Advisor</p>
                </div>
                <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
        </aside>
    );
}