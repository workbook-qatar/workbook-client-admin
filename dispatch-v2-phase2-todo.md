# Dispatch V2 - Phase 2 Enhancements TODO

## Visual & Layout Enhancements

### 1. Compact/Expanded View Toggle
- [ ] Add view toggle button in header (grid icon for compact, list icon for expanded)
- [ ] Create expanded trip card component with larger layout
- [ ] Add state management for view preference
- [ ] Save preference to localStorage
- [ ] Smooth transition animation between views
- [ ] Adjust map size based on view mode

### 2. Split-Screen Trip Comparison
- [ ] Add "Compare" checkbox mode on trip cards
- [ ] Create comparison dialog with side-by-side layout
- [ ] Show route differences with highlighted sections
- [ ] Display timing comparison table
- [ ] Show capacity and cost differences
- [ ] Add "Merge Trips" and "Swap Bookings" quick actions

### 3. Color-Coded Trip Categories
- [ ] Add color picker in Edit Trip dialog
- [ ] Create category management system (Morning, Afternoon, Emergency, etc.)
- [ ] Add colored left border to trip cards
- [ ] Add category filter dropdown
- [ ] Save category colors to trip data
- [ ] Add legend showing all categories

### 4. Map Heatmap Overlay
- [ ] Implement heatmap calculation based on unassigned booking locations
- [ ] Add toggle button for heatmap overlay
- [ ] Use Google Maps Heatmap Layer
- [ ] Color intensity based on booking density (red=high, yellow=medium, green=low)
- [ ] Update heatmap when bookings are assigned/unassigned
- [ ] Add tooltip showing booking count in each area

### 5. Timeline Gantt Chart View
- [ ] Create Gantt chart component with time axis
- [ ] Add view switcher (Map View / Gantt View)
- [ ] Display trips as horizontal bars on timeline
- [ ] Show driver names on Y-axis
- [ ] Color-code trips by status
- [ ] Add drag-to-reschedule functionality
- [ ] Show conflicts with overlapping bars
- [ ] Add zoom controls for timeline (hour/day view)

## Smart Operational Features

### 6. Conflict Detection & Warnings
- [ ] Implement time conflict detection (driver double-booked)
- [ ] Implement location conflict detection (booking too far from route)
- [ ] Implement capacity conflict detection (exceeds vehicle capacity)
- [ ] Implement staff conflict detection (staff in multiple trips)
- [ ] Add warning icon to trip cards with conflicts
- [ ] Create conflict details tooltip
- [ ] Add conflict resolution suggestions
- [ ] Highlight conflicting elements in red

### 7. Predictive ETA Updates
- [ ] Integrate Google Maps Traffic Layer
- [ ] Calculate real-time ETA with traffic data
- [ ] Show original vs. current ETA comparison
- [ ] Add traffic delay indicator (red/yellow/green)
- [ ] Auto-update ETAs every 2 minutes
- [ ] Show traffic delay warnings on trip cards
- [ ] Add "Notify Customer" button for delays > 10 min
- [ ] Display traffic conditions on route

### 8. Quick Notes & Comments
- [ ] Add notes icon to trip cards
- [ ] Create slide-out notes panel
- [ ] Implement comment thread UI
- [ ] Add timestamp and author to each note
- [ ] Add @mention functionality for dispatchers
- [ ] Show system-generated notes (e.g., "Route optimized")
- [ ] Add note count badge on trip cards
- [ ] Implement real-time note updates
- [ ] Add rich text formatting (bold, italic, lists)

## Testing Checklist
- [ ] Test all features in compact and expanded views
- [ ] Test trip comparison with 2 different trips
- [ ] Test color categories with multiple trips
- [ ] Test heatmap with varying booking densities
- [ ] Test Gantt chart with overlapping trips
- [ ] Test conflict detection for all conflict types
- [ ] Test ETA updates with traffic data
- [ ] Test notes system with multiple users
- [ ] Verify all features work together
- [ ] Check mobile responsiveness

## Implementation Order
1. Compact/Expanded View (Foundation for other features)
2. Color-Coded Categories (Simple, high visual impact)
3. Conflict Detection (Important for operations)
4. Quick Notes (Useful for all other features)
5. Split-Screen Comparison (Builds on existing UI)
6. Predictive ETA (Requires traffic API integration)
7. Map Heatmap (Requires booking location data)
8. Timeline Gantt Chart (Most complex, builds on everything)
