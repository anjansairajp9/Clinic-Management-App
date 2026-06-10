import api from "@/lib/axios";

import type {
	ClinicDashboardOverview,
	AppointmentDashboardSummary,
	SuperAdminDashboard,
} from "@/types/dashboard";

// ------------------------------------
// NORMAL CLINIC DASHBOARD
// ------------------------------------

export const getClinicDashboardOverview =
	async () => {
		const response =
			await api.get<ClinicDashboardOverview>(
				"/overview"
			);

		return response.data;
	};

export const getAppointmentDashboardSummary =
	async () => {
		const response =
			await api.get<AppointmentDashboardSummary>(
				"/appointments/dashboard/summary"
			);

		return response.data;
	};

// ------------------------------------
// SUPER ADMIN DASHBOARD
// ------------------------------------

export const getSuperAdminDashboard =
	async (
		appointmentDate?: string
	) => {
		const response =
			await api.get<SuperAdminDashboard>(
				"/super-admin/dashboard",
				{
					params: {
						appointment_date:
							appointmentDate,
					},
				}
			);

		return response.data;
	};
