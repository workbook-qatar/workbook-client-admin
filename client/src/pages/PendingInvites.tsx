import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  RefreshCw,
  XCircle,
  Clock,
  ArrowLeft,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { StaffMember } from "./Workforce";

export default function PendingInvites() {
  const [, setLocation] = useLocation();
  const [invites, setInvites] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("vendor_staff");
    if (stored) {
      const allStaff: StaffMember[] = JSON.parse(stored);
      // Filter only pending/draft/expired/rejected
      const pending = allStaff.filter(s => 
        ["pending", "draft", "expired", "rejected"].includes(s.membershipStatus || "")
      );
      setInvites(pending);
    }
  }, []);

  const filteredInvites = invites.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInviteStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Pending</Badge>;
      case "draft":
        return <Badge variant="outline" className="text-gray-500">Draft</Badge>;
      case "expired":
        return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Expired</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleResendInvite = (id: string) => {
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setLocation("/workforce")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Pending Invites</h1>
                    <p className="text-sm text-muted-foreground">
                    Track and manage sent invitations
                    </p>
                </div>
            </div>
          <Button onClick={() => setLocation("/workforce/add")}>
            <Mail className="h-4 w-4 mr-2" />
            Send New Invite
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg border shadow-sm">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <div className="ml-auto">
                <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Filter className="h-4 w-4" /> Filter Status
                </Button>
            </div>
        </div>

        {/* List */}
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                    <tr>
                        <th className="p-4 text-left font-medium text-muted-foreground">Staff Member</th>
                        <th className="p-4 text-left font-medium text-muted-foreground">Contact</th>
                        <th className="p-4 text-left font-medium text-muted-foreground">Role</th>
                        <th className="p-4 text-left font-medium text-muted-foreground">Invite Status</th>
                        <th className="p-4 text-left font-medium text-muted-foreground">Sent At</th>
                        <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredInvites.length === 0 ? (
                        <tr>
                        <td colSpan={6} className="p-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <Mail className="h-8 w-8 text-gray-300" />
                                <p>No pending invites found.</p>
                            </div>
                        </td>
                        </tr>
                    ) : (
                        filteredInvites.map(staff => (
                        <tr
                            key={staff.id}
                            className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => setLocation(`/workforce/pending/${staff.id}`)}
                        >
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full ${staff.avatarColor || 'bg-gray-200'} flex items-center justify-center text-white font-semibold text-xs`}>
                                    {staff.avatar || staff.name.substring(0, 2)}
                                    </div>
                                    <div>
                                    <p className="font-medium">{staff.name}</p>
                                    <p className="text-xs text-muted-foreground">ID: {staff.staffId || '---'}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs">
                                    <Mail className="h-3 w-3 text-muted-foreground" /> {staff.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                    <Phone className="h-3 w-3 text-muted-foreground" /> {staff.phone}
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex flex-col">
                                    <span className="font-medium">{staff.role}</span>
                                    <span className="text-xs text-muted-foreground capitalize">{staff.roleType}</span>
                                </div>
                            </td>
                            <td className="p-4">
                                {getInviteStatusBadge(staff.membershipStatus)}
                            </td>
                            <td className="p-4 text-xs text-muted-foreground">
                                {staff.inviteSentAt ? (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(staff.inviteSentAt).toLocaleDateString()}
                                    </div>
                                ) : <span className="text-gray-400">Not Sent</span>}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setLocation(`/workforce/pending/${staff.id}`)}}>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleResendInvite(staff.id)}>
                                                <RefreshCw className="h-4 w-4 mr-2" /> Resend Invite
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={(e) => handleCancelInvite(staff.id, e as any)}>
                                                <XCircle className="h-4 w-4 mr-2" /> Cancel Invite
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
