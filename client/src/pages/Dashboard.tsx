import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GettingStartedTab } from "@/components/GettingStartedTab";
import { RecentUpdatesTab } from "@/components/RecentUpdatesTab";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Users,
  MapPin,
  DollarSign,
  Plus,
  Truck,
  UserPlus,
  CalendarDays,
  TrendingUp,
  User,
  Phone,
  AlertTriangle,
  CreditCard,
  Gauge,
  Timer,
  Star,
  Wallet,
  Activity,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  RevenueAreaChart,
  RevenueSourcePieChart,
  AreaDemandBarChart,
  UtilizationRadialChart
} from "@/components/DashboardCharts";

// Mock data - Today Summary
const todaySummary = {
  totalBookings: 45,
  inProgress: 8,
  completed: 32,
  unassigned: 2,
  cancelled: 3,
};

// Mock data - Capacity Indicator
const capacityIndicator = {
  canAcceptMore: true,
  availableSlots: 12,
  totalSlots: 50,
  utilizationPercentage: 76,
};

// Mock data - Critical Jobs (only delayed, at-risk, unassigned)
const criticalJobs = [
  {
    id: "J003",
    customerName: "Ahmed Al-Mansoori",
    area: "Al Sadd",
    timeSlot: "11:30 AM - 12:30 PM",
    staff: { name: "Hassan Ali", photo: "HA" },
    status: "delayed",
    reason: "Traffic delay",
  },
  {
    id: "J005",
    customerName: "Sara Abdullah",
    area: "West Bay",
    timeSlot: "1:00 PM - 2:00 PM",
    staff: { name: "Youssef Ali", photo: "YA" },
    status: "not_checked_in",
    reason: "Staff hasn't checked in yet",
  },
];

// Mock data - Staff Summary (no individual names, just metrics)
const staffSummary = {
  total: 48,
  onDuty: 32,
  available: 12,
  busy: 18,
  absent: 2,
  overbooked: 0,
  utilizationPercentage: 76,
  utilizationStatus: "optimal", // optimal | high | low
};

// Mock data - Top 3 Busy Areas (not all areas)
const topBusyAreas = [
  { area: "Al Sadd", bookings: 12, staff: 4, load: "high" },
  { area: "West Bay", bookings: 8, staff: 3, load: "medium" },
  { area: "The Pearl", bookings: 6, staff: 2, load: "medium" },
];

// Mock data - Revenue (simplified)
const revenueData = {
  todayRevenue: 12450,
  aldobi: 8500,
  direct: 3950,
};

// Mock data - Staff Tab
const staffOverview = {
  total: 48,
  onDuty: 32,
  available: 12,
  utilizationRate: 76,
};

const availableStaff = [
  { id: "S001", name: "Ahmed Hassan", location: "Al Sadd", completedToday: 4, rating: 4.8 },
  { id: "S002", name: "Mohammed Ali", location: "West Bay", completedToday: 3, rating: 4.9 },
  { id: "S003", name: "Khalid Ibrahim", location: "The Pearl", completedToday: 5, rating: 4.7 },
  { id: "S004", name: "Youssef Ahmed", location: "Al Rayyan", completedToday: 3, rating: 4.6 },
];

const busyStaff = [
  { id: "S005", name: "Hassan Ali", currentJob: "AC Cleaning", area: "Al Sadd", eta: "30 min" },
  { id: "S006", name: "Omar Saeed", currentJob: "Deep Cleaning", area: "West Bay", eta: "45 min" },
  { id: "S007", name: "Ibrahim Youssef", currentJob: "Plumbing", area: "The Pearl", eta: "1 hour" },
];

const absentStaff = [
  { id: "S008", name: "Ali Mohammed", reason: "Sick Leave", date: "Today" },
  { id: "S009", name: "Tariq Hassan", reason: "Personal Emergency", date: "Today" },
];

const topPerformers = [
  { id: "S010", name: "Khalid Ibrahim", completedToday: 5, revenueToday: 1850, rating: 4.7, onTimeRate: 100 },
  { id: "S011", name: "Ahmed Hassan", completedToday: 4, revenueToday: 1600, rating: 4.8, onTimeRate: 100 },
  { id: "S012", name: "Mohammed Ali", completedToday: 3, revenueToday: 1350, rating: 4.9, onTimeRate: 100 },
];

