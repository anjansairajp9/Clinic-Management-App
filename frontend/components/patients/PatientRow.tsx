"use client";

import { Eye, User, Phone } from "lucide-react";
import type { Patient } from "@/types/patient";

type Props = {
	patient: Patient;
	onView: (patientId: number) => void;
	isMobile: boolean;
};

export default function PatientRow({ patient, onView, isMobile }: Props) {
	if (isMobile) {
		return (
			<div
				style={{
					padding: "16px",
					display: "flex",
					flexDirection: "column",
					gap: "14px",
					transition: "all 0.2s ease",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.background = "rgba(255,255,255,0.025)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.background = "transparent";
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
						}}
					>
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
							<div
								style={{
									color: "#f0f6ff",
									fontWeight: 600,
									fontSize: "16px",
								}}
							>
								{patient.name}
							</div>
							<div
								style={{
									color: "#c8d8e8",
									fontSize: "13px",
									display: "flex",
									alignItems: "center",
									gap: "6px",
									marginTop: "4px",
								}}
							>
								<Phone size={12} /> {patient.phone}
							</div>
						</div>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div style={{ display: "flex", gap: "10px" }}>
						<span
							style={{
								padding: "6px 10px",
								borderRadius: "999px",
								background: "rgba(56,189,248,0.12)",
								border: "1px solid rgba(56,189,248,0.18)",
								color: "#7dd3fc",
								fontSize: "11px",
								textTransform: "capitalize",
							}}
						>
							{patient.gender}
						</span>
						<span
							style={{
								color: "#d9e7f5",
								fontSize: "13px",
								display: "flex",
								alignItems: "center",
							}}
						>
							{patient.age} yrs
						</span>
					</div>

					<button
						onClick={() => onView(patient.id)}
						style={{
							height: "36px",
							padding: "0 14px",
							borderRadius: "12px",
							border: "1px solid rgba(56,189,248,0.18)",
							background: "rgba(56,189,248,0.10)",
							color: "#7dd3fc",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							fontSize: "13px",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "translateY(-2px)";
							e.currentTarget.style.background = "rgba(56,189,248,0.18)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.background = "rgba(56,189,248,0.10)";
						}}
					>
						<Eye size={14} /> View
					</button>
				</div>
			</div>
		);
	}

	// Desktop View
	return (
		<tr
			style={{
				borderBottom: "1px solid rgba(255,255,255,0.05)",
				transition: "all 0.2s ease",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.background = "rgba(255,255,255,0.025)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.background = "transparent";
			}}
		>
			<td style={{ padding: "18px" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "12px",
					}}
				>
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
					<div style={{ color: "#f0f6ff", fontWeight: 600 }}>
						{patient.name}
					</div>
				</div>
			</td>

			<td style={{ padding: "18px" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "10px",
						color: "#c8d8e8",
					}}
				>
					<Phone size={15} /> {patient.phone}
				</div>
			</td>

			<td style={{ padding: "18px" }}>
				<span
					style={{
						padding: "8px 12px",
						borderRadius: "999px",
						background: "rgba(56,189,248,0.12)",
						border: "1px solid rgba(56,189,248,0.18)",
						color: "#7dd3fc",
						fontSize: "13px",
						textTransform: "capitalize",
					}}
				>
					{patient.gender}
				</span>
			</td>

			<td style={{ padding: "18px" }}>
				<span style={{ color: "#d9e7f5" }}>{patient.age} years</span>
			</td>

			<td style={{ padding: "18px" }}>
				<button
					onClick={() => onView(patient.id)}
					style={{
						height: "42px",
						padding: "0 16px",
						borderRadius: "14px",
						border: "1px solid rgba(56,189,248,0.18)",
						background: "rgba(56,189,248,0.10)",
						color: "#7dd3fc",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						gap: "8px",
						transition: "all 0.2s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "translateY(-2px)";
						e.currentTarget.style.background = "rgba(56,189,248,0.18)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "translateY(0)";
						e.currentTarget.style.background = "rgba(56,189,248,0.10)";
					}}
				>
					<Eye size={16} /> View
				</button>
			</td>
		</tr>
	);
}
