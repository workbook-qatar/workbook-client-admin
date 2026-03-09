import codecs

driver_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with codecs.open(driver_file, 'r', encoding='utf-8') as f:
    orig_content = f.read()

content = orig_content.replace('\ufeff', '')

start_idx = content.find('{/* CARD 1: PERSONAL DETAILS */}')
end_idx = content.find('{/* CARD 2: ROLE & COMPENSATION */}', start_idx)

card1_content = """{/* CARD 1: PERSONAL DETAILS */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-sm text-gray-900">
                            Personal Details
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] text-gray-500 bg-gray-50 border-gray-200"
                        >
                          Step 1
                        </Badge>
                      </div>
                      <div className="space-y-3 text-[13px]">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Full Name</span>{" "}
                          <span className="font-semibold text-gray-900 text-right">
                            {formData.name || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Display Name</span>{" "}
                          <span className="font-semibold text-gray-900 text-right">
                            {formData.nickname || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Mobile</span>
                          <span className="font-semibold text-gray-900 text-right">
                            {formData.phone || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Email</span>
                          <span className="font-semibold text-gray-900 text-right">
                            {formData.email || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                    """

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + card1_content + content[end_idx:]
    with codecs.open(driver_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced CARD 1")
else:
    print("CARD 1 or CARD 2 not found")
