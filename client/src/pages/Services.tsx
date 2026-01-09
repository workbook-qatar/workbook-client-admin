import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Plus, Edit, Trash2, Clock, Search, AlertCircle, 
    CheckCircle2, Cloud, Pencil, MapPin, Filter, Layers, Zap,
    Users, User, Sparkles, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { PRESET_CATEGORIES } from "@/data/service-presets";

// --- Mock Data ---
const ONLINE_CATEGORIES = [
  { id: 90, name: "Aldobi Global", count: 5 },
  { id: 91, name: "Marketplace Offers", count: 2 },
  { id: 92, name: "Seasonal Bundle", count: 1 },
];

const INITIAL_ONLINE_PACKAGES = [
  { id: 901, code: "ONL-001", name: "Aldobi Express Clean", categoryId: 90, basePrice: 200, specialPrice: 180, status: "published", lastSynced: "2 mins ago" },
  { id: 902, code: "ONL-002", name: "Aldobi Premium AC", categoryId: 90, basePrice: 300, specialPrice: null, status: "unpublished", lastSynced: "1 hour ago" },
];

// --- Design Tokens ---
const STYLES = {
  header: "flex flex-col gap-1 mb-6",
  title: "text-2xl font-bold tracking-tight",
  subtitle: "text-muted-foreground text-sm",
  card: "bg-white border-gray-200 shadow-sm",
  input: "h-[34px] text-sm focus-visible:ring-1 focus-visible:ring-blue-500",
  label: "text-[13px] font-medium text-gray-600 mb-1.5 block",
  badge: {
    active: "bg-green-100 text-green-700 hover:bg-green-100 border-0",
    inactive: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-0",
    published: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0",
    unpublished: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-0",
  }
};


