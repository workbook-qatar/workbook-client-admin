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

      <div className="space-y-8">
        
        {/* Dynamic Documents Section */}
        <div className="space-y-6">
            {documentTypes.map((doc) => (
                <div key={doc.id} className="border border-gray-100 bg-gray-50/50 rounded-xl p-5 hover:border-blue-100 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            {doc.name}
                            {doc.status === "inactive" && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-500">Inactive</span>}
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ID Number */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">{doc.name} Number</Label>
                            <Input
                                type="text"
                                placeholder={`Enter ${doc.name} Number`}
                                value={getDocValue(doc.name, 'number') || ""}
                                onChange={(e) => handleDocumentChange(doc.id, 'number', e.target.value)}
                                className={`${UNIFORM_INPUT_CLASSES} mt-1.5`}
                            />
                        </div>

                        {/* Expiry Date (Conditional) */}
                        {doc.requiresExpiry && (
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Expiry Date</Label>
                                <Input
                                    type="date"
                                    value={getDocValue(doc.name, 'expiry') || ""}
                                    onChange={(e) => handleDocumentChange(doc.id, 'expiry', e.target.value)}
                                    className={`${UNIFORM_INPUT_CLASSES} mt-1.5`}
                                />
                            </div>
                        )}
                        
                        {/* File Upload */}
                        <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-700">Upload Copy</Label>
                            <div className="mt-1.5 flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-400">PDF, PNG, JPG up to 10MB</p>
                                    </div>
                                    <Input type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {documentTypes.length === 0 && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        No document requirements configured. Go to Settings &gt; Documents & Compliance to add them.
                    </AlertDescription>
                </Alert>
            )}
        </div>

        {/* Bank Information (Static for now) */}
        <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-6">
                <Building className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Bank Account Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-4">
                 <div>
                    <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">Bank Name</Label>
                    <Input
                        id="bankName"
                        type="text"
                        placeholder="e.g. QNB"
                        value={data.bankName || ""}
                        onChange={(e) => handleChange("bankName", e.target.value)}
                        className={`${UNIFORM_INPUT_CLASSES} mt-1`}
                    />
                </div>
                 <div>
                    <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">Account Number</Label>
                    <Input
                        id="accountNumber"
                        type="text"
                        placeholder="e.g. 0013-..."
                        value={data.accountNumber || ""}
                        onChange={(e) => handleChange("accountNumber", e.target.value)}
                        className={`${UNIFORM_INPUT_CLASSES} mt-1`}
                    />
                </div>
            </div>
            <div>
                 <Label htmlFor="iban" className="text-sm font-medium text-gray-700">IBAN</Label>
                 <Input
                    id="iban"
                    type="text"
                    placeholder="e.g. QA..."
                    value={data.iban || ""}
                    onChange={(e) => handleChange("iban", e.target.value)}
                    className={`${UNIFORM_INPUT_CLASSES} mt-1`}
                 />
            </div>
        </div>

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
