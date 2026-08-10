"use client";

import { useEffect, useState } from "react";
import { X, Check, XCircle, Package, User, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Request } from "./RequestsManager";

interface RequestModalProps {
  open: boolean;
  request: Request | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onRelease: (id: string) => void;
  onReturn: (id: string) => void;
}

const rejectionReasons = [
  "Requested tools are unavailable",
  "Insufficient tool quantity",
  "Request information is incomplete or invalid",
  "Others",
];

export default function RequestModal({
  open,
  request,
  onClose,
  onApprove,
  onReject,
  onRelease,
  onReturn,
}: RequestModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    if (!open) {
      setRejectReason("");
      setCustomReason("");
    }
  }, [open]);

  if (!open || !request) return null;

  const isRejected = request.status === "rejected";

  const handleReject = () => {
    if (!rejectReason) {
      alert("Please select a rejection reason.");
      return;
    }

    let finalReason = rejectReason;

    if (rejectReason === "Others") {
      if (!customReason.trim()) {
        alert("Please enter the rejection reason.");
        return;
      }

      finalReason = customReason.trim();
    }

    onReject(request._id, finalReason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#800000]">
              Request Details
            </h2>

            <p className="text-sm text-gray-500">
              Review student borrowing request
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-6 p-6">

          {/* STUDENT INFORMATION */}
          <div className="rounded-xl border bg-gray-50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#800000]">
              <User size={18} />
              Student Information
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">

              <div>
                <p className="text-xs text-gray-500">
                  Student Name
                </p>

                <p className="font-medium text-gray-900">
                  {request.studentName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Section
                </p>

                <p className="font-medium text-gray-900">
                  {request.section || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Group Number
                </p>

                <p className="font-medium text-gray-900">
                  {request.groupNumber || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Instructor
                </p>

                <p className="font-medium text-gray-900">
                  {request.instructor || "N/A"}
                </p>
              </div>

            </div>
          </div>

          {/* REQUEST INFORMATION */}
          <div className="rounded-xl border bg-gray-50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#800000]">
              <CalendarDays size={18} />
              Request Information
            </h3>

            <div className="space-y-3">

              <div>
                <p className="text-xs text-gray-500">
                  Activity
                </p>

                <p className="font-medium text-gray-900">
                  {request.activityTitle}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Date
                </p>

                <p className="font-medium text-gray-900">
                  {request.date}
                </p>
              </div>

            </div>
          </div>

          {/* TOOLS */}
          <div className="rounded-xl border bg-gray-50 p-4">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#800000]">
              <Package size={18} />
              Requested Tools
            </h3>

            {request.cart && request.cart.length > 0 ? (
              <div className="space-y-2">

                {request.cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.name}
                      </p>
                    </div>

                    <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                      × {item.quantity}
                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No tools requested.
              </p>
            )}
          </div>

          {/* MEMBERS */}
          {request.members && request.members.length > 0 && (
            <div className="rounded-xl border bg-gray-50 p-4">
              <h3 className="mb-3 font-semibold text-[#800000]">
                Group Members
              </h3>

              <div className="space-y-1">
                {request.members.map((member, index) => (
                  <p
                    key={index}
                    className="text-sm text-gray-700"
                  >
                    {index + 1}. {member}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* REJECTION REASON */}
          {request.status === "pending" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">

              <h3 className="mb-3 font-semibold text-red-800">
                Rejection Reason
              </h3>

              <p className="mb-3 text-sm text-gray-600">
                If you reject this request, select the reason below.
              </p>

              <select
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);

                  if (e.target.value !== "Others") {
                    setCustomReason("");
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
              >
                <option value="">
                  Select rejection reason
                </option>

                {rejectionReasons.map((reason) => (
                  <option
                    key={reason}
                    value={reason}
                  >
                    {reason}
                  </option>
                ))}
              </select>

              {/* CUSTOM REASON */}
              {rejectReason === "Others" && (
                <div className="mt-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Specify the rejection reason
                  </label>

                  <textarea
                    value={customReason}
                    onChange={(e) =>
                      setCustomReason(e.target.value)
                    }
                    placeholder="Enter the actual reason..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                  />
                </div>
              )}

            </div>
          )}

          {/* SHOW SAVED REJECTION REASON */}
          {isRejected && request.rejectReason && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <h3 className="mb-2 font-semibold text-red-800">
                Reason for Rejection
              </h3>

              <p className="text-sm text-red-700">
                {request.rejectReason}
              </p>
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col gap-2 border-t bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>

          {request.status === "pending" && (
            <>
              <Button
                onClick={handleReject}
                className="w-full bg-red-600 text-white hover:bg-red-700 sm:w-auto"
              >
                <XCircle size={16} className="mr-2" />
                Reject Request
              </Button>

              <Button
                onClick={() => onApprove(request._id)}
                className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
              >
                <Check size={16} className="mr-2" />
                Approve Request
              </Button>
            </>
          )}

          {request.status === "approved" && (
            <Button
              onClick={() => onRelease(request._id)}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto"
            >
              <Package size={16} className="mr-2" />
              Release Tools
            </Button>
          )}

          {request.status === "released" && (
            <Button
              onClick={() => onReturn(request._id)}
              className="w-full bg-purple-600 text-white hover:bg-purple-700 sm:w-auto"
            >
              <Package size={16} className="mr-2" />
              Mark as Returned
            </Button>
          )}

        </div>

      </div>
    </div>
  );
}
