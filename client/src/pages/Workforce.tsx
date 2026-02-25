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

export default function Workforce() {
  const [, setLocation] = useLocation();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [activeTab, setActiveTab] = useState("active");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showInactive, setShowInactive] = useState(false);

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ name: "", email: "", role: "" });

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

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
  const handleResendInvite = (id: string) => {
    const updated = staff.map(s => {
      if (s.id === id) {
        return {
          ...s,
          inviteSentAt: new Date().toISOString(),
          membershipStatus: "pending" as const,
        };
      }
      return s;
    });
    saveStaff(updated);
    toast.success("Invite resent successfully");
  };

  const handleCancelInvite = (id: string) => {
    const updated = staff.map(s => {
      if (s.id === id) {
        return { ...s, membershipStatus: "cancelled" as const }; // Or just delete? User asked for cancel.
      }
      return s;
    });
    saveStaff(updated);
    toast.info("Invite cancelled");
  };

  const handleDelete = (id: string) => {
    const updated = staff.filter(s => s.id !== id);
    saveStaff(updated);
    toast.success("Removed from list");
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
  const filteredActiveStaff = activeWorkforce.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);

    const matchesWorkStatus =
      selectedStatus === "all" || s.status === selectedStatus;

    const matchesRole = selectedRole === "all" || s.roleType === selectedRole;

    const matchesInactive = showInactive
      ? true
      : s.employmentStatus !== "Inactive";

    return matchesSearch && matchesWorkStatus && matchesRole && matchesInactive;
  });

  // Pending Invites List
  const pendingInvites = staff.filter(s =>
    ["pending", "draft", "expired", "rejected"].includes(s.membershipStatus)
  );
  // Optional: Add search for pending as well?
  const filteredPendingInvites = pendingInvites.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
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
      return "bg-gray-100 text-gray-500 border-gray-200 line-through";
    if (empStatus === "Suspended")
      return "bg-red-50 text-red-700 border-red-200";
    if (empStatus === "On Leave")
      return "bg-amber-100 text-amber-700 border-amber-200";

    const styles = {
      available: "bg-green-100 text-green-700 border-green-200",
      "on-job": "bg-blue-100 text-blue-700 border-blue-200",
      "on-leave": "bg-amber-100 text-amber-700 border-amber-200",
      offline: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return styles[workStatus as keyof typeof styles] || styles.available;
  };

  const getInviteStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-700 hover:bg-amber-100"
          >
            Pending
          </Badge>
        );
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "expired":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
          >
            Expired
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Workforce Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage active workforce members and assignments
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" onClick={() => setLocation("/workforce/pending")}>
                <Mail className="h-4 w-4 mr-2" />
                Pending Invites ({stats.pending})
             </Button>
             <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all" onClick={() => setIsInviteOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Invite User
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-panel p-4 border hover:bg-card/90 transition-all cursor-pointer">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Total Active
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-bold font-heading">{stats.total}</p>
              <Users className="h-8 w-8 text-blue-600 opacity-80" />
            </div>
          </Card>

          <Card className="glass-panel p-4 border hover:bg-card/90 transition-all cursor-pointer">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Field Service
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-bold font-heading">{stats.field}</p>
              <UserCheck className="h-8 w-8 text-green-600 opacity-80" />
            </div>
          </Card>

          <Card className="glass-panel p-4 border hover:bg-card/90 transition-all cursor-pointer">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Drivers
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-bold font-heading">{stats.drivers}</p>
              <Truck className="h-8 w-8 text-orange-600 opacity-80" />
            </div>
          </Card>

          <Card className="glass-panel p-4 border hover:bg-card/90 transition-all cursor-pointer">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Internal Staff
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-bold font-heading">{stats.office}</p>
              <Briefcase className="h-8 w-8 text-purple-600 opacity-80" />
            </div>
          </Card>
        </div>

        {/* Filters & List */}
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-lg border shadow-sm">
                
                <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search name, phone..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 h-9 w-[200px]"
                    />
                </div>
                
                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
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
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Field Service">Field Service</SelectItem>
                    <SelectItem value="Internal Staff">Internal Staff</SelectItem>
                    <SelectItem value="driver">Drivers</SelectItem>
                </SelectContent>
                </Select>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <div className="flex items-center space-x-2">
                <Switch
                    id="show-inactive"
                    checked={showInactive}
                    onCheckedChange={setShowInactive}
                />
                <Label
                    htmlFor="show-inactive"
                    className="text-xs cursor-pointer"
                >
                    Show Inactive
                </Label>
                </div>

                <div className="ml-auto flex gap-2">
                <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setViewMode("list")}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant={viewMode === "cards" ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setViewMode("cards")}
                >
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                </div>
            </div>

            {viewMode === "list" && (
                <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                        <tr>
                        <th className="p-3 text-left w-12">
                            <Checkbox />
                        </th>
                        <th className="p-3 text-left font-medium text-muted-foreground">
                            Staff Member
                        </th>
                        <th className="p-3 text-left font-medium text-muted-foreground">
                            Contact
                        </th>
                        <th className="p-3 text-left font-medium text-muted-foreground">
                            Role
                        </th>
                        <th className="p-3 text-left font-medium text-muted-foreground">
                            Status
                        </th>
                        <th className="p-3 text-left font-medium text-muted-foreground">
                            Actions
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredActiveStaff.map(staff => (
                        <tr
                            key={staff.id}
                            className={`border-b hover:bg-muted/50 cursor-pointer transition-colors ${staff.employmentStatus === "Inactive" ? "bg-gray-50/50" : ""}`}
                            onClick={() => setLocation(`/staff/${staff.id}`)}
                        >
                            <td
                            className="p-3"
                            onClick={e => e.stopPropagation()}
                            >
                            <Checkbox />
                            </td>
                            <td className="p-3">
                            <div className="flex items-center gap-3">
                                <div
                                className={`w-9 h-9 rounded-full ${staff.avatarColor} flex items-center justify-center text-white font-semibold text-xs`}
                                >
                                {staff.avatar}
                                </div>
                                <div>
                                <div className="flex items-center gap-2">
                                    <p
                                    className={`font-medium ${staff.employmentStatus === "Inactive" ? "text-muted-foreground line-through" : ""}`}
                                    >
                                    {staff.name}
                                    </p>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    ID: {staff.staffId}
                                </p>
                                </div>
                            </div>
                            </td>
                            <td className="p-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                <Mail className="h-3 w-3 text-muted-foreground" />{" "}
                                {staff.email}
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                <Phone className="h-3 w-3 text-muted-foreground" />{" "}
                                {staff.phone}
                                </div>
                            </div>
                            </td>
                            <td className="p-3">
                            <p className="font-medium">{staff.role}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {staff.roleType}
                            </p>
                            </td>
                            <td className="p-3">
                            <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(staff.status, staff.employmentStatus)}`}
                            >
                                {staff.employmentStatus === "Active"
                                ? staff.status
                                : staff.employmentStatus}
                            </span>
                            </td>
                            <td
                            className="p-3"
                            onClick={e => e.stopPropagation()}
                            >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </Card>
            )}

            {viewMode === "cards" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredActiveStaff.map(staff => (
                    <Card
                    key={staff.id}
                    className="p-4 relative hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setLocation(`/staff/${staff.id}`)}
                    >
                    <div className="flex items-start justify-between mb-4">
                        <div
                        className={`w-10 h-10 rounded-full ${staff.avatarColor} flex items-center justify-center text-white font-bold`}
                        >
                        {staff.avatar}
                        </div>
                        <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(staff.status, staff.employmentStatus)}`}
                        >
                        {staff.status}
                        </span>
                    </div>
                    <h3 className="font-semibold truncate">{staff.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {staff.role}
                    </p>
                    <div className="text-xs space-y-1 text-muted-foreground">
                        <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" /> {staff.email}
                        </div>
                        <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" /> {staff.phone}
                        </div>
                    </div>
                    </Card>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Invite User Modal */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-xl">
          <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-white">
            <DialogTitle className="text-xl font-bold text-gray-900">Invite User</DialogTitle>
          </DialogHeader>
          <div className="px-8 py-6 space-y-6 bg-white">
            <div className="space-y-1.5 border-none">
              <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Name <span className="text-red-500">*</span></Label>
              <Input 
                value={inviteData.name} 
                onChange={e => setInviteData({...inviteData, name: e.target.value})}
                className="h-11 w-full border-gray-200 hover:border-blue-300 transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5 border-none">
              <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Email Address <span className="text-red-500">*</span></Label>
              <Input 
                type="email"
                value={inviteData.email} 
                onChange={e => setInviteData({...inviteData, email: e.target.value})}
                className="h-11 w-full border-gray-200 hover:border-blue-300 transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5 border-none">
              <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">Role <span className="text-red-500">*</span></Label>
              <Select value={inviteData.role} onValueChange={v => setInviteData({...inviteData, role: v})}>
                <SelectTrigger className="bg-white w-full h-11 border-gray-200 hover:border-blue-300 transition-all text-sm">
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
          <DialogFooter className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between sm:justify-between">
            <Button variant="outline" className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
            <Button className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all rounded-lg font-semibold text-white" onClick={handleInviteSubmit}>Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
