import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Plus, ArrowLeft, Banknote, Edit, Trash2 } from "lucide-react";
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

interface SalaryStructure {
    id: string;
    name: string;
    code: string; // e.g. fixed-monthly
    description?: string;
    status: "active" | "inactive";
}

const DEFAULT_SALARY_STRUCTURES: SalaryStructure[] = [
    { id: "ss1", name: "Fixed Monthly", code: "fixed-monthly", description: "Standard monthly salary", status: "active" },
    { id: "ss2", name: "Commission Based", code: "commission-based", description: "Earnings based on performance", status: "active" },
    { id: "ss3", name: "Hourly Rate", code: "hourly-rate", description: "Paid per hour worked", status: "active" },
    { id: "ss4", name: "Fixed + Commission", code: "fixed-commission", description: "Base salary plus performance upsides", status: "active" },
];

export default function PayrollConfiguration() {
  const [, setLocation] = useLocation();
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Edit/Create State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });

  useEffect(() => {
    const stored = localStorage.getItem("vendor_salary_structures");
    if (stored) {
        setStructures(JSON.parse(stored));
    } else {
        setStructures(DEFAULT_SALARY_STRUCTURES);
        localStorage.setItem("vendor_salary_structures", JSON.stringify(DEFAULT_SALARY_STRUCTURES));
    }
  }, []);

  const handleSave = () => {
      if (!formData.name || !formData.code) return;

      let newList = [...structures];
      if (editingId) {
          newList = newList.map(item => item.id === editingId ? { ...item, ...formData } : item);
          toast.success("Salary structure updated");
      } else {
          const newItem = {
              id: `ss-${Date.now()}`,
              ...formData,
              status: "active" as const
          };
          newList.push(newItem);
          toast.success("Salary structure created");
      }
      
      setStructures(newList);
      localStorage.setItem("vendor_salary_structures", JSON.stringify(newList));
      setIsDialogOpen(false);
      resetForm();
  };

  const handleDelete = (id: string) => {
      const newList = structures.filter(item => item.id !== id);
      setStructures(newList);
      localStorage.setItem("vendor_salary_structures", JSON.stringify(newList));
      toast.success("Salary structure deleted");
  };

  const openEdit = (item: SalaryStructure) => {
      setEditingId(item.id);
      setFormData({ name: item.name, code: item.code, description: item.description || "" });
      setIsDialogOpen(true);
  };

  const resetForm = () => {
      setEditingId(null);
      setFormData({ name: "", code: "", description: "" });
  };

  const filteredList = structures.filter(item => 
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payroll Configuration</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage salary structures and compensation models.</p>
                </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg shadow-emerald-600/20">
                        <Plus className="h-4 w-4" />
                        Add Structure
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Structure" : "Add Structure"}</DialogTitle>
                        <DialogDescription>
                            Define a compensation model (e.g., Monthly Salary, Hourly).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="e.g. Daily Wages" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">System Code (Unique)</Label>
                            <Input id="code" placeholder="e.g. daily-wages" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toLowerCase().replace(/\s+/g, '-')})} />
                            <p className="text-xs text-gray-500">Used by the system to calculate pay.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Description</Label>
                            <Input id="desc" placeholder="Optional description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={!formData.name || !formData.code}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

        {/* Content */}
        <div className="p-8 max-w-4xl mx-auto w-full">
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search structures..." 
                    className="pl-10 h-10 bg-white border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-3">
                {filteredList.map(item => (
                    <Card key={item.id} className="p-4 flex items-center justify-between hover:border-emerald-300 transition-all group bg-white border-gray-200/60">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Banknote className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Code: {item.code}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600" onClick={() => openEdit(item)}>
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
