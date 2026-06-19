"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { searchDoctors } from "@/services/appointment.service";
import { useMobile } from "@/hooks/useMobile";

type Doctor = {
	id: number;
	name: string;
};

type Props = {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	status: string;
	setStatus: (value: string) => void;
	doctorId: string;
	setDoctorId: (value: string) => void;
};

export default function AppointmentFilters({
	searchQuery,
	setSearchQuery,
	status,
	setStatus,
	doctorId,
	setDoctorId,
}: Props) {
	const isMobile = useMobile();

	// 1. Add mounted state
	const [mounted, setMounted] = useState(false);
	const [doctors, setDoctors] = useState<Doctor[]>([]);

	const [searchHovered, setSearchHovered] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const [doctorHovered, setDoctorHovered] = useState(false);
	const [statusHovered, setStatusHovered] = useState(false);

	// 2. Set mounted after render
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				const response = await searchDoctors();
				setDoctors(response);
			} catch (error) {
				console.error(error);
			}
		};
		fetchDoctors();
	}, []);

	// 3. Return a safe wrapper while mounting
	if (!mounted) {
		return <div style={{ minHeight: "60px" }} />;
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: isMobile ? "column" : "row",
				alignItems: "stretch",
				flexWrap: "wrap",
				gap: "14px",
				marginBottom: "10px",
				width: "100%",
			}}
		>
			{/* Search Input */}
			<div
				style={{
					position: "relative",
					flex: isMobile ? "none" : 1,
					width: "100%",
					height: "48px",
				}}
				onMouseEnter={() => setSearchHovered(true)}
				onMouseLeave={() => setSearchHovered(false)}
			>
				<Search
					size={18}
					style={{
						position: "absolute",
						left: "16px",
						top: "50%",
						transform: "translateY(-50%)",
						color: "#38bdf8",
						zIndex: 2,
						pointerEvents: "none",
					}}
				/>

				<input
					type="text"
					placeholder="Search patient or doctor..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onFocus={() => setSearchFocused(true)}
					onBlur={() => setSearchFocused(false)}
					style={{
						width: "100%",
						height: "100%",
						padding: "0 16px 0 46px",
						borderRadius: "14px",
						background: "rgba(255,255,255,0.03)",
						color: "#f0f6ff",
						fontSize: "14px",
						outline: "none",
						transition: "all 0.25s ease",
						border: searchFocused
							? "1px solid rgba(56,189,248,0.5)"
							: searchHovered
								? "1px solid rgba(56,189,248,0.3)"
								: "1px solid rgba(255,255,255,0.08)",
						boxShadow: searchFocused
							? "0 0 0 3px rgba(56,189,248,0.15)"
							: "none",
					}}
				/>
			</div>

			{/* Doctor Select */}
			<div
				style={{
					position: "relative",
					flex: isMobile ? "none" : "0 0 240px",
					width: "100%",
					height: "48px",
				}}
				onMouseEnter={() => setDoctorHovered(true)}
				onMouseLeave={() => setDoctorHovered(false)}
			>
				<select
					value={doctorId}
					onChange={(e) => setDoctorId(e.target.value)}
					disabled={searchQuery.trim().length > 0}
					style={{
						width: "100%",
						height: "100%",
						padding: "0 40px 0 16px",
						borderRadius: "14px",
						background: "rgba(7,17,35,0.95)",
						color: "#f0f6ff",
						fontSize: "14px",
						outline: "none",
						appearance: "none",
						cursor: "pointer",
						transition: "all 0.25s ease",
						opacity: searchQuery.trim().length > 0 ? 0.5 : 1,
						border: doctorHovered
							? "1px solid rgba(56,189,248,0.3)"
							: "1px solid rgba(255,255,255,0.08)",
					}}
				>
					<option value="">All Doctors</option>
					{doctors.map((doctor) => (
						<option key={doctor.id} value={String(doctor.id)}>
							{doctor.name}
						</option>
					))}
				</select>

				<ChevronDown
					size={16}
					style={{
						position: "absolute",
						right: "18px",
						top: "50%",
						transform: "translateY(-50%)",
						color: "#7a9ab8",
						pointerEvents: "none",
					}}
				/>
			</div>

			{/* Status Select */}
			<div
				style={{
					position: "relative",
					flex: isMobile ? "none" : "0 0 240px",
					width: "100%",
					height: "48px",
				}}
				onMouseEnter={() => setStatusHovered(true)}
				onMouseLeave={() => setStatusHovered(false)}
			>
				<select
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					style={{
						width: "100%",
						height: "100%",
						padding: "0 40px 0 16px",
						borderRadius: "14px",
						background: "rgba(7,17,35,0.95)",
						color: "#f0f6ff",
						fontSize: "14px",
						outline: "none",
						appearance: "none",
						cursor: "pointer",
						transition: "all 0.25s ease",
						border: statusHovered
							? "1px solid rgba(56,189,248,0.3)"
							: "1px solid rgba(255,255,255,0.08)",
					}}
				>
					<option value="scheduled">Scheduled</option>
					<option value="completed">Completed</option>
					<option value="cancelled">Cancelled</option>
					<option value="no_show">No Show</option>
				</select>

				<ChevronDown
					size={16}
					style={{
						position: "absolute",
						right: "18px",
						top: "50%",
						transform: "translateY(-50%)",
						color: "#7a9ab8",
						pointerEvents: "none",
					}}
				/>
			</div>
		</div>
	);
}
