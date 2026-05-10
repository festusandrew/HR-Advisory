import { Search, Bell, MessageSquare } from "lucide-react";

interface TopBarProps {
    breadcrumbs: string[];
    searchValue: string;
    onSearchChange: (value: string) => void;
}

export function TopBar({ breadcrumbs, searchValue, onSearchChange }: TopBarProps) {
    return (
        <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-white">
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="flex items-center gap-2">
                        {index > 0 && <span className="text-[#D1D5DB]">/</span>}
                        <span className={index === breadcrumbs.length - 1 ? "text-foreground font-[600]" : "hover:text-foreground cursor-pointer"}>
                            {crumb}
                        </span>
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-4 py-1.5 text-[13px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]/40"
                    />
                </div>
                <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <Bell className="w-[18px] h-[18px] text-[#6B7280]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <MessageSquare className="w-[18px] h-[18px] text-[#6B7280]" />
                </button>
            </div>
        </div>
    );
}
