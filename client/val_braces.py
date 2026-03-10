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

p_ops = orig.find('title="Operations Config"')
e_ops = orig.rfind('<div className="bg-white border', 0, p_ops)

p_log = orig.find('title="Logistics"')
e_log = orig.rfind('<div className="bg-white border', 0, p_log)

p_sys = orig.find('title="System Access & Permissions"')
e_sys = orig.rfind('<div className="space-y-6', 0, p_sys)

c_ops = extract_outer(orig, e_ops)
c_log = extract_outer(orig, e_log)
c_sys = extract_outer(orig, e_sys)

def count_braces(s):
    return s.count('{') - s.count('}')

print('ops braces:', count_braces(c_ops))
print('log braces:', count_braces(c_log))
print('sys braces:', count_braces(c_sys))
