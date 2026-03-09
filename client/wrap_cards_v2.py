import re
import codecs

driver_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with codecs.open(driver_file, 'r', encoding='utf-8') as f:
    orig_content = f.read()

# 1. Update Personal Details div
content = re.sub(
    r'\{\/\* Section: Personal Details \*\/\}\s*<div className="space-y-6">',
    '{/* Section: Personal Details */}\n                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">',
    orig_content
)

# 2. Update Role Information div and header
role_pattern = r'\{\/\* Section: Role Information \*\/\}\s*<div className="space-y-6">\s*<div className="flex items-center gap-3 pb-2 border-b border-gray-100">\s*<div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">\s*<Briefcase className="h-4 w-4" \/>\s*<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">\s*Role Information\s*<\/h3>\s*<p className="text-xs text-gray-500">\s*Define the position and departmental placement\.\s*<\/p>\s*<\/div>\s*<\/div>'

role_replacement = """{/* Section: Role Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">
                    <SectionHeader
                      title="Role Information"
                      desc="Define the position and departmental placement."
                      icon={Briefcase}
                    />"""

content = re.sub(role_pattern, role_replacement, content)

# 3. Update Compensation Package
comp_pattern = r'\{\/\* Section: Compensation \*\/\}\s*<div className="space-y-6">\s*<div className="flex items-center gap-3 pb-2 border-b border-gray-100">\s*<div className="h-8 w-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">\s*<Banknote className="h-4 w-4" \/>\s*<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">\s*Compensation Package\s*<\/h3>\s*<p className="text-xs text-gray-500">\s*Configure salary structure and payment terms\.\s*<\/p>\s*<\/div>\s*<\/div>\s*<div className="bg-gray-50/50 border border-gray-200 rounded-xl p-6 space-y-6">'

comp_replacement = """{/* Section: Compensation */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">
                    <SectionHeader
                      title="Compensation Package"
                      desc="Configure salary structure and payment terms."
                      icon={Banknote}
                    />

                    <div className="space-y-6">"""

content = re.sub(comp_pattern, comp_replacement, content)

# Remove the Divider between Personal Details and Role Information, as they are now cards
content = re.sub(
    r'\{\/\* Divider \*\/\}\s*<div className="border-t border-gray-100"><\/div>',
    '',
    content
)

if content != orig_content:
    with codecs.open(driver_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Wrapped step 1 sections in individual cards")
else:
    print("FAILED: No replacements made")
