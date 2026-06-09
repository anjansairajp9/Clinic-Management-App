"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
	useEffect,
	useState,
} from "react";
import {
	useRouter,
	useSearchParams,
} from "next/navigation";

import { loginClinic } from "@/services/auth.service";

export default function LoginForm() {
	const router = useRouter();

	const [showPassword, setShowPassword] =
		useState(false);

	const [hovered, setHovered] =
		useState(false);

	const [loading, setLoading] =
		useState(false);

	const [error, setError] =
		useState("");

	const [
		loginSuccess,
		setLoginSuccess,
	] = useState(false);

	const [formData, setFormData] =
		useState({
			email: "",
			password: "",
		});

	const searchParams =
		useSearchParams();

	const registered =
		searchParams.get(
			"registered"
		);

	const [
		showSuccess,
		setShowSuccess,
	] = useState(false);

	useEffect(() => {
		if (
			registered === "true"
		) {
			setShowSuccess(
				true
			);

			const timer =
				setTimeout(
					() => {
						setShowSuccess(
							false
						);
					},
					3000
				);

			return () =>
				clearTimeout(
					timer
				);
		}
	}, [registered]);

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

			try {
				setLoading(
					true
				);

				const response =
					await loginClinic(
						formData
					);

				localStorage.setItem(
					"access_token",
					response.access_token
				);

				setLoginSuccess(
					true
				);

				setTimeout(
					() => {
						window.location.href =
              "/dashboard";
          },
          1800
        );
			} catch (
				err: any
			) {
				setError(
					err?.response
						?.data
						?.detail ||
						"Invalid credentials"
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
			{/* Register Success */}
			{showSuccess && (
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
						marginBottom:
							"6px",
					}}
				>
					Account created
					successfully.
					Please log in.
				</div>
			)}

			{/* Login Success */}
			{loginSuccess && (
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
					Login successful.
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

			{/* Password */}
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
					Password
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
						placeholder="Enter your password"
						value={
							formData.password
						}
						onChange={
							handleChange
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
								"0 52px 0 18px",
							color:
								"#f0f6ff",
							fontSize:
								"15px",
							outline:
								"none",
						}}
					/>

					<button
						type="button"
						onClick={() =>
							setShowPassword(
								!showPassword
							)
						}
						style={{
							position:
								"absolute",
							right:
								"18px",
							top:
								"50%",
							transform:
								"translateY(-50%)",
							color:
								"#7a9ab8",
							display:
								"flex",
							alignItems:
								"center",
							justifyContent:
								"center",
						}}
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

			<div
				style={{
					display:
						"flex",
					justifyContent:
						"flex-end",
					marginTop:
						"-8px",
				}}
			>
				<Link
					href="/forgot-password"
					style={{
						color:
							"#38bdf8",
						fontSize:
							"14px",
					}}
				>
					Forgot
					password?
				</Link>
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
					? "Logging in..."
					: "Log in"}
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
						"8px",
				}}
			>
				Don&apos;t have
				an account?{" "}
				<Link
					href="/register"
					style={{
						color:
							"#38bdf8",
						fontWeight:
							600,
					}}
				>
					Register
				</Link>
			</p>
		</form>
	);
}