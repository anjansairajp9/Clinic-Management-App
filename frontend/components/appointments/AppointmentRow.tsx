"use client";

import {
	CalendarDays,
	Clock3,
	Phone,
	Eye,
	Stethoscope,
} from "lucide-react";

import type {
	Appointment,
} from "@/types/appointment";

type Props = {
	appointment: Appointment;
	onView: (
		appointmentId: number
	) => void;
};

export default function AppointmentRow({
	appointment,
	onView,
}: Props) {
	const getStatusStyle =
		(status: string) => {
			switch (
				status.toLowerCase()
			) {
				case "completed":
					return {
						background:
							"rgba(34,197,94,0.12)",
						color:
							"#22c55e",
						border:
							"1px solid rgba(34,197,94,0.18)",
					};

				case "cancelled":
					return {
						background:
							"rgba(239,68,68,0.12)",
						color:
							"#ef4444",
						border:
							"1px solid rgba(239,68,68,0.18)",
					};

				default:
					return {
						background:
							"rgba(56,189,248,0.12)",
						color:
							"#38bdf8",
						border:
							"1px solid rgba(56,189,248,0.18)",
					};
			}
		};

	const formatDoctorName =
		(name: string) => {
			if (
				name
					.toLowerCase()
					.startsWith(
						"dr."
					)
			) {
				return name;
			}

			return `Dr. ${name}`;
		};

	return (
		<tr
			onMouseEnter={(
				e
			) => {
				e.currentTarget.style.background =
					"rgba(56,189,248,0.03)";
			}}
			onMouseLeave={(
				e
			) => {
				e.currentTarget.style.background =
					"transparent";
			}}
			style={{
				borderBottom:
					"1px solid rgba(255,255,255,0.05)",
				transition:
					"all 0.2s ease",
			}}
		>
			{/* Patient */}
			<td style={cellStyle}>
				<div
					style={{
						display:
							"flex",
						flexDirection:
							"column",
						gap: "4px",
					}}
				>
					<span
						style={{
							color:
								"#f0f6ff",
							fontWeight:
								600,
							fontSize:
								"15px",
						}}
					>
						{
							appointment.patient_name
						}
					</span>

					<span
						style={{
							color:
								"#7a9ab8",
							fontSize:
								"12px",
						}}
					>
						Age{" "}
						{
							appointment.patient_age
						}
					</span>

					<div
						style={
							iconTextStyle
						}
					>
						<Phone
							size={13}
						/>

						{
							appointment.patient_phone
						}
					</div>
				</div>
			</td>

			{/* Doctor */}
			<td style={cellStyle}>
				<div
					style={{
						display:
							"flex",
						flexDirection:
							"column",
						gap: "5px",
					}}
				>
					<div
						style={{
							color:
								"#f0f6ff",
							fontWeight:
								600,
						}}
					>
						{formatDoctorName(
							appointment.doctor_name
						)}
					</div>

					<div
						style={
							iconTextStyle
						}
					>
						<Stethoscope
							size={13}
						/>

						{
							appointment.doctor_specialization
						}
					</div>

					<div
						style={
							iconTextStyle
						}
					>
						<Phone
							size={13}
						/>

						{
							appointment.doctor_phone
						}
					</div>
				</div>
			</td>

			{/* Date */}
			<td style={cellStyle}>
				<div
					style={
						iconTextStyle
					}
				>
					<CalendarDays
						size={14}
					/>

					{new Date(
						appointment.appointment_time
					).toLocaleDateString(
						"en-IN",
						{
							day: "2-digit",
							month:
								"short",
							year:
								"numeric",
						}
					)}
				</div>
			</td>

			{/* Time */}
			<td style={cellStyle}>
				<div
					style={
						iconTextStyle
					}
				>
					<Clock3
						size={14}
					/>

					{new Date(
						appointment.appointment_time
					).toLocaleTimeString(
						"en-IN",
						{
							hour:
								"2-digit",
							minute:
								"2-digit",
						}
					)}
				</div>
			</td>

			{/* Status */}
			<td style={cellStyle}>
				<span
					style={{
						...getStatusStyle(
							appointment.status
						),
						padding:
							"8px 14px",
						borderRadius:
							"999px",
						fontSize:
							"12px",
						fontWeight:
							600,
						textTransform:
							"capitalize",
					}}
				>
					{
						appointment.status
					}
				</span>
			</td>

			{/* View */}
			<td style={cellStyle}>
				<button
					onClick={() =>
						onView(
							appointment.id
						)
					}
					onMouseEnter={(
						e
					) => {
						e.currentTarget.style.background =
							"rgba(56,189,248,0.16)";
					}}
					onMouseLeave={(
						e
					) => {
						e.currentTarget.style.background =
							"rgba(56,189,248,0.10)";
					}}
					style={{
						background:
							"rgba(56,189,248,0.10)",
						border:
							"1px solid rgba(56,189,248,0.16)",
						color:
							"#38bdf8",
						padding:
							"10px 16px",
						borderRadius:
							"14px",
						cursor:
							"pointer",
						display:
							"flex",
						alignItems:
							"center",
						gap: "8px",
						fontWeight:
							600,
						transition:
							"all 0.2s ease",
					}}
				>
					<Eye
						size={14}
					/>
					View
				</button>
			</td>
		</tr>
	);
}

const cellStyle = {
	padding:
		"20px 18px",
	color: "#d6e2f0",
	fontSize: "14px",
};

const iconTextStyle =
	{
		display:
			"flex",
		alignItems:
			"center",
		gap: "8px",
		fontSize:
			"12px",
		color:
			"#7a9ab8",
	};
