import codecs

file_path = 'src/pages/DriverPendingInviteDetails.tsx'
with codecs.open(file_path, 'r', 'utf-8') as f:
    orig = f.read()

def extract_outer_div_at_index(text, start_idx):
    # Ensure start_idx points exactly to '<div'
    div_count = 0
    pos = start_idx
    while pos < len(text):
        next_open = text.find('<div', pos)
        next_close = text.find('</div', pos)
        
        # If no more tags, break
        if next_open == -1 and next_close == -1:
            break
            
        if next_open != -1 and (next_open < next_close or next_close == -1):
            div_count += 1
            pos = next_open + 4
        else:
            div_count -= 1
            pos = next_close + 6
            if div_count == 0:
                # We found the matching closing tag!
                return text[start_idx:pos]
    return ""

def find_enclosing_div(text, inner_text_index):
    # find the closest backward `<div className="bg-white border`
    return text.rfind('<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">', 0, inner_text_index)

p1 = orig.find('title="Personal Details"')
p2 = orig.find('title="Role Information"')
p3 = orig.find('title="Compensation Package"')
p4 = orig.find('title="Operations Config"')
p5 = orig.find('title="Logistics"')
p6 = orig.find('title="Schedule & Availability"')
p7 = orig.find('title="System Access & Permissions"')

c_personal = extract_outer_div_at_index(orig, find_enclosing_div(orig, p1))
c_role = extract_outer_div_at_index(orig, find_enclosing_div(orig, p2))
c_comp = extract_outer_div_at_index(orig, find_enclosing_div(orig, p3))
c_ops = extract_outer_div_at_index(orig, find_enclosing_div(orig, p4))
c_logistics = extract_outer_div_at_index(orig, find_enclosing_div(orig, p5))
c_sched = extract_outer_div_at_index(orig, find_enclosing_div(orig, p6))

# System Access was NOT wrapped in bg-white border. It had `<div className="space-y-6 relative overflow-hidden transition-all duration-300">`
p7_div = orig.rfind('<div className="space-y-6 relative overflow-hidden transition-all duration-300">', 0, p7)
access_inner = extract_outer_div_at_index(orig, p7_div)
c_access = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">\n' + access_inner + '\n</div>'

# Summary is different. Starts with `<div className="text-center py-4`
p_sum = orig.find('<div className="text-center py-4 bg-gradient-to-b from-green-50')
sum_inner = extract_outer_div_at_index(orig, p_sum)
c_summary = sum_inner

for name, html in [('Personal', c_personal), ('Role', c_role), ('Comp', c_comp), ('Ops', c_ops), ('Logistics', c_logistics), ('Sched', c_sched), ('Access', c_access), ('Summary', c_summary)]:
    print(f'{name} length: {len(html)} | div count: {html.count("<div") - html.count("</div")}')
    if html.count("<div") - html.count("</div") != 0 or len(html) == 0:
        print(f"FAILED TO EXTRACT {name}")

prefix_end = orig.find('{/* 1. DRIVER PROFILE */}')
prefix = orig[:prefix_end]

suffix_start = orig.find('              </div>', orig.find('Complete Activation')) + 14 # skip close tag of the footer action
# actually let's just use the end of the file.
# The original file has 5 closing divs at the end.
suffix = '\n            </div>\n          </div>\n        </div>\n      </div>\n' + orig[orig.find('{/* Single Day Shift Management Modal */}'):]

# Let's rebuild the file step by step!
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
                      onClick={{() => window.scrollTo(0,0) || setCurrentStep(1)}}
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
                      onClick={{() => window.scrollTo(0,0) || setCurrentStep(0)}}
                      className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={{() => window.scrollTo(0,0) || setCurrentStep(2)}}
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
                      onClick={{() => window.scrollTo(0,0) || setCurrentStep(1)}}
                      className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={{() => window.scrollTo(0,0) || setCurrentStep(3)}}
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
                      onClick={{() => window.scrollTo(0,0) || setCurrentStep(2)}}
                      className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={{() => window.scrollTo(0,0) || setCurrentStep(4)}}
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
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Review & Activate</h2>
                    {c_summary}
                  </div>
                  <div className="pt-6 flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={{() => window.scrollTo(0,0) || setCurrentStep(3)}}
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

with codecs.open("src/pages/DriverPendingInviteDetails.tsx", "w", "utf-8") as f:
    f.write(new_content)
print("File successfully generated with bulletproof div parsing!")
