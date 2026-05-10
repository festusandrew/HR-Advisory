import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Dashboard } from "./components/Dashboard";
import { ClientDirectory } from "./components/ClientDirectory";
import { ClientProfile } from "./components/ClientProfile";
import { TasksPage } from "./components/TasksPage";
import { DocumentsPage } from "./components/DocumentsPage";
import { ReportsPage } from "./components/ReportsPage";
import { CompliancePage } from "./components/CompliancePage";
import { CalendarPage } from "./components/CalendarPage";
import { IntegrationsPage } from "./components/IntegrationsPage";
import { SettingsPage } from "./components/SettingsPage";
import { HelpCentrePage } from "./components/HelpCentrePage";
import type { Client } from "./components/mock-data";
import { useApi } from "./context/ApiContext";

// Parse initial view from address bar URL
const getInitialStateFromUrl = () => {
    if (typeof window === "undefined") return { view: "dashboard", clientId: null };
    const path = window.location.pathname;
    const segments = path.split("/").filter(Boolean);
    const viewSegment = segments[0] || "dashboard";
    
    let view = "dashboard";
    let clientId: string | null = null;
    
    const validViews = [
        "dashboard", "clients", "tasks", "documents", "reports", 
        "compliance", "calendar", "integrations", "settings", "helpcentre"
    ];
    
    if (validViews.includes(viewSegment)) {
        view = viewSegment;
    }
    
    if (view === "clients" && segments[1]) {
        clientId = segments[1];
    }
    
    return { view, clientId };
};

export default function App() {
    const { clients } = useApi();
    const [activeView, setActiveView] = useState(() => getInitialStateFromUrl().view);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(() => getInitialStateFromUrl().clientId);
    const [searchValue, setSearchValue] = useState("");

    // 1. Synchronize URL on activeView / selectedClientId changes
    useEffect(() => {
        const segments = [activeView];
        if (activeView === "clients" && selectedClientId) {
            segments.push(selectedClientId);
        }
        
        const newPathname = "/" + segments.join("/");
        if (window.location.pathname !== newPathname) {
            window.history.pushState({ activeView, selectedClientId }, "", newPathname);
        }
    }, [activeView, selectedClientId]);

    // 2. Listen to browser popstate (Back / Forward navigation buttons)
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            const state = event.state;
            if (state && state.activeView) {
                setActiveView(state.activeView);
                setSelectedClientId(state.selectedClientId || null);
            } else {
                const parsed = getInitialStateFromUrl();
                setActiveView(parsed.view);
                setSelectedClientId(parsed.clientId);
            }
        };

        window.addEventListener("popstate", handlePopState);
        
        // Populate initial state if empty
        if (!window.history.state) {
            window.history.replaceState({ activeView, selectedClientId }, "", window.location.pathname);
        }

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const selectedClient = clients.find((c) => c.id === selectedClientId) || null;

    const handleNavigate = (view: string) => {
        setActiveView(view);
        setSelectedClientId(null);
    };

    const handleSelectClient = (client: Client) => {
        setActiveView("clients");
        setSelectedClientId(client.id);
    };

    const handleBackToDirectory = () => {
        setSelectedClientId(null);
    };

    const handleNavigateToClients = () => {
        setActiveView("clients");
        setSelectedClientId(null);
    };

    const breadcrumbs = selectedClient
        ? ["HR Advisory", "Client Directory", selectedClient.tradingName]
        : activeView === "dashboard"
            ? ["HR Advisory", "Dashboard"]
            : activeView === "clients"
                ? ["HR Advisory", "Client Directory"]
                : activeView === "tasks"
                    ? ["HR Advisory", "Tasks & Action Items"]
                    : activeView === "documents"
                        ? ["HR Advisory", "Documents & Records"]
                        : activeView === "reports"
                            ? ["HR Advisory", "Reports & Analytics"]
                            : activeView === "compliance"
                                ? ["HR Advisory", "Compliance & Risk Management"]
                                : activeView === "calendar"
                                    ? ["HR Advisory", "Calendar & Events"]
                                    : activeView === "integrations"
                                        ? ["HR Advisory", "Integrations"]
                                        : activeView === "settings"
                                            ? ["HR Advisory", "Settings"]
                                            : activeView === "helpcentre"
                                                ? ["HR Advisory", "Help Centre"]
                                                : ["HR Advisory", activeView.charAt(0).toUpperCase() + activeView.slice(1)];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
            <Sidebar activeView={activeView} onNavigate={handleNavigate} />
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar
                    breadcrumbs={breadcrumbs}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                />
                {activeView === "dashboard" && (
                    <Dashboard
                        onNavigateToClient={handleSelectClient}
                        onNavigateToClients={handleNavigateToClients}
                        onNavigateToTasks={() => handleNavigate("tasks")}
                    />
                )}
                {activeView === "clients" && !selectedClient && (
                    <ClientDirectory
                        onSelectClient={handleSelectClient}
                        searchValue={searchValue}
                    />
                )}
                {activeView === "clients" && selectedClient && (
                    <ClientProfile
                        client={selectedClient}
                        onBack={handleBackToDirectory}
                    />
                )}
                {activeView === "tasks" && (
                    <TasksPage onNavigateToClient={handleSelectClient} />
                )}
                {activeView === "documents" && (
                    <DocumentsPage onNavigateToClient={handleSelectClient} />
                )}
                {activeView === "reports" && (
                    <ReportsPage onNavigateToClient={handleSelectClient} />
                )}
                {activeView === "compliance" && (
                    <CompliancePage onNavigateToClient={handleSelectClient} />
                )}
                {activeView === "calendar" && (
                    <CalendarPage onNavigateToClient={handleSelectClient} />
                )}
                {activeView === "integrations" && (
                    <IntegrationsPage onNavigateToClient={handleSelectClient} />
                )}
                {activeView === "settings" && (
                    <SettingsPage onNavigateToClient={handleSelectClient} />
                )}
                {activeView === "helpcentre" && (
                    <HelpCentrePage onNavigateToClient={handleSelectClient} />
                )}
                {activeView !== "dashboard" && activeView !== "clients" && activeView !== "tasks" && activeView !== "documents" && activeView !== "reports" && activeView !== "compliance" && activeView !== "calendar" && activeView !== "integrations" && activeView !== "settings" && activeView !== "helpcentre" && (
                    <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto mb-4">
                                <span className="text-[28px]">
                                    {activeView === "calendar" && "📅"}
                                </span>
                            </div>
                            <h2 className="text-[18px] font-[700] text-foreground capitalize">{activeView}</h2>
                            <p className="text-[13px] text-muted-foreground mt-1">This section is coming soon</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}