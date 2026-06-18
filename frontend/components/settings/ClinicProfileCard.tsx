"use client";

import {
  Building2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

import type {
  ClinicDetails,
} from "@/types/setting";

type Props = {
  clinic: ClinicDetails;
};

export default function ClinicProfileCard({ clinic }: Props) {
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
      
      <div className="hover-card" style={card}>
        {/* Header */}
        <div style={header}>
          <div style={iconContainer}>
            <Building2 size={34} />
          </div>

          <div>
            <h2 style={title}>
              {clinic.name}
            </h2>
            <p style={subtitle}>
              Clinic Profile
            </p>
          </div>
        </div>

        {/* Details */}
        <div style={detailsGrid}>
          <div className="hover-subcard" style={infoCard}>
            <div style={infoIcon}>
              <Phone size={18} />
            </div>
            <div>
              <div style={label}>Phone</div>
              <div style={value}>{clinic.phone}</div>
            </div>
          </div>

          <div className="hover-subcard" style={infoCard}>
            <div style={infoIcon}>
              <Mail size={18} />
            </div>
            <div>
              <div style={label}>Email</div>
              <div style={value}>{clinic.email}</div>
            </div>
          </div>

          <div className="hover-subcard" style={{ ...infoCard, gridColumn: "1 / -1" }}>
            <div style={infoIcon}>
              <MapPin size={18} />
            </div>
            <div>
              <div style={label}>Address</div>
              <div style={value}>{clinic.address || "No address provided"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const card = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "28px",
  padding: "32px",
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px",
};

const iconContainer = {
  width: "72px",
  height: "72px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(56,189,248,0.12)",
  color: "#38bdf8",
};

const title = {
  color: "#f8fafc",
  fontSize: "28px",
  fontWeight: 700,
  margin: 0,
};

const subtitle = {
  color: "#94a3b8",
  marginTop: "6px",
  fontSize: "14px",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "18px",
};

const infoCard = {
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  padding: "18px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
};

const infoIcon = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.04)",
  color: "#38bdf8",
  flexShrink: 0,
};

const label = {
  color: "#7a9ab8",
  fontSize: "13px",
  marginBottom: "4px",
  fontWeight: 500,
};

const value = {
  color: "#f8fafc",
  fontSize: "15px",
  fontWeight: 500,
  wordBreak: "break-word" as const,
};