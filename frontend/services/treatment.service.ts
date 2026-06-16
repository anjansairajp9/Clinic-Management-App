import api from "@/lib/axios";

import type {
	CreateTreatmentPayload,
	UpdateTreatmentPayload,
} from "@/types/treatment";

/* -------------------------------- */
/* CREATE TREATMENT */
/* -------------------------------- */

export const createTreatment =
	async (
		data: CreateTreatmentPayload
	) => {
		const response =
			await api.post(
				"/treatments",
				data
			);

		return response.data;
	};

/* -------------------------------- */
/* SEARCH TREATMENTS */
/* -------------------------------- */

export const searchTreatments =
	async ({
		query,
		appointment_date,
		page = 1,
		limit = 10,
	}: {
		query?: string;
		appointment_date?: string;
		page?: number;
		limit?: number;
	}) => {
		const response =
			await api.get(
				"/treatments/search",
				{
					params: {
						query,
						appointment_date,
						page,
						limit,
					},
				}
			);

		return response.data;
	};

/* -------------------------------- */
/* GET TREATMENT BY ID */
/* -------------------------------- */

export const getTreatmentById =
	async (
		treatmentId: number
	) => {
		const response =
			await api.get(
				`/treatments/${treatmentId}`
			);

		return response.data;
	};

/* -------------------------------- */
/* UPDATE TREATMENT */
/* -------------------------------- */

export const updateTreatment =
	async (
		treatmentId: number,
		data: UpdateTreatmentPayload
	) => {
		const response =
			await api.patch(
				`/treatments/${treatmentId}`,
				data
			);

		return response.data;
	};

/* -------------------------------- */
/* DELETE TREATMENT */
/* -------------------------------- */

export const deleteTreatment =
	async (
		treatmentId: number
	) => {
		const response =
			await api.delete(
				`/treatments/${treatmentId}`
			);

		return response.data;
	};

/* -------------------------------- */
/* PATIENT TREATMENT HISTORY */
/* -------------------------------- */

export const getPatientTreatmentHistory =
	async (
		patientId: number,
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
				`/patients/${patientId}/treatments`,
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

/* -------------------------------- */
/* GET TREATMENT BY APPOINTMENT */
/* -------------------------------- */

export const getTreatmentByAppointmentId =
	async (
		appointmentId: number
	) => {
		const response =
			await api.get(
				`/appointments/${appointmentId}/treatments`
			);

		return response.data;
	};

/* -------------------------------- */
/* UPLOAD TREATMENT FILES */
/* -------------------------------- */

export const uploadTreatmentFiles =
	async (
		treatmentId: number,
		files: File[]
	) => {
		const formData =
			new FormData();

		files.forEach(
			(file) => {
				formData.append(
					"files",
					file
				);
			}
		);

		const response =
			await api.post(
				`/treatments/${treatmentId}/files`,
				formData,
				{
					headers:
					{
						"Content-Type":
							"multipart/form-data",
					},
				}
			);

		return response.data;
	};

/* -------------------------------- */
/* GET TREATMENT FILES */
/* -------------------------------- */

export const getTreatmentFiles =
	async (
		treatmentId: number
	) => {
		const response =
			await api.get(
				`/treatments/${treatmentId}/files`
			);

		return response.data;
	};

/* -------------------------------- */
/* DELETE TREATMENT FILE */
/* -------------------------------- */

export const deleteTreatmentFile =
	async (
		fileId: number
	) => {
		const response =
			await api.delete(
				`/treatment-files/${fileId}`
			);

		return response.data;
	};