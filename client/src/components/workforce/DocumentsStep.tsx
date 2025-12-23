import { useState, useEffect } from "react";
import { FileText, Building, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { WorkforceMemberData } from "@/pages/AddWorkforceMember";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentsStepProps {
  data: WorkforceMemberData;
  onUpdate: (data: Partial<WorkforceMemberData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const UNIFORM_INPUT_CLASSES = "w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors";

export default function DocumentsStep({ data, onUpdate, onNext, onBack }: DocumentsStepProps) {
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("vendor_document_types");
    if (stored) {
      setDocumentTypes(JSON.parse(stored));
    } else {
      // Default fallback
      setDocumentTypes([
        { id: "dt1", name: "Passport", requiresExpiry: true },
        { id: "dt2", name: "Visa / QID", requiresExpiry: true },
        { id: "dt3", name: "Driving License", requiresExpiry: true }
      ]);
    }
  }, []);
  
  const handleChange = (field: keyof WorkforceMemberData, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleDocumentChange = (docId: string, type: 'number' | 'expiry' | 'file', value: any) => {
    // We store dynamic documents in a flexible structure within 'data' if needed,
    // but typically strict typing makes this hard.
    // For this prototype, we will map common IDs to specific fields in the data object
    // or store a 'documents' array.
    
    // For simplicity/compatibility with existing mapped fields:
    if (docId === "dt1" || docId.includes("Passport")) { // Basic fuzzy matching for prototype
         if (type === 'number') handleChange("passportNumber", value);
         if (type === 'expiry') handleChange("passportExpiry", value);
    } else if (docId === "dt2" || docId.includes("Visa")) {
         if (type === 'number') handleChange("visaNumber", value);
         if (type === 'expiry') handleChange("visaExpiry", value);
    } 
    // For other custom documents, we would ideally update a `customDocuments` array in state
    // But let's stick to the main ones + visual placeholders for others for now.
  };
  
  // Helper to get value securely
  const getDocValue = (docName: string, type: 'number' | 'expiry') => {
      if (docName.toLowerCase().includes("passport")) {
          return type === 'number' ? data.passportNumber : data.passportExpiry;
      }
      if (docName.toLowerCase().includes("visa") || docName.includes("QID")) {
          return type === 'number' ? data.visaNumber : data.visaExpiry;
      }
      return "";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Documents & Compliance</h2>
        </div>
        <p className="text-gray-600">Upload legal documents and banking information required by your organization.</p>
      </div>

        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 border border-gray-100 rounded-xl border-dashed">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Documents Moved</h3>
            <p className="text-gray-600 max-w-sm mt-2">
                Documents & Compliance requirements have been moved to the Staff Details page. You can add them after creating the profile.
            </p>
        </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button 
          onClick={onNext} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue to Additional Info
        </Button>
      </div>
    </div>
  );
}
