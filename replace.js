import fs from 'fs';

const path = 'c:/Users/aldobi-001/Downloads/workbook-client_admin/client/src/pages/StaffPendingInviteDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace QID header and text
content = content.replace(/"Auto-fill with QID"/g, '"Identity Verification"');
content = content.replace(/"Upload the staff member's QID document to automatically extract and populate personal details."/g, '"Securely upload the staff member\\'s QID to automatically populate personal details."');

// Replace Personal Information
content = content.replace(/<div className=\{STYLES\.sectionHeader\}>\s*<h3 className=\{STYLES\.sectionTitle\}>\s*Personal Information\s*<\/h3>\s*<span className=\{STYLES\.sectionDesc\}>\s*Core identity details of the staff member for official\s*records\s*<\/span>\s*<\/div>/g, 
  `<SectionHeader title="Personal Details" desc="Core identity and contact details for official employment records." icon={User} />`);

// Replace Role Information
content = content.replace(/<div className=\{STYLES\.sectionHeader\}>\s*<h3 className=\{STYLES\.sectionTitle\}>\s*Role Information\s*<\/h3>\s*<span className=\{STYLES\.sectionDesc\}>\s*Employee.s designation, department allocation, and organizational\s*level\s*<\/span>\s*<\/div>/g,
  `<SectionHeader title="Role & Assignment" desc="Organizational designation, department allocation, and employment status." icon={Briefcase} />`);

// Replace Compensation Package
content = content.replace(/<div className=\{STYLES\.sectionHeader\}>\s*<h3 className=\{STYLES\.sectionTitle\}>\s*Compensation Package\s*<\/h3>\s*<span className=\{STYLES\.sectionDesc\}>\s*Salary structure, allowances, incentives, deductions, and payment\s*terms\s*<\/span>\s*<\/div>/g,
  `<SectionHeader title="Compensation & Benefits" desc="Salary structure, allowances, incentives, and payment terms." icon={Banknote} />`);

// Replace Personal Background
content = content.replace(/<div className=\{STYLES\.sectionHeader\}>\s*<h3 className=\{STYLES\.sectionTitle\}>\s*Personal Background\s*<\/h3>\s*<span className=\{STYLES\.sectionDesc\}>\s*Additional background details required for HR documentation and\s*compliance\s*<\/span>\s*<\/div>/g,
  `<SectionHeader title="Background Information" desc="Additional demographic details required for HR documentation and compliance." icon={FileText} />`);

// Replace Professional Profile
content = content.replace(/<div className=\{STYLES\.sectionHeader\}>\s*<h3 className=\{STYLES\.sectionTitle\}>\s*Professional Profile\s*<\/h3>\s*<span className=\{STYLES\.sectionDesc\}>\s*Key competencies, certifications, technical skills, and role\s*capabilities\s*<\/span>\s*<\/div>/g,
  `<SectionHeader title="Skills & Certifications" desc="Key competencies, mandatory certifications, and professional expertise." icon={Award} />`);

// Replace Operations Config
content = content.replace(/<div className=\{STYLES\.sectionHeader\}>\s*<h3 className=\{STYLES\.sectionTitle\}>\s*Operations Config\s*<\/h3>\s*<span className=\{STYLES\.sectionDesc\}>\s*Operational responsibilities including assigned service categories\s*and coverage\s*<\/span>\s*<\/div>/g,
  `<SectionHeader title="Operational Scope" desc="Service coverage areas and geographical dispatch constraints." icon={MapPin} />`);

// Replace Logistics
content = content.replace(/<div className=\{STYLES\.sectionHeader\}>\s*<h3 className=\{STYLES\.sectionTitle\}>\s*Logistics\s*<\/h3>\s*<span className=\{STYLES\.sectionDesc\}>\s*Dispatch preferences and mobility details\s*<\/span>\s*<\/div>/g,
  `<SectionHeader title="Logistics & Mobility" desc="Transportation arrangements and assigned mobility resources." icon={Truck} />`);

// Replace Staff Base Location
content = content.replace(/<div className=\{STYLES\.sectionHeader\}>\s*<h3 className=\{STYLES\.sectionTitle\}>\s*Staff Base Location\s*<\/h3>\s*<span className=\{STYLES\.sectionDesc\}>\s*Accommodation details, camp assignment, and coordinates\s*<\/span>\s*<\/div>/g,
  `<SectionHeader title="Accommodation Details" desc="Residential assignment, camp location, and geographical coordinates." icon={Layers} />`);

// Replace Schedule & Availability
content = content.replace(/<div className=\{STYLES\.sectionHeader\}>\s*<h3 className=\{STYLES\.sectionTitle\}>\s*Schedule & Availability\s*<\/h3>\s*<span className=\{STYLES\.sectionDesc\}>\s*Working days, time slots, shift patterns, and availability\s*constraints\s*<\/span>\s*<\/div>/g,
  `<SectionHeader title="Schedule & Availability" desc="Shift patterns, working hours, and operational availability constraints." icon={Clock} />`);

// Replace Access & Security
content = content.replace(/<div className=\{STYLES\.sectionHeader\}>\s*<h3 className=\{STYLES\.sectionTitle\}>\s*Access & Security\s*<\/h3>\s*<span className=\{STYLES\.sectionDesc\}>\s*System access levels, dashboard permissions, and security roles\s*<\/span>\s*<\/div>/g,
  `<SectionHeader title="System Access & Permissions" desc="Dashboard access levels, system roles, and platform permissions." icon={ShieldCheck} />`);

// Replace "Next: Employment & Profile" button text (already done but let's be sure of the others)
content = content.replace(/"Next: Employment & Profile /g, '"Next: Employment Details ');
content = content.replace(/"Next: Summary /g, '"Next: Final Review ');

fs.writeFileSync(path, content, 'utf8');
console.log('done');
