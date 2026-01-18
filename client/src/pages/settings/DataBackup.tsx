import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrganization } from "@/contexts/OrganizationContext";
import { 
  Download, 
  Trash2, 
  AlertTriangle, 
  Database, 
  Archive, 
  ShieldAlert,
  Info
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function DataBackup() {
  const { activeOrganization, deleteOrganization } = useOrganization();
  const [, setLocation] = useLocation();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Safely find the org name
  const orgName = activeOrganization?.name || "Organization";

  const handleDelete = async () => {
    if (!activeOrganization) return;
    
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      deleteOrganization(activeOrganization.id);
      setShowDeleteDialog(false);
      setLocation("/organizations"); 
    } catch (error) {
      toast.error("Failed to delete organization");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
           <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent text-muted-foreground" onClick={() => window.history.back()}>
              ← Back to Settings
           </Button>
           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
             <Database className="h-8 w-8 text-blue-600" />
             Data Backup & Lifecycle
           </h1>
           <p className="text-gray-500 mt-2 text-lg">
             Manage your organization's data retention, backups, and lifecycle.
           </p>
        </div>

        {/* Data Backup Card */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Archive className="h-5 w-5" />
              Backup Your Data
            </CardTitle>
            <CardDescription>
              Securely export all your organization's data including projects, customers, and financial records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50/50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-blue-900 font-medium">Why backup?</p>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Regular backups ensure compliance with local data retention laws (e.g., Qatar Financial Regulations) and provide a safety net before making critical changes.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4">
               <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                 <Download className="mr-2 h-4 w-4" />
                 Download Full Backup
               </Button>
               <span className="text-xs text-muted-foreground">Last backup: Never</span>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <div className="pt-8">
          <h2 className="text-red-600 font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </h2>
          <Card className="border-red-200 shadow-sm bg-red-50/10">
            <CardHeader>
              <CardTitle className="text-red-700">Delete Organization</CardTitle>
              <CardDescription className="text-red-600/80">
                Permanently remove this organization and all its data. This action is irreversible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Organization
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center gap-2 text-xl text-gray-900">
               <div className="p-2 bg-red-100 rounded-full">
                 <Trash2 className="h-5 w-5 text-red-600" />
               </div>
               Delete Your Organization
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-6 py-4 space-y-5">
             <p className="text-gray-600">
               You are about to delete your organization <strong>{orgName}</strong> permanently. 
               If you want to keep a backup of your data, take a backup before you proceed.
             </p>

             {/* Warnings */}
             <div className="space-y-3">
               <div className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border-l-4 border-red-500">
                  <span className="font-bold text-red-500 shrink-0">Note:</span>
                  <p>Sometimes, the local law might require you to keep a record of your data for a certain period of time. In such cases, you would need to maintain a backup of your data.</p>
               </div>
               
               <div className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border-l-4 border-orange-400">
                  <span className="font-bold text-orange-500 shrink-0">•</span>
                  <p>All active projects, employee records, and communication history will be permanently erased and cannot be recovered.</p>
               </div>
             </div>

             {/* Backup Info Box */}
             <div className="bg-sky-50 border border-sky-100 rounded-md p-4 flex gap-3">
                <Info className="h-5 w-5 text-sky-600 shrink-0" />
                <div className="text-sm text-sky-900">
                   <p className="font-medium">To backup data for the selected organization:</p>
                   <p className="mt-1">
                     Go to <span className="font-semibold">Settings &gt; Data Backup &gt; Backup Your Data</span>.
                   </p>
                </div>
             </div>
             
             {/* Checkbox */}
             <div className="flex items-center space-x-2 pt-2 cursor-pointer" onClick={() => setDeleteConfirmed(!deleteConfirmed)}>
                <Checkbox 
                  id="confirm-delete" 
                  checked={deleteConfirmed} 
                  onCheckedChange={(checked) => setDeleteConfirmed(checked as boolean)}
                  className="border-gray-400 text-red-600 focus:ring-red-600"
                />
                <label
                  htmlFor="confirm-delete"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                >
                  I want to permanently delete this organization and its contents.
                </label>
             </div>
          </div>

          <DialogFooter className="p-6 pt-2 sm:justify-between bg-gray-50/50 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="bg-white hover:bg-gray-100">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={!deleteConfirmed || isDeleting}
              className="bg-red-600 hover:bg-red-700 min-w-[150px]"
            >
              {isDeleting ? "Deleting..." : "Delete Organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}
