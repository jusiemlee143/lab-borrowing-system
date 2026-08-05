"use client";

interface Props {
  activeTab:
    | "pending"
    | "approved"
    | "released"
    | "returned"
    | "rejected";

  onChange: (
    tab:
      | "pending"
      | "approved"
      | "released"
      | "returned"
      | "rejected"
  ) => void;
}

const tabs = [
  "pending",
  "approved",
  "released",
  "returned",
  "rejected",
] as const;

export default function RequestTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded-lg font-medium capitalize transition-all

          ${
            activeTab === tab
              ? "bg-[#800000] text-[#FFD700]"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}