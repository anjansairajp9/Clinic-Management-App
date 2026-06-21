"use client";

import Link from "next/link";
import { useState } from "react";
import { useMobile } from "@/hooks/useMobile"; // Added hook

export default function Navbar() {
  const [loginHovered, setLoginHovered] = useState(false);
  const [startHovered, setStartHovered] = useState(false);
  const isMobile = useMobile(); // Initialize hook

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "rgba(6,13,22,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "0 18px",
            height: "66px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LEFT SIDE */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              transform: "translateX(-4px)",
            }}
          >
            {/* Logo */}
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, #38bdf8 0%, #2dd4bf 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: 700,
                color: "#07111f",
                boxShadow: "0 0 22px rgba(56,189,248,0.18)",
                transition: "transform 0.2s ease",
              }}
            >
              CS
            </div>

            {/* Brand - Hidden on mobile */}
            {!isMobile && (
              <div>
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#f0f6ff",
                    marginBottom: "2px",
                    whiteSpace: "nowrap", // Ensure title doesn't break
                  }}
                >
                  ClinSyst
                </h1>
              </div>
            )}
          </Link>

          {/* RIGHT SIDE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "8px" : "10px", // Tighter gap on mobile
              transform: "translateX(4px)",
            }}
          >
            {/* Login Button */}
            <Link
              href="/login"
              onMouseEnter={() => setLoginHovered(true)}
              onMouseLeave={() => setLoginHovered(false)}
              style={{
                padding: isMobile ? "8px 14px" : "10px 20px", // Less padding on mobile
                borderRadius: "14px",
                fontSize: isMobile ? "13px" : "14px", // Smaller font
                fontWeight: 500,
                textDecoration: "none",
                whiteSpace: "nowrap", // Prevent text wrap

                color: loginHovered ? "#f0f6ff" : "#94a3b8",

                background: loginHovered
                  ? "rgba(255,255,255,0.05)"
                  : "transparent",

                border: loginHovered
                  ? "1px solid rgba(255,255,255,0.12)"
                  : "1px solid rgba(255,255,255,0.08)",

                transform: loginHovered
                  ? "translateY(-2px)"
                  : "translateY(0)",

                transition:
                  "all 0.22s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              Log in
            </Link>

            {/* Get Started Button */}
            <Link
              href="/register"
              onMouseEnter={() => setStartHovered(true)}
              onMouseLeave={() => setStartHovered(false)}
              style={{
                padding: isMobile ? "8px 16px" : "10px 24px", // Less padding on mobile
                borderRadius: "14px",
                fontSize: isMobile ? "13px" : "14px", // Smaller font
                fontWeight: 700,
                textDecoration: "none",
                whiteSpace: "nowrap", // Prevent text wrap

                color: "#07111f",

                background: startHovered ? "#67d4ff" : "#38bdf8",

                boxShadow: startHovered
                  ? "0 10px 30px rgba(56,189,248,0.32)"
                  : "0 6px 18px rgba(56,189,248,0.18)",

                transform: startHovered
                  ? "translateY(-2px)"
                  : "translateY(0)",

                transition:
                  "all 0.22s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
