"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
  Save,
  FileText,
} from "lucide-react";

import {
  updateTreatment,
  createTreatment,
} from "@/services/treatment.service";

import {
  searchAppointments,
} from "@/services/appointment.service";

import type {
  TreatmentDetails,
} from "@/types/treatment";

import type {
  AppointmentSearchResult,
} from "@/types/appointment";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;

  mode:
  | "create"
  | "edit";

  treatment?:
  | TreatmentDetails
  | null;

  appointmentId?: number;
};

export default function TreatmentFormModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  treatment,
  appointmentId,
}: Props) {
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPerformed, setTreatmentPerformed] = useState("");
  const [medicinesPrescribed, setMedicinesPrescribed] = useState("");
  const [procedureNotes, setProcedureNotes] = useState("");
  const [followUpInstructions, setFollowUpInstructions] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [
    appointments,
    setAppointments,
  ] = useState<
    AppointmentSearchResult[]
  >([]);

  const [
    appointmentSearch,
    setAppointmentSearch,
  ] = useState("");

  const [
    filterDate,
    setFilterDate,
  ] = useState("");

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] =
    useState<AppointmentSearchResult | null>(
      null
    );

  // Hover states for interactive buttons
  const [closeHovered, setCloseHovered] = useState(false);
  const [submitHovered, setSubmitHovered] = useState(false);

  useEffect(() => {
    if (
      mode === "edit" &&
      treatment
    ) {
      setDiagnosis(treatment.diagnosis || "");
      setTreatmentPerformed(treatment.treatment_performed || "");
      setMedicinesPrescribed(treatment.medicines_prescribed || "");
      setProcedureNotes(treatment.procedure_notes || "");
      setFollowUpInstructions(treatment.follow_up_instructions || "");
    } else {
      setDiagnosis("");
      setTreatmentPerformed("");
      setMedicinesPrescribed("");
      setProcedureNotes("");
      setFollowUpInstructions("");
      setSelectedAppointment(null);
    }

    setError("");
    setSuccess("");

    if (
      mode ===
      "create"
    ) {
      const fetchAppointments =
        async () => {
          try {
            const response =
              await searchAppointments(
                {
                  page: 1,
                  limit: 50,
                }
              );

            setAppointments(
              response.filter(
                (
                  appointment: AppointmentSearchResult
                ) =>
                  [
                    "scheduled",
                    "completed",
                  ].includes(
                    appointment.status.toLowerCase()
                  )
              )
            );
          } catch (
          error
          ) {
            console.error(
              error
            );
          }
        };

      fetchAppointments();
    }
  }, [mode, treatment, isOpen]);

  useEffect(() => {
    if (
      mode !== "create" ||
      !isOpen
    ) {
      return;
    }

    const fetchAppointments =
      async () => {
        try {
          const response =
            await searchAppointments({
              query:
                appointmentSearch.trim(),

              appointment_date:
                filterDate ||
                undefined,

              page: 1,
              limit: 10,
            });

          const filtered =
            response.filter(
              (
                appointment: AppointmentSearchResult
              ) =>
                [
                  "scheduled",
                  "completed",
                ].includes(
                  appointment.status.toLowerCase()
                )
            );

          setAppointments(
            filtered
          );
        } catch (
        error
        ) {
          console.error(
            error
          );
        }
      };

    const timeout =
      setTimeout(
        fetchAppointments,
        300
      );

    return () =>
      clearTimeout(
        timeout
      );
  }, [
    mode,
    isOpen,
    appointmentSearch,
    filterDate,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (
        mode ===
        "create" &&
        !selectedAppointment
      ) {
        setError(
          "Please select an appointment"
        );

        return;
      }

      if (!diagnosis.trim()) {
        setError("Diagnosis is required");
        return;
      }

      if (!treatmentPerformed.trim()) {
        setError("Treatment performed is required");
        return;
      }

      const payload = {
        diagnosis,
        treatment_performed: treatmentPerformed,
        medicines_prescribed: medicinesPrescribed.trim()
          ? medicinesPrescribed
          : undefined,
        procedure_notes: procedureNotes.trim()
          ? procedureNotes
          : undefined,
        follow_up_instructions: followUpInstructions.trim()
          ? followUpInstructions
          : undefined,
      };

      if (mode === "edit") {
        if (!treatment) {
          return;
        }

        await updateTreatment(treatment.id, payload);
        setSuccess("Treatment updated successfully!");
      }

      if (mode === "create") {
        await createTreatment({
          appointment_id: selectedAppointment?.id!,
          ...payload,
        });

        setSuccess("Treatment created successfully!");
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (error: any) {
      setError(
        error?.response?.data?.detail || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  // Only display the selected appointment if one is selected, otherwise show all filtered appointments
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
      `}</style>

      <div style={overlayStyle}>
        <div style={modalStyle}>
          {/* Header */}
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
                {mode === "edit" ? "Edit Treatment" : "Create Treatment"}
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "8px",
                  fontSize: "15px",
                }}
              >
                {mode === "edit"
                  ? "Update treatment information"
                  : "Create a new treatment record"}
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
            <div
              style={{
                display: "grid",
                gap: "18px",
                maxHeight: "58vh",
                overflowY: "auto",
                paddingRight: "8px",
                scrollbarWidth: "thin",
              }}
            >
              {mode ===
                "create" && (
                  <div>
                    <p
                      style={{
                        color:
                          "#94a3b8",
                        marginBottom:
                          "10px",
                        fontSize:
                          "14px",
                        fontWeight:
                          600,
                      }}
                    >
                      Select
                      Appointment
                    </p>

                    {/* Hide search inputs if an appointment is already selected to keep it clean */}
                    {!selectedAppointment && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "1fr 220px",
                          gap: "14px",
                          marginBottom: "18px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Search patient, doctor, phone..."
                          value={
                            appointmentSearch
                          }
                          onChange={(e) =>
                            setAppointmentSearch(
                              e.target.value
                            )
                          }
                          className="hover-field"
                          style={{
                            ...searchInput,
                          }}
                        />

                        <input
                          type="date"
                          value={filterDate}
                          onChange={(e) =>
                            setFilterDate(
                              e.target.value
                            )
                          }
                          className="hover-field"
                          style={{
                            ...searchInput,
                          }}
                        />
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gap: "12px",
                        maxHeight: selectedAppointment ? "none" : "260px",
                        overflowY: selectedAppointment ? "visible" : "auto",
                      }}
                    >
                      {displayAppointments.length ===
                        0 ? (
                        <div
                          style={{
                            padding: "30px",
                            textAlign:
                              "center",
                            color:
                              "#64748b",
                            border:
                              "1px dashed rgba(255,255,255,0.08)",
                            borderRadius:
                              "20px",
                          }}
                        >
                          No appointments found
                        </div>
                      ) : (
                        displayAppointments.map(
                          (
                            appointment: AppointmentSearchResult
                          ) => {
                            const isSelected =
                              selectedAppointment?.id ===
                              appointment.id;

                            return (
                              <div
                                key={
                                  appointment.id
                                }
                                className="hover-appt-card"
                                onClick={() =>
                                  setSelectedAppointment(
                                    isSelected ? null : appointment
                                  )
                                }
                                style={{
                                  ...appointmentCard,
                                  border:
                                    isSelected
                                      ? "1px solid rgba(59,130,246,0.45)"
                                      : "1px solid rgba(255,255,255,0.08)",

                                  background:
                                    isSelected
                                      ? "rgba(59,130,246,0.12)"
                                      : "rgba(255,255,255,0.03)",
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      color:
                                        "#f8fafc",
                                      fontWeight:
                                        600,
                                    }}
                                  >
                                    {
                                      appointment.patient_name
                                    }
                                  </div>

                                  <div
                                    style={{
                                      color:
                                        "#94a3b8",
                                      fontSize:
                                        "14px",
                                      marginTop:
                                        "4px",
                                    }}
                                  >
                                    Dr.{" "}
                                    {
                                      appointment.doctor_name
                                    }
                                  </div>

                                  <div
                                    style={{
                                      color:
                                        "#64748b",
                                      fontSize:
                                        "13px",
                                      marginTop:
                                        "6px",
                                    }}
                                  >
                                    {new Date(
                                      appointment.appointment_time
                                    ).toLocaleString()}
                                  </div>

                                  <div
                                    style={{
                                      color:
                                        "#7a9ab8",
                                      fontSize:
                                        "13px",
                                      marginTop:
                                        "8px",
                                    }}
                                  >
                                    {
                                      appointment.complaint ||
                                      "No complaint"
                                    }
                                  </div>
                                </div>

                                <div
                                  style={{
                                    color:
                                      isSelected
                                        ? "#38bdf8"
                                        : "#64748b",
                                    fontWeight:
                                      600,
                                  }}
                                >
                                  {isSelected
                                    ? "Selected"
                                    : "Select"}
                                </div>
                              </div>
                            );
                          }
                        )
                      )}
                    </div>

                    {selectedAppointment && (
                      <div
                        style={
                          infoCard
                        }
                      >
                        <div>
                          <strong>
                            Patient:
                          </strong>{" "}
                          {
                            selectedAppointment.patient_name
                          }
                          {" ("}
                          {
                            selectedAppointment.patient_age
                          }
                          {")"}
                        </div>

                        <div>
                          <strong>
                            Doctor:
                          </strong>{" "}
                          Dr.{" "}
                          {
                            selectedAppointment.doctor_name
                          }
                        </div>

                        <div>
                          <strong>
                            Time:
                          </strong>{" "}
                          {new Date(
                            selectedAppointment.appointment_time
                          ).toLocaleString()}
                        </div>

                        <div>
                          <strong>
                            Complaint:
                          </strong>{" "}
                          {
                            selectedAppointment.complaint ||
                            "No complaint"
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {(
                mode === "edit" ||
                selectedAppointment
              ) && (
                  <>
                    <TextAreaField
                      label="Diagnosis"
                      value={diagnosis}
                      onChange={setDiagnosis}
                    />

                    <TextAreaField
                      label="Treatment Performed"
                      value={treatmentPerformed}
                      onChange={setTreatmentPerformed}
                    />

                    <TextAreaField
                      label="Medicines Prescribed"
                      value={medicinesPrescribed}
                      onChange={setMedicinesPrescribed}
                    />

                    <TextAreaField
                      label="Procedure Notes"
                      value={procedureNotes}
                      onChange={setProcedureNotes}
                    />

                    <TextAreaField
                      label="Follow Up Instructions"
                      value={followUpInstructions}
                      onChange={setFollowUpInstructions}
                    />
                  </>
                )}
            </div>

            {/* Messages */}
            {error && (
              <div
                style={{
                  color:
                    "#f87171",
                  marginTop:
                    "20px",
                }}
              >
                {
                  error
                }
              </div>
            )}

            {success && (
              <div
                style={{
                  color:
                    "#4ade80",
                  marginTop:
                    "20px",
                }}
              >
                {
                  success
                }
              </div>
            )}

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "flex-end",
                marginTop:
                  "28px",
              }}
            >
              <button
                type="submit"
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
                disabled={
                  loading || success !== ""
                }
                onMouseEnter={() => setSubmitHovered(true)}
                onMouseLeave={() => setSubmitHovered(false)}
              >
                <Save
                  size={
                    18
                  }
                />

                {loading
                  ? "Saving..."
                  : success !== ""
                    ? "Saved!"
                    : mode ===
                      "edit"
                      ? "Update Treatment"
                      : "Create Treatment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: any) {
  return (
    <div>
      <p
        style={{
          color:
            "#94a3b8",
          marginBottom:
            "8px",
        }}
      >
        {label}
      </p>

      <textarea
        className="hover-field"
        rows={3}
        value={
          value
        }
        onChange={(
          e
        ) =>
          onChange(
            e.target
              .value
          )
        }
        style={
          inputStyle
        }
      />
    </div>
  );
}

const overlayStyle = {
  position:
    "fixed" as const,
  inset: 0,
  background:
    "rgba(0,0,0,0.7)",
  backdropFilter:
    "blur(10px)",
  display:
    "flex",
  alignItems:
    "center",
  justifyContent:
    "center",
  zIndex:
    9999,
};

const modalStyle = {
  width: "100%",
  maxWidth: "820px",

  maxHeight: "88vh",

  borderRadius: "30px",

  background:
    "linear-gradient(180deg, rgba(7,15,35,0.98), rgba(2,10,24,0.98))",

  border:
    "1px solid rgba(255,255,255,0.08)",

  boxShadow:
    "0 40px 90px rgba(0,0,0,0.55)",

  padding: "28px",

  position: "relative" as const,

  display: "flex",
  flexDirection: "column" as const,

  overflow: "hidden",
};

const headerStyle = {
  display:
    "flex",
  justifyContent:
    "space-between",
  alignItems:
    "center",
  marginBottom:
    "28px",
};

const closeButton = {
  width:
    "50px",

  height:
    "50px",

  borderRadius:
    "18px",

  border:
    "1px solid rgba(255,255,255,0.08)",

  background:
    "rgba(255,255,255,0.04)",

  color:
    "#d6e2f0",

  cursor:
    "pointer",

  display:
    "flex",

  alignItems:
    "center",

  justifyContent:
    "center",

  transition:
    "all 0.25s ease",
};

const inputStyle = {
  width:
    "100%",

  background:
    "rgba(255,255,255,0.04)",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius:
    "18px",

  padding:
    "16px",

  color:
    "#f8fafc",

  outline:
    "none",

  resize:
    "vertical" as const,

  minHeight:
    "95px",

  fontSize:
    "15px",

  lineHeight:
    1.6,

  transition:
    "all 0.22s ease",
};

const saveButton = {
  height:
    "56px",

  padding:
    "0 26px",

  border:
    "none",

  borderRadius:
    "18px",

  background:
    "linear-gradient(135deg, #2563eb, #1d4ed8)",

  color:
    "white",

  cursor:
    "pointer",

  display:
    "flex",

  alignItems:
    "center",

  gap:
    "8px",

  fontWeight:
    600,

  fontSize:
    "15px",

  transition:
    "all 0.25s ease",
};

const searchInput = {
  width: "100%",
  height: "56px",
  borderRadius: "18px",
  border:
    "1px solid rgba(255,255,255,0.08)",
  background:
    "rgba(255,255,255,0.04)",
  padding: "0 18px",
  color: "#f8fafc",
  outline: "none",
  fontSize: "14px",
};

const appointmentCard = {
  padding: "18px",
  borderRadius: "20px",
  cursor: "pointer",
  transition:
    "all 0.2s ease",
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
};

const infoCard = {
  marginTop: "18px",

  padding: "18px",

  borderRadius: "20px",

  background:
    "linear-gradient(180deg, rgba(59,130,246,0.08), rgba(59,130,246,0.04))",

  border:
    "1px solid rgba(59,130,246,0.18)",

  color:
    "#d6e2f0",

  display:
    "grid",

  gap: "10px",

  fontSize:
    "14px",
};
