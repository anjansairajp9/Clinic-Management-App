"use client";

import { useEffect, useState } from "react";
import { X, FileText, CalendarDays, User, Stethoscope, Pill } from "lucide-react";
import { getPatientTreatmentHistory } from "@/services/treatment.service";
import type { PatientTreatmentHistory } from "@/types/treatment";
import { useMobile } from "@/hooks/useMobile";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	patientId: number | null;
	patientName?: string;
};

export default function PatientTreatmentHistoryModal({
	isOpen,
	onClose,
	patientId,
	patientName,
}: Props) {
	const isMobile = useMobile();
	const [loading, setLoading] = useState(false);
	const [history, setHistory] = useState<PatientTreatmentHistory[]>([]);
	const [selectedDate, setSelectedDate] = useState("");

	useEffect(() => {
		if (!isOpen || !patientId) return;
		const fetchHistory = async () => {
			try {
				setLoading(true);
				const response = await getPatientTreatmentHistory(patientId, {
					page: 1,
					limit: 10,
					appointment_date: selectedDate || undefined,
				});
				setHistory(response);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchHistory();
	}, [isOpen, patientId, selectedDate]);

	if (!isOpen) return null;

	return (
		<div
			onClick={onClose}
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.72)",
				backdropFilter: "blur(12px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 9999,
				padding: "20px",
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					width: isMobile ? "92vw" : "min(950px, 94vw)",
					maxHeight: "88vh",
					borderRadius: isMobile ? "24px" : "34px",
					padding: isMobile ? "20px" : "36px",
					background: "linear-gradient(180deg, rgba(7,15,35,0.98), rgba(2,10,24,0.98))",
					border: "1px solid rgba(255,255,255,0.08)",
					boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
					display: "flex",
					flexDirection: "column",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						marginBottom: "28px",
						flexShrink: 0,
					}}
				>
					<div>
						<h2
							style={{
								color: "#f8fafc",
								margin: 0,
								fontSize: isMobile ? "26px" : "34px",
								fontWeight: 700,
								letterSpacing: "-0.5px",
							}}
						>
							Treatment History
						</h2>
						<p
							style={{
								color: "#94a3b8",
								marginTop: "8px",
								fontSize: "15px",
							}}
						>
							{patientName}'s treatment records
						</p>
					</div>

					<button
						onClick={onClose}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
							e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
							e.currentTarget.style.color = "#f87171";
							e.currentTarget.style.transform = "scale(1.05)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
							e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
							e.currentTarget.style.color = "#d6e2f0";
							e.currentTarget.style.transform = "scale(1)";
						}}
						style={{
							width: "48px",
							height: "48px",
							borderRadius: "16px",
							border: "1px solid rgba(255,255,255,0.08)",
							background: "rgba(255,255,255,0.04)",
							color: "#d6e2f0",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							transition: "all 0.2s ease",
							flexShrink: 0,
						}}
					>
						<X size={22} />
					</button>
				</div>

				{/* Filters */}
				<div
					style={{
						display: "flex",
						gap: "12px",
						marginBottom: "20px",
						flexDirection: isMobile ? "column" : "row",
						alignItems: isMobile ? "stretch" : "center",
					}}
				>
					<input
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						style={{
							height: "52px",
							padding: "0 18px",
							borderRadius: "16px",
							border: "1px solid rgba(255,255,255,0.08)",
							background: "rgba(255,255,255,0.03)",
							color: "#f8fafc",
							outline: "none",
							fontSize: "15px",
						}}
					/>
					{selectedDate && (
						<button
							onClick={() => setSelectedDate("")}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = "rgba(239,68,68,0.14)";
								e.currentTarget.style.borderColor = "rgba(239,68,68,0.28)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "rgba(255,255,255,0.03)";
								e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
							}}
							style={{
								height: "52px",
								padding: "0 18px",
								borderRadius: "16px",
								border: "1px solid rgba(255,255,255,0.08)",
								background: "rgba(255,255,255,0.03)",
								color: "#f87171",
								cursor: "pointer",
								fontWeight: 600,
								transition: "all 0.2s ease",
							}}
						>
							Clear Filter
						</button>
					)}
				</div>

				{/* Content */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "20px",
						flex: 1,
						minHeight: 0,
						overflowY: "auto",
						paddingRight: "8px",
						scrollbarWidth: "thin",
						WebkitOverflowScrolling: "touch",
						overscrollBehavior: "contain",
						paddingBottom: "10px",
					}}
				>
					{loading ? (
						<div
							style={{
								color: "#94a3b8",
								padding: "60px",
								textAlign: "center",
							}}
						>
							Loading treatment history...
						</div>
					) : history.length === 0 ? (
						<div
							style={{
								color: "#64748b",
								padding: "60px",
								textAlign: "center",
							}}
						>
							No treatment history found
						</div>
					) : (
						history.map((item) => (
							<div
								key={item.id}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
									e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.3)";
									e.currentTarget.style.transform = "translateY(-2px)";
									e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.3)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
									e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
									e.currentTarget.style.transform = "translateY(0)";
									e.currentTarget.style.boxShadow = "none";
								}}
								style={{
									padding: "24px",
									borderRadius: "24px",
									background: "rgba(255,255,255,0.03)",
									border: "1px solid rgba(255,255,255,0.06)",
									transition: "all 0.25s ease",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "flex-start",
										color: "#94a3b8",
										fontSize: "14px",
										marginBottom: "20px",
										paddingBottom: "18px",
										borderBottom: "1px solid rgba(255,255,255,0.06)",
										flexDirection: isMobile ? "column" : "row",
										gap: isMobile ? "12px" : "0",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
										}}
									>
										<CalendarDays size={16} />
										{new Date(item.appointment_time).toLocaleString()}
									</div>
									<div style={{ textAlign: isMobile ? "left" : "right" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: isMobile ? "flex-start" : "flex-end",
												gap: "8px",
												color: "#f8fafc",
												fontWeight: 600,
												fontSize: "16px",
											}}
										>
											<Stethoscope size={16} color="#38bdf8" /> Dr.{" "}
											{item.doctor_name}
										</div>
										<div
											style={{
												color: "#38bdf8",
												fontSize: "13px",
												marginTop: "6px",
												fontWeight: 500,
											}}
										>
											{item.doctor_specialization}
										</div>
									</div>
								</div>

								{/* Card Body: Details */}
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "14px",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "flex-start",
											gap: "12px",
											fontSize: "15px",
											lineHeight: 1.5,
											flexDirection: isMobile ? "column" : "row",
										}}
									>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "12px",
											}}
										>
											<User size={18} color="#64748b" />
											<span
												style={{
													color: "#94a3b8",
													fontWeight: 600,
													minWidth: "90px",
												}}
											>
												Patient:
											</span>
										</div>
										<span style={{ color: "#f8fafc", flex: 1 }}>
											{item.patient_name} ({item.patient_age} yrs)
										</span>
									</div>

									<div
										style={{
											display: "flex",
											alignItems: "flex-start",
											gap: "12px",
											fontSize: "15px",
											lineHeight: 1.5,
											flexDirection: isMobile ? "column" : "row",
										}}
									>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "12px",
											}}
										>
											<FileText size={18} color="#64748b" />
											<span
												style={{
													color: "#94a3b8",
													fontWeight: 600,
													minWidth: "90px",
												}}
											>
												Diagnosis:
											</span>
										</div>
										<span style={{ color: "#f8fafc", flex: 1 }}>
											{item.diagnosis}
										</span>
									</div>

									<div
										style={{
											display: "flex",
											alignItems: "flex-start",
											gap: "12px",
											fontSize: "15px",
											lineHeight: 1.5,
											flexDirection: isMobile ? "column" : "row",
										}}
									>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "12px",
											}}
										>
											<Stethoscope size={18} color="#64748b" />
											<span
												style={{
													color: "#94a3b8",
													fontWeight: 600,
													minWidth: "90px",
												}}
											>
												Treatment:
											</span>
										</div>
										<span style={{ color: "#f8fafc", flex: 1 }}>
											{item.treatment_performed}
										</span>
									</div>

									<div
										style={{
											display: "flex",
											alignItems: "flex-start",
											gap: "12px",
											fontSize: "15px",
											lineHeight: 1.5,
											flexDirection: isMobile ? "column" : "row",
										}}
									>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "12px",
											}}
										>
											<Pill size={18} color="#64748b" />
											<span
												style={{
													color: "#94a3b8",
													fontWeight: 600,
													minWidth: "90px",
												}}
											>
												Medicines:
											</span>
										</div>
										<span style={{ color: "#f8fafc", flex: 1 }}>
											{item.medicines_prescribed || "Not prescribed"}
										</span>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
