import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Check, Save } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Mock Data: Qatar Zones (Simplified for MVP) ---
// In a real app, this would be GeoJSON. Here we use 
// simple grid/polygons for visual representation in SVG.
const QATAR_ZONES = [
  { id: "1", number: "1", name: "Al Dafna", x: 60, y: 40, w: 10, h: 10, color: "#3b82f6" },
  { id: "2", number: "2", name: "Al Qassar", x: 70, y: 35, w: 8, h: 8, color: "#3b82f6" },
  { id: "3", number: "3", name: "Al Corniche", x: 65, y: 50, w: 12, h: 6, color: "#3b82f6" },
  { id: "4", number: "4", name: "Al Bidda", x: 55, y: 50, w: 10, h: 8, color: "#3b82f6" },
  { id: "5", number: "5", name: "Al Souq", x: 60, y: 58, w: 8, h: 6, color: "#3b82f6" },
  { id: "6", number: "6", name: "Al Salata", x: 68, y: 56, w: 7, h: 6, color: "#3b82f6" },
  { id: "7", number: "7", name: "Rawdat Al Khail", x: 50, y: 60, w: 12, h: 10, color: "#3b82f6" },
  { id: "8", number: "8", name: "Al Mansoura", x: 62, y: 64, w: 8, h: 8, color: "#3b82f6" },
  // ... Adding more zones to fill the specific "Doha" area representation
  { id: "10", number: "10", name: "Doha Port", x: 75, y: 50, w: 10, h: 10, color: "#3b82f6" },
  { id: "11", number: "11", name: "Al Najada", x: 58, y: 55, w: 5, h: 5, color: "#3b82f6" },
  { id: "12", number: "12", name: "Mushayrib", x: 53, y: 55, w: 5, h: 5, color: "#3b82f6" },
  { id: "20", number: "20", name: "Madinat Khalifa", x: 40, y: 30, w: 15, h: 10, color: "#3b82f6" },
  { id: "21", number: "21", name: "Bin Omran", x: 45, y: 40, w: 10, h: 8, color: "#3b82f6" },
  { id: "30", number: "30", name: "Duhail", x: 40, y: 15, w: 20, h: 15, color: "#3b82f6" },
  { id: "40", number: "40", name: "Rayyan", x: 10, y: 40, w: 25, h: 20, color: "#3b82f6" },
  { id: "50", number: "50", name: "Industrial Area", x: 20, y: 70, w: 30, h: 20, color: "#f59e0b" }, // Industrial
  { id: "60", number: "60", name: "West Bay Lagoon", x: 65, y: 20, w: 15, h: 15, color: "#3b82f6" },
  { id: "66", number: "66", name: "Pearl Qatar", x: 80, y: 15, w: 15, h: 15, color: "#8b5cf6" }, // Special
];

