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
}

export default function RequestsManager() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] =
    useState<Request | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "pending" |
    "approved" |
    "released" |
    "returned" |
    "rejected"
  >("pending");

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
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateRequest(
    id: string,
    action: "approve" | "reject" | "release" | "return"
  ) {
    try {
      const res = await fetch(`/api/lab-in-charge/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      await fetchRequests();

      closeModal();
    } catch (err) {
      console.error(err);
    }
  }

  function openModal(request: Request) {
    setSelectedRequest(request);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedRequest(null);
  }

  const filtered = requests.filter(
    (request) => request.status === activeTab
  );

  return (
    <Card className="rounded-2xl shadow-md">

      <CardHeader className="border-b bg-blue-50">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <User size={20} />
          Request Management
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">

        <RequestTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

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
            onView={openModal}
            onApprove={(id) => updateRequest(id, "approve")}
            onReject={(id) => updateRequest(id, "reject")}
            onRelease={(id) => updateRequest(id, "release")}
            onReturn={(id) => updateRequest(id, "return")}
          />
        )}

        <RequestModal
          open={modalOpen}
          request={selectedRequest}
          onClose={closeModal}
          onApprove={(id) => updateRequest(id, "approve")}
          onReject={(id) => updateRequest(id, "reject")}
          onRelease={(id) => updateRequest(id, "release")}
          onReturn={(id) => updateRequest(id, "return")}
        />

      </CardContent>

    </Card>
  );
}