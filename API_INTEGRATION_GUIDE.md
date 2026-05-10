# HR Advisory Backend API Integration Guide

This guide is designed for the backend developer to understand the required data structures, REST endpoints, and schema contracts expected by the frontend React-Vite application.

---

## 🚀 API Base URL & Configuration

The application is configured to read its backend API base URL from the environment.

- **Dev environment file:** `.env`
- **Config variable:** `VITE_API_BASE_URL` (Defaults to `http://localhost:5000/api`)

---

## 📦 Data Strategy & Object Nesting

Currently, the frontend derives all aggregate metrics, dashboard graphs, alerts, global tasks, and timelines by **flat-mapping nested collections inside Client objects**.

To integrate successfully with minimal frontend code changes:
- Your `GET /api/clients` and `GET /api/clients/:id` endpoints should return `Client` objects that **include** nested arrays of:
  - `contacts`
  - `services`
  - `documents`
  - `tasks`
  - `communications`
  - `alerts`
  - `timeline`

*Note: For maximum flexibility, independent task and document update endpoints are also pre-defined in the API client.*

---

## 🛣️ API Endpoint Contracts

### 1. Clients Resource

#### `GET /api/clients`
- **Description:** Retrieve all client profiles with nested sub-collections.
- **Success Response:** `200 OK` (Array of Clients)
- **JSON Structure:**
```json
[
  {
    "id": "CLT-001",
    "name": "Crestfield Technologies DAC",
    "tradingName": "Crestfield Tech",
    "parentCompany": "Crestfield Group Holdings Ltd",
    "subsidiaries": ["Crestfield Cloud Ireland", "Crestfield Data Solutions"],
    "businessStructure": "Designated Activity Company (DAC)",
    "yearEstablished": 2011,
    "industry": "Technology",
    "companySize": 380,
    "companySizeLabel": "Mid-Market (201–500)",
    "engagementStatus": "Active",
    "assignedAdvisors": ["Aoife Brennan", "Cian Murphy"],
    "riskLevel": "Medium",
    "contractType": "Retainer",
    "nextReviewDate": "2026-03-13",
    "lastActivityDate": "2026-02-05",
    "lastActivityTimestamp": "2026-02-05T14:32:00Z",
    "location": "Dublin 2",
    "dateAdded": "2024-06-10",
    "registeredAddress": "4th Floor, 32 Fitzwilliam Square, Dublin 2, D02 FH68",
    "headOfficeAddress": "4th Floor, 32 Fitzwilliam Square, Dublin 2, D02 FH68",
    "primaryLocation": "Dublin 2",
    "branchLocations": ["Cork City", "Galway City"],
    "businessDescription": "Enterprise SaaS and cloud platform provider...",
    "marketSector": "Private",
    "unionised": "No",
    "multiSite": true,
    "registrationNumber": "CRO 524891",
    "taxId": "Tax Ref 3214567R",
    "vatNumber": "IE 3214567RH",
    "incorporationNumber": "CRO 524891",
    "jurisdiction": "Republic of Ireland",
    "incorporationDate": "2011-04-18",
    "contacts": [
      {
        "id": "C1",
        "name": "Siobhán Doyle",
        "jobTitle": "Head of People & Culture",
        "email": "siobhan.doyle@crestfield.ie",
        "phone": "+353 1 678 4321",
        "preferredContact": "Email",
        "availabilityNotes": "Available Mon–Fri 09:00–17:30 IST"
      }
    ],
    "services": [
      {
        "id": "S1",
        "name": "Employee Relations Support",
        "status": "Active",
        "priority": "High",
        "timeline": "Ongoing",
        "dependencies": "None"
      }
    ],
    "complianceStatus": "Attention Needed",
    "complianceGaps": [
      "GDPR Data Protection Impact Assessment overdue for HR systems"
    ],
    "regulatoryObligations": ["Employment Equality Acts 1998–2015"],
    "riskCategory": "ER, Compliance",
    "auditReadinessScore": 71,
    "complianceReviewSchedule": "Quarterly",
    "incidentHistory": 3,
    "documents": [
      {
        "id": "D1",
        "name": "Retainer Agreement 2024–2026",
        "type": "Contract",
        "uploadDate": "2024-06-12",
        "uploadTimestamp": "2024-06-12T10:15:00Z",
        "expiryDate": "2026-06-15",
        "version": "2.0",
        "uploadedBy": "Aoife Brennan",
        "description": "Master retainer agreement...",
        "fileSize": "1.4 MB",
        "confidentiality": "Confidential",
        "regulatoryRef": "N/A"
      }
    ],
    "tasks": [
      {
        "id": "T1",
        "title": "Complete GDPR DPIA for HR systems",
        "description": "Finalise Data Protection Impact Assessment...",
        "status": "Overdue",
        "assignedTo: "Cian Murphy",
        "priority": "High",
        "category": "GDPR & Data Protection",
        "regulatoryRef": "GDPR Article 35 / Data Protection Act 2018",
        "dueDate": "2026-01-31",
        "createdDate": "2026-01-10",
        "createdTimestamp": "2026-01-10T09:00:00Z"
      }
    ],
    "communications": [
      {
        "id": "CM1",
        "type": "Email",
        "subject": "GDPR DPIA – Follow Up",
        "date": "2026-02-05",
        "timestamp": "2026-02-05T14:32:00Z",
        "participants": "Cian Murphy, Siobhán Doyle",
        "summary": "Discussed timeline extension...",
        "hasAttachment": true
      }
    ],
    "notes": [
      "Client considering expansion to Limerick."
    ],
    "clientHealthScore": 76,
    "satisfactionScore": 82,
    "npsRating": 7,
    "renewalLikelihood": "Likely",
    "billingModel": "Monthly retainer with project top-ups",
    "outstandingPayments": "€0.00",
    "renewalDate": "2026-06-15",
    "alerts": [
      {
        "id": "A1",
        "type": "Overdue Task",
        "message": "GDPR DPIA for HR systems is 6 days overdue",
        "severity": "Critical",
        "date": "2026-02-06",
        "timestamp": "2026-02-06T08:00:00Z"
      }
    ],
    "timeline": [
      {
        "id": "TL1",
        "type": "Communication",
        "title": "Email: GDPR DPIA Follow Up",
        "description": "Discussed timeline extension...",
        "date": "2026-02-05",
        "timestamp": "2026-02-05T14:32:00Z",
        "user": "Cian Murphy"
      }
    ]
  }
]
```

