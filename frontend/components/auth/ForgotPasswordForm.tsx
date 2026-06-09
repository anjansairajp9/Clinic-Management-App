"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/services/auth.service";

export default function ForgotPasswordForm() {
	const [email, setEmail] =
		useState("");

	const [loading, setLoading] =
		useState(false);

	const [error, setError] =
		useState("");

	const [success, setSuccess] =
		useState("");

	const [hovered, setHovered] =
		useState(false);

	const handleSubmit =
		async (
			e: React.FormEvent
		) => {
			e.preventDefault();

			setError("");
			setSuccess("");

			try {
				setLoading(
					true
				);

				const response =
					await forgotPassword(
						{
							email,
						}
					);

				setSuccess(
					response.message
				);

				setEmail("");

				// Hide success message after 3 sec
				setTimeout(() => {
					setSuccess("");
				}, 3000);
			} catch (
				err: any
			) {
				setError(
					err?.response
						?.data
						?.detail ||
						"Something went wrong"
				);
			} finally {
				setLoading(
					false
				);
			}
		};

	return (
		<form
			onSubmit={
				handleSubmit
			}
			style={{
				display:
					"flex",
				flexDirection:
					"column",
				gap: "20px",
			}}
		>
			{/* Success */}
			{success && (
				<div
					style={{
						padding:
							"12px 14px",
						borderRadius:
							"12px",
						background:
							"rgba(34,197,94,0.12)",
						border:
							"1px solid rgba(34,197,94,0.22)",
						color:
							"#4ade80",
						fontSize:
							"14px",
					}}
				>
					{
						success
					}
				</div>
			)}

			{/* Error */}
			{error && (
				<div
					style={{
						padding:
							"12px 14px",
						borderRadius:
							"12px",
						background:
							"rgba(239,68,68,0.12)",
						border:
							"1px solid rgba(239,68,68,0.20)",
						color:
							"#f87171",
						fontSize:
							"14px",
					}}
				>
					{error}
				</div>
			)}

			{/* Email */}
			<div>
				<label
					style={{
						display:
							"block",
						color:
							"#f0f6ff",
						fontSize:
							"14px",
						fontWeight:
							600,
						marginBottom:
							"10px",
					}}
				>
					Email
				</label>

				<input
					type="email"
					placeholder="Enter your email"
					value={
						email
					}
					onChange={(
						e
					) =>
						setEmail(
							e
								.target
								.value
						)
					}
					required
					style={{
						width:
							"100%",
						height:
							"54px",
						borderRadius:
							"16px",
						border:
							"1px solid rgba(255,255,255,0.08)",
						background:
							"rgba(255,255,255,0.03)",
						padding:
							"0 18px",
						color:
							"#f0f6ff",
						fontSize:
							"15px",
						outline:
							"none",
					}}
				/>
			</div>

			{/* Submit */}
			<button
				type="submit"
				disabled={
					loading
				}
				onMouseEnter={() =>
					setHovered(
						true
					)
				}
				onMouseLeave={() =>
					setHovered(
						false
					)
				}
				style={{
					width:
						"100%",
					height:
						"56px",
					borderRadius:
						"16px",
					background:
						hovered
							? "#67cdfa"
							: "#38bdf8",
					color:
						"#031018",
					fontSize:
						"16px",
					fontWeight:
						700,
					marginTop:
						"8px",
					transition:
						"all 0.2s ease",
					boxShadow:
						hovered
							? "0 0 24px rgba(56,189,248,0.35)"
							: "0 0 12px rgba(56,189,248,0.18)",
					cursor:
						loading
							? "not-allowed"
							: "pointer",
					opacity:
						loading
							? 0.7
							: 1,
				}}
			>
				{loading
					? "Sending..."
					: "Send Reset Link"}
			</button>

			<p
				style={{
					textAlign:
						"center",
					color:
						"#7a9ab8",
					fontSize:
						"14px",
				}}
			>
				Remember your
				password?{" "}
				<Link
					href="/login"
					style={{
						color:
							"#38bdf8",
						fontWeight:
							600,
					}}
				>
					Log in
				</Link>
			</p>
		</form>
	);
}