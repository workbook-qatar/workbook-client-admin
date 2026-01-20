import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home,
  Calendar,
  Users,
  UserCog,
  Briefcase,
  BarChart3,
  Settings,
  Bell,
  Plus,
  Search,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Map,
  Truck,
  CalendarClock,
  DollarSign,
  Star,
  MessageSquare,
  Plug,
  HelpCircle,
} from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";

interface DashboardLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
}

const navigationItems = [
  { icon: Home, label: "Home", path: "/", comingSoon: false },
  { icon: Users, label: "Customers", path: "/customers", comingSoon: false },
  { icon: Calendar, label: "Bookings", path: "/bookings", comingSoon: false },
  { icon: Truck, label: "Dispatch", path: "/dispatch", comingSoon: false },
  { icon: UserCog, label: "Workforce", path: "/workforce", comingSoon: false },
  { icon: Briefcase, label: "Services", path: "/services", comingSoon: false },
  { icon: BarChart3, label: "Reports", path: "/reports", comingSoon: false },
  { icon: Settings, label: "Settings", path: "/settings", comingSoon: false },
  { icon: CalendarClock, label: "Scheduling", path: "/scheduling", comingSoon: true },
  { icon: Truck, label: "Vehicles", path: "/vehicles", comingSoon: true },
  { icon: DollarSign, label: "Finance", path: "/finance", comingSoon: true },
  { icon: Star, label: "Quality", path: "/quality", comingSoon: true },
  { icon: MessageSquare, label: "Communication", path: "/communication", comingSoon: true },
  { icon: Plug, label: "Integrations", path: "/integrations", comingSoon: true },
  { icon: HelpCircle, label: "Support", path: "/support", comingSoon: true },
];

export default function DashboardLayout({ children, rightPanel }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(!!rightPanel);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar */}
      <aside
        className={`flex flex-col glass-sidebar transition-all duration-300 z-20 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo Header */}
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {!sidebarCollapsed && (
           <div className="flex items-center justify-start w-full px-5">
             <img src="/workbook-logo.png" alt="workbook" className="h-6 w-auto object-contain" />
           </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent absolute right-2"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {/* Active Modules */}
          <ul className="space-y-1 px-2 mb-6">
            {navigationItems.filter(item => !item.comingSoon).map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground/70"}`} />
                      {!sidebarCollapsed && (
                        <span className="font-medium text-sm">{item.label}</span>
                      )}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Coming Soon Modules */}
          {!sidebarCollapsed && (
            <div className="px-4 mb-2">
              <p className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
                Upcoming Modules
              </p>
            </div>
          )}
          
          <ul className="space-y-1 px-2">
            {navigationItems.filter(item => item.comingSoon).map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors duration-200 group">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded border border-sidebar-border text-sidebar-foreground/40 font-medium uppercase tracking-wider group-hover:border-sidebar-foreground/30 group-hover:text-sidebar-foreground/60">
                            Soon
                          </span>
                        </span>
                      )}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-sidebar-border/50 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                  sidebarCollapsed ? "px-0 justify-center" : ""
                }`}
              >
                <Avatar className="h-8 w-8 ring-2 ring-sidebar-border">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="ml-3 text-left flex-1 overflow-hidden">
                    <p className="text-sm font-bold font-heading truncate">Muhammed Ali</p>
                    <p className="text-xs text-sidebar-foreground/60 truncate" title="muhammed.ali@tartoos.com">muhammed.ali@tartoos.com</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => setLocation("/login")}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Gradient Mesh (Optional for Premium Feel) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none z-0" />

        {/* Top Header Bar */}
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search bookings, customers, staff..."
                className="pl-10 bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <OrganizationSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <p className="text-sm font-semibold mb-2">Notifications</p>
                  <div className="space-y-2">
                    <div className="text-xs p-2 bg-muted rounded">
                      <p className="font-medium">3 Pending Payments</p>
                      <p className="text-muted-foreground">Require immediate attention</p>
                    </div>
                    <div className="text-xs p-2 bg-muted rounded">
                      <p className="font-medium">2 Staff Documents Expiring</p>
                      <p className="text-muted-foreground">Within 7 days</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  New Booking
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  New Customer
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserCog className="mr-2 h-4 w-4" />
                  New Staff Member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content with Optional Right Panel */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">{children}</main>

          {/* Right Context Panel */}
          {rightPanel && rightPanelOpen && (
            <aside className="w-[40%] bg-card border-l border-border overflow-y-auto">
              <div className="sticky top-0 bg-card border-b border-border p-4 flex justify-between items-center">
                <h3 className="font-semibold">Details</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRightPanelOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">{rightPanel}</div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
