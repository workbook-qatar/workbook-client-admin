import re
import codecs

driver_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with codecs.open(driver_file, 'r', encoding='utf-8') as f:
    orig_content = f.read()

content = orig_content.replace('\ufeff', '')

# We will inject the new Personal Details section right after `{currentStep === 0 && (`
# Wait, let's find the exact place.
target = """            <div className="flex-1 overflow-y-auto p-8 bg-white">
              {/* 1. EMPLOYMENT DETAILS */}
              {currentStep === 0 && (
                <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                  {/* Section: Role Information */}"""

insertion = """            <div className="flex-1 overflow-y-auto p-8 bg-white">
              {/* 1. DRIVER PROFILE */}
              {currentStep === 0 && (
                <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pt-2">
                  {/* Section: Personal Details */}
                  <div className="space-y-6">
                    <SectionHeader
                      title="Personal Details"
                      desc="Driver identity and contact details."
                      icon={User}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
                          Profile Photo
                        </Label>
                        <div className="flex items-center gap-4 mt-2">
                          <Avatar className="h-20 w-20 border border-gray-100 shadow-sm">
                            <AvatarImage src={formData.avatar} className="object-cover" />
                            <AvatarFallback className="font-bold bg-blue-50 text-blue-700 text-xl">
                              {formData.name ? formData.name.substring(0, 2).toUpperCase() : "DR"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-2">
                            <Button variant="outline" size="sm" className="h-8">
                              Upload New Photo
                            </Button>
                            <p className="text-[11px] text-gray-500">
                              JPG, PNG or GIF. Max size of 2MB.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          disabled={!isEditing}
                          value={formData.name || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Legal full name"
                          className="h-11 w-full border-gray-200 hover:border-blue-300 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
                          Display Name
                        </Label>
                        <Input
                          disabled={!isEditing}
                          value={formData.nickname || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, nickname: e.target.value })
                          }
                          placeholder="Preferred name"
                          className="h-11 w-full border-gray-200 hover:border-blue-300 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
                          Mobile Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          disabled={!isEditing}
                          value={formData.phone || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+974"
                          className="h-11 w-full border-gray-200 hover:border-blue-300 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
                          Email Address
                        </Label>
                        <Input
                          disabled={true}
                          value={formData.email || ""}
                          className="h-11 w-full bg-gray-50 cursor-not-allowed border-gray-200 text-gray-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 mb-8 border-b border-gray-100"></div>

                  {/* Section: Role Information */}"""

if target in content:
    content = content.replace(target, insertion)
    with codecs.open(driver_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced Employment Details with Driver Profile including Personal Details.")
else:
    print("Could not find the target code string.")
