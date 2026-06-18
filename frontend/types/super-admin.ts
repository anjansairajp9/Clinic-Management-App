export interface RecentClinic {
	id: number;

	name: string;

	phone: string;

	email: string;

	address: string | null;

	created_at: string;

	updated_at: string;
}

export interface SuperAdminDashboard {
	total_clinics: number;

	total_doctors: number;

	total_patients: number;

	total_appointments: number;

	total_treatments: number;

	total_revenue: number;

	analytics_date: string;

	selected_date_appointments: number;

	pending_payments: number;

	recent_clinics: RecentClinic[];
}
