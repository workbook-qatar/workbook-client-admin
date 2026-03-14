// patch.js
const fs = require('fs');
let code = fs.readFileSync('client/src/pages/FieldServiceStaffDetails.tsx', 'utf8');

const s1 = `{/* ─── 3. OPERATIONAL CONTROL PANEL (HEADER) ─────────────── */}
        <Card className="border-gray-200 shadow-sm bg-white overflow-hidden">`;
const e1 = `          ))}
        </div>`;
const replace1 = `{/* ─── 3. UNIFIED COMMAND CENTER (HEADER + KPIs) ─────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden mb-6">
          <div className="p-6 xl:p-8">
            {(() => {
              let dispatchStatus = "Available";
              let dispatchColor = "bg-green-100 text-green-700";
              if (staff.employmentStatus === "On Leave") {
                dispatchStatus = "On Leave";
                dispatchColor = "bg-amber-100 text-amber-700";
              } else if (staff.employmentStatus !== "Active") {
                dispatchStatus = "Off Duty";
                dispatchColor = "bg-gray-100 text-gray-600";
              } else if (workStatusData.status === "On Job") {
                dispatchStatus = "On Job";
                dispatchColor = "bg-blue-100 text-blue-700";
              }
              
              return (
                <div className="flex flex-col xl:flex-row gap-8 justify-between">
                  {/* LEFT ZONE: Staff Identity */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 shadow-sm border-[3px] border-white ring-1 ring-gray-100 rounded-2xl shrink-0">
                      <AvatarImage src={staff.avatar} className="object-cover" />
                      <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary rounded-2xl">
                        {staff.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-3">
                      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 tracking-tight">
                        {staff.name}
                        {staff.verified && <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-50 shrink-0" />}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-[11px] tracking-wider uppercase">
                          {staff.staffId || staff.id.toString().padStart(4, "0")}
                        </span>
                        <div className="flex items-center gap-1.5">
                           <Phone className="h-4 w-4 text-gray-400" />
                           <span className="font-medium">{staff.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <Mail className="h-4 w-4 text-gray-400" />
                           <span className="font-medium">{staff.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ZONE: Operational Status */}
                  <div className="flex flex-col items-start xl:items-end gap-6">
                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Briefcase className="h-4 w-4 mr-1.5 text-gray-500" /> Assign Job
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1.5 text-gray-500" /> Call Staff
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1.5 text-gray-500" /> Message
                      </Button>
                    </div>

                    {/* Status Grid */}
                    <div className="flex items-start gap-8 border border-gray-100 bg-gray-50/50 rounded-xl px-6 py-4">
                      {/* Status Badges */}
                      <div className="flex flex-col gap-3 justify-center min-w-[130px]">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</span>
                          {staff.employmentStatus === "Active" ? (
                            <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-200 border-0 shadow-none px-2 py-0.5 rounded font-bold w-[76px] justify-center text-[10px]">ACTIVE</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 shadow-none px-2 py-0.5 rounded font-bold w-[76px] justify-center text-[10px] uppercase">{staff.employmentStatus}</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Dispatch</span>
                          <Badge className={\`\${dispatchColor} hover:\${dispatchColor.split(' ')[0]} border-0 shadow-none px-2 py-0.5 rounded font-bold w-[76px] justify-center text-[10px] uppercase\`}>
                            {dispatchStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="w-px h-12 bg-gray-200 mt-1" />

                      {/* Rating */}
                      <div className="flex flex-col gap-1.5 justify-center mt-0.5">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500">Rating</span>
                        <div className="flex items-center gap-1.5 text-base font-bold text-gray-900">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          {staff.rating}
                        </div>
                      </div>

                      <div className="w-px h-12 bg-gray-200 mt-1" />

                      {/* Current Assignment */}
                      <div className="flex flex-col min-w-[150px]">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Current Assignment</span>
                        {dispatchStatus === "On Job" ? (
                          <div className="text-sm">
                            <span className="font-bold text-blue-600 hover:underline cursor-pointer">Booking #2845</span>
                            <div className="text-gray-900 font-semibold text-[13px] mt-0.5">Home Cleaning</div>
                            <div className="text-gray-500 text-xs mt-1 flex items-center gap-1 font-medium">
                              <Clock className="h-3 w-3" /> 08:00 – 11:00
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 font-medium italic mt-1">No active assignment</span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          
          {/* Bottom Panel: KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-gray-200 bg-gray-200 gap-[1px]">
            {[
              {
                label: "Jobs Completed",
                value: staff.jobsCompleted.toString(),
                icon: BarChart3,
              },
              {
                label: "Today's Jobs",
                value: mockBookings.filter((b) => b.date === "2025-12-23").length.toString(),
                icon: CalendarCheck,
              },
              {
                label: "Upcoming",
                value: mockBookings.filter((b) => b.status === "Scheduled").length.toString(),
                icon: CalendarDays,
              },
              {
                label: "Completion Rate",
                value: "98%",
                icon: CheckCircle,
              },
              {
                label: "On-Time Score",
                value: "96%",
                icon: Clock,
              },
              {
                label: "Avg. Rating",
                value: staff.rating.toString(),
                icon: Star,
              },
            ].map((stat, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-3 bg-white hover:bg-gray-50/80 transition-colors">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-tight truncate">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-bold text-gray-900 tracking-tight leading-none mt-0.5">
                    {stat.value}
                  </span>
                </div>
                <div className="h-9 w-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <stat.icon className="h-4.5 w-4.5 text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        </div>`;

