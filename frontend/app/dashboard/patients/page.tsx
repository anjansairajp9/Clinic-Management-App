"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import PatientTable from "@/components/patients/PatientTable";
import PatientFormModal from "@/components/patients/PatientFormModal";
import { useMobile } from "@/hooks/useMobile";

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [createHovered, setCreateHovered] = useState(false);

  const isMobile = useMobile();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        marginTop: isMobile ? "0px" : "-20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? "16px" : "0",
        }}
      >
        <div>
          <h1
            style={{
              color: "#f0f6ff",
              fontSize: "32px",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Patients
          </h1>
          <p
            style={{
              color: "#7a9ab8",
              marginTop: "8px",
              marginBottom: 0,
              fontSize: "15px",
            }}
          >
            Manage patients and medical records.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          onMouseEnter={() => setCreateHovered(true)}
          onMouseLeave={() => setCreateHovered(false)}
          style={{
            height: "50px",
            width: isMobile ? "100%" : "auto",
            padding: "0 24px",
            borderRadius: "14px",
            border: `1px solid ${createHovered ? "rgba(56, 189, 248, 0.6)" : "rgba(56, 189, 248, 0.3)"
              }`,
            background: createHovered
              ? "rgba(56, 189, 248, 0.1)"
              : "transparent",
            color: "#38bdf8",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease",
            transform: createHovered ? "translateY(-1px)" : "translateY(0)",
            boxShadow: createHovered
              ? "0 4px 14px rgba(56, 189, 248, 0.15)"
              : "none",
          }}
        >
          <Plus size={16} />
          Create Patient
        </button>
      </div>

      {/* Search */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
          border: "none",
          borderRadius: "28px",
          padding: isMobile ? "12px" : "16px 20px",
        }}
      >
        <div style={{ position: "relative" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "18px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#38bdf8",
              zIndex: 2,
            }}
          />

          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              height: "50px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              padding: "0 18px 0 46px",
              background: "rgba(255,255,255,0.03)",
              color: "#f0f6ff",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border =
                "1px solid rgba(56,189,248,0.18)";
              e.currentTarget.style.boxShadow =
                "0 0 24px rgba(56,189,248,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border =
                "1px solid rgba(255,255,255,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onFocus={(e) => {
              e.currentTarget.style.border =
                "1px solid rgba(56,189,248,0.22)";
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(56,189,248,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border =
                "1px solid rgba(255,255,255,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      <PatientTable searchQuery={searchQuery} refreshKey={refreshKey} />

      <PatientFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
        mode="create"
      />
    </div>
  );
}
