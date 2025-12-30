import { useState } from "react";
import { CheckCircle2, ShieldCheck, AlertCircle, FileText, UserCheck, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { WorkforceMemberData } from "@/pages/AddWorkforceMember";

interface ActivationStepProps {
  data: WorkforceMemberData;
  onUpdate: (data: Partial<WorkforceMemberData>) => void;
  onActivate: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function ActivationStep({ data, onUpdate, onActivate, onBack, isSubmitting }: ActivationStepProps) {
  // Mock validation states
  const [nocVerified, setNocVerified] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);
  
  // Computed validation checks
  const isPersonalComplete = !!(data.fullName && data.qidNumber && data.mobileNumber);
  const isEmploymentComplete = !!(data.position && data.department && data.startDate);
  const isDocumentsComplete = (data.certificates?.length || 0) > 0; // Simplified check
  const isSkillsComplete = (data.languages?.length || 0) > 0 && (data.skills?.length || 0) > 0;
  
  // Mock verification status (In a real app, these would come from backend/OTP flow)
  // For the wizard, we can assume they might have been verified or we allow manual override for admin
  const isPhoneVerified = data.phoneVerified || false;
  const isEmailVerified = data.emailVerified || false; // verificationStatus

  const canActivate = 
    isPersonalComplete && 
    isEmploymentComplete && 
    isDocumentsComplete && 
    isSkillsComplete &&
    // isPhoneVerified && // Strictness can be adjusted
    nocVerified && 
    contractSigned;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-sm">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Activate Workforce Member</h2>
        <p className="text-gray-500 max-w-md mx-auto mt-2">
          Perform final validation checks before activating this staff member.
          Active staff will be visible in the dispatch system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Validation Checklist */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-gray-600" />
            Activation Requirements
          </h3>
          
          <div className="space-y-4">
            <RequirementItem 
              label="Personal Information" 
              isMet={isPersonalComplete} 
              description="Basic identity details completed"
            />
            <RequirementItem 
              label="Employment Details" 
              isMet={isEmploymentComplete} 
              description="Role, department, and salary set"
            />
             <RequirementItem 
              label="Skills & Languages" 
              isMet={isSkillsComplete} 
              description="Required skills and languages added"
            />
            <RequirementItem 
              label="Documents & Certificates" 
              isMet={isDocumentsComplete} 
              description="At least one document/certificate uploaded"
            />
          </div>
        </div>

        {/* Verification Actions */}
        <div className="space-y-6">
           <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-gray-600" />
            Final Verification
          </h3>

          <Card className="p-4 space-y-4 bg-gray-50 border-dashed">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">NOC Validity</Label>
                <div className="text-xs text-gray-500">Verify No Objection Certificate</div>
              </div>
              <Switch checked={nocVerified} onCheckedChange={setNocVerified} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Contract Signed</Label>
                <div className="text-xs text-gray-500">Physical contract on file</div>
              </div>
              <Switch checked={contractSigned} onCheckedChange={setContractSigned} />
            </div>
          </Card>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isPhoneVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone Verification</p>
                    <p className="text-xs text-gray-500">{data.mobileNumber}</p>
                  </div>
               </div>
               <Badge variant={isPhoneVerified ? "default" : "secondary"}>
                  {isPhoneVerified ? "Verified" : "Pending"}
               </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isEmailVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email Verification</p>
                    <p className="text-xs text-gray-500">{data.emailAddress}</p>
                  </div>
               </div>
               <Badge variant={isEmailVerified ? "default" : "secondary"}>
                  {isEmailVerified ? "Verified" : "Pending"}
               </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <div className="flex items-center gap-4">
             {!canActivate && (
                 <p className="text-sm text-red-500 animate-pulse">
                     Complete all requirements to activate
                 </p>
             )}
            <Button 
            onClick={onActivate} 
            disabled={!canActivate || isSubmitting}
            className={`min-w-[200px] ${canActivate ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`}
            >
            {isSubmitting ? "Activating..." : "Activate Member"}
            </Button>
        </div>
      </div>
    </div>
  );
}

function RequirementItem({ label, isMet, description }: { label: string, isMet: boolean, description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 rounded-full p-1 ${isMet ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
        {isMet ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      </div>
      <div>
        <p className={`text-sm font-medium ${isMet ? 'text-gray-900' : 'text-gray-500'}`}>{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
