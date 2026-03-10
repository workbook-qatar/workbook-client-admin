import codecs

file_path = 'src/pages/DriverPendingInviteDetails.tsx'
with codecs.open(file_path, 'r', 'utf-8') as f:
    orig = f.read()

def get_block(start_str, end_str):
    if end_str:
        return orig[orig.find(start_str):orig.find(end_str)]
    return orig[orig.find(start_str):]

# 1. Driver Profile (Personal + Role)
personal = get_block('{/* Section: Personal Details */}', '{/* Section: Role Information */}')
role = get_block('{/* Section: Role Information */}', '{/* Section: Compensation */}')

# 2. Compensation
comp = get_block('{/* Section: Compensation */}', '{/* 2. OPERATIONS & COMPLIANCE */}')

# 3. Ops Config
ops = get_block('{/* Section: Operations Config */}', '{/* Section: Logistics */}')

# 4. Logistics
logistics = get_block('{/* Section: Logistics */}', '{/* MOVED SCHEDULE SECTION HERE */}')

# 5. Schedule
schedule = get_block('{/* MOVED SCHEDULE SECTION HERE */}', '                 {/* Footer Action */}') 
# Wait, let's find the Next button in Step 1.
part2 = orig[orig.find('{/* 2. OPERATIONS & COMPLIANCE */}') : orig.find('{/* 3. ACCESS & SECURITY */}')]
sched_raw = part2[part2.find('{/* MOVED SCHEDULE SECTION HERE */}'):]
sched_block = sched_raw[:sched_raw.find('<div className="pt-8 border-t')]

# Wait, we need to extract exact `<div className="bg-white border ... ">` for each block to ensure div balance!
def extract_single_card(raw_str):
    s = raw_str.find('<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">')
    if s == -1: return raw_str
    # find where the wrapper ends. Wait, we know each of these sections just ends before the next section.
    # It's safer to just rely on the section markers!
    pass

# Let's extract exactly using markers, but we will strip the trailing `</div>\n` and Next button from the bottom-most component of each step!
c_personal = personal
c_role = role

comp_str = orig[orig.find('{/* Section: Compensation */}'):]
c_comp = comp_str[:comp_str.find('<div className="pt-8 border-t')]

ops_c = get_block('{/* Section: Operations Config */}', '{/* Section: Logistics */}')
log_c = get_block('{/* Section: Logistics */}', '{/* MOVED SCHEDULE SECTION HERE */}')

sched_str = orig[orig.find('{/* MOVED SCHEDULE SECTION HERE */}'):]
c_sched = sched_str[:sched_str.find('<div className="pt-8 border-t')]

access_str = orig[orig.find('{/* 3. ACCESS & SECURITY */}'):orig.find('{/* 4. SUMMARY & ACTIVATION */}')]
# Remove `currentStep` check logic from it:
a1 = access_str.find('                    <SectionHeader')
card_access = access_str[a1:access_str.find('<div className="pt-4 flex items-center justify-between">')]

# We'll construct the tabs manually!
prefix = orig[:orig.find('{/* 1. DRIVER PROFILE */}')]
suffix_start = orig.find('                  <div className="text-center py-4 bg-gradient-to-b')
suffix_end = orig.find('</div>\n              )}\n            </div>\n          </div>\n        </div>\n      </div>')
card_summary = orig[suffix_start:orig.find('<div className="pt-6 flex items-center gap-4">', suffix_start)]


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
                      onClick={{() => saveChanges(true)}}
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
                      onClick={{() => setCurrentStep(0)}}
                      className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={{() => saveChanges(true)}}
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
                  {ops_c}
                  {log_c}
                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={{() => setCurrentStep(1)}}
                      className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={{() => saveChanges(true)}}
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
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">
{card_access}
                  </div>
                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={{() => setCurrentStep(2)}}
                      className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={{() => setCurrentStep(4)}}
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
{card_summary}
                  <div className="pt-6 flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={{() => setCurrentStep(3)}}
                      className="flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                    >
                      Back to Access Control
                    </Button>
                    <Button
                      className="flex-[2] bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 gap-2 rounded-xl px-6 font-bold text-white transition-all h-12 flex items-center justify-center text-sm"
                      onClick={{handleActivate}}
                    >
                      Complete Activation
                      <CheckCircle className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}}
'''

suffix = orig[suffix_end:]

new_content = prefix + step0 + step1 + step2 + step3 + step4 + suffix

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(new_content)
