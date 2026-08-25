"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  Filter,
  PackageCheck,
  RefreshCw,
  RotateCcw,
  Search,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";

// ============================================================
// API
// ============================================================

const HISTORY_API = "/api/admin/history";

// ============================================================
// TYPES
// ============================================================

type HistoryAction =
  | "created"
  | "approved"
  | "rejected"
  | "released"
  | "returned";

interface HistoryItem {
  _id?: string;

  action: HistoryAction;

  performedBy?: string | null;

  performedByName: string;

  performedByEmail?: string;

  performedByEmployeeId?: string;

  performedAt?: string | null;

  reason?: string;

  details?: string;
}

interface HistoryRecord {
  requestId: string;

  studentName: string;

  section: string;

  groupNumber: string;

  activityTitle: string;

  date: string;

  instructorName: string;

  instructorEmail?: string;

  instructorDepartment?: string;

  status: string;

  history: HistoryItem[];

  createdAt?: string | null;

  updatedAt?: string | null;
}

interface AuditEntry extends HistoryItem {
  requestId: string;

  studentName: string;

  section: string;

  groupNumber: string;

  activityTitle: string;

  activityDate: string;

  instructorName: string;

  instructorEmail?: string;

  instructorDepartment?: string;

  requestStatus: string;

  requestCreatedAt?: string | null;
}

// ============================================================
// SAFE API RESPONSE
// ============================================================

