import { getResidentDashboard } from "@/actions/resident";
import { formatCurrency, formatDate, PAYMENT_STATUS_LABELS, MAINTENANCE_STATUS_LABELS, MAINTENANCE_PRIORITY_LABELS } from "@/lib/constants";
import { CreditCard, Wrench, FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";

const paymentStatusColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
  partial: "bg-orange-100 text-orange-800",
};

const maintenanceStatusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  scheduled: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  closed: "bg-zinc-100 text-zinc-800",
};

const priorityColors: Record<string, string> = {
  emergency: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-zinc-100 text-zinc-800",
};

export default async function ResidentDashboard() {
  const { tenant, lease, recentPayments, openMaintenance, announcements } =
    await getResidentDashboard();

  const daysUntilExpiry = lease
    ? Math.ceil(
        (new Date(lease.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {tenant.first_name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Your resident dashboard</p>
      </div>

      {/* Lease & Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Lease Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
            <FileText size={16} />
            Active Lease
          </div>
          {lease ? (
            <>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                Unit {(lease as Record<string, unknown> & { units: { unit_number: string } }).units?.unit_number}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {formatCurrency(lease.monthly_rent)}/mo
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                {formatDate(lease.start_date)} — {formatDate(lease.end_date)}
              </p>
              {daysUntilExpiry !== null && daysUntilExpiry <= 0 ? (
                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertTriangle size={12} />
                  Lease expired
                </p>
              ) : daysUntilExpiry !== null && daysUntilExpiry < 90 ? (
                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-600">
                  <AlertTriangle size={12} />
                  Expires in {daysUntilExpiry} days
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">No active lease</p>
          )}
        </div>

        {/* Payments Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
            <CreditCard size={16} />
            Last Payment
          </div>
          {recentPayments.length > 0 ? (
            <>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {formatCurrency(recentPayments[0].amount)}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {formatDate(recentPayments[0].payment_date)}
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentStatusColors[recentPayments[0].status] ?? ""}`}
              >
                {PAYMENT_STATUS_LABELS[recentPayments[0].status] ?? recentPayments[0].status}
              </span>
            </>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">No payments yet</p>
          )}
        </div>

        {/* Maintenance Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
            <Wrench size={16} />
            Open Requests
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {openMaintenance.length}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {openMaintenance.length === 0
              ? "All clear"
              : `${openMaintenance.length} pending`}
          </p>
          <Link
            href="/resident/maintenance"
            className="mt-2 inline-flex text-xs font-medium text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
          >
            View all requests →
          </Link>
        </div>
      </div>

      {/* Open Maintenance Requests */}
      {openMaintenance.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold">Open Maintenance Requests</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {openMaintenance.map((req: Record<string, string>) => (
              <div key={req.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium">{req.category}</p>
                  <p className="text-xs text-zinc-500">{formatDate(req.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[req.priority] ?? ""}`}
                  >
                    {MAINTENANCE_PRIORITY_LABELS[req.priority] ?? req.priority}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${maintenanceStatusColors[req.status] ?? ""}`}
                  >
                    {MAINTENANCE_STATUS_LABELS[req.status] ?? req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Payments */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Recent Payments</h2>
          <Link
            href="/resident/payments"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Date</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Amount</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment: Record<string, string | number>) => (
                <tr
                  key={payment.id as string}
                  className="border-b border-zinc-100 dark:border-zinc-800/50"
                >
                  <td className="px-6 py-4 text-zinc-500">
                    {formatDate(payment.payment_date as string)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatCurrency(payment.amount as number)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentStatusColors[payment.status as string] ?? ""}`}
                    >
                      {PAYMENT_STATUS_LABELS[payment.status as string] ?? payment.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentPayments.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-zinc-400">
                    No payments recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold">Announcements</h2>
            <Link
              href="/resident/announcements"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {announcements.map((a: Record<string, string>) => (
              <div key={a.id} className="px-6 py-4">
                <h3 className="text-sm font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{a.body}</p>
                <p className="mt-2 text-xs text-zinc-400">
                  {formatDate(a.published_at)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
