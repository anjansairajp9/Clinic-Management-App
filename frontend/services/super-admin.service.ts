import api from "@/lib/axios";

export const getSuperAdminDashboard =
	async (
		appointmentDate?: string
	) => {
		const response =
			await api.get(
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
