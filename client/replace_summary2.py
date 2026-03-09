import re

driver_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with open(driver_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "{/* 4. SUMMARY & ACTIVATION */}"
end_marker = "{/* Single Day Shift Management Modal */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find summary boundaries.")
else:
    # We will generate the new summary content matching staff design
    new_summary = """{/* 4. SUMMARY & ACTIVATION */}
              {currentStep === 3 && (
                <div className="max-w-4xl mx-auto animate-in fade-in space-y-6 pt-2">
                  <div className="text-center py-4 bg-gradient-to-b from-green-50 to-transparent rounded-xl border border-green-100">
                    <div className="h-14 w-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border-2 border-white">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Review & Activate
                    </h2>
                    <span className="block text-[12px] text-gray-500 max-w-md mx-auto mt-1">
                      Finalize the driver's profile for deployment.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* CARD 1: PERSONAL DETAILS */}
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
                            {formData.nickname || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">QID Number</span>{" "}
                          <span className="font-semibold text-gray-900 text-right">
                            {data.qid || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Date of Birth</span>{" "}
                          <span className="font-semibold text-gray-900 text-right">
                            {data.dob || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Nationality</span>{" "}
                          <span className="font-semibold text-gray-900 text-right">
                            {data.nationality || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Gender</span>{" "}
                          <span className="font-semibold text-gray-900 text-right">
                            {data.gender || "-"}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-gray-100 space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Contact</span>
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
                    </div>

                    {/* CARD 2: ROLE & COMPENSATION */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 hover:border-purple-200 transition-colors">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-sm text-gray-900">
                            Role & Compensation
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
                          <span className="text-gray-500">Position</span>{" "}
                          <span className="font-semibold text-gray-900 text-right">
                            {formData.role || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Department</span>{" "}
                          <span className="font-semibold text-gray-900 text-right">
                            {formData.department || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Type</span>{" "}
                          <span className="font-semibold text-gray-900 text-right">
                            {formData.employmentType || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Start Date</span>{" "}
                          <span className="font-semibold text-gray-900 text-right">
                            {formData.startDate || "-"}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-gray-100 space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Scheme</span>
                            <span className="font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-md border border-green-200 text-[11px]">
                              {formData.salaryType || "-"}
                            </span>
                          </div>
                          {(formData.salaryType === "Fixed Monthly" ||
                            formData.salaryType === "Fixed + Commission") && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Base Salary</span>
                              <span className="font-semibold text-gray-900">
                                QAR {formData.salaryAmount || "0"}
                              </span>
                            </div>
                          )}
                          {(formData.salaryType === "Commission-Based" ||
                            formData.salaryType === "Fixed + Commission") && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Commission</span>
                              <span className="font-semibold text-gray-900">
                                {formData.commissionRate || "0"}%
                              </span>
                            </div>
                          )}
                          {formData.salaryType === "Hourly-Rate" && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Hourly Rate</span>
                              <span className="font-semibold text-gray-900">
                                QAR {formData.hourlyRate || "0"}/hr
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CARD 3: OPERATIONS SETUP */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 hover:border-orange-200 transition-colors">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                            <Globe className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-sm text-gray-900">
                            Operations Setup
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] text-gray-500 bg-gray-50 border-gray-200"
                        >
                          Step 2
                        </Badge>
                      </div>
                      <div className="space-y-3 text-[13px]">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Scope</span>
                          <span className="font-semibold text-gray-900 text-right">
                            {formData.serviceScope === "all"
                              ? "All Regions"
                              : "Specific Regions"}
                          </span>
                        </div>
                        <div className="flex justify-between items-start pt-1 border-gray-100">
                          <span className="text-gray-500 shrink-0 mt-0.5">
                            Vehicle Addt.
                          </span>
                          <span className="font-semibold text-gray-900 text-right max-w-[160px] truncate" title={formData.transportationType === "Company Vehicle" ? formData.assignedVehicle : formData.transportationType}>
                            {formData.transportationType === "Company Vehicle" ? (formData.assignedVehicle || "Pending Assignment") : (formData.transportationType || "-")}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-gray-100 space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Shift System</span>
                            <span className="font-semibold text-gray-900">
                              {formData.shiftSystem || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Working Days</span>
                            <span className="font-semibold text-gray-900">
                              {formData.shiftSystem === "Rotational"
                                ? "Varied (Rotational)"
                                : (formData.workingDays?.length || 0) +
                                  " Days/Week"}
                            </span>
                          </div>
                          {formData.shiftSystem === "Fixed" && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Daily Hours</span>
                              <span className="font-semibold text-gray-900">
                                {formData.workHoursStart || "-"} -{" "}
                                {formData.workHoursEnd || "-"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CARD 4: ACCESS & SECURITY */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-sm text-gray-900">
                            Access & Security
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] text-gray-500 bg-gray-50 border-gray-200"
                        >
                          Step 3
                        </Badge>
                      </div>
                      <div className="space-y-3 text-[13px]">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">
                            Driver App Access
                          </span>
                          <Badge className="bg-green-50 text-green-700 border-green-100 rounded hover:bg-green-100">
                            Enabled
                          </Badge>
                        </div>

                        <div className="pt-3 border-t border-gray-100 space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">
                              Management Access
                            </span>
                            {formData.dashboardAccess ? (
                              <Badge className="bg-blue-50 text-blue-700 border-blue-100 rounded hover:bg-blue-100">
                                Granted
                              </Badge>
                            ) : (
                              <span className="font-semibold text-gray-500">
                                No Access
                              </span>
                            )}
                          </div>

                          {formData.dashboardAccess && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">System Role</span>
                              <span className="font-semibold text-gray-900 text-right">
                                {formData.systemRole || "-"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 bg-orange-50/50 rounded-lg p-3 border border-orange-100 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                          <span className="block text-[11px] text-orange-800 leading-relaxed">
                            This profile is ready for final activation.
                            Activating will officially register this driver
                            and send any automated welcome communications
                            if configured.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Back to Access & Security
                    </Button>
                    <Button
                      className="flex-[2] bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 gap-2 rounded-xl px-6 font-bold text-white transition-all h-12 flex items-center justify-center text-sm"
                      onClick={handleActivate}
                    >
                      Complete Activation
                      <CheckCircle className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
"""

    with open(driver_file, 'w', encoding='utf-8') as f:
        f.write(content[:start_idx] + new_summary + "\n              " + content[end_idx:])
    
    print("Successfully replaced summary section.")
