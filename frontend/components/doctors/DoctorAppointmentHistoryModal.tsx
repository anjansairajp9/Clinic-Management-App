"use client";

import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  User,
  Phone,
  Stethoscope,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getDoctorAppointmentHistory } from "@/services/doctor.service";
import type { DoctorAppointmentHistory } from "@/types/doctor";
import { useMobile } from "@/hooks/useMobile";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  doctorId: number | null;
  doctorName?: string;
};

export default function DoctorAppointmentHistoryModal({
  isOpen,
  onClose,
  doctorId,
  doctorName,
}: Props) {
  const isMobile = useMobile();
  const [appointments, setAppointments] = useState<DoctorAppointmentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");

  const limit = 10;

  useEffect(() => {
    if (!isOpen || !doctorId) return;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getDoctorAppointmentHistory(doctorId, {
          page,
          limit,
          appointment_date: selectedDate || undefined,
        });
        setAppointments(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [isOpen, doctorId, page, selectedDate]);

  useEffect(() => {
    if (!isOpen) {
      setPage(1);
      setSelectedDate("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .hover-card { 
            transition: all 0.25s ease !important; 
        }
        .hover-card:hover { 
            background: rgba(255, 255, 255, 0.05) !important; 
            border-color: rgba(56, 189, 248, 0.3) !important; 
            transform: translateY(-2px); 
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3) !important; 
        }
        .hover-btn { 
            transition: all 0.2s ease !important; 
        }
        .hover-btn:hover { 
            background: rgba(255, 255, 255, 0.09) !important; 
            border-color: rgba(255, 255, 255, 0.18) !important; 
            color: #ffffff !important; 
            transform: translateY(-1px); 
        }
        .hover-field { 
            transition: all 0.2s ease !important; 
            outline: none; 
        }
        .hover-field:hover:not(:focus) { 
            border-color: rgba(56, 189, 248, 0.3) !important; 
            background: rgba(255, 255, 255, 0.06) !important; 
        }
        .hover-field:focus { 
            border-color: rgba(56, 189, 248, 0.5) !important; 
            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15) !important; 
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
      `}</style>

      <div style={overlayStyle}>
        <div
          style={{
            ...modalStyle,
            width: isMobile ? "92vw" : "min(1100px, 94vw)",
            padding: isMobile ? "20px" : "36px",
          }}
        >
          {/* Header */}
          <div style={headerStyle}>
            <div>
              <h2
                style={{
                  ...titleStyle,
                  fontSize: isMobile ? "26px" : "36px",
                }}
              >
                Appointment History
              </h2>
              <p style={subtitleStyle}>{doctorName}’s appointments</p>
            </div>

            <button onClick={onClose} className="hover-btn" style={closeButton}>
              <X size={22} />
            </button>
          </div>

          {/* Filter */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
              marginBottom: "28px",
              flexShrink: 0,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="cm-date-picker hover-field"
              style={{
                ...dateInput,
                width: isMobile ? "100%" : "auto",
              }}
            />

            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="hover-btn"
                style={{
                  ...clearButton,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              paddingRight: "8px",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            {loading ? (
              <p style={{ color: "#94a3b8" }}>Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px 20px",
                  color: "#64748b",
                }}
              >
                No appointment history found
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="hover-card"
                  style={cardStyle}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "22px",
                      flexDirection: isMobile ? "column" : "row",
                      gap: isMobile ? "12px" : "0",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          color: "#f8fafc",
                          margin: 0,
                          fontSize: "24px",
                          fontWeight: 600,
                        }}
                      >
                        {appointment.patient_name}
                      </h3>
                      <p
                        style={{
                          color: "#94a3b8",
                          marginTop: "6px",
                          fontSize: "14px",
                        }}
                      >
                        Patient
                      </p>
                    </div>

                    <div style={{ ...statusBadge(appointment.status) }}>
                      {appointment.status}
                    </div>
                  </div>

                  <div
                    style={{
                      ...gridStyle,
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                    }}
                  >
                    <InfoItem
                      icon={<User size={18} />}
                      label="Patient Name"
                      value={appointment.patient_name}
                    />
                    <InfoItem
                      icon={<Phone size={18} />}
                      label="Patient Phone"
                      value={appointment.patient_phone}
                    />
                    <InfoItem
                      icon={<Stethoscope size={18} />}
                      label="Specialization"
                      value={appointment.doctor_specialization}
                    />
                    <InfoItem
                      icon={<ClipboardList size={18} />}
                      label="Type"
                      value={appointment.appointment_type}
                    />
                    <InfoItem
                      icon={<Calendar size={18} />}
                      label="Appointment Time"
                      value={new Date(
                        appointment.appointment_time
                      ).toLocaleString()}
                    />
                    <InfoItem
                      icon={<FileText size={18} />}
                      label="Complaint"
                      value={appointment.complaint || "Not provided"}
                    />
                  </div>

                  {appointment.notes && (
                    <div
                      style={{
                        marginTop: "22px",
                        paddingTop: "18px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p
                        style={{
                          color: "#7dd3fc",
                          fontWeight: 600,
                          fontSize: "13px",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        NOTES
                      </p>
                      <p
                        style={{
                          color: "#d6e2f0",
                          background: "rgba(255,255,255,0.03)",
                          padding: "14px",
                          borderRadius: "14px",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Pagination inside scrolling area */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
                marginBottom: "10px",
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="hover-btn"
                style={paginationButton}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <div style={{ color: "#94a3b8", fontWeight: 500 }}>
                Page {page}
              </div>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="hover-btn"
                style={paginationButton}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoItem({ icon, label, value }: any) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#60a5fa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>{icon}</div>
        <span style={{ fontSize: "14px" }}>{label}</span>
      </div>
      <p
        style={{
          color: "#f8fafc",
          marginTop: "8px",
          fontWeight: 500,
        }}
      >
        {value}
      </p>
    </div>
  );
}

const overlayStyle = {
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
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column" as const,
  borderRadius: "34px",
  background: "linear-gradient(180deg, rgba(5,15,35,0.98), rgba(2,8,23,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
};

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "24px",
};

const gridStyle = {
  display: "grid",
  gap: "24px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "28px",
  flexShrink: 0,
};

const titleStyle = {
  color: "#f8fafc",
  margin: 0,
  fontWeight: 700,
  letterSpacing: "-0.5px",
};

const subtitleStyle = {
  color: "#94a3b8",
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

const dateInput = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#f8fafc",
  padding: "12px 18px",
  borderRadius: "16px",
  fontSize: "14px",
};

const clearButton = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid rgba(245, 158, 11, 0.4)",
  background: "rgba(245, 158, 11, 0.15)",
  color: "#fbbf24",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
};

const paginationButton = {
  padding: "10px 20px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#f8fafc",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
};

function statusBadge(status: string) {
  const styles: Record<string, any> = {
    scheduled: {
      background: "rgba(59,130,246,0.15)",
      border: "1px solid rgba(59,130,246,0.3)",
      color: "#60a5fa",
    },
    completed: {
      background: "rgba(34,197,94,0.15)",
      border: "1px solid rgba(34,197,94,0.3)",
      color: "#4ade80",
    },
    cancelled: {
      background: "rgba(239,68,68,0.15)",
      border: "1px solid rgba(239,68,68,0.3)",
      color: "#f87171",
    },
    no_show: {
      background: "rgba(245,158,11,0.15)",
      border: "1px solid rgba(245,158,11,0.3)",
      color: "#fbbf24",
    },
  };

  return {
    padding: "8px 16px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 600,
    textTransform: "capitalize" as const,
    ...(styles[status] || {}),
  };
}
