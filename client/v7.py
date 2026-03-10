import codecs

orig = codecs.open('src/pages/DriverPendingInviteDetails.tsx', 'r', 'utf-8').read()

def get_block(start_str, end_str):
    if end_str:
        return orig[orig.find(start_str):orig.find(end_str)]
    return orig[orig.find(start_str):]

# 1. Driver Profile (Personal + Role)
c_personal = get_block('{/* Section: Personal Details */}', '{/* Section: Role Information */}')
c_role = get_block('{/* Section: Role Information */}', '{/* Section: Compensation */}')

# 2. Compensation
# It starts at {/* Section: Compensation */} and ends at the pt-8 border-t
start_comp = orig.find('{/* Section: Compensation */}')
end_comp = orig.find('<div className="pt-8 border-t', start_comp)
c_comp = orig[start_comp:end_comp]

# 3. Operations Config
c_ops = get_block('{/* Section: Operations Config */}', '{/* Section: Logistics */}')

# 4. Logistics
c_logistics = get_block('{/* Section: Logistics */}', '{/* MOVED SCHEDULE SECTION HERE */}')

# 5. Schedule
start_sched = orig.find('{/* MOVED SCHEDULE SECTION HERE */}')
end_sched = orig.find('<div className="pt-8 border-t', start_sched)
c_sched = orig[start_sched:end_sched]

# 6. Access
# it's within "3. ACCESS & SECURITY", which is currentStep === 2.
start_sys = orig.find('title="System Access & Permissions"')
# Let's get the enclosing div that wraps System Access:
start_sys_div = orig.rfind('<div className="space-y-6 relative overflow-hidden transition-all duration-300">', 0, start_sys)
end_sys_div = orig.find('<div className="pt-4 flex items-center justify-between">', start_sys_div)
access_inner = orig[start_sys_div:end_sys_div]
c_access = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">\n' + access_inner + '\n</div>\n'

# 7. Summary
start_sum = orig.find('<div className="text-center py-4 bg-gradient-to-b from-green-50')
end_sum = orig.find('<div className="pt-6 flex items-center gap-4">', start_sum)
c_summary = orig[start_sum:end_sum]


prefix_end = orig.find('{/* 1. DRIVER PROFILE */}')
prefix = orig[:prefix_end]

suffix_start = orig.find('{/* Single Day Shift Management Modal */}')
suffix = '\n            </div>\n          </div>\n        </div>\n      </div>\n' + orig[suffix_start:]

print([len(x) for x in [c_personal, c_role, c_comp, c_ops, c_logistics, c_sched, c_access, c_summary]])

# verify braces
def count_b(t): return t.count('{') - t.count('}')
print("Braces:", [count_b(x) for x in [c_personal, c_role, c_comp, c_ops, c_logistics, c_sched, c_access, c_summary]])

# We rebuild the steps
step0 = f'''{{/* 1. DRIVER PROFILE */}}
              {{currentStep === 0 && (
                <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                  {c_personal}
                  {c_role}
                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={{() => setLocation("/workforce/pending")}}
                      className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={{() => window.scrollTo(0, 0) || setCurrentStep(1)}}
                      disabled={{!reqs.profile}}
                    >
                      Next: Work Setup <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}}
'''

step1 = f'''{{/* 2. WORK SETUP */}}
              {{currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                  {c_sched}
                  {c_comp}
                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={{() => window.scrollTo(0, 0) || setCurrentStep(0)}}
                      className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={{() => window.scrollTo(0, 0) || setCurrentStep(2)}}
                      disabled={{!reqs.workSetup}}
                    >
                      Next: Operations Setup <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}}
'''

step2 = f'''{{/* 3. OPERATIONS SETUP */}}
              {{currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                  {c_ops}
                  {c_logistics}
                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={{() => window.scrollTo(0, 0) || setCurrentStep(1)}}
                      className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={{() => window.scrollTo(0, 0) || setCurrentStep(3)}}
                      disabled={{!reqs.ops}}
                    >
                      Next: Access Control <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}}
'''

step3 = f'''{{/* 4. ACCESS CONTROL */}}
              {{currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                  {c_access}
                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={{() => window.scrollTo(0, 0) || setCurrentStep(2)}}
                      className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={{() => window.scrollTo(0, 0) || setCurrentStep(4)}}
                      disabled={{!reqs.access}}
                    >
                      Next: Final Review <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}}
'''

step4 = f'''{{/* 5. SUMMARY & ACTIVATION */}}
              {{currentStep === 4 && (
                <div className="max-w-4xl mx-auto animate-in fade-in space-y-6 pt-2">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
                    {c_summary}
                  </div>
                  <div className="pt-6 flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={{() => window.scrollTo(0, 0) || setCurrentStep(3)}}
                      className="flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                    >
                      Back to Access Control
                    </Button>
                    <Button
                      className="flex-[2] bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 gap-2 rounded-xl px-6 font-bold text-white transition-all h-12 flex items-center justify-center text-sm"
                      onClick={{handleActivate}}
                      disabled={{isActivating}}
                    >
                      Complete Activation
                      <CheckCircle className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}}
'''

new_content = prefix + step0 + step1 + step2 + step3 + step4 + suffix

with codecs.open('src/pages/DriverPendingInviteDetails.tsx', 'w', 'utf-8') as f:
    f.write(new_content)
