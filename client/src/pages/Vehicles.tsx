import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Truck, Plus, Search, Filter, MoreVertical, Edit, Trash2, 
  MapPin, CheckCircle, AlertTriangle, Calendar 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// --- Types ---
export interface Vehicle {
  id: string;
  name: string; // e.g., "Toyota HiAce"
  plateNumber: string;
  type: "Van" | "Sedan" | "Truck" | "Motorcycle" | "Bus";
  status: "active" | "maintenance" | "out_of_service";
  year?: string;
  assignedDriverId?: string; // Future linking
}

// --- Mock Data for Initial Load ---
const MOCK_VEHICLES: Vehicle[] = [
  { id: "v1", name: "Toyota HiAce", plateNumber: "847291", type: "Van", status: "active", year: "2023" },
  { id: "v2", name: "Nissan Urvan", plateNumber: "192834", type: "Van", status: "active", year: "2022" },
  { id: "v3", name: "Mitsubishi Canter", plateNumber: "992831", type: "Truck", status: "maintenance", year: "2021" },
];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    name: "",
    plateNumber: "",
    type: "Van",
    status: "active",
    year: ""
  });

  // Load Data
  useEffect(() => {
    const stored = localStorage.getItem("vendor_vehicles");
    if (stored) {
      setVehicles(JSON.parse(stored));
    } else {
      setVehicles(MOCK_VEHICLES);
      localStorage.setItem("vendor_vehicles", JSON.stringify(MOCK_VEHICLES));
    }
  }, []);

  // CRUD
  const handleSave = () => {
    if (!formData.name || !formData.plateNumber) {
      toast.error("Vehicle name and plate number are required");
      return;
    }

    let newList = [...vehicles];
    if (editingId) {
      newList = newList.map(v => v.id === editingId ? { ...v, ...formData } as Vehicle : v);
      toast.success("Vehicle updated");
    } else {
      const newVehicle: Vehicle = {
        id: `v-${Date.now()}`,
        name: formData.name!,
        plateNumber: formData.plateNumber!,
        type: formData.type as any || "Van",
        status: formData.status as any || "active",
        year: formData.year,
      };
      newList.push(newVehicle);
      toast.success("Vehicle added to fleet");
    }

    setVehicles(newList);
    localStorage.setItem("vendor_vehicles", JSON.stringify(newList));
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const newList = vehicles.filter(v => v.id !== id);
    setVehicles(newList);
    localStorage.setItem("vendor_vehicles", JSON.stringify(newList));
    toast.success("Vehicle removed");
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setFormData(vehicle);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", plateNumber: "", type: "Van", status: "active", year: "" });
  };

  // Filter
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.plateNumber.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const activeCount = vehicles.filter(v => v.status === "active").length;
  const maintenanceCount = vehicles.filter(v => v.status === "maintenance").length;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50/50">
        
        {/* Header */}
        <div className="px-8 py-6 border-b bg-white flex items-center justify-between sticky top-0 z-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Fleet Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage vehicles, maintenance, and assignments.</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20">
                        <Plus className="h-4 w-4" />
                        Add Vehicle
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
                        <DialogDescription>Enter the vehicle details below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Vehicle Model/Name</Label>
                                <Input 
                                    placeholder="e.g. Toyota HiAce" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Plate Number</Label>
                                <Input 
                                    placeholder="e.g. 123456" 
                                    value={formData.plateNumber} 
                                    onChange={e => setFormData({...formData, plateNumber: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v as any})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {["Van", "Sedan", "Truck", "Motorcycle", "Bus"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                             </div>
                             <div className="space-y-2">
                                <Label>Year</Label>
                                <Input 
                                    placeholder="YYYY" 
                                    value={formData.year} 
                                    onChange={e => setFormData({...formData, year: e.target.value})} 
                                />
                             </div>
                        </div>
                         <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v as any})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="maintenance">In Maintenance</SelectItem>
                                    <SelectItem value="out_of_service">Out of Service</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Vehicle</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

        {/* Content */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="shadow-sm border-blue-100 bg-blue-50/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                            <Truck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-900">Total Fleet</p>
                            <h3 className="text-2xl font-bold text-blue-700">{vehicles.length}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-green-100 bg-green-50/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-900">Active</p>
                            <h3 className="text-2xl font-bold text-green-700">{activeCount}</h3>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="shadow-sm border-orange-100 bg-orange-50/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-orange-900">Maintenance</p>
                            <h3 className="text-2xl font-bold text-orange-700">{maintenanceCount}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* List */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            placeholder="Search vehicles..." 
                            className="pl-10 h-10 bg-gray-50 border-gray-200"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] h-10 bg-gray-50 border-gray-200">
                            <div className="flex items-center gap-2">
                                <Filter className="h-3.5 w-3.5 text-gray-500" />
                                <SelectValue placeholder="All Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="out_of_service">Out of Service</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="divide-y divide-gray-100">
                    {filteredVehicles.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Truck className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
                            <p className="text-sm">Add vehicles to your fleet to get started.</p>
                        </div>
                    ) : (
                        filteredVehicles.map(vehicle => (
                            <div key={vehicle.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                                {vehicle.year || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                            <span className="flex items-center gap-1">
                                                <div className="font-mono text-xs bg-gray-100 px-1 rounded">{vehicle.plateNumber}</div>
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span>{vehicle.type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <Badge className={`
                                        gap-1.5 pl-1.5 pr-2.5 py-0.5
                                        ${vehicle.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                                        ${vehicle.status === 'maintenance' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' : ''}
                                        ${vehicle.status === 'out_of_service' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                                    `}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                            vehicle.status === 'active' ? 'bg-green-500' : 
                                            vehicle.status === 'maintenance' ? 'bg-orange-500' : 'bg-red-500'
                                        }`} />
                                        {vehicle.status === 'active' ? 'Active' : 
                                         vehicle.status === 'maintenance' ? 'Maintenance' : 'Out of Service'}
                                    </Badge>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEdit(vehicle)}>
                                                <Edit className="h-4 w-4 mr-2" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => handleDelete(vehicle.id)}>
                                                <Trash2 className="h-4 w-4 mr-2" /> Remove Vehicle
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
