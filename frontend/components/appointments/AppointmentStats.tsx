"use client";

import {
	useEffect,
	useState,
} from "react";

import {
	CalendarDays,
	CheckCircle2,
	XCircle,
	IndianRupee,
	Clock3,
} from "lucide-react";

import {
	getAppointmentDashboardStats,
} from "@/services/appointment.service";

import {
	useDashboardDate,
} from "@/hooks/useDashboardDate";

import type {
	AppointmentStats as AppointmentStatsType,
} from "@/types/appointment";

type StatCardProps = {
	title: string;
	value: string | number;
	icon: React.ReactNode;
};

function StatCard({
	title,
	value,
	icon,
}: StatCardProps) {
	return (
		<div
			style={{
				background:
					"linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
				border:
					"1px solid rgba(255,255,255,0.06)",
				borderRadius:
					"20px",
				padding:
					"15px",
				backdropFilter:
					"blur(14px)",
				height:
					"120px",
				display:
					"flex",
				flexDirection:
					"column",
				justifyContent:
					"space-between",
				transition:
					"all 0.25s ease",
				cursor:
					"default",
				backgroundImage:
					"radial-gradient(circle at top right, rgba(56,189,248,0.06), transparent 55%)",
			}}
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
		>
			<div
				style={{
					width: "44px",
					height:
						"44px",
					borderRadius:
						"14px",
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
				{icon}
			</div>

			<div>
				<p
					style={{
						color:
							"#7a9ab8",
						fontSize:
							"13px",
						margin:
							"0 0 8px 0",
					}}
				>
					{title}
				</p>

				<h2
					style={{
						color:
							"#f0f6ff",
						fontSize:
							"28px",
						margin: 0,
						fontWeight:
							700,
					}}
				>
					{value}
				</h2>
			</div>
		</div>
	);
}

export default function AppointmentStats() {
	const [
		stats,
		setStats,
	] = useState<AppointmentStatsType | null>(
		null
	);

	const [
		loading,
		setLoading,
	] = useState(true);

	const {
		selectedDate,
	} =
		useDashboardDate();

	useEffect(() => {
		const fetchStats =
			async () => {
				try {
					setLoading(
						true
					);

					const response =
						await getAppointmentDashboardStats(
							selectedDate
						);

					setStats(
						response
					);
				} catch (
					error
				) {
					console.error(
						"Failed to fetch appointment stats",
						error
					);
				} finally {
					setLoading(
						false
					);
				}
			};

		fetchStats();
	}, [selectedDate]);

	if (loading) {
		return (
			<p
				style={{
					color:
						"#7a9ab8",
				}}
			>
				Loading stats...
			</p>
		);
	}

	if (!stats) {
		return null;
	}

	const cards = [
		{
			title:
				"Total Appointments",
			value:
				stats.total_appointments,
			icon: (
				<CalendarDays
					size={22}
				/>
			),
		},
		{
			title:
				"Scheduled",
			value:
				stats.scheduled_appointments,
			icon: (
				<Clock3
					size={22}
				/>
			),
		},
		{
			title:
				"Completed",
			value:
				stats.completed_appointments,
			icon: (
				<CheckCircle2
					size={22}
				/>
			),
		},
		{
			title:
				"Cancelled",
			value:
				stats.cancelled_appointments,
			icon: (
				<XCircle
					size={22}
				/>
			),
		},
		{
			title:
				"Revenue",
			value: `₹${Number(
				stats.total_revenue
			).toLocaleString()}`,
			icon: (
				<IndianRupee
					size={22}
				/>
			),
		},
	];

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
					}}
				>
					Appointment Overview
				</h2>

				<p
					style={{
						color:
							"#7a9ab8",
						fontSize:
							"12px",
						marginTop:
							"4px",
					}}
				>
					Monitor appointment activity,
					completion status,
					and clinic scheduling.
				</p>
			</div>

			<div
				style={{
					display:
						"grid",
					gridTemplateColumns:
						"repeat(5, minmax(160px, 1fr))",
					gap: "14px",
				}}
			>
				{cards.map(
					(card) => (
						<StatCard
							key={
								card.title
							}
							title={
								card.title
							}
							value={
								card.value
							}
							icon={
								card.icon
							}
						/>
					)
				)}
			</div>
		</div>
	);
}