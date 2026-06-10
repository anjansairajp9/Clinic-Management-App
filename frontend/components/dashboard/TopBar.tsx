"use client";

import {
	useDashboardDate,
} from "@/hooks/useDashboardDate";

type TopBarProps = {
	title: string;
	subtitle: string;
};

export default function TopBar({
	title,
	subtitle,
}: TopBarProps) {
	const {
		selectedDate,
		setSelectedDate,
	} = useDashboardDate();

	return (
		<header
			style={{
				height: "100px",
				padding:
					"0 36px",
				borderBottom:
					"1px solid rgba(255,255,255,0.05)",
				display:
					"flex",
				alignItems:
					"center",
				justifyContent:
					"space-between",
				background:
					"linear-gradient(180deg, rgba(6,16,30,0.88), rgba(4,13,25,0.72))",
				backdropFilter:
					"blur(18px)",
			}}
		>
			<div>
				<h1
					style={{
						color:
							"#f0f6ff",
						fontSize:
							"30px",
						fontWeight:
							700,
						margin: 0,
					}}
				>
					{title}
				</h1>

				<p
					style={{
						color:
							"#7a9ab8",
						marginTop:
							"8px",
						fontSize:
							"16px",
					}}
				>
					{
						subtitle
					}
				</p>
			</div>

			<div
				style={{
					display:
						"flex",
					alignItems:
						"center",
					gap: "18px",
				}}
			>
				<input
					type="date"
					value={
						selectedDate
					}
					onChange={(
						e
					) =>
						setSelectedDate(
							e
								.target
								.value
						)
					}
					onMouseEnter={(
						e
					) => {
						e.currentTarget.style.transform =
							"translateY(-2px)";
						e.currentTarget.style.border =
							"1px solid rgba(56,189,248,0.18)";
						e.currentTarget.style.background =
							"rgba(255,255,255,0.06)";
					}}
					onMouseLeave={(
						e
					) => {
						e.currentTarget.style.transform =
							"translateY(0)";
						e.currentTarget.style.border =
							"1px solid rgba(255,255,255,0.08)";
						e.currentTarget.style.background =
							"rgba(255,255,255,0.04)";
					}}
					style={{
						height:
							"56px",
						minWidth:
							"200px",
						padding:
							"0 18px",
						borderRadius:
							"18px",
						border:
							"1px solid rgba(255,255,255,0.08)",
						background:
							"rgba(255,255,255,0.04)",
						color:
							"#d9e7f5",
						fontSize:
							"15px",
						outline:
							"none",
						transition:
							"all 0.25s ease",
						cursor:
							"pointer",
					}}
				/>

				<div
					style={{
						width:
							"54px",
						height:
							"54px",
						borderRadius:
							"50%",
						background:
							"linear-gradient(135deg, #22d3ee, #60a5fa)",
						display:
							"flex",
						alignItems:
							"center",
						justifyContent:
							"center",
						color:
							"#031018",
						fontWeight:
							700,
						fontSize:
							"20px",
						boxShadow:
							"0 0 22px rgba(56,189,248,0.18)",
					}}
				>
					CM
				</div>
			</div>
		</header>
	);
}
