"use client";

import {
	useState,
} from "react";

import AppointmentStats from "@/components/appointments/AppointmentStats";
import AppointmentTable from "@/components/appointments/AppointmentTable";
import AppointmentFilters from "@/components/appointments/AppointmentFilters";

export default function AppointmentsPage() {
	const [
		searchQuery,
		setSearchQuery,
	] = useState("");

	const [status, setStatus] =
		useState(
			"scheduled"
		);

	const [
		doctorId,
		setDoctorId,
	] = useState("");

	return (
		<div
			style={{
				display:
					"flex",
				flexDirection:
					"column",
				gap: "24px",
				marginTop:
					"-14px",
			}}
		>
			<AppointmentStats />

			<AppointmentFilters
				searchQuery={
					searchQuery
				}
				setSearchQuery={
					setSearchQuery
				}
				status={
					status
				}
				setStatus={
					setStatus
				}
				doctorId={
					doctorId
				}
				setDoctorId={
					setDoctorId
				}
			/>

			<AppointmentTable
				searchQuery={
					searchQuery
				}
				status={
					status
				}
				doctorId={
					doctorId
				}
			/>
		</div>
	);
}