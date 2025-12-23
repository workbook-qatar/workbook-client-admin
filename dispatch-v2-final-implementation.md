# Dispatch V2 - Final Implementation Plan

## Features to Implement

### 1. Real-time GPS Integration with Google Maps
- [ ] Replace SVG map with Google Maps component
- [ ] Use existing Map.tsx component from template
- [ ] Add live driver location markers
- [ ] Add route polyline with directions API
- [ ] Add stop markers with info windows
- [ ] Add ETA calculations based on traffic
- [ ] Add geofencing for stop arrivals

### 2. Smart Route Optimizer
- [ ] Implement route optimization algorithm
- [ ] Calculate optimal stop sequence
- [ ] Minimize total distance
- [ ] Respect time windows
- [ ] Check staff availability
- [ ] Validate vehicle capacity
- [ ] Update trip with optimized route
- [ ] Show before/after comparison

### 3. Trip Templates & Recurring Routes
- [ ] Create template data structure
- [ ] Add "Save as Template" button
- [ ] Template library dialog
- [ ] Create trip from template
- [ ] Edit template
- [ ] Delete template
- [ ] Template preview
- [ ] Auto-suggest drivers for template

### 4. Edit Trip Feature
- [ ] Edit trip dialog
- [ ] Edit trip name and start time
- [ ] Add new stops
- [ ] Remove existing stops
- [ ] Reorder stops with drag-and-drop
- [ ] Modify staff assignments
- [ ] Recalculate distance and time
- [ ] Save changes

### 5. Split Trip Feature
- [ ] Split trip dialog
- [ ] Select split point
- [ ] Preview two resulting trips
- [ ] Assign drivers to both trips
- [ ] Validate split logic
- [ ] Create two separate trips
- [ ] Update bookings

### 6. Add to Trip Feature
- [ ] Add booking to trip dialog
- [ ] Select target trip
- [ ] Choose insertion point
- [ ] Validate capacity
- [ ] Check time conflicts
- [ ] Auto-optimize route
- [ ] Update trip

## Implementation Order

1. **Google Maps Integration** (Highest priority)
2. **Route Optimizer** (Depends on maps)
3. **Edit Trip** (Core functionality)
4. **Add to Trip** (Uses edit logic)
5. **Split Trip** (Uses edit logic)
6. **Trip Templates** (Enhancement)

## Technical Approach

### Google Maps
- Use existing Map.tsx component
- MapView with onMapReady callback
- Initialize Directions service
- Add markers for stops and driver
- Draw route polyline
- Calculate distances and ETAs

### Route Optimizer
- Traveling Salesman Problem (TSP) approach
- Nearest neighbor algorithm for simplicity
- Constraints: time windows, capacity
- Return optimized stop sequence

### State Management
- Add more state variables for dialogs
- Use mock data that can be modified
- Simulate API calls with setTimeout
- Update UI optimistically

### Validation Logic
- Time window overlap checking
- Vehicle capacity validation
- Staff availability checking
- Booking conflict detection
