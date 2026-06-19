"use client";

import { useState } from "react";
import { Eye, User, Phone, Stethoscope } from "lucide-react";
import type { Doctor } from "@/types/doctor";

type Props = {
	doctor: Doctor;
	onView: (doctorId: number) => void;
	isMobile: boolean;
};

export default function DoctorRow({ doctor, onView, isMobile }: Props) {
	const [isHovered, setIsHovered] = useState(false);

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
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
					<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
						<div
							style={{
								width: "42px",
								height: "42px",
								borderRadius: "14px",
								background: "rgba(56,189,248,0.12)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "#38bdf8",
							}}
						>
							<User size={18} />
						</div>
						<div>
							<div style={{ color: "#f0f6ff", fontWeight: 600, fontSize: "16px" }}>
								{doctor.name}
							</div>
							<div style={{ color: "#c8d8e8", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
								<Phone size={12} /> {doctor.phone}
							</div>
						</div>
					</div>
				</div>

				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#93c5fd", fontSize: "13px" }}>
						<Stethoscope size={14} /> {doctor.specialization}
					</div>

					<button
						onClick={() => onView(doctor.id)}
						style={{
							height: "36px",
							padding: "0 14px",
							borderRadius: "12px",
							border: "1px solid rgba(37,99,235,0.18)",
							background: "rgba(37,99,235,0.12)",
							color: "#93c5fd",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							fontSize: "13px",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "translateY(-2px)";
							e.currentTarget.style.background = "rgba(37,99,235,0.18)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.background = "rgba(37,99,235,0.12)";
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
				background: isHovered ? "rgba(255,255,255,0.025)" : "transparent",
				transition: "all 0.2s ease",
			}}
		>
			<td style={cellStyle}>
				<p style={nameStyle}>{doctor.name}</p>
			</td>

			<td style={cellStyle}>{doctor.phone}</td>

			<td style={cellStyle}>
				<div style={specializationBadge}>{doctor.specialization}</div>
			</td>

			<td style={cellStyle}>
				<button
					onClick={() => onView(doctor.id)}
					style={viewButton}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = "rgba(37,99,235,0.18)";
						e.currentTarget.style.transform = "translateY(-2px)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = "rgba(37,99,235,0.12)";
						e.currentTarget.style.transform = "translateY(0)";
					}}
				>
					<Eye size={16} />
					View
				</button>
			</td>
		</tr>
	);
}

const cellStyle = {
	padding: "22px 18px",
	color: "#d6e2f0",
	fontSize: "14px",
};

const nameStyle = {
	margin: 0,
	fontSize: "15px",
	fontWeight: 600,
	color: "#f8fafc",
};

const specializationBadge = {
	display: "inline-flex",
	alignItems: "center",
	padding: "10px 16px",
	borderRadius: "999px",
	background: "rgba(59,130,246,0.12)",
	color: "#93c5fd",
	border: "1px solid rgba(59,130,246,0.18)",
	fontSize: "13px",
	fontWeight: 500,
};

const viewButton = {
	height: "42px",
	padding: "0 16px",
	borderRadius: "14px",
	border: "1px solid rgba(37,99,235,0.18)",
	background: "rgba(37,99,235,0.12)",
	color: "#93c5fd",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	fontWeight: 500,
	transition: "all 0.2s ease",
};
