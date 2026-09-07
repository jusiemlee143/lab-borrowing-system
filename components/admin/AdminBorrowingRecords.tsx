"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  GraduationCap,
  PackageCheck,
  PackageX,
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

const BORROWING_RECORDS_API =
  "/api/admin/borrowing-records";

// ============================================================
// TYPES
// ============================================================

type BorrowingStatus =
  | "pending"
  | "approved"
  | "released"
  | "returned"
  | "rejected";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

interface HistoryItem {
  _id?: string;
  action:
    | "created"
    | "approved"
    | "rejected"
    | "released"
    | "returned";
  performedBy?: string | null;
  performedByName: string;
  performedByEmail?: string;
  performedByEmployeeId?: string;
  performedAt?: string;
  reason?: string;
  details?: string;
}

interface BorrowingRecord {
  _id: string;

  studentName: string;
  section: string;
  groupNumber: string;

  members: string[];

  date: string;
  activityTitle: string;

  instructorName: string;
  instructorEmail?: string;
  instructorDepartment?: string;
  instructorId?: string | null;

  cart: CartItem[];
  totalItems: number;

  status: BorrowingStatus;

  approvedBy: string;
  approvedDate?: string | null;

  releasedBy: string;
  releasedDate?: string | null;

  returnedBy: string;
  returnedDate?: string | null;

  rejectedBy: string;
  rejectedDate?: string | null;

  rejectReason: string;

  history: HistoryItem[];

  createdAt?: string | null;
  updatedAt?: string | null;
}

// ============================================================
// PAGINATION
// ============================================================

const RECORDS_PER_PAGE = 5;

// ============================================================
// SAFE API RESPONSE
// ============================================================

