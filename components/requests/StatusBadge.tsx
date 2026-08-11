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
    pending: {
      wrapper: "bg-yellow-50 text-yellow-700 border-yellow-200",
      dot: "bg-yellow-500",
      label: "Pending",
    },

    approved: {
      wrapper: "bg-green-50 text-green-700 border-green-200",
      dot: "bg-green-500",
      label: "Approved",
    },

    released: {
      wrapper: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
      label: "Released",
    },

    returned: {
      wrapper: "bg-purple-50 text-purple-700 border-purple-200",
      dot: "bg-purple-500",
      label: "Returned",
    },

    rejected: {
      wrapper: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
      label: "Rejected",
    },
  };

  const style = styles[status];

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-3.5
        py-1.5
        text-xs
        font-semibold
        tracking-wide
        whitespace-nowrap
        ${style.wrapper}
      `}
    >
      <span
        className={`
          h-2
          w-2
          rounded-full
          shrink-0
          ${style.dot}
        `}
      />

      {style.label}
    </span>
  );
}