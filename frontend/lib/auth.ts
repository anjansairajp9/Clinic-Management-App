import {refreshAccessToken} from "@/services/auth.service";

export const getAccessToken =
	() => {
		return localStorage.getItem(
			"access_token"
		);
	};

export const setAccessToken = (
	token: string
) => {
	localStorage.setItem(
		"access_token",
		token
	);
};

export const clearAuth = () => {
	localStorage.removeItem(
		"access_token"
	);
};

export const refreshToken =
	async () => {
		try {
			const response =
				await refreshAccessToken();

			setAccessToken(
				response.access_token
			);

			return response.access_token;
		} catch {
			clearAuth();
			return null;
		}
	};
	