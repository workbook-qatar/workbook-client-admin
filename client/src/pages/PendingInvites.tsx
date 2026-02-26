import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, Mail, RefreshCw, Trash2, Clock, 
  ArrowLeft, Filter, Layers, Truck, Briefcase, UserCheck, CheckCircle2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Phone, Send, Plus
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { StaffMember } from "./Workforce";

const STYLES = {
  card: "bg-white border-gray-200 shadow-sm",
  badge: {
    pending: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 shadow-none",
    draft: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 shadow-none",
    expired: "bg-red-100 text-red-700 hover:bg-red-100 border-0 shadow-none",
    rejected: "bg-red-100 text-red-700 hover:bg-red-100 border-0 shadow-none",
    accepted: "bg-green-100 text-green-700 hover:bg-green-100 border-0 shadow-none"
  }
};

const ROLE_CATEGORIES = [
  { id: 'Field Service', name: 'Field Service Staff', icon: UserCheck },
  { id: 'driver', name: 'Driver', icon: Truck },
  { id: 'Internal Staff', name: 'Internal Staff', icon: Briefcase },
];

export default function PendingInvites() {
  const [, setLocation] = useLocation();
  const [invites, setInvites] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const stored = localStorage.getItem("vendor_staff");
    if (stored) {
      const allStaff: StaffMember[] = JSON.parse(stored).map((s: any) => ({
        ...s,
        roleType: s.roleType === "field" ? "Field Service" : s.roleType === "office" ? "Internal Staff" : s.roleType
      }));
      // Filter only pending/draft/expired/rejected
      const pending = allStaff.filter(s => 
        ["pending", "draft", "expired", "rejected", "accepted"].includes(s.membershipStatus || "")
      );
      
      // Add Dummy Accepted if not present (for UI review)
      if (!pending.find(p => p.membershipStatus === 'accepted')) {
          pending.push({
              id: "dummy-accepted-1",
              staffId: "WB-ACC",
              name: "Reviewer Validated",
              role: "Supervisor",
              roleType: "Internal Staff",
              email: "reviewer@workbook.com",
              phone: "+974 5000 1000",
              location: "Qatar",
              status: "offline", 
              employmentStatus: "Active",
              membershipStatus: "accepted",
              inviteSentAt: new Date().toISOString(),
              avatar: "RV",
              avatarColor: "bg-green-600",
              emailVerified: true,
              phoneVerified: true
          });
      }

      setInvites(pending);
    }
  }, []);

  const categoriesWithCounts = ROLE_CATEGORIES.map(rc => ({
      ...rc,
      count: invites.filter(p => p.roleType === rc.id).length
  }));

  const filteredInvites = invites.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole ? s.roleType === selectedRole : true;
      return matchesSearch && matchesRole;
  });

  const paginatedInvites = filteredInvites.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredInvites.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    handlePageChange(1);
  }, [searchQuery, selectedRole]);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    setIsTableLoading(true);
    setTimeout(() => {
        setCurrentPage(newPage);
        setIsTableLoading(false);
    }, 400); // UI illusion transition
  };

  const getInviteStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className={STYLES.badge.pending}>Pending</Badge>;
      case "draft":
        return <Badge className={STYLES.badge.draft}>Draft</Badge>;
      case "expired":
        return <Badge className={STYLES.badge.expired}>Expired</Badge>;
      case "rejected":
        return <Badge className={STYLES.badge.rejected}>Rejected</Badge>;
      case "accepted":
        return <Badge className={STYLES.badge.accepted}>Accepted</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 bg-gray-50">{status}</Badge>;
    }
  };

  const handleResendInvite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = invites.map(s => s.id === id ? { ...s, inviteSentAt: new Date().toISOString(), membershipStatus: "pending" as const } : s);
    setInvites(updated);
    
    // Update generic storage
    const stored = localStorage.getItem("vendor_staff");
    if (stored) {
        let all = JSON.parse(stored);
        all = all.map((s: any) => s.id === id ? { ...s, inviteSentAt: new Date().toISOString(), membershipStatus: "pending" } : s);
        localStorage.setItem("vendor_staff", JSON.stringify(all));
    }
    toast.success("Invite resent successfully");
  };

  const handleCancelInvite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to cancel this invite? This will remove the draft.");
    if (!confirmed) return;

    // Remove from local state
    setInvites(prev => prev.filter(s => s.id !== id));

    // Update generic storage
    const stored = localStorage.getItem("vendor_staff");
    if (stored) {
        let all = JSON.parse(stored);
        all = all.filter((s: any) => s.id !== id);
        localStorage.setItem("vendor_staff", JSON.stringify(all));
    }
    toast.success("Invite cancelled and removed.");
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-gray-50/50">
        
        {/* Page Header */}
        <div className="px-8 py-6 border-b bg-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-lg h-9 w-9 text-gray-500" onClick={() => setLocation("/workforce")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Pending Invites</h1>
                    <p className="text-muted-foreground text-sm mt-1">Track and manage sent invitations grouped by roles</p>
                </div>
            </div>
            <div className="flex gap-3">
                 <Button size="sm" onClick={() => setLocation("/workforce?invite=true")} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20 px-4 h-10">
                    <Plus className="h-4 w-4" />
                    Invite User
                </Button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden p-8">
            <div className="max-w-[1600px] mx-auto h-full flex flex-col">
                
                {/* Search & Filters Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 w-full max-w-[350px]">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search by name or email..." 
                                className="pl-9 h-10 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500 shadow-sm transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <Button variant="outline" size="sm" className="h-10 px-4 gap-2 bg-white border-gray-200 shadow-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                             <Filter className="h-4 w-4" /> Filter Status
                         </Button>
                    </div>
                </div>

                {/* Content Area - Split View */}
                <div className="flex-1 min-h-0 flex gap-6">
                    
                    {/* LEFT PANEL: Role Categories */}
                    <Card className={`w-[280px] flex flex-col flex-none ${STYLES.card} h-full overflow-hidden rounded-xl border border-gray-200 shadow-sm`}>
                        <div className="p-4 border-b flex items-center justify-between bg-gray-50/80 backdrop-blur-sm">
                            <h3 className="font-bold text-sm text-gray-900 tracking-wide uppercase text-xs">Role Selection</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-white">
                            <button
                                onClick={() => setSelectedRole(null)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all ${
                                    selectedRole === null ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 font-medium'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="h-4 w-4 opacity-70" />
                                    <span>All Roles</span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedRole === null ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {invites.length}
                                </span>
                            </button>
                            
                            {categoriesWithCounts.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedRole(cat.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all ${
                                        selectedRole === cat.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 font-medium'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <cat.icon className="h-4 w-4 opacity-70" />
                                        <span>{cat.name}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedRole === cat.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {cat.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* RIGHT PANEL: Invites Table */}
                    <Card className={`flex-1 flex flex-col ${STYLES.card} h-full overflow-hidden rounded-xl border border-gray-200 shadow-sm`}>
                        <div className="flex-1 overflow-auto bg-white">
                            <Table>
                                <TableHeader className="bg-gray-50/90 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[300px] text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Name</TableHead>
                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Email</TableHead>
                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Role</TableHead>
                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Invite Status</TableHead>
                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Sent At</TableHead>
                                        <TableHead className="text-end text-xs font-semibold uppercase tracking-wider text-gray-500 py-4 px-5">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isTableLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-48 text-center bg-white">
                                                <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                                                    <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                                                    <span className="text-sm">Loading invites...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredInvites.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-48 text-center text-muted-foreground bg-white">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center">
                                                        <Mail className="h-6 w-6 text-gray-300" />
                                                    </div>
                                                    <p className="text-sm text-gray-500">No pending invites found in this category.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedInvites.map(staff => (
                                            <TableRow 
                                                key={staff.id} 
                                                className="group hover:bg-blue-50/40 border-b border-gray-100 cursor-pointer transition-colors bg-white"
                                                onClick={() => setLocation(`/workforce/pending/${staff.id}`)}
                                            >
                                                <TableCell className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 rounded-full ${staff.avatarColor || 'bg-gray-200'} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm border-2 border-white`}>
                                                            {staff.avatar || staff.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col py-0.5">
                                                            <span className="font-semibold text-sm text-gray-900 leading-tight truncate max-w-[200px]">{staff.name}</span>
                                                            <span className="text-xs text-muted-foreground mt-0.5 font-medium">{staff.staffId ? `ID: ${staff.staffId}` : 'No ID yet'}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                        <span className="truncate max-w-[200px]">{staff.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-3.5">
                                                    <div className="flex items-center">
                                                        <span className="text-sm text-gray-700 font-medium capitalize">
                                                            {staff.roleType === 'Field Service' ? 'Field Service Staff' : staff.roleType}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-3.5">
                                                    {getInviteStatusBadge(staff.membershipStatus)}
                                                </TableCell>
                                                <TableCell className="px-5 py-3.5">
                                                    {staff.inviteSentAt ? (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {new Date(staff.inviteSentAt).toLocaleDateString()}
                                                            </span>
                                                            <span className="text-xs text-gray-500 font-medium">
                                                                {new Date(staff.inviteSentAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic text-xs">Not Sent</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-end px-5 py-3.5">
                                                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 transition-colors"
                                                            onClick={(e) => handleResendInvite(staff.id, e)}
                                                            title="Resend Invite"
                                                        >
                                                            <RefreshCw className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-colors"
                                                            onClick={(e) => handleCancelInvite(staff.id, e)}
                                                            title="Cancel Invite"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="border-t border-gray-200 bg-gray-50 p-3 flex items-center justify-between shrink-0">
                            <div className="text-xs text-gray-500 font-medium">
                                Showing <span className="font-bold text-gray-900">{filteredInvites.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span> to <span className="font-bold text-gray-900">{Math.min(filteredInvites.length, currentPage * ITEMS_PER_PAGE)}</span> of <span className="font-bold text-gray-900">{filteredInvites.length}</span> results
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1 || isTableLoading}
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1 || isTableLoading}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="text-xs font-semibold px-3 min-w-[4rem] text-center text-gray-700 flex items-center justify-center">
                                    {isTableLoading ? (
                                        <span className="animate-pulse bg-gray-200 rounded h-4 w-10 inline-block"/>
                                    ) : (
                                        `Page ${currentPage} of ${totalPages}`
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages || isTableLoading}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-gray-900 border-gray-200 bg-white shadow-sm"
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages || isTableLoading}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
