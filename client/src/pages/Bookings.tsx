import { useState } from "react";
import BookingDetail from "./BookingDetail";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Calendar as CalendarIcon,
  Filter,
  List,
  LayoutGrid,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Save,
  ArrowLeft,
  Users,
  Bell,
  Trash2,
  FileCheck,
  Calendar as CalIcon,
  KanbanSquare,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/dropdown-menu";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, parse, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

// Mock booking data with 20 entries including payment mode, assignment status, and instructions
const mockBookings = [
  {
    id: "#BK001",
    type: "One-time Booking",
    customer: "Mr. Mohammed Rashid",
    customerDetails: "3 - Musharreb, 140 - Wadi Mahorez E...",
    customerPhone: "+974 5555 1234",
    customerEmail: "mohammed.rashid@email.com",
    service: "AC Cleaning",
    serviceCategory: "Cleaning",
    duration: "1 hour",
    date: "2025-11-21",
    time: "09:00 AM",
    staff: ["NISAR KORAMMAN", "Ahmed Ali"],
    price: 250,
    status: "completed",
    paymentStatus: "paid",
    paymentMode: "bank",
    assignmentStatus: "assigned",
    hasInstructions: true,
    instructions: "Customer requested early morning service",
    notes: "Customer requested early morning service",
    history: [
      { date: "2025-11-21 09:00", action: "Booking created", user: "System" },
      { date: "2025-11-21 09:15", action: "Staff assigned", user: "Admin" },
      { date: "2025-11-21 11:00", action: "Service completed", user: "NISAR KORAMMAN" },
      { date: "2025-11-21 11:05", action: "Payment received", user: "System" },
    ],
  },
  {
    id: "#BK002",
    type: "One-time Booking",
    customer: "Ms. Fatima Al-Thani",
    customerDetails: "Apartment 302, Lusail City",
    customerPhone: "+974 5555 2345",
    customerEmail: "fatima.thani@email.com",
    service: "Deep Cleaning",
    serviceCategory: "Cleaning",
    duration: "2 hours",
    date: "2025-11-22",
    time: "10:00 AM",
    staff: ["Ahmed Al-Mansoori"],
    price: 450,
    status: "confirmed",
    paymentStatus: "unpaid",
    paymentMode: "cash",
    assignmentStatus: "assigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK003",
    type: "One-time Booking",
    customer: "Mr. Khalid Ibrahim",
    customerDetails: "Villa 78, Al Wakrah",
    customerPhone: "+974 5555 3456",
    customerEmail: "khalid.ibrahim@email.com",
    service: "Plumbing Repair",
    serviceCategory: "Plumbing",
    duration: "1.5 hours",
    date: "2025-11-23",
    time: "02:00 PM",
    staff: ["Ali Ahmed", "Omar Hassan"],
    price: 350,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMode: "bank",
    assignmentStatus: "assigned",
    hasInstructions: true,
    instructions: "Bring extra tools",
    notes: "",
    history: [],
  },
  {
    id: "#BK004",
    type: "Recurring Booking",
    customer: "Mrs. Mariam Hassan",
    customerDetails: "Tower 5, The Pearl",
    customerPhone: "+974 5555 4567",
    customerEmail: "mariam.hassan@email.com",
    service: "Electrical Work",
    serviceCategory: "Electrical",
    duration: "2 hours",
    date: "2025-11-24",
    time: "09:00 AM",
    staff: ["Omar Saeed"],
    price: 500,
    status: "in-progress",
    paymentStatus: "paid",
    paymentMode: "bank",
    assignmentStatus: "assigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK005",
    type: "One-time Booking",
    customer: "Mr. Abdullah Rashid",
    customerDetails: "Villa 23, Al Rayyan",
    customerPhone: "+974 5555 5678",
    customerEmail: "abdullah.rashid@email.com",
    service: "Painting Service",
    serviceCategory: "Painting",
    duration: "4 hours",
    date: "2025-11-25",
    time: "08:00 AM",
    staff: ["Khalid Ibrahim", "Youssef Ahmed"],
    price: 800,
    status: "cancelled",
    paymentStatus: "unpaid",
    paymentMode: "cash",
    assignmentStatus: "unassigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK006",
    type: "One-time Booking",
    customer: "Dr. Sara Al-Kuwari",
    customerDetails: "Medical Center, West Bay",
    customerPhone: "+974 5555 6789",
    customerEmail: "sara.kuwari@email.com",
    service: "Office Cleaning",
    serviceCategory: "Cleaning",
    duration: "3 hours",
    date: "2025-11-26",
    time: "06:00 PM",
    staff: ["Fatima Nasser"],
    price: 600,
    status: "completed",
    paymentStatus: "paid",
    paymentMode: "bank",
    assignmentStatus: "assigned",
    hasInstructions: true,
    instructions: "Use eco-friendly products",
    notes: "",
    history: [],
  },
  {
    id: "#BK007",
    type: "Recurring Booking",
    customer: "Mr. Hassan Al-Thani",
    customerDetails: "Compound Villa, Al Waab",
    customerPhone: "+974 5555 7890",
    customerEmail: "hassan.thani@email.com",
    service: "Garden Maintenance",
    serviceCategory: "Gardening",
    duration: "2 hours",
    date: "2025-11-27",
    time: "07:00 AM",
    staff: ["Ibrahim Youssef", "Mohammed Saleh"],
    price: 400,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMode: "cash",
    assignmentStatus: "assigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK008",
    type: "One-time Booking",
    customer: "Ms. Noora Al-Ansari",
    customerDetails: "Apartment 15, Doha Festival City",
    customerPhone: "+974 5555 8901",
    customerEmail: "noora.ansari@email.com",
    service: "Carpet Cleaning",
    serviceCategory: "Cleaning",
    duration: "1.5 hours",
    date: "2025-11-28",
    time: "11:00 AM",
    staff: ["Ali Mohammed"],
    price: 300,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMode: "bank",
    assignmentStatus: "assigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK009",
    type: "One-time Booking",
    customer: "Mr. Jassim Al-Kuwari",
    customerDetails: "Villa 45, Al Dafna",
    customerPhone: "+974 5555 9012",
    customerEmail: "jassim.kuwari@email.com",
    service: "AC Installation",
    serviceCategory: "Installation",
    duration: "3 hours",
    date: "2025-11-29",
    time: "01:00 PM",
    staff: ["Tariq Hassan", "Saeed Ali"],
    price: 1200,
    status: "in-progress",
    paymentStatus: "paid",
    paymentMode: "cash",
    assignmentStatus: "assigned",
    hasInstructions: true,
    instructions: "Need ladder access",
    notes: "",
    history: [],
  },
  {
    id: "#BK010",
    type: "One-time Booking",
    customer: "Mrs. Aisha Mohammed",
    customerDetails: "Apartment 8, Al Sadd",
    customerPhone: "+974 5555 0123",
    customerEmail: "aisha.mohammed@email.com",
    service: "Pest Control",
    serviceCategory: "Pest Control",
    duration: "2 hours",
    date: "2025-11-30",
    time: "03:00 PM",
    staff: ["Ahmed Khalil"],
    price: 350,
    status: "confirmed",
    paymentStatus: "unpaid",
    paymentMode: "bank",
    assignmentStatus: "unassigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK011",
    type: "Recurring Booking",
    customer: "Mr. Hamad Al-Attiyah",
    customerDetails: "Villa 12, Al Khor",
    customerPhone: "+974 5555 1235",
    customerEmail: "hamad.attiyah@email.com",
    service: "Pool Maintenance",
    serviceCategory: "Maintenance",
    duration: "2.5 hours",
    date: "2025-12-01",
    time: "08:30 AM",
    staff: ["Yousef Ali", "Nasser Ahmed"],
    price: 550,
    status: "pending",
    paymentStatus: "paid",
    paymentMode: "bank",
    assignmentStatus: "assigned",
    hasInstructions: true,
    instructions: "Check pool filter",
    notes: "",
    history: [],
  },
  {
    id: "#BK012",
    type: "One-time Booking",
    customer: "Ms. Moza Al-Naimi",
    customerDetails: "Villa 88, Al Gharrafa",
    customerPhone: "+974 5555 2346",
    customerEmail: "moza.naimi@email.com",
    service: "Kitchen Deep Clean",
    serviceCategory: "Cleaning",
    duration: "2.5 hours",
    date: "2025-12-02",
    time: "09:30 AM",
    staff: ["Layla Hassan", "Sara Ahmed"],
    price: 550,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMode: "cash",
    assignmentStatus: "assigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK013",
    type: "One-time Booking",
    customer: "Dr. Khalifa Al-Mannai",
    customerDetails: "Clinic, Al Mirqab",
    customerPhone: "+974 5555 3457",
    customerEmail: "khalifa.mannai@email.com",
    service: "Window Cleaning",
    serviceCategory: "Cleaning",
    duration: "1.5 hours",
    date: "2025-12-03",
    time: "07:00 AM",
    staff: ["Hassan Ali"],
    price: 280,
    status: "completed",
    paymentStatus: "paid",
    paymentMode: "bank",
    assignmentStatus: "assigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK014",
    type: "One-time Booking",
    customer: "Mrs. Shaikha Al-Thani",
    customerDetails: "Tower 3, Lusail Marina",
    customerPhone: "+974 5555 4568",
    customerEmail: "shaikha.thani@email.com",
    service: "Sofa Cleaning",
    serviceCategory: "Cleaning",
    duration: "2 hours",
    date: "2025-12-04",
    time: "10:00 AM",
    staff: ["Mohammed Tariq"],
    price: 400,
    status: "in-progress",
    paymentStatus: "unpaid",
    paymentMode: "cash",
    assignmentStatus: "unassigned",
    hasInstructions: true,
    instructions: "Fabric sofa - gentle cleaning",
    notes: "",
    history: [],
  },
  {
    id: "#BK015",
    type: "Recurring Booking",
    customer: "Mrs. Hessa Al-Mannai",
    customerDetails: "Villa 12, West Bay Lagoon",
    customerPhone: "+974 5555 5679",
    customerEmail: "hessa.mannai@email.com",
    service: "Home Cleaning",
    serviceCategory: "Cleaning",
    duration: "3 hours",
    date: "2025-12-05",
    time: "08:00 AM",
    staff: ["Amina Youssef", "Maryam Ali"],
    price: 650,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMode: "bank",
    assignmentStatus: "assigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK016",
    type: "One-time Booking",
    customer: "Mr. Nasser Al-Kaabi",
    customerDetails: "Office Building, C-Ring Road",
    customerPhone: "+974 5555 6780",
    customerEmail: "nasser.kaabi@email.com",
    service: "IT Support",
    serviceCategory: "IT Services",
    duration: "2 hours",
    date: "2025-12-06",
    time: "02:00 PM",
    staff: ["Fahad Ahmed"],
    price: 450,
    status: "cancelled",
    paymentStatus: "unpaid",
    paymentMode: "bank",
    assignmentStatus: "unassigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK017",
    type: "One-time Booking",
    customer: "Ms. Latifa Al-Misnad",
    customerDetails: "Villa 67, Al Duhail",
    customerPhone: "+974 5555 7891",
    customerEmail: "latifa.misnad@email.com",
    service: "Maid Service",
    serviceCategory: "Cleaning",
    duration: "4 hours",
    date: "2025-12-07",
    time: "09:00 AM",
    staff: ["Zainab Ahmed", "Noura Hassan"],
    price: 700,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMode: "cash",
    assignmentStatus: "assigned",
    hasInstructions: true,
    instructions: "Deep clean all rooms",
    notes: "",
    history: [],
  },
  {
    id: "#BK018",
    type: "One-time Booking",
    customer: "Mr. Saeed Al-Mohannadi",
    customerDetails: "Apartment 22, Al Mansoura",
    customerPhone: "+974 5555 8902",
    customerEmail: "saeed.mohannadi@email.com",
    service: "Appliance Repair",
    serviceCategory: "Repair",
    duration: "1.5 hours",
    date: "2025-12-08",
    time: "11:30 AM",
    staff: ["Khalid Youssef"],
    price: 320,
    status: "completed",
    paymentStatus: "paid",
    paymentMode: "bank",
    assignmentStatus: "assigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK019",
    type: "Recurring Booking",
    customer: "Mrs. Latifa Al-Misnad",
    customerDetails: "Villa 87, Al Duhail",
    customerPhone: "+974 5555 9013",
    customerEmail: "latifa.misnad2@email.com",
    service: "Maid Service",
    serviceCategory: "Cleaning",
    duration: "3 hours",
    date: "2025-12-09",
    time: "08:00 AM",
    staff: ["Zainab Ahmed", "Noura Hassan"],
    price: 550,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMode: "cash",
    assignmentStatus: "assigned",
    hasInstructions: false,
    notes: "",
    history: [],
  },
  {
    id: "#BK020",
    type: "One-time Booking",
    customer: "Mr. Rashid Al-Nasr",
    customerDetails: "Villa 34, Al Thumama",
    customerPhone: "+974 5555 0124",
    customerEmail: "rashid.nasr@email.com",
    service: "Renovation Work",
    serviceCategory: "Renovation",
    duration: "5 hours",
    date: "2025-12-10",
    time: "07:30 AM",
    staff: ["Ahmed Hassan", "Omar Khalil", "Saeed Tariq"],
    price: 1500,
    status: "in-progress",
    paymentStatus: "paid",
    paymentMode: "bank",
    assignmentStatus: "assigned",
    hasInstructions: true,
    instructions: "Bring renovation materials",
    notes: "",
    history: [],
  },
];

