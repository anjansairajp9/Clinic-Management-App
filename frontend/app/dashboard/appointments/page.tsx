"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import AppointmentStats from "@/components/appointments/AppointmentStats";
import AppointmentTable from "@/components/appointments/AppointmentTable";
import AppointmentFilters from "@/components/appointments/AppointmentFilters";
import CreateAppointmentModal from "@/components/appointments/AppointmentFormModal";
import { useMobile } from "@/hooks/useMobile";

export default function AppointmentsPage() {
	const isMobile = useMobile();

	// 1. Add mounted state to prevent hydration mismatch
	const [mounted, setMounted] = useState(false);

	const [searchQuery, setSearchQuery] = useState("");
	const [status, setStatus] = useState("scheduled");
	const [doctorId, setDoctorId] = useState("");
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const [createHovered, setCreateHovered] = useState(false);

	// 2. Set mounted to true after initial client render
	useEffect(() => {
		setMounted(true);
	}, []);

	const handleCreateSuccess = () => {
		setRefreshKey((prev) => prev + 1);
	};

	// 3. Return a safe wrapper while mounting
	if (!mounted) {
		return <div style={{ minHeight: "100vh" }} />;
	}

	return (
		<>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "22px",
					marginTop: isMobile ? "0px" : "-14px",
					padding: isMobile ? "16px" : "0",
				}}
			>
				{/* Header Section */}
				<div
					style={{
						display: "flex",
						flexDirection: isMobile ? "column" : "row",
						alignItems: isMobile ? "flex-start" : "center",
						justifyContent: "space-between",
						paddingBottom: "18px",
						borderBottom: "1px solid rgba(255,255,255,0.06)",
						gap: "16px",
						flexWrap: "wrap",
					}}
				>
					<div>
						<h2
							style={{
								color: "#f0f6ff",
								fontSize: isMobile ? "24px" : "18px",
								fontWeight: 600,
								margin: 0,
							}}
						>
							Appointments
						</h2>

						<p
							style={{
								color: "#7a9ab8",
								fontSize: "12px",
								marginTop: "4px",
								marginBottom: 0,
							}}
						>
							Manage clinic appointments and scheduling
						</p>
					</div>

					<button
						onClick={() => setIsCreateOpen(true)}
						onMouseEnter={() => setCreateHovered(true)}
						onMouseLeave={() => setCreateHovered(false)}
						style={{
							height: "46px",
							width: isMobile ? "100%" : "auto",
							padding: "0 16px",
							borderRadius: "14px",
							border: `1px solid ${createHovered
								? "rgba(56,189,248,0.28)"
								: "rgba(56,189,248,0.16)"
								}`,
							background:
								"linear-gradient(135deg, rgba(34,211,238,0.14), rgba(59,130,246,0.14))",
							color: "#38bdf8",
							fontWeight: 600,
							fontSize: "13px",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "8px",
							transition: "all 0.25s ease",
							transform: createHovered ? "translateY(-2px)" : "translateY(0)",
							boxShadow: createHovered
								? "0 0 24px rgba(56,189,248,0.14)"
								: "none",
						}}
					>
						<Plus size={14} />
						Create Appointment
					</button>
				</div>

				<AppointmentStats refreshKey={refreshKey} />

				<AppointmentFilters
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					status={status}
					setStatus={setStatus}
					doctorId={doctorId}
					setDoctorId={setDoctorId}
				/>

				<AppointmentTable
					refreshKey={refreshKey}
					searchQuery={searchQuery}
					status={status}
					doctorId={doctorId}
				/>
			</div>

			<CreateAppointmentModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
				onSuccess={handleCreateSuccess}
			/>
		</>
	);
}
