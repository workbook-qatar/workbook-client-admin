import { useState, useEffect, useMemo } from "react";
import { useRoute, Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Phone, Mail, Star, ArrowLeft, MapPin, Calendar, CheckCircle, 
  AlertTriangle, Edit, ChevronDown, BarChart3, Clock, CalendarDays, 
  ChevronLeft, ChevronRight, Trash2, Plus, Building2, FileText, 
  Eye, Download, Upload, RefreshCw, ShieldCheck, Wallet, Banknote, 
  TrendingUp, Gift, X, Save, User, Camera, LogOut, MoreVertical,
  FileIcon, CalendarCheck, DollarSign, PenSquare, MoreHorizontal,
  Briefcase, Lock, Info, AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress"; // Attempting to use if available, or just mock it.
// Assuming Progress is available or I can make a simple one. If not, I'll make a div. 
// I'll stick to simple div for progress for now.

// --- Types & Enums ---
type EmploymentStatus = 'Active' | 'On Leave' | 'Suspended' | 'Inactive';
type WorkStatus = 'Available' | 'Assigned' | 'On Job' | 'Offline';
type MembershipStatus = 'active' | 'draft' | 'pending' | 'rejected' | 'expired' | 'cancelled';

// --- Mock Data ---
// Expanded Mock Data conforming to WorkforceMemberData structure
const mockStaffData = {
  id: 1,
  staffId: "WB-001",
  name: "Mohammed Hassan",
  nickname: "Nisar",
  role: "Senior Technician", 
  employmentStatus: "Active" as EmploymentStatus, // New Field
  rating: 4.9,
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
  verified: true,
  qid: "28535638494",
  dob: "1990-05-15",
  nationality: "India",
  gender: "Male",
  religion: "Islam",
  maritalStatus: "Single",
  phone: "+974 5555 1111",
  email: "mohammed.hassan@workbook.com",
  address: "Building 45, Street 230, Zone 55",
  city: "Doha",
  area: "Al Sadd",
  emergencyContact: "Fatima Hassan",
  emergencyPhone: "+974 5555 5678",
  emergencyRelation: "Spouse",
  position: "Senior Technician",
  department: "Operations",
  employmentType: "Full Time",
  contractType: "Permanent",
  startDate: "2022-03-15",
  joiningDate: "2022-03-20",
  reportingManager: "Sarah Johnson",
  workLocation: "Doha Operations Center",
  salaryType: "fixed-monthly",
  monthlySalary: "3500",
  commissionPercentage: "",
  baseRate: "",
  hourlyRate: "",
  fixedMonthlySalary: "",
  commissionPercent: "",
  languages: ["English", "Hindi", "Arabic"],
  skills: ["Deep Cleaning", "AC Maintenance", "Electrical Repair"],
  jobsCompleted: 156,
  earnings: "5890 QAR",
  hours: "42.5h/week",
  roleType: "field", // Default
  membershipStatus: "active" as MembershipStatus,
};

// Updated dates to be relevant for 2025 testing
const mockBookings = [
  { id: "BK-2025-001", customer: "Aldar Properties", service: "AC Maintenance", date: "2025-12-23", time: "09:00 AM", status: "In Progress", location: "West Bay, Doha" },
  { id: "BK-2025-002", customer: "Fatima Al-Thani", service: "Deep Cleaning", date: "2025-12-24", time: "02:00 PM", status: "Scheduled", location: "The Pearl, Doha" },
  { id: "BK-2025-003", customer: "Qatar Foundation", service: "Electrical Repair", date: "2025-12-25", time: "10:00 AM", status: "Scheduled", location: "Education City" },
];

const mockDocuments = [
  { id: 1, name: "Qatar ID", type: "Identification", expiry: "2025-05-20", status: "Valid" },
  { id: 2, name: "Visa Copy", type: "Visa", expiry: "2024-12-30", status: "Expiring Soon" },
];

const mockPayouts = [
  { id: "PY-001", date: "2024-11-30", amount: "3500.00", status: "Paid", type: "Salary" },
  { id: "PY-002", date: "2024-10-31", amount: "3500.00", status: "Paid", type: "Salary" },
];

// --- Helpers ---

function getWorkStatusColor(status: WorkStatus) {
    switch (status) {
        case 'Available': return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
        case 'On Job': return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
        case 'Assigned': return 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200';
        case 'Offline': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200';
        default: return 'bg-gray-100 text-gray-700';
    }
}

export default function StaffDetails() {
  const [, params] = useRoute("/staff/:id");
  
  // State
  const [staff, setStaff] = useState(mockStaffData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockStaffData);

  // Status Change Dialog State
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [activationDialogOpen, setActivationDialogOpen] = useState(false);
  const [pendingEmploymentStatus, setPendingEmploymentStatus] = useState<EmploymentStatus | null>(null);
  const [leaveDates, setLeaveDates] = useState({ start: '', end: '' });
  const [currentStep, setCurrentStep] = useState(0);
  // State
  const [activeTab, setActiveTab] = useState("profile");
  const [activeDocuments, setActiveDocuments] = useState(mockDocuments);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [impactAnalysis, setImpactAnalysis] = useState<{
      inProgress: typeof mockBookings,
      scheduled: typeof mockBookings,
      totalImpact: number
  }>({ inProgress: [], scheduled: [], totalImpact: 0 });


  // --- Logic: Load Data ---
  useEffect(() => {
    const storedStaff = localStorage.getItem("vendor_staff");
    if (storedStaff && params?.id) {
      try {
        const parsedStaff = JSON.parse(storedStaff);
        const found = parsedStaff.find((s: any) => s.id === params.id || s.id === parseInt(params.id));
        if (found) {
          // Merge found data with mock for missing fields if any (like employmentStatus default)
          const merged = { ...mockStaffData, ...found, employmentStatus: found.employmentStatus || "Active" };
          // Ensure membershipStatus is set if missing (legacy data)
          if (!merged.membershipStatus) merged.membershipStatus = "active";
          
          setStaff(merged);
          setFormData(merged);
          
          // Set initial tab for drafts
          if (merged.membershipStatus !== 'active') {
              setActiveTab("verification");
          }
        }
      } catch (e) { console.error(e); }
    }
  }, [params?.id]);


  // --- Logic: Work Status Derivation ---
  const workStatusData = useMemo(() => {
      // 1. Hard Gate: If Not Active -> Offline
      if (staff.employmentStatus !== 'Active') {
          return { status: 'Offline' as WorkStatus, context: 'Staff is not active' };
      }

      // 2. In Progress Job
      const inProgressJob = mockBookings.find(b => b.status === "In Progress");
      if (inProgressJob) {
          return { 
              status: 'On Job' as WorkStatus, 
              context: `Current: ${inProgressJob.id} at ${inProgressJob.time}` 
          };
      }

      // 3. Assigned Future Job (Today/Tomorrow) - Simple simulation
      const today = "2025-12-23"; // Simulating 'Today' based on context
      const upcomingJob = mockBookings.find(b => b.status === "Scheduled" && b.date >= today);
      if (upcomingJob) {
           return { 
               status: 'Assigned' as WorkStatus, 
               context: `Next: ${upcomingJob.id} (${upcomingJob.date})` 
           };
      }

      // 4. Fallback -> Available
      return { status: 'Available' as WorkStatus, context: 'Ready for assignment' };

  }, [staff.employmentStatus]);


  // --- Handlers: Editing ---
  const handleEditToggle = () => {
    if (isEditing) {
        setFormData(staff); // Reset
        setIsEditing(false);
    } else {
        setFormData(staff); // Init
        setIsEditing(true);
    }
  };

  const handleSave = () => {
      setStaff(formData);
      setIsEditing(false);
      updateLocalStorage(formData);
      toast.success("Staff profile updated successfully");
  };



  const updateLocalStorage = (data: any) => {
      const stored = localStorage.getItem("vendor_staff");
      if (stored) {
          const list = JSON.parse(stored);
          const index = list.findIndex((s: any) => s.id === staff.id);
          if (index !== -1) {
              list[index] = { ...list[index], ...data };
              localStorage.setItem("vendor_staff", JSON.stringify(list));
          } else {
              // Valid mock update
             localStorage.setItem("vendor_staff", JSON.stringify([...list, data])); 
          }
      }
  };


  // --- Handlers: Status Logic ---

  const initiateStatusChange = (newStatus: EmploymentStatus) => {
      if (newStatus === staff.employmentStatus) return;

      if (newStatus === 'Active') {
          // Reactivating
          setStaff(prev => ({ ...prev, employmentStatus: 'Active' }));
          setFormData(prev => ({ ...prev, employmentStatus: 'Active' }));
          updateLocalStorage({ ...staff, employmentStatus: 'Active' });
          toast.success("Staff reactivated. Previously unassigned jobs remain unassigned.");
          return;
      }

      // Switching to Non-Active (On Leave, Suspended, Inactive)
      // Analyze Impact
      const inProgress = mockBookings.filter(b => b.status === 'In Progress');
      const scheduled = mockBookings.filter(b => b.status === 'Scheduled');
      
      setImpactAnalysis({
          inProgress,
          scheduled,
          totalImpact: inProgress.length + scheduled.length
      });
      setPendingEmploymentStatus(newStatus);
      setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
      if (!pendingEmploymentStatus) return;

      // Logic: Unassign jobs (Simulated)
      // In a real app, we would make an API call here.
      
      const updatedStaff = { ...staff, employmentStatus: pendingEmploymentStatus };
      setStaff(updatedStaff);
      setFormData(prev => ({ ...prev, employmentStatus: pendingEmploymentStatus })); // Keep form synced
      updateLocalStorage(updatedStaff);

      toast.success(`Status updated to ${pendingEmploymentStatus}. ${impactAnalysis.totalImpact} jobs unassigned.`);
      
      setStatusDialogOpen(false);
      setPendingEmploymentStatus(null);
      setLeaveDates({ start: '', end: '' });
  };



  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
      <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Icon className="h-5 w-5 text-gray-500" />
              {title}
          </CardTitle>
          {!isEditing && staff.membershipStatus === 'active' && (
              <Button variant="ghost" size="sm" onClick={handleEditToggle} className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 text-gray-400 hover:text-primary">
                  <PenSquare className="h-4 w-4" />
              </Button>
          )}
      </div>
  );
  
  // Activation Logic
  const checkRequirements = () => {
    return {
        personal: !!(staff.name && staff.qid && staff.phone),
        employment: !!(staff.position && staff.department && staff.startDate),
        skills: (staff.skills?.length || 0) > 0,
        docs: activeDocuments.length > 0,
    };
  };

  const reqs = checkRequirements();
  const completionSteps = Object.values(reqs).filter(Boolean).length;
  const totalSteps = 4;
  const completionPercent = (completionSteps / totalSteps) * 100;
  const canActivate = reqs.personal && reqs.employment && reqs.skills && reqs.docs;
  const isDraft = staff.membershipStatus !== 'active';
  
  const handleEditAndRedirect = () => {
    setActiveTab("profile");
    setIsEditing(true);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          // Simulate Upload
          const newDoc = { 
              id: Date.now(), 
              name: file.name, 
              type: "Uploaded", 
              expiry: "2026-12-31", 
              status: "Pending Review" 
          };
          setActiveDocuments([...activeDocuments, newDoc]);
          toast.success("Document uploaded successfully");
      }
  };

  const handleAddSkill = () => {
      if (!newSkill.trim()) return;
      const updatedSkills = [...(staff.skills || []), newSkill];
      const updated = { ...staff, skills: updatedSkills };
      setStaff(updated);
      setFormData(updated);
      updateLocalStorage(updated);
      toast.success("Skill added");
      setNewSkill("");
      setSkillDialogOpen(false);
  };
  
  const handleActivate = () => {
      const updated = { ...staff, membershipStatus: 'active' as const, employmentStatus: 'Active' as const };
      setStaff(updated);
      setFormData(updated);
      updateLocalStorage(updated);
      toast.success("Staff member activated successfully");
      setActivationDialogOpen(false);
  };



  /* --- REUSABLE PROFILE FORM CONTENT --- */
  const profileFormContent = (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader><SectionHeader icon={User} title="Personal Information" /></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Full Name</Label><div className="font-medium">{staff.name}</div></div>
                        <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Nickname</Label>{isEditing ? <Input value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} className="h-9"/> : <div className="font-medium">{staff.nickname || '-'}</div>}</div>
                        
                        <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Email</Label><div className="font-medium">{staff.email}</div></div>
                        <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Phone</Label><div className="font-medium">{staff.phone}</div></div>
                        
                        {staff.roleType !== 'office' && (
                            <>
                                <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">QID Number</Label><div className="font-medium">{staff.qid}</div></div>
                                <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Nationality</Label><div className="font-medium">{staff.nationality}</div></div>
                            </>
                        )}
                        <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Department</Label><div className="font-medium">{staff.department || 'General'}</div></div>
                    </CardContent>
                </Card>

                {/* Employment / Role Info */}
                <Card>
                    <CardHeader><SectionHeader icon={Briefcase} title="Employment Details" /></CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Position</Label><div className="font-medium">{staff.position}</div></div>
                         <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Employment Status</Label>
                            <Badge variant={staff.employmentStatus === 'Active' ? 'default' : 'secondary'} className={staff.employmentStatus === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                                {staff.employmentStatus}
                            </Badge>
                         </div>
                         <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Joining Date</Label><div className="font-medium">{staff.joiningDate || 'Not set'}</div></div>
                    </CardContent>
                </Card>

                {/* Driver Specific: Vehicle & License */}
                {(staff.position === 'Driver' || staff.roleType === 'driver') && (
                    <Card className="md:col-span-3 border-orange-200 bg-orange-50/30">
                        <CardHeader><SectionHeader icon={TrendingUp} title="Operations & Vehicle" /></CardHeader>
                         <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Assigned Vehicle</Label><div className="font-bold flex items-center gap-2">Toyota Hilux <span className="text-xs font-normal text-gray-500">(12345)</span></div></div>
                            <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">License Category</Label><div className="font-medium">Light Vehicle</div></div>
                            <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">License Number</Label><div className="font-medium">DL-99887766</div></div>
                            <div className="space-y-1"><Label className="text-xs text-muted-foreground uppercase">Expiry</Label><div className="font-medium text-amber-700">2026-05-15</div></div>
                        </CardContent>
                    </Card>
                )}
            </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center">
          <Link href="/workforce">
            <Button variant="ghost" size="sm" className="gap-1 pl-0 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Workforce
            </Button>
          </Link>
        </div>

        {/* ACTIVATION BANNER - Removed in favor of Verification Tab default */}
        {!isDraft && (
        /* --- ACTIVE STAFF HEADER (Original) --- */
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-visible">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              
              {/* Avatar */}
              <div className="relative group shrink-0">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg rounded-2xl">
                    <AvatarImage src={isEditing ? formData.avatar : staff.avatar} className="object-cover" />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {(isEditing ? formData.name : staff.name).substring(0,2)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                           onClick={() => document.getElementById("avatar-upload-input")?.click()}>
                          <Camera className="h-8 w-8 text-white" />
                      </div>
                  )}
                  <input type="file" id="avatar-upload-input" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if(file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFormData(p => ({...p, avatar: reader.result as string}));
                          reader.readAsDataURL(file);
                      }
                  }}/>
              </div>
              
              {/* Info & Status Section */}
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex flex-col xl:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                      {isEditing ? formData.name : staff.name}
                      {staff.verified && <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-50" />}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground">
                       <span className="font-medium bg-gray-100 px-2 py-0.5 rounded">{staff.position}</span>
                       <span>ID: {staff.staffId || staff.id.toString().padStart(4, '0')}</span>
                       {staff.membershipStatus !== 'active' && <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 capitalize">{staff.membershipStatus}</Badge>}
                    </div>
                  </div>

                  {/* STATUS CONTROLS */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/80 p-2 rounded-lg border border-gray-100 self-center xl:self-start w-full sm:w-auto mt-4 xl:mt-0">
                     
                     {/* 1. Work Status Badge (Read Only) */}
                     <TooltipProvider>
                         <Tooltip>
                             <TooltipTrigger asChild>
                                 <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${getWorkStatusColor(workStatusData.status)}`}>
                                     <div className={`h-2 w-2 rounded-full ${workStatusData.status === 'Available' ? 'bg-green-500' : workStatusData.status === 'Offline' ? 'bg-gray-400' : 'bg-blue-500'}`} />
                                     <div className="flex flex-col text-left">
                                         <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 leading-none">Work Status</span>
                                         <span className="text-sm font-bold leading-none">{workStatusData.status}</span>
                                     </div>
                                 </div>
                             </TooltipTrigger>
                             <TooltipContent>
                                 <p className="font-semibold">System Derived Status</p>
                                 <p className="text-xs text-muted-foreground">Based on active jobs and employment status.</p>
                                 {workStatusData.context && <p className="text-xs mt-1 text-blue-300">{workStatusData.context}</p>}
                             </TooltipContent>
                         </Tooltip>
                     </TooltipProvider>

                     <div className="h-8 w-px bg-gray-300 hidden sm:block" />

                     {/* 2. Employment Status Control (Editable) */}
                     <div className="flex items-center gap-2">
                         {!isEditing && (
                             <Select 
                                value={staff.employmentStatus} 
                                onValueChange={(val) => initiateStatusChange(val as EmploymentStatus)}
                             >
                                 <SelectTrigger className="h-9 min-w-[140px] border-none bg-white shadow-sm ring-1 ring-gray-200">
                                     <div className="flex flex-col items-start gap-0.5">
                                         <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider leading-none">Employment</span>
                                         <SelectValue />
                                     </div>
                                 </SelectTrigger>
                                 <SelectContent>
                                     <SelectItem value="Active"><span className="font-semibold text-green-700">Active</span></SelectItem>
                                     <DropdownMenuSeparator />
                                     <SelectItem value="On Leave"><span className="font-medium text-amber-700">On Leave</span></SelectItem>
                                     <SelectItem value="Suspended"><span className="font-medium text-red-700">Suspended</span></SelectItem>
                                     <SelectItem value="Inactive"><span className="font-medium text-gray-500">Inactive</span></SelectItem>
                                 </SelectContent>
                             </Select>
                         )}
                     </div>

                     {/* 3. More Actions */}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEditToggle}><Edit className="h-4 w-4 mr-2" /> Edit Profile</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => initiateStatusChange('Inactive')}>
                                <AlertTriangle className="h-4 w-4 mr-2" /> Deactivate Staff
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>

                     {/* Editing Action Buttons */}
                     {isEditing && (
                        <div className="flex gap-2 ml-auto">
                           <Button size="sm" variant="ghost" onClick={handleEditToggle}>Cancel</Button>
                           <Button size="sm" onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700">Save</Button>
                        </div>
                     )}
                  </div>
                </div>

                {/* Sub-info Row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 pt-3">
                   <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded text-amber-700 border border-amber-100">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-bold">{staff.rating}</span>
                   </div>
                   <div className="hidden md:block w-px h-4 bg-gray-300 mx-1"></div>
                   <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gray-400" /> {staff.phone}</div>
                   <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400" /> {staff.email}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Stats Row - ONLY for Active Staff */}
        {!isDraft && staff.roleType !== 'office' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: "Total Orders", value: staff.jobsCompleted, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Hrs Worked", value: "42.5", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Earnings", value: "5,890", sub: "QAR", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Completion", value: "98%", icon: CheckCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
            ].map((stat, i) => (
                <Card key={i} className="shadow-sm border-gray-100 bg-white/60 hover:bg-white transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                        {stat.sub && <span className="text-xs font-medium text-gray-500">{stat.sub}</span>}
                    </div>
                    </div>
                    <div className={`h-10 w-10 rounded-full ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        )}

        {/* Tabs */}
          {/* MAIN CONTENT Area */}
          {isDraft ? (
             /* --- DRAFT / SPLIT VIEW LAYOUT --- */
             <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 animate-in fade-in slide-in-from-bottom-2">
                
                {/* LEFT SIDEBAR - Identity & Progress */}
                <div className="w-full lg:w-80 shrink-0 space-y-6">
                    {/* Visual ID Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group transition-all hover:shadow-md">
                        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 opacity-30 transform -skew-y-12 translate-y-4"></div>
                        </div>
                        <div className="px-6 pb-6 text-center -mt-12 relative z-10">
                            <div className="relative inline-block">
                                 <Avatar className="h-24 w-24 border-4 border-white shadow-md mx-auto bg-white">
                                    <AvatarImage src={staff.avatar} className="object-cover"/>
                                    <AvatarFallback className="text-2xl font-bold bg-blue-50 text-blue-600">{staff.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow border cursor-pointer hover:bg-gray-50 transition-colors text-gray-500 hover:text-blue-600">
                                    <Camera className="h-3.5 w-3.5" />
                                    <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if(file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setStaff(p => ({...p, avatar: reader.result as string}));
                                            reader.readAsDataURL(file);
                                        }
                                    }}/>
                                </label>
                            </div>
                            
                            <div className="mt-3">
                                 {isEditing ? (
                                     <Input value={staff.name} onChange={e => setStaff({...staff, name: e.target.value})} className="text-center font-bold h-8" />
                                 ) : (
                                     <h3 className="font-bold text-lg text-gray-900 leading-tight flex items-center justify-center gap-2">
                                         {staff.name} <Edit className="h-3 w-3 text-gray-300 cursor-pointer hover:text-blue-500" onClick={() => setIsEditing(true)}/>
                                     </h3>
                                 )}
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{staff.position || "Position Unassigned"}</p>
                            
                            <div className="p-3 bg-gray-50 rounded border border-dashed border-gray-200 mb-2">
                                <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">QID Number</div>
                                <div className="font-mono text-base font-bold text-gray-700 tracking-wide">{staff.qid || "---"}</div>
                            </div>
                            <Badge variant="outline" className={`w-full justify-center py-1 ${staff.membershipStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-gray-100 text-gray-600'}`}>
                                 {staff.membershipStatus === 'pending' ? 'Pending Invite' : 'Draft Profile'}
                            </Badge>
                        </div>

                        {/* Progress Checklist */}
                        <div className="border-t border-gray-100 bg-gray-50/50 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Setup Progress</span>
                                <span className="text-xs font-bold text-blue-600">{completionPercent.toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${completionPercent}%` }}></div>
                            </div>
                            
                            <div className="space-y-2 pt-2">
                                 {['Employment Details', 'Skills & Quals', 'Legal Documents'].map((label, i) => {
                                     const status = i < currentStep ? 'completed' : i === currentStep ? 'current' : 'pending';
                                     // Special check: if step is technically "done" via checks?? 
                                     // Ideally rely on 'currentStep' for now as wizard is linear.
                                     const isDone = i < currentStep; 
                                     return (
                                         <div key={i} 
                                              onClick={() => i <= currentStep && setCurrentStep(i)}
                                              className={`flex items-center gap-3 text-sm p-2 rounded-lg transition-colors cursor-pointer ${status === 'current' ? 'bg-white shadow-sm border border-gray-100' : 'hover:bg-white/50'}`}>
                                             <div className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] ${
                                                 isDone ? 'bg-green-100 border-green-200 text-green-700' : 
                                                 status === 'current' ? 'bg-blue-100 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-300'
                                             }`}>
                                                 {isDone ? <CheckCircle className="h-3 w-3" /> : i + 1}
                                             </div>
                                             <span className={`${status === 'current' ? 'font-semibold text-gray-900' : isDone ? 'text-gray-600' : 'text-gray-400'}`}>
                                                 {label}
                                             </span>
                                         </div>
                                     )
                                 })}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-4 border-t bg-gray-50 flex justify-center">
                             {canActivate ? (
                                 <Button className="w-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 text-white font-semibold transition-all hover:scale-[1.02]" onClick={() => setActivationDialogOpen(true)}>
                                     Activate Staff <ShieldCheck className="w-4 h-4 ml-2"/>
                                 </Button>
                             ) : (
                                 <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-full py-2.5 text-center text-xs text-gray-400 font-medium flex items-center justify-center gap-2 bg-gray-100 rounded border border-gray-200 cursor-not-allowed opacity-70">
                                                <Lock className="h-3 w-3"/> Activation Locked
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>Complete all steps to unlock activation.</TooltipContent>
                                    </Tooltip>
                                 </TooltipProvider>
                             )}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL - WIZARD CONTENT */}
                <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                    {/* Step Header */}
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div>
                             <h2 className="text-xl font-bold text-gray-900">
                                 {currentStep === 0 ? 'Employment Details' : currentStep === 1 ? 'Skills & Capabilities' : 'Legal Documents'}
                             </h2>
                             <p className="text-sm text-gray-500 mt-1">
                                 {currentStep === 0 ? 'Define role, department, and compensation structure.' : 
                                  currentStep === 1 ? 'Add spoken languages and technical competencies.' : 
                                  'Upload required identification and contracts.'}
                             </p>
                        </div>
                        <div className="hidden md:block">
                            <Badge variant="outline" className="px-3 py-1 bg-gray-50">Step {currentStep + 1} of 3</Badge>
                        </div>
                    </div>

                    {/* Step Body - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                         <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                            {currentStep === 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                                        <div className="space-y-2">
                                        <Label>Position <span className="text-red-500">*</span></Label>
                                        <Select value={staff.position} onValueChange={v => setStaff({...staff, position: v})}>
                                            <SelectTrigger className="bg-white"><SelectValue placeholder="Select Position" /></SelectTrigger>
                                            <SelectContent>
                                                {['Cleaner', 'Senior Technician', 'Driver', 'General Assistant'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        </div>
                                        <div className="space-y-2">
                                        <Label>Department <span className="text-red-500">*</span></Label>
                                        <Select value={staff.department || ''} onValueChange={v => setStaff({...staff, department: v})}>
                                            <SelectTrigger className="bg-white"><SelectValue placeholder="Select Department" /></SelectTrigger>
                                            <SelectContent>
                                                {['Operations', 'Logistics', 'Maintenance'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        </div>
                                        <div className="space-y-2">
                                        <Label>Employment Type <span className="text-red-500">*</span></Label>
                                        <Select value={staff.employmentType || 'Full Time'} onValueChange={v => setStaff({...staff, employmentType: v})}>
                                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="Full Time">Full Time</SelectItem><SelectItem value="Part Time">Part Time</SelectItem></SelectContent>
                                        </Select>
                                        </div>
                                        <div className="space-y-2">
                                        <Label>Start Date <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input type="date" className="pl-9 bg-white" value={staff.startDate || ''} onChange={e => setStaff({...staff, startDate: e.target.value})} />
                                        </div>
                                        </div>
                                        <div className="space-y-2">
                                        <Label>Salary Type</Label>
                                        <Select value={staff.salaryType || 'Fixed Monthly'} onValueChange={v => setStaff({...staff, salaryType: v})}>
                                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="Fixed Monthly">Fixed Monthly</SelectItem><SelectItem value="Hourly">Hourly</SelectItem></SelectContent>
                                        </Select>
                                        </div>
                                        <div className="space-y-2">
                                        <Label>Monthly Salary (QAR)</Label>
                                        <Input className="bg-white" value={staff.monthlySalary || ''} onChange={e => setStaff({...staff, monthlySalary: e.target.value})} placeholder="0.00" />
                                        </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-8 p-1">
                                    <div className="space-y-4">
                                        <Label className="text-base font-semibold">Languages Spoken</Label>
                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {(staff.languages || []).map((lang, i) => (
                                                    <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1 gap-1 text-sm">
                                                        {lang} <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => {
                                                            const newLangs = staff.languages.filter(l => l !== lang);
                                                            setStaff({...staff, languages: newLangs});
                                                        }}/>
                                                    </Badge>
                                                ))}
                                                {(staff.languages || []).length === 0 && <span className="text-sm text-gray-400 italic">No languages added</span>}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="text-xs" onClick={() => {
                                                    const l = prompt("Enter language:");
                                                    if(l) setStaff({...staff, languages: [...(staff.languages||[]), l]});
                                                }}><Plus className="h-3 w-3 mr-1"/> Add Language</Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-base font-semibold">Technical Skills</Label>
                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="flex flex-wrap gap-2 mb-4 min-h-[60px]">
                                                {(staff.skills || []).map((skill, i) => (
                                                    <Badge key={i} className="pl-2 pr-1 py-1 gap-1 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
                                                        {skill} <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => {
                                                            const newSkills = staff.skills.filter(s => s !== skill);
                                                            setStaff({...staff, skills: newSkills});
                                                        }}/>
                                                    </Badge>
                                                ))}
                                                {(staff.skills || []).length === 0 && <span className="text-sm text-gray-400 italic flex items-center gap-2"><Info className="h-4 w-4"/> Add skills relevant to the staff's role.</span>}
                                            </div>
                                            <div className="flex gap-2 max-w-sm">
                                                <Input 
                                                    className="h-9"
                                                    placeholder="e.g. Electrical, Plumbing" 
                                                    value={newSkill} 
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleAddSkill();
                                                        }
                                                    }}
                                                />
                                                <Button size="sm" onClick={handleAddSkill} disabled={!newSkill.trim()}>Add Tag</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8 p-1">
                                    <div className="grid grid-cols-1 gap-6">
                                         {/* Upload Zone */}
                                         <div 
                                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all group"
                                            onClick={() => document.getElementById("wizard-upload")?.click()}
                                         >
                                              <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                                  <Upload className="h-8 w-8 text-blue-600"/>
                                              </div>
                                              <div className="font-semibold text-gray-900 text-lg">Click to upload or drag and drop</div>
                                              <div className="text-sm text-muted-foreground mt-1 max-w-xs">Upload QID, Passport, Employment Contracts or Visa copies</div>
                                              <input type="file" id="wizard-upload" className="hidden" onChange={handleDocumentUpload} />
                                         </div>

                                         {/* File List */}
                                         <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Uploaded Documents ({activeDocuments.length})</h3>
                                            {activeDocuments.length === 0 ? (
                                                <div className="text-center py-8 text-gray-400 italic bg-gray-50 rounded-lg">No documents uploaded yet.</div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {activeDocuments.map((doc) => (
                                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 bg-red-50 rounded flex items-center justify-center text-red-600">
                                                                    <FileText className="h-5 w-5"/>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-sm text-gray-900">{doc.name}</div>
                                                                    <div className="text-xs text-gray-500">{doc.type} • Exp: {doc.expiry}</div>
                                                                </div>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                                                                <Trash2 className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                         </div>
                                    </div>
                                </div>
                            )}
                         </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
                         <Button 
                            variant="outline" 
                            disabled={currentStep === 0}
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="w-32"
                         >
                             <ChevronLeft className="h-4 w-4 mr-2"/> Back
                         </Button>

                         <Button 
                             onClick={() => {
                                 if(currentStep < 2) setCurrentStep(currentStep + 1);
                                 else if(canActivate) setActivationDialogOpen(true);
                             }}
                             disabled={currentStep === 2 && !canActivate}
                             className={`w-40 ${currentStep === 2 && canActivate ? 'bg-green-600 hover:bg-green-700' : ''}`}
                         >
                             {currentStep < 2 ? (
                                 <>Next Step <ChevronRight className="h-4 w-4 ml-2"/></>
                             ) : (
                                 <>Review & Finish</>
                             )}
                         </Button>
                    </div>
                </div>
                
             </div>
          ) : (
          /* --- ACTIVE STAFF VIEW (Standard Tabs) --- */
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1 backdrop-blur-md rounded-xl mb-6">
            
            <TabsTrigger value="profile">Profile</TabsTrigger>
            
            {/* Field Staff Tabs */}
            {staff.roleType !== 'office' && (
                <>
                        <>
                            <TabsTrigger value="schedule">Schedule</TabsTrigger>
                            {(staff.position === 'Driver' || staff.roleType === 'driver') && <TabsTrigger value="trips">Trips & Route</TabsTrigger>}
                            <TabsTrigger value="availability">Availability</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="payouts">Payouts</TabsTrigger>
                        </>
                </>
            )}

            {/* Internal Staff Tabs */}
            {staff.roleType === 'office' && (
                <>
                    <TabsTrigger value="roles">Role & Permissions</TabsTrigger>
                    <TabsTrigger value="activity">Activity Log</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </>
            )}
          </TabsList>
          
          {/* Tab Content Components */}
          <TabsContent value="profile" className="space-y-6">
            {profileFormContent}
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
             <Card>
                <CardHeader className="py-4"><CardTitle className="text-base font-semibold flex items-center gap-2"><CalendarCheck className="h-4 w-4 text-blue-500" /> Upcoming Schedule</CardTitle></CardHeader>
                <CardContent>
                   <Table>
                      <TableHeader><TableRow><TableHead>Ref ID</TableHead><TableHead>Date & Time</TableHead><TableHead>Service</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                      <TableBody>
                          {mockBookings.map(bookings => (
                              <TableRow key={bookings.id}>
                                  <TableCell className="font-medium">{bookings.id}</TableCell>
                                  <TableCell><div className="flex flex-col"><span className="font-medium">{bookings.date}</span><span className="text-xs text-muted-foreground">{bookings.time}</span></div></TableCell>
                                  <TableCell>{bookings.service}</TableCell>
                                  <TableCell><Badge variant={bookings.status === 'Completed' ? 'default' : bookings.status === 'Scheduled' ? 'secondary' : bookings.status === 'In Progress' ? 'default' : 'outline'} className={bookings.status === 'In Progress' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : ''}>{bookings.status}</Badge></TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                   </Table>
                </CardContent>
             </Card>
          </TabsContent>

          {/* Driver Trips Content */}
          <TabsContent value="trips" className="mt-6 animate-in fade-in slide-in-from-bottom-2">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 {/* Current Trip Card */}
                 <Card className="border-blue-200 bg-blue-50/50">
                     <CardHeader className="py-3 items-start"><CardTitle className="text-sm text-blue-700 flex items-center gap-2"><MapPin className="h-4 w-4" /> Current Trip</CardTitle></CardHeader>
                     <CardContent>
                         <h3 className="font-bold text-lg">TR-2938</h3>
                         <div className="text-sm text-gray-600 mt-1">To: Pearl Qatar, Tower 4</div>
                         <div className="mt-4 flex items-center gap-2">
                             <Badge>In Transit</Badge>
                             <span className="text-xs text-muted-foreground">ETA: 15 mins</span>
                         </div>
                     </CardContent>
                 </Card>
                  {/* Trip Stats */}
                 <Card>
                     <CardHeader className="py-3"><CardTitle className="text-sm text-gray-500">Trip Performance (30 Days)</CardTitle></CardHeader>
                     <CardContent>
                         <div className="text-3xl font-bold">142</div>
                         <p className="text-xs text-muted-foreground mt-1">Completed Trips</p>
                     </CardContent>
                 </Card>
                 <Card>
                     <CardHeader className="py-3"><CardTitle className="text-sm text-gray-500">On-Time Rate</CardTitle></CardHeader>
                     <CardContent>
                         <div className="text-3xl font-bold text-green-600">98.5%</div>
                         <p className="text-xs text-muted-foreground mt-1">Target: &gt;95%</p>
                     </CardContent>
                 </Card>
             </div>

             <Card>
                 <CardHeader className="py-4"><CardTitle className="text-base font-semibold">Trip History</CardTitle></CardHeader>
                 <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Trip ID</TableHead><TableHead>Route</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">TR-2930</TableCell>
                                <TableCell>Warehouse &rarr; West Bay (Delivery)</TableCell>
                                <TableCell>10:00 AM</TableCell>
                                <TableCell><Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">Completed</Badge></TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">TR-2928</TableCell>
                                <TableCell>Staff Pickup &rarr; Lusail</TableCell>
                                <TableCell>07:30 AM</TableCell>
                                <TableCell><Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">Completed</Badge></TableCell>
                            </TableRow>
                        </TableBody>
                     </Table>
                 </CardContent>
             </Card>
          </TabsContent>


          <TabsContent value="availability" className="mt-6"><div className="p-10 text-center text-muted-foreground bg-gray-50 rounded-lg border border-dashed">Availability Component Ready</div></TabsContent>
          <TabsContent value="documents" className="mt-6">
            <Card>
                <CardHeader className="py-4 flex flex-row items-center justify-between"><CardTitle className="text-base font-semibold">Documents</CardTitle><Button size="sm" variant="outline"><Plus className="h-3 w-3 mr-1"/> Upload</Button></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Expiry</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                    <TableBody>{activeDocuments.map(doc => (<TableRow key={doc.id}><TableCell>{doc.name}</TableCell><TableCell>{doc.expiry}</TableCell><TableCell><Badge variant="outline">{doc.status}</Badge></TableCell></TableRow>))}</TableBody>
                  </Table>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payouts" className="mt-6">
             <Card>
                 <CardHeader className="py-4"><CardTitle className="text-base font-semibold">Compensation History</CardTitle></CardHeader>
                 <CardContent>
                     <Table>
                         <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                         <TableBody>{mockPayouts.map(pay => (<TableRow key={pay.id}><TableCell>{pay.id}</TableCell><TableCell className="font-bold">{pay.amount}</TableCell><TableCell><Badge variant="outline" className="text-green-600 bg-green-50">{pay.status}</Badge></TableCell></TableRow>))}</TableBody>
                     </Table>
                 </CardContent>
             </Card>
          </TabsContent>


          <TabsContent value="verification" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Header & Progress */}
             <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-blue-950">Active Onboarding</h2>
                    <p className="text-blue-600/80">Complete all 4 sections to activate this staff member.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-48 h-3 bg-blue-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${completionPercent}%` }}
                        />
                    </div>
                    <span className="font-bold text-blue-700 w-12 text-right">{completionPercent}%</span>
                </div>
             </div>

             {/* Steps Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Basic Information */}
                <div className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${reqs.personal ? 'border-transparent bg-white shadow-sm' : 'border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}>
                    {reqs.personal && <div className="absolute top-0 right-0 p-3"><div className="bg-green-100 text-green-700 p-1 rounded-full"><CheckCircle className="h-4 w-4" /></div></div>}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${reqs.personal ? 'bg-blue-100/50 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Basic Information</h3>
                                <p className="text-xs text-muted-foreground">Identity & Contact info</p>
                            </div>
                        </div>
                         <div className="pt-2">
                             <div className="text-sm flex justify-between items-center">
                                 {reqs.personal ? <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3"/> Completed</span> : <span className="text-amber-600 font-medium">Incomplete</span>}
                                 <Button variant={reqs.personal ? "ghost" : "default"} size="sm" onClick={handleEditAndRedirect} className={!reqs.personal ? "bg-blue-600 hover:bg-blue-700" : ""}>
                                     {reqs.personal ? 'Review' : 'Start'}
                                 </Button>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 2. Employment Details */}
                <div className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${reqs.employment ? 'border-transparent bg-white shadow-sm' : 'border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}>
                    {reqs.employment && <div className="absolute top-0 right-0 p-3"><div className="bg-green-100 text-green-700 p-1 rounded-full"><CheckCircle className="h-4 w-4" /></div></div>}
                   <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${reqs.employment ? 'bg-purple-100/50 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Employment Contract</h3>
                                <p className="text-xs text-muted-foreground">Role, Dept & Joining Date</p>
                            </div>
                        </div>
                         <div className="pt-2">
                             <div className="text-sm flex justify-between items-center">
                                 {reqs.employment ? <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3"/> Completed</span> : <span className="text-amber-600 font-medium">Missing Details</span>}
                                 <Button variant={reqs.employment ? "ghost" : "default"} size="sm" onClick={handleEditAndRedirect} className={!reqs.employment ? "bg-blue-600 hover:bg-blue-700" : ""}>
                                     {reqs.employment ? 'Edit' : 'Add Info'}
                                 </Button>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 3. Skills */}
                <div className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${reqs.skills ? 'border-transparent bg-white shadow-sm' : 'border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}>
                    {reqs.skills && <div className="absolute top-0 right-0 p-3"><div className="bg-green-100 text-green-700 p-1 rounded-full"><CheckCircle className="h-4 w-4" /></div></div>}
                    <div className="p-6 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${reqs.skills ? 'bg-amber-100/50 text-amber-600' : 'bg-gray-200 text-gray-500'}`}>
                                <Star className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Skills & Capabilities</h3>
                                <p className="text-xs text-muted-foreground">Competencies & Tags</p>
                            </div>
                        </div>
                         <div className="pt-2">
                             <div className="text-sm flex justify-between items-center">
                                 {reqs.skills ? <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3"/> {staff.skills?.length} Added</span> : <span className="text-amber-600 font-medium">Required</span>}
                                 <Button variant={reqs.skills ? "ghost" : "default"} size="sm" onClick={() => setSkillDialogOpen(true)} className={!reqs.skills ? "bg-blue-600 hover:bg-blue-700" : ""}>
                                     Manage
                                 </Button>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 4. Documents */}
                <div className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${reqs.docs ? 'border-transparent bg-white shadow-sm' : 'border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}>
                    {reqs.docs && <div className="absolute top-0 right-0 p-3"><div className="bg-green-100 text-green-700 p-1 rounded-full"><CheckCircle className="h-4 w-4" /></div></div>}
                     <div className="p-6 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${reqs.docs ? 'bg-indigo-100/50 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Legal Documents</h3>
                                <p className="text-xs text-muted-foreground">ID, Visa, employment contract</p>
                            </div>
                        </div>
                         <div className="pt-2">
                             <div className="text-sm flex justify-between items-center">
                                 {reqs.docs ? <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3"/> {activeDocuments.length} Uploaded</span> : <span className="text-amber-600 font-medium">Missing files</span>}
                                 
                                 <Button variant={reqs.docs ? "ghost" : "default"} size="sm" onClick={() => document.getElementById("doc-upload-hidden")?.click()} className={!reqs.docs ? "bg-blue-600 hover:bg-blue-700" : ""}>
                                    <Upload className="h-3 w-3 mr-2" />
                                    {reqs.docs ? 'Add More' : 'Upload'}
                                 </Button>
                                 <input type="file" id="doc-upload-hidden" className="hidden" onChange={handleDocumentUpload} /> 
                             </div>
                        </div>
                    </div>
                </div>

             </div>

             {/* Activation Zone */}
             <div className="mt-8 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="p-8 text-center space-y-6">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${canActivate ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-300'}`}>
                         <ShieldCheck className="h-8 w-8" />
                    </div>
                    
                    <div className="space-y-2 max-w-lg mx-auto">
                        <h3 className="text-xl font-bold text-gray-900">
                            {canActivate ? "Ready for Activation" : "Profile Incomplete"}
                        </h3>
                        <p className="text-gray-500 leading-relaxed">
                             {canActivate 
                                ? "Great job! All requirements have been met. You can now activate this staff member. They will become visible in dispatch assignments and the mobile app." 
                                : `You need to complete ${4 - completionSteps} more section(s) before you can activate this staff member.`}
                        </p>
                    </div>

                    <div className="flex justify-center pt-2">
                        <div className="relative">
                            {canActivate && <div className="absolute -inset-1 bg-green-500 rounded-lg blur opacity-30 animate-pulse"></div>}
                            {canActivate ? (
                                  <Button size="lg" onClick={() => setActivationDialogOpen(true)} className="relative bg-green-600 hover:bg-green-700 text-white px-10 h-12 text-base font-bold shadow-xl transition-all scale-100 hover:scale-[1.02]">
                                      Activate Staff Member
                                  </Button>
                            ) : (
                                  <Button disabled size="lg" className="bg-gray-100 text-gray-400 border border-gray-200 px-8 h-12 text-base font-semibold cursor-not-allowed">
                                      Activate Staff (Locked)
                                  </Button>
                            )}
                        </div>
                    </div>
                </div>
                 
                 {/* Footer Status Bar */}
                 <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-wrap justify-center gap-6 md:gap-12 text-xs text-gray-400 font-bold uppercase tracking-widest">
                      <div className={`flex items-center gap-2 transition-colors ${canActivate ? 'text-green-700/70' : ''}`}>
                         <div className={`h-2.5 w-2.5 rounded-full ${canActivate ? 'bg-green-500' : 'bg-gray-300'}`} />
                         Assignable
                      </div>
                      <div className={`flex items-center gap-2 transition-colors ${canActivate ? 'text-green-700/70' : ''}`}>
                         <div className={`h-2.5 w-2.5 rounded-full ${canActivate ? 'bg-green-500' : 'bg-gray-300'}`} />
                         App Access
                      </div>
                      <div className={`flex items-center gap-2 transition-colors ${canActivate ? 'text-green-700/70' : ''}`}>
                         <div className={`h-2.5 w-2.5 rounded-full ${canActivate ? 'bg-green-500' : 'bg-gray-300'}`} />
                         Payroll Ready
                      </div>
                 </div>
             </div>

                {/* Skills Dialog */}
                <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Skills</DialogTitle>
                            <DialogDescription>Add valid skills or qualifications for this staff member.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex flex-wrap gap-2">
                                {staff.skills?.map((s, i) => (
                                    <Badge key={i} variant="secondary">{s}</Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Enter skill name (e.g. Electrical)" 
                                    value={newSkill} 
                                    onChange={(e) => setNewSkill(e.target.value)}
                                />
                                <Button onClick={handleAddSkill}>Add</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
           </TabsContent>

          {/* --- NEW TABS FOR INTERNAL STAFF --- */}
          <TabsContent value="roles" className="mt-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><SectionHeader icon={ShieldCheck} title="Assigned Role" /></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                                {(staff.position || 'ST').substring(0,2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-purple-900">{staff.position || 'Staff'}</h3>
                                <p className="text-sm text-purple-600">Full Access Scope</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                             <div className="text-sm font-medium text-gray-500 uppercase">Permissions</div>
                             <ul className="space-y-1 text-sm">
                                 <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Manage Workforce</li>
                                 <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> View Financials</li>
                                 <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Edit System Settings</li>
                             </ul>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><SectionHeader icon={Lock} title="Access Settings" /></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Dashboard Access</div>
                                <div className="text-sm text-muted-foreground">User can log in to admin panel</div>
                            </div>
                            <Switch checked={true} />
                        </div>
                         <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Two-Factor Auth</div>
                                <div className="text-sm text-muted-foreground">Require 2FA for login</div>
                            </div>
                            <Switch checked={false} />
                        </div>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6 animate-in fade-in slide-in-from-bottom-2">
             <Card>
                 <CardHeader className="py-4"><CardTitle className="text-base font-semibold">Audit Log</CardTitle></CardHeader>
                 <CardContent>
                     <Table>
                         <TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>Action</TableHead><TableHead>Details</TableHead></TableRow></TableHeader>
                         <TableBody>
                             <TableRow>
                                 <TableCell className="text-gray-500">2025-12-23 09:15 AM</TableCell>
                                 <TableCell className="font-medium">Login</TableCell>
                                 <TableCell>Successful login from IP 192.168.1.1</TableCell>
                             </TableRow>
                             <TableRow>
                                 <TableCell className="text-gray-500">2025-12-22 04:30 PM</TableCell>
                                 <TableCell className="font-medium">Updated Staff</TableCell>
                                 <TableCell>Modified #WB-0042 details</TableCell>
                             </TableRow>
                             <TableRow>
                                 <TableCell className="text-gray-500">2025-12-20 02:00 PM</TableCell>
                                 <TableCell className="font-medium">Export Data</TableCell>
                                 <TableCell>Exported Monthly Report</TableCell>
                             </TableRow>
                         </TableBody>
                     </Table>
                 </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 animate-in fade-in slide-in-from-bottom-2">
             <Card className="border-red-100">
                 <CardHeader><SectionHeader icon={ShieldCheck} title="Security Actions" /></CardHeader>
                 <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded bg-gray-50">
                         <div>
                             <div className="font-bold text-gray-900">Reset Password</div>
                             <div className="text-sm text-gray-500">Send a password reset email to {staff.email}</div>
                         </div>
                         <Button variant="outline">Reset Password</Button>
                     </div>
                     <div className="flex items-center justify-between p-4 border rounded bg-red-50 border-red-100">
                         <div>
                             <div className="font-bold text-red-900">Revoke Access</div>
                             <div className="text-sm text-red-600">Force logout and prevent new logins</div>
                         </div>
                         <Button variant="destructive">Revoke Access</Button>
                     </div>
                 </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      )}
      </div>

      {/* STATUS CHANGE CONFIRMATION DIALOG */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-5 w-5" />
                    Change Employment Status
                </DialogTitle>
                <DialogDescription>
                    You are checking the staff status to <strong>{pendingEmploymentStatus}</strong>.
                    This will prevent them from being assigned to new jobs.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
                {/* Impact Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 space-y-2">
                    <h4 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
                        <Info className="h-4 w-4" /> Impact on Current Operation
                    </h4>
                    <div className="text-sm text-gray-700 space-y-1">
                        {impactAnalysis.inProgress.length > 0 && (
                            <div className="flex items-center justify-between text-red-700 font-medium">
                                <span>In-Progress Jobs:</span>
                                <span>{impactAnalysis.inProgress.length}</span>
                            </div>
                        )}
                        {impactAnalysis.scheduled.length > 0 && (
                            <div className="flex items-center justify-between">
                                <span>Scheduled Future Jobs:</span>
                                <span>{impactAnalysis.scheduled.length}</span>
                            </div>
                        )}
                        {impactAnalysis.totalImpact === 0 && (
                            <div className="text-green-600">No active or scheduled jobs will be affected.</div>
                        )}
                    </div>
                </div>

                {/* On Leave Specific Inputs */}
                {pendingEmploymentStatus === 'On Leave' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs">Start Date</Label>
                            <Input 
                                type="date" 
                                value={leaveDates.start} 
                                onChange={e => setLeaveDates({...leaveDates, start: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">End Date (Optional)</Label>
                            <Input 
                                type="date" 
                                value={leaveDates.end} 
                                onChange={e => setLeaveDates({...leaveDates, end: e.target.value})}
                            />
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
                <Button 
                    variant={impactAnalysis.inProgress.length > 0 ? "destructive" : "default"} // Red if interrupting jobs
                    onClick={confirmStatusChange}
                >
                    {impactAnalysis.totalImpact > 0 ? `Unassign Jobs & set ${pendingEmploymentStatus}` : `Confirm ${pendingEmploymentStatus}`}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ACTIVATION DIALOG */}
       <Dialog open={activationDialogOpen} onOpenChange={setActivationDialogOpen}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    Activate Staff Member
                </DialogTitle>
                <DialogDescription>
                    Review the requirements before activating <strong>{staff.name}</strong>.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                             <div className={`p-1 rounded-full ${reqs.personal ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                 {reqs.personal ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                             </div>
                             <span className="text-sm font-medium">Personal Information</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                         <div className="flex items-center gap-3">
                             <div className={`p-1 rounded-full ${reqs.employment ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                 {reqs.employment ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                             </div>
                             <span className="text-sm font-medium">Employment Details</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                         <div className="flex items-center gap-3">
                             <div className={`p-1 rounded-full ${reqs.skills ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                 {reqs.skills ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                             </div>
                             <span className="text-sm font-medium">Skills & Qualifications</span>
                        </div>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                         <div className="flex items-center gap-3">
                             <div className={`p-1 rounded-full ${reqs.docs ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                 {reqs.docs ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                             </div>
                             <span className="text-sm font-medium">Documents (Mocked)</span>
                        </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 text-sm rounded border border-blue-100">
                     <Info className="h-4 w-4" />
                     Staff will become visible in dispatch and assignable.
                 </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setActivationDialogOpen(false)}>Cancel</Button>
                <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleActivate}
                    disabled={!canActivate}
                >
                    Confirm Activation
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}
