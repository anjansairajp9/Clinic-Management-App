"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { logoutClinic } from "@/services/auth.service";

export default function LogoutButton() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [hovered, setHovered] =
    useState(false);

  const handleLogout =
    async () => {
      try {
        setLoading(true);

        await logoutClinic();

        localStorage.removeItem(
          "access_token"
        );

        window.location.href = "/login";
      } catch {
        localStorage.removeItem(
          "access_token"
        );

        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      style={{
        width: "100%",
        height: "58px",
        borderRadius: "18px",
        border:
          hovered
            ? "1px solid rgba(239,68,68,0.18)"
            : "1px solid rgba(255,255,255,0.05)",
        background:
          hovered
            ? "rgba(239,68,68,0.08)"
            : "rgba(255,255,255,0.03)",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "0 18px",
        color:
          hovered
            ? "#ff7a7a"
            : "#ff5d5d",
        cursor: "pointer",
        transition:
          "all 0.25s ease",
        transform:
          hovered
            ? "translateY(-2px)"
            : "translateY(0)",
      }}
    >
      <LogOut size={20} />

      <span
        style={{
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        {loading
          ? "Logging out..."
          : "Logout"}
      </span>
    </button>
  );
}