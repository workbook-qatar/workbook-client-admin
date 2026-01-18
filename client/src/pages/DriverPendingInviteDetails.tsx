
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  ArrowLeft, CheckCircle, ShieldCheck, Mail, Phone, Calendar, 
  MapPin, User, Hash, Flag, Upload, Briefcase, Banknote, ArrowRight, Award, Edit2, Save, Clock, Car, Truck, Trash2, X
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StaffMember } from "./Workforce";

// Helper Functions for Time Grid (Copied for independence)
const formatTimeLabel = (time: string) => {
    const [h] = time.split(':');
    const hour = parseInt(h);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${suffix}`;
};

interface ExtendedStaffMember extends StaffMember {
    nickname?: string;
    qid?: string;
    dob?: string;
    nationality?: string;
    gender?: 'Male' | 'Female';
    department?: string;
    employmentType?: 'Full Time' | 'Part Time' | 'Contract' | 'Temporary';
    startDate?: string;
    salaryType?: 'Fixed Monthly' | 'Commission-Based' | 'Hourly-Rate' | 'Fixed + Commission';
    salaryAmount?: string;
    commissionRate?: string;
    hourlyRate?: string;
    languages?: string[];
    religion?: string;
    maritalStatus?: string;
    skills?: string[];
    serviceArea?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    documents?: { name: string; type: string; status: 'valid' | 'pending'; expiryDate?: string }[];
    // Shift Setup
    shiftSystem?: 'Fixed' | 'Rotational' | 'Flexible';
    workingDays?: string[];
    workHoursStart?: string;
    workHoursEnd?: string;
    rotationalSchedule?: Record<string, { start: string; end: string }[]>;
    // Driver specific (Ensuring these exist in type even if optional)
    assignedVehicle?: string; 
    licenseCategory?: string;
    licenseNumber?: string;
    licenseExpiry?: string;
}

export default function DriverPendingInviteDetails({ initialData }: { initialData: ExtendedStaffMember }) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0); // 0=Employment, 1=Operations, 2=Summary
  const [isEditing, setIsEditing] = useState(true); // Default to true for onboarding flow
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<ExtendedStaffMember>(initialData);

  // Settings Data (Simplified for Driver - reduced fetch needs if possible, but safe to init defaults)
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<string[]>([]);
  const [enabledShiftSystems, setEnabledShiftSystems] = useState<string[]>([]);
  const [activeDayModal, setActiveDayModal] = useState<string | null>(null);

  // Load Settings
  useEffect(() => {
    const storedEmpTypes = localStorage.getItem("vendor_employment_types");
    if (storedEmpTypes) {
        setEmploymentTypeOptions(JSON.parse(storedEmpTypes).filter((e: any) => e.isActive).map((e: any) => e.name));
    } else {
        setEmploymentTypeOptions(["Full Time", "Part Time", "Contract"]);
    }

    const storedShiftConfig = localStorage.getItem("vendor_shift_types_enabled");
    if (storedShiftConfig) {
        const config = JSON.parse(storedShiftConfig);
        const enabled = [];
        if (config.fixed) enabled.push("Fixed");
        if (config.rotational) enabled.push("Rotational");
        if (config.flexible) enabled.push("Flexible");
        setEnabledShiftSystems(enabled);
    } else {
        setEnabledShiftSystems(["Fixed", "Rotational", "Flexible"]);
    }
  }, []);

  const rotationHours = [
      "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
      "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ];

  const saveChanges = (advanceStep = false) => {
      const stored = localStorage.getItem("vendor_staff");
      if (stored) {
          const list = JSON.parse(stored);
          const index = list.findIndex((s: any) => s.id === formData.id);
          if (index !== -1) {
              list[index] = { ...list[index], ...formData };
              localStorage.setItem("vendor_staff", JSON.stringify(list));
              toast.success("Changes saved successfully");
              if (advanceStep) setCurrentStep(prev => prev + 1);
          }
      }
  };

  const handleActivate = () => {
    const stored = localStorage.getItem("vendor_staff");
    if (stored) {
        let list = JSON.parse(stored);
        list = list.map((s: any) => s.id === formData.id ? { ...s, membershipStatus: 'active', employmentStatus: 'Active', status: 'available' } : s);
        localStorage.setItem("vendor_staff", JSON.stringify(list));
        setIsSuccessOpen(true);
    }
  };

  const checkRequirements = () => {
    const d = formData;
    return {
        employment: !!(d.employmentType && d.startDate && d.salaryType),
        operations: !!(d.shiftSystem && d.workingDays?.length && d.licenseNumber && d.licenseCategory && d.licenseExpiry && d.assignedVehicle),
        summary: true
    };
  };

  const reqs = checkRequirements();
  const steps = [
      { id: 'employment', label: 'Employment Info', completed: reqs.employment },
      { id: 'operations', label: 'Operations', completed: reqs.operations },
      { id: 'summary', label: 'Summary & Activation', completed: currentStep === 2 },
  ];
  
  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = (completedCount / steps.length) * 100;

  return (
    <DashboardLayout>
       <div className="space-y-6">
        {/* Nav */}
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/workforce/pending")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Workforce
            </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 animate-in fade-in slide-in-from-bottom-2">
            
            {/* LEFT SIDEBAR */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex flex-col items-center text-center border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
                        <div className="relative mb-4">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                <AvatarImage src={formData.avatar} className="object-cover"/>
                                <AvatarFallback className="text-2xl font-bold bg-gray-100 text-gray-600">
                                    {formData.name.substring(0,2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm border border-gray-200">
                                <Car className="h-3 w-3 text-gray-500" />
                            </div>
                        </div>
                        <h2 className="font-bold text-lg text-gray-900 leading-tight">{formData.name}</h2>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1 uppercase tracking-wide">Driver</span>
                    </div>

                    {/* Details List */}
                    <div className="p-6 space-y-4 text-sm flex-1">
                         <div className="space-y-4">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Hash className="h-4 w-4" />
                                    <span>QID Number</span>
                                </div>
                                <span className="font-medium text-gray-900">{formData.qid}</span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Phone className="h-4 w-4" />
                                    <span>Mobile</span>
                                </div>
                                <span className="font-medium text-gray-900">{formData.phone}</span>
                            </div>
                            
                            {/* License Info Sidebar */}
                            <div className="pt-4 border-t border-gray-100 mt-4 space-y-4">
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <Award className="h-4 w-4" />
                                        <span>License</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{formData.licenseCategory || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>Expiry</span>
                                    </div>
                                    <span className={`font-medium ${new Date(formData.licenseExpiry || '').getTime() < Date.now() ? 'text-red-600' : 'text-green-600'}`}>
                                        {formData.licenseExpiry || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Badge */}
                    <div className="px-6 py-2">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Setup Progress</span>
                            <span className="text-xs font-bold text-blue-600">{progressPercent.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="p-6 pt-2 space-y-2">
                         {steps.map((step, idx) => (
                             <div 
                                key={step.id}
                                onClick={() => setCurrentStep(idx)}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                    currentStep === idx 
                                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                    : 'bg-white border-transparent hover:bg-gray-50'
                                }`}
                             >
                                 <div className={`
                                     h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                                     ${step.completed 
                                         ? 'bg-green-100 text-green-600' 
                                         : currentStep === idx 
                                             ? 'bg-blue-600 text-white' 
                                             : 'bg-gray-100 text-gray-400'}
                                 `}>
                                     {step.completed ? <CheckCircle className="h-3.5 w-3.5" /> : idx + 1}
                                 </div>
                                 <span className={`text-sm font-medium ${currentStep === idx ? 'text-blue-900' : 'text-gray-600'}`}>
                                     {step.label}
                                 </span>
                             </div>
                         ))}
                    </div>

                    <div className="p-4 border-t bg-gray-50 mt-auto text-center text-xs text-gray-400">
                        Complete all steps to activate driver.
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    
                    {/* STEP 0: EMPLOYMENT INFO */}
                    {currentStep === 0 && (
                        <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                             <div className="space-y-6">
                                 <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                     <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Briefcase className="h-4 w-4" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-gray-900">Employment Information</h3>
                                        <p className="text-xs text-gray-500">Contract details for the driver.</p>
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Employment Type <span className="text-red-500">*</span></Label>
                                        <Select disabled={!isEditing} value={formData.employmentType} onValueChange={v => setFormData({...formData, employmentType: v as any})}>
                                            <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm"><SelectValue placeholder="Select Type" /></SelectTrigger>
                                            <SelectContent>
                                                {employmentTypeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Start Date <span className="text-red-500">*</span></Label>
                                        <Input 
                                            type="date" 
                                            disabled={!isEditing} 
                                            value={formData.startDate} 
                                            className="h-11 w-full border-gray-200 hover:border-blue-300 transition-all text-sm"
                                            onChange={e => setFormData({...formData, startDate: e.target.value})} 
                                        />
                                    </div>
                                 </div>
                             </div>

                             {/* Compensation (Simplified for Driver if needed, or same) */}
                             <div className="space-y-6">
                                 <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                     <div className="h-8 w-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                        <Banknote className="h-4 w-4" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-gray-900">Compensation</h3>
                                        <p className="text-xs text-gray-500">Salary structure.</p>
                                     </div>
                                 </div>
                                 <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-6 space-y-6">
                                      <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Salary Scheme <span className="text-red-500">*</span></Label>
                                            <Select disabled={!isEditing} value={formData.salaryType} onValueChange={v => setFormData({...formData, salaryType: v as any})}>
                                                <SelectTrigger className="bg-white w-full h-11 border-gray-200 text-sm"><SelectValue placeholder="Select Salary Type" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Fixed Monthly">Fixed Monthly</SelectItem>
                                                    <SelectItem value="Commission-Based">Commission-Based</SelectItem>
                                                    <SelectItem value="Fixed + Commission">Fixed + Commission</SelectItem>
                                                </SelectContent>
                                            </Select>
                                      </div>
                                      {(formData.salaryType === "Fixed Monthly" || formData.salaryType === "Fixed + Commission") && (
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Monthly Base Salary</Label>
                                                <Input disabled={!isEditing} value={formData.salaryAmount} onChange={e => setFormData({...formData, salaryAmount: e.target.value})} placeholder="0.00" />
                                            </div>
                                      )}
                                 </div>
                             </div>

                             <div className="pt-8 border-t border-gray-100 flex items-center justify-end">
                                 <Button className="h-11 px-8 bg-blue-600 hover:bg-blue-700" onClick={() => saveChanges(true)}>
                                     Next: Operations <ArrowRight className="w-4 h-4 ml-2" />
                                 </Button>
                             </div>
                        </div>
                    )}

                    {/* STEP 1: OPERATIONS (Vehicle, License, Shift) */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                             
                             {/* Vehicle Assignment */}
                             <div className="space-y-6">
                                 <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                     <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                                        <Car className="h-4 w-4" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-gray-900">Vehicle Assignment</h3>
                                        <p className="text-xs text-gray-500">Assign a vehicle.</p>
                                     </div>
                                 </div>
                                 <div className="space-y-1.5">
                                     <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Vehicle <span className="text-red-500">*</span></Label>
                                     <Select disabled={!isEditing} value={formData.assignedVehicle} onValueChange={v => setFormData({...formData, assignedVehicle: v})}>
                                         <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm">
                                            <SelectValue placeholder="Select Vehicle" />
                                         </SelectTrigger>
                                         <SelectContent>
                                            {["Van - Toyota Hiace", "Car - Nissan Sunny", "Van - Nissan Urvan", "Pending Assignment"].map(v => (
                                                <SelectItem key={v} value={v}>
                                                    <div className="flex items-center gap-2">
                                                        <Truck className="h-4 w-4 text-gray-500" />
                                                        {v}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                         </SelectContent>
                                     </Select>
                                 </div>
                             </div>

                             {/* License & Compliance */}
                             <div className="space-y-6">
                                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                    <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <div>
                                    <h3 className="text-lg font-bold text-gray-900">License & Compliance</h3>
                                    <p className="text-xs text-gray-500">Manage driving license details.</p>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold uppercase text-gray-500">License Number</Label>
                                            <Input disabled={!isEditing} value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold uppercase text-gray-500">Category</Label>
                                            <Input disabled={!isEditing} value={formData.licenseCategory} onChange={e => setFormData({...formData, licenseCategory: e.target.value})} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold uppercase text-gray-500">Expiry Date</Label>
                                            <Input type="date" disabled={!isEditing} value={formData.licenseExpiry} onChange={e => setFormData({...formData, licenseExpiry: e.target.value})} />
                                        </div>
                                    </div>
                                    {/* Docs - Simplified Mock */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        {['License Front', 'License Back'].map(docName => {
                                            const existing = formData.documents?.find(d => d.name === docName);
                                            return (
                                                <div key={docName} className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-gray-50">
                                                    {existing ? (
                                                        <>
                                                            <CheckCircle className="h-8 w-8 text-green-500" />
                                                            <span className="text-sm font-medium text-gray-900">{docName} Uploaded</span>
                                                            {isEditing && <Button variant="link" className="text-red-500 h-auto p-0 text-xs" onClick={() => {
                                                                const newDocs = formData.documents?.filter(d => d.name !== docName) || [];
                                                                setFormData({...formData, documents: newDocs});
                                                            }}>Remove</Button>}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-8 w-8 text-gray-300" />
                                                            <span className="text-sm font-medium text-gray-500">Upload {docName}</span>
                                                            <Button size="sm" variant="secondary" className="mt-2" onClick={() => {
                                                                const newDoc = { name: docName, type: 'License', status: 'valid' as const, expiryDate: formData.licenseExpiry };
                                                                setFormData({...formData, documents: [...(formData.documents || []), newDoc]});
                                                                toast.success(`${docName} uploaded`);
                                                            }} disabled={!isEditing}>Choose File</Button>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                             </div>

                             {/* Shift Config */}
                             <div className="space-y-6">
                                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                    <div className="h-8 w-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Shift Configuration</h3>
                                        <p className="text-xs text-gray-500">Working hours and days.</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-3">
                                        {enabledShiftSystems.includes("Fixed") && (
                                            <div onClick={() => isEditing && setFormData({...formData, shiftSystem: 'Fixed'})}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    formData.shiftSystem === 'Fixed' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
                                                }`}>
                                                <div className="font-bold text-sm text-gray-900 mb-1">Fixed Schedule</div>
                                            </div>
                                        )}
                                        {enabledShiftSystems.includes("Rotational") && (
                                            <div onClick={() => isEditing && setFormData({...formData, shiftSystem: 'Rotational'})}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    formData.shiftSystem === 'Rotational' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
                                                }`}>
                                                <div className="font-bold text-sm text-gray-900 mb-1">Rotational</div>
                                            </div>
                                        )}
                                    </div>
                                    {formData.shiftSystem === 'Fixed' && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-semibold uppercase text-gray-500">Start Time</Label>
                                                    <Select disabled={!isEditing} value={formData.workHoursStart} onValueChange={v => setFormData({...formData, workHoursStart: v})}>
                                                        <SelectTrigger className="bg-white"><SelectValue/></SelectTrigger>
                                                        <SelectContent>{rotationHours.map(h => <SelectItem key={h} value={h}>{formatTimeLabel(h)}</SelectItem>)}</SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-semibold uppercase text-gray-500">End Time</Label>
                                                    <Select disabled={!isEditing} value={formData.workHoursEnd} onValueChange={v => setFormData({...formData, workHoursEnd: v})}>
                                                        <SelectTrigger className="bg-white"><SelectValue/></SelectTrigger>
                                                        <SelectContent>{rotationHours.map(h => <SelectItem key={h} value={h}>{formatTimeLabel(h)}</SelectItem>)}</SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                 <Label className="text-xs font-semibold uppercase text-gray-500 block mb-3">Working Days</Label>
                                                 <div className="flex flex-wrap gap-2">
                                                     {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => {
                                                         const isSelected = formData.workingDays?.includes(day);
                                                         return (
                                                             <div key={day} onClick={() => {
                                                                 if (!isEditing) return;
                                                                 const current = formData.workingDays || [];
                                                                 const newDays = isSelected ? current.filter(d => d !== day) : [...current, day];
                                                                 setFormData({...formData, workingDays: newDays});
                                                             }} className={`h-10 w-10 flex items-center justify-center rounded-lg border text-sm font-bold cursor-pointer transition-all ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}>
                                                                 {day}
                                                             </div>
                                                         );
                                                     })}
                                                 </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                             </div>
                             
                             <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                 <Button variant="outline" onClick={() => setCurrentStep(0)} className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50">Back</Button>
                                 <Button className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm" onClick={() => saveChanges(true)}>
                                     Next: Summary & Activation <ArrowRight className="w-4 h-4 ml-2" />
                                 </Button>
                             </div>
                        </div>
                    )}

                    {/* STEP 2: SUMMARY */}
                    {currentStep === 2 && (
                        <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                             <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-8 text-center space-y-6">
                                 <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 ring-4 ring-green-50">
                                     <CheckCircle className="h-10 w-10" />
                                 </div>
                                 <h2 className="text-2xl font-bold text-gray-900">Ready for Activation</h2>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                     <div>
                                         <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Role</span>
                                         <div className="font-semibold">Driver</div>
                                     </div>
                                     <div>
                                         <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Vehicle</span>
                                         <div className="font-semibold text-gray-900">{formData.assignedVehicle}</div>
                                     </div>
                                     <div>
                                         <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">License</span>
                                         <div className="font-semibold text-gray-900">{formData.licenseNumber}</div>
                                     </div>
                                     <div>
                                         <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Start Date</span>
                                         <div className="font-semibold">{formData.startDate}</div>
                                     </div>
                                 </div>
                                 <div className="flex items-center justify-center gap-4 pt-4">
                                     <Button variant="outline" className="h-12 w-32 border-gray-200" onClick={() => setCurrentStep(1)}>back</Button>
                                     <Button onClick={handleActivate} disabled={!reqs.operations || !reqs.employment} className="h-12 w-48 bg-green-600 hover:bg-green-700 shadow-lg text-base">
                                          Activate Driver
                                     </Button>
                                 </div>
                             </div>
                        </div>
                    )}

                </div>
            </div>
        </div>

        {/* Success Modal */}
        {isSuccessOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6 border border-green-100">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Driver Activated!</h2>
                    <Button className="h-12 bg-blue-600 hover:bg-blue-700 w-full" onClick={() => setLocation("/workforce")}>
                        Go to List <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        )}
       </div>
    </DashboardLayout>
  );
}
