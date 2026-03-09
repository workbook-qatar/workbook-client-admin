import os
import sys

file_path = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

def replace_unique(old, new, content_text, name):
    count = content_text.count(old)
    if count == 1:
        return content_text.replace(old, new)
    else:
        print(f"ERROR: {name} found {count} times instead of 1!")
        sys.exit(1)

old_block = '''                            <Select
                              value={formData.systemRole}
                              onValueChange={v =>
                                setFormData({ ...formData, systemRole: v })
                              }
                            >
                              <SelectTrigger className="bg-white w-full h-10 border-gray-200 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-purple-100 text-gray-700">
                                <SelectValue placeholder="Select system role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Supervisor">Supervisor</SelectItem>
                                <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">'''

new_block = '''                            <Select
                              value={formData.systemRole}
                              onValueChange={v =>
                                setFormData({ ...formData, systemRole: v })
                              }
                            >
                              <SelectTrigger className="bg-white w-full h-10 border-gray-200 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-purple-100 text-gray-700">
                                <SelectValue placeholder="Select system role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Supervisor">Supervisor</SelectItem>
                                <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {formData.systemRole && (
                            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 space-y-4 shadow-sm">
                              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                                    <Briefcase className="h-3.5 w-3.5" />
                                  </div>
                                  <span className="text-sm font-bold text-gray-900">
                                    {formData.systemRole} Access Preview
                                  </span>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-md px-2 py-0.5 text-[10px] font-bold border border-purple-100/50 uppercase tracking-widest shadow-sm"
                                >
                                  Read-Only
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                {(() => {
                                  const rolePermissions: Record<
                                    string,
                                    { module: string; access: string }[]
                                  > = {
                                    Manager: [
                                      {
                                        module: "Workforce",
                                        access: "Full Access",
                                      },
                                      {
                                        module: "Bookings",
                                        access: "Full Access",
                                      },
                                      {
                                        module: "Customers",
                                        access: "Full Access",
                                      },
                                      { module: "Services", access: "Manage" },
                                      {
                                        module: "Finance",
                                        access: "View Only",
                                      },
                                      {
                                        module: "Settings",
                                        access: "View Only",
                                      },
                                    ],
                                    Supervisor: [
                                      {
                                        module: "Workforce",
                                        access: "View Only",
                                      },
                                      { module: "Bookings", access: "Manage" },
                                      {
                                        module: "Dispatch",
                                        access: "Full Access",
                                      },
                                      {
                                        module: "Customers",
                                        access: "View Only",
                                      },
                                    ],
                                    Dispatcher: [
                                      {
                                        module: "Dispatch",
                                        access: "Full Access",
                                      },
                                      { module: "Bookings", access: "Manage" },
                                      {
                                        module: "Workforce",
                                        access: "View Only",
                                      },
                                    ],
                                    Admin: [
                                      {
                                        module: "All Modules",
                                        access: "Full Access",
                                      },
                                      {
                                        module: "System Settings",
                                        access: "Full Access",
                                      },
                                      {
                                        module: "User Management",
                                        access: "Full Access",
                                      },
                                      {
                                        module: "Billing",
                                        access: "Full Access",
                                      },
                                    ],
                                  };

                                  const perms =
                                    rolePermissions[formData.systemRole] || [];

                                  return perms.map((p, i) => (
                                    <div key={i} className="space-y-1">
                                      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                                        {p.module}
                                      </div>
                                      <div className="text-[13px] font-medium text-gray-900 flex items-center gap-1.5">
                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                        {p.access}
                                      </div>
                                    </div>
                                  ));
                                })()}
                              </div>
                            </div>
                          )}
                          
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">'''

# check if Badge is imported
if "Badge," not in content and "Badge " not in content:
  pass # We probably need to ensure Badge is imported

content = replace_unique(old_block, new_block, content, 'System Role Access Preview injection')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected successfully!")
