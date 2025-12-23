import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Plus, ArrowLeft, Briefcase, Edit, Trash2 } from "lucide-react";
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
import { toast } from "sonner";

interface JobTitle {
    id: string;
    name: string;
    description?: string;
    departmentId?: string; // Optional link to dept
    status: "active" | "inactive";
}

const DEFAULT_JOB_TITLES: JobTitle[] = [
    { id: "j1", name: "Cleaner", description: "General cleaning staff", status: "active" },
    { id: "j2", name: "AC Technician", description: "HVAC specialist", status: "active" },
    { id: "j3", name: "Electrician", description: "Electrical maintenance", status: "active" },
    { id: "j4", name: "Plumber", description: "Plumbing maintenance", status: "active" },
    { id: "j5", name: "Driver", description: "Vehicle operator", status: "active" },
    { id: "j6", name: "Supervisor", description: "Team lead", status: "active" },
];

export default function JobSetup() {
  const [, setLocation] = useLocation();
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Edit/Create State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    const stored = localStorage.getItem("vendor_job_titles");
    if (stored) {
        setJobTitles(JSON.parse(stored));
    } else {
        setJobTitles(DEFAULT_JOB_TITLES);
        localStorage.setItem("vendor_job_titles", JSON.stringify(DEFAULT_JOB_TITLES));
    }
  }, []);

  const handleSave = () => {
      if (!formData.name) return;

      let newList = [...jobTitles];
      if (editingId) {
          newList = newList.map(item => item.id === editingId ? { ...item, ...formData } : item);
          toast.success("Job title updated");
      } else {
          const newItem = {
              id: `j-${Date.now()}`,
              ...formData,
              status: "active" as const
          };
          newList.push(newItem);
          toast.success("Job title created");
      }
      
      setJobTitles(newList);
      localStorage.setItem("vendor_job_titles", JSON.stringify(newList));
      setIsDialogOpen(false);
      resetForm();
  };

  const handleDelete = (id: string) => {
      const newList = jobTitles.filter(item => item.id !== id);
      setJobTitles(newList);
      localStorage.setItem("vendor_job_titles", JSON.stringify(newList));
      toast.success("Job title deleted");
  };

  const openEdit = (item: JobTitle) => {
      setEditingId(item.id);
      setFormData({ name: item.name, description: item.description || "" });
      setIsDialogOpen(true);
  };

  const resetForm = () => {
      setEditingId(null);
      setFormData({ name: "", description: "" });
  };

  const filteredList = jobTitles.filter(item => 
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Job Setup</h1>
                    <p className="text-sm text-gray-500 mt-1">Define standard job titles and roles for your organization.</p>
                </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20">
                        <Plus className="h-4 w-4" />
                        Add Job Title
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Job Title" : "Add New Job Title"}</DialogTitle>
                        <DialogDescription>
                            Create a standard job designation (e.g., Senior Accountant, Driver).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Job Title</Label>
                            <Input id="name" placeholder="e.g. Senior Technician" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Description / Responsibilities</Label>
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

        {/* Content */}
        <div className="p-8 max-w-4xl mx-auto w-full">
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search job titles..." 
                    className="pl-10 h-10 bg-white border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-3">
                {filteredList.map(item => (
                    <Card key={item.id} className="p-4 flex items-center justify-between hover:border-blue-300 transition-all group bg-white border-gray-200/60">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
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
        </div>
      </div>
    </DashboardLayout>
  );
}
