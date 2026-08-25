"use client";

import {
  Activity,
  AlertCircle,
  BarChart3,
  Boxes,
  ClipboardList,
  Database,
  History,
  ShieldCheck,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface AdminDashboardProps {
  stats?: {
    totalLIC: number;
    totalTeachers: number;
    totalStudents: number;
    totalTools: number;
    pendingRequests: number;
    activeBorrowings: number;
    lowStockTools: number;
    totalHistory: number;
  };
}

export default function AdminDashboard({
  stats,
}: AdminDashboardProps) {
  const dashboardStats = {
    totalLIC: stats?.totalLIC ?? 0,
    totalTeachers: stats?.totalTeachers ?? 0,
    totalStudents: stats?.totalStudents ?? 0,
    totalTools: stats?.totalTools ?? 0,
    pendingRequests:
      stats?.pendingRequests ?? 0,
    activeBorrowings:
      stats?.activeBorrowings ?? 0,
    lowStockTools:
      stats?.lowStockTools ?? 0,
    totalHistory:
      stats?.totalHistory ?? 0,
  };

  return (
    <div className="space-y-8">
      {/* ================================================== */}
      {/* INTRO */}
      {/* ================================================== */}

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />

              <span className="text-xs font-semibold text-green-600">
                System Ready
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
              Administrative Overview
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Monitor the laboratory borrowing system,
              manage accounts, equipment, records, and
              system activity from one central control
              panel.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-gray-400 md:flex">
            <ShieldCheck className="h-4 w-4 text-[#800000]/50" />

            Administrative Control Center
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* ACCOUNT OVERVIEW */}
      {/* ================================================== */}

      <section>
        <SectionHeading
          icon={<Users className="h-4 w-4" />}
          title="Account Overview"
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <AdminStat
            title="Lab-in-Charge"
            value={dashboardStats.totalLIC}
            label="accounts"
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="maroon"
          />

          <AdminStat
            title="Teachers"
            value={dashboardStats.totalTeachers}
            label="accounts"
            icon={<UserCog className="h-5 w-5" />}
            accent="blue"
          />

          <AdminStat
            title="Students"
            value={dashboardStats.totalStudents}
            label="accounts"
            icon={<Users className="h-5 w-5" />}
            accent="green"
          />

          <AdminStat
            title="Total Users"
            value={
              dashboardStats.totalLIC +
              dashboardStats.totalTeachers +
              dashboardStats.totalStudents
            }
            label="accounts"
            icon={<Activity className="h-5 w-5" />}
            accent="gold"
          />
        </div>
      </section>

      {/* ================================================== */}
      {/* SYSTEM OVERVIEW */}
      {/* ================================================== */}

      <section>
        <SectionHeading
          icon={<Database className="h-4 w-4" />}
          title="System Overview"
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <SmallAdminStat
            title="Equipment"
            value={dashboardStats.totalTools}
            label="tool types"
            icon={<Boxes className="h-4 w-4" />}
            iconClass="bg-[#800000]/5 text-[#800000]"
          />

          <SmallAdminStat
            title="Pending"
            value={dashboardStats.pendingRequests}
            label="requests"
            icon={<ClipboardList className="h-4 w-4" />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <SmallAdminStat
            title="Active Borrowings"
            value={dashboardStats.activeBorrowings}
            label="records"
            icon={<Wrench className="h-4 w-4" />}
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <SmallAdminStat
            title="Low Stock"
            value={dashboardStats.lowStockTools}
            label="tools"
            icon={<AlertCircle className="h-4 w-4" />}
            iconClass="bg-[#FFD700]/15 text-[#b88600]"
          />

          <SmallAdminStat
            title="Audit History"
            value={dashboardStats.totalHistory}
            label="records"
            icon={<History className="h-4 w-4" />}
            iconClass="bg-purple-50 text-purple-600"
          />
        </div>
      </section>

      {/* ================================================== */}
      {/* CONTROL CENTER */}
      {/* ================================================== */}

      <section>
        <SectionHeading
          icon={<BarChart3 className="h-4 w-4" />}
          title="Administrative Control Center"
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ControlCard
            icon={<Users className="h-5 w-5" />}
            title="Account Management"
            description="Manage Lab-in-Charge, teacher, and student accounts."
          />

          <ControlCard
            icon={<Boxes className="h-5 w-5" />}
            title="Equipment Management"
            description="Monitor laboratory tools, quantities, and stock status."
          />

          <ControlCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Borrowing Records"
            description="View and monitor borrowing activity across the system."
          />

          <ControlCard
            icon={<History className="h-5 w-5" />}
            title="History & Audit"
            description="Track important administrative and laboratory actions."
          />

          <ControlCard
            icon={<BarChart3 className="h-5 w-5" />}
            title="Reports & Analytics"
            description="Generate summaries and analyze laboratory activity."
          />

          <ControlCard
            icon={<Database className="h-5 w-5" />}
            title="System Management"
            description="Manage system settings, maintenance, and data operations."
          />
        </div>
      </section>

      {/* ================================================== */}
      {/* ADMIN NOTICE */}
      {/* ================================================== */}

      <section>
        <Card className="overflow-hidden rounded-xl border border-[#800000]/10 bg-white shadow-sm">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 border-l-4 border-[#800000] bg-[#800000]/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-[#800000]">
                    Administrator Access
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Administrative actions are recorded in
                    the system audit history for accountability
                    and monitoring.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />

                Monitoring Active
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// ============================================================
// SECTION HEADING
// ============================================================

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="h-6 w-1 rounded-full bg-[#800000]" />

      <div className="flex items-center gap-2">
        <div className="text-[#800000]">
          {icon}
        </div>

        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#800000]/70">
          {title}
        </h2>
      </div>

      <div className="h-px flex-1 bg-gradient-to-r from-[#800000]/10 to-transparent" />
    </div>
  );
}

// ============================================================
// ADMIN STAT
// ============================================================

function AdminStat({
  title,
  value,
  label,
  icon,
  accent,
}: {
  title: string;
  value: number;
  label: string;
  icon: React.ReactNode;
  accent:
    | "maroon"
    | "blue"
    | "green"
    | "gold";
}) {
  const styles = {
    maroon: {
      border: "border-[#800000]/15",
      iconBg: "bg-[#800000]/5",
      iconColor: "text-[#800000]",
      value: "text-[#800000]",
    },

    blue: {
      border: "border-blue-100",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      value: "text-blue-600",
    },

    green: {
      border: "border-green-100",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      value: "text-green-600",
    },

    gold: {
      border: "border-[#FFD700]/40",
      iconBg: "bg-[#FFD700]/10",
      iconColor: "text-[#b88600]",
      value: "text-[#b88600]",
    },
  };

  const style = styles[accent];

  return (
    <Card
      className={`
        rounded-xl
        border
        bg-white
        ${style.border}
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
      `}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            {title}
          </span>

          <div
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              ${style.iconBg}
              ${style.iconColor}
            `}
          >
            {icon}
          </div>
        </div>

        <div className="mt-4 flex items-end gap-2">
          <span
            className={`
              text-2xl
              font-bold
              sm:text-3xl
              ${style.value}
            `}
          >
            {value}
          </span>

          <span className="mb-1 text-xs text-gray-400">
            {label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// SMALL ADMIN STAT
// ============================================================

function SmallAdminStat({
  title,
  value,
  label,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  label: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <Card className="rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-gray-500">
            {title}
          </span>

          <div
            className={`
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              ${iconClass}
            `}
          >
            {icon}
          </div>
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-2xl font-bold text-gray-800">
            {value}
          </span>

          <span className="mb-1 text-xs text-gray-400">
            {label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// CONTROL CARD
// ============================================================

function ControlCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="group rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#800000]/15 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#800000]/5 text-[#800000] transition group-hover:bg-[#800000] group-hover:text-[#FFD700]">
            {icon}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800">
              {title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}