
export const PRESET_CATEGORIES = [
  {
    id: "preset-cat-1",
    name: "Hourly Home Cleaning",
    icon: "箒",
    description: "Standard hourly cleaning services for homes",
    packages: [
      { id: "preset-pkg-1-1", code: "HHC-001", name: "4 Hour Cleaning — With Materials", duration: "4 hours", price: 200, materials: true },
      { id: "preset-pkg-1-2", code: "HHC-002", name: "4 Hour Cleaning — Without Materials", duration: "4 hours", price: 160, materials: false },
      { id: "preset-pkg-1-3", code: "HHC-003", name: "5 Hour Cleaning — With Materials", duration: "5 hours", price: 250, materials: true },
      { id: "preset-pkg-1-4", code: "HHC-004", name: "5 Hour Cleaning — Without Materials", duration: "5 hours", price: 200, materials: false },
      { id: "preset-pkg-1-5", code: "HHC-005", name: "6 Hour Cleaning — With Materials", duration: "6 hours", price: 300, materials: true },
      { id: "preset-pkg-1-6", code: "HHC-006", name: "6 Hour Cleaning — Without Materials", duration: "6 hours", price: 240, materials: false },
    ]
  },
  {
    id: "preset-cat-2",
    name: "Deep Cleaning",
    icon: "✨",
    description: "Comprehensive deep cleaning for all room types",
    packages: [
      { id: "preset-pkg-2-1", code: "DC-001", name: "Studio Apartment Deep Clean", duration: "4 hours", price: 400, materials: true },
      { id: "preset-pkg-2-2", code: "DC-002", name: "1 BR Apartment Deep Clean", duration: "5 hours", price: 550, materials: true },
      { id: "preset-pkg-2-3", code: "DC-003", name: "Villa Deep Clean (Ground Floor)", duration: "8 hours", price: 1200, materials: true },
    ]
  },
  {
    id: "preset-cat-3",
    name: "Furniture Cleaning",
    icon: "🛋️",
    description: "Sofa, carpet, and mattress cleaning services",
    packages: [
      { id: "preset-pkg-3-1", code: "FC-001", name: "Sofa Shampooing (3 Seater)", duration: "1.5 hours", price: 150, materials: true },
      { id: "preset-pkg-3-2", code: "FC-002", name: "Carpet Deep Clean (Large)", duration: "1 hour", price: 100, materials: true },
    ]
  },
  {
    id: "preset-cat-4",
    name: "Pest Control",
    icon: "🐜",
    description: "Anti-insect and pest removal treatments",
    packages: [
      { id: "preset-pkg-4-1", code: "PC-001", name: "Apartment Pest Control", duration: "1 hour", price: 200, materials: true },
      { id: "preset-pkg-4-2", code: "PC-002", name: "Villa Pest Control", duration: "2 hours", price: 400, materials: true },
    ]
  },
  {
    id: "preset-cat-5",
    name: "AC Cleaning",
    icon: "❄️",
    description: "Air conditioner servicing and maintenance",
    packages: [
      { id: "preset-pkg-5-1", code: "AC-001", name: "Split AC Service", duration: "45 mins", price: 100, materials: true },
      { id: "preset-pkg-5-2", code: "AC-002", name: "Window AC Service", duration: "45 mins", price: 80, materials: true },
    ]
  },
  {
    id: "preset-cat-6",
    name: "Mobile Car Wash",
    icon: "🚗",
    description: "Car washing and detailing at customer doorstep",
    packages: [
      { id: "preset-pkg-6-1", code: "CW-001", name: "Sedan Exterior Wash", duration: "30 mins", price: 35, materials: true },
      { id: "preset-pkg-6-2", code: "CW-002", name: "SUV Full Detail", duration: "2 hours", price: 450, materials: true },
    ]
  },
  {
    id: "preset-cat-7",
    name: "Beauty Care at Home",
    icon: "💅",
    description: "Salon services at home",
    packages: [
      { id: "preset-pkg-7-1", code: "BC-001", name: "Manicure & Pedicure", duration: "1.5 hours", price: 180, materials: true },
      { id: "preset-pkg-7-2", code: "BC-002", name: "Hair Cut & Blow Dry", duration: "1 hour", price: 200, materials: true },
    ]
  }
];
