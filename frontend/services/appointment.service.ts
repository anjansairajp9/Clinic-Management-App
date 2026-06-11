import api from "@/lib/axios";

export const getAppointmentDashboardStats =
	async (
		appointment_date?: string
	) => {
		const response =
			await api.get(
				"/appointments/dashboard/stats",
				{
					params: {
						appointment_date,
					},
				}
			);

		return response.data;
	};

type GetAppointmentsParams =
	{
		page?: number;
		limit?: number;
		status?: string;
		doctor_id?: string;
		appointment_date?: string;
	};

export const getAppointments =
	async ({
		page = 1,
		limit = 10,
		status,
		doctor_id,
		appointment_date,
	}: GetAppointmentsParams) => {
		const response =
			await api.get(
				"/appointments",
				{
					params: {
						page,
						limit,
						status,
						doctor_id:
							doctor_id ||
							undefined,
						appointment_date,
					},
				}
			);

		return response.data;
	};

type SearchAppointmentsParams =
	{
		query: string;
		page?: number;
		limit?: number;
		status?: string;
		appointment_date?: string;
	};

export const searchAppointments =
	async ({
		query,
		page = 1,
		limit = 10,
		status,
		appointment_date,
	}: SearchAppointmentsParams) => {
		const response =
			await api.get(
				"/appointments/search",
				{
					params: {
						query,
						page,
						limit,
						status,
						appointment_date,
					},
				}
			);

		return response.data;
	};

export const searchDoctors =
	async (
		query = ""
	) => {
		const response =
			await api.get(
				"/doctors/search",
				{
					params: {
						query,
						page: 1,
						limit: 50,
					},
				}
			);

		return response.data;
	};

export const getAppointmentById =
	async (
		appointmentId: number
	) => {
		const response =
			await api.get(
				`/appointments/${appointmentId}`
			);

		return response.data;
	};
