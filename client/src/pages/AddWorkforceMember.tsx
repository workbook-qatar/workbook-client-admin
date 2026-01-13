import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Users, Truck, CheckCircle2, User, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

// Step components
import StaffTypeStep from "@/components/workforce/StaffTypeStep";
import QIDSearchStep from "@/components/workforce/QIDSearchStep";
import BasicInfoStep from "@/components/workforce/BasicInfoStep";
import EmploymentStep from "@/components/workforce/EmploymentStep";
import AdditionalInfoStep from "@/components/workforce/AdditionalInfoStep";
import ActivationStep from "@/components/workforce/ActivationStep";

export interface WorkforceMemberData {
  // Staff Type
  staffType: "field-service" | "internal" | "driver" | null;
  systemAccess?: boolean;
  employmentStatus?: "Active" | "On Leave" | "Suspended" | "Inactive";
  workStatus?: "Available" | "On Job" | "Offline";
  
  // QID & Search
  qidNumber?: string;
  fullName?: string;
  dateOfBirth?: string;
  nationality?: string;
  qidFile?: File | null;
  
  // Basic Info
  photoUrl?: string;
  nickname?: string;
  gender?: string;
  mobileNumber?: string;
  emailAddress?: string;
  address?: string;
  city?: string;
  area?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  
  // Employment
  position?: string;
  department?: string;
  employmentType?: string;
  contractType?: string;
  probationPeriod?: string;
  contractEndDate?: string;
  workingHours?: string;
  reportingManager?: string;
  startDate?: string;
  salaryType?: "fixed-monthly" | "commission-based" | "hourly-rate" | "fixed-commission";
  monthlySalary?: string;
  commissionPercentage?: string;
  baseRate?: string;
  hourlyRate?: string;
  fixedMonthlySalary?: string;
  commissionPercent?: string;
  
  // Documents
  passportNumber?: string;
  passportExpiry?: string;
  passportFile?: any;
  visaNumber?: string;
  visaExpiry?: string;
  visaFile?: any;
  bankName?: string;
  accountNumber?: string;
  iban?: string;

  // Additional
  languages?: string[];
  skills?: string[];
  religion?: string;
  maritalStatus?: string;
  bloodGroup?: string;
  medicalInsurance?: string;
  medicalInsuranceExpiry?: string;
  certificates?: Array<{
    name: string;
    expiry?: string;
    fileId: string;
  }>;
}

