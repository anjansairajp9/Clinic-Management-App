"use client";

import { useEffect, useRef, useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	AlertTriangle,
	Eye,
	Phone,
	Stethoscope,
	CalendarDays,
	FileText,
} from "lucide-react";
import toast from "react-hot-toast";

import { searchPayments, getPaymentById, deletePayment } from "@/services/payment.service";
import { useDashboardDate } from "@/hooks/useDashboardDate";
import type { Payment, PaymentDetails } from "@/types/payment";
import { useMobile } from "@/hooks/useMobile";

import PaymentDetailsModal from "@/components/payments/PaymentDetailsModal";
import PaymentFormModal from "@/components/payments/PaymentFormModal";

type Props = {
	searchQuery: string;
	paymentStatus: string;
	refreshKey: number;
};

export default function PaymentTable({
	searchQuery,
	paymentStatus,
	refreshKey,
}: Props) {
	const isMobile = useMobile();
	const [mounted, setMounted] = useState(false);

	const { selectedDate } = useDashboardDate();
	const hasUserChangedDate = useRef(false);

	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [detailsLoading, setDetailsLoading] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [paymentToEdit, setPaymentToEdit] = useState<PaymentDetails | null>(null);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [cancelDeleteHovered, setCancelDeleteHovered] = useState(false);
	const [confirmDeleteHovered, setConfirmDeleteHovered] = useState(false);

	const limit = 10;

	// Hydration Fix
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		fetchPayments();
	}, [searchQuery, paymentStatus, selectedDate, page, refreshKey]);

	const fetchPayments = async () => {
		try {
			setLoading(true);
			const response = await searchPayments({
				query: searchQuery || undefined,
				payment_status: paymentStatus || undefined,
				appointment_date: hasUserChangedDate.current ? selectedDate : undefined,
				page,
				limit,
			});
			setPayments(response);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		hasUserChangedDate.current = true;
	}, [selectedDate]);

	useEffect(() => {
		hasUserChangedDate.current = false;
	}, []);

	const handleViewPayment = async (paymentId: number) => {
		try {
			setIsDetailsOpen(true);
			setDetailsLoading(true);
			const response = await getPaymentById(paymentId);
			setSelectedPayment(response);
		} catch (error) {
			console.error(error);
			setIsDetailsOpen(false);
		} finally {
			setDetailsLoading(false);
		}
	};

	const confirmDelete = async () => {
		if (!paymentToDelete) return;
		try {
			setIsDeleting(true);
			await deletePayment(paymentToDelete);
			setIsDeleteModalOpen(false);
			setPaymentToDelete(null);
			fetchPayments();
			toast.success("Payment deleted successfully", {
				position: "top-center",
			});
		} catch (error: any) {
			console.error("Failed to delete payment", error);
			toast.error(
				error?.response?.data?.detail || "Failed to delete payment",
				{
					position: "top-center",
				}
			);
		} finally {
			setIsDeleting(false);
		}
	};

	const formatMethod = (method: string | null) => {
		if (!method) return "-";
		return method
			.replaceAll("_", " ")
			.replace(/\b\w/g, (letter) => letter.toUpperCase());
	};

	const getStatusStyle = (status: string | null) => {
		if (status === "paid") {
			return {
				background: "rgba(34,197,94,0.12)",
				color: "#4ade80",
				border: "1px solid rgba(34,197,94,0.2)",
			};
		}
		return {
			background: "rgba(245,158,11,0.12)",
			color: "#fbbf24",
			border: "1px solid rgba(245,158,11,0.2)",
		};
	};

	if (!mounted) {
		return <div style={{ minHeight: "400px" }} />;
	}

	return (
		<div
			style={{
				background: "rgba(255,255,255,0.03)",
				border: "1px solid rgba(255,255,255,0.08)",
				borderRadius: "24px",
				overflow: "hidden",
			}}
		>
			{isMobile ? (
				<div style={{ display: "flex", flexDirection: "column" }}>
					{loading ? (
						<div
							style={{
								padding: "40px",
								textAlign: "center",
								color: "#94a3b8",
							}}
						>
							Loading payments...
						</div>
					) : payments.length === 0 ? (
						<div
							style={{
								padding: "40px",
								textAlign: "center",
								color: "#64748b",
							}}
						>
							No payments found
						</div>
					) : (
						payments.map((payment) => {
							const dueAmount = payment.total_amount - payment.amount_paid;
							const statusStyle = getStatusStyle(payment.payment_status);

							return (
								<div
									key={payment.id}
									onClick={() => handleViewPayment(payment.id)}
									style={{
										padding: "16px",
										display: "flex",
										flexDirection: "column",
										gap: "12px",
										borderBottom: "1px solid rgba(255,255,255,0.05)",
										cursor: "pointer",
										transition: "all 0.2s ease",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background =
											"rgba(59,130,246,0.06)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = "transparent";
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start",
										}}
									>
										<div>
											<div
												style={{
													color: "#f8fafc",
													fontWeight: 600,
													fontSize: "16px",
												}}
											>
												{payment.patient_name}
											</div>
											<div
												style={{
													color: "#94a3b8",
													fontSize: "13px",
													marginTop: "4px",
												}}
											>
												{payment.patient_phone}
											</div>
										</div>
										<div
											style={{
												...statusStyle,
												padding: "6px 12px",
												borderRadius: "999px",
												fontSize: "11px",
												fontWeight: 600,
												textTransform: "capitalize",
											}}
										>
											{payment.payment_status}
										</div>
									</div>

									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "6px",
										}}
									>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "8px",
												fontSize: "13px",
												color: "#d6e2f0",
											}}
										>
											<Stethoscope size={14} color="#60a5fa" />
											Dr. {payment.doctor_name}
										</div>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "8px",
												fontSize: "13px",
												color: "#d6e2f0",
											}}
										>
											<CalendarDays size={14} color="#60a5fa" />
											{new Date(payment.appointment_time).toLocaleDateString()}
										</div>
									</div>

									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginTop: "8px",
										}}
									>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: "4px",
											}}
										>
											<span
												style={{
													color: "#f8fafc",
													fontWeight: 600,
													fontSize: "14px",
												}}
											>
												Total: ₹{payment.total_amount}
											</span>
											<div
												style={{
													display: "flex",
													gap: "10px",
													fontSize: "12px",
												}}
											>
												<span style={{ color: "#38bdf8" }}>
													Paid ₹{payment.amount_paid}
												</span>
												{dueAmount > 0 && (
													<span style={{ color: "#f59e0b" }}>
														Due ₹{dueAmount}
													</span>
												)}
											</div>
										</div>

										<button
											onClick={(e) => {
												e.stopPropagation();
												handleViewPayment(payment.id);
											}}
											style={{
												height: "36px",
												padding: "0 14px",
												borderRadius: "12px",
												border: "1px solid rgba(59,130,246,0.25)",
												background: "rgba(59,130,246,0.08)",
												color: "#60a5fa",
												cursor: "pointer",
												display: "flex",
												alignItems: "center",
												gap: "6px",
												fontSize: "13px",
												fontWeight: 600,
												transition: "all 0.22s ease",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = "translateY(-2px)";
												e.currentTarget.style.background =
													"rgba(59,130,246,0.16)";
												e.currentTarget.style.border =
													"1px solid rgba(96,165,250,0.45)";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = "translateY(0px)";
												e.currentTarget.style.background =
													"rgba(59,130,246,0.08)";
												e.currentTarget.style.border =
													"1px solid rgba(59,130,246,0.25)";
											}}
										>
											<Eye size={14} /> View
										</button>
									</div>
								</div>
							);
						})
					)}
				</div>
			) : (
				<div
					style={{
						width: "100%",
						overflowX: "auto",
						WebkitOverflowScrolling: "touch",
					}}
				>
					<table
						style={{
							width: "100%",
							minWidth: "900px",
							borderCollapse: "collapse",
						}}
					>
						<thead>
							<tr>
								<th style={thStyle}>Patient</th>
								<th style={thStyle}>Doctor</th>
								<th style={thStyle}>Amount</th>
								<th style={thStyle}>Method</th>
								<th style={thStyle}>Status</th>
								<th style={thStyle}>Appointment</th>
								<th style={thStyle}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td
										colSpan={7}
										style={{
											padding: "60px",
											textAlign: "center",
											color: "#94a3b8",
										}}
									>
										Loading payments...
									</td>
								</tr>
							) : payments.length === 0 ? (
								<tr>
									<td
										colSpan={7}
										style={{
											padding: "60px",
											textAlign: "center",
											color: "#64748b",
										}}
									>
										No payments found
									</td>
								</tr>
							) : (
								payments.map((payment) => {
									const dueAmount =
										payment.total_amount - payment.amount_paid;
									const statusStyle = getStatusStyle(payment.payment_status);

									return (
										<tr
											key={payment.id}
											style={{
												transition: "all 0.2s ease",
												borderBottom: "1px solid rgba(255,255,255,0.05)",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.background =
													"rgba(59,130,246,0.06)";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = "transparent";
											}}
										>
											<td style={tdStyle}>
												<div
													style={{
														fontWeight: 600,
														color: "#f8fafc",
													}}
												>
													{payment.patient_name}
												</div>
												<div
													style={{
														color: "#94a3b8",
														fontSize: "13px",
													}}
												>
													{payment.patient_phone}
												</div>
											</td>
											<td style={tdStyle}>Dr. {payment.doctor_name}</td>
											<td style={tdStyle}>
												<div
													style={{
														color: "#f8fafc",
														fontWeight: 600,
													}}
												>
													Total ₹{payment.total_amount}
												</div>
												<div
													style={{
														color: "#38bdf8",
														fontSize: "13px",
														marginTop: "4px",
													}}
												>
													Paid ₹{payment.amount_paid}
												</div>
												<div
													style={{
														color: "#f59e0b",
														fontSize: "13px",
													}}
												>
													Due ₹{dueAmount}
												</div>
											</td>
											<td style={tdStyle}>
												{formatMethod(payment.payment_method)}
											</td>
											<td style={tdStyle}>
												<div
													style={{
														...statusStyle,
														padding: "6px 12px",
														borderRadius: "999px",
														fontSize: "12px",
														fontWeight: 600,
														display: "inline-flex",
													}}
												>
													{payment.payment_status}
												</div>
											</td>
											<td style={tdStyle}>
												{new Date(
													payment.appointment_time
												).toLocaleDateString()}
											</td>
											<td style={tdStyle}>
												<button
													style={viewButton}
													onClick={() => handleViewPayment(payment.id)}
													onMouseEnter={(e) => {
														e.currentTarget.style.transform =
															"translateY(-2px)";
														e.currentTarget.style.background =
															"rgba(59,130,246,0.16)";
														e.currentTarget.style.border =
															"1px solid rgba(96,165,250,0.45)";
														e.currentTarget.style.boxShadow =
															"0 12px 30px rgba(37,99,235,0.18)";
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.transform = "translateY(0px)";
														e.currentTarget.style.background =
															"rgba(59,130,246,0.08)";
														e.currentTarget.style.border =
															"1px solid rgba(59,130,246,0.25)";
														e.currentTarget.style.boxShadow = "none";
													}}
												>
													<FileText size={16} /> View
												</button>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			)}

			{/* Pagination */}
			<div
				style={{
					padding: "14px 24px",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<button
					onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
					style={paginationButton}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = "rgba(255,255,255,0.08)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = "rgba(255,255,255,0.04)";
					}}
				>
					<ChevronLeft size={14} /> Previous
				</button>

				<span style={{ color: "#7a9ab8" }}>Page {page}</span>

				<button
					onClick={() => setPage((prev) => prev + 1)}
					style={paginationButton}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = "rgba(255,255,255,0.08)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = "rgba(255,255,255,0.04)";
					}}
				>
					Next <ChevronRight size={14} />
				</button>
			</div>

			{/* Modals */}
			<PaymentDetailsModal
				isOpen={isDetailsOpen}
				onClose={() => {
					setIsDetailsOpen(false);
					setSelectedPayment(null);
				}}
				payment={selectedPayment}
				loading={detailsLoading}
				onEdit={(payment) => {
					setIsDetailsOpen(false);
					setPaymentToEdit(payment);
					setIsEditModalOpen(true);
				}}
				onDelete={() => {
					if (selectedPayment) {
						setIsDetailsOpen(false);
						setPaymentToDelete(selectedPayment.id);
						setIsDeleteModalOpen(true);
					}
				}}
			/>

			<PaymentFormModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setPaymentToEdit(null);
				}}
				onSuccess={() => fetchPayments()}
				mode="edit"
				payment={paymentToEdit}
			/>

			{isDeleteModalOpen && (
				<div style={deleteOverlayStyle}>
					<div
						style={{
							...deleteModalStyle,
							width: isMobile ? "92vw" : "460px",
							padding: isMobile ? "24px" : "30px",
						}}
					>
						<div style={deleteIconContainer}>
							<AlertTriangle size={32} color="#ef4444" />
						</div>

						<h3
							style={{
								color: "#f8fafc",
								fontSize: "24px",
								margin: "0 0 12px 0",
								fontWeight: 700,
							}}
						>
							Delete Payment
						</h3>

						<p
							style={{
								color: "#94a3b8",
								fontSize: "15px",
								margin: "0 0 28px 0",
								lineHeight: 1.6,
							}}
						>
							Are you sure you want to delete this payment record? This action
							is permanent and cannot be undone.
						</p>

						<div
							style={{
								display: "flex",
								flexDirection: isMobile ? "column" : "row",
								gap: "14px",
								width: "100%",
							}}
						>
							<button
								onClick={() => {
									setIsDeleteModalOpen(false);
									setPaymentToDelete(null);
								}}
								onMouseEnter={() => setCancelDeleteHovered(true)}
								onMouseLeave={() => setCancelDeleteHovered(false)}
								style={{
									...cancelButtonStyle,
									width: isMobile ? "100%" : "auto",
									background: cancelDeleteHovered
										? "rgba(255,255,255,0.08)"
										: "rgba(255,255,255,0.04)",
									border: `1px solid ${cancelDeleteHovered
										? "rgba(255,255,255,0.18)"
										: "rgba(255,255,255,0.08)"
										}`,
								}}
							>
								Cancel
							</button>

							<button
								onClick={confirmDelete}
								disabled={isDeleting}
								onMouseEnter={() => setConfirmDeleteHovered(true)}
								onMouseLeave={() => setConfirmDeleteHovered(false)}
								style={{
									...confirmDeleteStyle,
									width: isMobile ? "100%" : "auto",
									transform:
										confirmDeleteHovered && !isDeleting
											? "translateY(-2px)"
											: "translateY(0)",
									boxShadow:
										confirmDeleteHovered && !isDeleting
											? "0 8px 24px rgba(239, 68, 68, 0.25)"
											: "none",
									opacity: isDeleting ? 0.7 : 1,
								}}
							>
								{isDeleting ? "Deleting..." : "Yes, Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

/* ---------- Styles ---------- */

const thStyle = {
	textAlign: "left" as const,
	padding: "18px",
	color: "#94a3b8",
	fontSize: "13px",
	fontWeight: 600,
	borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const tdStyle = {
	padding: "18px",
	color: "#e2e8f0",
};

const viewButton = {
	height: "42px",
	padding: "0 16px",
	borderRadius: "14px",
	border: "1px solid rgba(59,130,246,0.25)",
	background: "rgba(59,130,246,0.08)",
	color: "#60a5fa",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	fontWeight: 600,
	transition: "all 0.22s ease",
};

const paginationButton = {
	background: "rgba(255,255,255,0.04)",
	border: "1px solid rgba(255,255,255,0.08)",
	color: "#d6e2f0",
	padding: "8px 14px",
	borderRadius: "14px",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	fontSize: "12px",
	transition: "all 0.2s ease",
};

const deleteOverlayStyle = {
	position: "fixed" as const,
	inset: 0,
	background: "rgba(0,0,0,0.72)",
	backdropFilter: "blur(10px)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	zIndex: 9999,
};

const deleteModalStyle = {
	background: "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,8,23,0.98))",
	border: "1px solid rgba(239,68,68,0.25)",
	boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
	borderRadius: "28px",
	display: "flex",
	flexDirection: "column" as const,
	alignItems: "center",
	textAlign: "center" as const,
};

const deleteIconContainer = {
	width: "68px",
	height: "68px",
	borderRadius: "50%",
	background: "rgba(239,68,68,0.1)",
	border: "1px solid rgba(239,68,68,0.2)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	marginBottom: "20px",
};

const cancelButtonStyle = {
	flex: 1,
	height: "50px",
	borderRadius: "14px",
	color: "#f8fafc",
	cursor: "pointer",
	fontWeight: 600,
	fontSize: "15px",
	transition: "all 0.2s ease",
};

const confirmDeleteStyle = {
	flex: 1,
	height: "50px",
	borderRadius: "14px",
	border: "none",
	background: "linear-gradient(135deg, #ef4444, #dc2626)",
	color: "white",
	cursor: "pointer",
	fontWeight: 600,
	fontSize: "15px",
	transition: "all 0.2s ease",
};
