
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";  
import { ArrowLeft, Save, Plus, X, ChevronDown, Check, MapPin, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MOCK_SERVICE_AREAS } from "./settings/ServiceAreas";
import { toast } from "sonner";
import { PRESET_CATEGORIES } from "@/data/service-presets";

const STYLES = {
  sectionTitle: "text-[16px] font-semibold text-gray-900 mb-5 relative pl-3 before:absolute before:left-0 before:top-1 before:w-[3px] before:h-4 before:bg-blue-600 before:rounded-full",
  label: "text-[13px] text-gray-600 font-medium mb-1.5 block",
  input: "h-[38px] text-sm bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg transition-all",
  card: "bg-white p-6 shadow-sm border border-gray-100/50 rounded-xl hover:shadow-md transition-shadow duration-200",
};

export default function CreatePackage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/services/edit/:id");
  const isEditMode = match && params?.id ? true : false;
  const packageId = params?.id ? (isNaN(Number(params.id)) ? params.id : Number(params.id)) : null;

  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string | number>("");
  const [status, setStatus] = useState("active");
  const [duration, setDuration] = useState("");
  const [staffReq, setStaffReq] = useState(1);
  const [genderRule, setGenderRule] = useState("any");
  const [desc, setDesc] = useState("");
  const [code, setCode] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [areaPrices, setAreaPrices] = useState<Record<string, string>>({});
  
  // Available Data
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);

  // Load Data
  useEffect(() => {
    // 1. Load Categories (Presets + Custom)
    const storedCats = localStorage.getItem("vendor_categories");
    const customCats = storedCats ? JSON.parse(storedCats) : [];
    
    // Transform presets to simple structure if needed, or just map them
    const presetCats = PRESET_CATEGORIES.map(c => ({ id: c.id, name: c.name }));
    
    // Merge, favoring custom if ID conflict (though unlikely with presets using strings/nums differently usually)
    // We filter out duplicates based on ID
    const allCats = [...presetCats, ...customCats];
    const uniqueCats = Array.from(new Map(allCats.map(item => [item.id, item])).values());

    setAvailableCategories(uniqueCats);

    // 2. Load Skills
    const storedSkills = localStorage.getItem("vendor_skills");
    if (storedSkills) {
        const skillsObj = JSON.parse(storedSkills);
        // Map to { value, label } for UI compatibility
        setAvailableSkills(skillsObj.map((s: any) => ({ value: s.id, label: s.name })));
    } else {
        // Fallback Mock Skills if nothing in storage
        setAvailableSkills([
            { value: "s1", label: "General Cleaning" },
            { value: "s2", label: "Deep Cleaning" },
            { value: "s3", label: "AC Repair" },
            { value: "s4", label: "Plumbing" },
            { value: "s5", label: "Electrical" },
        ]);
    }

    // 3. Load Package if Edit Mode
    if (isEditMode && packageId) {
        const storedPkgs = localStorage.getItem("vendor_packages");
        // Also check initial mocks if they exist in state but not storage? 
        // For consistency in this demo app, we'll assume everything "persistable" is in storage 
        // OR we duplicate the mock logic from Services.tsx.
        // Let's grab from storage first.
        let allPackages = storedPkgs ? JSON.parse(storedPkgs) : [];
        
        // MOCKS from Services.tsx logic (replicated for access)
        const MOCKS = [
            { id: 101, code: "SVC-001", name: "Standard Home Cleaning", categoryId: 1, duration: "4 hours", status: "active", desc: "Regular cleaning including dusting and mopping", staffReq: 1, materials: false, serviceAreas: [{ id: "sa-1", name: "Doha Central", price: 200 }, { id: "sa-2", name: "West Bay", price: 250 }] },
            { id: 102, code: "SVC-002", name: "Move-In Deep Clean", categoryId: 1, duration: "6 hours", status: "inactive", desc: "Comprehensive deep cleaning for empty properties", staffReq: 2, materials: true, serviceAreas: [] }
        ];
        
        // Merge in case editing a mock
        allPackages = [...MOCKS, ...allPackages];
        // Deduplicate
        const uniquePackages = Array.from(new Map(allPackages.map((item:any) => [item.id, item])).values());

        const pkg = uniquePackages.find((p: any) => p.id == packageId); // loose comparison for string/number

        if (pkg) {
            setName(pkg.name);
            setCategoryId(pkg.categoryId);
            setStatus(pkg.status || "active");
            setDuration(String(pkg.duration).replace(" hours", "").replace(" hour", "")); // strip text if stored
            setStaffReq(pkg.staffReq || 1);
            setDesc(pkg.desc || "");
            setCode(pkg.code || "");
            
            // Handle Skills Mapping
            if (pkg.skills) {
                // If package has skills array, it should match IDs (values)
                setSelectedSkills(pkg.skills);
            }

            // Service Areas
            if (pkg.serviceAreas) {
                const areaIds = pkg.serviceAreas.map((a: any) => a.id);
                const prices: Record<string, string> = {};
                pkg.serviceAreas.forEach((a: any) => {
                    prices[a.id] = String(a.price);
                });
                setSelectedAreas(areaIds);
                setAreaPrices(prices);
            }
        }
    } else {
        // Generate new code for create mode
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        setCode(`SVC-${randomNum}`);
    }
  }, [isEditMode, packageId]);

  // Handlers
  const toggleSkill = (value: string) => {
    setSelectedSkills(prev => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]);
  };

  const toggleArea = (id: string) => {
    setSelectedAreas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const updatePrice = (id: string, price: string) => {
    setAreaPrices(prev => ({ ...prev, [id]: price }));
  };

  const applyPriceToAll = (sourceId: string) => {
    const sourcePrice = areaPrices[sourceId];
    if (!sourcePrice) return;
    const newPrices = { ...areaPrices };
    selectedAreas.forEach(id => { newPrices[id] = sourcePrice; });
    setAreaPrices(newPrices);
  };

  const handleSave = () => {
    try {
        const storedPkgs = localStorage.getItem("vendor_packages");
        let packages = storedPkgs ? JSON.parse(storedPkgs) : [];
        
        const newPackage = {
            id: isEditMode ? packageId : Date.now(),
            code: code,
            name: name,
            categoryId: isNaN(Number(categoryId)) ? categoryId : Number(categoryId),
            status,
            duration: `${duration} hours`,
            staffReq,
            desc,
            serviceAreas: selectedAreas.map(id => ({
                id,
                name: MOCK_SERVICE_AREAS.find(a => a.id === id)?.name || id,
                price: parseFloat(areaPrices[id] || "0")
            })),
            // Mock fields
            materials: false, 
            skills: selectedSkills
        };

        if (isEditMode) {
            packages = packages.filter((p: any) => p.id != packageId); 
            packages.push(newPackage);
        } else {
            packages.push(newPackage);
        }
        
        localStorage.setItem("vendor_packages", JSON.stringify(packages));
        toast.success(`Package ${isEditMode ? 'updated' : 'created'} successfully`);
        setLocation("/services");
    } catch (e) {
        console.error(e);
        toast.error("Failed to save package");
    }
  };

  const isValid = name && categoryId && duration && selectedAreas.length > 0 && selectedAreas.every(id => areaPrices[id] && parseFloat(areaPrices[id]) > 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50/50">
        <div className="flex-none px-8 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setLocation("/services")} className="rounded-full hover:bg-gray-100 text-gray-500">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                   <h1 className="text-xl font-bold text-gray-900 tracking-tight">{isEditMode ? "Edit Package" : "Create Package"}</h1>
                   <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      {status === 'active' ? 'Active' : 'Draft/Inactive'}
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setLocation("/services")} className="text-gray-600 hover:text-gray-900">Discard</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 gap-2 rounded-lg px-6" disabled={!isValid} onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Save Package
                </Button>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
            <div className="max-w-3xl mx-auto space-y-8 pb-32">
                <Card className={STYLES.card}>
                    <h3 className={STYLES.sectionTitle}>Package Essentials</h3>
                    <div className="space-y-6">
                        <div>
                            <Label className={STYLES.label}>Package Name <span className="text-red-500">*</span></Label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Deep Clean - 2 Bedroom" className={STYLES.input} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className={STYLES.label}>Category <span className="text-red-500">*</span></Label>
                                <Select value={String(categoryId)} onValueChange={setCategoryId}>
                                    <SelectTrigger className={STYLES.input}>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCategories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                                        <div className="p-1 border-t mt-1">
                                            <Button variant="ghost" size="sm" className="w-full justify-start text-blue-600 font-medium" onClick={() => setLocation("/services/category/create")}>
                                                <Plus className="h-3.5 w-3.5 mr-2" />
                                                Create New Category
                                            </Button>
                                        </div>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className={STYLES.label}>Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className={STYLES.input}><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className={STYLES.card}>
                    <h3 className={STYLES.sectionTitle}>Operations & Staffing</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label className={STYLES.label}>Duration (Hours) <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input type="number" step="0.5" value={duration} onChange={e => setDuration(e.target.value)} className={STYLES.input} />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-400 pointer-events-none">hrs</span>
                                </div>
                            </div>
                            <div>
                                <Label className={STYLES.label}>Staff Required <span className="text-red-500">*</span></Label>
                                <Input type="number" value={staffReq} onChange={e => setStaffReq(parseInt(e.target.value))} min={1} className={STYLES.input} />
                            </div>
                            <div>
                                <Label className={STYLES.label}>Gender Rule</Label>
                                <Select value={genderRule} onValueChange={setGenderRule}>
                                    <SelectTrigger className={STYLES.input}><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any Gender</SelectItem>
                                        <SelectItem value="female">Female Only</SelectItem>
                                        <SelectItem value="male">Male Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                             <Label className={STYLES.label}>Required Skills</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className={`w-full justify-between font-normal ${STYLES.input} h-auto min-h-[38px] px-3 py-2 text-left`}>
                                        {selectedSkills.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedSkills.map(val => (
                                                    <Badge key={val} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                                        {availableSkills.find(s => s.value === val)?.label}
                                                        <span className="ml-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSkill(val); }}><X className="h-3 w-3" /></span>
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : <span className="text-gray-400">Select skills...</span>}
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search skills..." />
                                        <CommandList>
                                            <CommandEmpty>No skill found.</CommandEmpty>
                                            <CommandGroup>
                                                {availableSkills.map((skill) => (
                                                    <CommandItem key={skill.value} value={skill.label} onSelect={() => toggleSkill(skill.value)}>
                                                        <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selectedSkills.includes(skill.value) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")}>
                                                            <Check className={cn("h-4 w-4")} />
                                                        </div>
                                                        {skill.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                             </Popover>
                        </div>
                    </div>
                </Card>

                <Card className={STYLES.card}>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className={STYLES.sectionTitle.replace("mb-5", "mb-0")}>Service Coverage & Pricing</h3>
                        <Button variant="link" className="text-blue-600 p-0 h-auto font-medium" onClick={() => window.open("/settings/service-areas/create", "_blank")}>+ Add Service Area</Button>
                    </div>
                    <div className="space-y-6">
                         <div>
                             <Label className={STYLES.label}>Select Service Areas <span className="text-red-500">*</span></Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className={`w-full justify-between font-normal ${STYLES.input} h-auto min-h-[38px] px-3 py-2 text-left`}>
                                        {selectedAreas.length > 0 ? (
                                            <span className="text-gray-900 font-medium">{selectedAreas.length} Areas Selected</span>
                                        ) : <span className="text-gray-400">Choose coverage areas...</span>}
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search areas..." />
                                        <CommandList>
                                            <CommandEmpty>No area found.</CommandEmpty>
                                            <CommandGroup>
                                                {MOCK_SERVICE_AREAS.map((area) => (
                                                    <CommandItem key={area.id} value={area.name} onSelect={() => toggleArea(area.id)}>
                                                        <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selectedAreas.includes(area.id) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")}>
                                                            <Check className={cn("h-4 w-4")} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>{area.name}</span>
                                                            <span className="text-xs text-gray-400">{area.zones.length} Zones</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                             </Popover>
                        </div>
                        {selectedAreas.length > 0 && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50/30">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50 text-left">
                                            <th className="py-2.5 px-4 font-medium text-gray-500 w-[50%]">Service Area</th>
                                            <th className="py-2.5 px-4 font-medium text-gray-500">Price (QAR)</th>
                                            <th className="py-2.5 px-4 font-medium text-gray-500 w-[40px]"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedAreas.map((areaId) => {
                                            const area = MOCK_SERVICE_AREAS.find(a => a.id === areaId);
                                            const price = areaPrices[areaId] || "";
                                            return (
                                                <tr key={areaId} className="group bg-white hover:bg-blue-50/30 transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium text-gray-900">{area?.name}</div>
                                                        <div className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="h-3 w-3" />{area?.zones.length} Zones</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative w-full max-w-[140px]">
                                                                <span className="absolute left-3 top-2 text-xs text-gray-400 group-focus-within:text-blue-500">QAR</span>
                                                                <Input type="number" placeholder="0.00" className="h-8 pl-10 text-right font-medium" value={price} onChange={(e) => updatePrice(areaId, e.target.value)} />
                                                            </div>
                                                            <div className="w-6">
                                                                {price && (
                                                                    <button title="Apply all" onClick={() => applyPriceToAll(areaId)} className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 transition-opacity">
                                                                        <Copy className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <button onClick={() => toggleArea(areaId)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {selectedAreas.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">Select service areas to configure pricing</p>
                            </div>
                        )}
                    </div>
                </Card>

                 <Card className={STYLES.card}>
                    <h3 className={STYLES.sectionTitle}>Internal Notes</h3>
                    <div>
                         <Label className={STYLES.label}>Description & Instructions</Label>
                         <Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Add specific instructions..." className="min-h-[100px] text-sm resize-none bg-gray-50/50 border-gray-200 rounded-lg" />
                    </div>
                </Card>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
