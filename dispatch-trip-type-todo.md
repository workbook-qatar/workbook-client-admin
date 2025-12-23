# Dispatch V2 - Trip Type System Implementation TODO

## Goal
Implement OUTBOUND/RETURN trip type system where different drivers can handle pickup and return, solving the real-world operational challenge.

---

## Phase 1: Data Model & Types

- [ ] Add `tripType` field to Trip interface: "outbound" | "return" | "round-trip"
- [ ] Add `linkedTripId` field to Trip interface (for linking outbound ↔ return)
- [ ] Add `bookingId` field to Trip interface (which booking generated this trip)
- [ ] Update sample data with trip types
- [ ] Add trip type icons: 🏠→🏢 (outbound), 🏢→🏠 (return)

---

## Phase 2: Create Trip Dialog

- [ ] Add "Create Trip" button back to header
- [ ] Create comprehensive Create Trip dialog with:
  - [ ] Trip name input
  - [ ] Trip type selector (OUTBOUND / RETURN / ROUND-TRIP)
  - [ ] Start time picker
  - [ ] Booking selection (which booking is this trip for?)
  - [ ] Staff selection (which staff need transportation?)
  - [ ] Driver suggestion (based on availability)
  - [ ] If ROUND-TRIP: automatically create 2 linked trips

---

## Phase 3: Trip Linking System

- [ ] Show linked trip information on trip cards
  - [ ] "Outbound Trip: T001A - Driver Name - Time"
  - [ ] "Return Trip: T001B - Driver Name - Time"
- [ ] Add "View Linked Trip" button on trip cards
- [ ] Visual indicator showing trips are linked (icon or badge)
- [ ] When clicking linked trip, highlight both trips

---

## Phase 4: Trip Type Visual Indicators

- [ ] Add trip type badges to trip cards:
  - [ ] OUTBOUND - Blue badge with 🏠→🏢 icon
  - [ ] RETURN - Green badge with 🏢→🏠 icon
  - [ ] ROUND-TRIP - Purple badge (if single driver handles both)
- [ ] Update trip card layout to show trip type prominently
- [ ] Add trip type filter in filters dialog
- [ ] Update Gantt chart to show trip types with different colors

---

## Phase 5: Driver Assignment Logic

- [ ] Update Assign Driver dialog to show:
  - [ ] Trip type being assigned
  - [ ] Linked trip information (if exists)
  - [ ] Warning if same driver assigned to both outbound/return
  - [ ] Driver availability for the specific time slot
- [ ] Suggest different drivers for outbound vs return
- [ ] Show driver's current schedule to avoid conflicts

---

## Phase 6: Edit Trip Updates

- [ ] Update Edit Trip dialog to show trip type
- [ ] Allow changing trip type (with warning if linked)
- [ ] Show linked trip information
- [ ] Option to "Edit Both Trips" if linked

---

## Phase 7: Split Trip Updates

- [ ] Update Split Trip to respect trip types
- [ ] When splitting OUTBOUND trip, new trips are also OUTBOUND
- [ ] Maintain linking after split

---

## Phase 8: Gantt Chart Updates

- [ ] Show OUTBOUND trips in blue
- [ ] Show RETURN trips in green
- [ ] Draw connection lines between linked trips
- [ ] Tooltip shows trip type and linked trip info

---

## Phase 9: Map Updates

- [ ] Show different marker colors for OUTBOUND vs RETURN
- [ ] Draw routes with different colors
- [ ] Show both routes if linked trips selected

---

## Phase 10: Templates Updates

- [ ] Templates can save trip type
- [ ] When using template, ask if OUTBOUND or RETURN
- [ ] Template can include "create linked return trip" option

---

## Phase 11: Booking Integration

- [ ] Show which trips are associated with each booking
- [ ] Booking card shows:
  - [ ] Outbound trip: T001A - Driver Name ✓
  - [ ] Return trip: T001B - Driver Name ○
- [ ] Status indicators: ✓ completed, ○ scheduled, ✗ cancelled

---

## Phase 12: Statistics Updates

- [ ] Update statistics to show:
  - [ ] Total Outbound Trips
  - [ ] Total Return Trips
  - [ ] Trips Needing Return Assignment

---

## Phase 13: Comprehensive Testing

- [ ] Test Create Trip with OUTBOUND type
- [ ] Test Create Trip with RETURN type
- [ ] Test Create Trip with ROUND-TRIP (creates 2 linked trips)
- [ ] Test assigning different drivers to outbound/return
- [ ] Test Edit Trip with linked trips
- [ ] Test Split Trip with trip types
- [ ] Test Gantt chart showing trip types
- [ ] Test Map showing different trip types
- [ ] Test Templates with trip types
- [ ] Test all existing features still work

---

## Phase 14: UI/UX Polish

- [ ] Ensure professional color scheme
- [ ] Verify all alignments correct
- [ ] Check all icons and badges consistent
- [ ] Test responsive layout
- [ ] Verify no console errors
- [ ] Check performance (no lag)

---

## Phase 15: Final Verification

- [ ] All 30+ existing features still working
- [ ] New trip type features working
- [ ] Create Trip dialog working
- [ ] Trip linking working
- [ ] Different drivers for outbound/return working
- [ ] UI/UX professional
- [ ] Doha, Qatar locations correct
- [ ] No errors in console
- [ ] Ready for production

---

## Success Criteria

✅ Dispatcher can create OUTBOUND trip with Driver A  
✅ Dispatcher can create RETURN trip with Driver B  
✅ System shows both trips are linked  
✅ Both trips can have different drivers  
✅ Visual indicators clearly show trip types  
✅ All existing features continue to work  
✅ Professional UI/UX maintained  
✅ No errors or bugs  

---

## Implementation Notes

- Take time to implement correctly
- Test thoroughly at each phase
- Maintain backward compatibility
- Keep code clean and maintainable
- Document all changes
- Verify with user before final delivery
