
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useOrganization, Organization } from "@/contexts/OrganizationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  Check,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Trash2,
  LogOut,
  Star,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Organization Card Component
const OrganizationCard = ({
  org,
  isActive,
  onSwitch,
  onMarkDefault,
  onLeave,
  onDelete
}: {
  org: Organization;
  isActive: boolean;
  onSwitch: (id: string) => void;
  onMarkDefault: (id: string) => void;
  onLeave: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className={`relative flex items-center justify-between p-6 bg-white rounded-lg border transition-all duration-200 ${isActive ? 'border-blue-100 shadow-sm ring-1 ring-blue-50' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
      {org.isDefault && (
        <div className="absolute -top-2.5 -left-2.5">
          <Badge className="bg-[#00c06a] hover:bg-[#00c06a] text-white border-none rounded px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider shadow-sm">
            DEFAULT
          </Badge>
        </div>
      )}
      
      <div className="flex items-start gap-6">
        <div className="h-20 w-20 bg-gray-50/50 rounded-lg border border-gray-100 flex items-center justify-center shrink-0 mt-1">
           {org.logoUrl ? (
             <img src={org.logoUrl} alt={org.name} className="h-10 w-10 object-contain opacity-80" />
           ) : (
             <Building2 className="h-8 w-8 text-gray-400" />
           )}
        </div>
        
        <div className="flex flex-col gap-1 w-full max-w-2xl">
          <h3 className="font-heading font-medium text-lg leading-tight text-gray-900">
            {org.name}
          </h3>
          
          {org.edition && (
             <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-red-500 bg-red-50 px-2 py-1 w-fit mt-1 rounded-sm">
               {org.edition} TRIAL
             </span>
          )}

          <p className="text-sm text-gray-400 italic mt-2">
            Organization created on {new Date(org.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          
          <div className="space-y-1 mt-3 text-sm">
            <div className="flex items-center gap-2">
                <span className="text-gray-400 font-normal">Organization ID:</span>
                <span className="font-medium text-gray-900">{org.id}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-gray-400 font-normal">Edition:</span> 
                <span className="font-medium text-gray-900">{org.location}</span>
            </div>
          </div>
            
          <p className="text-sm text-gray-500 mt-3 font-normal">
               You are an <span className="font-bold text-gray-900">{org.role}</span> in this organization
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {isActive ? (
             <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold tracking-wide">
                <Check className="h-3.5 w-3.5" />
                Active
             </div>
        ) : (
            <Button 
               variant="outline"
               className="hidden sm:flex bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
               onClick={() => onSwitch(org.id)}
            >
              Go to Organization
            </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Manage</DropdownMenuLabel>
            {!isActive && (
                 <DropdownMenuItem onClick={() => onSwitch(org.id)}>
                   Go to Organization
                 </DropdownMenuItem>
            )}
            {!org.isDefault && (
               <DropdownMenuItem onClick={() => onMarkDefault(org.id)}>
                 Mark as Default
               </DropdownMenuItem>
            )}
            <Separator className="my-1" />
            <DropdownMenuItem onClick={() => onLeave(org.id)} className="text-orange-600">
               Leave Organization
            </DropdownMenuItem>
            {org.role === 'admin' && (
                <DropdownMenuItem onClick={() => onDelete(org.id)} className="text-red-600 focus:text-red-600">
                   <Trash2 className="mr-2 h-4 w-4" /> Delete Organization
                </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default function OrganizationHub() {
  const { 
    activeOrganization, 
    availableOrganizations, 
    switchOrganization, 
    markAsDefault,
    deleteOrganization 
  } = useOrganization();
  
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [alertMessage, setAlertMessage] = useState<{ type: 'error' | 'success', message: string, title?: string } | null>(null);

  // Dialog States
  const [orgToAction, setOrgToAction] = useState<Organization | null>(null);
  const [dialogType, setDialogType] = useState<'leave' | 'delete' | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Handle Create Action from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "create") {
       setLocation("/organizations/create");
    }
  }, []);

  const handleLeaveRequest = (org: Organization) => {
      setAlertMessage(null); // Clear previous alerts
      
      // Simulate "Only Admin" check
      if (org.role === 'admin') {
          setAlertMessage({
              type: 'error',
              title: `You cannot leave this organization ${org.name} as you're the only Admin in this organization.`,
              message: "You can make another user an Admin and leave, or delete the organization."
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
      }

      setOrgToAction(org);
      setDialogType('leave');
  };

  const handleDeleteRequest = (org: Organization) => {
      setAlertMessage(null);
      setDeleteConfirmation("");
      setOrgToAction(org);
      setDialogType('delete');
  };

  const confirmAction = () => {
      if (!orgToAction) return;

      if (dialogType === 'leave') {
          // Call leave logic (mocked/console for now)
          console.log("Leaving organization:", orgToAction.id);
          // In real app: leaveOrganization(orgToAction.id);
      } else if (dialogType === 'delete') {
          deleteOrganization(orgToAction.id);
      }
      
      setOrgToAction(null);
      setDialogType(null);
  };

  const filteredOrgs = availableOrganizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    org.id.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Alerts */}
        {alertMessage && (
            <div className={`p-4 rounded-md border flex items-start gap-3 relative ${
                alertMessage.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-green-50 border-green-200 text-green-900'
            }`}>
                <div className="shrink-0 mt-0.5">
                    {alertMessage.type === 'error' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : (
                        <Check className="h-5 w-5 text-green-600" />
                    )}
                </div>
                <div className="pr-8">
                    <p className="font-medium text-sm">
                        {alertMessage.title}
                    </p>
                    {alertMessage.message && (
                        <p className="text-sm mt-1 opacity-90">
                            {alertMessage.message}
                        </p>
                    )}
                </div>
                <button 
                    onClick={() => setAlertMessage(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div>
             <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent text-muted-foreground transition-colors hover:text-foreground" onClick={() => window.history.back()}>
                ← Back
             </Button>
             <h1 className="text-3xl font-heading font-bold text-foreground">Manage Organizations</h1>
             <p className="text-muted-foreground mt-1">
               You are a member of <span className="font-semibold text-foreground">{availableOrganizations.length}</span> organizations.
             </p>
          </div>
          
          <Button 
            size="lg" 
            className="shadow-sm hover:shadow-md transition-all bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setLocation("/organizations/create")}
          >
            <Plus className="mr-2 h-5 w-5" />
            New Organization
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search organizations by name or ID..." 
            className="pl-10 h-12 text-lg bg-background shadow-sm border-gray-200 focus:border-blue-500 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Organizations List */}
        <div className="grid gap-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground pb-2 ml-1">
            <span>My Organizations</span>
            <span>{filteredOrgs.length} results</span>
          </div>
          
          {filteredOrgs.length === 0 ? (
             <div className="text-center py-20 bg-background rounded-xl border border-dashed">
                <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No organizations found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms.</p>
             </div>
          ) : (
            filteredOrgs.map((org) => (
              <OrganizationCard
                key={org.id}
                org={org}
                isActive={activeOrganization?.id === org.id}
                onSwitch={switchOrganization}
                onMarkDefault={markAsDefault}
                onLeave={() => handleLeaveRequest(org)}
                onDelete={() => handleDeleteRequest(org)}
              />
            ))
          )}
        </div>
      </div>
      
      
      {/* Leave Confirmation Dialog */}
      <AlertDialog open={!!orgToAction && dialogType === 'leave'} onOpenChange={(open) => !open && setOrgToAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Organization?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave <strong>{orgToAction?.name}</strong>?
              <br/><br/>
              You will lose access to all resources, projects, and member data within this organization immediately. You will need to be re-invited to join again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Leave Organization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog (Detailed Reference Style) */}
      <Dialog open={!!orgToAction && dialogType === 'delete'} onOpenChange={(open) => !open && setOrgToAction(null)}>
        <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center gap-2 text-xl text-gray-900">
               <div className="p-2 bg-red-100 rounded-full">
                 <Trash2 className="h-5 w-5 text-red-600" />
               </div>
               Delete Your Organization
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-6 py-4 space-y-5">
             <p className="text-gray-600 text-sm">
               You are about to delete your organization <strong>{orgToAction?.name}</strong> permanently. 
               If you want to keep a backup of your data, take a backup before you proceed.
             </p>

             {/* Warnings */}
             <div className="space-y-3">
               <div className="flex gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-md border-l-4 border-red-500">
                  <span className="font-bold text-red-500 shrink-0">Note:</span>
                  <p>Sometimes, the local law might require you to keep a record of your data for a certain period of time. In such cases, you would need to maintain a backup of your data.</p>
               </div>
               
               <div className="flex gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-md border-l-4 border-orange-400">
                  <span className="font-bold text-orange-500 shrink-0">•</span>
                  <p>All active projects, employee records, invoices, and communication history will be permanently erased and cannot be recovered.</p>
               </div>
             </div>

             {/* Backup Info Box */}
             <div className="bg-sky-50 border border-sky-100 rounded-md p-3 flex gap-3">
                <div className="bg-sky-200 rounded-full p-0.5 h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                   <span className="text-sky-700 font-bold text-xs">i</span>
                </div>
                <div className="text-xs text-sky-900 leading-relaxed">
                   <p className="font-semibold inline">To backup data for the selected organization:</p>
                   <span> Go to your Organization &gt; Settings &gt; Data Backup &gt; Backup Your Data. </span>
                   <a href="#" className="text-blue-600 hover:underline" onClick={(e) => { e.preventDefault(); setLocation('/settings/data-backup'); }}>Learn More</a>
                </div>
             </div>
             
             {/* Checkbox */}
             <div className="flex items-center space-x-2 pt-2 cursor-pointer" onClick={() => setDeleteConfirmation(deleteConfirmation === "checked" ? "" : "checked")}>
                <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${deleteConfirmation === "checked" ? "bg-red-600 border-red-600" : "border-gray-400 bg-white"}`}>
                    {deleteConfirmation === "checked" && <Check className="h-3 w-3 text-white" />}
                </div>
                <label className="text-sm font-medium leading-none cursor-pointer select-none text-gray-700">
                  I want to permanently delete this organization and its contents.
                </label>
             </div>
          </div>

          <DialogFooter className="p-6 pt-4 sm:justify-start gap-3 bg-gray-50/50 border-t border-gray-100">
            <Button 
              variant="destructive" 
              onClick={confirmAction}
              disabled={deleteConfirmation !== "checked"}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Organization
            </Button>
            <Button
              variant="outline"
              onClick={() => setOrgToAction(null)}
              className="bg-white hover:bg-gray-100 text-gray-700"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
