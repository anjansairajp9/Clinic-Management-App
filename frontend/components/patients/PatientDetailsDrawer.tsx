"use client";

import {
	X,
	User,
	Phone,
	CalendarDays,
	FileText,
	HeartPulse,
} from "lucide-react";

import type {
	PatientDetails,
} from "@/types/patient";

type Props = {
	isOpen: boolean;
	onClose: () => void;

	patient:
	| PatientDetails
	| null;

	loading: boolean;

	message?: {
		type:
		| "success"
		| "error";
		text: string;
	} | null;

	onEdit: (
		patient: PatientDetails
	) => void;

	onDelete: (
		patientId: number
	) => void;

	onMedicalHistory: (
		patient: PatientDetails
	) => void;

	onAppointmentHistory: (
		patient: PatientDetails
	) => void;
};

export default function PatientDetailsDrawer({
	isOpen,
	onClose,
	patient,
	loading,
	message,
	onEdit,
	onDelete,
	onMedicalHistory,
	onAppointmentHistory,
}: Props) {
	if (!isOpen) {
		return null;
	}

	return (
		<>
			{/* Backdrop */}
			<div
				onClick={onClose}
				style={{
					position:
						"fixed",
					inset: 0,
					background:
						"rgba(0,0,0,0.68)",
					backdropFilter:
						"blur(14px)",
					zIndex: 999,
				}}
			/>

			{/* Modal */}
			<div
				style={{
					position:
						"fixed",
					top: "50%",
					left: "50%",
					transform:
						"translate(-50%, -50%)",
					width:
						"min(980px, 94vw)",
					maxHeight:
						"88vh",
					overflowY:
						"auto",
					borderRadius:
						"36px",
					padding:
						"34px",
					zIndex:
						1000,

					background: `
						radial-gradient(
							circle at top right,
							rgba(56,189,248,0.14),
							transparent 24%
						),

						radial-gradient(
							circle at bottom left,
							rgba(59,130,246,0.12),
							transparent 30%
						),

						linear-gradient(
							180deg,
							rgba(5,15,35,0.98),
							rgba(2,8,23,0.98)
						)
					`,

					border:
						"1px solid rgba(255,255,255,0.08)",

					boxShadow: `
						0 0 80px rgba(56,189,248,0.08),
						0 40px 120px rgba(0,0,0,0.65)
					`,
				}}
			>
				{/* Header */}
				<div
					style={{
						display:
							"flex",
						justifyContent:
							"space-between",
						alignItems:
							"flex-start",
						marginBottom:
							"28px",
					}}
				>
					<div>
						<h2
							style={{
								color:
									"#f0f6ff",
								fontSize:
									"44px",
								fontWeight:
									700,
								margin: 0,
							}}
						>
							Patient Details
						</h2>

						<p
							style={{
								color:
									"#86a7c8",
								fontSize:
									"15px",
								marginTop:
									"10px",
							}}
						>
							View patient information
							and medical history
						</p>
					</div>

					<button
						onClick={
							onClose
						}
						style={{
							background:
								"rgba(255,255,255,0.04)",

							border:
								"1px solid rgba(255,255,255,0.08)",

							color:
								"#9fb8d6",

							width:
								"50px",

							height:
								"50px",

							borderRadius:
								"18px",

							cursor:
								"pointer",

							display:
								"flex",

							alignItems:
								"center",

							justifyContent:
								"center",

							transition:
								"all 0.2s ease",
						}}
						onMouseEnter={(
							e
						) => {
							e.currentTarget.style.border =
								"1px solid rgba(56,189,248,0.22)";
						}}
						onMouseLeave={(
							e
						) => {
							e.currentTarget.style.border =
								"1px solid rgba(255,255,255,0.08)";
						}}
					>
						<X
							size={26}
						/>
					</button>
				</div>

				{message && (
					<div
						style={{
							padding:
								"16px 18px",
							borderRadius:
								"18px",
							marginBottom:
								"22px",
							background:
								message.type ===
									"success"
									? "rgba(34,197,94,0.14)"
									: "rgba(239,68,68,0.14)",

							border:
								message.type ===
									"success"
									? "1px solid rgba(34,197,94,0.25)"
									: "1px solid rgba(239,68,68,0.25)",

							color:
								message.type ===
									"success"
									? "#86efac"
									: "#fca5a5",

							fontSize:
								"15px",
							fontWeight:
								500,
						}}
					>
						{message.text}
					</div>
				)}

				{loading && (
					<div
						style={{
							textAlign:
								"center",
							padding:
								"40px",
							color:
								"#7a9ab8",
						}}
					>
						Loading patient...
					</div>
				)}

				{patient && (
					<>
						<div
							style={{
								display:
									"grid",
								gridTemplateColumns:
									"1fr 1fr",
								gap: "22px",
							}}
						>
							{/* Details + Notes */}
							<Card title="Patient Information">
								<Info
									icon={
										<User size={18} />
									}
									label="Name"
									value={
										patient.name
									}
								/>

								<Info
									icon={
										<Phone size={18} />
									}
									label="Phone"
									value={
										patient.phone
									}
								/>

								<Info
									label="Gender"
									value={
										patient.gender.charAt(
											0
										).toUpperCase() +
										patient.gender.slice(
											1
										)
									}
								/>

								<Info
									label="Age"
									value={`${patient.age} years`}
								/>

								<Info
									icon={
										<CalendarDays size={18} />
									}
									label="Date of Birth"
									value={new Date(
										patient.dob
									).toLocaleDateString(
										"en-IN"
									)}
								/>

								<Info
									icon={
										<FileText size={18} />
									}
									label="Notes"
									value={
										patient.notes ||
										"Not provided"
									}
								/>
							</Card>

							{/* Medical History */}
							<Card title="Medical History">
								{patient.medical_history &&
									Object.keys(
										patient.medical_history
									)
										.length >
									0 ? (
									Object.entries(
										patient.medical_history
									).map(
										([
											key,
											value,
										]) => (
											<Info
												key={
													key
												}
												icon={
													<HeartPulse
														size={
															18
														}
													/>
												}
												label={key
													.replaceAll(
														"_",
														" "
													)
													.toUpperCase()}
												value={
													Array.isArray(
														value
													)
														? value.join(
															", "
														)
														: String(
															value
														)
												}
											/>
										)
									)
								) : (
									<p
										style={{
											color:
												"#7a9ab8",
										}}
									>
										No medical
										history
										available
									</p>
								)}
							</Card>
						</div>

						{/* Actions */}
						<div
							style={{
								marginTop:
									"28px",
								paddingTop:
									"28px",
								borderTop:
									"1px solid rgba(255,255,255,0.08)",
							}}
						>
							<h3
								style={{
									color:
										"#f0f6ff",
									fontSize:
										"20px",
									fontWeight:
										600,
									marginBottom:
										"18px",
								}}
							>
								Quick Actions
							</h3>

							<div
								style={{
									display:
										"flex",
									flexWrap:
										"wrap",
									gap: "14px",
								}}
							>
								<ActionButton
									label="Edit Patient"
									type="primary"
									onClick={() =>
										onEdit(
											patient
										)
									}
								/>

								<ActionButton
									label="Medical History"
									type="success"
									onClick={() =>
										onMedicalHistory(
											patient
										)
									}
								/>

								<ActionButton
									label="Appointment History"
									type="warning"
									onClick={() =>
										onAppointmentHistory(
											patient
										)
									}
								/>

								<ActionButton
									label="Delete Patient"
									type="danger"
									onClick={() =>
										onDelete(
											patient.id
										)
									}
								/>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}

function Card({
	title,
	children,
}: any) {
	return (
		<div
			style={{
				background:
					"linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02))",

				border:
					"1px solid rgba(255,255,255,0.07)",

				borderRadius:
					"28px",

				padding:
					"28px",
			}}
		>
			<h3
				style={{
					color:
						"#f0f6ff",
					marginTop:
						0,
					marginBottom:
						"24px",
					fontSize:
						"24px",
				}}
			>
				{title}
			</h3>

			<div
				style={{
					display:
						"flex",
					flexDirection:
						"column",
					gap: "18px",
				}}
			>
				{children}
			</div>
		</div>
	);
}

function Info({
	icon,
	label,
	value,
}: any) {
	return (
		<div>
			<p
				style={{
					color:
						"#7a9ab8",
					fontSize:
						"12px",
					marginBottom:
						"8px",
					textTransform:
						"uppercase",
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
					gap: "12px",
					color:
						"#f0f6ff",
					fontSize:
						"18px",
				}}
			>
				{icon}
				{value}
			</div>
		</div>
	);
}

function ActionButton({
	label,
	onClick,
	type,
}: {
	label: string;
	onClick: () => void;
	type:
	| "primary"
	| "success"
	| "warning"
	| "danger";
}) {
	const styles = {
		primary: {
			background:
				"rgba(56,189,248,0.08)",
			border:
				"1px solid rgba(56,189,248,0.18)",
			color:
				"#38bdf8",
		},

		success: {
			background:
				"rgba(34,197,94,0.08)",
			border:
				"1px solid rgba(34,197,94,0.18)",
			color:
				"#22c55e",
		},

		warning: {
			background:
				"rgba(245,158,11,0.08)",
			border:
				"1px solid rgba(245,158,11,0.18)",
			color:
				"#f59e0b",
		},

		danger: {
			background:
				"rgba(239,68,68,0.08)",
			border:
				"1px solid rgba(239,68,68,0.18)",
			color:
				"#ff6b6b",
		},
	};

	return (
		<button
			onClick={
				onClick
			}
			style={{
				height:
					"58px",
				padding:
					"0 24px",
				borderRadius:
					"20px",
				cursor:
					"pointer",
				fontWeight:
					600,
				fontSize:
					"16px",
				transition:
					"all 0.2s ease",
				...styles[
				type
				],
			}}
			onMouseEnter={(
				e
			) => {
				e.currentTarget.style.transform =
					"translateY(-2px)";
			}}
			onMouseLeave={(
				e
			) => {
				e.currentTarget.style.transform =
					"translateY(0px)";
			}}
		>
			{label}
		</button>
	);
}