export default function CreateServiceArea() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Derived State
  const filteredZones = QATAR_ZONES.filter(
    z => z.number.includes(searchQuery) || z.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSaveEnabled = name.trim().length > 0 && selectedZones.length > 0;

  // Handlers
  const toggleZone = (id: string) => {
    setSelectedZones(prev => 
      prev.includes(id) 
        ? prev.filter(z => z !== id) 
        : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!isSaveEnabled) return;

    // Persist to LocalStorage
    const newArea = {
        id: `sa-${Date.now()}`,
        name: name,
        zones: selectedZones,
        zoneCount: selectedZones.length
    };

    const existing = localStorage.getItem("vendor_service_areas");
    const list = existing ? JSON.parse(existing) : [];
    list.push(newArea);
    localStorage.setItem("vendor_service_areas", JSON.stringify(list));

    toast.success("Service Area Created", {
      description: `${name} with ${selectedZones.length} zones saved successfully.`
    });
    // Simulate API call delay
    setTimeout(() => setLocation("/services"), 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)] w-full bg-gray-50/50 overflow-hidden">
        
        {/* Left Panel: Zone List */}
        <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col flex-none z-10 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Qatar Zones</h2>
            <p className="text-xs text-gray-500 mt-1">Select coverage areas</p>
          </div>
          
          <div className="p-3 border-b border-gray-100 bg-gray-50/50">
             <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search zone (e.g. 12)" 
                  className="pl-9 h-9 bg-white border-gray-200 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>

          <ScrollArea className="flex-1">
             <div className="divide-y divide-gray-50">
                {filteredZones.map(zone => {
                  const isSelected = selectedZones.includes(zone.id);
                  return (
                    <div 
                      key={zone.id}
                      onClick={() => toggleZone(zone.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50",
                        isSelected && "bg-blue-50/50 hover:bg-blue-50"
                      )}
                    >
                       <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => toggleZone(zone.id)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                       />
                       <div>
                          <div className="flex items-center gap-2">
                             <span className="font-mono font-bold text-gray-900 text-sm">Zone {zone.number}</span>
                          </div>
                          <div className="text-xs text-gray-500">{zone.name}</div>
                       </div>
                       {isSelected && <Check className="h-4 w-4 text-blue-600 ml-auto" />}
                    </div>
                  );
                })}
             </div>
          </ScrollArea>
           
          <div className="p-3 border-t bg-gray-50 text-xs text-center text-gray-400">
             {selectedZones.length} zones selected
          </div>
        </div>

        {/* Main Panel: Interactive Map */}
        <div className="flex-1 flex flex-col relative h-full">
           
           {/* Top Sticky Bar */}
           <div className="absolute top-4 left-4 right-4 z-20 bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                 <div className="w-[300px]">
                    <Input 
                        placeholder="Service Area Name (e.g. North Doha Express)" 
                        className="h-10 text-base font-medium border-transparent bg-transparent hover:bg-gray-100/50 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                 </div>
                 <div className="h-6 w-px bg-gray-200 mx-2" />
                 
                 {/* Chips */}
                 <ScrollArea className="flex-1 w-0 whitespace-nowrap">
                   <div className="flex items-center gap-2 pr-4">
                      {selectedZones.length === 0 && (
                        <span className="text-sm text-gray-400 italic px-2">Select zones from list or map...</span>
                      )}
                      {selectedZones.map(id => {
                        const z = QATAR_ZONES.find(qz => qz.id === id);
                        if (!z) return null;
                        return (
                          <Badge key={id} variant="secondary" className="h-7 px-2.5 gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                             <span className="font-mono text-xs">Z-{z.number}</span>
                             <button 
                                onClick={(e) => { e.stopPropagation(); toggleZone(id); }}
                                className="hover:text-blue-900 rounded-full p-0.5"
                             >
                                <X className="h-3 w-3" />
                             </button>
                          </Badge>
                        )
                      })}
                   </div>
                   <div className="h-2" /> {/* Scroll padding */}
                 </ScrollArea>
              </div>

              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                 <Button variant="ghost" className="text-gray-500" onClick={() => setLocation("/services")}>
                    Cancel
                 </Button>
                 <Button 
                    className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 gap-2"
                    disabled={!isSaveEnabled}
                    onClick={handleSave}
                 >
                    <Save className="h-4 w-4" />
                    Save Area
                 </Button>
              </div>
           </div>

           {/* Map Canvas */}
           <div className="flex-1 bg-slate-50 relative overflow-hidden flex items-center justify-center">
              
              {/* SVG Map */}
              <svg viewBox="0 0 100 100" className="w-full h-full max-w-[800px] max-h-[800px] drop-shadow-2xl">
                 <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                       <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" strokeOpacity="0.1"/>
                    </pattern>
                 </defs>
                 
                 {/* Qatar/Sea Background Placeholder */}
                 <rect width="100" height="100" fill="#f8fafc" />
                 <rect width="100" height="100" fill="url(#grid)" />

                 {/* Zones */}
                 {QATAR_ZONES.map(zone => {
                     const isSelected = selectedZones.includes(zone.id);
                     return (
                        <g 
                          key={zone.id}
                          onClick={() => toggleZone(zone.id)} 
                          className="cursor-pointer transition-all hover:opacity-80"
                        >
                           <rect 
                              x={zone.x} 
                              y={zone.y} 
                              width={zone.w} 
                              height={zone.h} 
                              rx="1"
                              fill={isSelected ? zone.color : "white"} 
                              fillOpacity={isSelected ? 0.9 : 0.8}
                              stroke={isSelected ? "#1e40af" : "#cbd5e1"} 
                              strokeWidth={isSelected ? 0.8 : 0.4}
                              className="transition-all duration-200"
                           />
                           <text 
                              x={zone.x + zone.w/2} 
                              y={zone.y + zone.h/2} 
                              textAnchor="middle" 
                              dy=".3em"
                              fontSize="2.5" 
                              fontWeight="bold"
                              fill={isSelected ? "white" : "#64748b"}
                              className="pointer-events-none select-none font-mono"
                           >
                              {zone.number}
                           </text>
                           {/* Hover Title */}
                           <title>{`Zone ${zone.number} - ${zone.name}`}</title>
                        </g>
                     );
                 })}
              </svg>

              {/* Map Legend/Overlay */}
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur border border-gray-200 p-3 rounded-lg shadow-lg text-xs">
                 <div className="font-semibold text-gray-900 mb-2">Map Legend</div>
                 <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span className="text-gray-600">Selected Zone</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                    <span className="text-gray-600">Available Zone</span>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
