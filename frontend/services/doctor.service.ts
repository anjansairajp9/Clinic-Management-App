import api from "@/lib/axios";

import type {
	CreateDoctorPayload,
	UpdateDoctorPayload,
} from "@/types/doctor";

/* -------------------------------- */
/* CREATE DOCTOR */
/* -------------------------------- */

export const createDoctor =
	async (
		data: CreateDoctorPayload
	) => {
		const response =
			await api.post(
				"/doctors",
				data
			);

		return response.data;
	};

/* -------------------------------- */
/* SEARCH DOCTORS */
/* -------------------------------- */

export const searchDoctors =
	async ({
		query,
		page = 1,
		limit = 10,
	}: {
		query?: string;
		page?: number;
		limit?: number;
	}) => {
		const response =
			await api.get(
				"/doctors/search",
				{
					params: {
						query,
						page,
						limit,
					},
				}
			);

		return response.data;
	};

/* -------------------------------- */
/* GET DOCTOR BY ID */
/* -------------------------------- */

export const getDoctorById =
	async (
		doctorId: number
	) => {
		const response =
			await api.get(
				`/doctors/${doctorId}`
			);

		return response.data;
	};

/* -------------------------------- */
/* UPDATE DOCTOR */
/* -------------------------------- */

export const updateDoctor =
	async (
		doctorId: number,
		data: UpdateDoctorPayload
	) => {
		const response =
			await api.patch(
				`/doctors/${doctorId}`,
				data
			);

		return response.data;
	};

/* -------------------------------- */
/* DELETE DOCTOR */
/* -------------------------------- */

export const deleteDoctor =
	async (
		doctorId: number
	) => {
		const response =
			await api.delete(
				`/doctors/${doctorId}`
			);

		return response.data;
	};

/* -------------------------------- */
/* DOCTOR APPOINTMENTS */
/* -------------------------------- */

export const getDoctorAppointments =
	async (
		doctorId: number,
		{
			page = 1,
			limit = 10,
			appointment_date,
		}: {
			page?: number;
			limit?: number;
			appointment_date?: string;
		}
	) => {
		const response =
			await api.get(
				`/doctors/${doctorId}/appointments`,
				{
					params: {
						page,
						limit,
						appointment_date,
					},
				}
			);

		return response.data;
	};