#### `GET /api/clients/:id`
- **Description:** Retrieve detailed information of a single client.
- **Success Response:** `200 OK` (Single Client object)

#### `POST /api/clients`
- **Description:** Create a new Client profile.
- **Request Body:** Partial or Full Client JSON payload.
- **Success Response:** `201 Created` (Created Client object, including generated `id`)

#### `PUT /api/clients/:id`
- **Description:** Update an existing Client profile.
- **Request Body:** Partial Client JSON payload containing updated fields.
- **Success Response:** `200 OK` (Updated Client object)

#### `DELETE /api/clients/:id`
- **Description:** Delete an existing Client profile.
- **Success Response:** `204 No Content` or `200 OK`

---

### 2. Tasks Resource (Independent Operations)

#### `GET /api/tasks`
- **Description:** Optional global endpoint to retrieve all Tasks.
- **Success Response:** `200 OK` (Array of Tasks)

#### `POST /api/tasks`
- **Description:** Add a new Task.
- **Request Body:** Partial Task payload containing parent `clientId` reference.
- **Success Response:** `201 Created` (Created Task object, including generated `id`)

#### `PUT /api/tasks/:id`
- **Description:** Update a Task status or fields.
- **Request Body:** Partial Task payload.
- **Success Response:** `200 OK` (Updated Task object)

#### `DELETE /api/tasks/:id`
- **Description:** Delete a Task.
- **Success Response:** `204 No Content` or `200 OK`

