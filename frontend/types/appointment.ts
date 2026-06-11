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
	appointment_type: string;
	appointment_time: string;
	status: string;
	complaint: string | null;
	notes: string | null;
}

export interface AppointmentDetails {
	patient_id: number;
	patient_name: string;
	patient_age: number;
	patient_phone: string;

	doctor_id: number;
	doctor_name: string;
	doctor_phone: string;
	doctor_specialization: string;

	appointment_type: string;
	appointment_time: string;
	status: string;

	complaint: string | null;
	notes: string | null;

	total_amount: string | null;
}
