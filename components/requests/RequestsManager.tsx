"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import RequestTabs from "./RequestTabs";
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

// Rejection information
rejectReason?: string;
}

export default function RequestsManager() {
const [requests, setRequests] = useState<Request[]>([]);
const [loading, setLoading] = useState(true);

const [selectedRequest, setSelectedRequest] =
useState<Request | null>(null);

const [modalOpen, setModalOpen] = useState(false);

const [activeTab, setActiveTab] = useState<
"pending" | "approved" | "released" | "returned" | "rejected"

> ("pending");

// =====================================================
// REJECTION REASON STATE
// =====================================================

const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

const [rejectReason, setRejectReason] = useState("");

const [selectedRejectReason, setSelectedRejectReason] = useState("");

const [rejectingRequestId, setRejectingRequestId] =
useState<string | null>(null);

const [rejecting, setRejecting] = useState(false);

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


  const res = await fetch("/api/lab-in-charge/requests");

  const data = await res.json();

  setRequests(Array.isArray(data) ? data : []);
} catch (err) {
  console.error("Error fetching requests:", err);
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
action: "approve" | "reject" | "release" | "return",
reason?: string
) {
try {
const res = await fetch(`/api/lab-in-charge/requests/${id}`, {
method: "PATCH",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
action,


      // Only send rejectReason when rejecting
      ...(action === "reject" && {
        rejectReason: reason,
      }),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Unable to update request.");
    return false;
  }

  await fetchRequests();

  closeModal();

  return true;
} catch (err) {
  console.error("Error updating request:", err);

  alert("Something went wrong while updating the request.");

  return false;
}


}

// =====================================================
// OPEN REJECTION DIALOG
// =====================================================

function handleReject(id: string) {
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
// HANDLE REJECTION REASON SELECTION
// =====================================================

function handleRejectReasonChange(reason: string) {
setSelectedRejectReason(reason);


// Clear custom reason when changing away from "Others"
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

// If Others was selected, use the custom reason
if (selectedRejectReason === "Others") {
  finalReason = rejectReason.trim();

  if (!finalReason) {
    alert("Please provide the reason for rejecting this request.");
    return;
  }
} else {
  finalReason = selectedRejectReason;
}

// Make sure a reason was selected
if (!finalReason) {
  alert("Please select a reason for rejecting this request.");
  return;
}

try {
  setRejecting(true);

  const success = await updateRequest(
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
// OPEN REQUEST MODAL
// =====================================================

function openModal(request: Request) {
setSelectedRequest(request);
setModalOpen(true);
}

// =====================================================
// CLOSE REQUEST MODAL
// =====================================================

function closeModal() {
setModalOpen(false);
setSelectedRequest(null);
}

// =====================================================
// FILTER REQUESTS
// =====================================================

const filtered = requests.filter(
(request) => request.status === activeTab
);

// =====================================================
// UI
// =====================================================

return (
<> <Card>
{/* HEADER */} <CardHeader className="border-b bg-blue-50"> <CardTitle className="flex items-center gap-2 text-blue-800"> <User size={20} />
Request Management </CardTitle> </CardHeader>


    {/* CONTENT */}
    <CardContent className="p-6">
      {/* REQUEST TABS */}
      <RequestTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* REQUEST LIST */}
      {loading ? (
        <p className="text-center py-10">
          Loading...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No requests found.
        </p>
      ) : (
        <RequestTable
          requests={filtered}

          // View
          onView={openModal}

          // Approve
          onApprove={(id) =>
            updateRequest(id, "approve")
          }

          // Reject
          onReject={handleReject}

          // Release
          onRelease={(id) =>
            updateRequest(id, "release")
          }

          // Return
          onReturn={(id) =>
            updateRequest(id, "return")
          }
        />
      )}

      {/* REQUEST MODAL */}
      <RequestModal
        open={modalOpen}
        request={selectedRequest}
        onClose={closeModal}

        // Approve
        onApprove={(id) =>
          updateRequest(id, "approve")
        }

        // Reject
        onReject={handleReject}

        // Release
        onRelease={(id) =>
          updateRequest(id, "release")
        }

        // Return
        onReturn={(id) =>
          updateRequest(id, "return")
        }
      />
    </CardContent>
  </Card>

  {/* =================================================
      REJECTION REASON DIALOG
      ================================================= */}

  {rejectDialogOpen && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">

        {/* DIALOG HEADER */}
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Reject Request
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Please select a reason for rejecting this request.
          </p>
        </div>

        {/* DIALOG CONTENT */}
        <div className="px-6 py-5">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Rejection Reason
          </label>

          {/* COMMON REASONS */}
          <div className="space-y-3">
            {rejectionReasons.map((reason) => (
              <label
                key={reason}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                  selectedRejectReason === reason
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white hover:bg-gray-50"
                } ${
                  rejecting
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="rejectReason"
                  value={reason}
                  checked={
                    selectedRejectReason === reason
                  }
                  onChange={() =>
                    handleRejectReasonChange(reason)
                  }
                  disabled={rejecting}
                  className="h-4 w-4 accent-red-600"
                />

                <span className="text-sm text-gray-700">
                  {reason}
                </span>
              </label>
            ))}
          </div>

          {/* OTHER REASON INPUT */}
          {selectedRejectReason === "Others" && (
            <div className="mt-4">
              <label
                htmlFor="customRejectReason"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Please specify the reason
              </label>

              <textarea
                id="customRejectReason"
                value={rejectReason}
                onChange={(e) =>
                  setRejectReason(e.target.value)
                }
                placeholder="Enter the specific reason..."
                rows={4}
                disabled={rejecting}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                This reason will be visible to the student.
              </p>
            </div>
          )}

          {/* NOTICE FOR COMMON REASONS */}
          {selectedRejectReason &&
            selectedRejectReason !== "Others" && (
              <p className="mt-4 text-xs text-gray-500">
                This reason will be visible to the student.
              </p>
            )}
        </div>

        {/* DIALOG FOOTER */}
        <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={closeRejectDialog}
            disabled={rejecting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={confirmReject}
            disabled={
              rejecting ||
              !selectedRejectReason ||
              (selectedRejectReason === "Others" &&
                !rejectReason.trim())
            }
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {rejecting ? "Rejecting..." : "Reject Request"}
          </button>
        </div>
      </div>
    </div>
  )}

  {/* IMPORTANT: CLOSE THE FRAGMENT */}
</>


);
}
