import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function Reports() {
  const handleFeatureClick = () => {
    toast.info("Feature coming soon", {
      description: "Reports and analytics features are under development.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and view business reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-panel cursor-pointer hover:bg-card/90 transition-all border-blue-100 group" onClick={handleFeatureClick}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-blue-100/50 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <BarChart3 className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                Revenue Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed revenue breakdown by service, staff, and time period
              </p>
              <Button variant="outline" className="w-full bg-white/50 border-blue-200 hover:bg-blue-50" onClick={handleFeatureClick}>
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-panel cursor-pointer hover:bg-card/90 transition-all border-green-100 group" onClick={handleFeatureClick}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-green-100/50 rounded-lg group-hover:bg-green-600 transition-colors">
                  <TrendingUp className="h-5 w-5 text-green-600 group-hover:text-white transition-colors" />
                </div>
                Performance Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Staff performance metrics and customer satisfaction scores
              </p>
              <Button variant="outline" className="w-full bg-white/50 border-green-200 hover:bg-green-50" onClick={handleFeatureClick}>
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-panel cursor-pointer hover:bg-card/90 transition-all border-purple-100 group" onClick={handleFeatureClick}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-purple-100/50 rounded-lg group-hover:bg-purple-600 transition-colors">
                   <FileText className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                Booking Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive booking statistics and trends analysis
              </p>
              <Button variant="outline" className="w-full bg-white/50 border-purple-200 hover:bg-purple-50" onClick={handleFeatureClick}>
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
