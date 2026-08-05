"use client";

interface Props {
  status: "pending" | "approved" | "released" | "returned" | "rejected";
}

export default function RequestStatusBadge({ status }: Props) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    released: "bg-blue-100 text-blue-800",
    returned: "bg-purple-100 text-purple-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}