// Generate time slots with 15-minute intervals
const generateTimeSlots = () => {
  const slots = ["All Times"];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hourStr = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const minuteStr = minute.toString().padStart(2, "0");
      slots.push(`${hourStr}:${minuteStr} ${ampm}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export default function Bookings() {
  const [viewMode, setViewMode] = useState<"list" | "cards" | "calendar" | "kanban">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState("All Times");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPayment, setSelectedPayment] = useState("All Payments");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("All Payment Modes");
  const [selectedAssignment, setSelectedAssignment] = useState("All Assignments");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

  // Get unique categories
  const categories = ["All Categories", ...Array.from(new Set(mockBookings.map((b) => b.serviceCategory)))];

  // Status counts
  const statusCounts = {
    total: mockBookings.length,
    pending: mockBookings.filter((b) => b.status === "pending").length,
    confirmed: mockBookings.filter((b) => b.status === "confirmed").length,
    completed: mockBookings.filter((b) => b.status === "completed").length,
    inProgress: mockBookings.filter((b) => b.status === "in-progress").length,
    cancelled: mockBookings.filter((b) => b.status === "cancelled").length,
  };

  // Filter bookings
  const filteredBookings = mockBookings.filter((booking) => {
    // Search filter
    if (searchQuery && !JSON.stringify(booking).toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (selectedStatus && booking.status !== selectedStatus) {
      return false;
    }

    // Time filter
    if (selectedTime !== "All Times" && booking.time !== selectedTime) {
      return false;
    }

    // Category filter
    if (selectedCategory !== "All Categories" && booking.serviceCategory !== selectedCategory) {
      return false;
    }

    // Payment status filter
    if (selectedPayment !== "All Payments") {
      if (selectedPayment === "Paid" && booking.paymentStatus !== "paid") return false;
      if (selectedPayment === "Unpaid" && booking.paymentStatus !== "unpaid") return false;
    }

    // Payment mode filter
    if (selectedPaymentMode !== "All Payment Modes") {
      if (selectedPaymentMode === "Bank" && booking.paymentMode !== "bank") return false;
      if (selectedPaymentMode === "Cash" && booking.paymentMode !== "cash") return false;
    }

    // Assignment filter
    if (selectedAssignment !== "All Assignments") {
      if (selectedAssignment === "Assigned" && booking.assignmentStatus !== "assigned") return false;
      if (selectedAssignment === "Unassigned" && booking.assignmentStatus !== "unassigned") return false;
    }

    // Date range filter
    if (dateRange?.from) {
      const bookingDate = new Date(booking.date);
      if (dateRange.to) {
        if (bookingDate < dateRange.from || bookingDate > dateRange.to) return false;
      } else {
        if (!isSameDay(bookingDate, dateRange.from)) return false;
      }
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Check if any filters are active
  const hasActiveFilters =
    selectedStatus ||
    selectedTime !== "All Times" ||
    selectedCategory !== "All Categories" ||
    selectedPayment !== "All Payments" ||
    selectedPaymentMode !== "All Payment Modes" ||
    selectedAssignment !== "All Assignments" ||
    dateRange?.from;

  const clearFilters = () => {
    setSelectedStatus(null);
    setSelectedTime("All Times");
    setSelectedCategory("All Categories");
    setSelectedPayment("All Payments");
    setSelectedPaymentMode("All Payment Modes");
    setSelectedAssignment("All Assignments");
    setDateRange(undefined);
    setSearchQuery("");
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === paginatedBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(paginatedBookings.map((b) => b.id));
    }
  };

  const handleSelectBooking = (id: string) => {
    if (selectedBookings.includes(id)) {
      setSelectedBookings(selectedBookings.filter((bid) => bid !== id));
    } else {
      setSelectedBookings([...selectedBookings, id]);
    }
  };

  const handleBulkAction = (action: string) => {
    toast.success(`${action} applied to ${selectedBookings.length} booking(s)`);
    setSelectedBookings([]);
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting ${filteredBookings.length} bookings as ${format.toUpperCase()}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in-progress":
        return <Loader2 className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "confirmed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "in-progress":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "in-progress":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Calendar view helpers
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
  });

  const getBookingsForDay = (day: Date) => {
    return filteredBookings.filter((booking) => isSameDay(new Date(booking.date), day));
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
  };

  // Booking detail view
  const selectedBooking = selectedBookingId ? mockBookings.find((b) => b.id === selectedBookingId) : null;

  if (selectedBooking) {
    return (
      <BookingDetail booking={selectedBooking} onBack={() => setSelectedBookingId(null)} />
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Booking Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and track all your service bookings</p>
          </div>
          <Button>
            <CalendarIcon className="h-4 w-4 mr-2" />+ New Booking
          </Button>
        </div>

        {/* Status Cards - Reduced padding and height */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md w-64 h-[70px] ${
              selectedStatus === null ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedStatus(null)}
          >
            <CardContent className="p-4 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex flex-col justify-center">
                  <p className="text-base font-medium text-muted-foreground" style={{width: '37px', height: '20px'}}>Total</p>
                  <p className="text-[25px] font-bold leading-none mt-1" style={{fontSize: '20px'}}>{statusCounts.total}</p>
                </div>
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md w-64 h-[70px] ${
              selectedStatus === "pending" ? "ring-2 ring-yellow-500" : ""
            }`}
            onClick={() => setSelectedStatus("pending")}
          >
            <CardContent className="p-4 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex flex-col justify-center">
                  <p className="text-base font-medium text-muted-foreground">Pending</p>
                  <p className="text-[25px] font-bold leading-none mt-1" style={{fontSize: '20px'}}>{statusCounts.pending}</p>
                </div>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md w-64 h-[70px] ${
              selectedStatus === "confirmed" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedStatus("confirmed")}
          >
            <CardContent className="p-4 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex flex-col justify-center">
                  <p className="text-base font-medium text-muted-foreground">Confirmed</p>
                  <p className="text-[25px] font-bold leading-none mt-1" style={{fontSize: '20px'}}>{statusCounts.confirmed}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md w-64 h-[70px] ${
              selectedStatus === "completed" ? "ring-2 ring-green-500" : ""
            }`}
            onClick={() => setSelectedStatus("completed")}
          >
            <CardContent className="p-4 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex flex-col justify-center">
                  <p className="text-base font-medium text-muted-foreground">Completed</p>
                  <p className="text-[25px] font-bold leading-none mt-1" style={{fontSize: '20px'}}>{statusCounts.completed}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md w-64 h-[70px] ${
              selectedStatus === "in-progress" ? "ring-2 ring-gray-500" : ""
            }`}
            onClick={() => setSelectedStatus("in-progress")}
          >
            <CardContent className="p-4 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex flex-col justify-center">
                  <p className="text-base font-medium text-muted-foreground">In Progress</p>
                  <p className="text-[25px] font-bold leading-none mt-1" style={{fontSize: '20px'}}>{statusCounts.inProgress}</p>
                </div>
                <Loader2 className="h-5 w-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md w-64 h-[70px] ${
              selectedStatus === "cancelled" ? "ring-2 ring-red-500" : ""
            }`}
            onClick={() => setSelectedStatus("cancelled")}
          >
            <CardContent className="p-4 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex flex-col justify-center">
                  <p className="text-base font-medium text-muted-foreground">Cancelled</p>
                  <p className="text-[25px] font-bold leading-none mt-1" style={{fontSize: '20px'}}>{statusCounts.cancelled}</p>
                </div>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions - M        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  "Select Dates"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>

          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPayment} onValueChange={setSelectedPayment}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Payments">All Payments</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPaymentMode} onValueChange={setSelectedPaymentMode}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Payment Modes">All Payment Modes</SelectItem>
              <SelectItem value="Bank">Bank</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Assignments">All Assignments</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="Unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}

          {selectedBookings.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Bulk Actions ({selectedBookings.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction("Assign Staff")}>
                  <Users className="h-4 w-4 mr-2" />
                  Assign Staff
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("Change Status")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Change Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("Send Notification")}>
                  <Bell className="h-4 w-4 mr-2" />
                  Send Notification
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("Delete")} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-2 ml-auto">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("calendar")}
            >
              <CalIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("kanban")}
            >
              <KanbanSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox checked={selectedBookings.length === paginatedBookings.length} onCheckedChange={handleSelectAll} />
                      </TableHead>
                      <TableHead>BOOKING</TableHead>
                      <TableHead>CUSTOMER</TableHead>
                      <TableHead>SERVICE</TableHead>
                      <TableHead>DATE & TIME</TableHead>
                      <TableHead>STAFF</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead>PAYMENT</TableHead>
                      <TableHead>MODE</TableHead>
                      <TableHead>ASSIGNMENT</TableHead>
                      <TableHead className="text-right" style={{paddingRight: '26px'}}>PRICE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBookings.map((booking) => (
                      <TableRow
                        key={booking.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedBookingId(booking.id)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedBookings.includes(booking.id)}
                            onCheckedChange={() => handleSelectBooking(booking.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{booking.id}</p>
                            <p className="text-xs text-muted-foreground">{booking.type}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.customer}</p>
                            <p className="text-xs text-muted-foreground">{booking.customerDetails}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.service}</p>
                            <p className="text-xs text-muted-foreground">{booking.duration}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{format(new Date(booking.date), "EEE, dd-MMM-yyyy")}</p>
                            <p className="text-xs text-muted-foreground">{booking.time}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {booking.staff.map((s, i) => (
                              <p key={i} className={i > 0 ? "text-muted-foreground" : "font-medium"}>
                                {s}
                              </p>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              booking.paymentStatus === "paid"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-orange-100 text-orange-700 border-orange-300"
                            }
                          >
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                            {booking.paymentMode.charAt(0).toUpperCase() + booking.paymentMode.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              booking.assignmentStatus === "assigned"
                                ? "bg-blue-100 text-blue-700 border-blue-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }
                          >
                            {booking.assignmentStatus.charAt(0).toUpperCase() + booking.assignmentStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">QAR {booking.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of{" "}
                {filteredBookings.length} results
              </p>
              <div className="flex items-center gap-2">
                <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  {currentPage}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedBookingId(booking.id)}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-lg">{booking.customer}</p>
                        <p className="text-sm text-muted-foreground">{booking.id}</p>
                      </div>
                      <Badge className={getStatusBadgeColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace("-", " ")}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{booking.service}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(booking.date), "EEE, dd-MMM-yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{booking.staff.join(", ")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex gap-2">
                        <Badge
                          className={
                            booking.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        >
                          {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-700">
                          {booking.paymentMode.charAt(0).toUpperCase() + booking.paymentMode.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold">QAR {booking.price.toFixed(2)}</p>
                    </div>

                    {booking.hasInstructions && (
                      <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        <FileCheck className="h-3 w-3" />
                        <span>Has special instructions</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of{" "}
                {filteredBookings.length} results
              </p>
              <div className="flex items-center gap-2">
                <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  {currentPage}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    Calendar View - Week of {format(currentWeekStart, "MMMM dd")}-{format(endOfWeek(currentWeekStart, { weekStartsOn: 0 }), "dd, yyyy")}
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleToday}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNextWeek}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-2">
                  {/* Time column header */}
                  <div className="font-semibold text-sm text-muted-foreground">Time</div>
                  {/* Day headers */}
                  {weekDays.map((day) => (
                    <div key={day.toISOString()} className="text-center">
                      <p className="text-sm font-semibold">{format(day, "EEE")}</p>
                      <p className="text-2xl font-bold">{format(day, "dd")}</p>
                    </div>
                  ))}

                  {/* Time slots */}
                  {Array.from({ length: 18 }, (_, i) => i + 6).map((hour) => (
                    <>
                      <div key={`time-${hour}`} className="text-sm text-muted-foreground py-4">
                        {hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:00 {hour >= 12 ? "PM" : "AM"}
                      </div>
                      {weekDays.map((day) => {
                        const dayBookings = getBookingsForDay(day).filter((b) => {
                          const bookingHour = parseInt(b.time.split(":")[0]);
                          const isPM = b.time.includes("PM");
                          const hour24 = isPM && bookingHour !== 12 ? bookingHour + 12 : !isPM && bookingHour === 12 ? 0 : bookingHour;
                          return hour24 === hour;
                        });

                        return (
                          <div key={`${day.toISOString()}-${hour}`} className="border rounded p-1 min-h-[80px] bg-gray-50">
                            {dayBookings.map((booking) => (
                              <div
                                key={booking.id}
                                className={`text-xs p-2 rounded mb-1 cursor-pointer hover:shadow-md transition-shadow ${
                                  booking.status === "pending"
                                    ? "bg-yellow-100 border-yellow-300"
                                    : booking.status === "confirmed"
                                    ? "bg-blue-100 border-blue-300"
                                    : booking.status === "completed"
                                    ? "bg-green-100 border-green-300"
                                    : booking.status === "in-progress"
                                    ? "bg-gray-100 border-gray-300"
                                    : "bg-red-100 border-red-300"
                                } border`}
                                onClick={() => setSelectedBookingId(booking.id)}
                              >
                                <p className="font-semibold truncate">{booking.customer}</p>
                                <p className="truncate">{booking.service}</p>
                                <p className="text-muted-foreground">{booking.time}</p>
                                <p className="text-muted-foreground truncate text-[10px]">{booking.staff.join(", ")}</p>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Kanban View */}
        {viewMode === "kanban" && (
          <div className="h-[calc(100vh-220px)] overflow-x-auto pb-4">
            <div className="flex gap-4 h-full min-w-[1500px]">
              {[
                { id: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                { id: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200" },
                { id: "in-progress", label: "In Progress", color: "bg-gray-100 text-gray-700 border-gray-200" },
                { id: "completed", label: "Completed", color: "bg-green-100 text-green-700 border-green-200" },
                { id: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200" },
              ].map((column) => {
                const columnBookings = filteredBookings.filter((b) => b.status === column.id);
                return (
                  <div key={column.id} className="flex-1 min-w-[300px] flex flex-col bg-muted/30 rounded-lg border border-dashed p-3">
                    <div className={`p-3 rounded-lg border mb-4 font-semibold flex items-center justify-between ${column.color}`}>
                      <span>{column.label}</span>
                      <Badge variant="outline" className="bg-white/50">{columnBookings.length}</Badge>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {columnBookings.map((booking) => (
                         <Card 
                           key={booking.id} 
                           className="cursor-pointer hover:shadow-md transition-all border-l-4"
                           style={{ borderLeftColor: column.id === 'completed' ? '#22c55e' : column.id === 'cancelled' ? '#ef4444' : column.id === 'pending' ? '#eab308' : '#3b82f6' }}
                           onClick={() => setSelectedBookingId(booking.id)}
                         >
                           <CardContent className="p-3">
                             <div className="flex justify-between items-start mb-2">
                               <span className="font-bold text-sm truncate w-32">{booking.customer}</span>
                               <span className="text-xs font-mono text-muted-foreground">{booking.id}</span>
                             </div>
                             
                             <div className="text-xs space-y-1.5 text-muted-foreground">
                               <div className="flex items-center gap-2">
                                  <FileText className="h-3 w-3" />
                                  <span className="truncate">{booking.service}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  <span>{format(new Date(booking.date), "MMM dd")} • {booking.time}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <Users className="h-3 w-3" />
                                  <span className="truncate">{booking.staff.join(", ")}</span>
                               </div>
                             </div>
                             
                             <div className="mt-3 flex items-center justify-between">
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                  {booking.paymentStatus}
                                </Badge>
                                <span className="font-bold text-sm">QAR {booking.price}</span>
                             </div>
                           </CardContent>
                         </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
