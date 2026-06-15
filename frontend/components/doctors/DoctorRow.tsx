"use client";

import {
	useState,
} from "react";

import {
	Eye,
} from "lucide-react";

import type {
	Doctor,
} from "@/types/doctor";

type Props = {
	doctor: Doctor;
	onView: (
		doctorId: number
	) => void;
};

export default function DoctorRow({
	doctor,
	onView,
}: Props) {
	const [
		isHovered,
		setIsHovered,
	] = useState(false);

	return (
		<tr
			onMouseEnter={() =>
				setIsHovered(
					true
				)
			}
			onMouseLeave={() =>
				setIsHovered(
					false
				)
			}
			style={{
				borderBottom:
					"1px solid rgba(255,255,255,0.05)",

				background:
					isHovered
						? "rgba(255,255,255,0.025)"
						: "transparent",

				transition:
					"all 0.2s ease",
			}}
		>
			<td style={cellStyle}>
				<p
					style={
						nameStyle
					}
				>
					{
						doctor.name
					}
				</p>
			</td>

			<td style={cellStyle}>
				{
					doctor.phone
				}
			</td>

			<td style={cellStyle}>
				<div
					style={
						specializationBadge
					}
				>
					{
						doctor.specialization
					}
				</div>
			</td>

			<td style={cellStyle}>
				<button
					onClick={() =>
						onView(
							doctor.id
						)
					}
					style={
						viewButton
					}
					onMouseEnter={(
						e
					) => {
						e.currentTarget.style.background =
							"rgba(37,99,235,0.18)";
					}}
					onMouseLeave={(
						e
					) => {
						e.currentTarget.style.background =
							"rgba(37,99,235,0.12)";
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

const specializationBadge =
{
	display: "inline-flex",
	alignItems: "center",
	padding: "10px 16px",
	borderRadius: "999px",
	background:
		"rgba(59,130,246,0.12)",
	color: "#93c5fd",
	border:
		"1px solid rgba(59,130,246,0.18)",
	fontSize: "13px",
	fontWeight: 500,
};

const viewButton = {
	height: "42px",
	padding: "0 16px",
	borderRadius: "14px",
	border:
		"1px solid rgba(37,99,235,0.18)",
	background:
		"rgba(37,99,235,0.12)",
	color: "#93c5fd",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	fontWeight: 500,
	transition:
		"all 0.2s ease",
};