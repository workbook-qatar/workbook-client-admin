import re

path = r"c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\StaffPendingInviteDetails.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    (r'<div className=\{STYLES\.sectionHeader\}>[\s\S]*?Role Information[\s\S]*?</div>', 
     r'<SectionHeader title="Role & Assignment" desc="Organizational designation, department allocation, and employment status." icon={Briefcase} />'),
     
    (r'<div className=\{STYLES\.sectionHeader\}>[\s\S]*?Compensation Package[\s\S]*?</div>', 
     r'<SectionHeader title="Compensation & Benefits" desc="Salary structure, allowances, incentives, and payment terms." icon={Banknote} />'),
     
    (r'<div className=\{STYLES\.sectionHeader\}>[\s\S]*?Personal Background[\s\S]*?</div>', 
     r'<SectionHeader title="Background Information" desc="Additional demographic details required for HR documentation and compliance." icon={FileText} />'),
     
    (r'<div className=\{STYLES\.sectionHeader\}>[\s\S]*?Professional Profile[\s\S]*?</div>', 
     r'<SectionHeader title="Skills & Certifications" desc="Key competencies, mandatory certifications, and professional expertise." icon={Award} />'),
     
    (r'<div className=\{STYLES\.sectionHeader\}>[\s\S]*?Operations Config[\s\S]*?</div>', 
     r'<SectionHeader title="Operational Scope" desc="Service coverage areas and geographical dispatch constraints." icon={MapPin} />'),
     
    (r'<div className=\{STYLES\.sectionHeader\}>[\s\S]*?Logistics[\s\S]*?</div>', 
     r'<SectionHeader title="Logistics & Mobility" desc="Transportation arrangements and assigned mobility resources." icon={Truck} />'),
     
    (r'<div className=\{STYLES\.sectionHeader\}>[\s\S]*?Staff Base Location[\s\S]*?</div>', 
     r'<SectionHeader title="Accommodation Details" desc="Residential assignment, camp location, and geographical coordinates." icon={Layers} />'),
     
    (r'<div className=\{STYLES\.sectionHeader\}>[\s\S]*?Schedule & Availability[\s\S]*?</div>', 
     r'<SectionHeader title="Schedule & Availability" desc="Shift patterns, working hours, and operational availability constraints." icon={Clock} />'),
     
    (r'<div className=\{STYLES\.sectionHeader\}>[\s\S]*?>Access & Security<[\s\S]*?</div>', 
     r'<SectionHeader title="System Access & Permissions" desc="Dashboard access levels, system roles, and platform permissions." icon={ShieldCheck} />'),
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")
