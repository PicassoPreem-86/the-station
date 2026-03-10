"use server";

import { createClient } from "@/lib/supabase-server";

export async function getProperties() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPropertyWithStats(propertyId: string) {
  const supabase = await createClient();

  const [propertyRes, unitsRes] = await Promise.all([
    supabase.from("properties").select("*").eq("id", propertyId).single(),
    supabase.from("units").select("id, status").eq("property_id", propertyId),
  ]);

  if (propertyRes.error) throw propertyRes.error;
  if (unitsRes.error) throw unitsRes.error;

  const units = unitsRes.data;
  return {
    property: propertyRes.data,
    stats: {
      total: units.length,
      occupied: units.filter((u) => u.status === "occupied").length,
      available: units.filter((u) => u.status === "available").length,
      maintenance: units.filter((u) => u.status === "maintenance").length,
    },
  };
}
