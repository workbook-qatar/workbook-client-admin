import os
import re

driver_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'
sidebar_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\staff_sidebar_utf8.txt'

with open(sidebar_file, 'r', encoding='utf-8') as f:
    new_sidebar = f.read()

# Modify new sidebar
new_sidebar = new_sidebar.replace('{data.role || "Field Service Staff"}', '{data.role || "Driver"}')

with open(driver_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace sidebar in driver
# Find old sidebar start and end
start_marker = "{/* LEFT SIDEBAR - PROFILE DETAILS */}"
end_marker = "{/* RIGHT PANEL - WIZARD CONTENT */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    # Need to keep the spaces before the end marker
    spaces = " " * 10
    new_content = content[:start_idx] + new_sidebar.strip() + "\n\n          " + content[end_idx:]
    
    # Add Info import if not exists
    lucide_import_idx = new_content.find('} from "lucide-react";')
    if lucide_import_idx != -1:
        lucide_block_start = new_content.rfind("import {", 0, lucide_import_idx)
        lucide_block = new_content[lucide_block_start:lucide_import_idx]
        if 'Info' not in lucide_block:
            # add Info inside lucide
            new_content = new_content.replace('} from "lucide-react";', '    Info,\n} from "lucide-react";')

    with open(driver_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced sidebar.")
else:
    print("Could not find start or end markers for sidebar.")
