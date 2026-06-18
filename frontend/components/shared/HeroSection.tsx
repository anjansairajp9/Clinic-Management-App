"use client";

import { useMobile } from "@/hooks/useMobile";

export default function HeroSection() {
  const isMobile = useMobile();

  return (
    <section
      style={{
        paddingTop: isMobile ? "100px" : "105px",
        paddingBottom: "32px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 16px",
            borderRadius: "999px",
            background: "rgba(56,189,248,0.08)",
            border: "1px solid rgba(56,189,248,0.15)",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#2dd4bf",
            }}
          />

          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#38bdf8",
              letterSpacing: "0.08em",
            }}
          >
            BUILT FOR HEALTHCARE TEAMS
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: isMobile ? "36px" : "clamp(42px, 4.5vw, 60px)",
            lineHeight: 1.05,
            fontWeight: 700,
            color: "#f0f6ff",
            letterSpacing: "-0.04em",
            marginBottom: "12px",
            overflow: "visible",
            paddingBottom: "6px",
          }}
        >
          Run your clinic{" "}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              background:
                "linear-gradient(90deg,#38bdf8 0%,#2dd4bf 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
              paddingRight: "6px",
            }}
          >
            without the chaos
          </span>
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: isMobile ? "16px" : "18px",
            lineHeight: 1.6,
            color: "#7a9ab8",
            maxWidth: "840px",
            margin: "0 auto",
          }}
        >
          Patients, doctors, appointments, treatments, and payments —
          all in one clean dashboard built for modern healthcare
          practices.
        </p>
      </div>
    </section>
  );
}
