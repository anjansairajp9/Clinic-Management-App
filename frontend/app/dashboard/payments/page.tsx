"use client";

import {
	useState,
} from "react";

import {
	Search,
	Plus,
	ChevronDown,
} from "lucide-react";

import PaymentTable from "@/components/payments/PaymentTable";
import PaymentFormModal from "@/components/payments/PaymentFormModal";

export default function PaymentsPage() {
	const [
		searchQuery,
		setSearchQuery,
	] = useState("");

	const [
		paymentStatus,
		setPaymentStatus,
	] = useState("");

	const [
		refreshKey,
		setRefreshKey,
	] = useState(0);

	const [
		isCreateModalOpen,
		setIsCreateModalOpen,
	] = useState(false);

	const handleCreateSuccess = () => {
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<>
			{/* CSS injected to style the native select dropdown options */}
			<style>{`
        .dark-theme-select {
          appearance: none;
          padding-right: 48px !important;
        }
        .dark-theme-select option {
          background-color: #0f172a !important;
          color: #f8fafc !important;
          padding: 14px !important;
        }
      `}</style>

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
						marginTop:
							"-30px",
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
							Payments
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
							Manage patient
							payments and
							billing records.
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
						Payment
					</button>
				</div>

				{/* Filters */}
				<div
					style={{
						display: "flex",
						gap: "16px",
						marginBottom: "22px",
						width: "100%", // Ensures the row takes full width
					}}
				>
					{/* Search */}
					<div
						style={{
							...searchContainer,
							flex: 1, // Dynamically stretches to fill all remaining space
						}}
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
							placeholder="Search payments, patients, doctors..."
							value={
								searchQuery
							}
							onChange={(
								e
							) =>
								setSearchQuery(
									e.target.value
								)
							}
							style={
								searchInput
							}
						/>
					</div>

					{/* Status Filter Container with Native Lucide Icon */}
					<div style={{ position: "relative", width: "280px", height: "56px" }}>
						<select
							className="dark-theme-select"
							value={
								paymentStatus
							}
							onChange={(
								e
							) =>
								setPaymentStatus(
									e.target.value
								)
							}
							style={{
								...statusFilter,
								width: "100%",
								position: "relative",
								zIndex: 2,
								backgroundColor: "transparent",
							}}
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
							<option value="">
								All Status
							</option>

							<option value="pending">
								Pending
							</option>

							<option value="paid">
								Paid
							</option>
						</select>

						{/* Down Arrow Icon overlay */}
						<div
							style={{
								position: "absolute",
								right: "18px",
								top: "50%",
								transform: "translateY(-50%)",
								pointerEvents: "none", // Allows clicks to pass through to the select
								display: "flex",
								alignItems: "center",
								color: "#7a9ab8",
								zIndex: 1,
							}}
						>
							<ChevronDown size={20} />
						</div>

						{/* Background layer for select to prevent transparency issues */}
						<div
							style={{
								position: "absolute",
								inset: 0,
								background: "rgba(255,255,255,0.03)",
								borderRadius: "22px",
								zIndex: 0,
							}}
						/>
					</div>
				</div>

				<PaymentTable
					searchQuery={
						searchQuery
					}
					paymentStatus={
						paymentStatus
					}
					refreshKey={
						refreshKey
					}
				/>
			</div>

			<PaymentFormModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSuccess={handleCreateSuccess}
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
	borderRadius:
		"20px",
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
	borderRadius:
		"22px",
	padding:
		"0 20px",
	height: "56px",
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

const statusFilter = {
	height: "56px",
	border:
		"1px solid rgba(255,255,255,0.08)",
	borderRadius:
		"22px",
	padding:
		"0 20px",
	color: "#f8fafc",
	fontSize: "15px",
	outline: "none",
	cursor: "pointer",
	transition: "all 0.2s ease",
};
