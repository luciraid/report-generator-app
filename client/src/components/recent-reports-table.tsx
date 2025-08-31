import React, { useState } from "react";
import { Badge } from "./Badge";

export default function RecentReportsTable({ reports }) {
  const [search, setSearch] = useState("");

  // ✅ Always ensure reports is an array
  const safeReports = Array.isArray(reports) ? reports : [];

  // ✅ Search filter
  const filteredReports = search
    ? safeReports.filter((r) => {
        const query = search.toLowerCase();
        return (
          r.incomingPartNumber?.toLowerCase().includes(query) ||
          r.incomingSerialNumber?.toLowerCase().includes(query) ||
          r.outgoingPartNumber?.toLowerCase().includes(query) ||
          r.outgoingSerialNumber?.toLowerCase().includes(query) ||
          r.reasonForShopVisit?.toLowerCase().includes(query) ||
          r.shopExitReason?.toLowerCase().includes(query) ||
          r.findings?.toLowerCase().includes(query) ||
          r.actionsTaken?.toLowerCase().includes(query)
        );
      })
    : safeReports;

  // ✅ Badge colors
  const reasonColors: Record<string, string> = {
    "scheduled-maintenance": "blue",
    "unscheduled-repair": "yellow",
    inspection: "gray",
    overhaul: "purple",
    modification: "indigo",
    testing: "cyan",
  };

  const exitColors: Record<string, string> = {
    "repair-completed": "green",
    "maintenance-completed": "green",
    "inspection-completed": "green",
    "no-defect-found": "blue",
    "awaiting-parts": "yellow",
    "beyond-repair": "red",
  };

  return (
    <div>
      {/* 🔍 Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
      </div>

      {/* 📋 Reports Table */}
      <table className="min-w-full divide-y divide-gray-200 border rounded">
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PDF</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 text-sm">{report.incomingPartNumber ?? "N/A"}</td>
                <td className="px-6 py-4 text-sm">{report.incomingSerialNumber ?? "N/A"}</td>
                <td className="px-6 py-4 text-sm">{report.outgoingPartNumber ?? "N/A"}</td>
                <td className="px-6 py-4 text-sm">{report.outgoingSerialNumber ?? "N/A"}</td>
                <td className="px-6 py-4 text-sm">
                  {report.reasonForShopVisit ? (
                    <Badge color={reasonColors[report.reasonForShopVisit] ?? "gray"}>
                      {report.reasonForShopVisit.replace(/-/g, " ")}
                    </Badge>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {report.shopExitReason ? (
                    <Badge color={exitColors[report.shopExitReason] ?? "gray"}>
                      {report.shopExitReason.replace(/-/g, " ")}
                    </Badge>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4 text-sm">{report.findings ?? "N/A"}</td>
                <td className="px-6 py-4 text-sm">{report.actionsTaken ?? "N/A"}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center text-gray-500 py-4">
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
