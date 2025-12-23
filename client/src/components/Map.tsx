import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Navigation, User } from "lucide-react";
import { motion } from "framer-motion";

// Types matching the Dispatch page
interface TripStop {
  location: string;
  staff: string[];
  lat: number;
  lng: number;
}

interface TripRoute {
  id: string;
  stops: TripStop[];
  status: "unassigned" | "active" | "upcoming" | "completed" | "cancelled";
  direction: "outbound" | "return";
  driverName?: string;
  currentStatus?: string;
}

interface MapViewProps {
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  trips?: TripRoute[];
  // Legacy prop for compatibility, ignored in mock
  onMapReady?: (map: any) => void; 
}

export function MapView({
  className,
  initialCenter = { lat: 25.2854, lng: 51.5310 },
  trips = [],
}: MapViewProps) {
  // Mock map state
  const [hoveredTripId, setHoveredTripId] = useState<string | null>(null);

  // Calculate bounds to center the map content
  const bounds = useMemo(() => {
    // Default bounds around Doha if no trips
    if (trips.length === 0) {
      return {
        minLat: 25.25,
        maxLat: 25.35,
        minLng: 51.45,
        maxLng: 51.60
      };
    }

    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    
    trips.forEach(trip => {
      trip.stops.forEach(stop => {
        minLat = Math.min(minLat, stop.lat);
        maxLat = Math.max(maxLat, stop.lat);
        minLng = Math.min(minLng, stop.lng);
        maxLng = Math.max(maxLng, stop.lng);
      });
    });

    // Add padding
    const latPadding = (maxLat - minLat) * 0.2 || 0.05;
    const lngPadding = (maxLng - minLng) * 0.2 || 0.05;

    return {
      minLat: minLat - latPadding,
      maxLat: maxLat + latPadding,
      minLng: minLng - lngPadding,
      maxLng: maxLng + lngPadding
    };
  }, [trips]);

  // Project lat/lng to SVG coordinates (0-100)
  const project = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = 100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100; // Invert Y for SVG
    return { x, y };
  };

  return (
    <div className={cn("relative w-full h-[600px] bg-slate-900 overflow-hidden rounded-xl shadow-inner border border-white/10", className)}>
      {/* Map Background Pattern - "Tactical Grid" */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #334155 1px, transparent 1px),
            linear-gradient(to bottom, #334155 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Decorative Radar Circles */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[400px] h-[400px] border border-blue-500 rounded-full" />
        <div className="w-[600px] h-[600px] border border-blue-500 rounded-full" />
      </div>

      {/* SVG Map Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        
        {/* Draw Routes */}
        {trips.map((trip) => {
          if (trip.stops.length < 2) return null;
          
          const points = trip.stops.map(stop => {
            const { x, y } = project(stop.lat, stop.lng);
            return `${x},${y}`;
          }).join(" ");

          const isUnassigned = trip.status === "unassigned";
          const isActive = trip.status === "active" || trip.currentStatus === "in-progress";
          
          let strokeColor = isUnassigned ? "#f97316" : isActive ? "#22c55e" : "#3b82f6";
          if (hoveredTripId === trip.id) strokeColor = "#ffffff";

          return (
            <g key={trip.id}>
              {/* Route Path */}
              <motion.polyline
                points={points}
                fill="none"
                stroke={strokeColor}
                strokeWidth={hoveredTripId === trip.id ? "3" : "2"}
                strokeOpacity="0.6"
                strokeDasharray={isUnassigned ? "5,5" : "none"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              
              {/* Animated pulses on active routes */}
              {isActive && (
                 <circle r="3" fill="#22c55e">
                   <animateMotion dur="3s" repeatCount="indefinite" path={`M ${points.replace(/ /g, ' L ')}`} />
                 </circle>
              )}
            </g>
          );
        })}

        {/* Draw Stops/Markers */}
        {trips.map((trip) => (
          trip.stops.map((stop, index) => {
            const { x, y } = project(stop.lat, stop.lng);
            const isStart = index === 0;
            const isEnd = index === trip.stops.length - 1;
            
            return (
              <g key={`${trip.id}-${index}`}>
                <foreignObject x={`${x}%`} y={`${y}%`} width="0" height="0" className="overflow-visible">
                  <div 
                    className="transform -translate-x-1/2 -translate-y-1/2"
                    onMouseEnter={() => setHoveredTripId(trip.id)}
                    onMouseLeave={() => setHoveredTripId(null)}
                  >
                     <div className={cn(
                       "relative group cursor-pointer",
                       // Start/End styling
                       isStart || isEnd ? "z-20" : "z-10"
                     )}>
                        {/* Pulse effect for active stops */}
                        {(isStart || isEnd) && trip.status === 'active' && (
                          <div className="absolute -inset-1 rounded-full bg-green-500/50 animate-ping" />
                        )}
                        
                        {/* Marker Dot */}
                        <div className={cn(
                          "w-3 h-3 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-150",
                          trip.status === 'unassigned' ? "bg-orange-500" :
                          trip.status === 'active' ? "bg-green-500" : "bg-blue-500"
                        )} />

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-50">
                           <div className="bg-slate-900 border border-slate-700 text-white text-xs py-1 px-2 rounded shadow-xl flex flex-col gap-1">
                              <span className="font-bold">{stop.location.split(',')[0]}</span>
                              <span className="text-slate-400">{stop.staff.join(', ')}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                </foreignObject>
              </g>
            );
          })
        ))}
      </svg>
      
      {/* Legend / Overlay Controls */}
      <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-lg shadow-xl text-xs text-slate-300 pointer-events-auto">
         <div className="font-bold text-white mb-2">Live Dispatch Map</div>
         <div className="space-y-1.5 opacity-0.2">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500" />
               <span>Active Trips</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500" />
               <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-orange-500" />
               <span>Unassigned</span>
            </div>
         </div>
      </div>
      
       {/* Zoom Controls (Mock) */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
         <button className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700 transition">+</button>
         <button className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700 transition">-</button>
      </div>
      
    </div>
  );
}
