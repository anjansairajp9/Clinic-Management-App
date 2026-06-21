"use client";

import { useMobile } from "@/hooks/useMobile"; // Import the hook

type AuthLayoutProps = {
	title: string;
	subtitle: string;
	children: React.ReactNode;
};

export default function AuthLayout({
	title,
	subtitle,
	children,
}: AuthLayoutProps) {
	const isMobile = useMobile(); // Initialize the hook

	return (
		<main
			style={{
				minHeight: "100vh",
				display: isMobile ? "flex" : "grid", // Stack vertically on mobile
				flexDirection: isMobile ? "column" : undefined,
				gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr", // Single column on mobile

				background:
					"linear-gradient(to right, #050d17 0%, #07111d 100%)",

				position: "relative",
				overflow: "hidden",
				isolation: "isolate",
			}}
		>
			{/* LEFT SIDE */}
			<section
				style={{
					position: "relative",
					padding: isMobile ? "100px 24px 40px" : "52px 80px", // Adjust padding to clear logo on mobile
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					overflow: "hidden",
				}}
			>
				{/* subtle glow */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						background: `
              radial-gradient(
                circle at 75% 50%,
                rgba(45,212,191,0.04),
                transparent 30%
              ),
              radial-gradient(
                circle at 30% 20%,
                rgba(56,189,248,0.05),
                transparent 35%
              )
            `,
						pointerEvents: "none",
					}}
				/>

				{/* Logo */}
				<div
					style={{
						position: "absolute",
						top: isMobile ? "24px" : "48px", // Move logo up on mobile
						left: isMobile ? "24px" : "48px",
						display: "flex",
						alignItems: "center",
						gap: "14px",
					}}
				>
					<div
						style={{
							width: "56px",
							height: "56px",
							borderRadius: "16px",
							background:
								"linear-gradient(135deg, #38bdf8 0%, #2dd4bf 100%)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "20px",
							fontWeight: 700,
							color: "#031018",
							boxShadow: "0 0 24px rgba(56,189,248,0.22)",
						}}
					>
						CS
					</div>

					<h2
						style={{
							fontSize: isMobile ? "20px" : "28px", // Smaller logo text
							fontWeight: 700,
							color: "#f0f6ff",
						}}
					>
						ClinSyst
					</h2>
				</div>

				{/* Hero Content */}
				<div
					style={{
						maxWidth: "620px",
					}}
				>
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
							padding: "10px 18px",
							borderRadius: "999px",
							background: "rgba(56,189,248,0.07)",
							border: "1px solid rgba(56,189,248,0.14)",
							marginBottom: "28px",
						}}
					>
						<span
							style={{
								width: "8px",
								height: "8px",
								borderRadius: "50%",
								background: "#2dd4bf",
							}}
						/>

						<span
							style={{
								color: "#38bdf8",
								fontSize: "14px",
								fontWeight: 600,
								letterSpacing: "0.08em",
							}}
						>
							MODERN CLINIC OPERATIONS
						</span>
					</div>

					<h1
						style={{
							fontSize: isMobile ? "46px" : "84px", // Dramatically shrink massive heading
							lineHeight: isMobile ? 1.05 : 0.95,
							fontWeight: 700,
							color: "#f0f6ff",
							marginBottom: "26px",
						}}
					>
						Manage your
						<br />
						clinic{" "}
						<span
							style={{
								fontFamily: "var(--font-display)",
								fontStyle: "italic",
								background:
									"linear-gradient(90deg,#38bdf8,#2dd4bf)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
							}}
						>
							effortlessly
						</span>
					</h1>

					<p
						style={{
							fontSize: isMobile ? "16px" : "20px", // Shrink subtitle
							lineHeight: 1.6,
							color: "#7a9ab8",
							maxWidth: "650px",
						}}
					>
						Patients, doctors, appointments, treatments,
						payments — everything in one modern platform built for
						healthcare teams.
					</p>
				</div>
			</section>

			{/* DIVIDER - Hide entirely on mobile so it doesn't cross the stacked layout */}
			<div
				style={{
					display: isMobile ? "none" : "block", // Hidden on mobile
					position: "absolute",
					left: "67%",
					top: 0,
					width: "70px",
					height: "100%",
					pointerEvents: "none",
					background: `
            linear-gradient(
                to right,
                transparent,
                rgba(255,255,255,0.025),
                rgba(56,189,248,0.035),
                rgba(255,255,255,0.025),
                transparent
            )
            `,
					filter: "blur(8px)",
					zIndex: 2,
				}}
			/>

			{/* RIGHT SIDE */}
			<section
				style={{
					position: "relative",
					zIndex: 2,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",

					background:
						"linear-gradient(to left, rgba(4,10,18,1), rgba(7,14,24,0.98))",

					boxShadow: isMobile ? "none" : "inset 18px 0 40px rgba(0,0,0,0.16)", // Remove inner shadow on mobile

					backdropFilter: "blur(4px)",
					WebkitBackdropFilter: "blur(4px)",

					padding: isMobile ? "40px 24px 60px" : "60px", // Standardize padding for small screens
					borderTop: isMobile ? "1px solid rgba(255,255,255,0.05)" : "none", // Add subtle visual separator
				}}
			>
				<div
					style={{
						width: "100%",
						maxWidth: "420px",
					}}
				>
					<h1
						style={{
							fontSize: isMobile ? "36px" : "56px", // Shrink form title
							fontWeight: 700,
							color: "#f0f6ff",
							marginBottom: "16px",
							lineHeight: 1.15,
							letterSpacing: "-0.02em",
						}}
					>
						{title}
					</h1>

					<p
						style={{
							color: "#7a9ab8",
							fontSize: isMobile ? "15px" : "16px",
							lineHeight: 1.6,
							marginBottom: "38px",
						}}
					>
						{subtitle}
					</p>

					{children}
				</div>
			</section>
		</main>
	);
}
