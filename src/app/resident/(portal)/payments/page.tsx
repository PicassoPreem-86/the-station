import { getResidentPayments } from "@/actions/resident";
import { formatCurrency, formatDate, PAYMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/constants";

const statusColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
  partial: "bg-orange-100 text-orange-800",
};

export default async function ResidentPaymentsPage() {
  const payments = await getResidentPayments();

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum: number, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-zinc-500">Your payment history</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500">Total Paid</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500">Total Payments</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{payments.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500">Overdue</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {payments.filter((p) => p.status === "overdue").length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Date</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Amount</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Method</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Notes</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/50"
                >
                  <td className="px-6 py-4 text-zinc-500">{formatDate(payment.payment_date)}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4">{PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[payment.status] ?? ""}`}>
                      {PAYMENT_STATUS_LABELS[payment.status] ?? payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{payment.notes ?? "—"}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-400">
                    No payments recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
