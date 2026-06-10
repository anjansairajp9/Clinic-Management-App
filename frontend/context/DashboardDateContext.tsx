"use client";

import {
	createContext,
	useState,
} from "react";

type DashboardDateContextType =
	{
		selectedDate: string;
		setSelectedDate:
			React.Dispatch<
				React.SetStateAction<string>
			>;
	};

export const DashboardDateContext =
	createContext<
		DashboardDateContextType | undefined
	>(undefined);

type Props = {
	children: React.ReactNode;
};

export default function DashboardDateProvider({
	children,
}: Props) {
	// Get current date in IST
	const today =
		new Intl.DateTimeFormat(
			"en-CA",
			{
				timeZone:
					"Asia/Kolkata",
			}
		).format(
			new Date()
		);

	const [
		selectedDate,
		setSelectedDate,
	] = useState(today);

	return (
		<DashboardDateContext.Provider
			value={{
				selectedDate,
				setSelectedDate,
			}}
		>
			{children}
		</DashboardDateContext.Provider>
	);
}
