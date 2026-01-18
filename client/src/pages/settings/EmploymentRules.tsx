import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Plus, ArrowLeft, FileText, Clock, Edit, Trash2, Save, CheckCircle, Moon, Sun, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// --- Types ---
interface ConfigItem {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
  // Transport specific
  category?: "company_driver" | "company_vehicle" | "self_vehicle" | "public" | "hybrid" | "other"; 
}

interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

// --- Defaults ---
const DEFAULT_EMPLOYMENT_TYPES: ConfigItem[] = [
  { id: "et1", name: "Full Time", description: "Standard 40+ hours week", status: "active" },
  { id: "et2", name: "Part Time", description: "Less than 30 hours week", status: "active" },
  { id: "et3", name: "Contract", description: "Project-based engagement", status: "active" },
  { id: "et4", name: "Temporary", description: "Short-term placement", status: "active" },
];

const DEFAULT_CONTRACT_TYPES: ConfigItem[] = [
  { id: "ct1", name: "Permanent", description: "Indefinite duration", status: "active" },
  { id: "ct2", name: "Fixed Term", description: "Specific end date", status: "active" },
  { id: "ct3", name: "Probation", description: "Trial period", status: "active" },
];

const DEFAULT_SHIFT_TEMPLATES: ShiftTemplate[] = [
  { id: "st1", name: "Morning Shift", startTime: "06:00", endTime: "14:00" },
  { id: "st2", name: "Afternoon Shift", startTime: "14:00", endTime: "22:00" },
  { id: "st3", name: "Night Shift", startTime: "22:00", endTime: "06:00" },
];

const DEFAULT_TRANSPORTATION_TYPES: ConfigItem[] = [
  { id: "tt1", name: "Company Provides Transportation (With Driver)", description: "Staff will be transported by company driver/route", status: "active", category: "company_driver" },
  { id: "tt2", name: "Company Provides Vehicle (Staff Drives)", description: "Company assigned vehicle (Car/Van)", status: "active", category: "company_vehicle" },
  { id: "tt3", name: "Self – Own Vehicle", description: "Employee uses personal vehicle", status: "active", category: "self_vehicle" },
  { id: "tt4", name: "Public / Ride Transport", description: "Staff uses taxi/uber/public transport", status: "active", category: "public" },
  { id: "tt5", name: "Hybrid / Flexible", description: "Varies by shift/day", status: "active", category: "hybrid" },
];

