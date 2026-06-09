"use client";

import Link from "next/link";
import PasswordInput from "./PasswordInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerClinic } from "@/services/auth.service";

export default function RegisterForm() {
	const router = useRouter();

	const [formData, setFormData] =
		useState({
			name: "",
			email: "",
			phone: "",
			password: "",
			address: "",
		});

	const [error, setError] =
		useState("");

	const [loading, setLoading] =
		useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement
		>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]:
				e.target.value,
		}));
	};

	const validateForm = () => {
		const passwordRegex =
			/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

		if (
			!passwordRegex.test(
				formData.password
			)
		) {
			setError(
				"Password must contain minimum 8 characters, one uppercase letter, and one special character."
			);

			return false;
		}

		return true;
	};

	const handleSubmit = async (
		e: React.FormEvent
	) => {
		e.preventDefault();

		setError("");

		if (!validateForm())
			return;

		try {
			setLoading(true);

			await registerClinic({
				name:
					formData.name,
				email:
					formData.email,
				phone:
					formData.phone,
				password:
					formData.password,
				address:
					formData.address ||
					undefined,
			});

			router.push(
				"/login?registered=true"
			);
		} catch (err: any) {
			setError(
				err?.response?.data
					?.detail ||
					"Something went wrong"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				width: "100%",
				maxWidth: "420px",
			}}
		>
			<form
				onSubmit={
					handleSubmit
				}
				style={{
					display:
						"flex",
					flexDirection:
						"column",
					gap: "9px",
				}}
			>
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
							marginBottom:
								"8px",
						}}
					>
						{error}
					</div>
				)}

				{/* Clinic Name */}
				<div>
					<label
						style={
							labelStyle
						}
					>
						Clinic Name
					</label>

					<input
						name="name"
						type="text"
						placeholder="Enter clinic name"
						value={
							formData.name
						}
						onChange={
							handleChange
						}
						required
						style={
							inputStyle
						}
					/>
				</div>

				{/* Email */}
				<div>
					<label
						style={
							labelStyle
						}
					>
						Email
					</label>

					<input
						name="email"
						type="email"
						placeholder="Enter your email"
						value={
							formData.email
						}
						onChange={
							handleChange
						}
						required
						style={
							inputStyle
						}
					/>
				</div>

				{/* Phone */}
				<div>
					<label
						style={
							labelStyle
						}
					>
						Phone Number
					</label>

					<input
						name="phone"
						type="tel"
						placeholder="Enter phone number"
						value={
							formData.phone
						}
						onChange={
							handleChange
						}
						required
						style={
							inputStyle
						}
					/>
				</div>

				{/* Password */}
				<div>
					<label
						style={
							labelStyle
						}
					>
						Password
					</label>

					<PasswordInput
						name="password"
						placeholder="Create password"
						value={
							formData.password
						}
						onChange={
							handleChange
						}
					/>

					<div
						style={{
							marginTop:
								"5px",
							fontSize:
								"11px",
							color:
								"#7a9ab8",
							lineHeight:
								1.45,
						}}
					>
						8+ characters •
						1 uppercase •
						1 special
						character
					</div>
				</div>

				{/* Address */}
				<div>
					<label
						style={
							labelStyle
						}
					>
						Address
						(optional)
					</label>

					<textarea
						name="address"
						placeholder="Enter clinic address"
						value={
							formData.address
						}
						onChange={
							handleChange
						}
						style={{
							...inputStyle,
							height:
								"44px",
							resize:
								"none",
							paddingTop:
								"10px",
							overflowY:
								"hidden",
						}}
					/>
				</div>

				{/* Button */}
				<button
					type="submit"
					disabled={
						loading
					}
					onMouseEnter={(
						e
					) => {
						e.currentTarget.style.background =
							"#67cdfa";

						e.currentTarget.style.boxShadow =
							"0 0 24px rgba(56,189,248,0.35)";
					}}
					onMouseLeave={(
						e
					) => {
						e.currentTarget.style.background =
							"#38bdf8";

						e.currentTarget.style.boxShadow =
							"0 0 12px rgba(56,189,248,0.18)";
					}}
					style={{
						width:
							"100%",
						height:
							"56px",
						borderRadius:
							"16px",
						background:
							"#38bdf8",
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
							"0 0 12px rgba(56,189,248,0.18)",
						cursor:
							loading
								? "not-allowed"
								: "pointer",
						border:
							"none",
						opacity:
							loading
								? 0.7
								: 1,
					}}
				>
					{loading
						? "Creating..."
						: "Create Account"}
				</button>

				<p
					style={{
						textAlign:
							"center",
						color:
							"#7a9ab8",
						fontSize:
							"14px",
						marginTop:
							"2px",
					}}
				>
					Already have
					an account?{" "}
					<Link
						href="/login"
						style={{
							color:
								"#38bdf8",
							fontWeight:
								600,
						}}
					>
						Login
					</Link>
				</p>
			</form>
		</div>
	);
}

const labelStyle = {
	display: "block",
	marginBottom: "4px",
	color: "#f0f6ff",
	fontWeight: 600,
	fontSize: "13px",
};

const inputStyle = {
	width: "100%",
	height: "44px",
	borderRadius: "16px",
	border:
		"1px solid rgba(255,255,255,0.08)",
	background:
		"rgba(255,255,255,0.03)",
	color: "#f0f6ff",
	padding: "0 16px",
	outline: "none",
	fontSize: "14px",
};