import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  ArrowLeft, Plus, Edit, Trash2, Search, Briefcase, 
  ShieldCheck, Check, Settings, LayoutDashboard, Users, UserPlus 
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface Permission {
  module: string;
  access: 'Full Access' | 'Manage' | 'View Only' | 'No Access';
}

interface SystemRole {
  id: string;
  name: string;
  description: string;
  isSystemDefault: boolean;
  permissions: Permission[];
}

const DEFAULT_MODULES = [
  "Workforce", "Bookings", "Customers", "Dispatch", 
  "Services", "Finance", "Settings", "System Settings", 
  "User Management", "Billing"
];

const DEFAULT_ROLES: SystemRole[] = [
  {
    id: "r1",
    name: "Admin",
    description: "Unrestricted access to all modules and system configurations.",
    isSystemDefault: true,
    permissions: [
      { module: 'All Modules', access: 'Full Access' },
      { module: 'System Settings', access: 'Full Access' },
      { module: 'User Management', access: 'Full Access' },
      { module: 'Billing', access: 'Full Access' },
    ]
  },
  {
    id: "r2",
    name: "Manager",
    description: "Full access to operational modules, limited access to financial settings.",
    isSystemDefault: true,
    permissions: [
      { module: 'Workforce', access: 'Full Access' },
      { module: 'Bookings', access: 'Full Access' },
      { module: 'Customers', access: 'Full Access' },
      { module: 'Services', access: 'Manage' },
      { module: 'Finance', access: 'View Only' },
      { module: 'Settings', access: 'View Only' },
    ]
  },
  {
    id: "r3",
    name: "Supervisor",
    description: "Manages daily operations, dispatching, and bookings.",
    isSystemDefault: true,
    permissions: [
      { module: 'Workforce', access: 'View Only' },
      { module: 'Bookings', access: 'Manage' },
      { module: 'Dispatch', access: 'Full Access' },
      { module: 'Customers', access: 'View Only' },
    ]
  },
  {
    id: "r4",
    name: "Dispatcher",
    description: "Dedicated access for assignment and tracking of field staff.",
    isSystemDefault: true,
    permissions: [
      { module: 'Dispatch', access: 'Full Access' },
      { module: 'Bookings', access: 'Manage' },
      { module: 'Workforce', access: 'View Only' },
    ]
  }
];

