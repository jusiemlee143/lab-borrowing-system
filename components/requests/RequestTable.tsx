"use client";

import { Button } from "@/components/ui/button";
import RequestStatusBadge from "./RequestStatusBadge";
import {
  User,
  CalendarDays,
  ClipboardList,
  Layers3,
  Eye,
} from "lucide-react";

export interface Request {
  _id: string;

  studentName: string;
  section?: string;
  groupNumber?: string;

  date: string;
  activityTitle: string;
  instructor?: string;

  members?: string[];

  cart?: {
    id: string;
    name: string;
    quantity: number;
  }[];

  status:
    | "pending"
    | "approved"
    | "released"
    | "returned"
    | "rejected";
}

interface Props {
  requests: Request[];

  onView: (request: Request) => void;
}

export default function RequestTable({
  requests,
  onView,
}: Props) {
  return (
    <div className="w-full">
      {/* ================================================= */}
      {/* TABLE HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-2 border-b border-gray-100 bg-gradient-to-r from-[#800000]/[0.03] to-[#FFD700]/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#800000]/10 text-[#800000]">
            <ClipboardList className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#800000]">
              Borrowing Requests
            </h3>

            <p className="text-xs text-gray-500">
              Review student laboratory equipment requests
            </p>
          </div>
        </div>

        {/* REQUEST COUNT */}

        <div className="flex items-center gap-2 self-start rounded-full border border-[#800000]/10 bg-white px-3 py-1.5 sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-[#800000]" />

          <span className="text-xs font-semibold text-gray-600">
            {requests.length}{" "}
            {requests.length === 1 ? "Request" : "Requests"}
          </span>
        </div>
      </div>

      {/* ================================================= */}
      {/* RESPONSIVE TABLE */}
      {/* ================================================= */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-sm">
          {/* ================================================= */}
          {/* TABLE HEAD */}
          {/* ================================================= */}

          <thead>
            <tr className="border-b border-[#800000]/10 bg-gray-50/80">
              {/* STUDENT */}

              <th className="px-5 py-4 text-left">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800000]">
                  <User className="h-4 w-4" />
                  Student
                </div>
              </th>

              {/* SECTION */}

              <th className="px-5 py-4 text-left">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800000]">
                  <Layers3 className="h-4 w-4" />
                  Section
                </div>
              </th>

              {/* ACTIVITY */}

              <th className="px-5 py-4 text-left">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800000]">
                  <ClipboardList className="h-4 w-4" />
                  Activity
                </div>
              </th>

              {/* DATE */}

              <th className="px-5 py-4 text-left">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800000]">
                  <CalendarDays className="h-4 w-4" />
                  Date
                </div>
              </th>

              {/* STATUS */}

              <th className="px-5 py-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#800000]">
                  Status
                </span>
              </th>

              {/* ACTION */}

              <th className="px-5 py-4 text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-[#800000]">
                  Action
                </span>
              </th>
            </tr>
          </thead>

          {/* ================================================= */}
          {/* TABLE BODY */}
          {/* ================================================= */}

          <tbody className="divide-y divide-gray-100">
            {requests.map((request) => (
              <tr
                key={request._id}
                className="
                  group
                  transition-all
                  duration-200
                  hover:bg-[#800000]/[0.025]
                "
              >
                {/* ========================================= */}
                {/* STUDENT */}
                {/* ========================================= */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#800000]/10
                        text-[#800000]
                        transition-all
                        duration-200
                        group-hover:bg-[#800000]
                        group-hover:text-[#FFD700]
                      "
                    >
                      <User className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {request.studentName}
                      </p>

                      {request.groupNumber && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          Group {request.groupNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* ========================================= */}
                {/* SECTION */}
                {/* ========================================= */}

                <td className="px-5 py-4">
                  {request.section ? (
                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-lg
                        border
                        border-gray-200
                        bg-gray-50
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-gray-700
                      "
                    >
                      {request.section}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">
                      —
                    </span>
                  )}
                </td>

                {/* ========================================= */}
                {/* ACTIVITY */}
                {/* ========================================= */}

                <td className="max-w-[260px] px-5 py-4">
                  <div>
                    <p className="truncate font-semibold text-gray-800">
                      {request.activityTitle}
                    </p>

                    {request.instructor && (
                      <p className="mt-1 truncate text-xs text-gray-400">
                        Instructor: {request.instructor}
                      </p>
                    )}
                  </div>
                </td>

                {/* ========================================= */}
                {/* DATE */}
                {/* ========================================= */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarDays className="h-4 w-4 text-[#800000]/60" />

                    <span className="text-sm font-medium">
                      {request.date}
                    </span>
                  </div>
                </td>

                {/* ========================================= */}
                {/* STATUS */}
                {/* ========================================= */}

                <td className="px-5 py-4 text-center">
                  <RequestStatusBadge
                    status={request.status}
                  />
                </td>

                {/* ========================================= */}
                {/* VIEW ONLY */}
                {/* ========================================= */}

                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onView(request)}
                      className="
                        h-9
                        rounded-lg
                        border-[#800000]/15
                        bg-white
                        px-3
                        text-[#800000]
                        shadow-sm
                        transition-all
                        duration-200
                        hover:border-[#800000]
                        hover:bg-[#800000]
                        hover:text-[#FFD700]
                      "
                    >
                      <Eye className="mr-1.5 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================================================= */}
      {/* EMPTY STATE */}
      {/* ================================================= */}

      {requests.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800000]/5 text-[#800000]/50">
            <ClipboardList className="h-7 w-7" />
          </div>

          <h3 className="text-base font-semibold text-gray-700">
            No requests available
          </h3>

          <p className="mt-1 max-w-sm text-sm text-gray-400">
            There are currently no borrowing requests in
            this section.
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* TABLE FOOTER */}
      {/* ================================================= */}

      {requests.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-600">
                {requests.length}
              </span>{" "}
              {requests.length === 1
                ? "request"
                : "requests"}
            </p>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

              <span className="text-[11px] font-medium text-gray-400">
                Live request data
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}