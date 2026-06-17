"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
  Save,
  CreditCard,
  IndianRupee,
  FileText,
  ChevronDown,
} from "lucide-react";

import {
  createPayment,
  updatePayment,
} from "@/services/payment.service";

import {
  searchAppointments,
} from "@/services/appointment.service";

import type {
  PaymentDetails,
  PaymentMethod,
} from "@/types/payment";

import type {
  AppointmentSearchResult,
} from "@/types/appointment";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;

  mode: "create" | "edit";
  payment?: PaymentDetails | null;
  appointmentId?: number;
};

export default function PaymentFormModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  payment,
  appointmentId,
}: Props) {
  // Form State
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [notes, setNotes] = useState("");

  // Status State
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Appointment Search State
  const [appointments, setAppointments] = useState<AppointmentSearchResult[]>([]);
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentSearchResult | null>(null);

  // Hover states
  const [closeHovered, setCloseHovered] = useState(false);
  const [submitHovered, setSubmitHovered] = useState(false);

  // Initialize form based on mode
  useEffect(() => {
    if (mode === "edit" && payment) {
      setTotalAmount(payment.total_amount.toString());
      setAmountPaid(payment.amount_paid.toString());
      setPaymentMethod(payment.payment_method || "");
      setNotes(payment.notes || "");
    } else {
      setTotalAmount("");
      setAmountPaid("");
      setPaymentMethod("");
      setNotes("");
      setSelectedAppointment(null);
    }

    setError("");
    setSuccess("");

    if (mode === "create") {
      const fetchAppointments = async () => {
        try {
          const response = await searchAppointments({
            page: 1,
            limit: 50,
          });

          setAppointments(
            response.filter((appointment: AppointmentSearchResult) =>
              ["scheduled", "completed"].includes(appointment.status.toLowerCase())
            )
          );
        } catch (error) {
          console.error(error);
        }
      };

      fetchAppointments();
    }
  }, [mode, payment, isOpen]);

  // Debounced appointment search
  useEffect(() => {
    if (mode !== "create" || !isOpen) {
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await searchAppointments({
          query: appointmentSearch.trim(),
          appointment_date: filterDate || undefined,
          page: 1,
          limit: 10,
        });

        const filtered = response.filter((appointment: AppointmentSearchResult) =>
          ["scheduled", "completed"].includes(appointment.status.toLowerCase())
        );

        setAppointments(filtered);
      } catch (error) {
        console.error(error);
      }
    };

    const timeout = setTimeout(fetchAppointments, 300);
    return () => clearTimeout(timeout);
  }, [mode, isOpen, appointmentSearch, filterDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (mode === "create" && !selectedAppointment && !appointmentId) {
        setError("Please select an appointment.");
        return;
      }

      if (totalAmount === "" || isNaN(Number(totalAmount)) || Number(totalAmount) < 0) {
        setError("Please enter a valid total amount.");
        return;
      }

      if (amountPaid === "" || isNaN(Number(amountPaid)) || Number(amountPaid) < 0) {
        setError("Please enter a valid paid amount.");
        return;
      }

      if (Number(amountPaid) > Number(totalAmount)) {
        setError("Amount paid cannot be greater than the total amount.");
        return;
      }

      const payload = {
        total_amount: Number(totalAmount),
        amount_paid: Number(amountPaid),
        payment_method: paymentMethod ? (paymentMethod as PaymentMethod) : undefined,
        notes: notes.trim() ? notes : undefined,
      };

      if (mode === "edit") {
        if (!payment) return;
        await updatePayment(payment.id, payload);
        setSuccess("Payment updated successfully!");
      }

      if (mode === "create") {
        await createPayment({
          appointment_id: appointmentId || selectedAppointment?.id!,
          ...payload,
        });
        setSuccess("Payment created successfully!");
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error: any) {
      setError(error?.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const displayAppointments = selectedAppointment ? [selectedAppointment] : appointments;

  return (
    <>
      <style>{`
        .hover-field {
          transition: all 0.2s ease !important;
        }
        .hover-field:hover:not(:focus) {
          border-color: rgba(56, 189, 248, 0.3) !important;
          background: rgba(255, 255, 255, 0.06) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .hover-field:focus {
          border-color: rgba(56, 189, 248, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }

        .hover-appt-card {
          transition: all 0.2s ease !important;
        }
        .hover-appt-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
          border-color: rgba(56, 189, 248, 0.35) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }

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

      <div style={overlayStyle}>
        <div style={modalStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div>
              <h2 style={titleStyle}>
                {mode === "edit" ? "Edit Payment" : "Create Payment"}
              </h2>
              <p style={subtitleStyle}>
                {mode === "edit"
                  ? "Update patient billing and payment information"
                  : "Create a new payment record"}
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

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: 0,
            }}
          >
            <div style={scrollableContainer}>
              
              {/* Appointment Selection for Create Mode */}
              {mode === "create" && !appointmentId && (
                <div>
                  <p style={labelStyle}>Select Appointment</p>

                  {!selectedAppointment && (
                    <div style={searchGrid}>
                      <input
                        type="text"
                        placeholder="Search patient, doctor, phone..."
                        value={appointmentSearch}
                        onChange={(e) => setAppointmentSearch(e.target.value)}
                        className="hover-field"
                        style={searchInput}
                      />

                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="hover-field"
                        style={searchInput}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      display: "grid",
                      gap: "12px",
                      maxHeight: selectedAppointment ? "none" : "260px",
                      overflowY: selectedAppointment ? "visible" : "auto",
                      marginBottom: selectedAppointment ? "24px" : "18px",
                    }}
                  >
                    {displayAppointments.length === 0 ? (
                      <div style={emptyState}>No appointments found</div>
                    ) : (
                      displayAppointments.map((appointment) => {
                        const isSelected = selectedAppointment?.id === appointment.id;

                        return (
                          <div
                            key={appointment.id}
                            className="hover-appt-card"
                            onClick={() => setSelectedAppointment(isSelected ? null : appointment)}
                            style={{
                              ...appointmentCard,
                              border: isSelected
                                ? "1px solid rgba(59,130,246,0.45)"
                                : "1px solid rgba(255,255,255,0.08)",
                              background: isSelected
                                ? "rgba(59,130,246,0.12)"
                                : "rgba(255,255,255,0.03)",
                            }}
                          >
                            <div>
                              <div style={{ color: "#f8fafc", fontWeight: 600 }}>
                                {appointment.patient_name}
                              </div>
                              <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>
                                Dr. {appointment.doctor_name}
                              </div>
                              <div style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>
                                {new Date(appointment.appointment_time).toLocaleString()}
                              </div>
                              <div style={{ color: "#7a9ab8", fontSize: "13px", marginTop: "8px" }}>
                                {appointment.complaint || "No complaint"}
                              </div>
                            </div>

                            <div
                              style={{
                                color: isSelected ? "#38bdf8" : "#64748b",
                                fontWeight: 600,
                              }}
                            >
                              {isSelected ? "Selected" : "Select"}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Payment Fields (Visible if editing or if an appointment is selected) */}
              {(mode === "edit" || selectedAppointment || appointmentId) && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                    <InputField
                      icon={<IndianRupee size={18} />}
                      label="Total Amount"
                      placeholder="0.00"
                      value={totalAmount}
                      onChange={setTotalAmount}
                      type="number"
                    />

                    <InputField
                      icon={<IndianRupee size={18} />}
                      label="Amount Paid"
                      placeholder="0.00"
                      value={amountPaid}
                      onChange={setAmountPaid}
                      type="number"
                    />
                  </div>

                  {/* Payment Method Dropdown */}
                  <div>
                    <p style={labelStyle}>Payment Method</p>
                    <div style={{ position: "relative" }}>
                      <select
                        className="dark-theme-select hover-field"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        style={{
                          ...inputStyle,
                          position: "relative",
                          zIndex: 2,
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <option value="">Select Method</option>
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                      
                      <div style={chevronOverlay}>
                        <ChevronDown size={20} />
                      </div>
                      <div style={selectBackground} />
                    </div>
                  </div>

                  <TextAreaField
                    icon={<FileText size={18} />}
                    label="Payment Notes"
                    placeholder="Optional notes regarding this payment..."
                    value={notes}
                    onChange={setNotes}
                  />
                </>
              )}
            </div>

            {/* Messages */}
            {error && <div style={messageStyle("error")}>{error}</div>}
            {success && <div style={messageStyle("success")}>{success}</div>}

            {/* Actions */}
            <div style={actionRow}>
              <button
                type="submit"
                onMouseEnter={() => setSubmitHovered(true)}
                onMouseLeave={() => setSubmitHovered(false)}
                disabled={loading || success !== ""}
                style={{
                  ...saveButton,
                  background: loading || success !== ""
                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                    : submitHovered
                      ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                      : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  transform: submitHovered && !loading && success === "" ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: submitHovered && !loading && success === "" ? "0 8px 24px rgba(37, 99, 235, 0.4)" : "none",
                  opacity: loading || success !== "" ? 0.7 : 1,
                }}
              >
                <Save size={18} />
                {loading
                  ? "Saving..."
                  : success !== ""
                    ? "Saved!"
                    : mode === "edit"
                      ? "Update Payment"
                      : "Create Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/* ---------- Reusable Components ---------- */

function InputField({ label, icon, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div>
      <p style={labelStyle}>{label}</p>
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
          type={type}
          min={type === "number" ? "0" : undefined}
          step={type === "number" ? "0.01" : undefined}
          className="hover-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingLeft: "46px" }}
        />
      </div>
    </div>
  );
}

function TextAreaField({ label, icon, placeholder, value, onChange }: any) {
  return (
    <div>
      <p style={labelStyle}>{label}</p>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "16px",
            top: "18px",
            color: "#38bdf8",
            pointerEvents: "none",
          }}
        >
          {icon}
        </div>
        <textarea
          className="hover-field"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingLeft: "46px", resize: "vertical", minHeight: "85px" }}
        />
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const overlayStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(10px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  width: "100%",
  maxWidth: "820px",
  maxHeight: "88vh",
  borderRadius: "30px",
  background: "linear-gradient(180deg, rgba(7,15,35,0.98), rgba(2,10,24,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
  padding: "36px",
  position: "relative" as const,
  display: "flex",
  flexDirection: "column" as const,
  overflow: "hidden",
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
  fontSize: "34px",
  fontWeight: 700,
  letterSpacing: "-0.5px",
};

const subtitleStyle = {
  color: "#94a3b8",
  marginTop: "8px",
  fontSize: "15px",
};

const closeButton = {
  width: "48px",
  height: "48px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#d6e2f0",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.25s ease",
  flexShrink: 0,
};

const scrollableContainer = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "18px",
  maxHeight: "58vh",
  overflowY: "auto" as const,
  paddingRight: "8px",
  scrollbarWidth: "thin" as const,
  WebkitOverflowScrolling: "touch" as const,
  overscrollBehavior: "contain" as const,
};

const labelStyle = {
  color: "#94a3b8",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: 500,
};

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "16px",
  color: "#f8fafc",
  outline: "none",
  fontSize: "15px",
  lineHeight: 1.6,
};

const searchGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 220px",
  gap: "14px",
  marginBottom: "18px",
};

const searchInput = {
  ...inputStyle,
  height: "56px",
};

const appointmentCard = {
  padding: "18px",
  borderRadius: "20px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const emptyState = {
  padding: "30px",
  textAlign: "center" as const,
  color: "#64748b",
  border: "1px dashed rgba(255,255,255,0.08)",
  borderRadius: "20px",
};

const actionRow = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "24px",
  paddingTop: "10px",
};

const saveButton = {
  height: "56px",
  padding: "0 26px",
  border: "none",
  borderRadius: "16px",
  color: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontWeight: 600,
  fontSize: "15px",
  transition: "all 0.25s ease",
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

const chevronOverlay = {
  position: "absolute" as const,
  right: "18px",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none" as const,
  display: "flex",
  alignItems: "center",
  color: "#7a9ab8",
  zIndex: 1,
};

const selectBackground = {
  position: "absolute" as const,
  inset: 0,
  background: "rgba(255,255,255,0.03)",
  borderRadius: "18px",
  zIndex: 0,
};
