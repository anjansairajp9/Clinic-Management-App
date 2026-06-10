"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  FilePlus2,
  CreditCard,
  Settings,
  Building2,
  BarChart3,
} from "lucide-react";

import LogoutButton from "./LogoutButton";

type SidebarProps = {
  isSuperAdmin?: boolean;
};

export default function Sidebar({
  isSuperAdmin = false,
}: SidebarProps) {
  const pathname = usePathname();

  const clinicMenu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Patients",
      href: "/dashboard/patients",
      icon: Users,
    },
    {
      name: "Doctors",
      href: "/dashboard/doctors",
      icon: Stethoscope,
    },
    {
      name: "Appointments",
      href: "/dashboard/appointments",
      icon: CalendarDays,
    },
    {
      name: "Treatments",
      href: "/dashboard/treatments",
      icon: FilePlus2,
    },
    {
      name: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const superAdminMenu = [
    {
      name: "Dashboard",
      href: "/super-admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Clinics",
      href: "/super-admin/clinics",
      icon: Building2,
    },
    {
      name: "Analytics",
      href: "/super-admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/super-admin/settings",
      icon: Settings,
    },
  ];

  const menuItems = isSuperAdmin
    ? superAdminMenu
    : clinicMenu;

  return (
    <aside
      style={{
        width: "300px",
        minHeight: "100vh",
        padding: "30px 22px",
        borderRight:
          "1px solid rgba(255,255,255,0.06)",
        background:
          "linear-gradient(180deg, rgba(4,17,32,0.92), rgba(2,12,24,0.95))",
        backdropFilter: "blur(16px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <Link
        href={
          isSuperAdmin
            ? "/super-admin/dashboard"
            : "/dashboard"
        }
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          textDecoration: "none",
          marginBottom: "36px",
        }}
      >
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "18px",
            background:
              "linear-gradient(135deg, #22d3ee, #60a5fa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "24px",
            color: "#031018",
            boxShadow:
              "0 0 25px rgba(56,189,248,0.20)",
            flexShrink: 0,
          }}
        >
          CM
        </div>

        <h2
          style={{
            color: "#f0f6ff",
            fontSize: "18px",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Clinic Management
        </h2>
      </Link>

      {/* Menu */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-2px)";
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.06)";
                e.currentTarget.style.border =
                  "1px solid rgba(56,189,248,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";

                e.currentTarget.style.background =
                  isActive
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.03)";

                e.currentTarget.style.border =
                  isActive
                    ? "1px solid rgba(56,189,248,0.12)"
                    : "1px solid rgba(255,255,255,0.04)";
              }}
              style={{
                height: "58px",
                borderRadius: "18px",
                padding: "0 18px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background:
                  isActive
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.03)",
                border:
                  isActive
                    ? "1px solid rgba(56,189,248,0.12)"
                    : "1px solid rgba(255,255,255,0.04)",
                color: isActive
                  ? "#38bdf8"
                  : "#a9bfd7",
                textDecoration: "none",
                transition:
                  "all 0.25s ease",
              }}
            >
              <Icon size={21} />

              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "auto",
        }}
      >
        <LogoutButton />
      </div>
    </aside>
  );
}
