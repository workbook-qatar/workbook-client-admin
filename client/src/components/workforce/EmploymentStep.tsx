import { useState, useEffect } from "react";
import { DollarSign, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmploymentStepProps {
  data: any;
  onChange: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function EmploymentStep({
  data,
  onChange,
  onContinue,
  onBack,
}: EmploymentStepProps) {
  // Config State
  const [jobTitles, setJobTitles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<any[]>([]);
  const [contractTypes, setContractTypes] = useState<any[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<any[]>([]);

  // Load Configuration
  useEffect(() => {
    const loadConfig = (key: string, setter: (val: any[]) => void, defaults: any[]) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        setter(JSON.parse(stored));
      } else {
        setter(defaults);
      }
    };

    loadConfig("vendor_job_titles", setJobTitles, [
      { name: "Cleaner" }, { name: "Driver" }, { name: "Supervisor" }
    ]);
    
    loadConfig("vendor_departments", setDepartments, [
      { name: "Operations" }, { name: "Sales" }, { name: "HR" }
    ]);

    loadConfig("vendor_employment_types", setEmploymentTypes, [
      { name: "Full Time" }, { name: "Part Time" }, { name: "Contract" }
    ]);

    loadConfig("vendor_contract_types", setContractTypes, [
      { name: "Permanent" }, { name: "Probation" }
    ]);

    loadConfig("vendor_salary_structures", setSalaryStructures, [
      { code: "fixed-monthly", name: "Fixed Monthly" },
      { code: "commission-based", name: "Commission Based" },
      { code: "hourly-rate", name: "Hourly Rate" },
      { code: "fixed-commission", name: "Fixed + Commission" }
    ]);
  }, []);

  const handleChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  const handleSalaryTypeChange = (value: string) => {
    // Clear previous salary details when salary type changes
    onChange({
      salaryType: value,
      monthlySalary: "",
      commissionPercentage: "",
      baseRate: "",
      hourlyRate: "",
      fixedMonthlySalary: "",
      commissionPercent: "",
    });
  };

  const canContinue = () => {
    // Basic fields validation
    if (!data.position || !data.department || !data.employmentType || !data.startDate || !data.salaryType || !data.contractType) {
      return false;
    }

    // Salary-specific validation
    switch (data.salaryType) {
      case "fixed-monthly":
        return !!data.monthlySalary;
      case "commission-based":
        return !!data.commissionPercentage;
      case "hourly-rate":
        return !!data.hourlyRate;
      case "fixed-commission":
        return !!data.fixedMonthlySalary && !!data.commissionPercent;
      default:
        return false;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Employment Details</h2>
        </div>
        <p className="text-gray-600">
          Specify the employment information and compensation details
        </p>
      </div>

      <div className="space-y-6">
        {/* Row 1: Position & Department */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="position">
              Position <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.position || ""}
              onValueChange={(value) => handleChange("position", value)}
            >
              <SelectTrigger className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {jobTitles.map((job: any) => (
                  <SelectItem key={job.name} value={job.name}>{job.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="department">
              Department <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.department || ""}
              onValueChange={(value) => handleChange("department", value)}
            >
              <SelectTrigger className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept: any) => (
                  <SelectItem key={dept.name} value={dept.name}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Employment Type & Start Date */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="employmentType">
              Employment Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.employmentType || ""}
              onValueChange={(value) => handleChange("employmentType", value)}
            >
              <SelectTrigger className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map((type: any) => (
                  <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="startDate">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={data.startDate || ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            />
          </div>
        </div>

        {/* Row 3: Contract Type */}
        <div className="grid grid-cols-2 gap-6">
          <div>
             <Label htmlFor="contractType">
              Contract Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.contractType || ""}
              onValueChange={(value) => handleChange("contractType", value)}
            >
              <SelectTrigger className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type: any) => (
                  <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3: Salary Type */}
        <div>
           <div className="flex items-center gap-2 mb-1.5">
            <Label htmlFor="salaryType">
              Salary Type <span className="text-red-500">*</span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select how the staff member is paid.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
           </div>
          <Select
            value={data.salaryType || ""}
            onValueChange={handleSalaryTypeChange}
          >
            <SelectTrigger className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
              <SelectValue placeholder="Select salary type" />
            </SelectTrigger>
            <SelectContent>
              {salaryStructures.map((structure: any) => (
                <SelectItem key={structure.code} value={structure.code}>{structure.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Salary Details Section */}
        {data.salaryType && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Salary Details</h3>
            </div>

            {/* Fixed Monthly */}
            {data.salaryType === "fixed-monthly" && (
              <div>
                <Label htmlFor="monthlySalary">
                  Monthly Salary (QAR) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="monthlySalary"
                  type="number"
                  placeholder="e.g. 3500"
                  value={data.monthlySalary || ""}
                  onChange={(e) => handleChange("monthlySalary", e.target.value)}
                  className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            )}

            {/* Commission-Based */}
            {data.salaryType === "commission-based" && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="commissionPercentage">
                    Commission Percentage <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="commissionPercentage"
                    type="number"
                    placeholder="e.g. 15"
                    value={data.commissionPercentage || ""}
                    onChange={(e) => handleChange("commissionPercentage", e.target.value)}
                    className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="baseRate">Base Rate (QAR)</Label>
                  <Input
                    id="baseRate"
                    type="number"
                    placeholder="e.g. 1000"
                    value={data.baseRate || ""}
                    onChange={(e) => handleChange("baseRate", e.target.value)}
                    className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Hourly-Rate */}
            {data.salaryType === "hourly-rate" && (
              <div>
                <Label htmlFor="hourlyRate">
                  Hourly Rate (QAR) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="e.g. 25"
                  value={data.hourlyRate || ""}
                  onChange={(e) => handleChange("hourlyRate", e.target.value)}
                  className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            )}

            {/* Fixed+Commission */}
            {data.salaryType === "fixed-commission" && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fixedMonthlySalary">
                    Fixed Monthly (QAR) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fixedMonthlySalary"
                    type="number"
                    placeholder="e.g. 2500"
                    value={data.fixedMonthlySalary || ""}
                    onChange={(e) => handleChange("fixedMonthlySalary", e.target.value)}
                    className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="commissionPercent">
                    Commission % <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="commissionPercent"
                    type="number"
                    placeholder="e.g. 10"
                    value={data.commissionPercent || ""}
                    onChange={(e) => handleChange("commissionPercent", e.target.value)}
                    className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onContinue}
          disabled={!canContinue()}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            canContinue()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Additional Information
        </button>
      </div>
    </div>
  );
}
