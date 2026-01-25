import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  ArrowLeft, CheckCircle, ShieldCheck, Mail, Phone, Calendar, 
  MapPin, User, Flag, Edit2, ArrowRight, Briefcase, Lock, Download
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StaffMember } from "./Workforce";

// Extended interface (Subset of what's in StaffPendingInviteDetails, tailored for Internal)
interface InternalStaffMember extends StaffMember {
    nickname?: string;
    qid?: string;
    dob?: string;
    nationality?: string;
    gender?: 'Male' | 'Female';
    department?: string;
    position?: string;
    employmentType?: 'Full Time' | 'Part Time' | 'Contract';
    startDate?: string;
    salaryType?: string;
    // Internal Specific
    systemAccess?: boolean;
    systemRole?: string;
    permissions?: string[];
}

export default function InternalPendingInviteDetails({ initialData }: { initialData?: any }) { // Accept props if passed by router
  const [, params] = useRoute("/workforce/pending/:id");
  const [data, setData] = useState<InternalStaffMember | null>(initialData || null);
  const [formData, setFormData] = useState<InternalStaffMember | null>(initialData || null);
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0); 
  const [isEditing, setIsEditing] = useState(true); // Default to edit mode for setup

  useEffect(() => {
    if (initialData) {
        setData(initialData);
        setFormData(initialData);
        return;
    }
    
    // Fallback load if no props (e.g. direct link logic if we supported it, but our Router will handle it)
    const stored = localStorage.getItem("vendor_staff");
    if (stored && params?.id) {
        const list = JSON.parse(stored);
        const found = list.find((s: any) => s.id === params.id || s.id === parseInt(params.id));
        if (found) {
            setData(found);
            setFormData(found);
        }
    }
  }, [params?.id, initialData]);

  if (!formData || !data) return <div className="p-8 text-center">Loading Internal Staff Details...</div>;

  const saveChanges = (activate = false) => {
      const stored = localStorage.getItem("vendor_staff");
      if (stored) {
          const list = JSON.parse(stored);
          const index = list.findIndex((s: any) => s.id === data.id);
          if (index !== -1) {
              const updated = { 
                  ...list[index], 
                  ...formData,
                  ...(activate ? { membershipStatus: 'active', employmentStatus: 'Active', status: 'offline' } : {}) 
              };
              list[index] = updated;
              localStorage.setItem("vendor_staff", JSON.stringify(list));
              setData(updated);
              toast.success(activate ? "Staff Activated Successfully" : "Changes saved");
              if (activate) {
                  setLocation("/workforce");
              }
          }
      }
  };

  const steps = [
      { id: 'profile', label: 'Profile & Role', completed: !!(formData.name && formData.email && formData.position) },
      { id: 'access', label: 'System Access', completed: true },
  ];

  return (
    <DashboardLayout>
       <div className="space-y-6">
         {/* Nav */}
         <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/workforce/pending")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Workforce
            </Button>
         </div>

         <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 animate-in fade-in">
             
             {/* LEFT SIDEBAR */}
             <div className="w-full lg:w-80 shrink-0 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                    <div className="p-6 flex flex-col items-center text-center border-b border-gray-100 bg-gray-50/50">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg mb-4">
                            <AvatarImage src={data.avatar} />
                            <AvatarFallback>{data.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <h2 className="font-bold text-lg">{data.name}</h2>
                        <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-700 hover:bg-purple-100">Internal Staff</Badge>
                    </div>
                     <div className="p-6 space-y-4 text-sm flex-1">
                        <div className="space-y-3">
                            <div className="flex justify-between"><span className="text-gray-500">Email</span> <span className="font-medium">{data.email}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Phone</span> <span className="font-medium">{data.phone}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Role</span> <span className="font-medium">{data.position || 'Staff'}</span></div>
                        </div>
                     </div>
                </div>
             </div>

             {/* MAIN CONTENT */}
             <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8 overflow-y-auto">
                 <div className="max-w-3xl mx-auto space-y-8">
                     
                     <div className="space-y-6">
                         <div className="flex items-center gap-3 border-b pb-4">
                             <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                 <Briefcase className="h-5 w-5" />
                             </div>
                             <div>
                                 <h3 className="text-lg font-bold">Internal Staff Setup</h3>
                                 <p className="text-sm text-gray-500">Configure employment and system access details.</p>
                             </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-1.5">
                                 <Label className="text-xs font-semibold text-gray-500 uppercase">Department</Label>
                                 <Select value={formData.department} onValueChange={v => setFormData({...formData!, department: v})}>
                                     <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                     <SelectContent>
                                         {["Operations", "HR", "Finance", "Management", "IT"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                     </SelectContent>
                                 </Select>
                             </div>
                              <div className="space-y-1.5">
                                 <Label className="text-xs font-semibold text-gray-500 uppercase">Employment Type</Label>
                                 <Select value={formData.employmentType} onValueChange={v => setFormData({...formData!, employmentType: v as any})}>
                                     <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                     <SelectContent>
                                         <SelectItem value="Full Time">Full Time</SelectItem>
                                         <SelectItem value="Part Time">Part Time</SelectItem>
                                         <SelectItem value="Contract">Contract</SelectItem>
                                     </SelectContent>
                                 </Select>
                             </div>
                             <div className="space-y-1.5">
                                 <Label className="text-xs font-semibold text-gray-500 uppercase">Start Date</Label>
                                 <Input type="date" value={formData.startDate} onChange={e => setFormData({...formData!, startDate: e.target.value})} />
                             </div>
                         </div>
                     </div>

                     <div className="space-y-6 pt-6 border-t">
                         <div className="flex items-center gap-3 border-b pb-4">
                             <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                 <Lock className="h-5 w-5" />
                             </div>
                             <div>
                                 <h3 className="text-lg font-bold">System Access</h3>
                                 <p className="text-sm text-gray-500">Manage dashboard permissions.</p>
                             </div>
                         </div>

                         <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <h4 className="font-semibold text-gray-900">Grant Dashboard Access</h4>
                                     <p className="text-xs text-gray-500">Allow user to log in to the admin panel.</p>
                                 </div>
                                 <div className="flex bg-white rounded-lg border p-1">
                                    <button onClick={() => setFormData({...formData!, systemAccess: true})} className={`px-4 py-1.5 text-xs font-bold rounded ${formData!.systemAccess ? 'bg-blue-100 text-blue-700' : 'text-gray-400'}`}>Yes</button>
                                    <button onClick={() => setFormData({...formData!, systemAccess: false})} className={`px-4 py-1.5 text-xs font-bold rounded ${!formData!.systemAccess ? 'bg-gray-200 text-gray-700' : 'text-gray-400'}`}>No</button>
                                 </div>
                             </div>

                             {formData?.systemAccess && (
                                 <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                                     <div className="space-y-1.5">
                                         <Label className="text-xs font-semibold text-gray-500">System Role</Label>
                                         <Select defaultValue="manager">
                                             <SelectTrigger className="bg-white"><SelectValue placeholder="Select Role" /></SelectTrigger>
                                             <SelectContent>
                                                 <SelectItem value="admin">Administrator</SelectItem>
                                                 <SelectItem value="manager">Manager</SelectItem>
                                                 <SelectItem value="viewer">Viewer</SelectItem>
                                             </SelectContent>
                                         </Select>
                                     </div>
                                 </div>
                             )}
                         </div>
                     </div>

                     <div className="pt-8 flex justify-end gap-4">
                         <Button variant="outline" onClick={() => saveChanges(false)}>Save Draft</Button>
                         <Button onClick={() => saveChanges(true)} className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]">
                             Activate Staff
                         </Button>
                     </div>

                 </div>
             </div>
         </div>
       </div>
    </DashboardLayout>
  );
}
