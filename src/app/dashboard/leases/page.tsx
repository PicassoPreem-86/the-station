"use client";

import { useState, useEffect, useCallback } from "react";
import { LEASE_STATUS_LABELS, formatCurrency, formatDate } from "@/lib/constants";
import type { LeaseStatus, Tenant, Unit } from "@/types";
import { createClient } from "@/lib/supabase-browser";
import { demoLeases, demoTenants, demoUnits } from "@/lib/demo-data";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const statusColors: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-600",
  active: "bg-emerald-100 text-emerald-800",
  expiring_soon: "bg-amber-100 text-amber-800",
  expired: "bg-red-100 text-red-800",
  renewed: "bg-blue-100 text-blue-800",
};

function LeaseForm({ lease, tenants, units, propertyId, onClose, onSaved }: {
  lease?: Record<string, unknown>;
  tenants: Tenant[];
  units: Unit[];
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
    const payload = {
      unit_id: form.get("unit_id") as string,
      tenant_id: form.get("tenant_id") as string,
      property_id: propertyId,
      start_date: form.get("start_date") as string,
      end_date: form.get("end_date") as string,
      monthly_rent: Number(form.get("monthly_rent")),
      deposit: Number(form.get("deposit")),
      status: form.get("status") as string,
    };
    const supabase = createClient();
    const { error: err } = lease
      ? await supabase.from("leases").update(payload).eq("id", lease.id as string)
      : await supabase.from("leases").insert(payload);
    if (err) { setError(err.message); setLoading(false); }
    else { onSaved(); onClose(); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{lease ? "Edit Lease" : "Create Lease"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
        </div>
        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Tenant</label>
              <select name="tenant_id" defaultValue={(lease?.tenant_id as string) ?? ""} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                <option value="">Select tenant</option>
                {tenants.map((t) => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Unit</label>
              <select name="unit_id" defaultValue={(lease?.unit_id as string) ?? ""} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                <option value="">Select unit</option>
                {units.map((u) => <option key={u.id} value={u.id}>#{u.unit_number}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm font-medium">Start Date</label><input name="start_date" type="date" defaultValue={(lease?.start_date as string) ?? ""} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" /></div>
            <div><label className="mb-1 block text-sm font-medium">End Date</label><input name="end_date" type="date" defaultValue={(lease?.end_date as string) ?? ""} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="mb-1 block text-sm font-medium">Monthly Rent</label><input name="monthly_rent" type="number" step="0.01" defaultValue={(lease?.monthly_rent as number) ?? ""} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" /></div>
            <div><label className="mb-1 block text-sm font-medium">Deposit</label><input name="deposit" type="number" step="0.01" defaultValue={(lease?.deposit as number) ?? 0} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" /></div>
            <div><label className="mb-1 block text-sm font-medium">Status</label>
              <select name="status" defaultValue={(lease?.status as string) ?? "draft"} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                {Object.entries(LEASE_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-10 rounded-lg border border-zinc-300 px-4 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700">Cancel</button>
            <button type="submit" disabled={loading} className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">{loading ? "Saving..." : lease ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LeasesPage() {
  const [leases, setLeases] = useState<Record<string, unknown>[]>(demoLeases.map((l) => ({ ...l, tenants: null, units: null })));
  const [tenants, setTenants] = useState<Tenant[]>(demoTenants);
  const [units, setUnits] = useState<Unit[]>(demoUnits);
  const [statusFilter, setStatusFilter] = useState<LeaseStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editLease, setEditLease] = useState<Record<string, unknown> | undefined>();
  const [propertyId, setPropertyId] = useState("");
  const [isLive, setIsLive] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: props } = await supabase.from("properties").select("id").limit(1).single();
      if (props) setPropertyId(props.id);
      const [lRes, tRes, uRes] = await Promise.all([
        supabase.from("leases").select("*, tenants(first_name, last_name), units(unit_number)").order("start_date", { ascending: false }),
        supabase.from("tenants").select("*").order("last_name"),
        supabase.from("units").select("*").order("unit_number"),
      ]);
      if (!lRes.error && lRes.data) { setLeases(lRes.data); setIsLive(true); }
      if (!tRes.error && tRes.data) setTenants(tRes.data as Tenant[]);
      if (!uRes.error && uRes.data) setUnits(uRes.data as Unit[]);
    } catch { /* demo */ }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lease?")) return;
    const supabase = createClient();
    await supabase.from("leases").delete().eq("id", id);
    fetchData();
  };

  const filtered = leases
    .filter((l) => statusFilter === "all" || l.status === statusFilter)
    .sort((a, b) => (b.start_date as string).localeCompare(a.start_date as string));

  function getTenantName(lease: Record<string, unknown>): string {
    if (isLive) {
      const t = lease.tenants as { first_name: string; last_name: string } | null;
      return t ? `${t.first_name} ${t.last_name}` : "Unknown";
    }
    const t = demoTenants.find((t) => t.id === lease.tenant_id);
    return t ? `${t.first_name} ${t.last_name}` : "Unknown";
  }

  function getUnitNum(lease: Record<string, unknown>): string {
    if (isLive) {
      const u = lease.units as { unit_number: string } | null;
      return u ? `#${u.unit_number}` : "—";
    }
    const u = demoUnits.find((u) => u.id === lease.unit_id);
    return u ? `#${u.unit_number}` : "—";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leases</h1>
          <p className="mt-1 text-sm text-zinc-500">{leases.length} total leases{!isLive && " (demo data)"}</p>
        </div>
        <button onClick={() => { setEditLease(undefined); setShowForm(true); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800">
          <Plus size={16} /> Create Lease
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as LeaseStatus | "all")} className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <option value="all">All Statuses</option>
          {Object.entries(LEASE_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Tenant</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Unit</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Start</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">End</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Monthly Rent</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Deposit</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
                {isLive && <th className="px-6 py-3 text-right font-medium text-zinc-500">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lease) => (
                <tr key={lease.id as string} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-medium">{getTenantName(lease)}</td>
                  <td className="px-6 py-4">{getUnitNum(lease)}</td>
                  <td className="px-6 py-4 text-zinc-500">{formatDate(lease.start_date as string)}</td>
                  <td className="px-6 py-4 text-zinc-500">{formatDate(lease.end_date as string)}</td>
                  <td className="px-6 py-4">{formatCurrency(lease.monthly_rent as number)}</td>
                  <td className="px-6 py-4 text-zinc-500">{formatCurrency(lease.deposit as number)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[lease.status as string] ?? ""}`}>{LEASE_STATUS_LABELS[lease.status as string] ?? lease.status}</span>
                  </td>
                  {isLive && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditLease(lease); setShowForm(true); }} className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(lease.id as string)} className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={isLive ? 8 : 7} className="px-6 py-8 text-center text-zinc-400">No leases found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="border-t border-zinc-200 px-6 py-3 text-sm text-zinc-500 dark:border-zinc-800">Showing {filtered.length} of {leases.length} leases</div>
      </div>

      {showForm && <LeaseForm lease={editLease} tenants={tenants} units={units} propertyId={propertyId} onClose={() => setShowForm(false)} onSaved={fetchData} />}
    </div>
  );
}
