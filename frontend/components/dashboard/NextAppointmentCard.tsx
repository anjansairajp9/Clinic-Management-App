"use client";

import {
	Phone,
	Stethoscope,
	CalendarDays,
	Clock3,
} from "lucide-react";

type Props = {
	appointment: any;
};

export default function NextAppointmentCard({
	appointment,
}: Props) {
	if (!appointment) {
		return (
			<div
				style={{
					color:
						"#7a9ab8",
				}}
			>
				No upcoming
				appointments
			</div>
		);
	}

	const statusColor =
		appointment.status ===
		"completed"
			? "#4ade80"
			: appointment.status ===
			  "cancelled"
			? "#f87171"
			: appointment.status ===
			  "no_show"
			? "#f59e0b"
			: "#38bdf8";

	return (
		<div
			onMouseEnter={(
				e
			) => {
				e.currentTarget.style.transform =
					"translateY(-4px)";
				e.currentTarget.style.border =
					"1px solid rgba(56,189,248,0.18)";
				e.currentTarget.style.boxShadow =
					"0 0 24px rgba(56,189,248,0.08)";
			}}
			onMouseLeave={(
				e
			) => {
				e.currentTarget.style.transform =
					"translateY(0)";
				e.currentTarget.style.border =
					"1px solid rgba(255,255,255,0.06)";
				e.currentTarget.style.boxShadow =
					"none";
			}}
			style={{
				background:
					"linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
				border:
					"1px solid rgba(255,255,255,0.06)",
				borderRadius:
					"22px",
				padding:
					"20px",
				backdropFilter:
					"blur(14px)",
				transition:
					"all 0.25s ease",
				backgroundImage:
					"radial-gradient(circle at top right, rgba(56,189,248,0.06), transparent 55%)",
				cursor:
					"pointer",
			}}
		>
			<div
				style={{
					display:
						"flex",
					justifyContent:
						"space-between",
					alignItems:
						"center",
					marginBottom:
						"18px",
				}}
			>
				<h3
					style={{
						color:
							"#f0f6ff",
						fontSize:
							"16px",
						fontWeight:
							600,
						margin: 0,
					}}
				>
					Next Appointment
				</h3>

				<div
					style={{
						padding:
							"7px 14px",
						borderRadius:
							"999px",
						background:
							`${statusColor}20`,
						border: `1px solid ${statusColor}30`,
						color:
							statusColor,
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
				</div>
			</div>

			<div
				style={{
					display:
						"flex",
					justifyContent:
						"space-between",
					gap: "24px",
				}}
			>
				<div>
					<h2
						style={{
							color:
								"#fff",
							fontSize:
								"26px",
							margin:
								"0 0 12px",
							fontWeight:
								700,
						}}
					>
						{
							appointment.patient_name
						}
					</h2>

					<div
						style={{
							display:
								"flex",
							flexDirection:
								"column",
							gap: "10px",
							fontSize:
								"13px",
							color:
								"#7a9ab8",
						}}
					>
						<div
							style={{
								display:
									"flex",
								alignItems:
									"center",
								gap: "8px",
							}}
						>
							<Phone
								size={14}
							/>
							{
								appointment.patient_phone
							}
						</div>

						<div
							style={{
								display:
									"flex",
								alignItems:
									"center",
								gap: "8px",
							}}
						>
							<Stethoscope
								size={14}
							/>
							Dr.{" "}
							{
								appointment.doctor_name
							}
						</div>

						<div
							style={{
								display:
									"flex",
								alignItems:
									"center",
								gap: "8px",
							}}
						>
							<Phone
								size={14}
							/>
							{
								appointment.doctor_phone
							}
						</div>
					</div>
				</div>

				<div
					style={{
						display:
							"flex",
						flexDirection:
							"column",
						gap: "10px",
					}}
				>
					<div
						style={{
							background:
								"rgba(255,255,255,0.04)",
							padding:
								"10px 14px",
							borderRadius:
								"14px",
							display:
								"flex",
							alignItems:
								"center",
							gap: "8px",
							color:
								"#c7d8ea",
							fontSize:
								"13px",
						}}
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

					<div
						style={{
							background:
								"rgba(56,189,248,0.12)",
							border:
								"1px solid rgba(56,189,248,0.18)",
							padding:
								"10px 14px",
							borderRadius:
								"14px",
							display:
								"flex",
							alignItems:
								"center",
							gap: "8px",
							color:
								"#38bdf8",
							fontWeight:
								600,
							fontSize:
								"13px",
						}}
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
				</div>
			</div>
		</div>
	);
}