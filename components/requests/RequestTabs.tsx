"use client";

interface Props {
  activeTab:
    | "pending"
    | "approved"
    | "released"
    | "returned"
    | "rejected";
}

const tabs = [
  {
    key: "pending",
    label: "Pending",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  {
    key: "approved",
    label: "Approved",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    key: "released",
    label: "Released",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    key: "returned",
    label: "Returned",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    key: "rejected",
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
] as const;

export default function RequestTabs({ activeTab }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <div
            key={tab.key}
            className={`
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              px-4
              py-2
              text-sm
              font-semibold
              select-none
              ${tab.bg}
              ${tab.color}
              ${tab.border}
              ${isActive ? "ring-2 ring-[#800000]/10" : "opacity-75"}
            `}
          >
            <span
              className={`
                h-2
                w-2
                rounded-full
                ${isActive ? "bg-current" : "bg-current/50"}
              `}
            />

            <span>
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}