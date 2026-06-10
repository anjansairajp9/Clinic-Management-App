"use client";

import { useContext } from "react";

import {
	DashboardDateContext,
} from "@/context/DashboardDateContext";

export function useDashboardDate() {
	const context =
		useContext(
			DashboardDateContext
		);

	if (!context) {
		throw new Error(
			"useDashboardDate must be used inside DashboardDateProvider"
		);
	}

	return context;
}
