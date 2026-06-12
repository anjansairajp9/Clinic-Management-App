"use client";

import { useState } from "react";
import {
  X,
  CalendarDays,
  Clock3,
  Phone,
  User,
  Stethoscope,
  FileText,
} from "lucide-react";

import type {
  AppointmentDetails,
} from "@/types/appointment";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  appointment:
  | AppointmentDetails
  | null;

  loading: boolean;

  onEdit: (
    appointment: AppointmentDetails
  ) => void;

  onDelete: (
    appointmentId: number
  ) => void;

  onStatusUpdate: (
    appointmentId: number,
    status:
      | "completed"
      | "cancelled"
      | "no_show"
  ) => void;
};

export default function AppointmentDetailsDrawer({
  isOpen,
  onClose,
  appointment,
  loading,
  onEdit,
  onDelete,
  onStatusUpdate,
}: Props) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={
          onClose
        }
        style={{
          position:
            "fixed",
          inset: 0,
          background:
            "rgba(0,0,0,0.68)",
          backdropFilter:
            "blur(14px)",
          zIndex:
            999,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position:
            "fixed",

          top: "50%",
          left: "50%",

          transform:
            "translate(-50%, -50%)",

          width:
            "min(860px, 92vw)",

          maxHeight:
            "88vh",

          overflowY:
            "auto",

          borderRadius:
            "36px",

          padding:
            "34px",

          zIndex:
            1000,

          background: `
            radial-gradient(
              circle at top right,
              rgba(56,189,248,0.14),
              transparent 24%
            ),

            radial-gradient(
              circle at bottom left,
              rgba(59,130,246,0.12),
              transparent 30%
            ),

            linear-gradient(
              180deg,
              rgba(5,15,35,0.98),
              rgba(2,8,23,0.98)
            )
          `,

          backdropFilter:
            "blur(28px)",

          border:
            "1px solid rgba(255,255,255,0.08)",

          boxShadow: `
            0 0 80px rgba(56,189,248,0.08),
            0 40px 120px rgba(0,0,0,0.65)
          `,
        }}
      >
        {/* Header */}
        <div
          style={{
            display:
              "flex",
            alignItems:
              "flex-start",
            justifyContent:
              "space-between",
            marginBottom:
              "30px",
          }}
        >
          <div>
            <h2
              style={{
                color:
                  "#f0f6ff",
                fontSize:
                  "44px",
                fontWeight:
                  700,
                letterSpacing:
                  "-1px",
                margin:
                  0,
              }}
            >
              Appointment
              Details
            </h2>

            <p
              style={{
                color:
                  "#86a7c8",
                fontSize:
                  "15px",
                marginTop:
                  "10px",
                marginBottom:
                  0,
              }}
            >
              View complete
              appointment
              information
            </p>
          </div>

          <button
            onClick={
              onClose
            }
            style={{
              background:
                "rgba(255,255,255,0.04)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              color:
                "#9fb8d6",
              width:
                "48px",
              height:
                "48px",
              borderRadius:
                "16px",
              cursor:
                "pointer",
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              transition:
                "all 0.2s ease",
            }}
          >
            <X
              size={26}
            />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              color:
                "#7a9ab8",
              padding:
                "40px",
              textAlign:
                "center",
            }}
          >
            Loading
            appointment...
          </div>
        )}

        {/* Content */}
        {appointment && (
          <>
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "22px",
              }}
            >
              <Card title="Patient Information">
                <Info
                  icon={
                    <User size={18} />
                  }
                  label="Patient Name"
                  value={
                    appointment.patient_name
                  }
                />

                <Info
                  icon={
                    <Phone size={18} />
                  }
                  label="Phone"
                  value={
                    appointment.patient_phone
                  }
                />

                <Info
                  label="Age"
                  value={`${appointment.patient_age} years`}
                />
              </Card>

              <Card title="Doctor Information">
                <Info
                  icon={
                    <Stethoscope size={18} />
                  }
                  label="Doctor"
                  value={
                    appointment.doctor_name
                  }
                />

                <Info
                  label="Specialization"
                  value={
                    appointment.doctor_specialization
                  }
                />

                <Info
                  icon={
                    <Phone size={18} />
                  }
                  label="Doctor Phone"
                  value={
                    appointment.doctor_phone
                  }
                />
              </Card>

              <Card title="Appointment">
                <Info
                  icon={
                    <CalendarDays size={18} />
                  }
                  label="Date"
                  value={new Date(
                    appointment.appointment_time
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                />

                <Info
                  icon={
                    <Clock3 size={18} />
                  }
                  label="Time"
                  value={new Date(
                    appointment.appointment_time
                  ).toLocaleTimeString(
                    "en-IN",
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}
                />

                <Info
                  label="Status"
                  value={
                    appointment.status
                  }
                />
              </Card>

              <Card title="Additional Details">
                <Info
                  label="Appointment Type"
                  value={
                    appointment.appointment_type
                  }
                />

                <Info
                  icon={
                    <FileText size={18} />
                  }
                  label="Complaint"
                  value={
                    appointment.complaint ||
                    "Not provided"
                  }
                />

                <Info
                  label="Notes"
                  value={
                    appointment.notes ||
                    "Not provided"
                  }
                />
              </Card>
            </div>

            {/* Quick Actions */}
            {appointment.status ===
              "scheduled" && (
                <div
                  style={{
                    marginTop:
                      "28px",
                    paddingTop:
                      "28px",
                    borderTop:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3
                    style={{
                      color:
                        "#f0f6ff",
                      fontSize:
                        "20px",
                      fontWeight:
                        600,
                      marginBottom:
                        "18px",
                    }}
                  >
                    Quick Actions
                  </h3>

                  <div
                    style={{
                      display:
                        "flex",
                      flexWrap:
                        "wrap",
                      gap: "14px",
                    }}
                  >
                    <ActionButton
                      label="Mark Completed"
                      type="success"
                      onClick={() =>
                        onStatusUpdate(
                          appointment.id,
                          "completed"
                        )
                      }
                    />

                    <ActionButton
                      label="Mark No Show"
                      type="warning"
                      onClick={() =>
                        onStatusUpdate(
                          appointment.id,
                          "no_show"
                        )
                      }
                    />

                    <ActionButton
                      label="Cancel Appointment"
                      type="danger"
                      onClick={() =>
                        onStatusUpdate(
                          appointment.id,
                          "cancelled"
                        )
                      }
                    />
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "14px",
                      marginTop:
                        "28px",
                      paddingTop:
                        "24px",
                      borderTop:
                        "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <ActionButton
                      label="Edit Appointment"
                      type="primary"
                      onClick={() =>
                        onEdit(
                          appointment
                        )
                      }
                    />

                    <ActionButton
                      label="Delete"
                      type="danger"
                      onClick={() =>
                        onDelete(
                          appointment.id
                        )
                      }
                    />
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </>
  );
}

function Card({
  title,
  children,
}: any) {
  return (
    <div style={{
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02))",
      border:
        "1px solid rgba(255,255,255,0.07)",
      borderRadius:
        "28px",
      padding:
        "26px",
    }}>
      <h3 style={{
        color:
          "#f0f6ff",
        marginBottom:
          "22px",
      }}>
        {title}
      </h3>

      <div style={{
        display:
          "flex",
        flexDirection:
          "column",
        gap: "18px",
      }}>
        {children}
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: any) {
  return (
    <div>
      <p style={{
        color:
          "#7a9ab8",
        fontSize:
          "12px",
        marginBottom:
          "8px",
      }}>
        {label}
      </p>

      <div style={{
        display:
          "flex",
        alignItems:
          "center",
        gap: "12px",
        color:
          "#f0f6ff",
      }}>
        {icon}
        {value}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  type,
}: any) {
  const [isHovered, setIsHovered] = useState(false);

  // Set color themes based on button type
  let colors = {
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    text: "#f0f6ff",
    hoverBg: "rgba(255,255,255,0.08)",
    hoverBorder: "rgba(255,255,255,0.15)",
  };

  if (type === "success") {
    colors = {
      bg: "rgba(34, 197, 94, 0.1)",
      border: "rgba(34, 197, 94, 0.2)",
      text: "#4ade80",
      hoverBg: "rgba(34, 197, 94, 0.18)",
      hoverBorder: "rgba(34, 197, 94, 0.35)",
    };
  } else if (type === "warning") {
    colors = {
      bg: "rgba(249, 115, 22, 0.1)",
      border: "rgba(249, 115, 22, 0.2)",
      text: "#fb923c",
      hoverBg: "rgba(249, 115, 22, 0.18)",
      hoverBorder: "rgba(249, 115, 22, 0.35)",
    };
  } else if (type === "danger") {
    colors = {
      bg: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.2)",
      text: "#f87171",
      hoverBg: "rgba(239, 68, 68, 0.18)",
      hoverBorder: "rgba(239, 68, 68, 0.35)",
    };
  } else if (type === "primary") {
    colors = {
      bg: "rgba(56, 189, 248, 0.1)",
      border: "rgba(56, 189, 248, 0.2)",
      text: "#38bdf8",
      hoverBg: "rgba(56, 189, 248, 0.18)",
      hoverBorder: "rgba(56, 189, 248, 0.35)",
    };
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "12px 20px",
        borderRadius: "14px",
        background: isHovered ? colors.hoverBg : colors.bg,
        border: `1px solid ${isHovered ? colors.hoverBorder : colors.border}`,
        color: colors.text,
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered ? `0 6px 20px ${colors.bg}` : "none",
      }}
    >
      {label}
    </button>
  );
}