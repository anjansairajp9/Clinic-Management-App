import api from "@/lib/axios";

import type {
	CreateAppointmentPayload,
	AppointmentAvailabilityResponse,
} from "@/types/appointment";

/* -------------------------------- */
/* DASHBOARD */
/* -------------------------------- */

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

/* -------------------------------- */
/* APPOINTMENTS TABLE */
/* -------------------------------- */

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

/* -------------------------------- */
/* APPOINTMENT DETAILS */
/* -------------------------------- */

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

/* -------------------------------- */
/* DOCTOR SEARCH */
/* -------------------------------- */

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

/* -------------------------------- */
/* PATIENT SEARCH */
/* -------------------------------- */

export const searchPatients =
	async (
		query = ""
	) => {
		const response =
			await api.get(
				"/patients/search",
				{
					params: {
						query,
						page: 1,
						limit: 10,
					},
				}
			);

		return response.data;
	};

/* -------------------------------- */
/* AVAILABILITY */
/* -------------------------------- */

type AvailabilityParams =
	{
		appointment_date: string;
		doctor_id?: number;
		appointment_id?: number;
	};

export const getAppointmentAvailability =
	async ({
		appointment_date,
		doctor_id,
		appointment_id,
	}: AvailabilityParams): Promise<AppointmentAvailabilityResponse> => {
		const response =
			await api.get(
				"/appointments/availability",
				{
					params: {
						appointment_date,
						doctor_id,
						appointment_id,
					},
				}
			);

		return response.data;
	};

/* -------------------------------- */
/* CREATE APPOINTMENT */
/* -------------------------------- */

export const createAppointment =
	async (
		data: CreateAppointmentPayload
	) => {
		const response =
			await api.post(
				"/appointments",
				data
			);

		return response.data;
	};


/* -------------------------------- */
/* UPDATE APPOINTMENT */
/* -------------------------------- */

export const updateAppointment =
	async (
		appointmentId: number,
		data: Partial<CreateAppointmentPayload>
	) => {
		const response =
			await api.patch(
				`/appointments/${appointmentId}`,
				data
			);

		return response.data;
	};

/* -------------------------------- */
/* DELETE APPOINTMENT */
/* -------------------------------- */

export const deleteAppointment =
	async (
		appointmentId: number
	) => {
		const response =
			await api.delete(
				`/appointments/${appointmentId}`
			);

		return response.data;
	};

/* -------------------------------- */
/* UPDATE APPOINTMENT STATUS */
/* -------------------------------- */

export const updateAppointmentStatus =
	async (
		appointmentId: number,
		status:
			| "completed"
			| "cancelled"
			| "no_show"
	) => {
		const response =
			await api.patch(
				`/appointments/${appointmentId}/status`,
				{
					status,
				}
			);

		return response.data;
	};