async function getApiResponse(
  response: Response
) {
  const contentType =
    response.headers.get("content-type") || "";

  if (
    contentType.includes(
      "application/json"
    )
  ) {
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

export default function BorrowingRecords() {
  const [records, setRecords] = useState<
    BorrowingRecord[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | BorrowingStatus
    >("all");

  const [selectedRecord, setSelectedRecord] =
    useState<BorrowingRecord | null>(
      null
    );

  const [currentPage, setCurrentPage] =
    useState(1);

  // ==========================================================
  // FETCH RECORDS
  // ==========================================================

  const fetchRecords = async () => {
    try {
      setRefreshing(true);

      const response = await fetch(
        BORROWING_RECORDS_API,
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
            "Failed to fetch borrowing records."
        );
      }

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
          "Unexpected borrowing records response:",
          data
        );

        setRecords([]);
      }
    } catch (error) {
      console.error(
        "Borrowing records fetch error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load borrowing records."
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
    fetchRecords();
  }, []);

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredRecords =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return records.filter(
        (record) => {
          const matchesStatus =
            statusFilter === "all" ||
            record.status ===
              statusFilter;

          if (!matchesStatus) {
            return false;
          }

          if (!query) {
            return true;
          }

          const equipmentText =
            record.cart
              .map(
                (item) =>
                  item.name
              )
              .join(" ")
              .toLowerCase();

          const memberText =
            record.members
              .join(" ")
              .toLowerCase();

          return (
            record.studentName
              .toLowerCase()
              .includes(query) ||
            record.section
              .toLowerCase()
              .includes(query) ||
            record.groupNumber
              .toLowerCase()
              .includes(query) ||
            record.activityTitle
              .toLowerCase()
              .includes(query) ||
            record.instructorName
              .toLowerCase()
              .includes(query) ||
            equipmentText.includes(
              query
            ) ||
            memberText.includes(
              query
            )
          );
        }
      );
    }, [
      records,
      searchQuery,
      statusFilter,
    ]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRecords.length /
        RECORDS_PER_PAGE
    )
  );

  const paginatedRecords =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        RECORDS_PER_PAGE;

      const endIndex =
        startIndex +
        RECORDS_PER_PAGE;

      return filteredRecords.slice(
        startIndex,
        endIndex
      );
    }, [
      filteredRecords,
      currentPage,
    ]);

  // ==========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
  ]);

  // ==========================================================
  // KEEP PAGE VALID
  // ==========================================================

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

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalRecords =
    records.length;

  const pendingRecords =
    records.filter(
      (record) =>
        record.status ===
        "pending"
    ).length;

  const activeRecords =
    records.filter(
      (record) =>
        record.status ===
        "released"
    ).length;

  const returnedRecords =
    records.filter(
      (record) =>
        record.status ===
        "returned"
    ).length;

  const approvedRecords =
    records.filter(
      (record) =>
        record.status ===
        "approved"
    ).length;

  const rejectedRecords =
    records.filter(
      (record) =>
        record.status ===
        "rejected"
    ).length;

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <BorrowingRecordsLoading />
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
                  Borrowing Records Active
                </span>

              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#800000] sm:text-3xl">
                Borrowing Records
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Monitor and review all laboratory
                equipment borrowing transactions.
              </p>

              <p className="mt-2 text-[11px] text-gray-400">
                Records are automatically synchronized
                with the Lab-in-Charge borrowing system.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchRecords}
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

            <BorrowingStatCard
              title="Total Records"
              value={totalRecords}
              label="all transactions"
              icon={
                <ClipboardList className="h-5 w-5" />
              }
              accent="maroon"
            />

            <BorrowingStatCard
              title="Pending"
              value={pendingRecords}
              label="awaiting approval"
              icon={
                <Clock3 className="h-5 w-5" />
              }
              accent="gold"
            />

            <BorrowingStatCard
              title="Active Borrowings"
              value={activeRecords}
              label="currently released"
              icon={
                <PackageCheck className="h-5 w-5" />
              }
              accent="blue"
            />

            <BorrowingStatCard
              title="Returned"
              value={returnedRecords}
              label="completed"
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <MiniSummaryCard
              label="Approved"
              value={approvedRecords}
              icon={
                <CheckCircle2 className="h-4 w-4" />
              }
              className="text-blue-600 bg-blue-50"
            />

            <MiniSummaryCard
              label="Rejected"
              value={rejectedRecords}
              icon={
                <XCircle className="h-4 w-4" />
              }
              className="text-red-600 bg-red-50"
            />

          </div>
        </section>

        {/* ================================================== */}
        {/* RECORD DIRECTORY */}
        {/* ================================================== */}

        <section>

          <div className="mb-4 flex items-center gap-3">

            <div className="h-6 w-1 rounded-full bg-[#800000]" />

            <div className="flex items-center gap-2">

              <ClipboardList className="h-4 w-4 text-[#800000]" />

              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#800000]/70">
                Borrowing Transactions
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
                      placeholder="Search borrower, equipment, activity..."
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

                  {/* STATUS FILTER */}

                  <div className="flex items-center gap-2">

                    <span className="text-xs font-medium text-gray-400">
                      Status:
                    </span>

                    <select
                      value={
                        statusFilter
                      }
                      onChange={(event) =>
                        setStatusFilter(
                          event.target.value as
                            | "all"
                            | BorrowingStatus
                        )
                      }
                      className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 outline-none transition focus:border-[#800000]/30 focus:bg-white focus:ring-2 focus:ring-[#800000]/5"
                    >
                      <option value="all">
                        All Status
                      </option>

                      <option value="pending">
                        Pending
                      </option>

                      <option value="approved">
                        Approved
                      </option>

                      <option value="released">
                        Released
                      </option>

                      <option value="returned">
                        Returned
                      </option>

                      <option value="rejected">
                        Rejected
                      </option>
                    </select>

                  </div>

                </div>

                {/* RESULTS INFO */}

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-2 text-xs text-gray-400">

                    <Activity className="h-3.5 w-3.5" />

                    <span>
                      {
                        filteredRecords.length
                      }{" "}
                      {filteredRecords.length ===
                      1
                        ? "record"
                        : "records"}{" "}
                      found
                    </span>

                  </div>

                  {(searchQuery ||
                    statusFilter !==
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
              {/* TABLE + PAGINATION */}
              {/* ================================================= */}

              {filteredRecords.length >
              0 ? (
                <>
                  <BorrowingRecordsTable
                    records={
                      paginatedRecords
                    }
                    onView={
                      setSelectedRecord
                    }
                  />

                  {totalPages > 1 && (
                    <BorrowingPagination
                      currentPage={
                        currentPage
                      }
                      totalPages={
                        totalPages
                      }
                      totalRecords={
                        filteredRecords.length
                      }
                      recordsPerPage={
                        RECORDS_PER_PAGE
                      }
                      onPageChange={
                        setCurrentPage
                      }
                    />
                  )}
                </>
              ) : (
                <BorrowingRecordsEmptyState
                  hasFilter={
                    Boolean(
                      searchQuery.trim()
                    ) ||
                    statusFilter !==
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

                <ClipboardList className="h-5 w-5" />

              </div>

              <div>

                <p className="font-semibold text-[#800000]">
                  Borrowing History
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  These records are shared with the
                  Lab-in-Charge system. Administrative
                  users can review transactions and
                  their complete audit trail here.
                  Borrowing actions should be performed
                  through the Lab-in-Charge workflow.
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ==================================================== */}
      {/* DETAILS MODAL */}
      {/* ==================================================== */}

      {selectedRecord && (
        <BorrowingDetailsModal
          record={selectedRecord}
          onClose={() =>
            setSelectedRecord(null)
          }
        />
      )}
    </>
  );
}

// ============================================================
// BORROWING TABLE
// ============================================================

function BorrowingRecordsTable({
  records,
  onView,
}: {
  records: BorrowingRecord[];
  onView: (
    record: BorrowingRecord
  ) => void;
}) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full min-w-[1000px] text-left">

        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">

            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Borrower
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Activity
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Equipment
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Date
            </th>

            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Status
            </th>

            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Actions
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">

          {records.map(
            (record) => (
              <tr
                key={
                  record._id
                }
                className="group transition hover:bg-[#800000]/[0.018]"
              >

                {/* BORROWER */}

                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                      <GraduationCap className="h-4 w-4" />

                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-gray-800">
                        {record.studentName}
                      </p>

                      <p className="text-xs text-gray-400">
                        {record.section}
                        {" • "}
                        Group{" "}
                        {record.groupNumber}
                      </p>

                    </div>

                  </div>

                </td>

                {/* ACTIVITY */}

                <td className="max-w-[220px] px-4 py-4">

                  <p className="truncate text-sm font-medium text-gray-700">
                    {record.activityTitle}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    Instructor:{" "}
                    {record.instructorName}
                  </p>

                </td>

                {/* EQUIPMENT */}

                <td className="px-4 py-4">

                  <p className="text-sm font-bold text-gray-700">
                    {record.totalItems}
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      units
                    </span>
                  </p>

                  <p className="mt-1 max-w-[180px] truncate text-xs text-gray-400">
                    {record.cart
                      .map(
                        (item) =>
                          item.name
                      )
                      .join(", ")}
                  </p>

                </td>

                {/* DATE */}

                <td className="px-4 py-4">

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">

                    <CalendarDays className="h-3.5 w-3.5 text-gray-400" />

                    {formatDateStatic(
                      record.date
                    )}

                  </div>

                </td>

                {/* STATUS */}

                <td className="px-4 py-4">

                  <BorrowingStatusBadge
                    status={
                      record.status
                    }
                  />

                </td>

                {/* ACTIONS */}

                <td className="px-5 py-4 text-right">

                  <button
                    type="button"
                    onClick={() =>
                      onView(
                        record
                      )
                    }
                    title="View borrowing record"
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
// BORROWING PAGINATION
// ============================================================

function BorrowingPagination({
  currentPage,
  totalPages,
  totalRecords,
  recordsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (
    page: number
  ) => void;
}) {
  const startRecord =
    (currentPage - 1) *
      recordsPerPage +
    1;

  const endRecord = Math.min(
    currentPage * recordsPerPage,
    totalRecords
  );

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

      {/* RECORD RANGE */}

      <p className="text-xs text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-600">
          {startRecord}
        </span>
        {" - "}
        <span className="font-semibold text-gray-600">
          {endRecord}
        </span>
        {" of "}
        <span className="font-semibold text-gray-600">
          {totalRecords}
        </span>{" "}
        records
      </p>

      {/* PAGINATION CONTROLS */}

      <div className="flex items-center gap-2">

        {/* PREVIOUS */}

        <button
          type="button"
          onClick={() =>
            onPageChange(
              currentPage - 1
            )
          }
          disabled={
            currentPage === 1
          }
          className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 shadow-sm transition hover:border-[#800000]/20 hover:bg-[#800000]/5 hover:text-[#800000] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-600"
        >
          Previous
        </button>

        {/* PAGE NUMBERS */}

        <div className="flex items-center gap-1">

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) =>
              index + 1
          ).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() =>
                onPageChange(page)
              }
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${
                currentPage === page
                  ? "bg-[#800000] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-500 hover:border-[#800000]/20 hover:bg-[#800000]/5 hover:text-[#800000]"
              }`}
            >
              {page}
            </button>
          ))}

        </div>

        {/* NEXT */}

        <button
          type="button"
          onClick={() =>
            onPageChange(
              currentPage + 1
            )
          }
          disabled={
            currentPage ===
            totalPages
          }
          className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 shadow-sm transition hover:border-[#800000]/20 hover:bg-[#800000]/5 hover:text-[#800000] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-600"
        >
          Next
        </button>

      </div>

    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function BorrowingStatusBadge({
  status,
}: {
  status: BorrowingStatus;
}) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/10 px-2.5 py-1 text-[10px] font-semibold text-[#8a6b00]">
        <Clock3 className="h-3 w-3" />
        Pending
      </span>
    );
  }

  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
        <CheckCircle2 className="h-3 w-3" />
        Approved
      </span>
    );
  }

  if (status === "released") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600">
        <PackageCheck className="h-3 w-3" />
        Released
      </span>
    );
  }

  if (status === "returned") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
        <RotateCcw className="h-3 w-3" />
        Returned
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-600">
      <PackageX className="h-3 w-3" />
      Rejected
    </span>
  );
}

// ============================================================
// DETAILS MODAL
// ============================================================

function BorrowingDetailsModal({
  record,
  onClose,
}: {
  record: BorrowingRecord;
  onClose: () => void;
}) {
  return (
    <ModalOverlay onClose={onClose}>

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#800000]/10 bg-white shadow-2xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="shrink-0 border-b border-gray-100 bg-[#800000]/[0.025] px-5 py-4">

          <div className="flex items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#800000]/5 text-[#800000]">

                <ClipboardList className="h-5 w-5" />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Borrowing Record
                </p>

                <h3 className="truncate text-base font-bold text-[#800000]">
                  {record.activityTitle}
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

            {/* STATUS */}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Current Status
                </p>

                <div className="mt-2">
                  <BorrowingStatusBadge
                    status={
                      record.status
                    }
                  />
                </div>

              </div>

              <div className="text-right">

                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Request Date
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {formatDateStatic(
                    record.createdAt
                  )}
                </p>

              </div>

            </div>

            {/* BORROWER */}

            <DetailsSection
              icon={
                <GraduationCap className="h-4 w-4" />
              }
              title="Borrower Information"
            >

              <div className="grid gap-3 sm:grid-cols-2">

                <DetailItem
                  label="Student / Borrower"
                  value={
                    record.studentName
                  }
                />

                <DetailItem
                  label="Section"
                  value={
                    record.section
                  }
                />

                <DetailItem
                  label="Group Number"
                  value={
                    record.groupNumber
                  }
                />

                <DetailItem
                  label="Activity Date"
                  value={
                    formatDateStatic(
                      record.date
                    )
                  }
                />

              </div>

              {record.members.length >
                0 && (
                <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">

                  <div className="mb-2 flex items-center gap-2">

                    <Users className="h-3.5 w-3.5 text-gray-400" />

                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Group Members
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {record.members.map(
                      (
                        member,
                        index
                      ) => (
                        <span
                          key={`${member}-${index}`}
                          className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-gray-100"
                        >
                          {member}
                        </span>
                      )
                    )}

                  </div>

                </div>
              )}

            </DetailsSection>

            {/* INSTRUCTOR */}

            <DetailsSection
              icon={
                <User className="h-4 w-4" />
              }
              title="Instructor"
            >

              <div className="grid gap-3 sm:grid-cols-2">

                <DetailItem
                  label="Instructor Name"
                  value={
                    record.instructorName
                  }
                />

                <DetailItem
                  label="Department"
                  value={
                    record.instructorDepartment ||
                    "N/A"
                  }
                />

                <DetailItem
                  label="Email"
                  value={
                    record.instructorEmail ||
                    "N/A"
                  }
                />

                <DetailItem
                  label="Activity"
                  value={
                    record.activityTitle
                  }
                />

              </div>

            </DetailsSection>

            {/* EQUIPMENT */}

            <DetailsSection
              icon={
                <PackageCheck className="h-4 w-4" />
              }
              title="Borrowed Equipment"
            >

              <div className="overflow-hidden rounded-xl border border-gray-100">

                <table className="w-full text-left">

                  <thead>

                    <tr className="border-b border-gray-100 bg-gray-50">

                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Equipment
                      </th>

                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Quantity
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-50">

                    {record.cart.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={`${item.id}-${index}`}
                        >

                          <td className="px-4 py-3">

                            <div className="flex items-center gap-2">

                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#800000]/5 text-[#800000]">

                                <PackageCheck className="h-3.5 w-3.5" />

                              </div>

                              <span className="text-sm font-medium text-gray-700">
                                {item.name}
                              </span>

                            </div>

                          </td>

                          <td className="px-4 py-3 text-right">

                            <span className="text-sm font-bold text-gray-700">
                              {item.quantity}
                            </span>

                            <span className="ml-1 text-xs text-gray-400">
                              units
                            </span>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

                <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 text-right">

                  <span className="text-xs text-gray-400">
                    Total Items
                  </span>

                  <span className="ml-2 text-sm font-bold text-[#800000]">
                    {record.totalItems}
                  </span>

                </div>

              </div>

            </DetailsSection>

            {/* TRANSACTION TIMELINE */}

            <DetailsSection
              icon={
                <Activity className="h-4 w-4" />
              }
              title="Transaction Timeline"
            >

              <div className="space-y-3">

                <TimelineItem
                  title="Request Created"
                  person={
                    record.history.find(
                      (item) =>
                        item.action ===
                        "created"
                    )?.performedByName ||
                    "Student"
                  }
                  date={
                    record.history.find(
                      (item) =>
                        item.action ===
                        "created"
                    )?.performedAt ||
                    record.createdAt
                  }
                  icon={
                    <ClipboardList className="h-4 w-4" />
                  }
                  type="created"
                />

                {record.approvedDate && (
                  <TimelineItem
                    title="Request Approved"
                    person={
                      record.approvedBy ||
                      "N/A"
                    }
                    date={
                      record.approvedDate
                    }
                    icon={
                      <CheckCircle2 className="h-4 w-4" />
                    }
                    type="approved"
                  />
                )}

                {record.releasedDate && (
                  <TimelineItem
                    title="Equipment Released"
                    person={
                      record.releasedBy ||
                      "N/A"
                    }
                    date={
                      record.releasedDate
                    }
                    icon={
                      <PackageCheck className="h-4 w-4" />
                    }
                    type="released"
                  />
                )}

                {record.returnedDate && (
                  <TimelineItem
                    title="Equipment Returned"
                    person={
                      record.returnedBy ||
                      "N/A"
                    }
                    date={
                      record.returnedDate
                    }
                    icon={
                      <RotateCcw className="h-4 w-4" />
                    }
                    type="returned"
                  />
                )}

                {record.rejectedDate && (
                  <TimelineItem
                    title="Request Rejected"
                    person={
                      record.rejectedBy ||
                      "N/A"
                    }
                    date={
                      record.rejectedDate
                    }
                    icon={
                      <XCircle className="h-4 w-4" />
                    }
                    type="rejected"
                  />
                )}

              </div>

            </DetailsSection>

            {/* REJECTION REASON */}

            {record.status ===
              "rejected" &&
              record.rejectReason && (
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">

                  <div className="flex items-start gap-3">

                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                    <div>

                      <p className="text-xs font-semibold text-red-700">
                        Rejection Reason
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-600">
                        {
                          record.rejectReason
                        }
                      </p>

                    </div>

                  </div>

                </div>
              )}

            {/* AUDIT HISTORY */}

            {record.history.length >
              0 && (
              <DetailsSection
                icon={
                  <Clock3 className="h-4 w-4" />
                }
                title="Audit History"
              >

                <div className="space-y-2">

                  {record.history
                    .slice()
                    .reverse()
                    .map(
                      (
                        history,
                        index
                      ) => (
                        <HistoryRow
                          key={
                            history._id ||
                            index
                          }
                          history={
                            history
                          }
                        />
                      )
                    )}

                </div>

              </DetailsSection>
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

function DetailsSection({
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
// TIMELINE ITEM
// ============================================================

function TimelineItem({
  title,
  person,
  date,
  icon,
  type,
}: {
  title: string;
  person: string;
  date?: string | null;
  icon: React.ReactNode;
  type:
    | "created"
    | "approved"
    | "released"
    | "returned"
    | "rejected";
}) {
  const styles = {
    created:
      "bg-gray-50 text-gray-500",
    approved:
      "bg-blue-50 text-blue-600",
    released:
      "bg-orange-50 text-orange-600",
    returned:
      "bg-green-50 text-green-600",
    rejected:
      "bg-red-50 text-red-600",
  };

  return (
    <div className="flex items-start gap-3">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles[type]}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-gray-50/50 p-3">

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs font-semibold text-gray-700">
            {title}
          </p>

          <span className="text-[10px] text-gray-400">
            {formatDateTime(
              date
            )}
          </span>

        </div>

        <p className="mt-1 text-[11px] text-gray-500">
          Performed by:{" "}
          <span className="font-medium text-gray-700">
            {person}
          </span>
        </p>

      </div>

    </div>
  );
}

// ============================================================
// HISTORY ROW
// ============================================================

function HistoryRow({
  history,
}: {
  history: HistoryItem;
}) {
  const actionLabels = {
    created: "Created",
    approved: "Approved",
    rejected: "Rejected",
    released: "Released",
    returned: "Returned",
  };

  const actionColors = {
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

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3.5">

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex items-center gap-2">

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${actionColors[history.action]}`}
          >
            {actionLabels[
              history.action
            ]}
          </span>

          <span className="text-xs font-medium text-gray-700">
            {history.performedByName}
          </span>

        </div>

        <span className="text-[10px] text-gray-400">
          {formatDateTime(
            history.performedAt
          )}
        </span>

      </div>

      {(history.details ||
        history.reason) && (
        <p className="mt-2 text-[11px] leading-5 text-gray-500">
          {history.details ||
            history.reason}
        </p>
      )}

      {history.performedByEmployeeId && (
        <p className="mt-1 text-[10px] text-gray-400">
          Employee ID:{" "}
          {
            history.performedByEmployeeId
          }
        </p>
      )}

    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function BorrowingStatCard({
  title,
  value,
  label,
  icon,
  accent,
}: {
  title: string;
  value: number | string;
  label: string;
  icon: React.ReactNode;
  accent:
    | "maroon"
    | "gold"
    | "blue"
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

    gold: {
      border:
        "border-[#FFD700]/40",
      iconBg:
        "bg-[#FFD700]/10",
      iconColor:
        "text-[#b88600]",
      value:
        "text-[#b88600]",
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
// MINI SUMMARY CARD
// ============================================================

function MiniSummaryCard({
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

function BorrowingRecordsEmptyState({
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
          <ClipboardList className="h-6 w-6" />
        )}

      </div>

      <h3 className="text-sm font-semibold text-gray-700">

        {hasFilter
          ? "No borrowing records found"
          : "No borrowing records available"}

      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">

        {hasFilter
          ? "No borrowing records match your current search or status filter."
          : "There are currently no borrowing transactions in the system."}

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

function BorrowingRecordsLoading() {
  return (
    <div className="space-y-7">

      {/* HEADER */}

      <section>

        <div className="animate-pulse">

          <div className="mb-2 h-3 w-36 rounded bg-gray-200" />

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

                  <div className="h-9 w-9 rounded-lg bg-gray-100" />

                  <div className="flex-1">

                    <div className="h-3 w-40 rounded bg-gray-100" />

                    <div className="mt-2 h-2.5 w-56 rounded bg-gray-100" />

                  </div>

                  <div className="hidden h-6 w-20 rounded-full bg-gray-100 sm:block" />

                  <div className="h-8 w-20 rounded-lg bg-gray-100" />

                </div>
              )
            )}

          </div>

        </CardContent>

      </Card>

    </div>
  );
}