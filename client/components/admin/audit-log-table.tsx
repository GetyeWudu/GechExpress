import { Badge } from "@/components/ui/badge";
import { ShieldAlert, LogIn, Edit, Trash2, Key, Settings } from "lucide-react";

interface AuditLogTableProps {
  limit?: number;
}

const LOGS = [
  { id: "LOG-001", action: "Seller Account Suspended", entity: "Seller (SEL-104)", user: "Super Admin", time: "2 hours ago", type: "critical" },
  { id: "LOG-002", action: "Global Settings Updated", entity: "Payment Gateway", user: "Super Admin", time: "5 hours ago", type: "warning" },
  { id: "LOG-003", action: "Admin Login", entity: "System", user: "Admin (John)", time: "1 day ago", type: "info" },
  { id: "LOG-004", action: "Commission Rate Changed", entity: "Platform", user: "Super Admin", time: "2 days ago", type: "warning" },
  { id: "LOG-005", action: "Product Catalog Exported", entity: "Products", user: "Admin (Sarah)", time: "3 days ago", type: "info" },
  { id: "LOG-006", action: "Customer Account Deleted", entity: "Customer (CUS-804)", user: "Super Admin", time: "1 week ago", type: "critical" },
];

export function AuditLogTable({ limit }: AuditLogTableProps) {
  const displayLogs = limit ? LOGS.slice(0, limit) : LOGS;

  const getIcon = (type: string, action: string) => {
    if (type === "critical") return <ShieldAlert className="h-4 w-4" />;
    if (action.includes("Login")) return <LogIn className="h-4 w-4" />;
    if (action.includes("Updated") || action.includes("Changed")) return <Edit className="h-4 w-4" />;
    if (action.includes("Deleted")) return <Trash2 className="h-4 w-4" />;
    if (action.includes("Exported")) return <Settings className="h-4 w-4" />;
    return <Key className="h-4 w-4" />;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 overflow-hidden">
      {!limit && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 gap-4 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white text-lg">System Audit Logs</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Security trail of administrative actions across the platform.</p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 dark:bg-slate-950 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Target Entity</th>
              <th className="px-6 py-4 font-medium">Performed By</th>
              <th className="px-6 py-4 font-medium text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {displayLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                      log.type === "critical" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" :
                      log.type === "warning" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {getIcon(log.type, log.action)}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{log.action}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{log.entity}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0">
                    {log.user}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-right">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
