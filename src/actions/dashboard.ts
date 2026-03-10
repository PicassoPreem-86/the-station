"use server";

import { createClient } from "@/lib/supabase-server";

export async function getDashboardStats() {
  const supabase = await createClient();

  const [unitsRes, tenantsRes, leasesRes, paymentsRes] = await Promise.all([
    supabase.from("units").select("id, status, rent_price"),
    supabase.from("tenants").select("id, status"),
    supabase.from("leases").select("id, status, monthly_rent"),
    supabase
      .from("payments")
      .select("id, amount, status, payment_date, method, tenant_id, tenants(first_name, last_name)")
      .order("payment_date", { ascending: false })
      .limit(10),
  ]);

  const units = unitsRes.data ?? [];
  const tenants = tenantsRes.data ?? [];
  const leases = leasesRes.data ?? [];
  const payments = paymentsRes.data ?? [];

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const occupiedUnits = units.filter((u) => u.status === "occupied").length;
  const totalUnits = units.length;
  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const monthlyRent = leases
    .filter((l) => l.status === "active" || l.status === "expiring_soon")
    .reduce((sum, l) => sum + l.monthly_rent, 0);
  const collectedThisMonth = payments
    .filter((p) => p.payment_date.startsWith(currentMonth) && p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const overdueCount = payments.filter((p) => p.status === "overdue").length;
  const expiringLeases = leases.filter((l) => l.status === "expiring_soon").length;
  const availableUnits = units.filter((u) => u.status === "available").length;

  return {
    occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
    occupiedUnits,
    totalUnits,
    activeTenants,
    totalTenants: tenants.length,
    monthlyRent,
    collectedThisMonth,
    overdueCount,
    expiringLeases,
    availableUnits,
    recentPayments: payments.slice(0, 5),
    currentMonth,
  };
}
