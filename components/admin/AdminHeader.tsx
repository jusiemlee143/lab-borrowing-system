"use client";

import {
  Activity,
  Bell,
  Menu,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function AdminHeader({
  title,
  onMenuClick,
  onRefresh,
  isRefreshing = false,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#800000]/10 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-7 lg:px-10">
        <div className="flex h-[76px] items-center justify-between gap-4">
          {/* ================================================== */}
          {/* LEFT */}
          {/* ================================================== */}

          <div className="flex min-w-0 items-center gap-3">
            {/* MOBILE MENU */}

            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="h-9 w-9 text-gray-500 hover:bg-[#800000]/5 hover:text-[#800000] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* LOGO */}

            <div
              className="
                relative
                flex
                h-[54px]
                w-[54px]
                shrink-0
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
                  backgroundSize: "10px 10px",
                }}
              />

              <img
                src="/logo/OfficialLogo.png"
                alt="Lab Borrowing System Logo"
                className="relative z-10 h-[43px] w-[43px] object-contain"
              />
            </div>

            {/* TITLE */}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-bold text-[#800000] sm:text-xl">
                  Administrator
                </h1>

                <span className="hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#800000]/50 sm:flex">
                  <Activity className="h-3 w-3" />

                  Admin Dashboard
                </span>
              </div>

              <p className="truncate text-xs text-gray-500 sm:text-sm">
                {title}
              </p>
            </div>
          </div>

          {/* ================================================== */}
          {/* RIGHT */}
          {/* ================================================== */}

          <div className="flex items-center gap-2">
            {/* SYSTEM STATUS */}

            <div className="hidden items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-1.5 md:flex">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_7px_rgba(34,197,94,0.5)]" />

              <span className="text-xs font-medium text-green-700">
                System Online
              </span>
            </div>

            {/* NOTIFICATIONS */}

            <Button
              variant="ghost"
              size="icon"
              className="
                relative
                h-9
                w-9
                text-gray-500
                hover:bg-[#800000]/5
                hover:text-[#800000]
              "
              title="Notifications"
            >
              <Bell className="h-4 w-4" />

              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
            </Button>

            {/* REFRESH DESKTOP */}

            <Button
              variant="ghost"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="
                hidden
                h-9
                px-3
                text-gray-500
                hover:bg-[#800000]/5
                hover:text-[#800000]
                sm:flex
              "
              title="Refresh dashboard"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </Button>

            {/* REFRESH MOBILE */}

            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="
                h-9
                w-9
                text-gray-500
                hover:bg-[#800000]/5
                hover:text-[#800000]
                sm:hidden
              "
              title="Refresh dashboard"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }`}
              />
            </Button>

            {/* ADMIN AVATAR */}

            <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-[#800000] text-sm font-bold text-[#FFD700] shadow-sm sm:flex">
              A
            </div>
          </div>
        </div>
      </div>

      {/* GOLD ACCENT */}

      <div className="h-[2px] bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />
    </header>
  );
}