"use client";

import {
	useEffect,
	useState,
} from "react";

import {
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

import toast from "react-hot-toast";

import {
	getAppointments,
	searchAppointments,
	getAppointmentById,
	updateAppointmentStatus,
	deleteAppointment,
} from "@/services/appointment.service";

import {
	getTreatmentByAppointmentId,
} from "@/services/treatment.service";

import {
	useDashboardDate,
} from "@/hooks/useDashboardDate";

import type {
	Appointment,
	AppointmentDetails,
} from "@/types/appointment";

import type {
	TreatmentDetails,
} from "@/types/treatment";

import AppointmentRow from "./AppointmentRow";
import AppointmentDetailsDrawer from "./AppointmentDetailsDrawer";
import AppointmentFormModal from "./AppointmentFormModal";
import AppointmentTreatmentModal from "./AppointmentTreatmentModal";
import { getPaymentByAppointmentId } from "@/services/payment.service";
import type { PaymentDetails } from "@/types/payment";
import AppointmentPaymentModal from "./AppointmentPaymentModal";

type Props = {
	searchQuery: string;
	status: string;
	doctorId: string;
	refreshKey: number;
};

export default function AppointmentTable({
	searchQuery,
	status,
	doctorId,
	refreshKey,
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

	const [
		actionLoading,
		setActionLoading,
	] = useState(false);

	const [
		isDeleteModalOpen,
		setIsDeleteModalOpen,
	] = useState(false);

	const [
		deletingAppointmentId,
		setDeletingAppointmentId,
	] = useState<number | null>(
		null
	);

	const [
		isEditModalOpen,
		setIsEditModalOpen,
	] = useState(false);

	const [
		isTreatmentModalOpen,
		setIsTreatmentModalOpen,
	] = useState(false);

	const [
		selectedTreatment,
		setSelectedTreatment,
	] = useState<TreatmentDetails | null>(
		null
	);

	const [
		treatmentLoading,
		setTreatmentLoading,
	] = useState(false);

	const [
		editingAppointment,
		setEditingAppointment,
	] =
		useState<AppointmentDetails | null>(
			null
		);

	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null);
	const [paymentLoading, setPaymentLoading] = useState(false);

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
		refreshKey,
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

	const handleStatusUpdate =
		async (
			appointmentId: number,
			status:
				| "completed"
				| "cancelled"
				| "no_show"
		) => {
			try {
				setActionLoading(
					true
				);

				await updateAppointmentStatus(
					appointmentId,
					status
				);

				// refresh drawer
				const updatedAppointment =
					await getAppointmentById(
						appointmentId
					);

				setSelectedAppointment(
					updatedAppointment
				);

				// refresh table
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

				toast.success(
					`Appointment marked as ${status.replace(
						"_",
						" "
					)}`
				);
			} catch (
			error: any
			) {
				toast.error(
					error?.response
						?.data
						?.detail ||
					"Failed to update appointment status"
				);
			} finally {
				setActionLoading(
					false
				);
			}
		};

	const handleEdit =
		(
			appointment: AppointmentDetails
		) => {
			setEditingAppointment(
				appointment
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
				!editingAppointment
			) {
				return;
			}

			try {
				// refresh drawer
				const updatedAppointment =
					await getAppointmentById(
						editingAppointment.id
					);

				setSelectedAppointment(
					updatedAppointment
				);

				// refresh table
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

	const handleViewTreatment =
		async (
			appointmentId: number
		) => {
			try {
				setTreatmentLoading(
					true
				);

				setIsTreatmentModalOpen(
					true
				);

				const response =
					await getTreatmentByAppointmentId(
						appointmentId
					);

				setSelectedTreatment(
					response
				);
			} catch (
			error: any
			) {
				toast.error(
					error?.response
						?.data
						?.detail ||
					"Treatment not found"
				);

				setIsTreatmentModalOpen(
					false
				);
			} finally {
				setTreatmentLoading(
					false
				);
			}
		};

	const handleViewPayment = async (appointmentId: number) => {
		try {
			setPaymentLoading(true);
			setIsPaymentModalOpen(true);

			const response = await getPaymentByAppointmentId(appointmentId);
			setSelectedPayment(response);
		} catch (error: any) {
			toast.error(
				error?.response?.data?.detail || "Payment not found for this appointment"
			);
			setIsPaymentModalOpen(false); // Close if not found
		} finally {
			setPaymentLoading(false);
		}
	};

	const handleDelete =
		async (
			appointmentId: number
		) => {
			try {
				setActionLoading(
					true
				);

				await deleteAppointment(
					appointmentId
				);

				// close everything
				setIsDeleteModalOpen(
					false
				);

				setIsDrawerOpen(
					false
				);

				setSelectedAppointment(
					null
				);

				setDeletingAppointmentId(
					null
				);

				// refresh table
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

				toast.success(
					"Appointment deleted successfully"
				);
			} catch (
			error: any
			) {
				toast.error(
					error?.response
						?.data
						?.detail ||
					"Failed to delete appointment"
				);
			} finally {
				setActionLoading(
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
					loadingDetails ||
					actionLoading
				}
				onStatusUpdate={
					handleStatusUpdate
				}
				onEdit={
					handleEdit
				}
				onViewTreatment={
					handleViewTreatment
				}
				onViewPayment={handleViewPayment}
				onDelete={(
					appointmentId
				) => {
					setDeletingAppointmentId(
						appointmentId
					);

					setIsDeleteModalOpen(
						true
					);
				}}
			/>

			<AppointmentFormModal
				isOpen={
					isEditModalOpen
				}
				onClose={() => {
					setIsEditModalOpen(
						false
					);

					setEditingAppointment(
						null
					);
				}}
				onSuccess={
					handleEditSuccess
				}
				mode="edit"
				appointment={
					editingAppointment
				}
			/>

			<AppointmentTreatmentModal
				isOpen={
					isTreatmentModalOpen
				}
				onClose={() => {
					setIsTreatmentModalOpen(
						false
					);

					setTimeout(() => {
						setSelectedTreatment(
							null
						);
					}, 250);
				}}
				treatment={
					selectedTreatment
				}
				loading={
					treatmentLoading
				}
			/>

			<AppointmentPaymentModal
				isOpen={isPaymentModalOpen}
				onClose={() => {
					setIsPaymentModalOpen(false);
					setTimeout(() => {
						setSelectedPayment(null);
					}, 250);
				}}
				payment={selectedPayment}
				loading={paymentLoading}
			/>

			{isDeleteModalOpen && (
				<>
					{/* Backdrop */}
					<div
						onClick={() => {
							if (
								!actionLoading
							) {
								setIsDeleteModalOpen(
									false
								);

								setDeletingAppointmentId(
									null
								);
							}
						}}
						style={{
							position:
								"fixed",
							inset: 0,
							background:
								"rgba(0,0,0,0.72)",
							backdropFilter:
								"blur(10px)",
							zIndex:
								1400,
						}}
					/>

					{/* Modal */}
					<div
						style={{
							position:
								"fixed",
							top: "50%",
							left: "50%",
							transform:
								"translate(-50%, -50%)",

							width:
								"min(480px, 92vw)",

							borderRadius:
								"30px",

							padding:
								"34px",

							background: `
					radial-gradient(
						circle at top right,
						rgba(239,68,68,0.12),
						transparent 30%
					),

					linear-gradient(
						180deg,
						rgba(8,15,30,0.98),
						rgba(2,8,23,0.98)
					)
				`,

							border:
								"1px solid rgba(255,255,255,0.08)",

							boxShadow:
								"0 40px 120px rgba(0,0,0,0.6)",

							zIndex:
								1401,
						}}
					>
						<div
							style={{
								width:
									"72px",
								height:
									"72px",
								borderRadius:
									"22px",
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
								fontSize:
									"32px",
								marginBottom:
									"24px",
							}}
						>
							⚠️
						</div>

						<h2
							style={{
								color:
									"#f8fafc",
								fontSize:
									"30px",
								fontWeight:
									700,
								margin:
									0,
							}}
						>
							Delete Appointment?
						</h2>

						<p
							style={{
								color:
									"#94a3b8",
								fontSize:
									"15px",
								lineHeight:
									1.7,
								marginTop:
									"14px",
								marginBottom:
									"30px",
							}}
						>
							This action
							cannot be
							undone.
							The
							appointment
							will be
							permanently
							deleted.
						</p>

						<div
							style={{
								display:
									"flex",
								gap: "14px",
							}}
						>
							<button
								onClick={() =>
									setIsDeleteModalOpen(
										false
									)
								}
								disabled={
									actionLoading
								}
								style={{
									flex: 1,
									height:
										"56px",
									borderRadius:
										"18px",
									border:
										"1px solid rgba(255,255,255,0.08)",
									background:
										"rgba(255,255,255,0.04)",
									color:
										"#dbe7f5",
									fontSize:
										"15px",
									fontWeight:
										600,
									cursor:
										"pointer",
									transition:
										"all 0.22s ease",
								}}

								onMouseEnter={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(-2px)";

									e.currentTarget.style.background =
										"rgba(255,255,255,0.08)";

									e.currentTarget.style.border =
										"1px solid rgba(255,255,255,0.14)";
								}}

								onMouseLeave={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(0)";

									e.currentTarget.style.background =
										"rgba(255,255,255,0.04)";

									e.currentTarget.style.border =
										"1px solid rgba(255,255,255,0.08)";
								}}
							>
								Cancel
							</button>

							<button
								onClick={() => {
									if (
										deletingAppointmentId
									) {
										handleDelete(
											deletingAppointmentId
										);
									}
								}}
								disabled={
									actionLoading
								}
								style={{
									flex: 1,
									height:
										"56px",
									border:
										"none",
									borderRadius:
										"18px",
									background:
										"linear-gradient(135deg, #ef4444, #dc2626)",
									color:
										"white",
									fontSize:
										"15px",
									fontWeight:
										700,
									cursor:
										"pointer",
									boxShadow:
										"0 16px 40px rgba(239,68,68,0.28)",
									transition:
										"all 0.22s ease",
								}}

								onMouseEnter={(
									e
								) => {
									if (
										!actionLoading
									) {
										e.currentTarget.style.transform =
											"translateY(-2px)";

										e.currentTarget.style.boxShadow =
											"0 24px 55px rgba(239,68,68,0.42)";
									}
								}}

								onMouseLeave={(
									e
								) => {
									e.currentTarget.style.transform =
										"translateY(0)";

									e.currentTarget.style.boxShadow =
										"0 16px 40px rgba(239,68,68,0.28)";
								}}
							>
								{actionLoading
									? "Deleting..."
									: "Delete Appointment"}
							</button>
						</div>
					</div>
				</>
			)
			}
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
