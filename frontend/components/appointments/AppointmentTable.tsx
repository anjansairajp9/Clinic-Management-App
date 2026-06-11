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
	getAppointmentById,
} from "@/services/appointment.service";

import {
	useDashboardDate,
} from "@/hooks/useDashboardDate";

import type {
	Appointment,
	AppointmentDetails,
} from "@/types/appointment";

import AppointmentRow from "./AppointmentRow";
import AppointmentDetailsDrawer from "./AppointmentDetailsDrawer";

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

	const [
		page,
		setPage,
	] = useState(1);

	const [
		selectedAppointment,
		setSelectedAppointment,
	] =
		useState<AppointmentDetails | null>(
			null
		);

	const [
		isDrawerOpen,
		setIsDrawerOpen,
	] = useState(false);

	const [
		loadingDetails,
		setLoadingDetails,
	] = useState(false);

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
					} else {
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

	useEffect(() => {
		setPage(1);
	}, [
		searchQuery,
		status,
		doctorId,
		selectedDate,
	]);

	const handleView =
		async (
			appointmentId: number
		) => {
			try {
				setIsDrawerOpen(
					true
				);

				setLoadingDetails(
					true
				);

				const response =
					await getAppointmentById(
						appointmentId
					);

				setSelectedAppointment(
					response
				);
			} catch (
				error
			) {
				console.error(
					error
				);
			} finally {
				setLoadingDetails(
					false
				);
			}
		};

	const closeDrawer =
		() => {
			setIsDrawerOpen(
				false
			);

			setTimeout(
				() => {
					setSelectedAppointment(
						null
					);
				},
				250
			);
		};

	return (
		<>
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
							margin:
								0,
							fontSize:
								"18px",
							fontWeight:
								600,
						}}
					>
						Appointments
					</h2>
				</div>

				<table
					style={{
						width:
							"100%",
						borderCollapse:
							"collapse",
					}}
				>
					<thead>
						<tr>
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
											textAlign: "left",
											padding: "18px",
											color: "#7a9ab8",
											fontSize: "11px",
											textTransform: "uppercase",
											borderBottom: "1px solid rgba(255,255,255,0.08)",
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
						{appointments.map(
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
									onView={
										handleView
									}
								/>
							)
						)}
					</tbody>
				</table>

				<div
					style={{
						padding:
							"14px 24px",
						display:
							"flex",
						justifyContent:
							"space-between",
					}}
				>
					<button
						onClick={() =>
							setPage(
								(
									prev
								) =>
									Math.max(
										prev -
											1,
										1
									)
							)
						}
						style={
							paginationButton
						}
					>
						<ChevronLeft
							size={
								14
							}
						/>
						Previous
					</button>

					<span
						style={{
							color:
								"#7a9ab8",
						}}
					>
						Page{" "}
						{page}
					</span>

					<button
						onClick={() =>
							setPage(
								(
									prev
								) =>
									prev +
									1
							)
						}
						style={
							paginationButton
						}
					>
						Next
						<ChevronRight
							size={
								14
							}
						/>
					</button>
				</div>
			</div>

			<AppointmentDetailsDrawer
				isOpen={
					isDrawerOpen
				}
				onClose={
					closeDrawer
				}
				appointment={
					selectedAppointment
				}
				loading={
					loadingDetails
				}
			/>
		</>
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
