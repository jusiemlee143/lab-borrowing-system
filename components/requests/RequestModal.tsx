"use client";

import { Button } from "@/components/ui/button";
import { Request } from "./RequestTable";
import RequestActions from "./RequestActions";

interface Props {
  open: boolean;
  request: Request | null;

  onClose: () => void;

  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRelease: (id: string) => void;
  onReturn: (id: string) => void;
}

export default function RequestModal({
  open,
  request,
  onClose,
  onApprove,
  onReject,
  onRelease,
  onReturn,
}: Props) {
  if (!open || !request) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="p-6">

          <h2 className="text-2xl font-bold text-[#800000] mb-6">
            Borrow Request Details
          </h2>

          {/* Student Information */}

          <div className="grid md:grid-cols-2 gap-4 mb-6">

            <div>
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-semibold">{request.studentName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Section</p>
              <p>{request.section || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Group Number</p>
              <p>{request.groupNumber || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p>{request.date}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Instructor</p>
              <p>{request.instructor || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Activity</p>
              <p>{request.activityTitle}</p>
            </div>

          </div>

          {/* Members */}

          <div className="mb-6">

            <h3 className="font-semibold text-[#800000] mb-2">
              Group Members
            </h3>

            {request.members?.length ? (
              <ul className="list-disc list-inside space-y-1">
                {request.members.map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No members listed.</p>
            )}

          </div>

          {/* Requested Items */}

          <div className="mb-6">

            <h3 className="font-semibold text-[#800000] mb-2">
              Requested Tools
            </h3>

            <div className="rounded-lg border overflow-hidden">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>
                    <th className="text-left p-3">Tool</th>
                    <th className="text-center p-3">Quantity</th>
                  </tr>

                </thead>

                <tbody>

                  {request.cart?.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t"
                    >
                      <td className="p-3">{item.name}</td>
                      <td className="text-center p-3">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* Footer */}

          <div className="flex flex-wrap gap-3 justify-between items-center">

            <RequestActions
              status={request.status}
              onApprove={() => onApprove(request._id)}
              onReject={() => onReject(request._id)}
              onRelease={() => onRelease(request._id)}
              onReturn={() => onReturn(request._id)}
            />

            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>

          </div>

        </div>

      </div>

    </div>
  );
}