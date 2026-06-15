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
	searchDoctors,
	getDoctorById,
} from "@/services/doctor.service";

import type {
	Doctor,
	DoctorDetails,
} from "@/types/doctor";

import DoctorRow from "./DoctorRow";
import DoctorDetailsDrawer from "./DoctorDetailsDrawer";

type Props = {
	searchQuery: string;
	refreshKey: number;
};

export default function DoctorTable({
	searchQuery,
	refreshKey,
}: Props) {
	const [
		doctors,
		setDoctors,
	] = useState<
		Doctor[]
	>([]);

	const [
		page,
		setPage,
	] = useState(1);

	const [
		selectedDoctor,
		setSelectedDoctor,
	] =
		useState<DoctorDetails | null>(
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

	useEffect(() => {
		const fetchDoctors =
			async () => {
				try {
					const response =
						await searchDoctors(
							{
								query:
									searchQuery,
								page,
								limit,
							}
						);

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
	}, [
		searchQuery,
		page,
		refreshKey,
	]);

	useEffect(() => {
		setPage(1);
	}, [
		searchQuery,
		refreshKey,
	]);

	const handleView =
		async (
			doctorId: number
		) => {
			try {
				setIsDrawerOpen(
					true
				);

				setLoadingDetails(
					true
				);

				const response =
					await getDoctorById(
						doctorId
					);

				setSelectedDoctor(
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

			setLoadingDetails(
				false
			);

			setTimeout(
				() => {
					setSelectedDoctor(
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
						Doctors
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
								"Doctor",
								"Phone",
								"Specialization",
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
											color:
												"#7a9ab8",
											fontSize:
												"11px",
											textTransform:
												"uppercase",
											borderBottom:
												"1px solid rgba(255,255,255,0.08)",
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
						{doctors.map(
							(
								doctor
							) => (
								<DoctorRow
									key={
										doctor.id
									}
									doctor={
										doctor
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

				<DoctorDetailsDrawer
					isOpen={
						isDrawerOpen
					}
					onClose={
						closeDrawer
					}
					doctor={
						selectedDoctor
					}
					loading={
						loadingDetails
					}
					onEdit={(
						doctor
					) => {
						console.log(
							"Edit doctor",
							doctor
						);
					}}
					onDelete={(
						doctorId
					) => {
						console.log(
							"Delete doctor",
							doctorId
						);
					}}
					onAppointmentHistory={(
						doctor
					) => {
						console.log(
							"Doctor appointments",
							doctor
						);
					}}
				/>
			</div>
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