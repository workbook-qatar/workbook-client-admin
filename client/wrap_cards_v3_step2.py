import re
import codecs

driver_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with codecs.open(driver_file, 'r', encoding='utf-8') as f:
    content = f.read()
orig_content = content

# 1. Operations Config
op_pattern = r'\{\/\* Section: Operations Config \*\/\}\s*<div className="space-y-6 pt-4">\s*<div className="flex items-center gap-3 pb-2 border-b border-gray-100">\s*<div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">\s*<Globe className="h-4 w-4" \/>\s*<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">\s*Operations Config\s*<\/h3>\s*<p className="text-xs text-gray-500">\s*Service areas and operational scope\.\s*<\/p>\s*<\/div>\s*<\/div>\s*<div className="space-y-4">'

op_replacement = """{/* Section: Operations Config */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">
                    <SectionHeader
                      title="Operations Config"
                      desc="Service areas and operational scope."
                      icon={Globe}
                    />

                    <div className="space-y-4">"""

content = re.sub(op_pattern, op_replacement, content)

# Remove the duplicate comment
content = re.sub(
    r'\{\/\* Section: Operations Config \*\/\}\s*\{\/\* Section: Operations Config \*\/\}\s*',
    '{/* Section: Operations Config */}\n                  ',
    content
)


# 2. Logistics
log_pattern = r'\{\/\* Section: Logistics \*\/\}\s*<div className="space-y-4 pt-4">\s*<div className="border-b border-gray-100 pb-2">\s*<h3 className="text-lg font-bold text-gray-900">\s*Logistics\s*<\/h3>\s*<p className="text-xs text-gray-500 mt-0\.5">\s*Used for dispatch and shift planning\.\s*<\/p>\s*<\/div>'

log_replacement = """{/* Section: Logistics */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">
                    <SectionHeader
                      title="Logistics"
                      desc="Used for dispatch and shift planning."
                      icon={Truck}
                    />"""

content = re.sub(log_pattern, log_replacement, content)


# 3. Schedule & Availability
sch_pattern = r'\{\/\* MOVED SCHEDULE SECTION HERE \*\/\}\s*<div className="space-y-6 pt-8 border-t border-gray-100">\s*<div className="flex items-center gap-3 pb-2 border-b border-gray-100">\s*<div className="h-8 w-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">\s*<Calendar className="h-4 w-4" \/>\s*<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">\s*Schedule & Availability\s*<\/h3>\s*<p className="text-xs text-gray-500">\s*Define working days and hours\.\s*<\/p>\s*<\/div>\s*<\/div>\s*<div className="space-y-6">'

sch_replacement = """{/* MOVED SCHEDULE SECTION HERE */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">
                    <SectionHeader
                      title="Schedule & Availability"
                      desc="Define working days and hours."
                      icon={Calendar}
                    />

                    <div className="space-y-6">"""

content = re.sub(sch_pattern, sch_replacement, content)


if content != orig_content:
    with codecs.open(driver_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Wrapped step 2 sections in individual cards")
else:
    print("FAILED: No replacements made")
