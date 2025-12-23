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
  Grid3x3,
  LayoutGrid,
  SlidersHorizontal,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertTriangle,
  MapPin,
  Mail,
  Phone,
  Archive
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Staff Member Interface
export interface StaffMember {
  id: string;
  staffId: string; // WB1, WB2, etc.
  name: string;
  role: string;
  roleType: "field" | "office" | "driver" | "part-time";
  email: string;
  phone: string;
  location: string;
  status: "available" | "on-job" | "on-leave" | "offline"; // Work Status
  employmentStatus: "Active" | "On Leave" | "Suspended" | "Inactive"; // Lifecycle Status
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
    roleType: "field",
    email: "nisar@workbook.com",
    phone: "+97488997788",
    location: "India",
    status: "available",
    employmentStatus: "Active",
    avatar: "NK",
    avatarColor: "bg-purple-600",
    availabilityHours: 24,
    activeJobs: 3,
    rating: 4.9,
    jobsCompleted: 156,
    skills: ["Deep Cleaning", "AC Cleaning", "Carpet Cleaning", "Window Cleaning"],
  },
  {
    id: "2",
    staffId: "WB2",
    name: "fgdfdfg",
    role: "Cleaner",
    roleType: "field",
    email: "dgdfgds@hfh.vv",
    phone: "+974556434554",
    location: "Vietnam",
    status: "available",
    employmentStatus: "Active",
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
    name: "FAIS KAPPIKKUNNUMMAL KAPPIKKUNNUMMAL",
    role: "Cleaner",
    roleType: "office",
    email: "fais@gmail.com",
    phone: "+9745687879",
    location: "India",
    status: "available",
    employmentStatus: "Active",
    avatar: "FK",
    avatarColor: "bg-teal-600",
    documentExpiring: true,
    availabilityHours: 30,
    activeJobs: 5,
    rating: 4.7,
    jobsCompleted: 138,
    skills: ["Office Cleaning", "Desk Organization", "Waste Management", "Restroom Cleaning"],
  },
  {
    id: "4",
    staffId: "WB4",
    name: "zdfascad",
    role: "Cleaner",
    roleType: "office",
    email: "fbcxb@fdf.csf",
    phone: "+974454657657",
    location: "Vietnam",
    status: "offline",
    employmentStatus: "Inactive", // Inactive Example
    avatar: "ZD",
    avatarColor: "bg-indigo-600",
    availabilityHours: 0,
    activeJobs: 0,
    rating: 4.6,
    jobsCompleted: 125,
    skills: ["Kitchen Cleaning", "Bathroom Cleaning"],
  },
  {
    id: "5",
    staffId: "WB5",
    name: "Rashid",
    role: "Driver",
    roleType: "driver",
    email: "xx@xx.xx",
    phone: "+97455678543",
    location: "Qatar",
    status: "available",
    employmentStatus: "Active",
    avatar: "RA",
    avatarColor: "bg-blue-600",
    availabilityHours: 8,
    activeJobs: 1,
    rating: 4.9,
    jobsCompleted: 201,
    skills: ["Safe Driving", "Route Navigation", "Vehicle Maintenance"],
  },
];

