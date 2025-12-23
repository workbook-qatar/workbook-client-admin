import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapView } from "@/components/Map";
import {
  Plus,
  MapPin,
  Clock,
  Users,
  Truck,
  Search,
  X,
  Calendar,
  CalendarDays,
  Navigation,
  Edit,
  Trash2,
  UserCheck,
  CheckCircle2,
  Circle,
  PlayCircle,
  TruckIcon,
  Package,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

// Types
interface Booking {
  id: string;
  customer: string;
  service: string;
  location: string;
  startTime: string;
  endTime: string;
  duration: string;
  staff: string[];
  staffAddresses: { [key: string]: string };
  priority: "high" | "medium" | "normal";
  lat: number;
  lng: number;
}

interface TripStop {
  location: string;
  staff: string[];
  lat: number;
  lng: number;
}

interface TripStatusEvent {
  status: "scheduled" | "assigned" | "en-route" | "in-progress" | "completed" | "cancelled";
  timestamp: string;
  estimatedTime?: string;
  note?: string;
}

interface Trip {
  id: string;
  bookingIds: string[];
  direction: "outbound" | "return";
  startTime: string;
  stops: TripStop[];
  driverId?: string;
  driverName?: string;
  status: "unassigned" | "active" | "upcoming";
  distance: number;
  type?: string;
  currentStatus?: "scheduled" | "assigned" | "en-route" | "in-progress" | "completed" | "cancelled";
  statusTimeline?: TripStatusEvent[];
}

interface Driver {
  id: string;
  name: string;
  avatar: string;
  vehicle: string;
  seats: number;
  status: "available" | "busy" | "on-route";
  currentTrips: number;
  completedTrips: number;
}

// TripStatusTimeline Component
function TripStatusTimeline({ trip, onStatusUpdate }: { trip: Trip; onStatusUpdate?: (status: "en-route" | "in-progress" | "completed") => void }) {
  const allStatuses: Array<"scheduled" | "assigned" | "en-route" | "in-progress" | "completed" | "cancelled"> = [
    "scheduled",
    "assigned",
    "en-route",
    "in-progress",
    "completed",
  ];

  const statusConfig = {
    scheduled: { label: "Scheduled", icon: Calendar, color: "text-gray-500", bgColor: "bg-gray-100" },
    assigned: { label: "Assigned", icon: UserCheck, color: "text-blue-500", bgColor: "bg-blue-100" },
    "en-route": { label: "En Route", icon: TruckIcon, color: "text-purple-500", bgColor: "bg-purple-100" },
    "in-progress": { label: "In Progress", icon: PlayCircle, color: "text-orange-500", bgColor: "bg-orange-100" },
    completed: { label: "Completed", icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-100" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500", bgColor: "bg-red-100" },
  };

  const currentStatusIndex = allStatuses.indexOf(trip.currentStatus || "scheduled");
  const isCancelled = trip.currentStatus === "cancelled";

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusEvent = (status: string) => {
    return trip.statusTimeline?.find((event) => event.status === status);
  };

  const calculateTimeVariance = (event: TripStatusEvent | undefined) => {
    if (!event || !event.estimatedTime) return null;
    
    const estimated = new Date(event.estimatedTime).getTime();
    const actual = new Date(event.timestamp).getTime();
    const varianceMs = actual - estimated;
    const varianceMinutes = Math.round(varianceMs / 60000);
    
    return {
      minutes: Math.abs(varianceMinutes),
      status: varianceMinutes < -2 ? "early" : varianceMinutes > 2 ? "late" : "on-time",
      isEarly: varianceMinutes < -2,
      isLate: varianceMinutes > 2,
      isOnTime: varianceMinutes >= -2 && varianceMinutes <= 2,
    };
  };

  const getVarianceColor = (variance: ReturnType<typeof calculateTimeVariance>) => {
    if (!variance) return "";
    if (variance.isEarly) return "text-blue-600";
    if (variance.isLate) return "text-red-600";
    return "text-green-600";
  };

  const getVarianceBadge = (variance: ReturnType<typeof calculateTimeVariance>) => {
    if (!variance) return null;
    if (variance.isEarly) return `${variance.minutes}m early`;
    if (variance.isLate) return `${variance.minutes}m late`;
    return "On time";
  };

  return (
    <div className="space-y-3">
      {/* Timeline */}
      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
        
        {/* Status points */}
        <div className="relative flex justify-between">
          {allStatuses.map((status, index) => {
            const config = statusConfig[status];
            const Icon = config.icon;
            const event = getStatusEvent(status);
            const isCompleted = !isCancelled && index <= currentStatusIndex;
            const isCurrent = !isCancelled && index === currentStatusIndex;
            
            return (
              <div key={status} className="flex flex-col items-center" style={{ width: `${100 / allStatuses.length}%` }}>
                {/* Icon circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? `${config.bgColor} ${config.color} border-current`
                      : "bg-white border-gray-300"
                  } ${isCurrent ? "ring-4 ring-offset-2 ring-current ring-opacity-30" : ""}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                
                {/* Label */}
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${
                    isCompleted ? config.color : "text-gray-400"
                  }`}>
                    {config.label}
                  </p>
                  {event && (
                    <>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatTime(event.timestamp)}
                      </p>
                      {event.estimatedTime && (() => {
                        const variance = calculateTimeVariance(event);
                        return variance && (
                          <p className={`text-xs font-semibold mt-0.5 ${getVarianceColor(variance)}`}>
                            {getVarianceBadge(variance)}
                          </p>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Performance Metrics */}
      {trip.statusTimeline && trip.statusTimeline.length > 0 && (() => {
        const completedEvents = trip.statusTimeline.filter(e => e.estimatedTime);
        const totalDelayMinutes = completedEvents.reduce((sum, event) => {
          const variance = calculateTimeVariance(event);
          return sum + (variance?.isLate ? variance.minutes : 0);
        }, 0);
        const hasDelays = totalDelayMinutes > 0;
        const allOnTime = completedEvents.every(event => {
          const variance = calculateTimeVariance(event);
          return variance?.isOnTime || variance?.isEarly;
        });

        return hasDelays || allOnTime ? (
          <div className={`mb-3 p-2 rounded-lg border-2 ${
            hasDelays ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasDelays ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-700">
                      Trip Delayed: {totalDelayMinutes}m behind schedule
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">
                      Trip On Schedule
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null;
      })()}

      {/* Current status note */}
      {trip.statusTimeline && trip.statusTimeline.length > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {statusConfig[trip.currentStatus || "scheduled"].label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {trip.statusTimeline[trip.statusTimeline.length - 1].note}
              </p>
            </div>
            
            {/* Status update buttons */}
            {onStatusUpdate && trip.currentStatus !== "completed" && trip.currentStatus !== "cancelled" && (
              <div className="flex gap-2">
                {trip.currentStatus === "assigned" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusUpdate("en-route")}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <TruckIcon className="h-3 w-3 mr-1" />
                    Start Trip
                  </Button>
                )}
                {trip.currentStatus === "en-route" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusUpdate("in-progress")}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <PlayCircle className="h-3 w-3 mr-1" />
                    In Progress
                  </Button>
                )}
                {trip.currentStatus === "in-progress" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusUpdate("completed")}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Complete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dispatch() {
  // State
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTripForAssignment, setSelectedTripForAssignment] = useState<string | null>(null);
  const [selectedTripForEdit, setSelectedTripForEdit] = useState<Trip | null>(null);
  const [editTripStops, setEditTripStops] = useState<TripStop[]>([]);
  const [editStartTime, setEditStartTime] = useState("");
  const [editTripType, setEditTripType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookings, setSelectedBookings] = useState<{ [key: string]: { outbound: boolean; return: boolean } }>({});
  const [startTime, setStartTime] = useState("");
  const [tripType, setTripType] = useState("");
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow" | "week" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");


  // Mock data
  const [bookings] = useState<Booking[]>([
    {
      id: "BK-1001",
      customer: "Mr. Abdullah Saeed",
      service: "AC Repair",
      location: "Apartment 45, Al Sadd, Doha, Qatar",
      startTime: "08:30",
      endTime: "10:30",
      duration: "2 hours",
      staff: ["John Doe", "Sarah Ahmed"],
      staffAddresses: {
        "John Doe": "Villa 123, Al Sadd, Doha, Qatar",
        "Sarah Ahmed": "Building 7, West Bay, Doha, Qatar",
      },
      priority: "high",
      lat: 25.2867,
      lng: 51.5333,
    },
    {
      id: "BK-1002",
      customer: "Mrs. Fatima Mohammed",
      service: "Electrical Work",
      location: "Villa 89, Al Rayyan, Doha, Qatar",
      startTime: "10:00",
      endTime: "11:30",
      duration: "1.5 hours",
      staff: ["Mohammed Hassan"],
      staffAddresses: {
        "Mohammed Hassan": "Tower 5, Al Rayyan, Doha, Qatar",
      },
      priority: "medium",
      lat: 25.3180,
      lng: 51.4390,
    },
    {
      id: "BK-1003",
      customer: "Mr. Hassan Ali",
      service: "Plumbing",
      location: "Tower 12, Al Waab, Doha, Qatar",
      startTime: "14:00",
      endTime: "15:00",
      duration: "1 hour",
      staff: ["Ali Hassan"],
      staffAddresses: {
        "Ali Hassan": "Apartment 20, Al Waab, Doha, Qatar",
      },
      priority: "normal",
      lat: 25.2644,
      lng: 51.4487,
    },
  ]);

  const [trips, setTrips] = useState<Trip[]>([
    {
      id: "T001",
      bookingIds: ["BK-1001"],
      direction: "outbound",
      startTime: "08:00",
      stops: [
        { location: "Villa 123, Al Sadd, Doha, Qatar", staff: ["John Doe"], lat: 25.2854, lng: 51.5310 },
        { location: "Building 7, West Bay, Doha, Qatar", staff: ["Sarah Ahmed"], lat: 25.2760, lng: 51.5200 },
        { location: "Apartment 45, Al Sadd, Doha, Qatar", staff: ["John Doe", "Sarah Ahmed"], lat: 25.2867, lng: 51.5333 },
      ],
      driverId: "D001",
      driverName: "Ahmed Al-Mansoori",
      status: "active",
      distance: 25,
      type: "Outbound",
      currentStatus: "in-progress",
      statusTimeline: [
        {
          status: "scheduled",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          estimatedTime: new Date(Date.now() - 3600000).toISOString(),
          note: "Trip created and scheduled",
        },
        {
          status: "assigned",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          estimatedTime: new Date(Date.now() - 1900000).toISOString(),
          note: "Driver Ahmed Al-Mansoori assigned to trip",
        },
        {
          status: "en-route",
          timestamp: new Date(Date.now() - 900000).toISOString(),
          estimatedTime: new Date(Date.now() - 1000000).toISOString(),
          note: "Driver started journey to first pickup location",
        },
        {
          status: "in-progress",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          estimatedTime: new Date(Date.now() - 400000).toISOString(),
          note: "Picked up staff, heading to job site",
        },
      ],
    },
  ]);

  const [drivers] = useState<Driver[]>([
    {
      id: "D001",
      name: "Ahmed Al-Mansoori",
      avatar: "AA",
      vehicle: "Toyota Hiace",
      seats: 7,
      status: "busy",
      currentTrips: 1,
      completedTrips: 3,
    },
    {
      id: "D002",
      name: "Khalid Ibrahim",
      avatar: "KI",
      vehicle: "Ford Transit",
      seats: 12,
      status: "available",
      currentTrips: 0,
      completedTrips: 2,
    },
    {
      id: "D003",
      name: "Mohammed Rashid",
      avatar: "MR",
      vehicle: "Mercedes Sprinter",
      seats: 14,
      status: "available",
      currentTrips: 0,
      completedTrips: 4,
    },
    {
      id: "D004",
      name: "Ali Hassan",
      avatar: "AH",
      vehicle: "Toyota Hiace",
      seats: 7,
      status: "on-route",
      currentTrips: 1,
      completedTrips: 2,
    },
  ]);

  // Helper functions
  const getBookingsWithoutTrips = () => {
    const bookingsWithTrips = new Set<string>();
    trips.forEach((trip) => {
      trip.bookingIds.forEach((id) => bookingsWithTrips.add(id));
    });
    return bookings.filter((b) => !bookingsWithTrips.has(b.id));
  };

  const calculateStartTime = (booking: Booking): string => {
    // Calculate 30 minutes before booking start time
    const [hours, minutes] = booking.startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes - 30;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
  };

  // Filter bookings based on search
  const filteredBookings = getBookingsWithoutTrips().filter((booking) => {
    const query = searchQuery.toLowerCase();
    return (
      booking.id.toLowerCase().includes(query) ||
      booking.customer.toLowerCase().includes(query) ||
      booking.service.toLowerCase().includes(query)
    );
  });

  // Handle booking selection
  const toggleBookingSelection = (bookingId: string, direction: "outbound" | "return") => {
    setSelectedBookings((prev) => {
      const current = prev[bookingId] || { outbound: false, return: false };
      return {
        ...prev,
        [bookingId]: {
          ...current,
          [direction]: !current[direction],
        },
      };
    });
  };

  // Handle create trips
  const handleCreateTrips = () => {
    const selectedBookingIds = Object.keys(selectedBookings).filter(
      (id) => selectedBookings[id].outbound || selectedBookings[id].return
    );

    if (selectedBookingIds.length === 0) {
      toast.error("Please select at least one booking with a direction (Outbound or Return)");
      return;
    }

    const newTrips: Trip[] = [];
    let tripCounter = trips.length + 1;

    selectedBookingIds.forEach((bookingId) => {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) return;

      const directions = selectedBookings[bookingId];

      // Create outbound trip
      if (directions.outbound) {
        const outboundStops: TripStop[] = [];
        
        // Add pickup stops for each staff member
        booking.staff.forEach((staffName) => {
          const address = booking.staffAddresses[staffName];
          if (address) {
            outboundStops.push({
              location: address,
              staff: [staffName],
              lat: booking.lat + (Math.random() - 0.5) * 0.02,
              lng: booking.lng + (Math.random() - 0.5) * 0.02,
            });
          }
        });

        // Add dropoff stop at job site
        outboundStops.push({
          location: booking.location,
          staff: booking.staff,
          lat: booking.lat,
          lng: booking.lng,
        });

        const calculatedStartTime = startTime || calculateStartTime(booking);

        newTrips.push({
          id: `T${String(tripCounter).padStart(3, "0")}`,
          bookingIds: [bookingId],
          direction: "outbound",
          startTime: calculatedStartTime,
          stops: outboundStops,
          status: "unassigned",
          distance: Math.floor(Math.random() * 20 + 15),
          type: tripType || "Outbound",
          currentStatus: "scheduled",
          statusTimeline: [
            {
              status: "scheduled",
              timestamp: new Date().toISOString(),
              estimatedTime: new Date().toISOString(),
              note: "Trip created and scheduled",
            },
          ],
        });
        tripCounter++;
      }

      // Create return trip
      if (directions.return) {
        const returnStops: TripStop[] = [];

        // Add pickup stop at job site
        returnStops.push({
          location: booking.location,
          staff: booking.staff,
          lat: booking.lat,
          lng: booking.lng,
        });

        // Add dropoff stops for each staff member
        booking.staff.forEach((staffName) => {
          const address = booking.staffAddresses[staffName];
          if (address) {
            returnStops.push({
              location: address,
              staff: [staffName],
              lat: booking.lat + (Math.random() - 0.5) * 0.02,
              lng: booking.lng + (Math.random() - 0.5) * 0.02,
            });
          }
        });

        newTrips.push({
          id: `T${String(tripCounter).padStart(3, "0")}`,
          bookingIds: [bookingId],
          direction: "return",
          startTime: booking.endTime,
          stops: returnStops,
          status: "unassigned",
          distance: Math.floor(Math.random() * 20 + 15),
          type: tripType || "Return",
          currentStatus: "scheduled",
          statusTimeline: [
            {
              status: "scheduled",
              timestamp: new Date().toISOString(),
              estimatedTime: new Date().toISOString(),
              note: "Trip created and scheduled",
            },
          ],
        });
        tripCounter++;
      }
    });

    setTrips([...trips, ...newTrips]);
    toast.success(`${newTrips.length} trip(s) created successfully`);
    
    // Reset form
    setSelectedBookings({});
    setSearchQuery("");
    setStartTime("");
    setTripType("");
    setShowCreateDialog(false);
  };

  // Handle assign driver
  const handleAssignDriver = (driverId: string) => {
    if (!selectedTripForAssignment) return;

    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;

    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === selectedTripForAssignment
          ? {
              ...trip,
              driverId: driver.id,
              driverName: driver.name,
              status: "active",
              currentStatus: "assigned",
              statusTimeline: [
                ...(trip.statusTimeline || []),
                {
                  status: "assigned",
                  timestamp: new Date().toISOString(),
                  estimatedTime: (() => {
                    const lastEvent = trip.statusTimeline?.[trip.statusTimeline.length - 1];
                    if (lastEvent) {
                      // Estimate 5 minutes from scheduled to assigned
                      return new Date(new Date(lastEvent.timestamp).getTime() + 5 * 60000).toISOString();
                    }
                    return new Date().toISOString();
                  })(),
                  note: `Driver ${driver.name} assigned to trip`,
                },
              ],
            }
          : trip
      )
    );

    toast.success(`Trip ${selectedTripForAssignment} assigned to ${driver.name}`);
    setShowAssignDialog(false);
    setSelectedTripForAssignment(null);
  };

  // Handle reassign driver
  const handleReassignDriver = (driverId: string) => {
    if (!selectedTripForAssignment) return;

    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;

    // Check if bulk reassign (multiple trips selected)
    const tripsToReassign = selectedTrips.length > 1 ? selectedTrips : [selectedTripForAssignment];

    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        tripsToReassign.includes(trip.id)
          ? {
              ...trip,
              driverId: driver.id,
              driverName: driver.name,
            }
          : trip
      )
    );

    toast.success(
      selectedTrips.length > 1
        ? `${selectedTrips.length} trips reassigned to ${driver.name}`
        : `Trip ${selectedTripForAssignment} reassigned to ${driver.name}`
    );
    setShowReassignDialog(false);
    setSelectedTripForAssignment(null);
    setSelectedTrips([]);
  };

  // Handle edit trip
  const handleEditTrip = () => {
    if (!selectedTripForEdit) return;

    if (editTripStops.length === 0) {
      toast.error("Trip must have at least one stop");
      return;
    }

    // Check if bulk edit (multiple trips selected)
    const tripsToEdit = selectedTrips.length > 1 ? selectedTrips : [selectedTripForEdit.id];

    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        tripsToEdit.includes(trip.id)
          ? {
              ...trip,
              stops: selectedTrips.length > 1 ? trip.stops : editTripStops, // Don't change stops in bulk
              startTime: editStartTime || trip.startTime,
              type: editTripType || trip.type,
            }
          : trip
      )
    );

    toast.success(
      selectedTrips.length > 1
        ? `${selectedTrips.length} trips updated successfully`
        : `Trip ${selectedTripForEdit.id} updated successfully`
    );
    setShowEditDialog(false);
    setSelectedTripForEdit(null);
    setEditTripStops([]);
    setEditStartTime("");
    setEditTripType("");
    setSelectedTrips([]);
  };

  // Handle cancel trip
  const handleCancelTrip = () => {
    if (!selectedTripForAssignment) return;

    // Check if bulk cancel (multiple trips selected)
    const tripsToCancel = selectedTrips.length > 1 ? selectedTrips : [selectedTripForAssignment];

    setTrips((prevTrips) => prevTrips.filter((trip) => !tripsToCancel.includes(trip.id)));

    toast.success(
      selectedTrips.length > 1
        ? `${selectedTrips.length} trips canceled successfully`
        : `Trip ${selectedTripForAssignment} canceled successfully`
    );
    setShowCancelDialog(false);
    setSelectedTripForAssignment(null);
    setSelectedTrips([]);
  };

  // Handle update trip status
  const handleUpdateTripStatus = (tripId: string, newStatus: "en-route" | "in-progress" | "completed") => {
    const statusNotes = {
      "en-route": "Driver started journey to pickup location",
      "in-progress": "Staff picked up, heading to destination",
      "completed": "Trip completed successfully",
    };

    // Calculate estimated time based on typical stage durations
    const getEstimatedTime = (currentTimeline: TripStatusEvent[], newStatus: string) => {
      const lastEvent = currentTimeline[currentTimeline.length - 1];
      if (!lastEvent) return new Date().toISOString();
      
      // Typical durations between stages (in minutes)
      const stageDurations: Record<string, number> = {
        "en-route": 10,  // 10 min from assigned to en-route
        "in-progress": 15, // 15 min from en-route to in-progress
        "completed": 30,   // 30 min from in-progress to completed
      };
      
      const duration = stageDurations[newStatus] || 10;
      const estimatedTime = new Date(new Date(lastEvent.timestamp).getTime() + duration * 60000);
      return estimatedTime.toISOString();
    };

    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              currentStatus: newStatus,
              statusTimeline: [
                ...(trip.statusTimeline || []),
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  estimatedTime: getEstimatedTime(trip.statusTimeline || [], newStatus),
                  note: statusNotes[newStatus],
                },
              ],
            }
          : trip
      )
    );

    toast.success(`Trip ${tripId} status updated to ${newStatus}`);
  };

  // Map handling
  // Filter trips by date range
  const filterTripsByDate = (trip: Trip): boolean => {
    if (dateFilter === "all") return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse trip start time (assuming format HH:MM)
    const [hours, minutes] = trip.startTime.split(":").map(Number);
    const tripDate = new Date(today);
    tripDate.setHours(hours, minutes, 0, 0);

    if (dateFilter === "today") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tripDate >= today && tripDate < tomorrow;
    }

    if (dateFilter === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);
      return tripDate >= tomorrow && tripDate < dayAfter;
    }

    if (dateFilter === "week") {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return tripDate >= today && tripDate < weekEnd;
    }

    if (dateFilter === "custom" && customStartDate && customEndDate) {
      const startDate = new Date(customStartDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(customEndDate);
      endDate.setHours(23, 59, 59, 999);
      return tripDate >= startDate && tripDate <= endDate;
    }

    return true;
  };

  const filteredTrips = trips.filter(filterTripsByDate);



  // Statistics
  const stats = {
    activeTrips: filteredTrips.filter((t) => t.status === "active").length,
    upcomingTrips: filteredTrips.filter((t) => t.status === "upcoming").length,
    unassignedTrips: filteredTrips.filter((t) => t.status === "unassigned").length,
    totalStops: filteredTrips.reduce((sum, t) => sum + t.stops.length, 0),
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dispatch</h1>
            <p className="text-muted-foreground">Create and manage trips for staff transportation</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create Trip
          </Button>
        </div>

        {/* Date Range Filter */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Filter by Date:</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={dateFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("all")}
                >
                  All Trips
                </Button>
                <Button
                  variant={dateFilter === "today" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("today")}
                >
                  Today
                </Button>
                <Button
                  variant={dateFilter === "tomorrow" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("tomorrow")}
                >
                  Tomorrow
                </Button>
                <Button
                  variant={dateFilter === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("week")}
                >
                  This Week
                </Button>
                <Button
                  variant={dateFilter === "custom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("custom")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Custom Range
                </Button>
              </div>
              {dateFilter === "custom" && (
                <div className="flex items-center gap-2 ml-auto">
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-40"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>
              )}
              {dateFilter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateFilter("all");
                    setCustomStartDate("");
                    setCustomEndDate("");
                  }}
                  className="ml-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Action Toolbar */}
        {selectedTrips.length > 0 && (
          <Card className="bg-primary/5 border-primary">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{selectedTrips.length} trip(s) selected</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const allTripIds = trips.filter(t => t.status !== 'unassigned').map(t => t.id);
                      setSelectedTrips(allTripIds);
                    }}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTrips([])}
                  >
                    Deselect All
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Bulk edit
                      const firstTrip = trips.find((t) => t.id === selectedTrips[0]);
                      if (firstTrip) {
                        setSelectedTripForEdit(firstTrip);
                        setEditTripStops(firstTrip.stops);
                        setEditStartTime(firstTrip.startTime);
                        setEditTripType(firstTrip.type || "");
                        setShowEditDialog(true);
                      }
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Bulk Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTripForAssignment(selectedTrips[0]);
                      setShowReassignDialog(true);
                    }}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Bulk Reassign
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedTripForAssignment(selectedTrips[0]);
                      setShowCancelDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Bulk Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTrips}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingTrips}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unassigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.unassignedTrips}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Stops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStops}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trips List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active & Upcoming Trips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredTrips.filter((t) => t.status !== "unassigned").length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No active or upcoming trips</p>
                ) : (
                  filteredTrips
                    .filter((t) => t.status !== "unassigned")
                    .map((trip) => (
                      <div key={trip.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedTrips.includes(trip.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTrips([...selectedTrips, trip.id]);
                                } else {
                                  setSelectedTrips(selectedTrips.filter((id) => id !== trip.id));
                                }
                              }}
                            />
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold">
                              {trip.driverName?.split(" ").map((n) => n[0]).join("") || "?"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{trip.id}</span>
                                <Badge variant={trip.status === "active" ? "default" : "secondary"}>
                                  {trip.status.toUpperCase()}
                                </Badge>
                                <Badge variant="outline">
                                  {trip.direction === "outbound" ? "🏠→🏢 OUTBOUND" : "🏢→🏠 RETURN"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{trip.driverName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedTripForEdit(trip);
                                setEditTripStops(trip.stops);
                                setEditStartTime(trip.startTime);
                                setEditTripType(trip.type || "");
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedTripForAssignment(trip.id);
                                setShowReassignDialog(true);
                              }}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedTripForAssignment(trip.id);
                                setShowCancelDialog(true);
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {trip.startTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Navigation className="h-4 w-4" />
                            {trip.distance} km
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {trip.stops.length} stops
                          </span>
                        </div>
                        
                        {/* Trip Status Timeline */}
                        {trip.statusTimeline && trip.statusTimeline.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <TripStatusTimeline 
                              trip={trip} 
                              onStatusUpdate={(status) => handleUpdateTripStatus(trip.id, status)}
                            />
                          </div>
                        )}
                      </div>
                    ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unassigned Trips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredTrips.filter((t) => t.status === "unassigned").length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No unassigned trips</p>
                ) : (
                  filteredTrips
                    .filter((t) => t.status === "unassigned")
                    .map((trip) => (
                      <div key={trip.id} className="p-4 border rounded-lg border-orange-200 bg-orange-50 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{trip.id}</span>
                              <Badge variant="outline" className="bg-orange-100">
                                UNASSIGNED
                              </Badge>
                              <Badge variant="outline">
                                {trip.direction === "outbound" ? "🏠→🏢 OUTBOUND" : "🏢→🏠 RETURN"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {trip.startTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Navigation className="h-4 w-4" />
                                {trip.distance} km
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {trip.stops.length} stops
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedTripForAssignment(trip.id);
                              setShowAssignDialog(true);
                            }}
                          >
                            Assign Driver
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bookings Needing Transportation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getBookingsWithoutTrips().length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">All bookings have trips assigned</p>
                ) : (
                  getBookingsWithoutTrips().map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{booking.id}</span>
                            <Badge
                              variant={
                                booking.priority === "high"
                                  ? "destructive"
                                  : booking.priority === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {booking.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mt-1">{booking.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.service} • {booking.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.startTime} • {booking.duration}
                          </p>
                          <p className="text-sm text-muted-foreground">Staff: {booking.staff.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Route Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] rounded-lg overflow-hidden border">
                <MapView trips={filteredTrips} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Trip Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Trip</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Search Bookings */}
              <div className="space-y-2">
                <Label>Search Bookings</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer, booking ID, or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Select Bookings with Direction */}
              <div className="space-y-2">
                <Label>Select Bookings & Trip Direction</Label>
                <div className="space-y-3 max-h-[300px] overflow-y-auto border rounded-lg p-3">
                  {filteredBookings.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No bookings found</p>
                  ) : (
                    filteredBookings.map((booking) => (
                      <div key={booking.id} className="p-3 border rounded-lg space-y-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{booking.id}</span>
                            <span className="text-sm">- {booking.customer}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {booking.service} • {booking.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.startTime} - {booking.endTime} • Staff: {booking.staff.join(", ")}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${booking.id}-outbound`}
                              checked={selectedBookings[booking.id]?.outbound || false}
                              onCheckedChange={() => toggleBookingSelection(booking.id, "outbound")}
                            />
                            <label
                              htmlFor={`${booking.id}-outbound`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              🏠→🏢 Outbound (Staff → Work Site)
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${booking.id}-return`}
                              checked={selectedBookings[booking.id]?.return || false}
                              onCheckedChange={() => toggleBookingSelection(booking.id, "return")}
                            />
                            <label
                              htmlFor={`${booking.id}-return`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              🏢→🏠 Return (Work Site → Staff)
                            </label>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="startTime">
                  Start Time <span className="text-muted-foreground text-xs">(Optional - Auto-recommended)</span>
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="Auto-calculated based on booking"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to auto-calculate (30 minutes before booking start time)
                </p>
              </div>

              {/* Trip Type */}
              <div className="space-y-2">
                <Label htmlFor="tripType">
                  Trip Type <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Select value={tripType} onValueChange={setTripType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Outbound">Outbound</SelectItem>
                    <SelectItem value="Return">Return</SelectItem>
                    <SelectItem value="Round Trip">Round Trip</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Special">Special</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">For dispatcher reference only</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTrips}>Create Trip(s)</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign Driver Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Driver to Trip {selectedTripForAssignment}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  onClick={() => handleAssignDriver(driver.id)}
                  className="p-4 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-semibold">
                      {driver.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{driver.name}</span>
                        <Badge
                          variant={
                            driver.status === "available"
                              ? "default"
                              : driver.status === "busy"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {driver.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {driver.vehicle} • {driver.seats} Seats
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Current: {driver.currentTrips}, Completed: {driver.completedTrips}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Reassign Driver Dialog */}
        <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reassign Driver for Trip {selectedTripForAssignment}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  onClick={() => handleReassignDriver(driver.id)}
                  className="p-4 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-semibold">
                      {driver.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{driver.name}</span>
                        <Badge
                          variant={
                            driver.status === "available"
                              ? "default"
                              : driver.status === "busy"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {driver.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {driver.vehicle} • {driver.seats} Seats
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Current: {driver.currentTrips}, Completed: {driver.completedTrips}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Trip Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Trip {selectedTripForEdit?.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Start Time (Optional)</Label>
                <Input
                  type="time"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                />
              </div>

              <div>
                <Label>Trip Type (Optional)</Label>
                <Select value={editTripType} onValueChange={setEditTripType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outbound">Outbound</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                    <SelectItem value="shuttle">Shuttle</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Trip Stops</Label>
                <div className="space-y-2 mt-2">
                  {editTripStops.map((stop, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Stop #{index + 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditTripStops(editTripStops.filter((_, i) => i !== index));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={stop.location}
                          onChange={(e) => {
                            const newStops = [...editTripStops];
                            newStops[index] = { ...stop, location: e.target.value };
                            setEditTripStops(newStops);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Staff Names (comma-separated)</Label>
                        <Input
                          value={stop.staff.join(", ")}
                          onChange={(e) => {
                            const newStops = [...editTripStops];
                            newStops[index] = {
                              ...stop,
                              staff: e.target.value.split(",").map((s) => s.trim()),
                            };
                            setEditTripStops(newStops);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditTripStops([
                        ...editTripStops,
                        { location: "", staff: [], lat: 25.2854, lng: 51.531 },
                      ]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stop
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditTrip}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cancel Trip Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Trip {selectedTripForAssignment}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to cancel this trip? This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  Keep Trip
                </Button>
                <Button variant="destructive" onClick={handleCancelTrip}>
                  Cancel Trip
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
