import { useState, useRef } from "react";
import { Upload, Search, CheckCircle2, FileText, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkforceMemberData } from "@/pages/AddWorkforceMember";
import { toast } from "sonner";

interface DriverLicenseStepProps {
  data: WorkforceMemberData;
  onUpdate: (data: Partial<WorkforceMemberData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DriverLicenseStep({ data, onUpdate, onNext, onBack }: DriverLicenseStepProps) {
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
      // Simulate extracted data from Driving License
      // In Qatar, License # is same as QID
      onUpdate({
        qidFile: file, // Reusing qidFile struct or can use licenseFile if added
        fullName: "ASHARAF KOVVAPPURAM VAYANORA",
        qidNumber: "29435619947", // Extracted ID
        licenseNumber: "29435619947", // Same as QID
        licenseCategory: "Light Vehicle",
        licenseExpiry: "06/05/2030",
        dateOfBirth: "14/11/1994",
        nationality: "India",
      });
      setIsUploading(false);
      setUploadSuccess(true);
    }, 1500);
  };

  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearch = () => {
    // Mock Search Logic
    if (searchQuery.includes("WB") || searchQuery.includes("100")) {
        setSearchResults({
            name: "Muhammed Driver (Existing)",
            id: "WB-00123",
            qid: "28567299102",
            license: "28567299102"
        });
    } else {
        setSearchResults(null);
        toast.error("No driver found with this ID.");
    }
  };

  const handleSelectResult = () => {
      if (!searchResults) return;
      onUpdate({
          qidNumber: searchResults.qid,
          licenseNumber: searchResults.license,
          fullName: searchResults.name,
          dateOfBirth: "01/01/1985",
          nationality: "Existing Record"
      });
      setUploadSuccess(true);
      toast.success("Linked to existing Driver ID");
  };

  const canContinue = uploadSuccess || data.qidNumber;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BadgeCheck className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">License Upload & Verification</h2>
        </div>
        <p className="text-gray-600">Start by uploading the Driving License for extraction or search existing ID</p>
      </div>

      {/* Search Workbook ID */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Search Existing Driver
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Search by name, License, or QID number
        </p>
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Enter name, License No, or QID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          />
          <Button onClick={handleSearch} className="bg-black hover:bg-gray-800">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Mock Search Results */}
        {searchResults && (
            <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Search Results</h4>
                <div className="flex items-center justify-between bg-white p-3 border rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                            {searchResults.name.substring(0,2)}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">{searchResults.name}</div>
                            <div className="text-xs text-gray-500 flex gap-2">
                                <span>Lic: {searchResults.license}</span>
                            </div>
                        </div>
                    </div>
                    <Button size="sm" onClick={handleSelectResult} variant={uploadSuccess ? "outline" : "default"}>
                        {uploadSuccess ? "Selected" : "Select"}
                    </Button>
                </div>
            </div>
        )}
      </div>

      {/* Upload License Document */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Upload Driving License
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Upload License for automatic data extraction (Front Side)
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
            <p className="text-gray-700 font-medium mb-1">Click to upload Driving License</p>
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
                        fullName: "Manual Entry Driver",
                        qidNumber: "",
                        licenseNumber: "",
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
            <p className="text-green-700 font-semibold text-lg mb-1">License Uploaded / Verified Successfully</p>
            <p className="text-green-600 text-sm">Data extracted and ready for review</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => { setUploadSuccess(false); onUpdate({ qidNumber: undefined, licenseNumber: undefined }); }}>
                Reset
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse" style={{ width: "75%" }} />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">Extracting license data...</p>
          </div>
        )}
      </div>

      {/* Extracted Data */}
      {uploadSuccess && (data.licenseNumber || data.qidNumber) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Extracted / Verified Data</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="font-medium text-gray-900">{data.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">License No / QID</p>
              <p className="font-medium text-gray-900">{data.licenseNumber || data.qidNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">License Category</p>
              <p className="font-medium text-gray-900">{data.licenseCategory || 'N/A'}</p>
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
          Continue to Details
        </Button>
      </div>
    </div>
  );
}
