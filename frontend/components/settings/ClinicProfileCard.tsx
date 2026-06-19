"use client";

import { Building2, Phone, Mail, MapPin } from "lucide-react";
import type { ClinicDetails } from "@/types/setting";
import { useMobile } from "@/hooks/useMobile";

type Props = {
  clinic: ClinicDetails;
};

export default function ClinicProfileCard({ clinic }: Props) {
  const isMobile = useMobile();

  return (
    <>
      <style>{`
        .hover-subcard {
          transition: all 0.2s ease !important;
        }
        .hover-subcard:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(56, 189, 248, 0.2) !important;
          transform: translateY(-2px);
        }
      `}</style>

      <div
        className="hover-card"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "28px",
          padding: isMobile ? "24px" : "32px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(56,189,248,0.12)",
              color: "#38bdf8",
              flexShrink: 0,
            }}
          >
            <Building2 size={34} />
          </div>

          <div>
            <h2
              style={{
                color: "#f8fafc",
                fontSize: isMobile ? "24px" : "28px",
                fontWeight: 700,
                margin: 0,
              }}
            >
              {clinic.name}
            </h2>
            <p
              style={{
                color: "#94a3b8",
                marginTop: "6px",
                fontSize: "14px",
              }}
            >
              Clinic Profile
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "18px",
          }}
        >
          <div
            className="hover-subcard"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              padding: "18px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.04)",
                color: "#38bdf8",
                flexShrink: 0,
              }}
            >
              <Phone size={18} />
            </div>
            <div>
              <div
                style={{
                  color: "#7a9ab8",
                  fontSize: "13px",
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
              >
                Phone
              </div>
              <div
                style={{
                  color: "#f8fafc",
                  fontSize: "15px",
                  fontWeight: 500,
                  wordBreak: "break-word",
                }}
              >
                {clinic.phone}
              </div>
            </div>
          </div>

          <div
            className="hover-subcard"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              padding: "18px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.04)",
                color: "#38bdf8",
                flexShrink: 0,
              }}
            >
              <Mail size={18} />
            </div>
            <div>
              <div
                style={{
                  color: "#7a9ab8",
                  fontSize: "13px",
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
              >
                Email
              </div>
              <div
                style={{
                  color: "#f8fafc",
                  fontSize: "15px",
                  fontWeight: 500,
                  wordBreak: "break-word",
                }}
              >
                {clinic.email}
              </div>
            </div>
          </div>

          <div
            className="hover-subcard"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              padding: "18px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              gridColumn: "1 / -1", // Stretch across full width
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.04)",
                color: "#38bdf8",
                flexShrink: 0,
              }}
            >
              <MapPin size={18} />
            </div>
            <div>
              <div
                style={{
                  color: "#7a9ab8",
                  fontSize: "13px",
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
              >
                Address
              </div>
              <div
                style={{
                  color: "#f8fafc",
                  fontSize: "15px",
                  fontWeight: 500,
                  wordBreak: "break-word",
                }}
              >
                {clinic.address || "No address provided"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
