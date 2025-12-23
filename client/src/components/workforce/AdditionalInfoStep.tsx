import { useState, useEffect } from "react";
import { ClipboardList, Plus, Trash2, X, Upload, FileText, Loader2 } from "lucide-react";
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

interface AdditionalInfoStepProps {
  data: WorkforceMemberData;
  onUpdate: (data: Partial<WorkforceMemberData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const availableLanguages = ["English", "Hindi", "Arabic", "Urdu", "Bengali", "Tagalog", "Tamil", "Malayalam"];

export default function AdditionalInfoStep({ data, onUpdate, onSubmit, onBack, isSubmitting = false }: AdditionalInfoStepProps) {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [newCertName, setNewCertName] = useState("");
  const [newCertExpiry, setNewCertExpiry] = useState("");
  const [newCertFile, setNewCertFile] = useState<File | null>(null);
  const [customLanguage, setCustomLanguage] = useState("");
  const [customSkill, setCustomSkill] = useState("");

  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  
  useEffect(() => {
    const storedSkills = localStorage.getItem("vendor_skills");
    if (storedSkills) {
      const parsed = JSON.parse(storedSkills);
      // Map to names since the UI expects strings
      setAvailableSkills(parsed.map((s: any) => s.name));
    } else {
      setAvailableSkills(["AC mechanic", "Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry", "Welding", "Car Wash"]);
    }
  }, []);

  const handleChange = (field: keyof WorkforceMemberData, value: string) => {
    onUpdate({ [field]: value });
  };

  const addLanguage = (language: string) => {
    const current = data.languages || [];
    if (!current.includes(language)) {
      onUpdate({ languages: [...current, language] });
    }
    setShowLanguageDropdown(false);
  };

  const removeLanguage = (language: string) => {
    const current = data.languages || [];
    onUpdate({ languages: current.filter((l) => l !== language) });
  };

  const addSkill = (skill: string) => {
    const current = data.skills || [];
    if (!current.includes(skill)) {
      onUpdate({ skills: [...current, skill] });
    }
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill: string) => {
    const current = data.skills || [];
    onUpdate({ skills: current.filter((s) => s !== skill) });
  };

  const handleCertificateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCertFile(file);
    }
  };

  const addCertificate = () => {
    if (!newCertName || !newCertFile) return;
    
    const current = data.certificates || [];
    onUpdate({
      certificates: [
        ...current,
        {
          name: newCertName,
          expiry: newCertExpiry,
          fileId: `${newCertFile.name}-${Date.now()}`,
        },
      ],
    });
    
    // Reset form
    setNewCertName("");
    setNewCertExpiry("");
    setNewCertFile(null);
    setShowCertificateForm(false);
  };

  const removeCertificate = (index: number) => {
    const current = data.certificates || [];
    onUpdate({ certificates: current.filter((_, i) => i !== index) });
  };

  const canSubmit = (data.languages?.length || 0) > 0 && (data.skills?.length || 0) > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
        </div>
        <p className="text-gray-600">Complete the profile with languages, skills, and personal information</p>
      </div>

      <div className="space-y-6">
        {/* Row 1: Languages & Skills */}
        <div className="grid grid-cols-2 gap-6">
          {/* Languages */}
          <div>
            <Label>
              Languages <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors flex items-center justify-between"
              >
                <span>Select languages...</span>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showLanguageDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => addLanguage(lang)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      disabled={data.languages?.includes(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                  <div className="p-2 border-t border-gray-100">
                    <div className="flex gap-2">
                        <Input 
                            value={customLanguage}
                            onChange={(e) => setCustomLanguage(e.target.value)}
                            placeholder="Add other..."
                            className="h-8 text-xs"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && customLanguage) {
                                    addLanguage(customLanguage);
                                    setCustomLanguage("");
                                }
                            }}
                        />
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                                if (customLanguage) {
                                    addLanguage(customLanguage);
                                    setCustomLanguage("");
                                }
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {data.languages && data.languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {data.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {lang}
                    <button
                      onClick={() => removeLanguage(lang)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div>
            <Label>
              Skills & Expertise <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <button
                onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors flex items-center justify-between"
              >
                <span>Select skills...</span>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showSkillDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      disabled={data.skills?.includes(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                   <div className="p-2 border-t border-gray-100">
                    <div className="flex gap-2">
                        <Input 
                            value={customSkill}
                            onChange={(e) => setCustomSkill(e.target.value)}
                            placeholder="Add other..."
                            className="h-8 text-xs"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && customSkill) {
                                    addSkill(customSkill);
                                    setCustomSkill("");
                                }
                            }}
                        />
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                                if (customSkill) {
                                    addSkill(customSkill);
                                    setCustomSkill("");
                                }
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {data.skills && data.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {data.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Religion & Marital Status */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="religion">Religion</Label>
            <Select
              value={data.religion || ""}
              onValueChange={(value) => handleChange("religion", value)}
            >
              <SelectTrigger className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Islam">Islam</SelectItem>
                <SelectItem value="Christianity">Christianity</SelectItem>
                <SelectItem value="Hinduism">Hinduism</SelectItem>
                <SelectItem value="Buddhism">Buddhism</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select
              value={data.maritalStatus || ""}
              onValueChange={(value) => handleChange("maritalStatus", value)}
            >
              <SelectTrigger className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>



        {/* Certificates Section */}
        <div className="border-t border-gray-200 pt-6">
          <Label className="text-base font-medium text-gray-900">Certificates</Label>
          <p className="text-sm text-gray-600 mt-1 mb-4">Add professional certifications and qualifications</p>
          
          {/* Existing Certificates */}
          {data.certificates && data.certificates.length > 0 && (
            <div className="space-y-3 mb-4">
              {data.certificates.map((cert, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{cert.name}</h4>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {cert.expiry && (
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Expiry Date</p>
                              <p className="text-sm text-gray-900">{cert.expiry}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">File</p>
                            <p className="text-sm text-gray-700 truncate">{cert.fileId}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeCertificate(index)}
                      className="text-gray-400 hover:text-red-600 ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Certificate Form */}
          {showCertificateForm ? (
            <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
              <h4 className="font-medium text-gray-900 mb-4">New Certificate</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="certName">
                    Certificate Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="certName"
                    value={newCertName}
                    onChange={(e) => setNewCertName(e.target.value)}
                    placeholder="e.g., AC Technician License"
                    className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="certExpiry">
                    Expiry Date (Optional)
                  </Label>
                  <Input
                    id="certExpiry"
                    type="date"
                    value={newCertExpiry}
                    onChange={(e) => setNewCertExpiry(e.target.value)}
                    className="mt-1.5 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="certFile">
                    Upload File <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-white transition-colors bg-white">
                      <Upload className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {newCertFile ? newCertFile.name : "Click to upload certificate"}
                      </span>
                      <input
                        id="certFile"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleCertificateFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Supports PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={addCertificate}
                    disabled={!newCertName || !newCertFile}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Add Certificate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCertificateForm(false);
                      setNewCertName("");
                      setNewCertExpiry("");
                      setNewCertFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCertificateForm(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-center text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {data.certificates && data.certificates.length > 0 ? "Add Another Certificate" : "Add Certificate"}
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={!canSubmit || isSubmitting}
          className="bg-green-600 hover:bg-green-700 min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Workforce Member"
          )}
        </Button>
      </div>
    </div>
  );
}