export default function Workforce() {
  const [, setLocation] = useLocation();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "cards" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showInactive, setShowInactive] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem("vendor_staff");
    if (stored) {
      let parsedStaff = JSON.parse(stored);
      // Migrate old data if employmentStatus is missing
      parsedStaff = parsedStaff.map((s: any) => ({
          ...s,
          employmentStatus: s.employmentStatus || 'Active'
      }));
      setStaff(parsedStaff);
    } else {
      setStaff(SAMPLE_STAFF);
      localStorage.setItem("vendor_staff", JSON.stringify(SAMPLE_STAFF));
    }
  }, []);

  // Filter staff
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);
    
    const matchesWorkStatus =
      selectedStatus === "all" || s.status === selectedStatus;
      
    const matchesRole =
      selectedRole === "all" || s.roleType === selectedRole;

    const matchesInactive = showInactive ? true : s.employmentStatus !== 'Inactive';

    return matchesSearch && matchesWorkStatus && matchesRole && matchesInactive;
  });

  // Statistics (Count only Active/Non-Inactive for stats unless clarified otherwise, but typically stats show active fleet)
  const activeStaffList = staff.filter(s => s.employmentStatus !== 'Inactive');
  const stats = {
    total: activeStaffList.length,
    field: activeStaffList.filter((s) => s.roleType === "field").length,
    office: activeStaffList.filter((s) => s.roleType === "office").length,
    drivers: activeStaffList.filter((s) => s.roleType === "driver").length,
    partTime: activeStaffList.filter((s) => s.roleType === "part-time").length,
  };

  // Status badge styling
  const getStatusBadge = (workStatus: string, empStatus: string) => {
    if (empStatus === 'Inactive') return "bg-gray-100 text-gray-500 border-gray-200 line-through";
    if (empStatus === 'Suspended') return "bg-red-50 text-red-700 border-red-200";
    if (empStatus === 'On Leave') return "bg-amber-100 text-amber-700 border-amber-200";
    
    // Default Work Status colors for Active staff
    const styles = {
      available: "bg-green-100 text-green-700 border-green-200",
      "on-job": "bg-blue-100 text-blue-700 border-blue-200",
      "on-leave": "bg-amber-100 text-amber-700 border-amber-200", // Fallback
      offline: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return styles[workStatus as keyof typeof styles] || styles.available;
  };

  const handleRowClick = (staffId: string) => {
     setLocation(`/staff/${staffId}`); 
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Workforce Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track all your workforce members
            </p>
          </div>
          <Button onClick={() => setLocation("/workforce/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Workforce Member
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[140px]">
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
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="field">Field Staff</SelectItem>
              <SelectItem value="office">Office Staff</SelectItem>
              <SelectItem value="driver">Drivers</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          
          <div className="flex items-center space-x-2">
            <Switch 
                id="show-inactive" 
                checked={showInactive} 
                onCheckedChange={setShowInactive} 
            />
            <Label htmlFor="show-inactive" className="text-sm cursor-pointer">
                Show Inactive
            </Label>
          </div>

          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Cards
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
                Showing {filteredStaff.length} members
            </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-5 gap-4">
          {[
              { label: "Total Active", value: stats.total, icon: Users, color: "text-blue-600" },
              { label: "Field Staff", value: stats.field, icon: UserCheck, color: "text-green-600" },
              { label: "Office Staff", value: stats.office, icon: Briefcase, color: "text-purple-600" },
              { label: "Drivers", value: stats.drivers, icon: Truck, color: "text-orange-600" },
              { label: "Part-time", value: stats.partTime, icon: Clock, color: "text-blue-600" },
          ].map((stat, i) => (
             <Card key={i} className="glass-panel p-4 border hover:bg-card/90 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold font-heading mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} opacity-80 group-hover:scale-110 transition-transform`} />
                </div>
              </Card>
          ))}
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left w-12"><Checkbox /></th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Staff Member</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Contact</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Role</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr
                      key={staff.id}
                      className={`border-b hover:bg-muted/50 cursor-pointer transition-colors ${staff.employmentStatus === 'Inactive' ? 'bg-gray-50/50' : ''}`}
                      onClick={() => handleRowClick(staff.id)}
                    >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${staff.avatarColor} flex items-center justify-center text-white font-semibold text-sm ${staff.employmentStatus === 'Inactive' ? 'grayscale opacity-50' : ''}`}>
                            {staff.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`font-medium ${staff.employmentStatus === 'Inactive' ? 'text-muted-foreground line-through' : ''}`}>{staff.name}</p>
                              {staff.documentExpiring && staff.employmentStatus === 'Active' && (
                                <span className="flex items-center gap-1 text-xs text-amber-600"><AlertTriangle className="h-3 w-3" /> Expiring</span>
                              )}
                              {staff.employmentStatus === 'Inactive' && <span className="text-xs border border-gray-200 bg-gray-100 px-1.5 rounded text-gray-500">Inactive</span>}
                            </div>
                            <p className="text-sm text-muted-foreground">ID: {staff.staffId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /> {staff.email}</div>
                          <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /> {staff.phone}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{staff.role}</p>
                          <p className="text-sm text-muted-foreground capitalize">{staff.roleType}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(staff.status, staff.employmentStatus)}`}>
                          {staff.employmentStatus === 'Active' ? staff.status : staff.employmentStatus}
                        </span>
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => handleRowClick(staff.id)}>
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

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-4 gap-4">
            {filteredStaff.map((staff) => (
              <Card
                key={staff.id}
                className={`p-4 relative cursor-pointer hover:shadow-md transition-shadow ${staff.employmentStatus === 'Inactive' ? 'bg-gray-50 opacity-75' : ''}`}
                onClick={() => handleRowClick(staff.id)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full ${staff.avatarColor} flex items-center justify-center text-white font-bold text-xl mb-3 ${staff.employmentStatus === 'Inactive' ? 'grayscale' : ''}`}>
                    {staff.avatar}
                  </div>
                  <h3 className="font-semibold mb-1">{staff.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{staff.role}</p>
                  
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border mb-3 ${getStatusBadge(staff.status, staff.employmentStatus)}`}>
                    {staff.employmentStatus === 'Active' ? staff.status : staff.employmentStatus}
                  </span>
                  
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
