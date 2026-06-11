"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
  CalendarDays,
  ClipboardList,
  FileText,
  Loader2,
  Plus,
} from "lucide-react";

import {
  searchDoctors,
  createAppointment,
  getAppointmentAvailability,
} from "@/services/appointment.service";

import type {
  PatientSearchResult,
  AppointmentAvailabilitySlot,
} from "@/types/appointment";

import PatientSearchSelect from "./PatientSearchSelect";
import TimeSlotPicker from "./TimeSlotPicker";

type Doctor = {
  id: number;
  name: string;
  phone: string;
  specialization: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);
  const [doctorId, setDoctorId] = useState("");
  const [appointmentType, setAppointmentType] = useState<"scheduled" | "walk_in">("scheduled");

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

  const [appointmentDate, setAppointmentDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [complaint, setComplaint] = useState("");
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<AppointmentAvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Hover states
  const [cancelHovered, setCancelHovered] = useState(false);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const [doctorSelectFocused, setDoctorSelectFocused] = useState(false);
  const [typeSelectFocused, setTypeSelectFocused] = useState(false);
  const [dateFocused, setDateFocused] = useState(false);
  const [complaintFocused, setComplaintFocused] = useState(false);
  const [notesFocused, setNotesFocused] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchDoctors = async () => {
      try {
        const response = await searchDoctors();
        setDoctors(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctors();
  }, [isOpen]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!appointmentDate) return;
      try {
        setLoadingSlots(true);
        const response = await getAppointmentAvailability({
          appointment_date: appointmentDate,
          doctor_id: doctorId ? Number(doctorId) : undefined,
        });
        setSlots(response.available_slots);
        setSelectedTime(null);
      } catch (error: any) {
        console.error(error);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    if (isOpen) fetchSlots();
  }, [isOpen, doctorId, appointmentDate]);

  const resetForm = () => {
    setSelectedPatient(null);
    setDoctorId("");
    setAppointmentType("scheduled");
    setAppointmentDate(today);
    setSelectedTime(null);
    setComplaint("");
    setNotes("");
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setSuccess("");

      if (!selectedPatient) { setError("Please select a patient"); return; }
      if (!doctorId) { setError("Please select a doctor"); return; }
      if (!selectedTime) { setError("Please select an appointment time"); return; }

      setSubmitting(true);

      await createAppointment({
        patient_id: selectedPatient.id,
        doctor_id: Number(doctorId),
        appointment_type: appointmentType,
        appointment_date: appointmentDate,
        appointment_time: selectedTime,
        complaint: complaint.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setSuccess("Appointment created successfully");
      onSuccess();
      setTimeout(() => { handleClose(); }, 1200);
    } catch (error: any) {
      console.error(error);
      setError(error?.response?.data?.detail || "Failed to create appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Global dropdown styles injected once */}
      <style>{`
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
        .cm-input::-webkit-calendar-picker-indicator {
          filter: invert(0.7) sepia(1) saturate(2) hue-rotate(180deg);
          cursor: pointer;
          opacity: 0.7;
        }
        .cm-input::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
        
        /* NEW: Hover effects to keep the component clean */
        .hover-card {
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .hover-card:hover {
          border-color: rgba(56, 189, 248, 0.25) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
        }
        .hover-field {
          transition: border-color 0.2s ease, background 0.2s ease !important;
        }
        .hover-field:hover:not(:focus) {
          border-color: rgba(56, 189, 248, 0.3) !important;
          background: rgba(13, 26, 51, 1) !important;
        }
      `}</style>

      {/* Backdrop */}
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

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(920px, 94vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "34px",
          borderRadius: "34px",
          zIndex: 1000,
          background: `
            radial-gradient(circle at top right, rgba(56,189,248,0.14), transparent 24%),
            radial-gradient(circle at bottom left, rgba(59,130,246,0.12), transparent 30%),
            linear-gradient(180deg, rgba(5,15,35,0.98), rgba(2,8,23,0.98))
          `,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: `
            0 0 80px rgba(56,189,248,0.08),
            0 40px 120px rgba(0,0,0,0.65)
          `,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "30px" }}>
          <div>
            <h2 style={{ color: "#f0f6ff", fontSize: "40px", fontWeight: 700, margin: 0 }}>
              Create Appointment
            </h2>
            <p style={{ color: "#86a7c8", marginTop: "10px", marginBottom: 0 }}>
              Schedule a new patient appointment
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
              color: closeHovered ? "#f0f6ff" : "#d9e7f5",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              transform: closeHovered ? "scale(1.05)" : "scale(1)",
              flexShrink: 0,
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ ...messageStyle, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171" }}>
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{ ...messageStyle, background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.22)", color: "#4ade80" }}>
            {success}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px" }}>

          {/* Patient - zIndex 50 to prevent dropdown hiding */}
          <div className="hover-card" style={{ ...cardStyle, position: "relative", zIndex: 50 }}>
            <CardTitle icon={<UserIcon />} title="Patient" />
            <PatientSearchSelect
              selectedPatient={selectedPatient}
              setSelectedPatient={setSelectedPatient}
            />
          </div>

          {/* Doctor - zIndex 40 */}
          <div className="hover-card" style={{ ...cardStyle, position: "relative", zIndex: 40 }}>
            <CardTitle icon={<ClipboardList size={18} />} title="Doctor" />
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              onFocus={() => setDoctorSelectFocused(true)}
              onBlur={() => setDoctorSelectFocused(false)}
              className="cm-select hover-field"
              style={{
                ...selectStyle,
                border: `1px solid ${doctorSelectFocused ? "rgba(56,189,248,0.45)" : "rgba(255,255,255,0.10)"}`,
                boxShadow: doctorSelectFocused ? "0 0 0 3px rgba(56,189,248,0.10)" : "none",
                color: doctorId ? "#f0f6ff" : "#7a9ab8",
              }}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={String(doctor.id)}>
                  Dr. {doctor.name} — {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Date - zIndex 30 */}
          <div className="hover-card" style={{ ...cardStyle, position: "relative", zIndex: 30 }}>
            <CardTitle icon={<CalendarDays size={18} />} title="Appointment Date" />
            <input
              type="date"
              value={appointmentDate}
              min={today}
              onChange={(e) => setAppointmentDate(e.target.value)}
              onFocus={() => setDateFocused(true)}
              onBlur={() => setDateFocused(false)}
              className="cm-input hover-field"
              style={{
                ...inputStyle,
                border: `1px solid ${dateFocused ? "rgba(56,189,248,0.45)" : "rgba(255,255,255,0.10)"}`,
                boxShadow: dateFocused ? "0 0 0 3px rgba(56,189,248,0.10)" : "none",
                color: "#f0f6ff",
              }}
            />
          </div>

          {/* Type - zIndex 20 */}
          <div className="hover-card" style={{ ...cardStyle, position: "relative", zIndex: 20 }}>
            <CardTitle icon={<Plus size={18} />} title="Appointment Type" />
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value as "scheduled" | "walk_in")}
              onFocus={() => setTypeSelectFocused(true)}
              onBlur={() => setTypeSelectFocused(false)}
              className="cm-select hover-field"
              style={{
                ...selectStyle,
                border: `1px solid ${typeSelectFocused ? "rgba(56,189,248,0.45)" : "rgba(255,255,255,0.10)"}`,
                boxShadow: typeSelectFocused ? "0 0 0 3px rgba(56,189,248,0.10)" : "none",
                color: "#f0f6ff",
              }}
            >
              <option value="scheduled">Scheduled</option>
              <option value="walk_in">Walk In</option>
            </select>
          </div>
        </div>

        {/* Time Slots - zIndex 10 */}
        <div className="hover-card" style={{ ...cardStyle, marginTop: "22px", position: "relative", zIndex: 10 }}>
          <CardTitle icon={<CalendarDays size={18} />} title="Available Time Slots" />
          {loadingSlots ? (
            <div style={{ padding: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", color: "#7a9ab8" }}>
              <Loader2 size={18} />
              Loading slots...
            </div>
          ) : (
            <TimeSlotPicker
              slots={slots}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
            />
          )}
        </div>

        {/* Complaint + Notes - zIndex 5 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px", marginTop: "22px", position: "relative", zIndex: 5 }}>
          <div className="hover-card" style={cardStyle}>
            <CardTitle icon={<FileText size={18} />} title="Complaint" />
            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              onFocus={() => setComplaintFocused(true)}
              onBlur={() => setComplaintFocused(false)}
              rows={5}
              placeholder="Enter patient complaint..."
              className="hover-field"
              style={{
                ...textareaStyle,
                border: `1px solid ${complaintFocused ? "rgba(56,189,248,0.45)" : "rgba(255,255,255,0.10)"}`,
                boxShadow: complaintFocused ? "0 0 0 3px rgba(56,189,248,0.10)" : "none",
              }}
            />
          </div>

          <div className="hover-card" style={cardStyle}>
            <CardTitle icon={<FileText size={18} />} title="Notes" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onFocus={() => setNotesFocused(true)}
              onBlur={() => setNotesFocused(false)}
              rows={5}
              placeholder="Additional notes..."
              className="hover-field"
              style={{
                ...textareaStyle,
                border: `1px solid ${notesFocused ? "rgba(56,189,248,0.45)" : "rgba(255,255,255,0.10)"}`,
                boxShadow: notesFocused ? "0 0 0 3px rgba(56,189,248,0.10)" : "none",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "14px", marginTop: "30px", position: "relative", zIndex: 5 }}>
          <button
            onClick={handleClose}
            onMouseEnter={() => setCancelHovered(true)}
            onMouseLeave={() => setCancelHovered(false)}
            style={{
              height: "54px",
              padding: "0 22px",
              borderRadius: "18px",
              border: `1px solid ${cancelHovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}`,
              background: cancelHovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
              color: cancelHovered ? "#f0f6ff" : "#d9e7f5",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              transform: cancelHovered ? "translateY(-1px)" : "translateY(0)",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            onMouseEnter={() => setSubmitHovered(true)}
            onMouseLeave={() => setSubmitHovered(false)}
            style={{
              height: "54px",
              padding: "0 22px",
              borderRadius: "18px",
              border: "none",
              background: submitting
                ? "linear-gradient(135deg, #22d3ee, #3b82f6)"
                : submitHovered
                  ? "linear-gradient(135deg, #34d9f0, #5b92f7)"
                  : "linear-gradient(135deg, #22d3ee, #3b82f6)",
              color: "#031018",
              fontWeight: 700,
              fontSize: "14px",
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              opacity: submitting ? 0.7 : 1,
              boxShadow: submitHovered && !submitting ? "0 8px 20px rgba(34,211,238,0.35)" : "none",
              transition: "all 0.15s ease",
              transform: submitHovered && !submitting ? "translateY(-1px)" : "translateY(0)",
            }}
          >
            {submitting ? (
              <><Loader2 size={18} />Creating...</>
            ) : (
              <><Plus size={18} />Create Appointment</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

function CardTitle({ icon, title }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", color: "#f0f6ff", fontWeight: 600 }}>
      {icon}
      {title}
    </div>
  );
}

function UserIcon() {
  return (
    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#38bdf8" }} />
  );
}

const cardStyle = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "24px",
  padding: "22px",
  backdropFilter: "blur(18px)",
};

const inputStyle = {
  width: "100%",
  height: "54px",
  padding: "0 16px",
  borderRadius: "18px",
  background: "rgba(13, 26, 51, 0.85)",
  color: "#f0f6ff",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237a9ab8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  paddingRight: "40px",
};

const textareaStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(13, 26, 51, 0.85)",
  color: "#f0f6ff",
  fontSize: "14px",
  outline: "none",
  resize: "none" as const,
  fontFamily: "inherit",
};

const messageStyle = {
  padding: "16px",
  borderRadius: "18px",
  marginBottom: "22px",
  fontSize: "14px",
  fontWeight: 500,
};