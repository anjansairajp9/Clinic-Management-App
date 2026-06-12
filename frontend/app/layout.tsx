import type { Metadata } from "next";

import {
	DM_Sans,
	DM_Serif_Display,
} from "next/font/google";

import { Toaster } from "react-hot-toast";

import "./globals.css";

import AuthProvider from "@/providers/AuthProvider";

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-body",
	weight: [
		"300",
		"400",
		"500",
		"600",
	],
});

const dmSerif =
	DM_Serif_Display({
		subsets: [
			"latin",
		],
		variable:
			"--font-display",
		weight: "400",
		style: [
			"normal",
			"italic",
		],
	});

export const metadata: Metadata =
{
	title:
		"Clinic Management App",
	description:
		"Modern Clinic Management System",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${dmSans.variable} ${dmSerif.variable}`}
			>
				<AuthProvider>
					{children}
				</AuthProvider>

				<Toaster
					position="top-center"
					toastOptions={{
						duration:
							2500,

						style: {
							background:
								"rgba(5,15,35,0.96)",

							color:
								"#f0f6ff",

							border:
								"1px solid rgba(255,255,255,0.08)",

							borderRadius:
								"18px",

							padding:
								"14px 18px",

							backdropFilter:
								"blur(20px)",

							boxShadow:
								"0 20px 60px rgba(0,0,0,0.45)",

							fontSize:
								"14px",
						},

						success:
						{
							iconTheme:
							{
								primary:
									"#22c55e",

								secondary:
									"#031018",
							},
						},

						error: {
							iconTheme:
							{
								primary:
									"#ef4444",

								secondary:
									"#031018",
							},
						},
					}}
				/>
			</body>
		</html>
	);
}