export default function AddWorkforceMember() {
  const [, setLocation] = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<WorkforceMemberData>({
      staffType: null,
      systemAccess: false,
      employmentStatus: "Active",
      workStatus: "Offline", // Default
    });
    
    // Load Settings
    const [deptOptions, setDeptOptions] = useState<string[]>([]);
    const [jobOptions, setJobOptions] = useState<string[]>([]);

    useEffect(() => {
        const d = localStorage.getItem("vendor_departments");
        if (d) setDeptOptions(JSON.parse(d).map((x:any) => x.name));
        else setDeptOptions(["Operations", "Finance", "HR", "Management", "IT"]);

        const j = localStorage.getItem("vendor_job_titles");
        if (j) setJobOptions(JSON.parse(j).map((x:any) => x.title));
        // Fallback for job titles if not found is handled by keeping it empty or default? 
        // We'll leave it empty to prompt user to add in settings if needed, or default list.
    }, []);
  
    // Dynamic Styles & Steps based on Type
    const getSteps = () => {
        const type = formData.staffType;
        if (type === 'driver') {
            return [
                { id: 1, name: "Role Selection", icon: "👥" },
                { id: 2, name: "Driver Profile", icon: "👤" },
                { id: 3, name: "License & Vehicle", icon: "🚚" },
                { id: 4, name: "Review", icon: "✅" },
            ];
        }
        if (type === 'internal') {
             return [
                { id: 1, name: "Role Selection", icon: "👥" },
                { id: 2, name: "Staff Profile", icon: "👤" },
                { id: 3, name: "Access & Permissions", icon: "🔒" },
                { id: 4, name: "Review", icon: "✅" },
            ];
        }
        if (type === 'field-service') {
            return [
                { id: 1, name: "Staff Type", icon: "👥" },
                { id: 2, name: "QID & Search", icon: "🔍" },
                { id: 3, name: "Basic Info", icon: "👤" },
            ];
        }
        // Fallback
        return [
            { id: 1, name: "Staff Type", icon: "👥" },
            { id: 2, name: "QID & Search", icon: "🔍" },
            { id: 3, name: "Basic Info", icon: "👤" },
        ];
    };

    const steps = getSteps();
  
    const updateFormData = (data: Partial<WorkforceMemberData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
    };
  
    const handleNext = () => {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final Step for Field Service (Step 3)
        if (formData.staffType === 'field-service' || !formData.staffType) {
            saveStaffMember("draft");
        }
      }
    };
  
    const handleBack = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      } else {
        setLocation("/workforce");
      }
    };
  
    const saveStaffMember = (status: "draft" | "active" | "pending") => {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
          try {
          // Load existing
          const stored = localStorage.getItem("vendor_staff");
          const staffList = stored ? JSON.parse(stored) : [];
  
          // Generate ID
          const newId = (Date.now()).toString();
          
          // Initials
          const initials = formData.fullName 
              ? formData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              : "NA";
  
          // Map Role Type
          const roleTypeMap: Record<string, string> = {
              "field-service": "field",
              "internal": "office",
              "driver": "driver"
          };
          
          const newStaff = {
              id: newId,
              staffId: status === 'active' ? `WB${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` : "", 
              name: formData.fullName || "Unknown", 
              role: formData.position || "Staff",
              roleType: (formData.staffType && roleTypeMap[formData.staffType]) ? roleTypeMap[formData.staffType] : "part-time", 
              email: formData.emailAddress || "",
              phone: formData.mobileNumber || "",
              location: formData.city || "Qatar",
              
              // Status Model
              status: status === 'active' ? "offline" : "offline", 
              employmentStatus: formData.employmentStatus || "Active", 
              
              // Membership / Invite Status
              membershipStatus: status,
              inviteSentAt: status !== 'draft' ? new Date().toISOString() : null,
              emailVerified: status === 'active' ? true : false,
              phoneVerified: status === 'active' ? true : false,
              
              avatar: initials,
              avatarColor: "bg-blue-600",
              availabilityHours: 40,
              activeJobs: 0,
              rating: 0,
              jobsCompleted: 0,
              skills: formData.skills || [],
              
              // New flags
              systemAccess: formData.systemAccess,
          };
  
          staffList.push(newStaff);
          localStorage.setItem("vendor_staff", JSON.stringify(staffList));
          
          if (status === 'active') {
             toast.success("Staff member activated successfully");
          } else if (status === 'draft') {
             toast.info("Draft saved successfully");
          } else {
             toast.success("Invite sent successfully");
          }
          
          // Route to pending list
          setLocation(`/workforce`);
          
          } catch (error) {
          console.error(error);
          toast.error("Failed to save staff member");
          setIsSubmitting(false);
          }
      }, 1500);
    };

    const handleSaveDraft = () => {
        saveStaffMember("draft");
    };
  
    const handleSubmit = () => {
        // Legacy or wrapper
        saveStaffMember("pending");
    };

    const handleActivate = () => {
        saveStaffMember("active");
    };
  
    // Calculate progress: Granular based on field completion
    const getProgress = () => {
      // Simplified progress for new flows
      return Math.round((currentStep / steps.length) * 100);
    };
  
    return (
      <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden md:inline">Back</span>
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                    Add {formData.staffType === 'driver' ? 'Driver' : formData.staffType === 'internal' ? 'Internal Staff' : 'Workforce Member'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-black text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    Auto-saved
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={handleSaveDraft} className="whitespace-nowrap">
              <Save className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Save as Draft</span>
              <span className="md:hidden">Save</span>
            </Button>
          </div>
        </div>
  
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <div className="px-4 md:px-8 min-w-max">
            <div className="max-w-4xl mx-auto flex items-center gap-6 md:gap-8">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isDisabled = currentStep < step.id;
  
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (!isDisabled) setCurrentStep(step.id);
                    }}
                    disabled={isDisabled}
                    className={`
                      flex items-center gap-2 py-4 border-b-2 transition-colors relative whitespace-nowrap
                      ${isActive ? "border-blue-600 text-blue-600" : ""}
                      ${isCompleted ? "border-green-600 text-green-600" : ""}
                      ${!isActive && !isCompleted ? "border-transparent text-gray-400" : ""}
                      ${isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:text-blue-600"}
                    `}
                  >
                    {isCompleted ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span>{step.icon}</span>
                    )}
                    <span className="font-medium text-sm md:text-base">{step.name}</span>
                  </button>
                );
              })}
              
              {/* Progress Bar */}
              <div className="ml-auto flex items-center gap-3 hidden md:flex">
                <div className="w-24 md:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">{getProgress()}%</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Step Content */}
        <div className="px-4 md:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Always Staff Type Selection */}
            {currentStep === 1 && (
              <StaffTypeStep
                data={formData}
                onUpdate={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
  
            {/* Existing Field Service Flow (Unchanged) */}
            {formData.staffType === 'field-service' && (
                <>
                    {currentStep === 2 && <QIDSearchStep data={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 3 && <BasicInfoStep data={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} isLastStep={true} isLoading={isSubmitting} />}
                </>
            )}

            {/* Driver Flow (Complete MVP) */}
            {formData.staffType === 'driver' && (
                <>
                   {/* Step 2: Driver Profile & Identity */}
                   {currentStep === 2 && (
                       <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                           <div className="flex items-center gap-2 border-b pb-4">
                               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Users className="h-5 w-5" /></div>
                               <h2 className="text-lg font-semibold">1. Identity & Driver Details</h2>
                           </div>

                           {/* Identity Section */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Full Name *</Label>
                                    <input className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                        placeholder="Full Name as per ID" 
                                        value={formData.fullName || ''} onChange={e => updateFormData({fullName: e.target.value})} />
                               </div>
                               <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Nationality</Label>
                                    <select className="w-full border rounded p-2 text-sm bg-white" 
                                        value={formData.nationality || ''} onChange={e => updateFormData({nationality: e.target.value})}>
                                        <option value="">Select Nationality</option>
                                        <option value="India">India</option>
                                        <option value="Philippines">Philippines</option>
                                        <option value="Nepal">Nepal</option>
                                        <option value="Sri Lanka">Sri Lanka</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="Other">Other</option>
                                    </select>
                               </div>
                               <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Mobile Number *</Label>
                                    <input className="w-full border rounded p-2 text-sm" 
                                        placeholder="+974" 
                                        value={formData.mobileNumber || ''} onChange={e => updateFormData({mobileNumber: e.target.value})} />
                               </div>
                               <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Email (Optional)</Label>
                                    <input className="w-full border rounded p-2 text-sm" 
                                        placeholder="driver@example.com" type="email"
                                        value={formData.emailAddress || ''} onChange={e => updateFormData({emailAddress: e.target.value})} />
                               </div>
                               <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">QID / ID Number *</Label>
                                    <input className="w-full border rounded p-2 text-sm" 
                                        placeholder="11-digit QID" 
                                        value={formData.qidNumber || ''} onChange={e => updateFormData({qidNumber: e.target.value})} />
                               </div>
                               <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Date of Birth</Label>
                                    <input className="w-full border rounded p-2 text-sm" type="date"
                                        value={formData.dateOfBirth || ''} onChange={e => updateFormData({dateOfBirth: e.target.value})} />
                               </div>
                           </div>

                           <div className="border-t pt-4 mt-4">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Truck className="h-4 w-4 text-orange-500" /> License Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold uppercase text-gray-500">Driver Type *</Label>
                                        <select className="w-full border rounded p-2 text-sm bg-white" 
                                            value={formData.employmentType || ''} onChange={e => updateFormData({employmentType: e.target.value})}>
                                            <option value="">Select Type</option>
                                            <option value="Company Driver">Company Driver</option>
                                            <option value="Freelancer">Freelancer</option>
                                            <option value="Contractor">Contractor</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold uppercase text-gray-500">License Category</Label>
                                        <select className="w-full border rounded p-2 text-sm bg-white" 
                                            value={formData.position || ''} onChange={e => updateFormData({position: e.target.value})}>
                                            <option value="">Select Category</option>
                                            <option value="Light Vehicle">Light Vehicle</option>
                                            <option value="Heavy Vehicle">Heavy Vehicle</option>
                                            <option value="Motorcycle">Motorcycle</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold uppercase text-gray-500">License Number *</Label>
                                        <input className="w-full border rounded p-2 text-sm" 
                                            placeholder="License No." 
                                            value={formData.passportNumber || ''} onChange={e => updateFormData({passportNumber: e.target.value})} /> 
                                            {/* Using passportNumber field temporarily for License No as per generic structure or add new field */}
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold uppercase text-gray-500">License Expiry *</Label>
                                        <input className="w-full border rounded p-2 text-sm" type="date"
                                            value={formData.passportExpiry || ''} onChange={e => updateFormData({passportExpiry: e.target.value})} />
                                    </div>
                                </div>
                           </div>

                           <div className="flex justify-end pt-4">
                               <Button onClick={handleNext} disabled={!formData.fullName || !formData.mobileNumber}>Continue</Button>
                           </div>
                       </div>
                   )}
                   {/* Step 3: Vehicle & Employment */}
                   {currentStep === 3 && (
                       <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                           <div className="flex items-center gap-2 border-b pb-4">
                               <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Truck className="h-5 w-5" /></div>
                               <h2 className="text-lg font-semibold">2. Vehicle & Employment</h2>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {/* Vehicle Assignment */}
                               <div className="space-y-4">
                                   <h3 className="text-sm font-semibold border-l-2 border-orange-500 pl-2">Vehicle Assignment</h3>
                                   <div className="space-y-1">
                                        <Label className="text-xs font-semibold uppercase text-gray-500">Assigned Vehicle</Label>
                                        <select className="w-full border rounded p-2 text-sm bg-white">
                                            <option value="">No Vehicle Assigned</option>
                                            <option value="v1">Toyota Hilux - 12345</option>
                                            <option value="v2">Nissan Urvan - 67890</option>
                                        </select>
                                        <p className="text-xs text-muted-foreground mt-1">Select from fleet or leave empty.</p>
                                   </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold uppercase text-gray-500">Or Manual Plate No.</Label>
                                        <input className="w-full border rounded p-2 text-sm" placeholder="123456" />
                                   </div>
                               </div>

                               {/* Employment Details */}
                               <div className="space-y-4">
                                   <h3 className="text-sm font-semibold border-l-2 border-blue-500 pl-2">Employment Status</h3>
                                   <div className="space-y-1">
                                        <Label className="text-xs font-semibold uppercase text-gray-500">Status</Label>
                                        <select className="w-full border rounded p-2 text-sm bg-white" 
                                            value={formData.employmentStatus || 'Active'} onChange={e => updateFormData({employmentStatus: e.target.value as any})}>
                                            <option value="Active">Active</option>
                                            <option value="On Leave">On Leave</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                   </div>
                                   <div className="space-y-1">
                                        <Label className="text-xs font-semibold uppercase text-gray-500">Joining Date</Label>
                                        <input type="date" className="w-full border rounded p-2 text-sm" 
                                            value={formData.startDate || ''} onChange={e => updateFormData({startDate: e.target.value})} />
                                   </div>
                                   <div className="space-y-1">
                                        <Label className="text-xs font-semibold uppercase text-gray-500">Notes</Label>
                                        <textarea className="w-full border rounded p-2 text-sm h-20" placeholder="Additional notes..." />
                                   </div>
                               </div>
                           </div>
                           
                           <div className="flex justify-between pt-6">
                               <Button variant="ghost" onClick={handleNext}>Skip Vehicle</Button>
                               <Button onClick={handleNext}>Continue</Button>
                           </div>
                       </div>
                   )}
                   {/* Step 4: Final Review */}
                   {currentStep === 4 && (
                        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4 text-center animate-in zoom-in-95 duration-300">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-sm">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Ready to Create Driver?</h2>
                            <p className="text-gray-500 max-w-md mx-auto">Please review the details below before creating the driver profile.</p>
                            
                            <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto space-y-2 text-sm mt-4 border border-gray-100">
                                <div className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="font-semibold">{formData.fullName}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Role:</span> <span className="font-semibold">{formData.employmentType || 'Driver'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">License:</span> <span className="font-semibold">{formData.position}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">System Access:</span> 
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${formData.systemAccess ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                        {formData.systemAccess ? 'YES' : 'NO'}
                                    </span>
                                </div>
                            </div>
                            
                            <Button className="w-full max-w-md mt-6 h-12 text-lg" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Confirm & Create Driver'}
                            </Button>
                        </div>
                   )}
                </>
            )}

            {/* Internal Staff Flow (Expanded MVP) */}
            {formData.staffType === 'internal' && (
                <>
                    {/* Step 2: Identity & Employment */}
                    {currentStep === 2 && (
                        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-2 border-b pb-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><User className="h-5 w-5" /></div>
                                <h2 className="text-lg font-semibold">1. Identity & Employment</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Full Name *</Label>
                                    <input className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                        placeholder="E.g. Ali Ahmed" 
                                        value={formData.fullName || ''} onChange={e => updateFormData({fullName: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Email Address *</Label>
                                    <input className="w-full border rounded p-2 text-sm" 
                                        placeholder="staff@company.com" type="email"
                                        value={formData.emailAddress || ''} onChange={e => updateFormData({emailAddress: e.target.value})} />
                                    <p className="text-[10px] text-gray-400">Will be used for login if access is granted.</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Mobile Number</Label>
                                    <input className="w-full border rounded p-2 text-sm" 
                                        placeholder="+974 0000 0000" 
                                        value={formData.mobileNumber || ''} onChange={e => updateFormData({mobileNumber: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Department</Label>
                                    <select className="w-full border rounded p-2 text-sm bg-white" 
                                        value={formData.department || ''} onChange={e => updateFormData({department: e.target.value})}>
                                        <option value="">Select Department</option>
                                        {deptOptions.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Job Title</Label>
                                    {jobOptions.length > 0 ? (
                                        <select className="w-full border rounded p-2 text-sm bg-white"
                                            value={formData.position || ''} onChange={e => updateFormData({position: e.target.value})}>
                                            <option value="">Select Job Title</option>
                                            {jobOptions.map(j => <option key={j} value={j}>{j}</option>)}
                                        </select>
                                    ) : (
                                        <input className="w-full border rounded p-2 text-sm" 
                                            placeholder="E.g. Operations Manager" 
                                            value={formData.position || ''} onChange={e => updateFormData({position: e.target.value})} />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Employment Status</Label>
                                    <select className="w-full border rounded p-2 text-sm bg-white" 
                                        value={formData.employmentStatus || 'Active'} onChange={e => updateFormData({employmentStatus: e.target.value as any})}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase text-gray-500">Joining Date</Label>
                                    <input type="date" className="w-full border rounded p-2 text-sm" 
                                        value={formData.startDate || ''} onChange={e => updateFormData({startDate: e.target.value})} />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleNext} disabled={!formData.fullName || !formData.emailAddress}>Continue</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Access & Security */}
                    {currentStep === 3 && (
                        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="flex items-center gap-2 border-b pb-4">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><ShieldCheck className="h-5 w-5" /></div>
                                <h2 className="text-lg font-semibold">2. Access & Security</h2>
                            </div>

                            {/* System Access Toggle - Already set in Step 1 but editable here */}
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold">Dashboard Access</h3>
                                    <p className="text-xs text-gray-500">Allow this user to log in to the admin dashboard.</p>
                                </div>
                                <div className="flex bg-white rounded-lg border p-1">
                                    <button onClick={() => updateFormData({systemAccess: true})} 
                                        className={`px-4 py-1.5 text-xs font-medium rounded ${formData.systemAccess ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}>Yes</button>
                                    <button onClick={() => updateFormData({systemAccess: false})}
                                        className={`px-4 py-1.5 text-xs font-medium rounded ${!formData.systemAccess ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}>No</button>
                                </div>
                            </div>

                            {formData.systemAccess && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold uppercase text-gray-500">System Role *</Label>
                                            <select className="w-full border rounded p-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                                                <option value="manager">Manager</option>
                                                <option value="admin">Administrator</option>
                                                <option value="supervisor">Supervisor</option>
                                                <option value="dispatcher">Dispatcher</option>
                                                <option value="finance">Finance</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold uppercase text-gray-500">Permission Scope</Label>
                                            <select className="w-full border rounded p-2 text-sm bg-white">
                                                <option value="full">Full Access (Role Default)</option>
                                                <option value="limited">Limited Access</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <input type="checkbox" id="invite" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                                        <label htmlFor="invite" className="text-sm text-gray-700">Send welcome email with login credentials</label>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 border-t pt-4">
                                 <Label className="text-xs font-semibold uppercase text-gray-500">Internal Notes</Label>
                                 <textarea className="w-full border rounded p-2 text-sm h-24" placeholder="Security notes, special instructions..." />
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={handleBack}>Back</Button>
                                <Button onClick={handleNext}>Review & Create</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                         <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4 text-center animate-in zoom-in-95 duration-300">
                             <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4 shadow-sm">
                                 <CheckCircle2 className="h-8 w-8" />
                             </div>
                             <h2 className="text-2xl font-bold text-gray-900">Create Internal Staff?</h2>
                             <p className="text-gray-500 max-w-md mx-auto">Please confirm the details below.</p>
                             
                             <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto space-y-3 text-sm mt-4 border border-gray-100">
                                 <div className="flex justify-between border-b border-gray-100 pb-2">
                                     <span className="text-gray-500">Name</span> 
                                     <span className="font-semibold">{formData.fullName}</span>
                                 </div>
                                 <div className="flex justify-between border-b border-gray-100 pb-2">
                                     <span className="text-gray-500">Email</span> 
                                     <span className="font-semibold">{formData.emailAddress}</span>
                                 </div>
                                 <div className="flex justify-between border-b border-gray-100 pb-2">
                                     <span className="text-gray-500">Role</span> 
                                     <span className="font-semibold">{formData.position}</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                     <span className="text-gray-500">System Access</span> 
                                     <span className={`px-2 py-0.5 rounded text-xs font-bold ${formData.systemAccess ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'}`}>
                                         {formData.systemAccess ? 'GRANTED' : 'NONE'}
                                     </span>
                                 </div>
                             </div>
                             
                             <Button className="w-full max-w-md mt-6 h-12 text-lg bg-purple-600 hover:bg-purple-700" onClick={handleSubmit} disabled={isSubmitting}>
                                 {isSubmitting ? 'Creating...' : 'Confirm & Create Staff'}
                             </Button>
                         </div>
                    )}
                </>
            )}

          </div>
        </div>
      </div>
      </DashboardLayout>
    );
  }
