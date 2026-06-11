"use client";

import {
	useState,
} from "react";

import {
	Plus,
} from "lucide-react";

import AppointmentStats from "@/components/appointments/AppointmentStats";
import AppointmentTable from "@/components/appointments/AppointmentTable";
import AppointmentFilters from "@/components/appointments/AppointmentFilters";
import CreateAppointmentModal from "@/components/appointments/CreateAppointmentModal";

export default function AppointmentsPage() {
	const [
		searchQuery,
		setSearchQuery,
	] = useState("");

	const [status, setStatus] =
		useState("scheduled");

	const [
		doctorId,
		setDoctorId,
	] = useState("");

	const [
		isCreateOpen,
		setIsCreateOpen,
	] = useState(false);

	const [
		refreshKey,
		setRefreshKey,
	] = useState(0);

	const handleCreateSuccess =
		() => {
			setRefreshKey(
				(prev) =>
					prev + 1
			);
		};

	return (
		<>
			<div
				style={{
					display:
						"flex",
					flexDirection:
						"column",
					gap: "22px",
					marginTop:
						"-14px",
				}}
			>
				{/* Small Header Section */}
				<div
					style={{
						display:
							"flex",
						alignItems:
							"center",
						justifyContent:
							"space-between",

						paddingBottom:
							"18px",

						borderBottom:
							"1px solid rgba(255,255,255,0.06)",
					}}
				>
					<div>
						<h2
							style={{
								color:
									"#f0f6ff",
								fontSize:
									"18px",
								fontWeight:
									600,
								margin:
									0,
							}}
						>
							Appointments
						</h2>

						<p
							style={{
								color:
									"#7a9ab8",
								fontSize:
									"12px",
								marginTop:
									"4px",
								marginBottom:
									0,
							}}
						>
							Manage clinic appointments
							and scheduling
						</p>
					</div>

					<button
						onClick={() =>
							setIsCreateOpen(
								true
							)
						}
						style={{
							height:
								"46px",

							padding:
								"0 8px",

							borderRadius:
								"14px",

							border:
								"1px solid rgba(56,189,248,0.16)",

							background:
								"linear-gradient(135deg, rgba(34,211,238,0.14), rgba(59,130,246,0.14))",

							color:
								"#38bdf8",

							fontWeight:
								600,

							fontSize:
								"13px",

							cursor:
								"pointer",

							display:
								"flex",

							alignItems:
								"center",

							gap: "8px",

							transition:
								"all 0.25s ease",
						}}
						onMouseEnter={(
							e
						) => {
							e.currentTarget.style.transform =
								"translateY(-2px)";

							e.currentTarget.style.boxShadow =
								"0 0 24px rgba(56,189,248,0.14)";

							e.currentTarget.style.border =
								"1px solid rgba(56,189,248,0.28)";
						}}
						onMouseLeave={(
							e
						) => {
							e.currentTarget.style.transform =
								"translateY(0)";

							e.currentTarget.style.boxShadow =
								"none";

							e.currentTarget.style.border =
								"1px solid rgba(56,189,248,0.16)";
						}}
					>
						<Plus
							size={14}
						/>
						Create Appointment
					</button>
				</div>

				<AppointmentStats
					refreshKey={
						refreshKey
					}
				/>

				<AppointmentFilters
					searchQuery={
						searchQuery
					}
					setSearchQuery={
						setSearchQuery
					}
					status={status}
					setStatus={
						setStatus
					}
					doctorId={
						doctorId
					}
					setDoctorId={
						setDoctorId
					}
				/>

				<AppointmentTable
					refreshKey={
						refreshKey
					}
					searchQuery={
						searchQuery
					}
					status={status}
					doctorId={
						doctorId
					}
				/>
			</div>

			<CreateAppointmentModal
				isOpen={
					isCreateOpen
				}
				onClose={() =>
					setIsCreateOpen(
						false
					)
				}
				onSuccess={
					handleCreateSuccess
				}
			/>
		</>
	);
}