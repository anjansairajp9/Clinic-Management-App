import api from "@/lib/axios";

import type {
	CreatePaymentPayload,
	UpdatePaymentPayload,
} from "@/types/payment";

export const createPayment =
	async (
		data: CreatePaymentPayload
	) => {
		const response =
			await api.post(
				"/payments",
				data
			);

		return response.data;
	};

export const searchPayments =
	async ({
		query,
		payment_status,
		appointment_date,
		page = 1,
		limit = 10,
	}: {
		query?: string;
		payment_status?: string;
		appointment_date?: string;
		page?: number;
		limit?: number;
	}) => {
		const response =
			await api.get(
				"/payments/search",
				{
					params: {
						query,
						payment_status,
						appointment_date,
						page,
						limit,
					},
				}
			);

		return response.data;
	};

export const getPaymentById =
	async (
		paymentId: number
	) => {
		const response =
			await api.get(
				`/payments/${paymentId}`
			);

		return response.data;
	};

export const getPaymentByAppointmentId =
	async (
		appointmentId: number
	) => {
		const response =
			await api.get(
				`/appointments/${appointmentId}/payments`
			);

		return response.data;
	};

export const updatePayment =
	async (
		paymentId: number,
		data: UpdatePaymentPayload
	) => {
		const response =
			await api.patch(
				`/payments/${paymentId}`,
				data
			);

		return response.data;
	};

export const deletePayment =
	async (
		paymentId: number
	) => {
		const response =
			await api.delete(
				`/payments/${paymentId}`
			);

		return response.data;
	};
