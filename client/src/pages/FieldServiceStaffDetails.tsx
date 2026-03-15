import { useState, useEffect, useMemo } from "react";
import { useRoute, useLocation, Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  Star,
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Edit,
  BarChart3,
  Clock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Plus,
  Building2,
  FileText,
  Eye,
  Download,
  Upload,
  ShieldCheck,
  Banknote,
  TrendingUp,
  Save,
  User,
  Camera,
  FileIcon,
  CalendarCheck,
  MoreHorizontal,
  Briefcase,
  Info,
  AlertCircle,
  Activity,
  Search,
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
  DropdownMenuLabel,
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

// ─── Types & Enums ───────────────────────────────────────────────────────────

type EmploymentStatus = "Active" | "On Leave" | "Suspended" | "Inactive";
type WorkStatus = "Available" | "Assigned" | "On Job" | "Offline";
type MembershipStatus =
  | "active"
  | "draft"
  | "pending"
  | "rejected"
  | "expired"
  | "cancelled";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockStaffData = {
  id: 1,
  staffId: "WB-001",
  name: "Mohammed Hassan",
  nickname: "Nisar",
  role: "Senior Technician",
  employmentStatus: "Active" as EmploymentStatus,
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
  roleType: "Field Service",
  membershipStatus: "active" as MembershipStatus,
};

const mockBookings = [
  {
    id: "BK-2025-001",
    customer: "Aldar Properties",
    service: "AC Maintenance",
    date: "2025-12-23",
    time: "09:00 AM - 11:00 AM",
    status: "In Progress",
    location: "West Bay, Doha",
  },
  {
    id: "BK-2025-002",
    customer: "Fatima Al-Thani",
    service: "Deep Cleaning",
    date: "2025-12-24",
    time: "02:00 PM - 04:00 PM",
    status: "Scheduled",
    location: "The Pearl, Doha",
  },
  {
    id: "BK-2025-003",
    customer: "Qatar Foundation",
    service: "Electrical Repair",
    date: "2025-12-25",
    time: "10:00 AM - 01:00 PM",
    status: "Scheduled",
    location: "Education City",
  },
];

const mockDocuments = [
  {
    id: 1,
    name: "Qatar ID (QID)",
    type: "Identification",
    expiry: "2026-08-15",
    status: "Valid",
    uploadDate: "2024-01-10",
    docNumber: "28535638494",
  },
  {
    id: 2,
    name: "Visa Copy",
    type: "Visa / Residency",
    expiry: "2025-01-30",
    status: "Expiring Soon",
    uploadDate: "2023-06-20",
    docNumber: "VS-778844",
  },
  {
    id: 3,
    name: "Medical Fitness Certificate",
    type: "Medical",
    expiry: "2025-09-01",
    status: "Valid",
    uploadDate: "2024-09-01",
    docNumber: "MFC-2024-1190",
  },
  {
    id: 4,
    name: "AC Maintenance Certification",
    type: "Certification",
    expiry: "2026-03-15",
    status: "Valid",
    uploadDate: "2024-03-15",
    docNumber: "CERT-AC-0045",
  },
  {
    id: 5,
    name: "Electrical Safety Training",
    type: "Training",
    expiry: "2024-11-01",
    status: "Expired",
    uploadDate: "2023-11-01",
    docNumber: "TRN-ES-0112",
  },
];

const mockPayouts = [
  {
    id: "PY-001",
    date: "2025-11-30",
    amount: "3,500.00",
    status: "Paid",
    type: "Base Salary",
  },
  {
    id: "PY-002",
    date: "2025-11-30",
    amount: "450.00",
    status: "Paid",
    type: "Commission",
  },
  {
    id: "PY-003",
    date: "2025-11-30",
    amount: "120.00",
    status: "Paid",
    type: "Tips",
  },
  {
    id: "PY-004",
    date: "2025-10-31",
    amount: "3,500.00",
    status: "Paid",
    type: "Base Salary",
  },
  {
    id: "PY-005",
    date: "2025-10-31",
    amount: "380.00",
    status: "Paid",
    type: "Commission",
  },
];

// ── Activity Audit Log (Enterprise) ─────────────────────────────────────────
type ActivityEventCategory = "profile" | "schedule" | "compliance" | "compensation" | "system";
type ActivityActor = "Admin" | "System" | "HR" | "Dispatch";

interface ActivityEntry {
  id: number;
  date: string; // ISO-like for sorting: 2026-03-12 09:12
  event: string;
  category: ActivityEventCategory;
  actor: ActivityActor;
  details: string;
}

const mockActivityLog: ActivityEntry[] = [
  { id: 1,  date: "2026-03-12 09:12", event: "Profile Updated",       category: "profile",      actor: "Admin",    details: "Phone number changed to +97488997788" },
  { id: 2,  date: "2026-03-11 16:45", event: "Schedule Assigned",     category: "schedule",     actor: "Dispatch", details: "Assigned to BK-2026-041 — AC Maintenance at West Bay" },
  { id: 3,  date: "2026-03-11 14:20", event: "Document Uploaded",     category: "compliance",   actor: "HR",       details: "Uploaded renewed Visa Copy (VS-778844)" },
  { id: 4,  date: "2026-03-10 11:00", event: "Status Changed",       category: "profile",      actor: "Admin",    details: "Employment status changed from On Leave to Active" },
  { id: 5,  date: "2026-03-09 08:30", event: "Schedule Assigned",     category: "schedule",     actor: "Dispatch", details: "Assigned to BK-2026-038 — Deep Cleaning at The Pearl" },
  { id: 6,  date: "2026-03-08 15:10", event: "Compensation Updated", category: "compensation", actor: "HR",       details: "Commission rate adjusted to 12% for March" },
  { id: 7,  date: "2026-03-07 09:45", event: "Document Expired",     category: "compliance",   actor: "System",   details: "Medical Certificate expired on 2026-03-07" },
  { id: 8,  date: "2026-03-06 13:00", event: "Schedule Cancelled",   category: "schedule",     actor: "Dispatch", details: "Removed from BK-2026-035 — customer rescheduled" },
  { id: 9,  date: "2026-03-05 10:20", event: "Profile Updated",       category: "profile",      actor: "Admin",    details: "Display name updated to Nisar" },
  { id: 10, date: "2026-03-04 17:30", event: "System Auto Update",   category: "system",       actor: "System",   details: "Work status changed to Available based on schedule" },
  { id: 11, date: "2026-03-03 08:00", event: "Schedule Assigned",     category: "schedule",     actor: "Dispatch", details: "Assigned to BK-2026-029 — Plumbing Repair at Lusail" },
  { id: 12, date: "2026-03-02 14:15", event: "Compensation Updated", category: "compensation", actor: "HR",       details: "Overtime bonus of 150 QAR approved for February" },
  { id: 13, date: "2026-03-01 09:00", event: "Document Uploaded",     category: "compliance",   actor: "HR",       details: "Uploaded updated QID document (28535638494)" },
  { id: 14, date: "2026-02-28 16:00", event: "System Auto Update",   category: "system",       actor: "System",   details: "Dispatch readiness recalculated — marked as Dispatch Ready" },
  { id: 15, date: "2026-02-27 11:30", event: "Status Changed",       category: "profile",      actor: "HR",       details: "Employment status changed from Active to On Leave" },
  { id: 16, date: "2026-02-26 10:00", event: "Schedule Cancelled",   category: "schedule",     actor: "System",   details: "All bookings auto-unassigned due to On Leave status" },
];

const activityEventCategories = [
  { label: "All Events",           value: "all" },
  { label: "Profile Changes",      value: "profile" },
  { label: "Schedule Updates",     value: "schedule" },
  { label: "Compliance Updates",   value: "compliance" },
  { label: "Compensation Changes", value: "compensation" },
  { label: "System Actions",       value: "system" },
];

const activityDateRanges = [
  { label: "All Time",       value: "all" },
  { label: "Last 24 Hours",  value: "24h" },
  { label: "Last 7 Days",    value: "7d" },
  { label: "Last 30 Days",   value: "30d" },
];

const ACTIVITY_CATEGORY_STYLES: Record<ActivityEventCategory, string> = {
  profile:      "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0",
  schedule:     "bg-purple-100 text-purple-700 hover:bg-purple-100 border-0",
  compliance:   "bg-amber-100 text-amber-700 hover:bg-amber-100 border-0",
  compensation: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0",
  system:       "bg-gray-100 text-gray-700 hover:bg-gray-100 border-0",
};

const ACTIVITY_PER_PAGE = 8;

const monthLabels = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const mockMonthlyCompensation: Record<string, { base: string; commission: string; tips: string; total: string }> = {
  "2025-12": { base: "3,500", commission: "450", tips: "120", total: "4,070" },
  "2025-11": { base: "3,500", commission: "380", tips: "95", total: "3,975" },
  "2025-10": { base: "3,500", commission: "520", tips: "140", total: "4,160" },
  "2025-09": { base: "3,500", commission: "310", tips: "80", total: "3,890" },
  "2025-08": { base: "3,500", commission: "400", tips: "110", total: "4,010" },
  "2025-07": { base: "3,500", commission: "350", tips: "90", total: "3,940" },
};

const mockWeeklySchedule = [
  { day: "Sunday", start: "07:00", end: "15:00", breakMins: 60, enabled: true },
  { day: "Monday", start: "07:00", end: "15:00", breakMins: 60, enabled: true },
  { day: "Tuesday", start: "07:00", end: "15:00", breakMins: 60, enabled: true },
  { day: "Wednesday", start: "07:00", end: "15:00", breakMins: 60, enabled: true },
  { day: "Thursday", start: "07:00", end: "15:00", breakMins: 60, enabled: true },
  { day: "Friday", start: "", end: "", breakMins: 0, enabled: false },
  { day: "Saturday", start: "08:00", end: "12:00", breakMins: 0, enabled: true },
];

const mockSeasonalPatterns = [
  { id: 1, name: "Summer", months: "Jun – Aug", adjustment: "Starts 06:00, ends 14:00", status: "Active" },
  { id: 2, name: "Ramadan", months: "Varies", adjustment: "Reduced to 6 hrs/day", status: "Active" },
  { id: 3, name: "Winter", months: "Dec – Feb", adjustment: "Standard schedule", status: "Active" },
];

const mockTimeOff = [
  { id: 1, type: "Annual Leave", from: "2025-12-28", to: "2026-01-05", days: 7, status: "Approved" },
  { id: 2, type: "Sick Leave", from: "2025-11-10", to: "2025-11-11", days: 2, status: "Approved" },
  { id: 3, type: "Personal", from: "2026-01-20", to: "2026-01-20", days: 1, status: "Pending" },
];

const mockAdvancedPreferences = {
  emergencyAvailability: true,
  shiftPreference: "Morning (06:00–14:00)",
  overtimeWilling: true,
  breakPreference: "1 hr midday",
  maxDailyHours: 10,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getWorkStatusColor(status: WorkStatus) {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
    case "On Job":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
    case "Assigned":
      return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
    case "Offline":
      return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getWorkStatusDot(status: WorkStatus) {
  switch (status) {
    case "Available":
      return "bg-green-500";
    case "On Job":
      return "bg-blue-500";
    case "Assigned":
      return "bg-purple-500";
    case "Offline":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
}

function getEmploymentStatusStyle(status: EmploymentStatus) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 border-green-200";
    case "On Leave":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Suspended":
      return "bg-red-100 text-red-700 border-red-200";
    case "Inactive":
      return "bg-gray-100 text-gray-500 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700";
  }
}



function DataField({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className || ""}`}>
      <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </Label>
      <div className="text-sm font-medium text-gray-900 leading-snug">
        {value || <span className="text-gray-400">—</span>}
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
      <div className="h-12 w-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {description && (
        <p className="text-[13px] text-gray-500 mt-1.5 text-center max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}


export default function FieldServiceStaffDetails() {
  const [, params] = useRoute("/staff/:id");
  const [, setLocation] = useLocation();

  // ─── State ───────────────────────────────────────────────────────────────
  const [staff, setStaff] = useState(mockStaffData);
  const [formData, setFormData] = useState(mockStaffData);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [pendingEmploymentStatus, setPendingEmploymentStatus] =
    useState<EmploymentStatus | null>(null);
  const [leaveDates, setLeaveDates] = useState({ start: "", end: "" });
  const [activeTab, setActiveTab] = useState("overview");
  const [activeDocuments, setActiveDocuments] = useState(mockDocuments);
  const [impactAnalysis, setImpactAnalysis] = useState<{
    inProgress: typeof mockBookings;
    scheduled: typeof mockBookings;
    totalImpact: number;
  }>({ inProgress: [], scheduled: [], totalImpact: 0 });
  const [activityFilter, setActivityFilter] = useState("all");
  const [activityDateRange, setActivityDateRange] = useState("all");
  const [activitySearch, setActivitySearch] = useState("");
  const [activityPage, setActivityPage] = useState(1);
  const [compMonth, setCompMonth] = useState({ year: 2025, month: 11 }); // 0-indexed month (11 = December)

  // ─── Data Loading ────────────────────────────────────────────────────────
  useEffect(() => {
    const storedStaff = localStorage.getItem("vendor_staff");
    if (storedStaff && params?.id) {
      try {
        const parsedStaff = JSON.parse(storedStaff);
        const found = parsedStaff.find(
          (s: any) => s.id === params.id || s.id === parseInt(params.id)
        );
        if (found) {
          const merged = {
            ...mockStaffData,
            ...found,
            employmentStatus: found.employmentStatus || "Active",
          };
          if (!merged.membershipStatus) merged.membershipStatus = "active";

          setStaff(merged);
          setFormData(merged);

          // Redirect if pending
          if (merged.membershipStatus !== "active") {
            setLocation(`/workforce/pending/${merged.id}`);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [params?.id, setLocation]);

  // ─── Work Status Derivation ──────────────────────────────────────────────
  const workStatusData = useMemo(() => {
    if (staff.employmentStatus !== "Active") {
      return {
        status: "Offline" as WorkStatus,
        context: "Staff is not active",
      };
    }
    const inProgressJob = mockBookings.find(b => b.status === "In Progress");
    if (inProgressJob) {
      return {
        status: "On Job" as WorkStatus,
        context: `Current: ${inProgressJob.id} at ${inProgressJob.time}`,
      };
    }
    const today = "2025-12-23";
    const upcomingJob = mockBookings.find(
      b => b.status === "Scheduled" && b.date >= today
    );
    if (upcomingJob) {
      return {
        status: "Assigned" as WorkStatus,
        context: `Next: ${upcomingJob.id} (${upcomingJob.date})`,
      };
    }
    return {
      status: "Available" as WorkStatus,
      context: "Ready for assignment",
    };
  }, [staff.employmentStatus]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const updateLocalStorage = (data: any) => {
    const stored = localStorage.getItem("vendor_staff");
    if (stored) {
      const list = JSON.parse(stored);
      const index = list.findIndex((s: any) => s.id === staff.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...data };
        localStorage.setItem("vendor_staff", JSON.stringify(list));
      } else {
        localStorage.setItem("vendor_staff", JSON.stringify([...list, data]));
      }
    }
  };

  const initiateStatusChange = (newStatus: EmploymentStatus) => {
    if (newStatus === staff.employmentStatus) return;

    if (newStatus === "Active") {
      setStaff(prev => ({ ...prev, employmentStatus: "Active" }));
      setFormData(prev => ({ ...prev, employmentStatus: "Active" }));
      updateLocalStorage({ ...staff, employmentStatus: "Active" });
      toast.success(
        "Staff reactivated. Previously unassigned jobs remain unassigned."
      );
      return;
    }

    const inProgress = mockBookings.filter(b => b.status === "In Progress");
    const scheduled = mockBookings.filter(b => b.status === "Scheduled");

    setImpactAnalysis({
      inProgress,
      scheduled,
      totalImpact: inProgress.length + scheduled.length,
    });
    setPendingEmploymentStatus(newStatus);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (!pendingEmploymentStatus) return;

    const updatedStaff = {
      ...staff,
      employmentStatus: pendingEmploymentStatus,
    };
    setStaff(updatedStaff);
    setFormData(prev => ({
      ...prev,
      employmentStatus: pendingEmploymentStatus,
    }));
    updateLocalStorage(updatedStaff);

    toast.success(
      `Status updated to ${pendingEmploymentStatus}. ${impactAnalysis.totalImpact} jobs reassigned.`
    );
    setStatusDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1720px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ─── BACK NAVIGATION ──────────────────────────────────────────── */}
        <Button variant="ghost" className="text-gray-500 hover:text-gray-900 -ml-2 h-8 text-[13px] font-medium gap-1.5" onClick={() => window.history.back()}>
          <ChevronLeft className="h-4 w-4" />
          Back to Staff
        </Button>

        {/* ─── IDENTITY HEADER STRIP ────────────────────────────────────── */}
        {(() => {
          let dispatchStatus = "Available";
          let dispatchColor = "bg-green-50 text-green-700";
          if (staff.employmentStatus === "On Leave") {
            dispatchStatus = "On Leave";
            dispatchColor = "bg-amber-50 text-amber-700";
          } else if (staff.employmentStatus !== "Active") {
            dispatchStatus = "Off Duty";
            dispatchColor = "bg-gray-100 text-gray-600";
          } else if (workStatusData.status === "On Job") {
            dispatchStatus = "On Job";
            dispatchColor = "bg-blue-50 text-blue-700";
          }

          return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Top Row: Identity + Status + Actions */}
              <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
                {/* Left: Avatar + Name + Meta */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Avatar className="h-14 w-14 shadow-sm border-2 border-white ring-2 ring-gray-100 rounded-xl shrink-0">
                    <AvatarImage src={staff.avatar} className="object-cover" />
                    <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary rounded-xl">
                      {staff.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-lg font-semibold text-gray-900 tracking-tight truncate">
                        {staff.name}
                      </h1>
                      {staff.verified && <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-50 shrink-0" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                        {staff.staffId || staff.id.toString().padStart(4, "0")}
                      </span>
                      <span className="font-medium flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {staff.phone}
                      </span>
                      <span className="font-medium flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {staff.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions & Status */}
                <div className="flex items-center shrink-0 gap-5">
                  <div 
                    className="flex items-center gap-2.5 cursor-pointer group hover:bg-gray-50 px-2.5 py-1.5 -mx-1 rounded-lg transition-colors"
                    onClick={() => setLocation(`/workforce/pending/${staff.staffId || staff.id}`)}
                  >
                    <div className="h-8 w-8 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                      <Edit className="h-3.5 w-3.5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Action</span>
                      <span className="text-sm font-bold text-gray-900 leading-none tracking-tight group-hover:text-blue-700 transition-colors">Edit Profile</span>
                    </div>
                  </div>

                  <div className="w-px h-8 bg-gray-200" />
                  {/* Work Status part */}
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)] relative">
                       <div className="absolute -inset-1 rounded-full bg-blue-500 animate-ping opacity-30" />
                    </div>
                    <div className="flex flex-col justify-center pt-0.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Work Status</span>
                      <span className="text-sm font-bold text-gray-900 leading-none tracking-tight">{dispatchStatus}</span>
                    </div>
                  </div>
                  
                  <div className="w-px h-8 bg-gray-200" />
                  
                  {/* Employment part */}
                  <div className="relative z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 px-2 py-1 -mx-2 rounded-lg transition-colors">
                          <div className="flex flex-col justify-center pt-0.5">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5 min-w-[100px]">Employment</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-sm font-bold leading-none tracking-tight ${
                                staff.employmentStatus === "Active" ? "text-green-700" :
                                staff.employmentStatus === "On Leave" ? "text-amber-600" :
                                staff.employmentStatus === "Suspended" ? "text-red-600" :
                                "text-gray-600"
                              }`}>
                                {staff.employmentStatus}
                              </span>
                            </div>
                          </div>
                          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors ml-4 shrink-0" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[140px] rounded-xl p-1 shadow-md border-gray-200">
                        <DropdownMenuItem className="flex items-center justify-between text-[13px] font-bold text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg cursor-pointer" onClick={() => initiateStatusChange("Active")}>
                          Active {staff.employmentStatus === "Active" && <Check className="h-4 w-4 text-green-600 opacity-80" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] font-bold tracking-wide text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg cursor-pointer mt-0.5" onClick={() => initiateStatusChange("On Leave")}>
                          On Leave {staff.employmentStatus === "On Leave" && <Check className="h-4 w-4 text-amber-600 opacity-80" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] font-bold tracking-wide text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer mt-0.5" onClick={() => initiateStatusChange("Suspended")}>
                          Suspended {staff.employmentStatus === "Suspended" && <Check className="h-4 w-4 text-red-600 opacity-80" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] font-bold tracking-wide text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer mt-0.5" onClick={() => initiateStatusChange("Inactive")}>
                          Inactive {staff.employmentStatus === "Inactive" && <Check className="h-4 w-4 text-gray-500 opacity-80" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>


                </div>
              </div>

              {/* Bottom Row: KPI Strip */}
              <div className="grid grid-cols-3 lg:grid-cols-6 border-t border-gray-100">
                {[
                  { label: "Jobs Completed", value: staff.jobsCompleted.toString(), icon: BarChart3, color: "text-blue-500" },
                  { label: "Today's Jobs", value: mockBookings.filter((b) => b.date === "2025-12-23").length.toString(), icon: CalendarCheck, color: "text-emerald-500" },
                  { label: "Upcoming", value: mockBookings.filter((b) => b.status === "Scheduled").length.toString(), icon: CalendarDays, color: "text-purple-500" },
                  { label: "Completion", value: "98%", icon: CheckCircle, color: "text-teal-500" },
                  { label: "On-Time", value: "96%", icon: Clock, color: "text-indigo-500" },
                  { label: "Avg. Rating", value: staff.rating.toString(), icon: Star, color: "text-amber-500 fill-amber-500" },
                ].map((stat, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3 border-r border-gray-100 last:border-r-0 hover:bg-gray-50/50 transition-colors">
                    <stat.icon className={`h-4 w-4 shrink-0 hidden sm:block ${stat.color}`} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-lg font-bold text-gray-900 leading-none tracking-tight">
                        {stat.value}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 truncate">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          );
        })()}

        {/* ─── 2-COLUMN LAYOUT: NAV + CONTENT ───────────────────────────── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── LEFT NAVIGATION PANEL ── */}
            <div className="w-full lg:w-48 shrink-0 lg:sticky lg:top-6">
              <div className="px-3 mb-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sections</h3>
              </div>
              <TabsList className="flex flex-col bg-transparent border-0 h-auto p-0 items-stretch space-y-1 w-full text-left">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-gray-200/50 data-[state=active]:font-semibold text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 justify-start w-full px-3.5 py-2.5 h-auto text-sm font-medium rounded-xl transition-all"
                    >
                      <User className="h-4 w-4 mr-3 opacity-70" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="schedule"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-gray-200/50 data-[state=active]:font-semibold text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 justify-start w-full px-3.5 py-2.5 h-auto text-sm font-medium rounded-xl transition-all"
                    >
                      <CalendarCheck className="h-4 w-4 mr-3 opacity-70" />
                      Schedule
                    </TabsTrigger>
                    <TabsTrigger
                      value="availability"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-gray-200/50 data-[state=active]:font-semibold text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 justify-start w-full px-3.5 py-2.5 h-auto text-sm font-medium rounded-xl transition-all"
                    >
                      <Clock className="h-4 w-4 mr-3 opacity-70" />
                      Availability
                    </TabsTrigger>
                    <TabsTrigger
                      value="compliance"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-gray-200/50 data-[state=active]:font-semibold text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 justify-start w-full px-3.5 py-2.5 h-auto text-sm font-medium rounded-xl transition-all"
                    >
                      <ShieldCheck className="h-4 w-4 mr-3 opacity-70" />
                      Compliance
                    </TabsTrigger>
                    <TabsTrigger
                      value="compensation"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-gray-200/50 data-[state=active]:font-semibold text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 justify-start w-full px-3.5 py-2.5 h-auto text-sm font-medium rounded-xl transition-all"
                    >
                      <Banknote className="h-4 w-4 mr-3 opacity-70" />
                      Compensation
                    </TabsTrigger>
                    <TabsTrigger
                      value="activity"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-gray-200/50 data-[state=active]:font-semibold text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 justify-start w-full px-3.5 py-2.5 h-auto text-sm font-medium rounded-xl transition-all"
                    >
                      <Activity className="h-4 w-4 mr-3 opacity-70" />
                      Activity
                    </TabsTrigger>
              </TabsList>
            </div>

            {/* ── MAIN CONTENT AREA ── */}
            <div className="flex-1 min-w-0 w-full">

          {/* ══════════════════════════════════════════════════════════════════
              OVERVIEW TAB
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="overview" className="mt-0">
            <div className="flex flex-col xl:flex-row gap-6">

              {/* ── LEFT: Property Grid ──────────────────────────── */}
              <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl overflow-hidden">

                {/* Section 1: Personal Details */}
                <div className="px-6 py-5">
                  <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-4">Personal Details</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Display Name</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.nickname || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">QID Number</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.qid}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nationality</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.nationality}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Date of Birth</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.dob || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Gender</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.gender || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Religion</dt>
                      <dd className="text-sm font-medium text-gray-900">Islam</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Marital Status</dt>
                      <dd className="text-sm font-medium text-gray-900">Married</dd>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Section 2: Employment */}
                <div className="px-6 py-5">
                  <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-4">Employment</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Position</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.position}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Department</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.department}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Employment Type</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.employmentType}</dd>
                    </div>

                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.joiningDate || "—"}</dd>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Section 3: Operations */}
                <div className="px-6 py-5">
                  <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-4">Operations</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Role Type</dt>
                      <dd>
                        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-0 font-semibold px-2 py-0.5 shadow-none text-[11px]">
                          {staff.roleType}
                        </Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Accommodation</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.employmentType === "Full Time" ? "Company Provided" : "Self-Arranged"}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Area</dt>
                      <dd className="text-sm font-medium text-gray-900">{staff.area}, {staff.city}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Experience</dt>
                      <dd className="text-sm font-medium text-gray-900">5 Years</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Transportation Type</dt>
                      <dd className="text-sm font-medium text-gray-900">Company Vehicle</dd>
                    </div>
                    <div className="lg:col-span-3">
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Skills</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {staff.skills?.map((skill, i) => (
                          <Badge key={i} className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 font-medium text-[11px] px-2 py-0.5 shadow-none">
                            {skill}
                          </Badge>
                        ))}
                        {(!staff.skills || staff.skills.length === 0) && (
                          <span className="text-xs text-gray-400 italic">None assigned</span>
                        )}
                      </dd>
                    </div>
                    <div className="lg:col-span-3">
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Languages</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {staff.languages?.map((lang, i) => (
                          <Badge key={i} variant="outline" className="text-gray-600 border-gray-200 font-medium text-[11px] px-2 py-0.5 shadow-none bg-white">
                            {lang}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Section 4: Access & Security */}
                <div className="px-6 py-5">
                  <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-4">Access & Security</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Staff App Access</dt>
                      <dd>
                        <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-0 font-semibold px-2 py-0.5 shadow-none text-[11px]">
                          Enabled
                        </Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Management Access</dt>
                      <dd className="text-sm font-medium text-gray-500">No Access</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Last Active</dt>
                      <dd className="text-sm font-medium text-gray-900">Today · 08:15 AM</dd>
                    </div>
                  </div>
                </div>

              </div>

              {/* ── RIGHT: Contextual Panel ──────────────────────── */}
              <div className="w-full xl:w-80 shrink-0 flex flex-col gap-5">

                {/* Today's Schedule */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Today's Schedule</h3>
                    <span className="text-[10px] font-medium text-gray-400">Dec 23</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {mockBookings.filter(b => b.date === "2025-12-23").length > 0 ? (
                      mockBookings.filter(b => b.date === "2025-12-23").map((booking, i) => (
                        <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50/50 transition-colors">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            booking.status === "In Progress" ? "bg-blue-500" :
                            booking.status === "Completed" ? "bg-green-500" :
                            "bg-gray-300"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-gray-900 truncate">
                                {booking.service}
                              </span>
                              <Badge className={`shrink-0 border-0 shadow-none text-[10px] font-semibold px-1.5 py-0 ${
                                booking.status === "In Progress" ? "bg-blue-50 text-blue-700" :
                                booking.status === "Completed" ? "bg-green-50 text-green-700" :
                                "bg-gray-100 text-gray-600"
                              }`}>
                                {booking.status}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 mt-1.5 pt-1.5 border-t border-gray-100/60">
                              {/* Row 1: ID & Time */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold tracking-wide text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                                  {booking.id}
                                </span>
                                <span className="text-[11px] font-medium text-gray-600 flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                                  <Clock className="h-3 w-3 text-gray-500" />
                                  {booking.time}
                                </span>
                              </div>

                              {/* Row 2: Customer & Location */}
                              <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                                <div className="flex items-center gap-1.5 max-w-[45%]">
                                  <User className="h-3 w-3 text-gray-400 shrink-0" />
                                  <span className="font-semibold text-gray-700 truncate">{booking.customer}</span>
                                </div>
                                <span className="text-gray-300">|</span>
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                                  <span className="truncate">{booking.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-6 text-center">
                        <CalendarDays className="h-5 w-5 text-gray-300 mx-auto mb-1.5" />
                        <span className="text-xs text-gray-400">No bookings today</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Recent Activity</h3>
                  </div>
                  <div className="px-5 py-3">
                    <div className="relative">
                      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-100" />
                      {[
                        { text: "Completed Booking #2844", time: "2h ago", color: "bg-green-500" },
                        { text: "Started Booking #2845", time: "3h ago", color: "bg-blue-500" },
                        { text: "Checked in at 08:15 AM", time: "5h ago", color: "bg-gray-400" },
                        { text: "Completed Booking #2843", time: "Yesterday", color: "bg-green-500" },
                        { text: "Schedule updated", time: "Yesterday", color: "bg-amber-500" },
                      ].map((event, i) => (
                        <div key={i} className="flex items-start gap-3 py-2 relative">
                          <div className={`w-[11px] h-[11px] rounded-full border-2 border-white ${event.color} shrink-0 mt-0.5 z-10`} />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-gray-700 block truncate">{event.text}</span>
                            <span className="text-[10px] text-gray-400">{event.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Snapshot */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Performance This Month</h3>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    {[
                      { label: "Jobs Completed", value: 24, max: 30, color: "bg-blue-500" },
                      { label: "Customer Satisfaction", value: 96, max: 100, color: "bg-green-500" },
                      { label: "On-Time Rate", value: 92, max: 100, color: "bg-amber-500" },
                    ].map((metric, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500 font-medium">{metric.label}</span>
                          <span className="text-xs font-semibold text-gray-900">{metric.value}{metric.max === 100 ? "%" : `/${metric.max}`}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${metric.color} transition-all`}
                            style={{ width: `${(metric.value / metric.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              SCHEDULE TAB
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="schedule" className="mt-0 space-y-6">
            {/* Schedule Summary Strip */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                {[
                  { label: "In Progress", value: mockBookings.filter(b => b.status === "In Progress").length, color: "text-amber-600" },
                  { label: "Scheduled", value: mockBookings.filter(b => b.status === "Scheduled").length, color: "text-blue-600" },
                  { label: "Completed (Dec)", value: 12, color: "text-green-600" },
                  { label: "Total (All Time)", value: staff.jobsCompleted, color: "text-gray-900" },
                ].map((stat, i) => (
                  <div key={i} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">{stat.label}</span>
                    <span className={`text-xl font-bold leading-none tracking-tight ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2.5">
                  <CalendarCheck className="h-4 w-4 text-gray-400" />
                  Assignments
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className="text-[10px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-50 border-0 shadow-none px-2 py-0.5">
                    {mockBookings.length} Active
                  </Badge>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm h-8 rounded-lg text-xs font-bold">
                    <Plus className="h-3 w-3" />
                    Assign Booking
                  </Button>
                </div>
              </div>
              <div>
                {mockBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Ref</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Customer</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Service</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Date & Time</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Location</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBookings.map(booking => (
                      <TableRow key={booking.id} className="hover:bg-gray-50/50">
                        <TableCell className="text-sm text-gray-500">{booking.id}</TableCell>
                        <TableCell className="text-sm font-medium">{booking.customer}</TableCell>
                        <TableCell>
                          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 text-xs font-medium">
                            {booking.service}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{booking.date}</span>
                            <span className="text-xs text-gray-500">{booking.time}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                            {booking.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              booking.status === "In Progress"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-0"
                                : booking.status === "Scheduled"
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0"
                                  : "bg-green-100 text-green-700 hover:bg-green-100 border-0"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                ) : (
                  <EmptyState
                    icon={CalendarCheck}
                    title="No assignments yet"
                    description="This staff member has no bookings assigned. Create one to get started."
                    action={
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm h-8">
                        <Plus className="h-3 w-3" />
                        Assign Booking
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              AVAILABILITY TAB
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="availability" className="mt-0 space-y-6">
            {/* ── Weekly Schedule ───────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  Weekly Schedule
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total / Net Hrs</p>
                    <p className="text-sm font-bold text-gray-900">
                      {(() => {
                        const total = mockWeeklySchedule.filter(d => d.enabled).reduce((sum, d) => {
                          const s = parseInt(d.start.split(":")[0]) || 0;
                          const e = parseInt(d.end.split(":")[0]) || 0;
                          return sum + (e - s);
                        }, 0);
                        const breaks = mockWeeklySchedule.filter(d => d.enabled).reduce((sum, d) => sum + d.breakMins, 0) / 60;
                        return `${total}h / ${total - breaks}h net`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-7 gap-2">
                  {mockWeeklySchedule.map((day) => (
                    <div
                      key={day.day}
                      className={`rounded-lg border p-3 text-center ${
                        day.enabled
                          ? "bg-white border-gray-200"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${day.enabled ? "text-gray-700" : "text-gray-400"}`}>
                        {day.day.substring(0, 3)}
                      </p>
                      {day.enabled ? (
                        <>
                          <p className="text-sm font-bold text-gray-900">{day.start}–{day.end}</p>
                          {day.breakMins > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {day.breakMins}m break
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-gray-400 font-medium">Off</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Seasonal Patterns ────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2.5">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  Seasonal Patterns
                </h3>
                <Button size="sm" variant="outline" className="gap-1.5 border-gray-200 text-gray-600 hover:text-gray-900 h-8 rounded-lg text-xs font-bold">
                  <Plus className="h-3 w-3" />
                  Add Pattern
                </Button>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {mockSeasonalPatterns.map(pattern => (
                    <div key={pattern.id} className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">{pattern.name}</h4>
                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100 border-0">
                          {pattern.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{pattern.months}</p>
                      <p className="text-sm text-gray-700">{pattern.adjustment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Time Off ─────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Time Off
                </h3>
                <Button size="sm" variant="outline" className="gap-1.5 border-gray-200 text-gray-600 hover:text-gray-900 h-8 rounded-lg text-xs font-bold">
                  <Plus className="h-3 w-3" />
                  Request Leave
                </Button>
              </div>
              <div>
                {mockTimeOff.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Type</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">From</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">To</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Days</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTimeOff.map(leave => (
                      <TableRow key={leave.id} className="hover:bg-gray-50/50">
                        <TableCell className="text-sm font-medium">{leave.type}</TableCell>
                        <TableCell className="text-sm">{leave.from}</TableCell>
                        <TableCell className="text-sm">{leave.to}</TableCell>
                        <TableCell className="text-sm font-semibold">{leave.days}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              leave.status === "Approved"
                                ? "bg-green-100 text-green-700 hover:bg-green-100 border-0"
                                : leave.status === "Pending"
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-0"
                                  : "bg-red-100 text-red-700 hover:bg-red-100 border-0"
                            }
                          >
                            {leave.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                ) : (
                  <EmptyState
                    icon={Calendar}
                    title="No time-off records"
                    description="No leave requests have been submitted for this staff member."
                    action={
                      <Button size="sm" variant="outline" className="gap-1.5 border-gray-200 text-gray-600 hover:text-gray-900 h-8">
                        <Plus className="h-3 w-3" />
                        Request Leave
                      </Button>
                    }
                  />
                )}
              </div>
            </div>

            {/* ── Advanced Preferences ──────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2.5">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  Advanced Preferences
                </h3>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Emergency Availability</p>
                      <p className="text-xs text-gray-500">Can be called for urgent jobs</p>
                    </div>
                    <Badge className={mockAdvancedPreferences.emergencyAvailability ? "bg-green-100 text-green-700 hover:bg-green-100 border-0" : "bg-gray-100 text-gray-500 hover:bg-gray-100 border-0"}>
                      {mockAdvancedPreferences.emergencyAvailability ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Overtime Willingness</p>
                      <p className="text-xs text-gray-500">Available beyond scheduled hours</p>
                    </div>
                    <Badge className={mockAdvancedPreferences.overtimeWilling ? "bg-green-100 text-green-700 hover:bg-green-100 border-0" : "bg-gray-100 text-gray-500 hover:bg-gray-100 border-0"}>
                      {mockAdvancedPreferences.overtimeWilling ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Max Daily Hours</p>
                      <p className="text-xs text-gray-500">Hard limit per day</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{mockAdvancedPreferences.maxDailyHours}h</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shift Preference</p>
                      <p className="text-xs text-gray-500">Preferred shift slot</p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{mockAdvancedPreferences.shiftPreference}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Break Preference</p>
                      <p className="text-xs text-gray-500">Preferred break structure</p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{mockAdvancedPreferences.breakPreference}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              COMPLIANCE TAB
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="compliance" className="mt-0 space-y-6">
            {/* Compliance Overview Banner */}
            {(() => {
              const expired = activeDocuments.filter(d => d.status === "Expired").length;
              const expiring = activeDocuments.filter(d => d.status === "Expiring Soon").length;
              const valid = activeDocuments.filter(d => d.status === "Valid").length;
              const hasRisk = expired > 0 || expiring > 0;
              return (
                <div className={`rounded-lg border px-5 py-4 flex items-center justify-between ${hasRisk ? "border-amber-200 bg-amber-100" : "border-green-200 bg-green-100"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${hasRisk ? "bg-amber-100" : "bg-green-100"}`}>
                      <ShieldCheck className={`h-5 w-5 ${hasRisk ? "text-amber-600" : "text-green-600"}`} />
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold ${hasRisk ? "text-amber-800" : "text-green-800"}`}>
                        {hasRisk ? "Compliance Requires Attention" : "All Documents Compliant"}
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {valid} valid · {expiring} expiring · {expired} expired
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1.5 border-gray-200 text-gray-600 hover:text-gray-900 h-8">
                    <Upload className="h-3 w-3" />
                    Upload Document
                  </Button>
                </div>
              );
            })()}

            {/* Documents & Certifications Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-gray-400" />
                  Documents & Certifications
                </h3>
              </div>
              <div>
                {activeDocuments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Document</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Type</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Doc Number</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Expiry</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Status</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeDocuments.map(doc => (
                      <TableRow key={doc.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <FileIcon className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="text-sm font-medium">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{doc.type}</TableCell>
                        <TableCell className="text-sm text-gray-500">{(doc as any).docNumber || "—"}</TableCell>
                        <TableCell className="text-sm">{doc.expiry}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              doc.status === "Valid"
                                ? "bg-green-100 text-green-700 hover:bg-green-100 border-0"
                                : doc.status === "Expiring Soon"
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-0"
                                  : "bg-red-100 text-red-700 hover:bg-red-100 border-0"
                            }
                          >
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                ) : (
                  <EmptyState
                    icon={FileText}
                    title="No documents uploaded"
                    description="Upload identification, certifications, and compliance documents for this staff member."
                    action={
                      <Button size="sm" variant="outline" className="gap-1.5 border-gray-200 text-gray-600 hover:text-gray-900 h-8">
                        <Upload className="h-3 w-3" />
                        Upload Document
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              COMPENSATION TAB
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="compensation" className="mt-0 space-y-6">
            {/* Month Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-gray-200 text-gray-500 hover:text-gray-900"
                  onClick={() => setCompMonth(prev => {
                    const m = prev.month === 0 ? 11 : prev.month - 1;
                    const y = prev.month === 0 ? prev.year - 1 : prev.year;
                    return { year: y, month: m };
                  })}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-semibold text-gray-900 min-w-[140px] text-center">
                  {monthLabels[compMonth.month]} {compMonth.year}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-gray-200 text-gray-500 hover:text-gray-900"
                  onClick={() => setCompMonth(prev => {
                    const m = prev.month === 11 ? 0 : prev.month + 1;
                    const y = prev.month === 11 ? prev.year + 1 : prev.year;
                    return { year: y, month: m };
                  })}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Monthly Summary Cards */}
            {(() => {
              const key = `${compMonth.year}-${String(compMonth.month + 1).padStart(2, "0")}`;
              const data = mockMonthlyCompensation[key] || { base: "0", commission: "0", tips: "0", total: "0" };
              return (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                    {[
                      { label: "Base Salary", value: `${data.base} QAR`, color: "text-gray-900" },
                      { label: "Commission", value: `${data.commission} QAR`, color: "text-blue-600" },
                      { label: "Tips", value: `${data.tips} QAR`, color: "text-green-600" },
                      { label: "Total Earnings", value: `${data.total} QAR`, color: "text-gray-900" },
                    ].map((stat, i) => (
                      <div key={i} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">{stat.label}</span>
                        <span className={`text-xl font-bold leading-none tracking-tight ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Employment Terms */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  Employment Terms
                </h3>
              </div>
              <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                <DataField label="Salary Type" value={staff.salaryType === "fixed-monthly" ? "Fixed Monthly" : staff.salaryType || "Not set"} />
                <DataField label="Contract Type" value={staff.contractType || "Not set"} />
                <DataField label="Employment Type" value={staff.employmentType || "Not set"} />
              </div>
            </div>

            {/* Payout History */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2.5">
                  <Banknote className="h-4 w-4 text-gray-400" />
                  Payout History
                </h3>
              </div>
              <div>
                {mockPayouts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Payout ID</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Date</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Type</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px] text-right">Amount (QAR)</TableHead>
                      <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPayouts.map(pay => (
                      <TableRow key={pay.id} className="hover:bg-gray-50/50">
                        <TableCell className="text-sm text-gray-500">{pay.id}</TableCell>
                        <TableCell className="text-sm">{pay.date}</TableCell>
                        <TableCell>
                          <Badge className={
                            pay.type === "Base Salary" ? "bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 text-xs" :
                            pay.type === "Commission" ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 text-xs" :
                            "bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs"
                          }>
                            {pay.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-bold text-right">{pay.amount}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                            {pay.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                ) : (
                  <EmptyState
                    icon={Banknote}
                    title="No payout records"
                    description="Payout history will appear here once payroll has been processed."
                  />
                )}
              </div>
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════
              ACTIVITY TAB
          ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="activity" className="mt-0 space-y-6">
            {/* ── Operational Timeline (Top 10) ────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2.5">
                  <Activity className="h-4 w-4 text-gray-400" />
                  Operational Timeline
                </h3>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1.5 text-xs h-8 text-gray-600 border-gray-200 hover:text-gray-900 bg-white shadow-sm rounded-lg font-bold"
                  onClick={() => document.getElementById("full-activity-log")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  View Full Activity Log
                </Button>
              </div>
              <div className="px-6 py-5">
                <div className="relative border-l-2 border-gray-100 ml-3 pl-6 space-y-6 pb-2 pt-2">
                  {mockActivityLog.slice(0, 10).map((log) => {
                    const d = new Date(log.date);
                    const day = d.getDate();
                    const mon = d.toLocaleString("en-US", { month: "short" });
                    const yr = d.getFullYear();
                    
                    return (
                      <div key={log.id} className="relative">
                        {/* Timeline node */}
                        <div className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-white ring-1 ring-offset-1 ${
                          log.category === "profile" ? "bg-blue-500 ring-blue-200" :
                          log.category === "schedule" ? "bg-purple-500 ring-purple-200" :
                          log.category === "compliance" ? "bg-amber-500 ring-amber-200" :
                          log.category === "compensation" ? "bg-emerald-500 ring-emerald-200" :
                          "bg-gray-400 ring-gray-200"
                        }`} />
                        
                        {/* Event content */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 group">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-900">{log.event}</h4>
                              <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                                log.actor === "System" ? "bg-gray-100 text-gray-600" :
                                log.actor === "Admin"  ? "bg-blue-50 text-blue-600" :
                                log.actor === "HR"     ? "bg-violet-50 text-violet-600" :
                                "bg-indigo-50 text-indigo-600"
                              }`}>
                                {log.actor}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {log.details}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 font-medium shrink-0 pt-0.5">
                            {`${day} ${mon} ${yr}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Filter Bar ─────────────────────────────────────────────── */}
            <div id="full-activity-log" className="flex flex-wrap items-center gap-3 pt-2">
              {/* Date Range */}
              <Select value={activityDateRange} onValueChange={v => { setActivityDateRange(v); setActivityPage(1); }}>
                <SelectTrigger className="h-8 w-auto min-w-[150px] border-gray-200 bg-white shadow-sm rounded-md px-2.5 text-xs gap-1">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  {activityDateRanges.map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      <span className="text-xs font-medium">{r.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Event Type */}
              <Select value={activityFilter} onValueChange={v => { setActivityFilter(v); setActivityPage(1); }}>
                <SelectTrigger className="h-8 w-auto min-w-[170px] border-gray-200 bg-white shadow-sm rounded-md px-2.5 text-xs gap-1">
                  <SelectValue placeholder="Event type" />
                </SelectTrigger>
                <SelectContent>
                  {activityEventCategories.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      <span className="text-xs font-medium">{c.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  placeholder="Search activity..."
                  value={activitySearch}
                  onChange={e => { setActivitySearch(e.target.value); setActivityPage(1); }}
                  className="h-8 pl-8 text-xs border-gray-200 shadow-sm"
                />
              </div>
            </div>

            {/* ── Activity Table Card ─────────────────────────────────────── */}
            {(() => {
              // 1. Filter by category
              let filtered = activityFilter === "all"
                ? mockActivityLog
                : mockActivityLog.filter(l => l.category === activityFilter);

              // 2. Filter by date range
              if (activityDateRange !== "all") {
                const now = new Date("2026-03-12T16:00:00");
                const cutoff = new Date(now);
                if (activityDateRange === "24h") cutoff.setHours(cutoff.getHours() - 24);
                else if (activityDateRange === "7d") cutoff.setDate(cutoff.getDate() - 7);
                else if (activityDateRange === "30d") cutoff.setDate(cutoff.getDate() - 30);
                filtered = filtered.filter(l => new Date(l.date) >= cutoff);
              }

              // 3. Filter by search
              if (activitySearch.trim()) {
                const q = activitySearch.toLowerCase();
                filtered = filtered.filter(l =>
                  l.details.toLowerCase().includes(q) ||
                  l.event.toLowerCase().includes(q) ||
                  l.actor.toLowerCase().includes(q)
                );
              }

              // 4. Pagination
              const totalPages = Math.max(1, Math.ceil(filtered.length / ACTIVITY_PER_PAGE));
              const safePage = Math.min(activityPage, totalPages);
              const paged = filtered.slice((safePage - 1) * ACTIVITY_PER_PAGE, safePage * ACTIVITY_PER_PAGE);

              return (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2.5">
                      <Activity className="h-4 w-4 text-gray-400" />
                      Activity Log
                    </h3>
                    <Badge className="text-[10px] font-bold bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 shadow-none px-2 py-0.5">
                      {filtered.length} {filtered.length === 1 ? "Entry" : "Entries"}
                    </Badge>
                  </div>
                  <div>
                    {filtered.length > 0 ? (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Date</TableHead>
                              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Event</TableHead>
                              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Actor</TableHead>
                              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50 h-[38px]">Details</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paged.map(log => (
                              <TableRow key={log.id} className="hover:bg-gray-50/50">
                                <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                                  {(() => {
                                    const d = new Date(log.date);
                                    const day = d.getDate();
                                    const mon = d.toLocaleString("en-US", { month: "short" });
                                    const yr = d.getFullYear();
                                    const time = d.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
                                    return `${day} ${mon} ${yr} ${time}`;
                                  })()}
                                </TableCell>
                                <TableCell>
                                  <Badge className={`text-xs ${ACTIVITY_CATEGORY_STYLES[log.category]}`}>
                                    {log.event}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                    log.actor === "System" ? "bg-gray-100 text-gray-600" :
                                    log.actor === "Admin"  ? "bg-blue-50 text-blue-600" :
                                    log.actor === "HR"     ? "bg-violet-50 text-violet-600" :
                                    "bg-indigo-50 text-indigo-600"
                                  }`}>
                                    {log.actor}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {log.details}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {/* ── Pagination ──────────────────────────────────── */}
                        {totalPages > 1 && (
                          <div className="border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 mt-4 p-3 flex items-center justify-between rounded-b-lg">
                            <div className="text-xs text-gray-500 font-medium">
                              Showing{" "}
                              <span className="font-bold text-gray-900">{(safePage - 1) * ACTIVITY_PER_PAGE + 1}</span>{" "}
                              to{" "}
                              <span className="font-bold text-gray-900">{Math.min(filtered.length, safePage * ACTIVITY_PER_PAGE)}</span>{" "}
                              of{" "}
                              <span className="font-bold text-gray-900">{filtered.length}</span>{" "}
                              results
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                                onClick={() => setActivityPage(p => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <div className="text-xs font-semibold px-3 min-w-[4rem] text-center text-gray-700">
                                Page {safePage} of {totalPages}
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                                onClick={() => setActivityPage(p => Math.min(totalPages, p + 1))}
                                disabled={safePage === totalPages}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <EmptyState
                        icon={Activity}
                        title="No activity recorded yet"
                        description={activityFilter !== "all" || activitySearch.trim() || activityDateRange !== "all"
                          ? "No activity matches your current filters. Try adjusting the date range, event type, or search query."
                          : "Activity will appear here as changes are made to this staff member's profile, schedule, compliance, and compensation."
                        }
                      />
                    )}
                  </div>
                </div>
              );
            })()}

          </TabsContent>
            </div>

          </div>
        </Tabs>
      </div>

      {/* ─── STATUS CHANGE CONFIRMATION DIALOG ──────────────────────────── */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md p-6 gap-0 rounded-2xl border-0 shadow-2xl">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-gray-900 leading-none">Change Employment Status</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                You are changing the staff status to <strong className="text-gray-900 font-bold">{pendingEmploymentStatus}</strong>. This will prevent them from being assigned to new jobs.
              </p>
            </div>
          </div>

          <div className="pl-8 mb-6">
            {/* Impact Warning Block */}
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-amber-800 text-[13px] flex items-center gap-2 tracking-wide">
                <Info className="h-4 w-4" /> Impact on Current Operation
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-bold text-red-700 tracking-wide">In-Progress Jobs:</span>
                  <span className="font-bold text-gray-900">{impactAnalysis.inProgress.length}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-700 tracking-wide">Scheduled Future Jobs:</span>
                  <span className="font-medium text-gray-900">{impactAnalysis.scheduled.length}</span>
                </div>
              </div>
            </div>

            {/* On Leave Specific Inputs */}
            {pendingEmploymentStatus === "On Leave" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700">Start Date</Label>
                  <Input
                    type="date"
                    className="h-9 rounded-lg"
                    value={leaveDates.start}
                    onChange={e =>
                      setLeaveDates({ ...leaveDates, start: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700">End Date (Optional)</Label>
                  <Input
                    type="date"
                    className="h-9 rounded-lg"
                    value={leaveDates.end}
                    onChange={e =>
                      setLeaveDates({ ...leaveDates, end: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              className="px-5 rounded-lg border-gray-200 text-gray-700 font-semibold shadow-sm hover:bg-gray-50"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="px-5 rounded-lg font-bold shadow-sm bg-[#dc2626] hover:bg-[#b91c1c] text-white border-0"
              onClick={confirmStatusChange}
            >
              Unassign Jobs & set {pendingEmploymentStatus}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