async function getApiResponse(response: Response) {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();

  console.error(
    "Non-JSON API response:",
    text
  );

  throw new Error(
    `Server returned an invalid response (${response.status}).`
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function AdminHistoryAudit() {
  const [records, setRecords] = useState<
    HistoryRecord[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [actionFilter, setActionFilter] =
    useState<"all" | HistoryAction>(
      "all"
    );

  const [selectedEntry, setSelectedEntry] =
    useState<AuditEntry | null>(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const RECORDS_PER_PAGE = 5;

  // ==========================================================
  // FETCH HISTORY
  // ==========================================================

  const fetchHistory = async () => {
    try {
      setRefreshing(true);

      const response = await fetch(
        HISTORY_API,
        {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        }
      );

      const data =
        await getApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch history and audit records."
        );
      }

      /*
       * Expected API response:
       *
       * {
       *   success: true,
       *   records: [...]
       * }
       */

      if (
        Array.isArray(data?.records)
      ) {
        setRecords(data.records);
      } else if (
        Array.isArray(data)
      ) {
        setRecords(data);
      } else {
        console.warn(
          "Unexpected history response:",
          data
        );

        setRecords([]);
      }
    } catch (error) {
      console.error(
        "History audit fetch error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load history and audit records."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchHistory();
  }, []);

  // ==========================================================
  // FLATTEN HISTORY
  // ==========================================================

  const auditEntries = useMemo<AuditEntry[]>(
    () => {
      const entries: AuditEntry[] = [];

      records.forEach((record) => {
        if (
          !Array.isArray(record.history)
        ) {
          return;
        }

        record.history.forEach(
          (history) => {
            entries.push({
              ...history,

              requestId:
                record.requestId,

              studentName:
                record.studentName,

              section:
                record.section,

              groupNumber:
                record.groupNumber,

              activityTitle:
                record.activityTitle,

              activityDate:
                record.date,

              instructorName:
                record.instructorName,

              instructorEmail:
                record.instructorEmail,

              instructorDepartment:
                record.instructorDepartment,

              requestStatus:
                record.status,

              requestCreatedAt:
                record.createdAt,
            });
          }
        );
      });

      // Newest actions first
      return entries.sort(
        (a, b) => {
          const dateA = a.performedAt
            ? new Date(
                a.performedAt
              ).getTime()
            : 0;

          const dateB = b.performedAt
            ? new Date(
                b.performedAt
              ).getTime()
            : 0;

          return dateB - dateA;
        }
      );
    },
    [records]
  );

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalActions =
    auditEntries.length;

  const createdActions =
    auditEntries.filter(
      (entry) =>
        entry.action === "created"
    ).length;

  const approvedActions =
    auditEntries.filter(
      (entry) =>
        entry.action === "approved"
    ).length;

  const rejectedActions =
    auditEntries.filter(
      (entry) =>
        entry.action === "rejected"
    ).length;

  const releasedActions =
    auditEntries.filter(
      (entry) =>
        entry.action === "released"
    ).length;

  const returnedActions =
    auditEntries.filter(
      (entry) =>
        entry.action === "returned"
    ).length;

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredEntries =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return auditEntries.filter(
        (entry) => {
          const matchesAction =
            actionFilter === "all" ||
            entry.action ===
              actionFilter;

          if (!matchesAction) {
            return false;
          }

          if (!query) {
            return true;
          }

          return (
            entry.performedByName
              .toLowerCase()
              .includes(query) ||
            (
              entry.performedByEmail ||
              ""
            )
              .toLowerCase()
              .includes(query) ||
            (
              entry.performedByEmployeeId ||
              ""
            )
              .toLowerCase()
              .includes(query) ||
            entry.studentName
              .toLowerCase()
              .includes(query) ||
            entry.section
              .toLowerCase()
              .includes(query) ||
            entry.groupNumber
              .toLowerCase()
              .includes(query) ||
            entry.activityTitle
              .toLowerCase()
              .includes(query) ||
            entry.instructorName
              .toLowerCase()
              .includes(query) ||
            (
              entry.details ||
              ""
            )
              .toLowerCase()
              .includes(query) ||
            (
              entry.reason ||
              ""
            )
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [
      auditEntries,
      searchQuery,
      actionFilter,
    ]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEntries.length /
        RECORDS_PER_PAGE
    )
  );

  const paginatedEntries =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        RECORDS_PER_PAGE;

      const end =
        start +
        RECORDS_PER_PAGE;

      return filteredEntries.slice(
        start,
        end
      );
    }, [
      filteredEntries,
      currentPage,
    ]);

  // ==========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    actionFilter,
  ]);

  // ==========================================================
  // PAGE SAFETY
  // ==========================================================

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearchQuery("");
    setActionFilter("all");
    setCurrentPage(1);
  };

  // ==========================================================
  // PAGE NUMBERS
  // ==========================================================

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      pages.push(page);
    }

    return pages;
  }, [totalPages]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <AdminHistoryAuditLoading />
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <>
      <div className="space-y-7">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />

                <span className="text-xs font-semibold text-green-600">
                  Audit System Active
                </span>

              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                History & Audit
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Review all borrowing activities and
                track who performed each action.
              </p>

              <p className="mt-2 text-[11px] text-gray-400">
                Every borrowing transaction is recorded
                with its corresponding audit trail.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchHistory}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#800000]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#800000] shadow-sm transition hover:border-[#800000]/20 hover:bg-[#800000]/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>
        </section>

        {/* ================================================== */}
        {/* STATISTICS */}
        {/* ================================================== */}

        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <AuditStatCard
              title="Total Actions"
              value={totalActions}
              label="audit events"
              icon={
                <Activity className="h-5 w-5" />
              }
              accent="maroon"
            />

            <AuditStatCard
              title="Approved"
              value={approvedActions}
              label="approvals"
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              accent="blue"
            />

            <AuditStatCard
              title="Released"
              value={releasedActions}
              label="equipment releases"
              icon={
                <PackageCheck className="h-5 w-5" />
              }
              accent="orange"
            />

            <AuditStatCard
              title="Returned"
              value={returnedActions}
              label="equipment returns"
              icon={
                <RotateCcw className="h-5 w-5" />
              }
              accent="green"
            />

          </div>
        </section>

        {/* ================================================== */}
        {/* SECONDARY SUMMARY */}
        {/* ================================================== */}

        <section>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            <MiniAuditCard
              label="Created"
              value={createdActions}
              icon={
                <ClipboardList className="h-4 w-4" />
              }
              className="bg-gray-50 text-gray-600"
            />

            <MiniAuditCard
              label="Rejected"
              value={rejectedActions}
              icon={
                <XCircle className="h-4 w-4" />
              }
              className="bg-red-50 text-red-600"
            />

            <MiniAuditCard
              label="All Events"
              value={totalActions}
              icon={
                <Clock3 className="h-4 w-4" />
              }
              className="bg-[#800000]/5 text-[#800000]"
            />

          </div>
        </section>

        {/* ================================================== */}
        {/* AUDIT DIRECTORY */}
        {/* ================================================== */}

        <section>

          <div className="mb-4 flex items-center gap-3">

            <div className="h-6 w-1 rounded-full bg-[#800000]" />

            <div className="flex items-center gap-2">

              <Activity className="h-4 w-4 text-[#800000]" />

              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#800000]/70">
                Audit Trail
              </h2>

            </div>

            <div className="h-px flex-1 bg-gradient-to-r from-[#800000]/10 to-transparent" />

          </div>

          <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

            <CardContent className="p-0">

              {/* ================================================= */}
              {/* TOOLBAR */}
              {/* ================================================= */}

              <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5">

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                  {/* SEARCH */}

                  <div className="relative w-full lg:max-w-md">

                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      value={
                        searchQuery
                      }
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value
                        )
                      }
                      placeholder="Search user, borrower, activity..."
                      className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-9 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#800000]/30 focus:bg-white focus:ring-2 focus:ring-[#800000]/5"
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearchQuery(
                            ""
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                  </div>

                  {/* ACTION FILTER */}

                  <div className="flex items-center gap-2">

                    <Filter className="h-4 w-4 text-gray-400" />

                    <span className="text-xs font-medium text-gray-400">
                      Action:
                    </span>

                    <select
                      value={
                        actionFilter
                      }
                      onChange={(event) =>
                        setActionFilter(
                          event.target.value as
                            | "all"
                            | HistoryAction
                        )
                      }
                      className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 outline-none transition focus:border-[#800000]/30 focus:bg-white focus:ring-2 focus:ring-[#800000]/5"
                    >
                      <option value="all">
                        All Actions
                      </option>

                      <option value="created">
                        Created
                      </option>

                      <option value="approved">
                        Approved
                      </option>

                      <option value="rejected">
                        Rejected
                      </option>

                      <option value="released">
                        Released
                      </option>

                      <option value="returned">
                        Returned
                      </option>

                    </select>

                  </div>

                </div>

                {/* RESULTS */}

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-2 text-xs text-gray-400">

                    <Activity className="h-3.5 w-3.5" />

                    <span>
                      {filteredEntries.length}{" "}
                      {filteredEntries.length ===
                      1
                        ? "audit event"
                        : "audit events"}{" "}
                      found
                    </span>

                  </div>

                  {(searchQuery ||
                    actionFilter !==
                      "all") && (
                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="text-xs font-medium text-[#800000] transition hover:underline"
                    >
                      Clear filters
                    </button>
                  )}

                </div>

              </div>

              {/* ================================================= */}
              {/* TABLE */}
              {/* ================================================= */}

              {filteredEntries.length >
              0 ? (
                <>
                  <AuditTable
                    entries={
                      paginatedEntries
                    }
                    onView={
                      setSelectedEntry
                    }
                  />

                  {/* PAGINATION */}

                  <AuditPagination
                    currentPage={
                      currentPage
                    }
                    totalPages={
                      totalPages
                    }
                    totalItems={
                      filteredEntries.length
                    }
                    pageNumbers={
                      pageNumbers
                    }
                    onPageChange={
                      setCurrentPage
                    }
                  />
                </>
              ) : (
                <HistoryEmptyState
                  hasFilter={
                    Boolean(
                      searchQuery.trim()
                    ) ||
                    actionFilter !==
                      "all"
                  }
                  onClear={
                    clearFilters
                  }
                />
              )}

            </CardContent>

          </Card>

        </section>

        {/* ================================================== */}
        {/* INFORMATION NOTE */}
        {/* ================================================== */}

        <Card className="overflow-hidden rounded-xl border border-[#800000]/10 bg-white shadow-sm">

          <CardContent className="p-0">

            <div className="flex flex-col gap-4 border-l-4 border-[#800000] bg-[#800000]/[0.025] p-5 sm:flex-row sm:items-center">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                <Activity className="h-5 w-5" />

              </div>

              <div>

                <p className="font-semibold text-[#800000]">
                  Audit Trail Protection
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  This section provides administrators
                  with a read-only view of borrowing
                  activities. Each event identifies the
                  person who performed the action, along
                  with the date and time it occurred.
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ==================================================== */}
      {/* DETAILS MODAL */}
      {/* ==================================================== */}

      {selectedEntry && (
        <AuditDetailsModal
          entry={
            selectedEntry
          }
          onClose={() =>
            setSelectedEntry(null)
          }
        />
      )}
    </>
  );
}

