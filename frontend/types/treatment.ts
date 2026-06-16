export type AppointmentStatus =
	| "scheduled"
	| "completed"
	| "cancelled"
	| "no_show";

/* -------------------------- */
/* SEARCH TREATMENTS */
/* -------------------------- */

export interface Treatment {
	id: number;

	patient_id: number;
	patient_name: string;
	patient_age: number;
	patient_phone: string;

	doctor_id: number;
	doctor_name: string;

	diagnosis: string;

	appointment_id: number;
	appointment_time: string;
}

/* -------------------------- */
/* TREATMENT DETAILS */
/* -------------------------- */

export interface TreatmentDetails {
	id: number;

	patient_id: number;
	patient_name: string;
	patient_age: number;
	patient_phone: string;

	doctor_id: number;
	doctor_name: string;
	doctor_specialization: string;

	appointment_id: number;
	appointment_time: string;
	appointment_status: AppointmentStatus;
	appointment_complaint:
	| string
	| null;

	diagnosis: string;
	treatment_performed: string;

	medicines_prescribed:
	| string
	| null;

	procedure_notes:
	| string
	| null;

	follow_up_instructions:
	| string
	| null;

	created_at: string;
	updated_at: string;
}

/* -------------------------- */
/* CREATE TREATMENT */
/* -------------------------- */

export interface CreateTreatmentPayload {
	appointment_id: number;

	diagnosis: string;

	treatment_performed: string;

	medicines_prescribed?: string;

	procedure_notes?: string;

	follow_up_instructions?: string;
}

/* -------------------------- */
/* UPDATE TREATMENT */
/* -------------------------- */

export interface UpdateTreatmentPayload {
	diagnosis?: string;

	treatment_performed?: string;

	medicines_prescribed?: string;

	procedure_notes?: string;

	follow_up_instructions?: string;
}

/* -------------------------- */
/* PATIENT TREATMENT HISTORY */
/* -------------------------- */

export interface PatientTreatmentHistory {
	id: number;

	patient_name: string;
	patient_age: number;

	doctor_name: string;
	doctor_specialization: string;

	diagnosis: string;
	treatment_performed: string;

	medicines_prescribed:
	| string
	| null;

	appointment_time: string;

	created_at: string;
	updated_at: string;
}

/* -------------------------- */
/* TREATMENT FILES */
/* -------------------------- */

export interface TreatmentFile {
	id: number;
	treatment_id: number;

	original_file_name: string;

	file_type: string;

	file_size: number;

	file_url: string;

	created_at: string;
}