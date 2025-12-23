# Unified Design System - Add Workforce Member Forms

## 🎯 Goal
Create **100% consistent** design across ALL form elements in the Add Workforce Member workflow.

---

## 📐 Universal Form Element Specifications

### **ALL Input Fields, Dropdowns, Multi-Selects, Date Pickers**

```css
/* Universal Classes for ALL Form Elements */
.form-field {
  /* Border */
  border: 1px solid #D1D5DB;        /* border border-gray-300 */
  border-radius: 0.5rem;             /* rounded-lg (8px) */
  
  /* Dimensions */
  height: 2.5rem;                    /* h-10 (40px) */
  width: 100%;                       /* w-full */
  
  /* Spacing */
  padding: 0.5rem 0.75rem;           /* py-2 px-3 (8px 12px) */
  
  /* Background */
  background-color: #FFFFFF;         /* bg-white */
  
  /* Typography */
  font-size: 0.875rem;               /* text-sm (14px) */
  color: #374151;                    /* text-gray-700 */
  
  /* Placeholder */
  placeholder-color: #9CA3AF;        /* placeholder:text-gray-400 */
  
  /* Cursor */
  cursor: pointer;                   /* For dropdowns/selects */
  cursor: text;                      /* For text inputs */
  
  /* Transitions */
  transition: all 0.2s ease;
}

/* Hover State */
.form-field:hover {
  border-color: #9CA3AF;             /* hover:border-gray-400 */
}

/* Focus State */
.form-field:focus {
  outline: none;
  border-color: #3B82F6;             /* focus:border-blue-500 */
  ring: 2px solid #DBEAFE;           /* focus:ring-2 focus:ring-blue-200 */
}

/* Disabled State */
.form-field:disabled {
  background-color: #F3F4F6;         /* bg-gray-100 */
  color: #6B7280;                    /* text-gray-500 */
  cursor: not-allowed;
}
```

---

## 🎨 Tailwind CSS Classes (Standardized)

### **Base Classes (ALL form elements MUST use these)**

```tsx
className="
  w-full h-10 px-3 py-2
  border border-gray-300 rounded-lg
  bg-white
  text-sm text-gray-700
  placeholder:text-gray-400
  hover:border-gray-400
  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
  transition-colors duration-200
"
```

---

## 📋 Field Type Specifications

### **1. Text Input Fields**
**Used for:** Name, Email, Mobile Number, QID Number, etc.

```tsx
<Input
  type="text"
  placeholder="Enter full name"
  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
/>
```

**Specifications:**
- Height: `40px` (h-10)
- Padding: `8px 12px` (py-2 px-3)
- Border: `1px solid #D1D5DB`
- Border Radius: `8px` (rounded-lg)
- Font Size: `14px` (text-sm)
- Placeholder Color: `#9CA3AF` (gray-400)

---

### **2. Dropdown/Select Fields**
**Used for:** Position, Department, Employment Type, Salary Type, Religion, Marital Status

```tsx
<Select>
  <SelectTrigger className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors">
    <SelectValue placeholder="Select position" className="text-gray-400" />
  </SelectTrigger>
  <SelectContent className="border border-gray-200 rounded-lg shadow-lg bg-white">
    <SelectItem value="cleaner" className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
      Cleaner
    </SelectItem>
  </SelectContent>
</Select>
```

**Specifications:**
- Trigger Height: `40px` (h-10)
- Trigger Padding: `8px 12px` (py-2 px-3)
- Trigger Border: `1px solid #D1D5DB`
- Trigger Border Radius: `8px` (rounded-lg)
- Dropdown Border Radius: `8px` (rounded-lg)
- Dropdown Shadow: `shadow-lg`
- Item Padding: `8px 12px` (py-2 px-3)
- Item Font Size: `14px` (text-sm)
- Item Hover: `bg-gray-100`

---

### **3. Multi-Select Fields (Languages, Skills)**
**Used for:** Languages, Skills & Expertise

```tsx
{/* Dropdown Trigger - SAME as regular dropdown */}
<button
  onClick={() => setShowDropdown(!showDropdown)}
  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-400 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors flex items-center justify-between"
>
  <span>Select languages...</span>
  <ChevronDown className="h-4 w-4 text-gray-400" />
</button>

{/* Dropdown Menu - SAME as regular dropdown */}
{showDropdown && (
  <div className="absolute z-50 w-full mt-1 border border-gray-200 rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
    {options.map((option) => (
      <button
        key={option}
        onClick={() => addOption(option)}
        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {option}
      </button>
    ))}
  </div>
)}

{/* Selected Tags */}
<div className="flex flex-wrap gap-2 mt-2">
  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-full text-sm font-medium">
    English
    <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 cursor-pointer" />
  </span>
</div>
```

**Specifications:**
- Trigger: **IDENTICAL to regular dropdown**
- Dropdown Menu: **IDENTICAL to regular dropdown**
- Tags: Rounded pills with consistent padding
- Tag Height: Auto (based on content)
- Tag Padding: `4px 12px` (py-1 px-3)
- Tag Border Radius: `9999px` (rounded-full)

---

### **4. Date Picker Fields**
**Used for:** Date of Birth, Start Date, Certificate Expiry

