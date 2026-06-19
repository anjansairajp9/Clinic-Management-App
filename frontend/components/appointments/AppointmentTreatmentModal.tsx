"use client";

import { useState } from "react";
import { X, User, Phone, Stethoscope, CalendarDays, FileText, Pill, ClipboardList } from "lucide-react";
import type { TreatmentDetails } from "@/types/treatment";
import { useMobile } from "@/hooks/useMobile";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	treatment: TreatmentDetails | null;
	loading: boolean;
};

export default function AppointmentTreatmentModal({
	isOpen,
	onClose,
	treatment,
	loading,
}: Props) {
	const isMobile = useMobile();
	const [closeHovered, setCloseHovered] = useState(false);

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
				<div
					style={{
						...modal,
						width: isMobile ? "92vw" : "min(1000px, 94vw)",
						padding: isMobile ? "24px" : "36px",
					}}
				>
					{/* Header */}
					<div style={header}>
						<div>
							<h2
								style={{
									...title,
									fontSize: isMobile ? "28px" : "34px",
								}}
							>
								Treatment Details
							</h2>

							<p style={subtitle}>View treatment information</p>
						</div>

						<button
							onClick={onClose}
							onMouseEnter={() => setCloseHovered(true)}
							onMouseLeave={() => setCloseHovered(false)}
							style={{
								...closeButton,
								background: closeHovered
									? "rgba(239,68,68,0.15)"
									: "rgba(255,255,255,0.04)",
								border: `1px solid ${closeHovered ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"
									}`,
								color: closeHovered ? "#f87171" : "#d6e2f0",
								transform: closeHovered ? "scale(1.05)" : "scale(1)",
							}}
						>
							<X size={22} />
						</button>
					</div>

					{/* Loading / Content */}
					{loading ? (
						<div style={loadingStyle}>Loading treatment...</div>
					) : !treatment ? (
						<div style={loadingStyle}>No treatment found</div>
					) : (
						<div
							style={{
								...grid,
								gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
							}}
						>
							<Card title="Patient Information">
								<Info
									icon={<User size={18} />}
									label="Patient"
									value={`${treatment.patient_name} (${treatment.patient_age} yrs)`}
								/>

								<Info
									icon={<Phone size={18} />}
									label="Phone"
									value={treatment.patient_phone}
								/>
							</Card>

							<Card title="Doctor Information">
								<Info
									icon={<Stethoscope size={18} />}
									label="Doctor"
									value={`Dr. ${treatment.doctor_name}`}
								/>

								<Info
									label="Specialization"
									value={treatment.doctor_specialization}
								/>
							</Card>

							<Card title="Appointment">
								<Info
									icon={<CalendarDays size={18} />}
									label="Date & Time"
									value={new Date(treatment.appointment_time).toLocaleString()}
								/>

								<Info
									label="Status"
									value={treatment.appointment_status}
								/>

								<Info
									label="Complaint"
									value={
										treatment.appointment_complaint || "Not provided"
									}
								/>
							</Card>

							<Card title="Treatment">
								<Info
									icon={<FileText size={18} />}
									label="Diagnosis"
									value={treatment.diagnosis}
								/>

								<Info
									icon={<ClipboardList size={18} />}
									label="Treatment"
									value={treatment.treatment_performed}
								/>

								<Info
									icon={<Pill size={18} />}
									label="Medicines"
									value={
										treatment.medicines_prescribed || "Not prescribed"
									}
								/>

								<Info
									label="Procedure Notes"
									value={treatment.procedure_notes || "Not provided"}
								/>

								<Info
									label="Follow Up"
									value={
										treatment.follow_up_instructions || "Not provided"
									}
								/>
							</Card>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

/* ---------- Components ---------- */

function Card({ title, children }: any) {
	return (
		<div className="hover-card" style={card}>
			<h3 style={cardTitle}>{title}</h3>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "20px",
				}}
			>
				{children}
			</div>
		</div>
	);
}

function Info({ icon, label, value }: any) {
	return (
		<div>
			<p style={labelStyle}>{label}</p>

			<div style={valueStyle}>
				{icon && (
					<div style={{ display: "flex", color: "#38bdf8" }}>{icon}</div>
				)}
				<div style={{ flex: 1, lineHeight: 1.5 }}>{value}</div>
			</div>
		</div>
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
	maxHeight: "88vh",
	overflowY: "auto" as const,
	WebkitOverflowScrolling: "touch" as const,
	overscrollBehavior: "contain" as const,
	borderRadius: "34px",
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
	marginBottom: "30px",
	flexShrink: 0,
};

const title = {
	color: "#f8fafc",
	fontWeight: 700,
	margin: 0,
	letterSpacing: "-0.5px",
};

const subtitle = {
	color: "#94a3b8",
	marginTop: "8px",
	fontSize: "15px",
};

const closeButton = {
	width: "48px",
	height: "48px",
	borderRadius: "16px",
	border: "1px solid rgba(255,255,255,0.08)",
	color: "#d6e2f0",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "all 0.2s ease",
	flexShrink: 0,
};

const grid = {
	display: "grid",
	gap: "22px",
};

const card = {
	padding: "26px",
	borderRadius: "24px",
	background: "rgba(255,255,255,0.03)",
	border: "1px solid rgba(255,255,255,0.08)",
};

const cardTitle = {
	color: "#f8fafc",
	marginBottom: "22px",
	fontSize: "20px",
	fontWeight: 600,
	margin: "0 0 22px 0",
};

const labelStyle = {
	color: "#94a3b8",
	fontSize: "13px",
	marginBottom: "6px",
	fontWeight: 500,
	margin: "0 0 6px 0",
};

const valueStyle = {
	display: "flex",
	alignItems: "flex-start",
	gap: "12px",
	color: "#f0f6ff",
	fontSize: "15px",
	fontWeight: 500,
};

const loadingStyle = {
	color: "#94a3b8",
	textAlign: "center" as const,
	padding: "60px",
};
