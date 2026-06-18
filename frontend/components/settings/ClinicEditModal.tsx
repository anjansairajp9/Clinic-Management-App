"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
  Save,
} from "lucide-react";

import {
  updateClinicDetails,
} from "@/services/setting.service";

import type {
  ClinicDetails,
  UpdateClinicPayload,
} from "@/types/setting";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clinic: ClinicDetails | null;
};

export default function ClinicEditModal({
  isOpen,
  onClose,
  onSuccess,
  clinic,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Hover states for buttons
  const [closeHovered, setCloseHovered] = useState(false);
  const [saveHovered, setSaveHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);

  // Validation functions
  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPhoneValid = (val: string) => /^\d{10}$/.test(val);

  useEffect(() => {
    if (!clinic) return;

    setName(clinic.name);
    setEmail(clinic.email);
    setAddress(clinic.address || "");

    // Strip +91 on load so the user just sees their 10 digit number
    let initialPhone = clinic.phone || "";
    if (initialPhone.startsWith("+91")) {
      initialPhone = initialPhone.substring(3);
    } else if (initialPhone.startsWith("91") && initialPhone.length === 12) {
      initialPhone = initialPhone.substring(2);
    }
    setPhone(initialPhone);
    
    setError("");
    setSuccess("");
  }, [clinic, isOpen]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 10
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!isEmailValid(email)) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      if (!isPhoneValid(phone)) {
        setError("Please enter a valid 10-digit phone number.");
        setLoading(false);
        return;
      }

      // Re-append +91 on save
      const formattedPhone = phone.length === 10 ? `+91${phone}` : phone;

      const payload: UpdateClinicPayload = {
        name,
        phone: formattedPhone,
        email,
        address,
      };

      await updateClinicDetails(payload);

      setSuccess("Clinic details updated successfully");

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error: any) {
      setError(
        error?.response?.data?.detail || "Failed to update clinic details"
      );
    } finally {
      setLoading(false);
    }
  };

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
      `}</style>

      <div style={overlay}>
        <div style={modal}>
          {/* Header */}
          <div style={header}>
            <div>
              <h2 style={title}>Edit Clinic</h2>
              <p style={subtitle}>Update your clinic information</p>
            </div>

            <button
              onClick={onClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                ...closeButton,
                background: closeHovered ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                borderColor: closeHovered ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)",
                color: closeHovered ? "#f87171" : "#d6e2f0",
                transform: closeHovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          {error && <div style={errorBox}>{error}</div>}
          {success && <div style={successBox}>{success}</div>}

          {/* Form */}
          <div style={formGrid}>
            <div>
              <label style={label}>Clinic Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="hover-field"
                style={input}
              />
            </div>

            <div>
              <label style={label}>Phone (without +91)</label>
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="10-digit number"
                className="hover-field"
                style={input}
              />
              {/* Inline Validation */}
              {phone.length > 0 && !isPhoneValid(phone) && (
                <span style={inlineError}>Phone must be exactly 10 digits</span>
              )}
              {isPhoneValid(phone) && (
                <span style={inlineSuccess}>Valid phone number</span>
              )}
            </div>

            <div>
              <label style={label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="hover-field"
                style={input}
              />
              {/* Inline Validation */}
              {email.length > 0 && !isEmailValid(email) && (
                <span style={inlineError}>Invalid email format</span>
              )}
              {email.length > 0 && isEmailValid(email) && (
                <span style={inlineSuccess}>Valid email address</span>
              )}
            </div>

            <div>
              <label style={label}>Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="hover-field"
                style={textarea}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={footer}>
            <button
              onClick={onClose}
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
              style={{
                ...cancelButton,
                background: cancelHovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${cancelHovered ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.08)"}`,
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || !isPhoneValid(phone) || !isEmailValid(email)}
              onMouseEnter={() => setSaveHovered(true)}
              onMouseLeave={() => setSaveHovered(false)}
              style={{
                ...saveButton,
                background: loading 
                  ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                  : saveHovered 
                    ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                    : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                opacity: (loading || !isPhoneValid(phone) || !isEmailValid(email)) ? 0.6 : 1,
                transform: (saveHovered && !loading && isPhoneValid(phone) && isEmailValid(email)) ? "translateY(-2px)" : "translateY(0)",
                boxShadow: (saveHovered && !loading && isPhoneValid(phone) && isEmailValid(email)) ? "0 8px 20px rgba(37, 99, 235, 0.4)" : "none",
              }}
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Styles ---------- */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.72)",
  backdropFilter: "blur(12px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modal = {
  width: "700px", // Reverted to the original larger width
  maxWidth: "95vw",
  background: "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(8,15,30,0.98))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
  borderRadius: "32px",
  padding: "32px", // Slightly reduced padding to save height
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start", 
  marginBottom: "24px", // Tightened up the margin
};

const title = {
  color: "#f8fafc",
  fontSize: "30px",
  fontWeight: 700,
  margin: 0,
  letterSpacing: "-0.5px",
};

const subtitle = {
  color: "#94a3b8",
  fontSize: "15px",
  marginTop: "6px",
};

const closeButton = {
  width: "46px",
  height: "46px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#f8fafc",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};

const formGrid = {
  display: "grid",
  gap: "18px", // Reduced gap to save height
};

const label = {
  display: "block",
  marginBottom: "8px",
  color: "#94a3b8",
  fontSize: "14px",
  fontWeight: 500,
};

const input = {
  width: "100%",
  height: "52px", // Slightly reduced height
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  padding: "0 18px",
  color: "#f8fafc",
  outline: "none",
  fontSize: "15px",
};

const textarea = {
  width: "100%",
  minHeight: "100px", // Reduced minHeight for the textarea
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  padding: "16px 18px",
  color: "#f8fafc",
  outline: "none",
  fontSize: "15px",
  resize: "vertical" as const,
  lineHeight: 1.6,
};

const inlineError = {
  display: "block",
  color: "#f87171",
  fontSize: "13px",
  marginTop: "6px",
  fontWeight: 500,
};

const inlineSuccess = {
  display: "block",
  color: "#4ade80",
  fontSize: "13px",
  marginTop: "6px",
  fontWeight: 500,
};

const footer = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "14px",
  marginTop: "24px", // Tightened margin
  paddingTop: "20px", // Tightened padding
  borderTop: "1px solid rgba(255,255,255,0.06)",
};

const cancelButton = {
  height: "48px", // Reduced button height slightly
  padding: "0 24px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#f8fafc",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const saveButton = {
  height: "48px", // Reduced button height slightly
  padding: "0 26px",
  borderRadius: "16px",
  border: "none",
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontWeight: 600,
  fontSize: "15px",
  cursor: "pointer",
  transition: "all 0.25s ease",
};

const errorBox = {
  background: "rgba(239,68,68,0.12)",
  border: "1px solid rgba(239,68,68,0.25)",
  color: "#f87171",
  padding: "16px",
  borderRadius: "14px",
  marginBottom: "24px",
  fontWeight: 500,
  fontSize: "14px",
};

const successBox = {
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(34,197,94,0.25)",
  color: "#4ade80",
  padding: "16px",
  borderRadius: "14px",
  marginBottom: "24px",
  fontWeight: 500,
  fontSize: "14px",
};