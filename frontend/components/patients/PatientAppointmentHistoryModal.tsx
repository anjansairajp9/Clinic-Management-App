"use client";

import {
	useEffect,
	useState,
} from "react";

import {
	X,
	Calendar,
	User,
	Phone,
	Stethoscope,
	FileText,
	ClipboardList,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

import {
	getPatientAppointmentHistory,
} from "@/services/patient.service";

import type {
	PatientAppointmentHistory,
} from "@/types/patient";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	patientId: number | null;
	patientName?: string;
};

export default function PatientAppointmentHistoryModal({
	isOpen,
	onClose,
	patientId,
	patientName,
}: Props) {
	const [
		appointments,
		setAppointments,
	] = useState<
		PatientAppointmentHistory[]
	>([]);

	const [
		loading,
		setLoading,
	] = useState(false);

	const [
		page,
		setPage,
	] = useState(1);

	const [
		selectedDate,
		setSelectedDate,
	] = useState("");

	const limit = 10;

	useEffect(() => {
		if (
			!isOpen ||
			!patientId
		) {
			return;
		}

		const fetchHistory =
			async () => {
				try {
					setLoading(
						true
					);

					const response =
						await getPatientAppointmentHistory(
							patientId,
							{
								page,
								limit,
								appointment_date:
									selectedDate ||
									undefined,
							}
						);

					setAppointments(
						response
					);
				} catch (
				error
				) {
					console.error(
						error
					);
				} finally {
					setLoading(
						false
					);
				}
			};

		fetchHistory();
	}, [
		isOpen,
		patientId,
		page,
		selectedDate,
	]);

	useEffect(() => {
		setPage(1);
	}, [selectedDate]);

	if (!isOpen) {
		return null;
	}

	return (
		<>
			<style>{`
        .hover-card {
          transition: all 0.25s ease !important;
        }
        .hover-card:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(56, 189, 248, 0.3) !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3) !important;
        }

        .hover-info-card {
          transition: all 0.2s ease !important;
        }
        .hover-info-card:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          transform: translateY(-1px);
        }

        .hover-field {
          transition: all 0.2s ease !important;
          outline: none;
        }
        .hover-field:hover:not(:focus) {
          border-color: rgba(56, 189, 248, 0.3) !important;
          background: rgba(255, 255, 255, 0.06) !important;
        }
        .hover-field:focus {
          border-color: rgba(56, 189, 248, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15) !important;
        }
        
        .cm-date-picker::-webkit-calendar-picker-indicator {
          filter: invert(0.7) sepia(1) saturate(2) hue-rotate(180deg);
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        .cm-date-picker::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }

        .hover-btn {
          transition: all 0.2s ease !important;
        }
        .hover-btn:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.18) !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }
      `}</style>

			<div
				style={{
					position:
						"fixed",
					inset: 0,
					background:
						"rgba(0,0,0,0.72)",
					backdropFilter:
						"blur(14px)",
					display:
						"flex",
					alignItems:
						"center",
					justifyContent:
						"center",
					zIndex:
						9999,
				}}
			>
				<div
					style={{
						width:
							"min(1100px, 94vw)",
						height:
							"90vh",
						background:
							"linear-gradient(135deg, rgba(5,15,45,0.98), rgba(4,14,40,0.96))",
						border:
							"1px solid rgba(255,255,255,0.08)",
						borderRadius:
							"34px",
						padding:
							"32px",
						overflowY:
							"auto",
						WebkitOverflowScrolling: "touch",
						overscrollBehavior: "contain",
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
								"24px",
						}}
					>
						<div>
							<h2
								style={{
									color:
										"#f8fafc",
									fontSize:
										"38px",
									margin:
										0,
								}}
							>
								Appointment
								History
							</h2>

							<p
								style={{
									color:
										"#8ea4c8",
									marginTop:
										"10px",
								}}
							>
								{patientName}’s
								appointment
								history
							</p>
						</div>

						<button
							onClick={
								onClose
							}
							className="hover-btn"
							style={
								closeButton
							}
						>
							<X />
						</button>
					</div>

					<div
						style={{
							marginBottom:
								"28px",
						}}
					>
						<input
							type="date"
							value={
								selectedDate
							}
							onChange={(
								e
							) =>
								setSelectedDate(
									e.target
										.value
								)
							}
							className="cm-date-picker hover-field"
							style={
								dateInput
							}
						/>
					</div>

					{loading ? (
						<p
							style={{
								color:
									"#94a3b8",
							}}
						>
							Loading...
						</p>
					) : appointments.length ===
						0 ? (
						<p
							style={{
								color:
									"#94a3b8",
							}}
						>
							No appointments
							found
						</p>
					) : (
						<div
							style={{
								display:
									"grid",
								gap:
									"18px",
							}}
						>
							{appointments.map(
								(
									appointment
								) => (
									<div
										key={
											appointment.id
										}
										className="hover-card"
										style={
											card
										}
									>
										<div
											style={{
												display:
													"flex",
												justifyContent:
													"space-between",
											}}
										>
											<div>
												<h3
													style={{
														color:
															"#f8fafc",
														margin:
															0,
														fontSize:
															"24px",
														marginBottom:
															"8px",
													}}
												>
													{
														appointment.doctor_name
													}
												</h3>

												<p
													style={
														subText
													}
												>
													<Stethoscope
														size={
															16
														}
													/>
													{
														appointment.doctor_specialization
													}
												</p>

												<p
													style={{
														...subText,
														marginTop: "6px"
													}}
												>
													<Phone
														size={
															16
														}
													/>
													{
														appointment.doctor_phone
													}
												</p>
											</div>

											<div
												style={{
													textAlign:
														"right",
												}}
											>
												<div
													style={{
														display: "inline-block",
														...statusBadge(
															appointment.status
														)
													}}
												>
													{
														appointment.status
													}
												</div>

												<p
													style={{
														color:
															"#94a3b8",
														marginTop:
															"14px",
													}}
												>
													{
														new Date(
															appointment.appointment_time
														).toLocaleString()
													}
												</p>
											</div>
										</div>

										<div
											style={{
												display:
													"grid",
												gridTemplateColumns:
													"1fr 1fr",
												gap:
													"18px",
												marginTop:
													"24px",
											}}
										>
											<InfoCard
												icon={
													<User size={18} />
												}
												label="Patient"
												value={`${appointment.patient_name} (${appointment.patient_age} years)`}
											/>

											<InfoCard
												icon={
													<Phone size={18} />
												}
												label="Phone"
												value={
													appointment.patient_phone
												}
											/>

											<InfoCard
												icon={
													<Calendar size={18} />
												}
												label="Appointment Type"
												value={
													appointment.appointment_type
												}
											/>

											<InfoCard
												icon={
													<ClipboardList size={18} />
												}
												label="Complaint"
												value={
													appointment.complaint ||
													"Not provided"
												}
											/>
										</div>

										<div
											style={{
												marginTop:
													"20px",
											}}
										>
											<p
												style={{
													color:
														"#8ea4c8",
													fontSize:
														"13px",
													marginBottom:
														"8px",
													fontWeight: 600,
													letterSpacing: "0.5px"
												}}
											>
												NOTES
											</p>

											<div
												className="hover-info-card"
												style={{
													background:
														"rgba(255,255,255,0.03)",
													padding:
														"16px",
													borderRadius:
														"18px",
													color:
														"#f1f5f9",
													border: "1px solid rgba(255,255,255,0.06)",
												}}
											>
												{
													appointment.notes ||
													"No notes"
												}
											</div>
										</div>
									</div>
								)
							)}
						</div>
					)}

					<div
						style={{
							display:
								"flex",
							justifyContent:
								"space-between",
							alignItems: "center",
							marginTop:
								"28px",
						}}
					>
						<button
							onClick={() =>
								setPage(
									(
										prev
									) =>
										Math.max(
											prev -
											1,
											1
										)
								)
							}
							className="hover-btn"
							style={
								paginationButton
							}
						>
							<ChevronLeft
								size={18}
							/>
							Previous
						</button>

						<span
							style={{
								color:
									"#8ea4c8",
								fontWeight: 500,
							}}
						>
							Page {page}
						</span>

						<button
							onClick={() =>
								setPage(
									(
										prev
									) =>
										prev +
										1
								)
							}
							className="hover-btn"
							style={
								paginationButton
							}
						>
							Next
							<ChevronRight
								size={18}
							/>
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

function InfoCard({
	icon,
	label,
	value,
}: any) {
	return (
		<div
			className="hover-info-card"
			style={{
				background:
					"rgba(255,255,255,0.03)",
				border:
					"1px solid rgba(255,255,255,0.06)",
				borderRadius:
					"20px",
				padding:
					"18px",
			}}
		>
			<p
				style={{
					color:
						"#8ea4c8",
					fontSize:
						"12px",
					marginBottom: "8px",
				}}
			>
				{label}
			</p>

			<div
				style={{
					display:
						"flex",
					alignItems:
						"center",
					gap: "10px",
					color:
						"#f8fafc",
				}}
			>
				<div style={{ color: "#38bdf8", display: "flex" }}>
					{icon}
				</div>
				{value}
			</div>
		</div>
	);
}

const card = {
	padding: "24px",
	borderRadius: "28px",
	background:
		"rgba(255,255,255,0.03)",
	border:
		"1px solid rgba(255,255,255,0.06)",
};

const subText = {
	display: "flex",
	alignItems: "center",
	gap: "8px",
	color: "#8ea4c8",
};

const closeButton = {
	width: "54px",
	height: "54px",
	borderRadius: "18px",
	border:
		"1px solid rgba(255,255,255,0.08)",
	background:
		"rgba(255,255,255,0.04)",
	color: "#f8fafc",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

const dateInput = {
	background:
		"rgba(255,255,255,0.04)",
	border:
		"1px solid rgba(255,255,255,0.08)",
	borderRadius: "16px",
	padding: "14px 18px",
	color: "#f8fafc",
};

const paginationButton = {
	display: "flex",
	alignItems: "center",
	gap: "8px",
	padding: "12px 20px",
	borderRadius: "16px",
	border:
		"1px solid rgba(255,255,255,0.08)",
	background:
		"rgba(255,255,255,0.04)",
	color: "#d6e2f0",
	cursor: "pointer",
	fontWeight: 500,
};

function statusBadge(
	status: string
) {
	const colors: Record<
		string,
		string
	> = {
		scheduled:
			"#38bdf8",
		completed:
			"#10b981",
		cancelled:
			"#ef4444",
		no_show:
			"#f59e0b",
	};

	return {
		background: `${colors[status]}15`,
		border: `1px solid ${colors[status]}40`,
		color:
			colors[status],
		padding:
			"8px 16px",
		borderRadius:
			"999px",
		fontWeight:
			600,
		fontSize: "14px",
		textTransform:
			"capitalize" as const,
	};
}