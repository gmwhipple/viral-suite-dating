"use client";

import { useState } from "react";
import type { ActivityLogEntry } from "@/lib/firebase/types";
import { formatDate } from "@/lib/utils";

export function ActivityDebugPanel({ activity }: { activity: ActivityLogEntry[] }) {
  const [expanded, setExpanded] = useState(false);

  if (activity.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-semibold text-gray-700">Activity log (debug)</span>
        <span className="text-xs text-gray-500">{expanded ? "Hide" : "Show"} · {activity.length} events</span>
      </button>

      {expanded && (
        <div className="mt-3 max-h-64 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-2 pr-4">Time</th>
                <th className="pb-2 pr-4">Action</th>
                <th className="pb-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100">
                  <td className="py-2 pr-4 whitespace-nowrap text-gray-500">{formatDate(entry.createdAt)}</td>
                  <td className="py-2 pr-4 font-mono text-gray-800">{entry.action}</td>
                  <td className="py-2 font-mono text-gray-600 truncate max-w-xs">
                    {entry.metadata ? JSON.stringify(entry.metadata) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
