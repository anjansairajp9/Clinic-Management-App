"use client";

import {
	useEffect,
	useState,
} from "react";

import {
	Clock3,
	CheckCircle2,
	Users,
} from "lucide-react";

import {
	getAppointmentDashboardSummary,
} from "@/services/dashboard.service";

import type {
	AppointmentDashboardSummary,
} from "@/types/dashboard";

import NextAppointmentCard from "./NextAppointmentCard";
import UpcomingAppointments from "./UpcomingAppointments";

export default function AppointmentSummary() {
	const [data, setData] =
		useState<AppointmentDashboardSummary | null>(
			null
		);

	const [loading, setLoading] =
		useState(true);

	useEffect(() => {
		const fetchSummary =
			async () => {
				try {
					const response =
						await getAppointmentDashboardSummary();

					setData(
						response
					);
				} catch (
					error
				) {
					console.error(
						"Failed to fetch appointment summary",
						error
					);
				} finally {
					setLoading(
						false
					);
				}
			};

		fetchSummary();
	}, []);

	if (loading) {
		return (
			<div
				style={{
					color:
						"#7a9ab8",
				}}
			>
				Loading appointment summary...
			</div>
		);
	}

	if (!data) {
		return null;
	}

	const quickStats = [
		{
			title:
				"Pending Queue",
			value:
				data.pending_queue,
			icon: (
				<Clock3
					size={16}
				/>
			),
		},
		{
			title:
				"Completed Today",
			value:
				data.completed_today,
			icon: (
				<CheckCircle2
					size={16}
				/>
			),
		},
		{
			title:
				"Walk-ins Today",
			value:
				data.walk_ins_today,
			icon: (
				<Users
					size={16}
				/>
			),
		},
	];

	const cardStyle = {
		background:
			"linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
		border:
			"1px solid rgba(255,255,255,0.06)",
		borderRadius:
			"20px",
		backdropFilter:
			"blur(14px)",
		transition:
			"all 0.25s ease",
		backgroundImage:
			"radial-gradient(circle at top right, rgba(56,189,248,0.06), transparent 55%)",
	};

	return (
		<div
			style={{
				display:
					"flex",
				flexDirection:
					"column",
				gap: "14px",
			}}
		>
			{/* Header */}
			<div>
				<h2
					style={{
						color:
							"#f0f6ff",
						fontSize:
							"16px",
						fontWeight:
							600,
						margin: 0,
						marginBottom:
							"4px",
					}}
				>
					Today's Appointment Summary
				</h2>

				<p
					style={{
						color:
							"#7a9ab8",
						fontSize:
							"12px",
						margin: 0,
					}}
				>
					Track patient flow,
					pending queue,
					and upcoming
					consultations.
				</p>
			</div>

			{/* Layout */}
			<div
				style={{
					display:
						"grid",
					gridTemplateColumns:
						"1.6fr 1.2fr",
					gap: "18px",
					alignItems:
						"start",
				}}
			>
				{/* Left Section */}
				<div
					style={{
						display:
							"flex",
						flexDirection:
							"column",
						gap: "16px",
					}}
				>
					{/* Top Cards */}
					<div
						style={{
							display:
								"grid",
							gridTemplateColumns:
								"repeat(3, 1fr)",
							gap: "14px",
						}}
					>
						{quickStats.map(
							(
								stat
							) => (
								<div
									key={
										stat.title
									}
									onMouseEnter={(
										e
									) => {
										e.currentTarget.style.transform =
											"translateY(-4px)";
										e.currentTarget.style.border =
											"1px solid rgba(56,189,248,0.18)";
										e.currentTarget.style.boxShadow =
											"0 0 24px rgba(56,189,248,0.08)";
									}}
									onMouseLeave={(
										e
									) => {
										e.currentTarget.style.transform =
											"translateY(0)";
										e.currentTarget.style.border =
											"1px solid rgba(255,255,255,0.06)";
										e.currentTarget.style.boxShadow =
											"none";
									}}
									style={{
										...cardStyle,
										padding:
											"16px",
										height:
											"118px",
										display:
											"flex",
										flexDirection:
											"column",
										justifyContent:
											"space-between",
										cursor:
											"pointer",
									}}
								>
									<div
										style={{
											width:
												"36px",
											height:
												"36px",
											borderRadius:
												"12px",
											background:
												"rgba(56,189,248,0.10)",
											display:
												"flex",
											alignItems:
												"center",
											justifyContent:
												"center",
											color:
												"#38bdf8",
										}}
									>
										{
											stat.icon
										}
									</div>

									<div>
										<p
											style={{
												color:
													"#7a9ab8",
												fontSize:
													"12px",
												margin:
													0,
												marginBottom:
													"6px",
											}}
										>
											{
												stat.title
											}
										</p>

										<h3
											style={{
												color:
													"#f0f6ff",
												fontSize:
													"22px",
												margin:
													0,
											}}
										>
											{
												stat.value
											}
										</h3>
									</div>
								</div>
							)
						)}
					</div>

					{/* Next Appointment */}
					<NextAppointmentCard
						appointment={
							data.next_appointment
						}
					/>
				</div>

				{/* Right Section */}
				<UpcomingAppointments
					appointments={
						data.upcoming_appointments
					}
				/>
			</div>
		</div>
	);
}
