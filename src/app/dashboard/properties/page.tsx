"use client";

import { useState, useEffect, useCallback } from "react";
import { Building2, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { demoProperty, demoUnits } from "@/lib/demo-data";
import type { Property } from "@/types";

export default function PropertiesPage() {
  const [property, setProperty] = useState<Property>(demoProperty);
  const [stats, setStats] = useState({ total: demoUnits.length, occupied: demoUnits.filter((u) => u.status === "occupied").length, available: demoUnits.filter((u) => u.status === "available").length });
  const [isLive, setIsLive] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: prop } = await supabase.from("properties").select("*").limit(1).single();
      if (!prop) return;
      setProperty(prop as Property);

      const { data: units } = await supabase.from("units").select("id, status").eq("property_id", prop.id);
      if (units) {
        setStats({
          total: units.length,
          occupied: units.filter((u) => u.status === "occupied").length,
          available: units.filter((u) => u.status === "available").length,
        });
      }
      setIsLive(true);
    } catch { /* demo */ }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const occupancyRate = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage your properties{!isLive && " (demo data)"}</p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
          Add Property
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Building2 size={24} className="text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{property.name}</h2>
              <div className="mt-1 flex items-center gap-1 text-sm text-zinc-500">
                <MapPin size={14} />
                {property.address}, {property.city}, {property.state} {property.zip}
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Total Units</p>
              <p className="mt-1 text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Occupied</p>
              <p className="mt-1 text-2xl font-bold">{stats.occupied}</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Available</p>
              <p className="mt-1 text-2xl font-bold">{stats.available}</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Occupancy</p>
              <p className="mt-1 text-2xl font-bold">{occupancyRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
