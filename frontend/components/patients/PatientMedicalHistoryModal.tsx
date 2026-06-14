"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
  Save,
  FileHeart,
} from "lucide-react";

type MedicalHistory = {
  allergies?: string;
  blood_group?: string;
  medical_conditions?: string;
  current_medications?: string;
  past_surgeries?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: MedicalHistory
  ) => Promise<void>;

  initialData?:
  | MedicalHistory
  | null;

  loading?: boolean;
};

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export default function PatientMedicalHistoryModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  loading = false,
}: Props) {
  const [allergies, setAllergies] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [pastSurgeries, setPastSurgeries] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Hover states for buttons
  const [closeHovered, setCloseHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);
  const [saveHovered, setSaveHovered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAllergies(initialData?.allergies || "");
      setBloodGroup(initialData?.blood_group || "");
      setMedicalConditions(initialData?.medical_conditions || "");
      setCurrentMedications(initialData?.current_medications || "");
      setPastSurgeries(initialData?.past_surgeries || "");
      setEmergencyContactName(initialData?.emergency_contact_name || "");
      setEmergencyContactPhone(initialData?.emergency_contact_phone || "");
      setNotes(initialData?.notes || "");
      setError("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      emergencyContactPhone &&
      !/^\d{10}$/.test(emergencyContactPhone)
    ) {
      setError("Emergency contact phone must be a valid 10-digit number");
      return;
    }

    await onSave({
      allergies,
      blood_group: bloodGroup,
      medical_conditions: medicalConditions,
      current_medications: currentMedications,
      past_surgeries: pastSurgeries,
      emergency_contact_name: emergencyContactName,
      emergency_contact_phone: emergencyContactPhone,
      notes,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* CSS injected to style native dropdown options and field hovers */}
      <style>{`
        .hover-field {
          transition: all 0.2s ease !important;
        }
        .hover-field:hover:not(:focus) {
          border-color: rgba(96, 165, 250, 0.4) !important;
          background: rgba(255, 255, 255, 0.08) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
        }
        .hover-field:focus {
          border-color: rgba(96, 165, 250, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15) !important;
          background: rgba(255, 255, 255, 0.06) !important;
        }
        
        .dark-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 16px center !important;
          padding-right: 40px !important;
        }
        .dark-select option {
          background: #0f172a !important; /* Dark background for options */
          color: #f8fafc !important;     /* Light text */
          padding: 12px !important;
        }
        .dark-select option:hover, 
        .dark-select option:checked {
          background: #1e293b !important;
          color: #60a5fa !important;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: "min(900px, 92vw)",
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "34px",
            padding: "34px",
            background: "linear-gradient(180deg, rgba(5,15,35,0.98), rgba(2,8,23,0.98))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FileHeart size={34} color="#60a5fa" />
                <h2
                  style={{
                    color: "#f8fafc",
                    fontSize: "32px",
                    margin: 0,
                  }}
                >
                  Medical History
                </h2>
              </div>

              <p
                style={{
                  color: "#8ea4c8",
                  marginTop: "10px",
                }}
              >
                Update patient medical information
              </p>
            </div>

            <button
              onClick={onClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                border: `1px solid ${closeHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
                background: closeHovered ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
                color: closeHovered ? "#f8fafc" : "#d6e2f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                transform: closeHovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              <X />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <InputField
                label="Allergies"
                value={allergies}
                onChange={setAllergies}
              />

              <SelectField
                label="Blood Group"
                value={bloodGroup}
                onChange={setBloodGroup}
                options={BLOOD_GROUPS}
              />

              <InputField
                label="Medical Conditions"
                value={medicalConditions}
                onChange={setMedicalConditions}
              />

              <InputField
                label="Current Medications"
                value={currentMedications}
                onChange={setCurrentMedications}
              />

              <InputField
                label="Past Surgeries"
                value={pastSurgeries}
                onChange={setPastSurgeries}
              />

              <InputField
                label="Emergency Contact Name"
                value={emergencyContactName}
                onChange={setEmergencyContactName}
              />

              <InputField
                label="Emergency Contact Phone"
                value={emergencyContactPhone}
                onChange={setEmergencyContactPhone}
              />

              <div style={{ gridColumn: "1 / -1" }}>
                <TextAreaField
                  label="Notes"
                  value={notes}
                  onChange={setNotes}
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  color: "#f87171",
                  marginTop: "20px",
                }}
              >
                {error}
              </div>
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
                type="button"
                onClick={onClose}
                onMouseEnter={() => setCancelHovered(true)}
                onMouseLeave={() => setCancelHovered(false)}
                style={{
                  height: "54px",
                  padding: "0 24px",
                  borderRadius: "16px",
                  border: `1px solid ${cancelHovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}`,
                  background: cancelHovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                  color: cancelHovered ? "#ffffff" : "#f8fafc",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  transform: cancelHovered ? "translateY(-1px)" : "translateY(0)",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setSaveHovered(true)}
                onMouseLeave={() => setSaveHovered(false)}
                style={{
                  height: "54px",
                  padding: "0 24px",
                  border: "none",
                  borderRadius: "16px",
                  background: loading 
                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                    : saveHovered 
                      ? "linear-gradient(135deg, #3b82f6, #2563eb)" 
                      : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: 600,
                  opacity: loading ? 0.7 : 1,
                  transition: "all 0.2s ease",
                  transform: saveHovered && !loading ? "translateY(-1px)" : "translateY(0)",
                  boxShadow: saveHovered && !loading ? "0 6px 20px rgba(37, 99, 235, 0.4)" : "none",
                }}
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Medical History"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function InputField({ label, value, onChange }: any) {
  return (
    <div>
      <p style={labelStyle}>{label}</p>
      <input
        className="hover-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: any) {
  return (
    <div>
      <p style={labelStyle}>{label}</p>
      <textarea
        className="hover-field"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle,
          resize: "vertical",
        }}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: any) {
  return (
    <div>
      <p style={labelStyle}>{label}</p>
      <select
        className="dark-select hover-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select Blood Group</option>
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

const labelStyle = {
  color: "#94a3b8",
  fontSize: "14px",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  padding: "14px 16px",
  color: "#f8fafc",
  fontSize: "15px",
  outline: "none",
};