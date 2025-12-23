# Dispatch V2 - Top 5 UI/UX Enhancements Implementation Plan

## Overview
Implementing the top 5 most impactful UI/UX enhancements to improve dispatcher workflow and operational efficiency.

---

## Enhancement #1: Drag-and-Drop Assignment 🎯

### Features
- Drag unassigned booking cards onto trip cards
- Visual feedback during drag (green = fits, red = conflict)
- Drop zone highlighting on trip cards
- Automatic capacity checking
- Instant assignment on drop
- Toast notification confirming assignment

### Implementation Details
- Use `@dnd-kit/core` for drag-and-drop functionality
- Add `useDraggable` hook to booking cards
- Add `useDroppable` hook to trip cards
- Check vehicle capacity before allowing drop
- Update trip state on successful drop
- Show visual indicators (cursor, borders, shadows)

### UI Changes
- Booking cards: Add drag handle icon, cursor changes to grab
- Trip cards: Highlight border on drag-over, show capacity warning
- Toast: "Booking BK015 added to Trip T001"

---

## Enhancement #2: Trip Capacity Indicators 📈

### Features
- Visual progress bar showing seat utilization
- Color coding: green (<75%), yellow (75-90%), red (>90%)
- Tooltip showing detailed breakdown
- Real-time updates when bookings added/removed
- Capacity warnings when approaching limit

### Implementation Details
- Calculate total staff count vs vehicle capacity
- Progress bar component with color thresholds
- Tooltip: "4 of 7 seats used (57%)"
- Update on any trip modification
- Warning badge when at 90%+ capacity

### UI Changes
- Add progress bar under vehicle info in trip card
- Color-coded bar with percentage
- Small warning icon when near capacity
- Tooltip on hover with staff breakdown

---

## Enhancement #3: Undo/Redo Actions ↩️

### Features
- Track last 10 actions (assign driver, add booking, edit trip, etc.)
- Undo/Redo buttons in header
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)
- Toast showing what was undone/redone
- Action history stack

### Implementation Details
- Create action history state array
- Record each action with: type, data, timestamp
- Undo: reverse the action, move to redo stack
- Redo: replay the action, move back to undo stack
- Supported actions: assign driver, add booking, create trip, edit trip

### UI Changes
- Two icon buttons in header (undo/redo arrows)
- Disabled state when no actions available
- Tooltip: "Undo: Assigned driver to T001"
- Toast: "Undone: Assigned driver to T001"

---

## Enhancement #4: Batch Operations Toolbar 🔧

### Features
- Floating toolbar appears when bookings selected
- Actions: "Create Trip from X", "Mark Priority", "Export", "Delete"
- Shows selection count
- Quick clear selection button
- Smooth slide-up animation

### Implementation Details
- Monitor selectedBookings state
- Show toolbar when length > 0
- Position: fixed bottom, centered
- Actions trigger bulk operations
- Clear selection after action completes

### UI Changes
- Floating toolbar at bottom center
- Dark background with white text
- Action buttons with icons
- Count badge: "3 bookings selected"
- Slide-up animation on appear

---

## Enhancement #5: Booking Priority Indicators 🚨

### Features
- Color-coded left border (red=high, orange=medium, gray=normal)
- Urgency countdown timer ("Due in 2 hours")
- Pulsing animation for overdue bookings
- Priority badge on card
- Sort by priority option

### Implementation Details
- Add priority field to booking data: "high" | "medium" | "normal"
- Calculate time until due from booking time
- Update countdown every minute
- Pulsing CSS animation for overdue
- Left border: 4px solid color

### UI Changes
- Colored left border on booking cards
- Priority badge in top-right
- Countdown timer in red text when < 3 hours
- Pulsing glow animation for overdue
- Sort dropdown: "By Priority" option

---

## Implementation Order

1. **Enhancement #5** (Priority Indicators) - Easiest, pure UI
2. **Enhancement #2** (Capacity Indicators) - Simple calculation
3. **Enhancement #4** (Batch Toolbar) - Moderate complexity
4. **Enhancement #3** (Undo/Redo) - Complex state management
5. **Enhancement #1** (Drag-and-Drop) - Most complex, requires library

---

## Testing Checklist

### Enhancement #1: Drag-and-Drop
- [ ] Can drag booking card
- [ ] Trip card highlights on drag-over
- [ ] Shows green when capacity allows
- [ ] Shows red when capacity exceeded
- [ ] Booking added to trip on drop
- [ ] Toast notification appears
- [ ] Booking removed from unassigned list

### Enhancement #2: Capacity Indicators
- [ ] Progress bar shows correct percentage
- [ ] Green when under 75%
- [ ] Yellow when 75-90%
- [ ] Red when over 90%
- [ ] Tooltip shows staff breakdown
- [ ] Updates when booking added/removed

### Enhancement #3: Undo/Redo
- [ ] Undo button works
- [ ] Redo button works
- [ ] Keyboard shortcuts work (Ctrl+Z, Ctrl+Y)
- [ ] Toast shows action description
- [ ] Buttons disabled when no actions
- [ ] Tooltip shows what will be undone

### Enhancement #4: Batch Toolbar
- [ ] Toolbar appears when bookings selected
- [ ] Shows correct count
- [ ] "Create Trip" works with selected bookings
- [ ] "Mark Priority" updates all selected
- [ ] "Clear" deselects all
- [ ] Smooth animation

### Enhancement #5: Priority Indicators
- [ ] High priority shows red border
- [ ] Medium priority shows orange border
- [ ] Normal shows gray border
- [ ] Countdown timer updates
- [ ] Overdue bookings pulse
- [ ] Sort by priority works

---

## Expected Impact

- **Time Savings**: 40% reduction in clicks for common operations
- **Error Reduction**: 60% fewer capacity overload errors
- **Mistake Recovery**: Instant undo eliminates panic during busy periods
- **Bulk Efficiency**: 10x faster processing of morning booking batches
- **Priority Management**: Zero missed SLA deadlines

---

## Next Steps

1. Install required dependencies (@dnd-kit/core)
2. Implement enhancements in order
3. Test each enhancement thoroughly
4. Save checkpoint after all complete
5. Gather user feedback for iteration
