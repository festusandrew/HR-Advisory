import { useState } from "react";
import {
    X,
    UserPlus,
    Plus,
    Upload,
    CheckCircle2,
    Building2,
    Users,
    FileText,
    Phone,
    Mail,
    MessageSquare,
    Calendar,
    Tag,
    Shield,
    Download,
    Printer,
    Eye,
    Clock,
    MapPin,
    Globe,
    Settings,
    AlertTriangle,
} from "lucide-react";
import { advisors, industries, locations } from "./mock-data";
import type { Client, Task, TaskCategory, Document as DocType } from "./mock-data";

/* ------------------------------------------------------------------ */
/*  Shared                                                             */
/* ------------------------------------------------------------------ */
function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
    );
}

function ModalHeader({ icon: Icon, iconBg, iconColor, title, subtitle, onClose }: {
    icon: React.ElementType; iconBg: string; iconColor: string; title: string; subtitle: string; onClose: () => void;
}) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
                </div>
                <div>
                    <h2 className="text-[16px] font-[700] text-foreground">{title}</h2>
                    <p className="text-[11px] text-muted-foreground">{subtitle}</p>
                </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4 text-[#6B7280]" />
            </button>
        </div>
    );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
    return (
        <div>
            <label className="text-[12px] font-[600] text-[#374151] block mb-1.5">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
        </div>
    );
}

const inputCls = "w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[13px] text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]";
const selectCls = inputCls;
const textareaCls = `${inputCls} resize-none`;