const staffIssuesTab: Array<{
  id: string;
  staffName: string;
  issue: string;
  severity: "high" | "medium" | "low";
  time: string;
}> = [
  { id: "SI001", staffName: "Saeed Ali", issue: "Late Check-In", severity: "medium", time: "8:15 AM" },
  { id: "SI002", staffName: "Nasser Ahmed", issue: "Low Performance", severity: "low", time: "Today" },
];

// Mock data - Revenue Tab
const revenueOverview = {
  today: 12450,
  thisWeek: 67800,
  thisMonth: 245600,
  averagePerBooking: 277,
  todayVsYesterday: 3.7,
  weekOverWeek: 12.5,
  monthOverMonth: 8.3,
};

const revenueBySource = [
  { source: "Aldobi", revenue: 8500, bookings: 28, percentage: 68 },
  { source: "Direct", revenue: 3950, bookings: 17, percentage: 32 },
];

const revenueByService = [
  { service: "AC Cleaning", revenue: 4200, bookings: 18, averagePrice: 233 },
  { service: "Deep Cleaning", revenue: 3600, bookings: 12, averagePrice: 300 },
  { service: "Plumbing", revenue: 2100, bookings: 8, averagePrice: 263 },
  { service: "Electrical Work", revenue: 1550, bookings: 4, averagePrice: 388 },
  { service: "Painting", revenue: 1000, bookings: 3, averagePrice: 333 },
];

const revenueByArea = [
  { area: "Al Sadd", revenue: 3600, bookings: 12, growth: 15.2 },
  { area: "West Bay", revenue: 2800, bookings: 8, growth: 8.5 },
  { area: "The Pearl", revenue: 2400, bookings: 6, growth: -3.2 },
  { area: "Al Rayyan", revenue: 1850, bookings: 7, growth: 22.1 },
  { area: "Lusail", revenue: 1800, bookings: 5, growth: 10.0 },
];

const paymentStatus = {
  collected: 9850,
  pending: 2600,
  failed: 0,
  collectionRate: 79,
};

// Mock data - Alerts Tab
const unassignedBookings = [
  {
    id: "B001",
    customerName: "Mohammed Ali",
    area: "Al Rayyan",
    timeSlot: "2:00 PM - 3:00 PM",
    service: "Deep Cleaning",
  },
  {
    id: "B002",
    customerName: "Fatima Hassan",
    area: "Al Waab",
    timeSlot: "3:00 PM - 4:00 PM",
    service: "Regular Cleaning",
  },
];

const delayedJobs = [
  {
    id: "J003",
    customerName: "Ahmed Al-Mansoori",
    area: "Al Sadd",
    timeSlot: "11:30 AM - 12:30 PM",
    staff: "Hassan Ali",
    delayMinutes: 15,
    reason: "Traffic congestion",
  },
];

const staffIssues = [
  {
    id: "S001",
    staffName: "Ali Mohammed",
    issue: "Not checked in",
    scheduledTime: "8:00 AM",
    status: "absent",
  },
  {
    id: "S002",
    staffName: "Youssef Ali",
    issue: "Late check-in",
    scheduledTime: "9:00 AM",
    actualTime: "9:45 AM",
    status: "late",
  },
];

const paymentFailures = [
  {
    id: "P001",
    customerName: "Sara Abdullah",
    amount: 450,
    reason: "Card declined",
    bookingId: "B123",
  },
];

const customerComplaints = [
  {
    id: "C001",
    customerName: "Fatima Al-Thani",
    rating: 2,
    complaint: "Staff arrived late",
    priority: "medium",
  },
  {
    id: "C002",
    customerName: "Abdullah Rahman",
    complaint: "Punctuality issue",
    priority: "high",
  },
];

