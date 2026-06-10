"use client";

import {
	useEffect,
	useState,
} from "react";

import {
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

import {
	getAppointments,
	searchAppointments,
} from "@/services/appointment.service";

import {
	useDashboardDate,
} from "@/hooks/useDashboardDate";

import type {
	Appointment,
} from "@/types/appointment";

import AppointmentRow from "./AppointmentRow";

type Props = {
	searchQuery: string;
	status: string;
	doctorId: string;
};

export default function AppointmentTable({
	searchQuery,
	status,
	doctorId,
}: Props) {
	const [
		appointments,
		setAppointments,
	] = useState<
		Appointment[]
	>([]);

	const [page, setPage] =
		useState(1);

	const limit = 10;

	const {
		selectedDate,
	} =
		useDashboardDate();

	useEffect(() => {
		const fetchAppointments =
			async () => {
				try {
					let response;

					// SEARCH MODE
					if (
						searchQuery.trim()
					) {
						response =
							await searchAppointments(
								{
									query:
										searchQuery,
									page,
									limit,
									status,
									appointment_date:
										selectedDate,
								}
							);
					}

					// NORMAL TABLE MODE
					else {
						response =
							await getAppointments(
								{
									page,
									limit,
									status,
									doctor_id:
										doctorId,
									appointment_date:
										selectedDate,
								}
							);
					}

					setAppointments(
						response
					);
				} catch (
					error
				) {
					console.error(
						"Failed to fetch appointments",
						error
					);
				}
			};

		fetchAppointments();
	}, [
		page,
		searchQuery,
		status,
		doctorId,
		selectedDate,
	]);

	// Reset page when filters change
	useEffect(() => {
		setPage(1);
	}, [
		searchQuery,
		status,
		doctorId,
		selectedDate,
	]);

	return (
		<div
			style={{
				background:
					"linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
				border:
					"1px solid rgba(255,255,255,0.06)",
				borderRadius:
					"28px",
				overflow:
					"hidden",
			}}
		>
			{/* Header */}
			<div
				style={{
					padding:
						"20px 24px",
					borderBottom:
						"1px solid rgba(255,255,255,0.05)",
				}}
			>
				<h2
					style={{
						color:
							"#f0f6ff",
						margin: 0,
						fontSize:
							"18px",
						fontWeight:
							600,
					}}
				>
					Appointments
				</h2>

				<p
					style={{
						color:
							"#7a9ab8",
						fontSize:
							"12px",
						marginTop:
							"6px",
						marginBottom:
							0,
					}}
				>
					Manage clinic
					schedules and
					monitor patient
					visits.
				</p>
			</div>

			<table
				style={{
					width: "100%",
					borderCollapse:
						"collapse",
				}}
			>
				<thead>
					<tr
						style={{
							borderBottom:
								"1px solid rgba(255,255,255,0.08)",
						}}
					>
						{[
							"Patient",
							"Doctor",
							"Date",
							"Time",
							"Status",
							"Actions",
						].map(
							(
								header
							) => (
								<th
									key={
										header
									}
									style={{
										textAlign:
											"left",
										padding:
											"18px",
										paddingBottom:
											"16px",
										color:
											"#7a9ab8",
										fontSize:
											"11px",
										fontWeight:
											600,
										letterSpacing:
											"0.8px",
										textTransform:
											"uppercase",
									}}
								>
									{
										header
									}
								</th>
							)
						)}
					</tr>
				</thead>

				<tbody>
					{appointments.length >
					0 ? (
						appointments.map(
							(
								appointment
							) => (
								<AppointmentRow
									key={
										appointment.id
									}
									appointment={
										appointment
									}
								/>
							)
						)
					) : (
						<tr>
							<td
								colSpan={
									6
								}
								style={{
									padding:
										"40px",
									textAlign:
										"center",
									color:
										"#7a9ab8",
									fontSize:
										"14px",
								}}
							>
								No appointments found
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Pagination */}
			<div
				style={{
					padding:
						"14px 24px",
					borderTop:
						"1px solid rgba(255,255,255,0.05)",
					display:
						"flex",
					alignItems:
						"center",
					justifyContent:
						"space-between",
				}}
			>
				<button
					onClick={() =>
						setPage(
							(prev) =>
								Math.max(
									prev - 1,
									1
								)
						)
					}
					disabled={
						page === 1
					}
					style={{
						...paginationButton,
						opacity:
							page ===
							1
								? 0.5
								: 1,
					}}
				>
					<ChevronLeft
						size={14}
					/>
					Previous
				</button>

				<div
					style={{
						color:
							"#7a9ab8",
						fontSize:
							"12px",
					}}
				>
					Page{" "}
					<span
						style={{
							color:
								"#f0f6ff",
							fontWeight:
								600,
						}}
					>
						{page}
					</span>
				</div>

				<button
					onClick={() =>
						setPage(
							(prev) =>
								prev + 1
						)
					}
					style={
						paginationButton
					}
				>
					Next

					<ChevronRight
						size={14}
					/>
				</button>
			</div>
		</div>
	);
}

const paginationButton =
{
	background:
		"rgba(255,255,255,0.04)",
	border:
		"1px solid rgba(255,255,255,0.08)",
	color:
		"#d6e2f0",
	padding:
		"8px 14px",
	borderRadius:
		"14px",
	cursor:
		"pointer",
	display:
		"flex",
	alignItems:
		"center",
	gap: "8px",
	fontSize:
		"12px",
};