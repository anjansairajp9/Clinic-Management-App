export type AppointmentStatus =
	| "scheduled"
	| "completed"
	| "cancelled"
	| "no_show";

export type AppointmentType =
	| "scheduled"
	| "walk_in";


export interface AppointmentStats {
	total_appointments: number;
	scheduled_appointments: number;
	completed_appointments: number;
	cancelled_appointments: number;
	total_revenue: number;
}

export interface Appointment {
	id: number;
	patient_name: string;
	patient_age: number;
	patient_phone: string;
	doctor_name: string;
	doctor_phone: string;
	doctor_specialization: string;
	appointment_type: AppointmentType;
	appointment_time: string;
	status: AppointmentStatus;
	complaint: string | null;
	notes: string | null;
}

export interface AppointmentDetails {
	id: number;

	patient_id: number;
	patient_name: string;
	patient_age: number;
	patient_phone: string;

	doctor_id: number;
	doctor_name: string;
	doctor_phone: string;
	doctor_specialization: string;

	appointment_type: AppointmentType;
	appointment_time: string;
	status: AppointmentStatus;

	complaint: string | null;
	notes: string | null;
}


/* -------------------------------- */
/* CREATE APPOINTMENT TYPES */
/* -------------------------------- */

export interface PatientSearchResult {
	id: number;
	name: string;
	phone: string;
	gender: string;
	dob: string;
	age: number;
}

export interface DoctorSearchResult {
	id: number;
	name: string;
}

export interface AppointmentAvailabilitySlot {
	time: string;
	available: boolean;
}

export interface AppointmentAvailabilityResponse {
	appointment_date: string;
	doctor_id: number | null;
	available_slots: AppointmentAvailabilitySlot[];
}

export interface CreateAppointmentPayload {
	patient_id: number;
	doctor_id: number;
	appointment_type: AppointmentType;
	appointment_date: string;
	appointment_time: string;
	complaint?: string;
	notes?: string;
}

export interface CreateAppointmentResponse {
	id: number;
	patient_id: number;
	doctor_id: number;
	appointment_type: AppointmentType;
	appointment_time: string;
	status: AppointmentStatus;
	complaint: string | null;
	notes: string | null;
	created_at: string;
}


export type AppointmentSearchResult = {
	id: number;

	patient_id: number;
	patient_name: string;
	patient_age: number;
	patient_phone: string;

	doctor_id: number;
	doctor_name: string;
	doctor_phone: string;

	appointment_type: string;
	appointment_time: string;
	status: string;

	complaint?: string;
	notes?: string;
};