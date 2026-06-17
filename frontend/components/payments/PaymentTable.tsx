"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

import {
  searchPayments,
  getPaymentById,
  deletePayment,
} from "@/services/payment.service";

import {
  useDashboardDate,
} from "@/hooks/useDashboardDate";

import type {
  Payment,
  PaymentDetails,
} from "@/types/payment";

import PaymentDetailsModal from "@/components/payments/PaymentDetailsModal";
import PaymentFormModal from "@/components/payments/PaymentFormModal";

type Props = {
  searchQuery: string;
  paymentStatus: string;
  refreshKey: number;
};

export default function PaymentTable({
  searchQuery,
  paymentStatus,
  refreshKey,
}: Props) {
  const {
    selectedDate,
  } = useDashboardDate();

  const hasUserChangedDate = useRef(false);

  const [
    payments,
    setPayments,
  ] = useState<
    Payment[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    selectedPayment,
    setSelectedPayment,
  ] = useState<PaymentDetails | null>(
    null
  );

  const [
    isDetailsOpen,
    setIsDetailsOpen,
  ] = useState(false);

  const [
    detailsLoading,
    setDetailsLoading,
  ] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<PaymentDetails | null>(null);

  // --- Delete Modal States ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cancelDeleteHovered, setCancelDeleteHovered] = useState(false);
  const [confirmDeleteHovered, setConfirmDeleteHovered] = useState(false);

  const limit = 10;

  useEffect(() => {
    fetchPayments();
  }, [
    searchQuery,
    paymentStatus,
    selectedDate,
    page,
    refreshKey,
  ]);

  const fetchPayments =
    async () => {
      try {
        setLoading(
          true
        );

        const response =
          await searchPayments(
            {
              query:
                searchQuery ||
                undefined,

              payment_status:
                paymentStatus ||
                undefined,

              appointment_date:
                hasUserChangedDate.current
                  ? selectedDate
                  : undefined,

              page,
              limit,
            }
          );

        setPayments(
          response
        );
      } catch (
      error
      ) {
        console.error(
          error
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    hasUserChangedDate.current =
      true;
  }, [selectedDate]);

  useEffect(() => {
    hasUserChangedDate.current =
      false;
  }, []);

  const handleViewPayment =
    async (
      paymentId: number
    ) => {
      try {
        setIsDetailsOpen(
          true
        );

        setDetailsLoading(
          true
        );

        const response =
          await getPaymentById(
            paymentId
          );

        setSelectedPayment(
          response
        );
      } catch (
      error
      ) {
        console.error(
          error
        );

        setIsDetailsOpen(
          false
        );
      } finally {
        setDetailsLoading(
          false
        );
      }
    };

  // --- Confirm Delete Logic ---
  const confirmDelete = async () => {
    if (!paymentToDelete) return;

    try {
      setIsDeleting(true);
      await deletePayment(paymentToDelete);
      
      // Close modal and refresh table
      setIsDeleteModalOpen(false);
      setPaymentToDelete(null);
      fetchPayments();
    } catch (error) {
      console.error("Failed to delete payment", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatMethod = (
    method:
      | string
      | null
  ) => {
    if (!method) {
      return "-";
    }

    return method
      .replaceAll(
        "_",
        " "
      )
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };

  const getStatusStyle = (
    status:
      | string
      | null
  ) => {
    if (
      status ===
      "paid"
    ) {
      return {
        background:
          "rgba(34,197,94,0.12)",
        color:
          "#4ade80",
        border:
          "1px solid rgba(34,197,94,0.2)",
      };
    }

    return {
      background:
        "rgba(245,158,11,0.12)",
      color:
        "#fbbf24",
      border:
        "1px solid rgba(245,158,11,0.2)",
    };
  };

  if (loading) {
    return (
      <div
        style={
          loadingStyle
        }
      >
        Loading payments...
      </div>
    );
  }

  return (
    <div
      style={
        tableContainer
      }
    >
      <table
        style={
          table
        }
      >
        <thead>
          <tr>
            <th style={th}>
              Patient
            </th>

            <th style={th}>
              Doctor
            </th>

            <th style={th}>
              Amount
            </th>

            <th style={th}>
              Method
            </th>

            <th style={th}>
              Status
            </th>

            <th style={th}>
              Appointment
            </th>

            <th style={th}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {payments.length ===
            0 ? (
            <tr>
              <td
                colSpan={
                  7
                }
                style={
                  emptyState
                }
              >
                No payments found
              </td>
            </tr>
          ) : (
            payments.map(
              (
                payment
              ) => {
                const dueAmount =
                  payment.total_amount -
                  payment.amount_paid;

                const statusStyle =
                  getStatusStyle(
                    payment.payment_status
                  );

                return (
                  <tr
                    key={payment.id}
                    style={row}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(59,130,246,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "transparent";
                    }}
                  >
                    <td
                      style={
                        td
                      }
                    >
                      <div
                        style={{
                          fontWeight:
                            600,
                          color:
                            "#f8fafc",
                        }}
                      >
                        {
                          payment.patient_name
                        }
                      </div>

                      <div
                        style={{
                          color:
                            "#94a3b8",
                          fontSize:
                            "13px",
                        }}
                      >
                        {
                          payment.patient_phone
                        }
                      </div>
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      Dr.{" "}
                      {
                        payment.doctor_name
                      }
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      <div
                        style={{
                          color: "#f8fafc",
                          fontWeight: 600,
                        }}
                      >
                        Total ₹{payment.total_amount}
                      </div>

                      <div
                        style={{
                          color: "#38bdf8",
                          fontSize: "13px",
                          marginTop: "4px",
                        }}
                      >
                        Paid ₹{payment.amount_paid}
                      </div>

                      <div
                        style={{
                          color: "#f59e0b",
                          fontSize: "13px",
                        }}
                      >
                        Due ₹{dueAmount}
                      </div>
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      {
                        formatMethod(
                          payment.payment_method
                        )
                      }
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      <div
                        style={{
                          ...badge,
                          ...statusStyle,
                        }}
                      >
                        {
                          payment.payment_status
                        }
                      </div>
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      {new Date(
                        payment.appointment_time
                      ).toLocaleDateString()}
                    </td>

                    <td
                      style={
                        td
                      }
                    >
                      <button
                        style={viewButton}
                        onClick={() =>
                          handleViewPayment(
                            payment.id
                          )
                        }
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-2px)";

                          e.currentTarget.style.background =
                            "rgba(59,130,246,0.16)";

                          e.currentTarget.style.border =
                            "1px solid rgba(96,165,250,0.45)";

                          e.currentTarget.style.boxShadow =
                            "0 12px 30px rgba(37,99,235,0.18)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0px)";

                          e.currentTarget.style.background =
                            "rgba(59,130,246,0.08)";

                          e.currentTarget.style.border =
                            "1px solid rgba(59,130,246,0.25)";

                          e.currentTarget.style.boxShadow =
                            "none";
                        }}
                      >
                        <FileText size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              }
            )
          )}
        </tbody>
      </table>

      {/* Pagination */}

      <div
        style={{
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() =>
            setPage((prev) =>
              Math.max(prev - 1, 1)
            )
          }
          style={paginationButton}
        >
          <ChevronLeft size={14} />
          Previous
        </button>

        <span
          style={{
            color: "#7a9ab8",
          }}
        >
          Page {page}
        </span>

        <button
          onClick={() =>
            setPage((prev) => prev + 1)
          }
          style={paginationButton}
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>

      <PaymentDetailsModal
        isOpen={
          isDetailsOpen
        }
        onClose={() => {
          setIsDetailsOpen(
            false
          );

          setSelectedPayment(
            null
          );
        }}
        payment={
          selectedPayment
        }
        loading={
          detailsLoading
        }
        onEdit={(payment) => {
          setIsDetailsOpen(false);
          setPaymentToEdit(payment);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          if (selectedPayment) {
            setIsDetailsOpen(false);
            setPaymentToDelete(selectedPayment.id);
            setIsDeleteModalOpen(true);
          }
        }}
      />

      <PaymentFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setPaymentToEdit(null);
        }}
        onSuccess={() => {
          fetchPayments(); 
        }}
        mode="edit"
        payment={paymentToEdit}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div style={overlayStyle}>
          <div style={deleteModalStyle}>
            <div style={deleteIconContainer}>
              <AlertTriangle size={32} color="#ef4444" />
            </div>

            <h3 style={{ color: "#f8fafc", fontSize: "24px", margin: "0 0 12px 0", fontWeight: 700 }}>
              Delete Payment
            </h3>

            <p style={{ color: "#94a3b8", fontSize: "15px", margin: "0 0 28px 0", lineHeight: 1.6 }}>
              Are you sure you want to delete this payment record? This action is permanent and cannot be undone.
            </p>

            <div style={{ display: "flex", gap: "14px", width: "100%" }}>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPaymentToDelete(null);
                }}
                onMouseEnter={() => setCancelDeleteHovered(true)}
                onMouseLeave={() => setCancelDeleteHovered(false)}
                style={{
                  ...cancelButtonStyle,
                  background: cancelDeleteHovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${cancelDeleteHovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                onMouseEnter={() => setConfirmDeleteHovered(true)}
                onMouseLeave={() => setConfirmDeleteHovered(false)}
                style={{
                  ...confirmDeleteStyle,
                  transform: confirmDeleteHovered && !isDeleting ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: confirmDeleteHovered && !isDeleting ? "0 8px 24px rgba(239, 68, 68, 0.25)" : "none",
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Styles ---------- */

const tableContainer = {
  background:
    "rgba(255,255,255,0.03)",
  border:
    "1px solid rgba(255,255,255,0.08)",
  borderRadius:
    "24px",
  overflow: "hidden",
};

const table = {
  width: "100%",
  borderCollapse:
    "collapse" as const,
};

const th = {
  textAlign:
    "left" as const,
  padding: "18px",
  color: "#94a3b8",
  fontSize: "13px",
  fontWeight: 600,
  borderBottom:
    "1px solid rgba(255,255,255,0.08)",
};

const td = {
  padding: "18px",
  color: "#e2e8f0",
  borderBottom:
    "1px solid rgba(255,255,255,0.05)",
};

const row = {
  transition:
    "all 0.2s ease",
};

const badge = {
  padding:
    "6px 12px",
  borderRadius:
    "999px",
  fontSize: "12px",
  fontWeight: 600,
  display:
    "inline-flex",
};

const viewButton = {
  height: "42px",
  padding: "0 16px",
  borderRadius: "14px",
  border:
    "1px solid rgba(59,130,246,0.25)",
  background:
    "rgba(59,130,246,0.08)",
  color: "#60a5fa",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 600,
  transition:
    "all 0.22s ease",
};

const paginationButton = {
  background:
    "rgba(255,255,255,0.04)",

  border:
    "1px solid rgba(255,255,255,0.08)",

  color:
    "#d6e2f0",

  padding:
    "8px 14px",

  borderRadius:
    "14px",

  cursor:
    "pointer",

  display:
    "flex",

  alignItems:
    "center",

  gap: "8px",

  fontSize:
    "12px",
};

const loadingStyle = {
  color: "#94a3b8",
  padding: "40px",
  textAlign:
    "center" as const,
};

const emptyState = {
  padding: "40px",
  textAlign:
    "center" as const,
  color: "#64748b",
};

/* --- Delete Modal Styles --- */

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

const deleteModalStyle = {
  width: "100%",
  maxWidth: "420px",
  background: "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,8,23,0.98))",
  border: "1px solid rgba(239,68,68,0.25)",
  boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
  borderRadius: "28px",
  padding: "36px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  textAlign: "center" as const,
};

const deleteIconContainer = {
  width: "68px",
  height: "68px",
  borderRadius: "50%",
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px",
};

const cancelButtonStyle = {
  flex: 1,
  height: "50px",
  borderRadius: "14px",
  color: "#f8fafc",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "15px",
  transition: "all 0.2s ease",
};

const confirmDeleteStyle = {
  flex: 1,
  height: "50px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "15px",
  transition: "all 0.2s ease",
};
