"use client";

import {
  Calendar,
  CreditCard,
  FileText,
  Stethoscope,
  Users,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Users,
    title: "Patients",
    description:
      "Full profiles with medical history and complete visit records.",
    accent: "#38bdf8",
  },
  {
    icon: Calendar,
    title: "Appointments",
    description:
      "Schedule and track walk-ins with real-time slot availability.",
    accent: "#2dd4bf",
  },
  {
    icon: Stethoscope,
    title: "Doctors",
    description:
      "Manage staff, specializations, and appointment histories.",
    accent: "#818cf8",
  },
  {
    icon: FileText,
    title: "Treatments",
    description:
      "Diagnoses, prescriptions, and follow-up instructions all linked.",
    accent: "#38bdf8",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description:
      "Track billing and status across cash, UPI, card, and transfers.",
    accent: "#2dd4bf",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Daily summaries and revenue insights at a glance.",
    accent: "#818cf8",
  },
];

function FeatureCard({
  feature,
}: {
  feature: (typeof features)[0];
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.04)"
          : "rgba(13,26,38,0.9)",

        border: hovered
          ? `1px solid ${feature.accent}50`
          : "1px solid rgba(255,255,255,0.07)",

        borderRadius: "18px",

        // SMALLER CARD
        padding: "16px",
        minHeight: "128px",

        display: "flex",
        flexDirection: "column",

        transform: hovered
          ? "translateY(-4px)"
          : "translateY(0)",

        transition:
          "all 0.25s cubic-bezier(0.22,1,0.36,1)",

        boxShadow: hovered
          ? `0 12px 28px ${feature.accent}15`
          : "none",
      }}
    >
      <div
        style={{
          // SMALLER ICON BOX
          width: "38px",
          height: "38px",
          borderRadius: "12px",
          background: `${feature.accent}14`,
          border: `1px solid ${feature.accent}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",

          boxShadow: hovered
            ? `0 0 18px ${feature.accent}25`
            : "none",

          transition: "all 0.25s ease",
        }}
      >
        <Icon
          size={18}
          color={feature.accent}
        />
      </div>

      <h3
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#f0f6ff",
          marginBottom: "8px",
        }}
      >
        {feature.title}
      </h3>

      <p
        style={{
          fontSize: "13px",
          lineHeight: 1.6,
          color: "#7a9ab8",
        }}
      >
        {feature.description}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      style={{
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "18px",
          }}
        >
          <h2
            style={{
              fontSize: "42px",
              fontWeight: 700,
              color: "#f0f6ff",
              marginBottom: "10px",
            }}
          >
            Everything your clinic needs
          </h2>

          <p
            style={{
              fontSize: "16px",
              color: "#7a9ab8",
            }}
          >
            One platform for the full patient journey —
            from first visit to final payment.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
}