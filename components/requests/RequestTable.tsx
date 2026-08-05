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

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="text-left p-3">Student</th>

            <th className="text-left p-3">Activity</th>

            <th className="text-left p-3">Date</th>

            <th className="text-left p-3">Status</th>

            <th className="text-center p-3">View</th>

            <th className="text-center p-3">Actions</th>

          </tr>

        </thead>

        <tbody>

          {requests.map((request) => (

            <tr
              key={request._id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-3 font-medium">

                {request.studentName}

              </td>

              <td className="p-3">

                {request.activityTitle}

              </td>

              <td className="p-3">

                {request.date}

              </td>

              <td className="p-3">

                <RequestStatusBadge
                  status={request.status}
                />

              </td>

              <td className="p-3 text-center">

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(request)}
                >
                  View
                </Button>

              </td>

              <td className="p-3">

                <RequestActions
                  status={request.status}
                  onApprove={() => onApprove(request._id)}
                  onReject={() => onReject(request._id)}
                  onRelease={() => onRelease(request._id)}
                  onReturn={() => onReturn(request._id)}
                />

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}