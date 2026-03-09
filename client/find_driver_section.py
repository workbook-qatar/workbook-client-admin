import os

file_path = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '3. ACCESS & SECURITY' in line:
        start_index = max(0, i - 5)
        end_index = min(len(lines), i + 150)
        print(f"Found at line {i}")
        for j in range(start_index, end_index):
            print(f"{j+1}: {lines[j].rstrip()}")
        break
