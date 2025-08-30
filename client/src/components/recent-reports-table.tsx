import React from "react";

interface Report {
  id: number;
  dateOfManufacture?: string | null;
  incomingPartNumber?: string | null;
  incomingSerialNumber?: string | null;
  outgoingPartNumber?: string | null;
  outgoingSerialNumber?: string | null;
  modificationStatus?: string | null;
  reasonForShopVisit?: string | null;
  shopExitReason?: string | null;
  findings?: string | null;
  actionsTaken?: string | null;
  createdAt?: string | null;
}

interface Props {
  reports: Report[];
}

export default function RecentReportsTable({ reports }: Props) {
  const formatEnum = (val?: string | null) => {
    if (!val) return "N/A";
    return val.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const safeText = (val?: string | null) =>
    val && val.trim() !== "" ? val : "N/A";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DMF</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incoming Part</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outgoing Part</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modification</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Reason</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit Reason</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Findings</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reports.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                No reports found
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{report.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{safeText(report.dateOfManufacture)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{safeText(report.incomingPartNumber)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{safeText(report.outgoingPartNumber)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatEnum(report.modificationStatus)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatEnum(report.reasonForShopVisit)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatEnum(report.shopExitReason)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{safeText(report.findings)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{safeText(report.actionsTaken)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
