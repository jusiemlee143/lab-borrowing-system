"use client";

import {
  X,
  Check,
  XCircle,
  Package,
  User,
  CalendarDays,
  Users,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import RequestStatusBadge from "./RequestStatusBadge";
import type { Request } from "./RequestsManager";

interface RequestModalProps {
  open: boolean;
  request: Request | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRelease: (id: string) => void;
  onReturn: (id: string) => void;
}

/* =============================================================
   DATE FORMATTER
   ============================================================= */

function formatDateTime(dateString?: string) {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/* =============================================================
   COMPONENT
   ============================================================= */

export default function RequestModal({
  open,
  request,
  onClose,
  onApprove,
  onReject,
  onRelease,
  onReturn,
}: RequestModalProps) {
  /*
   * IMPORTANT:
   *
   * Rejection reasoning is handled ONLY by RequestsManager.
   *
   * This modal does NOT contain:
   *
   * - rejection reason state
   * - rejection reason form
   * - rejection confirmation
   * - rejection dialog
   *
   * When the user clicks "Reject Request",
   * RequestsManager.handleReject() is called.
   *
   * This prevents the rejection reason from appearing twice.
   */

  /*
   * Nothing to render when modal is closed
   * or when there is no selected request.
   */

  if (!open || !request) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex
          h-[90vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        {/* ===================================================== */}
        {/* TOP ACCENT */}
        {/* ===================================================== */}

        <div className="h-1.5 shrink-0 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-4">
            {/* ICON */}

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#800000]/10
                bg-[#800000]/5
                text-[#800000]
              "
            >
              <ClipboardList className="h-6 w-6" />
            </div>

            {/* TITLE */}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-[#800000] sm:text-2xl">
                  Request Details
                </h2>

                <RequestStatusBadge status={request.status} />
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Review and manage this laboratory borrowing request
              </p>
            </div>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            className="
              ml-3
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-gray-200
              bg-white
              text-gray-500
              transition-all
              hover:border-[#800000]/20
              hover:bg-[#800000]/5
              hover:text-[#800000]
            "
            aria-label="Close request details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ===================================================== */}
        {/* SCROLLABLE CONTENT */}
        {/* ===================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 p-6 sm:p-7">
            {/* ================================================= */}
            {/* STUDENT INFORMATION */}
            {/* ================================================= */}

            <section
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[#800000]/10
                bg-white
                shadow-sm
              "
            >
              {/* SECTION HEADER */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-[#800000]/10
                  bg-[#800000]/[0.035]
                  px-5
                  py-4
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#800000]
                    text-[#FFD700]
                  "
                >
                  <User className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#800000]">
                    Student Information
                  </h3>

                  <p className="text-xs text-gray-500">
                    Borrower and academic information
                  </p>
                </div>
              </div>

              {/* SECTION CONTENT */}

              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <InfoItem
                  label="Student Name"
                  value={request.studentName}
                  highlighted
                />

                <InfoItem
                  label="Section"
                  value={request.section || "N/A"}
                />

                <InfoItem
                  label="Group Number"
                  value={request.groupNumber || "N/A"}
                />

                <InfoItem
                  label="Instructor"
                  value={request.instructor || "N/A"}
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* REQUEST INFORMATION */}
            {/* ================================================= */}

            <section
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[#800000]/10
                bg-white
                shadow-sm
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-[#800000]/10
                  bg-[#800000]/[0.035]
                  px-5
                  py-4
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#800000]
                    text-[#FFD700]
                  "
                >
                  <CalendarDays className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#800000]">
                    Request Information
                  </h3>

                  <p className="text-xs text-gray-500">
                    Activity and borrowing schedule
                  </p>
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <InfoItem
                  label="Activity"
                  value={request.activityTitle}
                  highlighted
                />

                <InfoItem
                  label="Requested Date"
                  value={request.date}
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* REQUESTED TOOLS */}
            {/* ================================================= */}

            <section
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[#800000]/10
                bg-white
                shadow-sm
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#800000]/10
                  bg-[#800000]/[0.035]
                  px-5
                  py-4
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#FFD700]
                      text-[#800000]
                    "
                  >
                    <Package className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#800000]">
                      Requested Tools
                    </h3>

                    <p className="text-xs text-gray-500">
                      Equipment included in this request
                    </p>
                  </div>
                </div>

                {request.cart && request.cart.length > 0 && (
                  <span className="rounded-full bg-[#800000]/5 px-3 py-1 text-xs font-semibold text-[#800000]">
                    {request.cart.length}{" "}
                    {request.cart.length === 1 ? "item" : "items"}
                  </span>
                )}
              </div>

              <div className="p-5">
                {request.cart && request.cart.length > 0 ? (
                  <div className="space-y-3">
                    {request.cart.map((item, index) => (
                      <div
                        key={item.id}
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          rounded-xl
                          border
                          border-gray-100
                          bg-gray-50/70
                          px-4
                          py-3.5
                          transition-colors
                          hover:border-[#800000]/10
                          hover:bg-[#800000]/[0.02]
                        "
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-[#800000]/10
                              bg-white
                              text-xs
                              font-bold
                              text-[#800000]
                            "
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900">
                              {item.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              Laboratory equipment
                            </p>
                          </div>
                        </div>

                        <div
                          className="
                            shrink-0
                            rounded-lg
                            bg-[#800000]
                            px-3
                            py-1.5
                            text-sm
                            font-bold
                            text-[#FFD700]
                          "
                        >
                          × {item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center">
                    <Package className="mx-auto h-7 w-7 text-gray-300" />

                    <p className="mt-2 text-sm font-medium text-gray-500">
                      No tools requested
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ================================================= */}
            {/* GROUP MEMBERS */}
            {/* ================================================= */}

            {request.members && request.members.length > 0 && (
              <section
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#800000]/10
                  bg-white
                  shadow-sm
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-[#800000]/10
                    bg-[#800000]/[0.035]
                    px-5
                    py-4
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#800000]
                      text-[#FFD700]
                    "
                  >
                    <Users className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#800000]">
                      Group Members
                    </h3>

                    <p className="text-xs text-gray-500">
                      Students included in this borrowing group
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 p-5 sm:grid-cols-2">
                  {request.members.map((member, index) => (
                    <div
                      key={index}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-gray-100
                        bg-gray-50/70
                        px-4
                        py-3
                      "
                    >
                      <span
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#800000]/5
                          text-xs
                          font-bold
                          text-[#800000]
                        "
                      >
                        {index + 1}
                      </span>

                      <span className="text-sm font-medium text-gray-700">
                        {member}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ================================================= */}
            {/* REJECTION INFORMATION */}
            {/* ================================================= */}

            {request.status === "rejected" && (
              <section
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-red-200
                  bg-white
                  shadow-sm
                "
              >
                {/* SECTION HEADER */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-red-200
                    bg-red-50
                    px-5
                    py-4
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-red-100
                      text-red-600
                    "
                  >
                    <XCircle className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-red-800">
                      Rejection Information
                    </h3>

                    <p className="text-xs text-red-600/70">
                      Reason and date of rejection
                    </p>
                  </div>
                </div>

                {/* SECTION CONTENT */}

                <div className="space-y-4 p-5">
                  {/* REJECTION REASON */}

                  <div
                    className="
                      rounded-xl
                      border
                      border-red-100
                      bg-red-50/60
                      p-4
                    "
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                      Rejection Reason
                    </p>

                    <p className="mt-1.5 break-words text-sm font-semibold leading-6 text-red-800">
                      {request.rejectReason || "No reason provided"}
                    </p>
                  </div>

                  {/* REJECTION DATE */}

                  {request.rejectedDate && (
                    <div
                      className="
                        rounded-xl
                        border
                        border-gray-100
                        bg-gray-50/70
                        px-4
                        py-3.5
                      "
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Rejected On
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {formatDateTime(request.rejectedDate)}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ================================================= */}
            {/* SECURITY NOTE */}
            {/* ================================================= */}

            <div className="flex items-center gap-3 rounded-xl border border-[#800000]/10 bg-[#800000]/[0.025] px-4 py-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#800000]" />

              <p className="text-xs leading-5 text-gray-500">
                Request actions are recorded by the laboratory
                management system.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* FOOTER ACTIONS */}
        {/* ===================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-gray-100
            bg-gray-50/80
            px-6
            py-4
            sm:px-7
          "
        >
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            {/* CLOSE */}

            <Button
              variant="outline"
              onClick={onClose}
              className="
                h-11
                w-full
                rounded-xl
                border-gray-200
                bg-white
                px-5
                text-gray-700
                hover:border-[#800000]/20
                hover:bg-[#800000]/5
                hover:text-[#800000]
                sm:w-auto
              "
            >
              Close
            </Button>

            {/* ================================================= */}
            {/* PENDING */}
            {/* ================================================= */}

            {request.status === "pending" && (
              <>
                {/* REJECT */}

                <Button
                  onClick={() => onReject(request._id)}
                  className="
                    h-11
                    w-full
                    rounded-xl
                    bg-red-600
                    px-5
                    font-semibold
                    text-white
                    shadow-sm
                    hover:bg-red-700
                    sm:w-auto
                  "
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Request
                </Button>

                {/* APPROVE */}

                <Button
                  onClick={() => onApprove(request._id)}
                  className="
                    h-11
                    w-full
                    rounded-xl
                    bg-[#800000]
                    px-5
                    font-semibold
                    text-[#FFD700]
                    shadow-sm
                    shadow-[#800000]/20
                    hover:bg-[#660000]
                    sm:w-auto
                  "
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve Request
                </Button>
              </>
            )}

            {/* ================================================= */}
            {/* APPROVED */}
            {/* ================================================= */}

            {request.status === "approved" && (
              <Button
                onClick={() => onRelease(request._id)}
                className="
                  h-11
                  w-full
                  rounded-xl
                  bg-[#800000]
                  px-5
                  font-semibold
                  text-[#FFD700]
                  shadow-sm
                  shadow-[#800000]/20
                  hover:bg-[#660000]
                  sm:w-auto
                "
              >
                <Package className="mr-2 h-4 w-4" />
                Release Tools
              </Button>
            )}

            {/* ================================================= */}
            {/* RELEASED */}
            {/* ================================================= */}

            {request.status === "released" && (
              <Button
                onClick={() => onReturn(request._id)}
                className="
                  h-11
                  w-full
                  rounded-xl
                  bg-[#800000]
                  px-5
                  font-semibold
                  text-[#FFD700]
                  shadow-sm
                  shadow-[#800000]/20
                  hover:bg-[#660000]
                  sm:w-auto
                "
              >
                <Package className="mr-2 h-4 w-4" />
                Mark as Returned
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   INFO ITEM
   ============================================================= */

function InfoItem({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p
        className={`break-words text-sm leading-6 ${
          highlighted
            ? "font-bold text-[#800000]"
            : "font-semibold text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}