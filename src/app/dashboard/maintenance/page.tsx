"use client";

import { useState, useEffect, useCallback } from "react";
import { MAINTENANCE_STATUS_LABELS, MAINTENANCE_PRIORITY_LABELS, MAINTENANCE_CATEGORIES, formatDate } from "@/lib/constants";
import type { MaintenanceStatus, MaintenancePriority, Tenant, Unit } from "@/types";
import { createClient } from "@/lib/supabase-browser";
import { demoMaintenanceRequests, demoTenants, demoUnits } from "@/lib/demo-data";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";

const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  scheduled: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  closed: "bg-zinc-100 text-zinc-600",
};

const priorityColors: Record<string, string> = {
  emergency: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-zinc-100 text-zinc-600",
};

function MaintenanceForm({ request, tenants, units, propertyId, onClose, onSaved }: {
  request?: Record<string, unknown>;
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
      category: form.get("category") as string,
      description: form.get("description") as string,
      priority: form.get("priority") as string,
      status: form.get("status") as string,
      internal_notes: (form.get("internal_notes") as string) || null,
    };
    const supabase = createClient();
    const { error: err } = request
      ? await supabase.from("maintenance_requests").update(payload).eq("id", request.id as string)
      : await supabase.from("maintenance_requests").insert(payload);
    if (err) { setError(err.message); setLoading(false); }
    else { onSaved(); onClose(); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{request ? "Edit Request" : "New Request"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
        </div>
        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Unit</label>
              <select name="unit_id" defaultValue={(request?.unit_id as string) ?? ""} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                <option value="">Select unit</option>
                {units.map((u) => <option key={u.id} value={u.id}>#{u.unit_number}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tenant</label>
              <select name="tenant_id" defaultValue={(request?.tenant_id as string) ?? ""} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                <option value="">Select tenant</option>
                {tenants.map((t) => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select name="category" defaultValue={(request?.category as string) ?? ""} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                <option value="">Select</option>
                {MAINTENANCE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Priority</label>
              <select name="priority" defaultValue={(request?.priority as string) ?? "medium"} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                {Object.entries(MAINTENANCE_PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select name="status" defaultValue={(request?.status as string) ?? "submitted"} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                {Object.entries(MAINTENANCE_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea name="description" defaultValue={(request?.description as string) ?? ""} required rows={3} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Internal Notes</label>
            <input name="internal_notes" defaultValue={(request?.internal_notes as string) ?? ""} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-10 rounded-lg border border-zinc-300 px-4 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700">Cancel</button>
            <button type="submit" disabled={loading} className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">{loading ? "Saving..." : request ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  const [requests, setRequests] = useState<Record<string, unknown>[]>(
    demoMaintenanceRequests.map((r) => {
      const t = demoTenants.find((t) => t.id === r.tenant_id);
      const u = demoUnits.find((u) => u.id === r.unit_id);
      return { ...r, tenants: t ? { first_name: t.first_name, last_name: t.last_name } : null, units: u ? { unit_number: u.unit_number } : null };
    }),
  );
  const [tenants, setTenants] = useState<Tenant[]>(demoTenants);
  const [units, setUnits] = useState<Unit[]>(demoUnits);
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<MaintenancePriority | "all">("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editRequest, setEditRequest] = useState<Record<string, unknown> | undefined>();
  const [propertyId, setPropertyId] = useState("");
  const [isLive, setIsLive] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: props } = await supabase.from("properties").select("id").limit(1).single();
      if (props) setPropertyId(props.id);
      const [mRes, tRes, uRes] = await Promise.all([
        supabase.from("maintenance_requests").select("*, tenants(first_name, last_name), units(unit_number)").order("created_at", { ascending: false }),
        supabase.from("tenants").select("*").order("last_name"),
        supabase.from("units").select("*").order("unit_number"),
      ]);
      if (!mRes.error && mRes.data) { setRequests(mRes.data); setIsLive(true); }
      if (!tRes.error && tRes.data) setTenants(tRes.data as Tenant[]);
      if (!uRes.error && uRes.data) setUnits(uRes.data as Unit[]);
    } catch { /* demo */ }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this maintenance request?")) return;
    const supabase = createClient();
    await supabase.from("maintenance_requests").delete().eq("id", id);
    fetchData();
  };

  const filtered = requests
    .filter((r) => statusFilter === "all" || r.status === statusFilter)
    .filter((r) => priorityFilter === "all" || r.priority === priorityFilter)
    .filter((r) => {
      if (!search) return true;
      const q = search.toLowerCase();
      const t = r.tenants as { first_name: string; last_name: string } | null;
      const u = r.units as { unit_number: string } | null;
      const desc = (r.description as string) || "";
      const cat = (r.category as string) || "";
      return (
        (t && (t.first_name.toLowerCase().includes(q) || t.last_name.toLowerCase().includes(q))) ||
        (u && u.unit_number.toLowerCase().includes(q)) ||
        desc.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q)
      );
    });

  const openCount = requests.filter((r) => r.status === "submitted" || r.status === "in_progress").length;
  const emergencyCount = requests.filter((r) => r.priority === "emergency" && r.status !== "completed" && r.status !== "closed").length;

  function getTenantName(req: Record<string, unknown>): string {
    if (isLive) {
      const t = req.tenants as { first_name: string; last_name: string } | null;
      return t ? `${t.first_name} ${t.last_name}` : "Unknown";
    }
    const t = demoTenants.find((t) => t.id === req.tenant_id);
    return t ? `${t.first_name} ${t.last_name}` : "Unknown";
  }

  function getUnitNum(req: Record<string, unknown>): string {
    if (isLive) {
      const u = req.units as { unit_number: string } | null;
      return u ? `#${u.unit_number}` : "—";
    }
    const u = demoUnits.find((u) => u.id === req.unit_id);
    return u ? `#${u.unit_number}` : "—";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
          <p className="mt-1 text-sm text-zinc-500">{requests.length} total requests{!isLive && " (demo data)"}</p>
        </div>
        <button onClick={() => { setEditRequest(undefined); setShowForm(true); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800">
          <Plus size={16} /> New Request
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500">Open Requests</p>
          <p className="mt-1 text-2xl font-bold">{openCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500">Emergency</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{emergencyCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500">Total Requests</p>
          <p className="mt-1 text-2xl font-bold">{requests.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 rounded-lg border border-zinc-300 bg-white pl-9 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as MaintenanceStatus | "all")} className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <option value="all">All Statuses</option>
          {Object.entries(MAINTENANCE_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as MaintenancePriority | "all")} className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <option value="all">All Priorities</option>
          {Object.entries(MAINTENANCE_PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Unit</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Tenant</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Category</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Description</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Priority</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Submitted</th>
                {isLive && <th className="px-6 py-3 text-right font-medium text-zinc-500">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req.id as string} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-medium">{getUnitNum(req)}</td>
                  <td className="px-6 py-4">{getTenantName(req)}</td>
                  <td className="px-6 py-4">{req.category as string}</td>
                  <td className="max-w-[250px] truncate px-6 py-4 text-zinc-500">{req.description as string}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[req.priority as string] ?? ""}`}>{MAINTENANCE_PRIORITY_LABELS[req.priority as string] ?? req.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[req.status as string] ?? ""}`}>{MAINTENANCE_STATUS_LABELS[req.status as string] ?? req.status}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{formatDate(req.created_at as string)}</td>
                  {isLive && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditRequest(req); setShowForm(true); }} className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(req.id as string)} className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={isLive ? 8 : 7} className="px-6 py-8 text-center text-zinc-400">No maintenance requests found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="border-t border-zinc-200 px-6 py-3 text-sm text-zinc-500 dark:border-zinc-800">Showing {filtered.length} of {requests.length} requests</div>
      </div>

      {showForm && <MaintenanceForm request={editRequest} tenants={tenants} units={units} propertyId={propertyId} onClose={() => setShowForm(false)} onSaved={fetchData} />}
    </div>
  );
}
