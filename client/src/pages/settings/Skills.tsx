import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Plus, ArrowLeft, Wrench, Edit, Trash2, ShieldCheck, FileText, Calendar, AlertCircle } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface Skill {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
  // Certification Logic
  requiresCert: boolean;
  certName?: string;
  certExpiry?: boolean;
}

// Default seed data with certification logic
const DEFAULT_SKILLS: Skill[] = [
  { 
    id: "s1", 
    name: "General Cleaning", 
    description: "Basic dusting, mopping, and tidying", 
    status: "active",
    requiresCert: false 
  },
  { 
    id: "s2", 
    name: "Deep Cleaning", 
    description: "Intensive cleaning for move-ins or post-construction", 
    status: "active",
    requiresCert: false
  },
  { 
    id: "s3", 
    name: "AC Repair", 
    description: "Diagnosis and repair of air conditioning units", 
    status: "active",
    requiresCert: true,
    certName: "HVAC Technician Certificate",
    certExpiry: true
  },
  { 
    id: "s4", 
    name: "Plumbing", 
    description: "Pipe repair, installation, and maintenance", 
    status: "active",
    requiresCert: true,
    certName: "Plumbing License",
    certExpiry: true
  },
  { 
    id: "s5", 
    name: "Electrical", 
    description: "Wiring, fixtures, and electrical system maintenance", 
    status: "active",
    requiresCert: true,
    certName: "Electrician Certification",
    certExpiry: true
  },
  {
    id: "s6",
    name: "Driving",
    description: "Vehicle operation",
    status: "active",
    requiresCert: true,
    certName: "Driver's License",
    certExpiry: true
  },
    {
    id: "s7",
    name: "Beautician",
    description: "Cosmetology and beauty treatments",
    status: "active",
    requiresCert: true,
    certName: "Cosmetology License",
    certExpiry: true
  }
];

export default function SkillsSettings() {
  const [, setLocation] = useLocation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Edit/Create State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({ 
    name: "", 
    description: "",
    requiresCert: false,
    certName: "",
    certExpiry: false 
  });

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
      if (formData.requiresCert && !formData.certName) {
          toast.error("Please specify the Certificate Name");
          return;
      }

      let newSkills = [...skills];
      if (editingId) {
          newSkills = newSkills.map(s => s.id === editingId ? { ...s, ...formData } as Skill : s);
          toast.success("Skill updated");
      } else {
          const newSkill: Skill = {
              id: `s-${Date.now()}`,
              ...formData as Skill,
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
      const newSkills = skills.filter(s => s.id !== id);
      setSkills(newSkills);
      localStorage.setItem("vendor_skills", JSON.stringify(newSkills));
      toast.success("Skill deleted");
  };

  const openEdit = (skill: Skill) => {
      setEditingId(skill.id);
      setFormData({ 
        name: skill.name, 
        description: skill.description || "",
        requiresCert: skill.requiresCert || false,
        certName: skill.certName || "",
        certExpiry: skill.certExpiry || false
      });
      setIsDialogOpen(true);
  };

  const resetForm = () => {
      setEditingId(null);
      setFormData({ 
        name: "", 
        description: "",
        requiresCert: false,
        certName: "",
        certExpiry: false
      });
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
                    <p className="text-sm text-gray-500 mt-1">Define capabilities and certification requirements for your workforce.</p>
                </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2 shadow-lg shadow-cyan-600/20">
                        <Plus className="h-4 w-4" />
                        Add Skill
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Skill" : "Add New Skill"}</DialogTitle>
                        <DialogDescription>
                            Configure skill details and compliance requirements.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Skill Name <span className="text-red-500">*</span></Label>
                                <Input id="name" placeholder="e.g. Electrical Repair" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc">Description</Label>
                                <Input id="desc" placeholder="Optional description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-orange-600" />
                                        Requires Certificate?
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                        Does this skill require mandatory documentation?
                                    </p>
                                </div>
                                <Switch 
                                    checked={formData.requiresCert} 
                                    onCheckedChange={(checked) => setFormData({...formData, requiresCert: checked})} 
                                />
                            </div>

                            {formData.requiresCert && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                                    <div className="space-y-2">
                                        <Label htmlFor="certName" className="text-orange-900">Certificate Name <span className="text-red-500">*</span></Label>
                                        <Input 
                                            id="certName" 
                                            placeholder="e.g. HVAC Technician License" 
                                            className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                                            value={formData.certName} 
                                            onChange={e => setFormData({...formData, certName: e.target.value})} 
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="expiry" className="cursor-pointer text-orange-900">Expiry Date Required?</Label>
                                        <Switch 
                                            id="expiry" 
                                            className="data-[state=checked]:bg-orange-600"
                                            checked={formData.certExpiry} 
                                            onCheckedChange={(checked) => setFormData({...formData, certExpiry: checked})} 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={!formData.name} className="bg-cyan-600 hover:bg-cyan-700">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

        {/* Content */}
        <div className="p-8 max-w-5xl mx-auto w-full">
            
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
                    <Card key={skill.id} className="p-4 flex items-center justify-between hover:border-cyan-300 transition-all group bg-white border-gray-200/60">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Wrench className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                    {skill.name}
                                    {skill.requiresCert && (
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 py-0 border-orange-200 text-orange-700 bg-orange-50 gap-1">
                                            <ShieldCheck className="h-3 w-3" />
                                            Cert Required
                                        </Badge>
                                    )}
                                </h3>
                                {(skill.requiresCert && skill.certName) ? (
                                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                                        <FileText className="h-3 w-3 text-gray-400" />
                                        Requires: <span className="font-medium text-gray-700">{skill.certName}</span>
                                        {skill.certExpiry && (
                                            <span className="text-gray-400 flex items-center gap-1 ml-1" title="Expiry Date Required">
                                                • <Calendar className="h-3 w-3" /> Expiry
                                            </span>
                                        )}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-0.5">{skill.description || "No description"}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-cyan-600" onClick={() => openEdit(skill)}>
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
                        <Button variant="link" onClick={() => setIsDialogOpen(true)}>Add a new skill</Button>
                    </div>
                )}
            </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
