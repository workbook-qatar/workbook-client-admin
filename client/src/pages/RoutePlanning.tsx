import { useState } from "react";
import { Calendar, Users, AlertCircle, CheckCircle, Car, Briefcase, Clock, MapPin, User, Filter, TrendingUp, X, Phone, Mail, MapPinned, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data for bookings with status
const initialBookings = [
  {
    id: "#BK001",
    customer: "Mr. Mohammed Rashid",
    phone: "+974 5555 1234",
    email: "mohammed.rashid@email.com",
    service: "AC Cleaning",
    address: "3 - Musharreb, 140 - Wadi Mahorez East",
    shortAddress: "Musharreb",
    date: "2025-11-27",
    time: "09:00 AM",
    duration: "1 hour",
    bookingStatus: "ongoing" as const,
    assignedDriver: "driver1",
    staffAssigned: "NISAR KORAMMAN",
    priority: "normal" as const,
    distance: "12.5 km",
    lat: 25.2854,
    lng: 51.5310,
  },
  {
    id: "#BK003",
    customer: "Mr. Khalid Ibrahim",
    phone: "+974 5555 5678",
    email: "khalid.ibrahim@email.com",
    service: "Plumbing Repair",
    address: "Villa 78, Al Wakrah",
    shortAddress: "Al Wakrah",
    date: "2025-11-27",
    time: "02:00 PM",
    duration: "1.5 hours",
    bookingStatus: "pending" as const,
    assignedDriver: "driver3",
    staffAssigned: "Ahmed Ali",
    priority: "high" as const,
    distance: "18.3 km",
    lat: 25.1714,
    lng: 51.6053,
  },
  {
    id: "#BK009",
    customer: "Mr. Jassim Al-Kuwari",
    phone: "+974 5555 9012",
    email: "jassim.alkuwari@email.com",
    service: "AC Installation",
    address: "Villa 45, Al Dafna",
    shortAddress: "Al Dafna",
    date: "2025-11-27",
    time: "01:00 PM",
    duration: "3 hours",
    bookingStatus: "pending" as const,
    assignedDriver: null,
    staffAssigned: "Tariq Hassan",
    priority: "normal" as const,
    distance: "8.7 km",
    lat: 25.3180,
    lng: 51.5310,
  },
  {
    id: "#BK012",
    customer: "Mrs. Fatima Ahmed",
    phone: "+974 5555 3456",
    email: "fatima.ahmed@email.com",
    service: "Deep Cleaning",
    address: "Apartment 204, The Pearl",
    shortAddress: "The Pearl",
    date: "2025-11-27",
    time: "10:30 AM",
    duration: "2 hours",
    bookingStatus: "completed" as const,
    assignedDriver: "driver2",
    staffAssigned: "Ali Hassan",
    priority: "normal" as const,
    distance: "15.2 km",
    lat: 25.3700,
    lng: 51.5400,
  },
  {
    id: "#BK015",
    customer: "Mr. Abdullah Saeed",
    phone: "+974 5555 7890",
    email: "abdullah.saeed@email.com",
    service: "Electrical Work",
    address: "Building 32, West Bay",
    shortAddress: "West Bay",
    date: "2025-11-27",
    time: "03:30 PM",
    duration: "1 hour",
    bookingStatus: "pending" as const,
    assignedDriver: null,
    staffAssigned: "Mohammed Youssef",
    priority: "high" as const,
    distance: "22.1 km",
    lat: 25.3210,
    lng: 51.5280,
  },
  {
    id: "#BK020",
    customer: "Mr. Hassan Ali",
    phone: "+974 5555 2468",
    email: "hassan.ali@email.com",
    service: "AC Repair",
    address: "Villa 12, Lusail",
    shortAddress: "Lusail",
    date: "2025-11-27",
    time: "11:00 AM",
    duration: "1.5 hours",
    bookingStatus: "pending" as const,
    assignedDriver: null,
    staffAssigned: "Omar Khalid",
    priority: "normal" as const,
    distance: "25.3 km",
    lat: 25.4382,
    lng: 51.4949,
  },
  {
    id: "#BK007",
    customer: "Mr. Saeed Ahmed",
    phone: "+974 5555 3333",
    email: "saeed.ahmed@email.com",
    service: "AC Maintenance",
    address: "Villa 22, Al Rayyan",
    shortAddress: "Al Rayyan",
    date: "2025-11-27",
    time: "08:00 AM",
    duration: "1 hour",
    bookingStatus: "completed" as const,
    assignedDriver: "driver1",
    staffAssigned: "NISAR KORAMMAN",
    priority: "normal" as const,
    distance: "10.2 km",
    lat: 25.2522,
    lng: 51.4393,
  },
  {
    id: "#BK018",
    customer: "Mrs. Aisha Mohammed",
    phone: "+974 5555 4444",
    email: "aisha.mohammed@email.com",
    service: "Painting",
    address: "Apartment 15, Al Sadd",
    shortAddress: "Al Sadd",
    date: "2025-11-27",
    time: "09:30 AM",
    duration: "2 hours",
    bookingStatus: "completed" as const,
    assignedDriver: "driver3",
    staffAssigned: "Ahmed Ali",
    priority: "normal" as const,
    distance: "14.8 km",
    lat: 25.2760,
    lng: 51.5260,
  },
];

const drivers = [
  {
    id: "driver1",
    name: "Ahmed Al-Mansoori",
    vehicle: "Toyota Hiace",
    capacity: "7 Seats",
    status: "busy" as const,
    phone: "+974 3333 1111",
    rating: 4.8,
    completedToday: 2,
    totalKm: 45.3,
    currentLat: 25.2854,
    currentLng: 51.5310,
  },
  {
    id: "driver2",
    name: "Khalid Ibrahim",
    vehicle: "Ford Transit",
    capacity: "12 Seats",
    status: "available" as const,
    phone: "+974 3333 2222",
    rating: 4.9,
    completedToday: 1,
    totalKm: 28.7,
    currentLat: 25.3700,
    currentLng: 51.5400,
  },
  {
    id: "driver3",
    name: "Mohammed Hassan",
    vehicle: "Toyota Hiace",
    capacity: "7 Seats",
    status: "available" as const,
    phone: "+974 3333 3333",
    rating: 4.7,
    completedToday: 3,
    totalKm: 62.1,
    currentLat: 25.1714,
    currentLng: 51.6053,
  },
  {
    id: "driver4",
    name: "Ali Rashid",
    vehicle: "Nissan Urvan",
    capacity: "14 Seats",
    status: "available" as const,
    phone: "+974 3333 4444",
    rating: 4.6,
    completedToday: 2,
    totalKm: 38.9,
    currentLat: 25.2522,
    currentLng: 51.4393,
  },
];

export default function RoutePlanning() {
  const [bookings, setBookings] = useState(initialBookings);
  const [dateFilter, setDateFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>(drivers.map(d => d.id));
  const [selectedBooking, setSelectedBooking] = useState<typeof initialBookings[0] | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(true);
  const [isDriverFilterOpen, setIsDriverFilterOpen] = useState(false);

  // Calculate statistics
  const stats = {
    total: bookings.length,
    needsDriver: bookings.filter(b => !b.assignedDriver).length,
    assigned: bookings.filter(b => b.assignedDriver && b.bookingStatus !== "completed" && b.bookingStatus !== "ongoing").length,
    inTransit: bookings.filter(b => b.bookingStatus === "ongoing").length,
    completed: bookings.filter(b => b.bookingStatus === "completed").length,
    availableDrivers: drivers.filter(d => d.status === "available").length,
  };

  // Get bookings for a specific driver or unassigned
  const getBookingsForDriver = (driverId: string | null) => {
    let filtered = bookings.filter(b => b.assignedDriver === driverId);
    
    // Apply driver filter
    if (driverId && !selectedDrivers.includes(driverId)) {
      return [];
    }
    
    // Sort: pending/ongoing first, completed last
    filtered.sort((a, b) => {
      if (a.bookingStatus === "completed" && b.bookingStatus !== "completed") return 1;
      if (a.bookingStatus !== "completed" && b.bookingStatus === "completed") return -1;
      return 0;
    });
    
    return filtered;
  };

  // Apply filters
  const applyFilters = (bookingsList: typeof initialBookings) => {
    let filtered = [...bookingsList];

    if (statusFilter === "unassigned") {
      filtered = filtered.filter(b => !b.assignedDriver);
    } else if (statusFilter === "assigned") {
      filtered = filtered.filter(b => b.assignedDriver !== null && b.bookingStatus !== "completed" && b.bookingStatus !== "ongoing");
    } else if (statusFilter === "intransit") {
      filtered = filtered.filter(b => b.bookingStatus === "ongoing");
    } else if (statusFilter === "completed") {
      filtered = filtered.filter(b => b.bookingStatus === "completed");
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(b => b.priority === priorityFilter);
    }

    if (timeFilter === "morning") {
      filtered = filtered.filter(b => {
        const hour = parseInt(b.time.split(":")[0]);
        return hour >= 6 && hour < 12;
      });
    } else if (timeFilter === "afternoon") {
      filtered = filtered.filter(b => {
        const hour = parseInt(b.time.split(":")[0]);
        return hour >= 12 && hour < 18;
      });
    } else if (timeFilter === "evening") {
      filtered = filtered.filter(b => {
        const hour = parseInt(b.time.split(":")[0]);
        return hour >= 18 || hour < 6;
      });
    }

    return filtered;
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, bookingId: string) => {
    e.dataTransfer.setData("bookingId", bookingId);
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drop on driver column
  const handleDropOnDriver = (e: React.DragEvent, driverId: string | null) => {
    e.preventDefault();
    const bookingId = e.dataTransfer.getData("bookingId");
    
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        if (driverId === null) {
          toast.info(`Booking ${bookingId} moved to unassigned`);
          return {
            ...booking,
            assignedDriver: null,
            bookingStatus: "pending" as any,
          };
        } else {
          const driver = drivers.find(d => d.id === driverId);
          toast.success(`Booking ${bookingId} assigned to ${driver?.name}`);
          return {
            ...booking,
            assignedDriver: driverId,
            bookingStatus: booking.bookingStatus === "completed" ? "completed" : "pending" as any,
          };
        }
      }
      return booking;
    }));
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle stat card click
  const handleStatClick = (filterType: string) => {
    if (filterType === "needsDriver") {
      setStatusFilter("unassigned");
      toast.info("Showing unassigned bookings");
    } else if (filterType === "assigned") {
      setStatusFilter("assigned");
      toast.info("Showing assigned bookings");
    } else if (filterType === "intransit") {
      setStatusFilter("intransit");
      toast.info("Showing in-transit bookings");
    } else if (filterType === "completed") {
      setStatusFilter("completed");
      toast.info("Showing completed bookings");
    } else if (filterType === "all") {
      setStatusFilter("all");
      toast.info("Showing all bookings");
    }
  };

  // Handle driver filter toggle
  const handleDriverToggle = (driverId: string) => {
    setSelectedDrivers(prev => {
      if (prev.includes(driverId)) {
        return prev.filter(id => id !== driverId);
      } else {
        return [...prev, driverId];
      }
    });
  };

  // Select/Deselect all drivers
  const handleSelectAllDrivers = () => {
    if (selectedDrivers.length === drivers.length) {
      setSelectedDrivers([]);
    } else {
      setSelectedDrivers(drivers.map(d => d.id));
    }
  };

  // Booking Card Component
  const BookingCard = ({ booking }: { booking: typeof initialBookings[0] }) => {
    const statusConfig = {
      pending: { label: "Pending", color: "bg-gray-100 text-gray-700 border-gray-300" },
      ongoing: { label: "Ongoing", color: "bg-blue-100 text-blue-700 border-blue-300" },
      completed: { label: "Completed", color: "bg-green-100 text-green-700 border-green-300" },
    };

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, booking.id)}
        onClick={() => setSelectedBooking(booking)}
        className={`bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all ${
          booking.priority === "high" ? "border-l-4 border-l-orange-500" : ""
        } ${booking.bookingStatus === "completed" ? "opacity-60" : ""}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-gray-900">{booking.customer}</h4>
            <span className="text-xs text-gray-500">{booking.id}</span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            {booking.priority === "high" && (
              <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded font-medium">
                High
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded border font-medium ${statusConfig[booking.bookingStatus].color}`}>
              {statusConfig[booking.bookingStatus].label}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>{booking.time}</span>
            <span className="text-gray-400">•</span>
            <span>{booking.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{booking.service}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{booking.staffAssigned}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{booking.shortAddress}</span>
          </div>
        </div>
      </div>
    );
  };

  // Get filtered unassigned bookings
  const unassignedBookings = applyFilters(getBookingsForDriver(null));

  // Get visible drivers based on filter
  const visibleDrivers = drivers.filter(d => selectedDrivers.includes(d.id));

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Route Planning & Driver Assignment</h1>
        <p className="text-gray-600 mt-1">Drag bookings between columns to assign drivers</p>
      </div>

      {/* Statistics Cards - Clickable */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="grid grid-cols-6 gap-3">
          <div 
            onClick={() => handleStatClick("all")}
            className="bg-white border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => handleStatClick("needsDriver")}
            className="bg-white border-2 border-orange-200 rounded-lg p-3 cursor-pointer hover:border-orange-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-700 font-semibold">Unassigned</p>
                <p className="text-2xl font-bold text-orange-700">{stats.needsDriver}</p>
              </div>
              <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => handleStatClick("assigned")}
            className="bg-white border-2 border-blue-200 rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-semibold">Assigned</p>
                <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
              </div>
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => handleStatClick("intransit")}
            className="bg-white border-2 border-purple-200 rounded-lg p-3 cursor-pointer hover:border-purple-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-semibold">In Transit</p>
                <p className="text-2xl font-bold text-purple-600">{stats.inTransit}</p>
              </div>
              <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => handleStatClick("completed")}
            className="bg-white border-2 border-green-200 rounded-lg p-3 cursor-pointer hover:border-green-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-semibold">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-semibold">Available Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableDrivers}</p>
              </div>
              <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b bg-white">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">Date:</span>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="intransit">In Transit</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">Priority:</span>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">Time:</span>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Day</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Driver Filter */}
          <div className="flex items-center gap-2 ml-auto">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">Drivers:</span>
            <Popover open={isDriverFilterOpen} onOpenChange={setIsDriverFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-3 justify-between min-w-[140px]"
                >
                  <span className="text-sm">
                    {selectedDrivers.length === drivers.length
                      ? "All Drivers"
                      : selectedDrivers.length === 0
                      ? "No Drivers"
                      : `${selectedDrivers.length} Selected`}
                  </span>
                  <Filter className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">Select Drivers</h4>
                    <span className="text-xs text-gray-500">
                      {selectedDrivers.length}/{drivers.length} selected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => setSelectedDrivers(drivers.map(d => d.id))}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => setSelectedDrivers([])}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {drivers.map(driver => (
                    <div
                      key={driver.id}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleDriverToggle(driver.id)}
                    >
                      <div className="flex-shrink-0">
                        <div
                          className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedDrivers.includes(driver.id)
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {selectedDrivers.includes(driver.id) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {driver.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {driver.vehicle} • {driver.capacity}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            driver.status === "available"
                              ? "bg-green-100 text-green-700"
                              : driver.status === "busy"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {driver.status === "available"
                            ? "Available"
                            : driver.status === "busy"
                            ? "Busy"
                            : "On Route"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Kanban Board */}
        <div className={`flex-1 overflow-x-auto overflow-y-hidden transition-all ${isMapOpen ? 'mr-0' : 'mr-0'}`}>
          <div className="flex h-full gap-4 p-4" style={{ minWidth: 'max-content' }}>
            
            {/* Unassigned Bookings Column */}
            <div
              className="flex-shrink-0 w-80 bg-white border-2 border-gray-300 rounded-lg flex flex-col shadow-sm"
              onDrop={(e) => handleDropOnDriver(e, null)}
              onDragOver={handleDragOver}
            >
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900">Unassigned Bookings</h3>
                  <span className="text-sm font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-full">
                    {unassignedBookings.length}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Drag to assign driver →</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                {unassignedBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {unassignedBookings.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-8">
                    {statusFilter !== "all" ? "No bookings match filters" : "All bookings assigned!"}
                  </div>
                )}
              </div>
            </div>

            {/* Driver Columns */}
            {visibleDrivers.map(driver => {
              const driverBookings = applyFilters(getBookingsForDriver(driver.id));
              const statusColors = {
                available: "bg-green-50 text-green-700",
                busy: "bg-blue-50 text-blue-700",
                on_route: "bg-purple-50 text-purple-700",
              };

              return (
                <div
                  key={driver.id}
                  className="flex-shrink-0 w-80 bg-white border-2 border-gray-200 rounded-lg flex flex-col shadow-sm"
                  onDrop={(e) => handleDropOnDriver(e, driver.id)}
                  onDragOver={handleDragOver}
                >
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-gray-900 truncate">{driver.name}</h3>
                        <p className="text-xs text-gray-600">{driver.vehicle}</p>
                        <p className="text-xs text-gray-500">{driver.capacity}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[driver.status]}`}>
                        {driver.status === "available" ? "Available" : driver.status === "busy" ? "Busy" : "On Route"}
                      </span>
                      <span className="text-xs text-gray-600">⭐ {driver.rating}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-white rounded-lg px-2 py-1.5 border border-gray-200">
                        <div className="text-gray-500 text-xs">Current</div>
                        <div className="font-bold text-gray-900">{driverBookings.filter(b => b.bookingStatus !== "completed").length}</div>
                      </div>
                      <div className="bg-white rounded-lg px-2 py-1.5 border border-gray-200">
                        <div className="text-gray-500 text-xs">Done</div>
                        <div className="font-bold text-green-600">{driver.completedToday}</div>
                      </div>
                      <div className="bg-white rounded-lg px-2 py-1.5 border border-gray-200">
                        <div className="text-gray-500 text-xs">KM</div>
                        <div className="font-bold text-blue-600">{driver.totalKm}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {driverBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                    {driverBookings.length === 0 && (
                      <div className="text-center text-gray-400 text-sm py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        Drop bookings here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map View Panel */}
        {isMapOpen && (
          <div className="w-96 border-l bg-white flex flex-col shadow-lg">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <MapPinned className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Route Map</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMapOpen(false)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 relative bg-gray-100 flex items-center justify-center">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPinned className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-700 mb-2">Interactive Route Map</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    View all booking locations and driver routes
                  </p>
                  <div className="space-y-2 text-xs text-left bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                      <span>Unassigned Bookings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span>Assigned Bookings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span>In Transit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Driver Location</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Toggle Button (when closed) */}
        {!isMapOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMapOpen(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-16 w-8 p-0 rounded-l-lg rounded-r-none shadow-lg bg-white hover:bg-gray-50 border-r-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Booking Details {selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedBooking.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="font-medium text-gray-900">{selectedBooking.phone}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="font-medium text-gray-900">{selectedBooking.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Service</p>
                    <p className="font-medium text-gray-900">{selectedBooking.service}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Staff Assigned</p>
                    <p className="font-medium text-gray-900">{selectedBooking.staffAssigned}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Date & Time</p>
                    <p className="font-medium text-gray-900">{selectedBooking.date} at {selectedBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{selectedBooking.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedBooking.bookingStatus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Priority</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedBooking.priority}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedBooking.address}</p>
                    <p className="text-sm text-gray-600 mt-1">Distance: {selectedBooking.distance}</p>
                  </div>
                </div>
              </div>

              {/* Driver Assignment */}
              {selectedBooking.assignedDriver && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Assigned Driver</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {drivers.find(d => d.id === selectedBooking.assignedDriver)?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {drivers.find(d => d.id === selectedBooking.assignedDriver)?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {drivers.find(d => d.id === selectedBooking.assignedDriver)?.vehicle}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  Edit Booking
                </Button>
                <Button variant="outline" className="flex-1">
                  Reassign Driver
                </Button>
                {selectedBooking.bookingStatus !== "completed" && (
                  <Button variant="default" className="flex-1">
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
