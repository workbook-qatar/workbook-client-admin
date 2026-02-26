import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserCheck,
  Briefcase,
  Truck,
  Clock,
  Search,
  List,
  LayoutGrid,
  SlidersHorizontal,
  Eye,
  Plus,
  AlertTriangle,
  Mail,
  Phone,
  MoreHorizontal,
  RefreshCw,
  XCircle,
  Pencil,
  CheckCircle2,
  ArrowRight,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Staff Member Interface
export interface StaffMember {
  id: string;
  staffId: string; // WB1, WB2, etc.
  name: string;
  role: string;
  roleType: "Field Service" | "Internal Staff" | "driver" | "part-time";
  email: string;
  phone: string;
  location: string;

  // Operational Status
  status: "available" | "on-job" | "on-leave" | "offline";
  employmentStatus: "Active" | "On Leave" | "Suspended" | "Inactive";

  // Membership / Invite Status
  membershipStatus:
    | "active"
    | "draft"
    | "pending"
    | "rejected"
    | "expired"
    | "cancelled"
    | "accepted";
  inviteSentAt?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean; // via Staff App OTP

  avatar: string;
  avatarColor: string;
  // Enhanced fields
  documentExpiring?: boolean;
  availabilityHours?: number;
  activeJobs?: number;
  rating?: number;
  jobsCompleted?: number;
  skills?: string[]; // Array of skills
}

// Sample Data
const SAMPLE_STAFF: StaffMember[] = [
  {
    id: "1",
    staffId: "WB1",
    name: "NISAR KORAMMAN KANDY MOIDEEN",
    role: "Cleaner",
    roleType: "Field Service",
    email: "nisar@workbook.com",
    phone: "+97488997788",
    location: "India",
    status: "available",
    employmentStatus: "Active",
    membershipStatus: "active",
    emailVerified: true,
    phoneVerified: true,
    avatar: "NK",
    avatarColor: "bg-purple-600",
    availabilityHours: 24,
    activeJobs: 3,
    rating: 4.9,
    jobsCompleted: 156,
    skills: [
      "Deep Cleaning",
      "AC Cleaning",
      "Carpet Cleaning",
      "Window Cleaning",
    ],
  },
  {
    id: "2",
    staffId: "WB2",
    name: "fgdfdfg",
    role: "Cleaner",
    roleType: "Field Service",
    email: "dgdfgds@hfh.vv",
    phone: "+974556434554",
    location: "Vietnam",
    status: "available",
    employmentStatus: "Active",
    membershipStatus: "active",
    emailVerified: true,
    phoneVerified: true,
    avatar: "FG",
    avatarColor: "bg-green-600",
    availabilityHours: 28,
    activeJobs: 2,
    rating: 4.8,
    jobsCompleted: 142,
    skills: ["General Cleaning", "Sanitization", "Floor Polishing"],
  },
  {
    id: "3",
    staffId: "WB3",
    name: "FAIS KAPPIKKUNNUMMAL",
    role: "Cleaner",
    roleType: "Internal Staff",
    email: "fais@gmail.com",
    phone: "+9745687879",
    location: "India",
    status: "available",
    employmentStatus: "Active",
    membershipStatus: "active",
    emailVerified: true,
    phoneVerified: true,
    avatar: "FK",
    avatarColor: "bg-teal-600",
    documentExpiring: true,
    availabilityHours: 30,
    activeJobs: 5,
    rating: 4.7,
    jobsCompleted: 138,
    skills: ["Office Cleaning", "Desk Organization"],
  },
  // Pending Invites Examples
  {
    id: "p1",
    staffId: "",
    name: "New Recruit 1",
    role: "Driver",
    roleType: "driver",
    email: "driver.new@example.com",
    phone: "+97466778899",
    location: "Qatar",
    status: "offline",
    employmentStatus: "Active", // Will become active once verified
    membershipStatus: "pending",
    inviteSentAt: "2025-12-23T10:00:00",
    emailVerified: false,
    phoneVerified: true, // Only email pending
    avatar: "NR",
    avatarColor: "bg-gray-400",
  },
  {
    id: "p2",
    staffId: "",
    name: "Pending Staff 2",
    role: "Field Technician",
    roleType: "Field Service",
    email: "tech.pending@example.com",
    phone: "+97455443322",
    location: "Qatar",
    status: "offline",
    employmentStatus: "Active",
    membershipStatus: "expired",
    inviteSentAt: "2025-12-15T09:00:00",
    emailVerified: false,
    phoneVerified: false,
    avatar: "PS",
    avatarColor: "bg-gray-400",
  },
];

const ROLE_CATEGORIES = [
  { id: 'Field Service', name: 'Field Service Staff', icon: UserCheck },
  { id: 'driver', name: 'Driver', icon: Truck },
  { id: 'Internal Staff', name: 'Internal Staff', icon: Briefcase },
];

