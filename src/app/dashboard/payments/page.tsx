"use client";

import { useState, useEffect, useCallback } from "react";
import { PAYMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS, formatCurrency, formatDate } from "@/lib/constants";
import type { PaymentStatus, Tenant } from "@/types";
import { createClient } from "@/lib/supabase-browser";
import { demoPayments, demoTenants } from "@/lib/demo-data";
import { Search, Plus, X } from "lucide-react";

const statusColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
  partial: "bg-orange-100 text-orange-800",
};

function PaymentForm({ leases, propertyId, onClose, onSaved }: {
  leases: { id: string; tenant_id: string; tenantName: string; unitNum: string }[];
  propertyId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const leaseId = form.get("lease_id") as string;
    const lease = leases.find((l) => l.id === leaseId);
    const payload = {
      lease_id: leaseId,
      tenant_id: lease?.tenant_id ?? "",
      property_id: propertyId,
      amount: Number(form.get("amount")),
      status: form.get("status") as string,
      method: form.get("method") as string,
      payment_date: form.get("payment_date") as string,
      notes: (form.get("notes") as string) || null,
    };
    const supabase = createClient();
    const { error: err } = await supabase.from("payments").insert(payload);
    if (err) { setError(err.message); setLoading(false); }
    else { onSaved(); onClose(); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Record Payment</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
        </div>
        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Lease</label>
            <select name="lease_id" required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
              <option value="">Select lease</option>
              {leases.map((l) => <option key={l.id} value={l.id}>{l.tenantName} — Unit {l.unitNum}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm font-medium">Amount</label><input name="amount" type="number" step="0.01" required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" /></div>
            <div><label className="mb-1 block text-sm font-medium">Date</label><input name="payment_date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm font-medium">Method</label>
              <select name="method" defaultValue="ach" className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label className="mb-1 block text-sm font-medium">Status</label>
              <select name="status" defaultValue="paid" className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div><label className="mb-1 block text-sm font-medium">Notes</label><input name="notes" className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-10 rounded-lg border border-zinc-300 px-4 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700">Cancel</button>
            <button type="submit" disabled={loading} className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">{loading ? "Saving..." : "Record"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Record<string, unknown>[]>(
    demoPayments.map((p) => {
      const t = demoTenants.find((t) => t.id === p.tenant_id);
      return { ...p, tenants: t ? { first_name: t.first_name, last_name: t.last_name } : null };
    }),
  );
  const [leaseOptions, setLeaseOptions] = useState<{ id: string; tenant_id: string; tenantName: string; unitNum: string }[]>([]);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [propertyId, setPropertyId] = useState("");
  const [isLive, setIsLive] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: props } = await supabase.from("properties").select("id").limit(1).single();
      if (props) setPropertyId(props.id);
      const [pRes, lRes] = await Promise.all([
        supabase.from("payments").select("*, tenants(first_name, last_name)").order("payment_date", { ascending: false }),
        supabase.from("leases").select("id, tenant_id, tenants(first_name, last_name), units(unit_number)").eq("status", "active"),
      ]);
      if (!pRes.error && pRes.data) { setPayments(pRes.data); setIsLive(true); }
      if (!lRes.error && lRes.data) {
        setLeaseOptions(lRes.data.map((l: Record<string, unknown>) => {
          const t = l.tenants as { first_name: string; last_name: string } | null;
          const u = l.units as { unit_number: string } | null;
          return { id: l.id as string, tenant_id: l.tenant_id as string, tenantName: t ? `${t.first_name} ${t.last_name}` : "Unknown", unitNum: u?.unit_number ?? "?" };
        }));
      }
    } catch { /* demo */ }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = payments
    .filter((p) => statusFilter === "all" || p.status === statusFilter)
    .filter((p) => {
      if (!search) return true;
      const t = p.tenants as { first_name: string; last_name: string } | null;
      if (!t) return false;
      const q = search.toLowerCase();
      return t.first_name.toLowerCase().includes(q) || t.last_name.toLowerCase().includes(q);
    });

  const totalCollected = payments.filter((p) => p.status === "paid").reduce((s, p) => s + (p.amount as number), 0);
  const totalOverdue = payments.filter((p) => p.status === "overdue").reduce((s, p) => s + (p.amount as number), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-zinc-500">{payments.length} total payments{!isLive && " (demo data)"}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800">
          <Plus size={16} /> Record Payment
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500">Total Collected</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{formatCurrency(totalCollected)}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500">Overdue</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500">Total Transactions</p>
          <p className="mt-1 text-2xl font-bold">{payments.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="Search by tenant..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 rounded-lg border border-zinc-300 bg-white pl-9 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | "all")} className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <option value="all">All Statuses</option>
          {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Tenant</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Amount</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Method</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Date</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Notes</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => {
                const t = payment.tenants as { first_name: string; last_name: string } | null;
                return (
                  <tr key={payment.id as string} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/50">
                    <td className="px-6 py-4 font-medium">{t ? `${t.first_name} ${t.last_name}` : "Unknown"}</td>
                    <td className="px-6 py-4">{formatCurrency(payment.amount as number)}</td>
                    <td className="px-6 py-4">{PAYMENT_METHOD_LABELS[payment.method as string] ?? payment.method}</td>
                    <td className="px-6 py-4 text-zinc-500">{formatDate(payment.payment_date as string)}</td>
                    <td className="px-6 py-4 text-zinc-500">{(payment.notes as string) || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[payment.status as string] ?? ""}`}>{PAYMENT_STATUS_LABELS[payment.status as string] ?? payment.status}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-400">No payments found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="border-t border-zinc-200 px-6 py-3 text-sm text-zinc-500 dark:border-zinc-800">Showing {filtered.length} of {payments.length} payments</div>
      </div>

      {showForm && <PaymentForm leases={leaseOptions} propertyId={propertyId} onClose={() => setShowForm(false)} onSaved={fetchData} />}
    </div>
  );
}
