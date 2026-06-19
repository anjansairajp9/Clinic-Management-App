"use client";

import { useEffect, useState } from "react";
import {
	X,
	Calendar,
	User,
	Phone,
	Stethoscope,
	ClipboardList,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { getPatientAppointmentHistory } from "@/services/patient.service";
import type { PatientAppointmentHistory } from "@/types/patient";
import { useMobile } from "@/hooks/useMobile";

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
	const isMobile = useMobile();
	const [appointments, setAppointments] = useState<PatientAppointmentHistory[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [selectedDate, setSelectedDate] = useState("");
	const limit = 10;

	useEffect(() => {
		if (!isOpen || !patientId) return;
		const fetchHistory = async () => {
			try {
				setLoading(true);
				const response = await getPatientAppointmentHistory(patientId, {
					page,
					limit,
					appointment_date: selectedDate || undefined,
				});
				setAppointments(response);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchHistory();
	}, [isOpen, patientId, page, selectedDate]);

	useEffect(() => {
		setPage(1);
	}, [selectedDate]);

	if (!isOpen) return null;

	return (
		<>
			<div
				onClick={onClose}
				style={{
					position: "fixed",
					inset: 0,
					background: "rgba(0,0,0,0.72)",
					backdropFilter: "blur(14px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 9999,
				}}
			>
				<div
					onClick={(e) => e.stopPropagation()}
					style={{
						width: isMobile ? "92vw" : "min(1100px, 94vw)",
						height: "90vh",
						background:
							"linear-gradient(135deg, rgba(5,15,45,0.98), rgba(4,14,40,0.96))",
						border: "1px solid rgba(255,255,255,0.08)",
						borderRadius: isMobile ? "24px" : "34px",
						padding: isMobile ? "20px" : "32px",
						overflowY: "auto",
						WebkitOverflowScrolling: "touch",
						overscrollBehavior: "contain",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "24px",
						}}
					>
						<div>
							<h2
								style={{
									color: "#f8fafc",
									fontSize: isMobile ? "28px" : "38px",
									margin: 0,
								}}
							>
								Appointment History
							</h2>
							<p style={{ color: "#8ea4c8", marginTop: "10px" }}>
								{patientName}’s appointment history
							</p>
						</div>

						<button
							onClick={onClose}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = "rgba(255,255,255,0.08)";
								e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "rgba(255,255,255,0.04)";
								e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
							}}
							style={{
								width: "54px",
								height: "54px",
								borderRadius: "18px",
								border: "1px solid rgba(255,255,255,0.08)",
								background: "rgba(255,255,255,0.04)",
								color: "#f8fafc",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								transition: "all 0.2s ease",
							}}
						>
							<X />
						</button>
					</div>

					<div style={{ marginBottom: "28px" }}>
						<input
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							style={{
								background: "rgba(255,255,255,0.04)",
								border: "1px solid rgba(255,255,255,0.08)",
								borderRadius: "16px",
								padding: "14px 18px",
								color: "#f8fafc",
							}}
						/>
					</div>

					{loading ? (
						<p style={{ color: "#94a3b8" }}>Loading...</p>
					) : appointments.length === 0 ? (
						<p style={{ color: "#94a3b8" }}>No appointments found</p>
					) : (
						<div style={{ display: "grid", gap: "18px" }}>
							{appointments.map((appointment) => (
								<div
									key={appointment.id}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = "translateY(-2px)";
										e.currentTarget.style.background = "rgba(255,255,255,0.05)";
										e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)";
										e.currentTarget.style.boxShadow =
											"0 12px 30px rgba(0,0,0,0.3)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = "translateY(0)";
										e.currentTarget.style.background = "rgba(255,255,255,0.03)";
										e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
										e.currentTarget.style.boxShadow = "none";
									}}
									style={{
										padding: "24px",
										borderRadius: "28px",
										background: "rgba(255,255,255,0.03)",
										border: "1px solid rgba(255,255,255,0.06)",
										transition: "all 0.25s ease",
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											flexDirection: isMobile ? "column" : "row",
											gap: isMobile ? "12px" : "0",
										}}
									>
										<div>
											<h3
												style={{
													color: "#f8fafc",
													margin: 0,
													fontSize: "24px",
													marginBottom: "8px",
												}}
											>
												{appointment.doctor_name}
											</h3>
											<p
												style={{
													display: "flex",
													alignItems: "center",
													gap: "8px",
													color: "#8ea4c8",
												}}
											>
												<Stethoscope size={16} />
												{appointment.doctor_specialization}
											</p>
											<p
												style={{
													display: "flex",
													alignItems: "center",
													gap: "8px",
													color: "#8ea4c8",
													marginTop: "6px",
												}}
											>
												<Phone size={16} />
												{appointment.doctor_phone}
											</p>
										</div>

										<div style={{ textAlign: isMobile ? "left" : "right" }}>
											<div
												style={{
													display: "inline-block",
													background: "rgba(56,189,248,0.15)",
													border: "1px solid rgba(56,189,248,0.4)",
													color: "#38bdf8",
													padding: "8px 16px",
													borderRadius: "999px",
													fontWeight: 600,
													fontSize: "14px",
													textTransform: "capitalize",
												}}
											>
												{appointment.status}
											</div>
											<p style={{ color: "#94a3b8", marginTop: "14px" }}>
												{new Date(appointment.appointment_time).toLocaleString()}
											</p>
										</div>
									</div>

									<div
										style={{
											display: "grid",
											gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
											gap: "18px",
											marginTop: "24px",
										}}
									>
										<InfoCard
											icon={<User size={18} />}
											label="Patient"
											value={`${appointment.patient_name} (${appointment.patient_age} years)`}
										/>
										<InfoCard
											icon={<Phone size={18} />}
											label="Phone"
											value={appointment.patient_phone}
										/>
										<InfoCard
											icon={<Calendar size={18} />}
											label="Appointment Type"
											value={appointment.appointment_type}
										/>
										<InfoCard
											icon={<ClipboardList size={18} />}
											label="Complaint"
											value={appointment.complaint || "Not provided"}
										/>
									</div>

									<div style={{ marginTop: "20px" }}>
										<p
											style={{
												color: "#8ea4c8",
												fontSize: "13px",
												marginBottom: "8px",
												fontWeight: 600,
												letterSpacing: "0.5px",
											}}
										>
											NOTES
										</p>
										<div
											onMouseEnter={(e) => {
												e.currentTarget.style.background = "rgba(255,255,255,0.06)";
												e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
												e.currentTarget.style.transform = "translateY(-1px)";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = "rgba(255,255,255,0.03)";
												e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
												e.currentTarget.style.transform = "translateY(0)";
											}}
											style={{
												background: "rgba(255,255,255,0.03)",
												padding: "16px",
												borderRadius: "18px",
												color: "#f1f5f9",
												border: "1px solid rgba(255,255,255,0.06)",
												transition: "all 0.2s ease",
											}}
										>
											{appointment.notes || "No notes"}
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: "28px",
						}}
					>
						<button
							onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = "rgba(255,255,255,0.08)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "rgba(255,255,255,0.04)";
							}}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								padding: "12px 20px",
								borderRadius: "16px",
								border: "1px solid rgba(255,255,255,0.08)",
								background: "rgba(255,255,255,0.04)",
								color: "#d6e2f0",
								cursor: "pointer",
								fontWeight: 500,
								transition: "all 0.2s ease",
							}}
						>
							<ChevronLeft size={18} /> Previous
						</button>
						<span style={{ color: "#8ea4c8", fontWeight: 500 }}>
							Page {page}
						</span>
						<button
							onClick={() => setPage((prev) => prev + 1)}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = "rgba(255,255,255,0.08)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "rgba(255,255,255,0.04)";
							}}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								padding: "12px 20px",
								borderRadius: "16px",
								border: "1px solid rgba(255,255,255,0.08)",
								background: "rgba(255,255,255,0.04)",
								color: "#d6e2f0",
								cursor: "pointer",
								fontWeight: 500,
								transition: "all 0.2s ease",
							}}
						>
							Next <ChevronRight size={18} />
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

function InfoCard({ icon, label, value }: any) {
	return (
		<div
			onMouseEnter={(e) => {
				e.currentTarget.style.background = "rgba(255,255,255,0.06)";
				e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
				e.currentTarget.style.transform = "translateY(-1px)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.background = "rgba(255,255,255,0.03)";
				e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
				e.currentTarget.style.transform = "translateY(0)";
			}}
			style={{
				background: "rgba(255,255,255,0.03)",
				border: "1px solid rgba(255,255,255,0.06)",
				borderRadius: "20px",
				padding: "18px",
				transition: "all 0.2s ease",
			}}
		>
			<p style={{ color: "#8ea4c8", fontSize: "12px", marginBottom: "8px" }}>
				{label}
			</p>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "10px",
					color: "#f8fafc",
				}}
			>
				<div style={{ color: "#38bdf8", display: "flex" }}>{icon}</div> {value}
			</div>
		</div>
	);
}
