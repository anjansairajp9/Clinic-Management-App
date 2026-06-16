"use client";

import { useEffect, useState } from "react";

import {
	X,
	FileText,
	CalendarDays,
	User,
	Stethoscope,
	Pill,
} from "lucide-react";

import {
	getPatientTreatmentHistory,
} from "@/services/treatment.service";

import type {
	PatientTreatmentHistory,
} from "@/types/treatment";

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
	const [loading, setLoading] = useState(false);

	const [history, setHistory] = useState<PatientTreatmentHistory[]>([]);

	const [selectedDate, setSelectedDate,] = useState("");

	const [closeHovered, setCloseHovered] = useState(false);

	useEffect(() => {
		if (!isOpen || !patientId) {
			return;
		}

		const fetchHistory = async () => {
			try {
				setLoading(true);

				const response = await getPatientTreatmentHistory(
					patientId,
					{
						page: 1,
						limit: 10,
						appointment_date: selectedDate || undefined,
					}
				);

				setHistory(response);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchHistory();
	}, [isOpen, patientId, selectedDate]);

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
      `}</style>

			<div style={overlay}>
				<div style={modal}>
					{/* Header */}
					<div style={header}>
						<div>
							<h2
								style={{
									color: "#f8fafc",
									margin: 0,
									fontSize: "34px",
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
							onMouseEnter={() => setCloseHovered(true)}
							onMouseLeave={() => setCloseHovered(false)}
							style={{
								...closeButton,
								background: closeHovered ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.04)",
								borderColor: closeHovered ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.08)",
								color: closeHovered ? "#f87171" : "#d6e2f0",
								transform: closeHovered ? "scale(1.05)" : "scale(1)",
							}}
						>
							<X size={22} />
						</button>
					</div>

					{/* Filters */}
					<div style={filterRow}>
						<input
							type="date"
							value={selectedDate}
							onChange={(e) =>
								setSelectedDate(
									e.target.value
								)
							}
							style={dateInput}
						/>

						{selectedDate && (
							<button
								onClick={() =>
									setSelectedDate("")
								}
								style={clearButton}
								onMouseEnter={(e) => {
									e.currentTarget.style.background =
										"rgba(239,68,68,0.14)";

									e.currentTarget.style.borderColor =
										"rgba(239,68,68,0.28)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background =
										"rgba(255,255,255,0.03)";

									e.currentTarget.style.borderColor =
										"rgba(255,255,255,0.08)";
								}}
							>
								Clear Filter
							</button>
						)}
					</div>

					{/* Content */}
					<div style={content}></div>

					{/* Content */}
					<div style={content}>
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
								<div key={item.id} className="hover-card" style={card}>

									{/* Card Header: Date & Doctor Info */}
									<div style={cardHeader}>
										<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
											<CalendarDays size={16} />
											{new Date(item.appointment_time).toLocaleString()}
										</div>

										<div style={{ textAlign: "right" }}>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "flex-end",
													gap: "8px",
													color: "#f8fafc",
													fontWeight: 600,
													fontSize: "16px",
												}}
											>
												<Stethoscope size={16} color="#38bdf8" />
												Dr. {item.doctor_name}
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
									<div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
										<div style={field}>
											<User size={18} color="#64748b" />
											<span style={fieldLabel}>Patient:</span>
											<span style={fieldValue}>
												{item.patient_name} ({item.patient_age} yrs)
											</span>
										</div>

										<div style={field}>
											<FileText size={18} color="#64748b" />
											<span style={fieldLabel}>Diagnosis:</span>
											<span style={fieldValue}>{item.diagnosis}</span>
										</div>

										<div style={field}>
											<Stethoscope size={18} color="#64748b" />
											<span style={fieldLabel}>Treatment:</span>
											<span style={fieldValue}>{item.treatment_performed}</span>
										</div>

										<div style={field}>
											<Pill size={18} color="#64748b" />
											<span style={fieldLabel}>Medicines:</span>
											<span style={fieldValue}>
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
		</>
	);
}

/* ---------- Styles ---------- */

const overlay = {
	position: "fixed" as const,
	inset: 0,
	background: "rgba(0,0,0,0.72)",
	backdropFilter: "blur(12px)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	zIndex: 9999,
	padding: "20px",
};

const modal = {
	width: "min(950px, 94vw)",
	maxHeight: "88vh",
	borderRadius: "34px",
	padding: "36px",
	background: "linear-gradient(180deg, rgba(7,15,35,0.98), rgba(2,10,24,0.98))",
	border: "1px solid rgba(255,255,255,0.08)",
	boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
	display: "flex",
	flexDirection: "column" as const,
};

const header = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-start",
	marginBottom: "28px",
	flexShrink: 0,
};

const closeButton = {
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
};

const content = {
	display: "flex",
	flexDirection: "column" as const,
	gap: "20px",
	flex: 1,
	minHeight: 0,
	overflowY: "auto" as const,
	paddingRight: "8px",
	scrollbarWidth: "thin" as const,
	WebkitOverflowScrolling: "touch" as const,
	overscrollBehavior: "contain" as const,
	paddingBottom: "10px",
};

const card = {
	padding: "24px",
	borderRadius: "24px",
	background: "rgba(255,255,255,0.03)",
	border: "1px solid rgba(255,255,255,0.08)",
};

const cardHeader = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-start",
	color: "#94a3b8",
	fontSize: "14px",
	marginBottom: "20px",
	paddingBottom: "18px",
	borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const field = {
	display: "flex",
	alignItems: "flex-start",
	gap: "12px",
	fontSize: "15px",
	lineHeight: 1.5,
};

const fieldLabel = {
	color: "#94a3b8",
	fontWeight: 600,
	minWidth: "90px",
};

const fieldValue = {
	color: "#f8fafc",
	flex: 1,
};

const filterRow = {
	display: "flex",
	alignItems: "center",
	gap: "12px",
	marginBottom: "20px",
};

const dateInput = {
	height: "52px",
	padding: "0 18px",
	borderRadius: "16px",
	border:
		"1px solid rgba(255,255,255,0.08)",

	background:
		"rgba(255,255,255,0.03)",

	color: "#f8fafc",
	outline: "none",
	fontSize: "15px",
};

const clearButton = {
	height: "52px",
	padding: "0 18px",
	borderRadius: "16px",
	border:
		"1px solid rgba(255,255,255,0.08)",

	background:
		"rgba(255,255,255,0.03)",

	color: "#f87171",
	cursor: "pointer",
	fontWeight: 600,
	transition:
		"all 0.2s ease",
};
