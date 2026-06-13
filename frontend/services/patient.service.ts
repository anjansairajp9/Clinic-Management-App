import api from "@/lib/axios";

import type {
	CreatePatientPayload,
	UpdatePatientPayload,
	MedicalHistoryPayload,
} from "@/types/patient";

/* -------------------------------- */
/* CREATE PATIENT */
/* -------------------------------- */

export const createPatient =
	async (
		data: CreatePatientPayload
	) => {
		const response =
			await api.post(
				"/patients",
				data
			);

		return response.data;
	};

/* -------------------------------- */
/* SEARCH PATIENTS */
/* -------------------------------- */

export const searchPatients =
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
				"/patients/search",
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
/* GET PATIENT BY ID */
/* -------------------------------- */

export const getPatientById =
	async (
		patientId: number
	) => {
		const response =
			await api.get(
				`/patients/${patientId}`
			);

		return response.data;
	};

/* -------------------------------- */
/* UPDATE PATIENT */
/* -------------------------------- */

export const updatePatient =
	async (
		patientId: number,
		data: UpdatePatientPayload
	) => {
		const response =
			await api.patch(
				`/patients/${patientId}`,
				data
			);

		return response.data;
	};

/* -------------------------------- */
/* DELETE PATIENT */
/* -------------------------------- */

export const deletePatient =
	async (
		patientId: number
	) => {
		const response =
			await api.delete(
				`/patients/${patientId}`
			);

		return response.data;
	};

/* -------------------------------- */
/* UPDATE MEDICAL HISTORY */
/* -------------------------------- */

export const updateMedicalHistory =
	async (
		patientId: number,
		data: MedicalHistoryPayload
	) => {
		const response =
			await api.patch(
				`/patients/${patientId}/medical-history`,
				data
			);

		return response.data;
	};

/* -------------------------------- */
/* PATIENT APPOINTMENT HISTORY */
/* -------------------------------- */

export const getPatientAppointmentHistory =
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
				`/patients/${patientId}/appointments`,
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