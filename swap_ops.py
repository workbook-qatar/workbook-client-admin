import os

file_path = "client/src/pages/StaffPendingInviteDetails.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

logistics_start = -1
base_location_start = -1
transport_select_start = -1
logistics_end = -1

for i, line in enumerate(lines):
    if "{/* Section: Logistics */}" in line:
        logistics_start = i
    if "{/* Base Location Panel */}" in line:
        base_location_start = i
    if "{/* Main Transport Select */}" in line:
        transport_select_start = i
    if "{/* MOVED SCHEDULE SECTION HERE */}" in line:
        logistics_end = i - 1

if all(v != -1 for v in [logistics_start, base_location_start, transport_select_start, logistics_end]):
    print("Found all indices")
    
    # 1. Base Location Code (lines 1637 to 1805)
    base_location_code = lines[base_location_start : transport_select_start]
    
    # 2. Transport Select Code (lines 1806 to 1855)
    transport_code = lines[transport_select_start: logistics_end]

    # Modify Base Location wrapper
    # It has `<div className="pb-6 border-b border-gray-100 space-y-6">` at the start.
    # We want it to be `<div className="space-y-6">`
    for i in range(len(base_location_code)):
        if 'className="pb-6 border-b border-gray-100 space-y-6"' in base_location_code[i]:
            base_location_code[i] = base_location_code[i].replace('className="pb-6 border-b border-gray-100 space-y-6"', 'className="space-y-6"')

    # Create proper Logistics Section
    logistics_section = [
        '                             {/* Section: Logistics */}\n',
        '                             <div className={STYLES.sectionContainer}>\n',
        '        <div className={STYLES.sectionHeader}>\n',
        '            <h3 className={STYLES.sectionTitle}>Logistics</h3>\n',
        '            <span className={STYLES.sectionDesc}>Dispatch preferences and mobility details</span>\n',
        '        </div>\n',
        '\n',
        '                                 <div className="space-y-4">\n'
    ] + transport_code

    # Create proper Staff Base Location Section
    base_location_section = [
        '                             {/* Section: Staff Base Location */}\n',
        '                             <div className={STYLES.sectionContainer}>\n',
        '        <div className={STYLES.sectionHeader}>\n',
        '            <h3 className={STYLES.sectionTitle}>Staff Base Location</h3>\n',
        '            <span className={STYLES.sectionDesc}>Accommodation details, camp assignment, and coordinates</span>\n',
        '        </div>\n',
        '\n',
        '                                 <div className="space-y-4">\n'
    ] + base_location_code + [
        '                                 </div>\n',
        '                             </div>\n\n'
    ]

    new_lines = lines[:logistics_start] + logistics_section + base_location_section + lines[logistics_end:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("Successfully replaced.")
else:
    print("Indices not found", logistics_start, base_location_start, transport_select_start, logistics_end)
