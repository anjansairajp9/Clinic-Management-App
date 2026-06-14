"use client";

import toast from "react-hot-toast";

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
	deletePatient,
} from "@/services/patient.service";

import type {
	Patient,
	PatientDetails,
} from "@/types/patient";

import PatientRow from "./PatientRow";
import PatientDetailsDrawer from "./PatientDetailsDrawer";
import PatientFormModal from "./PatientFormModal";

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

	const [
		deleteLoading,
		setDeleteLoading,
	] = useState(false);

	const [
		showDeleteModal,
		setShowDeleteModal,
	] = useState(false);

	const [
		patientToDelete,
		setPatientToDelete,
	] = useState<number | null>(
		null
	);

	const [
		isEditModalOpen,
		setIsEditModalOpen,
	] = useState(false);

	const [
		editingPatient,
		setEditingPatient,
	] =
		useState<PatientDetails | null>(
			null
		);

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

	const handleEdit =
		(
			patient: PatientDetails
		) => {
			setEditingPatient(
				patient
			);

			setIsDrawerOpen(
				false
			);

			setIsEditModalOpen(
				true
			);
		};

	const handleEditSuccess =
		async () => {
			if (
				!editingPatient
			) {
				return;
			}

			try {
				// refresh patient details
				const updatedPatient =
					await getPatientById(
						editingPatient.id
					);

				setSelectedPatient(
					updatedPatient
				);

				setIsDrawerOpen(
					true
				);

				// refresh table
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

	const handleDelete =
		(
			patientId: number
		) => {
			setPatientToDelete(
				patientId
			);

			setShowDeleteModal(
				true
			);
		};

	const confirmDelete =
		async () => {
			if (
				!patientToDelete
			) {
				return;
			}

			try {
				setDeleteLoading(
					true
				);

				await deletePatient(
					patientToDelete
				);

				// close modal
				setShowDeleteModal(
					false
				);

				setPatientToDelete(
					null
				);

				// close drawer
				closeDrawer();

				// refresh table
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

				toast.success(
					"Patient deleted successfully"
				);
			} catch (
			error: any
			) {
				toast.error(
					error?.response
						?.data
						?.detail ||
					"Failed to delete patient"
				);
			} finally {
				setDeleteLoading(
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
				onEdit={
					handleEdit
				}
				onDelete={
					handleDelete
				}
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

			<PatientFormModal
				isOpen={
					isEditModalOpen
				}
				onClose={() => {
					setIsEditModalOpen(
						false
					);

					setEditingPatient(
						null
					);
				}}
				onSuccess={
					handleEditSuccess
				}
				mode="edit"
				patient={
					editingPatient
				}
			/>

			{showDeleteModal && (
				<div
					style={{
						position:
							"fixed",
						inset: 0,
						background:
							"rgba(0,0,0,0.72)",
						backdropFilter:
							"blur(14px)",
						display:
							"flex",
						alignItems:
							"center",
						justifyContent:
							"center",
						zIndex:
							9999,
					}}
				>
					<div
						style={{
							width:
								"520px",
							background:
								"linear-gradient(135deg, rgba(5,15,45,0.98), rgba(4,14,40,0.96))",
							border:
								"1px solid rgba(255,255,255,0.08)",
							borderRadius:
								"32px",
							padding:
								"36px",
							boxShadow:
								"0 40px 120px rgba(0,0,0,0.6)",
						}}
					>
						<div
							style={{
								width:
									"78px",
								height:
									"78px",
								borderRadius:
									"26px",
								background:
									"rgba(239,68,68,0.12)",
								border:
									"1px solid rgba(239,68,68,0.18)",
								display:
									"flex",
								alignItems:
									"center",
								justifyContent:
									"center",
								marginBottom:
									"28px",
							}}
						>
							<span
								style={{
									fontSize:
										"42px",
								}}
							>
								⚠️
							</span>
						</div>

						<h2
							style={{
								color:
									"#f8fafc",
								fontSize:
									"42px",
								fontWeight:
									700,
								margin:
									"0 0 18px",
							}}
						>
							Delete Patient?
						</h2>

						<p
							style={{
								color:
									"#8ea4c8",
								fontSize:
									"19px",
								lineHeight:
									1.8,
								marginBottom:
									"40px",
							}}
						>
							This action
							cannot be
							undone.
							The patient
							will be
							permanently
							deleted.
						</p>

						<div
							style={{
								display:
									"flex",
								gap:
									"18px",
							}}
						>
							<button
								onClick={() => {
									setShowDeleteModal(
										false
									);

									setPatientToDelete(
										null
									);
								}}
								style={{
									flex: 1,
									height:
										"68px",
									borderRadius:
										"22px",
									border:
										"1px solid rgba(255,255,255,0.08)",
									background:
										"rgba(255,255,255,0.03)",
									color:
										"#f1f5f9",
									fontSize:
										"20px",
									fontWeight:
										600,
									cursor:
										"pointer",
									transition:
										"all 0.25s ease",
								}}
								onMouseEnter={(
									e
								) => {
									e.currentTarget.style.background =
										"rgba(255,255,255,0.08)";
									e.currentTarget.style.transform =
										"translateY(-2px)";
								}}
								onMouseLeave={(
									e
								) => {
									e.currentTarget.style.background =
										"rgba(255,255,255,0.03)";
									e.currentTarget.style.transform =
										"translateY(0)";
								}}
							>
								Cancel
							</button>

							<button
								onClick={
									confirmDelete
								}
								disabled={
									deleteLoading
								}
								style={{
									flex: 1,
									height:
										"68px",
									border:
										"none",
									borderRadius:
										"22px",
									background:
										"linear-gradient(135deg, #ef4444, #dc2626)",
									color:
										"white",
									fontSize:
										"20px",
									fontWeight:
										700,
									cursor:
										"pointer",
									transition:
										"all 0.25s ease",
									boxShadow:
										"0 18px 40px rgba(239,68,68,0.25)",
								}}
								onMouseEnter={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(-2px)";
									e.currentTarget.style.boxShadow =
										"0 24px 50px rgba(239,68,68,0.4)";
								}}
								onMouseLeave={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(0)";
									e.currentTarget.style.boxShadow =
										"0 18px 40px rgba(239,68,68,0.25)";
								}}
							>
								{deleteLoading
									? "Deleting..."
									: "Delete Patient"}
							</button>
						</div>
					</div>
				</div>
			)}
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
