import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapView } from "@/components/Map";

// Standardized Dimensions
const FIELD_HEIGHT = "h-[34px]";
const INPUT_BASE = `${FIELD_HEIGHT} text-sm border-gray-300 focus:border-blue-500 focus:ring-0 rounded-[4px]`;
const LABEL_BASE = "text-[13px] text-gray-600 font-medium mt-2";
const SECTION_TITLE = "text-[16px] font-semibold text-gray-900 mb-4";
const ROW_SPACING = "mb-5";

// Width Constants - Updated for Compactness
const SALUTATION_WIDTH = "w-[70px]";
const FIRST_NAME_WIDTH = "w-[200px]";
// Total width = 70 + 200 + 4 (gap-1) = 274px
const FULL_WIDTH = "w-[274px]"; 
const ADDRESS_FIELD_WIDTH = "w-[220px]"; // Standard width for all address fields

export default function AddCustomer() {
  const [, setLocation] = useLocation();
  const [addressType, setAddressType] = useState("apartment");
  
  // Form State for Auto-fill
  const [zone, setZone] = useState("");
  const [street, setStreet] = useState("");
  const [directions, setDirections] = useState("");
  const [locationMode, setLocationMode] = useState<"blue_plate" | "coordinates" | "plus_code" | "manual">("blue_plate");
  const [manualCoordinates, setManualCoordinates] = useState("");
  const [manualPlusCode, setManualPlusCode] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const handleBack = () => {
    setLocation("/customers");
  };

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // Create draggable marker
    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: 25.2854, lng: 51.5310 },
      title: "Drag to select location",
      gmpDraggable: true,
    });
    markerRef.current = marker;

    // Add drag listener for reverse geocoding
    marker.addListener("dragend", async () => {
      const position = marker.position as google.maps.LatLngLiteral;
      if (position) {
        try {
          const geocoder = new google.maps.Geocoder();
          const response = await geocoder.geocode({ location: position });
          
          if (response.results[0]) {
            const address = response.results[0].formatted_address;
            const components = response.results[0].address_components;
            
            // Update directions with full address
            setDirections(address);

            // Smart Mapping Logic (Simulation for Demo)
            // In a real app, this would map specific polygon IDs or exact street names
            
            // Map Zone (Simulated based on keywords)
            if (address.includes("Dafna") || address.includes("West Bay") || address.includes("Zone 6")) {
              if (address.includes("Dafna")) setZone("zone1");
              else setZone("zone2");
            }

            // Map Street (Simulated based on street numbers)
            const streetComponent = components.find(c => c.types.includes("route"));
            if (streetComponent) {
              if (streetComponent.long_name.includes("850")) setStreet("st1");
              else if (streetComponent.long_name.includes("900")) setStreet("st2");
            }
          }
        } catch (error) {
          console.error("Geocoding failed:", error);
        }
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-white relative">
        {/* Header */}
        <div className="flex-none px-8 py-5 border-b border-gray-200 bg-white z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">New Customer</h1>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="px-8 py-8 pb-32">
            
            {/* Customer Details Section */}
            <div className="mb-10 max-w-[800px]">
              {/* Customer Name - Two Lines */}
              <div className={ROW_SPACING}>
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-3">
                    <Label className={LABEL_BASE}>
                      Customer Name <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="col-span-9">
                    {/* Line 1: Salutation + First Name */}
                    <div className="flex gap-1 mb-3">
                      <div className={SALUTATION_WIDTH}>
                        <Select>
                          <SelectTrigger className={`${INPUT_BASE} bg-gray-50 px-2`}>
                            <SelectValue placeholder="Sal." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mr">Mr.</SelectItem>
                            <SelectItem value="mrs">Mrs.</SelectItem>
                            <SelectItem value="ms">Ms.</SelectItem>
                            <SelectItem value="dr">Dr.</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className={FIRST_NAME_WIDTH}>
                        <Input placeholder="First Name" className={INPUT_BASE} />
                      </div>
                    </div>
                    {/* Line 2: Last Name */}
                    <div className="flex gap-3">
                      <div className={FULL_WIDTH}>
                        <Input placeholder="Last Name" className={INPUT_BASE} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone - Width Matched to Name */}
              <div className={ROW_SPACING}>
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-3">
                    <Label className={LABEL_BASE}>
                      Phone <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="col-span-9">
                    <div className={`${FULL_WIDTH} flex rounded-[4px] border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500`}>
                      <div className="w-[90px] flex-none border-r border-gray-200 bg-gray-50">
                        <Select defaultValue="qa">
                          <SelectTrigger className="h-[32px] w-full border-0 bg-transparent focus:ring-0 text-xs px-2">
                            <div className="flex items-center gap-1">
                              <span>🇶🇦</span>
                              <span>+974</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="qa">🇶🇦 +974</SelectItem>
                            <SelectItem value="ae">🇦🇪 +971</SelectItem>
                            <SelectItem value="sa">🇸🇦 +966</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Input 
                          placeholder="Mobile Number" 
                          className="h-[32px] border-0 focus:ring-0 rounded-none" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email - Width Matched to Name */}
              <div className={ROW_SPACING}>
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-3">
                    <Label className={LABEL_BASE}>Email Address</Label>
                  </div>
                  <div className="col-span-9">
                    <div className={FULL_WIDTH}>
                      <Input placeholder="email@example.com" className={INPUT_BASE} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mb-10 pt-6 border-t border-gray-100">
              <div className="mb-6">
                <h3 className={SECTION_TITLE}>Address</h3>
                {/* Address Type Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg w-fit mt-2">
                  {["apartment", "house", "compound"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setAddressType(type)}
                      className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                        addressType === type
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flex Container for Address Form and Map */}
              <div className="flex gap-6 items-start">
                {/* Left Column - Form Fields */}
                <div className="w-[340px] space-y-4 flex-none">
                  {/* Permanent Address Fields (Always Visible) */}
                  <>
                    {/* Zone */}
                    <div className="flex items-center gap-4">
                      <div className="w-[100px] flex-none">
                        <Label className={LABEL_BASE}>Zone</Label>
                      </div>
                      <div className="flex-1">
                        <div className={ADDRESS_FIELD_WIDTH}>
                          <Select value={zone} onValueChange={setZone}>
                            <SelectTrigger className={`${INPUT_BASE} w-full`}>
                              <SelectValue placeholder="Select Zone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zone1">Zone 1 - Al Dafna</SelectItem>
                              <SelectItem value="zone2">Zone 2 - West Bay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Street */}
                    <div className="flex items-center gap-4">
                      <div className="w-[100px] flex-none">
                        <Label className={LABEL_BASE}>Street</Label>
                      </div>
                      <div className="flex-1">
                        <div className={ADDRESS_FIELD_WIDTH}>
                          <Select value={street} onValueChange={setStreet}>
                            <SelectTrigger className={`${INPUT_BASE} w-full`}>
                              <SelectValue placeholder="Select Street" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="st1">Street 850</SelectItem>
                              <SelectItem value="st2">Street 900</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Building (Apartment) */}
                    {addressType === "apartment" && (
                      <div className="flex items-center gap-4">
                        <div className="w-[100px] flex-none">
                          <Label className={LABEL_BASE}>Building</Label>
                        </div>
                        <div className="flex-1">
                          <div className={ADDRESS_FIELD_WIDTH}>
                            <Select>
                              <SelectTrigger className={`${INPUT_BASE} w-full`}>
                                <SelectValue placeholder="Select Building" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="b1">Building 14</SelectItem>
                                <SelectItem value="b2">Building 22</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Building (House) */}
                    {addressType === "house" && (
                      <div className="flex items-center gap-4">
                        <div className="w-[100px] flex-none">
                          <Label className={LABEL_BASE}>Building No</Label>
                        </div>
                        <div className="flex-1">
                          <div className={ADDRESS_FIELD_WIDTH}>
                            <Input placeholder="Building Number" className={INPUT_BASE} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Compound Fields */}
                    {addressType === "compound" && (
                      <>
                        <div className="flex items-center gap-4">
                          <div className="w-[100px] flex-none">
                            <Label className={LABEL_BASE}>Compound</Label>
                          </div>
                          <div className="flex-1">
                            <div className={ADDRESS_FIELD_WIDTH}>
                              <Input placeholder="Compound Name" className={INPUT_BASE} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-[100px] flex-none">
                            <Label className={LABEL_BASE}>Villa No</Label>
                          </div>
                          <div className="flex-1">
                            <div className={ADDRESS_FIELD_WIDTH}>
                              <Input placeholder="Villa Number" className={INPUT_BASE} />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>

                  {/* Common Fields (Floor/Apt/Contact) */}
                  {addressType === "apartment" && (
                    <>
                      
                      {/* Floor */}
                      <div className="flex items-center gap-4">
                        <div className="w-[100px] flex-none">
                          <Label className={LABEL_BASE}>Floor</Label>
                        </div>
                        <div className="flex-1">
                          <div className={ADDRESS_FIELD_WIDTH}>
                            <Input placeholder="Floor" className={INPUT_BASE} />
                          </div>
                        </div>
                      </div>

                      {/* Apt */}
                      <div className="flex items-center gap-4">
                        <div className="w-[100px] flex-none">
                          <Label className={LABEL_BASE}>Apt</Label>
                        </div>
                        <div className="flex-1">
                          <div className={ADDRESS_FIELD_WIDTH}>
                            <Input placeholder="Apt" className={INPUT_BASE} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  

                  {/* Contact Person */}
                  <div className="flex items-center gap-4">
                    <div className="w-[100px] flex-none">
                      <Label className={LABEL_BASE}>Contact Person</Label>
                    </div>
                    <div className="flex-1">
                      <div className={ADDRESS_FIELD_WIDTH}>
                        <Input placeholder="Name" className={INPUT_BASE} />
                      </div>
                    </div>
                  </div>

                  {/* Directions */}
                  <div className="flex items-start gap-4">
                    <div className="w-[100px] flex-none">
                      <Label className={LABEL_BASE}>Directions</Label>
                    </div>
                    <div className="flex-1">
                      <div className={ADDRESS_FIELD_WIDTH}>
                        <Textarea 
                          placeholder="Near landmark..." 
                          className="h-[60px] text-sm border-gray-300 focus:border-blue-500 focus:ring-0 rounded-[4px] resize-none"
                          value={directions}
                          onChange={(e) => setDirections(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Map */}
                <div className="flex-none w-[400px]">
                  {/* Location Mode Selector */}
                  <div className="flex items-center gap-6 mb-4 px-1">
                    <button
                      onClick={() => setLocationMode("blue_plate")}
                      className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                        locationMode === "blue_plate"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Blue Plate
                    </button>
                    <button
                      onClick={() => setLocationMode("coordinates")}
                      className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                        locationMode === "coordinates"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Coordinates
                    </button>
                    <button
                      onClick={() => setLocationMode("plus_code")}
                      className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                        locationMode === "plus_code"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Plus Code
                    </button>
                    <button
                      onClick={() => setLocationMode("manual")}
                      className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                        locationMode === "manual"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Manual
                    </button>
                  </div>

                  {/* Manual Inputs */}
                  {locationMode === "coordinates" && (
                    <div className="mb-3">
                      <Input
                        placeholder="e.g. 25.2854, 51.5310"
                        className={INPUT_BASE}
                        value={manualCoordinates}
                        onChange={(e) => setManualCoordinates(e.target.value)}
                      />
                    </div>
                  )}

                  {locationMode === "plus_code" && (
                    <div className="mb-3">
                      <Input
                        placeholder="e.g. 8G35+JQ Doha"
                        className={INPUT_BASE}
                        value={manualPlusCode}
                        onChange={(e) => setManualPlusCode(e.target.value)}
                      />
                    </div>
                  )}

                  <div className={`rounded-lg border border-gray-200 overflow-hidden h-[360px] shadow-sm w-full relative ${locationMode === "manual" ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}>
                    <MapView 
                      initialCenter={{ lat: 25.2854, lng: 51.5310 }}
                      initialZoom={11}
                      onMapReady={handleMapReady}
                      className="w-full h-full"
                    />
                    {locationMode === "manual" && (
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md z-10">
                        Drag pin to set location
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 w-[400px] text-center">
                    {locationMode === "manual" ? "Drag pin to pinpoint exact location" : "Map preview"}
                  </p>
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="mb-8 pt-6 border-t border-gray-100 max-w-[800px]">
              <h3 className={SECTION_TITLE}>Remarks</h3>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3">
                  <Label className={LABEL_BASE}>Internal Notes</Label>
                </div>
                <div className="col-span-9">
                  <div className="w-full">
                    <Textarea 
                      placeholder="Add notes about this customer..." 
                      className="min-h-[100px] text-sm border-gray-300 focus:border-blue-500 focus:ring-0 rounded-[4px]"
                    />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-8 py-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-9 text-sm font-medium rounded-[4px] mb-[15px]">
              Save Customer
            </Button>
            <Button 
              variant="outline" 
              onClick={handleBack} 
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-6 h-9 text-sm font-medium rounded-[4px] mb-[15px]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
