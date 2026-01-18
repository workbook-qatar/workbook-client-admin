import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Map, 
  Building2, 
  FileText, 
  ScrollText,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Settings() {
  const [, setLocation] = useLocation();

  const handleFeatureClick = () => {
    toast.info("Feature coming soon", {
      description: "This settings module is under development.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your application settings, workforce configurations, and preferences</p>
        </div>

        <div className="space-y-8">
          {/* Section: Workforce Configuration */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Workforce Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Organization & Roles (Merged) */}
              <Card className="glass-panel cursor-pointer hover:shadow-md transition-all border-blue-100 group" onClick={() => setLocation('/settings/organization')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-blue-100/50 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <Building2 className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    Organization & Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Manage departments, teams, and job titles
                  </p>
                </CardContent>
              </Card>

              {/* Employment & Schedule (Merged) */}
              <Card className="glass-panel cursor-pointer hover:shadow-md transition-all border-teal-100 group" onClick={() => setLocation('/settings/employment')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-teal-100/50 rounded-lg group-hover:bg-teal-600 transition-colors">
                      <FileText className="h-5 w-5 text-teal-600 group-hover:text-white transition-colors" />
                    </div>
                    Employment & Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Configure contracts, working hours, and shift templates
                  </p>
                </CardContent>
              </Card>

              {/* Skills & Competency */}
              <Card className="glass-panel cursor-pointer hover:shadow-md transition-all border-cyan-100 group" onClick={() => setLocation('/settings/skills')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-cyan-100/50 rounded-lg group-hover:bg-cyan-600 transition-colors">
                      <SettingsIcon className="h-5 w-5 text-cyan-600 group-hover:text-white transition-colors" />
                    </div>
                    Skills & Competency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Manage skills registry, languages, and qualifications
                  </p>
                </CardContent>
              </Card>

              {/* Documents & Compliance */}
              <Card className="glass-panel cursor-pointer hover:shadow-md transition-all border-rose-100 group" onClick={() => setLocation('/settings/documents')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-rose-100/50 rounded-lg group-hover:bg-rose-600 transition-colors">
                      <ScrollText className="h-5 w-5 text-rose-600 group-hover:text-white transition-colors" />
                    </div>
                    Documents & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Manage required documents, expiry rules, and policies
                  </p>
                </CardContent>
              </Card>

              {/* Service Areas */}
              <Card className="glass-panel cursor-pointer hover:shadow-md transition-all border-violet-100 group" onClick={() => setLocation('/settings/service-areas')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-violet-100/50 rounded-lg group-hover:bg-violet-600 transition-colors">
                      <Map className="h-5 w-5 text-violet-600 group-hover:text-white transition-colors" />
                    </div>
                    Service Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Define geographical zones and service coverage areas
                  </p>
                </CardContent>
              </Card>

            </div>
          </section>

          {/* Section: General Settings */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-panel cursor-pointer hover:shadow-md transition-all border-gray-100 group" onClick={handleFeatureClick}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-600 transition-colors">
                      <User className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Update your personal information and account details
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel cursor-pointer hover:shadow-md transition-all border-orange-100 group" onClick={handleFeatureClick}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-orange-100/50 rounded-lg group-hover:bg-orange-600 transition-colors">
                      <Bell className="h-5 w-5 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Configure notification preferences and alerts
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel cursor-pointer hover:shadow-md transition-all border-purple-100 group" onClick={handleFeatureClick}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-purple-100/50 rounded-lg group-hover:bg-purple-600 transition-colors">
                      <Shield className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Manage password, 2FA, and security settings
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel cursor-pointer hover:shadow-md transition-all border-green-100 group" onClick={handleFeatureClick}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-green-100/50 rounded-lg group-hover:bg-green-600 transition-colors">
                      <CreditCard className="h-5 w-5 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    Billing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    View billing history and manage payment methods
                  </p>
                </CardContent>
              </Card>

              {/* Data Backup & Lifecycle */}
              <Card className="glass-panel cursor-pointer hover:shadow-md transition-all border-blue-100 group" onClick={() => setLocation('/settings/data-backup')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-blue-100/50 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <Database className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    Data Backup & Lifecycle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                     Manage data retention, backups, and organization deletion
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
