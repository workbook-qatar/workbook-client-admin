import codecs

with codecs.open('src/pages/DriverPendingInviteDetails.tsx', 'r', 'utf-8') as f:
    text = f.read()

sep = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">'
parts = text.split(sep)

with codecs.open('out2_utf8.txt', 'w', 'utf-8') as f:
    f.write(f'Parts: {len(parts)}\n')
    for i, p in enumerate(parts):
        title = ''
        idx = p.find('title="')
        if idx != -1: title = p[idx+7:p.find('"', idx+7)]
        f.write(f'Part {i}: {len(p)} - Title: {title}\n')
