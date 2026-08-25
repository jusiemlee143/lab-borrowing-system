"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Activity,
  BarChart3,
  Boxes,
  Database,
  ShieldCheck,
} from "lucide-react";

import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminAccountManagement from "@/components/admin/AdminAccountManagement";
import AdminEquipmentManagement from "@/components/admin/AdminEquipmentManagement";
import AdminBorrowingRecords from "@/components/admin/AdminBorrowingRecords";
import AdminHistoryAudit from "@/components/admin/AdminHistoryAudit";

import AdminSidebar, {
  AdminSection,
} from "@/components/admin/AdminSidebar";

// ============================================================
// SECTION TITLES
// ============================================================

const sectionTitles: Record<AdminSection, string> = {
  dashboard: "System overview and administrative monitoring",

  accounts: "Manage system user accounts",

  equipment: "Manage laboratory equipment and inventory",

  borrowing: "Monitor laboratory borrowing records",

  history: "Review system history and audit logs",

  reports: "View reports and system analytics",

  notifications: "Manage system notifications",

  system: "System configuration and maintenance",

  profile: "Manage administrator profile",
};

// ============================================================
// ADMIN STATISTICS
// ============================================================

interface AdminStats {
  totalLIC: number;
  totalTeachers: number;
  totalStudents: number;
  totalTools: number;
  pendingRequests: number;
  activeBorrowings: number;
  lowStockTools: number;
  totalHistory: number;
}

// ============================================================
// MAIN ADMIN PAGE
// ============================================================

