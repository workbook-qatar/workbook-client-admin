import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Plus, ArrowLeft, FileText, Edit, Trash2, CheckCircle2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface DocumentType {
    id: string;
    name: string;
    description?: string;
    requiresExpiry: boolean;
    status: "active" | "inactive";
}

const DEFAULT_DOCUMENTS: DocumentType[] = [
    { id: "dt1", name: "Passport", description: "International travel document", requiresExpiry: true, status: "active" },
    { id: "dt2", name: "Visa / QID", description: "Residency or work permit", requiresExpiry: true, status: "active" },
    { id: "dt3", name: "Driving License", description: "Required for drivers", requiresExpiry: true, status: "active" },
    { id: "dt4", name: "Health Certificate", description: "Medical fitness record", requiresExpiry: true, status: "active" },
    { id: "dt5", name: "Police Clearance", description: "Criminal record check", requiresExpiry: false, status: "active" },
];

export default function DocumentsCompliance() {
  const [, setLocation] = useLocation();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Edit/Create State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", requiresExpiry: true });

  useEffect(() => {
    const stored = localStorage.getItem("vendor_document_types");
    if (stored) {
        setDocuments(JSON.parse(stored));
    } else {
         setDocuments(DEFAULT_DOCUMENTS);
        localStorage.setItem("vendor_document_types", JSON.stringify(DEFAULT_DOCUMENTS));
    }
  }, []);

  const handleSave = () => {
      if (!formData.name) return;

      let newList = [...documents];
      if (editingId) {
          newList = newList.map(item => item.id === editingId ? { ...item, ...formData } : item);
          toast.success("Document type updated");
      } else {
          const newItem = {
              id: `dt-${Date.now()}`,
              ...formData,
              status: "active" as const
          };
          newList.push(newItem);
          toast.success("Document type created");
      }
      
      setDocuments(newList);
      localStorage.setItem("vendor_document_types", JSON.stringify(newList));
      setIsDialogOpen(false);
      resetForm();
  };

  const handleDelete = (id: string) => {
      const newList = documents.filter(item => item.id !== id);
      setDocuments(newList);
      localStorage.setItem("vendor_document_types", JSON.stringify(newList));
      toast.success("Document type deleted");
  };

  const openEdit = (item: DocumentType) => {
      setEditingId(item.id);
      setFormData({ name: item.name, description: item.description || "", requiresExpiry: item.requiresExpiry });
      setIsDialogOpen(true);
  };

  const resetForm = () => {
      setEditingId(null);
      setFormData({ name: "", description: "", requiresExpiry: true });
  };

  const filteredList = documents.filter(item => 
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Documents & Compliance</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage required staff documents and expiry rules.</p>
                </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white gap-2 shadow-lg shadow-rose-600/20">
                        <Plus className="h-4 w-4" />
                        Add Document Type
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Document Type" : "Add New Document Type"}</DialogTitle>
                        <DialogDescription>
                            Define a document that staff members may need to provide.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Document Name</Label>
                            <Input id="name" placeholder="e.g. Passport" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="expiry" 
                                checked={formData.requiresExpiry} 
                                onCheckedChange={(checked) => setFormData({...formData, requiresExpiry: checked as boolean})} 
                            />
                            <Label htmlFor="expiry" className="text-sm font-normal cursor-pointer">
                                Requires Expiry Date tracking?
                            </Label>
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
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search documents..." 
                    className="pl-10 h-10 bg-white border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-3">
                {filteredList.map(item => (
                    <Card key={item.id} className="p-4 flex items-center justify-between hover:border-rose-300 transition-all group bg-white border-gray-200/60">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                    {item.name}
                                    {item.requiresExpiry && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            Tracks Expiry
                                        </span>
                                    )}
                                </h3>
                                {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-rose-600" onClick={() => openEdit(item)}>
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
