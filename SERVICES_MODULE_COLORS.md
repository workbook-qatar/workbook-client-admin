# Services Module Color Specification

This document contains the hex codes and usage descriptions for the colors currently used in the Services Module design. It is intended for designer handover.

## 1. Status & Feedback (Badges & Alerts)

| Color Name                    | Hex Code  | Tailwind Ref      | Description                                 |
| :---------------------------- | :-------- | :---------------- | :------------------------------------------ |
| **Active Green (Bg)**         | `#DCFCE7` | `bg-green-100`    | Background for "Active" badges.             |
| **Active Green (Text)**       | `#15803D` | `text-green-700`  | Text color for "Active" badges.             |
| **Published Blue (Bg)**       | `#DBEAFE` | `bg-blue-100`     | Background for "Published" badges.          |
| **Published Blue (Text)**     | `#1D4ED8` | `text-blue-700`   | Text color for "Published" badges.          |
| **Unpublished Orange (Bg)**   | `#FFEDD5` | `bg-orange-100`   | Background for "Unpublished" badges.        |
| **Unpublished Orange (Text)** | `#C2410C` | `text-orange-700` | Text color for "Unpublished" badges.        |
| **Synced Text**               | `#16A34A` | `text-green-600`  | Used for "Synced" checkmarks/text.          |
| **Alert Dot**                 | `#F87171` | `bg-red-400`      | Pulsing red dot for "Set up pricing" alert. |
| **Warning Amber**             | `#F59E0B` | `text-amber-500`  | Icon color for preset/system categories.    |

## 2. Brand & Interaction (Buttons & Links)

| Color Name               | Hex Code  | Tailwind Ref      | Description                                |
| :----------------------- | :-------- | :---------------- | :----------------------------------------- |
| **Primary Action**       | `#2563EB` | `bg-blue-600`     | Main "Create Package" button background.   |
| **Primary Hover**        | `#1D4ED8` | `bg-blue-700`     | Hover state for primary buttons.           |
| **Interactive Text**     | `#2563EB` | `text-blue-600`   | Link text and secondary button icons.      |
| **Selection Background** | `#EFF6FF` | `bg-blue-50`      | Active category tab and hover backgrounds. |
| **Border Accent**        | `#93C5FD` | `border-blue-300` | Dashed border for secondary actions.       |
| **Delete Action**        | `#DC2626` | `bg-red-600`      | Destructive "Delete" button background.    |
| **Delete Hover**         | `#B91C1C` | `bg-red-700`      | Hover state for delete buttons.            |

## 3. UI Foundation (Backgrounds & Text)

| Color Name               | Hex Code  | Tailwind Ref      | Description                                |
| :----------------------- | :-------- | :---------------- | :----------------------------------------- |
| **Page Background**      | `#F9FAFB` | `bg-gray-50`      | Main application background area.          |
| **Card Surface**         | `#FFFFFF` | `bg-white`        | Background for cards, dialogs, and panels. |
| **Main Text**            | `#111827` | `text-gray-900`   | Headings, titles, and strong text.         |
| **Body Text**            | `#4B5563` | `text-gray-600`   | Standard description text.                 |
| **Muted Text**           | `#6B7280` | `text-gray-500`   | Labels, meta-data, and hints.              |
| **Disabled/Placeholder** | `#9CA3AF` | `text-gray-400`   | Inactive icons and empty states.           |
| **Borders**              | `#E5E7EB` | `border-gray-200` | Card borders and dividers.                 |

## 4. System Theme Variables (Approximate)

| Variable        | Approx Hex | OKLCH Value       | Usage                       |
| :-------------- | :--------- | :---------------- | :-------------------------- |
| `--primary`     | `#375DFB`  | `0.55 0.22 260`   | Global primary brand color. |
| `--background`  | `#F8F9FC`  | `0.985 0.005 240` | Global app background tint. |
| `--destructive` | `#E62E2E`  | `0.6 0.2 25`      | Global error state color.   |
