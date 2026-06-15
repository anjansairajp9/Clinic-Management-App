export interface Doctor {
	id: number;
	name: string;
	phone: string;
	specialization: string;
}

export interface DoctorDetails {
	id: number;
	name: string;
	phone: string;
	specialization: string;
	notes: string | null;

	created_at: string;
	updated_at: string;
}

export interface DoctorAppointment {
	id: number;

	patient_name: string;
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

	total_amount: number;

	created_at: string;
	updated_at: string;
}

/* -------------------------- */
/* CREATE DOCTOR */
/* -------------------------- */

export interface CreateDoctorPayload {
	name: string;
	phone: string;
	specialization: string;
	notes?: string;
}

/* -------------------------- */
/* UPDATE DOCTOR */
/* -------------------------- */

export interface UpdateDoctorPayload {
	name?: string;
	phone?: string;
	specialization?: string;
	notes?: string;
}