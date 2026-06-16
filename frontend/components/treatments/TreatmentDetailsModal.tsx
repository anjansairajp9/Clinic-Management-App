"use client";

import {
  useState,
} from "react";

import {
  X,
  FileText,
  User,
  Stethoscope,
  Calendar,
  Pencil,
  Trash2,
  Files,
} from "lucide-react";

import type {
  TreatmentDetails,
} from "@/types/treatment";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  treatment:
  | TreatmentDetails
  | null;
  loading: boolean;

  onEdit: (
    treatment: TreatmentDetails
  ) => void;

  onDelete: (
    treatmentId: number
  ) => void;

  onFiles: (
    treatment: TreatmentDetails
  ) => void;
};

export default function TreatmentDetailsModal({
  isOpen,
  onClose,
  treatment,
  loading,
  onEdit,
  onDelete,
  onFiles,
}: Props) {
  const [closeHovered, setCloseHovered] = useState(false);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Global styles for smooth card hover effects */}
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
      `}</style>

      <div style={overlayStyle}>
        <div style={modalStyle}>
          {/* Header (Pinned) */}
          <div style={headerStyle}>
            <div>
              <h2
                style={{
                  color: "#f8fafc",
                  margin: 0,
                  fontSize: "34px",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                Treatment Details
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "8px",
                  fontSize: "15px",
                }}
              >
                View treatment information
              </p>
            </div>

            <button
              onClick={onClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                ...closeButton,
                background: closeHovered ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.04)",
                borderColor: closeHovered ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.08)",
                color: closeHovered ? "#f87171" : "#d6e2f0",
                transform: closeHovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div style={scrollableContentStyle}>
            {loading ? (
              <div
                style={{
                  padding: "80px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                Loading treatment...
              </div>
            ) : !treatment ? (
              <div
                style={{
                  padding: "80px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                Treatment not found
              </div>
            ) : (
              <>
                <div style={gridStyle}>
                  <InfoCard
                    icon={<User size={18} />}
                    title="Patient"
                    items={[
                      ["Name", treatment.patient_name],
                      ["Phone", treatment.patient_phone],
                      ["Age", `${treatment.patient_age} years`],
                    ]}
                  />

                  <InfoCard
                    icon={<Stethoscope size={18} />}
                    title="Doctor"
                    items={[
                      ["Name", treatment.doctor_name],
                      ["Specialization", treatment.doctor_specialization],
                    ]}
                  />

                  <InfoCard
                    icon={<Calendar size={18} />}
                    title="Appointment"
                    items={[
                      [
                        "Time",
                        new Date(treatment.appointment_time).toLocaleString(),
                      ],
                      ["Status", treatment.appointment_status],
                      ["Complaint", treatment.appointment_complaint || "-"],
                    ]}
                  />

                  {/* Full width Details Card */}
                  <div
                    className="hover-card"
                    style={{
                      ...cardStyle,
                      gridColumn: "1 / -1",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "24px",
                        color: "#60a5fa",
                      }}
                    >
                      <FileText size={20} />
                      <h3 style={cardTitle}>Treatment Information</h3>
                    </div>

                    <div style={{ display: "grid", gap: "16px" }}>
                      <DetailBlock
                        label="Diagnosis"
                        value={treatment.diagnosis}
                      />

                      <DetailBlock
                        label="Treatment Performed"
                        value={treatment.treatment_performed}
                      />

                      <DetailBlock
                        label="Medicines Prescribed"
                        value={treatment.medicines_prescribed || "-"}
                      />

                      <DetailBlock
                        label="Procedure Notes"
                        value={treatment.procedure_notes || "-"}
                      />

                      <DetailBlock
                        label="Follow Up Instructions"
                        value={treatment.follow_up_instructions || "-"}
                        isLast
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={actionContainer}>
                  <ActionButton
                    icon={<Pencil size={18} />}
                    label="Edit Treatment"
                    styleType="blue"
                    onClick={() => onEdit(treatment)}
                  />

                  <ActionButton
                    icon={<Files size={18} />}
                    label="Treatment Files"
                    styleType="cyan"
                    onClick={() => onFiles(treatment)}
                  />

                  <ActionButton
                    icon={<Trash2 size={18} />}
                    label="Delete"
                    styleType="red"
                    onClick={() => onDelete(treatment.id)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Reusable Components ---------- */

function InfoCard({ title, items, icon }: any) {
  return (
    <div className="hover-card" style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
          color: "#38bdf8",
        }}
      >
        <div style={{ display: "flex" }}>{icon}</div>
        <h3 style={cardTitle}>{title}</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {items.map((item: string[], index: number) => (
          <div key={index}>
            <div
              style={{
                color: "#64748b",
                fontSize: "13px",
                marginBottom: "4px",
                fontWeight: 500,
              }}
            >
              {item[0]}
            </div>
            <div
              style={{
                color: "#e2e8f0",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              {item[1]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailBlock({ label, value, isLast = false }: any) {
  return (
    <div
      style={{
        paddingBottom: isLast ? "0" : "16px",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "13px",
          marginBottom: "6px",
          fontWeight: 500,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#f8fafc",
          lineHeight: 1.6,
          fontSize: "15px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, styleType, onClick }: any) {
  const [isHovered, setIsHovered] = useState(false);

  const themeConfig = {
    blue: {
      baseBg: "rgba(59,130,246,0.08)",
      baseBorder: "rgba(59,130,246,0.25)",
      textColor: "#60a5fa",
      hoverBg: "rgba(59,130,246,0.15)",
      hoverBorder: "rgba(59,130,246,0.4)",
      shadow: "rgba(59,130,246,0.2)",
    },
    cyan: {
      baseBg: "rgba(34,211,238,0.08)",
      baseBorder: "rgba(34,211,238,0.25)",
      textColor: "#22d3ee",
      hoverBg: "rgba(34,211,238,0.15)",
      hoverBorder: "rgba(34,211,238,0.4)",
      shadow: "rgba(34,211,238,0.2)",
    },
    red: {
      baseBg: "rgba(239,68,68,0.08)",
      baseBorder: "rgba(239,68,68,0.25)",
      textColor: "#f87171",
      hoverBg: "rgba(239,68,68,0.15)",
      hoverBorder: "rgba(239,68,68,0.4)",
      shadow: "rgba(239,68,68,0.2)",
    },
  };

  const theme = themeConfig[styleType as keyof typeof themeConfig];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: "50px",
        padding: "0 20px",
        borderRadius: "14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: 600,
        fontSize: "14px",
        transition: "all 0.2s ease",
        color: theme.textColor,
        background: isHovered ? theme.hoverBg : theme.baseBg,
        border: `1px solid ${isHovered ? theme.hoverBorder : theme.baseBorder}`,
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered ? `0 8px 24px ${theme.shadow}` : "none",
      }}
    >
      <div style={{ display: "flex" }}>{icon}</div>
      {label}
    </button>
  );
}

/* ---------- Styles ---------- */

const overlayStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.72)",
  backdropFilter: "blur(14px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "20px",
};

const modalStyle = {
  width: "min(1150px, 95vw)",
  maxHeight: "92vh",
  display: "flex",
  flexDirection: "column" as const,
  borderRadius: "34px",
  padding: "36px",
  background: "linear-gradient(180deg, rgba(5,15,35,0.98), rgba(2,8,23,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "28px",
  flexShrink: 0,
};

const scrollableContentStyle = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto" as const,
  paddingRight: "8px", 
  WebkitOverflowScrolling: "touch" as const, 
  overscrollBehavior: "contain" as const,    
  display: "flex",
  flexDirection: "column" as const,
  gap: "28px",
};

const closeButton = {
  width: "48px",
  height: "48px",
  borderRadius: "16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  flexShrink: 0,
};

// Updated Grid Style for 3 columns!
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "22px",
};

const cardTitle = {
  color: "#f8fafc",
  fontSize: "18px",
  fontWeight: 600,
  margin: 0,
};

const actionContainer = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "14px",
  justifyContent: "flex-end",
  paddingTop: "8px",
};