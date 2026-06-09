"use client";

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
	return (
		<main
			style={{
				minHeight: "100vh",
				display: "grid",
				gridTemplateColumns: "1.15fr 0.85fr",

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
					padding: "52px 80px",
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
						top: "48px",
						left: "48px",
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
							boxShadow:
								"0 0 24px rgba(56,189,248,0.22)",
						}}
					>
						CM
					</div>

					<h2
						style={{
							fontSize: "26px",
							fontWeight: 700,
							color: "#f0f6ff",
						}}
					>
						Clinic Management
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
							background:
								"rgba(56,189,248,0.07)",
							border:
								"1px solid rgba(56,189,248,0.14)",
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
							fontSize: "84px",
							lineHeight: 0.95,
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
								fontFamily:
									"var(--font-display)",
								fontStyle: "italic",
								background:
									"linear-gradient(90deg,#38bdf8,#2dd4bf)",
								WebkitBackgroundClip:
									"text",
								WebkitTextFillColor:
									"transparent",
							}}
						>
							effortlessly
						</span>
					</h1>

					<p
						style={{
							fontSize: "20px",
							lineHeight: 1.8,
							color: "#7a9ab8",
							maxWidth: "650px",
						}}
					>
						Patients, doctors,
						appointments, treatments,
						payments — everything in one
						modern platform built for
						healthcare teams.
					</p>
				</div>
			</section>

			{/* DIVIDER */}
			<div
				style={{
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

					boxShadow:
						"inset 18px 0 40px rgba(0,0,0,0.16)",

					backdropFilter: "blur(4px)",
					WebkitBackdropFilter: "blur(4px)",

					padding: "60px",
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
							fontSize: "56px",
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
							fontSize: "16px",
							lineHeight: 1.8,
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
