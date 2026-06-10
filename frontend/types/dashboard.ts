export type ClinicDashboardOverview = {
	total_patients: number;
	total_doctors: number;
	total_appointments: number;
	total_treatments: number;
	total_revenue: string;
};


export type AppointmentSummaryCard = {
	id: number;

	patient_name: string;
	patient_phone: string;

	doctor_name: string;
	doctor_phone: string;

	appointment_time: string;

	appointment_type:
		| "scheduled"
		| "walk_in";

	status:
		| "completed"
		| "cancelled"
		| "no_show"
		| "scheduled";
};

export type AppointmentDashboardSummary =
	{
		summary_date: string;

		pending_queue: number;
		completed_today: number;
		walk_ins_today: number;

		next_appointment:
			| AppointmentSummaryCard
			| null;

		upcoming_appointments:
			AppointmentSummaryCard[];
	};


export type SuperAdminRecentClinic =
	{
		id: number;
		name: string;
		phone: string;
		email: string;
		address: string | null;
		created_at: string;
		updated_at: string;
	};

export type SuperAdminDashboard =
	{
		total_clinics: number;
		total_doctors: number;
		total_patients: number;
		total_appointments: number;
		total_treatments: number;

		total_revenue: string;

		analytics_date: string;
		selected_date_appointments: number;

		pending_payments: number;

		recent_clinics:
			SuperAdminRecentClinic[];
	};
