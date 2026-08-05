"use client";

import { Button } from "@/components/ui/button";
import RequestStatusBadge from "./RequestStatusBadge";
import RequestActions from "./RequestActions";

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

  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRelease: (id: string) => void;
  onReturn: (id: string) => void;
}

export default function RequestTable({
  requests,
  onView,
  onApprove,
  onReject,
  onRelease,
  onReturn,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">

      <table className="w-full text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Student</th>
            <th className="p-3 text-left">Section</th>
            <th className="p-3 text-left">Activity</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>

          {requests.map((request) => (

            <tr
              key={request._id}
              className="border-t hover:bg-gray-50 transition-colors"
            >

              <td className="p-3 font-medium">
                {request.studentName}
              </td>

              <td className="p-3">
                {request.section || "-"}
              </td>

              <td className="p-3">
                {request.activityTitle}
              </td>

              <td className="p-3">
                {request.date}
              </td>

              <td className="p-3 text-center">
                <RequestStatusBadge
                  status={request.status}
                />
              </td>

              <td className="p-3">
                <div className="flex justify-end items-center gap-2 flex-wrap">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(request)}
                  >
                    View
                  </Button>

                  <RequestActions
                    status={request.status}
                    onApprove={() => onApprove(request._id)}
                    onReject={() => onReject(request._id)}
                    onRelease={() => onRelease(request._id)}
                    onReturn={() => onReturn(request._id)}
                  />

                </div>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}