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

export const mockClients: Client[] = [
    {
        id: "CLT-001",
        name: "Crestfield Technologies DAC",
        tradingName: "Crestfield Tech",
        parentCompany: "Crestfield Group Holdings Ltd",
        subsidiaries: ["Crestfield Cloud Ireland", "Crestfield Data Solutions"],
        businessStructure: "Designated Activity Company (DAC)",
        yearEstablished: 2011,
        industry: "Technology",
        companySize: 380,
        companySizeLabel: "Mid-Market (201–500)",
        engagementStatus: "Active",
        assignedAdvisors: ["Aoife Brennan", "Cian Murphy"],
        riskLevel: "Medium",
        contractType: "Retainer",
        nextReviewDate: "2026-03-13",
        lastActivityDate: "2026-02-05",
        lastActivityTimestamp: "2026-02-05T14:32:00Z",
        location: "Dublin 2",
        dateAdded: "2024-06-10",
        registeredAddress: "4th Floor, 32 Fitzwilliam Square, Dublin 2, D02 FH68",
        headOfficeAddress: "4th Floor, 32 Fitzwilliam Square, Dublin 2, D02 FH68",
        primaryLocation: "Dublin 2",
        branchLocations: ["Cork City", "Galway City"],
        businessDescription: "Enterprise SaaS and cloud platform provider for European financial institutions. GDPR-certified data processing operations.",
        marketSector: "Private",
        unionised: "No",
        multiSite: true,
        registrationNumber: "CRO 524891",
        taxId: "Tax Ref 3214567R",
        vatNumber: "IE 3214567RH",
        incorporationNumber: "CRO 524891",
        jurisdiction: "Republic of Ireland",
        incorporationDate: "2011-04-18",
        contacts: [
            { id: "C1", name: "Siobhán Doyle", jobTitle: "Head of People & Culture", email: "siobhan.doyle@crestfield.ie", phone: "+353 1 678 4321", preferredContact: "Email", availabilityNotes: "Available Mon–Fri 09:00–17:30 IST" },
            { id: "C2", name: "Eoin Gallagher", jobTitle: "CEO", email: "eoin.gallagher@crestfield.ie", phone: "+353 1 678 4300", preferredContact: "Phone", availabilityNotes: "EA manages diary — contact pa@crestfield.ie" },
            { id: "C3", name: "Niamh Kavanagh", jobTitle: "HR Manager", email: "niamh.k@crestfield.ie", phone: "+353 1 678 4341", preferredContact: "Email", availabilityNotes: "Part-time Wed–Fri" },
            { id: "C4", name: "Ronan Walsh", jobTitle: "CFO", email: "ronan.walsh@crestfield.ie", phone: "+353 1 678 4310", preferredContact: "Email", availabilityNotes: "Billing & commercial queries only" },
            { id: "C5", name: "Orla Fitzgerald", jobTitle: "Operations Director", email: "orla.f@crestfield.ie", phone: "+353 1 678 4355", preferredContact: "Microsoft Teams", availabilityNotes: "Prefers afternoon meetings after 14:00" },
        ],
        engagementType: "Retainer",
        engagementStartDate: "2024-06-15",
        engagementEndDate: "2026-06-15",
        serviceScope: "Full HR advisory including ER support, WRC compliance, policy development, GDPR people-data management, and workforce planning",
        slaDetails: "48-hour response for standard queries, 4-hour for urgent ER/WRC matters",
        escalationPath: "HR Manager → Head of P&C → CEO",
        contractValue: "€128,000 / annum",
        services: [
            { id: "S1", name: "Employee Relations Support", status: "Active", priority: "High", timeline: "Ongoing", dependencies: "None" },
            { id: "S2", name: "WRC & Employment Law Compliance Audit", status: "Active", priority: "High", timeline: "Q1 2026", dependencies: "Policy review completion" },
            { id: "S3", name: "HR Policy Development (GDPR-aligned)", status: "Active", priority: "Medium", timeline: "Q1–Q2 2026", dependencies: "None" },
            { id: "S4", name: "Workforce Planning", status: "Planned", priority: "Medium", timeline: "Q3 2026", dependencies: "Headcount data from CFO" },
            { id: "S5", name: "Onboarding Programme Design", status: "Completed", priority: "Low", timeline: "Completed Dec 2025", dependencies: "None" },
        ],
        complianceStatus: "Attention Needed",
        complianceGaps: ["GDPR Data Protection Impact Assessment overdue for HR systems", "Organisation of Working Time Act — rest-break policy needs updating", "Workplace Relations Commission (WRC) complaint response template missing"],
        regulatoryObligations: ["Employment Equality Acts 1998–2015", "Organisation of Working Time Act 1997", "Safety, Health and Welfare at Work Act 2005", "GDPR / Data Protection Act 2018", "Unfair Dismissals Acts 1977–2015", "Terms of Employment (Information) Act 1994–2014"],
        riskCategory: "ER, Compliance",
        auditReadinessScore: 71,
        complianceReviewSchedule: "Quarterly",
        incidentHistory: 3,
        documents: [
            { id: "D1", name: "Retainer Agreement 2024–2026", type: "Contract", uploadDate: "2024-06-12", uploadTimestamp: "2024-06-12T10:15:00Z", expiryDate: "2026-06-15", version: "2.0", uploadedBy: "Aoife Brennan", description: "Master retainer agreement for ongoing HR advisory services covering ER, compliance, and workforce planning.", fileSize: "1.4 MB", confidentiality: "Confidential", regulatoryRef: "N/A" },
            { id: "D2", name: "Employee Handbook v3.1 (Ireland)", type: "HR Policy", uploadDate: "2025-11-20", uploadTimestamp: "2025-11-20T09:42:00Z", expiryDate: null, version: "3.1", uploadedBy: "Niamh Kavanagh", description: "Comprehensive employee handbook covering all statutory entitlements, company policies, and grievance procedures per Irish employment law.", fileSize: "3.8 MB", confidentiality: "Internal", regulatoryRef: "Terms of Employment (Information) Act 1994–2014" },
            { id: "D3", name: "WRC Compliance Audit Report Q4 2025", type: "Audit Report", uploadDate: "2025-12-18", uploadTimestamp: "2025-12-18T16:30:00Z", expiryDate: null, version: "1.0", uploadedBy: "Aoife Brennan", description: "Quarterly compliance audit covering WRC obligations, adjudication risk areas, and remediation recommendations.", fileSize: "2.1 MB", confidentiality: "Confidential", regulatoryRef: "Workplace Relations Act 2015" },
            { id: "D4", name: "GDPR DPIA – HR Systems Draft", type: "GDPR Record", uploadDate: "2026-01-15", uploadTimestamp: "2026-01-15T11:20:00Z", expiryDate: null, version: "0.2", uploadedBy: "Cian Murphy", description: "Draft Data Protection Impact Assessment for HR technology platforms (HRIS, payroll, recruitment systems).", fileSize: "890 KB", confidentiality: "Restricted", regulatoryRef: "GDPR Article 35 / Data Protection Act 2018" },
            { id: "D5", name: "Working Time Compliance Matrix", type: "Advisory", uploadDate: "2026-01-28", uploadTimestamp: "2026-01-28T14:55:00Z", expiryDate: null, version: "1.0", uploadedBy: "Aoife Brennan", description: "Detailed compliance matrix mapping Organisation of Working Time Act requirements against current practices.", fileSize: "520 KB", confidentiality: "Internal", regulatoryRef: "Organisation of Working Time Act 1997" },
            { id: "D6", name: "Dignity at Work Policy", type: "HR Policy", uploadDate: "2025-10-10", uploadTimestamp: "2025-10-10T09:00:00Z", expiryDate: null, version: "2.0", uploadedBy: "Aoife Brennan", description: "Anti-bullying and anti-harassment policy aligned with the Employment Equality Acts and SI 208/2012.", fileSize: "680 KB", confidentiality: "Internal", regulatoryRef: "Employment Equality Acts 1998–2015" },
            { id: "D7", name: "GDPR Data Processing Agreement", type: "GDPR Record", uploadDate: "2025-08-22", uploadTimestamp: "2025-08-22T14:10:00Z", expiryDate: "2026-08-22", version: "1.0", uploadedBy: "Cian Murphy", description: "Data Processing Agreement between Crestfield Tech and HR advisory firm per GDPR Article 28.", fileSize: "410 KB", confidentiality: "Confidential", regulatoryRef: "GDPR Article 28" },
            { id: "D8", name: "Remote Working Policy (Ireland)", type: "HR Policy", uploadDate: "2025-12-12", uploadTimestamp: "2025-12-12T10:30:00Z", expiryDate: null, version: "1.0", uploadedBy: "Cian Murphy", description: "Statutory remote working policy under the Work Life Balance Act, including H&S obligations for remote workers.", fileSize: "540 KB", confidentiality: "Internal", regulatoryRef: "Work Life Balance and Miscellaneous Provisions Act 2023" },
        ],
        tasks: [
            { id: "T1", title: "Complete GDPR DPIA for HR systems", description: "Finalise Data Protection Impact Assessment for all HR technology platforms including HRIS, payroll, and recruitment systems. Required under Article 35 GDPR.", status: "Overdue", assignedTo: "Cian Murphy", priority: "High", category: "GDPR & Data Protection", regulatoryRef: "GDPR Article 35 / Data Protection Act 2018", dueDate: "2026-01-31", createdDate: "2026-01-10", createdTimestamp: "2026-01-10T09:00:00Z" },
            { id: "T2", title: "Update rest-break policy (Working Time Act)", description: "Review and update rest-break and maximum working hours policy to comply with the Organisation of Working Time Act 1997, incorporating recent WRC adjudication precedents.", status: "In Progress", assignedTo: "Aoife Brennan", priority: "High", category: "WRC & Employment Law", regulatoryRef: "Organisation of Working Time Act 1997", dueDate: "2026-02-28", createdDate: "2026-01-15", createdTimestamp: "2026-01-15T09:30:00Z" },
            { id: "T3", title: "Prepare Q1 WRC compliance review report", description: "Compile quarterly review covering all WRC obligations, adjudication outcomes, and recommended policy amendments for Crestfield Tech.", status: "Open", assignedTo: "Aoife Brennan", priority: "Medium", category: "WRC & Employment Law", regulatoryRef: "Workplace Relations Act 2015", dueDate: "2026-03-13", createdDate: "2026-02-01", createdTimestamp: "2026-02-01T10:00:00Z" },
            { id: "T4", title: "Draft WRC complaint response template", description: "Create standardised template for responding to WRC complaints per the Workplace Relations Act.", status: "Open", assignedTo: "Cian Murphy", priority: "Medium", category: "WRC & Employment Law", regulatoryRef: "Workplace Relations Act 2015", dueDate: "2026-02-20", createdDate: "2026-02-03", createdTimestamp: "2026-02-03T11:00:00Z" },
            { id: "T5", title: "Schedule workforce planning kick-off", description: "Arrange initial workforce planning session with CFO to review headcount projections and succession planning.", status: "Open", assignedTo: "Aoife Brennan", priority: "Low", category: "Workforce Planning", regulatoryRef: "N/A", dueDate: "2026-04-01", createdDate: "2026-02-05", createdTimestamp: "2026-02-05T09:10:00Z" },
            { id: "T6", title: "Finalise remote working policy", description: "Completed remote working policy in line with the Work Life Balance Act and H&S obligations for remote workers.", status: "Completed", assignedTo: "Cian Murphy", priority: "Medium", category: "Policy & Compliance", regulatoryRef: "Work Life Balance and Miscellaneous Provisions Act 2023", dueDate: "2025-12-15", createdDate: "2025-11-01", createdTimestamp: "2025-11-01T09:00:00Z", completedDate: "2025-12-12" },
            { id: "T7", title: "Deliver anti-harassment training programme", description: "Delivered mandatory anti-harassment and dignity at work training for all people managers.", status: "Completed", assignedTo: "Aoife Brennan", priority: "High", category: "Employee Relations", regulatoryRef: "Employment Equality Acts 1998–2015", dueDate: "2025-11-30", createdDate: "2025-10-01", createdTimestamp: "2025-10-01T09:00:00Z", completedDate: "2025-11-28" },
        ],
        communications: [
            { id: "CM1", type: "Email", subject: "GDPR DPIA – Follow Up", date: "2026-02-05", timestamp: "2026-02-05T14:32:00Z", participants: "Cian Murphy, Siobhán Doyle", summary: "Discussed timeline extension for DPIA. Client agreed to provide system inventory by 12 Feb.", hasAttachment: true },
            { id: "CM2", type: "Meeting", subject: "Monthly Advisory Review – January", date: "2026-01-28", timestamp: "2026-01-28T10:00:00Z", participants: "Aoife Brennan, Cian Murphy, Siobhán Doyle, Niamh Kavanagh", summary: "Reviewed compliance gaps, discussed Working Time Act policy update. Agreed on Q1 priorities.", hasAttachment: true },
            { id: "CM3", type: "Call", subject: "Urgent ER Query – Performance Management", date: "2026-01-22", timestamp: "2026-01-22T11:15:00Z", participants: "Aoife Brennan, Siobhán Doyle", summary: "Client seeking guidance on managing underperformance for a senior developer. Provided initial advice per Unfair Dismissals Acts and scheduled follow-up.", hasAttachment: false },
            { id: "CM4", type: "Advisory Update", subject: "Employment Law Update – January 2026", date: "2026-01-15", timestamp: "2026-01-15T09:00:00Z", participants: "Cian Murphy, All Contacts", summary: "Shared legislative update regarding new Workplace Relations amendments effective March 2026.", hasAttachment: true },
            { id: "CM5", type: "Client Request", subject: "Request for redundancy process guidance", date: "2026-01-10", timestamp: "2026-01-10T16:45:00Z", participants: "Siobhán Doyle", summary: "Client restructuring Cork office. Requesting process guidance per Redundancy Payments Acts and template documents.", hasAttachment: false },
        ],
        notes: [
            "Client considering expansion to Limerick — may need region-specific advisory in Q3.",
            "CEO is very hands-on with HR decisions — ensure all major recommendations go through Eoin Gallagher.",
            "Cork office has higher turnover — recommend targeted retention strategy.",
            "Strong relationship with Niamh Kavanagh — key day-to-day contact for operational HR matters.",
        ],
        clientHealthScore: 76,
        satisfactionScore: 82,
        npsRating: 7,
        renewalLikelihood: "Likely",
        billingModel: "Monthly retainer with project top-ups",
        outstandingPayments: "€0.00",
        renewalDate: "2026-06-15",
        alerts: [
            { id: "A1", type: "Overdue Task", message: "GDPR DPIA for HR systems is 6 days overdue", severity: "Critical", date: "2026-02-06", timestamp: "2026-02-06T08:00:00Z" },
            { id: "A2", type: "Compliance Risk", message: "Working Time Act rest-break policy requires urgent update", severity: "Warning", date: "2026-02-01", timestamp: "2026-02-01T09:00:00Z" },
            { id: "A3", type: "Contract Renewal", message: "Contract renewal due in 4 months", severity: "Info", date: "2026-02-06", timestamp: "2026-02-06T08:00:00Z" },
        ],
        timeline: [
            { id: "TL1", type: "Communication", title: "Email: GDPR DPIA Follow Up", description: "Discussed timeline extension with Siobhán Doyle", date: "2026-02-05", timestamp: "2026-02-05T14:32:00Z", user: "Cian Murphy" },
            { id: "TL2", type: "Task", title: "Task Created: Schedule workforce planning", description: "New task assigned to Aoife Brennan", date: "2026-02-05", timestamp: "2026-02-05T09:10:00Z", user: "System" },
            { id: "TL3", type: "Document", title: "Document Uploaded: Working Time Compliance Matrix", description: "Version 1.0 uploaded", date: "2026-01-28", timestamp: "2026-01-28T14:55:00Z", user: "Aoife Brennan" },
            { id: "TL4", type: "Meeting", title: "Monthly Advisory Review", description: "January review meeting completed", date: "2026-01-28", timestamp: "2026-01-28T10:00:00Z", user: "Aoife Brennan" },
            { id: "TL5", type: "Communication", title: "Call: Urgent ER Query", description: "Performance management guidance provided", date: "2026-01-22", timestamp: "2026-01-22T11:15:00Z", user: "Aoife Brennan" },
            { id: "TL6", type: "Compliance", title: "Compliance Gap Identified", description: "Working Time Act policy update flagged as required", date: "2026-01-15", timestamp: "2026-01-15T11:20:00Z", user: "Cian Murphy" },
            { id: "TL7", type: "Document", title: "GDPR DPIA Draft Uploaded", description: "Initial draft v0.2", date: "2026-01-15", timestamp: "2026-01-15T11:20:00Z", user: "Cian Murphy" },
            { id: "TL8", type: "Task", title: "Task Created: Update rest-break policy", description: "High priority task assigned to Aoife Brennan", date: "2026-01-15", timestamp: "2026-01-15T09:30:00Z", user: "System" },
        ],
    },
    {
        id: "CLT-002",
        name: "Harbour Fresh Foods Ltd",
        tradingName: "Harbour Fresh",
        parentCompany: "",
        subsidiaries: [],
        businessStructure: "Private Limited Company (Ltd)",
        yearEstablished: 2015,
        industry: "Food & Beverage",
        companySize: 95,
        companySizeLabel: "Small (51–200)",
        engagementStatus: "Active",
        assignedAdvisors: ["Saoirse O'Neill"],
        riskLevel: "Low",
        contractType: "Project",
        nextReviewDate: "2026-04-01",
        lastActivityDate: "2026-02-04",
        lastActivityTimestamp: "2026-02-04T11:20:00Z",
        location: "Cork City",
        dateAdded: "2025-08-18",
        registeredAddress: "Unit 7, Marina Commercial Park, Centre Park Road, Cork, T12 HN80",
        headOfficeAddress: "Unit 7, Marina Commercial Park, Centre Park Road, Cork, T12 HN80",
        primaryLocation: "Cork City",
        branchLocations: ["Midleton, Co. Cork"],
        businessDescription: "Premium artisan food production and distribution across Ireland and the UK. FSAI-regulated facility.",
        marketSector: "Private",
        unionised: "Partial",
        multiSite: true,
        registrationNumber: "CRO 612483",
        taxId: "Tax Ref 8876543A",
        vatNumber: "IE 8876543A",
        incorporationNumber: "CRO 612483",
        jurisdiction: "Republic of Ireland",
        incorporationDate: "2015-07-01",
        contacts: [
            { id: "C1", name: "Deirdre Lynch", jobTitle: "Managing Director", email: "deirdre@harbourfresh.ie", phone: "+353 21 432 1098", preferredContact: "Email", availabilityNotes: "Available most weekdays 09:00–17:00 IST" },
            { id: "C2", name: "Padraig O'Sullivan", jobTitle: "Operations Manager", email: "padraig@harbourfresh.ie", phone: "+353 21 432 1099", preferredContact: "Phone", availabilityNotes: "Often at Midleton site Mon–Wed" },
        ],
        engagementType: "Project",
        engagementStartDate: "2025-08-18",
        engagementEndDate: "2026-08-18",
        serviceScope: "Collective agreement support and employment law compliance review",
        slaDetails: "72-hour standard response, 24-hour urgent",
        escalationPath: "Operations Manager → Managing Director",
        contractValue: "€54,000 (project)",
        services: [
            { id: "S1", name: "Collective Agreement Support", status: "Active", priority: "High", timeline: "Q1–Q2 2026", dependencies: "SIPTU consultation" },
            { id: "S2", name: "Employment Law Compliance Review", status: "Active", priority: "Medium", timeline: "Q1 2026", dependencies: "None" },
        ],
        complianceStatus: "Good",
        complianceGaps: [],
        regulatoryObligations: ["Organisation of Working Time Act 1997", "Safety, Health and Welfare at Work Act 2005", "Industrial Relations Acts 1946–2015", "GDPR / Data Protection Act 2018", "National Minimum Wage Act 2000"],
        riskCategory: "ER",
        auditReadinessScore: 87,
        complianceReviewSchedule: "Bi-annual",
        incidentHistory: 0,
        documents: [
            { id: "D1", name: "Project Agreement 2025–2026", type: "Contract", uploadDate: "2025-08-18", uploadTimestamp: "2025-08-18T10:00:00Z", expiryDate: "2026-08-18", version: "1.0", uploadedBy: "Saoirse O'Neill", description: "Project-based engagement agreement for IR advisory and collective bargaining support.", fileSize: "980 KB", confidentiality: "Confidential", regulatoryRef: "N/A" },
            { id: "D2", name: "Collective Bargaining Strategy Brief", type: "Advisory", uploadDate: "2026-01-20", uploadTimestamp: "2026-01-20T11:00:00Z", expiryDate: null, version: "1.0", uploadedBy: "Saoirse O'Neill", description: "Strategic brief for upcoming SIPTU collective agreement negotiations covering pay, conditions, and dispute resolution.", fileSize: "1.2 MB", confidentiality: "Restricted", regulatoryRef: "Industrial Relations Acts 1946–2015" },
            { id: "D3", name: "National Minimum Wage Compliance Memo", type: "Compliance Report", uploadDate: "2025-12-18", uploadTimestamp: "2025-12-18T09:30:00Z", expiryDate: null, version: "1.0", uploadedBy: "Saoirse O'Neill", description: "Compliance memo confirming all seasonal and part-time workers meet NMW Act requirements.", fileSize: "340 KB", confidentiality: "Internal", regulatoryRef: "National Minimum Wage Act 2000" },
        ],
        tasks: [
            { id: "T1", title: "Prepare collective agreement negotiation brief", description: "Draft negotiation brief for SIPTU discussions covering pay, conditions, and dispute resolution. Must align with Industrial Relations Acts.", status: "In Progress", assignedTo: "Saoirse O'Neill", priority: "High", category: "Industrial Relations", regulatoryRef: "Industrial Relations Acts 1946–2015", dueDate: "2026-02-14", createdDate: "2026-01-20", createdTimestamp: "2026-01-20T10:00:00Z" },
            { id: "T2", title: "Review National Minimum Wage compliance", description: "Verify all seasonal and part-time worker pay rates comply with National Minimum Wage Act, including sub-minimum rates for under-18s.", status: "Completed", assignedTo: "Saoirse O'Neill", priority: "Medium", category: "Revenue & Payroll", regulatoryRef: "National Minimum Wage Act 2000", dueDate: "2025-12-20", createdDate: "2025-11-15", createdTimestamp: "2025-11-15T09:00:00Z", completedDate: "2025-12-18" },
        ],
        communications: [
            { id: "CM1", type: "Meeting", subject: "Collective Agreement Strategy Session", date: "2026-02-04", timestamp: "2026-02-04T11:00:00Z", participants: "Saoirse O'Neill, Deirdre Lynch", summary: "Outlined negotiation strategy and key terms for SIPTU discussions.", hasAttachment: true },
        ],
        notes: ["Seasonal workforce peaks Jan–Mar. Plan engagements around production schedules.", "SIPTU representative (John Healy) is cooperative — good working relationship."],
        clientHealthScore: 90,
        satisfactionScore: 91,
        npsRating: 9,
        renewalLikelihood: "Very Likely",
        billingModel: "Fixed project fee with milestones",
        outstandingPayments: "€13,500.00",
        renewalDate: "2026-08-18",
        alerts: [],
        timeline: [
            { id: "TL1", type: "Meeting", title: "Collective Agreement Strategy Session", description: "Discussed negotiation approach with MD", date: "2026-02-04", timestamp: "2026-02-04T11:00:00Z", user: "Saoirse O'Neill" },
        ],
    },
    {
        id: "CLT-003",
        name: "Stronghold Construction Group Ltd",
        tradingName: "Stronghold Construction",
        parentCompany: "Stronghold Holdings plc",
        subsidiaries: ["Stronghold Residential Ltd", "Stronghold Commercial Builds Ltd"],
        businessStructure: "Private Limited Company (Ltd)",
        yearEstablished: 1999,
        industry: "Construction",
        companySize: 620,
        companySizeLabel: "Large (501–1000)",
        engagementStatus: "Active",
        assignedAdvisors: ["Aoife Brennan", "Declan Byrne"],
        riskLevel: "High",
        contractType: "Retainer",
        nextReviewDate: "2026-02-27",
        lastActivityDate: "2026-02-06",
        lastActivityTimestamp: "2026-02-06T09:15:00Z",
        location: "Dublin 12",
        dateAdded: "2023-11-05",
        registeredAddress: "Block C, Parkwest Business Park, Nangor Road, Dublin 12, D12 X6N4",
        headOfficeAddress: "Block C, Parkwest Business Park, Nangor Road, Dublin 12, D12 X6N4",
        primaryLocation: "Dublin 12",
        branchLocations: ["Limerick City", "Athlone, Co. Westmeath", "Waterford City"],
        businessDescription: "Major construction firm specialising in commercial and residential builds across Ireland. SOLAS-registered and CIF member.",
        marketSector: "Private",
        unionised: "Yes",
        multiSite: true,
        registrationNumber: "CRO 318762",
        taxId: "Tax Ref 6543210W",
        vatNumber: "IE 6543210W",
        incorporationNumber: "CRO 318762",
        jurisdiction: "Republic of Ireland",
        incorporationDate: "1999-09-22",
        contacts: [
            { id: "C1", name: "Brendan Hartley", jobTitle: "General Manager", email: "brendan@stronghold.ie", phone: "+353 1 405 6789", preferredContact: "Phone", availabilityNotes: "Often on site — mobile preferred" },
            { id: "C2", name: "Karen Molloy", jobTitle: "HR Director", email: "karen@stronghold.ie", phone: "+353 1 405 6780", preferredContact: "Email", availabilityNotes: "Mon–Thu office hours 09:00–17:00" },
            { id: "C3", name: "Shane Nolan", jobTitle: "Health & Safety Manager", email: "shane@stronghold.ie", phone: "+353 1 405 6785", preferredContact: "Phone", availabilityNotes: "Available 07:00–16:00 IST" },
        ],
        engagementType: "Retainer",
        engagementStartDate: "2023-11-05",
        engagementEndDate: "2026-11-05",
        serviceScope: "Full HR advisory with emphasis on H&S compliance, ER support, industrial relations, and WRC representation",
        slaDetails: "24-hour standard, 2-hour H&S/WRC incidents",
        escalationPath: "H&S Manager → HR Director → General Manager",
        contractValue: "€185,000 / annum",
        services: [
            { id: "S1", name: "Health & Safety Compliance Management", status: "Active", priority: "High", timeline: "Ongoing", dependencies: "HSA site inspections" },
            { id: "S2", name: "Industrial Relations & SIPTU Liaison", status: "Active", priority: "High", timeline: "Ongoing", dependencies: "Union negotiations" },
            { id: "S3", name: "ER Case Management & WRC Preparation", status: "Active", priority: "High", timeline: "Ongoing", dependencies: "None" },
            { id: "S4", name: "Sectoral Employment Order Interpretation", status: "Active", priority: "Medium", timeline: "Ongoing", dependencies: "None" },
        ],
        complianceStatus: "Attention Needed",
        complianceGaps: ["HSA incident reporting backlog — 4 reports outstanding", "Subcontractor Safety Statements overdue for review", "Safe Pass certification gaps at Limerick site"],
        regulatoryObligations: ["Safety, Health and Welfare at Work Act 2005", "Construction Regulations 2013 (S.I. No. 291)", "Industrial Relations Acts 1946–2015", "Sectoral Employment Orders (Construction)", "GDPR / Data Protection Act 2018", "Employment Equality Acts 1998–2015"],
        riskCategory: "H&S, ER, Compliance",
        auditReadinessScore: 56,
        complianceReviewSchedule: "Monthly",
        incidentHistory: 11,
        documents: [
            { id: "D1", name: "Retainer Agreement 2023–2026", type: "Contract", uploadDate: "2023-11-05", uploadTimestamp: "2023-11-05T09:00:00Z", expiryDate: "2026-11-05", version: "1.0", uploadedBy: "Aoife Brennan", description: "Long-term retainer for H&S, ER, and IR advisory. Covers all active construction sites.", fileSize: "1.6 MB", confidentiality: "Confidential", regulatoryRef: "N/A" },
            { id: "D2", name: "HSA Incident Report – Jan 2026", type: "H&S Report", uploadDate: "2026-01-30", uploadTimestamp: "2026-01-30T15:22:00Z", expiryDate: null, version: "1.0", uploadedBy: "Declan Byrne", description: "HSA incident report for 4 workplace injuries at Dublin and Limerick sites in January 2026.", fileSize: "2.3 MB", confidentiality: "Restricted", regulatoryRef: "Safety, Health and Welfare at Work Act 2005" },
            { id: "D3", name: "Safety Statement – Dublin Site", type: "H&S Report", uploadDate: "2025-09-15", uploadTimestamp: "2025-09-15T10:00:00Z", expiryDate: "2026-09-15", version: "3.0", uploadedBy: "Declan Byrne", description: "Site-specific Safety Statement for Dublin construction site per Section 20 of the Safety, Health and Welfare at Work Act.", fileSize: "4.5 MB", confidentiality: "Internal", regulatoryRef: "Safety, Health and Welfare at Work Act 2005 (Section 20)" },
            { id: "D4", name: "SEO Pay Rate Advisory Note", type: "Advisory", uploadDate: "2025-11-29", uploadTimestamp: "2025-11-29T14:00:00Z", expiryDate: null, version: "1.0", uploadedBy: "Declan Byrne", description: "Advisory note interpreting latest Sectoral Employment Order pay rate adjustments for construction workers.", fileSize: "280 KB", confidentiality: "Internal", regulatoryRef: "Sectoral Employment Orders (Construction)" },
            { id: "D5", name: "Disciplinary & Grievance Procedure", type: "HR Policy", uploadDate: "2025-10-28", uploadTimestamp: "2025-10-28T11:00:00Z", expiryDate: null, version: "2.0", uploadedBy: "Aoife Brennan", description: "Revised disciplinary and grievance procedure meeting constitutional and WRC fair procedures standards.", fileSize: "620 KB", confidentiality: "Internal", regulatoryRef: "S.I. No. 146/2000 — Code of Practice on Grievance and Disciplinary Procedures" },
        ],
        tasks: [
            { id: "T1", title: "Clear HSA incident reporting backlog", description: "Submit 4 outstanding HSA incident reports for January workplace injuries. HSA inspector visit expected imminently — priority resolution required.", status: "Overdue", assignedTo: "Declan Byrne", priority: "High", category: "Health & Safety", regulatoryRef: "Safety, Health and Welfare at Work Act 2005", dueDate: "2026-01-24", createdDate: "2026-01-10", createdTimestamp: "2026-01-10T08:30:00Z" },
            { id: "T2", title: "Complete subcontractor Safety Statement reviews", description: "Review and validate Safety Statements for all active subcontractors at Dublin and Limerick sites per Construction Regulations 2013.", status: "Overdue", assignedTo: "Aoife Brennan", priority: "High", category: "Health & Safety", regulatoryRef: "Construction Regulations 2013 (S.I. No. 291)", dueDate: "2026-01-31", createdDate: "2026-01-15", createdTimestamp: "2026-01-15T09:00:00Z" },
            { id: "T3", title: "Arrange Safe Pass recertification — Limerick", description: "Coordinate Safe Pass recertification for 12 workers at Limerick site whose cards expired in January.", status: "In Progress", assignedTo: "Declan Byrne", priority: "High", category: "Health & Safety", regulatoryRef: "Safety, Health and Welfare at Work (Construction) Regulations 2013", dueDate: "2026-02-13", createdDate: "2026-01-20", createdTimestamp: "2026-01-20T08:00:00Z" },
            { id: "T4", title: "Prepare quarterly compliance review", description: "Compile monthly compliance review for Stronghold covering H&S, ER, and IR obligations.", status: "Open", assignedTo: "Aoife Brennan", priority: "Medium", category: "Policy & Compliance", regulatoryRef: "Multiple — see engagement scope", dueDate: "2026-02-27", createdDate: "2026-02-01", createdTimestamp: "2026-02-01T09:00:00Z" },
            { id: "T5", title: "Draft SEO pay rate advisory note", description: "Prepare advisory note interpreting the latest Sectoral Employment Order pay rate adjustments for construction workers.", status: "Completed", assignedTo: "Declan Byrne", priority: "Medium", category: "Industrial Relations", regulatoryRef: "Sectoral Employment Orders (Construction)", dueDate: "2025-12-01", createdDate: "2025-11-10", createdTimestamp: "2025-11-10T09:00:00Z", completedDate: "2025-11-29" },
            { id: "T6", title: "Update disciplinary procedure (fair procedures)", description: "Revised disciplinary and grievance procedure to meet constitutional and WRC fair procedures standards.", status: "Completed", assignedTo: "Aoife Brennan", priority: "High", category: "Employee Relations", regulatoryRef: "S.I. No. 146/2000 — Code of Practice on Grievance and Disciplinary Procedures", dueDate: "2025-10-31", createdDate: "2025-09-15", createdTimestamp: "2025-09-15T09:00:00Z", completedDate: "2025-10-28" },
        ],
        communications: [
            { id: "CM1", type: "Call", subject: "HSA Incident Follow-Up", date: "2026-02-06", timestamp: "2026-02-06T09:15:00Z", participants: "Declan Byrne, Shane Nolan", summary: "Discussed site safety improvements following January incidents. HSA inspector visit expected next week.", hasAttachment: false },
        ],
        notes: [
            "HIGH RISK CLIENT — Multiple H&S incidents. Requires close monitoring.",
            "SIPTU relationship is strained post SEO pay rate dispute — handle IR matters with care.",
            "Limerick site has highest incident rate. Consider on-site H&S review with HSA liaison.",
        ],
        clientHealthScore: 52,
        satisfactionScore: 66,
        npsRating: 5,
        renewalLikelihood: "Uncertain",
        billingModel: "Monthly retainer",
        outstandingPayments: "€15,416.67",
        renewalDate: "2026-11-05",
        alerts: [
            { id: "A1", type: "Compliance Risk", message: "3 critical H&S compliance gaps — HSA inspection imminent", severity: "Critical", date: "2026-02-06", timestamp: "2026-02-06T08:00:00Z" },
            { id: "A2", type: "Overdue Task", message: "2 high-priority tasks overdue", severity: "Critical", date: "2026-02-06", timestamp: "2026-02-06T08:00:00Z" },
            { id: "A3", type: "SLA Breach", message: "HSA incident response SLA at risk", severity: "Warning", date: "2026-02-05", timestamp: "2026-02-05T17:00:00Z" },
        ],
        timeline: [
            { id: "TL1", type: "Communication", title: "Call: HSA Incident Follow-Up", description: "Discussed site safety improvements with H&S Manager", date: "2026-02-06", timestamp: "2026-02-06T09:15:00Z", user: "Declan Byrne" },
            { id: "TL2", type: "Document", title: "HSA Incident Report Uploaded", description: "January 2026 incident summary", date: "2026-01-30", timestamp: "2026-01-30T15:22:00Z", user: "Declan Byrne" },
        ],
    },
    {
        id: "CLT-004",
        name: "Carrigmore Healthcare CLG",
        tradingName: "Carrigmore Health",
        parentCompany: "",
        subsidiaries: ["Carrigmore Nursing Homes", "Carrigmore Home Care"],
        businessStructure: "Company Limited by Guarantee (CLG)",
        yearEstablished: 2006,
        industry: "Healthcare & Social Care",
        companySize: 275,
        companySizeLabel: "Mid-Market (201–500)",
        engagementStatus: "Active",
        assignedAdvisors: ["Saoirse O'Neill", "Cian Murphy"],
        riskLevel: "Medium",
        contractType: "Retainer",
        nextReviewDate: "2026-03-06",
        lastActivityDate: "2026-02-03",
        lastActivityTimestamp: "2026-02-03T16:10:00Z",
        location: "Dublin 9",
        dateAdded: "2024-01-15",
        registeredAddress: "Carrigmore House, Griffith Avenue, Dublin 9, D09 R5K2",
        headOfficeAddress: "Carrigmore House, Griffith Avenue, Dublin 9, D09 R5K2",
        primaryLocation: "Dublin 9",
        branchLocations: ["Swords, Co. Dublin", "Navan, Co. Meath"],
        businessDescription: "Not-for-profit healthcare provider operating nursing homes, disability services, and home care programmes. HIQA-regulated.",
        marketSector: "Not-for-Profit",
        unionised: "Yes",
        multiSite: true,
        registrationNumber: "CRO 445210 (CLG)",
        taxId: "Tax Ref 7654321B",
        vatNumber: "VAT Exempt (Charitable)",
        incorporationNumber: "CRO 445210",
        jurisdiction: "Republic of Ireland",
        incorporationDate: "2006-02-14",
        contacts: [
            { id: "C1", name: "Dr. Áine Flanagan", jobTitle: "CEO", email: "aine.flanagan@carrigmore.ie", phone: "+353 1 837 6540", preferredContact: "Email", availabilityNotes: "Tue–Thu preferred" },
            { id: "C2", name: "Conor Redmond", jobTitle: "People & Culture Manager", email: "conor.redmond@carrigmore.ie", phone: "+353 1 837 6545", preferredContact: "Email", availabilityNotes: "Full time, flexible hours" },
        ],
        engagementType: "Retainer",
        engagementStartDate: "2024-01-15",
        engagementEndDate: "2027-01-15",
        serviceScope: "HR advisory focusing on HIQA compliance, workforce planning, ER support, and Protected Disclosures guidance",
        slaDetails: "48-hour standard, 8-hour urgent",
        escalationPath: "P&C Manager → CEO",
        contractValue: "€89,000 / annum",
        services: [
            { id: "S1", name: "HIQA Compliance HR Support", status: "Active", priority: "High", timeline: "Ongoing", dependencies: "HIQA regulatory changes" },
            { id: "S2", name: "Workforce Planning", status: "Active", priority: "Medium", timeline: "Q1–Q2 2026", dependencies: "Staffing data" },
            { id: "S3", name: "ER Support & WRC Guidance", status: "Active", priority: "Medium", timeline: "Ongoing", dependencies: "None" },
        ],
        complianceStatus: "Good",
        complianceGaps: ["Mandatory training records incomplete for 10 care staff"],
        regulatoryObligations: ["Health Act 2007 (HIQA Standards)", "Safety, Health and Welfare at Work Act 2005", "Employment Equality Acts 1998–2015", "GDPR / Data Protection Act 2018", "Protected Disclosures Act 2014"],
        riskCategory: "Compliance",
        auditReadinessScore: 83,
        complianceReviewSchedule: "Quarterly",
        incidentHistory: 1,
        documents: [
            { id: "D1", name: "Retainer Agreement 2024–2027", type: "Contract", uploadDate: "2024-01-15", uploadTimestamp: "2024-01-15T09:00:00Z", expiryDate: "2027-01-15", version: "1.0", uploadedBy: "Saoirse O'Neill", description: "Three-year retainer covering HIQA compliance, workforce planning, and employment law advisory.", fileSize: "1.3 MB", confidentiality: "Confidential", regulatoryRef: "N/A" },
            { id: "D2", name: "HIQA Compliance Checklist 2026", type: "Compliance Report", uploadDate: "2026-01-10", uploadTimestamp: "2026-01-10T10:00:00Z", expiryDate: null, version: "1.0", uploadedBy: "Cian Murphy", description: "Annual HIQA compliance checklist covering person-in-charge regulations, staff qualifications, and care standards.", fileSize: "1.8 MB", confidentiality: "Internal", regulatoryRef: "Health Act 2007 (HIQA Standards)" },
            { id: "D3", name: "Garda Vetting Batch Records", type: "Compliance Report", uploadDate: "2025-12-22", uploadTimestamp: "2025-12-22T15:30:00Z", expiryDate: null, version: "1.0", uploadedBy: "Cian Murphy", description: "Batch Garda vetting renewal records for 15 care staff through National Vetting Bureau.", fileSize: "2.6 MB", confidentiality: "Restricted", regulatoryRef: "National Vetting Bureau (Children and Vulnerable Persons) Acts 2012–2016" },
            { id: "D4", name: "Protected Disclosures Policy (Draft)", type: "HR Policy", uploadDate: "2026-02-03", uploadTimestamp: "2026-02-03T10:30:00Z", expiryDate: null, version: "0.1", uploadedBy: "Saoirse O'Neill", description: "Draft protected disclosures (whistleblowing) policy aligned with the Protected Disclosures (Amendment) Act 2022.", fileSize: "380 KB", confidentiality: "Internal", regulatoryRef: "Protected Disclosures (Amendment) Act 2022" },
        ],
        tasks: [
            { id: "T1", title: "Follow up on mandatory training record gaps", description: "Chase 10 care staff for outstanding mandatory training certificates required under HIQA Person in Charge regulations.", status: "In Progress", assignedTo: "Cian Murphy", priority: "Medium", category: "HIQA Compliance", regulatoryRef: "Health Act 2007 (Care and Welfare of Residents in Designated Centres)", dueDate: "2026-02-28", createdDate: "2026-01-20", createdTimestamp: "2026-01-20T14:00:00Z" },
            { id: "T2", title: "Develop Protected Disclosures policy", description: "Draft protected disclosures (whistleblowing) policy aligned with the Protected Disclosures (Amendment) Act 2022 and EU Whistleblowing Directive.", status: "Open", assignedTo: "Saoirse O'Neill", priority: "Medium", category: "Policy & Compliance", regulatoryRef: "Protected Disclosures (Amendment) Act 2022", dueDate: "2026-03-15", createdDate: "2026-02-03", createdTimestamp: "2026-02-03T10:00:00Z" },
            { id: "T3", title: "Complete Garda vetting renewal batch", description: "Submitted batch Garda vetting renewal applications for 15 care staff through National Vetting Bureau.", status: "Completed", assignedTo: "Cian Murphy", priority: "High", category: "Policy & Compliance", regulatoryRef: "National Vetting Bureau (Children and Vulnerable Persons) Acts 2012–2016", dueDate: "2025-12-31", createdDate: "2025-11-20", createdTimestamp: "2025-11-20T09:00:00Z", completedDate: "2025-12-22" },
        ],
        communications: [
            { id: "CM1", type: "Email", subject: "Workforce Planning Data Request", date: "2026-02-03", timestamp: "2026-02-03T16:10:00Z", participants: "Saoirse O'Neill, Conor Redmond", summary: "Requested updated staffing data for workforce planning analysis ahead of Q1 review.", hasAttachment: false },
        ],
        notes: ["Valued long-term client. High satisfaction. Proactive approach to HIQA compliance.", "Sláintecare reforms creating workforce challenges — ongoing support needed."],
        clientHealthScore: 88,
        satisfactionScore: 90,
        npsRating: 9,
        renewalLikelihood: "Very Likely",
        billingModel: "Monthly retainer",
        outstandingPayments: "€0.00",
        renewalDate: "2027-01-15",
        alerts: [],
        timeline: [
            { id: "TL1", type: "Communication", title: "Email: Workforce Planning Data", description: "Requested staffing data from client", date: "2026-02-03", timestamp: "2026-02-03T16:10:00Z", user: "Saoirse O'Neill" },
        ],
    },
    {
        id: "CLT-005",
        name: "Fitzpatrick Retail Group DAC",
        tradingName: "Fitzpatrick Retail",
        parentCompany: "Fitzpatrick Investments Holdings",
        subsidiaries: ["Fitzpatrick Fashion Ltd", "Fitzpatrick Home & Living Ltd", "Fitzpatrick Online DAC"],
        businessStructure: "Designated Activity Company (DAC)",
        yearEstablished: 2002,
        industry: "Retail",
        companySize: 980,
        companySizeLabel: "Large (501–1000)",
        engagementStatus: "On Hold",
        assignedAdvisors: ["Declan Byrne"],
        riskLevel: "Medium",
        contractType: "Advisory",
        nextReviewDate: "2026-04-15",
        lastActivityDate: "2026-01-08",
        lastActivityTimestamp: "2026-01-08T15:30:00Z",
        location: "Dublin 1",
        dateAdded: "2024-09-01",
        registeredAddress: "Level 5, IFSC House, Custom House Quay, Dublin 1, D01 R2P9",
        headOfficeAddress: "Level 5, IFSC House, Custom House Quay, Dublin 1, D01 R2P9",
        primaryLocation: "Dublin 1",
        branchLocations: ["Dundrum, Dublin 16", "Blanchardstown, Dublin 15", "Patrick Street, Cork"],
        businessDescription: "Multi-brand retail group with 28 physical stores and e-commerce platform across Ireland.",
        marketSector: "Private",
        unionised: "Partial",
        multiSite: true,
        registrationNumber: "CRO 398210",
        taxId: "Tax Ref 4321098C",
        vatNumber: "IE 4321098C",
        incorporationNumber: "CRO 398210",
        jurisdiction: "Republic of Ireland",
        incorporationDate: "2002-04-10",
        contacts: [
            { id: "C1", name: "Victoria Naughton", jobTitle: "Chief People Officer", email: "victoria@fitzretail.ie", phone: "+353 1 611 2345", preferredContact: "Email", availabilityNotes: "On extended leave until March 2026" },
            { id: "C2", name: "Derek Simmons", jobTitle: "Acting HR Director", email: "derek@fitzretail.ie", phone: "+353 1 611 2350", preferredContact: "Phone", availabilityNotes: "Primary contact during Victoria's leave" },
        ],
        engagementType: "Advisory",
        engagementStartDate: "2024-09-01",
        engagementEndDate: "2026-09-01",
        serviceScope: "Strategic HR advisory and restructuring support",
        slaDetails: "5 business day response (advisory tier)",
        escalationPath: "Acting HR Director → CEO",
        contractValue: "€72,000 / annum",
        services: [
            { id: "S1", name: "Strategic HR Advisory", status: "Active", priority: "Medium", timeline: "Ongoing", dependencies: "None" },
            { id: "S2", name: "Restructure & Redundancy Support", status: "Active", priority: "High", timeline: "On hold pending board decision", dependencies: "Board approval" },
        ],
        complianceStatus: "Good",
        complianceGaps: [],
        regulatoryObligations: ["Unfair Dismissals Acts 1977–2015", "Redundancy Payments Acts 1967–2014", "Employment Equality Acts 1998–2015", "GDPR / Data Protection Act 2018", "National Minimum Wage Act 2000"],
        riskCategory: "ER",
        auditReadinessScore: 79,
        complianceReviewSchedule: "Bi-annual",
        incidentHistory: 2,
        documents: [
            { id: "D1", name: "Advisory Agreement 2024–2026", type: "Contract", uploadDate: "2024-09-01", uploadTimestamp: "2024-09-01T09:00:00Z", expiryDate: "2026-09-01", version: "1.0", uploadedBy: "Declan Byrne", description: "Advisory agreement covering ER, restructuring, and employment law support for retail network.", fileSize: "1.1 MB", confidentiality: "Confidential", regulatoryRef: "N/A" },
            { id: "D2", name: "Redundancy Consultation Plan (Draft)", type: "Legal", uploadDate: "2026-02-04", uploadTimestamp: "2026-02-04T09:00:00Z", expiryDate: null, version: "0.1", uploadedBy: "Declan Byrne", description: "Pre-prepared redundancy consultation plan framework under the Redundancy Payments Acts and Protection of Employment Act.", fileSize: "720 KB", confidentiality: "Restricted", regulatoryRef: "Redundancy Payments Acts 1967–2014 / Protection of Employment Act 1977" },
        ],
        tasks: [
            { id: "T1", title: "Await board restructure decision", description: "Monitor board decision on retail restructure. Once approved, prepare redundancy consultation plan per Redundancy Payments Acts and Protection of Employment Act.", status: "Open", assignedTo: "Declan Byrne", priority: "High", category: "Employee Relations", regulatoryRef: "Redundancy Payments Acts 1967–2014 / Protection of Employment Act 1977", dueDate: "2026-03-31", createdDate: "2026-01-08", createdTimestamp: "2026-01-08T15:30:00Z" },
            { id: "T2", title: "Draft collective redundancy notification template", description: "Pre-prepare collective redundancy notification for the Minister for Enterprise per Protection of Employment Act 1977 (30 days notice).", status: "Open", assignedTo: "Declan Byrne", priority: "Medium", category: "WRC & Employment Law", regulatoryRef: "Protection of Employment Act 1977", dueDate: "2026-04-15", createdDate: "2026-02-05", createdTimestamp: "2026-02-05T09:00:00Z" },
        ],
        communications: [
            { id: "CM1", type: "Email", subject: "Engagement Status Update", date: "2026-01-08", timestamp: "2026-01-08T15:30:00Z", participants: "Declan Byrne, Derek Simmons", summary: "Engagement placed on hold pending board restructure decision. Will resume in March.", hasAttachment: false },
        ],
        notes: ["Engagement on hold due to pending restructure decision. Key contact on leave.", "Large potential for expanded engagement once restructure approved — Redundancy Payments Acts guidance needed."],
        clientHealthScore: 64,
        satisfactionScore: 73,
        npsRating: 6,
        renewalLikelihood: "Uncertain",
        billingModel: "Monthly advisory fee",
        outstandingPayments: "€18,000.00",
        renewalDate: "2026-09-01",
        alerts: [
            { id: "A1", type: "Escalation", message: "Engagement on hold for 29 days — requires follow-up", severity: "Warning", date: "2026-02-06", timestamp: "2026-02-06T08:00:00Z" },
        ],
        timeline: [
            { id: "TL1", type: "Communication", title: "Email: Engagement Status Update", description: "Engagement placed on hold", date: "2026-01-08", timestamp: "2026-01-08T15:30:00Z", user: "Declan Byrne" },
        ],
    },
    {
        id: "CLT-006",
        name: "Ashgrove Education Trust CLG",
        tradingName: "Ashgrove Education",
        parentCompany: "",
        subsidiaries: [],
        businessStructure: "Company Limited by Guarantee (CLG)",
        yearEstablished: 2012,
        industry: "Education",
        companySize: 68,
        companySizeLabel: "Small (51–200)",
        engagementStatus: "Completed",
        assignedAdvisors: ["Cian Murphy"],
        riskLevel: "Low",
        contractType: "Project",
        nextReviewDate: "",
        lastActivityDate: "2025-12-15",
        lastActivityTimestamp: "2025-12-15T13:00:00Z",
        location: "Galway City",
        dateAdded: "2025-03-01",
        registeredAddress: "Ashgrove House, Newcastle Road, Galway, H91 V8X2",
        headOfficeAddress: "Ashgrove House, Newcastle Road, Galway, H91 V8X2",
        primaryLocation: "Galway City",
        branchLocations: [],
        businessDescription: "Multi-school education trust operating three primary schools in Galway and Connemara.",
        marketSector: "Not-for-Profit",
        unionised: "Yes",
        multiSite: true,
        registrationNumber: "CRO 521890 (CLG)",
        taxId: "Tax Ref 1122334D",
        vatNumber: "VAT Exempt (Educational)",
        incorporationNumber: "CRO 521890",
        jurisdiction: "Republic of Ireland",
        incorporationDate: "2012-01-18",
        contacts: [
            { id: "C1", name: "Margaret Ó Néill", jobTitle: "Executive Director", email: "margaret@ashgrove-edu.ie", phone: "+353 91 567 890", preferredContact: "Email", availabilityNotes: "School term hours only 08:30–15:30" },
        ],
        engagementType: "Project",
        engagementStartDate: "2025-03-01",
        engagementEndDate: "2025-12-15",
        serviceScope: "Policy review and update for all school sites aligned with Teaching Council and Dept of Education requirements",
        slaDetails: "5 business day standard response",
        escalationPath: "Executive Director",
        contractValue: "€24,000 (project)",
        services: [
            { id: "S1", name: "Policy Review & Update", status: "Completed", priority: "Medium", timeline: "Completed Dec 2025", dependencies: "None" },
        ],
        complianceStatus: "Good",
        complianceGaps: [],
        regulatoryObligations: ["Education Act 1998", "Teaching Council Acts 2001–2015", "Employment Equality Acts 1998–2015", "Children First Act 2015", "GDPR / Data Protection Act 2018"],
        riskCategory: "Low",
        auditReadinessScore: 93,
        complianceReviewSchedule: "Annual",
        incidentHistory: 0,
        documents: [
            { id: "D1", name: "Project Agreement", type: "Contract", uploadDate: "2025-03-01", uploadTimestamp: "2025-03-01T09:00:00Z", expiryDate: "2025-12-15", version: "1.0", uploadedBy: "Cian Murphy", description: "Project-based agreement for ETB employment policy framework development.", fileSize: "870 KB", confidentiality: "Confidential", regulatoryRef: "N/A" },
            { id: "D2", name: "Final Policy Package", type: "HR Policy", uploadDate: "2025-12-15", uploadTimestamp: "2025-12-15T13:00:00Z", expiryDate: null, version: "1.0", uploadedBy: "Cian Murphy", description: "Complete delivered policy package covering recruitment, disciplinary, grievance, dignity at work, and leave policies.", fileSize: "5.2 MB", confidentiality: "Internal", regulatoryRef: "Education Act 1998 / Teaching Council Acts 2001–2015" },
            { id: "D3", name: "Children First Compliance Guide", type: "Compliance Report", uploadDate: "2025-11-20", uploadTimestamp: "2025-11-20T10:00:00Z", expiryDate: null, version: "1.0", uploadedBy: "Cian Murphy", description: "Guide to Children First Act compliance for ETB staff and board members.", fileSize: "1.1 MB", confidentiality: "Internal", regulatoryRef: "Children First Act 2015" },
        ],
        tasks: [],
        communications: [
            { id: "CM1", type: "Email", subject: "Project Completion & Handover", date: "2025-12-15", timestamp: "2025-12-15T13:00:00Z", participants: "Cian Murphy, Margaret Ó Néill", summary: "Delivered final policy package. Client very satisfied with outcomes. Interest in 2026 engagement.", hasAttachment: true },
        ],
        notes: ["Completed engagement. Client expressed interest in future compliance retainer for 2026–27 school year.", "Potential for ongoing GDPR and Children First Act support."],
        clientHealthScore: 95,
        satisfactionScore: 96,
        npsRating: 10,
        renewalLikelihood: "Very Likely",
        billingModel: "Fixed project fee",
        outstandingPayments: "€0.00",
        renewalDate: "",
        alerts: [],
        timeline: [
            { id: "TL1", type: "Document", title: "Final Policy Package Delivered", description: "All policies reviewed and updated for 3 school sites", date: "2025-12-15", timestamp: "2025-12-15T13:00:00Z", user: "Cian Murphy" },
        ],
    },
    {
        id: "CLT-007",
        name: "Atlantic Financial Services DAC",
        tradingName: "Atlantic Finance",
        parentCompany: "Atlantic Group plc",
        subsidiaries: ["Atlantic Wealth Management", "Atlantic Insurance Brokers"],
        businessStructure: "Designated Activity Company (DAC)",
        yearEstablished: 2013,
        industry: "Financial Services",
        companySize: 245,
        companySizeLabel: "Mid-Market (201–500)",
        engagementStatus: "Active",
        assignedAdvisors: ["Aoife Brennan"],
        riskLevel: "Low",
        contractType: "Retainer",
        nextReviewDate: "2026-05-01",
        lastActivityDate: "2026-02-05",
        lastActivityTimestamp: "2026-02-05T10:45:00Z",
        location: "Dublin 4",
        dateAdded: "2024-03-10",
        registeredAddress: "3rd Floor, The Atrium, Sandyford Business Park, Dublin 18, D18 H3Y7",
        headOfficeAddress: "3rd Floor, The Atrium, Sandyford Business Park, Dublin 18, D18 H3Y7",
        primaryLocation: "Dublin 4",
        branchLocations: ["Cork City"],
        businessDescription: "Central Bank of Ireland-regulated financial planning and wealth management services provider.",
        marketSector: "Private",
        unionised: "No",
        multiSite: true,
        registrationNumber: "CRO 548320",
        taxId: "Tax Ref 9988776E",
        vatNumber: "IE 9988776E",
        incorporationNumber: "CRO 548320",
        jurisdiction: "Republic of Ireland",
        incorporationDate: "2013-06-30",
        contacts: [
            { id: "C1", name: "Andrew McCarthy", jobTitle: "Managing Partner", email: "andrew@atlanticfinance.ie", phone: "+353 1 293 4567", preferredContact: "Email", availabilityNotes: "Senior partner — strategic matters only" },
            { id: "C2", name: "Nina Petrova", jobTitle: "HR Business Partner", email: "nina@atlanticfinance.ie", phone: "+353 1 293 4570", preferredContact: "Email", availabilityNotes: "Day-to-day operational contact" },
        ],
        engagementType: "Retainer",
        engagementStartDate: "2024-03-10",
        engagementEndDate: "2027-03-10",
        serviceScope: "HR advisory, Central Bank fitness & probity compliance, GDPR people-data, policy development",
        slaDetails: "48-hour standard, 8-hour urgent",
        escalationPath: "HR BP → Managing Partner",
        contractValue: "€102,000 / annum",
        services: [
            { id: "S1", name: "HR Advisory", status: "Active", priority: "Medium", timeline: "Ongoing", dependencies: "None" },
            { id: "S2", name: "Central Bank Fitness & Probity Compliance", status: "Active", priority: "High", timeline: "Ongoing", dependencies: "CBI requirements" },
            { id: "S3", name: "GDPR People-Data Policy Development", status: "Active", priority: "Medium", timeline: "Q2 2026", dependencies: "None" },
        ],
        complianceStatus: "Good",
        complianceGaps: [],
        regulatoryObligations: ["Central Bank Reform Act 2010 (F&P Standards)", "GDPR / Data Protection Act 2018", "Employment Equality Acts 1998–2015", "Organisation of Working Time Act 1997", "Terms of Employment (Information) Act 1994–2014"],
        riskCategory: "Compliance",
        auditReadinessScore: 91,
        complianceReviewSchedule: "Quarterly",
        incidentHistory: 0,
        documents: [
            { id: "D1", name: "Retainer Agreement 2024–2027", type: "Contract", uploadDate: "2024-03-10", uploadTimestamp: "2024-03-10T10:00:00Z", expiryDate: "2027-03-10", version: "1.0", uploadedBy: "Aoife Brennan", description: "Three-year retainer for CBI compliance, employment law, and HR advisory services.", fileSize: "1.5 MB", confidentiality: "Confidential", regulatoryRef: "N/A" },
            { id: "D2", name: "CBI Fitness & Probity Review Report", type: "Compliance Report", uploadDate: "2026-01-15", uploadTimestamp: "2026-01-15T10:00:00Z", expiryDate: null, version: "1.0", uploadedBy: "Aoife Brennan", description: "Review of Central Bank Fitness & Probity Standards compliance for all PCF and CF role holders.", fileSize: "1.9 MB", confidentiality: "Restricted", regulatoryRef: "Central Bank Reform Act 2010 (F&P Standards)" },
            { id: "D3", name: "GDPR Employee Privacy Notice (Updated)", type: "GDPR Record", uploadDate: "2025-12-20", uploadTimestamp: "2025-12-20T11:30:00Z", expiryDate: null, version: "2.0", uploadedBy: "Aoife Brennan", description: "Updated employee-facing GDPR privacy notice covering lawful basis, retention periods, and data subject rights.", fileSize: "310 KB", confidentiality: "Internal", regulatoryRef: "GDPR Articles 13–14 / Data Protection Act 2018" },
        ],
        tasks: [
            { id: "T1", title: "Review CBI Fitness & Probity training requirements", description: "Assess Central Bank of Ireland Fitness & Probity Standards training requirements for all PCF and CF role holders. Ensure compliance with CBI Individual Accountability Framework.", status: "In Progress", assignedTo: "Aoife Brennan", priority: "Medium", category: "CBI Compliance", regulatoryRef: "Central Bank Reform Act 2010 (F&P Standards)", dueDate: "2026-02-20", createdDate: "2026-02-01", createdTimestamp: "2026-02-01T11:00:00Z" },
            { id: "T2", title: "Update GDPR privacy notices for employee data", description: "Review and update all employee-facing GDPR privacy notices including lawful basis, retention periods, and data subject rights per DPC guidance.", status: "Completed", assignedTo: "Aoife Brennan", priority: "Medium", category: "GDPR & Data Protection", regulatoryRef: "GDPR Articles 13–14 / Data Protection Act 2018", dueDate: "2025-12-31", createdDate: "2025-11-15", createdTimestamp: "2025-11-15T10:00:00Z", completedDate: "2025-12-20" },
        ],
        communications: [
            { id: "CM1", type: "Email", subject: "Q1 Advisory Check-in", date: "2026-02-05", timestamp: "2026-02-05T10:45:00Z", participants: "Aoife Brennan, Nina Petrova", summary: "Routine quarterly check-in. All services on track. CBI F&P review progressing well.", hasAttachment: false },
        ],
        notes: ["Well-managed client with strong internal HR capability.", "Central Bank F&P compliance is the primary value-add of our engagement."],
        clientHealthScore: 92,
        satisfactionScore: 89,
        npsRating: 8,
        renewalLikelihood: "Very Likely",
        billingModel: "Monthly retainer",
        outstandingPayments: "€0.00",
        renewalDate: "2027-03-10",
        alerts: [],
        timeline: [
            { id: "TL1", type: "Communication", title: "Email: Q1 Advisory Check-in", description: "Routine quarterly review — all on track", date: "2026-02-05", timestamp: "2026-02-05T10:45:00Z", user: "Aoife Brennan" },
        ],
    },
    {
        id: "CLT-008",
        name: "SwiftRoute Logistics Ltd",
        tradingName: "SwiftRoute",
        parentCompany: "",
        subsidiaries: [],
        businessStructure: "Private Limited Company (Ltd)",
        yearEstablished: 2018,
        industry: "Transport & Logistics",
        companySize: 160,
        companySizeLabel: "Small (51–200)",
        engagementStatus: "Active",
        assignedAdvisors: ["Declan Byrne", "Saoirse O'Neill"],
        riskLevel: "High",
        contractType: "Compliance-only",
        nextReviewDate: "2026-02-13",
        lastActivityDate: "2026-02-06",
        lastActivityTimestamp: "2026-02-06T11:00:00Z",
        location: "Dublin 11",
        dateAdded: "2025-05-20",
        registeredAddress: "Unit 12, Northwest Business Park, Ballycoolin, Dublin 11, D11 E7R3",
        headOfficeAddress: "Unit 12, Northwest Business Park, Ballycoolin, Dublin 11, D11 E7R3",
        primaryLocation: "Dublin 11",
        branchLocations: ["Naas, Co. Kildare"],
        businessDescription: "Last-mile delivery and warehousing services for e-commerce clients across Leinster. Gig-economy workforce model.",
        marketSector: "Private",
        unionised: "No",
        multiSite: true,
        registrationNumber: "CRO 654321",
        taxId: "Tax Ref 5566778F",
        vatNumber: "IE 5566778F",
        incorporationNumber: "CRO 654321",
        jurisdiction: "Republic of Ireland",
        incorporationDate: "2018-11-02",
        contacts: [
            { id: "C1", name: "Ryan Doherty", jobTitle: "Founder & CEO", email: "ryan@swiftroute.ie", phone: "+353 1 811 2233", preferredContact: "Phone", availabilityNotes: "Direct line — available anytime" },
            { id: "C2", name: "Jasmine Wu", jobTitle: "Office Manager", email: "jasmine@swiftroute.ie", phone: "+353 1 811 2234", preferredContact: "Email", availabilityNotes: "Handles all admin queries" },
        ],
        engagementType: "Compliance-only",
        engagementStartDate: "2025-05-20",
        engagementEndDate: "2026-05-20",
        serviceScope: "Employment status classification review (employee vs contractor), payroll compliance audit, PRSI obligations review",
        slaDetails: "72-hour standard response",
        escalationPath: "Office Manager → CEO",
        contractValue: "€38,000 / annum",
        services: [
            { id: "S1", name: "Employment Status Classification Review", status: "Active", priority: "High", timeline: "Q1 2026", dependencies: "Worker contracts access" },
            { id: "S2", name: "Payroll & PRSI Compliance Audit", status: "Active", priority: "High", timeline: "Q1 2026", dependencies: "Revenue data" },
        ],
        complianceStatus: "Attention Needed",
        complianceGaps: ["Potential bogus self-employment risk — Revenue investigation likely", "PRSI underpayment concerns for 22 workers", "Missing written terms of employment for 18 workers (Terms of Employment Act breach)"],
        regulatoryObligations: ["Employment (Miscellaneous Provisions) Act 2018", "Terms of Employment (Information) Act 1994–2014", "PRSI / Social Welfare Consolidation Act 2005", "Organisation of Working Time Act 1997", "GDPR / Data Protection Act 2018", "Revenue Commissioners Employment Status Guidelines"],
        riskCategory: "Payroll, Compliance, Revenue",
        auditReadinessScore: 41,
        complianceReviewSchedule: "Monthly",
        incidentHistory: 4,
        documents: [
            { id: "D1", name: "Compliance Agreement 2025–2026", type: "Contract", uploadDate: "2025-05-20", uploadTimestamp: "2025-05-20T10:00:00Z", expiryDate: "2026-05-20", version: "1.0", uploadedBy: "Declan Byrne", description: "Compliance remediation agreement focused on employment status, payroll, and PRSI compliance.", fileSize: "1.2 MB", confidentiality: "Confidential", regulatoryRef: "N/A" },
            { id: "D2", name: "Employment Status Classification Report", type: "Compliance Report", uploadDate: "2026-02-03", uploadTimestamp: "2026-02-03T14:00:00Z", expiryDate: null, version: "0.5", uploadedBy: "Saoirse O'Neill", description: "Draft report applying Revenue Commissioners 5-factor test to classify 35 workers as employees vs. independent contractors.", fileSize: "1.7 MB", confidentiality: "Restricted", regulatoryRef: "Revenue Commissioners Employment Status Guidelines" },
            { id: "D3", name: "PRSI Compliance Audit (Draft)", type: "Audit Report", uploadDate: "2026-01-25", uploadTimestamp: "2026-01-25T10:30:00Z", expiryDate: null, version: "0.3", uploadedBy: "Declan Byrne", description: "Draft audit of PRSI contributions, employer obligations, and PAYE compliance.", fileSize: "2.4 MB", confidentiality: "Restricted", regulatoryRef: "PRSI / Social Welfare Consolidation Act 2005" },
            { id: "D4", name: "Written Terms of Employment Template", type: "Legal", uploadDate: "2026-01-28", uploadTimestamp: "2026-01-28T09:00:00Z", expiryDate: null, version: "1.0", uploadedBy: "Saoirse O'Neill", description: "Statutory written statement template for terms of employment per Terms of Employment (Information) Act.", fileSize: "290 KB", confidentiality: "Internal", regulatoryRef: "Terms of Employment (Information) Act 1994–2014" },
        ],
        tasks: [
            { id: "T1", title: "Complete employment status classification assessment", description: "Apply Revenue Commissioners 5-factor test to classify 35 workers as employees vs. independent contractors. Critical for avoiding bogus self-employment penalties.", status: "In Progress", assignedTo: "Saoirse O'Neill", priority: "High", category: "Revenue & Payroll", regulatoryRef: "Revenue Commissioners Employment Status Guidelines / Employment (Miscellaneous Provisions) Act 2018", dueDate: "2026-02-14", createdDate: "2026-01-20", createdTimestamp: "2026-01-20T09:00:00Z" },
            { id: "T2", title: "Finalise payroll & PRSI compliance audit report", description: "Complete audit of PRSI contributions, employer obligations, and PAYE compliance. Identify any underpayments or misclassifications for remediation.", status: "In Progress", assignedTo: "Declan Byrne", priority: "High", category: "Revenue & Payroll", regulatoryRef: "PRSI / Social Welfare Consolidation Act 2005", dueDate: "2026-02-20", createdDate: "2026-01-25", createdTimestamp: "2026-01-25T10:00:00Z" },
            { id: "T3", title: "Issue written terms of employment for uncontracted workers", description: "Issue statutory written statements of terms of employment to 18 workers within 5 days of commencement as required by law.", status: "Overdue", assignedTo: "Saoirse O'Neill", priority: "High", category: "WRC & Employment Law", regulatoryRef: "Terms of Employment (Information) Act 1994–2014", dueDate: "2026-02-01", createdDate: "2026-01-15", createdTimestamp: "2026-01-15T10:00:00Z" },
            { id: "T4", title: "Prepare Revenue response pack", description: "Compile documentation pack for anticipated Revenue Commissioners audit/investigation into employment status and PRSI matters.", status: "Open", assignedTo: "Declan Byrne", priority: "High", category: "Revenue & Payroll", regulatoryRef: "Revenue Commissioners Code of Practice for Revenue Audit", dueDate: "2026-02-28", createdDate: "2026-02-06", createdTimestamp: "2026-02-06T11:30:00Z" },
        ],
        communications: [
            { id: "CM1", type: "Meeting", subject: "Compliance Risk Briefing", date: "2026-02-06", timestamp: "2026-02-06T11:00:00Z", participants: "Declan Byrne, Saoirse O'Neill, Ryan Doherty", summary: "Briefed CEO on bogus self-employment risks and potential Revenue investigation. Recommended immediate remediation under Employment (Misc. Provisions) Act.", hasAttachment: true },
        ],
        notes: [
            "HIGH RISK — Significant compliance exposure. Revenue Commissioners may open investigation.",
            "CEO is responsive but under-resourced. No dedicated HR function.",
            "Recommend upgrading to full retainer engagement given scale of compliance issues.",
        ],
        clientHealthScore: 44,
        satisfactionScore: 69,
        npsRating: 6,
        renewalLikelihood: "Likely",
        billingModel: "Monthly compliance fee",
        outstandingPayments: "€6,333.33",
        renewalDate: "2026-05-20",
        alerts: [
            { id: "A1", type: "Compliance Risk", message: "Bogus self-employment risk — Revenue investigation likely", severity: "Critical", date: "2026-02-06", timestamp: "2026-02-06T08:00:00Z" },
            { id: "A2", type: "Overdue Task", message: "Written terms of employment issuance overdue by 5 days", severity: "Critical", date: "2026-02-06", timestamp: "2026-02-06T08:00:00Z" },
            { id: "A3", type: "SLA Breach", message: "Payroll audit deliverable timeline at risk", severity: "Warning", date: "2026-02-04", timestamp: "2026-02-04T17:00:00Z" },
        ],
        timeline: [
            { id: "TL1", type: "Meeting", title: "Compliance Risk Briefing", description: "CEO briefed on bogus self-employment risks", date: "2026-02-06", timestamp: "2026-02-06T11:00:00Z", user: "Declan Byrne" },
        ],
    },
];

export const advisors = [
    "Aoife Brennan",
    "Cian Murphy",
    "Saoirse O'Neill",
    "Declan Byrne",
];

export const industries = [
    "Technology",
    "Food & Beverage",
    "Construction",
    "Healthcare & Social Care",
    "Retail",
    "Education",
    "Financial Services",
    "Transport & Logistics",
];

export const locations = [
    "Dublin 1",
    "Dublin 2",
    "Dublin 4",
    "Dublin 9",
    "Dublin 11",
    "Dublin 12",
    "Cork City",
    "Galway City",
    "Limerick City",
];