export default function EmploymentRules() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("employment-types");
  
  // --- Employment & Contracts State ---
  const [employmentTypes, setEmploymentTypes] = useState<ConfigItem[]>([]);
  const [contractTypes, setContractTypes] = useState<ConfigItem[]>([]);
  const [transportationTypes, setTransportationTypes] = useState<ConfigItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ConfigItem>>({ name: "", description: "", category: "company_driver" });

  // --- Shifts State ---
  const [enabledShiftTypes, setEnabledShiftTypes] = useState({ fixed: true, rotational: true, flexible: false });
  const [defaultBusinessHours, setDefaultBusinessHours] = useState({ start: "09:00", end: "17:00" });
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>([]);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState<Partial<ShiftTemplate>>({});

  // --- Load Data ---
  useEffect(() => {
    // 1. Employment Types
    const storedEmpTypes = localStorage.getItem("vendor_employment_types");
    if (storedEmpTypes) setEmploymentTypes(JSON.parse(storedEmpTypes));
    else {
        setEmploymentTypes(DEFAULT_EMPLOYMENT_TYPES);
        localStorage.setItem("vendor_employment_types", JSON.stringify(DEFAULT_EMPLOYMENT_TYPES));
    }

    // 2. Contract Types
    const storedContractTypes = localStorage.getItem("vendor_contract_types");
    if (storedContractTypes) setContractTypes(JSON.parse(storedContractTypes));
    else {
        setContractTypes(DEFAULT_CONTRACT_TYPES);
        localStorage.setItem("vendor_contract_types", JSON.stringify(DEFAULT_CONTRACT_TYPES));
    }

    // 3. Transport Types
    // 3. Transport Types
    const storedTransportTypes = localStorage.getItem("vendor_transportation_types");
    if (storedTransportTypes) {
        let loaded = JSON.parse(storedTransportTypes);
        // Auto-migrate if old default names are detected
        if (loaded.length > 0 && loaded[0].name !== DEFAULT_TRANSPORTATION_TYPES[0].name) {
            loaded = DEFAULT_TRANSPORTATION_TYPES;
            localStorage.setItem("vendor_transportation_types", JSON.stringify(loaded));
        }
        setTransportationTypes(loaded);
    } else {
        setTransportationTypes(DEFAULT_TRANSPORTATION_TYPES);
        localStorage.setItem("vendor_transportation_types", JSON.stringify(DEFAULT_TRANSPORTATION_TYPES));
    }

    // 4. Shift Settings
    const storedEnabled = localStorage.getItem("vendor_shift_types_enabled");
    if (storedEnabled) setEnabledShiftTypes(JSON.parse(storedEnabled));
    const storedHours = localStorage.getItem("vendor_business_hours");
    if (storedHours) setDefaultBusinessHours(JSON.parse(storedHours));

    // 4. Shift Templates
    const storedTemplates = localStorage.getItem("vendor_shift_templates");
    if (storedTemplates) setShiftTemplates(JSON.parse(storedTemplates));
    else {
        setShiftTemplates(DEFAULT_SHIFT_TEMPLATES);
        localStorage.setItem("vendor_shift_templates", JSON.stringify(DEFAULT_SHIFT_TEMPLATES));
    }
  }, []);

  // --- Actions ---

  // Emp/Contract CRUD
  const handleSaveConfig = () => {
    if (!formData.name) return;
    const isEmp = activeTab === "employment-types";
    const isContract = activeTab === "contract-types";
    const isTransport = activeTab === "transport-types";
    
    let currentList: ConfigItem[] = [];
    if (isEmp) currentList = employmentTypes;
    else if (isContract) currentList = contractTypes;
    else if (isTransport) currentList = transportationTypes;

    let storageKey = "";
    if (isEmp) storageKey = "vendor_employment_types";
    else if (isContract) storageKey = "vendor_contract_types";
    else if (isTransport) storageKey = "vendor_transportation_types";

    let itemName = "";
    if (isEmp) itemName = "Employment Type";
    else if (isContract) itemName = "Contract Type";
    else if (isTransport) itemName = "Transport Type";

    let newList = [...currentList];
    if (editingId) {
        newList = newList.map(item => item.id === editingId ? { ...item, ...formData } : item);
        toast.success(`${itemName} updated`);
    } else {
        // ID prefix: e=employment, c=contract, t=transport
        const prefix = isEmp ? 'e' : (isContract ? 'c' : 't');
        const newItem = { id: `${prefix}-${Date.now()}`, ...formData, name: formData.name!, status: "active" as const };
        newList.push(newItem);
        toast.success(`${itemName} created`);
    }
    
    if (isEmp) setEmploymentTypes(newList);
    else if (isContract) setContractTypes(newList);
    else if (isTransport) setTransportationTypes(newList);

    localStorage.setItem(storageKey, JSON.stringify(newList));
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteConfig = (id: string) => {
    const isEmp = activeTab === "employment-types";
    const isContract = activeTab === "contract-types";
    const isTransport = activeTab === "transport-types";

    let currentList: ConfigItem[] = [];
    if (isEmp) currentList = employmentTypes;
    else if (isContract) currentList = contractTypes;
    else if (isTransport) currentList = transportationTypes;

    const newList = currentList.filter(item => item.id !== id);
    
    if (isEmp) setEmploymentTypes(newList);
    else if (isContract) setContractTypes(newList);
    else if (isTransport) setTransportationTypes(newList);

    let storageKey = "";
    if (isEmp) storageKey = "vendor_employment_types";
    else if (isContract) storageKey = "vendor_contract_types";
    else if (isTransport) storageKey = "vendor_transportation_types";

    localStorage.setItem(storageKey, JSON.stringify(newList));
    toast.success("Item deleted");
  };

  const openEdit = (item: ConfigItem) => {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description || "", category: item.category });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", category: "company_driver" });
  };

  // Shift Settings Save
  const saveShiftSettings = () => {
    localStorage.setItem("vendor_shift_types_enabled", JSON.stringify(enabledShiftTypes));
    localStorage.setItem("vendor_business_hours", JSON.stringify(defaultBusinessHours));
    toast.success("Shift policies saved");
  };

  // Template CRUD
  const handleSaveTemplate = () => {
    if (!templateForm.name || !templateForm.startTime || !templateForm.endTime) {
        toast.error("Please fill all fields");
        return;
    }
    const newTemplate: ShiftTemplate = {
        id: `st-${Date.now()}`,
        name: templateForm.name,
        startTime: templateForm.startTime,
        endTime: templateForm.endTime,
    };
    const updated = [...shiftTemplates, newTemplate];
    setShiftTemplates(updated);
    localStorage.setItem("vendor_shift_templates", JSON.stringify(updated));
    setIsTemplateDialogOpen(false);
    setTemplateForm({});
    toast.success("Shift template created");
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = shiftTemplates.filter(t => t.id !== id);
    setShiftTemplates(updated);
    localStorage.setItem("vendor_shift_templates", JSON.stringify(updated));
    toast.success("Shift template deleted");
  };

  // --- Rendering Helpers ---
  let listToRender: ConfigItem[] = [];
  if (activeTab === "employment-types") listToRender = employmentTypes;
  else if (activeTab === "contract-types") listToRender = contractTypes;
  else if (activeTab === "transport-types") listToRender = transportationTypes;

  const filteredList = listToRender.filter(item =>  
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50/50">
        
        {/* Header */}
        <div className="px-8 py-6 border-b bg-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setLocation("/settings")} className="rounded-full hover:bg-gray-100 text-gray-500">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Employment & Schedule</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure employment agreements, shifts, and working hours.</p>
                </div>
            </div>
            {activeTab === 'shift-policies' && (
                 <Button onClick={saveShiftSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Policies
                 </Button>
            )}
        </div>

        {/* Content */}
        <div className="p-8 max-w-5xl mx-auto w-full">
            <Tabs defaultValue="employment-types" onValueChange={(val) => { setActiveTab(val); setSearchQuery(""); }} className="w-full">
                <TabsList className="bg-white border w-full justify-start h-12 p-1 mb-8">
                    <TabsTrigger value="employment-types" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 h-full px-4">
                         Employment Types
                    </TabsTrigger>
                    <TabsTrigger value="contract-types" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 h-full px-4">
                         Contract Types
                    </TabsTrigger>
                     <TabsTrigger value="transport-types" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 h-full px-4">
                         Transport Types
                    </TabsTrigger>
                    <TabsTrigger value="shift-policies" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 h-full px-4">
                         Shift Policies
                    </TabsTrigger>
                    <TabsTrigger value="shift-templates" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 h-full px-4">
                         Shift Templates
                    </TabsTrigger>
                </TabsList>

                {/* --- Tab: Employment Types & Contract Types & Transport Types (Shared UI List) --- */}
                {(activeTab === "employment-types" || activeTab === "contract-types" || activeTab === "transport-types") && (
                    <TabsContent value={activeTab} className="mt-0 space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input 
                                    placeholder={`Search ${activeTab.replace('-', ' ')}...`} 
                                    className="pl-10 h-10 bg-white w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                                <DialogTrigger asChild>
                                    <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2 shadow-lg shadow-teal-600/20">
                                        <Plus className="h-4 w-4" />
                                        <Plus className="h-4 w-4" />
                                        Add {activeTab.replace("-types", "").replace("-", " ")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editingId ? "Edit" : "Add"} {activeTab.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()).slice(0, -1)}</DialogTitle>
                                        <DialogDescription>
                                            Define a classification for staff members.
                                        </DialogDescription>
                                    </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input id="name" placeholder="e.g. Full Time" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                            </div>
                                            {activeTab === "transport-types" && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">Logic Category</Label>
                                                    <select 
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={formData.category} 
                                                        onChange={e => setFormData({...formData, category: e.target.value as any})}
                                                    >
                                                        <option value="company_driver">Company Driver (No Fields)</option>
                                                        <option value="company_vehicle">Company Vehicle (Asset Assign)</option>
                                                        <option value="self_vehicle">Self Vehicle (Plate Info)</option>
                                                        <option value="public">Public Transport</option>
                                                        <option value="hybrid">Hybrid / Flexible</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                    <p className="text-[10px] text-gray-500">Determines which fields are shown in the onboarding form.</p>
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <Label htmlFor="desc">Description</Label>
                                                <Input id="desc" placeholder="Optional description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                            </div>
                                        </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                        <Button onClick={handleSaveConfig} disabled={!formData.name}>Save Changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        
                        <div className="grid gap-3">
                            {filteredList.map(item => (
                                <Card key={item.id} className="p-4 flex items-center justify-between hover:border-teal-300 transition-all group bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                            {activeTab === "employment-types" ? <Clock className="h-5 w-5" /> : activeTab === "contract-types" ? <FileText className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                                            {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-teal-600" onClick={() => openEdit(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDeleteConfig(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                )}

                {/* --- Tab: Shift Policies --- */}
                <TabsContent value="shift-policies" className="mt-0 space-y-6">
                     {/* Shift Types */}
                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-orange-600" />
                                Allowed Shift Types
                            </CardTitle>
                            <CardDescription>
                                Enable or disable shift types available during staff recruitment.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Fixed Shifts</Label>
                                    <p className="text-sm text-gray-500">Regular hours (e.g., 9-5) consistent every day.</p>
                                </div>
                                <Switch 
                                    checked={enabledShiftTypes.fixed} 
                                    onCheckedChange={c => setEnabledShiftTypes({...enabledShiftTypes, fixed: c})} 
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Rotational Shifts</Label>
                                    <p className="text-sm text-gray-500">Varying shifts (morning, night) on a roster basis.</p>
                                </div>
                                <Switch 
                                    checked={enabledShiftTypes.rotational} 
                                    onCheckedChange={c => setEnabledShiftTypes({...enabledShiftTypes, rotational: c})} 
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Flexible / Hourly</Label>
                                    <p className="text-sm text-gray-500">No fixed schedule, paid by the hour.</p>
                                </div>
                                <Switch 
                                    checked={enabledShiftTypes.flexible} 
                                    onCheckedChange={c => setEnabledShiftTypes({...enabledShiftTypes, flexible: c})} 
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Business Hours */}
                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-orange-600" />
                                Default Business Hours
                            </CardTitle>
                            <CardDescription>
                                Set the pre-filled start and end times for new fixed-shift staff.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <div className="grid gap-2 flex-1">
                                <Label>Start Time</Label>
                                <Input 
                                    type="time" 
                                    value={defaultBusinessHours.start} 
                                    onChange={e => setDefaultBusinessHours({...defaultBusinessHours, start: e.target.value})}
                                />
                            </div>
                            <div className="pt-8 text-gray-400 font-medium">to</div>
                            <div className="grid gap-2 flex-1">
                                <Label>End Time</Label>
                                <Input 
                                    type="time" 
                                    value={defaultBusinessHours.end} 
                                    onChange={e => setDefaultBusinessHours({...defaultBusinessHours, end: e.target.value})} 
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Tab: Shift Templates --- */}
                <TabsContent value="shift-templates" className="mt-0 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Rotational Shift Templates</h3>
                            <p className="text-sm text-gray-500">Pre-defined time blocks for easy rostering.</p>
                        </div>
                        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Template
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Shift Template</DialogTitle>
                                    <DialogDescription>Define a standard shift block.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Template Name</Label>
                                        <Input 
                                            placeholder="e.g. Morning Shift A" 
                                            value={templateForm.name || ""} 
                                            onChange={e => setTemplateForm({...templateForm, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Start Time</Label>
                                            <Input 
                                                type="time" 
                                                value={templateForm.startTime || ""} 
                                                onChange={e => setTemplateForm({...templateForm, startTime: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End Time</Label>
                                            <Input 
                                                type="time" 
                                                value={templateForm.endTime || ""} 
                                                onChange={e => setTemplateForm({...templateForm, endTime: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSaveTemplate}>Save Template</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {shiftTemplates.map(template => (
                            <Card key={template.id} className="group hover:border-orange-300 transition-all cursor-default relative bg-white">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-sm font-semibold text-gray-900">{template.name}</CardTitle>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 text-gray-300 hover:text-red-500 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDeleteTemplate(template.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                                        <Sun className="h-4 w-4 text-orange-400" />
                                        <span className="text-sm font-medium">{template.startTime}</span>
                                        <span className="text-gray-300">-</span>
                                        <Moon className="h-4 w-4 text-indigo-400" />
                                        <span className="text-sm font-medium">{template.endTime}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
