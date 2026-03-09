import codecs
import re

driver_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with codecs.open(driver_file, 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('\ufeff', '')

# 1. Update Personal Details div
text = text.replace(
    '                  {/* Section: Personal Details */}\n                  <div className="space-y-6">',
    '                  {/* Section: Personal Details */}\n                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">'
)

# 2. Update Role Information div and header
role_target = """                  {/* Section: Role Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                      <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Role Information
                        </h3>
                        <p className="text-xs text-gray-500">
                          Define the position and departmental placement.
                        </p>
                      </div>
                    </div>"""
role_replacement = """                  {/* Section: Role Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">
                    <SectionHeader
                      title="Role Information"
                      desc="Define the position and departmental placement."
                      icon={Briefcase}
                    />"""
text = text.replace(role_target, role_replacement)

# Remove the Divider between Personal Details and Role Information, as they are now cards
text = text.replace(
    '                  {/* Divider */}\n                  <div className="border-t border-gray-100"></div>',
    ''
)

# 3. Update Compensation Package
comp_target = """                  {/* Section: Compensation */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                      <div className="h-8 w-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <Banknote className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Compensation Package
                        </h3>
                        <p className="text-xs text-gray-500">
                          Configure salary structure and payment terms.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-6 space-y-6">"""
comp_replacement = """                  {/* Section: Compensation */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">
                    <SectionHeader
                      title="Compensation Package"
                      desc="Configure salary structure and payment terms."
                      icon={Banknote}
                    />

                    <div className="space-y-6">"""  # Removing the gray inner card padding to match screenshot style
text = text.replace(comp_target, comp_replacement)

# There is a closing tag `</div>` for the replaced gray box that now belongs to the outer card.
# BUT wait! We replaced `<div className="space-y-6">` and `<div className="bg-gray-50/50 ...">` with 1 outer `<div>` and `<div className="space-y-6">`.
# So the number of open <div>s is unchanged! This is safe.

with codecs.open(driver_file, 'w', encoding='utf-8') as f:
    f.write(text)

print("Applied card wrappers to Personal Details, Role Information, and Compensation Package.")
