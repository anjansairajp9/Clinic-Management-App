"use client";

import {
	useEffect,
	useState,
} from "react";

import {
	X,
	User,
	Phone,
	Stethoscope,
	FileText,
} from "lucide-react";

import {
	createDoctor,
	updateDoctor,
} from "@/services/doctor.service";

import type {
	DoctorDetails,
} from "@/types/doctor";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;

	mode:
	| "create"
	| "edit";

	doctor?: DoctorDetails | null;
};

export default function DoctorFormModal({
	isOpen,
	onClose,
	onSuccess,
	mode,
	doctor,
}: Props) {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [specialization, setSpecialization] = useState("");
	const [notes, setNotes] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	// Hover states for interactive buttons
	const [closeHovered, setCloseHovered] = useState(false);
	const [cancelHovered, setCancelHovered] = useState(false);
	const [submitHovered, setSubmitHovered] = useState(false);

	useEffect(() => {
		if (
			mode === "edit" &&
			doctor
		) {
			setName(doctor.name);
			setPhone(doctor.phone.replace("+91", ""));
			setSpecialization(doctor.specialization);
			setNotes(doctor.notes || "");
		} else {
			resetForm();
		}
	}, [mode, doctor, isOpen]);

	const resetForm = () => {
		setName("");
		setPhone("");
		setSpecialization("");
		setNotes("");
		setError("");
		setSuccess("");
	};

	const validateForm = () => {
		if (!name.trim()) {
			setError("Doctor name is required");
			return false;
		}

		if (!phone.trim()) {
			setError("Phone number is required");
			return false;
		}

		if (!/^\d+$/.test(phone)) {
			setError("Phone number must contain only numbers");
			return false;
		}

		if (phone.length < 10) {
			setError("Phone number must be at least 10 digits");
			return false;
		}

		if (!specialization.trim()) {
			setError("Specialization is required");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!validateForm()) {
			return;
		}

		try {
			setLoading(true);

			const payload = {
				name: name.trim(),
				phone: phone.trim(),
				specialization: specialization.trim(),
				notes: notes.trim() || undefined,
			};

			if (mode === "create") {
				await createDoctor(payload);

				setSuccess(
					"Doctor created successfully!"
				);
			} else if (doctor) {
				await updateDoctor(
					doctor.id,
					payload
				);

				setSuccess(
					"Doctor updated successfully!"
				);
			}

			setTimeout(() => {
				onSuccess();

				resetForm();

				onClose();
			}, 1500);

		} catch (error: any) {
			const message =
				error?.response?.data?.detail?.message ||
				error?.response?.data?.detail ||
				"Something went wrong";

			setError(message);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) {
		return null;
	}

	return (
		<>
			<style>{`
        .hover-field {
          transition: all 0.2s ease !important;
        }
        .hover-field:hover:not(:focus-within) {
          border-color: rgba(56, 189, 248, 0.3) !important;
          background: rgba(255, 255, 255, 0.06) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .hover-field:focus-within {
          border-color: rgba(56, 189, 248, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>

			<div style={backdropStyle}>
				<div style={modalStyle}>
					<div style={headerStyle}>
						<div>
							<h2 style={titleStyle}>
								{mode === "create" ? "Create Doctor" : "Edit Doctor"}
							</h2>

							<p style={subtitleStyle}>
								Manage doctor information.
							</p>
						</div>

						<button
							type="button"
							onClick={onClose}
							onMouseEnter={() => setCloseHovered(true)}
							onMouseLeave={() => setCloseHovered(false)}
							style={{
								...closeButton,
								background: closeHovered ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
								border: `1px solid ${closeHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
								transform: closeHovered ? "scale(1.05)" : "scale(1)",
								transition: "all 0.2s ease",
							}}
						>
							<X size={22} />
						</button>
					</div>

					<form onSubmit={handleSubmit}>
						<div style={formGrid}>
							<InputField
								icon={<User size={18} />}
								placeholder="Doctor name"
								value={name}
								onChange={setName}
							/>

							<InputField
								icon={<Phone size={18} />}
								placeholder="Phone number"
								value={phone}
								onChange={setPhone}
							/>

							<div style={{ gridColumn: "1 / -1" }}>
								<InputField
									icon={<Stethoscope size={18} />}
									placeholder="Specialization"
									value={specialization}
									onChange={setSpecialization}
								/>
							</div>

							<div style={{ gridColumn: "1 / -1" }}>
								<TextAreaField
									icon={<FileText size={18} />}
									placeholder="Notes (optional)"
									value={notes}
									onChange={setNotes}
								/>
							</div>
						</div>

						{error && (
							<div style={messageStyle("error")}>
								{error}
							</div>
						)}

						{success && (
							<div style={messageStyle("success")}>
								{success}
							</div>
						)}

						<div style={buttonRow}>
							<button
								type="button"
								onClick={onClose}
								onMouseEnter={() => setCancelHovered(true)}
								onMouseLeave={() => setCancelHovered(false)}
								style={{
									...cancelButton,
									background: cancelHovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
									border: `1px solid ${cancelHovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}`,
									transform: cancelHovered ? "translateY(-1px)" : "translateY(0)",
									transition: "all 0.2s ease",
								}}
							>
								Cancel
							</button>

							<button
								type="submit"
								disabled={loading || success !== ""}
								onMouseEnter={() => setSubmitHovered(true)}
								onMouseLeave={() => setSubmitHovered(false)}
								style={{
									...submitButton,
									background: loading || success !== ""
										? "linear-gradient(135deg, #2563eb, #1d4ed8)"
										: submitHovered
											? "linear-gradient(135deg, #3b82f6, #2563eb)"
											: "linear-gradient(135deg, #2563eb, #1d4ed8)",
									transform: submitHovered && !loading && success === "" ? "translateY(-1px)" : "translateY(0)",
									boxShadow: submitHovered && !loading && success === "" ? "0 6px 20px rgba(37, 99, 235, 0.4)" : "none",
									transition: "all 0.2s ease",
									opacity: loading || success !== "" ? 0.7 : 1,
								}}
							>
								{loading
									? "Saving..."
									: success !== ""
										? "Saved!"
										: mode === "create"
											? "Create Doctor"
											: "Save Changes"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

/* ---------- reusable ---------- */

function InputField({ icon, placeholder, value, onChange }: any) {
	return (
		<div className="hover-field" style={inputContainer}>
			<div style={{ color: "#38bdf8", display: "flex" }}>
				{icon}
			</div>

			<input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				style={inputStyle}
			/>
		</div>
	);
}

function TextAreaField({ icon, placeholder, value, onChange }: any) {
	return (
		<div className="hover-field" style={textAreaContainer}>
			<div style={{ marginTop: "18px", color: "#38bdf8", display: "flex" }}>
				{icon}
			</div>

			<textarea
				rows={5}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				style={{
					...inputStyle,
					resize: "none",
					paddingTop: "18px",
				}}
			/>
		</div>
	);
}

const backdropStyle = {
	position: "fixed" as const,
	inset: 0,
	background: "rgba(0,0,0,0.72)",
	backdropFilter: "blur(14px)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	zIndex: 9999,
};

const modalStyle = {
	width: "min(720px, 92vw)",
	borderRadius: "34px",
	padding: "34px",
	background: "linear-gradient(180deg, rgba(5,15,35,0.98), rgba(2,8,23,0.98))",
	border: "1px solid rgba(255,255,255,0.08)",
	boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
};

const headerStyle = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-start",
	marginBottom: "28px",
};

const titleStyle = {
	color: "#f8fafc",
	fontSize: "42px",
	fontWeight: 700,
	margin: 0,
};

const subtitleStyle = {
	color: "#8ea4c8",
	marginTop: "8px",
};

const closeButton = {
	width: "46px",
	height: "46px",
	borderRadius: "14px",
	border: "1px solid rgba(255,255,255,0.08)",
	background: "rgba(255,255,255,0.04)",
	color: "#d6e2f0",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
};

const formGrid = {
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	gap: "18px",
};

// Container for standard inputs: Centered vertically
const inputContainer = {
	display: "flex",
	alignItems: "center",
	gap: "14px",
	background: "rgba(255,255,255,0.04)",
	border: "1px solid rgba(255,255,255,0.08)",
	borderRadius: "18px",
	padding: "0 18px",
	transition: "all 0.2s ease",
};

// Container for textareas: Flex-start aligns the icon at the top with a margin
const textAreaContainer = {
	display: "flex",
	alignItems: "flex-start",
	gap: "14px",
	background: "rgba(255,255,255,0.04)",
	border: "1px solid rgba(255,255,255,0.08)",
	borderRadius: "18px",
	padding: "0 18px",
	transition: "all 0.2s ease",
};

const inputStyle = {
	width: "100%",
	background: "transparent",
	border: "none",
	outline: "none",
	color: "#f8fafc",
	fontSize: "15px",
	padding: "18px 0",
};

const messageStyle = (type: "error" | "success") => ({
	padding: "14px 18px",
	borderRadius: "14px",
	marginTop: "20px",
	fontSize: "14px",
	fontWeight: 500,
	background: type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
	border: type === "error" ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(34, 197, 94, 0.2)",
	color: type === "error" ? "#f87171" : "#4ade80",
});

const buttonRow = {
	display: "flex",
	justifyContent: "flex-end",
	gap: "14px",
	marginTop: "30px",
};

const cancelButton = {
	height: "54px",
	padding: "0 24px",
	borderRadius: "16px",
	border: "1px solid rgba(255,255,255,0.08)",
	background: "rgba(255,255,255,0.04)",
	color: "#fff",
	cursor: "pointer",
	fontWeight: 500,
};

const submitButton = {
	height: "54px",
	padding: "0 26px",
	border: "none",
	borderRadius: "16px",
	background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
	color: "white",
	fontWeight: 600,
	cursor: "pointer",
};