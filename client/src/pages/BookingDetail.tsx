import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Edit2,
  Printer,
  Download,
  Share2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  User,
  CheckCircle2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

interface BookingDetailProps {
  booking: any;
  onBack: () => void;
}

export default function BookingDetail({ booking, onBack }: BookingDetailProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState(booking);

  const handleEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSave = (section: string) => {
    // Auto-save logic here
    toast.success(`${section} updated successfully`);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setFormData(booking);
    setEditingSection(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-700 border-green-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      "in progress": "bg-gray-100 text-gray-700 border-gray-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-base text-gray-500 mt-1">{booking.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(booking.status)} px-4 py-2 text-sm font-semibold border`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Customer Information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editingSection === "customer" ? handleSave("Customer Information") : handleEdit("customer")
                    }
                    className="h-9 w-9 p-0"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xl flex-shrink-0">
                    {booking.customer.charAt(0)}
                    {booking.customer.split(" ")[1]?.charAt(0) || ""}
                  </div>
                  <div className="flex-1 space-y-4">
                    {editingSection === "customer" ? (
                      <>
                        <Input 
                          value={formData.customer} 
                          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                          className="h-11 text-base"
                        />
                        <Input 
                          value={formData.customerPhone} 
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          className="h-11 text-base"
                        />
                        <Input 
                          value={formData.customerEmail} 
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                          className="h-11 text-base"
                        />
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="font-semibold text-xl text-gray-900">{booking.customer}</p>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-base">{booking.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <span className="text-base">{booking.customerEmail}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Address */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Service Address</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editingSection === "address" ? handleSave("Service Address") : handleEdit("address")
                    }
                    className="h-9 w-9 p-0"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-semibold text-base text-gray-900">Apartment</span>
                        <Badge variant="secondary" className="text-xs px-2 py-1">Default</Badge>
                      </div>
                      {editingSection === "address" ? (
                        <Textarea
                          value={formData.customerDetails}
                          onChange={(e) => setFormData({ ...formData, customerDetails: e.target.value })}
                          rows={3}
                          className="text-base"
                        />
                      ) : (
                        <p className="text-base text-gray-600 leading-relaxed">{booking.customerDetails}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 ml-10">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-base">+974</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Services</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editingSection === "services" ? handleSave("Services") : handleEdit("services")
                    }
                    className="h-9 w-9 p-0"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="h-14 w-14 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-lg text-gray-900">{booking.service}</h4>
                        <span className="font-semibold text-lg text-gray-900">1 × QR {booking.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {booking.duration}
                        </span>
                        <span>Total Hours: {booking.duration}</span>
                      </div>
                      <div className="pt-4 border-t border-purple-200 flex justify-end">
                        <span className="text-2xl font-bold text-blue-600">QR {booking.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Staff */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Assigned Staff</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editingSection === "staff" ? handleSave("Assigned Staff") : handleEdit("staff")
                    }
                    className="h-9 w-9 p-0"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {booking.staff.map((staffName: string, index: number) => {
                    const initials = staffName.split(" ").map(n => n[0]).join("").substring(0, 2);
                    return (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-base">
                          {initials}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-base text-gray-900">{staffName}</p>
                          <p className="text-sm text-gray-500 mt-1">Cleaner</p>
                        </div>
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Schedule & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Schedule</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editingSection === "schedule" ? handleSave("Schedule") : handleEdit("schedule")
                      }
                      className="h-9 w-9 p-0"
                    >
                      <Edit2 className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <Label className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        Date & Time
                      </Label>
                      <p className="font-semibold text-base text-gray-900">{format(new Date(booking.date), "EEE, MMM dd, yyyy")}</p>
                      <p className="font-semibold text-base text-gray-900 mt-1">{booking.time}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4" />
                        Type
                      </Label>
                      <p className="font-semibold text-base text-gray-900">{booking.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Notes & Instructions</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        editingSection === "notes" ? handleSave("Notes & Instructions") : handleEdit("notes")
                      }
                      className="h-9 w-9 p-0"
                    >
                      <Edit2 className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                  {editingSection === "notes" ? (
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={6}
                      className="text-base"
                    />
                  ) : (
                    <p className="text-base text-gray-600 leading-relaxed">{booking.notes || "No notes"}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Status Management</h3>
                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Order Status</Label>
                    <Select defaultValue={booking.status}>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Payment Method</Label>
                    <Select defaultValue={booking.paymentMode}>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Payment Status</Label>
                    <Select defaultValue={booking.paymentStatus}>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">QR {booking.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-semibold text-gray-900">QR {(booking.price * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="font-semibold text-lg text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">QR {(booking.price * 1.05).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Payment Method</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-sm font-semibold">
                      {booking.paymentMode.charAt(0).toUpperCase() + booking.paymentMode.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-sm font-semibold">
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Timeline</h3>
                <div className="space-y-5">
                  {booking.history && booking.history.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          index === 0 ? "bg-green-100" : "bg-blue-100"
                        }`}>
                          <CheckCircle2 className={`h-5 w-5 ${
                            index === 0 ? "text-green-600" : "text-blue-600"
                          }`} />
                        </div>
                        {index < booking.history.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-5">
                        <p className="font-semibold text-base text-gray-900">{item.action}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
