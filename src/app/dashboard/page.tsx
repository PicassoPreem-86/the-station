import { getDashboardStats } from "@/actions/dashboard";
import { formatCurrency, formatDate, PAYMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { demoUnits, demoTenants, demoLeases, demoPayments } from "@/lib/demo-data";

const statusColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
  partial: "bg-orange-100 text-orange-800",
};

async function getStats() {
  try {
    return await getDashboardStats();
  } catch {
    // Fallback to demo data
    const occupiedUnits = demoUnits.filter((u) => u.status === "occupied").length;
    const totalUnits = demoUnits.length;
    return {
      occupancyRate: Math.round((occupiedUnits / totalUnits) * 100),
      occupiedUnits,
      totalUnits,
      activeTenants: demoTenants.filter((t) => t.status === "active").length,
      totalTenants: demoTenants.length,
      monthlyRent: demoLeases
        .filter((l) => l.status === "active" || l.status === "expiring_soon")
        .reduce((sum, l) => sum + l.monthly_rent, 0),
      collectedThisMonth: demoPayments
        .filter((p) => p.payment_date.startsWith("2026-03") && p.status === "paid")
        .reduce((sum, p) => sum + p.amount, 0),
      overdueCount: demoPayments.filter((p) => p.status === "overdue").length,
      expiringLeases: demoLeases.filter((l) => l.status === "expiring_soon").length,
      availableUnits: demoUnits.filter((u) => u.status === "available").length,
      recentPayments: demoPayments
        .sort((a, b) => b.payment_date.localeCompare(a.payment_date))
        .slice(0, 5)
        .map((p) => {
          const t = demoTenants.find((t) => t.id === p.tenant_id);
          return { ...p, tenants: t ? { first_name: t.first_name, last_name: t.last_name } : null };
        }),
      currentMonth: "2026-03",
    };
  }
}

export default async function DashboardPage() {
  const data = await getStats();

  const stats = [
    { label: "Occupancy Rate", value: `${data.occupancyRate}%`, sub: `${data.occupiedUnits} of ${data.totalUnits} units` },
    { label: "Monthly Revenue", value: formatCurrency(data.monthlyRent), sub: "Active leases" },
    { label: "Collected This Month", value: formatCurrency(data.collectedThisMonth), sub: `${data.overdueCount} overdue` },
    { label: "Active Tenants", value: String(data.activeTenants), sub: `${data.totalTenants} total` },
    { label: "Available Units", value: String(data.availableUnits), sub: "Ready to lease" },
    { label: "Expiring Leases", value: String(data.expiringLeases), sub: "Need renewal" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          The Station at East Orange — Overview
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
            <p className="mt-1 text-sm text-zinc-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Recent Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Tenant</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Amount</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Method</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Date</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentPayments.map((payment: Record<string, unknown>) => {
                const tenants = payment.tenants as { first_name: string; last_name: string } | null;
                return (
                  <tr
                    key={payment.id as string}
                    className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {tenants ? `${tenants.first_name} ${tenants.last_name}` : "Unknown"}
                    </td>
                    <td className="px-6 py-4">{formatCurrency(payment.amount as number)}</td>
                    <td className="px-6 py-4">{PAYMENT_METHOD_LABELS[payment.method as string] ?? payment.method}</td>
                    <td className="px-6 py-4 text-zinc-500">{formatDate(payment.payment_date as string)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[payment.status as string] ?? ""}`}>
                        {PAYMENT_STATUS_LABELS[payment.status as string] ?? payment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {data.recentPayments.length === 0 && (
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
