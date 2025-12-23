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
  staffType: "field-service" | "internal" | null;
  
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
  });

  const steps = [
    { id: 1, name: "Staff Type", icon: "👥" },
    { id: 2, name: "QID & Search", icon: "🔍" },
    { id: 3, name: "Basic Info", icon: "👤" },
    { id: 4, name: "Employment", icon: "💼" },
    { id: 5, name: "Documents", icon: "📄" },
    { id: 6, name: "Additional", icon: "📋" },
  ];

  const updateFormData = (data: Partial<WorkforceMemberData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
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
            : "NA";

        // Map Role Type
        const roleTypeMap: Record<string, string> = {
            "field-service": "field",
            "internal": "office"
        };
        
        const newStaff = {
            id: newId,
            staffId: staffId,
            name: formData.fullName || "Unknown",
            role: formData.position || "Staff",
            roleType: (formData.staffType && roleTypeMap[formData.staffType]) ? roleTypeMap[formData.staffType] : "part-time", 
            email: formData.emailAddress || "",
            phone: formData.mobileNumber || "",
            location: formData.city || "Qatar",
            status: "available",
            avatar: initials,
            avatarColor: "bg-blue-600", // Default color
            availabilityHours: 40,
            activeJobs: 0,
            rating: 5.0, // New staff start with 5
            jobsCompleted: 0,
            skills: formData.skills || []
        };

        staffList.push(newStaff);
        localStorage.setItem("vendor_staff", JSON.stringify(staffList));
        
        toast.success("Staff member added successfully");
        setLocation("/workforce");
        } catch (error) {
        console.error(error);
        toast.error("Failed to save staff member");
        setIsSubmitting(false);
        }
    }, 1500);
  };

  // Calculate progress: Granular based on field completion
  const getProgress = () => {
    let requiredFields = 0;
    let completedFields = 0;
    
    // Step 1: Staff Type
    requiredFields++;
    if (formData.staffType) completedFields++;
    
    // Step 2: QID & Search
    requiredFields += 2;
    if (formData.qidNumber) completedFields++;
    if (formData.fullName) completedFields++;
    
    // Step 3: Basic Info
    requiredFields += 3; // Mobile, Email, Gender
    if (formData.mobileNumber) completedFields++;
    if (formData.emailAddress) completedFields++;
    if (formData.gender) completedFields++;
    
    // Step 4: Employment
    requiredFields += 5; // Position, Dept, Emp Type, Start Date, Salary Type
    if (formData.position) completedFields++;
    if (formData.department) completedFields++;
    if (formData.employmentType) completedFields++;
    if (formData.startDate) completedFields++;
    if (formData.salaryType) completedFields++;
    
    // Conditional Salary Fields
    if (formData.salaryType === 'fixed-monthly') {
        requiredFields++; 
        if (formData.monthlySalary) completedFields++;
    } else if (formData.salaryType === 'commission-based') {
        requiredFields++;
        if (formData.commissionPercentage) completedFields++;
    } else if (formData.salaryType === 'hourly-rate') {
        requiredFields++;
        if (formData.hourlyRate) completedFields++;
    } else if (formData.salaryType === 'fixed-commission') {
        requiredFields += 2;
        if (formData.fixedMonthlySalary) completedFields++;
        if (formData.commissionPercent) completedFields++;
    }

    // Step 5: Documents (Not strict for progress but adding tracking)
    requiredFields += 3; // Passport, Visa, Bank (Just counting sections as roughly required)
    if (formData.passportNumber) completedFields++;
    if (formData.visaNumber) completedFields++;
    if (formData.bankName) completedFields++;

    // Step 6: Additional (Soft requirements for progress visualization)
    requiredFields += 2;
    if ((formData.languages?.length || 0) > 0) completedFields++;
    if ((formData.skills?.length || 0) > 0) completedFields++;
    
    return Math.min(100, Math.round((completedFields / requiredFields) * 100));
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
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Add Workforce Member</h1>
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
            
            {/* Progress Bar - Hide on small mobile if needed, or adjust */}
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
          {currentStep === 1 && (
            <StaffTypeStep
              data={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 2 && (
            <QIDSearchStep
              data={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <BasicInfoStep
              data={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <EmploymentStep
              data={formData}
              onChange={updateFormData}
              onContinue={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 5 && (
            <DocumentsStep
              data={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 6 && (
            <AdditionalInfoStep
              data={formData}
              onUpdate={updateFormData}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
