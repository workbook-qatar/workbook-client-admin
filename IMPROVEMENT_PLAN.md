# Phase 2: UI/UX Improvement Plan

This plan outlines the steps to elevate the Workbook Client Admin Dashboard to a premium, production-ready standard.

## 1. Design System Upgrade (The "Wow" Factor) - COMPLETED

- **Objective**: Replace the generic "Corporate Blue" theme with a modern, high-end aesthetic.
- **Actions**:
  - [x] Update `index.css` with a new `oklch` color palette (Deep Indigo, Electric Blue, Slate).
  - [x] Implement **Glassmorphism** utility classes (backdrop-blur, semi-transparent backgrounds).
  - [x] Update `radius` to `0.75rem` or `1rem` for a softer, modern look.
  - [x] Add a "noise" texture overlay for subtle texture (optional).
  - [x] **Font**: Import `Outfit` (Headings) and `Inter` (Body) from Google Fonts.

## 2. Component Refinement - COMPLETED

- [x] **Cards**: Add hover lift effects (`translate-y-1`, shadow increase).
- [x] **Buttons**: usage of gradients for primary actions.
- [x] **Sidebar**: distinct "Glass" look, separating it visually from the main content.
- [x] **Status Badges**: Use "Soft" styles (bg-opacity-10 text-opacity-100) instead of solid blocks.

## 3. Page Improvements - COMPLETED

### Dashboard (Home)

- [x] **Hero Section**: Add a Welcome Greeting with a subtle background graphic/gradient.
- [x] **Charts**: Replace simple number cards with sparklines or mini-charts.
- [x] **Activity Feed**: Make the "Recent Activity" list more visual (avatars, icons).

### Dispatch

- [x] **Map Visualization**: Build a `MockMap` component to render points on a grid, simulating a live map.
- [x] **Trip Cards**: Improve the layout of trip cards to resemble airline/transport tickets.

### Bookings

- [x] **Kanban Option**: Add a toggle to view bookings as a Kanban board (Pending -> Confirmed -> Completed).

## 4. Technical Tasks - MOSTLY COMPLETED

- [x] Install `recharts` (already in package.json, verify usage).
- [ ] Create `ThemeToggle` component (Light/Dark/System) - _Optional/Deferred_.
- [x] Refactor `Sidebar` to handle "Coming Soon" items gracefully.

## Execution Order

1.  **Global Theme Update**: Colors, Fonts, CSS variables. (Done)
2.  **Layout Polish**: Sidebar and Header glassmorphism. (Done)
3.  **Component Styling**: Cards, Buttons, and Table rows. (Done)
4.  **Page Specifics**:
    - Dashboard Charts (Done)
    - Dispatch Map (Done)
    - Bookings Kanban (Done)
    - Customers: Simplified view, removed summary cards, minimal style. Add Customer flow implemented. (Done)
    - Workforce, Services, Reports, Settings (Done)
