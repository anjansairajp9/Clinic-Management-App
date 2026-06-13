"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    X,
    User,
    Phone,
    FileText,
    CalendarDays,
    ChevronDown,
    Plus,
} from "lucide-react";

import {
    createPatient,
    updatePatient,
} from "@/services/patient.service";

import type {
    PatientDetails,
    Gender,
} from "@/types/patient";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;

    mode:
        | "create"
        | "edit";

    patient?:
        | PatientDetails
        | null;
};

export default function PatientFormModal({
    isOpen,
    onClose,
    onSuccess,
    mode,
    patient,
}: Props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<Gender>("male");
    const [dob, setDob] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Hover states for buttons
    const [closeHovered, setCloseHovered] = useState(false);
    const [cancelHovered, setCancelHovered] = useState(false);
    const [submitHovered, setSubmitHovered] = useState(false);

    useEffect(() => {
        if (mode === "edit" && patient) {
            setName(patient.name);
            setPhone(patient.phone);
            setGender(patient.gender);
            setDob(patient.dob);
            setNotes(patient.notes || "");
        }
    }, [mode, patient]);

    const resetForm = () => {
        setName("");
        setPhone("");
        setGender("male");
        setDob("");
        setNotes("");
        setError("");
        setSuccess("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const validateForm = () => {
        if (!name.trim()) {
            setError("Patient name is required.");
            return false;
        }

        if (!/^\d+$/.test(phone)) {
            setError("Phone number must contain only numbers.");
            return false;
        }

        if (phone.length < 10 || phone.length > 15) {
            setError("Phone number must be between 10 and 15 digits.");
            return false;
        }

        if (!dob) {
            setError("Date of birth is required.");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: name.trim(),
                phone,
                gender,
                dob,
                notes: notes.trim() || undefined,
            };

            if (mode === "create") {
                await createPatient(payload);
                setSuccess("Patient created successfully.");
            } else if (patient) {
                await updatePatient(patient.id, payload);
                setSuccess("Patient updated successfully.");
            }

            onSuccess();

            setTimeout(() => {
                handleClose();
            }, 800);
        } catch (error: any) {
            setError(
                error?.response?.data?.detail?.message ||
                error?.response?.data?.detail ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <>
            {/* Styles injected for hover states on inputs/selects to act as interactive "cards" */}
            <style>{`
                .hover-field {
                    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease !important;
                }
                .hover-field:hover:not(:focus) {
                    border-color: rgba(56, 189, 248, 0.3) !important;
                    background: rgba(13, 26, 51, 1) !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
                }
                .hover-field:focus {
                    border-color: rgba(56, 189, 248, 0.5) !important;
                    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1) !important;
                }
                .cm-date-picker::-webkit-calendar-picker-indicator {
                    filter: invert(0.7) sepia(1) saturate(2) hue-rotate(180deg);
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s ease;
                }
                .cm-date-picker::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
                .cm-select option {
                    background: #0d1f33 !important;
                    color: #f0f6ff !important;
                    padding: 10px 14px;
                }
                .cm-select option:hover,
                .cm-select option:checked {
                    background: #1a3a52 !important;
                    color: #38bdf8 !important;
                }
            `}</style>

            <div
                onClick={handleClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.72)",
                    backdropFilter: "blur(14px)",
                    zIndex: 999,
                }}
            />

            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "min(820px, 92vw)",
                    borderRadius: "38px",
                    padding: "34px",
                    zIndex: 1000,

                    background: `
                        radial-gradient(
                            circle at top right,
                            rgba(56,189,248,0.14),
                            transparent 24%
                        ),
                        linear-gradient(
                            180deg,
                            rgba(5,15,35,0.98),
                            rgba(2,8,23,0.98)
                        )
                    `,
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: `
                        0 0 80px rgba(56,189,248,0.08),
                        0 40px 120px rgba(0,0,0,0.65)
                    `,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "28px",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                color: "#f0f6ff",
                                fontSize: "42px",
                                fontWeight: 700,
                                margin: 0,
                            }}
                        >
                            {mode === "create" ? "Create Patient" : "Edit Patient"}
                        </h2>

                        <p
                            style={{
                                color: "#7a9ab8",
                                marginTop: "8px",
                            }}
                        >
                            Manage patient information.
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        onMouseEnter={() => setCloseHovered(true)}
                        onMouseLeave={() => setCloseHovered(false)}
                        style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "14px",
                            background: closeHovered ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${closeHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: closeHovered ? "#f0f6ff" : "#d6e2f0",
                            transition: "all 0.2s ease",
                            transform: closeHovered ? "scale(1.05)" : "scale(1)",
                        }}
                    >
                        <X size={22} />
                    </button>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "18px",
                    }}
                >
                    <Input
                        icon={<User size={18} />}
                        placeholder="Patient name"
                        value={name}
                        onChange={setName}
                    />

                    <Input
                        icon={<Phone size={18} />}
                        placeholder="Phone number"
                        value={phone}
                        onChange={(value: string) =>
                            setPhone(value.replace(/\D/g, ""))
                        }
                    />

                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as Gender)}
                        className="cm-select hover-field"
                        style={{
                            ...inputStyle,
                            background: "rgba(255,255,255,0.04)",
                            cursor: "pointer",
                            appearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2338bdf8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 16px center",
                        }}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="cm-date-picker hover-field"
                        style={inputStyle}
                    />

                    <div style={{ gridColumn: "1 / -1" }}>
                        <textarea
                            placeholder="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="hover-field"
                            style={{
                                ...inputStyle,
                                height: "130px",
                                paddingTop: "16px",
                                resize: "none",
                            }}
                        />
                    </div>
                </div>

                {error && (
                    <p
                        style={{
                            color: "#ef4444",
                            marginTop: "18px",
                        }}
                    >
                        {error}
                    </p>
                )}

                {success && (
                    <p
                        style={{
                            color: "#22c55e",
                            marginTop: "18px",
                        }}
                    >
                        {success}
                    </p>
                )}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "14px",
                        marginTop: "28px",
                    }}
                >
                    <button
                        onClick={handleClose}
                        onMouseEnter={() => setCancelHovered(true)}
                        onMouseLeave={() => setCancelHovered(false)}
                        style={{
                            height: "48px",
                            padding: "0 24px",
                            borderRadius: "16px",
                            border: `1px solid ${cancelHovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}`,
                            background: cancelHovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                            color: cancelHovered ? "#f0f6ff" : "#d6e2f0",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            transform: cancelHovered ? "translateY(-1px)" : "translateY(0)",
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        onMouseEnter={() => setSubmitHovered(true)}
                        onMouseLeave={() => setSubmitHovered(false)}
                        disabled={loading}
                        style={{
                            height: "48px",
                            padding: "0 22px",
                            borderRadius: "16px",
                            border: `1px solid ${submitHovered && !loading ? "rgba(56, 189, 248, 0.6)" : "rgba(56, 189, 248, 0.3)"}`,
                            background: submitHovered && !loading ? "rgba(56, 189, 248, 0.1)" : "transparent",
                            color: "#38bdf8",
                            fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
                            transform: submitHovered && !loading ? "translateY(-1px)" : "translateY(0)",
                            boxShadow: submitHovered && !loading ? "0 4px 14px rgba(56, 189, 248, 0.15)" : "none",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? (
                            "Saving..."
                        ) : (
                            <>
                                {mode === "create" && <Plus size={18} />}
                                {mode === "create" ? "Create Patient" : "Update Patient"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

function Input({
    icon,
    placeholder,
    value,
    onChange,
}: any) {
    return (
        <div style={{ position: "relative" }}>
            <div
                style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#38bdf8",
                    pointerEvents: "none",
                }}
            >
                {icon}
            </div>

            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="hover-field"
                style={{
                    ...inputStyle,
                    paddingLeft: "48px",
                }}
            />
        </div>
    );
}

const inputStyle = {
    width: "100%",
    height: "58px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    padding: "0 18px",
    color: "#f0f6ff",
    fontSize: "15px",
    outline: "none",
};