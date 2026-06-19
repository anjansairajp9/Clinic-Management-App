"use client";

import { useState } from "react";
import { X, User, Stethoscope, Calendar, CreditCard, FileText } from "lucide-react";
import type { PaymentDetails } from "@/types/payment";
import { useMobile } from "@/hooks/useMobile";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentDetails | null;
  loading: boolean;
  onEdit: (payment: PaymentDetails) => void;
  onDelete: (paymentId: number) => void;
};

export default function PaymentDetailsModal({
  isOpen,
  onClose,
  payment,
  loading,
  onEdit,
  onDelete,
}: Props) {
  const isMobile = useMobile();
  const [closeHovered, setCloseHovered] = useState(false);

  if (!isOpen) return null;

  const dueAmount = payment ? payment.total_amount - payment.amount_paid : 0;

  return (
    <>
      <style>{`
        .hover-card {
          transition: all 0.25s ease !important;
        }
        .hover-card:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(56,189,248,0.3) !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.3) !important;
        }
      `}</style>

      <div style={overlayStyle}>
        <div
          style={{
            ...modalStyle,
            width: isMobile ? "92vw" : "min(1150px, 95vw)",
            padding: isMobile ? "24px" : "36px",
          }}
        >
          {/* Header */}
          <div style={headerStyle}>
            <div>
              <h2
                style={{
                  color: "#f8fafc",
                  margin: 0,
                  fontSize: isMobile ? "28px" : "34px",
                  fontWeight: 700,
                }}
              >
                Payment Details
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "8px",
                  fontSize: "15px",
                }}
              >
                View associated payment information
              </p>
            </div>

            <button
              onClick={onClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                ...closeButton,
                background: closeHovered ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                color: closeHovered ? "#f87171" : "#d6e2f0",
                transform: closeHovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              <X size={22} />
            </button>
          </div>

          <div style={scrollableContentStyle}>
            {loading ? (
              <div
                style={{
                  padding: "80px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                Loading payment...
              </div>
            ) : !payment ? (
              <div
                style={{
                  padding: "80px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                No payment found for this appointment
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gap: "20px",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                  }}
                >
                  <InfoCard
                    icon={<User size={18} />}
                    title="Patient"
                    items={[
                      ["Name", payment.patient_name],
                      ["Phone", payment.patient_phone],
                    ]}
                  />

                  <InfoCard
                    icon={<Stethoscope size={18} />}
                    title="Doctor"
                    items={[["Doctor", payment.doctor_name]]}
                  />

                  <InfoCard
                    icon={<Calendar size={18} />}
                    title="Appointment"
                    items={[
                      ["Date", new Date(payment.appointment_time).toLocaleString()],
                      ["Status", payment.appointment_status],
                      ["Complaint", payment.appointment_complaint || "-"],
                    ]}
                  />

                  <div
                    className="hover-card"
                    style={{
                      ...cardStyle,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "24px",
                        color: "#4ade80",
                      }}
                    >
                      <CreditCard size={20} />
                      <h3 style={cardTitle}>Payment Information</h3>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: "16px",
                        flex: 1,
                        alignContent: "start",
                      }}
                    >
                      <DetailBlock label="Total Amount" value={`₹${payment.total_amount}`} />
                      <DetailBlock label="Amount Paid" value={`₹${payment.amount_paid}`} />
                      <DetailBlock label="Due Amount" value={`₹${dueAmount}`} />
                      <DetailBlock label="Payment Method" value={payment.payment_method || "-"} />
                      <DetailBlock label="Payment Status" value={payment.payment_status || "-"} />
                      <DetailBlock label="Notes" value={payment.notes || "-"} isLast />
                    </div>
                  </div>

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

                    <div
                      style={{
                        display: "grid",
                        gap: "16px",
                      }}
                    >
                      <DetailBlock
                        label="Diagnosis"
                        value={payment.treatment_diagnosis || "No treatment recorded"}
                      />
                      <DetailBlock
                        label="Treatment Performed"
                        value={payment.treatment_performed || "-"}
                      />
                      <DetailBlock
                        label="Medicines Prescribed"
                        value={payment.treatment_medicines_prescribed || "-"}
                        isLast
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "14px",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                    paddingTop: "8px",
                  }}
                >
                  <ActionButton
                    label="Edit Payment"
                    styleType="blue"
                    onClick={() => onEdit(payment)}
                    isMobile={isMobile}
                  />
                  <ActionButton
                    label="Delete"
                    styleType="red"
                    onClick={() => onDelete(payment.id)}
                    isMobile={isMobile}
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
    <div
      className="hover-card"
      style={{
        ...cardStyle,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          flex: 1,
        }}
      >
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

function ActionButton({ label, styleType, onClick, isMobile }: any) {
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
        width: isMobile ? "100%" : "auto",
        padding: "0 20px",
        borderRadius: "14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
  maxHeight: "92vh",
  display: "flex",
  flexDirection: "column" as const,
  borderRadius: "34px",
  background: "linear-gradient(180deg, rgba(5,15,35,0.98), rgba(2,8,23,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
  overflowY: "auto" as const,
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
  border: "1px solid rgba(255,255,255,0.08)",
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
