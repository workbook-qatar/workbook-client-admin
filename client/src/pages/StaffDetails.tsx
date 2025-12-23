import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingUp, Gift, X, Save, User, Camera, LogOut
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
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Expanded Mock Data conforming to WorkforceMemberData structure
const mockStaffData = {
  id: 1,
  // Header / Basic
  name: "Mohammed Hassan",
  nickname: "Nisar",
  role: "Senior Technician", // mapped from position
  status: "available",
  rating: 4.9,
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
  verified: true,
  
  // QID / Identity
  qid: "28535638494",
  dob: "1990-05-15",
  nationality: "India",
  gender: "Male",
  religion: "Islam",
  maritalStatus: "Single",

  // Contact
  phone: "+974 5555 1111",
  email: "mohammed.hassan@workbook.com",
  address: "Building 45, Street 230, Zone 55",
  city: "Doha",
  area: "Al Sadd",
  emergencyContact: "Fatima Hassan",
  emergencyPhone: "+974 5555 5678",
  emergencyRelation: "Spouse",

  // Employment
  position: "Senior Technician",
  department: "Operations",
  employmentType: "Full Time",
  contractType: "Permanent",
  startDate: "2022-03-15",
  joiningDate: "2022-03-20",
  reportingManager: "Sarah Johnson",
  workLocation: "Doha Operations Center",
  
  // Salary
  salaryType: "fixed-monthly",
  monthlySalary: "3500",
  commissionPercentage: "",
  baseRate: "",
  hourlyRate: "",
  fixedMonthlySalary: "",
  commissionPercent: "",

  // Additional
  languages: ["English", "Hindi", "Arabic"],
  skills: ["Deep Cleaning", "AC Maintenance", "Electrical Repair"],

  // Metrics
  jobsCompleted: 156,
  earnings: "5890 QAR",
  hours: "42.5h/week",
  
  // Tab Data (simplified for this view)
  schedule: [],
  documents: [],
  payouts: []
};

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
  
  // State
  const [staff, setStaff] = useState(mockStaffData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockStaffData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load logic (simplified for demo)
  useEffect(() => {
    const storedStaff = localStorage.getItem("vendor_staff");
    if (storedStaff && params?.id) {
      try {
        const parsedStaff = JSON.parse(storedStaff);
        const found = parsedStaff.find((s: any) => s.id === params.id || s.id === parseInt(params.id));
        if (found) {
          // Merge logic
          setStaff(prev => ({ ...prev, ...found }));
          setFormData(prev => ({ ...prev, ...found }));
        }
      } catch (e) { console.error(e); }
    }
  }, [params?.id]);

  const handleEditToggle = () => {
    if (isEditing) {
        setFormData(staff); // Cancel changes
        setIsEditing(false);
    } else {
        setFormData(staff); // Init form
        setIsEditing(true);
    }
  };

  const handleSave = () => {
      setStaff(formData);
      setIsEditing(false);
      
      // Update local storage if needed (mock)
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

  const handleStatusChange = (newStatus: string) => {
      setStaff({ ...staff, status: newStatus });
      toast.success(`Status updated to ${newStatus.replace('-', ' ')}`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: result }));
        // If live update desired: setStaff(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerPhotoUpload = () => {
      fileInputRef.current?.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-2">
          <Link href="/workforce">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Workforce
            </Button>
          </Link>
        </div>

        {/* Header Profile Card - Compact & Minimal */}
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-white shadow-md rounded-xl">
                    <AvatarImage src={isEditing ? formData.avatar : staff.avatar} />
                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                      {(isEditing ? formData.name : staff.name).split(" ").map(n => n[0]).join("").substring(0,2)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                      <button 
                        onClick={triggerPhotoUpload}
                        className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                          <Camera className="h-8 w-8 text-white" />
                      </button>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload}/>
              </div>
              
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                      {isEditing ? formData.name : staff.name}
                      {staff.verified && <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-50" />}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-foreground px-2 py-0.5 bg-gray-100 rounded-md">
                        {isEditing ? formData.position : staff.position}
                      </span>
                      <span>ID: WB-{staff.id.toString().padStart(4, '0')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                     {isEditing ? (
                        <div className="flex gap-2">
                           <Button size="sm" variant="outline" onClick={handleEditToggle}>
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                           </Button>
                           <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                              <Save className="h-4 w-4 mr-2" />
                              Save
                           </Button>
                        </div>
                     ) : (
                        <Button size="sm" variant="outline" onClick={handleEditToggle}>
                           <Edit className="h-4 w-4 mr-2" />
                           Edit Profile
                        </Button>
                     )}
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
                         <DropdownMenuItem onClick={() => handleStatusChange("available")}>Available</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleStatusChange("on-job")}>On Job</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleStatusChange("on-leave")}>On Leave</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleStatusChange("offline")}>Offline</DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 pt-2">
                   <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-foreground">{staff.rating}</span>
                      <span className="text-muted-foreground">Rating</span>
                   </div>
                   <div className="w-px h-4 bg-gray-300 hidden md:block" />
                   <div className="flex items-center gap-1.5">
                     <Phone className="h-3.5 w-3.5 text-gray-400" />
                     {isEditing ? formData.phone : staff.phone}
                   </div>
                   <div className="flex items-center gap-1.5">
                     <Mail className="h-3.5 w-3.5 text-gray-400" />
                     {isEditing ? formData.email : staff.email}
                   </div>
                   <div className="flex items-center gap-1.5">
                     <MapPin className="h-3.5 w-3.5 text-gray-400" />
                     {isEditing ? formData.city || staff.city : staff.city}
                   </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Minimal Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {/* ... Stats cards kept same ... */}
           <Card className="shadow-sm border-gray-100 bg-white/50">
             <CardContent className="p-4 flex flex-col gap-1">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Orders</span>
               <div className="flex items-center justify-between">
                 <span className="text-2xl font-bold">{staff.jobsCompleted}</span>
                 <BarChart3 className="h-4 w-4 text-purple-500 opacity-50" />
               </div>
             </CardContent>
           </Card>
           <Card className="shadow-sm border-gray-100 bg-white/50">
             <CardContent className="p-4 flex flex-col gap-1">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hrs Worked</span>
               <div className="flex items-center justify-between">
                 <span className="text-2xl font-bold">42.5</span>
                 <Clock className="h-4 w-4 text-blue-500 opacity-50" />
               </div>
             </CardContent>
           </Card>
           <Card className="shadow-sm border-gray-100 bg-white/50">
             <CardContent className="p-4 flex flex-col gap-1">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Earnings</span>
               <div className="flex items-center justify-between">
                 <span className="text-2xl font-bold">{staff.earnings}</span>
                 <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+12%</span>
               </div>
             </CardContent>
           </Card>
           <Card className="shadow-sm border-gray-100 bg-white/50">
             <CardContent className="p-4 flex flex-col gap-1">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completion</span>
               <div className="flex items-center justify-between">
                 <span className="text-2xl font-bold">98%</span>
                 <CheckCircle className="h-4 w-4 text-green-500 opacity-50" />
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Dashboard Style Tabs */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="w-full grid grid-cols-5 bg-muted/50 p-1 backdrop-blur-md rounded-xl mb-6">
            <TabsTrigger value="schedule" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all">Schedule</TabsTrigger>
            <TabsTrigger value="availability" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all">Availability</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all">Profile</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all">Documents</TabsTrigger>
            <TabsTrigger value="payouts" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all">Payouts</TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="font-semibold text-lg flex items-center gap-2">
                     <Calendar className="h-5 w-5" />
                     Schedule Management
                   </h3>
                   <Select defaultValue="calendar">
                     <SelectTrigger className="w-[180px]">
                       <SelectValue placeholder="View" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="calendar">Calendar View</SelectItem>
                       <SelectItem value="list">List View</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="text-center py-10 text-muted-foreground bg-gray-50 rounded-lg">Calendar Component Placeholder</div>
              </CardContent>
            </Card>
          </TabsContent>
          
           {/* Availability Tab */}
          <TabsContent value="availability" className="mt-6">
             <Card>
              <CardContent className="p-6">
                   <div className="flex items-center gap-2 mb-6">
                     <Clock className="h-5 w-5" />
                     <h3 className="font-semibold text-lg">Availability Management</h3>
                   </div>
                 <div className="text-center py-10 text-muted-foreground bg-gray-50 rounded-lg">Availability Component Placeholder</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROFILE TAB (Redesigned) */}
          <TabsContent value="profile" className="space-y-6">
            
            {/* 1. Basic Information */}
            <Card>
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo Field (In Edit Mode) */}
                  {isEditing && (
                      <div className="md:col-span-2 flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <Avatar className="h-16 w-16">
                              <AvatarImage src={formData.avatar} />
                              <AvatarFallback>IMG</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                              <Label className="block mb-1">Profile Photo</Label>
                              <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={triggerPhotoUpload}>Change Photo</Button>
                                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => setFormData({...formData, avatar: ''})}>Remove</Button>
                              </div>
                          </div>
                      </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Full Name (from QID)</Label>
                    <Input 
                        value={formData.name} 
                        readOnly 
                        className="bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Nickname</Label>
                    {isEditing ? (
                        <Input value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} />
                    ) : (
                        <div className="font-medium p-2">{staff.nickname}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">QID Number</Label>
                    <Input value={formData.qid} readOnly className="bg-gray-50 border-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Date of Birth</Label>
                    <Input value={formData.dob} readOnly className="bg-gray-50 border-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Gender</Label>
                    <Input value={formData.gender} readOnly className="bg-gray-50 border-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Nationality</Label>
                    <Input value={formData.nationality} readOnly className="bg-gray-50 border-gray-200" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Religion</Label>
                    {isEditing ? (
                         <Select value={formData.religion} onValueChange={v => setFormData({...formData, religion: v})}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Islam">Islam</SelectItem>
                                <SelectItem value="Christianity">Christianity</SelectItem>
                                <SelectItem value="Hinduism">Hinduism</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="font-medium p-2">{staff.religion}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Marital Status</Label>
                     {isEditing ? (
                         <Select value={formData.maritalStatus} onValueChange={v => setFormData({...formData, maritalStatus: v})}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Divorced">Divorced</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="font-medium p-2">{staff.maritalStatus}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Contact Information */}
            <Card>
               <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Mobile Number</Label>
                    {isEditing ? (
                        <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    ) : (
                        <div className="font-medium p-2">{staff.phone}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email Address</Label>
                    {isEditing ? (
                        <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    ) : (
                        <div className="font-medium p-2">{staff.email}</div>
                    )}
                  </div>
                   <div className="space-y-2 md:col-span-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Address</Label>
                    {isEditing ? (
                        <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    ) : (
                        <div className="font-medium p-2">{staff.address}</div>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-xs uppercase tracking-wide">City</Label>
                        {isEditing ? (
                            <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        ) : (
                            <div className="font-medium p-2">{staff.city}</div>
                        )}
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Area</Label>
                        {isEditing ? (
                            <Input value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                        ) : (
                            <div className="font-medium p-2">{staff.area}</div>
                        )}
                      </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Emergency Contact Name</Label>
                    {isEditing ? (
                        <Input value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} />
                    ) : (
                        <div className="font-medium p-2">{staff.emergencyContact}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Relationship</Label>
                    {isEditing ? (
                        <Input value={formData.emergencyRelation} onChange={e => setFormData({...formData, emergencyRelation: e.target.value})} />
                    ) : (
                        <div className="font-medium p-2">{staff.emergencyRelation}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Emergency Phone</Label>
                    {isEditing ? (
                        <Input value={formData.emergencyPhone} onChange={e => setFormData({...formData, emergencyPhone: e.target.value})} />
                    ) : (
                        <div className="font-medium p-2">{staff.emergencyPhone}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Employment Details */}
            <Card>
               <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-500" />
                  Employment Information
                </CardTitle>
              </CardHeader>
               <CardContent className="p-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Position</Label>
                    {isEditing ? (
                        <Select value={formData.position} onValueChange={v => setFormData({...formData, position: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cleaner">Cleaner</SelectItem>
                                <SelectItem value="Driver">Driver</SelectItem>
                                <SelectItem value="Supervisor">Supervisor</SelectItem>
                                <SelectItem value="Senior Technician">Senior Technician</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="font-medium p-2">{staff.position}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Department</Label>
                    {isEditing ? (
                        <Select value={formData.department} onValueChange={v => setFormData({...formData, department: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Operations">Operations</SelectItem>
                                <SelectItem value="HR">HR</SelectItem>
                                <SelectItem value="Sales">Sales</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="font-medium p-2">{staff.department}</div>
                    )}
                  </div>

                   <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Employment Type</Label>
                    {isEditing ? (
                         <Select value={formData.employmentType} onValueChange={v => setFormData({...formData, employmentType: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Full Time">Full Time</SelectItem>
                                <SelectItem value="Part Time">Part Time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="font-medium p-2">{staff.employmentType}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Contract Type</Label>
                    {isEditing ? (
                         <Select value={formData.contractType} onValueChange={v => setFormData({...formData, contractType: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Permanent">Permanent</SelectItem>
                                <SelectItem value="Probation">Probation</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="font-medium p-2">{staff.contractType}</div>
                    )}
                  </div>

                  {/* Salary Section - Simplified Logic */}
                  <div className="md:col-span-2 border-t pt-4 mt-2">
                      <Label className="text-base font-semibold mb-3 block">Compensation</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Salary Type</Label>
                                {isEditing ? (
                                    <Select value={formData.salaryType} onValueChange={v => setFormData({...formData, salaryType: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                           <SelectItem value="fixed-monthly">Fixed Monthly</SelectItem>
                                           <SelectItem value="commission-based">Commission Based</SelectItem>
                                           <SelectItem value="hourly-rate">Hourly Rate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="font-medium p-2 capitalize">{staff.salaryType.replace('-', ' ')}</div>
                                )}
                          </div>
                      
                           {/* Conditional Fields */}
                           {formData.salaryType === 'fixed-monthly' && (
                               <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Monthly Salary (QAR)</Label>
                                    {isEditing ? (
                                        <Input type="number" value={formData.monthlySalary} onChange={e => setFormData({...formData, monthlySalary: e.target.value})} />
                                    ) : (
                                        <div className="font-medium p-2">{staff.monthlySalary} QAR</div>
                                    )}
                               </div>
                           )}
                            {formData.salaryType === 'hourly-rate' && (
                               <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Hourly Rate (QAR)</Label>
                                    {isEditing ? (
                                        <Input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} />
                                    ) : (
                                        <div className="font-medium p-2">{staff.hourlyRate} QAR/hr</div>
                                    )}
                               </div>
                           )}
                      </div>
                  </div>
                </div>
               </CardContent>
            </Card>

            {/* 4. Additional Info */}
             <Card>
               <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Skills & Languages
                </CardTitle>
              </CardHeader>
               <CardContent className="p-6 pt-6">
                   <div className="space-y-4">
                       <div>
                            <Label className="text-muted-foreground text-xs uppercase tracking-wide mb-2 block">Languages</Label>
                            <div className="flex flex-wrap gap-2">
                                {staff.languages.map(lang => (
                                    <Badge key={lang} variant="secondary" className="px-3 py-1">{lang}</Badge>
                                ))}
                                {isEditing && <Button variant="outline" size="sm" className="h-6 text-xs">+ Add</Button>}
                            </div>
                       </div>
                       <div>
                            <Label className="text-muted-foreground text-xs uppercase tracking-wide mb-2 block">Skills</Label>
                            <div className="flex flex-wrap gap-2">
                                {staff.skills.map(skill => (
                                    <Badge key={skill} variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-100">{skill}</Badge>
                                ))}
                                {isEditing && <Button variant="outline" size="sm" className="h-6 text-xs">+ Add</Button>}
                            </div>
                       </div>
                   </div>
               </CardContent>
             </Card>

          </TabsContent>

          <TabsContent value="documents" className="mt-6">
              <div className="text-center py-10 text-muted-foreground">Documents View Component Placeholder</div>
          </TabsContent>
          <TabsContent value="payouts" className="mt-6">
             <div className="text-center py-10 text-muted-foreground">Payouts View Component Placeholder</div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
