import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Plus, ArrowLeft, FileText, Clock, Edit, Trash2 } from "lucide-react";
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

interface ConfigItem {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
}

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

export default function EmploymentRules() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("employment-types");
  
  // Data State
  const [employmentTypes, setEmploymentTypes] = useState<ConfigItem[]>([]);
  const [contractTypes, setContractTypes] = useState<ConfigItem[]>([]);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Load Data
  useEffect(() => {
    const storedEmpTypes = localStorage.getItem("vendor_employment_types");
    const storedContractTypes = localStorage.getItem("vendor_contract_types");

    if (storedEmpTypes) setEmploymentTypes(JSON.parse(storedEmpTypes));
    else {
        setEmploymentTypes(DEFAULT_EMPLOYMENT_TYPES);
        localStorage.setItem("vendor_employment_types", JSON.stringify(DEFAULT_EMPLOYMENT_TYPES));
    }

    if (storedContractTypes) setContractTypes(JSON.parse(storedContractTypes));
    else {
        setContractTypes(DEFAULT_CONTRACT_TYPES);
        localStorage.setItem("vendor_contract_types", JSON.stringify(DEFAULT_CONTRACT_TYPES));
    }
  }, []);

  // CRUD Operations
  const handleSave = () => {
    if (!formData.name) return;

    const currentList = activeTab === "employment-types" ? employmentTypes : contractTypes;
    const setList = activeTab === "employment-types" ? setEmploymentTypes : setContractTypes;
    const storageKey = activeTab === "employment-types" ? "vendor_employment_types" : "vendor_contract_types";
    const itemName = activeTab === "employment-types" ? "Employment Type" : "Contract Type";

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
    const currentList = activeTab === "employment-types" ? employmentTypes : contractTypes;
    const setList = activeTab === "employment-types" ? setEmploymentTypes : setContractTypes;
    const storageKey = activeTab === "employment-types" ? "vendor_employment_types" : "vendor_contract_types";
    const itemName = activeTab === "employment-types" ? "Employment Type" : "Contract Type";

    const newList = currentList.filter(item => item.id !== id);
    setList(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
    toast.success(`${itemName} deleted`);
  };

  const openEdit = (item: ConfigItem) => {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description || "" });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  // Filter
  const listToRender = activeTab === "employment-types" ? employmentTypes : contractTypes;
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Employment Rules</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure employment classifications and contract definitions.</p>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="p-8 max-w-5xl mx-auto w-full">
            <Tabs defaultValue="employment-types" onValueChange={(val) => { setActiveTab(val); setSearchQuery(""); }} className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-white border">
                        <TabsTrigger value="employment-types" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
                             Employment Types
                        </TabsTrigger>
                        <TabsTrigger value="contract-types" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
                             Contract Types
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-3">
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
                                    Add {activeTab === "employment-types" ? "Employment Type" : "Contract Type"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingId ? "Edit" : "Add"} {activeTab === "employment-types" ? "Employment Type" : "Contract Type"}</DialogTitle>
                                    <DialogDescription>
                                        Define legal classification for staff members.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder={`e.g. ${activeTab === "employment-types" ? "Full Time" : "Permanent"}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
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

                <TabsContent value="employment-types" className="mt-0">
                    <div className="grid gap-3">
                        {filteredList.map(item => (
                            <Card key={item.id} className="p-4 flex items-center justify-between hover:border-teal-300 transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                        <Clock className="h-5 w-5" />
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
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="contract-types" className="mt-0">
                    <div className="grid gap-3">
                        {filteredList.map(item => (
                            <Card key={item.id} className="p-4 flex items-center justify-between hover:border-teal-300 transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                        <FileText className="h-5 w-5" />
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
