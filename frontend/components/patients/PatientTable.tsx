"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
	searchPatients,
	getPatientById,
	deletePatient,
	updateMedicalHistory,
} from "@/services/patient.service";

import type { Patient, PatientDetails } from "@/types/patient";
import { useMobile } from "@/hooks/useMobile";

import PatientRow from "./PatientRow";
import PatientDetailsDrawer from "./PatientDetailsDrawer";
import PatientFormModal from "./PatientFormModal";
import PatientMedicalHistoryModal from "./PatientMedicalHistoryModal";
import PatientAppointmentHistoryModal from "./PatientAppointmentHistoryModal";
import PatientTreatmentHistoryModal from "./PatientTreatmentHistoryModal";

type Props = {
	searchQuery: string;
	refreshKey: number;
};

export default function PatientTable({ searchQuery, refreshKey }: Props) {
	const isMobile = useMobile();

	const [patients, setPatients] = useState<Patient[]>([]);
	const [page, setPage] = useState(1);
	const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [patientToDelete, setPatientToDelete] = useState<number | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingPatient, setEditingPatient] = useState<PatientDetails | null>(null);
	const [isMedicalHistoryModalOpen, setIsMedicalHistoryModalOpen] = useState(false);
	const [isAppointmentHistoryModalOpen, setIsAppointmentHistoryModalOpen] = useState(false);
	const [medicalHistoryLoading, setMedicalHistoryLoading] = useState(false);
	const [medicalHistoryMessage, setMedicalHistoryMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [isTreatmentHistoryModalOpen, setIsTreatmentHistoryModalOpen] = useState(false);

	const limit = 10;

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const response = await searchPatients({ query: searchQuery, page, limit });
				setPatients(response);
			} catch (error) {
				console.error(error);
			}
		};
		fetchPatients();
	}, [searchQuery, page, refreshKey]);

	useEffect(() => {
		setPage(1);
	}, [searchQuery, refreshKey]);

	const handleView = async (patientId: number) => {
		try {
			setIsDrawerOpen(true);
			setLoadingDetails(true);
			const response = await getPatientById(patientId);
			setSelectedPatient(response);
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingDetails(false);
		}
	};

	const handleEdit = (patient: PatientDetails) => {
		setEditingPatient(patient);
		setIsDrawerOpen(false);
		setIsEditModalOpen(true);
	};

	const handleEditSuccess = async () => {
		if (!editingPatient) return;
		try {
			const updatedPatient = await getPatientById(editingPatient.id);
			setSelectedPatient(updatedPatient);
			setIsDrawerOpen(true);

			const response = await searchPatients({ query: searchQuery, page, limit });
			setPatients(response);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = (patientId: number) => {
		setPatientToDelete(patientId);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		if (!patientToDelete) return;
		try {
			setDeleteLoading(true);
			await deletePatient(patientToDelete);

			setShowDeleteModal(false);
			setPatientToDelete(null);
			closeDrawer();

			const response = await searchPatients({ query: searchQuery, page, limit });
			setPatients(response);
			toast.success("Patient deleted successfully");
		} catch (error: any) {
			toast.error(error?.response?.data?.detail || "Failed to delete patient");
		} finally {
			setDeleteLoading(false);
		}
	};

	const handleMedicalHistorySave = async (data: Record<string, any>) => {
		if (!selectedPatient) return;
		try {
			setMedicalHistoryLoading(true);
			setMedicalHistoryMessage(null);

			await updateMedicalHistory(selectedPatient.id, { data });

			const updatedPatient = await getPatientById(selectedPatient.id);
			setSelectedPatient(updatedPatient);

			setMedicalHistoryMessage({
				type: "success",
				text: "Medical history updated successfully",
			});
			setIsMedicalHistoryModalOpen(false);
		} catch (error: any) {
			setMedicalHistoryMessage({
				type: "error",
				text: error?.response?.data?.detail || "Failed to update medical history",
			});
		} finally {
			setMedicalHistoryLoading(false);
		}
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
		setIsAppointmentHistoryModalOpen(false);
		setMedicalHistoryMessage(null);
		setLoadingDetails(false);

		setTimeout(() => {
			setSelectedPatient(null);
		}, 250);
	};

	return (
		<div
			style={{
				background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
				border: "1px solid rgba(255,255,255,0.06)",
				borderRadius: "28px",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					padding: "20px 24px",
					borderBottom: "1px solid rgba(255,255,255,0.05)",
				}}
			>
				<h2
					style={{
						color: "#f0f6ff",
						margin: 0,
						fontSize: "18px",
						fontWeight: 600,
					}}
				>
					Patients
				</h2>
			</div>

			{isMobile ? (
				<div style={{ display: "flex", flexDirection: "column" }}>
					{patients.map((patient) => (
						<div
							key={patient.id}
							style={{
								borderBottom: "1px solid rgba(255,255,255,0.05)",
							}}
						>
							<PatientRow
								patient={patient}
								onView={handleView}
								isMobile={isMobile}
							/>
						</div>
					))}
				</div>
			) : (
				<table
					style={{
						width: "100%",
						borderCollapse: "collapse",
					}}
				>
					<thead>
						<tr>
							{["Patient", "Phone", "Gender", "Age", "Actions"].map((header) => (
								<th
									key={header}
									style={{
										textAlign: "left",
										padding: "18px",
										color: "#7a9ab8",
										fontSize: "11px",
										textTransform: "uppercase",
										borderBottom: "1px solid rgba(255,255,255,0.08)",
									}}
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{patients.map((patient) => (
							<PatientRow
								key={patient.id}
								patient={patient}
								onView={handleView}
								isMobile={isMobile}
							/>
						))}
					</tbody>
				</table>
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

				<span
					style={{
						color: "#7a9ab8",
						display: "flex",
						alignItems: "center",
					}}
				>
					Page {page}
				</span>

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

			<PatientDetailsDrawer
				isOpen={isDrawerOpen}
				onClose={closeDrawer}
				patient={selectedPatient}
				loading={loadingDetails}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onMedicalHistory={() => {
					setMedicalHistoryMessage(null);
					setIsMedicalHistoryModalOpen(true);
				}}
				onAppointmentHistory={() => setIsAppointmentHistoryModalOpen(true)}
				onTreatmentHistory={() => setIsTreatmentHistoryModalOpen(true)}
				message={medicalHistoryMessage}
			/>

			<PatientFormModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setEditingPatient(null);
				}}
				onSuccess={handleEditSuccess}
				mode="edit"
				patient={editingPatient}
			/>

			<PatientMedicalHistoryModal
				isOpen={isMedicalHistoryModalOpen}
				onClose={() => setIsMedicalHistoryModalOpen(false)}
				onSave={handleMedicalHistorySave}
				initialData={selectedPatient?.medical_history}
				loading={medicalHistoryLoading}
			/>

			<PatientAppointmentHistoryModal
				isOpen={isAppointmentHistoryModalOpen}
				onClose={() => setIsAppointmentHistoryModalOpen(false)}
				patientId={selectedPatient?.id || null}
				patientName={selectedPatient?.name}
			/>

			<PatientTreatmentHistoryModal
				isOpen={isTreatmentHistoryModalOpen}
				onClose={() => setIsTreatmentHistoryModalOpen(false)}
				patientId={selectedPatient?.id || null}
				patientName={selectedPatient?.name}
			/>

			{/* Delete Modal */}
			{showDeleteModal && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.72)",
						backdropFilter: "blur(14px)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 9999,
					}}
				>
					<div
						style={{
							width: "min(520px, 92vw)",
							background:
								"linear-gradient(135deg, rgba(5,15,45,0.98), rgba(4,14,40,0.96))",
							border: "1px solid rgba(255,255,255,0.08)",
							borderRadius: "32px",
							padding: isMobile ? "24px" : "36px",
							boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
						}}
					>
						<div
							style={{
								width: "78px",
								height: "78px",
								borderRadius: "26px",
								background: "rgba(239,68,68,0.12)",
								border: "1px solid rgba(239,68,68,0.18)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: "28px",
							}}
						>
							<span style={{ fontSize: "42px" }}>⚠️</span>
						</div>

						<h2
							style={{
								color: "#f8fafc",
								fontSize: isMobile ? "32px" : "42px",
								fontWeight: 700,
								margin: "0 0 18px",
							}}
						>
							Delete Patient?
						</h2>

						<p
							style={{
								color: "#8ea4c8",
								fontSize: "18px",
								lineHeight: 1.6,
								marginBottom: "40px",
							}}
						>
							This action cannot be undone. The patient will be permanently deleted.
						</p>

						<div
							style={{
								display: "flex",
								flexDirection: isMobile ? "column" : "row",
								gap: "18px",
							}}
						>
							<button
								onClick={() => {
									setShowDeleteModal(false);
									setPatientToDelete(null);
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = "rgba(255,255,255,0.08)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = "rgba(255,255,255,0.03)";
								}}
								style={{
									flex: 1,
									height: "68px",
									borderRadius: "22px",
									border: "1px solid rgba(255,255,255,0.08)",
									background: "rgba(255,255,255,0.03)",
									color: "#f1f5f9",
									fontSize: "20px",
									fontWeight: 600,
									cursor: "pointer",
									transition: "all 0.2s ease",
								}}
							>
								Cancel
							</button>

							<button
								onClick={confirmDelete}
								disabled={deleteLoading}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "translateY(-2px)";
									e.currentTarget.style.boxShadow =
										"0 15px 30px rgba(239,68,68,0.4)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "translateY(0)";
									e.currentTarget.style.boxShadow = "none";
								}}
								style={{
									flex: 1,
									height: "68px",
									border: "none",
									borderRadius: "22px",
									background: "linear-gradient(135deg, #ef4444, #dc2626)",
									color: "white",
									fontSize: "20px",
									fontWeight: 700,
									cursor: "pointer",
									transition: "all 0.2s ease",
								}}
							>
								{deleteLoading ? "Deleting..." : "Delete Patient"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

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