function SuccessState({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
    return (
        <div className="text-center py-8 px-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-[16px] font-[700] text-foreground">{title}</h3>
            <p className="text-[13px] text-muted-foreground mt-1.5">{subtitle}</p>
            {children}
        </div>
    );
}

const taskCategories: TaskCategory[] = [
    "GDPR & Data Protection", "WRC & Employment Law", "Health & Safety",
    "Employee Relations", "Industrial Relations", "Policy & Compliance",
    "Revenue & Payroll", "Workforce Planning", "HIQA Compliance",
    "CBI Compliance", "General Advisory",
];

const docTypes = [
    "Policy Document", "Contract", "Report", "Compliance Record",
    "DPIA", "Risk Assessment", "Training Record", "Meeting Minutes",
    "Audit Report", "Legal Document", "Employee Handbook", "SOP",
];

const commTypes = ["Email", "Meeting", "Call", "Advisory Update", "Client Request"] as const;

/* ================================================================== */
/*  1. ADD CLIENT MODAL                                                */
/* ================================================================== */
export function AddClientModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: any) => void }) {
    const [step, setStep] = useState<1 | 2 | "done">(1);
    const [form, setForm] = useState({
        name: "", tradingName: "", industry: industries[0], location: locations[0],
        companySize: "", contractType: "Retainer", riskLevel: "Medium",
        engagementStatus: "Active", assignedAdvisors: [advisors[0]],
        businessStructure: "Private Limited Company (Ltd)",
        contactName: "", contactEmail: "", contactPhone: "", contactJobTitle: "",
    });

    const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = () => {
        onAdd(form);
        setStep("done");
    };

    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[90vh] flex flex-col">
                <ModalHeader icon={UserPlus} iconBg="bg-[#EEF2FF]" iconColor="text-[#4F46E5]" title="Add New Client" subtitle="Register a new client organisation" onClose={onClose} />
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <p className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider">Company Details</p>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Legal Name" required>
                                    <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Acme Ltd" className={inputCls} />
                                </Field>
                                <Field label="Trading Name">
                                    <input type="text" value={form.tradingName} onChange={(e) => set("tradingName", e.target.value)} placeholder="e.g. Acme" className={inputCls} />
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Industry" required>
                                    <select value={form.industry} onChange={(e) => set("industry", e.target.value)} className={selectCls}>{industries.map((i) => <option key={i} value={i}>{i}</option>)}</select>
                                </Field>
                                <Field label="Location" required>
                                    <select value={form.location} onChange={(e) => set("location", e.target.value)} className={selectCls}>{locations.map((l) => <option key={l} value={l}>{l}</option>)}</select>
                                </Field>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Field label="Company Size">
                                    <input type="number" value={form.companySize} onChange={(e) => set("companySize", e.target.value)} placeholder="e.g. 150" className={inputCls} />
                                </Field>
                                <Field label="Contract Type">
                                    <select value={form.contractType} onChange={(e) => set("contractType", e.target.value)} className={selectCls}>
                                        <option>Retainer</option><option>Project</option><option>Advisory</option><option>Compliance-only</option>
                                    </select>
                                </Field>
                                <Field label="Business Structure">
                                    <select value={form.businessStructure} onChange={(e) => set("businessStructure", e.target.value)} className={selectCls}>
                                        <option>Private Limited Company (Ltd)</option><option>Public Limited Company (PLC)</option><option>Company Limited by Guarantee (CLG)</option><option>Sole Trader</option><option>Partnership</option>
                                    </select>
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Risk Level">
                                    <select value={form.riskLevel} onChange={(e) => set("riskLevel", e.target.value)} className={selectCls}>
                                        <option>Low</option><option>Medium</option><option>High</option>
                                    </select>
                                </Field>
                                <Field label="Assigned Advisor">
                                    <select value={form.assignedAdvisors[0]} onChange={(e) => set("assignedAdvisors", e.target.value)} className={selectCls}>
                                        {advisors.map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </Field>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider">Primary Contact</p>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Contact Name" required>
                                    <input type="text" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="e.g. John Smith" className={inputCls} />
                                </Field>
                                <Field label="Job Title">
                                    <input type="text" value={form.contactJobTitle} onChange={(e) => set("contactJobTitle", e.target.value)} placeholder="e.g. HR Director" className={inputCls} />
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Email" required>
                                    <input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="john@company.ie" className={inputCls} />
                                </Field>
                                <Field label="Phone">
                                    <input type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+353 1 234 5678" className={inputCls} />
                                </Field>
                            </div>
                            <div className="p-3.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] mt-2">
                                <p className="text-[11px] font-[600] text-[#6B7280] uppercase tracking-wider mb-2">Summary</p>
                                <div className="grid grid-cols-2 gap-2 text-[12px]">
                                    <div><span className="text-[#9CA3AF]">Company:</span> <span className="text-foreground font-[600]">{form.name || "—"}</span></div>
                                    <div><span className="text-[#9CA3AF]">Industry:</span> <span className="text-foreground font-[500]">{form.industry}</span></div>
                                    <div><span className="text-[#9CA3AF]">Location:</span> <span className="text-foreground font-[500]">{form.location}</span></div>
                                    <div><span className="text-[#9CA3AF]">Contract:</span> <span className="text-foreground font-[500]">{form.contractType}</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "done" && (
                        <SuccessState title="Client Added Successfully" subtitle={`${form.name || "New client"} has been added to the directory.`} />
                    )}
                </div>
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
                    {step === 1 && (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={() => setStep(2)} disabled={!form.name} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer disabled:opacity-50">Next: Primary Contact</button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Back</button>
                            <button onClick={handleSubmit} disabled={!form.contactName || !form.contactEmail} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                                <Plus className="w-3.5 h-3.5" /> Add Client
                            </button>
                        </>
                    )}
                    {step === "done" && (
                        <div className="flex-1 flex justify-end">
                            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                        </div>
                    )}
                </div>
            </div>
        </Overlay>
    );
}

