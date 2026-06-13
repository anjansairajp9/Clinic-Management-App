"use client";

import {
	Eye,
	User,
	Phone,
} from "lucide-react";

import type {
	Patient,
} from "@/types/patient";

type Props = {
	patient: Patient;

	onView: (
		patientId: number
	) => void;
};

export default function PatientRow({
	patient,
	onView,
}: Props) {
	return (
		<tr
			style={{
				borderBottom:
					"1px solid rgba(255,255,255,0.05)",
				transition:
					"all 0.2s ease",
			}}
			onMouseEnter={(
				e
			) => {
				e.currentTarget.style.background =
					"rgba(255,255,255,0.025)";
			}}
			onMouseLeave={(
				e
			) => {
				e.currentTarget.style.background =
					"transparent";
			}}
		>
			<td
				style={
					cellStyle
				}
			>
				<div
					style={{
						display:
							"flex",
						alignItems:
							"center",
						gap: "12px",
					}}
				>
					<div
						style={{
							width:
								"42px",
							height:
								"42px",
							borderRadius:
								"14px",
							background:
								"rgba(56,189,248,0.12)",
							display:
								"flex",
							alignItems:
								"center",
							justifyContent:
								"center",
							color:
								"#38bdf8",
						}}
					>
						<User
							size={
								18
							}
						/>
					</div>

					<div>
						<div
							style={{
								color:
									"#f0f6ff",
								fontWeight:
									600,
							}}
						>
							{
								patient.name
							}
						</div>
					</div>
				</div>
			</td>

			<td
				style={
					cellStyle
				}
			>
				<div
					style={{
						display:
							"flex",
						alignItems:
							"center",
						gap: "10px",
						color:
							"#c8d8e8",
					}}
				>
					<Phone
						size={
							15
						}
					/>

					{
						patient.phone
					}
				</div>
			</td>

			<td
				style={
					cellStyle
				}
			>
				<span
					style={{
						padding:
							"8px 12px",
						borderRadius:
							"999px",
						background:
							"rgba(56,189,248,0.12)",
						border:
							"1px solid rgba(56,189,248,0.18)",
						color:
							"#7dd3fc",
						fontSize:
							"13px",
						textTransform:
							"capitalize",
					}}
				>
					{
						patient.gender
					}
				</span>
			</td>

			<td
				style={
					cellStyle
				}
			>
				<span
					style={{
						color:
							"#d9e7f5",
					}}
				>
					{
						patient.age
					}{" "}
					years
				</span>
			</td>

			<td
				style={
					cellStyle
				}
			>
				<button
					onClick={() =>
						onView(
							patient.id
						)
					}
					style={{
						height:
							"42px",
						padding:
							"0 16px",
						borderRadius:
							"14px",
						border:
							"1px solid rgba(56,189,248,0.18)",
						background:
							"rgba(56,189,248,0.10)",
						color:
							"#7dd3fc",
						cursor:
							"pointer",
						display:
							"flex",
						alignItems:
							"center",
						gap: "8px",
						transition:
							"all 0.2s ease",
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
							"translateY(0)";
					}}
				>
					<Eye
						size={
							16
						}
					/>
					View
				</button>
			</td>
		</tr>
	);
}

const cellStyle = {
	padding: "18px",
};