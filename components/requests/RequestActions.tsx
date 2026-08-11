"use client";

import {
  Check,
  X,
  PackageCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Props {
  status:
    | "pending"
    | "approved"
    | "released"
    | "returned"
    | "rejected";

  onApprove: () => void;
  onReject: () => void;
  onRelease: () => void;
  onReturn: () => void;
}

export default function RequestActions({
  status,
  onApprove,
  onReject,
  onRelease,
  onReturn,
}: Props) {
  /* =========================================================
     PENDING
     ========================================================= */

  if (status === "pending") {
    return (
      <div className="flex items-center gap-2">
        {/* APPROVE */}
        <button
          type="button"
          onClick={onApprove}
          className="
            inline-flex
            items-center
            justify-center
            gap-1.5
            h-9
            px-3.5
            rounded-lg
            bg-green-600
            text-white
            text-xs
            font-semibold
            shadow-sm
            shadow-green-600/15
            hover:bg-green-700
            hover:shadow-md
            hover:-translate-y-0.5
            active:translate-y-0
            transition-all
            duration-200
          "
        >
          <Check className="w-3.5 h-3.5" />
          Approve
        </button>

        {/* REJECT */}
        <button
          type="button"
          onClick={onReject}
          className="
            inline-flex
            items-center
            justify-center
            gap-1.5
            h-9
            px-3.5
            rounded-lg
            border
            border-red-200
            bg-red-50
            text-red-600
            text-xs
            font-semibold
            hover:bg-red-100
            hover:border-red-300
            hover:-translate-y-0.5
            active:translate-y-0
            transition-all
            duration-200
          "
        >
          <X className="w-3.5 h-3.5" />
          Reject
        </button>
      </div>
    );
  }

  /* =========================================================
     APPROVED
     ========================================================= */

  if (status === "approved") {
    return (
      <button
        type="button"
        onClick={onRelease}
        className="
          inline-flex
          items-center
          justify-center
          gap-1.5
          h-9
          px-4
          rounded-lg
          bg-[#800000]
          text-[#FFD700]
          text-xs
          font-semibold
          shadow-sm
          shadow-[#800000]/20
          hover:bg-[#660000]
          hover:shadow-md
          hover:-translate-y-0.5
          active:translate-y-0
          transition-all
          duration-200
        "
      >
        <PackageCheck className="w-3.5 h-3.5" />
        Release
      </button>
    );
  }

  /* =========================================================
     RELEASED
     ========================================================= */

  if (status === "released") {
    return (
      <button
        type="button"
        onClick={onReturn}
        className="
          inline-flex
          items-center
          justify-center
          gap-1.5
          h-9
          px-4
          rounded-lg
          bg-[#FFD700]
          text-[#800000]
          text-xs
          font-semibold
          shadow-sm
          shadow-[#FFD700]/20
          hover:bg-[#e6c200]
          hover:shadow-md
          hover:-translate-y-0.5
          active:translate-y-0
          transition-all
          duration-200
        "
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Return
      </button>
    );
  }

  /* =========================================================
     RETURNED
     ========================================================= */

  if (status === "returned") {
    return (
      <span
        className="
          inline-flex
          items-center
          justify-center
          gap-1.5
          h-9
          px-3.5
          rounded-lg
          bg-purple-50
          border
          border-purple-200
          text-purple-700
          text-xs
          font-semibold
        "
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Completed
      </span>
    );
  }

  /* =========================================================
     REJECTED
     ========================================================= */

  if (status === "rejected") {
    return (
      <span
        className="
          inline-flex
          items-center
          justify-center
          gap-1.5
          h-9
          px-3.5
          rounded-lg
          bg-red-50
          border
          border-red-200
          text-red-600
          text-xs
          font-semibold
        "
      >
        <XCircle className="w-3.5 h-3.5" />
        Rejected
      </span>
    );
  }

  return null;
}