export default function Workforce() {
  const [, setLocation] = useLocation();
  const [staff, setStaff] = useState<StaffMember[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const ITEMS_PER_PAGE = 7;

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("invite") === "true") {
      setIsInviteOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("vendor_staff");
    if (stored) {
      let parsedStaff = JSON.parse(stored);
      // Migration: Ensure membershipStatus exists
      parsedStaff = parsedStaff.map((s: any) => ({
        ...s,
        membershipStatus: s.membershipStatus || "active", // Default legacy to active
        employmentStatus: s.employmentStatus || "Active",
        roleType: s.roleType === "field" ? "Field Service" : s.roleType === "office" ? "Internal Staff" : s.roleType
      }));
      setStaff(parsedStaff);
    } else {
      setStaff(SAMPLE_STAFF);
      localStorage.setItem("vendor_staff", JSON.stringify(SAMPLE_STAFF));
    }
  }, []);

  const saveStaff = (newStaff: StaffMember[]) => {
    setStaff(newStaff);
    localStorage.setItem("vendor_staff", JSON.stringify(newStaff));
  };

  const handleInviteSubmit = () => {
    if (!inviteData.name || !inviteData.email || !inviteData.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newId = Date.now().toString();
    const newInvite: StaffMember = {
      id: newId,
      staffId: "",
      name: inviteData.name,
      role: inviteData.role,
      roleType: inviteData.role === "Driver" ? "driver" : inviteData.role === "Internal Staff" ? "Internal Staff" : "Field Service",
      email: inviteData.email,
      phone: "",
      location: "",
      status: "offline",
      employmentStatus: "Active",
      membershipStatus: "pending",
      inviteSentAt: new Date().toISOString(),
      emailVerified: false,
      phoneVerified: false,
      avatar: inviteData.name.substring(0, 2).toUpperCase(),
      avatarColor: "bg-blue-600",
    };

    saveStaff([...staff, newInvite]);
    toast.success("Invite sent successfully.");
    setIsInviteOpen(false);
    setInviteData({ name: "", email: "", role: "" });
  };

  // ------------------------------------------------------------------
  // View Logic
  // ------------------------------------------------------------------

  // Active Workforce List
  const activeWorkforce = staff.filter(s => s.membershipStatus === "active");

  const categoriesWithCounts = ROLE_CATEGORIES.map(rc => ({
      ...rc,
      count: activeWorkforce.filter(p => p.roleType === rc.id).length
  }));

  const filteredActiveStaff = activeWorkforce.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);

    const matchesWorkStatus =
      selectedStatus === "all" || s.status === selectedStatus;

    const matchesRole = !selectedRole || s.roleType === selectedRole;

    const matchesInactive = showInactive
      ? true
      : s.employmentStatus !== "Inactive";

    return matchesSearch && matchesWorkStatus && matchesRole && matchesInactive;
  });

  // Derived Pagination
  const totalPages = Math.ceil(filteredActiveStaff.length / ITEMS_PER_PAGE) || 1;
  const paginatedStaff = filteredActiveStaff.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setIsTableLoading(true);
    setCurrentPage(page);
    setTimeout(() => setIsTableLoading(false), 400); // Simulate local data load
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedRole, showInactive]);

  // Pending Invites List
  const pendingInvites = staff.filter(s =>
    ["pending", "draft", "expired", "rejected"].includes(s.membershipStatus)
  );

  // Stats
  const stats = {
    total: activeWorkforce.length,
    field: activeWorkforce.filter(s => s.roleType === "Field Service").length,
    office: activeWorkforce.filter(s => s.roleType === "Internal Staff").length,
    drivers: activeWorkforce.filter(s => s.roleType === "driver").length,
    pending: pendingInvites.filter(s => s.membershipStatus === "pending")
      .length,
  };

  // Helpers
  const getStatusBadge = (workStatus: string, empStatus: string) => {
    if (empStatus === "Inactive")
      return "bg-gray-100 text-gray-500 line-through px-2.5 py-0.5 rounded-full font-medium shadow-none";
    if (empStatus === "Suspended")
      return "bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full font-medium shadow-none";
    if (empStatus === "On Leave")
      return "bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full font-medium shadow-none";

    const styles = {
      available: "bg-green-100/60 text-green-700",
      "on-job": "bg-blue-50 text-blue-700",
      "on-leave": "bg-amber-50 text-amber-700",
      offline: "bg-gray-100 text-gray-600",
    };
    return `${styles[workStatus as keyof typeof styles] || styles.available} px-2.5 py-0.5 rounded-full font-medium shadow-none`;
  };

  const STYLES = {
      card: "bg-white border-gray-200 shadow-sm transition-shadow",
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-gray-50/50">
        
        {/* Page Header */}
        <div className="px-8 py-6 border-b bg-white flex items-center justify-between sticky top-0 z-20 shrink-0">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Workforce Management</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage active workforce members and assignments</p>
            </div>
            <div className="flex gap-3 items-center">
                 <Button variant="outline" onClick={() => setLocation("/workforce/pending")} className="h-10 gap-2 font-medium text-gray-600 hover:text-gray-900">
                    <Mail className="h-4 w-4" /> Pending Invites
                    {stats.pending > 0 && (
                        <span className="ml-1 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">{stats.pending}</span>
                    )}
                 </Button>
                 <Button onClick={() => setIsInviteOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 px-4 h-10 gap-2">
                    <Plus className="h-4 w-4" /> Invite User
                 </Button>
            </div>
        </div>

        {/* Scrollable Main Workspace */}
        <div className="flex-1 overflow-auto p-8">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-6 h-full min-h-0">

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm shrink-0">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search name, phone..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500 shadow-sm transition-all"
                        />
                    </div>
                    
                    <div className="h-6 w-px bg-gray-200 mx-1"></div>

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[160px] h-10 border-gray-200 text-gray-600 shadow-sm bg-white">
                            <SelectValue placeholder="Work Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="on-job">On Job</SelectItem>
                            <SelectItem value="on-leave">On Leave</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="h-6 w-px bg-gray-200 mx-1"></div>

                    <div className="flex items-center space-x-3 px-2">
                        <Switch
                            id="show-inactive"
                            checked={showInactive}
                            onCheckedChange={setShowInactive}
                        />
                        <Label
                            htmlFor="show-inactive"
                            className="text-sm cursor-pointer font-medium text-gray-600"
                        >
                            Show Inactive
                        </Label>
                    </div>

                </div>

                {/* Main Content Split View */}
                <div className="flex-1 min-h-[400px] flex gap-6">
                    
                    {/* LEFT PANEL: Role Categories (Matching Pending Invites / Services) */}
                    <Card className={`w-[280px] flex flex-col flex-none ${STYLES.card} h-full overflow-hidden rounded-xl border border-gray-200 shadow-sm`}>
                        <div className="p-4 border-b flex items-center justify-between bg-gray-50/80 backdrop-blur-sm">
                            <h3 className="font-bold text-gray-900 tracking-wide uppercase text-xs">Role Selection</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-white">
                            <button
                                onClick={() => setSelectedRole(null)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all ${
                                    selectedRole === null ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 font-medium'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="h-4 w-4 opacity-70" />
                                    <span>All Roles</span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedRole === null ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {activeWorkforce.length}
                                </span>
                            </button>
                            
                            {categoriesWithCounts.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedRole(cat.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all ${
                                        selectedRole === cat.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 font-medium'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <cat.icon className="h-4 w-4 opacity-70" />
                                        <span>{cat.name}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedRole === cat.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {cat.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* RIGHT PANEL: List Data */}
                    <Card className={`flex-1 flex flex-col ${STYLES.card} h-full overflow-hidden rounded-xl border border-gray-200 shadow-sm`}>
                        <div className="flex-1 overflow-auto bg-white p-0">
                            
                            {filteredActiveStaff.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-white pb-12">
                                    <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                                        <Users className="h-8 w-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No workforce members found.</p>
                                    <p className="text-sm text-gray-400 mt-1">Try changing your active filters.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-gray-50/90 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-12 px-5 py-4">
                                                <Checkbox className="border-gray-300" />
                                            </TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Staff Member</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Contact</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Role</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Status</TableHead>
                                            <TableHead className="text-end text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isTableLoading ? (
                                            Array.from({ length: Math.min(ITEMS_PER_PAGE, filteredActiveStaff.length) || ITEMS_PER_PAGE }).map((_, idx) => (
                                                <TableRow key={`skeleton-${idx}`}>
                                                    <TableCell colSpan={6} className="h-[76px] px-5 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse shrink-0" />
                                                            <div className="space-y-2 flex-1">
                                                                <div className="h-4 w-1/4 bg-gray-100 animate-pulse rounded" />
                                                                <div className="h-3 w-1/5 bg-gray-50 animate-pulse rounded" />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : paginatedStaff.length === 0 ? (
                                            <TableRow>
                                                 <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                                    No results found for this page.
                                                 </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedStaff.map(staff => (
                                                <TableRow 
                                                    key={staff.id} 
                                                    className={`group hover:bg-blue-50/40 border-b border-gray-100 cursor-pointer transition-colors ${staff.employmentStatus === "Inactive" ? "bg-gray-50/50 opacity-70" : "bg-white"}`}
                                                    onClick={() => setLocation(`/staff/${staff.id}`)}
                                                >
                                                    <TableCell className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                                                        <Checkbox className="border-gray-300" />
                                                    </TableCell>
                                                    <TableCell className="px-5 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-10 w-10 rounded-full ${staff.avatarColor || 'bg-gray-200'} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm border-2 border-white`}>
                                                                {staff.avatar || staff.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col py-0.5">
                                                                <span className={`font-semibold text-sm leading-tight truncate max-w-[200px] ${staff.employmentStatus === "Inactive" ? "text-gray-500 line-through" : "text-gray-900"}`}>{staff.name}</span>
                                                                <span className="text-xs text-muted-foreground mt-0.5 font-medium">{staff.staffId ? `ID: ${staff.staffId}` : '---'}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-5 py-3.5">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                                <span className="truncate max-w-[180px]">{staff.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                                <span>{staff.phone || "---"}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-5 py-3.5">
                                                        <div className="flex flex-col gap-1.5 justify-center py-1">
                                                            <span className="text-sm text-gray-900 font-semibold truncate max-w-[150px]">
                                                                {staff.role || "Unassigned"}
                                                            </span>
                                                            {staff.roleType && (
                                                                <div className="flex items-center">
                                                                    <Badge variant="outline" className="text-[10px] font-semibold text-gray-500 bg-gray-50 border-gray-200 shadow-none px-1.5 py-0 capitalize tracking-wide">
                                                                        {staff.roleType === 'Field Service' ? 'Field Service Staff' : staff.roleType === 'Internal Staff' ? 'Internal Staff' : staff.roleType}
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-5 py-3.5">
                                                        <div className="flex items-center">
                                                            <span className={`inline-flex items-center lowercase text-xs font-medium tracking-wide ${getStatusBadge(staff.status, staff.employmentStatus)}`}>
                                                                {staff.employmentStatus === "Active" ? staff.status : staff.employmentStatus}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-end px-5 py-3.5">
                                                        <div className="flex justify-end gap-1.5 transition-opacity" onClick={e => e.stopPropagation()}>
                                                            <Button 
                                                                variant="outline" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-gray-500 border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setLocation(`/staff/${staff.id}`)
                                                                }}
                                                                title="View User"
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>

                        {/* Pagination Footer */}
                        {filteredActiveStaff.length > 0 && (
                            <div className="border-t border-gray-200 bg-gray-50 p-3 flex items-center justify-between shrink-0">
                                <div className="text-xs text-gray-500 font-medium">
                                    Showing <span className="font-bold text-gray-900">{filteredActiveStaff.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span> to <span className="font-bold text-gray-900">{Math.min(filteredActiveStaff.length, currentPage * ITEMS_PER_PAGE)}</span> of <span className="font-bold text-gray-900">{filteredActiveStaff.length}</span> results
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1 || isTableLoading}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1 || isTableLoading}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="text-xs font-semibold px-3 min-w-[4rem] text-center text-gray-700 flex items-center justify-center">
                                        {isTableLoading ? (
                                            <span className="animate-pulse bg-gray-200 rounded h-4 w-10 inline-block"/>
                                        ) : (
                                            `Page ${currentPage} of ${totalPages}`
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages || isTableLoading}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages || isTableLoading}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

            </div>
        </div>
      </div>

      {/* Invite User Modal */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-2xl">
          <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">Invite New Staff</DialogTitle>
                <p className="text-xs text-gray-500 mt-1">Send an invitation link to onboard a new team member.</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="px-8 py-6 bg-white">
            <div className="grid grid-cols-1 gap-5">
              <div className="flex flex-col h-full">
                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide mb-1.5 block">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  value={inviteData.name} 
                  placeholder="e.g. John Doe"
                  onChange={e => setInviteData({...inviteData, name: e.target.value})}
                  className="mt-auto h-10 w-full border-gray-200 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col h-full">
                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide mb-1.5 block">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={inviteData.email} 
                  onChange={e => setInviteData({...inviteData, email: e.target.value})}
                  className="mt-auto h-10 w-full border-gray-200 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col h-full">
                <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide mb-1.5 block">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select value={inviteData.role} onValueChange={v => setInviteData({...inviteData, role: v})}>
                  <SelectTrigger className="mt-auto bg-white w-full h-10 border-gray-200 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-blue-100 text-gray-600">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Field Service Staff">Field Service Staff</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="Internal Staff">Internal Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter className="px-8 py-5 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between sm:justify-between">
            <Button 
                variant="ghost" 
                className="h-10 px-6 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl font-semibold transition-colors" 
                onClick={() => setIsInviteOpen(false)}
            >
                Cancel
            </Button>
            <Button 
                className="h-10 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all rounded-xl font-bold flex items-center gap-2 text-white text-sm" 
                onClick={handleInviteSubmit}
            >
                Send Invite <ArrowRight className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
