import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { mockClients } from "../components/mock-data";
import type { Client, Task, Document, Alert, Communication, TimelineEvent } from "../components/mock-data";

interface ApiContextType {
    clients: Client[];
    loading: boolean;
    error: string | null;
    isLive: boolean; // True if loaded from backend, false if using mock fallback
    refreshData: () => Promise<void>;
    
    // Mutation methods
    addClient: (client: Partial<Client>) => Promise<Client>;
    updateClient: (id: string, client: Partial<Client>) => Promise<Client>;
    deleteClient: (id: string) => Promise<void>;
    
    // Sub-resource helpers (updates the local state collections synchronously)
    addTask: (clientId: string, task: Partial<Task>) => Promise<Task>;
    updateTask: (clientId: string, taskId: string, taskUpdates: Partial<Task>) => Promise<Task>;
    addDocument: (clientId: string, doc: Partial<Document>) => Promise<Document>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isLive, setIsLive] = useState<boolean>(false);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            console.log("Connecting to API backend...");
            const liveClients = await api.getClients();
            setClients(liveClients);
            setIsLive(true);
            setError(null);
            console.log("Successfully connected and loaded data from API backend.");
        } catch (err: any) {
            console.warn(
                "API Connection failed. Falling back to mock local data. Error details:",
                err.message
            );
            // Revert/stay with mockClients
            setClients(mockClients);
            setIsLive(false);
            setError(err.message || "Failed to fetch from backend. Operating in local Mock Mode.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // 1. Add Client
    const addClient = async (newClientData: Partial<Client>): Promise<Client> => {
        if (isLive) {
            try {
                const created = await api.createClient(newClientData);
                setClients(prev => [created, ...prev]);
                return created;
            } catch (err) {
                console.error("Failed to save new client to API backend:", err);
                throw err;
            }
        } else {
            // Mock local insertion
            const mockCreated: Client = {
                id: `CLT-${Math.floor(100 + Math.random() * 900)}`,
                name: newClientData.name || "Unnamed Client",
                tradingName: newClientData.tradingName || newClientData.name || "Unnamed Client",
                parentCompany: newClientData.parentCompany || "",
                subsidiaries: newClientData.subsidiaries || [],
                businessStructure: newClientData.businessStructure || "Private Limited Company (Ltd)",
                yearEstablished: newClientData.yearEstablished || new Date().getFullYear(),
                industry: newClientData.industry || "General",
                companySize: newClientData.companySize || 1,
                companySizeLabel: newClientData.companySizeLabel || "Micro (1–10)",
                engagementStatus: newClientData.engagementStatus || "Active",
                assignedAdvisors: newClientData.assignedAdvisors || [],
                riskLevel: newClientData.riskLevel || "Low",
                contractType: newClientData.contractType || "Retainer",
                nextReviewDate: newClientData.nextReviewDate || "",
                lastActivityDate: new Date().toISOString().split("T")[0],
                lastActivityTimestamp: new Date().toISOString(),
                location: newClientData.location || "Dublin",
                dateAdded: new Date().toISOString().split("T")[0],
                registeredAddress: newClientData.registeredAddress || "",
                headOfficeAddress: newClientData.headOfficeAddress || "",
                primaryLocation: newClientData.primaryLocation || "Dublin",
                branchLocations: newClientData.branchLocations || [],
                businessDescription: newClientData.businessDescription || "",
                marketSector: newClientData.marketSector || "Private",
                unionised: newClientData.unionised || "No",
                multiSite: newClientData.multiSite || false,
                registrationNumber: newClientData.registrationNumber || "",
                taxId: newClientData.taxId || "",
                vatNumber: newClientData.vatNumber || "",
                incorporationNumber: newClientData.incorporationNumber || "",
                jurisdiction: newClientData.jurisdiction || "Republic of Ireland",
                incorporationDate: newClientData.incorporationDate || "",
                contacts: newClientData.contacts || [],
                engagementType: newClientData.engagementType || "Retainer",
                engagementStartDate: newClientData.engagementStartDate || "",
                engagementEndDate: newClientData.engagementEndDate || "",
                serviceScope: newClientData.serviceScope || "",
                slaDetails: newClientData.slaDetails || "",
                escalationPath: newClientData.escalationPath || "",
                contractValue: newClientData.contractValue || "€0",
                services: newClientData.services || [],
                complianceStatus: newClientData.complianceStatus || "Good",
                complianceGaps: newClientData.complianceGaps || [],
                regulatoryObligations: newClientData.regulatoryObligations || [],
                riskCategory: newClientData.riskCategory || "General",
                auditReadinessScore: newClientData.auditReadinessScore || 100,
                complianceReviewSchedule: newClientData.complianceReviewSchedule || "Annual",
                incidentHistory: newClientData.incidentHistory || 0,
                documents: newClientData.documents || [],
                tasks: newClientData.tasks || [],
                communications: newClientData.communications || [],
                notes: newClientData.notes || [],
                clientHealthScore: newClientData.clientHealthScore || 100,
                satisfactionScore: newClientData.satisfactionScore || 100,
                npsRating: newClientData.npsRating || 10,
                renewalLikelihood: newClientData.renewalLikelihood || "Very Likely",
                billingModel: newClientData.billingModel || "Monthly retainer",
                outstandingPayments: newClientData.outstandingPayments || "€0.00",
                renewalDate: newClientData.renewalDate || "",
                alerts: newClientData.alerts || [],
                timeline: newClientData.timeline || [],
            };
            setClients(prev => [mockCreated, ...prev]);
            return mockCreated;
        }
    };

    // 2. Update Client
    const updateClient = async (id: string, updates: Partial<Client>): Promise<Client> => {
        if (isLive) {
            try {
                const updated = await api.updateClient(id, updates);
                setClients(prev => prev.map(c => (c.id === id ? updated : c)));
                return updated;
            } catch (err) {
                console.error(`Failed to update client ${id} on API backend:`, err);
                throw err;
            }
        } else {
            // Mock local update
            let updatedClient: Client | null = null;
            setClients(prev => prev.map(c => {
                if (c.id === id) {
                    updatedClient = { ...c, ...updates } as Client;
                    return updatedClient;
                }
                return c;
            }));
            if (!updatedClient) throw new Error(`Client with id ${id} not found.`);
            return updatedClient;
        }
    };

    // 3. Delete Client
    const deleteClient = async (id: string): Promise<void> => {
        if (isLive) {
            try {
                await api.deleteClient(id);
                setClients(prev => prev.filter(c => c.id !== id));
            } catch (err) {
                console.error(`Failed to delete client ${id} on API backend:`, err);
                throw err;
            }
        } else {
            setClients(prev => prev.filter(c => c.id !== id));
        }
    };

    // 4. Add Task (Sub-resource helper)
    const addTask = async (clientId: string, taskData: Partial<Task>): Promise<Task> => {
        const mockTask: Task = {
            id: taskData.id || `T-${Math.floor(100 + Math.random() * 900)}`,
            title: taskData.title || "Untitled Task",
            description: taskData.description || "",
            status: taskData.status || "Open",
            assignedTo: taskData.assignedTo || "Unassigned",
            priority: taskData.priority || "Medium",
            category: taskData.category || "General Advisory",
            regulatoryRef: taskData.regulatoryRef || "N/A",
            dueDate: taskData.dueDate || new Date().toISOString().split("T")[0],
            createdDate: new Date().toISOString().split("T")[0],
            createdTimestamp: new Date().toISOString(),
        };

        if (isLive) {
            try {
                // Try to hit tasks endpoint if backend supports independent task operations
                const savedTask = await api.createTask({ ...mockTask, clientId } as any);
                setClients(prev => prev.map(c => {
                    if (c.id === clientId) {
                        return { ...c, tasks: [savedTask, ...c.tasks] };
                    }
                    return c;
                }));
                return savedTask;
            } catch (err) {
                console.warn("Failed to create task through independent API. Trying nested Client update instead...", err);
            }
        }

        // Fallback nested collection update
        setClients(prev => prev.map(c => {
            if (c.id === clientId) {
                return { ...c, tasks: [mockTask, ...c.tasks] };
            }
            return c;
        }));
        return mockTask;
    };

    // 5. Update Task
    const updateTask = async (clientId: string, taskId: string, taskUpdates: Partial<Task>): Promise<Task> => {
        if (isLive) {
            try {
                const updated = await api.updateTask(taskId, taskUpdates);
                setClients(prev => prev.map(c => {
                    if (c.id === clientId) {
                        return {
                            ...c,
                            tasks: c.tasks.map(t => (t.id === taskId ? { ...t, ...updated } : t)),
                        };
                    }
                    return c;
                }));
                return updated;
            } catch (err) {
                console.warn(`Failed to update task ${taskId} through independent API. Trying nested Client update instead...`);
            }
        }

        let updatedTask: Task | null = null;
        setClients(prev => prev.map(c => {
            if (c.id === clientId) {
                const newTasks = c.tasks.map(t => {
                    if (t.id === taskId) {
                        updatedTask = { ...t, ...taskUpdates } as Task;
                        return updatedTask;
                    }
                    return t;
                });
                return { ...c, tasks: newTasks };
            }
            return c;
        }));
        
        if (!updatedTask) throw new Error(`Task ${taskId} not found under client ${clientId}`);
        return updatedTask;
    };

    // 6. Add Document
    const addDocument = async (clientId: string, docData: Partial<Document>): Promise<Document> => {
        const mockDoc: Document = {
            id: docData.id || `D-${Math.floor(100 + Math.random() * 900)}`,
            name: docData.name || "Untitled Document",
            type: docData.type || "Other",
            uploadDate: new Date().toISOString().split("T")[0],
            uploadTimestamp: new Date().toISOString(),
            expiryDate: docData.expiryDate || null,
            version: docData.version || "1.0",
            uploadedBy: docData.uploadedBy || "System User",
            description: docData.description || "",
            fileSize: docData.fileSize || "0 KB",
            confidentiality: docData.confidentiality || "Internal",
            regulatoryRef: docData.regulatoryRef || "N/A",
        };

        // Standard Nested updates
        setClients(prev => prev.map(c => {
            if (c.id === clientId) {
                return { ...c, documents: [mockDoc, ...c.documents] };
            }
            return c;
        }));
        return mockDoc;
    };

    return (
        <ApiContext.Provider
            value={{
                clients,
                loading,
                error,
                isLive,
                refreshData: fetchAllData,
                addClient,
                updateClient,
                deleteClient,
                addTask,
                updateTask,
                addDocument,
            }}
        >
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error("useApi must be used within an ApiProvider");
    }
    return context;
};
