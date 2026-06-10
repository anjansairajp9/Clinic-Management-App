import OverviewCards from "@/components/dashboard/OverviewCards";
import AppointmentSummary from "@/components/dashboard/AppointmentSummary";

export default function DashboardPage() {
  return (
    <div
      style={{
        display:
          "flex",
        flexDirection:
          "column",
        gap: "28px",
        marginTop: "-14px",
      }}
    >
      <OverviewCards />
      <AppointmentSummary />
    </div>
  );
}
