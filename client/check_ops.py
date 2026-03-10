import codecs
import re

orig = codecs.open('src/pages/DriverPendingInviteDetails.tsx', 'r', 'utf-8').read()

p_ops = orig.find('title="Operations Config"')
e_ops = orig.rfind('<div className="bg-white border', 0, p_ops)

o = orig[e_ops:e_ops+400]

with codecs.open("ops_start.txt", "w", "utf-8") as f:
    f.write(o)
