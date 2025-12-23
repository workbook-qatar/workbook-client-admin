import { Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkforceMemberData } from "@/pages/AddWorkforceMember";

interface StaffTypeStepProps {
  data: WorkforceMemberData;
  onUpdate: (data: Partial<WorkforceMemberData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StaffTypeStep({ data, onUpdate, onNext, onBack }: StaffTypeStepProps) {
  const handleSelectType = (type: "field-service" | "internal") => {
    onUpdate({ staffType: type });
  };

  const canContinue = data.staffType !== null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Staff Type Selection</h2>
        </div>
        <p className="text-gray-600">What type of staff member are you adding?</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Field Service Staff */}
        <button
          onClick={() => handleSelectType("field-service")}
          className={`
            border rounded-lg p-8 text-left transition-all hover:border-blue-500 hover:shadow-md
            ${data.staffType === "field-service" ? "border-blue-600 bg-blue-50" : "border-gray-200"}
          `}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`
              mb-4 p-4 rounded-full
              ${data.staffType === "field-service" ? "bg-blue-100" : "bg-gray-100"}
            `}>
              <Users className={`h-8 w-8 ${data.staffType === "field-service" ? "text-blue-600" : "text-gray-600"}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Field Service Staff</h3>
            <p className="text-sm text-gray-600 mb-4">
              Customer-facing professionals requiring Universal Workbook ID
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center mb-4 min-h-[58px]">
               {/* Content removed as per requirements to support multiple sectors */}
            </div>

            <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
              Workbook ID Required
            </div>
          </div>
        </button>

        {/* Internal Staff */}
        <button
          onClick={() => handleSelectType("internal")}
          className={`
            border rounded-lg p-8 text-left transition-all hover:border-blue-500 hover:shadow-md
            ${data.staffType === "internal" ? "border-blue-600 bg-blue-50" : "border-gray-200"}
          `}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`
              mb-4 p-4 rounded-full
              ${data.staffType === "internal" ? "bg-green-100" : "bg-gray-100"}
            `}>
              <Building className={`h-8 w-8 ${data.staffType === "internal" ? "text-green-600" : "text-gray-600"}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Internal Staff</h3>
            <p className="text-sm text-gray-600 mb-4">
              Internal team members and support roles
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                Manager
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                Supervisor
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                Driver
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                Admin
              </span>
            </div>

            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
              Basic Information Only
            </div>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className={canContinue ? "" : "opacity-50 cursor-not-allowed"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
