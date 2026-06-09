"use client";

import Link from "next/link";
import {
	Eye,
	EyeOff,
} from "lucide-react";
import {
	useEffect,
	useState,
} from "react";
import {
	useRouter,
	useSearchParams,
} from "next/navigation";

import { resetPassword } from "@/services/auth.service";

export default function ResetPasswordForm() {
	const router = useRouter();

	const searchParams =
		useSearchParams();

	const token =
		searchParams.get(
			"token"
		);

	const [
		showPassword,
		setShowPassword,
	] = useState(false);

	const [
		showConfirmPassword,
		setShowConfirmPassword,
	] = useState(false);

	const [loading, setLoading] =
		useState(false);

	const [error, setError] =
		useState("");

	const [success, setSuccess] =
		useState("");

	const [hovered, setHovered] =
		useState(false);

	const [formData, setFormData] =
		useState({
			password: "",
			confirmPassword:
				"",
		});

	useEffect(() => {
		if (!token) {
			setError(
				"Invalid or expired reset link"
			);
		}
	}, [token]);

	const validatePassword =
		(password: string) => {
			const regex =
				/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

			return regex.test(
				password
			);
		};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setFormData(
			(prev) => ({
				...prev,
				[e.target.name]:
					e.target.value,
			})
		);
	};

	const handleSubmit =
		async (
			e: React.FormEvent
		) => {
			e.preventDefault();

			setError("");
			setSuccess("");

			if (
				!validatePassword(
					formData.password
				)
			) {
				setError(
					"Password must be at least 8 characters with 1 uppercase and 1 special character"
				);
				return;
			}

			if (
				formData.password !==
				formData.confirmPassword
			) {
				setError(
					"Passwords do not match"
				);
				return;
			}

			if (!token) {
				setError(
					"Invalid or expired token"
				);
				return;
			}

			try {
				setLoading(
					true
				);

				const response =
					await resetPassword(
						{
							token,
							new_password:
								formData.password,
						}
					);

				setSuccess(
					response.message
				);

				setTimeout(
					() => {
						router.push(
							"/login?reset=true"
						);
					},
					2000
				);
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
					Password reset
					successful.
					Redirecting...
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

			{/* Password */}
			<div>
				<label
					style={labelStyle}
				>
					New Password
				</label>

				<div
					style={{
						position:
							"relative",
					}}
				>
					<input
						name="password"
						type={
							showPassword
								? "text"
								: "password"
						}
						placeholder="Create new password"
						value={
							formData.password
						}
						onChange={
							handleChange
						}
						required
						style={
							inputStyle
						}
					/>

					<button
						type="button"
						onClick={() =>
							setShowPassword(
								!showPassword
							)
						}
						style={
							iconButtonStyle
						}
					>
						{showPassword ? (
							<EyeOff
								size={
									18
								}
							/>
						) : (
							<Eye
								size={
									18
								}
							/>
						)}
					</button>
				</div>
			</div>

			{/* Confirm Password */}
			<div>
				<label
					style={labelStyle}
				>
					Confirm Password
				</label>

				<div
					style={{
						position:
							"relative",
					}}
				>
					<input
						name="confirmPassword"
						type={
							showConfirmPassword
								? "text"
								: "password"
						}
						placeholder="Confirm password"
						value={
							formData.confirmPassword
						}
						onChange={
							handleChange
						}
						required
						style={
							inputStyle
						}
					/>

					<button
						type="button"
						onClick={() =>
							setShowConfirmPassword(
								!showConfirmPassword
							)
						}
						style={
							iconButtonStyle
						}
					>
						{showConfirmPassword ? (
							<EyeOff
								size={
									18
								}
							/>
						) : (
							<Eye
								size={
									18
								}
							/>
						)}
					</button>
				</div>
			</div>

			<div
				style={{
					fontSize:
						"12px",
					color:
						"#7a9ab8",
					lineHeight:
						1.5,
				}}
			>
				8+ characters •
				1 uppercase •
				1 special
				character
			</div>

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
				}}
			>
				{loading
					? "Resetting..."
					: "Reset Password"}
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
				Back to{" "}
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
	);
}

const labelStyle = {
	display: "block",
	color: "#f0f6ff",
	fontSize: "14px",
	fontWeight: 600,
	marginBottom: "10px",
};

const inputStyle = {
	width: "100%",
	height: "54px",
	borderRadius: "16px",
	border:
		"1px solid rgba(255,255,255,0.08)",
	background:
		"rgba(255,255,255,0.03)",
	padding: "0 52px 0 18px",
	color: "#f0f6ff",
	fontSize: "15px",
	outline: "none",
};

const iconButtonStyle = {
	position: "absolute" as const,
	right: "18px",
	top: "50%",
	transform:
		"translateY(-50%)",
	color: "#7a9ab8",
	display: "flex",
	alignItems: "center",
	justifyContent:
		"center",
};