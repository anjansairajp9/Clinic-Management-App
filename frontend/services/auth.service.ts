import api from "@/lib/axios";

type RegisterPayload = {
	name: string;
	email: string;
	phone: string;
	password: string;
	address?: string;
};

export const registerClinic = async (
	data: RegisterPayload
) => {
	const response = await api.post(
		"/register",
		data
	);

	return response.data;
};


type LoginPayload = {
	email: string;
	password: string;
};

export const loginClinic = async (
	data: LoginPayload
) => {
	const response = await api.post(
		"/login",
		data
	);

	return response.data;
};


export const refreshAccessToken =
	async () => {
		const response =
			await api.post(
				"/refresh"
			);

		return response.data;
	};


type ForgotPasswordPayload =
	{
		email: string;
	};

export const forgotPassword =
	async (
		data: ForgotPasswordPayload
	) => {
		const response =
			await api.post(
				"/forgot-password",
				data
			);

		return response.data;
	};


type ResetPasswordPayload =
	{
		token: string;
		new_password: string;
	};

export const resetPassword =
	async (
		data: ResetPasswordPayload
	) => {
		const response =
			await api.post(
				"/reset-password",
				data
			);

		return response.data;
	};


export const logoutClinic =
	async () => {
		const response =
			await api.post(
				"/logout"
			);

		return response.data;
	};
