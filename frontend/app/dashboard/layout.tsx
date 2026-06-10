import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardDateProvider from "@/context/DashboardDateContext";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DashboardDateProvider>
			<DashboardShell
				title="Dashboard Overview"
				subtitle="Monitor clinic activity, appointments, and operations."
			>
				{children}
			</DashboardShell>
		</DashboardDateProvider>
	);
}
