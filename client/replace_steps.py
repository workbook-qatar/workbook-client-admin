import re

driver_file = r'c:\Users\aldobi-001\Downloads\workbook-client_admin\client\src\pages\DriverPendingInviteDetails.tsx'

with open(driver_file, 'r', encoding='utf-8') as f:
    orig_content = f.read()

content = orig_content.replace('\ufeff', '')

old_check_reqs = """  // Check Requirements matching the new 3 Steps (Merged)
  const checkRequirements = () => {
    const d = formData || data;
    const opsValid =
      d.serviceScope === "all" ||
      (d.serviceScope === "specific" && (d.serviceAreas?.length || 0) > 0);
    const scheduleValid = (d.workingDays?.length || 0) > 0;

    const isCompVehicle = d.transportationType === "Company Vehicle";
    // Validate vehicle assignment only if Company Vehicle.
    // If Personal Vehicle, we don't strictly force plate number (as per "vehicle assignment not required"), but could be optional.
    const vehicleValid = isCompVehicle ? !!d.assignedVehicle : true;

    return {
      employment: !!(
        d.role &&
        d.department &&
        d.employmentType &&
        d.startDate &&
        d.salaryType
      ),
      // Combined validation
      ops: !!d.transportationType && vehicleValid && opsValid && scheduleValid,
      summary: true,
    };
  };

  const reqs = checkRequirements();
  const steps = [
    {
      id: "employment",
      label: "Employment & Contracts",
      completed: reqs.employment,
    },
    { id: "ops", label: "Operations & Compliance", completed: reqs.ops },
    {
      id: "summary",
      label: "Summary & Activation",
      completed: currentStep === 2,
    },
  ];"""

new_check_reqs = """  // Check Requirements matching the new 4 Steps
  const checkRequirements = () => {
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
        d.startDate &&
        d.salaryType
      ),
      ops: !!d.transportationType && vehicleValid && opsValid && scheduleValid,
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
    { id: "ops", label: "Operations Setup", completed: reqs.ops },
    { id: "access", label: "Access & Security", completed: reqs.access },
    {
      id: "summary",
      label: "Summary & Activation",
      completed: currentStep === 3,
    },
  ];"""

if old_check_reqs in content:
    content = content.replace(old_check_reqs, new_check_reqs)
    with open(driver_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced checkRequirements and steps.")
else:
    print("Could not find the target code string.")
