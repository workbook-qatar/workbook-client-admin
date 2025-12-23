import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Plus, ArrowLeft, Wrench, Edit, Trash2 } from "lucide-react";
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

// Default seed data if storage is empty
const DEFAULT_SKILLS = [
  { id: "s1", name: "General Cleaning", description: "Basic dusting, mopping, and tidying", status: "active" },
  { id: "s2", name: "Deep Cleaning", description: "Intensive cleaning for move-ins or post-construction", status: "active" },
  { id: "s3", name: "AC Repair", description: "Diagnosis and repair of air conditioning units", status: "active" },
  { id: "s4", name: "Plumbing", description: "Pipe repair, installation, and maintenance", status: "active" },
  { id: "s5", name: "Electrical", description: "Wiring, fixtures, and electrical system maintenance", status: "active" },
];

export default function SkillsSettings() {
  const [, setLocation] = useLocation();
  const [skills, setSkills] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Edit/Create State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Load Skills
  useEffect(() => {
    const stored = localStorage.getItem("vendor_skills");
    if (stored) {
        setSkills(JSON.parse(stored));
    } else {
        // Seed defaults
        setSkills(DEFAULT_SKILLS);
        localStorage.setItem("vendor_skills", JSON.stringify(DEFAULT_SKILLS));
    }
  }, []);

  const handleSave = () => {
      if (!formData.name) return;

      let newSkills = [...skills];
      if (editingId) {
          newSkills = newSkills.map(s => s.id === editingId ? { ...s, ...formData } : s);
          toast.success("Skill updated");
      } else {
          const newSkill = {
              id: `s-${Date.now()}`,
              ...formData,
              status: "active"
          };
          newSkills.push(newSkill);
          toast.success("Skill created");
      }
      
      setSkills(newSkills);
      localStorage.setItem("vendor_skills", JSON.stringify(newSkills));
      setIsDialogOpen(false);
      resetForm();
  };

  const handleDelete = (id: string) => {
      // In a real app, check usage first!
      const newSkills = skills.filter(s => s.id !== id);
      setSkills(newSkills);
      localStorage.setItem("vendor_skills", JSON.stringify(newSkills));
      toast.success("Skill deleted");
  };

  const openEdit = (skill: any) => {
      setEditingId(skill.id);
      setFormData({ name: skill.name, description: skill.description || "" });
      setIsDialogOpen(true);
  };

  const resetForm = () => {
      setEditingId(null);
      setFormData({ name: "", description: "" });
  };

  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Skills Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Define capabilities required for your service packages.</p>
                </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20">
                        <Plus className="h-4 w-4" />
                        Add Skill
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Skill" : "Add New Skill"}</DialogTitle>
                        <DialogDescription>
                            Define a verified skill that can be assigned to staff and packages.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Skill Name</Label>
                            <Input id="name" placeholder="e.g. Electrical Repair" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
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

        {/* Content */}
        <div className="p-8 max-w-4xl mx-auto w-full">
            
            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search skills..." 
                    className="pl-10 h-10 bg-white border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="grid gap-3">
                {filteredSkills.map(skill => (
                    <Card key={skill.id} className="p-4 flex items-center justify-between hover:border-blue-300 transition-all group bg-white border-gray-200/60">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Wrench className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{skill.name}</h3>
                                {skill.description && <p className="text-xs text-gray-500 mt-0.5">{skill.description}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => openEdit(skill)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDelete(skill.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}

                {filteredSkills.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No skills found.</p>
                    </div>
                )}
            </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
