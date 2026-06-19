"use client";

import { useEffect, useState, useRef } from "react";
import { Search, User } from "lucide-react";

import { searchPatients } from "@/services/appointment.service";
import type { PatientSearchResult } from "@/types/appointment";

type Props = {
	selectedPatient: PatientSearchResult | null;
	setSelectedPatient: (patient: PatientSearchResult | null) => void;
};

export default function PatientSearchSelect({
	selectedPatient,
	setSelectedPatient,
}: Props) {
	const [query, setQuery] = useState("");
	const [patients, setPatients] = useState<PatientSearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const timeout = setTimeout(async () => {
			if (query.trim().length < 2) {
				setPatients([]);
				return;
			}
			try {
				setLoading(true);
				const response = await searchPatients(query);
				setPatients(response);
				setIsOpen(true);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}, 300);
		return () => clearTimeout(timeout);
	}, [query]);

	const handleSelect = (patient: PatientSearchResult) => {
		setSelectedPatient(patient);
		setQuery(`${patient.name} (${patient.age})`);
		setIsOpen(false);
	};

	return (
		<div
			ref={wrapperRef}
			style={{
				position: "relative",
				width: "100%",
			}}
		>
			<Search
				size={18}
				style={{
					position: "absolute",
					left: "18px",
					top: "50%",
					transform: "translateY(-50%)",
					color: "#38bdf8",
					zIndex: 2,
				}}
			/>

			<input
				type="text"
				placeholder="Search patient..."
				value={query}
				onFocus={() => query.length >= 2 && setIsOpen(true)}
				onChange={(e) => {
					setQuery(e.target.value);
					setSelectedPatient(null);
				}}
				style={{
					width: "100%",
					height: "56px",
					padding: "0 18px 0 48px",
					borderRadius: "18px",
					border: selectedPatient
						? "1px solid rgba(56,189,248,0.22)"
						: "1px solid rgba(255,255,255,0.08)",
					background: "rgba(255,255,255,0.03)",
					color: "#f0f6ff",
					fontSize: "14px",
					outline: "none",
				}}
			/>

			{isOpen && (
				<div
					style={{
						position: "absolute",
						top: "64px",
						left: 0,
						right: 0,
						zIndex: 99999,
						borderRadius: "22px",
						background:
							"linear-gradient(180deg, rgba(7,17,35,0.98), rgba(2,8,23,0.98))",
						border: "1px solid rgba(56,189,248,0.12)",
						boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
						overflow: "hidden",
						maxHeight: "320px",
						overflowY: "auto",
					}}
				>
					{loading ? (
						<div style={messageStyle}>Searching...</div>
					) : patients.length === 0 ? (
						<div style={messageStyle}>No patients found</div>
					) : (
						patients.map((patient) => (
							<div
								key={patient.id}
								onClick={() => handleSelect(patient)}
								style={{
									padding: "18px 20px",
									cursor: "pointer",
									borderBottom: "1px solid rgba(255,255,255,0.04)",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = "rgba(56,189,248,0.08)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = "transparent";
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<div>
										<div
											style={{
												color: "#f0f6ff",
												fontWeight: 600,
												fontSize: "15px",
											}}
										>
											{patient.name}
										</div>

										<div
											style={{
												marginTop: "8px",
												color: "#94a8bf",
												fontSize: "13px",
											}}
										>
											Age {patient.age} • {patient.phone}
										</div>
									</div>

									<User size={18} color="#38bdf8" />
								</div>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
}

const messageStyle = {
	padding: "24px",
	textAlign: "center" as const,
	color: "#7a9ab8",
};
