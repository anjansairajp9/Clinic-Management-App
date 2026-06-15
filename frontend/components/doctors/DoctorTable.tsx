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
	searchDoctors,
	getDoctorById,
	deleteDoctor
} from "@/services/doctor.service";

import type {
	Doctor,
	DoctorDetails,
} from "@/types/doctor";

import DoctorRow from "./DoctorRow";
import DoctorDetailsDrawer from "./DoctorDetailsDrawer";
import DoctorFormModal from "./DoctorFormModal";

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

	const [
		isEditModalOpen,
		setIsEditModalOpen,
	] = useState(false);

	const [
		editingDoctor,
		setEditingDoctor,
	] =
		useState<DoctorDetails | null>(
			null
		);

	const [
		isDeleteModalOpen,
		setIsDeleteModalOpen,
	] = useState(false);

	const [
		deletingDoctorId,
		setDeletingDoctorId,
	] = useState<number | null>(
		null
	);

	const [
		isDeleting,
		setIsDeleting,
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

	const handleEdit =
		(
			doctor: DoctorDetails
		) => {
			setEditingDoctor(
				doctor
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
				!editingDoctor
			) {
				return;
			}

			try {
				const updatedDoctor =
					await getDoctorById(
						editingDoctor.id
					);

				setSelectedDoctor(
					updatedDoctor
				);

				setEditingDoctor(
					updatedDoctor
				);

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

	const handleDelete =
		(
			doctorId: number
		) => {
			setDeletingDoctorId(
				doctorId
			);

			setIsDeleteModalOpen(
				true
			);
		};

	const confirmDelete =
		async () => {
			if (
				!deletingDoctorId
			) {
				return;
			}

			try {
				setIsDeleting(
					true
				);

				await deleteDoctor(
					deletingDoctorId
				);

				toast.success(
					"Doctor deleted successfully",
					{
						position:
							"top-center",
					}
				);

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

				setIsDeleteModalOpen(
					false
				);

				setIsDrawerOpen(
					false
				);

				setSelectedDoctor(
					null
				);

				setDeletingDoctorId(
					null
				);
			} catch (error) {
				console.error(
					error
				);

				toast.error(
					"Failed to delete doctor",
					{
						position:
							"top-center",
					}
				);
			} finally {
				setIsDeleting(
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
					onEdit={
						handleEdit
					}
					onDelete={
						handleDelete
					}
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

			<DoctorFormModal
				isOpen={
					isEditModalOpen
				}
				onClose={() => {
					setIsEditModalOpen(
						false
					);

					setEditingDoctor(
						null
					);
				}}
				onSuccess={
					handleEditSuccess
				}
				mode="edit"
				doctor={
					editingDoctor
				}
			/>

			{isDeleteModalOpen && (
				<div
					style={
						deleteOverlay
					}
				>
					<div
						style={
							deleteModal
						}
					>
						<h2
							style={{
								color:
									"#f8fafc",
								margin:
									"0 0 12px",
								fontSize:
									"30px",
								fontWeight:
									700,
							}}
						>
							Delete Doctor
						</h2>

						<p
							style={{
								color:
									"#94a3b8",
								lineHeight:
									1.8,
								fontSize:
									"16px",
								margin:
									0,
							}}
						>
							Are you sure
							you want to
							delete this
							doctor?
						</p>

						<div
							style={{
								display:
									"flex",
								justifyContent:
									"flex-end",
								gap:
									"12px",
								marginTop:
									"24px",
							}}
						>
							<button
								onClick={() =>
									setIsDeleteModalOpen(
										false
									)
								}
								style={
									cancelButton
								}
								onMouseEnter={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(-2px)";

									e.currentTarget.style.background =
										"rgba(255,255,255,0.08)";
								}}
								onMouseLeave={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(0px)";

									e.currentTarget.style.background =
										"rgba(255,255,255,0.04)";
								}}
							>
								Cancel
							</button>

							<button
								onClick={
									confirmDelete
								}
								disabled={
									isDeleting
								}
								style={{
									...deleteButton,
									opacity:
										isDeleting
											? 0.7
											: 1,
									cursor:
										isDeleting
											? "not-allowed"
											: "pointer",
								}}
								onMouseEnter={(
									e
								) => {
									if (
										!isDeleting
									) {
										e.currentTarget.style.transform =
											"translateY(-2px)";

										e.currentTarget.style.boxShadow =
											"0 14px 32px rgba(220,38,38,0.35)";
									}
								}}
								onMouseLeave={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(0px)";

									e.currentTarget.style.boxShadow =
										"none";
								}}
							>
								{isDeleting
									? "Deleting..."
									: "Delete Doctor"}
							</button>
						</div>
					</div>
				</div>
			)}
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

const deleteOverlay = {
	position:
		"fixed" as const,
	inset: 0,
	background:
		"rgba(0,0,0,0.72)",
	backdropFilter:
		"blur(10px)",
	display:
		"flex",
	alignItems:
		"center",
	justifyContent:
		"center",
	zIndex: 9999,
};

const deleteModal = {
	width: "520px",
	padding: "40px",
	borderRadius:
		"32px",
	background:
		"linear-gradient(180deg, rgba(5,15,35,0.98), rgba(2,8,23,0.98))",
	border:
		"1px solid rgba(255,255,255,0.08)",
	boxShadow:
		"0 40px 120px rgba(0,0,0,0.65)",
	backdropFilter:
		"blur(18px)",
};

const cancelButton = {
	height: "54px",
	padding: "0 24px",
	borderRadius:
		"16px",
	border:
		"1px solid rgba(255,255,255,0.08)",
	background:
		"rgba(255,255,255,0.04)",
	color: "#f8fafc",
	cursor: "pointer",
	fontWeight: 600,
	transition:
		"all 0.2s ease",
};

const deleteButton = {
	height: "54px",
	padding: "0 24px",
	borderRadius:
		"16px",
	border: "none",
	background:
		"linear-gradient(135deg, #ef4444, #dc2626)",
	color: "white",
	cursor: "pointer",
	fontWeight: 700,
	transition:
		"all 0.2s ease",
};