/* ================================================================== */
/*  2. CREATE TASK MODAL                                               */
/* ================================================================== */
export function CreateTaskModal({ onClose, onAdd, clientName }: { onClose: () => void; onAdd: (data: any) => void; clientName?: string }) {
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({
        title: "", description: "", priority: "Medium" as string, category: "General Advisory" as string,
        assignedTo: advisors[0], dueDate: "2026-02-28", regulatoryRef: "",
    });
    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = () => { onAdd(form); setDone(true); };

    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] flex flex-col">
                <ModalHeader icon={Plus} iconBg="bg-[#EEF2FF]" iconColor="text-[#4F46E5]" title="Create Task" subtitle={clientName ? `For ${clientName}` : "Create a new task"} onClose={onClose} />
                <div className="flex-1 overflow-y-auto p-6">
                    {!done ? (
                        <div className="space-y-4">
                            <Field label="Task Title" required>
                                <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Review GDPR compliance documentation" className={inputCls} />
                            </Field>
                            <Field label="Description">
                                <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the task..." className={textareaCls} />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Priority" required>
                                    <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className={selectCls}>
                                        <option>High</option><option>Medium</option><option>Low</option>
                                    </select>
                                </Field>
                                <Field label="Category">
                                    <select value={form.category} onChange={(e) => set("category", e.target.value)} className={selectCls}>
                                        {taskCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Assigned To" required>
                                    <select value={form.assignedTo} onChange={(e) => set("assignedTo", e.target.value)} className={selectCls}>
                                        {advisors.map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </Field>
                                <Field label="Due Date" required>
                                    <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={inputCls} />
                                </Field>
                            </div>
                            <Field label="Regulatory Reference">
                                <input type="text" value={form.regulatoryRef} onChange={(e) => set("regulatoryRef", e.target.value)} placeholder="e.g. GDPR Art. 35" className={inputCls} />
                            </Field>
                        </div>
                    ) : (
                        <SuccessState title="Task Created" subtitle={`"${form.title}" has been assigned to ${form.assignedTo}.`} />
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                    {!done ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={handleSubmit} disabled={!form.title} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                                <Plus className="w-3.5 h-3.5" /> Create Task
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </Overlay>
    );
}

/* ================================================================== */
/*  3. UPLOAD DOCUMENT MODAL                                           */
/* ================================================================== */
export function UploadDocumentModal({ onClose, onAdd, clientName }: { onClose: () => void; onAdd: (data: any) => void; clientName?: string }) {
    const [done, setDone] = useState(false);
    const [fileName, setFileName] = useState("");
    const [form, setForm] = useState({
        name: "", type: docTypes[0], version: "1.0", description: "",
        confidentiality: "Internal", expiryDate: "", regulatoryRef: "",
    });
    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = () => { onAdd({ ...form, fileName }); setDone(true); };

    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] flex flex-col">
                <ModalHeader icon={Upload} iconBg="bg-[#EEF2FF]" iconColor="text-[#4F46E5]" title="Upload Document" subtitle={clientName ? `For ${clientName}` : "Upload a new document"} onClose={onClose} />
                <div className="flex-1 overflow-y-auto p-6">
                    {!done ? (
                        <div className="space-y-4">
                            {/* Drop zone */}
                            <div className="border-2 border-dashed border-[#D1D5DB] rounded-xl p-6 text-center hover:border-[#4F46E5] transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                                <p className="text-[13px] font-[600] text-foreground">Drop files here or click to browse</p>
                                <p className="text-[11px] text-muted-foreground mt-1">PDF, DOC, DOCX, XLS, XLSX up to 25MB</p>
                                {fileName && (
                                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#EEF2FF] rounded-lg text-[12px] font-[600] text-[#4F46E5]">
                                        <FileText className="w-3.5 h-3.5" /> {fileName}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    style={{ position: "relative" }}
                                    onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                                />
                            </div>
                            <Field label="Document Name" required>
                                <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. GDPR DPIA Report" className={inputCls} />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Document Type" required>
                                    <select value={form.type} onChange={(e) => set("type", e.target.value)} className={selectCls}>
                                        {docTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </Field>
                                <Field label="Version">
                                    <input type="text" value={form.version} onChange={(e) => set("version", e.target.value)} className={inputCls} />
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Confidentiality">
                                    <select value={form.confidentiality} onChange={(e) => set("confidentiality", e.target.value)} className={selectCls}>
                                        <option>Public</option><option>Internal</option><option>Confidential</option><option>Restricted</option>
                                    </select>
                                </Field>
                                <Field label="Expiry Date">
                                    <input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} className={inputCls} />
                                </Field>
                            </div>
                            <Field label="Description">
                                <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief description..." className={textareaCls} />
                            </Field>
                            <Field label="Regulatory Reference">
                                <input type="text" value={form.regulatoryRef} onChange={(e) => set("regulatoryRef", e.target.value)} placeholder="e.g. GDPR Art. 35" className={inputCls} />
                            </Field>
                        </div>
                    ) : (
                        <SuccessState title="Document Uploaded" subtitle={`"${form.name || fileName}" has been uploaded successfully.`} />
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                    {!done ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={handleSubmit} disabled={!form.name} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                                <Upload className="w-3.5 h-3.5" /> Upload
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </Overlay>
    );
}

/* ================================================================== */
/*  4. ASSIGN ADVISOR MODAL                                            */
/* ================================================================== */
export function AssignAdvisorModal({ onClose, onAssign, currentAdvisors }: {
    onClose: () => void; onAssign: (advisors: string[]) => void; currentAdvisors: string[];
}) {
    const [selected, setSelected] = useState<string[]>(currentAdvisors);
    const [done, setDone] = useState(false);

    const toggle = (name: string) => {
        setSelected((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
    };

    const handleSubmit = () => { onAssign(selected); setDone(true); };

    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[420px] max-h-[90vh] flex flex-col">
                <ModalHeader icon={UserPlus} iconBg="bg-[#EEF2FF]" iconColor="text-[#4F46E5]" title="Assign Advisor" subtitle="Select advisors for this client" onClose={onClose} />
                <div className="flex-1 overflow-y-auto p-6">
                    {!done ? (
                        <div className="space-y-2">
                            {advisors.map((name) => {
                                const isSelected = selected.includes(name);
                                return (
                                    <label key={name} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? "border-[#4F46E5] bg-[#F0EFFE]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]"}`}>
                                        <input type="checkbox" checked={isSelected} onChange={() => toggle(name)} className="w-4 h-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]" />
                                        <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[10px] font-[700] text-[#4F46E5]">
                                            {name.split(" ").map((n) => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-[600] text-foreground">{name}</p>
                                            <p className="text-[11px] text-muted-foreground">Senior HR Advisor</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    ) : (
                        <SuccessState title="Advisors Updated" subtitle={`${selected.length} advisor${selected.length !== 1 ? "s" : ""} assigned.`} />
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                    {!done ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={handleSubmit} disabled={selected.length === 0} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                                <UserPlus className="w-3.5 h-3.5" /> Assign
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </Overlay>
    );
}

/* ================================================================== */
/*  5. ADD CONTACT MODAL                                               */
/* ================================================================== */
export function AddContactModal({ onClose, onAdd, clientName }: { onClose: () => void; onAdd: (data: any) => void; clientName?: string }) {
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({
        name: "", jobTitle: "", email: "", phone: "",
        preferredContact: "Email", availabilityNotes: "",
    });
    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = () => { onAdd(form); setDone(true); };

    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[90vh] flex flex-col">
                <ModalHeader icon={Users} iconBg="bg-[#EEF2FF]" iconColor="text-[#4F46E5]" title="Add Contact" subtitle={clientName ? `For ${clientName}` : "Add a new authorised contact"} onClose={onClose} />
                <div className="flex-1 overflow-y-auto p-6">
                    {!done ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Full Name" required>
                                    <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Mary O'Brien" className={inputCls} />
                                </Field>
                                <Field label="Job Title" required>
                                    <input type="text" value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="e.g. HR Manager" className={inputCls} />
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Email" required>
                                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="mary@company.ie" className={inputCls} />
                                </Field>
                                <Field label="Phone">
                                    <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+353 1 234 5678" className={inputCls} />
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Preferred Contact">
                                    <select value={form.preferredContact} onChange={(e) => set("preferredContact", e.target.value)} className={selectCls}>
                                        <option>Email</option><option>Phone</option><option>Teams/Slack</option>
                                    </select>
                                </Field>
                                <Field label="Availability Notes">
                                    <input type="text" value={form.availabilityNotes} onChange={(e) => set("availabilityNotes", e.target.value)} placeholder="e.g. Mon-Fri 9-5" className={inputCls} />
                                </Field>
                            </div>
                        </div>
                    ) : (
                        <SuccessState title="Contact Added" subtitle={`${form.name} has been added as an authorised contact.`} />
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                    {!done ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={handleSubmit} disabled={!form.name || !form.email} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                                <Plus className="w-3.5 h-3.5" /> Add Contact
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </Overlay>
    );
}

/* ================================================================== */
/*  6. ADD SERVICE MODAL                                               */
/* ================================================================== */
export function AddServiceModal({ onClose, onAdd, clientName }: { onClose: () => void; onAdd: (data: any) => void; clientName?: string }) {
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({
        name: "", status: "Active" as string, priority: "Medium" as string,
        timeline: "", dependencies: "None",
    });
    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const serviceNames = [
        "GDPR & Data Protection Advisory", "WRC & Employment Law", "Health & Safety Compliance",
        "Employee Relations Support", "Policy Review & Update", "Payroll Compliance Audit",
        "Workforce Planning", "Training & Development", "Grievance & Disciplinary Support",
        "Redundancy Advisory", "Contract Review", "Custom Service",
    ];

    const handleSubmit = () => { onAdd(form); setDone(true); };

    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[90vh] flex flex-col">
                <ModalHeader icon={Settings} iconBg="bg-[#EEF2FF]" iconColor="text-[#4F46E5]" title="Add Service" subtitle={clientName ? `For ${clientName}` : "Add a new service workstream"} onClose={onClose} />
                <div className="flex-1 overflow-y-auto p-6">
                    {!done ? (
                        <div className="space-y-4">
                            <Field label="Service Name" required>
                                <select value={form.name} onChange={(e) => set("name", e.target.value)} className={selectCls}>
                                    <option value="">Select a service...</option>
                                    {serviceNames.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Status">
                                    <select value={form.status} onChange={(e) => set("status", e.target.value)} className={selectCls}>
                                        <option>Active</option><option>Planned</option>
                                    </select>
                                </Field>
                                <Field label="Priority">
                                    <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className={selectCls}>
                                        <option>High</option><option>Medium</option><option>Low</option>
                                    </select>
                                </Field>
                            </div>
                            <Field label="Timeline">
                                <input type="text" value={form.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="e.g. Q1 2026 — Q2 2026" className={inputCls} />
                            </Field>
                            <Field label="Dependencies">
                                <input type="text" value={form.dependencies} onChange={(e) => set("dependencies", e.target.value)} placeholder="e.g. GDPR review completion" className={inputCls} />
                            </Field>
                        </div>
                    ) : (
                        <SuccessState title="Service Added" subtitle={`"${form.name}" has been added to the client's service workstreams.`} />
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                    {!done ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={handleSubmit} disabled={!form.name} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                                <Plus className="w-3.5 h-3.5" /> Add Service
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </Overlay>
    );
}

/* ================================================================== */
/*  7. DOCUMENT DETAIL MODAL                                           */
/* ================================================================== */
export function DocumentDetailModal({ doc, clientName, onClose }: { doc: DocType; clientName: string; onClose: () => void }) {
    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[85vh] flex flex-col">
                <ModalHeader icon={FileText} iconBg="bg-[#EEF2FF]" iconColor="text-[#4F46E5]" title="Document Details" subtitle={clientName} onClose={onClose} />
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Document icon card */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                        <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#4F46E5]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-[700] text-foreground truncate">{doc.name}</p>
                            <p className="text-[12px] text-muted-foreground">{doc.type} &middot; v{doc.version}</p>
                        </div>
                    </div>
                    {/* Details grid */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-[12px]">
                            <Tag className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-28">Type</span>
                            <span className="font-[600] text-foreground">{doc.type}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                            <FileText className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-28">Version</span>
                            <span className="font-[500] text-foreground">v{doc.version}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                            <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-28">Uploaded</span>
                            <span className="font-[500] text-foreground">{doc.uploadDate} at {new Date(doc.uploadTimestamp).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                            <Users className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="text-[#6B7280] w-28">Uploaded By</span>
                            <span className="font-[600] text-foreground">{doc.uploadedBy}</span>
                        </div>
                        {doc.expiryDate && (
                            <div className="flex items-center gap-3 text-[12px]">
                                <Clock className="w-4 h-4 text-[#9CA3AF]" />
                                <span className="text-[#6B7280] w-28">Expires</span>
                                <span className="font-[500] text-foreground">{doc.expiryDate}</span>
                            </div>
                        )}
                        {doc.fileSize && (
                            <div className="flex items-center gap-3 text-[12px]">
                                <FileText className="w-4 h-4 text-[#9CA3AF]" />
                                <span className="text-[#6B7280] w-28">File Size</span>
                                <span className="font-[500] text-foreground">{doc.fileSize}</span>
                            </div>
                        )}
                        {doc.confidentiality && (
                            <div className="flex items-center gap-3 text-[12px]">
                                <Shield className="w-4 h-4 text-[#9CA3AF]" />
                                <span className="text-[#6B7280] w-28">Confidentiality</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-[700] border ${doc.confidentiality === "Restricted" ? "bg-red-100 text-red-700 border-red-200" :
                                        doc.confidentiality === "Confidential" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                            doc.confidentiality === "Internal" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                "bg-emerald-100 text-emerald-700 border-emerald-200"
                                    }`}>{doc.confidentiality}</span>
                            </div>
                        )}
                        {doc.regulatoryRef && (
                            <div className="flex items-center gap-3 text-[12px]">
                                <Shield className="w-4 h-4 text-[#9CA3AF]" />
                                <span className="text-[#6B7280] w-28">Regulatory Ref</span>
                                <span className="font-[500] text-foreground">{doc.regulatoryRef}</span>
                            </div>
                        )}
                        {doc.description && (
                            <div className="pt-2 border-t border-[#F3F4F6]">
                                <p className="text-[11px] font-[600] text-[#6B7280] mb-1">Description</p>
                                <p className="text-[12px] text-[#4B5563]">{doc.description}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
                    <button className="px-3 py-2 rounded-lg text-[12px] font-[600] text-red-600 hover:bg-red-50 cursor-pointer">Archive</button>
                    <div className="flex items-center gap-2.5">
                        <button className="px-3 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
                            <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer">
                            <Download className="w-3.5 h-3.5" /> Download
                        </button>
                    </div>
                </div>
            </div>
        </Overlay>
    );
}

/* ================================================================== */
/*  8. LOG INTERACTION MODAL                                           */
/* ================================================================== */
export function LogInteractionModal({ onClose, onAdd, clientName }: { onClose: () => void; onAdd: (data: any) => void; clientName?: string }) {
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({
        type: "Email" as string, subject: "", date: "2026-02-06",
        participants: "", summary: "", hasAttachment: false,
    });
    const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = () => { onAdd(form); setDone(true); };

    return (
        <Overlay onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] flex flex-col">
                <ModalHeader icon={MessageSquare} iconBg="bg-[#EEF2FF]" iconColor="text-[#4F46E5]" title="Log Interaction" subtitle={clientName ? `For ${clientName}` : "Record a communication"} onClose={onClose} />
                <div className="flex-1 overflow-y-auto p-6">
                    {!done ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Type" required>
                                    <select value={form.type} onChange={(e) => set("type", e.target.value)} className={selectCls}>
                                        {commTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </Field>
                                <Field label="Date" required>
                                    <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
                                </Field>
                            </div>
                            <Field label="Subject" required>
                                <input type="text" value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="e.g. Monthly advisory review call" className={inputCls} />
                            </Field>
                            <Field label="Participants">
                                <input type="text" value={form.participants} onChange={(e) => set("participants", e.target.value)} placeholder="e.g. Aoife Brennan, John Smith" className={inputCls} />
                            </Field>
                            <Field label="Summary" required>
                                <textarea rows={4} value={form.summary} onChange={(e) => set("summary", e.target.value)} placeholder="Describe what was discussed..." className={textareaCls} />
                            </Field>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={form.hasAttachment} onChange={(e) => set("hasAttachment", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]" />
                                <span className="text-[12px] text-[#4B5563]">Has attachment</span>
                            </label>
                        </div>
                    ) : (
                        <SuccessState title="Interaction Logged" subtitle={`${form.type}: "${form.subject}" has been recorded.`} />
                    )}
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E5E7EB]">
                    {!done ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-[600] text-[#4B5563] hover:bg-gray-50 cursor-pointer">Cancel</button>
                            <button onClick={handleSubmit} disabled={!form.subject || !form.summary} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                                <Plus className="w-3.5 h-3.5" /> Log Interaction
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-[12px] font-[600] hover:bg-[#4338CA] cursor-pointer">Done</button>
                    )}
                </div>
            </div>
        </Overlay>
    );
}