export default function SystemRoles() {
  const [, setLocation] = useLocation();
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
      name: string;
      description: string;
      permissions: Permission[];
  }>({
      name: "",
      description: "",
      permissions: []
  });

  useEffect(() => {
    const stored = localStorage.getItem("vendor_system_roles");
    if (stored) {
        setRoles(JSON.parse(stored));
    } else {
        setRoles(DEFAULT_ROLES);
        localStorage.setItem("vendor_system_roles", JSON.stringify(DEFAULT_ROLES));
    }
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ 
      name: "", 
      description: "", 
      permissions: [{ module: 'Workforce', access: 'View Only' }] 
    });
  };

  const openEdit = (role: SystemRole) => {
    if (role.isSystemDefault) {
        toast.info("System default roles cannot be fully edited. Create a custom role instead.");
        return;
    }
    setEditingId(role.id);
    setFormData({
        name: role.name,
        description: role.description,
        permissions: [...role.permissions]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (role: SystemRole) => {
      if (role.isSystemDefault) {
          toast.error("System default roles cannot be deleted.");
          return;
      }
      const newRoles = roles.filter(r => r.id !== role.id);
      setRoles(newRoles);
      localStorage.setItem("vendor_system_roles", JSON.stringify(newRoles));
      toast.success("System role deleted successfully");
  };

  const handleSave = () => {
      if (!formData.name.trim()) {
          toast.error("Role Name is required");
          return;
      }

      let newRoles = [...roles];
      if (editingId) {
          // Update
          newRoles = newRoles.map(r => r.id === editingId ? { ...r, name: formData.name, description: formData.description, permissions: formData.permissions } : r);
          toast.success("Role updated successfully");
      } else {
          // Create
          const newRole: SystemRole = {
              id: `role-${Date.now()}`,
              name: formData.name,
              description: formData.description,
              isSystemDefault: false,
              permissions: formData.permissions
          };
          newRoles.push(newRole);
          toast.success("New custom role created");
      }

      setRoles(newRoles);
      localStorage.setItem("vendor_system_roles", JSON.stringify(newRoles));
      setIsDialogOpen(false);
      resetForm();
  };

  const filteredRoles = roles.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50/50">
        
        {/* Header */}
        <div className="px-8 py-6 border-b bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setLocation("/settings")} className="rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        System Roles & Access
                    </h1>
                    <p className="text-[13px] text-gray-500 mt-1">Manage functional roles, module permissions, and dashboard access.</p>
                </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-md shadow-purple-600/20 font-semibold px-5 rounded-xl transition-all">
                        <Plus className="h-4 w-4" />
                        Create Custom Role
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{editingId ? "Edit Custom Role" : "Create Custom Role"}</DialogTitle>
                        <DialogDescription>
                            Define the name, description, and exact module access levels.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Role Name <span className="text-red-500">*</span></Label>
                                <Input className="h-11 rounded-xl" placeholder="e.g. Finance Auditor" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Description</Label>
                                <Input className="h-11 rounded-xl" placeholder="Brief purpose of this role" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                        </div>

                        <Separator className="bg-gray-100" />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-purple-600" /> Module Permissions
                                </Label>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 text-xs font-semibold rounded-lg text-purple-700 hover:text-purple-800 hover:bg-purple-50 border-purple-200"
                                    onClick={() => setFormData({...formData, permissions: [...formData.permissions, { module: 'Workforce', access: 'View Only' }]})}
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Permission
                                </Button>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 max-h-[300px] overflow-y-auto">
                                {formData.permissions.length === 0 && (
                                    <div className="text-center py-6 text-sm text-gray-500 italic">No permissions added. Click "Add Permission" above.</div>
                                )}
                                {formData.permissions.map((perm, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm animate-in fade-in zoom-in-95">
                                        <div className="flex-1 w-full relative">
                                            <Select value={perm.module} onValueChange={(v) => {
                                                const newPerms = [...formData.permissions];
                                                newPerms[idx].module = v;
                                                setFormData({...formData, permissions: newPerms});
                                            }}>
                                                <SelectTrigger className="h-10 rounded-lg bg-gray-50/50">
                                                    <SelectValue placeholder="Select Module" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DEFAULT_MODULES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1 w-full relative">
                                            <Select value={perm.access} onValueChange={(v: any) => {
                                                const newPerms = [...formData.permissions];
                                                newPerms[idx].access = v;
                                                setFormData({...formData, permissions: newPerms});
                                            }}>
                                                <SelectTrigger className="h-10 rounded-lg bg-gray-50/50">
                                                    <SelectValue placeholder="Select Access Level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Full Access">Full Access</SelectItem>
                                                    <SelectItem value="Manage">Manage (Create/Edit)</SelectItem>
                                                    <SelectItem value="View Only">View Only</SelectItem>
                                                    <SelectItem value="No Access">No Access</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            className="h-10 w-10 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0 rounded-lg"
                                            onClick={() => {
                                                const newPerms = [...formData.permissions];
                                                newPerms.splice(idx, 1);
                                                setFormData({...formData, permissions: newPerms});
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <DialogFooter className="pt-4 border-t border-gray-100">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-medium">Cancel</Button>
                        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 rounded-xl font-bold shadow-sm px-6">Save Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

        {/* Content */}
        <div className="p-8 max-w-6xl mx-auto w-full space-y-6">
            
            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search roles..." 
                    className="pl-11 h-11 bg-white border-gray-200 rounded-xl shadow-sm text-[13px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRoles.map(role => (
                    <Card key={role.id} className="bg-white border-gray-200/60 shadow-sm hover:shadow hover:border-purple-200 transition-all group overflow-hidden flex flex-col">
                        <div className="p-6 pb-5 flex flex-col flex-1 border-b border-gray-50/50 relative">
                            {role.isSystemDefault && (
                                <div className="absolute top-6 right-6">
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-semibold border-gray-200 uppercase tracking-widest text-[9px] px-2 py-0.5 shadow-sm">
                                        System Default
                                    </Badge>
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${role.name === 'Admin' ? 'bg-red-50 text-red-600' : role.isSystemDefault ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {role.name === 'Admin' ? <ShieldCheck className="h-6 w-6" /> : <Briefcase className="h-6 w-6" />}
                                </div>
                                <div className="pr-16">
                                    <h3 className="font-bold text-gray-900 text-lg">{role.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1 leading-relaxed">{role.description}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 flex-1 space-y-2.5">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Access Snapshot</div>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                    {role.permissions.slice(0, 4).map((p, i) => (
                                        <div key={i} className="flex items-start gap-1.5 align-top">
                                            <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                            <div>
                                                <div className="text-[11px] font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{p.module}</div>
                                                <div className="text-[10px] text-gray-500 font-medium">{p.access}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {role.permissions.length > 4 && (
                                        <div className="text-[11px] font-semibold text-purple-600 flex items-center h-full pt-1">
                                            +{role.permissions.length - 4} more module(s)
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 px-6 py-3 flex items-center justify-between border-t border-gray-100/50">
                            <span className="text-[11px] font-medium text-gray-500">
                                {role.permissions.length} total rules configured
                            </span>
                            {!role.isSystemDefault ? (
                                <div className="flex flex-row items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg px-3" onClick={() => openEdit(role)}>
                                        <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Role
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(role)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-gray-400 cursor-not-allowed">
                                    Protected
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}

                {filteredRoles.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 col-span-1 md:col-span-2 shadow-sm">
                        <ShieldCheck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-gray-900 font-bold mb-1">No roles found</h3>
                        <p className="text-gray-500 text-sm mb-4">You haven't created any matching roles yet.</p>
                        <Button variant="outline" onClick={resetForm} className="rounded-xl font-semibold border-gray-200">Create your first custom role</Button>
                    </div>
                )}
            </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
