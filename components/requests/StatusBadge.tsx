"use client";

interface Props {
  status:
    | "pending"
    | "approved"
    | "released"
    | "returned"
    | "rejected";
}

export default function StatusBadge({ status }: Props) {
  const styles = {
    pending:
      "bg-yellow-100 text-yellow-800 border border-yellow-300",

    approved:
      "bg-green-100 text-green-800 border border-green-300",

    released:
      "bg-blue-100 text-blue-800 border border-blue-300",

    returned:
      "bg-gray-200 text-gray-800 border border-gray-300",

    rejected:
      "bg-red-100 text-red-800 border border-red-300",
  };

  const labels = {
    pending: "Pending",
    approved: "Approved",
    released: "Released",
    returned: "Returned",
    rejected: "Rejected",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}