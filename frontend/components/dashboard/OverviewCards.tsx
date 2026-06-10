"use client";

import {
	useEffect,
	useState,
} from "react";

import { useRouter } from "next/navigation";

import {
	Users,
	Stethoscope,
	CalendarDays,
	FilePlus2,
	IndianRupee,
} from "lucide-react";

import {
	getClinicDashboardOverview,
} from "@/services/dashboard.service";

import type {
	ClinicDashboardOverview,
} from "@/types/dashboard";

type StatCardProps = {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	href: string;
};

function StatCard({
	title,
	value,
	icon,
	href,
}: StatCardProps) {
	const router = useRouter();

	return (
		<div
			onClick={() =>
				router.push(href)
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
				background:
					"linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
				border:
					"1px solid rgba(255,255,255,0.06)",
				borderRadius:
					"20px",
				padding:
					"16px",
				backdropFilter:
					"blur(14px)",
				transition:
					"all 0.25s ease",
				display:
					"flex",
				flexDirection:
					"column",
				justifyContent:
					"space-between",
				height:
					"120px",
				cursor:
					"pointer",
				backgroundImage:
					"radial-gradient(circle at top right, rgba(56,189,248,0.05), transparent 55%)",
			}}
		>
			<div
				style={{
					width: "42px",
					height:
						"42px",
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
						marginBottom:
							"6px",
						fontWeight:
							500,
					}}
				>
					{title}
				</p>

				<h2
					style={{
						color:
							"#f0f6ff",
						fontSize:
							title ===
								"Revenue"
								? "26px"
								: "30px",
						fontWeight:
							700,
						margin: 0,
						lineHeight:
							1,
					}}
				>
					{value}
				</h2>
			</div>
		</div>
	);
}

export default function OverviewCards() {
	const [
		data,
		setData,
	] = useState<ClinicDashboardOverview | null>(
		null
	);

	const [
		loading,
		setLoading,
	] = useState(true);

	useEffect(() => {
		const fetchOverview =
			async () => {
				try {
					const response =
						await getClinicDashboardOverview();

					setData(
						response
					);
				} catch (
				error
				) {
					console.error(
						"Failed to fetch dashboard overview",
						error
					);
				} finally {
					setLoading(
						false
					);
				}
			};

		fetchOverview();
	}, []);

	if (loading) {
		return (
			<div
				style={{
					color:
						"#7a9ab8",
				}}
			>
				Loading dashboard...
			</div>
		);
	}

	if (!data) {
		return null;
	}

	const cards = [
		{
			title:
				"Patients",
			value:
				data.total_patients,
			icon: (
				<Users
					size={22}
				/>
			),
			href:
				"/dashboard/patients",
		},
		{
			title:
				"Doctors",
			value:
				data.total_doctors,
			icon: (
				<Stethoscope
					size={22}
				/>
			),
			href:
				"/dashboard/doctors",
		},
		{
			title:
				"Appointments",
			value:
				data.total_appointments,
			icon: (
				<CalendarDays
					size={22}
				/>
			),
			href:
				"/dashboard/appointments",
		},
		{
			title:
				"Treatments",
			value:
				data.total_treatments,
			icon: (
				<FilePlus2
					size={22}
				/>
			),
			href:
				"/dashboard/treatments",
		},
		{
			title:
				"Revenue",
			value: `₹${Number(
				data.total_revenue
			).toLocaleString()}`,
			icon: (
				<IndianRupee
					size={22}
				/>
			),
			href:
				"/dashboard/payments",
		},
	];

	return (
		<div
			style={{
				display:
					"flex",
				flexDirection:
					"column",
				gap: "16px",
			}}
		>
			{/* Section Header */}
			<div>
				<h2
					style={{
						color: "#f0f6ff",
						fontSize: "17px",
						fontWeight: 600,
						margin: 0,
						marginBottom: "4px",
						letterSpacing: "0.2px",
					}}
				>
					Clinic Overview
				</h2>

				<p
					style={{
						color: "#7a9ab8",
						fontSize: "12px",
						margin: 0,
						lineHeight: 1.5,
					}}
				>
					Monitor clinic performance, patient activity,
					appointments, treatments, and revenue at a
					glance.
				</p>
			</div>

			{/* Cards */}
			<div
				style={{
					display:
						"grid",
					gridTemplateColumns:
						"repeat(5, minmax(150px, 1fr))",
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
							href={
								card.href
							}
						/>
					)
				)}
			</div>
		</div>
	);
}
