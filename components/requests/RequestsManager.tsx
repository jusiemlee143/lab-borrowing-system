"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Cpu,
} from "lucide-react";

import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import RequestTable from "./RequestTable";
import RequestModal from "./RequestModal";

export interface Request {
  _id: string;

  studentName: string;
  section?: string;
  groupNumber?: string;

  date: string;
  activityTitle: string;
  instructor?: string;
  instructorName?: string;

  members?: string[];

  cart?: {
    id: string;
    name: string;
    quantity: number;
  }[];

  status:
    | "pending"
    | "approved"
    | "released"
    | "returned"
    | "rejected";

  approvedDate?: string;
  releasedDate?: string;
  returnedDate?: string;
  rejectedDate?: string;

  /*
   * The rejection reason is kept in the request data
   * because it may be needed by the student side.
   *
   * It is NOT displayed inside RequestModal.
   */
  rejectReason?: string;
}

type RequestStatus =
  | "pending"
  | "approved"
  | "released"
  | "returned"
  | "rejected";

type RequestAction =
  | "approve"
  | "reject"
  | "release"
  | "return";

export default function RequestsManager() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] =
    useState<Request | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [activeTab, setActiveTab] =
    useState<RequestStatus>("pending");

  // =====================================================
  // REJECTION DIALOG STATE
  // =====================================================

  const [rejectDialogOpen, setRejectDialogOpen] =
    useState(false);

  const [rejectReason, setRejectReason] =
    useState("");

  const [selectedRejectReason, setSelectedRejectReason] =
    useState("");

  const [rejectingRequestId, setRejectingRequestId] =
    useState<string | null>(null);

  const [rejecting, setRejecting] =
    useState(false);

  // =====================================================
  // COMMON REJECTION REASONS
  // =====================================================

  const rejectionReasons = [
    "Incomplete request information",
    "Requested tools are unavailable",
    "Schedule/activity conflict",
    "Others",
  ];

  // =====================================================
  // FETCH REQUESTS
  // =====================================================

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/lab-in-charge/requests"
      );

      const data = await res.json();

      setRequests(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Error fetching requests:",
        err
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // UPDATE REQUEST
  // =====================================================

  async function updateRequest(
    id: string,
    action: RequestAction,
    reason?: string
  ): Promise<boolean> {
    try {
      const res = await fetch(
        `/api/lab-in-charge/requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,

            ...(action === "reject" && {
              rejectReason: reason,
            }),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.message ||
            "Unable to update request."
        );

        return false;
      }

      await fetchRequests();

      closeModal();

      return true;
    } catch (err) {
      console.error(
        "Error updating request:",
        err
      );

      alert(
        "Something went wrong while updating the request."
      );

      return false;
    }
  }

  // =====================================================
  // OPEN REJECTION DIALOG
  // =====================================================

  function handleReject(id: string) {
    /*
     * Only the rejection dialog asks for the reason.
     *
     * The RequestModal itself does NOT ask for a
     * rejection reason anymore.
     */

    setRejectingRequestId(id);
    setSelectedRejectReason("");
    setRejectReason("");
    setRejectDialogOpen(true);
  }

  // =====================================================
  // CLOSE REJECTION DIALOG
  // =====================================================

  function closeRejectDialog() {
    if (rejecting) {
      return;
    }

    setRejectDialogOpen(false);
    setSelectedRejectReason("");
    setRejectReason("");
    setRejectingRequestId(null);
  }

  // =====================================================
  // HANDLE REJECTION REASON CHANGE
  // =====================================================

  function handleRejectReasonChange(
    reason: string
  ) {
    setSelectedRejectReason(reason);

    if (reason !== "Others") {
      setRejectReason("");
    }
  }

  // =====================================================
  // CONFIRM REJECTION
  // =====================================================

  async function confirmReject() {
    if (!rejectingRequestId) {
      return;
    }

    let finalReason = "";

    // ===================================================
    // OTHERS
    // ===================================================

    if (
      selectedRejectReason === "Others"
    ) {
      finalReason = rejectReason.trim();

      if (!finalReason) {
        alert(
          "Please provide the reason for rejecting this request."
        );

        return;
      }
    }

    // ===================================================
    // PREDEFINED REASON
    // ===================================================

    else {
      finalReason = selectedRejectReason;
    }

    // ===================================================
    // NO REASON SELECTED
    // ===================================================

    if (!finalReason) {
      alert(
        "Please select a reason for rejecting this request."
      );

      return;
    }

    try {
      setRejecting(true);

      const success =
        await updateRequest(
          rejectingRequestId,
          "reject",
          finalReason
        );

      if (success) {
        setRejectDialogOpen(false);
        setSelectedRejectReason("");
        setRejectReason("");
        setRejectingRequestId(null);
      }
    } finally {
      setRejecting(false);
    }
  }

  // =====================================================
  // REQUEST MODAL
  // =====================================================

  function openModal(
    request: Request
  ) {
    setSelectedRequest(request);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedRequest(null);
  }

  // =====================================================
  // FILTER
  // =====================================================

  const filtered = requests.filter(
    (request) =>
      request.status === activeTab
  );

  // =====================================================
  // STATISTICS
  // =====================================================

  const requestStats = {
    pending: requests.filter(
      (r) => r.status === "pending"
    ).length,

    approved: requests.filter(
      (r) => r.status === "approved"
    ).length,

    released: requests.filter(
      (r) => r.status === "released"
    ).length,

    returned: requests.filter(
      (r) => r.status === "returned"
    ).length,

    rejected: requests.filter(
      (r) => r.status === "rejected"
    ).length,
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      {/* ================================================= */}
      {/* TOP ACCENT LINE */}
      {/* ================================================= */}

      <div className="h-1 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* TITLE */}

          <div className="flex items-start gap-4">

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

            <div>
              <CardTitle className="text-xl font-bold text-[#800000]">
                Request Management
              </CardTitle>

              <p className="mt-1 text-sm text-gray-500">
                Review, process, and monitor
                student laboratory requests.
              </p>
            </div>

          </div>

          {/* SYSTEM STATUS */}

          <div
            className="
              flex
              items-center
              gap-3
              self-start
              rounded-xl
              border
              border-green-100
              bg-green-50
              px-4
              py-2.5
              lg:self-center
            "
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>

            <div>
              <p className="text-xs font-semibold text-green-700">
                System Active
              </p>

              <p className="text-[10px] text-green-600">
                Request service online
              </p>
            </div>

            <ShieldCheck className="h-4 w-4 text-green-600" />
          </div>

        </div>
      </CardHeader>

      {/* ================================================= */}
      {/* REQUEST STATUS OVERVIEW */}
      {/* ================================================= */}

      <div className="px-6 pb-5">

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          {/* PENDING */}

          <RequestStat
            label="Pending"
            value={requestStats.pending}
            icon={
              <Clock3 className="h-4 w-4" />
            }
            color="blue"
            active={
              activeTab === "pending"
            }
            onClick={() =>
              setActiveTab("pending")
            }
          />

          {/* APPROVED */}

          <RequestStat
            label="Approved"
            value={requestStats.approved}
            icon={
              <CheckCircle2 className="h-4 w-4" />
            }
            color="green"
            active={
              activeTab === "approved"
            }
            onClick={() =>
              setActiveTab("approved")
            }
          />

          {/* RELEASED */}

          <RequestStat
            label="Released"
            value={requestStats.released}
            icon={
              <PackageCheck className="h-4 w-4" />
            }
            color="indigo"
            active={
              activeTab === "released"
            }
            onClick={() =>
              setActiveTab("released")
            }
          />

          {/* RETURNED */}

          <RequestStat
            label="Returned"
            value={requestStats.returned}
            icon={
              <RotateCcw className="h-4 w-4" />
            }
            color="purple"
            active={
              activeTab === "returned"
            }
            onClick={() =>
              setActiveTab("returned")
            }
          />

          {/* REJECTED */}

          <RequestStat
            label="Rejected"
            value={requestStats.rejected}
            icon={
              <XCircle className="h-4 w-4" />
            }
            color="red"
            active={
              activeTab === "rejected"
            }
            onClick={() =>
              setActiveTab("rejected")
            }
          />

        </div>
      </div>

      {/* ================================================= */}
      {/* DIVIDER */}
      {/* ================================================= */}

      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#800000]/10 to-transparent" />

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <CardContent className="p-6">

        {/* SECTION LABEL */}

        <div className="mb-5 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Cpu className="h-4 w-4 text-[#800000]" />

            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#800000]/60">
              Request Queue
            </span>

          </div>

          <div className="text-xs text-gray-400">
            {filtered.length}{" "}
            {filtered.length === 1
              ? "request"
              : "requests"}
          </div>

        </div>

        {/* ================================================= */}
        {/* REQUEST LIST */}
        {/* ================================================= */}

        {loading ? (

          <div className="flex flex-col items-center justify-center py-16">

            <div
              className="
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                border
                border-[#800000]/10
                bg-[#800000]/5
              "
            >
              <ClipboardList className="h-6 w-6 animate-pulse text-[#800000]" />
            </div>

            <p className="text-sm font-medium text-gray-600">
              Loading requests...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Please wait while the request queue is loaded.
            </p>

          </div>

        ) : filtered.length === 0 ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-gray-200
              bg-gray-50/60
              py-16
            "
          >

            <div
              className="
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#800000]/5
                text-[#800000]
              "
            >
              <ClipboardList className="h-7 w-7" />
            </div>

            <h3 className="text-base font-semibold text-gray-700">
              No requests found
            </h3>

            <p className="mt-1 max-w-sm text-center text-sm text-gray-400">
              There are currently no requests
              under the{" "}
              <span className="font-medium text-gray-500">
                {activeTab}
              </span>{" "}
              status.
            </p>

          </div>

        ) : (

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-100
              bg-white
            "
          >
            <RequestTable
              requests={filtered}
              onView={openModal}
            />
          </div>

        )}

        {/* ================================================= */}
        {/* REQUEST MODAL */}
        {/* ================================================= */}

        <RequestModal
          open={modalOpen}
          request={selectedRequest}
          onClose={closeModal}

          onApprove={(id: string) =>
            updateRequest(
              id,
              "approve"
            )
          }

          /*
           * This only opens the rejection dialog.
           *
           * The rejection reason is NOT requested inside
           * RequestModal.
           */
          onReject={(id: string) =>
            handleReject(id)
          }

          onRelease={(id: string) =>
            updateRequest(
              id,
              "release"
            )
          }

          onReturn={(id: string) =>
            updateRequest(
              id,
              "return"
            )
          }
        />

      </CardContent>

      {/* ===================================================== */}
      {/* SINGLE REJECTION REASON DIALOG */}
      {/* ===================================================== */}

      {rejectDialogOpen && (

        <div
          className="
            fixed
            inset-0
            z-[100]
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
              w-full
              max-w-lg
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            {/* TOP ACCENT */}

            <div className="h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600" />

            {/* HEADER */}

            <div className="border-b px-6 py-5">

              <div className="flex items-start gap-4">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    text-red-600
                  "
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Reject Request
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Please select a reason for rejecting this request.
                  </p>

                </div>

              </div>

            </div>

            {/* CONTENT */}

            <div className="px-6 py-5">

              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Rejection Reason
              </label>

              <div className="space-y-2.5">

                {rejectionReasons.map(
                  (reason) => (

                    <label
                      key={reason}
                      className={`
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        rounded-xl
                        border
                        p-3.5
                        transition-all
                        ${
                          selectedRejectReason ===
                          reason
                            ? "border-red-400 bg-red-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }
                        ${
                          rejecting
                            ? "cursor-not-allowed opacity-60"
                            : ""
                        }
                      `}
                    >

                      <input
                        type="radio"
                        name="rejectReason"
                        value={reason}
                        checked={
                          selectedRejectReason ===
                          reason
                        }
                        onChange={() =>
                          handleRejectReasonChange(
                            reason
                          )
                        }
                        disabled={rejecting}
                        className="h-4 w-4 accent-red-600"
                      />

                      <span className="text-sm font-medium text-gray-700">
                        {reason}
                      </span>

                    </label>

                  )
                )}

              </div>

              {/* CUSTOM REASON */}

              {selectedRejectReason ===
                "Others" && (

                <div className="mt-5">

                  <label
                    htmlFor="customRejectReason"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Please specify the reason
                  </label>

                  <textarea
                    id="customRejectReason"
                    value={rejectReason}
                    onChange={(e) =>
                      setRejectReason(
                        e.target.value
                      )
                    }
                    placeholder="Enter the specific reason..."
                    rows={4}
                    disabled={rejecting}
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-red-400
                      focus:ring-4
                      focus:ring-red-100
                      disabled:cursor-not-allowed
                      disabled:bg-gray-100
                    "
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    This reason will be visible to the student.
                  </p>

                </div>

              )}

              {/* COMMON REASON NOTICE */}

              {selectedRejectReason &&
                selectedRejectReason !==
                  "Others" && (

                <div
                  className="
                    mt-4
                    rounded-lg
                    border
                    border-gray-100
                    bg-gray-50
                    px-3
                    py-2.5
                  "
                >

                  <p className="text-xs text-gray-500">
                    This reason will be visible to the student.
                  </p>

                </div>

              )}

            </div>

            {/* FOOTER */}

            <div
              className="
                flex
                justify-end
                gap-3
                border-t
                bg-gray-50
                px-6
                py-4
              "
            >

              <button
                type="button"
                onClick={closeRejectDialog}
                disabled={rejecting}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmReject}
                disabled={
                  rejecting ||
                  !selectedRejectReason ||
                  (
                    selectedRejectReason ===
                      "Others" &&
                    !rejectReason.trim()
                  )
                }
                className="
                  rounded-xl
                  bg-red-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {rejecting
                  ? "Rejecting..."
                  : "Reject Request"}
              </button>

            </div>

          </div>
        </div>
      )}

    </>
  );
}

// =============================================================
// REQUEST STAT CARD
// =============================================================

function RequestStat({
  label,
  value,
  icon,
  color,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color:
    | "blue"
    | "green"
    | "indigo"
    | "purple"
    | "red";
  active: boolean;
  onClick: () => void;
}) {
  const styles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      active:
        "border-blue-300 bg-blue-50/70 shadow-blue-500/10",
      number: "text-blue-600",
    },

    green: {
      icon: "bg-green-50 text-green-600",
      active:
        "border-green-300 bg-green-50/70 shadow-green-500/10",
      number: "text-green-600",
    },

    indigo: {
      icon: "bg-indigo-50 text-indigo-600",
      active:
        "border-indigo-300 bg-indigo-50/70 shadow-indigo-500/10",
      number: "text-indigo-600",
    },

    purple: {
      icon: "bg-purple-50 text-purple-600",
      active:
        "border-purple-300 bg-purple-50/70 shadow-purple-500/10",
      number: "text-purple-600",
    },

    red: {
      icon: "bg-red-50 text-red-600",
      active:
        "border-red-300 bg-red-50/70 shadow-red-500/10",
      number: "text-red-600",
    },
  };

  const style = styles[color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        w-full
        rounded-xl
        border
        p-3.5
        text-left
        transition-all
        duration-200
        ${
          active
            ? style.active
            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
        }
      `}
    >

      {/* ACTIVE INDICATOR */}

      {active && (
        <span className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-[#800000]" />
      )}

      <div className="flex items-center justify-between gap-2">

        <div
          className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            ${style.icon}
          `}
        >
          {icon}
        </div>

        <span
          className={`
            text-2xl
            font-bold
            ${style.number}
          `}
        >
          {value}
        </span>

      </div>

      <p className="mt-2 text-xs font-semibold text-gray-500">
        {label}
      </p>

    </button>
  );
}