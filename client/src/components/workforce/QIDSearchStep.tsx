import { useState, useRef } from "react";
import { Upload, Search, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkforceMemberData } from "@/pages/AddWorkforceMember";
import { toast } from "sonner";

interface QIDSearchStepProps {
  data: WorkforceMemberData;
  onUpdate: (data: Partial<WorkforceMemberData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function QIDSearchStep({ data, onUpdate, onNext, onBack }: QIDSearchStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload JPG, PNG or PDF."); 
        return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        toast.error("File too large. Max size is 5MB.");
        return;
    }

    setIsUploading(true);

    // Simulate upload and extraction
    setTimeout(() => {
      // Simulate extracted data from Qatar ID
      onUpdate({
        qidFile: file,
        fullName: "ASHARAF KOVVAPPURAM VAYANORA",
        qidNumber: "29435619947",
        dateOfBirth: "14/11/1994",
        nationality: "India",
      });
      setIsUploading(false);
      setUploadSuccess(true);
    }, 1500);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // TODO: Implement search functionality
  };

  const canContinue = uploadSuccess || data.qidNumber;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">QID Upload & Workbook ID Search</h2>
        </div>
        <p className="text-gray-600">Start by uploading the QID document and searching for existing Workbook ID</p>
      </div>

      {/* Search Workbook ID */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Search Workbook ID
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Search by name, QID number, or Workbook ID
        </p>
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Enter name, QID, or Workbook ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          />
          <Button onClick={handleSearch} className="bg-black hover:bg-gray-800">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Upload QID Document */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Upload QID Document
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Upload QID for automatic data extraction
        </p>

        {!uploadSuccess ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-1">Click to upload QID document</p>
            <p className="text-sm text-gray-500">Supports JPG, PNG, PDF (Max 5MB)</p>
            <Button variant="outline" className="mt-4" type="button">
              Choose File
            </Button>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
                <Button variant="link" className="text-blue-600" onClick={(e) => {
                    e.stopPropagation();
                    // Bypass logic
                    onUpdate({
                        qidFile: null,
                        fullName: "Manual Entry Staff",
                        qidNumber: "00000000000",
                        dateOfBirth: "01/01/1990",
                        nationality: "Other",
                    });
                    setUploadSuccess(true);
                }}>
                    Enter Manually (Skip Upload)
                </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-green-500 bg-green-50 rounded-lg p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="text-green-700 font-semibold text-lg mb-1">QID Uploaded / Verified Successfully</p>
            <p className="text-green-600 text-sm">Data ready for verification</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => { setUploadSuccess(false); onUpdate({ qidNumber: undefined }); }}>
                Reset
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse" style={{ width: "75%" }} />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">Extracting data from QID...</p>
          </div>
        )}
      </div>

      {/* Extracted Data */}
      {uploadSuccess && data.qidNumber && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Data Extracted from QID</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="font-medium text-gray-900">{data.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">QID Number</p>
              <p className="font-medium text-gray-900">{data.qidNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
              <p className="font-medium text-gray-900">{data.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Nationality</p>
              <p className="font-medium text-gray-900">{data.nationality}</p>
            </div>
          </div>
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
          className={canContinue ? "bg-blue-600 hover:bg-blue-700" : "opacity-50 cursor-not-allowed"}
        >
          Continue to Basic Information
        </Button>
      </div>
    </div>
  );
}
