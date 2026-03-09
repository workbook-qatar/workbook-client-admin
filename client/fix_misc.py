import re

driver_file = r'c:\users\aldobi-001\downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with open(driver_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace reqs.employment with reqs.profile
content = content.replace('reqs.employment', 'reqs.profile')

# Check if SectionHeader exists
if 'const SectionHeader =' not in content:
    SectionHeader_code = """
const SectionHeader = ({
  title,
  desc,
  icon: Icon,
}: {
  title: string;
  desc: string;
  icon: React.ElementType;
}) => (
  <div className="flex items-start gap-4 mb-6 relative group">
    <div className="h-10 w-10 text-blue-600 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100/50 shadow-[inset_0_2px_4px_rgb(255,255,255,0.5)] group-hover:scale-105 transition-transform duration-300">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1 mt-0.5">
      <h3 className="text-base font-bold text-gray-900 tracking-tight">
        {title}
      </h3>
      <span className="text-[13px] text-gray-400 mt-1 block leading-relaxed">
        {desc}
      </span>
    </div>
  </div>
);
"""
    # Insert before export default function DriverPendingInviteDetails
    insert_idx = content.find('export default function DriverPendingInviteDetails')
    if insert_idx != -1:
        content = content[:insert_idx] + SectionHeader_code + '\n' + content[insert_idx:]
        
with open(driver_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed reqs.profile and added SectionHeader.")
