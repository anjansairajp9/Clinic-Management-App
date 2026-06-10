"use client";

import {
	CalendarDays,
	Clock3,
	Phone,
	Stethoscope,
} from "lucide-react";

type Props = {
	appointments: any[];
};

export default function UpcomingAppointments({
	appointments,
}: Props) {
	const getStatusColor = (
		status: string
	) => {
		switch (status) {
			case "completed":
				return "#4ade80";

			case "cancelled":
				return "#f87171";

			case "no_show":
				return "#f59e0b";

			default:
				return "#38bdf8";
		}
	};

	return (
		<div
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
				backgroundImage:
					"radial-gradient(circle at top right, rgba(56,189,248,0.06), transparent 55%)",
				height:
					"100%",
				minHeight:
					"370px",
				display:
					"flex",
				flexDirection:
					"column",
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
					Upcoming Appointments
				</h3>

				<div
					style={{
						color:
							"#7a9ab8",
						fontSize:
							"12px",
					}}
				>
					{
						appointments.length
					}{" "}
					total
				</div>
			</div>

			{appointments.length ===
				0 ? (
				<div
					style={{
						color:
							"#7a9ab8",
						fontSize:
							"14px",
					}}
				>
					No upcoming
					appointments
				</div>
			) : (
				<div
					style={{
						display:
							"flex",
						flexDirection:
							"column",
						gap: "12px",
						overflowY:
							"auto",
						paddingRight:
							"4px",
					}}
				>
					{appointments.map(
						(
							appointment
						) => {
							const statusColor =
								getStatusColor(
									appointment.status
								);

							return (
								<div
									key={
										appointment.id
									}
									onMouseEnter={(
										e
									) => {
										e.currentTarget.style.transform =
											"translateY(-3px)";
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
											"rgba(255,255,255,0.03)",
										border:
											"1px solid rgba(255,255,255,0.06)",
										borderRadius:
											"18px",
										padding:
											"16px",
										transition:
											"all 0.25s ease",
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
												"flex-start",
										}}
									>
										<div>
											<h4
												style={{
													color:
														"#ffffff",
													fontSize:
														"17px",
													margin:
														"0 0 10px",
													fontWeight:
														600,
												}}
											>
												{
													appointment.patient_name
												}
											</h4>

											<div
												style={{
													display:
														"flex",
													flexDirection:
														"column",
													gap: "8px",
													fontSize:
														"12px",
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
														size={
															13
														}
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
														size={
															13
														}
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
														size={
															13
														}
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
												alignItems:
													"flex-end",
												gap: "10px",
											}}
										>
											<div
												style={{
													padding:
														"6px 12px",
													borderRadius:
														"999px",
													background:
														`${statusColor}20`,
													border: `1px solid ${statusColor}30`,
													color:
														statusColor,
													fontSize:
														"11px",
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

											<div
												style={{
													display:
														"flex",
													flexDirection:
														"column",
													gap: "8px",
													fontSize:
														"12px",
													color:
														"#c7d8ea",
												}}
											>
												<div
													style={{
														display:
															"flex",
														alignItems:
															"center",
														gap: "6px",
													}}
												>
													<CalendarDays
														size={
															13
														}
													/>
													{new Date(
														appointment.appointment_time
													).toLocaleDateString(
														"en-IN",
														{
															day: "2-digit",
															month:
																"short",
														}
													)}
												</div>

												<div
													style={{
														display:
															"flex",
														alignItems:
															"center",
														gap: "6px",
													}}
												>
													<Clock3
														size={
															13
														}
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
								</div>
							);
						}
					)}
				</div>
			)}
		</div>
	);
}