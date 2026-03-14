import fs from 'fs';

const path = 'client/src/pages/FieldServiceStaffDetails.tsx';
let content = fs.readFileSync(path, 'utf8');

const startHeader = content.indexOf('<DashboardLayout>');
const endHeader = content.indexOf('{/* ─── 6. PRIMARY TABS (Left Vertical Navigation) ───────────────────────── */}');

if (startHeader === -1 || endHeader === -1) {
  console.log('Could not find header markers');
  process.exit(1);
}

const startTabs = content.indexOf('<Tabs value={activeTab}', endHeader);
const endTabsMenu = content.indexOf('{/* ── RIGHT MAIN CONTENT AREA ── */}', startTabs);

const newHeaderAndNav = `    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-start">
            
            {/* ── 1. LEFT NAVIGATION MENU ── */}
            <div className="w-full xl:w-56 shrink-0 xl:sticky xl:top-6">
              <div className="mb-6 px-2">
                <Button variant="ghost" className="text-gray-500 hover:text-gray-900 -ml-3 h-8 text-xs font-semibold gap-1.5" onClick={() => window.history.back()}>
                  <ChevronLeft className="h-4 w-4" />
                  Back to Staff
                </Button>
              </div>
              <TabsList className="flex flex-col bg-transparent border-0 h-auto p-0 items-stretch space-y-1 w-full text-left">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-blue-50/80 data-[state=active]:text-blue-700 data-[state=active]:shadow-none data-[state=active]:font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 justify-start w-full px-4 py-2.5 h-auto text-sm font-medium rounded-lg transition-all"
                >
                  <User className="h-4.5 w-4.5 mr-2.5" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className="data-[state=active]:bg-blue-50/80 data-[state=active]:text-blue-700 data-[state=active]:shadow-none data-[state=active]:font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 justify-start w-full px-4 py-2.5 h-auto text-sm font-medium rounded-lg transition-all"
                >
                  <CalendarCheck className="h-4.5 w-4.5 mr-2.5" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger
                  value="availability"
                  className="data-[state=active]:bg-blue-50/80 data-[state=active]:text-blue-700 data-[state=active]:shadow-none data-[state=active]:font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 justify-start w-full px-4 py-2.5 h-auto text-sm font-medium rounded-lg transition-all"
                >
                  <Clock className="h-4.5 w-4.5 mr-2.5" />
                  Availability
                </TabsTrigger>
                <TabsTrigger
                  value="compliance"
                  className="data-[state=active]:bg-blue-50/80 data-[state=active]:text-blue-700 data-[state=active]:shadow-none data-[state=active]:font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 justify-start w-full px-4 py-2.5 h-auto text-sm font-medium rounded-lg transition-all"
                >
                  <ShieldCheck className="h-4.5 w-4.5 mr-2.5" />
                  Compliance
                </TabsTrigger>
                <TabsTrigger
                  value="compensation"
                  className="data-[state=active]:bg-blue-50/80 data-[state=active]:text-blue-700 data-[state=active]:shadow-none data-[state=active]:font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 justify-start w-full px-4 py-2.5 h-auto text-sm font-medium rounded-lg transition-all"
                >
                  <Banknote className="h-4.5 w-4.5 mr-2.5" />
                  Compensation
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-blue-50/80 data-[state=active]:text-blue-700 data-[state=active]:shadow-none data-[state=active]:font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 justify-start w-full px-4 py-2.5 h-auto text-sm font-medium rounded-lg transition-all"
                >
                  <Activity className="h-4.5 w-4.5 mr-2.5" />
                  Activity
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── 2. MIDDLE MAIN CONTENT AREA ── */}
`;

content = content.slice(0, startHeader) + newHeaderAndNav + content.slice(endTabsMenu + '{/* ── RIGHT MAIN CONTENT AREA ── */}'.length);

