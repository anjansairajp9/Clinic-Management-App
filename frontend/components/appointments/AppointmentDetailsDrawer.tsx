"use client";

import {
	X,
	CalendarDays,
	Clock3,
	Phone,
	User,
	Stethoscope,
	FileText,
	IndianRupee,
} from "lucide-react";

import type {
	AppointmentDetails,
} from "@/types/appointment";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	appointment:
		| AppointmentDetails
		| null;
	loading: boolean;
};

export default function AppointmentDetailsDrawer({
	isOpen,
	onClose,
	appointment,
	loading,
}: Props) {
	if (!isOpen) {
		return null;
	}

	return (
		<>
			{/* Backdrop */}
			<div
				onClick={
					onClose
				}
				style={{
					position:
						"fixed",
					inset: 0,
					background:
						"rgba(0,0,0,0.68)",
					backdropFilter:
						"blur(14px)",
					zIndex:
						999,
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
						"min(860px, 92vw)",

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

					backdropFilter:
						"blur(28px)",

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
						alignItems:
							"flex-start",
						justifyContent:
							"space-between",
						marginBottom:
							"30px",
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
								letterSpacing:
									"-1px",
								margin:
									0,
							}}
						>
							Appointment
							Details
						</h2>

						<p
							style={{
								color:
									"#86a7c8",
								fontSize:
									"15px",
								marginTop:
									"10px",
								marginBottom:
									0,
							}}
						>
							View complete
							appointment
							information
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
								"48px",
							height:
								"48px",
							borderRadius:
								"16px",
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
								"1px solid rgba(56,189,248,0.20)";
							e.currentTarget.style.boxShadow =
								"0 0 20px rgba(56,189,248,0.10)";
						}}
						onMouseLeave={(
							e
						) => {
							e.currentTarget.style.border =
								"1px solid rgba(255,255,255,0.08)";
							e.currentTarget.style.boxShadow =
								"none";
						}}
					>
						<X
							size={26}
						/>
					</button>
				</div>

				{/* Loading */}
				{loading && (
					<div
						style={{
							color:
								"#7a9ab8",
							padding:
								"40px",
							textAlign:
								"center",
						}}
					>
						Loading
						appointment...
					</div>
				)}

				{/* Content */}
				{appointment && (
					<div
						style={{
							display:
								"grid",
							gridTemplateColumns:
								"1fr 1fr",
							gap: "22px",
						}}
					>
						<Card
							title="Patient Information"
						>
							<Info
								icon={
									<User size={18} />
								}
								label="Patient Name"
								value={
									appointment.patient_name
								}
							/>

							<Info
								icon={
									<Phone size={18} />
								}
								label="Phone"
								value={
									appointment.patient_phone
								}
							/>

							<Info
								label="Age"
								value={`${appointment.patient_age} years`}
							/>
						</Card>

						<Card
							title="Doctor Information"
						>
							<Info
								icon={
									<Stethoscope size={18} />
								}
								label="Doctor"
								value={
									appointment.doctor_name
								}
							/>

							<Info
								label="Specialization"
								value={
									appointment.doctor_specialization
								}
							/>

							<Info
								icon={
									<Phone size={18} />
								}
								label="Doctor Phone"
								value={
									appointment.doctor_phone
								}
							/>
						</Card>

						<Card
							title="Appointment"
						>
							<Info
								icon={
									<CalendarDays size={18} />
								}
								label="Date"
								value={new Date(
									appointment.appointment_time
								).toLocaleDateString(
									"en-IN"
								)}
							/>

							<Info
								icon={
									<Clock3 size={18} />
								}
								label="Time"
								value={new Date(
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
							/>

							<Info
								label="Status"
								value={
									appointment.status
								}
							/>
						</Card>

						<Card
							title="Additional Details"
						>
							<Info
								label="Appointment Type"
								value={
									appointment.appointment_type
								}
							/>

							<Info
								icon={
									<IndianRupee size={18} />
								}
								label="Amount"
								value={`₹${appointment.total_amount ?? 0}`}
							/>

							<Info
								icon={
									<FileText size={18} />
								}
								label="Complaint"
								value={
									appointment.complaint ||
									"Not provided"
								}
							/>

							<Info
								label="Notes"
								value={
									appointment.notes ||
									"Not provided"
								}
							/>
						</Card>
					</div>
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
				background: `
					linear-gradient(
						180deg,
						rgba(255,255,255,0.045),
						rgba(255,255,255,0.02)
					)
				`,

				border:
					"1px solid rgba(255,255,255,0.07)",

				borderRadius:
					"28px",

				padding:
					"26px",

				backdropFilter:
					"blur(18px)",

				boxShadow:
					"inset 0 1px 0 rgba(255,255,255,0.04)",
			}}
		>
			<h3
				style={{
					color:
						"#f0f6ff",

					marginTop:
						0,

					marginBottom:
						"22px",

					fontSize:
						"26px",

					fontWeight:
						600,

					letterSpacing:
						"-0.5px",
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
				{
					children
				}
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

					letterSpacing:
						"0.4px",

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

					fontWeight:
						500,
				}}
			>
				{icon}
				{value}
			</div>
		</div>
	);
}