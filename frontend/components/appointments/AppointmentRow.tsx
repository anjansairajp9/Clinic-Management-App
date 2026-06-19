"use client";

import { useState } from "react";
import { CalendarDays, Clock3, Phone, Eye, Stethoscope } from "lucide-react";
import type { Appointment } from "@/types/appointment";

type Props = {
	appointment: Appointment;
	onView: (appointmentId: number) => void;
	isMobile: boolean;
};

export default function AppointmentRow({
	appointment,
	onView,
	isMobile,
}: Props) {
	const [isHovered, setIsHovered] = useState(false);

	const getStatusStyle = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
				return {
					background: "rgba(34,197,94,0.12)",
					color: "#22c55e",
					border: "1px solid rgba(34,197,94,0.18)",
				};
			case "cancelled":
				return {
					background: "rgba(239,68,68,0.12)",
					color: "#ef4444",
					border: "1px solid rgba(239,68,68,0.18)",
				};
			case "no_show":
				return {
					background: "rgba(245,158,11,0.12)",
					color: "#fbbf24",
					border: "1px solid rgba(245,158,11,0.18)",
				};
			default:
				return {
					background: "rgba(56,189,248,0.12)",
					color: "#38bdf8",
					border: "1px solid rgba(56,189,248,0.18)",
				};
		}
	};

	const formatDoctorName = (name: string) => {
		if (name.toLowerCase().startsWith("dr.")) {
			return name;
		}
		return `Dr. ${name}`;
	};

	if (isMobile) {
		return (
			<div
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{
					padding: "16px",
					display: "flex",
					flexDirection: "column",
					gap: "14px",
					background: isHovered ? "rgba(255,255,255,0.025)" : "transparent",
					transition: "all 0.2s ease",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
					}}
				>
					<div>
						<div
							style={{
								color: "#f0f6ff",
								fontWeight: 600,
								fontSize: "16px",
							}}
						>
							{appointment.patient_name}
						</div>
						<div
							style={{
								color: "#c8d8e8",
								fontSize: "13px",
								display: "flex",
								alignItems: "center",
								gap: "6px",
								marginTop: "4px",
							}}
						>
							<Phone size={12} /> {appointment.patient_phone}
						</div>
					</div>
					<span
						style={{
							...getStatusStyle(appointment.status),
							padding: "6px 10px",
							borderRadius: "999px",
							fontSize: "11px",
							fontWeight: 600,
							textTransform: "capitalize",
						}}
					>
						{appointment.status.replace("_", " ")}
					</span>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "6px",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							fontSize: "12px",
							color: "#7a9ab8",
						}}
					>
						<Stethoscope size={14} color="#60a5fa" />
						<span style={{ color: "#e2e8f0" }}>
							{formatDoctorName(appointment.doctor_name)}
						</span>
						<span style={{ color: "#7a9ab8" }}>
							({appointment.doctor_specialization})
						</span>
					</div>
					<div style={{ display: "flex", gap: "16px" }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								fontSize: "12px",
								color: "#7a9ab8",
							}}
						>
							<CalendarDays size={14} color="#60a5fa" />
							<span style={{ color: "#e2e8f0" }}>
								{new Date(appointment.appointment_time).toLocaleDateString(
									"en-IN",
									{
										day: "2-digit",
										month: "short",
									}
								)}
							</span>
						</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								fontSize: "12px",
								color: "#7a9ab8",
							}}
						>
							<Clock3 size={14} color="#60a5fa" />
							<span style={{ color: "#e2e8f0" }}>
								{new Date(appointment.appointment_time).toLocaleTimeString(
									"en-IN",
									{
										hour: "2-digit",
										minute: "2-digit",
									}
								)}
							</span>
						</div>
					</div>
				</div>

				<div style={{ display: "flex", justifyContent: "flex-end" }}>
					<button
						onClick={() => onView(appointment.id)}
						style={{
							height: "36px",
							padding: "0 14px",
							borderRadius: "12px",
							border: "1px solid rgba(56,189,248,0.18)",
							background: "rgba(56,189,248,0.10)",
							color: "#38bdf8",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							fontSize: "13px",
							fontWeight: 600,
							transition: "all 0.2s ease",
						}}
					>
						<Eye size={14} /> View
					</button>
				</div>
			</div>
		);
	}

	return (
		<tr
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				borderBottom: "1px solid rgba(255,255,255,0.05)",
				background: isHovered ? "rgba(56,189,248,0.03)" : "transparent",
				transition: "all 0.2s ease",
			}}
		>
			<td
				style={{
					padding: "20px 18px",
					color: "#d6e2f0",
					fontSize: "14px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "4px",
					}}
				>
					<span
						style={{
							color: "#f0f6ff",
							fontWeight: 600,
							fontSize: "15px",
						}}
					>
						{appointment.patient_name}
					</span>
					<span
						style={{
							color: "#7a9ab8",
							fontSize: "12px",
						}}
					>
						Age {appointment.patient_age}
					</span>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							fontSize: "12px",
							color: "#7a9ab8",
						}}
					>
						<Phone size={13} />
						{appointment.patient_phone}
					</div>
				</div>
			</td>

			<td
				style={{
					padding: "20px 18px",
					color: "#d6e2f0",
					fontSize: "14px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "5px",
					}}
				>
					<div
						style={{
							color: "#f0f6ff",
							fontWeight: 600,
						}}
					>
						{formatDoctorName(appointment.doctor_name)}
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							fontSize: "12px",
							color: "#7a9ab8",
						}}
					>
						<Stethoscope size={13} />
						{appointment.doctor_specialization}
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							fontSize: "12px",
							color: "#7a9ab8",
						}}
					>
						<Phone size={13} />
						{appointment.doctor_phone}
					</div>
				</div>
			</td>

			<td
				style={{
					padding: "20px 18px",
					color: "#d6e2f0",
					fontSize: "14px",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						fontSize: "12px",
						color: "#7a9ab8",
					}}
				>
					<CalendarDays size={14} />
					{new Date(appointment.appointment_time).toLocaleDateString("en-IN", {
						day: "2-digit",
						month: "short",
						year: "numeric",
					})}
				</div>
			</td>

			<td
				style={{
					padding: "20px 18px",
					color: "#d6e2f0",
					fontSize: "14px",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						fontSize: "12px",
						color: "#7a9ab8",
					}}
				>
					<Clock3 size={14} />
					{new Date(appointment.appointment_time).toLocaleTimeString("en-IN", {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</div>
			</td>

			<td
				style={{
					padding: "20px 18px",
					color: "#d6e2f0",
					fontSize: "14px",
				}}
			>
				<span
					style={{
						...getStatusStyle(appointment.status),
						padding: "8px 14px",
						borderRadius: "999px",
						fontSize: "12px",
						fontWeight: 600,
						textTransform: "capitalize",
					}}
				>
					{appointment.status.replace("_", " ")}
				</span>
			</td>

			<td
				style={{
					padding: "20px 18px",
					color: "#d6e2f0",
					fontSize: "14px",
				}}
			>
				<button
					onClick={() => onView(appointment.id)}
					style={{
						background: "rgba(56,189,248,0.10)",
						border: "1px solid rgba(56,189,248,0.16)",
						color: "#38bdf8",
						padding: "10px 16px",
						borderRadius: "14px",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						gap: "8px",
						fontWeight: 600,
						transition: "all 0.2s ease",
					}}
				>
					<Eye size={14} />
					View
				</button>
			</td>
		</tr>
	);
}
