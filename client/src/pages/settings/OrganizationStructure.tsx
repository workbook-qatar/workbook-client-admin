import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Plus, ArrowLeft, Building2, Users, Edit, Trash2, Briefcase } from "lucide-react";
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

// --- Types ---
interface OrganizationItem {
  id: string;
  name: string;
  description?: string;
  headOf?: string; // For departments (Head of Dept)
  status: "active" | "inactive";
  applicableTo?: string[]; // "field_service", "driver", "internal"
}

const MEMBER_TYPES = [
    { id: "field_service", label: "Field Service Staff" },
    { id: "driver", label: "Driver" },
    { id: "internal", label: "Internal Staff" },
];

// --- Defaults ---
const DEFAULT_DEPARTMENTS: OrganizationItem[] = [
  { id: "d1", name: "Operations", description: "Field operations and execution", status: "active", applicableTo: ["field_service", "driver", "internal"] },
  { id: "d2", name: "Sales", description: "Customer acquisition and relations", status: "active", applicableTo: ["internal"] },
  { id: "d3", name: "Technical", description: "Specialized technical support", status: "active", applicableTo: ["internal", "field_service"] },
  { id: "d4", name: "Administration", description: "Internal office management", status: "active", applicableTo: ["internal"] },
  { id: "d5", name: "Customer Service", description: "Support and helpdesk", status: "active", applicableTo: ["internal"] },
];

const DEFAULT_TEAMS: OrganizationItem[] = [
  { id: "t1", name: "Alpha Squad", description: "Morning shift field team", status: "active", applicableTo: ["field_service"] },
  { id: "t2", name: "Beta Squad", description: "Evening shift field team", status: "active", applicableTo: ["field_service"] },
  { id: "t3", name: "Rapid Response", description: "Emergency callouts", status: "active", applicableTo: ["field_service", "driver"] },
];

const DEFAULT_JOB_TITLES: OrganizationItem[] = [
    { id: "j1", name: "Cleaner", description: "General cleaning staff", status: "active", applicableTo: ["field_service"] },
    { id: "j2", name: "AC Technician", description: "HVAC specialist", status: "active", applicableTo: ["field_service"] },
    { id: "j3", name: "Electrician", description: "Electrical maintenance", status: "active", applicableTo: ["field_service"] },
    { id: "j4", name: "Plumber", description: "Plumbing maintenance", status: "active" }, // Legacy support
    { id: "j5", name: "Driver", description: "Vehicle operator", status: "active", applicableTo: ["driver"] },
    { id: "j6", name: "Supervisor", description: "Team lead", status: "active", applicableTo: ["field_service", "internal"] },
];

