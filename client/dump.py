import codecs
content = codecs.open('src/pages/DriverPendingInviteDetails.tsx', encoding='utf-8').read()
lines = content.split('\n')
with codecs.open('dump.txt', 'w', encoding='utf-8') as f:
    for i, l in enumerate(lines):
        if 'SectionHeader' in l or 'title="' in l:
            f.write(f'{i}: {l.strip()}\n')