// --- Helper to load from storage ---
const loadPackagesFromStorage = () => {
    try {
        const stored = localStorage.getItem("vendor_packages");
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

export default function Services() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("own");
  const [selectedCategory, setSelectedCategory] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>("all");
  
  // Initial Mock Data (Or could be empty if we want to force manual addition)
  // Let's keep a few samples for demo purposes if storage is empty
  const INITIAL_OWN_PACKAGES_MOCK = [
    { 
        id: 101, 
        code: "SVC-001", 
        name: "Standard Home Cleaning", 
        categoryId: 1, 
        duration: "4 hours", 
        status: "active", 
        desc: "Regular cleaning including dusting and mopping", 
        staffReq: 1,
        skills: ["General Cleaning"],
        serviceAreas: [
            { id: "sa-1", name: "Doha Central", price: 200 },
            { id: "sa-2", name: "West Bay", price: 250 }
        ]
    },
    { 
        id: 102, 
        code: "SVC-002", 
        name: "Move-In Deep Clean", 
        categoryId: 1, 
        duration: "6 hours", 
        status: "inactive", 
        desc: "Comprehensive deep cleaning for empty properties", 
        staffReq: 2,
        skills: ["Deep Cleaning", "Sanitization"],
        serviceAreas: [] 
    },
    { 
        id: 103, 
        code: "SVC-003", 
        name: "Party Helper & Server", 
        categoryId: 1, 
        duration: "5 hours", 
        status: "active", 
        // No description for test
        staffReq: 1,
        skills: ["Serving", "English Speaker"],
        gender: "Female",
        serviceAreas: [
             { id: "sa-1", name: "Doha Central", price: 150 }
        ]
    },
    // --- NEW MOCK DATA (15 Items) ---
    { id: 104, code: "SVC-004", name: "AC Regular Service (Split)", categoryId: 2, duration: "1 hour", status: "active", desc: "Basic filter cleaning and gas check for split units", staffReq: 1, skills: ["AC Maintenance"], serviceAreas: [{id: "sa-1", name: "Doha", price: 120}] },
    { id: 105, code: "SVC-005", name: "AC Deep Chemical Wash", categoryId: 2, duration: "2 hours", status: "active", desc: "Full chemical wash for indoor and outdoor units", staffReq: 2, skills: ["AC Tech", "Deep Cleaning"], serviceAreas: [{id: "sa-1", name: "Doha", price: 250}] },
    { id: 106, code: "SVC-006", name: "Leaking Tap Repair", categoryId: 3, duration: "1 hour", status: "active", desc: "Fixing dripping or leaking taps in kitchen/bath", staffReq: 1, skills: ["Plumbing"], serviceAreas: [{id: "sa-1", name: "Doha", price: 80}] },
    { id: 107, code: "SVC-007", name: "Water Heater Installation", categoryId: 3, duration: "2 hours", status: "active", desc: "Installation of vertical or horizontal water heaters", staffReq: 1, skills: ["Plumbing", "electrical"], serviceAreas: [{id: "sa-1", name: "Doha", price: 150}] },
    { id: 108, code: "SVC-008", name: "Sofa Shampooing (2 Seater)", categoryId: 1, duration: "1.5 hours", status: "active", desc: "Deep extraction shampooing for fabric sofas", staffReq: 1, skills: ["Upholstery Cleaning"], serviceAreas: [{id: "sa-1", name: "Doha", price: 100}] },
    { id: 109, code: "SVC-009", name: "Sofa Shampooing (L-Shape)", categoryId: 1, duration: "2.5 hours", status: "active", desc: "Complete cleaning for large L-shaped sofas", staffReq: 2, skills: ["Upholstery Cleaning"], serviceAreas: [{id: "sa-1", name: "Doha", price: 200}] },
    { id: 110, code: "SVC-010", name: "Carpet Cleaning (Large)", categoryId: 1, duration: "2 hours", status: "active", desc: "Machine shampooing for large carpets (>3x4m)", staffReq: 1, skills: ["Carpet Cleaning"], serviceAreas: [{id: "sa-1", name: "Doha", price: 180}] },
    { id: 111, code: "SVC-011", name: "Drain Unblocking", categoryId: 3, duration: "1 hour", status: "active", desc: "Unblocking of sinks, showers or floor drains", staffReq: 1, skills: ["Plumbing"], serviceAreas: [{id: "sa-1", name: "Doha", price: 120}] },
    { id: 112, code: "SVC-012", name: "Babysitting (Evening)", categoryId: 1, duration: "4 hours", status: "inactive", desc: "Certified babysitter for evening shifts", staffReq: 1, gender: "Female", skills: ["Child Care", "CPR Certified"], serviceAreas: [] },
    { id: 113, code: "SVC-013", name: "Elderly Care Assistance", categoryId: 1, duration: "8 hours", status: "inactive", desc: "Daily assistance for elderly family members", staffReq: 1, gender: "Female", skills: ["Nursing", "Patient Care"], serviceAreas: [] },
    { id: 114, code: "SVC-014", name: "Window Cleaning (Villa)", categoryId: 1, duration: "5 hours", status: "active", desc: "External and internal window cleaning for villas", staffReq: 3, gender: "Male", skills: ["Window Cleaning", "Safety Height"], serviceAreas: [{id: "sa-2", name: "West Bay", price: 500}] },
    { id: 115, code: "SVC-015", name: "Office Deep Clean", categoryId: 1, duration: "6 hours", status: "active", desc: "Complete office sanitization and cleaning", staffReq: 4, skills: ["Commercial Cleaning"], serviceAreas: [{id: "sa-1", name: "Doha", price: 600}] },
    { id: 116, code: "SVC-016", name: "Curtain Steam Cleaning", categoryId: 1, duration: "2 hours", status: "active", desc: "Steam cleaning for hanging curtains (per set)", staffReq: 1, skills: ["Steam Cleaning"], serviceAreas: [{id: "sa-1", name: "Doha", price: 150}] },
    { id: 117, code: "SVC-017", name: "Gas Refill (AC)", categoryId: 2, duration: "1 hour", status: "active", desc: "Top-up of R22 or R410 gas for AC units", staffReq: 1, skills: ["AC Tech"], serviceAreas: [{id: "sa-1", name: "Doha", price: 100}] },
    { id: 118, code: "SVC-018", name: "Toilet Installation", categoryId: 3, duration: "3 hours", status: "active", desc: "Installation of new WC set including sealing", staffReq: 2, skills: ["Plumbing"], serviceAreas: [{id: "sa-1", name: "Doha", price: 250}] }
  ];

  // Generate more items for pagination demo
  const GENERATED_ITEMS = Array.from({ length: 45 }).map((_, i) => ({
      id: 200 + i,
      code: `SVC-${200 + i}`,
      name: `Standard Service Package ${i + 1}`,
      categoryId: (i % 3) + 1,
      duration: `${(i % 4) + 1} hours`,
      status: i % 5 === 0 ? "inactive" : "active",
      desc: i % 2 === 0 ? "Standard service description for demonstration purposes" : "",
      staffReq: (i % 2) + 1,
      skills: i % 3 === 0 ? ["General"] : ["Specialized", "Technical"],
      serviceAreas: [{id: "sa-1", name: "Doha", price: 100 + (i * 10)}]
  }));
  
  // Combine all
  const ALL_MOCK_PACKAGES = [...INITIAL_OWN_PACKAGES_MOCK, ...GENERATED_ITEMS];

  // State
  const [ownPackages, setOwnPackages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [onlinePackages, setOnlinePackages] = useState(INITIAL_ONLINE_PACKAGES);
  const [managingPackage, setManagingPackage] = useState<any | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Loading States
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Full page skeleton
  const [isTableLoading, setIsTableLoading] = useState(false);   // Table rows skeleton

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleteType, setDeleteType] = useState<"package" | "category" | null>(null);

  // Load Data Effect
  useEffect(() => {
    // Combine mock data + stored data
    const storedPackages = loadPackagesFromStorage();
    // Use ALL_MOCK_PACKAGES here instead of INITIAL
    const allPackages = [...ALL_MOCK_PACKAGES, ...storedPackages];
    
    // Deduplicate by ID just in case
    const uniquePackages = Array.from(new Map(allPackages.map(item => [item.id, item])).values());
    
    setOwnPackages(uniquePackages);

    // Extract categories dynamically from packages for "Own" tab
    // We also want to include any manually created categories (mocked here as static for now + presets that are used)
    const usedCategoryIds = new Set(uniquePackages.map(p => p.categoryId));
    
    // Base Categories (System Defaults)
    let baseCategories: any[] = [
        { id: 1, name: "Cleaning Services", count: 0 },
        { id: 2, name: "AC Services", count: 0 },
        { id: 3, name: "Plumbing", count: 0 },
    ];

    // Load Custom Categories from Storage
    try {
        const storedCats = localStorage.getItem("vendor_categories");
        if (storedCats) {
            const customCats = JSON.parse(storedCats);
            // Merge, avoiding duplicates by ID if any
            customCats.forEach((cc: any) => {
                if (!baseCategories.find(bc => bc.id === cc.id)) {
                    baseCategories.push({ ...cc, count: 0 }); // init count
                }
            });
        }
    } catch (e) {
        console.error("Failed to load categories", e);
    }

    // Add any preset categories that are referenced by packages but not yet in list
    // (This ensures if a user added a preset package, its category shows up)
    PRESET_CATEGORIES.forEach(pc => {
        if (usedCategoryIds.has(pc.id)) {
            // Check if already in base
            if (!baseCategories.find(bc => bc.id === pc.id)) {
                baseCategories.push({ id: pc.id, name: pc.name, count: 0, isPreset: true });
            }
        }
    });

    // Sort categories: Presets/System first? Or by 'order'? 
    // Let's just sort by ID or keep append order for now.
    // Maybe sort by 'order' property if present.
    baseCategories.sort((a, b) => (a.order || 999) - (b.order || 999));

    // Calculate Counts
    const categoriesWithCounts = baseCategories.map(c => ({
        ...c,
        count: uniquePackages.filter(p => String(p.categoryId) === String(c.id)).length
    }));

    if (activeTab === "own") {
        setCategories(categoriesWithCounts);
    } else {
        setCategories(ONLINE_CATEGORIES);
    }

  }, [activeTab]);


  // Filter Logic
  const filteredPackages = activeTab === "own" 
    ? ownPackages.filter(p => {
        const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesArea = selectedAreaFilter === "all" ? true : (p.serviceAreas && p.serviceAreas.some((sa: any) => sa.id === selectedAreaFilter));
        return matchesCategory && matchesSearch && matchesArea;
    })
    : onlinePackages.filter(p => {
        const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    
    const paginatedPackages = activeTab === "own" 
        ? filteredPackages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        : onlinePackages.filter(p => { // Online tab logic kept separate/simple for now
            const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

    // Reset pagination when filters change
    useEffect(() => {
        if (!isInitialLoading) {
            handlePageChange(1);
        }
    }, [selectedCategory, searchQuery, selectedAreaFilter, activeTab]);

    const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);

    // Initial Loading Skeleton View
    if (isInitialLoading) {
        return <ServicesSkeleton />;
    }

  // Handlers
  const handlePageChange = (newPage: number) => {
      if (newPage === currentPage) return;
      
      setIsTableLoading(true);
      // Simulate Network Delay for Pagination
      setTimeout(() => {
          setCurrentPage(newPage);
          setIsTableLoading(false);
      }, 600); // 600ms delay for premium feel
  };

  const handleDelete = () => {
    if (deleteType === "package" && deleteId) {
        // Update state
        const updated = ownPackages.filter(p => p.id !== deleteId);
        setOwnPackages(updated);
        
        // Update storage if it was a stored package
        // Note: This logic removes it from view, but to persist delete we need to sync back to storage
        // For simple demo, we can just save the 'new' list to storage minus mocks? 
        // Or easier: just re-save 'vendor_packages' as the filtered list excluding initial mocks
        const stored = loadPackagesFromStorage();
        const newStored = stored.filter((p: any) => p.id !== deleteId);
        localStorage.setItem("vendor_packages", JSON.stringify(newStored));

        toast.success("Package deleted successfully");
    } 
    // ... Category delete logic simplified/omitted for brevity as focuses on packages
    setDeleteId(null);
    setDeleteType(null);
  };
  
  // (Other handlers confirmDelete, handleUpdateOnlinePackage... remain mostly same, just ensuring scope)
  const confirmDelete = (type: "package" | "category", id: string | number) => {
      setDeleteType(type);
      setDeleteId(id);
  };

  const handleUpdateOnlinePackage = () => {
      if (!managingPackage) return;
      setOnlinePackages(prev => prev.map(p => p.id === managingPackage.id ? managingPackage : p));
      setManagingPackage(null);
      toast.success("Online package updated");
  };

  const getPriceDisplay = (areas: any[]) => {
      if (!areas || areas.length === 0) return "-";
      const prices = areas.map(a => a.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) return `${min.toFixed(0)} QAR`;
      return `${min.toFixed(0)} - ${max.toFixed(0)} QAR`;
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-gray-50/50">
        
        {/* Page Header */}
        <div className="px-8 py-6 border-b bg-white flex items-center justify-between sticky top-0 z-10">
            <div>
                <h1 className={STYLES.title}>Services Management</h1>
                <p className={STYLES.subtitle}>Manage your service catalog and pricing</p>
            </div>
            <div className="flex gap-3">
                 <Button 
                    variant="outline"
                    size="sm" 
                    onClick={() => setLocation("/services/directory")} 
                    className="gap-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                    <Zap className="h-4 w-4" />
                    Add from Directory
                </Button>
                <Button size="sm" onClick={() => setLocation("/services/create")} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20">
                    <Plus className="h-4 w-4" />
                    Create Package
                </Button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden p-8">
            <div className="max-w-[1600px] mx-auto h-full flex flex-col">
                
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="bg-gray-100/50 border h-10 p-1">
                            <TabsTrigger value="own" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-6">Own Packages</TabsTrigger>
                            <TabsTrigger value="online" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm px-6 gap-2">
                                <Cloud className="h-3.5 w-3.5" />
                                Online Packages
                            </TabsTrigger>
                        </TabsList>
                        
                        <div className="flex items-center gap-3">
                             {/* Area Filter */}
                             {activeTab === "own" && (
                                <Select value={selectedAreaFilter} onValueChange={setSelectedAreaFilter}>
                                    <SelectTrigger className="w-[180px] h-9 text-xs bg-white">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-3.5 w-3.5 text-gray-500" />
                                            <SelectValue placeholder="All Areas" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Service Areas</SelectItem>
                                        <SelectItem value="sa-1">Doha Central</SelectItem>
                                        <SelectItem value="sa-2">West Bay Premium</SelectItem>
                                        <SelectItem value="sa-3">Al Wakrah</SelectItem>
                                    </SelectContent>
                                </Select>
                             )}

                            {/* Search Bar */}
                            <div className="relative w-[300px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                    placeholder="Search packages..." 
                                    className="pl-9 h-9 bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-h-0 flex gap-4">
                        
                        {/* LEFT PANEL: Categories */}
                        <Card className={`w-[260px] flex flex-col flex-none ${STYLES.card} h-full`}>
                            <div className="p-3 border-b flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-semibold text-sm text-gray-900">Categories</h3>
                                {activeTab === "own" && (
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500" onClick={() => setLocation("/services/category/create")}>
                                        <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-all ${
                                        selectedCategory === null ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Layers className="h-4 w-4" />
                                    <span>All Categories</span>
                                </button>
                                {categories.map(cat => (
                                    <div 
                                        key={cat.id}
                                        className={`group relative flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all cursor-pointer ${
                                            selectedCategory === cat.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setSelectedCategory(cat.id)}
                                    >
                                        <div className="flex items-center gap-2.5 pl-1 overflow-hidden">
                                            <span className="truncate">{cat.name}</span>
                                            {/* Preset Indicator */}
                                            {('isPreset' in cat) && <Zap className="h-3 w-3 text-amber-500 fill-amber-100 shrink-0" />} 
                                        </div>
                                        <div className="flex items-center flex-none">
                                            <span className={`text-xs bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-500 group-hover:hidden transition-all duration-200`}>{cat.count}</span>
                                            
                                            {/* Category Actions - Visible on Hover (Only for Own) */}
                                            {activeTab === "own" && (
                                                <div className="hidden group-hover:flex items-center gap-0.5 bg-white/50 backdrop-blur-sm rounded-md px-1" onClick={(e) => e.stopPropagation()}>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-500 hover:text-blue-600" onClick={() => setLocation(`/services/category/edit/${cat.id}`)}>
                                                        <Pencil className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-500 hover:text-red-600" onClick={() => confirmDelete('category', cat.id)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* RIGHT PANEL: Packages Table */}
                        <Card className={`flex-1 flex flex-col ${STYLES.card} h-full overflow-hidden`}>
                             <TabsContent value="own" className="m-0 flex-1 flex flex-col overflow-hidden data-[state=active]:flex">
                                <div className="flex-1 overflow-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 sticky top-0 z-10">
                                            <TableRow className="border-b-gray-200">
                                                <TableHead className="w-[100px] text-xs font-semibold uppercase tracking-wider text-gray-500">Code</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Package Details</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Duration</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Service Area Pricing</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status</TableHead>
                                                <TableHead className="text-end text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isTableLoading ? (
                                                <TableRowsSkeleton cols={6} rows={5} />
                                            ) : (
                                                paginatedPackages.map((pkg) => {
                                                const hasPricing = 'serviceAreas' in pkg && pkg.serviceAreas && pkg.serviceAreas.length > 0;
                                                const displayStatus = hasPricing ? ('status' in pkg ? pkg.status : 'active') : 'inactive';
                                                
                                                return (
                                                <TableRow key={pkg.id} className="group hover:bg-gray-50/50 border-b-gray-100">
                                                    <TableCell className="font-mono text-xs text-gray-500">{pkg.code}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col py-1.5 gap-1.5">
                                                            {/* Name */}
                                                            <div className="font-medium text-sm text-gray-900 leading-tight">{pkg.name}</div>
                                                            
                                                            {/* Attributes Labels */}
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                {/* Category - Name Only */}
                                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                                     {categories.find(c => c.id === pkg.categoryId)?.name || 'General'}
                                                                </span>
                                                                
                                                                {/* Staff */}
                                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                                    <Users className="h-3 w-3 opacity-50" />
                                                                    <span>{('staffReq' in pkg) ? pkg.staffReq : 1} Staff</span>
                                                                </span>

                                                                 {/* Gender */}
                                                                 <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                                    <User className="h-3 w-3 opacity-50" />
                                                                    <span>{('gender' in pkg && pkg.gender) ? pkg.gender : 'Any'}</span>
                                                                </span>

                                                                 {/* Skills */}
                                                                 <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                                    <Sparkles className="h-3 w-3 opacity-50" />
                                                                    <span className="max-w-[180px] truncate">
                                                                        {('skills' in pkg && Array.isArray(pkg.skills)) 
                                                                            ? pkg.skills.join(", ") 
                                                                            : ('skills' in pkg ? pkg.skills : 'Standard')}
                                                                    </span>
                                                                </span>
                                                            </div>

                                                            {/* Description (Optional - At Bottom) */}
                                                            {('desc' in pkg && pkg.desc) && (
                                                                <div className="text-xs text-gray-400 mt-0.5 max-w-[450px] leading-relaxed">
                                                                    {pkg.desc}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                                                            {'duration' in pkg ? pkg.duration : '-'}
                                                        </div>
                                                    </TableCell>
                                                    {/* Pricing Column - Clickable */}
                                                    <TableCell 
                                                        className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                                                        onClick={() => setLocation(`/services/edit/${pkg.id}`)}
                                                    >
                                                        {hasPricing ? (
                                                            <div className="flex flex-col gap-1">
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        {/* Wrap in span to avoid button-in-div if triggered unnecessarily, but here it's fine */}
                                                                         <div className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                                                                            {getPriceDisplay(pkg.serviceAreas)}
                                                                         </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="p-3 bg-white border border-gray-200 shadow-xl text-xs text-gray-900">
                                                                        <p className="font-semibold mb-2 text-gray-500 uppercase tracking-wider text-[10px]">Pricing Breakdown</p>
                                                                        <div className="space-y-1">
                                                                            {pkg.serviceAreas.map((sa: any) => (
                                                                                <div key={sa.id} className="flex justify-between gap-4">
                                                                                    <span>{sa.name}</span>
                                                                                    <span className="font-medium">{sa.price.toFixed(2)} QAR</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3 text-gray-400" />
                                                                    {pkg.serviceAreas.length} Areas Covered
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 group/alert">
                                                                 <span className="text-gray-400 text-xs italic group-hover/alert:text-blue-600 underline decoration-dotted">Set up pricing</span>
                                                                 <div className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse"></div>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`${displayStatus === 'active' ? STYLES.badge.active : STYLES.badge.inactive} shadow-none`}>
                                                            {displayStatus}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-end">
                                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                                                onClick={() => setLocation(`/services/edit/${pkg.id}`)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-gray-500 hover:text-red-600"
                                                                onClick={() => confirmDelete('package', pkg.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}) )}
                                            {filteredPackages.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-32 text-center text-gray-400">
                                                        No packages found matching criteria
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                
                                {/* Pagination Footer */}
                                <div className="border-t bg-gray-50/50 p-2.5 flex items-center justify-between shrink-0">
                                    <div className="text-xs text-gray-500">
                                        Showing <span className="font-medium">{Math.min(filteredPackages.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}</span> to <span className="font-medium">{Math.min(filteredPackages.length, currentPage * ITEMS_PER_PAGE)}</span> of <span className="font-medium">{filteredPackages.length}</span> results
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage === 1 || isTableLoading}
                                        >
                                            <ChevronsLeft className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1 || isTableLoading}
                                        >
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                        </Button>
                                        <span className="text-xs font-medium px-2 min-w-[3rem] text-center">
                                            {isTableLoading ? (
                                                <span className="animate-pulse bg-gray-200 rounded h-4 w-8 inline-block align-middle"/>
                                            ) : (
                                                `${currentPage} / ${totalPages}`
                                            )}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages || isTableLoading}
                                        >
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handlePageChange(totalPages)}
                                            disabled={currentPage === totalPages || isTableLoading}
                                        >
                                            <ChevronsRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                             </TabsContent>

                             <TabsContent value="online" className="m-0 flex-1 flex flex-col overflow-hidden data-[state=active]:flex">
                                <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">Synced from Aldobi Marketplace</p>
                                        <p className="text-xs text-blue-700">These packages are managed by Aldobi. You can only adjust pricing and visibility.</p>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 sticky top-0 z-10">
                                            <TableRow className="border-b-gray-200">
                                                <TableHead className="w-[100px] text-xs font-semibold uppercase tracking-wider text-gray-500">Code</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Package Name</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sync Status</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Base Price</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Your Price</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">Visibility</TableHead>
                                                <TableHead className="text-end text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPackages.map((pkg) => (
                                                <TableRow key={pkg.id} className="group hover:bg-gray-50/50 border-b-gray-100">
                                                    <TableCell className="font-mono text-xs text-gray-500">{pkg.code}</TableCell>
                                                    <TableCell>
                                                        <div className="font-medium text-sm text-gray-900">{pkg.name}</div>
                                                        <Badge variant="outline" className="mt-1 text-[10px] h-5 border-gray-200 text-gray-500"> Cleaning </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1.5 text-xs text-green-600">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            <span>{('lastSynced' in pkg) ? pkg.lastSynced : ''}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {('basePrice' in pkg && pkg.basePrice) ? Number(pkg.basePrice).toFixed(2) : '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-semibold text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded w-fit">
                                                            {('specialPrice' in pkg && pkg.specialPrice) ? Number(pkg.specialPrice).toFixed(2) : ('basePrice' in pkg ? Number(pkg.basePrice).toFixed(2) : '-')}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`${('status' in pkg && pkg.status === 'published') ? STYLES.badge.published : STYLES.badge.unpublished} shadow-none`}>
                                                            {('status' in pkg) ? pkg.status : ''}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-end">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="h-8 text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                                                            onClick={() => setManagingPackage(pkg)}
                                                        >
                                                            Manage
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                             </TabsContent>
                        </Card>
                    </div>
                </Tabs>
            </div>
        </div>

        {/* Manage Online Package Dialog */}
        <Dialog open={!!managingPackage} onOpenChange={(open) => !open && setManagingPackage(null)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage Online Package</DialogTitle>
                    <DialogDescription>
                        Adjust pricing and visibility for this synced package.
                    </DialogDescription>
                </DialogHeader>
                {managingPackage && (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Package Name</Label>
                            <div className="font-medium text-sm">{managingPackage.name}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Base Price (Fixed)</Label>
                                <div className="font-medium text-sm text-gray-500 line-through">QAR {managingPackage.basePrice?.toFixed(2)}</div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="special-price" className="text-xs font-semibold text-blue-600">Your Price (Override)</Label>
                                <Input 
                                    id="special-price" 
                                    type="number" 
                                    className="h-8" 
                                    value={managingPackage.specialPrice || ''} 
                                    placeholder={managingPackage.basePrice?.toString()}
                                    onChange={(e) => setManagingPackage({...managingPackage, specialPrice: e.target.value ? parseFloat(e.target.value) : null})}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between border rounded p-3 h-[40px] mt-2">
                            <div className="flex flex-col">
                                <Label htmlFor="publish-mode" className="text-sm font-medium cursor-pointer">Publish Status</Label>
                                <span className="text-[10px] text-gray-500">{managingPackage.status === 'published' ? 'Visible to customers' : 'Hidden from customers'}</span>
                            </div>
                            <Switch 
                                id="publish-mode" 
                                checked={managingPackage.status === 'published'}
                                onCheckedChange={(checked) => setManagingPackage({...managingPackage, status: checked ? 'published' : 'unpublished'})}
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setManagingPackage(null)}>Cancel</Button>
                    <Button onClick={handleUpdateOnlinePackage} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Alert */}
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the {deleteType} and remove it from your data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </div>
    </DashboardLayout>
  );
}

// --- SKELETON COMPONENTS ---

const ServicesSkeleton = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
             {/* Simple Sidebar Skeleton Stub */}
             <div className="w-[240px] border-r bg-white p-4 hidden lg:block">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="space-y-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-4 w-full bg-gray-100 rounded animate-pulse" />)}
                </div>
             </div>
             
             <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Skeleton */}
                <header className="h-16 border-b bg-white flex items-center px-8 justify-between shrink-0">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
                </header>

                <div className="flex-1 overflow-hidden p-8 animate-pulse">
                    <div className="max-w-[1600px] mx-auto h-full flex flex-col">
                        {/* Tab/Filter Skeleton */}
                        <div className="h-10 bg-gray-100/50 border rounded-md mb-6 w-full flex items-center justify-between p-1">
                        <div className="flex gap-2">
                            <div className="h-8 w-32 bg-gray-200 rounded" />
                            <div className="h-8 w-32 bg-gray-200 rounded" />
                        </div>
                        <div className="flex gap-3">
                                <div className="h-9 w-[180px] bg-gray-200 rounded" />
                                <div className="h-9 w-[300px] bg-gray-200 rounded" />
                        </div>
                        </div>

                        <div className="flex-1 min-h-0 flex gap-4">
                            {/* Inner Sidebar Skeleton */}
                            <Card className="w-[260px] flex flex-col flex-none h-full border-gray-200">
                                <div className="p-3 border-b flex items-center justify-between">
                                    <div className="h-4 w-20 bg-gray-200 rounded" />
                                </div>
                                <div className="p-2 space-y-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-9 w-full bg-gray-100 rounded" />
                                    ))}
                                </div>
                            </Card>

                            {/* Table Skeleton */}
                            <Card className="flex-1 flex flex-col h-full overflow-hidden border-gray-200">
                                <div className="flex-1 p-4">
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b pb-2">
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <div key={i} className="h-4 w-24 bg-gray-200 rounded" />
                                            ))}
                                        </div>
                                        {[1, 2, 3, 4, 5, 6, 7].map(row => (
                                            <div key={row} className="flex justify-between py-3 border-b border-gray-50">
                                                <div className="h-4 w-16 bg-gray-200 rounded" />
                                                <div className="h-4 w-64 bg-gray-200 rounded" />
                                                <div className="h-4 w-20 bg-gray-200 rounded" />
                                                <div className="h-4 w-32 bg-gray-200 rounded" />
                                                <div className="h-4 w-16 bg-gray-200 rounded" />
                                                <div className="h-8 w-16 bg-gray-200 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-12 border-t bg-gray-50/50" />
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TableRowsSkeleton = ({ rows = 5, cols = 5 }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-4 w-12 bg-gray-200 rounded" /></TableCell>
                    <TableCell>
                        <div className="space-y-2">
                            <div className="h-4 w-48 bg-gray-200 rounded" />
                            <div className="flex gap-2">
                                <div className="h-5 w-16 bg-gray-100 rounded" />
                                <div className="h-5 w-16 bg-gray-100 rounded" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell><div className="h-4 w-16 bg-gray-200 rounded" /></TableCell>
                    <TableCell>
                        <div className="space-y-1">
                             <div className="h-4 w-24 bg-gray-200 rounded" />
                             <div className="h-3 w-16 bg-gray-100 rounded" />
                        </div>
                    </TableCell>
                    <TableCell><div className="h-5 w-14 bg-gray-200 rounded-full" /></TableCell>
                    <TableCell className="text-end">
                        <div className="flex justify-end gap-2">
                            <div className="h-8 w-8 bg-gray-100 rounded" />
                            <div className="h-8 w-8 bg-gray-100 rounded" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
};
