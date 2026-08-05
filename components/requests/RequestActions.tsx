"use client";

import { Button } from "@/components/ui/button";

interface Props {
  status: "pending" | "approved" | "released" | "returned" | "rejected";

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
  if (status === "pending") {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={onApprove}
        >
          Approve
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={onReject}
        >
          Reject
        </Button>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <Button
        size="sm"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={onRelease}
      >
        Release
      </Button>
    );
  }

  if (status === "released") {
    return (
      <Button
        size="sm"
        className="bg-purple-600 hover:bg-purple-700"
        onClick={onReturn}
      >
        Return
      </Button>
    );
  }

  if (status === "returned") {
    return (
      <Button
        size="sm"
        disabled
        className="bg-gray-400 cursor-not-allowed"
      >
        Returned
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      disabled
      variant="destructive"
    >
      Rejected
    </Button>
  );
}