// ============================================================
// AUDIT TABLE
// ============================================================

function AuditTable({
  entries,
  onView,
}: {
  entries: AuditEntry[];

  onView: (
    entry: AuditEntry
  ) => void;
}) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full min-w-[1050px] text-left">

        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">

            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Action
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Performed By
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Borrower
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Activity
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Date & Time
            </th>

            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Actions
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">

          {entries.map(
            (entry, index) => (
              <tr
                key={
                  entry._id ||
                  `${entry.requestId}-${entry.action}-${index}`
                }
                className="group transition hover:bg-[#800000]/[0.018]"
              >

                {/* ACTION */}

                <td className="px-5 py-4">

                  <ActionBadge
                    action={
                      entry.action
                    }
                  />

                </td>

                {/* PERFORMED BY */}

                <td className="px-4 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                      <User className="h-4 w-4" />

                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-gray-800">
                        {
                          entry.performedByName ||
                          "Unknown"
                        }
                      </p>

                      <p className="truncate text-xs text-gray-400">
                        {
                          entry.performedByEmployeeId ||
                          entry.performedByEmail ||
                          "No account information"
                        }
                      </p>

                    </div>

                  </div>

                </td>

                {/* BORROWER */}

                <td className="px-4 py-4">

                  <p className="truncate text-sm font-medium text-gray-700">
                    {
                      entry.studentName
                    }
                  </p>

                  <p className="text-xs text-gray-400">
                    {
                      entry.section
                    }
                    {" • "}
                    Group{" "}
                    {
                      entry.groupNumber
                    }
                  </p>

                </td>

                {/* ACTIVITY */}

                <td className="max-w-[230px] px-4 py-4">

                  <p className="truncate text-sm font-medium text-gray-700">
                    {
                      entry.activityTitle
                    }
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    Instructor:{" "}
                    {
                      entry.instructorName ||
                      "N/A"
                    }
                  </p>

                </td>

                {/* DATE */}

                <td className="px-4 py-4">

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">

                    <CalendarDays className="h-3.5 w-3.5 text-gray-400" />

                    {formatDateTime(
                      entry.performedAt
                    )}

                  </div>

                </td>

                {/* ACTION */}

                <td className="px-5 py-4 text-right">

                  <button
                    type="button"
                    onClick={() =>
                      onView(
                        entry
                      )
                    }
                    title="View audit details"
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-500 shadow-sm transition hover:border-[#800000]/20 hover:bg-[#800000]/5 hover:text-[#800000]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}

// ============================================================
// ACTION BADGE
// ============================================================

function ActionBadge({
  action,
}: {
  action: HistoryAction;
}) {
  const styles = {
    created:
      "bg-gray-50 text-gray-600",
    approved:
      "bg-blue-50 text-blue-600",
    rejected:
      "bg-red-50 text-red-600",
    released:
      "bg-orange-50 text-orange-600",
    returned:
      "bg-green-50 text-green-600",
  };

  const labels = {
    created: "Created",
    approved: "Approved",
    rejected: "Rejected",
    released: "Released",
    returned: "Returned",
  };

  const icons = {
    created: (
      <ClipboardList className="h-3 w-3" />
    ),

    approved: (
      <CheckCircle2 className="h-3 w-3" />
    ),

    rejected: (
      <XCircle className="h-3 w-3" />
    ),

    released: (
      <PackageCheck className="h-3 w-3" />
    ),

    returned: (
      <RotateCcw className="h-3 w-3" />
    ),
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[action]}`}
    >
      {icons[action]}

      {labels[action]}
    </span>
  );
}

// ============================================================
// PAGINATION
// ============================================================

function AuditPagination({
  currentPage,
  totalPages,
  totalItems,
  pageNumbers,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageNumbers: number[];
  onPageChange: (
    page: number
  ) => void;
}) {
  const startItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) * 5 + 1;

  const endItem = Math.min(
    currentPage * 5,
    totalItems
  );

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

      {/* INFO */}

      <p className="text-xs text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-600">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-600">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-600">
          {totalItems}
        </span>{" "}
        audit events
      </p>

      {/* BUTTONS */}

      {totalPages > 1 && (
        <div className="flex items-center gap-1">

          <button
            type="button"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              onPageChange(
                currentPage - 1
              )
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {pageNumbers.map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() =>
                  onPageChange(
                    page
                  )
                }
                className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition ${
                  currentPage ===
                  page
                    ? "bg-[#800000] text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              onPageChange(
                currentPage + 1
              )
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}

// ============================================================
// DETAILS MODAL
// ============================================================

function AuditDetailsModal({
  entry,
  onClose,
}: {
  entry: AuditEntry;
  onClose: () => void;
}) {
  return (
    <ModalOverlay
      onClose={onClose}
    >

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-2xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="shrink-0 border-b border-gray-100 bg-[#800000]/[0.025] px-5 py-4">

          <div className="flex items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#800000]/5 text-[#800000]">

                <Activity className="h-5 w-5" />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Audit Event
                </p>

                <h3 className="truncate text-base font-bold text-[#800000]">
                  {
                    getActionLabel(
                      entry.action
                    )
                  }
                </h3>

              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

        </div>

        {/* ================================================== */}
        {/* CONTENT */}
        {/* ================================================== */}

        <div className="overflow-y-auto">

          <div className="space-y-5 p-5">

            {/* ACTION */}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Action
                </p>

                <div className="mt-2">
                  <ActionBadge
                    action={
                      entry.action
                    }
                  />
                </div>

              </div>

              <div className="text-right">

                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Date & Time
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {formatDateTime(
                    entry.performedAt
                  )}
                </p>

              </div>

            </div>

            {/* PERFORMED BY */}

            <AuditDetailsSection
              icon={
                <User className="h-4 w-4" />
              }
              title="Performed By"
            >

              <div className="grid gap-3 sm:grid-cols-2">

                <DetailItem
                  label="Name"
                  value={
                    entry.performedByName ||
                    "Unknown"
                  }
                />

                <DetailItem
                  label="Employee ID"
                  value={
                    entry.performedByEmployeeId ||
                    "N/A"
                  }
                />

                <DetailItem
                  label="Email"
                  value={
                    entry.performedByEmail ||
                    "N/A"
                  }
                />

                <DetailItem
                  label="Account ID"
                  value={
                    entry.performedBy ||
                    "N/A"
                  }
                />

              </div>

            </AuditDetailsSection>

            {/* BORROWING REQUEST */}

            <AuditDetailsSection
              icon={
                <ClipboardList className="h-4 w-4" />
              }
              title="Borrowing Request"
            >

              <div className="grid gap-3 sm:grid-cols-2">

                <DetailItem
                  label="Borrower"
                  value={
                    entry.studentName
                  }
                />

                <DetailItem
                  label="Section"
                  value={
                    entry.section
                  }
                />

                <DetailItem
                  label="Group Number"
                  value={
                    entry.groupNumber
                  }
                />

                <DetailItem
                  label="Activity"
                  value={
                    entry.activityTitle
                  }
                />

                <DetailItem
                  label="Activity Date"
                  value={formatDateStatic(
                    entry.activityDate
                  )}
                />

                <DetailItem
                  label="Request ID"
                  value={
                    entry.requestId
                  }
                />

              </div>

            </AuditDetailsSection>

            {/* INSTRUCTOR */}

            <AuditDetailsSection
              icon={
                <Users className="h-4 w-4" />
              }
              title="Instructor"
            >

              <div className="grid gap-3 sm:grid-cols-2">

                <DetailItem
                  label="Instructor Name"
                  value={
                    entry.instructorName ||
                    "N/A"
                  }
                />

                <DetailItem
                  label="Department"
                  value={
                    entry.instructorDepartment ||
                    "N/A"
                  }
                />

                <DetailItem
                  label="Email"
                  value={
                    entry.instructorEmail ||
                    "N/A"
                  }
                />

                <DetailItem
                  label="Request Status"
                  value={
                    capitalize(
                      entry.requestStatus
                    )
                  }
                />

              </div>

            </AuditDetailsSection>

            {/* DETAILS / REASON */}

            {(entry.details ||
              entry.reason) && (
              <AuditDetailsSection
                icon={
                  <Activity className="h-4 w-4" />
                }
                title="Event Information"
              >

                <div className="space-y-3">

                  {entry.details && (
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Details
                      </p>

                      <p className="mt-1.5 text-sm leading-6 text-gray-600">
                        {
                          entry.details
                        }
                      </p>

                    </div>
                  )}

                  {entry.reason && (
                    <div className="rounded-xl border border-red-100 bg-red-50/50 p-3.5">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                        Reason
                      </p>

                      <p className="mt-1.5 text-sm leading-6 text-gray-600">
                        {
                          entry.reason
                        }
                      </p>

                    </div>
                  )}

                </div>

              </AuditDetailsSection>
            )}

          </div>

        </div>

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <div className="flex shrink-0 justify-end border-t border-gray-100 bg-gray-50/50 px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Close
          </button>

        </div>

      </div>

    </ModalOverlay>
  );
}

// ============================================================
// DETAILS SECTION
// ============================================================

function AuditDetailsSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>

      <div className="mb-3 flex items-center gap-2">

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

          {icon}

        </div>

        <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-[#800000]/70">
          {title}
        </h4>

      </div>

      {children}

    </div>
  );
}

// ============================================================
// DETAIL ITEM
// ============================================================

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">

      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-medium text-gray-700">
        {value || "—"}
      </p>

    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function AuditStatCard({
  title,
  value,
  label,
  icon,
  accent,
}: {
  title: string;
  value: number;
  label: string;
  icon: React.ReactNode;
  accent:
    | "maroon"
    | "blue"
    | "orange"
    | "green";
}) {
  const styles = {
    maroon: {
      border:
        "border-[#800000]/15",
      iconBg:
        "bg-[#800000]/5",
      iconColor:
        "text-[#800000]",
      value:
        "text-[#800000]",
    },

    blue: {
      border:
        "border-blue-100",
      iconBg:
        "bg-blue-50",
      iconColor:
        "text-blue-600",
      value:
        "text-blue-600",
    },

    orange: {
      border:
        "border-orange-100",
      iconBg:
        "bg-orange-50",
      iconColor:
        "text-orange-600",
      value:
        "text-orange-600",
    },

    green: {
      border:
        "border-green-100",
      iconBg:
        "bg-green-50",
      iconColor:
        "text-green-600",
      value:
        "text-green-600",
    },
  };

  const style =
    styles[accent];

  return (
    <Card
      className={`rounded-xl border bg-white ${style.border} shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <CardContent className="p-5">

        <div className="flex items-center justify-between gap-3">

          <span className="text-sm font-medium text-gray-500">
            {title}
          </span>

          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconBg} ${style.iconColor}`}
          >
            {icon}
          </div>

        </div>

        <div className="mt-4 flex items-end gap-2">

          <span
            className={`text-2xl font-bold sm:text-3xl ${style.value}`}
          >
            {value}
          </span>

          <span className="mb-1 text-xs text-gray-400">
            {label}
          </span>

        </div>

      </CardContent>
    </Card>
  );
}

// ============================================================
// MINI AUDIT CARD
// ============================================================

function MiniAuditCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${className}`}
        >
          {icon}
        </div>

        <span className="text-xs font-medium text-gray-500">
          {label}
        </span>

      </div>

      <span className="text-lg font-bold text-gray-700">
        {value}
      </span>

    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function HistoryEmptyState({
  hasFilter,
  onClear,
}: {
  hasFilter: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">

        {hasFilter ? (
          <Search className="h-6 w-6" />
        ) : (
          <Activity className="h-6 w-6" />
        )}

      </div>

      <h3 className="text-sm font-semibold text-gray-700">

        {hasFilter
          ? "No audit events found"
          : "No audit history available"}

      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">

        {hasFilter
          ? "No audit events match your current search or action filter."
          : "There are currently no recorded audit events in the system."}

      </p>

      {hasFilter && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
        >
          Clear Filters
        </button>
      )}

    </div>
  );
}

// ============================================================
// MODAL OVERLAY
// ============================================================

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]">

      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      {children}

    </div>
  );
}

