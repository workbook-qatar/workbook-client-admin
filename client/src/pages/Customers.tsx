import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Plus,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Star,
  Info,
  Clock,
  Filter,
  Download,
  List,
  LayoutGrid,
  User,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
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
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Enhanced mock customer data
const mockCustomers = [
  {
    id: "WB13",
    name: "Mr. Mohammed Rashid",
    phone: "+974 77665544",
    email: "mr@cc.vv",
    totalBookings: 23,
    totalSpent: 3459,
    avgSpend: 150,
    type: "new" as const,
    status: "active" as const,
    lastBookingDate: "2025-06-15",
    area: "Marina Heights, Dubai",
    location: "Dubai Marina",
    addresses: ["3 - Mushaireb, 140 - Wadi Mshaireb Street, 28"],
    bookingHistory: [
      { id: "JOB-1245", service: "Deep Cleaning", date: "2024-11-25", amount: 450, status: "confirmed" },
      { id: "JOB-1230", service: "AC Repair", date: "2024-11-10", amount: 350, status: "completed" },
    ],
    notes: "Prefers morning appointments. VIP customer.",
  },
  {
    id: "WB14",
    name: "Ahmed Al-Mansoori",
    phone: "+974 5555 1234",
    email: "ahmed.mansoori@email.com",
    totalBookings: 12,
    totalSpent: 5400,
    avgSpend: 450,
    type: "vip" as const,
    status: "active" as const,
    lastBookingDate: "2024-11-23",
    area: "Al Sadd",
    location: "Al Sadd, Doha",
    addresses: ["Villa 45, Al Sadd, Doha", "Office 12, West Bay Tower"],
    bookingHistory: [
      { id: "JOB-1245", service: "Deep Cleaning", date: "2024-11-25", amount: 450, status: "confirmed" },
      { id: "JOB-1230", service: "AC Repair", date: "2024-11-10", amount: 350, status: "completed" },
      { id: "JOB-1215", service: "Plumbing", date: "2024-10-28", amount: 280, status: "completed" },
    ],
    notes: "Prefers morning appointments. Has two cats. VIP customer.",
  },
  {
    id: "WB15",
    name: "Fatima Al-Thani",
    phone: "+974 5555 5678",
    email: "fatima.thani@email.com",
    totalBookings: 8,
    totalSpent: 3200,
    avgSpend: 400,
    type: "regular" as const,
    status: "active" as const,
    lastBookingDate: "2024-11-22",
    area: "Lusail City",
    location: "Lusail City",
    addresses: ["Apartment 302, Lusail City"],
    bookingHistory: [
      { id: "JOB-1244", service: "AC Repair", date: "2024-11-25", amount: 350, status: "pending" },
      { id: "JOB-1220", service: "Electrical Work", date: "2024-11-05", amount: 520, status: "completed" },
    ],
    notes: "Requires invoice for company reimbursement.",
  },
  {
    id: "WB16",
    name: "Khalid Ibrahim",
    phone: "+974 5555 9012",
    email: "khalid.ibrahim@email.com",
    totalBookings: 15,
    totalSpent: 6750,
    avgSpend: 450,
    type: "vip" as const,
    status: "active" as const,
    lastBookingDate: "2024-11-24",
    area: "Al Wakrah",
    location: "Al Wakrah",
    addresses: ["Villa 78, Al Wakrah"],
    bookingHistory: [
      { id: "JOB-1243", service: "Plumbing Service", date: "2024-11-24", amount: 280, status: "completed" },
    ],
    notes: "Regular customer. Prefers same technician.",
  },
  {
    id: "WB17",
    name: "Mariam Hassan",
    phone: "+974 5555 3456",
    email: "mariam.hassan@email.com",
    totalBookings: 5,
    totalSpent: 2100,
    avgSpend: 420,
    type: "new" as const,
    status: "active" as const,
    lastBookingDate: "2024-11-20",
    area: "The Pearl",
    location: "The Pearl",
    addresses: ["Tower 5, The Pearl"],
    bookingHistory: [
      { id: "JOB-1242", service: "Electrical Work", date: "2024-11-24", amount: 520, status: "confirmed" },
    ],
    notes: "New customer. Referred by Ahmed Al-Mansoori.",
  },
  {
    id: "WB18",
    name: "Abdullah Rashid",
    phone: "+974 5555 7890",
    email: "abdullah.rashid@email.com",
    totalBookings: 3,
    totalSpent: 1200,
    avgSpend: 400,
    type: "regular" as const,
    status: "inactive" as const,
    lastBookingDate: "2024-09-15",
    area: "Al Rayyan",
    location: "Al Rayyan",
    addresses: ["Villa 23, Al Rayyan"],
    bookingHistory: [
      { id: "JOB-1241", service: "Painting Service", date: "2024-11-23", amount: 890, status: "cancelled" },
    ],
    notes: "Last booking cancelled. Follow up needed.",
  },
];

