import re
import codecs

driver_file = r"c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx"

with codecs.open(driver_file, "r", encoding="utf-8") as f:
    content = f.read()

req_pattern = r"const checkRequirements = \(\) => \{.+?return \{.+?\};\s*\};\s*const reqs = checkRequirements\(\);\s*const steps = \[\s*\{.+?completed: currentStep === 3,\s*\},\s*\];"
match = re.search(req_pattern, content, flags=re.DOTALL)
if match:
    content = content.replace(match.group(0), """const checkRequirements = () => {
    const d = formData || data;
    const opsValid =
      d.serviceScope === "all" ||
      (d.serviceScope === "specific" && (d.serviceAreas?.length || 0) > 0);
    const scheduleValid = (d.workingDays?.length || 0) > 0;

    const isCompVehicle = d.transportationType === "Company Vehicle";
    const vehicleValid = isCompVehicle ? !!d.assignedVehicle : true;

    return {
      profile: !!(
        d.name &&
        d.phone &&
        d.role &&
        d.department &&
        d.employmentType &&
        d.startDate
      ),
      workSetup: !!d.salaryType && scheduleValid,
      ops: !!d.transportationType && vehicleValid && opsValid,
      access:
        d.dashboardAccess === false ||
        !!(d.dashboardAccess && d.systemRole),
      summary: true,
    };
  };

  const reqs = checkRequirements();
  const steps = [
    {
      id: "profile",
      label: "Driver Profile",
      completed: reqs.profile,
    },
    { id: "workSetup", label: "Work Setup", completed: reqs.workSetup },
    { id: "ops", label: "Operations Setup", completed: reqs.ops },
    { id: "access", label: "Access Control", completed: reqs.access },
    {
      id: "summary",
      label: "Review Activate",
      completed: currentStep === 4,
    },
  ];""")
    with codecs.open(driver_file, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: Updated steps and requirements")
else:
    print("Pattern not found")