---

## 🛠️ TypeScript Schemas (Reference Contracts)

Use these schemas to map database tables, serializers, and entity definitions:

```typescript
export interface Contact {
    id: string;
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    preferredContact: string;
    availabilityNotes: string;
}

export interface Service {
    id: string;
    name: string;
    status: "Active" | "Completed" | "Planned";
    priority: "High" | "Medium" | "Low";
    timeline: string;
    dependencies: string;
}

export type TaskCategory =
    | "GDPR & Data Protection"
    | "WRC & Employment Law"
    | "Health & Safety"
    | "Employee Relations"
    | "Industrial Relations"
    | "Policy & Compliance"
    | "Revenue & Payroll"
    | "Workforce Planning"
    | "HIQA Compliance"
    | "CBI Compliance"
    | "General Advisory";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: "Open" | "In Progress" | "Overdue" | "Completed";
    assignedTo: string;
    priority: "High" | "Medium" | "Low";
    category: TaskCategory;
    regulatoryRef: string;
    dueDate: string;
    createdDate: string;
    createdTimestamp: string;
    completedDate?: string;
}

export interface Communication {
    id: string;
    type: "Email" | "Meeting" | "Call" | "Advisory Update" | "Client Request";
    subject: string;
    date: string;
    timestamp: string;
    participants: string;
    summary: string;
    hasAttachment: boolean;
}

export interface Document {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    uploadTimestamp: string;
    expiryDate: string | null;
    version: string;
    uploadedBy: string;
    description?: string;
    fileSize?: string;
    confidentiality?: "Public" | "Internal" | "Confidential" | "Restricted";
    regulatoryRef?: string;
}

export interface Alert {
    id: string;
    type: "Compliance Risk" | "SLA Breach" | "Overdue Task" | "Contract Renewal" | "Escalation";
    message: string;
    severity: "Critical" | "Warning" | "Info";
    date: string;
    timestamp: string;
}

export interface TimelineEvent {
    id: string;
    type: "Document" | "Task" | "Meeting" | "Compliance" | "Communication";
    title: string;
    description: string;
    date: string;
    timestamp: string;
    user: string;
}

export interface Client {
    id: string;
    name: string;
    tradingName: string;
    parentCompany: string;
    subsidiaries: string[];
    businessStructure: string;
    yearEstablished: number;
    industry: string;
    companySize: number;
    companySizeLabel: string;
    engagementStatus: "Active" | "On Hold" | "Completed";
    assignedAdvisors: string[];
    riskLevel: "Low" | "Medium" | "High";
    contractType: string;
    nextReviewDate: string;
    lastActivityDate: string;
    lastActivityTimestamp: string;
    location: string;
    dateAdded: string;
    registeredAddress: string;
    headOfficeAddress: string;
    primaryLocation: string;
    branchLocations: string[];
    businessDescription: string;
    marketSector: string;
    unionised: "Yes" | "No" | "Partial";
    multiSite: boolean;
    registrationNumber: string;
    taxId: string;
    vatNumber: string;
    incorporationNumber: string;
    jurisdiction: string;
    incorporationDate: string;
    contacts: Contact[];
    engagementType: string;
    engagementStartDate: string;
    engagementEndDate: string;
    serviceScope: string;
    slaDetails: string;
    escalationPath: string;
    contractValue: string;
    services: Service[];
    complianceStatus: "Good" | "Attention Needed";
    complianceGaps: string[];
    regulatoryObligations: string[];
    riskCategory: string;
    auditReadinessScore: number;
    complianceReviewSchedule: string;
    incidentHistory: number;
    documents: Document[];
    tasks: Task[];
    communications: Communication[];
    notes: string[];
    clientHealthScore: number;
    satisfactionScore: number;
    npsRating: number;
    renewalLikelihood: string;
    billingModel: string;
    outstandingPayments: string;
    renewalDate: string;
    alerts: Alert[];
    timeline: TimelineEvent[];
}
```
