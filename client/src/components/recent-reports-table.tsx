import React, { useState } from "react";
import { Badge } from "./Badge";

export default function RecentReportsTable({ reports }) {
  const [search, setSearch] = useState("");

  console.log("Reports received:", reports); // ✅ Debug check

  // Fallback: if no reports passed
  if (!reports || reports.length === 0) {
    return <div className="text-gray-500">No reports available.</div>;
  }

  // Null-safe filtering
  const filteredReports = search
    ? reports.filter((r) => {
        const query = search.toLowerCase();
        return (
          r.incomingPartNumber?.toLowerCase().includes(query) ||
          r.incomingSerialNumber?.toLowerCase().includes(query) ||
          r.outgoingPartNumber?.toLowerCase().includes(query) ||
          r.outgoingSerialNumber?.toLowerCase().includes(query) ||
          r.reasonForShopVisit?.toLowerCase().includes(query) ||
          r.shopExitReason?.toLowerCase().includes(query) ||
          r.findings?.toLowerCase().includes(query) ||
          r.actionsTaken?.toLowerCase().includes(query) ||
          r.otherDetails?.toLowerCase().includes(query)
        );
      })
    : reports;

  // Mapping exit reasons → badge colors
  const exitReasonColors: Record<string, "green" | "red" | "yellow" | "blue" | "gray"> = {
    "repair-completed": "green",
    "maintenance-completed": "green",
    "inspection-completed": "green",
    "no-defect-found": "blue",
    "awaiting-parts": "yellow",
    "beyond-repair": "red",
  };

  return (
    <div>
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
      </div>

      {/* Reports table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incoming Part</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incoming Serial</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outgoing Part</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outgoing Serial</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason for Visit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exit Reason</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Findings</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Other Details</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PDF</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <tr key={report.id}>
              <td className="px-6 py-4 text-sm">{report.incomingPartNumber ?? "N/A"}</td>
              <td className="px-6 py-4 text-sm">{report.incomingSerialNumber ?? "N/A"}</td>
              <td className="px-6 py-4 text-sm">{report.outgoingPartNumber ?? "N/A"}</td>
              <td className="px-6 py-4 text-sm">{report.outgoingSerialNumber ?? "N/A"}</td>
              <td className="px-6 py-4 text-sm">
                {report.reasonForShopVisit ? (
                  <Badge color="blue">{report.reasonForShopVisit}</Badge>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-6 py-4 text-sm">
                {report.shopExitReason ? (
                  <Badge color={exitReasonColors[report.shopExitReason] ?? "gray"}>
                    {report.shopExitReason}
                  </Badge>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-6 py-4 text-sm">{report.findings ?? "N/A"}</td>
              <td className="px-6 py-4 text-sm">{report.actionsTaken ?? "N/A"}</td>
              <td className="px-6 py-4 text-sm">{report.otherDetails ?? "N/A"}</td>
              <td className="px-6 py-4 text-sm">
                <a
                  href={`/api/reports/${report.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
