import React, { useState } from "react";
import { useLocation } from "wouter";
import { useOrganization } from "@/contexts/OrganizationContext";
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
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle2, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  UNIFORM_INPUT_CLASSES, 
  UNIFORM_SELECT_TRIGGER_CLASSES 
} from "@/components/workforce/form-styles";

const CATEGORY_OPTIONS = [
  "Hourly Home Cleaning",
  "Deep Cleaning",
  "Furniture Cleaning",
  "Pest Control",
  "AC Cleaning",
  "Mobile Car Wash",
  "Beauty Care at Home"
];

const STATE_OPTIONS_QATAR = [
  "Doha",
  "Al Rayyan",
  "Al Wakrah",
  "Al Daayen",
  "Al Khor",
  "Umm Salal",
  "Al Shamal",
  "Al Sheehaniya"
];

export default function CreateOrganization() {
  const { createOrganization } = useOrganization();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"welcome" | "details" | "success">("welcome");
  const [showAddress, setShowAddress] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "Qatar",
    state: "", 
    categories: [] as string[],
    currency: "QAR",
    language: "English",
    portalUrl: "",
    timezone: "Asia/Qatar",
    logo: null as File | null,
    street1: "",
    street2: "",
    city: "",
    zipCode: "",
  });

  const handleWelcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.location) {
      setStep("details");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Transform categories to industry string or handle as needed by backend
    // For now we just pass the object, assuming backend handles extra fields or ignores them
    await createOrganization({
        ...formData,
        industry: formData.categories.join(", ") // Simple join for compatibility if backend expects string
    });
    setIsLoading(false);
    setStep("success");
  };

  const toggleCategory = (category: string) => {
      setFormData(prev => {
          const exists = prev.categories.includes(category);
          if (exists) {
              return { ...prev, categories: prev.categories.filter(c => c !== category) };
          } else {
              return { ...prev, categories: [...prev.categories, category] };
          }
      });
  };

  // Step 1: Welcome Screen (Simple Entry)
  if (step === "welcome") {
      return (
        <div className="min-h-screen bg-white flex flex-col pt-20 items-center">
            {/* App Branding */}
            <div className="mb-12 flex items-center gap-2">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Building2 className="h-6 w-6" />
                </div>
                <div className="h-8 border-l border-gray-300 mx-2"></div>
                <span className="text-gray-500 text-sm">Workbook is your end-to-end business software.</span>
            </div>

            <div className="w-full max-w-2xl px-6">
                <h1 className="text-3xl font-heading font-medium text-gray-900 mb-2">Welcome,</h1>
                <p className="text-gray-500 mb-8">
                    Let us know where your business is & we'll optimize Workbook accordingly!
                </p>

                <form onSubmit={handleWelcomeSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <Label htmlFor="welcomeOrgName" className="text-xs font-semibold uppercase text-gray-500">
                            Organization Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="welcomeOrgName"
                            placeholder="e.g. My Organization"
                            className={UNIFORM_INPUT_CLASSES}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="welcomeLocation" className="text-xs font-semibold uppercase text-gray-500">
                            Organization Location <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Select
                                value={formData.location}
                                onValueChange={(val) => setFormData({ ...formData, location: val })}
                                required
                            >
                                <SelectTrigger className={UNIFORM_SELECT_TRIGGER_CLASSES}>
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Qatar">Qatar</SelectItem>
                                    <SelectItem value="UAE">UAE</SelectItem>
                                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Button 
                            type="submit" 
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px] h-11 text-base shadow-sm"
                            disabled={!formData.name}
                        >
                            Let's get started!
                        </Button>
                        <Button 
                            type="button"
                            variant="outline"
                            size="lg"
                            className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 h-11 min-w-[100px]"
                            onClick={() => setLocation("/organizations")}
                        >
                            Cancel
                        </Button>
                    </div>
                    
                    <div className="pt-4">
                       <a href="#" className="text-xs text-blue-500 hover:underline">Privacy Policy</a>
                    </div>
                </form>
            </div>
            
            {/* Background Decoration */}
            <div className="fixed bottom-0 right-0 p-10 opacity-10 pointer-events-none">
                 <Building2 className="h-64 w-64 text-blue-900" />
            </div>
        </div>
      );
  }

  // Step 3: Success Screen
  if (step === "success") {
    return (
      <div className="relative min-h-screen w-full bg-gray-50 overflow-hidden font-sans">
        {/* Mock Dashboard Background */}
        <div className="absolute inset-0 flex opacity-30 select-none pointer-events-none filter blur-[2px]">
            {/* Sidebar Mock */}
            <div className="w-64 bg-[#1e293b] h-full flex flex-col p-4 gap-4">
                <div className="h-8 w-8 bg-blue-500 rounded mb-6"></div>
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-2 w-3/4 bg-slate-700/50 rounded"></div>
                    ))}
                </div>
            </div>
            {/* Main Content Mock */}
            <div className="flex-1 flex flex-col h-full">
                <div className="h-16 bg-white border-b border-gray-200 w-full"></div>
                <div className="p-8 flex-1 bg-gray-50/50 p-6 space-y-6">
                    <div className="h-32 bg-white rounded-lg border border-gray-200 w-full"></div>
                    <div className="grid grid-cols-3 gap-6">
                         <div className="h-40 bg-white rounded-lg border border-gray-200"></div>
                         <div className="h-40 bg-white rounded-lg border border-gray-200"></div>
                         <div className="h-40 bg-white rounded-lg border border-gray-200"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Overlay Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-[1px]">
             <Card className="w-full max-w-lg border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-white relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Decoration: Confetti / Abstract shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                     <svg className="absolute top-0 left-0 w-full h-40 opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <circle cx="10" cy="20" r="2" fill="#3b82f6" />
                        <circle cx="90" cy="10" r="3" fill="#ef4444" />
                        <rect x="20" y="30" width="2" height="4" fill="#10b981" transform="rotate(45 20 30)" />
                        <rect x="80" y="40" width="3" height="3" fill="#f59e0b" transform="rotate(12 80 40)" />
                        <circle cx="50" cy="15" r="2" fill="#8b5cf6" />
                        <path d="M 0,0 Q 50,50 100,0" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                     </svg>
                </div>

                <CardContent className="pt-12 pb-12 px-10 text-center relative z-10">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-white">
                        {formData.logo ? (
                            <img 
                                src={URL.createObjectURL(formData.logo)} 
                                alt="Logo" 
                                className="w-16 h-16 object-contain rounded-full bg-white/10" 
                            />
                        ) : (
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                {formData.name.substring(0, 2).toUpperCase()}
                            </h1>
                        )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome aboard!
                    </h2>
                    
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
                        Thank you for choosing Workbook. Before you start, we'd love to show you around and help you navigate the app.
                    </p>

                    <div className="space-y-4">
                        <Button 
                            size="lg" 
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-200"
                            onClick={() => setLocation("/")}
                        >
                            Show Me Around
                        </Button>
                        <button 
                            type="button"
                            className="text-sm text-blue-500 hover:text-blue-700 font-medium hover:underline transition-all"
                            onClick={() => setLocation("/")}
                        >
                            No thanks, I'll explore it.
                        </button>
                    </div>
                </CardContent>
             </Card>
        </div>
      </div>
    );
  }

  // Step 2: Detailed Form
  return (
    <div className="min-h-screen bg-white flex flex-col pt-10 items-center">
        {/* App Branding */}
        <div className="mb-8 flex items-center gap-2">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Building2 className="h-6 w-6" />
            </div>
            <div className="h-8 border-l border-gray-300 mx-2"></div>
            <span className="text-gray-500 text-sm">Workbook is your end-to-end business software.</span>
        </div>

      <Card className="w-full max-w-3xl border-none shadow-none">
          <CardContent className="p-0">
            <div className="text-center mb-10">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Set up your organization profile
                </h1>
                <div className="w-8 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 px-4 sm:px-8">
              {/* Organization Details Section */}
              <div className="space-y-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Organizational Details
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="orgName" className="text-xs font-semibold uppercase text-gray-500">Organization Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="orgName"
                      placeholder="e.g. My Organization"
                      className={UNIFORM_INPUT_CLASSES}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                      <Label className="text-xs font-semibold uppercase text-gray-500">Business Categories</Label>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="outline" className={`${UNIFORM_INPUT_CLASSES} flex justify-between items-center font-normal px-3`} type="button">
                                  <span className={formData.categories.length === 0 ? "text-gray-500" : "text-gray-900"}>
                                      {formData.categories.length === 0 
                                          ? "Select Categories" 
                                          : `${formData.categories.length} Selected`
                                      }
                                  </span>
                                  <ChevronDown className="h-4 w-4 opacity-50" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto bg-white" align="start">
                              {CATEGORY_OPTIONS.map((category) => (
                                  <div 
                                      key={category}
                                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 text-gray-900"
                                      onClick={(e) => {
                                          e.preventDefault();
                                          toggleCategory(category);
                                      }}
                                  >
                                      <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300 bg-white">
                                          {formData.categories.includes(category) && (
                                              <div className="h-4 w-4 bg-blue-600 flex items-center justify-center rounded-sm text-white border-blue-600">
                                                  <Check className="h-3 w-3" />
                                              </div>
                                          )}
                                      </div>
                                      {category}
                                  </div>
                              ))}
                          </DropdownMenuContent>
                      </DropdownMenu>
                      {formData.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                              {formData.categories.map(cat => (
                                  <span key={cat} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                      {cat}
                                  </span>
                              ))}
                          </div>
                      )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label htmlFor="location" className="text-xs font-semibold uppercase text-gray-500">Organization Location <span className="text-red-500">*</span></Label>
                      <Select
                          value={formData.location}
                          onValueChange={(val) => setFormData({ ...formData, location: val })}
                          required
                        >
                          <SelectTrigger className={UNIFORM_SELECT_TRIGGER_CLASSES}>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Qatar">Qatar</SelectItem>
                            <SelectItem value="UAE">UAE</SelectItem>
                            <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                       <Label htmlFor="state" className="text-xs font-semibold uppercase text-gray-500">State/Province <span className="text-red-500">*</span></Label>
                       <Select
                          value={formData.state}
                          onValueChange={(val) => setFormData({ ...formData, state: val })}
                        >
                          <SelectTrigger className={UNIFORM_SELECT_TRIGGER_CLASSES}>
                            <SelectValue placeholder="Select State/Province" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                              {STATE_OPTIONS_QATAR.map(state => (
                                  <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                          </SelectContent>
                       </Select>
                    </div>
                  </div>

                  {!showAddress ? (
                      <div>
                          <button 
                            type="button" 
                            onClick={() => setShowAddress(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                          >
                              <span className="text-lg leading-none mb-0.5">+</span> Add Organization Address
                          </button>
                      </div>
                  ) : (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <Input
                            placeholder="Street 1"
                            className={UNIFORM_INPUT_CLASSES}
                            value={formData.street1}
                            onChange={(e) => setFormData({ ...formData, street1: e.target.value })}
                          />
                          <Input
                            placeholder="Street 2"
                            className={UNIFORM_INPUT_CLASSES}
                            value={formData.street2}
                            onChange={(e) => setFormData({ ...formData, street2: e.target.value })}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Input
                                placeholder="City"
                                className={UNIFORM_INPUT_CLASSES}
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              />
                              <Input
                                placeholder="ZIP/Postal Code"
                                className={UNIFORM_INPUT_CLASSES}
                                value={formData.zipCode}
                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                              />
                          </div>
                      </div>
                  )}
                </div>
              </div>

              {/* Regional Settings Section */}
              <div className="space-y-6 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Regional Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label htmlFor="currency" className="text-xs font-semibold uppercase text-gray-500">Currency <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(val) => setFormData({ ...formData, currency: val })}
                    >
                      <SelectTrigger className={UNIFORM_SELECT_TRIGGER_CLASSES}>
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QAR">QAR - Qatari Riyal</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="language" className="text-xs font-semibold uppercase text-gray-500">Language <span className="text-red-500">*</span></Label>
                    <Select
                        value={formData.language}
                        onValueChange={(val) => setFormData({ ...formData, language: val })}
                      >
                        <SelectTrigger className={UNIFORM_SELECT_TRIGGER_CLASSES}>
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Arabic">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                  
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="timezone" className="text-xs font-semibold uppercase text-gray-500">Time Zone <span className="text-red-500">*</span></Label>
                    <Select
                        value={formData.timezone}
                        onValueChange={(val) => setFormData({ ...formData, timezone: val })}
                      >
                        <SelectTrigger className={UNIFORM_SELECT_TRIGGER_CLASSES}>
                          <SelectValue placeholder="Select Time Zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Qatar">(GMT+03:00) Qatar Standard Time</SelectItem>
                          <SelectItem value="Asia/Dubai">(GMT+04:00) Gulf Standard Time</SelectItem>
                          <SelectItem value="Asia/Riyadh">(GMT+03:00) Saudi Standard Time</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                </div>
              </div>

              {/* Footer Notes */}
              <div className="border-t border-gray-100 pt-6 space-y-3">
                  <p className="font-semibold text-sm text-gray-700">Note:</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                      <li>You can update your organization profile and preferences from Settings anytime.</li>
                  </ul>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                  disabled={isLoading}
                >
                  {isLoading ? "Setting up..." : "Get Started"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => setStep("welcome")}
                >
                  Go Back
                </Button>
              </div>
            </form>
          </CardContent>
      </Card>
      
      <div className="mt-8 mb-4">
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 underline">Privacy Policy</a>
      </div>
    </div>
  );
}