// Customer Detail Panel Component
function CustomerDetailPanel({ customer, onClose }: { customer: typeof mockCustomers[0]; onClose: () => void }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{customer.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={customer.status === "active" ? "default" : "secondary"}
              className={customer.status === "active" ? "bg-green-500" : ""}
            >
              {customer.status.toUpperCase()}
            </Badge>
            {/* Type badge removed */}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Last Booking</p>
                    <p className="text-sm text-muted-foreground">{customer.lastBookingDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Address Book</h3>
              <div className="space-y-2">
                {customer.addresses.map((address, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm flex-1">{address}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold">{customer.totalBookings}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-2xl font-bold">AED {customer.totalSpent.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Avg Spend</p>
                  <p className="text-2xl font-bold">AED {customer.avgSpend}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Customer ID</p>
                  <p className="text-2xl font-bold">{customer.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Booking History</h3>
              <div className="space-y-3">
                {customer.bookingHistory.map((booking) => (
                  <div key={booking.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{booking.id}</span>
                      <Badge
                        variant={
                          booking.status === "completed"
                            ? "outline"
                            : booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm mb-1">{booking.service}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{booking.date}</span>
                      <span className="font-semibold text-foreground">AED {booking.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Internal Notes</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">{customer.notes}</p>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Add Note
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "cards" | "contact">("list");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // Calculate summary stats
  const totalCustomers = mockCustomers.length;
  const vipCustomers = mockCustomers.filter((c) => c.type === "vip").length;
  const newCustomers = mockCustomers.filter((c) => c.type === "new").length;
  const regularCustomers = mockCustomers.filter((c) => c.type === "regular").length;

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesLocation = selectedLocation === "all" || customer.area === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const [, setLocation] = useLocation();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map((c) => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleViewCustomer = (customer: typeof mockCustomers[0]) => {
    setSelectedCustomer(customer);
  };

  const handleCall = (phone: string) => {
    toast.success(`Calling ${phone}...`);
  };

  const handleEmail = (email: string) => {
    toast.success(`Opening email to ${email}...`);
  };

  return (
    <DashboardLayout
      // ...
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground mt-1">Manage and track all your customers</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-muted px-4 py-2 rounded-md flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Total Customers:</span>
              <span className="font-bold">{totalCustomers}</span>
            </div>
            <Button onClick={() => setLocation("/customers/add")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Location</SelectItem>
              <SelectItem value="Al Sadd">Al Sadd</SelectItem>
              <SelectItem value="West Bay">West Bay</SelectItem>
              <SelectItem value="The Pearl">The Pearl</SelectItem>
              <SelectItem value="Lusail City">Lusail City</SelectItem>
              <SelectItem value="Al Wakrah">Al Wakrah</SelectItem>
              <SelectItem value="Al Rayyan">Al Rayyan</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-none border-x"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "contact" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("contact")}
              className="rounded-l-none"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedCustomers.length === filteredCustomers.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>CUSTOMER</TableHead>
                    <TableHead>CONTACT</TableHead>
                    <TableHead>LOCATION</TableHead>
                    <TableHead>BOOKING</TableHead>
                    <TableHead>TOTAL SPEND</TableHead>
                    <TableHead className="text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={() => handleSelectCustomer(customer.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{customer.area}</p>
                            <p className="text-xs text-muted-foreground">{customer.location}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{customer.totalBookings}</p>
                          <p className="text-xs text-muted-foreground">Last: {customer.lastBookingDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">AED {customer.totalSpent.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Avg: AED {customer.avgSpend}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCustomer(customer);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card
                key={customer.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewCustomer(customer)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-lg">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.id}</p>
                      </div>
                    </div>
                    {/* Type badge removed */}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{customer.addresses[0]}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Bookings</p>
                      <p className="text-lg font-bold">{customer.totalBookings}</p>
                    </div>
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                      <p className="text-lg font-bold">AED {customer.totalSpent}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCustomer(customer);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contact View */}
        {viewMode === "contact" && (
          <div className="grid grid-cols-4 gap-4">
            {filteredCustomers.map((customer) => (
              <Card
                key={customer.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewCustomer(customer)}
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-3">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>

                  <h3 className="font-semibold mb-1">{customer.name}</h3>
                  <Badge
                    variant="outline"
                    className={
                      customer.type === "vip"
                        ? "border-purple-500 text-purple-700 bg-purple-50 mb-3"
                        : customer.type === "new"
                        ? "border-blue-500 text-blue-700 bg-blue-50 mb-3"
                        : "border-gray-500 text-gray-700 bg-gray-50 mb-3"
                    }
                  >
                    {customer.type === "vip" && <Star className="h-3 w-3 mr-1 fill-purple-500" />}
                    {customer.type.toUpperCase()}
                  </Badge>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground mb-1">Bookings</p>
                      <p className="font-bold">{customer.totalBookings}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground mb-1">Spent</p>
                      <p className="font-bold">AED {customer.totalSpent}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCall(customer.phone);
                      }}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmail(customer.email);
                      }}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} results
          </p>
          <div className="flex items-center gap-2">
            <Select defaultValue="20">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
