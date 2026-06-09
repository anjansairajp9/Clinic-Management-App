export default function HeroSection() {
  return (
    <section
      style={{
        paddingTop: "96px", // increased top spacing
        paddingBottom: "0px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
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
            marginBottom: "18px",
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
            fontSize: "clamp(42px, 4vw, 54px)",
            lineHeight: 1.02,
            fontWeight: 700,
            color: "#f0f6ff",
            letterSpacing: "-0.04em",
            marginBottom: "14px",
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
            fontSize: "16px", // bigger
            lineHeight: 1.85,
            color: "#7a9ab8",
            maxWidth: "650px",
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