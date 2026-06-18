import api from "@/lib/axios";

import { UpdateClinicPayload } from "@/types/setting"

export const getClinicDetails = async () => {
	const response =
		await api.get(
			"/clinic/me"
		);

	return response.data;
};

export const updateClinicDetails =
	async (
		data: UpdateClinicPayload
	) => {
		const response =
			await api.patch(
				"/clinic/me",
				data
			);

		return response.data;
	};
