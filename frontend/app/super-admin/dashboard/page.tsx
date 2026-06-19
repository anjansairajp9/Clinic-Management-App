"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  UserRound,
  CalendarDays,
  FileText,
  IndianRupee,
  Clock3,
} from "lucide-react";

import { getSuperAdminDashboard } from "@/services/super-admin.service";
import { useDashboardDate } from "@/hooks/useDashboardDate";
import type { SuperAdminDashboard } from "@/types/super-admin";
import { useMobile } from "@/hooks/useMobile";

export default function SuperAdminDashboardPage() {
  const isMobile = useMobile();
  const [mounted, setMounted] = useState(false);

  const { selectedDate } = useDashboardDate();
  const [dashboard, setDashboard] = useState<SuperAdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydration Fix: Wait for client to mount before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getSuperAdminDashboard(selectedDate);
        setDashboard(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [selectedDate]);

  if (!mounted) {
    return <div style={{ minHeight: "400px" }} />;
  }

  if (loading || !dashboard) {
    return (
      <div
        style={{
          color: "#94a3b8",
          padding: "32px",
          fontSize: "15px",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Clinics",
      value: dashboard.total_clinics,
      icon: Building2,
    },
    {
      label: "Total Doctors",
      value: dashboard.total_doctors,
      icon: UserRound,
    },
    {
      label: "Total Patients",
      value: dashboard.total_patients,
      icon: Users,
    },
    {
      label: "Appointments",
      value: dashboard.total_appointments,
      icon: CalendarDays,
    },
    {
      label: "Treatments",
      value: dashboard.total_treatments,
      icon: FileText,
    },
    {
      label: "Revenue",
      value: `₹${Number(dashboard.total_revenue).toLocaleString()}`,
      icon: IndianRupee,
    },
  ];

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
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25) !important;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: isMobile ? "16px" : "20px 32px 32px",
        }}
      >
        {/* Core Stats Grid */}
        <div
          style={{
            ...statsGrid,
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          }}
        >
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="hover-card"
                style={statCard}
              >
                <div style={iconBox}>
                  <Icon size={18} color="#38bdf8" />
                </div>

                <div
                  style={{
                    marginTop: "12px",
                  }}
                >
                  <div style={cardValue}>{card.value}</div>
                  <div style={cardLabel}>{card.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtle Divider */}
        <div style={sectionDivider} />

        {/* Analytics Grid */}
        <div
          style={{
            ...statsGrid,
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          }}
        >
          <div className="hover-card" style={statCard}>
            <div style={iconBox}>
              <Clock3 size={18} color="#38bdf8" />
            </div>

            <div
              style={{
                marginTop: "12px",
              }}
            >
              <div style={cardValue}>{dashboard.analytics_date}</div>
              <div style={cardLabel}>Analytics Date</div>
            </div>
          </div>

          <div className="hover-card" style={statCard}>
            <div
              style={{
                ...iconBox,
                background: "rgba(168,85,247,0.12)",
              }}
            >
              <CalendarDays size={18} color="#c084fc" />
            </div>

            <div
              style={{
                marginTop: "12px",
              }}
            >
              <div style={cardValue}>
                {dashboard.selected_date_appointments}
              </div>
              <div style={cardLabel}>Appointments Today</div>
            </div>
          </div>

          <div className="hover-card" style={statCard}>
            <div
              style={{
                ...iconBox,
                background: "rgba(245,158,11,0.12)",
              }}
            >
              <IndianRupee size={18} color="#fbbf24" />
            </div>

            <div
              style={{
                marginTop: "12px",
              }}
            >
              <div
                style={{
                  ...cardValue,
                  color: "#f59e0b",
                }}
              >
                {dashboard.pending_payments}
              </div>
              <div style={cardLabel}>Pending Payments</div>
            </div>
          </div>
        </div>

        {/* Subtle Divider */}
        <div style={sectionDivider} />

        {/* Recent Clinics */}
        <div>
          <h2 style={sectionTitle}>Recent Clinics</h2>

          <div
            style={{
              ...recentGrid,
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            }}
          >
            {dashboard.recent_clinics.map((clinic) => (
              <div
                key={clinic.id}
                className="hover-card"
                style={recentCard}
              >
                <h3 style={recentClinicName}>{clinic.name}</h3>

                <div style={cardDivider} />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={recentText}>
                    <span style={recentLabel}>Email:</span> {clinic.email}
                  </div>
                  <div style={recentText}>
                    <span style={recentLabel}>Phone:</span> {clinic.phone}
                  </div>
                  <div style={recentText}>
                    <span style={recentLabel}>Address:</span>{" "}
                    {clinic.address || "No address provided"}
                  </div>
                  <div style={recentText}>
                    <span style={recentLabel}>Created:</span>{" "}
                    {new Date(clinic.created_at).toLocaleString()}
                  </div>
                  <div style={recentText}>
                    <span style={recentLabel}>Updated:</span>{" "}
                    {new Date(clinic.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Styles ---------- */

const statsGrid = {
  display: "grid",
  gap: "16px",
};

const statCard = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "16px",
  padding: "18px 20px",
  display: "flex",
  flexDirection: "column" as const,
};

const iconBox = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  background: "rgba(56,189,248,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardValue = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#f8fafc",
  lineHeight: 1.2,
  marginBottom: "4px",
};

const cardLabel = {
  color: "#94a3b8",
  fontSize: "13px",
  fontWeight: 500,
};

const sectionDivider = {
  height: "1px",
  width: "100%",
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, rgba(255,255,255,0.02))",
  margin: "8px 0",
};

const sectionTitle = {
  color: "#f8fafc",
  fontSize: "20px",
  fontWeight: 600,
  margin: "0 0 16px 0",
  letterSpacing: "-0.3px",
};

const recentGrid = {
  display: "grid",
  gap: "16px",
};

const recentCard = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "16px",
  padding: "20px",
};

const recentClinicName = {
  fontSize: "17px",
  fontWeight: 600,
  color: "#f8fafc",
  margin: "0 0 14px 0",
};

const cardDivider = {
  height: "1px",
  background: "rgba(255,255,255,0.06)",
  marginBottom: "14px",
  width: "100%",
};

const recentText = {
  color: "#e2e8f0",
  fontSize: "13px",
  display: "flex",
  gap: "8px",
};

const recentLabel = {
  color: "#64748b",
  minWidth: "65px",
  fontWeight: 500,
};
