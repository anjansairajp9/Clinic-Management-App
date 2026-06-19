"use client";

import { X, User, Phone, Stethoscope, FileText, CalendarDays, Trash2, SquarePen } from "lucide-react";
import type { DoctorDetails } from "@/types/doctor";
import { useMobile } from "@/hooks/useMobile";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	doctor: DoctorDetails | null;
	loading?: boolean;
	onEdit: (doctor: DoctorDetails) => void;
	onDelete: (doctorId: number) => void;
	onAppointmentHistory: (doctor: DoctorDetails) => void;
};

export default function DoctorDetailsDrawer({
	isOpen,
	onClose,
	doctor,
	loading = false,
	onEdit,
	onDelete,
	onAppointmentHistory,
}: Props) {
	const isMobile = useMobile();

	if (!isOpen) return null;

	return (
		<div onClick={onClose} style={overlayStyle}>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					...modalStyle,
					width: isMobile ? "92vw" : "min(720px, 92vw)",
					padding: isMobile ? "24px" : "34px",
				}}
			>
				{/* Header */}
				<div style={headerStyle}>
					<div>
						<h2 style={{ ...titleStyle, fontSize: isMobile ? "28px" : "34px" }}>
							Doctor Details
						</h2>
						<p style={subtitleStyle}>View doctor information</p>
					</div>

					<button
						onClick={onClose}
						style={closeButton}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = "rgba(255,255,255,0.08)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = "rgba(255,255,255,0.04)";
						}}
					>
						<X size={22} />
					</button>
				</div>

				{loading ? (
					<div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
						Loading doctor details...
					</div>
				) : !doctor ? (
					<div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
						Doctor not found
					</div>
				) : (
					<>
						{/* Doctor Info */}
						<div style={cardStyle}>
							<h3 style={cardTitle}>Doctor Information</h3>

							<div
								style={{
									...infoGrid,
									gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
								}}
							>
								<InfoRow icon={<User />} label="Name" value={doctor.name} />
								<InfoRow icon={<Phone />} label="Phone" value={doctor.phone} />
								<InfoRow
									icon={<Stethoscope />}
									label="Specialization"
									value={doctor.specialization}
								/>
								<InfoRow
									icon={<FileText />}
									label="Notes"
									value={doctor.notes || "No notes added"}
								/>
							</div>
						</div>

						{/* Buttons */}
						<div
							style={{
								...buttonContainer,
								flexDirection: isMobile ? "column" : "row",
							}}
						>
							<ActionButton
								label="Edit Doctor"
								icon={<SquarePen size={18} />}
								onClick={() => onEdit(doctor)}
								type="blue"
								isMobile={isMobile}
							/>
							<ActionButton
								label="Appointment History"
								icon={<CalendarDays size={18} />}
								onClick={() => onAppointmentHistory(doctor)}
								type="yellow"
								isMobile={isMobile}
							/>
							<ActionButton
								label="Delete Doctor"
								icon={<Trash2 size={18} />}
								onClick={() => onDelete(doctor.id)}
								type="red"
								isMobile={isMobile}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string; }) {
	return (
		<div style={rowStyle}>
			<div style={iconContainer}>{icon}</div>
			<div>
				<p style={labelStyle}>{label}</p>
				<p style={valueStyle}>{value}</p>
			</div>
		</div>
	);
}

function ActionButton({
	label,
	icon,
	onClick,
	type,
	isMobile,
}: {
	label: string;
	icon: React.ReactNode;
	onClick: () => void;
	type: "blue" | "yellow" | "red";
	isMobile: boolean;
}) {
	const themes = {
		blue: {
			border: "rgba(59,130,246,0.25)",
			background: "rgba(59,130,246,0.08)",
			color: "#60a5fa",
			hover: "rgba(59,130,246,0.18)",
		},
		yellow: {
			border: "rgba(245,158,11,0.25)",
			background: "rgba(245,158,11,0.08)",
			color: "#f59e0b",
			hover: "rgba(245,158,11,0.18)",
		},
		red: {
			border: "rgba(239,68,68,0.25)",
			background: "rgba(239,68,68,0.08)",
			color: "#f87171",
			hover: "rgba(239,68,68,0.18)",
		},
	};

	const theme = themes[type];

	return (
		<button
			onClick={onClick}
			style={{
				...actionButtonStyle,
				border: `1px solid ${theme.border}`,
				background: theme.background,
				color: theme.color,
				width: isMobile ? "100%" : "auto",
				justifyContent: isMobile ? "center" : "flex-start",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = "translateY(-2px)";
				e.currentTarget.style.background = theme.hover;
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = "translateY(0px)";
				e.currentTarget.style.background = theme.background;
			}}
		>
			{icon}
			{label}
		</button>
	);
}

const overlayStyle = {
	position: "fixed" as const,
	inset: 0,
	background: "rgba(0,0,0,0.72)",
	backdropFilter: "blur(12px)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	zIndex: 9999,
};

const modalStyle = {
	borderRadius: "34px",
	background: "linear-gradient(180deg, rgba(5,15,35,0.98), rgba(2,8,23,0.98))",
	border: "1px solid rgba(255,255,255,0.08)",
	boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
};

const headerStyle = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-start",
	marginBottom: "28px",
};

const titleStyle = {
	fontWeight: 700,
	color: "#f8fafc",
	margin: 0,
};

const subtitleStyle = {
	color: "#8ea4c8",
	marginTop: "8px",
	fontSize: "14px",
};

const closeButton = {
	width: "54px",
	height: "54px",
	borderRadius: "18px",
	border: "1px solid rgba(255,255,255,0.08)",
	background: "rgba(255,255,255,0.04)",
	color: "#dbeafe",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "all 0.2s ease",
};

const cardStyle = {
	padding: "28px",
	borderRadius: "28px",
	background: "rgba(255,255,255,0.03)",
	border: "1px solid rgba(255,255,255,0.06)",
};

const cardTitle = {
	color: "#f8fafc",
	fontSize: "22px",
	marginBottom: "24px",
};

const infoGrid = {
	display: "grid",
	gap: "22px",
};

const rowStyle = {
	display: "flex",
	alignItems: "flex-start",
	gap: "14px",
};

const iconContainer = {
	color: "#60a5fa",
	marginTop: "4px",
};

const labelStyle = {
	color: "#8ea4c8",
	fontSize: "13px",
	marginBottom: "6px",
};

const valueStyle = {
	color: "#f8fafc",
	fontSize: "16px",
	fontWeight: 500,
};

const buttonContainer = {
	display: "flex",
	gap: "14px",
	marginTop: "28px",
};

const actionButtonStyle = {
	height: "54px",
	padding: "0 22px",
	borderRadius: "18px",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	gap: "10px",
	fontWeight: 600,
	fontSize: "15px",
	transition: "all 0.25s ease",
};
