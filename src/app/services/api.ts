import type { Client, Task } from "@/components/mock-data";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Generic Fetch Request Helper
 */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText || 'Unknown Error'}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json() as Promise<T>;
}

/**
 * Unified API Client Definition
 */
export const api = {
    // Client Resource Endpoints
    async getClients(): Promise<Client[]> {
        return request<Client[]>("/clients");
    },

    async getClient(id: string): Promise<Client> {
        return request<Client>(`/clients/${id}`);
    },

    async createClient(client: Partial<Client>): Promise<Client> {
        return request<Client>("/clients", {
            method: "POST",
            body: JSON.stringify(client),
        });
    },

    async updateClient(id: string, client: Partial<Client>): Promise<Client> {
        return request<Client>(`/clients/${id}`, {
            method: "PUT",
            body: JSON.stringify(client),
        });
    },

    async deleteClient(id: string): Promise<void> {
        return request<void>(`/clients/${id}`, {
            method: "DELETE",
        });
    },

    // Independent Task Resource Endpoints (if backend implements them separately)
    async getTasks(): Promise<Task[]> {
        return request<Task[]>("/tasks");
    },

    async createTask(task: Partial<Task>): Promise<Task> {
        return request<Task>("/tasks", {
            method: "POST",
            body: JSON.stringify(task),
        });
    },

    async updateTask(id: string, task: Partial<Task>): Promise<Task> {
        return request<Task>(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(task),
        });
    },

    async deleteTask(id: string): Promise<void> {
        return request<void>(`/tasks/${id}`, {
            method: "DELETE",
        });
    },
};
