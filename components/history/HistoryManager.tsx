"use client";

import { useEffect, useState } from "react";

import {
  History,
  CheckCircle2,
  XCircle,
  PackageCheck,
  RotateCcw,
  Clock3,
  User,
  RefreshCw,
  ClipboardList,
  Search,
  Eye,
  X,
  GraduationCap,
  Users,
  Wrench,
  CalendarDays,
  FileText,
  Hash,
  Eraser,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

// ============================================================
// TYPES
// ============================================================

interface Teacher {
  _id?: string;
  name?: string;
  email?: string;
}

interface CartItem {
  _id?: string;
  id?: string;
  name?: string;
  quantity?: number;
}

interface RequestData {
  _id: string;

  studentName?: string;
  section?: string;
  groupNumber?: string;
  date?: string;
  activityTitle?: string;

  instructor?: Teacher | string | null;

  members?: string[];

  cart?: CartItem[];

  status?:
    | "pending"
    | "approved"
    | "released"
    | "returned"
    | "rejected";

  approvedBy?: string;
  approvedDate?: string | null;

  releasedBy?: string;
  releasedDate?: string | null;

  returnedBy?: string;
  returnedDate?: string | null;

  rejectedBy?: string;
  rejectedDate?: string | null;

  rejectReason?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface HistoryItem {
  _id: string;

  requestId:
    | string
    | {
        _id?: string;
      };

  action:
    | "created"
    | "approved"
    | "rejected"
    | "released"
    | "returned"
    | "edited"
    | "cancelled";

  performedBy?: {
    userId?: string | null;
    fullName?: string;
    employeeId?: string;
    role?: string;
  };

  reason?: string;

  createdAt: string;
  updatedAt?: string;

  request?: RequestData | null;
}

// ============================================================
// ROLE TYPES
// ============================================================

type RoleFilter =
  | "all"
  | "student"
  | "lab-in-charge";

type NormalizedRole =
  | "student"
  | "lab-in-charge";

// ============================================================
// COMPONENT
// ============================================================

export default function HistoryManager() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("all");

  const [selectedHistory, setSelectedHistory] =
    useState<HistoryItem | null>(null);

  // ============================================================
  // PAGINATION
  // ============================================================

  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] =
    useState(1);

  // ============================================================
  // FETCH HISTORY
  // ============================================================

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      setLoading(true);
      setCurrentPage(1);

      const res = await fetch(
        "/api/lab-in-charge/history",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to fetch history."
        );
      }

      setHistory(
        Array.isArray(data.history)
          ? data.history
          : []
      );
    } catch (error) {
      console.error(
        "History fetch error:",
        error
      );

      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // GET REQUEST ID
  // ============================================================

  function getRequestId(
    requestId:
      | string
      | {
          _id?: string;
        }
      | undefined
  ) {
    if (!requestId) {
      return "";
    }

    if (typeof requestId === "string") {
      return requestId;
    }

    return requestId._id || "";
  }

  // ============================================================
  // GET TEACHER NAME
  // ============================================================

  function getTeacherName(
    instructor:
      | Teacher
      | string
      | null
      | undefined
  ) {
    if (!instructor) {
      return "Unknown Instructor";
    }

    if (typeof instructor === "string") {
      return instructor;
    }

    return (
      instructor.name ||
      "Unknown Instructor"
    );
  }

  // ============================================================
  // GET TEACHER EMAIL
  // ============================================================

  function getTeacherEmail(
    instructor:
      | Teacher
      | string
      | null
      | undefined
  ) {
    if (
      !instructor ||
      typeof instructor === "string"
    ) {
      return "";
    }

    return instructor.email || "";
  }

  // ============================================================
  // NORMALIZE SEARCH VALUE
  // ============================================================

  function normalizeSearchValue(
    value: unknown
  ) {
    return String(value ?? "")
      .toLowerCase()
      .trim();
  }

  // ============================================================
  // NORMALIZE PERFORMER ROLE
  //
  // IMPORTANT:
  // This determines WHO performed the history action.
  //
  // Example:
  //
  // performedBy.role = "lab-in-charge"
  // => "lab-in-charge"
  //
  // performedBy.role = "student"
  // => "student"
  // ============================================================

  function normalizePerformerRole(
    performedBy?: HistoryItem["performedBy"]
  ): NormalizedRole {
    if (!performedBy) {
      return "student";
    }

    const role =
      normalizeSearchValue(
        performedBy.role
      ).replace(/[\s_-]/g, "");

    // ----------------------------------------------------------
    // LAB-IN-CHARGE
    // ----------------------------------------------------------

    if (
      role === "labincharge" ||
      role === "lic" ||
      Boolean(
        performedBy.employeeId?.trim()
      )
    ) {
      return "lab-in-charge";
    }

    // ----------------------------------------------------------
    // STUDENT
    // ----------------------------------------------------------

    return "student";
  }

  // ============================================================
  // CHECK ROLE FILTER
  // ============================================================

  function matchesRoleFilter(
    item: HistoryItem
  ) {
    // All users = don't filter by role
    if (roleFilter === "all") {
      return true;
    }

    const performerRole =
      normalizePerformerRole(
        item.performedBy
      );

    return (
      performerRole === roleFilter
    );
  }

  // ============================================================
  // SEARCH + FILTER HISTORY
  // ============================================================

  const filteredHistory =
    history.filter((item) => {
      const searchValue =
        normalizeSearchValue(search);

      const request =
        item.request;

      const performedBy =
        item.performedBy;

      const instructor =
        request?.instructor;

      // ========================================================
      // ROLE FILTER
      // ========================================================

      const matchesRole =
        matchesRoleFilter(item);

      // If role does not match, immediately remove record.
      if (!matchesRole) {
        return false;
      }

      // ========================================================
      // NO SEARCH
      // ========================================================

      if (!searchValue) {
        return true;
      }

      // ========================================================
      // BASIC HISTORY INFORMATION
      // ========================================================

      const action =
        normalizeSearchValue(
          item.action
        );

      const reason =
        normalizeSearchValue(
          item.reason
        );

      const historyId =
        normalizeSearchValue(
          item._id
        );

      const requestId =
        normalizeSearchValue(
          getRequestId(
            item.requestId
          )
        );

      // ========================================================
      // PERFORMED BY
      // ========================================================

      const performedByName =
        normalizeSearchValue(
          performedBy?.fullName
        );

      const employeeId =
        normalizeSearchValue(
          performedBy?.employeeId
        );

      const performedByRole =
        normalizeSearchValue(
          normalizePerformerRole(
            performedBy
          )
        );

      // ========================================================
      // REQUEST INFORMATION
      // ========================================================

      const studentName =
        normalizeSearchValue(
          request?.studentName
        );

      const section =
        normalizeSearchValue(
          request?.section
        );

      const groupNumber =
        normalizeSearchValue(
          request?.groupNumber
        );

      const activityTitle =
        normalizeSearchValue(
          request?.activityTitle
        );

      const status =
        normalizeSearchValue(
          request?.status
        );

      const rejectReason =
        normalizeSearchValue(
          request?.rejectReason
        );

      // ========================================================
      // INSTRUCTOR INFORMATION
      // ========================================================

      const instructorName =
        normalizeSearchValue(
          getTeacherName(
            instructor
          )
        );

      const instructorEmail =
        normalizeSearchValue(
          getTeacherEmail(
            instructor
          )
        );

      // ========================================================
      // MEMBERS
      // ========================================================

      const members =
        request?.members
          ?.map((member) =>
            normalizeSearchValue(
              member
            )
          )
          .join(" ") || "";

      // ========================================================
      // TOOLS
      // ========================================================

      const toolNames =
        request?.cart
          ?.map((tool) =>
            normalizeSearchValue(
              tool.name
            )
          )
          .join(" ") || "";

      const toolIds =
        request?.cart
          ?.map((tool) =>
            normalizeSearchValue(
              tool._id ||
                tool.id
            )
          )
          .join(" ") || "";

      // ========================================================
      // DATE INFORMATION
      // ========================================================

      const historyDate =
        normalizeSearchValue(
          formatDate(
            item.createdAt
          )
        );

      const borrowDate =
        normalizeSearchValue(
          formatDateOnly(
            request?.date
          )
        );

      // ========================================================
      // SEARCH ALL FIELDS
      // ========================================================

      const matchesSearch =
        action.includes(searchValue) ||
        historyId.includes(searchValue) ||
        requestId.includes(searchValue) ||
        reason.includes(searchValue) ||
        performedByName.includes(searchValue) ||
        employeeId.includes(searchValue) ||
        performedByRole.includes(searchValue) ||
        studentName.includes(searchValue) ||
        section.includes(searchValue) ||
        groupNumber.includes(searchValue) ||
        activityTitle.includes(searchValue) ||
        status.includes(searchValue) ||
        rejectReason.includes(searchValue) ||
        instructorName.includes(searchValue) ||
        instructorEmail.includes(searchValue) ||
        members.includes(searchValue) ||
        toolNames.includes(searchValue) ||
        toolIds.includes(searchValue) ||
        historyDate.includes(searchValue) ||
        borrowDate.includes(searchValue);

      return matchesSearch;
    });

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredHistory.length /
        ITEMS_PER_PAGE
    )
  );

  // Make sure current page stays valid
  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const paginatedHistory =
    filteredHistory.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage *
        ITEMS_PER_PAGE
    );

  const startIndex =
    filteredHistory.length === 0
      ? 0
      : (currentPage - 1) *
          ITEMS_PER_PAGE +
        1;

  const endIndex = Math.min(
    currentPage *
      ITEMS_PER_PAGE,
    filteredHistory.length
  );

  function goToPage(
    page: number
  ) {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  }

  // ============================================================
  // CLEAR SEARCH
  // ============================================================

  function clearSearch() {
    setSearch("");
    setCurrentPage(1);
  }

  // ============================================================
  // CLEAR ALL FILTERS
  // ============================================================

  function clearAllFilters() {
    setSearch("");
    setRoleFilter("all");
    setCurrentPage(1);
  }

  // ============================================================
  // DATE FORMAT
  // ============================================================

  function formatDate(
    dateString?: string
  ) {
    if (!dateString) {
      return "—";
    }

    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  // ============================================================
  // DATE ONLY
  // ============================================================

  function formatDateOnly(
    dateString?: string
  ) {
    if (!dateString) {
      return "—";
    }

    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  // ============================================================
  // ACTION STYLE
  // ============================================================

  function getActionStyle(
    action: HistoryItem["action"]
  ) {
    switch (action) {
      case "approved":
        return {
          icon: (
            <CheckCircle2 className="h-4 w-4" />
          ),
          className:
            "bg-green-50 text-green-700 border-green-100",
        };

      case "rejected":
        return {
          icon: (
            <XCircle className="h-4 w-4" />
          ),
          className:
            "bg-red-50 text-red-700 border-red-100",
        };

      case "released":
        return {
          icon: (
            <PackageCheck className="h-4 w-4" />
          ),
          className:
            "bg-indigo-50 text-indigo-700 border-indigo-100",
        };

      case "returned":
        return {
          icon: (
            <RotateCcw className="h-4 w-4" />
          ),
          className:
            "bg-purple-50 text-purple-700 border-purple-100",
        };

      case "created":
        return {
          icon: (
            <ClipboardList className="h-4 w-4" />
          ),
          className:
            "bg-blue-50 text-blue-700 border-blue-100",
        };

      default:
        return {
          icon: (
            <History className="h-4 w-4" />
          ),
          className:
            "bg-gray-50 text-gray-700 border-gray-100",
        };
    }
  }

  // ============================================================
  // STATUS STYLE
  // ============================================================

  function getStatusStyle(
    status?: RequestData["status"]
  ) {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-100";

      case "released":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";

      case "returned":
        return "bg-purple-50 text-purple-700 border-purple-100";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-100";

      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  }

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  function closeModal() {
    setSelectedHistory(null);
  }

  // ============================================================
  // ESC KEY
  // ============================================================

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        closeModal();
      }
    }

    if (selectedHistory) {
      document.addEventListener(
        "keydown",
        handleKeyDown
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedHistory]);

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="border-b border-gray-100">

          <div className="h-1 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

          <div className="p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* TITLE */}

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
                    border-[#800000]/10
                    bg-[#800000]/5
                    text-[#800000]
                  "
                >
                  <History className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#800000]">
                    Request History
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    View the complete audit trail of
                    laboratory request activities.
                  </p>

                </div>

              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={fetchHistory}
                disabled={loading}
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  gap-2
                  self-start
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
                  text-sm
                  font-medium
                  text-gray-600
                  transition
                  hover:border-[#800000]/20
                  hover:bg-[#800000]/5
                  hover:text-[#800000]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  lg:self-center
                "
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh
              </button>

            </div>

            {/* ================================================== */}
            {/* SEARCH + ROLE FILTER */}
            {/* ================================================== */}

            <div className="mt-5 flex flex-col gap-2 lg:flex-row lg:items-center">

              {/* SEARCH */}

              <div className="relative w-full lg:flex-1">

                <Search
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(
                      e.target.value
                    );
                    setCurrentPage(1);
                  }}
                  placeholder="Search student, instructor, action, tool, request ID, employee ID..."
                  className="
                    h-10
                    bg-white
                    pl-9
                    pr-10
                    focus-visible:ring-[#800000]/20
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="
                      absolute
                      right-2
                      top-1/2
                      flex
                      h-7
                      w-7
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-md
                      text-gray-400
                      transition
                      hover:bg-gray-100
                      hover:text-gray-700
                    "
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

              </div>

              {/* ROLE FILTER */}

              <Select
                value={roleFilter}
                onValueChange={(value) => {
                  const newRole =
                    value as RoleFilter;

                  setRoleFilter(
                    newRole
                  );

                  // IMPORTANT:
                  // Always reset pagination
                  // when changing filter.
                  setCurrentPage(1);
                }}
              >

                <SelectTrigger
                  className="
                    h-10
                    w-full
                    bg-white
                    lg:w-52
                    focus:ring-[#800000]/20
                  "
                >
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">
                    All Users
                  </SelectItem>

                  <SelectItem value="student">
                    Student
                  </SelectItem>

                  <SelectItem value="lab-in-charge">
                    Lab-In-Charge
                  </SelectItem>

                </SelectContent>

              </Select>

              {/* CLEAR ALL FILTERS */}

              {(search ||
                roleFilter !==
                  "all") && (
                <button
                  type="button"
                  onClick={
                    clearAllFilters
                  }
                  className="
                    inline-flex
                    h-10
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-sm
                    font-medium
                    text-gray-600
                    transition
                    hover:border-[#800000]/20
                    hover:bg-[#800000]/5
                    hover:text-[#800000]
                  "
                >
                  <Eraser className="h-4 w-4" />
                  Clear
                </button>
              )}

            </div>

            {/* ================================================== */}
            {/* FILTER DEBUG / RESULT COUNT */}
            {/* ================================================== */}

            {!loading && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-400">

                <Search className="h-3.5 w-3.5" />

                {search ||
                roleFilter !==
                  "all" ? (
                  <span>
                    Found{" "}
                    <span className="font-semibold text-gray-600">
                      {
                        filteredHistory.length
                      }
                    </span>{" "}
                    matching{" "}
                    {filteredHistory.length ===
                    1
                      ? "record"
                      : "records"}
                  </span>
                ) : (
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-gray-600">
                      {history.length}
                    </span>{" "}
                    history{" "}
                    {history.length ===
                    1
                      ? "record"
                      : "records"}
                  </span>
                )}

                {roleFilter !==
                  "all" && (
                  <>
                    <span className="text-gray-300">
                      •
                    </span>

                    <span>
                      Filter:{" "}
                      <span className="font-semibold text-[#800000]">
                        {roleFilter ===
                        "student"
                          ? "Student"
                          : "Lab-In-Charge"}
                      </span>
                    </span>
                  </>
                )}

              </div>
            )}

          </div>

        </div>

        {/* ================================================== */}
        {/* CONTENT */}
        {/* ================================================== */}

        <CardContent className="p-6">

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
                <History className="h-6 w-6 animate-pulse text-[#800000]" />
              </div>

              <p className="text-sm font-medium text-gray-600">
                Loading history...
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Please wait while the audit trail is loaded.
              </p>

            </div>

          ) : filteredHistory.length ===
            0 ? (

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
                {search ||
                roleFilter !==
                  "all" ? (
                  <Search className="h-7 w-7" />
                ) : (
                  <History className="h-7 w-7" />
                )}
              </div>

              <h3 className="text-base font-semibold text-gray-700">
                {search ||
                roleFilter !==
                  "all"
                  ? "No matching history"
                  : "No history found"}
              </h3>

              <p className="mt-1 max-w-md text-center text-sm text-gray-400">

                {search
                  ? `No request activity matches "${search}".`
                  : roleFilter ===
                    "student"
                  ? "No history records were performed by students."
                  : roleFilter ===
                    "lab-in-charge"
                  ? "No history records were performed by Lab-In-Charge users."
                  : "There are currently no request activity records."}

              </p>

              {(search ||
                roleFilter !==
                  "all") && (
                <button
                  type="button"
                  onClick={
                    clearAllFilters
                  }
                  className="
                    mt-4
                    inline-flex
                    h-9
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#800000]
                    px-4
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-[#660000]
                  "
                >
                  <Eraser className="h-4 w-4" />
                  Clear Filters
                </button>
              )}

            </div>

          ) : (

            <div className="overflow-x-auto rounded-xl border border-gray-200">

              <table className="w-full text-sm">

                <thead className="border-b border-gray-200 bg-[#fafafa]">

                  <tr>

                    <th className="px-4 py-3.5 text-left font-semibold text-[#800000]">
                      Action
                    </th>

                    <th className="px-4 py-3.5 text-left font-semibold text-[#800000]">
                      Student
                    </th>

                    <th className="px-4 py-3.5 text-left font-semibold text-[#800000]">
                      Instructor
                    </th>

                    <th className="px-4 py-3.5 text-left font-semibold text-[#800000]">
                      Performed By
                    </th>

                    <th className="px-4 py-3.5 text-left font-semibold text-[#800000]">
                      Date & Time
                    </th>

                    <th className="px-4 py-3.5 text-center font-semibold text-[#800000]">
                      View
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {paginatedHistory.map(
                    (item) => {

                      const style =
                        getActionStyle(
                          item.action
                        );

                      return (
                        <tr
                          key={
                            item._id
                          }
                          className="
                            border-b
                            border-gray-100
                            last:border-0
                            transition-colors
                            hover:bg-[#800000]/[0.02]
                          "
                        >

                          {/* ACTION */}

                          <td className="px-4 py-4">

                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                capitalize
                                ${style.className}
                              `}
                            >
                              {style.icon}

                              {
                                item.action
                              }
                            </span>

                          </td>

                          {/* STUDENT */}

                          <td className="px-4 py-4">

                            <div className="min-w-[150px]">

                              <p className="font-medium text-gray-800">
                                {item
                                  .request
                                  ?.studentName ||
                                  "Unknown Student"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">

                                {item
                                  .request
                                  ?.section
                                  ? `Section ${item.request.section}`
                                  : "No section"}

                                {item
                                  .request
                                  ?.groupNumber
                                  ? ` • Group ${item.request.groupNumber}`
                                  : ""}

                              </p>

                            </div>

                          </td>

                          {/* INSTRUCTOR */}

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-2">

                              <div
                                className="
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-[#800000]/5
                                  text-[#800000]
                                "
                              >
                                <GraduationCap className="h-4 w-4" />
                              </div>

                              <span className="font-medium text-gray-700">
                                {getTeacherName(
                                  item
                                    .request
                                    ?.instructor
                                )}
                              </span>

                            </div>

                          </td>

                          {/* PERFORMED BY */}

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-3">

                              <div
                                className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-[#800000]/5
                                  text-[#800000]
                                "
                              >
                                <User className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-medium text-gray-800">
                                  {item
                                    .performedBy
                                    ?.fullName ||
                                    "Unknown User"}
                                </p>

                                {normalizePerformerRole(
                                  item.performedBy
                                ) ===
                                "lab-in-charge" ? (

                                  <div className="mt-0.5 flex items-center gap-1.5">

                                    <span className="text-xs font-medium text-[#800000]">
                                      Lab-In-Charge
                                    </span>

                                    {item
                                      .performedBy
                                      ?.employeeId && (
                                      <>
                                        <span className="text-xs text-gray-300">
                                          •
                                        </span>

                                        <span className="text-xs text-gray-400">
                                          {
                                            item
                                              .performedBy
                                              .employeeId
                                          }
                                        </span>
                                      </>
                                    )}

                                  </div>

                                ) : (

                                  <span className="mt-0.5 block text-xs font-medium text-blue-600">
                                    Student
                                  </span>

                                )}

                              </div>

                            </div>

                          </td>

                          {/* DATE */}

                          <td className="whitespace-nowrap px-4 py-4">

                            <div className="flex items-center gap-2 text-gray-500">

                              <Clock3 className="h-4 w-4 text-gray-400" />

                              <span>
                                {formatDate(
                                  item.createdAt
                                )}
                              </span>

                            </div>

                          </td>

                          {/* VIEW */}

                          <td className="px-4 py-4 text-center">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedHistory(
                                  item
                                )
                              }
                              className="
                                inline-flex
                                h-9
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                px-3
                                text-xs
                                font-semibold
                                text-gray-600
                                transition
                                hover:border-[#800000]/20
                                hover:bg-[#800000]/5
                                hover:text-[#800000]
                              "
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          {!loading &&
            filteredHistory.length >
              0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* RECORD COUNT */}

                  <div className="flex items-center gap-2 text-xs text-gray-400">

                    <History className="h-3.5 w-3.5" />

                    <span>
                      Showing{" "}
                      <span className="font-semibold text-gray-700">
                        {
                          startIndex
                        }
                      </span>
                      {"–"}
                      <span className="font-semibold text-gray-700">
                        {endIndex}
                      </span>
                      {" of "}
                      <span className="font-semibold text-gray-700">
                        {
                          filteredHistory.length
                        }
                      </span>{" "}
                      history records
                    </span>

                  </div>

                  {/* PAGINATION */}

                  {totalPages >
                    1 && (
                    <div className="flex items-center justify-between gap-2 sm:justify-end">

                      {/* PREVIOUS */}

                      <button
                        type="button"
                        onClick={() =>
                          goToPage(
                            currentPage -
                              1
                          )
                        }
                        disabled={
                          currentPage ===
                          1
                        }
                        className="
                          inline-flex
                          h-9
                          items-center
                          justify-center
                          gap-1.5
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          px-3
                          text-xs
                          font-semibold
                          text-gray-600
                          transition
                          hover:border-[#800000]/20
                          hover:bg-[#800000]/5
                          hover:text-[#800000]
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >
                        <ChevronLeft className="h-4 w-4" />

                        <span className="hidden sm:inline">
                          Previous
                        </span>

                      </button>

                      {/* PAGE NUMBERS */}

                      <div className="flex items-center gap-1">

                        {Array.from(
                          {
                            length:
                              totalPages,
                          },
                          (
                            _,
                            index
                          ) =>
                            index +
                            1
                        ).map(
                          (
                            page
                          ) => (

                            <button
                              key={
                                page
                              }
                              type="button"
                              onClick={() =>
                                goToPage(
                                  page
                                )
                              }
                              className={`
                                flex
                                h-9
                                min-w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                px-2.5
                                text-xs
                                font-semibold
                                transition
                                ${
                                  currentPage ===
                                  page
                                    ? "border-[#800000] bg-[#800000] text-[#FFD700] shadow-sm"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-[#800000]/20 hover:bg-[#800000]/5 hover:text-[#800000]"
                                }
                              `}
                            >
                              {
                                page
                              }
                            </button>

                          )
                        )}

                      </div>

                      {/* NEXT */}

                      <button
                        type="button"
                        onClick={() =>
                          goToPage(
                            currentPage +
                              1
                          )
                        }
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        className="
                          inline-flex
                          h-9
                          items-center
                          justify-center
                          gap-1.5
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          px-3
                          text-xs
                          font-semibold
                          text-gray-600
                          transition
                          hover:border-[#800000]/20
                          hover:bg-[#800000]/5
                          hover:text-[#800000]
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >

                        <span className="hidden sm:inline">
                          Next
                        </span>

                        <ChevronRight className="h-4 w-4" />

                      </button>

                    </div>
                  )}

                </div>

              </div>
            )}

        </CardContent>

      </Card>

      {/* ====================================================== */}
      {/* VIEW REQUEST MODAL */}
      {/* ====================================================== */}

      {selectedHistory && (
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
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div
            className="
              flex
              max-h-[90vh]
              w-full
              max-w-4xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-2xl
            "
          >

            {/* ================================================= */}
            {/* MODAL HEADER */}
            {/* ================================================= */}

            <div className="shrink-0 border-b border-gray-200">

              <div className="h-1 bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#800000]" />

              <div className="flex items-center justify-between gap-4 p-5">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#800000]/5
                      text-[#800000]
                    "
                  >
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold text-gray-800">
                      Request Details
                    </h3>

                    <p className="text-xs text-gray-400">
                      Complete request information and audit details
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-400
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                  "
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

            </div>

            {/* ================================================= */}
            {/* MODAL CONTENT */}
            {/* ================================================= */}

            <div className="overflow-y-auto p-5">

              {/* ACTION + STATUS */}

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    History Action
                  </p>

                  <div className="mt-2">

                    {(() => {
                      const style =
                        getActionStyle(
                          selectedHistory.action
                        );

                      return (
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            capitalize
                            ${style.className}
                          `}
                        >
                          {style.icon}

                          {
                            selectedHistory.action
                          }
                        </span>
                      );
                    })()}

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Current Status
                  </p>

                  <span
                    className={`
                      mt-2
                      inline-flex
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      capitalize
                      ${getStatusStyle(
                        selectedHistory
                          .request
                          ?.status
                      )}
                    `}
                  >
                    {selectedHistory
                      .request
                      ?.status ||
                      "Unknown"}
                  </span>

                </div>

              </div>

              {/* REQUEST ID */}

              <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">

                  <Hash className="h-4 w-4" />

                  Request ID

                </div>

                <p className="mt-2 break-all font-mono text-xs text-gray-600">
                  {getRequestId(
                    selectedHistory.requestId
                  )}
                </p>

              </div>

              {/* STUDENT INFORMATION */}

              <div className="mb-5">

                <div className="mb-3 flex items-center gap-2">

                  <User className="h-4 w-4 text-[#800000]" />

                  <h4 className="font-semibold text-gray-800">
                    Student Information
                  </h4>

                </div>

                <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-3">

                  <div>

                    <p className="text-xs text-gray-400">
                      Student Name
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {selectedHistory
                        .request
                        ?.studentName ||
                        "—"}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      Section
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {selectedHistory
                        .request
                        ?.section ||
                        "—"}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      Group Number
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {selectedHistory
                        .request
                        ?.groupNumber ||
                        "—"}
                    </p>

                  </div>

                </div>

              </div>

              {/* ACTIVITY INFORMATION */}

              <div className="mb-5">

                <div className="mb-3 flex items-center gap-2">

                  <ClipboardList className="h-4 w-4 text-[#800000]" />

                  <h4 className="font-semibold text-gray-800">
                    Activity Information
                  </h4>

                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <p className="text-xs text-gray-400">
                        Activity Title
                      </p>

                      <p className="mt-1 font-medium text-gray-800">
                        {selectedHistory
                          .request
                          ?.activityTitle ||
                          "—"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Borrow Date
                      </p>

                      <div className="mt-1 flex items-center gap-2">

                        <CalendarDays className="h-4 w-4 text-gray-400" />

                        <p className="font-medium text-gray-800">
                          {formatDateOnly(
                            selectedHistory
                              .request
                              ?.date
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* INSTRUCTOR */}

              <div className="mb-5">

                <div className="mb-3 flex items-center gap-2">

                  <GraduationCap className="h-4 w-4 text-[#800000]" />

                  <h4 className="font-semibold text-gray-800">
                    Instructor
                  </h4>

                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">

                  <p className="font-semibold text-gray-800">
                    {getTeacherName(
                      selectedHistory
                        .request
                        ?.instructor
                    )}
                  </p>

                  {getTeacherEmail(
                    selectedHistory
                      .request
                      ?.instructor
                  ) && (
                    <p className="mt-1 text-sm text-gray-500">
                      {getTeacherEmail(
                        selectedHistory
                          .request
                          ?.instructor
                      )}
                    </p>
                  )}

                </div>

              </div>

              {/* MEMBERS */}

              <div className="mb-5">

                <div className="mb-3 flex items-center gap-2">

                  <Users className="h-4 w-4 text-[#800000]" />

                  <h4 className="font-semibold text-gray-800">
                    Group Members
                  </h4>

                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">

                  {selectedHistory
                    .request
                    ?.members &&
                  selectedHistory
                    .request
                    .members.length >
                    0 ? (

                    <div className="grid gap-2 sm:grid-cols-2">

                      {selectedHistory.request.members.map(
                        (
                          member,
                          index
                        ) => (
                          <div
                            key={`${member}-${index}`}
                            className="
                              rounded-lg
                              border
                              border-gray-100
                              bg-gray-50
                              px-3
                              py-2
                              text-sm
                              text-gray-700
                            "
                          >
                            <span className="mr-2 text-xs text-gray-400">
                              {index +
                                1}
                              .
                            </span>

                            {member ||
                              "Unnamed member"}
                          </div>
                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-sm text-gray-400">
                      No group members recorded.
                    </p>

                  )}

                </div>

              </div>

              {/* TOOLS */}

              <div className="mb-5">

                <div className="mb-3 flex items-center gap-2">

                  <Wrench className="h-4 w-4 text-[#800000]" />

                  <h4 className="font-semibold text-gray-800">
                    Requested Tools
                  </h4>

                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200">

                  {selectedHistory
                    .request
                    ?.cart &&
                  selectedHistory
                    .request
                    .cart.length >
                    0 ? (

                    <table className="w-full text-sm">

                      <thead className="border-b border-gray-200 bg-gray-50">

                        <tr>

                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Tool
                          </th>

                          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Quantity
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {selectedHistory.request.cart.map(
                          (
                            tool,
                            index
                          ) => (
                            <tr
                              key={
                                tool._id ||
                                `${tool.id}-${index}`
                              }
                              className="border-b border-gray-100 last:border-0"
                            >

                              <td className="px-4 py-3 font-medium text-gray-700">
                                {tool.name ||
                                  "Unknown Tool"}
                              </td>

                              <td className="px-4 py-3 text-center font-semibold text-gray-700">
                                {tool.quantity ??
                                  0}
                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  ) : (

                    <div className="p-4 text-sm text-gray-400">
                      No tools recorded.
                    </div>

                  )}

                </div>

              </div>

              {/* REJECTION REASON */}

              {selectedHistory.request
                ?.rejectReason && (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4">

                  <div className="flex items-center gap-2">

                    <XCircle className="h-4 w-4 text-red-600" />

                    <h4 className="font-semibold text-red-700">
                      Rejection Reason
                    </h4>

                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-red-700">
                    {
                      selectedHistory
                        .request
                        .rejectReason
                    }
                  </p>

                </div>
              )}

              {/* REQUEST TIMELINE */}

              <div className="mb-5">

                <div className="mb-3 flex items-center gap-2">

                  <Clock3 className="h-4 w-4 text-[#800000]" />

                  <h4 className="font-semibold text-gray-800">
                    Request Timeline
                  </h4>

                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">

                  <div className="space-y-4">

                    {/* CREATED */}

                    <div className="flex gap-3">

                      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />

                      <div>

                        <p className="text-sm font-medium text-gray-700">
                          Request Created
                        </p>

                        <p className="text-xs text-gray-400">
                          {formatDate(
                            selectedHistory
                              .request
                              ?.createdAt
                          )}
                        </p>

                      </div>

                    </div>

                    {/* APPROVED */}

                    {selectedHistory.request
                      ?.approvedDate && (
                      <div className="flex gap-3">

                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-500" />

                        <div>

                          <p className="text-sm font-medium text-gray-700">
                            Approved
                          </p>

                          <p className="text-xs text-gray-400">
                            {formatDate(
                              selectedHistory
                                .request
                                .approvedDate
                            )}

                            {selectedHistory
                              .request
                              .approvedBy &&
                              ` • ${selectedHistory.request.approvedBy}`}
                          </p>

                        </div>

                      </div>
                    )}

                    {/* RELEASED */}

                    {selectedHistory.request
                      ?.releasedDate && (
                      <div className="flex gap-3">

                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500" />

                        <div>

                          <p className="text-sm font-medium text-gray-700">
                            Released
                          </p>

                          <p className="text-xs text-gray-400">
                            {formatDate(
                              selectedHistory
                                .request
                                .releasedDate
                            )}

                            {selectedHistory
                              .request
                              .releasedBy &&
                              ` • ${selectedHistory.request.releasedBy}`}
                          </p>

                        </div>

                      </div>
                    )}

                    {/* RETURNED */}

                    {selectedHistory.request
                      ?.returnedDate && (
                      <div className="flex gap-3">

                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-purple-500" />

                        <div>

                          <p className="text-sm font-medium text-gray-700">
                            Returned
                          </p>

                          <p className="text-xs text-gray-400">
                            {formatDate(
                              selectedHistory
                                .request
                                .returnedDate
                            )}

                            {selectedHistory
                              .request
                              .returnedBy &&
                              ` • ${selectedHistory.request.returnedBy}`}
                          </p>

                        </div>

                      </div>
                    )}

                    {/* REJECTED */}

                    {selectedHistory.request
                      ?.rejectedDate && (
                      <div className="flex gap-3">

                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />

                        <div>

                          <p className="text-sm font-medium text-gray-700">
                            Rejected
                          </p>

                          <p className="text-xs text-gray-400">
                            {formatDate(
                              selectedHistory
                                .request
                                .rejectedDate
                            )}

                            {selectedHistory
                              .request
                              .rejectedBy &&
                              ` • ${selectedHistory.request.rejectedBy}`}
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* HISTORY ACTION PERFORMER */}

              <div className="rounded-xl border border-[#800000]/10 bg-[#800000]/5 p-4">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-white
                      text-[#800000]
                      shadow-sm
                    "
                  >
                    <User className="h-4 w-4" />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-[#800000]/60">
                      Action Performed By
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {selectedHistory
                        .performedBy
                        ?.fullName ||
                        "Unknown User"}
                    </p>

                    {selectedHistory
                      .performedBy
                      ?.employeeId && (
                      <p className="text-xs text-gray-500">
                        Employee ID:{" "}
                        {
                          selectedHistory
                            .performedBy
                            .employeeId
                        }
                      </p>
                    )}

                    <p className="mt-1 text-xs text-gray-400">
                      {normalizePerformerRole(
                        selectedHistory.performedBy
                      ) ===
                      "lab-in-charge"
                        ? "Lab-In-Charge"
                        : "Student"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(
                        selectedHistory.createdAt
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* HISTORY REASON */}

              {selectedHistory.reason && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    History Reason
                  </p>

                  <p className="mt-2 text-sm text-gray-700">
                    {
                      selectedHistory.reason
                    }
                  </p>

                </div>
              )}

            </div>

            {/* ================================================= */}
            {/* MODAL FOOTER */}
            {/* ================================================= */}

            <div className="flex shrink-0 items-center justify-end border-t border-gray-200 bg-gray-50 px-5 py-4">

              <button
                type="button"
                onClick={closeModal}
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#800000]
                  px-4
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-[#660000]
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}