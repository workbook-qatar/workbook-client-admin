import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { OrganizationProvider } from "./contexts/OrganizationContext";
import OrganizationHub from "./pages/OrganizationHub";
import CreateOrganization from "./pages/CreateOrganization";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Bookings from "./pages/Bookings";

import Customers from "./pages/Customers";
import StaffDetails from "./pages/StaffDetails";
import Workforce from "./pages/Workforce";
import AddWorkforceMember from "./pages/AddWorkforceMember";
import AddCustomer from "./pages/AddCustomer";
import Services from "./pages/Services";
import PendingInvites from "./pages/PendingInvites";
import PendingInviteDispatcher from "./pages/PendingInviteDispatcher";
import CreatePackage from "./pages/CreatePackage";
import CreateCategory from "./pages/CreateCategory";
import CreateServiceArea from "./pages/CreateServiceArea";
import ServiceAreasList from "./pages/settings/ServiceAreas";
import ServiceDirectory from "./pages/ServiceDirectory";
import SkillsSettings from "./pages/settings/Skills";
import OrganizationStructure from "./pages/settings/OrganizationStructure";
import EmploymentRules from "./pages/settings/EmploymentRules";
import DocumentsCompliance from "./pages/settings/DocumentsCompliance";
import DataBackup from "./pages/settings/DataBackup";

import Dispatch from "./pages/Dispatch";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Scheduling from "./pages/Scheduling";
import Vehicles from "./pages/Vehicles";
import Finance from "./pages/Finance";
import Quality from "./pages/Quality";
import Communication from "./pages/Communication";
import Integrations from "./pages/Integrations";
import Support from "./pages/Support";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/" component={Dashboard} />
      <Route path="/customers" component={Customers} />
      <Route path="/customers/add" component={AddCustomer} />
      <Route path="/bookings" component={Bookings} />
      <Route path="/scheduling" component={Scheduling} />

      <Route path="/dispatch" component={Dispatch} />
      <Route path="/workforce/pending" component={PendingInvites} />
      <Route path="/workforce/pending/:id" component={PendingInviteDispatcher} />
      <Route path="/workforce" component={Workforce} />
      <Route path="/workforce/add" component={AddWorkforceMember} />
      <Route path="/staff/:id" component={StaffDetails} />
      <Route path="/vehicles" component={Vehicles} />
      <Route path="/services" component={Services} />
      <Route path="/services/create" component={CreatePackage} />
      <Route path="/services/edit/:id" component={CreatePackage} />
      <Route path="/services/category/create" component={CreateCategory} />
      <Route path="/services/category/edit/:id" component={CreateCategory} />

      <Route path="/finance" component={Finance} />
      <Route path="/quality" component={Quality} />
      <Route path="/reports" component={Reports} />
      <Route path="/communication" component={Communication} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/settings" component={Settings} />
      <Route path="/settings/service-areas" component={ServiceAreasList} />
      <Route path="/settings/service-areas/create" component={CreateServiceArea} />
      <Route path="/settings/skills" component={SkillsSettings} />
      <Route path="/settings/organization" component={OrganizationStructure} />
      <Route path="/settings/employment" component={EmploymentRules} />
      <Route path="/settings/documents" component={DocumentsCompliance} />
      <Route path="/settings/data-backup" component={DataBackup} />

      <Route path="/services/directory" component={ServiceDirectory} />
      <Route path="/support" component={Support} />
      
      <Route path="/organizations" component={OrganizationHub} />
      <Route path="/organizations/create" component={CreateOrganization} />

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <OrganizationProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </OrganizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
