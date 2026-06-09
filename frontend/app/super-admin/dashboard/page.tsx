"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { logoutClinic } from "@/services/auth.service";

export default function SuperAdminDashboardPage() {
	const router = useRouter();

	const [loading, setLoading] = useState(false);

	const handleLogout =
		async () => {
			try {
				setLoading(
					true
				);

				await logoutClinic();

				localStorage.removeItem(
					"access_token"
				);

				router.replace(
					"/login"
				);
			} catch (
			error
			) {
				console.error(
					"Logout failed:",
					error
				);

				localStorage.removeItem(
					"access_token"
				);

				router.replace(
					"/login"
				);
			} finally {
				setLoading(
					false
				);
			}
		};

	return (
		<div
			style={{
				minHeight:
					"100vh",
				background:
					"#060d16",
				color: "white",
				display:
					"flex",
				flexDirection:
					"column",
				justifyContent:
					"center",
				alignItems:
					"center",
				gap: "24px",
			}}
		>
			<h1
				style={{
					fontSize:
						"32px",
					fontWeight:
						700,
				}}
			>
				Super Admin Dashboard
			</h1>

			<button
				onClick={
					handleLogout
				}
				disabled={
					loading
				}
				style={{
					height:
						"52px",
					padding:
						"0 28px",
					borderRadius:
						"14px",
					border:
						"none",
					cursor:
						loading
							? "not-allowed"
							: "pointer",
					background:
						"#38bdf8",
					color:
						"#031018",
					fontSize:
						"15px",
					fontWeight:
						700,
					opacity:
						loading
							? 0.7
							: 1,
				}}
			>
				{loading
					? "Logging out..."
					: "Logout"}
			</button>
		</div>
	);
}
