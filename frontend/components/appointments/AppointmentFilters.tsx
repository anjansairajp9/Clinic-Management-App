"use client";

import {
	useEffect,
	useState,
} from "react";

import {
	Search,
	ChevronDown,
} from "lucide-react";

import {
	searchDoctors,
} from "@/services/appointment.service";

type Doctor = {
	id: number;
	name: string;
};

type Props = {
	searchQuery: string;
	setSearchQuery: (
		value: string
	) => void;
	status: string;
	setStatus: (
		value: string
	) => void;
	doctorId: string;
	setDoctorId: (
		value: string
	) => void;
};

export default function AppointmentFilters({
	searchQuery,
	setSearchQuery,
	status,
	setStatus,
	doctorId,
	setDoctorId,
}: Props) {
	const [
		doctors,
		setDoctors,
	] = useState<
		Doctor[]
	>([]);

	useEffect(() => {
		const fetchDoctors =
			async () => {
				try {
					const response =
						await searchDoctors();

					setDoctors(
						response
					);
				} catch (
					error
				) {
					console.error(
						error
					);
				}
			};

		fetchDoctors();
	}, []);

	const handleHoverEnter = (
		element: HTMLElement
	) => {
		element.style.border =
			"1px solid rgba(56,189,248,0.18)";
		element.style.boxShadow =
			"0 0 20px rgba(56,189,248,0.08)";
		element.style.transform =
			"translateY(-1px)";
	};

	const handleHoverLeave = (
		element: HTMLElement
	) => {
		element.style.border =
			"1px solid rgba(255,255,255,0.08)";
		element.style.boxShadow =
			"none";
		element.style.transform =
			"translateY(0)";
	};

	return (
		<div
			style={{
				display:
					"flex",
				alignItems:
					"center",
				gap: "14px",
				marginBottom:
					"10px",
				width: "100%",
			}}
		>
			{/* Search */}
			<div
				style={{
					position:
						"relative",
					flex: 1,
					minWidth:
						"400px",
				}}
			>
				<Search
					size={18}
					style={{
						position:
							"absolute",
						left: "16px",
						top: "50%",
						transform:
							"translateY(-50%)",
						color:
							"#38bdf8",
						zIndex: 2,
						pointerEvents:
							"none",
					}}
				/>

				<input
					type="text"
					placeholder="Search patient or doctor..."
					value={
						searchQuery
					}
					onChange={(
						e
					) =>
						setSearchQuery(
							e.target
								.value
						)
					}
					onMouseEnter={(
						e
					) =>
						handleHoverEnter(
							e.currentTarget
						)
					}
					onMouseLeave={(
						e
					) =>
						handleHoverLeave(
							e.currentTarget
						)
					}
					style={{
						width:
							"100%",
						height:
							"48px",
						padding:
							"0 16px 0 46px",
						borderRadius:
							"14px",
						border:
							"1px solid rgba(255,255,255,0.08)",
						background:
							"linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
						color:
							"#f0f6ff",
						fontSize:
							"14px",
						outline:
							"none",
						transition:
							"all 0.25s ease",
					}}
				/>
			</div>

			{/* Doctor */}
			<div
				style={{
					position:
						"relative",
					width:
						"240px",
				}}
			>
				<select
					value={
						doctorId
					}
					onChange={(
						e
					) =>
						setDoctorId(
							e.target
								.value
						)
					}
					disabled={
						searchQuery.trim()
							.length >
						0
					}
					onMouseEnter={(
						e
					) =>
						handleHoverEnter(
							e.currentTarget
						)
					}
					onMouseLeave={(
						e
					) =>
						handleHoverLeave(
							e.currentTarget
						)
					}
					style={{
						...selectStyle,
						opacity:
							searchQuery.trim()
								.length >
							0
								? 0.5
								: 1,
					}}
				>
					<option value="">
						All Doctors
					</option>

					{doctors.map(
						(
							doctor
						) => (
							<option
								key={
									doctor.id
								}
								value={String(
									doctor.id
								)}
							>
								{
									doctor.name
								}
							</option>
						)
					)}
				</select>

				<ChevronDown
					size={16}
					style={
						chevronStyle
					}
				/>
			</div>

			{/* Status */}
			<div
				style={{
					position:
						"relative",
					width:
						"240px",
				}}
			>
				<select
					value={
						status
					}
					onChange={(
						e
					) =>
						setStatus(
							e.target
								.value
						)
					}
					onMouseEnter={(
						e
					) =>
						handleHoverEnter(
							e.currentTarget
						)
					}
					onMouseLeave={(
						e
					) =>
						handleHoverLeave(
							e.currentTarget
						)
					}
					style={
						selectStyle
					}
				>
					<option value="scheduled">
						Scheduled
					</option>

					<option value="completed">
						Completed
					</option>

					<option value="cancelled">
						Cancelled
					</option>

					<option value="no_show">
						No Show
					</option>
				</select>

				<ChevronDown
					size={16}
					style={
						chevronStyle
					}
				/>
			</div>
		</div>
	);
}

const selectStyle = {
	width: "100%",
	height: "48px",
	padding:
		"0 16px",
	borderRadius:
		"14px",
	border:
		"1px solid rgba(255,255,255,0.08)",
	background:
		"rgba(7,17,35,0.95)",
	color: "#f0f6ff",
	fontSize: "14px",
	outline: "none",
	appearance:
		"none" as const,
	cursor: "pointer",
	transition:
		"all 0.25s ease",
};

const chevronStyle = {
	position:
		"absolute" as const,
	right: "18px",
	top: "50%",
	transform:
		"translateY(-50%)",
	color: "#7a9ab8",
	pointerEvents:
		"none" as const,
};
