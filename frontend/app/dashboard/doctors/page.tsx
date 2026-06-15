"use client";

import {
	useState,
} from "react";

import {
	Search,
	Plus,
} from "lucide-react";

import DoctorTable from "@/components/doctors/DoctorTable";
import DoctorFormModal from "@/components/doctors/DoctorFormModal";

export default function DoctorsPage() {
	const [
		searchQuery,
		setSearchQuery,
	] = useState("");

	const [
		refreshKey,
		setRefreshKey,
	] = useState(0);

	const [
		isCreateModalOpen,
		setIsCreateModalOpen,
	] = useState(false);

	return (
		<>
			<div
				style={{
					padding:
						"20px 32px 32px",
				}}
			>
				{/* Header */}
				<div
					style={{
						display:
							"flex",
						justifyContent:
							"space-between",
						alignItems:
							"flex-start",
						marginBottom:
							"18px",
						marginTop: "-30px"
					}}
				>
					<div>
						<h1
							style={{
								color:
									"#f8fafc",
								fontSize:
									"30px",
								fontWeight:
									700,
								margin:
									0,
							}}
						>
							Doctors
						</h1>

						<p
							style={{
								color:
									"#8ea4c8",
								marginTop:
									"6px",
								fontSize:
									"14px",
							}}
						>
							Manage
							doctors and
							clinic staff.
						</p>
					</div>

					<button
						onClick={() =>
							setIsCreateModalOpen(
								true
							)
						}
						style={
							createButton
						}
						onMouseEnter={(
							e
						) => {
							e.currentTarget.style.transform =
								"translateY(-2px)";

							e.currentTarget.style.boxShadow =
								"0 18px 45px rgba(37,99,235,0.28)";
						}}
						onMouseLeave={(
							e
						) => {
							e.currentTarget.style.transform =
								"translateY(0px)";

							e.currentTarget.style.boxShadow =
								"none";
						}}
					>
						<Plus
							size={18}
						/>

						Create
						Doctor
					</button>
				</div>

				{/* Search */}
				<div
					style={{
						marginBottom:
							"22px",
					}}
				>
					<div
						style={
							searchContainer
						}
						onMouseEnter={(
							e
						) => {
							e.currentTarget.style.border =
								"1px solid rgba(59,130,246,0.35)";

							e.currentTarget.style.boxShadow =
								"0 0 0 4px rgba(59,130,246,0.08)";
						}}
						onMouseLeave={(
							e
						) => {
							e.currentTarget.style.border =
								"1px solid rgba(255,255,255,0.08)";

							e.currentTarget.style.boxShadow =
								"none";
						}}
					>
						<Search
							size={20}
							color="#7a9ab8"
						/>

						<input
							type="text"
							placeholder="Search doctors..."
							value={
								searchQuery
							}
							onChange={(
								e
							) =>
								setSearchQuery(
									e
										.target
										.value
								)
							}
							style={
								searchInput
							}
						/>
					</div>
				</div>

				{/* Table */}
				<DoctorTable
					searchQuery={
						searchQuery
					}
					refreshKey={
						refreshKey
					}
				/>
			</div>

			<DoctorFormModal
				isOpen={
					isCreateModalOpen
				}
				onClose={() =>
					setIsCreateModalOpen(
						false
					)
				}
				onSuccess={() => {
					setIsCreateModalOpen(
						false
					);

					setRefreshKey(
						(prev) =>
							prev + 1
					);
				}}
				mode="create"
			/>
		</>
	);
}

const createButton = {
	height: "56px",
	padding: "0 22px",
	border:
		"1px solid rgba(59,130,246,0.25)",
	borderRadius: "20px",
	background:
		"linear-gradient(180deg, rgba(16,24,40,0.95), rgba(10,18,35,0.95))",
	color: "#38bdf8",
	display: "flex",
	alignItems: "center",
	gap: "10px",
	fontWeight: 600,
	fontSize: "16px",
	cursor: "pointer",
	transition:
		"all 0.25s ease",
};

const searchContainer = {
	display: "flex",
	alignItems: "center",
	gap: "12px",
	background:
		"rgba(255,255,255,0.03)",
	border:
		"1px solid rgba(255,255,255,0.08)",
	borderRadius: "22px",
	padding: "16px 20px",
	transition:
		"all 0.2s ease",
};

const searchInput = {
	width: "100%",
	background:
		"transparent",
	border: "none",
	outline: "none",
	color: "#f8fafc",
	fontSize: "15px",
};