import re

driver_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with open(driver_file, 'r', encoding='utf-8') as f:
    orig_content = f.read()

content = orig_content.replace('\ufeff', '')

start_idx = content.find('{/* 4. SUMMARY & ACTIVATION')
end_idx = content.find('{/* Single Day Shift Management Modal')

if start_idx == -1 or end_idx == -1:
    print("Could not find summary boundaries.")
else:
    with open('replace_summary3.py', 'r', encoding='utf-8') as f:
        code_str = f.read()
        
    new_summary = code_str.split('new_summary = """')[1].split('"""')[0]

    with open(driver_file, 'w', encoding='utf-8') as f:
        f.write(content[:start_idx] + new_summary + "      " + content[end_idx:])
    
    print("Successfully replaced summary section.")
