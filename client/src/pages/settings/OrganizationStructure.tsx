import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Plus, ArrowLeft, Building2, Users, Edit, Trash2 } from "lucide-react";
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
}

// --- Defaults ---
const DEFAULT_DEPARTMENTS: OrganizationItem[] = [
  { id: "d1", name: "Operations", description: "Field operations and execution", status: "active" },
  { id: "d2", name: "Sales", description: "Customer acquisition and relations", status: "active" },
  { id: "d3", name: "Technical", description: "Specialized technical support", status: "active" },
  { id: "d4", name: "Administration", description: "Internal office management", status: "active" },
  { id: "d5", name: "Customer Service", description: "Support and helpdesk", status: "active" },
];

const DEFAULT_TEAMS: OrganizationItem[] = [
  { id: "t1", name: "Alpha Squad", description: "Morning shift field team", status: "active" },
  { id: "t2", name: "Beta Squad", description: "Evening shift field team", status: "active" },
  { id: "t3", name: "Rapid Response", description: "Emergency callouts", status: "active" },
];

export default function OrganizationStructure() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("departments");
  
  // Data State
  const [departments, setDepartments] = useState<OrganizationItem[]>([]);
  const [teams, setTeams] = useState<OrganizationItem[]>([]);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Load Data
  useEffect(() => {
    const storedDepts = localStorage.getItem("vendor_departments");
    const storedTeams = localStorage.getItem("vendor_teams");

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
  }, []);

  // CRUD Operations
  const handleSave = () => {
    if (!formData.name) return;

    const currentList = activeTab === "departments" ? departments : teams;
    const setList = activeTab === "departments" ? setDepartments : setTeams;
    const storageKey = activeTab === "departments" ? "vendor_departments" : "vendor_teams";
    const itemName = activeTab === "departments" ? "Department" : "Team";

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
    const currentList = activeTab === "departments" ? departments : teams;
    const setList = activeTab === "departments" ? setDepartments : setTeams;
    const storageKey = activeTab === "departments" ? "vendor_departments" : "vendor_teams";
    const itemName = activeTab === "departments" ? "Department" : "Team";

    const newList = currentList.filter(item => item.id !== id);
    setList(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
    toast.success(`${itemName} deleted`);
  };

  const openEdit = (item: OrganizationItem) => {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description || "" });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  // Filter
  const listToRender = activeTab === "departments" ? departments : teams;
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Organization Structure</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your company's departments and team hierarchy.</p>
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
                                    Add {activeTab === "departments" ? "Department" : "Team"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingId ? "Edit" : "Add"} {activeTab === "departments" ? "Department" : "Team"}</DialogTitle>
                                    <DialogDescription>
                                        Create a new {activeTab === "departments" ? "department" : "team"} unit in your organization.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder={`e.g. ${activeTab === "departments" ? "Marketing" : "Alpha Squad"}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="desc">Description</Label>
                                        <Input id="desc" placeholder="Optional description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
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
