import { Users, Building, Truck, ShieldCheck, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkforceMemberData } from "@/pages/AddWorkforceMember";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StaffTypeStepProps {
  data: WorkforceMemberData;
  onUpdate: (data: Partial<WorkforceMemberData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StaffTypeStep({ data, onUpdate, onNext, onBack }: StaffTypeStepProps) {
  const handleSelectType = (type: "field-service" | "internal" | "driver") => {
    // Reset system access when type changes to ensure valid state
    // For Field Service, we might default System Access to false/null to keep flow unchanged
    const defaultAccess = type === 'internal' ? true : false;
    onUpdate({ staffType: type, systemAccess: defaultAccess });
  };

  const handleSystemAccessChange = (value: string) => {
    onUpdate({ systemAccess: value === 'yes' });
  };

  const canContinue = data.staffType !== null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Select Member Role</h2>
        </div>
        <p className="text-gray-600">Choose the operational role for the new staff member.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Field Service Staff */}
        <button
          onClick={() => handleSelectType("field-service")}
          className={`
            border rounded-lg p-6 text-left transition-all hover:border-blue-500 hover:shadow-md h-full flex flex-col justify-between
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
              Technicians & Cleaners. Customer-facing roles.
            </p>
            
            <div className="mt-auto pt-4 border-t border-gray-200/50 w-full text-center">
                <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-semibold">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Workbook ID Required
                </span>
                <p className="text-xs text-gray-500 mt-2">Full workforce profile & operations features</p>
            </div>
          </div>
        </button>

        {/* Driver (NEW) */}
        <button
          onClick={() => handleSelectType("driver")}
          className={`
            border rounded-lg p-6 text-left transition-all hover:border-orange-500 hover:shadow-md h-full flex flex-col justify-between
            ${data.staffType === "driver" ? "border-orange-600 bg-orange-50" : "border-gray-200"}
          `}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`
              mb-4 p-4 rounded-full
              ${data.staffType === "driver" ? "bg-orange-100" : "bg-gray-100"}
            `}>
              <Truck className={`h-8 w-8 ${data.staffType === "driver" ? "text-orange-600" : "text-gray-600"}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Driver</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pickup only & Transport teams.
            </p>

            <div className="mt-auto pt-4 border-t border-gray-200/50 w-full text-center">
                <span className="inline-flex items-center px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs font-semibold">
                     Logistics Role
                </span>
                <p className="text-xs text-gray-500 mt-2">Driver profile, trips & route workflow</p>
            </div>
          </div>
        </button>

        {/* Internal Staff */}
        <button
          onClick={() => handleSelectType("internal")}
          className={`
            border rounded-lg p-6 text-left transition-all hover:border-green-500 hover:shadow-md h-full flex flex-col justify-between
            ${data.staffType === "internal" ? "border-green-600 bg-green-50" : "border-gray-200"}
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
              Admin, Finance, Dispatcher, Manager.
            </p>
            
            <div className="mt-auto pt-4 border-t border-gray-200/50 w-full text-center">
                <div className="flex flex-wrap gap-1 justify-center mb-2">
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Admin</span>
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Finance</span>
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Manager</span>
                </div>
                <p className="text-xs text-gray-500">Basic profile + dashboard permissions</p>
            </div>
          </div>
        </button>
      </div>

      {/* Axis B: System Access Step - Only for Driver & Internal */}
      {data.staffType && data.staffType !== 'field-service' && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-gray-700" /> System Access
              </h3>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1">
                      <p className="text-gray-700 font-medium mb-1">Does this member need dashboard access?</p>
                      <p className="text-sm text-muted-foreground">
                          Granting access will create a login account for them to access the admin portal.
                      </p>
                  </div>
                  
                  <div className="flex gap-4">
                      <button 
                        onClick={() => handleSystemAccessChange('yes')}
                        className={`flex items-center gap-3 px-5 py-3 rounded-lg border-2 transition-all ${data.systemAccess ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      >
                         <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${data.systemAccess ? 'border-green-600 bg-green-600' : 'border-gray-400'}`}>
                             {data.systemAccess && <CheckCircle2 className="w-4 h-4 text-white" />}
                         </div>
                         <div className="text-left">
                             <span className="font-bold block">Yes, grant access</span>
                             <span className="text-xs opacity-80">Create login credentials</span>
                         </div>
                      </button>

                      <button 
                         onClick={() => handleSystemAccessChange('no')}
                         className={`flex items-center gap-3 px-5 py-3 rounded-lg border-2 transition-all ${!data.systemAccess ? 'border-gray-600 bg-gray-100 text-gray-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      >
                         <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${!data.systemAccess ? 'border-gray-600 bg-gray-600' : 'border-gray-400'}`}>
                             {!data.systemAccess && <div className="w-2 h-2 bg-white rounded-full" />}
                         </div>
                         <div className="text-left">
                             <span className="font-bold block">No access</span>
                             <span className="text-xs opacity-80">Operational only</span>
                         </div>
                      </button>
                  </div>
              </div>

              {/* Conditional Hint based on selection */}
              {data.systemAccess && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-green-700 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> You will be asked to configure permissions in the next steps.
                  </div>
              )}
               {!data.systemAccess && data.staffType === 'internal' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-amber-600 flex items-center gap-2">
                      <Users className="h-4 w-4" /> Internal staff usually require system access. Proceed only if this is for record-keeping.
                  </div>
              )}
          </div>
      )}

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
          {data.staffType === 'field-service' ? 'Continue' : 'Next Step →'}
        </Button>
      </div>
    </div>
  );
}
