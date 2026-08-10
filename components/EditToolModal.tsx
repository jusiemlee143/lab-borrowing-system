"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Tool {
  _id: string;
  name: string;
  quantity: number;
}

interface Props {
  open: boolean;
  tool: Tool | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditToolModal({
  open,
  tool,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tool) {
      setName(tool.name);
      setQuantity(tool.quantity);
    }
  }, [tool]);

  if (!open || !tool) return null;

  async function handleSave() {
      if (!tool) return;
    try {
      setSaving(true);

      const res = await fetch(`/api/lab-in-charge/tools/${tool._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Unable to update tool.");
        return;
      }

      toast.success("Tool updated successfully!");

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const status =
    quantity <= 0
      ? "Unavailable"
      : quantity < 5
      ? "Low Stock"
      : "Available";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-[#800000]">
            Edit Tool
          </h2>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tool Name
            </label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Quantity
            </label>

            <Input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>

            <div
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                status === "Available"
                  ? "bg-green-100 text-green-700"
                  : status === "Low Stock"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#800000] hover:bg-[#660000] text-[#FFD700]"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}