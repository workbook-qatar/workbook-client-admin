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
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  status: "available" | "on-job" | "on-leave" | "offline";
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
    status: "available",
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
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    const stored = localStorage.getItem("vendor_staff");
    if (stored) {
      setStaff(JSON.parse(stored));
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
    const matchesStatus =
      selectedStatus === "all" || s.status === selectedStatus;
    const matchesRole =
      selectedRole === "all" || s.roleType === selectedRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Statistics
  const stats = {
    total: staff.length,
    field: staff.filter((s) => s.roleType === "field").length,
    office: staff.filter((s) => s.roleType === "office").length,
    drivers: staff.filter((s) => s.roleType === "driver").length,
    partTime: staff.filter((s) => s.roleType === "part-time").length,
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      available: "bg-green-100 text-green-700 border-green-200",
      "on-job": "bg-amber-100 text-amber-700 border-amber-200",
      "on-leave": "bg-blue-100 text-blue-700 border-blue-200",
      offline: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return styles[status as keyof typeof styles] || styles.available;
  };

  // Handle row click
  const handleRowClick = (staffId: string) => {
     // Navigate to staff details page
     console.log("View staff:", staffId);
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
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workforce members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
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
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* View Mode Switcher */}
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
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
        </div>

        {/* Statistics Cards - Compact */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="glass-panel p-4 border hover:bg-card/90 transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Total Staff</p>
                <p className="text-2xl font-bold font-heading mt-1">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
          </Card>
          <Card className="glass-panel p-4 border hover:bg-card/90 transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-green-600 transition-colors">Field Staff</p>
                <p className="text-2xl font-bold font-heading mt-1">{stats.field}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
            </div>
          </Card>
          <Card className="glass-panel p-4 border hover:bg-card/90 transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-purple-600 transition-colors">Office Staff</p>
                <p className="text-2xl font-bold font-heading mt-1">{stats.office}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
          </Card>
          <Card className="glass-panel p-4 border hover:bg-card/90 transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-orange-600 transition-colors">Drivers</p>
                <p className="text-2xl font-bold font-heading mt-1">{stats.drivers}</p>
              </div>
              <Truck className="h-8 w-8 text-orange-600 group-hover:scale-110 transition-transform" />
            </div>
          </Card>
          <Card className="glass-panel p-4 border hover:bg-card/90 transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-600 transition-colors">Part-time</p>
                <p className="text-2xl font-bold font-heading mt-1">{stats.partTime}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
          </Card>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left w-12">
                      <Checkbox />
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Staff Member
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Contact
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Role
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Skills
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Status
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr
                      key={staff.id}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(staff.id)}
                    >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${staff.avatarColor} flex items-center justify-center text-white font-semibold text-sm`}
                          >
                            {staff.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{staff.name}</p>
                              {staff.documentExpiring && (
                                <span className="flex items-center gap-1 text-xs text-amber-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  Document expiring
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              ID: {staff.staffId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {staff.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {staff.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {staff.location}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{staff.role}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {staff.roleType}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {staff.skills?.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {staff.skills && staff.skills.length > 3 && (
                            <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                              +{staff.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                            staff.status
                          )}`}
                        >
                          {staff.status}
                        </span>
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRowClick(staff.id)}
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

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-4 gap-4">
            {filteredStaff.map((staff) => (
              <Card
                key={staff.id}
                className="p-4 relative cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleRowClick(staff.id)}
              >
                <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </div>
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${staff.avatarColor} flex items-center justify-center text-white font-bold text-xl mb-3`}
                  >
                    {staff.avatar}
                  </div>
                  <h3 className="font-semibold mb-1">{staff.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {staff.role}
                  </p>
                  <div className="w-full space-y-2 text-sm text-left mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{staff.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{staff.location}</span>
                    </div>
                  </div>
                  <div className="w-full flex flex-wrap justify-center gap-1 mb-3">
                    {staff.skills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {staff.skills && staff.skills.length > 3 && (
                      <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                        +{staff.skills.length - 3}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border mb-3 ${getStatusBadge(
                      staff.status
                    )}`}
                  >
                    {staff.status}
                  </span>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-5 gap-4">
            {filteredStaff.map((staff) => (
              <Card
                key={staff.id}
                className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleRowClick(staff.id)}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-20 h-20 rounded-full ${staff.avatarColor} flex items-center justify-center text-white font-bold text-2xl mb-3`}
                  >
                    {staff.avatar}
                  </div>
                  <h3 className="font-semibold mb-1">
                    {staff.name.split(" ")[0]}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {staff.role}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {staff.skills?.slice(0, 2).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {staff.skills && staff.skills.length > 2 && (
                      <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        +{staff.skills.length - 2}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                      staff.status
                    )}`}
                  >
                    {staff.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1 to {filteredStaff.length} of {filteredStaff.length}{" "}
            results
          </p>
          <div className="flex items-center gap-4">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="default" size="sm">
                {currentPage}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
