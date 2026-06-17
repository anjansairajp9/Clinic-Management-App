export type PaymentMethod =
	| "cash"
	| "upi"
	| "card"
	| "bank_transfer";

export type PaymentStatus =
	| "pending"
	| "paid";

export type AppointmentStatus =
	| "scheduled"
	| "completed"
	| "cancelled"
	| "no_show";

export interface Payment {
	id: number;

	patient_id: number;
	patient_name: string;
	patient_phone: string;

	doctor_id: number;
	doctor_name: string;

	appointment_id: number;
	appointment_time: string;
	appointment_status: AppointmentStatus;

	treatment_id: number | null;
	treatment_diagnosis: string | null;

	total_amount: number;
	amount_paid: number;

	payment_method: PaymentMethod | null;
	payment_status: PaymentStatus | null;
}

export interface PaymentDetails {
	id: number;

	patient_id: number;
	patient_name: string;
	patient_phone: string;

	doctor_id: number;
	doctor_name: string;

	appointment_id: number;
	appointment_time: string;
	appointment_status: AppointmentStatus;
	appointment_complaint: string | null;

	treatment_id: number | null;
	treatment_diagnosis: string | null;
	treatment_performed: string | null;
	treatment_medicines_prescribed: string | null;

	total_amount: number;
	amount_paid: number;

	payment_method: PaymentMethod | null;
	payment_status: PaymentStatus | null;

	notes: string | null;

	created_at: string;
	updated_at: string;
}

export interface CreatePaymentPayload {
	appointment_id: number;

	total_amount: number;
	amount_paid: number;

	payment_method?: PaymentMethod;

	notes?: string;
}

export interface UpdatePaymentPayload {
  total_amount?: number;
  amount_paid?: number;

  payment_method?: PaymentMethod;

  notes?: string;
}
