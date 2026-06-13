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
	searchPatients,
	getPatientById,
} from "@/services/patient.service";

import type {
	Patient,
	PatientDetails,
} from "@/types/patient";

import PatientRow from "./PatientRow";
import PatientDetailsDrawer from "./PatientDetailsDrawer";

type Props = {
	searchQuery: string;
	refreshKey: number;
};

export default function PatientTable({
	searchQuery,
	refreshKey,
}: Props) {
	const [
		patients,
		setPatients,
	] = useState<
		Patient[]
	>([]);

	const [
		page,
		setPage,
	] = useState(1);

	const [
		selectedPatient,
		setSelectedPatient,
	] =
		useState<PatientDetails | null>(
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
		const fetchPatients =
			async () => {
				try {
					const response =
						await searchPatients(
							{
								query:
									searchQuery,
								page,
								limit,
							}
						);

					setPatients(
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

		fetchPatients();
	}, [
		searchQuery,
		page,
		refreshKey,
	]);

	useEffect(() => {
		setPage(1);
	}, [searchQuery, refreshKey]);

	const handleView =
		async (
			patientId: number
		) => {
			try {
				setIsDrawerOpen(
					true
				);

				setLoadingDetails(
					true
				);

				const response =
					await getPatientById(
						patientId
					);

				setSelectedPatient(
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
					setSelectedPatient(
						null
					);
				},
				250
			);
		};

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
					Patients
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
							"Phone",
							"Gender",
							"Age",
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
					{patients.map(
						(
							patient
						) => (
							<PatientRow
								key={
									patient.id
								}
								patient={
									patient
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

			<PatientDetailsDrawer
				isOpen={
					isDrawerOpen
				}
				onClose={
					closeDrawer
				}
				patient={
					selectedPatient
				}
				loading={
					loadingDetails
				}
				onEdit={(
					patient
				) => {
					console.log(
						"Edit patient",
						patient
					);
				}}
				onDelete={(
					patientId
				) => {
					console.log(
						"Delete patient",
						patientId
					);
				}}
				onMedicalHistory={(
					patient
				) => {
					console.log(
						"Medical history",
						patient
					);
				}}
				onAppointmentHistory={(
					patient
				) => {
					console.log(
						"Appointment history",
						patient
					);
				}}
			/>
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