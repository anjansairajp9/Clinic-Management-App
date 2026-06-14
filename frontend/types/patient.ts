export type Gender =
	| "male"
	| "female"
	| "other";

export interface Patient {
	id: number;
	name: string;
	phone: string;
	gender: Gender;
	dob: string;
	age: number;
}

export interface PatientDetails {
	id: number;
	name: string;
	phone: string;
	gender: Gender;
	dob: string;
	age: number;
	notes: string | null;

	medical_history:
		| Record<string, any>
		| null;

	created_at: string;
	updated_at: string;
}

export interface PatientAppointmentHistory {
	id: number;

	patient_name: string;
	patient_age: number;
	patient_phone: string;

	doctor_name: string;
	doctor_phone: string;
	doctor_specialization: string;

	appointment_type:
		| "scheduled"
		| "walk_in";

	appointment_time: string;

	status:
		| "scheduled"
		| "completed"
		| "cancelled"
		| "no_show";

	complaint:
		| string
		| null;

	notes:
		| string
		| null;

	created_at: string;
	updated_at: string;
}

/* -------------------------- */
/* CREATE PATIENT */
/* -------------------------- */

export interface CreatePatientPayload {
	name: string;
	phone: string;
	gender: Gender;

	// only DOB is sent
	dob: string;

	notes?: string;
}

/* -------------------------- */
/* UPDATE PATIENT */
/* -------------------------- */

export interface UpdatePatientPayload {
	name?: string;
	phone?: string;
	gender?: Gender;

	// backend updates DOB
	dob?: string;

	notes?: string;
}

/* -------------------------- */
/* MEDICAL HISTORY */
/* -------------------------- */

export interface MedicalHistoryPayload {
	data: Record<
		string,
		any
	>;
}

export interface MedicalHistoryResponse {
	patient_id: number;

	medical_history: Record<
		string,
		any
	>;

	updated_at: string;
}