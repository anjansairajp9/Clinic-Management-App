"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useMobile } from "@/hooks/useMobile";

type DashboardShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  isSuperAdmin?: boolean;
};

export default function DashboardShell({
  children,
  title,
  subtitle,
  isSuperAdmin = false,
}: DashboardShellProps) {
  const isMobile = useMobile();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(56,189,248,0.08), transparent 30%), radial-gradient(circle at top right, rgba(56,189,248,0.06), transparent 25%), linear-gradient(180deg, #020817 0%, #03111f 100%)",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        paddingBottom: isMobile ? "70px" : "0", // Prevents content from hiding behind mobile bottom nav
      }}
    >
      <Sidebar isSuperAdmin={isSuperAdmin} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopBar title={title} subtitle={subtitle} />

        <main
          style={{
            flex: 1,
            padding: isMobile ? "16px" : "34px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
