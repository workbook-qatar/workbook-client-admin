
import {
  ChevronsUpDown,
  Plus,
  Settings,
  Building2,
  Check,
  Search,
  LayoutGrid,
  Copy
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useOrganization } from "@/contexts/OrganizationContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function OrganizationSwitcher() {
  const { activeOrganization, availableOrganizations, switchOrganization } =
    useOrganization();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  if (!activeOrganization) return null;

  const filteredOrgs = availableOrganizations.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase()) || 
    org.id.includes(search.toLowerCase())
  );

  const handleSwitch = (orgId: string) => {
    switchOrganization(orgId);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-[280px] justify-between border-border/60 bg-background/50 backdrop-blur-sm hidden md:flex hover:bg-accent hover:text-accent-foreground mr-2 group transition-all"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 shadow-sm group-hover:from-gray-200 group-hover:to-gray-300 transition-all">
               {activeOrganization.logoUrl ? (
                  <img src={activeOrganization.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-md" />
               ) : (
                  <Building2 className="w-4 h-4 opacity-70" />
               )}
            </div>
            <div className="flex flex-col items-start text-left overflow-hidden">
              <span className="text-sm font-semibold truncate w-full">
                {activeOrganization.name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate w-full font-mono">
                 Organization ID: {activeOrganization.id} 
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0 flex flex-col bg-background">
        <SheetHeader className="p-5 border-b border-border/40 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-semibold">
            My Organizations
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-0 space-y-0">
               {availableOrganizations.map((org) => {
                 const isActive = activeOrganization.id === org.id;
                 const handleCopyId = (e: React.MouseEvent, id: string) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(id);
                    // Could add a toast here
                 };

                 return (
                  <div key={org.id} className="relative group/item">
                    <button
                        onClick={() => {
                            if (!isActive) handleSwitch(org.id);
                        }}
                        className={`w-full text-left pl-4 py-4 pr-8 flex items-center gap-4 transition-all hover:bg-muted/40 border-b border-border/40 ${
                            isActive ? "bg-primary/5" : ""
                        }`}
                    >
                        <Avatar className="h-10 w-10 border border-border/50 bg-white shadow-sm rounded-lg shrink-0">
                            {org.logoUrl ? (
                            <AvatarImage src={org.logoUrl} alt={org.name} />
                            ) : (
                            <AvatarFallback className={`${isActive ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted/30"}`}>
                                <Building2 className="h-5 w-5 opacity-70" />
                            </AvatarFallback>
                            )}
                        </Avatar>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-center pr-2">
                            <h4 className={`text-sm truncate w-full ${isActive ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
                                {org.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground w-full overflow-hidden">
                                <span className="text-muted-foreground/70 shrink-0 whitespace-nowrap">
                                    Organization ID: <span className="font-mono text-foreground/80">{org.id}</span>
                                </span>
                                <div 
                                    role="button"
                                    onClick={(e) => handleCopyId(e, org.id)}
                                    className="p-1 rounded-md hover:bg-muted text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer shrink-0"
                                    title="Copy Organization ID"
                                >
                                    <Copy className="h-3 w-3" />
                                </div>
                                <span className="text-muted-foreground/40 shrink-0">•</span>
                                <span className="truncate whitespace-nowrap">{org.edition}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-center pl-2 shrink-0 h-full w-8"> 
                        {isActive && (
                            <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm">
                                <Check className="h-3.5 w-3.5" />
                            </div>
                        )}
                        </div>
                    </button>
                  </div>
                 );
               })}
             </div>
        </ScrollArea>

         

        
        <SheetFooter className="p-4 border-t border-border/40 bg-muted/5 flex flex-col gap-3 sm:justify-between">
             <Button 
               variant="default" 
               className="w-full gap-2"
               onClick={() => {
                 setOpen(false);
                 setLocation("/organizations");
               }}
            >
              <Settings className="h-4 w-4" />
              Manage Organizations
            </Button>
             <Button 
               variant="outline" 
               className="w-full gap-2 border-dashed bg-background hover:border-primary hover:text-primary"
               onClick={() => {
                 setOpen(false);
                 setLocation("/organizations/create");
               }}
            >
              <Plus className="h-4 w-4" />
              New Organization
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

