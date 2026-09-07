"use client";

import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";

export type AdminSection =
  | "dashboard"
  | "accounts"
  | "equipment"
  | "borrowing"
  | "history"
  | "reports"
  | "notifications"
  | "system"
  | "profile";

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const mainMenu = [
  {
    id: "dashboard" as AdminSection,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
];

const managementMenu = [
  {
    id: "accounts" as AdminSection,
    label: "Account Management",
    icon: Users,
  },
  {
    id: "equipment" as AdminSection,
    label: "Equipment",
    icon: Boxes,
  },
  {
    id: "borrowing" as AdminSection,
    label: "Borrowing Records",
    icon: ClipboardList,
  },
];

const monitoringMenu = [
  {
    id: "history" as AdminSection,
    label: "History & Audit",
    icon: History,
  },
  {
    id: "reports" as AdminSection,
    label: "Reports & Analytics",
    icon: BarChart3,
  },
];

const systemMenu = [
  {
    id: "notifications" as AdminSection,
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "system" as AdminSection,
    label: "System Management",
    icon: Settings,
  },
  {
    id: "profile" as AdminSection,
    label: "Admin Profile",
    icon: UserCog,
  },
];

export default function AdminSidebar({
  activeSection,
  setActiveSection,
  isOpen,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  const renderMenu = (
    title: string,
    items: {
      id: AdminSection;
      label: string;
      icon: React.ElementType;
    }[]
  ) => {
    return (
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 px-3">
          <div className="h-px w-3 bg-[#FFD700]" />

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#800000]/60">
            {title}
          </p>
        </div>

        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  onClose();
                }}
                className={`
                  group
                  relative
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-[#800000] text-white shadow-md shadow-[#800000]/10"
                      : "text-gray-600 hover:bg-[#800000]/5 hover:text-[#800000]"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#FFD700]" />
                )}

                <div
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    transition
                    ${
                      isActive
                        ? "bg-white/10 text-[#FFD700]"
                        : "bg-gray-50 text-gray-500 group-hover:bg-[#800000]/5 group-hover:text-[#800000]"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span className="truncate">
                  {item.label}
                </span>

                {isActive && (
                  <Activity className="ml-auto h-3.5 w-3.5 text-[#FFD700]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ====================================================== */}
      {/* MOBILE OVERLAY */}
      {/* ====================================================== */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* ====================================================== */}
      {/* SIDEBAR */}
      {/* ====================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[285px]
          flex-col
          border-r
          border-[#800000]/10
          bg-white
          shadow-xl
          transition-transform
          duration-200
          lg:static
          lg:z-auto
          lg:translate-x-0
          lg:shadow-none
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ================================================== */}
        {/* SIDEBAR HEADER */}
        {/* ================================================== */}

        <div className="relative flex h-[76px] items-center justify-between border-b border-[#800000]/10 px-5">
          <div className="flex items-center gap-3">
            {/* LOGO */}

            <div
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-[#FFD700]/70
                bg-white
                shadow-sm
              "
            >
              <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: `
                    linear-gradient(#800000 1px, transparent 1px),
                    linear-gradient(90deg, #800000 1px, transparent 1px)
                  `,
                  backgroundSize: "9px 9px",
                }}
              />

              <img
                src="/logo/OfficialLogo.png"
                alt="Lab Borrowing System Logo"
                className="relative z-10 h-9 w-9 object-contain"
              />
            </div>

            {/* BRAND */}

            <div>
              <p className="text-sm font-bold text-[#800000]">
                Lab Borrowing
              </p>

              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Admin Control
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-[#800000]/5 hover:text-[#800000] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* GOLD ACCENT */}

        <div className="h-[2px] bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

        {/* ================================================== */}
        {/* NAVIGATION */}
        {/* ================================================== */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {renderMenu("Main", mainMenu)}

          {renderMenu(
            "Management",
            managementMenu
          )}

          {renderMenu(
            "Monitoring",
            monitoringMenu
          )}

          {renderMenu("System", systemMenu)}
        </nav>

        {/* ================================================== */}
        {/* ADMIN STATUS */}
        {/* ================================================== */}

        <div className="border-t border-[#800000]/10 p-4">
          <div className="mb-3 rounded-xl border border-[#800000]/10 bg-[#800000]/[0.025] p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#800000]" />

              <div>
                <p className="text-xs font-semibold text-[#800000]">
                  Administrator
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  <span className="text-[10px] text-gray-400">
                    System access active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={onLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-red-100
              px-3
              py-2.5
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-50
            "
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
              <LogOut className="h-4 w-4" />
            </div>

            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}