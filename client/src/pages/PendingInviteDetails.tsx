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
  MapPin, Wrench, FileText, User, Hash, Flag, Globe, Upload, Trash2, X, Plus, AlertCircle, Briefcase, Banknote, ArrowRight, Award, Edit2, Save, Clock, Truck 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { StaffMember } from "./Workforce";
import DriverPendingInviteDetails from "./DriverPendingInviteDetails";

// Helper Functions for Time Grid
const formatTimeLabel = (time: string) => {
    const [h] = time.split(':');
    const hour = parseInt(h);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${suffix}`;
};

const isHourActive = (current: string, start: string, end: string) => {
    return current >= start && current < end;
};

const incrementHour = (time: string) => {
    const [h] = time.split(':');
    let hour = parseInt(h) + 1;
    return `${hour.toString().padStart(2, '0')}:00`;
};

const decrementHour = (time: string) => {
    const [h] = time.split(':');
    let hour = parseInt(h) - 1;
    return `${hour.toString().padStart(2, '0')}:00`;
};

// Extended interface for local usage
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
    // Transport
    transportationType?: string;
    primaryTransport?: string; // For Hybrid
    transportVaries?: boolean; // For Hybrid
    // Driver specific / Transport Logic
    assignedVehicle?: string; 
    vehicleType?: string; // For Self
    plateNumber?: string; // For Self
    licenseCategory?: string;
    licenseNumber?: string;
    licenseExpiry?: string;
    // Operations
    serviceScope?: 'all' | 'specific';
    serviceAreas?: string[];
}

const MOCK_SERVICE_AREAS = [
    { id: "sa-1", name: "Doha Central" },
    { id: "sa-2", name: "West Bay" },
    { id: "sa-3", name: "The Pearl" },
    { id: "sa-4", name: "Al Rayyan" },
    { id: "sa-5", name: "Al Wakrah" },
    { id: "sa-6", name: "Lusail" },
];

const MOCK_COMPANY_VEHICLES = [
    { id: "v1", name: "Toyota HiAce - V001" },
    { id: "v2", name: "Nissan Urvan - V002" },
    { id: "v3", name: "Mitsubishi Canter - T001" },
];

export default function PendingInviteDetails() {
  const [, params] = useRoute("/workforce/pending/:id");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0); // 0=Employment, 1=Ops&Skills, 2=Summary
  const [isEditing, setIsEditing] = useState(false);
  
  // Cert Form State (To be removed/ignored in new flow, but keeping for safety for now)
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [tempCert, setTempCert] = useState({ name: "", expiry: "" });
  
  // "Committed" Data (Display)
  const [data, setData] = useState<ExtendedStaffMember | null>(null);
  
  // "Draft" Data (Form)
  const [formData, setFormData] = useState<ExtendedStaffMember | null>(null);
  
  // Basic Info Edit Components
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
  const [basicInfoForm, setBasicInfoForm] = useState<{
      nickname: string;
      mobile: string;
      email: string;
      gender: 'Male' | 'Female';
      avatar?: string;
  } | null>(null);

  // Initialize basic info form when opening modal
  useEffect(() => {
      if (isBasicInfoOpen && data) {
          setBasicInfoForm({
              nickname: data.nickname || "",
              mobile: data.phone || "",
              email: data.email || "",
              gender: data.gender || "Male",
              avatar: data.avatar
          });
      }
  }, [isBasicInfoOpen, data]);

  const [activeDayModal, setActiveDayModal] = useState<string | null>(null);
  
  // Settings Data
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [positionOptions, setPositionOptions] = useState<string[]>([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<string[]>([]);
  const [transportationConfigs, setTransportationConfigs] = useState<any[]>([]); // Store full config objects
  const [serviceAreaConfigs, setServiceAreaConfigs] = useState<any[]>(MOCK_SERVICE_AREAS); // Default to mocks
  const [enabledShiftSystems, setEnabledShiftSystems] = useState<string[]>([]);
  const [shiftTemplateOptions, setShiftTemplateOptions] = useState<any[]>([]);

  // Load Data
  useEffect(() => {
    // 1. Load Skills
    const storedSkills = localStorage.getItem("vendor_skills");
    if (storedSkills) {
        setAvailableSkills(JSON.parse(storedSkills));
    } else {
        setAvailableSkills([
             { name: "HVAC Repair", requiresCert: true, certName: "HVAC Technician Certificate" },
             { name: "Electrical", requiresCert: true, certName: "Electrician Certification" },
             { name: "Plumbing", requiresCert: true, certName: "Plumbing License" },
             { name: "Deep Cleaning", requiresCert: false },
             { name: "Carpentry", requiresCert: false },
             { name: "Beautician", requiresCert: true, certName: "Cosmetology License" }
        ]);
    }

    // 2. Load Organization & Employment Settings
    const storedDepts = localStorage.getItem("vendor_departments");
    if (storedDepts) {
        setDepartmentOptions(JSON.parse(storedDepts).map((d: any) => d.name));
    } else {
        setDepartmentOptions(["Operations", "Maintenance", "Sales", "HR", "Logistics"]);
    }

    const storedJobs = localStorage.getItem("vendor_job_titles");
    if (storedJobs) {
        setPositionOptions(JSON.parse(storedJobs).map((j: any) => j.title));
    } else {
        setPositionOptions(["AC Technician", "Electrician", "Plumber", "Cleaner", "Supervisor", "Driver"]);
    }

    const storedEmpTypes = localStorage.getItem("vendor_employment_types");
    if (storedEmpTypes) {
        setEmploymentTypeOptions(JSON.parse(storedEmpTypes).filter((e: any) => e.isActive).map((e: any) => e.name));
    } else {
        setEmploymentTypeOptions(["Full Time", "Part Time", "Contract"]);
    }

    const storedTransport = localStorage.getItem("vendor_transportation_types");
    const NEW_TRANSPORT_DEFAULTS = [
      { id: "tt1", name: "Company Provides Transportation (With Driver)", description: "Staff will be transported by company driver/route", status: "active", category: "company_driver" },
      { id: "tt2", name: "Company Provides Vehicle (Staff Drives)", description: "Company assigned vehicle (Car/Van)", status: "active", category: "company_vehicle" },
      { id: "tt3", name: "Self – Own Vehicle", description: "Employee uses personal vehicle", status: "active", category: "self_vehicle" },
      { id: "tt4", name: "Public / Ride Transport", description: "Staff uses taxi/uber/public transport", status: "active", category: "public" },
      { id: "tt5", name: "Hybrid / Flexible", description: "Varies by shift/day", status: "active", category: "hybrid" },
    ];

    if (storedTransport) {
        let loaded = JSON.parse(storedTransport);
        // FORCE MIGRATION: Check if using old names
        if (loaded.some((t: any) => t.name === "Company-Provided Transportation" || t.name === "Company Vehicle (Self Drive)")) {
            loaded = NEW_TRANSPORT_DEFAULTS;
            localStorage.setItem("vendor_transportation_types", JSON.stringify(loaded));
        }
        setTransportationConfigs(loaded.filter((t: any) => t.status === 'active'));
    } else {
        setTransportationConfigs(NEW_TRANSPORT_DEFAULTS);
        localStorage.setItem("vendor_transportation_types", JSON.stringify(NEW_TRANSPORT_DEFAULTS));
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

    const storedTemplates = localStorage.getItem("vendor_shift_templates");
    if (storedTemplates) {
        setShiftTemplateOptions(JSON.parse(storedTemplates));
    }

    const storedAreas = localStorage.getItem("vendor_service_areas");
    if (storedAreas) {
        const areas = JSON.parse(storedAreas);
        if (areas.length > 0) setServiceAreaConfigs(areas);
    }


    const stored = localStorage.getItem("vendor_staff");
    if (stored && params?.id) {
        const list = JSON.parse(stored);
        const found = list.find((s: any) => s.id === params.id || s.id === parseInt(params.id));
        if (found) {
            // Mock Data Enrichment if missing
            const initialized: ExtendedStaffMember = { 
                ...found, 
                nickname: found.nickname || "N/A",
                qid: found.qid || "28535638494",
                dob: found.dob || "1995-04-12",
                nationality: found.nationality || "Qatar",
                gender: found.gender || "Male",
                department: found.department || "Operations",
                employmentType: found.employmentType || "Full Time",
                startDate: found.startDate || new Date().toISOString().split('T')[0],
                salaryType: found.salaryType || "Fixed Monthly",
                salaryAmount: found.salaryAmount || "3500",
                commissionRate: found.commissionRate || "",
                hourlyRate: found.hourlyRate || "",
                languages: [],
                religion: "",
                maritalStatus: "",
                emergencyPhone: "",
                skills: [], 
                documents: found.documents || [],
                shiftSystem: "Fixed",
                workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                workHoursStart: "08:00",
                workHoursEnd: "17:00",
                rotationalSchedule: {},
                transportationType: found.transportationType || "",
                assignedVehicle: found.assignedVehicle || "",
                vehicleType: found.vehicleType || "",
                plateNumber: found.plateNumber || "",
                primaryTransport: found.primaryTransport || "",
                transportVaries: found.transportVaries || false,
                licenseCategory: found.licenseCategory || "",
                licenseNumber: found.licenseNumber || "",
                licenseExpiry: found.licenseExpiry || "",
                serviceScope: found.serviceScope || "all", // Default to 'all'
                serviceAreas: found.serviceAreas || []
            };
            
            // Check for Default Business Hours override if new/empty
            const storedBizHours = localStorage.getItem("vendor_business_hours");
            if (storedBizHours && (!found.workHoursStart || found.workHoursStart === "08:00")) {
                 const biz = JSON.parse(storedBizHours);
                 initialized.workHoursStart = biz.start;
                 initialized.workHoursEnd = biz.end;
            }

            setData(initialized);
            setFormData(initialized);
            // Auto-enter edit mode for onboarding review if data is "fresh"
            setIsEditing(true); 
        }
    }
  }, [params?.id]);

  if (!data || !formData) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  if (data.role === 'Driver') {
      return <DriverPendingInviteDetails initialData={data} />;
  }

  // --- Logic Helpers ---
  const handleEditToggle = () => {
      if (isEditing) {
          setFormData(data); // Revert
          setIsEditing(false);
          setIsAddingCert(false);
      } else {
          setFormData(data); // Sync
          setIsEditing(true);
      }
  };

  const saveChanges = (advanceStep = false) => {
      const stored = localStorage.getItem("vendor_staff");
      if (stored) {
          const list = JSON.parse(stored);
          const index = list.findIndex((s: any) => s.id === data.id);
          if (index !== -1 && formData) {
              list[index] = { ...list[index], ...formData };
              localStorage.setItem("vendor_staff", JSON.stringify(list));
              setData(formData);
              toast.success("Changes saved successfully");
              if (advanceStep) setCurrentStep(prev => prev + 1);
          }
      }
  };

  const handleSaveBasicInfo = () => {
        if (!basicInfoForm || !data) return;
        
        const updatedData = {
            ...data,
            nickname: basicInfoForm.nickname,
            phone: basicInfoForm.mobile,
            email: basicInfoForm.email,
            gender: basicInfoForm.gender,
            avatar: basicInfoForm.avatar || data.avatar
        };

        const stored = localStorage.getItem("vendor_staff");
        if (stored) {
            const list = JSON.parse(stored);
            const index = list.findIndex((s: any) => s.id === data.id);
            if (index !== -1) {
                list[index] = updatedData;
                localStorage.setItem("vendor_staff", JSON.stringify(list));
                setData(updatedData as ExtendedStaffMember);
                // Also update local formData to reflect changes immediately
                setFormData(prev => prev ? { ...prev, ...updatedData } : null);
                setIsBasicInfoOpen(false);
                toast.success("Basic Info updated successfully");
            }
        }
    };

  const handleAddCert = () => {
      if (!formData) return; // Basic check
      if (!tempCert.name) {
          toast.error("Certificate name is required");
          return;
      }
      const newDoc = { 
          name: tempCert.name, 
          type: "Certificate", 
          status: 'valid' as const,
          expiryDate: tempCert.expiry 
      };
      setFormData({ ...formData, documents: [...(formData.documents || []), newDoc] });
      setTempCert({ name: "", expiry: "" });
      setIsAddingCert(false);
      toast.success("Certificate added");
  };

  // Check Requirements matching the new 3 Steps
  const checkRequirements = () => {
    const d = data;
    const opsValid = d.serviceScope === 'all' || (d.serviceScope === 'specific' && (d.serviceAreas?.length || 0) > 0);

    return {
        employment: !!(d.role && d.department && d.employmentType && d.startDate && d.salaryType),
        skills: (d.skills?.length || 0) > 0 && !!d.transportationType && opsValid, 
        summary: true // Summary is always viewed
    };
  };

  const reqs = checkRequirements();
  const steps = [
      { id: 'employment', label: 'Employment Details', completed: reqs.employment },
      { id: 'ops', label: 'Operations & Skills', completed: reqs.skills },
      { id: 'summary', label: 'Summary & Activation', completed: currentStep === 2 },
  ];
  
  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = (completedCount / steps.length) * 100;
  const canActivate = progressPercent === 100;

  const handleActivate = () => {
    const stored = localStorage.getItem("vendor_staff");
    if (stored) {
        let list = JSON.parse(stored);
        list = list.map((s: any) => s.id === data.id ? { ...s, membershipStatus: 'active', employmentStatus: 'Active', status: 'available' } : s);
        localStorage.setItem("vendor_staff", JSON.stringify(list));
        
        // Show success
        setIsSuccessOpen(true);
    }
  };

  // Handlers for Right Panel Logic (Skills/Docs)
  const handleAddSkill = (skill: string) => {
      if (!formData) return;
      if (!formData.skills?.includes(skill)) {
          setFormData({ ...formData, skills: [...(formData.skills || []), skill] });
      }
  };
  const handleRemoveSkill = (skill: string) => {
      if (!formData) return;
      setFormData({ ...formData, skills: formData.skills?.filter(s => s !== skill) });
  };
  const handleMockUpload = () => {
      if (!formData) return;
      const newDoc = { name: "Uploaded Document.pdf", type: "General", status: 'valid' as const };
      setFormData({ ...formData, documents: [...(formData.documents || []), newDoc] });
      toast.success("Document uploaded (mock)");
  };

  const serviceAreas = ["Doha Central", "West Bay", "The Pearl", "Al Rayyan", "Al Wakrah"];
  
  const rotationHours = [
      "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
      "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ];
  const rotationDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Ordered as per design req if needed

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Nav */}
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/workforce/pending")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Workforce
            </Button>
        </div>

        {/* Split View */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 animate-in fade-in slide-in-from-bottom-2">
            
            {/* LEFT SIDEBAR - PROFILE DETAILS */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                    
                    {/* Header: Photo & Name */}
                    <div className="p-6 flex flex-col items-center text-center border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50 relative">
                        {/* Edit Action */}
                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-white/80 transition-all rounded-full" onClick={() => setIsBasicInfoOpen(true)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="relative mb-4">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                <AvatarImage src={data.avatar} className="object-cover"/>
                                <AvatarFallback className="text-2xl font-bold bg-gray-100 text-gray-600">
                                    {data.name.substring(0,2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm border border-gray-200">
                                <User className="h-3 w-3 text-gray-500" />
                            </div>
                        </div>
                        <h2 className="font-bold text-lg text-gray-900 leading-tight">{data.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{data.nickname || 'No Nickname'}</p>
                    </div>

                    {/* Profile Details List */}
                    <div className="p-6 space-y-4 text-sm flex-1">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Hash className="h-4 w-4" />
                                    <span>QID Number</span>
                                </div>
                                <span className="font-medium text-gray-900">{data.qid}</span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>Date of Birth</span>
                                </div>
                                <span className="font-medium text-gray-900">{data.dob}</span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Flag className="h-4 w-4" />
                                    <span>Nationality</span>
                                </div>
                                <span className="font-medium text-gray-900">{data.nationality}</span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <User className="h-4 w-4" />
                                    <span>Gender</span>
                                </div>
                                <span className="font-medium text-gray-900">{data.gender}</span>
                            </div>
                             <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Phone className="h-4 w-4" />
                                    <span>Mobile</span>
                                </div>
                                <span className="font-medium text-gray-900">{data.phone}</span>
                            </div>
                             <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Mail className="h-4 w-4" />
                                    <span>Email</span>
                                </div>
                                <span className="font-medium text-gray-900 truncate max-w-[120px]" title={data.email}>{data.email}</span>
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

                    {/* Next Steps List */}
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

                     {/* Footer Action - Removed Activate Button from Sidebar */}
                     <div className="p-4 border-t bg-gray-50 mt-auto text-center text-xs text-gray-400">
                        Complete all steps to activate.
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - WIZARD CONTENT */}
            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                     
                     {/* 1. EMPLOYMENT DETAILS */}
                     {currentStep === 0 && (
                         <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                             
                             {/* Section: Role Information */}
                             <div className="space-y-6">
                                 <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                     <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Briefcase className="h-4 w-4" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-gray-900">Role Information</h3>
                                        <p className="text-xs text-gray-500">Define the position and departmental placement.</p>
                                     </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Position <span className="text-red-500">*</span></Label>
                                        <Select disabled={!isEditing} value={formData.role} onValueChange={v => setFormData({...formData, role: v})}>
                                            <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm"><SelectValue placeholder="Select Position" /></SelectTrigger>
                                            <SelectContent>
                                                {positionOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Department <span className="text-red-500">*</span></Label>
                                        <Select disabled={!isEditing} value={formData.department} onValueChange={v => setFormData({...formData, department: v})}>
                                            <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm"><SelectValue placeholder="Select Department" /></SelectTrigger>
                                            <SelectContent>
                                                {departmentOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
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

                             {/* Section: Compensation */}
                             <div className="space-y-6">
                                 <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                     <div className="h-8 w-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                        <Banknote className="h-4 w-4" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-gray-900">Compensation Package</h3>
                                        <p className="text-xs text-gray-500">Configure salary structure and payment terms.</p>
                                     </div>
                                 </div>

                                 <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-6 space-y-6">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                         <div className="space-y-1.5 md:col-span-2">
                                            <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Salary Scheme <span className="text-red-500">*</span></Label>
                                            <Select disabled={!isEditing} value={formData.salaryType} onValueChange={v => setFormData({...formData, salaryType: v as any})}>
                                                <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm shadow-sm"><SelectValue placeholder="Select Salary Type" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Fixed Monthly">Fixed Monthly</SelectItem>
                                                    <SelectItem value="Commission-Based">Commission-Based</SelectItem>
                                                    <SelectItem value="Hourly-Rate">Hourly-Rate</SelectItem>
                                                    <SelectItem value="Fixed + Commission">Fixed + Commission</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[11px] text-gray-500 pt-1">
                                                {formData.salaryType === 'Fixed Monthly' && "Staff receives a consistent monthly salary regardless of jobs completed."}
                                                {formData.salaryType === 'Commission-Based' && "Earnings are calculated as a percentage of the revenue from completed jobs."}
                                                {formData.salaryType === 'Hourly-Rate' && "Pay is calculated based on the total number of clocked working hours."}
                                                {formData.salaryType === 'Fixed + Commission' && "Staff receives a basic monthly salary plus a commission bonus per job."}
                                            </p>
                                         </div>

                                         {(formData.salaryType === "Fixed Monthly" || formData.salaryType === "Fixed + Commission") && (
                                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Monthly Base Salary <span className="text-red-500">*</span></Label>
                                                <div className="relative group">
                                                     <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-100 border-r border-gray-200 rounded-l-md flex items-center justify-center text-gray-500 text-xs font-bold group-hover:bg-gray-200 transition-colors">
                                                        QAR
                                                     </div>
                                                     <Input 
                                                        disabled={!isEditing} 
                                                        value={formData.salaryAmount} 
                                                        onChange={e => setFormData({...formData, salaryAmount: e.target.value})} 
                                                        placeholder="0.00" 
                                                        className="h-11 w-full pl-14 border-gray-200 bg-white hover:border-blue-300 transition-all text-sm font-medium shadow-sm" 
                                                     />
                                                </div>
                                            </div>
                                         )}

                                          {(formData.salaryType === "Commission-Based" || formData.salaryType === "Fixed + Commission") && (
                                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Commission Rate <span className="text-red-500">*</span></Label>
                                                <div className="relative group">
                                                     <Input 
                                                        disabled={!isEditing} 
                                                        value={formData.commissionRate} 
                                                        onChange={e => setFormData({...formData, commissionRate: e.target.value})} 
                                                        placeholder="0" 
                                                        className="h-11 w-full pr-10 border-gray-200 bg-white hover:border-blue-300 transition-all text-sm font-medium shadow-sm" 
                                                     />
                                                     <div className="absolute right-3 top-3.5 text-gray-400 text-sm font-bold">%</div>
                                                </div>
                                            </div>
                                         )}

                                         {formData.salaryType === "Hourly-Rate" && (
                                             <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Hourly Rate <span className="text-red-500">*</span></Label>
                                                <div className="relative group">
                                                     <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-100 border-r border-gray-200 rounded-l-md flex items-center justify-center text-gray-500 text-xs font-bold group-hover:bg-gray-200 transition-colors">
                                                        QAR
                                                     </div>
                                                     <Input 
                                                        disabled={!isEditing} 
                                                        value={formData.hourlyRate} 
                                                        onChange={e => setFormData({...formData, hourlyRate: e.target.value})} 
                                                        placeholder="0.00" 
                                                        className="h-11 w-full pl-14 border-gray-200 bg-white hover:border-blue-300 transition-all text-sm font-medium shadow-sm" 
                                                     />
                                                     <div className="absolute right-3 top-3.5 text-gray-400 text-xs font-medium">/ hour</div>
                                                </div>
                                            </div>
                                         )}
                                     </div>
                                 </div>
                             </div>

                             <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                 <Button variant="outline" onClick={() => setLocation("/workforce/pending")} className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50">
                                     Cancel
                                 </Button>
                                 <Button className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all" onClick={() => saveChanges(true)}>
                                     Next: Operations & Skills <ArrowRight className="w-4 h-4 ml-2" />
                                 </Button>
                             </div>
                         </div>
                     )}

                     {/* 2. SKILLS & QUALIFICATIONS */}
                     {currentStep === 1 && (
                         <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                             
                             {/* Section: Professional Profile */}
                             <div className="space-y-6">
                                 <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                     <div className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                                        <Briefcase className="h-4 w-4" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-gray-900">Professional Profile</h3>
                                        <p className="text-xs text-gray-500">Skills, languages, and work capabilities.</p>
                                     </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                     
                                     {/* Languages Multi-Select */}
                                     {/* Toggle Logic implemented: Select again to remove */}
                                     <div className="space-y-3">
                                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Languages <span className="text-red-500">*</span></Label>
                                        <Select 
                                            disabled={!isEditing} 
                                            value="" 
                                            onValueChange={(val) => {
                                                const current = formData.languages || [];
                                                if (current.includes(val)) {
                                                    setFormData({...formData, languages: current.filter(l => l !== val)});
                                                } else {
                                                    setFormData({...formData, languages: [...current, val]});
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm">
                                                <SelectValue placeholder="Select languages..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["English", "Arabic", "Hindi", "Urdu", "Tagalog", "Bengali", "Malayalam"].map(l => (
                                                    <SelectItem key={l} value={l}>
                                                        <div className="flex items-center gap-2">
                                                            {formData.languages?.includes(l) && <CheckCircle className="h-4 w-4 text-blue-600" />}
                                                            {l}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        
                                        <div className="flex flex-wrap gap-2 min-h-[40px] content-start">
                                            {formData.languages?.map(lang => (
                                                <Badge key={lang} variant="secondary" className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-1.5 px-3 gap-2 transition-all border border-purple-100">
                                                    {lang}
                                                    {isEditing && (
                                                        <X 
                                                            className="h-3.5 w-3.5 text-purple-400 hover:text-red-600 cursor-pointer" 
                                                            onClick={() => formData && setFormData({...formData, languages: formData.languages?.filter(l => l !== lang)})}
                                                        />
                                                    )}
                                                </Badge>
                                            ))}
                                            {(!formData.languages || formData.languages.length === 0) && (
                                                <span className="text-sm text-gray-400 italic pt-1">No languages selected</span>
                                            )}
                                        </div>
                                     </div>

                                     {/* Skills Multi-Select - Aligned to Column 2 */}
                                     <div className="space-y-3">
                                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Skills & Expertise <span className="text-red-500">*</span></Label>
                                        <Select 
                                            disabled={!isEditing} 
                                            value=""
                                            onValueChange={(val) => {
                                                const current = formData.skills || [];
                                                if (current.includes(val)) {
                                                    setFormData({...formData, skills: current.filter(s => s !== val)});
                                                } else {
                                                    setFormData({...formData, skills: [...current, val]});
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm">
                                                <SelectValue placeholder="Select skills..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSkills.map((s: any) => (
                                                    <SelectItem key={s.name} value={s.name}>
                                                        <div className="flex items-center gap-2">
                                                            {formData.skills?.includes(s.name) && <CheckCircle className="h-4 w-4 text-blue-600" />}
                                                            {s.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        
                                        <div className="flex flex-wrap gap-2 min-h-[40px] content-start bg-gray-50/50 p-2 rounded-lg border border-gray-100 border-dashed">
                                            {formData.skills?.map(skill => (
                                                <Badge key={skill} className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-1.5 px-3 gap-2 font-medium shadow-sm transition-all">
                                                    {skill}
                                                    {isEditing && (
                                                        <X 
                                                            className="h-3.5 w-3.5 text-gray-400 hover:text-red-500 cursor-pointer" 
                                                            onClick={() => formData && setFormData({...formData, skills: formData.skills?.filter(s => s !== skill)})}
                                                        />
                                                    )}
                                                </Badge>
                                            ))}
                                            {(!formData.skills || formData.skills.length === 0) && (
                                                <span className="text-sm text-gray-400 italic pt-1">No skills selected</span>
                                            )}
                                        </div>
                                     </div>

                                     {/* MANDATORY CERTIFICATES LOGIC */}
                                    {formData.skills?.filter(skill => {
                                        const skillConfig = availableSkills.find(s => s.name === skill);
                                        return skillConfig?.requiresCert;
                                    }).length > 0 && (
                                        <div className="md:col-span-2 pt-6 mt-2 border-t border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-1">
                                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4 text-orange-600" />
                                                Required Certifications
                                            </h4>
                                            
                                            <div className="grid grid-cols-1 gap-4">
                                                {formData.skills
                                                    ?.filter(skill => {
                                                        const skillConfig = availableSkills.find(s => s.name === skill);
                                                        return skillConfig?.requiresCert;
                                                    })
                                                    .map(skill => {
                                                        const skillConfig = availableSkills.find(s => s.name === skill);
                                                        const reqCertName = skillConfig?.certName || `${skill} Certificate`;
                                                        const existingDoc = formData.documents?.find(d => d.name === reqCertName);
                                                        
                                                        return (
                                                            <div key={skill} className="bg-orange-50/40 border border-orange-100 rounded-xl p-5 transition-all hover:bg-orange-50/70">
                                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                                                    <div>
                                                                        <h5 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                                            {reqCertName}
                                                                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 py-0 border-orange-200 text-orange-700 bg-white">
                                                                                Required
                                                                            </Badge>
                                                                        </h5>
                                                                        <p className="text-xs text-gray-500 mt-0.5">Mandatory documentation for <b>{skill}</b> authorization.</p>
                                                                    </div>
                                                                    {existingDoc ? (
                                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1 pl-1.5 whitespace-nowrap">
                                                                            <CheckCircle className="h-3 w-3" />
                                                                            Uploaded
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-white whitespace-nowrap">
                                                                            Pending Upload
                                                                        </Badge>
                                                                    )}
                                                                </div>

                                                                {existingDoc ? (
                                                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                                            <div className="h-9 w-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                                <FileText className="h-4 w-4" />
                                                                            </div>
                                                                            <div className="min-w-0">
                                                                                <div className="font-medium text-gray-900 text-sm truncate">{existingDoc.name}</div>
                                                                                <div className="text-xs text-gray-500">Expires: {existingDoc.expiryDate || 'No Expiry'}</div>
                                                                            </div>
                                                                        </div>
                                                                        {isEditing && (
                                                                           <Button 
                                                                                size="icon" 
                                                                                variant="ghost" 
                                                                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                                                onClick={() => {
                                                                                    const newDocs = formData.documents?.filter(d => d.name !== reqCertName) || [];
                                                                                    setFormData({ ...formData, documents: newDocs }); 
                                                                                }}
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    // Upload Form
                                                                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                                                                        <div className="w-full space-y-1.5">
                                                                            <Label className="text-xs font-semibold text-gray-500">Document File</Label>
                                                                            <div className="relative">
                                                                                <Input 
                                                                                    disabled={!isEditing} 
                                                                                    type="file" 
                                                                                    className="text-xs file:text-xs file:font-medium file:text-blue-600 file:bg-blue-50 file:border-0 file:mr-3 file:px-2 file:py-1 file:rounded-md h-10 w-full bg-white border-gray-200 hover:border-blue-300 transition-all" 
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                       {skillConfig?.certExpiry && (
                                                                           <div className="w-full lg:w-48 space-y-1.5">
                                                                                <Label className="text-xs font-semibold text-gray-500">Expiry Date</Label>
                                                                                <div className="relative">
                                                                                    <Input 
                                                                                        disabled={!isEditing} 
                                                                                        type="date" 
                                                                                        className="h-10 w-full bg-white border-gray-200 text-xs font-medium hover:border-blue-300 transition-all" 
                                                                                        onChange={(e) => {
                                                                                            if (e.target.value) {
                                                                                                // Auto-save on date selection for UX flow
                                                                                                const newDoc = { 
                                                                                                    name: reqCertName, 
                                                                                                    type: "Certificate", 
                                                                                                    status: 'valid' as const, 
                                                                                                    expiryDate: e.target.value 
                                                                                                };
                                                                                                setFormData({ ...formData, documents: [...(formData.documents || []), newDoc] });
                                                                                                toast.success(`${reqCertName} details saved`);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                       )}
                                                                       {!skillConfig?.certExpiry && (
                                                                            <div className="w-full lg:w-48">
                                                                                 <Button 
                                                                                    disabled={!isEditing}
                                                                                    className="w-full h-10 bg-blue-600 hover:bg-blue-700"
                                                                                    onClick={() => {
                                                                                        const newDoc = { 
                                                                                            name: reqCertName, 
                                                                                            type: "Certificate", 
                                                                                            status: 'valid' as const,
                                                                                            expiryDate: "N/A"
                                                                                        };
                                                                                        setFormData({ ...formData, documents: [...(formData.documents || []), newDoc] });
                                                                                        toast.success(`${reqCertName} details saved`);
                                                                                    }}
                                                                                 >
                                                                                     Upload
                                                                                 </Button>
                                                                            </div>
                                                                       )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}



                                 </div>
                             </div>



                             {/* Section: Operations Config */}
                             <div className="space-y-6 pt-4">
                                 <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                     <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Globe className="h-4 w-4" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-gray-900">Operations Config</h3>
                                        <p className="text-xs text-gray-500">Service areas and operational scope.</p>
                                     </div>
                                 </div>

                                 <div className="space-y-4">
                                     <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Operational Scope <span className="text-red-500">*</span></Label>
                                     
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         <div 
                                            onClick={() => isEditing && setFormData({ ...formData, serviceScope: 'all', serviceAreas: [] })}
                                            className={`
                                                relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                                                ${formData.serviceScope === 'all' 
                                                    ? 'bg-blue-50/50 border-blue-600 shadow-sm' 
                                                    : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-gray-50'}
                                                ${!isEditing && 'opacity-60 cursor-not-allowed'}
                                            `}
                                         >
                                            <div className={`mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${formData.serviceScope === 'all' ? 'border-blue-600' : 'border-gray-300'}`}>
                                                {formData.serviceScope === 'all' && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                                                    <Globe className="h-4 w-4 text-blue-500" />
                                                    All Service Areas
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                    Staff member can be dispatched to any location within the operational territory.
                                                </p>
                                            </div>
                                         </div>

                                         <div 
                                            onClick={() => isEditing && setFormData({ ...formData, serviceScope: 'specific' })}
                                            className={`
                                                relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                                                ${formData.serviceScope === 'specific' 
                                                    ? 'bg-blue-50/50 border-blue-600 shadow-sm' 
                                                    : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-gray-50'}
                                                ${!isEditing && 'opacity-60 cursor-not-allowed'}
                                            `}
                                         >
                                            <div className={`mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${formData.serviceScope === 'specific' ? 'border-blue-600' : 'border-gray-300'}`}>
                                                {formData.serviceScope === 'specific' && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                                                    <MapPin className="h-4 w-4 text-orange-500" />
                                                    Specific Service Areas
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                    Restrict staff availability to specific zones or regions only.
                                                </p>
                                            </div>
                                         </div>
                                     </div>

                                     {/* CONDITIONAL RENDER: Specific Areas Selector */}
                                     {formData.serviceScope === 'specific' && (
                                         <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-1">
                                             <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Selected Regions <span className="text-red-500">*</span></Label>
                                             <Select 
                                                 disabled={!isEditing} 
                                                 value=""
                                                 onValueChange={(val) => {
                                                     const current = formData.serviceAreas || [];
                                                     if (current.includes(val)) {
                                                         setFormData({...formData, serviceAreas: current.filter(s => s !== val)});
                                                     } else {
                                                         setFormData({...formData, serviceAreas: [...current, val]});
                                                     }
                                                 }}
                                             >
                                                 <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm">
                                                     <SelectValue placeholder="Select service areas..." />
                                                 </SelectTrigger>
                                                 <SelectContent>
                                                     {serviceAreaConfigs.map(area => (
                                                         <SelectItem key={area.id} value={area.name}>
                                                             <div className="flex items-center gap-2">
                                                                 {formData.serviceAreas?.includes(area.name) && <CheckCircle className="h-4 w-4 text-blue-600" />}
                                                                 {area.name}
                                                             </div>
                                                         </SelectItem>
                                                     ))}
                                                 </SelectContent>
                                             </Select>
                                             
                                             <div className="flex flex-wrap gap-2 min-h-[40px] content-start bg-blue-50/30 p-3 rounded-lg border border-blue-100/50">
                                                 {formData.serviceAreas?.map(area => (
                                                     <Badge key={area} variant="secondary" className="bg-white text-blue-700 border border-blue-100 py-1.5 px-3 gap-2 font-medium shadow-sm">
                                                         <MapPin className="h-3 w-3 text-blue-500" />
                                                         {area}
                                                         {isEditing && (
                                                             <X 
                                                                 className="h-3.5 w-3.5 text-blue-400 hover:text-red-500 cursor-pointer" 
                                                                 onClick={() => formData && setFormData({...formData, serviceAreas: formData.serviceAreas?.filter(s => s !== area)})}
                                                             />
                                                         )}
                                                     </Badge>
                                                 ))}
                                                 {(!formData.serviceAreas || formData.serviceAreas.length === 0) && (
                                                     <span className="text-sm text-gray-400 italic pt-1 text-red-400">Please select at least one area.</span>
                                                 )}
                                             </div>
                                         </div>
                                     )}
                                 </div>
                             </div>

                             {/* Section: Logistics & Transport (Advanced) */}
                             <div className="space-y-6 pt-4">
                                 <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                     <div className="h-8 w-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                        <Truck className="h-4 w-4" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-gray-900">Logistics</h3>
                                        <p className="text-xs text-gray-500">Transportation and commute arrangements.</p>
                                     </div>
                                 </div>

                                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {/* Transport Type Selection */}
                                     <div className="md:col-span-2 space-y-1.5">
                                         <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Transportation Type <span className="text-red-500">*</span></Label>
                                         <Select 
                                             disabled={!isEditing} 
                                             value={formData.transportationType} 
                                             onValueChange={v => {
                                                 // Reset child fields on change
                                                 setFormData({
                                                     ...formData, 
                                                     transportationType: v,
                                                     assignedVehicle: "",
                                                     vehicleType: "",
                                                     plateNumber: "",
                                                     primaryTransport: "",
                                                     transportVaries: false
                                                 })
                                             }}
                                         >
                                             <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm font-medium">
                                                 <SelectValue placeholder="Select Method" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                 {transportationConfigs.map(t => (
                                                     <SelectItem key={t.id} value={t.name}>
                                                         <div className="flex flex-col items-start py-0.5">
                                                             <span className="font-medium">{t.name}</span>
                                                             {t.description && <span className="text-[10px] text-gray-500">{t.description}</span>}
                                                         </div>
                                                     </SelectItem>
                                                 ))}
                                             </SelectContent>
                                         </Select>
                                     </div>

                                     {/* CONDITIONAL FIELDS RENDERING */}
                                     {(() => {
                                         const selectedConfig = transportationConfigs.find(c => c.name === formData.transportationType);
                                         const category = selectedConfig?.category || "company_driver"; // Default fallback

                                         // LOGIC BLOCKS
                                         // 1. Company Driver (Transported by company)
                                         if (category === "company_driver") {
                                             return (
                                                <div className="md:col-span-2 pt-2 animate-in fade-in">
                                                    <p className="text-xs text-gray-500 italic flex items-center gap-2">
                                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                                        Staff will be transported by company driver/route. No vehicle assignment required.
                                                    </p>
                                                </div>
                                             );
                                         }

                                         // 2. Company Vehicle (Staff Drives) - REQUIRED
                                         if (category === "company_vehicle") {
                                             return (
                                                 <div className="md:col-span-2 animate-in fade-in slide-in-from-top-1 space-y-4 pt-2">
                                                     <div className="space-y-1.5">
                                                         <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Assigned Vehicle <span className="text-red-500">*</span></Label>
                                                         <Select 
                                                             disabled={!isEditing} 
                                                             value={formData.assignedVehicle} 
                                                             onValueChange={v => setFormData({...formData, assignedVehicle: v})}
                                                         >
                                                             <SelectTrigger className="bg-white w-full h-11 border-gray-200 text-sm"><SelectValue placeholder="Select Vehicle Asset" /></SelectTrigger>
                                                             <SelectContent>
                                                                 {MOCK_COMPANY_VEHICLES.map(v => (
                                                                     <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                                                 ))}
                                                             </SelectContent>
                                                         </Select>
                                                     </div>
                                                     <div className="space-y-1.5">
                                                         <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Notes (Optional)</Label>
                                                         <Input 
                                                             disabled={!isEditing}
                                                             className="h-10 bg-white border-gray-200"
                                                             placeholder="e.g. Fuel card number..."
                                                         />
                                                     </div>
                                                 </div>
                                             );
                                         }

                                         // 3. Self Vehicle (Own Transport) - ALL OPTIONAL
                                         if (category === "self_vehicle") {
                                             return (
                                                 <div className="md:col-span-2 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 pt-2">
                                                     <div className="space-y-1.5">
                                                         <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Vehicle Type</Label>
                                                         <Select 
                                                             disabled={!isEditing} 
                                                             value={formData.vehicleType} 
                                                             onValueChange={v => setFormData({...formData, vehicleType: v})}
                                                         >
                                                             <SelectTrigger className="bg-white w-full h-11 border-gray-200 text-sm"><SelectValue placeholder="Car / Bike / Van" /></SelectTrigger>
                                                             <SelectContent>
                                                                 <SelectItem value="Sedan Car">Sedan Car</SelectItem>
                                                                 <SelectItem value="SUV">SUV</SelectItem>
                                                                 <SelectItem value="Motorbike">Motorbike</SelectItem>
                                                                 <SelectItem value="Van">Van</SelectItem>
                                                             </SelectContent>
                                                         </Select>
                                                     </div>
                                                     <div className="space-y-1.5">
                                                         <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Plate Number (Optional)</Label>
                                                         <Input 
                                                             disabled={!isEditing} 
                                                             value={formData.plateNumber} 
                                                             onChange={e => setFormData({...formData, plateNumber: e.target.value})}
                                                             placeholder="e.g. 123456"
                                                             className="h-11 bg-white border-gray-200"
                                                         />
                                                     </div>
                                                 </div>
                                             );
                                         }

                                         // 4. Public Transport
                                         if (category === "public") {
                                             return (
                                                  <div className="md:col-span-2 pt-2 animate-in fade-in">
                                                     <p className="text-xs text-gray-500 italic flex items-center gap-2">
                                                         <AlertCircle className="h-3 w-3" />
                                                         Staff uses taxi/uber/public transport. Service radius may be limited.
                                                     </p>
                                                  </div>
                                             );
                                         }

                                         // 5. Hybrid / Flexible
                                         if (category === "hybrid") {
                                             return (
                                                 <div className="md:col-span-2 space-y-4 pt-2 bg-white/50 rounded-lg border border-indigo-100 p-4 animate-in fade-in">
                                                     
                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                                         <div className="space-y-1.5">
                                                             <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Primary Mode</Label>
                                                             <Select 
                                                                 disabled={!isEditing} 
                                                                 value={formData.primaryTransport} 
                                                                 onValueChange={v => setFormData({...formData, primaryTransport: v})}
                                                             >
                                                                 <SelectTrigger className="bg-white w-full h-11 border-gray-200 text-sm"><SelectValue placeholder="Select Primary Mode" /></SelectTrigger>
                                                                 <SelectContent>
                                                                     <SelectItem value="Company Vehicle">Company Vehicle</SelectItem>
                                                                     <SelectItem value="Self Vehicle">Self Vehicle</SelectItem>
                                                                     <SelectItem value="Public Transport">Public Transport</SelectItem>
                                                                 </SelectContent>
                                                             </Select>
                                                         </div>
                                                         
                                                         <div className="flex items-center gap-2 pb-3">
                                                             <Switch 
                                                                 checked={formData.transportVaries}
                                                                 onCheckedChange={(c: boolean) => setFormData({...formData, transportVaries: c})}
                                                             />
                                                             <span className="text-sm text-gray-600 font-medium">Varies by shift/day</span>
                                                         </div>
                                                     </div>
                                                     
                                                     {/* Nested Logic for Hybrid Primary */}
                                                     {formData.primaryTransport === "Company Vehicle" && (
                                                         <div className="space-y-1.5 animate-in fade-in pt-2 border-t border-indigo-100 mt-2">
                                                              <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Assigned Vehicle <span className="text-red-500">*</span></Label>
                                                              <Select value={formData.assignedVehicle} onValueChange={v => setFormData({...formData, assignedVehicle: v})}>
                                                                 <SelectTrigger className="bg-white h-10 text-sm"><SelectValue placeholder="Assign Asset" /></SelectTrigger>
                                                                 <SelectContent>
                                                                     {MOCK_COMPANY_VEHICLES.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                                                                 </SelectContent>
                                                              </Select>
                                                         </div>
                                                     )}
                                                     {formData.primaryTransport === "Self Vehicle" && (
                                                         <div className="space-y-1.5 animate-in fade-in pt-2 border-t border-indigo-100 mt-2">
                                                              <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Vehicle Info (Optional)</Label>
                                                              <div className="grid grid-cols-2 gap-2">
                                                                  <Select value={formData.vehicleType} onValueChange={v => setFormData({...formData, vehicleType: v})}>
                                                                    <SelectTrigger className="bg-white h-10 text-sm"><SelectValue placeholder="Type" /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Sedan Car">Sedan Car</SelectItem>
                                                                        <SelectItem value="SUV">SUV</SelectItem>
                                                                        <SelectItem value="Motorbike">Motorbike</SelectItem>
                                                                        <SelectItem value="Van">Van</SelectItem>
                                                                    </SelectContent>
                                                                  </Select>
                                                                  <Input placeholder="Plate #" value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} className="h-10 bg-white" />
                                                              </div>
                                                         </div>
                                                     )}
                                                 </div>
                                             );
                                         }

                                         // Fallback
                                         return null;

                                     })()}
                                 </div>
                             </div>

                             {/* Section: Personal Background */}
                             <div className="space-y-6 pt-4">
                                 <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                     <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <User className="h-4 w-4" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-gray-900">Personal Background</h3>
                                        <p className="text-xs text-gray-500">Additional personal details for HR records.</p>
                                     </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Religion</Label>
                                        <Select disabled={!isEditing} value={formData.religion} onValueChange={v => setFormData({...formData, religion: v})}>
                                            <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm"><SelectValue placeholder="Select Religion" /></SelectTrigger>
                                            <SelectContent>
                                                {["Islam", "Christianity", "Hinduism", "Buddhism", "Other"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Marital Status</Label>
                                        <Select disabled={!isEditing} value={formData.maritalStatus} onValueChange={v => setFormData({...formData, maritalStatus: v})}>
                                            <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                            <SelectContent>
                                                {["Single", "Married", "Divorced", "Widowed"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                 </div>

                             </div>

                             {/* Section: Shift Configuration */}
                             <div className="space-y-6 pt-4">
                                 <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                     <div className="h-8 w-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                                        <Calendar className="h-4 w-4" />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-gray-900">Shift Configuration</h3>
                                        <p className="text-xs text-gray-500">Define working days and hours.</p>
                                     </div>
                                 </div>

                                 <div className="space-y-6">
                                    <div className="max-w-xs space-y-1.5">
                                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Shift System</Label>
                                        <Select disabled={!isEditing} value={formData.shiftSystem} onValueChange={v => setFormData({...formData, shiftSystem: v as any})}>
                                            <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm"><SelectValue placeholder="Select System" /></SelectTrigger>
                                            <SelectContent>
                                                {enabledShiftSystems.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* FIXED SHIFT UI */}
                                    {formData.shiftSystem === 'Fixed' && (
                                        <div className="space-y-5 animate-in fade-in">
                                            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row items-start md:items-center gap-4">
                                                <div className="space-y-1.5 flex-1">
                                                    <Label className="text-xs font-semibold uppercase text-blue-800">Standard Daily Hours</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input 
                                                            type="time" 
                                                            disabled={!isEditing}
                                                            value={formData.workHoursStart} 
                                                            onChange={e => setFormData({...formData, workHoursStart: e.target.value})}
                                                            className="h-10 bg-white border-blue-200 focus-visible:ring-blue-500 w-32"
                                                        />
                                                        <span className="text-blue-400 font-medium">to</span>
                                                        <Input 
                                                            type="time" 
                                                            disabled={!isEditing}
                                                            value={formData.workHoursEnd} 
                                                            onChange={e => setFormData({...formData, workHoursEnd: e.target.value})}
                                                            className="h-10 bg-white border-blue-200 focus-visible:ring-blue-500 w-32"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="hidden md:block w-px h-10 bg-blue-200"></div>
                                                <div className="text-xs text-blue-700 max-w-sm">
                                                    These hours will apply to all selected days below. Uncheck days to mark them as "Off".
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Working Days</Label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                                                        const isActive = formData.workingDays?.includes(day);
                                                        return (
                                                            <div 
                                                                key={day}
                                                                onClick={() => {
                                                                    if (!isEditing) return;
                                                                    const current = formData.workingDays || [];
                                                                    if (current.includes(day)) {
                                                                        setFormData({...formData, workingDays: current.filter(d => d !== day)});
                                                                    } else {
                                                                        setFormData({...formData, workingDays: [...current, day]});
                                                                    }
                                                                }}
                                                                className={`
                                                                    flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all h-24
                                                                    ${isActive 
                                                                        ? 'bg-green-50 border-green-200 text-green-700 shadow-sm ring-1 ring-green-100' 
                                                                        : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300'}
                                                                `}
                                                            >
                                                                <span className="font-bold text-sm mb-1">{day}</span>
                                                                {isActive ? (
                                                                    <div className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                                                        {formData.workHoursStart || "09:00"} - {formData.workHoursEnd || "17:00"}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[10px] italic">Off Day</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* FLEXIBLE SHIFT UI */}
                                    {formData.shiftSystem === 'Flexible' && (
                                        <div className="space-y-5 animate-in fade-in">
                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-purple-700 text-sm">
                                                Flexible staff do not have fixed start/end times. Select the days they are generally available to accept jobs.
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Availability Days</Label>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                                                        const isActive = formData.workingDays?.includes(day);
                                                        return (
                                                            <div 
                                                                key={day}
                                                                onClick={() => {
                                                                    if (!isEditing) return;
                                                                    const current = formData.workingDays || [];
                                                                    if (current.includes(day)) {
                                                                        setFormData({...formData, workingDays: current.filter(d => d !== day)});
                                                                    } else {
                                                                        setFormData({...formData, workingDays: [...current, day]});
                                                                    }
                                                                }}
                                                                className={`
                                                                    flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all h-20
                                                                    ${isActive 
                                                                        ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm' 
                                                                        : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}
                                                                `}
                                                            >
                                                                <span className="font-bold text-sm">{day}</span>
                                                                <span className="text-[10px] mt-1">{isActive ? 'Available' : '-'}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ROTATIONAL SHIFT UI - Summary View */}
                                    {formData.shiftSystem === 'Rotational' && (
                                        <div className="space-y-6 animate-in fade-in">
                                            
                                            {/* Template Selection */}
                                            {shiftTemplateOptions.length > 0 && (
                                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                                                    <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Quick Apply Template</Label>
                                                    <Select onValueChange={(val) => {
                                                        const template = shiftTemplateOptions.find(t => t.id === val);
                                                        if (template) {
                                                            setFormData({ ...formData, rotationalSchedule: template.schedule });
                                                            toast.success(`Applied template: ${template.name}`);
                                                        }
                                                    }}>
                                                        <SelectTrigger className="bg-white w-full h-10 border-gray-200 text-sm">
                                                            <SelectValue placeholder="Select a shift template..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {shiftTemplateOptions.map((t: any) => (
                                                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            {/* Summary Header */}
                                            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-100">
                                                <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    Weekly Coverage Preview
                                                </div>
                                                <div className="text-xs text-green-600 italic">
                                                    Click on any day to configure multiple shifts.
                                                </div>
                                            </div>

                                            {/* Weekly Visual Columns */}
                                            <div className="grid grid-cols-7 gap-2">
                                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => {
                                                    const slots = formData.rotationalSchedule?.[day] || []; 
                                                    const hasShift = slots.length > 0;
                                                    
                                                    // Calculate total hours for the day for display
                                                    const totalHours = slots.reduce((acc, slot) => {
                                                        const start = parseInt(slot.start.split(':')[0]);
                                                        const end = parseInt(slot.end.split(':')[0]);
                                                        return acc + (end - start);
                                                    }, 0);

                                                    return (
                                                        <div key={day} className="flex flex-col gap-2">
                                                            <div className="text-center">
                                                                <div className="text-xs font-bold text-gray-700 uppercase">{day}</div>
                                                                <div className="text-[10px] text-gray-400">
                                                                    {hasShift ? `(${totalHours}h)` : '(0h)'}
                                                                </div>
                                                            </div>
                                                            
                                                            <div 
                                                                onClick={() => setActiveDayModal(day)}
                                                                className={`
                                                                    h-40 rounded-lg border flex flex-col items-center justify-start p-1.5 gap-1.5 cursor-pointer transition-all hover:ring-2 hover:ring-green-200 hover:border-green-300
                                                                    ${hasShift ? 'bg-white border-gray-200' : 'bg-gray-50/50 border-gray-100 opacity-70'}
                                                                `}>
                                                                {hasShift ? (
                                                                    slots.map((slot, idx) => (
                                                                        <div key={idx} className="w-full bg-green-100 text-green-800 text-[10px] py-1 px-1 rounded font-medium border border-green-200 flex flex-col items-center justify-center flex-shrink-0 min-h-[28px]">
                                                                            <span>{slot.start}</span>
                                                                            <span className="w-full h-px bg-green-200 my-0.5"></span>
                                                                            <span>{slot.end}</span>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-300 italic">
                                                                        Off
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Hover Hint */}
                                                                <div className="mt-auto pt-1 text-[9px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    Edit
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                 </div>
                             </div>

                             <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                 <Button variant="outline" onClick={() => setCurrentStep(0)} className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50">
                                     Previous Step
                                 </Button>
                                 <Button className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all" onClick={() => saveChanges(true)}>
                                     Next: Summary <ArrowRight className="w-4 h-4 ml-2" />
                                 </Button>
                             </div>
                         </div>
                     )}

                    {/* 3. SUMMARY & ACTIVATION */}
                    {currentStep === 2 && (
                        <div className="max-w-4xl mx-auto animate-in fade-in space-y-6 pt-2">
                            
                            <div className="text-center py-4 bg-gradient-to-b from-green-50 to-transparent rounded-xl border border-green-100">
                               <div className="h-14 w-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border-2 border-white">
                                   <ShieldCheck className="h-7 w-7" />
                               </div>
                               <h2 className="text-xl font-bold text-gray-900">Review & Activate</h2>
                               <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                                   Finalize the staff member's profile for deployment.
                               </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* PROFILE CARD */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                        <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><User className="h-4 w-4"/></div>
                                        <span className="font-bold text-sm text-gray-900">Personal Details</span>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Full Name</span> <span className="font-medium text-gray-900">{data?.name}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Role</span> <span className="font-medium text-gray-900">{formData.role}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Gender</span> <span className="font-medium text-gray-900">{data?.gender}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Nationality</span> <span className="font-medium text-gray-900">{data?.nationality}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Phone</span> <span className="font-medium text-gray-900">{data?.phone}</span></div>
                                    </div>
                                </div>

                                {/* OPERATIONS CARD */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                        <div className="h-8 w-8 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center"><Briefcase className="h-4 w-4"/></div>
                                        <span className="font-bold text-sm text-gray-900">Operations</span>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                         <div className="flex justify-between"><span className="text-gray-500">Department</span> <span className="font-medium text-gray-900">{formData.department}</span></div>
                                         <div className="flex justify-between"><span className="text-gray-500">Type</span> <span className="font-medium text-gray-900">{formData.employmentType}</span></div>
                                         <div className="flex justify-between"><span className="text-gray-500">Transport</span> <span className="font-medium text-gray-900">{formData.transportationType}</span></div>
                                         <div>
                                             <span className="text-gray-500 block mb-1">Service Areas</span>
                                             <div className="flex flex-wrap gap-1">
                                                {formData.serviceAreas?.map((area: string) => <Badge key={area} variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100">{area}</Badge>)}
                                                {(!formData.serviceAreas?.length) && <span className="text-gray-400 italic">None</span>}
                                             </div>
                                         </div>
                                         <div>
                                             <span className="text-gray-500 block mb-1">Languages</span>
                                             <div className="flex flex-wrap gap-1">
                                                 {formData.languages?.map((l: string) => <Badge key={l} variant="outline" className="text-xs bg-gray-50">{l}</Badge>)}
                                                 {(!formData.languages?.length) && <span className="text-gray-400 italic">None</span>}
                                             </div>
                                         </div>
                                     </div>
                                </div>
                                
                                {/* COMPENSATION CARD */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                        <div className="h-8 w-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><Banknote className="h-4 w-4"/></div>
                                        <span className="font-bold text-sm text-gray-900">Compensation</span>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Scheme</span> <span className="font-medium text-gray-900 badge bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">{formData.salaryType}</span></div>
                                        {(formData.salaryType === 'Fixed Monthly' || formData.salaryType === 'Fixed + Commission') && (
                                            <div className="flex justify-between"><span className="text-gray-500">Base Salary</span> <span className="font-medium text-gray-900">QAR {formData.salaryAmount}</span></div>
                                        )}
                                        {(formData.salaryType === 'Commission-Based' || formData.salaryType === 'Fixed + Commission') && (
                                            <div className="flex justify-between"><span className="text-gray-500">Commission</span> <span className="font-medium text-gray-900">{formData.commissionRate}%</span></div>
                                        )}
                                        {formData.salaryType === 'Hourly-Rate' && (
                                            <div className="flex justify-between"><span className="text-gray-500">Hourly Rate</span> <span className="font-medium text-gray-900">QAR {formData.hourlyRate}/hr</span></div>
                                        )}
                                    </div>
                                </div>

                                {/* SHIFT CARD */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                        <div className="h-8 w-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center"><Calendar className="h-4 w-4"/></div>
                                        <span className="font-bold text-sm text-gray-900">Shift Configuration</span>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">System</span> <span className="font-medium text-gray-900">{formData.shiftSystem}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Working Days</span> <span className="font-medium text-gray-900">{formData.shiftSystem === 'Rotational' ? 'Varied (Rotational)' : formData.workingDays?.length + ' Days/Week'}</span></div>
                                        {formData.shiftSystem === 'Fixed' && (
                                            <div className="flex justify-between"><span className="text-gray-500">Hours</span> <span className="font-medium text-gray-900">{formData.workHoursStart} - {formData.workHoursEnd}</span></div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex items-center gap-4">
                                <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50">
                                    Back to Operations
                                </Button>
                                <Button 
                                   className="flex-[2] h-12 bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200 text-lg font-bold tracking-wide transition-all transform hover:scale-[1.01]" 
                                   onClick={handleActivate}
                                >
                                     Complete Activation
                                     <CheckCircle className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
      {/* Single Day Shift Management Modal */}
      {activeDayModal && formData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Manage Shifts</div>
                        <h2 className="text-xl font-bold text-gray-900">{activeDayModal}</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setActiveDayModal(null)} className="rounded-full hover:bg-gray-200">
                        <X className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* Existing Shifts List */}
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold text-gray-500 uppercase">Time Slots</Label>
                        
                        {(formData.rotationalSchedule?.[activeDayModal] || []).length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-lg text-gray-400 text-sm">
                                No shifts configured for this day.
                            </div>
                        ) : (
                            (formData.rotationalSchedule?.[activeDayModal] || []).map((slot, index) => (
                                <div key={index} className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
                                    <div className="flex-1 flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <Input 
                                            type="time" 
                                            className="h-8 border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0 w-24"
                                            value={slot.start}
                                            onChange={(e) => {
                                                const currentSlots = [...(formData.rotationalSchedule?.[activeDayModal] || [])];
                                                currentSlots[index] = { ...slot, start: e.target.value };
                                                setFormData({
                                                    ...formData,
                                                    rotationalSchedule: { ...formData.rotationalSchedule, [activeDayModal]: currentSlots }
                                                });
                                            }}
                                        />
                                        <span className="text-gray-300">|</span>
                                        <Input 
                                            type="time" 
                                            className="h-8 border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0 w-24"
                                            value={slot.end}
                                            onChange={(e) => {
                                                const currentSlots = [...(formData.rotationalSchedule?.[activeDayModal] || [])];
                                                currentSlots[index] = { ...slot, end: e.target.value };
                                                setFormData({
                                                    ...formData,
                                                    rotationalSchedule: { ...formData.rotationalSchedule, [activeDayModal]: currentSlots }
                                                });
                                            }}
                                        />
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => {
                                            const currentSlots = [...(formData.rotationalSchedule?.[activeDayModal] || [])];
                                            currentSlots.splice(index, 1);
                                            setFormData({
                                                ...formData,
                                                rotationalSchedule: { ...formData.rotationalSchedule, [activeDayModal]: currentSlots }
                                            });
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                        onClick={() => {
                            const currentSlots = [...(formData.rotationalSchedule?.[activeDayModal] || [])];
                            // Add default 9-5 or add to end of last shift
                            currentSlots.push({ start: "09:00", end: "17:00" });
                            setFormData({
                                ...formData,
                                rotationalSchedule: { ...formData.rotationalSchedule, [activeDayModal]: currentSlots }
                            });
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Shift Block
                    </Button>
                    <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setActiveDayModal(null)}>
                        Done
                    </Button>
                </div>
            </div>
        </div>
      )}
      {/* Success Dialog */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-6 transform animate-in zoom-in-95 duration-200">
                <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Activation Successful!</h2>
                    <p className="text-gray-500 text-sm">
                        {data?.name || "The staff member"} has been successfully activated and is now ready for deployment.
                    </p>
                </div>
                <div className="pt-2">
                    <Button 
                        className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-lg"
                        onClick={() => setLocation("/workforce")}
                    >
                        Return to Staff List
                    </Button>
                </div>
            </div>
        </div>
      )}

        <Dialog open={isBasicInfoOpen} onOpenChange={setIsBasicInfoOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Basic Information</DialogTitle>
                </DialogHeader>
                {basicInfoForm && (
                <div className="space-y-4 py-4">
                     {/* Photo Upload */}
                     <div className="flex flex-col items-center justify-center gap-3">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={basicInfoForm.avatar} />
                                <AvatarFallback>{basicInfoForm.nickname?.substring(0,2) || "NA"}</AvatarFallback>
                            </Avatar>
                             <label className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50">
                                <Upload className="h-3 w-3 text-gray-500" />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file){
                                        const reader = new FileReader();
                                        reader.onloadend = () => setBasicInfoForm({...basicInfoForm, avatar: reader.result as string});
                                        reader.readAsDataURL(file);
                                    }
                                }}/>
                            </label>
                        </div>
                        <span className="text-xs text-center text-gray-500">Tap icon to change photo</span>
                     </div>
                     
                     <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500 uppercase">Nickname</Label>
                            <Input value={basicInfoForm.nickname} onChange={e => setBasicInfoForm({...basicInfoForm, nickname: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500 uppercase">Gender</Label>
                            <Select value={basicInfoForm.gender} onValueChange={v => setBasicInfoForm({...basicInfoForm, gender: v as any})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                             <div className="space-y-1">
                                <Label className="text-xs text-gray-500 uppercase">Mobile</Label>
                                <Input value={basicInfoForm.mobile} onChange={e => setBasicInfoForm({...basicInfoForm, mobile: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 uppercase">Email</Label>
                                <Input value={basicInfoForm.email} onChange={e => setBasicInfoForm({...basicInfoForm, email: e.target.value})} />
                            </div>
                        </div>
                     </div>
                </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBasicInfoOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveBasicInfo}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </DashboardLayout>
  );
}
