"use client";

import { useEffect, useState } from "react";
import {
	usePathname,
	useRouter,
} from "next/navigation";
import axiosInstance from "@/lib/axios";
import { jwtDecode } from "jwt-decode";

type AuthProviderProps = {
	children: React.ReactNode;
};

type DecodedToken = {
	clinic_id: number;
	email: string;
	is_super_admin: boolean;
	token_type: string;
	exp: number;
};

const AUTH_ROUTES = [
	"/login",
	"/register",
	"/forgot-password",
	"/reset-password",
];

const PUBLIC_ROUTES = [
	"/",
	...AUTH_ROUTES,
];

export default function AuthProvider({
	children,
}: AuthProviderProps) {
	const router =
		useRouter();

	const pathname =
		usePathname();

	const [loading, setLoading] =
		useState(true);

	useEffect(() => {
		let mounted = true;

		const redirectBasedOnRole =
			(
				isSuperAdmin: boolean
			) => {
				const isAuthRoute =
					AUTH_ROUTES.includes(
						pathname
					);

				const isNormalDashboard =
					pathname.startsWith(
						"/dashboard"
					);

				const isSuperAdminDashboard =
					pathname.startsWith(
						"/super-admin"
					);

				if (
					isAuthRoute ||
					pathname === "/"
				) {
					router.replace(
						isSuperAdmin
							? "/super-admin/dashboard"
							: "/dashboard"
					);

					return;
				}

				if (
					!isSuperAdmin &&
					isSuperAdminDashboard
				) {
					router.replace(
						"/dashboard"
					);

					return;
				}

				if (
					isSuperAdmin &&
					isNormalDashboard
				) {
					router.replace(
						"/super-admin/dashboard"
					);

					return;
				}
			};

		const handleAuth =
			async () => {
				const isPublicRoute =
					PUBLIC_ROUTES.includes(
						pathname
					);

				let accessToken =
					localStorage.getItem(
						"access_token"
					);

				if (
					accessToken
				) {
					try {
						const decoded =
							jwtDecode<DecodedToken>(
								accessToken
							);

						redirectBasedOnRole(
							decoded.is_super_admin
						);

						if (
							mounted
						) {
							setLoading(
								false
							);
						}

						return;
					} catch {
						localStorage.removeItem(
							"access_token"
						);
					}
				}

				try {
					const response =
						await axiosInstance.post(
							"/refresh"
						);

					const newAccessToken =
						response
							.data
							?.access_token;

					if (
						newAccessToken
					) {
						localStorage.setItem(
							"access_token",
							newAccessToken
						);

						const decoded =
							jwtDecode<DecodedToken>(
								newAccessToken
							);

						redirectBasedOnRole(
							decoded.is_super_admin
						);
					}

					if (
						mounted
					) {
						setLoading(
							false
						);
					}

					return;
				} catch {
					localStorage.removeItem(
						"access_token"
					);

					if (
						!isPublicRoute
					) {
						router.replace(
							"/login"
						);
					}

					if (
						mounted
					) {
						setLoading(
							false
						);
					}
				}
			};

		handleAuth();

		return () => {
			mounted = false;
		};
	}, [pathname, router]);

	if (loading) {
		return (
			<div
				style={{
					minHeight:
						"100vh",
					background:
						"#050d17",
					display:
						"flex",
					justifyContent:
						"center",
					alignItems:
						"center",
					color:
						"#7a9ab8",
					fontSize:
						"16px",
				}}
			>
				Loading...
			</div>
		);
	}

	return <>{children}</>;
}
