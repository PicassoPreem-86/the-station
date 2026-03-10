"use client";

import { useState, useEffect, useCallback } from "react";
import { TENANT_STATUS_LABELS, formatDate } from "@/lib/constants";
import type { TenantStatus, Tenant, Unit } from "@/types";
import { createClient } from "@/lib/supabase-browser";
import { demoTenants, demoUnits } from "@/lib/demo-data";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  applicant: "bg-blue-100 text-blue-800",
  approved: "bg-amber-100 text-amber-800",
  notice_given: "bg-orange-100 text-orange-800",
  moved_out: "bg-zinc-100 text-zinc-600",
};

function TenantForm({
  tenant,
  units,
  propertyId,
  onClose,
  onSaved,
}: {
  tenant?: Tenant;
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
    const unitId = form.get("unit_id") as string;
    const payload = {
      first_name: form.get("first_name") as string,
      last_name: form.get("last_name") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      status: form.get("status") as string,
      unit_id: unitId || null,
      property_id: propertyId,
      emergency_contact_name: (form.get("emergency_contact_name") as string) || null,
      emergency_contact_phone: (form.get("emergency_contact_phone") as string) || null,
      move_in_date: (form.get("move_in_date") as string) || null,
    };

    const supabase = createClient();
    const { error: err } = tenant
      ? await supabase.from("tenants").update(payload).eq("id", tenant.id)
      : await supabase.from("tenants").insert(payload);

    if (err) { setError(err.message); setLoading(false); }
    else { onSaved(); onClose(); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{tenant ? "Edit Tenant" : "Add Tenant"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
        </div>
        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">First Name</label>
              <input name="first_name" defaultValue={tenant?.first_name} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Last Name</label>
              <input name="last_name" defaultValue={tenant?.last_name} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input name="email" type="email" defaultValue={tenant?.email} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input name="phone" defaultValue={tenant?.phone} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select name="status" defaultValue={tenant?.status ?? "applicant"} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                {Object.entries(TENANT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Unit</label>
              <select name="unit_id" defaultValue={tenant?.unit_id ?? ""} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                <option value="">No unit</option>
                {units.map((u) => <option key={u.id} value={u.id}>#{u.unit_number}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Move-in Date</label>
              <input name="move_in_date" type="date" defaultValue={tenant?.move_in_date ?? ""} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Emergency Name</label>
              <input name="emergency_contact_name" defaultValue={tenant?.emergency_contact_name ?? ""} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Emergency Phone</label>
              <input name="emergency_contact_phone" defaultValue={tenant?.emergency_contact_phone ?? ""} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-10 rounded-lg border border-zinc-300 px-4 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700">Cancel</button>
            <button type="submit" disabled={loading} className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50">{loading ? "Saving..." : tenant ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<(Tenant & { units?: { unit_number: string } | null })[]>(demoTenants);
  const [units, setUnits] = useState<Unit[]>(demoUnits);
  const [statusFilter, setStatusFilter] = useState<TenantStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTenant, setEditTenant] = useState<Tenant | undefined>();
  const [propertyId, setPropertyId] = useState("");
  const [isLive, setIsLive] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: props } = await supabase.from("properties").select("id").limit(1).single();
      if (props) setPropertyId(props.id);

      const [tenantsRes, unitsRes] = await Promise.all([
        supabase.from("tenants").select("*, units(unit_number)").order("last_name"),
        supabase.from("units").select("*").order("unit_number"),
      ]);

      if (!tenantsRes.error && tenantsRes.data) { setTenants(tenantsRes.data); setIsLive(true); }
      if (!unitsRes.error && unitsRes.data) setUnits(unitsRes.data as Unit[]);
    } catch { /* keep demo */ }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tenant?")) return;
    const supabase = createClient();
    await supabase.from("tenants").delete().eq("id", id);
    fetchData();
  };

  const filtered = tenants
    .filter((t) => statusFilter === "all" || t.status === statusFilter)
    .filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return t.first_name.toLowerCase().includes(q) || t.last_name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q);
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tenants</h1>
          <p className="mt-1 text-sm text-zinc-500">{tenants.length} total tenants{!isLive && " (demo data)"}</p>
        </div>
        <button onClick={() => { setEditTenant(undefined); setShowForm(true); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
          <Plus size={16} /> Add Tenant
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="Search tenants..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 rounded-lg border border-zinc-300 bg-white pl-9 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TenantStatus | "all")} className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <option value="all">All Statuses</option>
          {Object.entries(TENANT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Name</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Email</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Phone</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Unit</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Move-in</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
                {isLive && <th className="px-6 py-3 text-right font-medium text-zinc-500">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tenant) => {
                const unitNum = isLive
                  ? (tenant.units as { unit_number: string } | null)?.unit_number
                  : demoUnits.find((u) => u.id === tenant.unit_id)?.unit_number;
                return (
                  <tr key={tenant.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/50">
                    <td className="px-6 py-4 font-medium">{tenant.first_name} {tenant.last_name}</td>
                    <td className="px-6 py-4 text-zinc-500">{tenant.email}</td>
                    <td className="px-6 py-4 text-zinc-500">{tenant.phone}</td>
                    <td className="px-6 py-4">{unitNum ? `#${unitNum}` : "—"}</td>
                    <td className="px-6 py-4 text-zinc-500">{tenant.move_in_date ? formatDate(tenant.move_in_date) : "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[tenant.status]}`}>{TENANT_STATUS_LABELS[tenant.status]}</span>
                    </td>
                    {isLive && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => { setEditTenant(tenant as Tenant); setShowForm(true); }} className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(tenant.id)} className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={isLive ? 7 : 6} className="px-6 py-8 text-center text-zinc-400">No tenants found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="border-t border-zinc-200 px-6 py-3 text-sm text-zinc-500 dark:border-zinc-800">
          Showing {filtered.length} of {tenants.length} tenants
        </div>
      </div>

      {showForm && <TenantForm tenant={editTenant} units={units} propertyId={propertyId} onClose={() => setShowForm(false)} onSaved={fetchData} />}
    </div>
  );
}
