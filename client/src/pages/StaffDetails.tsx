import { useState, useEffect, useRef } from "react";
import { useRoute, Link, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Phone, Mail, Star, ArrowLeft, MapPin, Calendar, CheckCircle, 
  AlertTriangle, Edit, ChevronDown, BarChart3, Clock, CalendarDays, 
  ChevronLeft, ChevronRight, Trash2, Plus, Building2, FileText, 
  Eye, Download, Upload, RefreshCw, ShieldCheck, Wallet, Banknote, 
  TrendingUp, Gift, X, Save, User, Camera, LogOut, MoreVertical,
  FileIcon, CalendarCheck, DollarSign, PenSquare, MoreHorizontal,
  Briefcase, Lock
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
  DropdownMenuLabel
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
import { Switch } from "@/components/ui/switch";

// Mock Data
const mockStaffData = {
  id: 1,
  name: "Mohammed Hassan",
  nickname: "Nisar",
  role: "Senior Technician", 
  status: "available",
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
};

const mockBookings = [
  { id: "BK-2024-001", customer: "Aldar Properties", service: "AC Maintenance", date: "2024-12-24", time: "09:00 AM", status: "Scheduled", location: "West Bay, Doha" },
  { id: "BK-2024-002", customer: "Fatima Al-Thani", service: "Deep Cleaning", date: "2024-12-25", time: "02:00 PM", status: "Pending", location: "The Pearl, Doha" },
];

const mockDocuments = [
  { id: 1, name: "Qatar ID", type: "Identification", expiry: "2025-05-20", status: "Valid" },
  { id: 2, name: "Visa Copy", type: "Visa", expiry: "2024-12-30", status: "Expiring Soon" },
];

const mockPayouts = [
  { id: "PY-001", date: "2024-11-30", amount: "3500.00", status: "Paid", type: "Salary" },
  { id: "PY-002", date: "2024-10-31", amount: "3500.00", status: "Paid", type: "Salary" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "available": return "bg-green-500";
    case "on-job": return "bg-amber-500";
    case "offline": return "bg-gray-400";
    case "on-leave": return "bg-red-500";
    default: return "bg-gray-400";
  }
}

export default function StaffDetails() {
  const [, params] = useRoute("/staff/:id");
  const [, setLocation] = useLocation();
  
  const [staff, setStaff] = useState(mockStaffData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockStaffData);
  // Separate ref for the file input to ensure we can trigger it
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedStaff = localStorage.getItem("vendor_staff");
    if (storedStaff && params?.id) {
      try {
        const parsedStaff = JSON.parse(storedStaff);
        const found = parsedStaff.find((s: any) => s.id === params.id || s.id === parseInt(params.id));
        if (found) {
          setStaff(prev => ({ ...prev, ...found }));
          setFormData(prev => ({ ...prev, ...found }));
        }
      } catch (e) { console.error(e); }
    }
  }, [params?.id]);

  const handleEditToggle = () => {
    if (isEditing) {
        setFormData(staff); // Reset to current staff data
        setIsEditing(false);
    } else {
        setFormData(staff); // Initialize form with current data
        setIsEditing(true);
    }
  };

  const handleSave = () => {
      setStaff(formData);
      setIsEditing(false);
      
      const stored = localStorage.getItem("vendor_staff");
      if (stored) {
          const list = JSON.parse(stored);
          const index = list.findIndex((s: any) => s.id === staff.id);
          if (index !== -1) {
              list[index] = { ...list[index], ...formData };
              localStorage.setItem("vendor_staff", JSON.stringify(list));
          }
      }
      toast.success("Staff profile updated successfully");
  };

  const handleDeleteStaff = () => {
    if (confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) {
       const stored = localStorage.getItem("vendor_staff");
       if (stored) {
           let list = JSON.parse(stored);
           list = list.filter((s: any) => s.id !== staff.id);
           localStorage.setItem("vendor_staff", JSON.stringify(list));
       }
       toast.success("Staff member deleted successfully");
       setLocation("/workforce");
    }
  };

  const handleStatusChange = (newStatus: string) => {
      setStaff({ ...staff, status: newStatus });
      toast.success(`Status updated to ${newStatus.replace('-', ' ')}`);
  };

  const triggerFileUpload = () => {
      // Direct DOM click to ensure it fires
      const input = document.getElementById("avatar-upload-input");
      if (input) input.click();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Update both form data (for preview)
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper component for Section Headers with Edit Button
  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
      <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Icon className="h-5 w-5 text-gray-500" />
              {title}
          </CardTitle>
          {!isEditing && (
              <Button variant="ghost" size="sm" onClick={handleEditToggle} className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 text-gray-400 hover:text-primary">
                  <PenSquare className="h-4 w-4" />
              </Button>
          )}
      </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Simplified Back Navigation */}
        <div className="flex items-center">
          <Link href="/workforce">
            <Button variant="ghost" size="sm" className="gap-1 pl-0 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Workforce
            </Button>
          </Link>
        </div>

        {/* Main Header Card */}
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-visible">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              
              {/* Avatar Section - Fixed Upload */}
              <div className="relative group shrink-0">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg rounded-2xl">
                    <AvatarImage src={isEditing ? formData.avatar : staff.avatar} className="object-cover" />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {(isEditing ? formData.name : staff.name).split(" ").map(n => n[0]).join("").substring(0,2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                      <div 
                        onClick={triggerFileUpload}
                        className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                      >
                          <Camera className="h-8 w-8 text-white" />
                      </div>
                  )}
                  {/* Hidden Input with distinct ID */}
                  <input 
                    type="file" 
                    id="avatar-upload-input"
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                  />
              </div>
              
              {/* Staff Info Section */}
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                      {isEditing ? formData.name : staff.name}
                      {staff.verified && <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-50" />}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-foreground px-2 py-0.5 bg-gray-100 rounded-md border border-gray-200">
                        {isEditing ? formData.position : staff.position}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span>ID: WB-{staff.id.toString().padStart(4, '0')}</span>
                    </div>
                  </div>

                  {/* Actions Area - Redesigned */}
                  <div className="flex items-center gap-2 self-center md:self-start">
                     {isEditing ? (
                        <>
                           <Button size="sm" variant="ghost" onClick={handleEditToggle}>Cancel</Button>
                           <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
                              <Save className="h-4 w-4 mr-2" />
                              Save Profile
                           </Button>
                        </>
                     ) : (
                        <>
                             {/* Status Dropdown */}
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="outline" size="sm" className={`gap-2 border ${
                                    staff.status === 'available' ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' :
                                    staff.status === 'on-job' ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' :
                                    staff.status === 'on-leave' ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' :
                                    'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                                 }`}>
                                   <div className={`h-2 w-2 rounded-full ${getStatusColor(staff.status)}`} />
                                   <span className="capitalize font-semibold">{staff.status.replace("-", " ")}</span>
                                   <ChevronDown className="h-3 w-3 opacity-50" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end">
                                 <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                 <DropdownMenuSeparator />
                                 <DropdownMenuItem onClick={() => handleStatusChange("available")}>Available</DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handleStatusChange("on-job")}>On Job</DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handleStatusChange("on-leave")}>On Leave</DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handleStatusChange("offline")}>Offline</DropdownMenuItem>
                               </DropdownMenuContent>
                             </DropdownMenu>

                             {/* More Actions Menu (Delete moved here) */}
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleEditToggle}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleDeleteStaff}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete Staff
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                             </DropdownMenu>
                        </>
                     )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 pt-3">
                   <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded text-amber-700 border border-amber-100">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-bold">{staff.rating}</span>
                   </div>
                   <div className="hidden md:block w-px h-4 bg-gray-300 mx-1"></div>
                   <div className="flex items-center gap-1.5">
                     <Phone className="h-3.5 w-3.5 text-gray-400" />
                     {isEditing ? formData.phone : staff.phone}
                   </div>
                   <div className="flex items-center gap-1.5">
                     <Mail className="h-3.5 w-3.5 text-gray-400" />
                     {isEditing ? formData.email : staff.email}
                   </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
               { label: "Total Orders", value: staff.jobsCompleted, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
               { label: "Hrs Worked", value: "42.5", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
               { label: "Earnings", value: "5,890", sub: "QAR", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
               { label: "Completion", value: "98%", icon: CheckCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
           ].map((stat, i) => (
             <Card key={i} className="shadow-sm border-gray-100 bg-white/60 hover:bg-white transition-colors">
               <CardContent className="p-4 flex items-center justify-between">
                 <div className="flex flex-col gap-1">
                   <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                   <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                      {stat.sub && <span className="text-xs font-medium text-gray-500">{stat.sub}</span>}
                   </div>
                 </div>
                 <div className={`h-10 w-10 rounded-full ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                 </div>
               </CardContent>
             </Card>
           ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full grid grid-cols-5 bg-muted/50 p-1 backdrop-blur-md rounded-xl mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          {/* PROFILE TAB - Redesigned with intuitive Edit buttons */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Personal Info */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <SectionHeader icon={User} title="Personal Information" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Full Name</Label>
                            <div className="font-medium p-1">{staff.name}</div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Nickname</Label>
                            {isEditing ? <Input value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} className="h-9" /> : <div className="font-medium p-1">{staff.nickname}</div>}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">QID Number</Label>
                            <div className="font-medium p-1">{staff.qid}</div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Nationality</Label>
                            <div className="font-medium p-1">{staff.nationality}</div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Gender</Label>
                            <div className="font-medium p-1">{staff.gender}</div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Marital Status</Label>
                            {isEditing ? (
                                <Select value={formData.maritalStatus} onValueChange={v => setFormData({...formData, maritalStatus: v})}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Single">Single</SelectItem>
                                        <SelectItem value="Married">Married</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : <div className="font-medium p-1">{staff.maritalStatus}</div>}
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <SectionHeader icon={Phone} title="Contact Details" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Mobile</Label>
                            {isEditing ? <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-9" /> : <div className="font-medium p-1">{staff.phone}</div>}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Email</Label>
                            {isEditing ? <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-9" /> : <div className="font-medium p-1 truncate" title={staff.email}>{staff.email}</div>}
                        </div>
                         <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Emergency Contact</Label>
                             {isEditing ? <Input value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} className="h-9" /> : <div className="font-medium p-1">{staff.emergencyContact}</div>}
                        </div>
                    </CardContent>
                </Card>

                {/* Employment */}
                <Card className="md:col-span-3">
                    <CardHeader>
                        <SectionHeader icon={Briefcase} title="Employment Information" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                             <Label className="text-xs text-muted-foreground uppercase">Position</Label>
                             {isEditing ? (
                                <Select value={formData.position} onValueChange={v => setFormData({...formData, position: v})}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cleaner">Cleaner</SelectItem>
                                        <SelectItem value="Senior Technician">Senior Technician</SelectItem>
                                        <SelectItem value="Driver">Driver</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : <div className="font-medium p-1">{staff.position}</div>}
                        </div>
                         <div className="space-y-1">
                             <Label className="text-xs text-muted-foreground uppercase">Department</Label>
                             {isEditing ? (
                                <Select value={formData.department} onValueChange={v => setFormData({...formData, department: v})}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Operations">Operations</SelectItem>
                                        <SelectItem value="HR">HR</SelectItem>
                                        <SelectItem value="Sales">Sales</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : <div className="font-medium p-1">{staff.department}</div>}
                        </div>
                        <div className="space-y-1">
                             <Label className="text-xs text-muted-foreground uppercase">Joining Date</Label>
                             <div className="font-medium p-1">{staff.joiningDate}</div>
                        </div>
                        <div className="space-y-1">
                             <Label className="text-xs text-muted-foreground uppercase">Salary Type</Label>
                             <div className="font-medium pt-1 capitalize">{staff.salaryType.replace('-', ' ')}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>

          {/* Other Tabs Content (Schedule, etc.) from previous implementation can remain similar but compact */}
          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardHeader className="py-4">
                 <CardTitle className="text-base font-semibold flex items-center gap-2">
                     <CalendarCheck className="h-4 w-4 text-blue-500" /> Upcoming Schedule
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ref ID</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockBookings.map(bookings => (
                            <TableRow key={bookings.id}>
                                <TableCell className="font-medium">{bookings.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{bookings.date}</span>
                                        <span className="text-xs text-muted-foreground">{bookings.time}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{bookings.service}</TableCell>
                                <TableCell>
                                    <Badge variant={bookings.status === 'Completed' ? 'default' : bookings.status === 'Scheduled' ? 'secondary' : 'outline'}>
                                        {bookings.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="availability" className="mt-6">
             <div className="p-10 text-center text-muted-foreground bg-gray-50 rounded-lg border border-dashed">Availability Component Ready</div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
              <Card>
                  <CardHeader className="py-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">Documents</CardTitle>
                      <Button size="sm" variant="outline"><Plus className="h-3 w-3 mr-1"/> Upload</Button>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Expiry</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                          <TableBody>
                              {mockDocuments.map(doc => (
                                  <TableRow key={doc.id}>
                                      <TableCell>{doc.name}</TableCell>
                                      <TableCell>{doc.expiry}</TableCell>
                                      <TableCell><Badge variant="outline">{doc.status}</Badge></TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="payouts" className="mt-6">
             <Card>
                 <CardHeader className="py-4"><CardTitle className="text-base font-semibold">Compensation History</CardTitle></CardHeader>
                 <CardContent>
                     <Table>
                         <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                         <TableBody>
                             {mockPayouts.map(pay => (
                                 <TableRow key={pay.id}>
                                     <TableCell>{pay.id}</TableCell>
                                     <TableCell className="font-bold">{pay.amount}</TableCell>
                                     <TableCell><Badge variant="outline" className="text-green-600 bg-green-50">{pay.status}</Badge></TableCell>
                                 </TableRow>
                             ))}
                         </TableBody>
                     </Table>
                 </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