const next2HoursRisks = [
  {
    id: "R001",
    time: "12:30 PM",
    risk: "high",
    message: "Hassan Ali has back-to-back bookings (The Pearl → Al Rayyan)",
    impact: "May cause 15-20 min delay",
  },
  {
    id: "R002",
    time: "1:00 PM",
    risk: "medium",
    message: "3 bookings scheduled in Al Sadd area - traffic congestion likely",
    impact: "Consider reassigning",
  },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const handleQuickAction = (action: string) => {
    toast.info(`${action} - Feature coming soon`);
  };

  // Navigation helpers
  const navigateToBookings = (filter?: string) => {
    if (filter) {
      toast.info(`Navigating to Bookings filtered by: ${filter}`);
    }
    setLocation("/bookings");
  };

  const navigateToWorkforce = (filter?: string) => {
    if (filter) {
      toast.info(`Navigating to Workforce filtered by: ${filter}`);
    }
    setLocation("/workforce");
  };

  const navigateToDispatch = () => {
    setLocation("/dispatch");
  };

  const handleFeatureComingSoon = (feature: string) => {
    toast.info(`${feature} - Feature coming soon`);
  };

  return (
    <DashboardLayout>
      <Tabs defaultValue="dashboard" className="w-full space-y-4">
        <div className="w-full border-b border-gray-200 mb-4">
          <TabsList className="bg-transparent p-0 w-auto flex justify-start gap-6 h-auto rounded-none border-0">
            <TabsTrigger 
              value="dashboard" 
              className="w-auto rounded-none border-b-2 border-transparent px-2 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent shadow-none transition-all flex-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus:outline-none"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="getting-started" 
              className="w-auto rounded-none border-b-2 border-transparent px-2 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent shadow-none transition-all flex-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus:outline-none"
            >
              Getting Started
            </TabsTrigger>
            <TabsTrigger 
              value="recent-updates" 
              className="w-auto rounded-none border-b-2 border-transparent px-2 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent shadow-none transition-all flex-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus:outline-none"
            >
              Recent Updates
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Premium Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/90 to-blue-900 text-white p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-2 text-white">
                Good Morning, Admin!
              </h1>
              <p className="text-blue-100 text-lg max-w-xl">
                Here's what's happening in your operations today. You have <span className="font-bold text-white">45 bookings</span> scheduled.
              </p>
              
              <div className="flex items-center gap-3 mt-4">
                <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-400" />
                  System Systems Operational
                </div>
                <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-200" />
                  Last updated: Just now
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => handleQuickAction("Add Booking")}
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all h-12 px-6"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Booking
              </Button>
              <Button 
                onClick={() => navigateToDispatch()}
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-md h-12 px-6"
              >
                <Truck className="h-5 w-5 mr-2" />
                Dispatch
              </Button>
            </div>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />
        </div>

        {/* Today Summary Strip - Glass Cards */}
        <div className="grid grid-cols-5 gap-4">
          <Card
            className="glass-panel hover:bg-card/90 transition-all cursor-pointer group"
            onClick={() => navigateToBookings("today")}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Today's Bookings</p>
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-heading font-bold text-foreground">{todaySummary.totalBookings}</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="glass-panel hover:bg-card/90 transition-all cursor-pointer group"
            onClick={() => navigateToBookings("in progress")}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-600 transition-colors">In Progress</p>
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-heading font-bold text-blue-600">{todaySummary.inProgress}</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="glass-panel hover:bg-card/90 transition-all cursor-pointer group"
            onClick={() => navigateToBookings("completed today")}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-green-600 transition-colors">Completed</p>
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-heading font-bold text-green-600">{todaySummary.completed}</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="glass-panel bg-red-50/30 border-red-200/50 hover:bg-red-50/50 transition-all cursor-pointer group"
            onClick={() => navigateToBookings("unassigned")}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-red-600/80 group-hover:text-red-600 transition-colors">Unassigned</p>
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all animate-pulse">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-heading font-bold text-red-600">{todaySummary.unassigned}</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="glass-panel hover:bg-card/90 transition-all cursor-pointer group"
            onClick={() => navigateToBookings("cancelled today")}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-gray-600 transition-colors">Cancelled</p>
                  <div className="p-2 bg-gray-500/10 rounded-lg text-gray-500 group-hover:bg-gray-500 group-hover:text-white transition-all">
                    <XCircle className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-heading font-bold text-muted-foreground">{todaySummary.cancelled}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capacity Indicator - Modern Pill */}
        <div
          className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer hover:shadow-lg transition-all ${
            capacityIndicator.canAcceptMore
              ? "bg-gradient-to-r from-green-50/80 to-emerald-50/50 border-green-100"
              : "bg-gradient-to-r from-red-50/80 to-orange-50/50 border-red-100"
          }`}
          onClick={() => navigateToBookings("today")}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${capacityIndicator.canAcceptMore ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              {capacityIndicator.canAcceptMore ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className={`text-xl font-heading font-bold ${
                capacityIndicator.canAcceptMore ? "text-green-900" : "text-red-900"
              }`}>
                {capacityIndicator.canAcceptMore
                  ? `Capacity Available: ${capacityIndicator.availableSlots} slots open`
                  : "Maximum Capacity Reached"}
              </p>
              <p className="text-sm text-gray-600/80 font-medium mt-1">
                Currently running at {capacityIndicator.utilizationPercentage}% efficiency
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 min-w-[300px]">
            <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm border border-black/5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  capacityIndicator.utilizationPercentage >= 90
                    ? "bg-red-500"
                    : capacityIndicator.utilizationPercentage >= 75
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${capacityIndicator.utilizationPercentage}%` }}
              />
            </div>
            <span className="text-xl font-bold font-heading text-gray-700">
              {capacityIndicator.utilizationPercentage}%
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full max-w-4xl grid grid-cols-4 bg-muted/50 p-1 backdrop-blur-md rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="alerts" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Alerts
              {(unassignedBookings.length +
                delayedJobs.length +
                staffIssues.length +
                paymentFailures.length +
                customerComplaints.length) > 0 && (
                <Badge className="ml-2 bg-red-500 text-white hover:bg-red-600">
                  {unassignedBookings.length +
                    delayedJobs.length +
                    staffIssues.length +
                    paymentFailures.length +
                    customerComplaints.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="staff" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Staff</TabsTrigger>
            <TabsTrigger value="revenue" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Revenue</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Critical Jobs Panel */}
                <Card className="glass-panel overflow-hidden border-orange-200/50">
                  <CardHeader className="bg-orange-50/30 border-b border-orange-100">
                    <CardTitle className="flex items-center gap-2 text-orange-900">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Critical Attention Needed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {todaySummary.unassigned > 0 && (
                        <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl flex items-center justify-between group hover:bg-red-50 transition-colors">
                          <div>
                            <p className="font-bold text-red-900 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              {todaySummary.unassigned} Unassigned Bookings
                            </p>
                            <p className="text-sm text-red-700/80 mt-1">These jobs need immediate assignment</p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToBookings("assign unassigned booking");
                            }}
                          >
                            Assign Now
                          </Button>
                        </div>
                      )}
                      
                      {criticalJobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-4 rounded-xl border bg-white/50 hover:bg-white transition-all shadow-sm hover:shadow-md cursor-pointer border-gray-100"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  className={
                                    job.status === "delayed"
                                      ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                  }
                                >
                                  {job.status === "delayed" ? "Delayed" : "Not Checked-In"}
                                </Badge>
                                <span className="font-bold text-gray-900">{job.customerName}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                  {job.area}
                                </span>
                                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                                  {job.timeSlot}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gray-300" />
                                Staff: <span className="font-medium text-gray-900">{job.staff.name}</span>
                                <span className="text-gray-400 mx-1">•</span>
                                <span className="text-red-500 font-medium">{job.reason}</span>
                              </p>
                            </div>
                            <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-100 text-gray-400 hover:text-primary">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Staff Summary */}
                <Card className="glass-panel">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Staff Overview
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-primary/5"
                        onClick={() => navigateToWorkforce()}
                      >
                        View Directory <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className="text-center p-4 bg-green-50/50 rounded-2xl border border-green-100 cursor-pointer hover:bg-green-50 hover:shadow-md transition-all group"
                          onClick={() => navigateToWorkforce("available")}
                        >
                          <p className="text-3xl font-heading font-bold text-green-700 group-hover:scale-110 transition-transform">{staffSummary.available}</p>
                          <p className="text-sm font-medium text-green-700/70">Available</p>
                        </div>
                        <div
                          className="text-center p-4 bg-blue-50/50 rounded-2xl border border-blue-100 cursor-pointer hover:bg-blue-50 hover:shadow-md transition-all group"
                          onClick={() => navigateToWorkforce("busy")}
                        >
                          <p className="text-3xl font-heading font-bold text-blue-700 group-hover:scale-110 transition-transform">{staffSummary.busy}</p>
                          <p className="text-sm font-medium text-blue-700/70">Busy</p>
                        </div>
                        <div
                          className="text-center p-4 bg-red-50/50 rounded-2xl border border-red-100 cursor-pointer hover:bg-red-50 hover:shadow-md transition-all group"
                          onClick={() => navigateToWorkforce("absent")}
                        >
                          <p className="text-3xl font-heading font-bold text-red-700 group-hover:scale-110 transition-transform">{staffSummary.absent}</p>
                          <p className="text-sm font-medium text-red-700/70">Absent</p>
                        </div>
                      </div>
                      
                      <div className="p-5 bg-muted/30 rounded-2xl border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-semibold text-foreground">Live Utilization</span>
                          </div>
                          <Badge variant="outline" className="bg-white/50 backdrop-blur">
                            {staffSummary.utilizationStatus.toUpperCase()}
                          </Badge>
                        </div>
                        
                        {/* Radial Gauge Chart */}
                        <div className="-mt-4 -mb-2">
                           <UtilizationRadialChart value={staffSummary.utilizationPercentage} />
                        </div>

                        <p className="text-xs text-center text-muted-foreground font-medium pb-2">
                          {staffSummary.onDuty} of {staffSummary.total} staff currently active
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Top Busy Areas */}
                <Card className="glass-panel">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Area Demand Heatmap
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <AreaDemandBarChart />
                      
                      {/* Condensed List below chart if needed, or remove completely. Keeping top 3 as summary legend */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-dashed border-gray-100">
                         {topBusyAreas.map((area, index) => (
                            <div key={area.area} className="text-center">
                               <p className="text-xs font-bold text-gray-700">{area.area}</p>
                               <p className="text-[10px] text-gray-500">{area.bookings} jobs</p>
                            </div>
                         ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Today's Revenue */}
                <Card className="glass-panel bg-gradient-to-br from-white to-blue-50/30 border-blue-100">
                  <CardHeader className="border-b border-blue-100/50">
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      Revenue Snapshot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="text-center py-4 bg-white/60 rounded-2xl border border-blue-100 shadow-sm backdrop-blur-sm">
                        <p className="text-sm font-medium text-blue-600/80 mb-1">Today's Total</p>
                        <p className="text-5xl font-heading font-bold text-blue-900 tracking-tight">
                          <span className="text-2xl align-top mr-1 opacity-50">QAR</span>
                          {revenueData.todayRevenue.toLocaleString()}
                        </p>
                        <div className="flex items-center justify-center gap-1.5 mt-2 text-sm font-medium text-green-600 bg-green-50 inline-block px-3 py-1 rounded-full border border-green-100">
                          <TrendingUp className="h-3.5 w-3.5" />
                          +3.8% vs yesterday
                        </div>
                        
                        {/* Area Trend Chart */}
                        <div className="px-2">
                           <RevenueAreaChart />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Source Breakdown</p>
                        
                        <div className="flex items-center gap-4">
                           <div className="flex-1">
                              <RevenueSourcePieChart />
                           </div>
                           <div className="w-32 space-y-2">
                              {/* Legend */}
                              <div className="flex items-center gap-2 text-xs">
                                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                                 <span className="text-gray-600">App (68%)</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                 <div className="w-2 h-2 rounded-full bg-violet-500" />
                                 <span className="text-gray-600">Direct (25%)</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                 <div className="w-2 h-2 rounded-full bg-rose-500" />
                                 <span className="text-gray-600">Web (7%)</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Preview */}
                <Card className="glass-panel overflow-hidden border-indigo-200/50 hover:shadow-indigo-500/10 hover:shadow-lg transition-all">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Timer className="w-32 h-32 text-indigo-900" />
                  </div>
                  <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50 relative z-10">
                    <CardTitle className="flex items-center gap-2 text-indigo-900">
                      <Timer className="h-5 w-5 text-indigo-600" />
                      Operations Forecast
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 ml-2">Next 2 Hours</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 relative z-10">
                    <div className="space-y-4">
                      {next2HoursRisks.map((risk) => (
                        <div
                          key={risk.id}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            risk.risk === "high" 
                              ? "bg-red-50/80 border-red-100 hover:bg-red-100/80" 
                              : "bg-yellow-50/80 border-yellow-100 hover:bg-yellow-100/80"
                          }`}
                          onClick={() => navigateToDispatch()}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold bg-white/80 px-2 py-0.5 rounded text-gray-800">{risk.time}</span>
                            <Badge
                              className={
                                risk.risk === "high"
                                  ? "bg-red-500 text-white hover:bg-red-600"
                                  : "bg-yellow-500 text-white hover:bg-yellow-600"
                              }
                            >
                              {risk.risk.toUpperCase()} PROBABILITY
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900 leading-snug mb-2">{risk.message}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white/50 p-2 rounded-lg">
                            <AlertTriangle className="h-3 w-3" />
                            {risk.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </TabsContent>

          {/* ALERTS TAB */}
          <TabsContent value="alerts" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Unassigned Bookings */}
              {unassignedBookings.length > 0 && (
                <Card className="border-red-300 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-900">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      Unassigned Bookings ({unassignedBookings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {unassignedBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 bg-white rounded-lg border border-red-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToBookings(`booking ${booking.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{booking.customerName}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {booking.area}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {booking.timeSlot}
                                </span>
                                <span>{booking.service}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToBookings("assign unassigned booking");
                              }}
                            >
                              Assign Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delayed Jobs */}
              {delayedJobs.length > 0 && (
                <Card className="border-orange-300 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-900">
                      <Clock className="h-5 w-5 text-orange-600" />
                      Delayed Jobs ({delayedJobs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {delayedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-4 bg-white rounded-lg border border-orange-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToBookings(`job ${job.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900">{job.customerName}</p>
                                <Badge className="bg-orange-100 text-orange-700">
                                  {job.delayMinutes} min delay
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.area}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {job.timeSlot}
                                </span>
                                <span>Staff: {job.staff}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">Reason: {job.reason}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFeatureComingSoon("Call Staff");
                                }}
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToBookings(`reassign job ${job.id}`);
                                }}
                              >
                                Reassign
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Staff Issues */}
              {staffIssues.length > 0 && (
                <Card className="border-yellow-300 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-900">
                      <Users className="h-5 w-5 text-yellow-600" />
                      Staff Issues ({staffIssues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {staffIssues.map((issue) => (
                        <div
                          key={issue.id}
                          className="p-4 bg-white rounded-lg border border-yellow-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToWorkforce(`staff ${issue.staffName}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900">{issue.staffName}</p>
                                <Badge
                                  className={
                                    issue.status === "absent"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }
                                >
                                  {issue.issue}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Scheduled: {issue.scheduledTime}
                                {issue.actualTime && ` • Actual: ${issue.actualTime}`}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeatureComingSoon("Contact Staff");
                              }}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Failures */}
              {paymentFailures.length > 0 && (
                <Card className="border-red-300 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-900">
                      <CreditCard className="h-5 w-5 text-red-600" />
                      Payment Failures ({paymentFailures.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {paymentFailures.map((payment) => (
                        <div
                          key={payment.id}
                          className="p-4 bg-white rounded-lg border border-red-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToBookings(`booking ${payment.bookingId}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{payment.customerName}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                Amount: QAR {payment.amount} • Reason: {payment.reason}
                              </p>
                              <p className="text-xs text-gray-500">Booking ID: {payment.bookingId}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFeatureComingSoon("Retry Payment");
                                }}
                              >
                                Retry Payment
                              </Button>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFeatureComingSoon("Contact Customer");
                                }}
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Customer Complaints */}
              {customerComplaints.length > 0 && (
                <Card className="border-pink-300 bg-pink-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pink-900">
                      <Star className="h-5 w-5 text-pink-600" />
                      Customer Quality Alerts ({customerComplaints.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {customerComplaints.map((complaint) => (
                        <div
                          key={complaint.id}
                          className="p-4 bg-white rounded-lg border border-pink-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToBookings("customer complaint")}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900">{complaint.customerName}</p>
                                <Badge
                                  className={
                                    complaint.priority === "high"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }
                                >
                                  {complaint.priority.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {complaint.rating && `${complaint.rating}-star rating • `}
                                {complaint.complaint}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeatureComingSoon("Follow Up with Customer");
                              }}
                            >
                              Follow Up
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Next 2 Hours Risks */}
              <Card className="border-purple-300 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Timer className="h-5 w-5 text-purple-600" />
                    Next 2 Hours Risk Preview ({next2HoursRisks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {next2HoursRisks.map((risk) => (
                      <div
                        key={risk.id}
                        className={`p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                          risk.risk === "high" ? "border-red-200" : "border-yellow-200"
                        }`}
                        onClick={() => navigateToDispatch()}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">{risk.time}</span>
                          <Badge
                            className={
                              risk.risk === "high"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {risk.risk.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-900 mb-2">{risk.message}</p>
                        <p className="text-xs text-gray-600 italic">{risk.impact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* STAFF TAB */}
          <TabsContent value="staff" className="space-y-6 mt-6">
            {/* Staff Overview Cards */}
            <div className="grid grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigateToWorkforce()}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Staff</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{staffOverview.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigateToWorkforce("on duty")}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">On Duty Today</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{staffOverview.onDuty}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigateToWorkforce("available")}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Available Now</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{staffOverview.available}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Utilization Rate</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{staffOverview.utilizationRate}%</p>
                    </div>
                    <Gauge className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Available Staff */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Available Staff ({availableStaff.length})
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => navigateToWorkforce("available")}>
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availableStaff.map((staff) => (
                        <div
                          key={staff.id}
                          className="p-4 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToWorkforce(`staff ${staff.name}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{staff.name}</p>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {staff.location}
                                </span>
                                <span>{staff.completedToday} jobs today</span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {staff.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Busy Staff */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Busy Staff ({busyStaff.length})
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => navigateToWorkforce("busy")}>
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {busyStaff.map((staff) => (
                        <div
                          key={staff.id}
                          className="p-4 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToWorkforce(`staff ${staff.name}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{staff.name}</p>
                              <p className="text-sm text-gray-600 mt-1">{staff.currentJob}</p>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {staff.area}
                                </span>
                                <span className="text-blue-600 font-medium">ETA: {staff.eta}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Absent Staff */}
                {absentStaff.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        Absent Today ({absentStaff.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {absentStaff.map((staff) => (
                          <div
                            key={staff.id}
                            className="p-4 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:shadow-md transition-all"
                            onClick={() => navigateToWorkforce(`staff ${staff.name}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{staff.name}</p>
                                <p className="text-sm text-gray-600 mt-1">{staff.reason}</p>
                              </div>
                              <Badge className="bg-red-100 text-red-700">ABSENT</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Top Performers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      Top Performers Today
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topPerformers.map((staff, index) => (
                        <div
                          key={staff.id}
                          className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToWorkforce(`staff ${staff.name}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 text-white rounded-full font-bold text-lg">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{staff.name}</p>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <div>
                                  <p className="text-gray-500">Completed</p>
                                  <p className="font-semibold text-gray-900">{staff.completedToday} jobs</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Revenue</p>
                                  <p className="font-semibold text-gray-900">QAR {staff.revenueToday}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Rating</p>
                                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {staff.rating}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">On-Time</p>
                                  <p className="font-semibold text-green-600">{staff.onTimeRate}%</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Staff Issues */}
                {staffIssuesTab.length > 0 && (
                  <Card className="border-yellow-300 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-900">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        Staff Issues ({staffIssuesTab.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {staffIssuesTab.map((issue) => (
                          <div
                            key={issue.id}
                            className="p-4 bg-white rounded-lg border border-yellow-200 cursor-pointer hover:shadow-md transition-all"
                            onClick={() => navigateToWorkforce(`staff ${issue.staffName}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{issue.staffName}</p>
                                <p className="text-sm text-gray-600 mt-1">{issue.issue} • {issue.time}</p>
                              </div>
                              <Badge
                                className={
                                  issue.severity === "high"
                                    ? "bg-red-100 text-red-700"
                                    : issue.severity === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                                }
                              >
                                {issue.severity.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* REVENUE TAB */}
          <TabsContent value="revenue" className="space-y-6 mt-6">
            {/* Revenue Overview Cards */}
            <div className="grid grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigateToBookings("today")}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">QAR {revenueOverview.today.toLocaleString()}</p>
                      <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +{revenueOverview.todayVsYesterday}% vs yesterday
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">This Week</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">QAR {revenueOverview.thisWeek.toLocaleString()}</p>
                      <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +{revenueOverview.weekOverWeek}% vs last week
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">This Month</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">QAR {revenueOverview.thisMonth.toLocaleString()}</p>
                      <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +{revenueOverview.monthOverMonth}% vs last month
                      </p>
                    </div>
                    <CalendarDays className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg Per Booking</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">QAR {revenueOverview.averagePerBooking}</p>
                      <p className="text-sm text-gray-500 mt-1">Revenue efficiency</p>
                    </div>
                    <Activity className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Revenue by Source */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Revenue by Source
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueBySource.map((source) => (
                        <div
                          key={source.source}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToBookings(`source: ${source.source}`)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-900">{source.source}</p>
                            <Badge className="bg-blue-100 text-blue-700">{source.percentage}%</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-bold text-gray-900">QAR {source.revenue.toLocaleString()}</p>
                              <p className="text-sm text-gray-600 mt-1">{source.bookings} bookings</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue by Service */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Top 5 Services by Revenue
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => handleFeatureComingSoon("View All Services")}>
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {revenueByService.map((service, index) => (
                        <div
                          key={service.service}
                          className="p-4 bg-purple-50 rounded-lg border border-purple-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToBookings(`service: ${service.service}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-gray-900">{service.service}</p>
                                <p className="text-lg font-bold text-purple-700">QAR {service.revenue.toLocaleString()}</p>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{service.bookings} bookings</span>
                                <span>Avg: QAR {service.averagePrice}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Revenue by Area */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Top 5 Areas by Revenue
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => navigateToBookings("area view")}>
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {revenueByArea.map((area, index) => (
                        <div
                          key={area.area}
                          className="p-4 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToBookings(`area: ${area.area}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-gray-900">{area.area}</p>
                                <p className="text-lg font-bold text-green-700">QAR {area.revenue.toLocaleString()}</p>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{area.bookings} bookings</span>
                                <span className={`flex items-center gap-1 font-medium ${
                                  area.growth >= 0 ? "text-green-600" : "text-red-600"
                                }`}>
                                  {area.growth >= 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                  {Math.abs(area.growth)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Status (Today)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className="text-center p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToBookings("payment: collected")}
                        >
                          <p className="text-sm text-gray-600">Collected</p>
                          <p className="text-2xl font-bold text-green-700 mt-1">QAR {paymentStatus.collected.toLocaleString()}</p>
                        </div>
                        <div
                          className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToBookings("payment: pending")}
                        >
                          <p className="text-sm text-gray-600">Pending</p>
                          <p className="text-2xl font-bold text-yellow-700 mt-1">QAR {paymentStatus.pending.toLocaleString()}</p>
                        </div>
                        <div
                          className="text-center p-3 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigateToBookings("payment: failed")}
                        >
                          <p className="text-sm text-gray-600">Failed</p>
                          <p className="text-2xl font-bold text-red-700 mt-1">QAR {paymentStatus.failed}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-900">Collection Rate</span>
                          <Badge
                            className={
                              paymentStatus.collectionRate >= 80
                                ? "bg-green-100 text-green-700"
                                : paymentStatus.collectionRate >= 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {paymentStatus.collectionRate >= 80 ? "GOOD" : paymentStatus.collectionRate >= 60 ? "FAIR" : "LOW"}
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div
                            className={`h-3 rounded-full ${
                              paymentStatus.collectionRate >= 80
                                ? "bg-green-500"
                                : paymentStatus.collectionRate >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${paymentStatus.collectionRate}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">{paymentStatus.collectionRate}% of today's revenue collected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </TabsContent>

        <TabsContent value="getting-started" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GettingStartedTab />
        </TabsContent>

        <TabsContent value="recent-updates" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <RecentUpdatesTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
