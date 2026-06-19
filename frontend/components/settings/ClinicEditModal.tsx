"use client";

import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { updateClinicDetails } from "@/services/setting.service";
import type { ClinicDetails, UpdateClinicPayload } from "@/types/setting";
import { useMobile } from "@/hooks/useMobile";

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
  const isMobile = useMobile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [closeHovered, setCloseHovered] = useState(false);
  const [saveHovered, setSaveHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPhoneValid = (val: string) => /^\d{10}$/.test(val);

  useEffect(() => {
    if (!clinic) return;

    setName(clinic.name);
    setEmail(clinic.email);
    setAddress(clinic.address || "");

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

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: isMobile ? "92vw" : "700px",
            maxWidth: "95vw",
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(8,15,30,0.98))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            borderRadius: "32px",
            padding: isMobile ? "24px" : "32px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "24px",
            }}
          >
            <div>
              <h2
                style={{
                  color: "#f8fafc",
                  fontSize: isMobile ? "26px" : "30px",
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "-0.5px",
                }}
              >
                Edit Clinic
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "15px",
                  marginTop: "6px",
                }}
              >
                Update your clinic information
              </p>
            </div>

            <button
              onClick={onClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: closeHovered
                  ? "rgba(239,68,68,0.15)"
                  : "rgba(255,255,255,0.04)",
                borderColor: closeHovered
                  ? "rgba(239,68,68,0.3)"
                  : "rgba(255,255,255,0.08)",
                color: closeHovered ? "#f87171" : "#d6e2f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                transform: closeHovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#f87171",
                padding: "16px",
                borderRadius: "14px",
                marginBottom: "24px",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.25)",
                color: "#4ade80",
                padding: "16px",
                borderRadius: "14px",
                marginBottom: "24px",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              {success}
            </div>
          )}

          {/* Form */}
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#94a3b8",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Clinic Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="hover-field"
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  padding: "0 18px",
                  color: "#f8fafc",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#94a3b8",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Phone (without +91)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit number"
                  className="hover-field"
                  style={{
                    width: "100%",
                    height: "52px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    padding: "0 18px",
                    color: "#f8fafc",
                    outline: "none",
                    fontSize: "15px",
                  }}
                />
                {phone.length > 0 && !isPhoneValid(phone) && (
                  <span
                    style={{
                      display: "block",
                      color: "#f87171",
                      fontSize: "13px",
                      marginTop: "6px",
                      fontWeight: 500,
                    }}
                  >
                    Phone must be exactly 10 digits
                  </span>
                )}
                {isPhoneValid(phone) && (
                  <span
                    style={{
                      display: "block",
                      color: "#4ade80",
                      fontSize: "13px",
                      marginTop: "6px",
                      fontWeight: 500,
                    }}
                  >
                    Valid phone number
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#94a3b8",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="hover-field"
                  style={{
                    width: "100%",
                    height: "52px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    padding: "0 18px",
                    color: "#f8fafc",
                    outline: "none",
                    fontSize: "15px",
                  }}
                />
                {email.length > 0 && !isEmailValid(email) && (
                  <span
                    style={{
                      display: "block",
                      color: "#f87171",
                      fontSize: "13px",
                      marginTop: "6px",
                      fontWeight: 500,
                    }}
                  >
                    Invalid email format
                  </span>
                )}
                {email.length > 0 && isEmailValid(email) && (
                  <span
                    style={{
                      display: "block",
                      color: "#4ade80",
                      fontSize: "13px",
                      marginTop: "6px",
                      fontWeight: 500,
                    }}
                  >
                    Valid email address
                  </span>
                )}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#94a3b8",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="hover-field"
                style={{
                  width: "100%",
                  minHeight: "100px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  padding: "16px 18px",
                  color: "#f8fafc",
                  outline: "none",
                  fontSize: "15px",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "14px",
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <button
              onClick={onClose}
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
              style={{
                height: "48px",
                padding: "0 24px",
                borderRadius: "16px",
                color: "#f8fafc",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: cancelHovered
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${cancelHovered
                  ? "rgba(255, 255, 255, 0.18)"
                  : "rgba(255, 255, 255, 0.08)"
                  }`,
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={
                loading || !isPhoneValid(phone) || !isEmailValid(email)
              }
              onMouseEnter={() => setSaveHovered(true)}
              onMouseLeave={() => setSaveHovered(false)}
              style={{
                height: "48px",
                padding: "0 26px",
                borderRadius: "16px",
                border: "none",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                background: loading
                  ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                  : saveHovered
                    ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                    : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                opacity:
                  loading || !isPhoneValid(phone) || !isEmailValid(email)
                    ? 0.6
                    : 1,
                transform:
                  saveHovered &&
                    !loading &&
                    isPhoneValid(phone) &&
                    isEmailValid(email)
                    ? "translateY(-2px)"
                    : "translateY(0)",
                boxShadow:
                  saveHovered &&
                    !loading &&
                    isPhoneValid(phone) &&
                    isEmailValid(email)
                    ? "0 8px 20px rgba(37, 99, 235, 0.4)"
                    : "none",
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
