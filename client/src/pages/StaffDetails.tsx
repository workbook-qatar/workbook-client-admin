import { useState, useEffect, useMemo } from "react";
import { useRoute, useLocation, Link } from "wouter";
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
  roleType: "Field Service", // Default
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
  const [, setLocation] = useLocation();
  
  // State
  const [staff, setStaff] = useState(mockStaffData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockStaffData);

  // Status Change Dialog State
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const [pendingEmploymentStatus, setPendingEmploymentStatus] = useState<EmploymentStatus | null>(null);
  const [leaveDates, setLeaveDates] = useState({ start: '', end: '' });

  // State
  const [activeTab, setActiveTab] = useState("profile");
  const [activeDocuments, setActiveDocuments] = useState(mockDocuments);


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
          
          
          setStaff(merged);
          setFormData(merged);
          
          // Redirect if pending
          if (merged.membershipStatus !== 'active') {
             setLocation(`/workforce/pending/${merged.id}`);
             return;
          }
        }
      } catch (e) { console.error(e); }
    }
  }, [params?.id, setLocation]);


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
                        
                        {staff.roleType !== 'Internal Staff' && (
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

        {/* ACTIVE STAFF HEADER */}
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
        
        {/* Stats Row */}
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

        {/* Tabs */}
          {/* MAIN CONTENT Area */}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1 backdrop-blur-md rounded-xl mb-6">
            
            <TabsTrigger value="profile">Profile</TabsTrigger>
            
            {/* Field Staff Tabs */}
            {staff.roleType !== 'Internal Staff' && (
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
            {staff.roleType === 'Internal Staff' && (
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
      


    </DashboardLayout>
  );
}
