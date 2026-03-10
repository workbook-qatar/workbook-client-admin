import codecs

orig = codecs.open('src/pages/DriverPendingInviteDetails.tsx', 'r', 'utf-8').read()

def extract_outer(text, start_idx):
    if start_idx == -1: return ''
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
c_ops = extract_outer(orig, e_ops)

o = c_ops.split('\n')
b = 0
with codecs.open('c_ops_out.txt', 'w', 'utf-8') as f:
    for i, l in enumerate(o):
        b += l.count('{') - l.count('}')
        f.write(f'{i+1:3d}: {b:2d} | {l}\n')
