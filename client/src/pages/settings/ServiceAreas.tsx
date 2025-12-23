import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Plus, MapPin, Map, ArrowRight, TrendingUp } from "lucide-react";

// --- Mock Data ---
export const MOCK_SERVICE_AREAS = [
  { id: "sa-1", name: "Doha Central", zones: ["1", "2", "3", "4"], status: "active", packagesCount: 12, region: "Doha" },
  { id: "sa-2", name: "West Bay Premium", zones: ["60", "61", "66"], status: "active", packagesCount: 5, region: "Doha" },
  { id: "sa-3", name: "Al Wakrah", zones: ["90", "91"], status: "active", packagesCount: 3, region: "Al Wakrah" },
  { id: "sa-4", name: "The Pearl Qatar", zones: ["66"], status: "active", packagesCount: 8, region: "Doha" },
  { id: "sa-5", name: "Lusail City", zones: ["69", "70"], status: "inactive", packagesCount: 0, region: "Al Daayen" },
  { id: "sa-6", name: "Al Rayyan", zones: ["51", "52", "53"], status: "active", packagesCount: 4, region: "Al Rayyan" },
];

export default function ServiceAreasList() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAreas = MOCK_SERVICE_AREAS.filter(area => 
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    area.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50/50">
        
        {/* Header */}
        <div className="px-8 py-6 border-b bg-white flex items-center justify-between sticky top-0 z-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Service Coverage</h1>
                <p className="text-sm text-gray-500 mt-1">Define geographical zones where you provide services.</p>
            </div>
            <Button onClick={() => setLocation("/settings/service-areas/create")} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20">
                <Plus className="h-4 w-4" />
                Create New Area
            </Button>
        </div>

        {/* Content */}
        <div className="p-8 max-w-5xl mx-auto w-full">
            
            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                    placeholder="Search by area name or region..." 
                    className="pl-10 h-10 bg-white border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredAreas.map(area => (
                    <Card key={area.id} className="p-5 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group bg-white border-gray-100" onClick={() => {}}>
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                                    {area.name}
                                    <span className="text-xs font-normal text-gray-400 border px-1.5 py-0.5 rounded bg-gray-50">{area.region}</span>
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <Map className="h-3.5 w-3.5" />
                                        {area.zones.length} Zones
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="flex items-center gap-1.5">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        Used in {area.packagesCount} packages
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    area.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {area.status === 'active' ? 'Active' : 'Hidden'}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-blue-600">
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </Card>
                ))}

                {filteredAreas.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                        <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Map className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No areas found</h3>
                        <p className="text-gray-500 mt-1">No service areas match your search for "{searchQuery}"</p>
                    </div>
                )}
            </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
