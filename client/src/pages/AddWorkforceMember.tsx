import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

// Step components
import StaffTypeStep from "@/components/workforce/StaffTypeStep";
import QIDSearchStep from "@/components/workforce/QIDSearchStep";
import BasicInfoStep from "@/components/workforce/BasicInfoStep";
import EmploymentStep from "@/components/workforce/EmploymentStep";
import DocumentsStep from "@/components/workforce/DocumentsStep";
import AdditionalInfoStep from "@/components/workforce/AdditionalInfoStep";

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
        // Default / Field Service (Legacy)
        return [
            { id: 1, name: "Staff Type", icon: "👥" },
            { id: 2, name: "QID & Search", icon: "🔍" },
            { id: 3, name: "Basic Info", icon: "👤" },
            { id: 4, name: "Employment", icon: "💼" },
            { id: 5, name: "Documents", icon: "📄" },
            { id: 6, name: "Additional", icon: "📋" },
        ];
    };

    const steps = getSteps();
  
    const updateFormData = (data: Partial<WorkforceMemberData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
    };
  
    const handleNext = () => {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    };
  
    const handleBack = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      } else {
        setLocation("/workforce");
      }
    };
  
    const handleSaveDraft = () => {
      toast.info("Draft saved (mock)");
    };
  
    const handleSubmit = () => {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
          try {
          // Load existing
          const stored = localStorage.getItem("vendor_staff");
          const staffList = stored ? JSON.parse(stored) : [];
  
          // Generate ID
          const newId = (Date.now()).toString();
          const staffId = `WB${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
          
          // Initials
          const initials = formData.fullName 
              ? formData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              : formData.name || "NA";
  
          // Map Role Type
          const roleTypeMap: Record<string, string> = {
              "field-service": "field",
              "internal": "office",
              "driver": "driver"
          };
          
          const newStaff = {
              id: newId,
              staffId: staffId,
              name: formData.fullName || formData.name || "Unknown", // Handle Name from different flows
              role: formData.position || "Staff",
              roleType: (formData.staffType && roleTypeMap[formData.staffType]) ? roleTypeMap[formData.staffType] : "part-time", 
              email: formData.emailAddress || "",
              phone: formData.mobileNumber || "",
              location: formData.city || "Qatar",
              
              // Status Model
              status: formData.workStatus || "offline", // Work Status
              employmentStatus: formData.employmentStatus || "Active", // Lifecycle Status
              
              avatar: initials,
              avatarColor: "bg-blue-600",
              availabilityHours: 40,
              activeJobs: 0,
              rating: 5.0,
              jobsCompleted: 0,
              skills: formData.skills || [],
              
              // New flags
              systemAccess: formData.systemAccess,
          };
  
          staffList.push(newStaff);
          localStorage.setItem("vendor_staff", JSON.stringify(staffList));
          
          toast.success("Staff member added successfully");
          // Route to detail page (Generic for now, or specific if we had them)
          // Ideally: /staff/${newId} -> Detail Page
          // The Detail Page needs to handle the type display.
          setLocation(`/staff/${newId}`);
          
          } catch (error) {
          console.error(error);
          toast.error("Failed to save staff member");
          setIsSubmitting(false);
          }
      }, 1500);
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
                    {currentStep === 3 && <BasicInfoStep data={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 4 && <EmploymentStep data={formData} onChange={updateFormData} onContinue={handleNext} onBack={handleBack} />}
                    {currentStep === 5 && <DocumentsStep data={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 6 && <AdditionalInfoStep data={formData} onUpdate={updateFormData} onSubmit={handleSubmit} onBack={handleBack} isSubmitting={isSubmitting} />}
                </>
            )}

            {/* Driver Flow (New & Simplified for Demo) */}
            {formData.staffType === 'driver' && (
                <>
                   {currentStep === 2 && (
                       <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                           <h2 className="text-lg font-semibold">Driver Profile</h2>
                            <label className="block space-y-1">
                                <span className="text-sm font-medium">Full Name</span>
                                <input className="w-full border rounded p-2" placeholder="Driver Name" 
                                    value={formData.fullName || ''} onChange={e => updateFormData({fullName: e.target.value})} />
                            </label>
                            <label className="block space-y-1">
                                <span className="text-sm font-medium">License Number</span>
                                <input className="w-full border rounded p-2" placeholder="DL-XXXX" />
                            </label>
                            <Button onClick={handleNext}>Continue</Button>
                       </div>
                   )}
                   {currentStep === 3 && (
                       <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                           <h2 className="text-lg font-semibold">Vehicle Assignment</h2>
                           <p className="text-gray-500">Assign a vehicle now or later.</p>
                           <Button onClick={handleNext}>Skip</Button>
                       </div>
                   )}
                   {currentStep === 4 && (
                        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4 text-center">
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">✅</div>
                            <h2 className="text-xl font-bold">Ready to Create Driver?</h2>
                            <p>Name: {formData.fullName}</p>
                            <p>Role: Driver</p>
                            <p>System Access: {formData.systemAccess ? 'Yes' : 'No'}</p>
                            <Button className="w-full mt-4" onClick={handleSubmit} disabled={isSubmitting}>create Driver</Button>
                        </div>
                   )}
                </>
            )}

            {/* Internal Staff Flow (New & Simplified) */}
            {formData.staffType === 'internal' && (
                <>
                    {currentStep === 2 && (
                        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                            <h2 className="text-lg font-semibold">Internal Staff Profile</h2>
                             <label className="block space-y-1">
                                 <span className="text-sm font-medium">Full Name</span>
                                 <input className="w-full border rounded p-2" placeholder="Staff Name" 
                                     value={formData.fullName || ''} onChange={e => updateFormData({fullName: e.target.value})} />
                             </label>
                             <label className="block space-y-1">
                                 <span className="text-sm font-medium">Job Title</span>
                                 <input className="w-full border rounded p-2" placeholder="e.g. Finance Manager"
                                     value={formData.position || ''} onChange={e => updateFormData({position: e.target.value})} />
                             </label>
                             <Button onClick={handleNext}>Continue to Permissions</Button>
                        </div>
                    )}
                    {currentStep === 3 && (
                         <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                             <h2 className="text-lg font-semibold">Permissions & Access</h2>
                             {formData.systemAccess ? (
                                 <div className="p-4 bg-green-50 border border-green-100 rounded text-green-800">
                                     System Access is <strong>ENABLED</strong>. Select Role:
                                     <div className="mt-2 space-y-2">
                                         <label className="flex items-center gap-2"><input type="radio" name="role" /> Administrator</label>
                                         <label className="flex items-center gap-2"><input type="radio" name="role" /> Dispatcher</label>
                                         <label className="flex items-center gap-2"><input type="radio" name="role" /> Viewer</label>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="p-4 bg-gray-100 border border-gray-200 rounded text-gray-600">
                                     System Access is <strong>DISABLED</strong>. This user will not have a login.
                                 </div>
                             )}
                             <Button onClick={handleNext}>Review</Button>
                         </div>
                    )}
                    {currentStep === 4 && (
                         <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4 text-center">
                             <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">✅</div>
                             <h2 className="text-xl font-bold">Create Internal Staff?</h2>
                             <p>Name: {formData.fullName}</p>
                             <p>Position: {formData.position}</p>
                             <Button className="w-full mt-4" onClick={handleSubmit} disabled={isSubmitting}>Create Staff</Button>
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
