import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardDateProvider from "@/context/DashboardDateContext";

export default function SuperAdminDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DashboardDateProvider>
			<DashboardShell
				isSuperAdmin={true}
				title="System Overview"
				subtitle="Monitor clinics, platform activity, and business insights."
			>
				{children}
			</DashboardShell>
		</DashboardDateProvider>
	);
}
