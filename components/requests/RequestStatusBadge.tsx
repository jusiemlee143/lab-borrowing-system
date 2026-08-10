"use client";

import {
  Clock3,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
  XCircle,
} from "lucide-react";

interface Props {
  status:
    | "pending"
    | "approved"
    | "released"
    | "returned"
    | "rejected";
}

export default function RequestStatusBadge({ status }: Props) {
  const styles = {
    pending: {
      wrapper:
        "bg-[#FFD700]/10 border-[#FFD700]/30 text-[#9a7800]",
      icon: Clock3,
      label: "Pending",
    },

    approved: {
      wrapper:
        "bg-green-50 border-green-200 text-green-700",
      icon: CheckCircle2,
      label: "Approved",
    },

    released: {
      wrapper:
        "bg-blue-50 border-blue-200 text-blue-700",
      icon: PackageCheck,
      label: "Released",
    },

    returned: {
      wrapper:
        "bg-purple-50 border-purple-200 text-purple-700",
      icon: RotateCcw,
      label: "Returned",
    },

    rejected: {
      wrapper:
        "bg-red-50 border-red-200 text-red-700",
      icon: XCircle,
      label: "Rejected",
    },
  };

  const style = styles[status];
  const Icon = style.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        gap-1.5
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-semibold
        whitespace-nowrap
        shadow-sm
        transition-all
        duration-200
        ${style.wrapper}
      `}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />

      <span>
        {style.label}
      </span>
    </span>
  );
}