export default function AdminDashboardPage() {
  const router = useRouter();

  // ==========================================================
  // STATE
  // ==========================================================

  const [activeSection, setActiveSection] =
    useState<AdminSection>("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [stats, setStats] =
    useState<AdminStats>({
      totalLIC: 0,
      totalTeachers: 0,
      totalStudents: 0,
      totalTools: 0,
      pendingRequests: 0,
      activeBorrowings: 0,
      lowStockTools: 0,
      totalHistory: 0,
    });

  // ==========================================================
  // FETCH DASHBOARD DATA
  // ==========================================================

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      // --------------------------------------------------------
      // Fetch LIC and teacher accounts
      // --------------------------------------------------------

      const [
        licsRes,
        teachersRes,
      ] = await Promise.all([
        fetch("/api/admin/lics", {
          cache: "no-store",
        }),

        fetch("/api/admin/teachers", {
          cache: "no-store",
        }),
      ]);

      // --------------------------------------------------------
      // Parse responses
      // --------------------------------------------------------

      const licsData =
        await licsRes.json();

      const teachersData =
        await teachersRes.json();

      // --------------------------------------------------------
      // Update statistics
      // --------------------------------------------------------

      setStats((previous) => ({
        ...previous,

        totalLIC:
          Array.isArray(licsData)
            ? licsData.length
            : previous.totalLIC,

        totalTeachers:
          Array.isArray(teachersData)
            ? teachersData.length
            : previous.totalTeachers,
      }));
    } catch (error) {
      console.error(
        "Admin dashboard fetch error:",
        error
      );

      toast.error(
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    router.push("/admin");
  };

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return <AdminLoadingScreen />;
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#fafafa] text-gray-800">

      {/* ====================================================== */}
      {/* TECHNOLOGY BACKGROUND */}
      {/* ====================================================== */}

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(#800000 1px, transparent 1px),
            linear-gradient(90deg, #800000 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ====================================================== */}
      {/* DECORATIVE TECHNOLOGY ELEMENTS */}
      {/* ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* ---------------------------------------------------- */}
        {/* TOP CIRCUIT */}
        {/* ---------------------------------------------------- */}

        <div className="absolute left-0 top-[12%] h-px w-[22%] bg-[#800000]/10" />

        <div className="absolute left-[22%] top-[12%] h-20 w-px bg-[#800000]/10" />

        <div className="absolute left-[22%] top-[calc(12%+5rem)] h-px w-20 bg-[#800000]/10" />

        {/* ---------------------------------------------------- */}
        {/* BOTTOM CIRCUIT */}
        {/* ---------------------------------------------------- */}

        <div className="absolute bottom-[15%] right-0 h-px w-[22%] bg-[#800000]/10" />

        <div className="absolute bottom-[15%] right-[22%] h-20 w-px bg-[#800000]/10" />

        <div className="absolute bottom-[calc(15%+5rem)] right-[22%] h-px w-20 bg-[#800000]/10" />

        {/* ---------------------------------------------------- */}
        {/* GOLD NODES */}
        {/* ---------------------------------------------------- */}

        <div className="absolute left-[21.5%] top-[11.4%] h-2 w-2 rounded-full bg-[#FFD700]" />

        <div className="absolute left-[calc(22%+4.5rem)] top-[calc(12%+4.5rem)] h-2 w-2 rounded-full bg-[#FFD700]" />

        <div className="absolute bottom-[14.4%] right-[21.5%] h-2 w-2 rounded-full bg-[#FFD700]" />

        {/* ---------------------------------------------------- */}
        {/* LARGE GEAR */}
        {/* ---------------------------------------------------- */}

        <svg
          className="absolute -right-24 top-20 h-96 w-96 text-[#800000]/[0.025]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />

          <path d="m19.4 15 .1-.2a7.7 7.7 0 0 0 0-5.6l-.1-.2 1.6-1.2-2-3.4-1.9.8-.2-.1a7.6 7.6 0 0 0-4.8-1.4L12 1.5H8l-.2 2.2a7.6 7.6 0 0 0-4.8 1.4l-.2.1-1.9-.8-2 3.4 1.6 1.2-.1.2a7.7 7.7 0 0 0 0 5.6l.1.2-1.6 1.2 2 3.4 1.9-.8.2.1a7.6 7.6 0 0 0 4.8 1.4L8 22.5h4l.2-2.2a7.6 7.6 0 0 0 4.8-1.4l.2-.1 1.9.8 2-3.4L19.4 15Z" />
        </svg>

        {/* ---------------------------------------------------- */}
        {/* TECHNOLOGY ICONS */}
        {/* ---------------------------------------------------- */}

        <ShieldCheck
          className="absolute left-[9%] top-[28%] h-10 w-10 text-[#800000]/[0.06]"
          strokeWidth={1.5}
        />

        <Boxes
          className="absolute right-[10%] top-[35%] h-10 w-10 text-[#800000]/[0.06]"
          strokeWidth={1.5}
        />

        <BarChart3
          className="absolute bottom-[25%] left-[12%] h-9 w-9 text-[#800000]/[0.06]"
          strokeWidth={1.5}
        />

        <Database
          className="absolute bottom-[28%] right-[16%] h-9 w-9 text-[#800000]/[0.06]"
          strokeWidth={1.5}
        />

      </div>

      {/* ====================================================== */}
      {/* ADMIN SIDEBAR */}
      {/* ====================================================== */}

      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
        onLogout={handleLogout}
      />

      {/* ====================================================== */}
      {/* RIGHT SIDE */}
      {/* ====================================================== */}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">

        {/* ==================================================== */}
        {/* HEADER */}
        {/* ==================================================== */}

        <AdminHeader
          title={
            sectionTitles[
              activeSection
            ]
          }
          onMenuClick={() =>
            setSidebarOpen(true)
          }
          onRefresh={fetchDashboardData}
          isRefreshing={refreshing}
        />

        {/* ==================================================== */}
        {/* MAIN CONTENT */}
        {/* ==================================================== */}

        <main className="flex-1 overflow-y-auto">

          <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-10">

            {/* ================================================= */}
            {/* DASHBOARD */}
            {/* ================================================= */}

            {activeSection === "dashboard" && (
              <AdminDashboard
                stats={stats}
              />
            )}

            {/* ================================================= */}
            {/* ACCOUNT MANAGEMENT */}
            {/* ================================================= */}

            {activeSection === "accounts" && (
              <AdminAccountManagement />
            )}

            {/* ================================================= */}
            {/* EQUIPMENT MANAGEMENT */}
            {/* ================================================= */}

            {activeSection === "equipment" && (
              <AdminEquipmentManagement />
            )}

            {/* ================================================= */}
            {/* BORROWING RECORDS */}
            {/* ================================================= */}

            {activeSection === "borrowing" && (
              <AdminBorrowingRecords />
            )}

            {/* ================================================= */}
            {/* HISTORY & AUDIT */}
            {/* ================================================= */}

            {activeSection === "history" && (
              <AdminHistoryAudit />
            )}

            {/* ================================================= */}
            {/* OTHER MODULES */}
            {/* ================================================= */}

            {activeSection !== "dashboard" &&
              activeSection !== "accounts" &&
              activeSection !== "equipment" &&
              activeSection !== "borrowing" &&
              activeSection !== "history" && (
                <ComingSoonSection
                  section={activeSection}
                />
              )}

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <footer className="py-8">

              <div className="h-px bg-gradient-to-r from-transparent via-[#800000]/10 to-transparent" />

              <div className="flex flex-col items-center justify-between gap-3 pt-5 text-xs text-gray-400 sm:flex-row">

                <p>
                  Laboratory Borrowing
                  Management System
                </p>

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  <span>
                    Administrator Control
                    Center
                  </span>

                </div>

              </div>

            </footer>

          </div>

        </main>

      </div>
    </div>
  );
}

// ============================================================
// COMING SOON SECTION
// ============================================================

function ComingSoonSection({
  section,
}: {
  section: AdminSection;
}) {
  const titles: Record<
    AdminSection,
    string
  > = {
    dashboard: "Dashboard",

    accounts:
      "Account Management",

    equipment:
      "Equipment Management",

    borrowing:
      "Borrowing Records",

    history:
      "History & Audit",

    reports:
      "Reports & Analytics",

    notifications:
      "Notifications",

    system:
      "System Management",

    profile:
      "Admin Profile",
  };

  const descriptions: Record<
    AdminSection,
    string
  > = {
    dashboard: "",

    accounts:
      "Manage Lab-in-Charge, teacher, and student accounts.",

    equipment:
      "Manage laboratory equipment and inventory.",

    borrowing:
      "Monitor all laboratory borrowing records.",

    history:
      "Review administrative and laboratory audit history.",

    reports:
      "Generate reports and analyze system activity.",

    notifications:
      "Manage important system notifications.",

    system:
      "Configure and maintain the laboratory borrowing system.",

    profile:
      "Manage administrator account information.",
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">

      <div className="max-w-md text-center">

        {/* ICON */}

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#800000]/5 text-[#800000]">
          <Activity className="h-7 w-7" />
        </div>

        {/* TITLE */}

        <h2 className="text-xl font-bold text-[#800000]">
          {titles[section]}
        </h2>

        {/* DESCRIPTION */}

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {descriptions[section]}
        </p>

        {/* STATUS */}

        <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#FFD700]/40 bg-[#FFD700]/10 px-3 py-2 text-xs font-medium text-[#8a6b00]">

          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" />

          Module ready for development

        </div>

      </div>

    </div>
  );
}

// ============================================================
// ADMIN LOADING SCREEN
// ============================================================

function AdminLoadingScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">

      {/* ====================================================== */}
      {/* TECHNOLOGY GRID */}
      {/* ====================================================== */}

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(#800000 1px, transparent 1px),
            linear-gradient(90deg, #800000 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ====================================================== */}
      {/* DECORATIONS */}
      {/* ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* SECURITY */}

        <ShieldCheck
          className="absolute left-[10%] top-[25%] h-10 w-10 text-[#800000]/10"
          strokeWidth={1.5}
        />

        {/* EQUIPMENT */}

        <Boxes
          className="absolute right-[10%] top-[30%] h-10 w-10 text-[#800000]/10"
          strokeWidth={1.5}
        />

        {/* DATABASE */}

        <Database
          className="absolute bottom-[25%] left-[12%] h-9 w-9 text-[#800000]/10"
          strokeWidth={1.5}
        />

        {/* ANALYTICS */}

        <BarChart3
          className="absolute bottom-[28%] right-[14%] h-9 w-9 text-[#800000]/10"
          strokeWidth={1.5}
        />

      </div>

      {/* ====================================================== */}
      {/* LOADING CONTENT */}
      {/* ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">

        <div className="flex flex-col items-center gap-5">

          {/* LOADING ICON */}

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800000] shadow-lg">

            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#FFD700]/30 border-t-[#FFD700]" />

          </div>

          {/* TEXT */}

          <div className="text-center">

            <p className="font-semibold text-[#800000]">
              Loading administrator dashboard...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Preparing system overview...
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}