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

interface BasicInfoStepProps {
  data: WorkforceMemberData;
  onUpdate: (data: Partial<WorkforceMemberData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Uniform field classes for consistency
const UNIFORM_INPUT_CLASSES = "w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors";
const UNIFORM_SELECT_TRIGGER_CLASSES = "w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors";
const UNIFORM_SELECT_CONTENT_CLASSES = "border border-gray-200 rounded-lg shadow-lg bg-white";
const UNIFORM_SELECT_ITEM_CLASSES = "px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer";

export default function BasicInfoStep({ data, onUpdate, onNext, onBack }: BasicInfoStepProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        </div>
        <p className="text-gray-600">Review and complete the auto-filled information from QID</p>
      </div>

      <div className="space-y-6">
        {/* Staff Photo Upload */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Staff Photo</Label>
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
                alt="Staff photo preview"
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
              <p className="text-xs text-gray-500 mt-0.5 mb-1.5">Auto-filled from QID</p>
              <Input
                type="text"
                value={data.fullName || ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={`${UNIFORM_INPUT_CLASSES} bg-gray-50`}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="nickname" className="text-sm font-medium text-gray-700">Nickname</Label>
              <div className="h-6"></div> {/* Spacer to align with Full Name */}
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
              <p className="text-xs text-gray-500 mt-0.5 mb-1.5">Auto-filled from QID</p>
              <Input
                type="text"
                value={data.qidNumber || ""}
                onChange={(e) => handleChange("qidNumber", e.target.value)}
                className={`${UNIFORM_INPUT_CLASSES} bg-gray-50`}
                disabled
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mt-0.5 mb-1.5">Auto-filled from QID</p>
              <Input
                type="date"
                value={data.dateOfBirth ? new Date(data.dateOfBirth.split('/').reverse().join('-')).toISOString().split('T')[0] : ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className={`${UNIFORM_INPUT_CLASSES} bg-gray-50`}
                disabled
              />
            </div>
          </div>

          {/* Row 3: Nationality & Gender */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Nationality <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mt-0.5 mb-1.5">Auto-filled from QID</p>
              <Select
                value={data.nationality || ""}
                onValueChange={(value) => handleChange("nationality", value)}
                disabled
              >
                <SelectTrigger className={`${UNIFORM_SELECT_TRIGGER_CLASSES} bg-gray-50`}>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent className={UNIFORM_SELECT_CONTENT_CLASSES}>
                  <SelectItem value="India" className={UNIFORM_SELECT_ITEM_CLASSES}>India</SelectItem>
                  <SelectItem value="Pakistan" className={UNIFORM_SELECT_ITEM_CLASSES}>Pakistan</SelectItem>
                  <SelectItem value="Bangladesh" className={UNIFORM_SELECT_ITEM_CLASSES}>Bangladesh</SelectItem>
                  <SelectItem value="Philippines" className={UNIFORM_SELECT_ITEM_CLASSES}>Philippines</SelectItem>
                  <SelectItem value="Nepal" className={UNIFORM_SELECT_ITEM_CLASSES}>Nepal</SelectItem>
                  <SelectItem value="Sri Lanka" className={UNIFORM_SELECT_ITEM_CLASSES}>Sri Lanka</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </Label>
              <div className="h-6"></div> {/* Spacer to align with Nationality */}
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

          {/* Row 4: Mobile Number */}
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
          disabled={!canContinue}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue to Employment
        </Button>
      </div>
    </div>
  );
}
