"use client";

import { useDashboardDate } from "@/hooks/useDashboardDate"

import {
	useEffect,
	useRef,
	useState,
} from "react";

import {
	ChevronLeft,
	ChevronRight,
	FileText,
} from "lucide-react";

import {
	searchTreatments,
	getTreatmentById,
	deleteTreatment,
} from "@/services/treatment.service";

import type {
	Treatment,
	TreatmentDetails,
} from "@/types/treatment";

import TreatmentDetailsModal from "@/components/treatments/TreatmentDetailsModal";
import TreatmentFormModal from "@/components/treatments/TreatmentFormModal";

type Props = {
	searchQuery: string;
	refreshKey: number;
};

export default function TreatmentTable({
	searchQuery,
	refreshKey,
}: Props) {
	const {
		selectedDate,
	} = useDashboardDate();

	const hasUserChangedDate = useRef(false);

	const [
		treatments,
		setTreatments,
	] = useState<
		Treatment[]
	>([]);

	const [
		page,
		setPage,
	] = useState(1);

	const [
		loading,
		setLoading,
	] = useState(false);

	const [
		selectedTreatment,
		setSelectedTreatment,
	] =
		useState<
			TreatmentDetails | null
		>(null);

	const [
		isModalOpen,
		setIsModalOpen,
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
		editingTreatment,
		setEditingTreatment,
	] =
		useState<TreatmentDetails | null>(
			null
		);

	const [
		deleteTreatmentId,
		setDeleteTreatmentId,
	] = useState<number | null>(
		null
	);

	const [
		isDeleting,
		setIsDeleting,
	] = useState(false);

	const [
		showDeleteToast,
		setShowDeleteToast,
	] = useState(false);

	const limit = 10;

	useEffect(() => {
		const fetchTreatments =
			async () => {
				try {
					setLoading(
						true
					);

					const response =
						await searchTreatments(
							{
								query:
									searchQuery,
								appointment_date:
									hasUserChangedDate.current
										? selectedDate
										: undefined,
								page,
								limit,
							}
						);

					setTreatments(
						response
					);
				} catch (
				error
				) {
					console.error(
						error
					);
				} finally {
					setLoading(false);

				}
			};

		fetchTreatments();
	}, [
		searchQuery,
		selectedDate,
		page,
		refreshKey,
	]);

	useEffect(() => {
		hasUserChangedDate.current =
			true;
	}, [selectedDate]);

	useEffect(() => {
		hasUserChangedDate.current =
			false;
	}, []);

	useEffect(() => {
		setPage(1);
	}, [
		searchQuery,
		selectedDate,
		refreshKey,
	]);

	const handleView =
		async (
			treatmentId: number
		) => {
			try {
				setIsModalOpen(
					true
				);

				setLoadingDetails(
					true
				);

				const response =
					await getTreatmentById(
						treatmentId
					);

				setSelectedTreatment(
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
			treatment: TreatmentDetails
		) => {
			setEditingTreatment(
				treatment
			);

			setIsModalOpen(
				false
			);

			setIsEditModalOpen(
				true
			);
		};

	const handleEditSuccess =
		async () => {
			if (
				!editingTreatment
			) {
				return;
			}

			try {
				// refresh details
				const updatedTreatment =
					await getTreatmentById(
						editingTreatment.id
					);

				setSelectedTreatment(
					updatedTreatment
				);

				// refresh table
				const response =
					await searchTreatments(
						{
							query:
								searchQuery,

							appointment_date:
								hasUserChangedDate.current
									? selectedDate
									: undefined,

							page,
							limit,
						}
					);

				setTreatments(
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
		async () => {
			if (
				!deleteTreatmentId
			) {
				return;
			}

			try {
				setIsDeleting(
					true
				);

				await deleteTreatment(
					deleteTreatmentId
				);

				/* close details modal */
				setIsModalOpen(
					false
				);

				setSelectedTreatment(
					null
				);

				/* refresh table */
				const response =
					await searchTreatments(
						{
							query:
								searchQuery,

							appointment_date:
								hasUserChangedDate.current
									? selectedDate
									: undefined,

							page,
							limit,
						}
					);

				setTreatments(
					response
				);

				setDeleteTreatmentId(
					null
				);

				setShowDeleteToast(
					true
				);

				setTimeout(
					() => {
						setShowDeleteToast(
							false
						);
					},
					2500
				);
			} catch (
			error
			) {
				console.error(
					error
				);
			} finally {
				setIsDeleting(
					false
				);
			}
		};

	const closeModal =
		() => {
			setIsModalOpen(
				false
			);

			setLoadingDetails(
				false
			);

			setTimeout(
				() => {
					setSelectedTreatment(
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
			{showDeleteToast && (
				<div
					style={
						deleteToast
					}
				>
					Treatment deleted
					successfully
				</div>
			)}
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
						margin:
							0,
						fontSize:
							"18px",
						fontWeight:
							600,
					}}
				>
					Treatments
				</h2>
			</div>

			{/* Table */}
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
							"Diagnosis",
							"Appointment",
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
					{loading ? (
						<tr>
							<td
								colSpan={
									5
								}
								style={{
									padding:
										"50px",
									textAlign:
										"center",
									color:
										"#7a9ab8",
								}}
							>
								Loading
								treatments...
							</td>
						</tr>
					) : treatments.length ===
						0 ? (
						<tr>
							<td
								colSpan={
									5
								}
								style={{
									padding:
										"60px",
									textAlign:
										"center",
									color:
										"#64748b",
								}}
							>
								No
								treatments
								found
							</td>
						</tr>
					) : (
						treatments.map(
							(
								treatment
							) => (
								<tr
									key={
										treatment.id
									}
									style={{
										borderBottom:
											"1px solid rgba(255,255,255,0.04)",
										transition:
											"all 0.2s ease",
										cursor:
											"pointer",
									}}
									onMouseEnter={(
										e
									) => {
										e.currentTarget.style.background =
											"rgba(59,130,246,0.06)";
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
										<div>
											<div
												style={
													primaryText
												}
											>
												{
													treatment.patient_name
												}
											</div>

											<div
												style={
													secondaryText
												}
											>
												Age{" "}
												{
													treatment.patient_age
												}
											</div>
										</div>
									</td>

									<td
										style={
											cellStyle
										}
									>
										<div
											style={
												primaryText
											}
										>
											{
												treatment.doctor_name
											}
										</div>
									</td>

									<td
										style={
											cellStyle
										}
									>
										<div
											style={{
												color:
													"#d6e2f0",
												maxWidth:
													"280px",
											}}
										>
											{
												treatment.diagnosis
											}
										</div>
									</td>

									<td
										style={
											cellStyle
										}
									>
										<div
											style={
												secondaryText
											}
										>
											{new Date(
												treatment.appointment_time
											).toLocaleString()}
										</div>
									</td>

									<td
										style={
											cellStyle
										}
									>
										<button
											onClick={() =>
												handleView(
													treatment.id
												)
											}
											style={
												viewButton
											}
											onMouseEnter={(
												e
											) => {
												e.currentTarget.style.transform =
													"translateY(-2px)";

												e.currentTarget.style.background =
													"rgba(59,130,246,0.16)";

												e.currentTarget.style.border =
													"1px solid rgba(96,165,250,0.45)";

												e.currentTarget.style.boxShadow =
													"0 12px 30px rgba(37,99,235,0.18)";
											}}
											onMouseLeave={(
												e
											) => {
												e.currentTarget.style.transform =
													"translateY(0px)";

												e.currentTarget.style.background =
													"rgba(59,130,246,0.08)";

												e.currentTarget.style.border =
													"1px solid rgba(59,130,246,0.25)";

												e.currentTarget.style.boxShadow =
													"none";
											}}
										>
											<FileText
												size={16}
											/>
											View
										</button>
									</td>
								</tr>
							)
						)
					)}
				</tbody>
			</table>

			{/* Pagination */}
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

			<TreatmentDetailsModal
				isOpen={
					isModalOpen
				}
				onClose={
					closeModal
				}
				treatment={
					selectedTreatment
				}
				loading={
					loadingDetails
				}
				onEdit={
					handleEdit
				}
				onDelete={(
					treatmentId: number
				) => {
					setDeleteTreatmentId(
						treatmentId
					);
				}}
			/>

			<TreatmentFormModal
				isOpen={
					isEditModalOpen
				}
				onClose={() => {
					setIsEditModalOpen(
						false
					);

					setEditingTreatment(
						null
					);
				}}
				onSuccess={
					handleEditSuccess
				}
				mode="edit"
				treatment={
					editingTreatment
				}
			/>

			{deleteTreatmentId && (
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
						<h3
							style={{
								color:
									"#f8fafc",
								marginTop:
									0,
							}}
						>
							Delete Treatment?
						</h3>

						<p
							style={{
								color:
									"#94a3b8",
								lineHeight:
									1.6,
							}}
						>
							This action
							cannot be
							undone.
						</p>

						<div
							style={{
								display:
									"flex",
								gap:
									"12px",
								justifyContent:
									"flex-end",
								marginTop:
									"24px",
							}}
						>
							<button
								onClick={() =>
									setDeleteTreatmentId(
										null
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

									e.currentTarget.style.border =
										"1px solid rgba(255,255,255,0.14)";

									e.currentTarget.style.boxShadow =
										"0 10px 30px rgba(0,0,0,0.22)";
								}}
								onMouseLeave={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(0px)";

									e.currentTarget.style.background =
										"rgba(255,255,255,0.05)";

									e.currentTarget.style.border =
										"1px solid rgba(255,255,255,0.08)";

									e.currentTarget.style.boxShadow =
										"none";
								}}
							>
								Cancel
							</button>

							<button
								onClick={
									handleDelete
								}
								style={
									deleteButton
								}
								onMouseEnter={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(-2px)";

									e.currentTarget.style.boxShadow =
										"0 12px 35px rgba(220,38,38,0.35)";
								}}
								onMouseLeave={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(0px)";

									e.currentTarget.style.boxShadow =
										"none";
								}}
								disabled={
									isDeleting
								}
							>
								{isDeleting
									? "Deleting..."
									: "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

const cellStyle = {
	padding: "18px",
};

const primaryText = {
	color: "#f8fafc",
	fontWeight: 600,
};

const secondaryText = {
	color: "#94a3b8",
	fontSize: "14px",
	marginTop: "4px",
};

const viewButton = {
	height: "42px",
	padding: "0 16px",
	borderRadius: "14px",
	border:
		"1px solid rgba(59,130,246,0.25)",
	background:
		"rgba(59,130,246,0.08)",
	color: "#60a5fa",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	fontWeight: 600,
	transition:
		"all 0.22s ease",
};

const paginationButton = {
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
		"rgba(0,0,0,0.7)",

	backdropFilter:
		"blur(12px)",

	display:
		"flex",

	alignItems:
		"center",

	justifyContent:
		"center",

	zIndex:
		10000,
};

const deleteModal = {
	width: "520px",

	padding:
		"40px",

	borderRadius:
		"34px",

	background:
		"linear-gradient(180deg, rgba(10,15,30,0.98), rgba(4,8,20,0.98))",

	border:
		"1px solid rgba(255,255,255,0.08)",

	boxShadow:
		"0 30px 80px rgba(0,0,0,0.55)",
};

const cancelButton = {
	height:
		"50px",

	padding:
		"0 20px",

	borderRadius:
		"16px",

	border:
		"1px solid rgba(255,255,255,0.08)",

	background:
		"rgba(255,255,255,0.05)",

	color:
		"#d6e2f0",

	cursor:
		"pointer",

	fontWeight:
		600,

	transition:
		"all 0.22s ease",
};

const deleteButton = {
	height:
		"50px",

	padding:
		"0 22px",

	border:
		"none",

	borderRadius:
		"16px",

	background:
		"linear-gradient(135deg, #dc2626, #b91c1c)",

	color:
		"white",

	cursor:
		"pointer",

	fontWeight:
		600,

	transition:
		"all 0.22s ease",
};

const deleteToast = {
	position:
		"fixed" as const,

	top:
		"30px",

	left:
		"50%",

	transform:
		"translateX(-50%)",

	padding:
		"16px 28px",

	borderRadius:
		"18px",

	background:
		"rgba(16,185,129,0.95)",

	color:
		"white",

	fontWeight:
		600,

	boxShadow:
		"0 20px 50px rgba(16,185,129,0.35)",

	zIndex:
		12000,

	backdropFilter:
		"blur(12px)",

	animation:
		"fadeIn 0.2s ease",
};
