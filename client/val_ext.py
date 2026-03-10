import codecs

orig = codecs.open('src/pages/DriverPendingInviteDetails.tsx', 'r', 'utf-8').read()

def extract_outer(text, start_idx):
    if start_idx == -1: return ""
    div_count = 0
    pos = start_idx
    while pos < len(text):
        next_open = text.find('<div', pos)
        next_close = text.find('</div', pos)
        
        if next_open == -1 and next_close == -1: break
            
        if next_open != -1 and (next_open < next_close or next_close == -1):
            div_count += 1
            pos = next_open + 4
        else:
            div_count -= 1
            pos = next_close + 6
            if div_count == 0:
                return text[start_idx:pos]
    return ''

p5 = orig.find('title="Logistics"')
enclosing = orig.rfind('<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">', 0, p5)
c_log = extract_outer(orig, enclosing)
print('Logistics div count:', c_log.count('<div') - c_log.count('</div'))
print('Logistics end:', repr(c_log[-20:]))

p4 = orig.find('title="Operations Config"')
e4 = orig.rfind('<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">', 0, p4)
c_ops = extract_outer(orig, e4)
print('Ops div count:', c_ops.count('<div') - c_ops.count('</div'))
print('Ops end:', repr(c_ops[-20:]))

p6 = orig.find('title="System Access & Permissions"')
e6 = orig.rfind('<div className="space-y-6 relative overflow-hidden transition-all duration-300">', 0, p6)
c_sys = extract_outer(orig, e6)
print('Sys access div count:', c_sys.count('<div') - c_sys.count('</div'))
print('Sys access end:', repr(c_sys[-20:]))

p7 = orig.find('<div className="text-center py-4 bg-gradient-to-b from-green-50')
c_sum = extract_outer(orig, p7)
print('Sum div count:', c_sum.count('<div') - c_sum.count('</div'))
print('Sum end:', repr(c_sum[-20:]))