```tsx
<Input
  type="date"
  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
/>
```

**Specifications:**
- **IDENTICAL to text input**
- Height: `40px` (h-10)
- Padding: `8px 12px` (py-2 px-3)
- Border: `1px solid #D1D5DB`
- Border Radius: `8px` (rounded-lg)

---

### **5. File Upload Fields**
**Used for:** QID Upload, Staff Photo, Certificate Upload

```tsx
<label className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-400 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-colors flex items-center justify-center cursor-pointer">
  <Upload className="h-4 w-4 mr-2 text-gray-400" />
  <span>Click to upload</span>
  <input type="file" className="hidden" />
</label>
```

**Specifications:**
- **IDENTICAL to text input/dropdown**
- Height: `40px` (h-10)
- Padding: `8px 12px` (py-2 px-3)
- Border: `1px solid #D1D5DB`
- Border Radius: `8px` (rounded-lg)
- Icon Size: `16px` (h-4 w-4)

---

## 📏 Spacing & Layout Standards

### **Label Spacing**
```tsx
<Label className="text-sm font-medium text-gray-700">
  Field Name <span className="text-red-500">*</span>
</Label>
<Input className="mt-1.5 ..." /> {/* 6px spacing between label and input */}
```

### **Field Spacing (Vertical)**
```tsx
<div className="space-y-4"> {/* 16px between fields */}
  <div>...</div>
  <div>...</div>
</div>
```

### **Grid Layout (2 columns)**
```tsx
<div className="grid grid-cols-2 gap-6"> {/* 24px gap between columns */}
  <div>...</div>
  <div>...</div>
</div>
```

---

## 🎨 Color Palette (Standardized)

### **Borders**
- Default: `#D1D5DB` (gray-300)
- Hover: `#9CA3AF` (gray-400)
- Focus: `#3B82F6` (blue-500)
- Error: `#EF4444` (red-500)

### **Backgrounds**
- Default: `#FFFFFF` (white)
- Disabled: `#F3F4F6` (gray-100)
- Hover (dropdown items): `#F3F4F6` (gray-100)

### **Text**
- Default: `#374151` (gray-700)
- Placeholder: `#9CA3AF` (gray-400)
- Disabled: `#6B7280` (gray-500)
- Label: `#374151` (gray-700)

### **Tags (Multi-select)**
- Languages Background: `#F3F4F6` (gray-100)
- Languages Text: `#374151` (gray-700)
- Languages Border: `#D1D5DB` (gray-300)
- Skills Background: `#EFF6FF` (blue-50)
- Skills Text: `#1D4ED8` (blue-700)
- Skills Border: `#BFDBFE` (blue-200)

---

## ✅ Implementation Checklist

### **Step 1: Staff Type**
- [x] Card borders and hover states

### **Step 2: QID & Search**
- [ ] Search input field
- [ ] File upload button

### **Step 3: Basic Info**
- [ ] Full Name input
- [ ] Nickname input
- [ ] QID Number input (read-only)
- [ ] Date of Birth date picker
- [ ] Nationality dropdown
- [ ] Gender dropdown
- [ ] Mobile Number input
- [ ] Email Address input
- [ ] Photo upload button

### **Step 4: Employment**
- [ ] Position dropdown
- [ ] Department dropdown
- [ ] Employment Type dropdown
- [ ] Start Date date picker
- [ ] Salary Type dropdown
- [ ] Salary detail inputs (all variants)

### **Step 5: Additional**
- [ ] Languages multi-select trigger
- [ ] Languages dropdown menu
- [ ] Skills multi-select trigger
- [ ] Skills dropdown menu
- [ ] Religion dropdown
- [ ] Marital Status dropdown
- [ ] Certificate Name input
- [ ] Certificate Expiry date picker
- [ ] Certificate File upload

---

## 🚀 Implementation Strategy

1. **Create shared CSS classes** or Tailwind config
2. **Update each component** systematically
3. **Test visual consistency** across all steps
4. **Verify responsive behavior** on mobile/tablet
5. **Check accessibility** (focus states, keyboard navigation)

---

## 📱 Responsive Adjustments

### **Mobile (<768px)**
- Maintain same height (40px)
- Maintain same padding
- Grid changes to single column
- Font size remains 14px (readable on mobile)

### **Tablet (768px-1024px)**
- Same as desktop
- 2-column grid maintained

---

## 🎯 Success Criteria

✅ All inputs have **identical** height (40px)  
✅ All inputs have **identical** padding (8px 12px)  
✅ All inputs have **identical** border (1px solid gray-300)  
✅ All inputs have **identical** border-radius (8px)  
✅ All inputs have **identical** font-size (14px)  
✅ All inputs have **identical** placeholder color (gray-400)  
✅ All inputs have **identical** hover state (border-gray-400)  
✅ All inputs have **identical** focus state (border-blue-500 + ring)  
✅ Multi-select triggers look **identical** to regular dropdowns  
✅ Date pickers look **identical** to text inputs  
✅ File uploads look **identical** to other inputs  

---

This unified design system ensures **professional, consistent, and polished** user experience across the entire Add Workforce Member workflow.