export default function OrganizationStructure() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("departments");
  
  // Data State
  const [departments, setDepartments] = useState<OrganizationItem[]>([]);
  const [teams, setTeams] = useState<OrganizationItem[]>([]);
  const [jobTitles, setJobTitles] = useState<OrganizationItem[]>([]);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{name: string, description: string, applicableTo: string[]}>({ name: "", description: "", applicableTo: [] });

  // Load Data
  useEffect(() => {
    const storedDepts = localStorage.getItem("vendor_departments");
    const storedTeams = localStorage.getItem("vendor_teams");
    const storedJobs = localStorage.getItem("vendor_job_titles");

    if (storedDepts) setDepartments(JSON.parse(storedDepts));
    else {
        setDepartments(DEFAULT_DEPARTMENTS);
        localStorage.setItem("vendor_departments", JSON.stringify(DEFAULT_DEPARTMENTS));
    }

    if (storedTeams) setTeams(JSON.parse(storedTeams));
    else {
        setTeams(DEFAULT_TEAMS);
        localStorage.setItem("vendor_teams", JSON.stringify(DEFAULT_TEAMS));
    }

    if (storedJobs) setJobTitles(JSON.parse(storedJobs));
    else {
        setJobTitles(DEFAULT_JOB_TITLES);
        localStorage.setItem("vendor_job_titles", JSON.stringify(DEFAULT_JOB_TITLES));
    }
  }, []);

  // CRUD Operations
  const handleSave = () => {
    if (!formData.name) return;

    const currentList = activeTab === "departments" ? departments : activeTab === "teams" ? teams : jobTitles;
    const setList = activeTab === "departments" ? setDepartments : activeTab === "teams" ? setTeams : setJobTitles;
    const storageKey = activeTab === "departments" ? "vendor_departments" : activeTab === "teams" ? "vendor_teams" : "vendor_job_titles";
    const itemName = activeTab === "departments" ? "Department" : activeTab === "teams" ? "Team" : "Job Title";

    let newList = [...currentList];
    if (editingId) {
        newList = newList.map(item => item.id === editingId ? { ...item, ...formData } : item);
        toast.success(`${itemName} updated`);
    } else {
        const newItem = {
            id: `${activeTab.substring(0, 1)}-${Date.now()}`,
            ...formData,
            status: "active" as const
        };
        newList.push(newItem);
        toast.success(`${itemName} created`);
    }
    
    setList(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const currentList = activeTab === "departments" ? departments : activeTab === "teams" ? teams : jobTitles;
    const setList = activeTab === "departments" ? setDepartments : activeTab === "teams" ? setTeams : setJobTitles;
    const storageKey = activeTab === "departments" ? "vendor_departments" : activeTab === "teams" ? "vendor_teams" : "vendor_job_titles";
    const itemName = activeTab === "departments" ? "Department" : activeTab === "teams" ? "Team" : "Job Title";

    const newList = currentList.filter(item => item.id !== id);
    setList(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
    toast.success(`${itemName} deleted`);
  };

  const openEdit = (item: OrganizationItem) => {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description || "", applicableTo: item.applicableTo || [] });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", applicableTo: [] });
  };

  // Filter
  const listToRender = activeTab === "departments" ? departments : activeTab === "teams" ? teams : jobTitles;
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Organization & Roles</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage departments, teams, and job titles.</p>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="p-8 max-w-5xl mx-auto w-full">
            <Tabs defaultValue="departments" onValueChange={(val) => { setActiveTab(val); setSearchQuery(""); }} className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-white border">
                        <TabsTrigger value="departments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                             Departments
                        </TabsTrigger>
                        <TabsTrigger value="teams" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                             Teams
                        </TabsTrigger>
                        <TabsTrigger value="job-titles" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                             Job Titles
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder={`Search ${activeTab}...`} 
                                className="pl-10 h-10 bg-white w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20">
                                    <Plus className="h-4 w-4" />
                                    <Plus className="h-4 w-4" />
                                    Add {activeTab === "departments" ? "Department" : activeTab === "teams" ? "Team" : "Job Title"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingId ? "Edit" : "Add"} {activeTab === "departments" ? "Department" : activeTab === "teams" ? "Team" : "Job Title"}</DialogTitle>
                                    <DialogDescription>
                                        Create a new {activeTab === "departments" ? "department" : activeTab === "teams" ? "team" : "job role"} unit.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">

                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder={`e.g. ${activeTab === "departments" ? "Marketing" : activeTab === "teams" ? "Alpha Squad" : "Senior Technician"}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="desc">Description</Label>
                                        <Input id="desc" placeholder="Optional description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                    </div>
                                    
                                    <div className="space-y-3 pt-2">
                                        <Label>Applicable Member Types</Label>
                                        <div className="flex flex-col gap-2 p-3 border rounded-md bg-gray-50/50">
                                            {MEMBER_TYPES.map(type => {
                                                const isChecked = formData.applicableTo.includes(type.id);
                                                return (
                                                    <div 
                                                        key={type.id} 
                                                        className="flex items-center gap-2 cursor-pointer"
                                                        onClick={() => {
                                                            const current = formData.applicableTo;
                                                            if (isChecked) {
                                                                setFormData({...formData, applicableTo: current.filter(t => t !== type.id)});
                                                            } else {
                                                                setFormData({...formData, applicableTo: [...current, type.id]});
                                                            }
                                                        }}
                                                    >
                                                        <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                                                            {isChecked && <div className="h-1.5 w-2 bg-white -rotate-45 border-l-2 border-b-2 border-white transform mb-0.5" style={{width: 6, height: 4, borderRadius: 1, backgroundColor: 'transparent'}}></div>}
                                                            {/* Simple checkmark CSS hack or Icon */}
                                                            {isChecked && <Plus className="h-3 w-3 text-white rotate-45 transform origin-center" />} 
                                                        </div>
                                                        <span className="text-sm text-gray-700">{type.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-[10px] text-gray-500">Select which staff roles this option appears for.</p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSave} disabled={!formData.name}>Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <TabsContent value="departments" className="mt-0">
                    <div className="grid gap-3">
                        {filteredList.map(item => (
                            <Card key={item.id} className="p-4 flex items-center justify-between hover:border-blue-300 transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                                        {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                                        <div className="flex gap-1 mt-1.5 flex-wrap">
                                            {item.applicableTo?.map(t => (
                                                <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                                    {MEMBER_TYPES.find(m => m.id === t)?.label || t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => openEdit(item)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="teams" className="mt-0">
                    <div className="grid gap-3">
                        {filteredList.map(item => (
                            <Card key={item.id} className="p-4 flex items-center justify-between hover:border-blue-300 transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                                        {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                                        <div className="flex gap-1 mt-1.5 flex-wrap">
                                            {item.applicableTo?.map(t => (
                                                <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                                    {MEMBER_TYPES.find(m => m.id === t)?.label || t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => openEdit(item)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="job-titles" className="mt-0">
                    <div className="grid gap-3">
                        {filteredList.map(item => (
                            <Card key={item.id} className="p-4 flex items-center justify-between hover:border-blue-300 transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                                        {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => openEdit(item)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
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
