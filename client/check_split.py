import codecs

with codecs.open('src/pages/DriverPendingInviteDetails.tsx', 'r', 'utf-8') as f:
    text = f.read()

separator = '<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 mb-6">'

# By splitting on separator, we should get 7 explicit card elements from index 1 to 7 since there are 7 SectionHeaders. 
parts = text.split(separator)

print("Number of parts:", len(parts))

for i, p in enumerate(parts):
    print(f"Part {i} length:", len(p))
    title = ""
    idx = p.find('title="')
    if idx != -1:
        title = p[idx+7:p.find('"', idx+7)]
    print(f"Title: {title}")

