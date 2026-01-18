import { useState } from "react";
import { User, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkforceMemberData } from "@/pages/AddWorkforceMember";
import { 
  UNIFORM_INPUT_CLASSES, 
  UNIFORM_SELECT_TRIGGER_CLASSES, 
  UNIFORM_SELECT_CONTENT_CLASSES, 
  UNIFORM_SELECT_ITEM_CLASSES 
} from "@/components/workforce/form-styles";

interface DriverBasicInfoStepProps {
  data: WorkforceMemberData;
  onUpdate: (data: Partial<WorkforceMemberData>) => void;
  onNext: () => void;
  onBack: () => void;
  isLastStep?: boolean; // Added like BasicInfoStep
  isLoading?: boolean; // Added like BasicInfoStep
}

export default function DriverBasicInfoStep({ data, onUpdate, onNext, onBack, isLastStep, isLoading }: DriverBasicInfoStepProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(data.photoUrl || null);

  const handleChange = (field: keyof WorkforceMemberData, value: string) => {
    onUpdate({ [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        onUpdate({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    onUpdate({ photoUrl: "" });
  };

  const canContinue = 
    data.mobileNumber && 
    data.emailAddress && 
    data.gender;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Driver Details</h2>
        </div>
        <p className="text-gray-600">Review personal info and complete the draft profile.</p>
      </div>

      <div className="space-y-8">
        {/* Staff Photo Upload */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Driver Photo</Label>
          <p className="text-xs text-gray-500 mt-1 mb-3">Upload a professional photo (JPG, PNG, Max 5MB)</p>
          
          {!photoPreview ? (
            <label className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-400 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-colors flex items-center justify-center cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              <span>Click to upload photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative inline-block">
              <img
                src={photoPreview}
                alt="Driver photo preview"
                className="w-24 h-24 rounded-lg object-cover border border-gray-300"
              />
              <button
                onClick={removePhoto}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Personal Details Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Details</h3>
          
          {/* Row 1: Full Name & Nickname */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mt-0.5 mb-1.5">Auto-filled from License/QID</p>
              <Input
                type="text"
                value={data.fullName || ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={`${UNIFORM_INPUT_CLASSES} bg-gray-50`}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="nickname" className="text-sm font-medium text-gray-700">Nickname</Label>
              <div className="h-6"></div>
              <Input
                id="nickname"
                type="text"
                placeholder="Enter nickname"
                value={data.nickname || ""}
                onChange={(e) => handleChange("nickname", e.target.value)}
                className={UNIFORM_INPUT_CLASSES}
              />
            </div>
          </div>

          {/* Row 2: QID Number & Date of Birth */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                QID Number <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mt-0.5 mb-1.5">Auto-filled from License</p>
              <Input
                type="text"
                value={data.qidNumber || ""}
                className={`${UNIFORM_INPUT_CLASSES} bg-gray-50`}
                readOnly
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mt-0.5 mb-1.5">Auto-filled from License</p>
              <Input
                type="text"
                value={data.dateOfBirth || ""}
                className={`${UNIFORM_INPUT_CLASSES} bg-gray-50`}
                readOnly
              />
            </div>
          </div>

           {/* Row 3: Nationality & Gender */}
           <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Nationality <span className="text-red-500">*</span>
              </Label>
               <p className="text-xs text-gray-500 mt-0.5 mb-1.5">Auto-filled from License</p>
               <Input
                type="text"
                value={data.nationality || ""}
                className={`${UNIFORM_INPUT_CLASSES} bg-gray-50`}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </Label>
              <div className="h-6"></div>
              <Select
                value={data.gender || ""}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger id="gender" className={UNIFORM_SELECT_TRIGGER_CLASSES}>
                  <SelectValue placeholder="Select gender" className="text-gray-400" />
                </SelectTrigger>
                <SelectContent className={UNIFORM_SELECT_CONTENT_CLASSES}>
                  <SelectItem value="Male" className={UNIFORM_SELECT_ITEM_CLASSES}>Male</SelectItem>
                  <SelectItem value="Female" className={UNIFORM_SELECT_ITEM_CLASSES}>Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Mobile Number & Email */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="h-6"></div>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="+974 55687989"
                value={data.mobileNumber || ""}
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
                className={UNIFORM_INPUT_CLASSES}
              />
            </div>
            <div>
              <Label htmlFor="emailAddress" className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="h-6"></div>
              <Input
                id="emailAddress"
                type="email"
                placeholder="example@email.com"
                value={data.emailAddress || ""}
                onChange={(e) => handleChange("emailAddress", e.target.value)}
                className={UNIFORM_INPUT_CLASSES}
              />
            </div>
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
          disabled={!canContinue || isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Processing...' : 'Create Draft Profile'}
        </Button>
      </div>
    </div>
  );
}
