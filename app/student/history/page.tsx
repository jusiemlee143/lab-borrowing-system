"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  History,
  Package,
  CalendarDays,
  User,
  Mail,
  GraduationCap,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

type StudentSession = {
  loggedIn?: boolean;
  studentId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  course?: string;
};

type CartItem = {
  id: string;
  name: string;
  quantity: number;
};

type Instructor = {
  _id?: string;
  name?: string;
  email?: string;
};

type BorrowRecord = {
  _id: string;
  studentId: string;
  studentName: string;
  section: string;
  groupNumber: string;
  date: string;
  activityTitle: string;
  instructor: Instructor | string;
  members: string[];
  cart: CartItem[];
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "released"
    | "returned";

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
};

// ============================================================
// PAGE
// ============================================================

export default function StudentHistoryPage() {
  const router = useRouter();

  // ============================================================
  // STATE
  // ============================================================

  const [student, setStudent] =
    useState<StudentSession | null>(null);

  const [history, setHistory] =
    useState<BorrowRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ============================================================
  // CHECK SESSION
  // ============================================================

  useEffect(() => {
    const loadStudentSession = async () => {
      try {
        const savedSession =
          sessionStorage.getItem("studentSession");

        if (!savedSession) {
          router.replace("/student/login");
          return;
        }

        const parsedStudent: StudentSession =
          JSON.parse(savedSession);

        if (
          !parsedStudent ||
          parsedStudent.loggedIn !== true
        ) {
          router.replace("/student/login");
          return;
        }

        if (!parsedStudent.studentId) {
          console.error(
            "Student session does not contain studentId."
          );

          setError(
            "Your student ID could not be found in your session."
          );

          setLoading(false);
          return;
        }

        setStudent(parsedStudent);

        setLoading(false);
      } catch (err) {
        console.error(
          "Invalid student session:",
          err
        );

        sessionStorage.removeItem(
          "studentSession"
        );

        router.replace("/student/login");
      }
    };

    loadStudentSession();
  }, [router]);

  // ============================================================
  // FETCH HISTORY
  // ============================================================

  useEffect(() => {
    // Make sure studentId exists before continuing
    if (!student?.studentId) return;

    // Store studentId in a separate constant.
    // This fixes the TypeScript string | undefined error.
    const studentId = student.studentId;

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        setError("");

        const response = await fetch(
          `/api/student/borrow/history?studentId=${encodeURIComponent(
            studentId
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        // ======================================================
        // GET RESPONSE TEXT FIRST
        // ======================================================

        const responseText =
          await response.text();

        let data: any;

        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error(
            "History API returned non-JSON:",
            responseText
          );

          throw new Error(
            "The history server returned an invalid response."
          );
        }

        // ======================================================
        // CHECK HTTP RESPONSE
        // ======================================================

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load borrowing history."
          );
        }

        // ======================================================
        // CHECK API SUCCESS
        // ======================================================

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "Failed to load borrowing history."
          );
        }

        // ======================================================
        // GET HISTORY RECORDS
        // ======================================================

        const records = Array.isArray(data.history)
          ? data.history
          : [];

        setHistory(records);
      } catch (err) {
        console.error(
          "Failed to load borrowing history:",
          err
        );

        setHistory([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load borrowing history."
        );
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [student]);

  // ============================================================
  // STATUS
  // ============================================================

  const getStatusStyle = (
    status: BorrowRecord["status"]
  ) => {
    switch (status) {
      case "returned":
        return {
          className:
            "bg-green-100 text-green-700",
          icon: (
            <CheckCircle2 className="h-4 w-4" />
          ),
          text: "Returned",
        };

      case "approved":
        return {
          className:
            "bg-blue-100 text-blue-700",
          icon: (
            <CheckCircle2 className="h-4 w-4" />
          ),
          text: "Approved",
        };

      case "released":
        return {
          className:
            "bg-purple-100 text-purple-700",
          icon: (
            <Package className="h-4 w-4" />
          ),
          text: "Released",
        };

      case "rejected":
        return {
          className:
            "bg-red-100 text-red-700",
          icon: (
            <XCircle className="h-4 w-4" />
          ),
          text: "Rejected",
        };

      default:
        return {
          className:
            "bg-yellow-100 text-yellow-700",
          icon: (
            <Clock className="h-4 w-4" />
          ),
          text: "Pending",
        };
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    date?: string | null
  ) => {
    if (!date) return "N/A";

    try {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return date;
      }

      return parsedDate.toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  // ============================================================
  // GET INSTRUCTOR NAME
  // ============================================================

  const getInstructorName = (
    instructor: Instructor | string
  ) => {
    if (!instructor) return "N/A";

    if (typeof instructor === "string") {
      return instructor;
    }

    return instructor.name || "N/A";
  };

  // ============================================================
  // LOADING PAGE
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#800000]">
            <History className="h-6 w-6 text-[#FFD700]" />
          </div>

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#800000]" />

          <p className="text-sm text-gray-500">
            Loading borrowing history...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">

            {/* BACK BUTTON */}

            <button
              onClick={() =>
                router.push(
                  "/student/dashboard"
                )
              }
              className="rounded-lg p-2 transition hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>

            {/* ICON */}

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#800000]">
              <History className="h-5 w-5 text-white" />
            </div>

            {/* TITLE */}

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Borrowing History
              </h1>

              <p className="text-xs text-gray-500">
                View your previous laboratory borrowing requests
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <main className="mx-auto max-w-6xl px-6 py-8">

        {/* ==================================================== */}
        {/* STUDENT INFORMATION */}
        {/* ==================================================== */}

        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">

          {/* TITLE */}

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#800000]/10">
              <User className="h-5 w-5 text-[#800000]" />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Student Information
              </h2>

              <p className="text-sm text-gray-500">
                Logged in student
              </p>
            </div>
          </div>

          {/* INFORMATION GRID */}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* NAME */}

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <User className="h-4 w-4" />

                <span className="text-xs font-medium">
                  Name
                </span>
              </div>

              <p className="font-semibold text-gray-900">
                {student?.fullName ||
                  student?.name ||
                  "Student"}
              </p>
            </div>

            {/* STUDENT ID */}

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <GraduationCap className="h-4 w-4" />

                <span className="text-xs font-medium">
                  Student ID
                </span>
              </div>

              <p className="font-semibold text-gray-900">
                {student?.studentId || "N/A"}
              </p>
            </div>

            {/* COURSE */}

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <FileText className="h-4 w-4" />

                <span className="text-xs font-medium">
                  Course
                </span>
              </div>

              <p className="font-semibold text-gray-900">
                {student?.course || "N/A"}
              </p>
            </div>

            {/* EMAIL */}

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <Mail className="h-4 w-4" />

                <span className="text-xs font-medium">
                  Email
                </span>
              </div>

              <p className="break-all font-semibold text-gray-900">
                {student?.email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* HISTORY TITLE */}
        {/* ==================================================== */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Past Borrowing Requests
            </h2>

            <p className="text-sm text-gray-500">
              Your previous laboratory equipment requests
            </p>
          </div>

          <div className="w-fit rounded-full bg-[#800000]/10 px-4 py-2 text-sm font-semibold text-[#800000]">
            {history.length}{" "}
            {history.length === 1
              ? "Record"
              : "Records"}
          </div>
        </div>

        {/* ==================================================== */}
        {/* ERROR */}
        {/* ==================================================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">

              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <h3 className="font-semibold text-red-800">
                  Unable to load history
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* HISTORY LOADING */}
        {/* ==================================================== */}

        {historyLoading ? (

          <div className="rounded-xl border bg-white px-6 py-16 text-center shadow-sm">

            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#800000]" />

            <p className="text-sm text-gray-500">
              Loading your borrowing records...
            </p>

          </div>

        ) : history.length === 0 ? (

          /* ================================================== */
          /* EMPTY STATE */
          /* ================================================== */

          <div className="rounded-xl border bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <History className="h-8 w-8 text-gray-400" />
            </div>

            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No borrowing history
            </h3>

            <p className="mx-auto max-w-md text-sm text-gray-500">
              You have no borrowing records yet.
              Once you submit a borrower slip,
              your request will appear here.
            </p>

          </div>

        ) : (

          /* ================================================== */
          /* HISTORY LIST */
          /* ================================================== */

          <div className="space-y-5">

            {history.map((record) => {

              const status =
                getStatusStyle(
                  record.status
                );

              return (

                <div
                  key={record._id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm"
                >

                  {/* ======================================== */}
                  {/* CARD HEADER */}
                  {/* ======================================== */}

                  <div className="flex flex-col gap-4 border-b bg-gray-50 px-6 py-4 md:flex-row md:items-center md:justify-between">

                    <div>

                      <div className="mb-1 flex items-center gap-2">

                        <Package className="h-5 w-5 text-[#800000]" />

                        <h3 className="font-bold text-gray-900">
                          {record.activityTitle}
                        </h3>

                      </div>

                      <p className="text-xs text-gray-500">
                        Request ID:{" "}
                        {record._id}
                      </p>

                    </div>

                    {/* STATUS */}

                    <div
                      className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                    >
                      {status.icon}

                      {status.text}
                    </div>

                  </div>

                  {/* ======================================== */}
                  {/* CARD BODY */}
                  {/* ======================================== */}

                  <div className="p-6">

                    {/* BASIC DETAILS */}

                    <div className="mb-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                      {/* DATE */}

                      <div>

                        <p className="mb-1 text-xs text-gray-500">
                          Borrow Date
                        </p>

                        <div className="flex items-center gap-2">

                          <CalendarDays className="h-4 w-4 text-[#800000]" />

                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(
                              record.date
                            )}
                          </p>

                        </div>

                      </div>

                      {/* INSTRUCTOR */}

                      <div>

                        <p className="mb-1 text-xs text-gray-500">
                          Instructor
                        </p>

                        <div className="flex items-center gap-2">

                          <User className="h-4 w-4 text-[#800000]" />

                          <p className="text-sm font-semibold text-gray-900">
                            {getInstructorName(
                              record.instructor
                            )}
                          </p>

                        </div>

                      </div>

                      {/* SECTION */}

                      <div>

                        <p className="mb-1 text-xs text-gray-500">
                          Section
                        </p>

                        <p className="text-sm font-semibold text-gray-900">
                          {record.section ||
                            "N/A"}
                        </p>

                      </div>

                      {/* GROUP */}

                      <div>

                        <p className="mb-1 text-xs text-gray-500">
                          Group
                        </p>

                        <p className="text-sm font-semibold text-gray-900">
                          {record.groupNumber ||
                            "N/A"}
                        </p>

                      </div>

                    </div>

                    {/* ====================================== */}
                    {/* BORROWED ITEMS */}
                    {/* ====================================== */}

                    <div className="mb-6">

                      <div className="mb-3 flex items-center gap-2">

                        <Package className="h-4 w-4 text-[#800000]" />

                        <h4 className="text-sm font-bold text-gray-900">
                          Borrowed Items
                        </h4>

                      </div>

                      {record.cart?.length >
                      0 ? (

                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

                          {record.cart.map(
                            (
                              item,
                              index
                            ) => (

                              <div
                                key={`${item.id}-${index}`}
                                className="flex items-center justify-between gap-3 rounded-lg border bg-gray-50 px-3 py-2"
                              >

                                <div className="flex min-w-0 items-center gap-2">

                                  <div className="h-2 w-2 shrink-0 rounded-full bg-[#800000]" />

                                  <span className="truncate text-sm text-gray-700">
                                    {item.name}
                                  </span>

                                </div>

                                <span className="shrink-0 rounded-full bg-[#800000]/10 px-2 py-1 text-xs font-semibold text-[#800000]">
                                  ×{" "}
                                  {item.quantity}
                                </span>

                              </div>

                            )
                          )}

                        </div>

                      ) : (

                        <p className="text-sm text-gray-500">
                          No items recorded.
                        </p>

                      )}

                    </div>

                    {/* ====================================== */}
                    {/* MEMBERS */}
                    {/* ====================================== */}

                    {record.members?.length >
                      0 && (

                      <div className="mb-6">

                        <div className="mb-3 flex items-center gap-2">

                          <User className="h-4 w-4 text-[#800000]" />

                          <h4 className="text-sm font-bold text-gray-900">
                            Group Members
                          </h4>

                        </div>

                        <div className="flex flex-wrap gap-2">

                          {record.members.map(
                            (
                              member,
                              index
                            ) => (

                              <span
                                key={index}
                                className="rounded-full border bg-gray-50 px-3 py-1.5 text-xs text-gray-700"
                              >
                                {member}
                              </span>

                            )
                          )}

                        </div>

                      </div>

                    )}

                    {/* ====================================== */}
                    {/* REJECTION REASON */}
                    {/* ====================================== */}

                    {record.status ===
                      "rejected" &&
                      record.rejectReason && (

                      <div className="mb-6 rounded-lg bg-red-50 px-4 py-3">

                        <div className="flex items-start gap-2">

                          <XCircle className="mt-0.5 h-4 w-4 text-red-600" />

                          <div>

                            <p className="text-sm font-semibold text-red-800">
                              Rejection Reason
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                              {
                                record.rejectReason
                              }
                            </p>

                          </div>

                        </div>

                      </div>

                    )}

                    {/* ====================================== */}
                    {/* RETURN DATE */}
                    {/* ====================================== */}

                    {record.returnedDate && (

                      <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3">

                        <RotateCcw className="h-4 w-4 text-green-600" />

                        <span className="text-sm text-green-700">
                          Returned on{" "}
                          <strong>
                            {formatDate(
                              record.returnedDate
                            )}
                          </strong>
                        </span>

                      </div>

                    )}

                    {/* ====================================== */}
                    {/* APPROVED DATE */}
                    {/* ====================================== */}

                    {record.approvedDate && (

                      <div className="mb-6 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3">

                        <CheckCircle2 className="h-4 w-4 text-blue-600" />

                        <span className="text-sm text-blue-700">
                          Approved on{" "}
                          <strong>
                            {formatDate(
                              record.approvedDate
                            )}
                          </strong>
                        </span>

                      </div>

                    )}

                    {/* ====================================== */}
                    {/* RELEASED DATE */}
                    {/* ====================================== */}

                    {record.releasedDate && (

                      <div className="mb-6 flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-3">

                        <Package className="h-4 w-4 text-purple-600" />

                        <span className="text-sm text-purple-700">
                          Released on{" "}
                          <strong>
                            {formatDate(
                              record.releasedDate
                            )}
                          </strong>
                        </span>

                      </div>

                    )}

                  </div>
                </div>
              );
            })}

          </div>
        )}
      </main>
    </div>
  );
}