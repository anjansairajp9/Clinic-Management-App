"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Settings,
  Edit,
} from "lucide-react";

import {
  getClinicDetails,
} from "@/services/setting.service";

import type {
  ClinicDetails,
} from "@/types/setting";

import ClinicProfileCard from "@/components/settings/ClinicProfileCard";
import ClinicEditModal from "@/components/settings/ClinicEditModal";

export default function SettingsPage() {
  const [clinic, setClinic] = useState<ClinicDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Hover state for edit button
  const [editHovered, setEditHovered] = useState(false);

  const fetchClinic = async () => {
    try {
      setLoading(true);
      const response = await getClinicDetails();
      setClinic(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinic();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "32px", color: "#94a3b8" }}>
        Loading settings...
      </div>
    );
  }

  if (!clinic) {
    return (
      <div style={{ padding: "32px", color: "#ef4444" }}>
        Failed to load clinic details.
      </div>
    );
  }

  return (
    <>
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

      <div style={{ padding: "20px 32px 32px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            marginTop: "-30px",
          }}
        >
          <div>
            <h1
              style={{
                color: "#f8fafc",
                fontSize: "30px",
                fontWeight: 700,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Settings size={28} />
              Settings
            </h1>

            <p
              style={{
                color: "#8ea4c8",
                marginTop: "6px",
                fontSize: "14px",
              }}
            >
              Manage clinic profile and account information.
            </p>
          </div>

          <button
            onClick={() => setIsEditOpen(true)}
            onMouseEnter={() => setEditHovered(true)}
            onMouseLeave={() => setEditHovered(false)}
            style={{
              ...editButton,
              transform: editHovered ? "translateY(-2px)" : "translateY(0px)",
              boxShadow: editHovered ? "0 18px 45px rgba(37,99,235,0.28)" : "none",
              background: editHovered 
                ? "linear-gradient(180deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))"
                : "linear-gradient(180deg, rgba(16,24,40,0.95), rgba(10,18,35,0.95))",
            }}
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "24px",
          }}
        >
          <ClinicProfileCard clinic={clinic} />

          <div className="hover-card" style={accountCard}>
            <h2
              style={{
                color: "#f8fafc",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              Account Information
            </h2>

            <div style={infoGroup}>
              <span style={label}>Clinic ID</span>
              <span style={value}>#{clinic.id}</span>
            </div>

            <div style={infoGroup}>
              <span style={label}>Created At</span>
              <span style={value}>
                {new Date(clinic.created_at).toLocaleString()}
              </span>
            </div>

            <div style={infoGroup}>
              <span style={label}>Last Updated</span>
              <span style={value}>
                {new Date(clinic.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <ClinicEditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          clinic={clinic}
          onSuccess={() => {
            setIsEditOpen(false);
            fetchClinic();
          }}
        />
      </div>
    </>
  );
}

const editButton = {
  height: "56px",
  padding: "0 22px",
  border: "1px solid rgba(59,130,246,0.25)",
  borderRadius: "20px",
  color: "#38bdf8",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontWeight: 600,
  fontSize: "16px",
  cursor: "pointer",
  transition: "all 0.25s ease",
};

const accountCard = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "32px", // matched padding with the profile card
};

const infoGroup = {
  display: "flex",
  flexDirection: "column" as const,
  marginBottom: "22px",
};

const label = {
  color: "#7a9ab8",
  fontSize: "13px",
  marginBottom: "6px",
  fontWeight: 500,
};

const value = {
  color: "#f8fafc",
  fontSize: "15px",
  fontWeight: 500,
};