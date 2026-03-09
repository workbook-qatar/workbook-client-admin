import re

driver_file = r'c:\users\aldobi-001\downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with open(driver_file, 'r', encoding='utf-8') as f:
    orig_content = f.read()
    content = orig_content.replace('\ufeff', '')

insert_idx = content.find('{/* 4. SUMMARY & ACTIVATION */}')

access_security_str = """{/* 3. ACCESS & SECURITY */}
              {currentStep === 2 && (
                <div className="max-w-4xl mx-auto animate-in fade-in space-y-8 pt-2">
                  <div className="space-y-6 relative overflow-hidden transition-all duration-300">
                    <SectionHeader
                      title="System Access & Permissions"
                      desc="Dashboard access levels, system roles, and platform permissions."
                      icon={ShieldCheck}
                    />

                    <div className="space-y-6">
                      <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl flex items-center justify-between gap-4 w-full transition-all">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-1">
                            Dashboard Access
                          </h4>
                          <span className="text-[11px] text-gray-400 mt-1 block">
                            Allow login to admin dashboard
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-xl shadow-sm hide-radio">
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                dashboardAccess: true,
                              })
                            }
                            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${formData.dashboardAccess === true ? "bg-purple-50 text-purple-700 opacity-100" : "text-gray-500 hover:text-gray-900 opacity-70"}`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                dashboardAccess: false,
                              })
                            }
                            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${formData.dashboardAccess === false ? "bg-purple-50 text-purple-700 opacity-100" : "text-gray-500 hover:text-gray-900 opacity-70"}`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      <div className="relative overflow-hidden transition-all duration-300 pb-2">
                        {formData.dashboardAccess === false && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center rounded-xl transition-all duration-300">
                            <div className="bg-white px-5 py-3 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 font-medium text-[13px] text-gray-700 flex items-center gap-2.5 animate-in zoom-in-95">
                              <div className="h-7 w-7 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                              </div>
                              Enable Dashboard Access to configure role
                            </div>
                          </div>
                        )}

                        <div
                          className={`space-y-6 pt-2 transition-all duration-300 ${formData.dashboardAccess === false ? "opacity-40 pointer-events-none select-none blur-[1px]" : "animate-in fade-in slide-in-from-top-2"}`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-[13px] font-bold text-gray-900 tracking-tight">
                                System Role{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Button
                                variant="ghost"
                                className="h-auto p-0 text-[12px] font-semibold text-blue-600 hover:text-blue-700 hover:bg-transparent"
                                onClick={() => setLocation("/settings")}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" /> Create
                                System Role
                              </Button>
                            </div>

                            <Select
                              value={formData.systemRole}
                              onValueChange={(v) =>
                                setFormData({ ...formData, systemRole: v })
                              }
                            >
                              <SelectTrigger className="bg-white w-full h-10 border-gray-200 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-purple-100 text-gray-700">
                                <SelectValue placeholder="Select system role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Supervisor">
                                  Supervisor
                                </SelectItem>
                                <SelectItem value="Dispatcher">
                                  Dispatcher
                                </SelectItem>
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

                  <div className="pt-4 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="h-12 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-colors"
                    >
                      Previous Step
                    </Button>
                    <Button
                      className="h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white flex items-center gap-2"
                      onClick={() => setCurrentStep(3)}
                      disabled={!reqs.access}
                    >
                      Next: Final Review <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              """

if insert_idx != -1:
    new_content = content[:insert_idx] + access_security_str + content[insert_idx:]
    with open(driver_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully inserted 3. ACCESS & SECURITY section!")
else:
    print("Could not find summary insertion point")
