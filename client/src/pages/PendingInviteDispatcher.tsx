import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import StaffPendingInviteDetails from "./StaffPendingInviteDetails";
import DriverPendingInviteDetails from "./DriverPendingInviteDetails";
import InternalPendingInviteDetails from "./InternalPendingInviteDetails";
import DashboardLayout from "@/components/DashboardLayout";

// Dispatcher Component
export default function PendingInviteDispatcher() {
  const [, params] = useRoute("/workforce/pending/:id");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("vendor_staff");
    if (stored && params?.id) {
        const list = JSON.parse(stored);
        const found = list.find((s: any) => s.id === params.id || s.id === parseInt(params.id));
        if (found) {
            setData(found);
        }
    }
    setLoading(false);
  }, [params?.id]);

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  if (!data) return <DashboardLayout><div>Invite not found</div></DashboardLayout>;

  // Dispatch Logic based on roleType
  // If roleType is "driver" -> Driver View
  // If roleType is "Internal Staff" -> Internal View
  // If roleType is "Field Service" (or fallback) -> Staff View

  if (data.roleType === 'driver' || data.role === 'Driver') {
      return <DriverPendingInviteDetails initialData={data} />;
  }

  if (data.roleType === 'Internal Staff' || data.type === 'office') {
      return <InternalPendingInviteDetails initialData={data} />;
  }

  // Default to Field Service
  return <StaffPendingInviteDetails />;
}
