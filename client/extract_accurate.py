import codecs

file_path = 'src/pages/DriverPendingInviteDetails.tsx'
with codecs.open(file_path, 'r', 'utf-8') as f:
    orig = f.read()

def get_block(start_str, end_str):
    s = orig.find(start_str)
    e = orig.find(end_str, s)
    return orig[s:e]

# Instead of blindly splitting, let's extract sections cleanly:
# 1. Personal Details
c_personal = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">\n                    <SectionHeader\n                      title="Personal Details"' + get_block('title="Personal Details"', '{/* Section: Role Information */}').split('<div className="bg-white border')[0]

c_role = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">\n                    <SectionHeader\n                      title="Role Information"' + get_block('title="Role Information"', '{/* Section: Compensation */}').split('<div className="bg-white border')[0]

c_comp = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">\n                    <SectionHeader\n                      title="Compensation Package"' + get_block('title="Compensation Package"', '{/* 2. OPERATIONS & COMPLIANCE */}').split('<div className="bg-white border')[0][:orig.find('                    <div className="pt-8 border-t border-gray-100 flex items-center justify-between">', orig.find('title="Compensation Package"')) - orig.find('title="Compensation Package"')]

c_ops = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">\n                    <SectionHeader\n                      title="Operations Config"' + get_block('title="Operations Config"', '{/* Section: Logistics */}').split('<div className="bg-white border')[0]

c_logistics = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">\n                    <SectionHeader\n                      title="Logistics"' + get_block('title="Logistics"', '{/* MOVED SCHEDULE SECTION HERE */}').split('<div className="bg-white border')[0]

c_sched = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">\n                    <SectionHeader\n                      title="Schedule & Availability"' + get_block('title="Schedule & Availability"', '{/* 3. ACCESS & SECURITY */}').split('<div className="pt-8 border-t')[0]

# Notice how the System Access was NOT wrapped in bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6
access_inner = '<div className="space-y-6 relative overflow-hidden transition-all duration-300">\n                    <SectionHeader\n                      title="System Access & Permissions"' + get_block('title="System Access & Permissions"', '<div className="pt-4 flex items-center justify-between">').split('                    <div className="pt-4 flex items-center')[0]
# we wrap it manually to keep consistency.
c_access = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">\n' + access_inner + '</div>'

summary_inner = get_block('<div className="text-center py-4 bg-gradient-to-b from-green-50 to-transparent rounded-xl border border-green-100">', '<div className="pt-6 flex items-center gap-4">')

print("All elements parsed.")
# Quick sanity check
for name, html in [('Personal', c_personal), ('Role', c_role), ('Comp', c_comp), ('Ops', c_ops), ('Logistics', c_logistics), ('Sched', c_sched), ('Access', c_access), ('Summary', summary_inner)]:
    print(f'{name} divs:', html.count('<div') - html.count('</div'))

