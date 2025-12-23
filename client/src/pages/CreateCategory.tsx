
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// --- Design Standard ---
const STYLES = {
  sectionTitle: "text-[16px] font-semibold text-gray-900 mb-5 relative pl-3 before:absolute before:left-0 before:top-1 before:w-[3px] before:h-4 before:bg-blue-600 before:rounded-full",
  label: "text-[13px] text-gray-600 font-medium mb-1.5 block",
  input: "h-[38px] text-sm bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg transition-all",
  card: "bg-white p-6 shadow-sm border border-gray-100/50 rounded-xl hover:shadow-md transition-shadow duration-200",
};

export default function CreateCategory() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/services/category/edit/:id");
  const isEditMode = match && params?.id ? true : false;
  const categoryId = params?.id ? (isNaN(Number(params.id)) ? params.id : Number(params.id)) : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (isEditMode && categoryId) {
        // Load from storage
        const storedCats = localStorage.getItem("vendor_categories");
        const cats = storedCats ? JSON.parse(storedCats) : [];
        const cat = cats.find((c: any) => c.id == categoryId);
        
        // Also check Presets if not found? 
        // Presets are imported in Services.tsx. If we edit a preset, we should probably "fork" it or just reference it.
        // For now, let's assume we can only edit custom categories or stored ones.
        // Actually, Services.tsx treats presets as 'readonly' regarding deletion, but maybe allows editing?
        // Let's keep it simple: We only edit what's in storage. If user tries to edit a preset, we'd need to copy it to storage. 
        // But for now, let's just support stored categories.
        
        if (cat) {
            setName(cat.name);
            setDescription(cat.description || "");
            setStatus(cat.status || "active");
            setOrder(cat.order || 0);
        }
    }
  }, [isEditMode, categoryId]);

  const handleSave = () => {
      try {
        const storedCats = localStorage.getItem("vendor_categories");
        let cats = storedCats ? JSON.parse(storedCats) : [];
        
        const newCat = {
            id: isEditMode ? categoryId : Date.now(),
            name,
            description,
            status,
            order: Number(order)
        };

        if (isEditMode) {
            cats = cats.filter((c: any) => c.id != categoryId);
            cats.push(newCat);
        } else {
            cats.push(newCat);
        }

        localStorage.setItem("vendor_categories", JSON.stringify(cats));
        toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully`);
        setLocation("/services");
      } catch (e) {
          toast.error("Failed to save category");
      }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50/50">
        
        {/* Header */}
        <div className="flex-none px-8 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setLocation("/services")} className="rounded-full hover:bg-gray-100 text-gray-500">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                   <h1 className="text-xl font-bold text-gray-900 tracking-tight">{isEditMode ? "Edit Category" : "Create Category"}</h1>
                   <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      {status === 'active' ? 'Active' : 'Draft/Inactive'}
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setLocation("/services")} className="text-gray-600 hover:text-gray-900">
                  Discard
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 gap-2 rounded-lg px-6" onClick={handleSave} disabled={!name}>
                  <Save className="h-4 w-4" />
                  Save Category
                </Button>
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
            <div className="max-w-2xl mx-auto space-y-8 pb-32">
                
                {/* 1. Category Information */}
                <Card className={STYLES.card}>
                    <h3 className={STYLES.sectionTitle}>Category Information</h3>
                    <div className="space-y-6">
                        <div>
                            <Label className={STYLES.label}>Category Name <span className="text-red-500">*</span></Label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Pest Control" className={STYLES.input} />
                        </div>
                        <div>
                             <Label className={STYLES.label}>Description</Label>
                             <Textarea 
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Add optional details about this category..." 
                                className="min-h-[100px] text-sm resize-none bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg transition-all"
                            />
                        </div>
                    </div>
                </Card>

                {/* 2. Settings & Status */}
                <Card className={STYLES.card}>
                    <h3 className={STYLES.sectionTitle}>Settings & Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className={STYLES.label}>Status <span className="text-red-500">*</span></Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className={STYLES.input}>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500" />
                                            Active
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-gray-300" />
                                            Inactive
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                             <Label className={STYLES.label}>Display Order</Label>
                             <Input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} min="0" className={STYLES.input} />
                             <p className="text-[11px] text-gray-400 mt-1.5 ml-1">Lower numbers appear first.</p>
                        </div>
                    </div>
                </Card>

            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