const rightPanel = `
          </TabsContent>
            </div>

            {/* ── 3. RIGHT PROFILE PANEL ── */}
            <div className="w-full xl:w-80 shrink-0 xl:sticky xl:top-6 flex flex-col gap-6 mt-8 xl:mt-0">
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
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 flex flex-col items-center text-center border-b border-gray-100">
                      <Avatar className="h-24 w-24 shadow-sm border-[3px] border-white ring-1 ring-gray-100 rounded-2xl mb-4">
                        <AvatarImage src={staff.avatar} className="object-cover" />
                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary rounded-2xl">
                          {staff.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <h1 className="text-[20px] leading-tight font-bold text-gray-900 flex items-center gap-2 justify-center tracking-tight mb-2">
                        {staff.name}
                        {staff.verified && <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-50 shrink-0" />}
                      </h1>
                      <span className="font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[11px] tracking-wider uppercase mb-5">
                        {staff.staffId || staff.id.toString().padStart(4, "0")}
                      </span>
                      
                      <div className="flex flex-col gap-2.5 w-full px-2">
                        <div className="flex items-center gap-3 text-[13px] text-gray-600 transition-colors">
                          <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="font-medium truncate">{staff.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[13px] text-gray-600 transition-colors">
                          <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="font-medium truncate">{staff.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col gap-4 bg-gray-50/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</span>
                        {staff.employmentStatus === "Active" ? (
                          <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-200 border-0 shadow-none px-2 py-0.5 rounded font-bold justify-center text-[10px]">ACTIVE</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 shadow-none px-2 py-0.5 rounded font-bold justify-center text-[10px] uppercase">{staff.employmentStatus}</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Dispatch</span>
                        <Badge className={\`\${dispatchColor} border-0 shadow-none px-2 py-0.5 rounded font-bold justify-center text-[10px] uppercase hover:opacity-80\`}>
                          {dispatchStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Rating</span>
                        <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-900">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {staff.rating}
                        </div>
                      </div>
                    </div>
                    
                    {dispatchStatus === "On Job" && (
                      <div className="p-5 bg-blue-50/50 border-t border-blue-100">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-blue-700 mb-1.5 block">Current Assignment</span>
                        <div className="text-sm">
                          <span className="font-bold text-blue-700 hover:underline cursor-pointer">Booking #2845</span>
                          <div className="text-gray-900 font-semibold text-[13px] mt-0.5">Home Cleaning</div>
                          <div className="text-blue-600/80 text-xs mt-1 flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3" /> 08:00 – 11:00
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 grid grid-cols-3 gap-2 border-t border-gray-100 bg-white">
                      <Button variant="outline" size="sm" className="w-full flex-col h-auto py-2.5 gap-1.5 px-1 bg-gray-50 hover:bg-gray-100 border-gray-200 shadow-sm">
                        <Briefcase className="h-4 w-4 text-gray-600" /> 
                        <span className="text-[10px] font-bold text-gray-600">Assign</span>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full flex-col h-auto py-2.5 gap-1.5 px-1 bg-gray-50 hover:bg-gray-100 border-gray-200 shadow-sm">
                        <Phone className="h-4 w-4 text-gray-600" /> 
                        <span className="text-[10px] font-bold text-gray-600">Call</span>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full flex-col h-auto py-2.5 gap-1.5 px-1 bg-gray-50 hover:bg-gray-100 border-gray-200 shadow-sm">
                        <Mail className="h-4 w-4 text-gray-600" /> 
                        <span className="text-[10px] font-bold text-gray-600">Message</span>
                      </Button>
                    </div>
                  </div>
                );
              })()}

              {/* KPIs Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Jobs", value: staff.jobsCompleted.toString(), icon: BarChart3 },
                  { label: "Today", value: mockBookings.filter((b) => b.date === "2025-12-23").length.toString(), icon: CalendarCheck },
                  { label: "Upcoming", value: mockBookings.filter((b) => b.status === "Scheduled").length.toString(), icon: CalendarDays },
                  { label: "Complete", value: "98%", icon: CheckCircle },
                  { label: "On-Time", value: "96%", icon: Clock },
                  { label: "Rating", value: staff.rating.toString(), icon: Star },
                ].map((stat, i) => (
                  <div key={i} className="px-4 py-5 flex flex-col items-center justify-center text-center gap-2 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="h-8 w-8 rounded-full bg-gray-50 border border-gray-100 text-gray-600 flex items-center justify-center shrink-0 mb-1">
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 leading-none tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Tabs>
      </div>`;

content = content.replace('          </TabsContent>\n            </div>\n          </div>\n        </Tabs>\n      </div>', rightPanel);

fs.writeFileSync(path, content);
console.log('Successfully updated layout.');