const s2 = \`          <TabsContent value="overview" className="mt-0">\`;
const e2 = \`          </TabsContent>\`;

const replace2 = \`          <TabsContent value="overview" className="mt-0">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl flex flex-col xl:flex-row overflow-hidden">
              
              {/* ── LEFT SIDEBAR: Identity & Contact (1/3) ── */}
              <div className="xl:w-1/3 bg-gray-50/50 border-b xl:border-b-0 xl:border-r border-gray-200 p-8 space-y-10">
                
                {/* 1. Personal Information */}
                <section>
                  <SectionHeader icon={User} title="Personal Information" />
                  <div className="flex flex-col gap-y-6 mt-6">
                    <DataField label="Full Name" value={staff.name} />
                    <DataField
                      label="Display Name"
                      value={
                        isEditing ? (
                          <Input
                            value={formData.nickname}
                            onChange={(e) =>
                              setFormData({ ...formData, nickname: e.target.value })
                            }
                            className="h-9"
                          />
                        ) : (
                          staff.nickname || "—"
                        )
                      }
                    />
                    <DataField label="Nationality" value={staff.nationality} />
                    <DataField label="Mobile Number" value={staff.phone} />
                    <DataField label="Email Address" value={staff.email} />
                    <DataField label="QID / ID Number" value={staff.qid} />
                  </div>
                </section>

                <div className="h-px bg-gray-200 w-full" />

                {/* 2. Emergency Contact */}
                <section>
                  <SectionHeader icon={AlertCircle} title="Emergency Contact" />
                  <div className="flex flex-col gap-y-6 mt-6">
                    <DataField label="Contact Name" value={staff.emergencyContact} />
                    <DataField label="Phone" value={staff.emergencyPhone} />
                    <DataField label="Relationship" value={staff.emergencyRelation} />
                  </div>
                </section>

              </div>

              {/* ── RIGHT CONTENT: Employment & Operations (2/3) ── */}
              <div className="xl:w-2/3 p-8 space-y-10">
                
                {/* 3. Employment Information */}
                <section>
                  <SectionHeader icon={Briefcase} title="Employment Information" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                    <DataField label="Department" value={staff.department} />
                    <DataField label="Position" value={staff.position} />
                    <DataField
                      label="Employment Status"
                      value={
                        <Badge
                          className={\`border-0 font-bold px-2 py-0.5 shadow-none \${getEmploymentStatusStyle(staff.employmentStatus)}\`}
                        >
                          {staff.employmentStatus}
                        </Badge>
                      }
                    />
                    <DataField label="Joining Date" value={staff.joiningDate || "Not set"} />
                    <DataField label="Reporting Manager" value={staff.reportingManager || "Not assigned"} className="md:col-span-2" />
                  </div>
                </section>

                <div className="h-px bg-gray-100 w-full" />

                {/* 4. Service & Role Summary */}
                <section>
                  <SectionHeader icon={TrendingUp} title="Service & Role Summary" />
                  <div className="flex flex-col gap-y-6 mt-6">
                    <DataField label="Role Type" value={
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-0 font-bold px-2.5 shadow-none">
                        {staff.roleType}
                      </Badge>
                    } />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                          Service Capabilities
                        </Label>
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {staff.skills?.map((skill, i) => (
                            <Badge key={i} className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 font-semibold text-[13px] px-2.5 shadow-none">
                              {skill}
                            </Badge>
                          ))}
                          {(!staff.skills || staff.skills.length === 0) && (
                            <span className="text-[13px] text-gray-400 font-medium tracking-wide">No skills assigned</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                          Languages Spoken
                        </Label>
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {staff.languages?.map((lang, i) => (
                            <Badge key={i} variant="outline" className="text-gray-600 border-gray-200 font-medium text-[13px] px-2.5 shadow-none bg-white">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <DataField
                      label="Employment Type"
                      value={\`\${staff.employmentType} · \${staff.contractType}\`}
                    />
                  </div>
                </section>

                <div className="h-px bg-gray-100 w-full" />

                {/* 5. Base & Accommodation */}
                <section>
                  <SectionHeader icon={Building2} title="Base & Accommodation" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                    <DataField label="Accommodation Type" value={staff.employmentType === "Full Time" ? "Company Provided" : "Self-Arranged"} />
                    <DataField label="Base Location" value={staff.workLocation || "Not assigned"} />
                    <DataField label="Address" value={staff.address || "—"} className="md:col-span-2" />
                    <DataField label="Area / City" value={\`\${staff.area}, \${staff.city}\`} className="md:col-span-2" />
                  </div>
                </section>

              </div>
            </div>
          </TabsContent>\`;

const i1_start = code.indexOf(s1);
const i1_end = code.indexOf(e1, i1_start) + e1.length;
if (i1_start !== -1 && i1_end > i1_start) {
    code = code.substring(0, i1_start) + replace1 + code.substring(i1_end);
    console.log("Chunk 1 applied successfully.");
} else {
    console.log("Chunk 1 failed.");
}

const i2_start = code.indexOf(s2);
const idxAfterS2 = code.indexOf("          {/* ══════════════════════════════════════════════════════════════════\\n              SCHEDULE TAB", i2_start);
const i2_end = code.lastIndexOf(e2, idxAfterS2) + e2.length;

if (i2_start !== -1 && i2_end > i2_start) {
    code = code.substring(0, i2_start) + replace2 + code.substring(i2_end);
    console.log("Chunk 2 applied successfully.");
} else {
    console.log("Chunk 2 failed. " + i2_start + " " + i2_end);
}

fs.writeFileSync('client/src/pages/FieldServiceStaffDetails.tsx', code);