// ============================================================
// ACTION LABEL
// ============================================================

function getActionLabel(
  action: HistoryAction
) {
  const labels = {
    created: "Request Created",
    approved: "Request Approved",
    rejected: "Request Rejected",
    released: "Equipment Released",
    returned: "Equipment Returned",
  };

  return labels[action];
}

// ============================================================
// CAPITALIZE
// ============================================================

function capitalize(
  value?: string | null
) {
  if (!value) {
    return "N/A";
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

// ============================================================
// FORMAT DATE
// ============================================================

function formatDateStatic(
  date?: string | null
) {
  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

// ============================================================
// FORMAT DATE + TIME
// ============================================================

function formatDateTime(
  date?: string | null
) {
  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "—";
  }

  return parsedDate.toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

// ============================================================
// LOADING
// ============================================================

function AdminHistoryAuditLoading() {
  return (
    <div className="space-y-7">

      {/* HEADER */}

      <section>

        <div className="animate-pulse">

          <div className="mb-2 h-3 w-32 rounded bg-gray-200" />

          <div className="h-8 w-64 rounded bg-gray-200" />

          <div className="mt-2 h-4 w-full max-w-2xl rounded bg-gray-100" />

        </div>

      </section>

      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {Array.from({
          length: 4,
        }).map(
          (_, index) => (
            <Card
              key={index}
              className="rounded-xl border border-gray-100 shadow-sm"
            >
              <CardContent className="p-5">

                <div className="animate-pulse">

                  <div className="flex justify-between">

                    <div className="h-4 w-24 rounded bg-gray-100" />

                    <div className="h-9 w-9 rounded-lg bg-gray-100" />

                  </div>

                  <div className="mt-4 h-8 w-16 rounded bg-gray-100" />

                </div>

              </CardContent>
            </Card>
          )
        )}

      </div>

      {/* TABLE */}

      <Card className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">

        <CardContent className="p-0">

          <div className="border-b border-gray-100 p-5">

            <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-gray-100" />

          </div>

          <div className="space-y-4 p-5">

            {Array.from({
              length: 5,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-4"
                >

                  <div className="h-7 w-20 rounded-full bg-gray-100" />

                  <div className="h-9 w-9 rounded-lg bg-gray-100" />

                  <div className="flex-1">

                    <div className="h-3 w-40 rounded bg-gray-100" />

                    <div className="mt-2 h-2.5 w-56 rounded bg-gray-100" />

                  </div>

                  <div className="hidden h-8 w-20 rounded-lg bg-gray-100 sm:block" />

                </div>
              )
            )}

          </div>

        </CardContent>

      </Card>

    </div>
  );
}