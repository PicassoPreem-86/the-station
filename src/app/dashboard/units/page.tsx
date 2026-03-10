"use client";

import { useState, useEffect, useCallback } from "react";
import { UNIT_TYPE_LABELS, UNIT_STATUS_LABELS, formatCurrency } from "@/lib/constants";
import type { UnitStatus, UnitType, Unit } from "@/types";
import { createClient } from "@/lib/supabase-browser";
import { demoUnits } from "@/lib/demo-data";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const statusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-800",
  occupied: "bg-blue-100 text-blue-800",
  maintenance: "bg-amber-100 text-amber-800",
  offline: "bg-red-100 text-red-800",
};

function UnitForm({
  unit,
  propertyId,
  onClose,
  onSaved,
}: {
  unit?: Unit;
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
      property_id: propertyId,
      unit_number: form.get("unit_number") as string,
      unit_type: form.get("unit_type") as string,
      square_feet: Number(form.get("square_feet")),
      floor: Number(form.get("floor")),
      rent_price: Number(form.get("rent_price")),
      bedrooms: Number(form.get("bedrooms")),
      bathrooms: Number(form.get("bathrooms")),
      status: form.get("status") as string,
    };

    const supabase = createClient();

    const { error: err } = unit
      ? await supabase.from("units").update(payload).eq("id", unit.id)
      : await supabase.from("units").insert(payload);

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      onSaved();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{unit ? "Edit Unit" : "Add Unit"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Unit #</label>
              <input name="unit_number" defaultValue={unit?.unit_number} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Floor</label>
              <input name="floor" type="number" defaultValue={unit?.floor ?? 1} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Type</label>
              <select name="unit_type" defaultValue={unit?.unit_type ?? "studio"} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                {Object.entries(UNIT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select name="status" defaultValue={unit?.status ?? "available"} className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                {Object.entries(UNIT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Sq Ft</label>
              <input name="square_feet" type="number" defaultValue={unit?.square_feet ?? 0} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Beds</label>
              <input name="bedrooms" type="number" defaultValue={unit?.bedrooms ?? 0} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Baths</label>
              <input name="bathrooms" type="number" step="0.5" defaultValue={unit?.bathrooms ?? 1} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Monthly Rent</label>
            <input name="rent_price" type="number" step="0.01" defaultValue={unit?.rent_price ?? 0} required className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-10 rounded-lg border border-zinc-300 px-4 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50">
              {loading ? "Saving..." : unit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>(demoUnits);
  const [statusFilter, setStatusFilter] = useState<UnitStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<UnitType | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editUnit, setEditUnit] = useState<Unit | undefined>();
  const [propertyId, setPropertyId] = useState<string>("");
  const [isLive, setIsLive] = useState(false);

  const fetchUnits = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: props } = await supabase.from("properties").select("id").limit(1).single();
      if (props) setPropertyId(props.id);

      const { data, error } = await supabase.from("units").select("*").order("unit_number");
      if (!error && data) {
        setUnits(data as Unit[]);
        setIsLive(true);
      }
    } catch {
      // Keep demo data
    }
  }, []);

  useEffect(() => { fetchUnits(); }, [fetchUnits]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this unit?")) return;
    const supabase = createClient();
    await supabase.from("units").delete().eq("id", id);
    fetchUnits();
  };

  const filtered = units
    .filter((u) => statusFilter === "all" || u.status === statusFilter)
    .filter((u) => typeFilter === "all" || u.unit_type === typeFilter)
    .sort((a, b) => a.unit_number.localeCompare(b.unit_number, undefined, { numeric: true }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Units</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {units.length} total units{!isLive && " (demo data)"}
          </p>
        </div>
        <button
          onClick={() => { setEditUnit(undefined); setShowForm(true); }}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          <Plus size={16} /> Add Unit
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as UnitStatus | "all")} className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as UnitType | "all")} className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <option value="all">All Types</option>
          {Object.entries(UNIT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Unit #</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Type</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Floor</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Sq Ft</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Bed / Bath</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Rent</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
                {isLive && <th className="px-6 py-3 text-right font-medium text-zinc-500">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((unit) => (
                <tr key={unit.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-medium">{unit.unit_number}</td>
                  <td className="px-6 py-4">{UNIT_TYPE_LABELS[unit.unit_type]}</td>
                  <td className="px-6 py-4">{unit.floor}</td>
                  <td className="px-6 py-4">{unit.square_feet.toLocaleString()}</td>
                  <td className="px-6 py-4">{unit.bedrooms} / {unit.bathrooms}</td>
                  <td className="px-6 py-4">{formatCurrency(unit.rent_price)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[unit.status]}`}>
                      {UNIT_STATUS_LABELS[unit.status]}
                    </span>
                  </td>
                  {isLive && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditUnit(unit); setShowForm(true); }} className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(unit.id)} className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={isLive ? 8 : 7} className="px-6 py-8 text-center text-zinc-400">No units found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-zinc-200 px-6 py-3 text-sm text-zinc-500 dark:border-zinc-800">
          Showing {filtered.length} of {units.length} units
        </div>
      </div>

      {showForm && (
        <UnitForm
          unit={editUnit}
          propertyId={propertyId}
          onClose={() => setShowForm(false)}
          onSaved={fetchUnits}
        />
      )}
    </div>
  );
}
