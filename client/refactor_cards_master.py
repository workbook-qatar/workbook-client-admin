import codecs
import re

driver_file = 'src/pages/DriverPendingInviteDetails.tsx'
with open(driver_file, 'r', encoding='utf-8') as f:
    orig = f.read()

s1 = orig.split('{/* 1. DRIVER PROFILE */}')
prefix = s1[0]
middle_and_end = s1[1]

s2 = middle_and_end.split('{/* 2. OPERATIONS & COMPLIANCE */}')
s_profile = s2[0]  # Contains Section: Personal Details and Section: Role Information and Section: Compensation
m_end2 = s2[1]

s3 = m_end2.split('{/* 3. ACCESS & SECURITY */}')
s_ops = s3[0]  # Contains Section: Operations Config, Section: Logistics, and SCHEDULE
m_end3 = s3[1]

s4 = m_end3.split('{/* 4. SUMMARY & ACTIVATION */}')
s_access = s4[0]
s_summary_and_suffix = s4[1]

s5 = s_summary_and_suffix.split('</div>\n              )}\n            </div>\n          </div>\n        </div>\n      </div>')
s_summary = s5[0]
suffix = '</div>\n              )}\n            </div>\n          </div>\n        </div>\n      </div>' + s5[1]

# Now to extract the cards out of profile:
c_personal = s_profile.split('{/* Section: Role Information */}')[0]
profile_rest = s_profile.split('{/* Section: Role Information */}')[1]
c_role = profile_rest.split('{/* Section: Compensation */}')[0]
c_comp = profile_rest.split('{/* Section: Compensation */}')[1]

# Now for ops:
c_opsconfig = s_ops.split('{/* Section: Logistics */}')[0]
ops_rest = s_ops.split('{/* Section: Logistics */}')[1]
c_logistics = ops_rest.split('{/* MOVED SCHEDULE SECTION HERE */}')[0]
c_schedule = ops_rest.split('{/* MOVED SCHEDULE SECTION HERE */}')[1]

# I need to clean up these chunks to remove the outer wrapper and next button so I can reconstruct them.
# The chunks basically contain the condition currentStep === X and the Next button. I shouldn't rely on the wrapper, so I will rebuild the wrapper for each step.

def extract_card_html(chunk, start_marker, end_marker=None):
    s = chunk.find(start_marker)
    if end_marker:
        e = chunk.find(end_marker, s)
        return chunk[s:e]
    return chunk[s:]

# Clean extraction of the specific cards
card_personal = extract_card_html(c_personal, '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">', '<div className="pt-8 border-t border-gray-100 flex items-center justify-between">')
card_role = extract_card_html(c_role, '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">', '<div className="pt-8 border-t border-gray-100 flex items-center justify-between">')
card_comp = extract_card_html(c_comp, '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">', '<div className="pt-8 border-t border-gray-100 flex items-center justify-between">')

card_opsconfig = extract_card_html(c_opsconfig, '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">', '<div className="pt-8 border-t border-gray-100 flex items-center justify-between">')
card_logistics = extract_card_html(c_logistics, '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">', '<div className="pt-8 border-t border-gray-100 flex items-center justify-between">')
card_schedule = extract_card_html(c_schedule, '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">', '<div className="pt-8 border-t border-gray-100 flex items-center justify-between">')

card_access = extract_card_html(s_access, '<div className="space-y-6 relative overflow-hidden transition-all duration-300">', '<div className="pt-4 flex items-center justify-between">')

card_summary = extract_card_html(s_summary, '<div className="text-center py-4 bg-gradient-to-b from-green-50 to-transparent rounded-xl border border-green-100">', '<div className="pt-6 flex items-center gap-4">')

# Let's reconstruct the file:
# Step 0 = Profile (Personal + Role)
step0 = f'''{{/* 1. DRIVER PROFILE */}}
              {{currentStep === 0 && (
                <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                  {{/* Section: Personal Details */}}
                  {card_personal}
                  {{/* Section: Role Information */}}
                  {card_role}
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

# Step 1 = Work Setup (Schedule + Compensation)
step1 = f'''{{/* 2. WORK SETUP */}}
              {{currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                  {{/* MOVED SCHEDULE SECTION HERE */}}
                  {card_schedule}
                  {{/* Section: Compensation Package */}}
                  {card_comp}
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

# Step 2 = Operations Setup (Config + Logistics)
step2 = f'''{{/* 3. OPERATIONS SETUP */}}
              {{currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                  {{/* Section: Operations Config */}}
                  {card_opsconfig}
                  {{/* Section: Logistics */}}
                  {card_logistics}
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

# Step 3 = Access Control
step3 = f'''{{/* 4. ACCESS CONTROL */}}
              {{currentStep === 3 && (
                <div className="max-w-4xl mx-auto animate-in fade-in space-y-8 pt-2">
                  {card_access}
                  <div className="pt-4 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={{() => setCurrentStep(2)}}
                      className="h-12 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-colors"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white flex items-center gap-2"
                      onClick={{() => setCurrentStep(4)}}
                      disabled={{!reqs.access}}
                    >
                      Next: Final Review <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}}
'''

# Step 4 = Review & Activate
step4 = f'''{{/* 5. SUMMARY & ACTIVATION */}}
              {{currentStep === 4 && (
                <div className="max-w-4xl mx-auto animate-in fade-in space-y-6 pt-2">
                  {card_summary}
                  <div className="pt-6 flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={{() => setCurrentStep(3)}}
                      className="flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Back to Access & Security
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

new_content = prefix + step0 + step1 + step2 + step3 + step4 + suffix

with codecs.open(driver_file, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("SUCCESS: Master refactor complete")
