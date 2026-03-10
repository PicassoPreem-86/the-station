"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function getResidentContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/resident/login");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*, units(unit_number, unit_type, floor, square_feet, rent_price), properties(name, address, city, state, zip)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!tenant) redirect("/resident/login");

  return tenant;
}

export async function getResidentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/resident/login");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, first_name, last_name, unit_id, property_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!tenant) redirect("/resident/login");

  const [leaseRes, paymentsRes, maintenanceRes, announcementsRes] = await Promise.all([
    supabase
      .from("leases")
      .select("*, units(unit_number)")
      .eq("tenant_id", tenant.id)
      .in("status", ["active", "expiring_soon"])
      .order("start_date", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("payments")
      .select("*")
      .eq("tenant_id", tenant.id)
      .order("payment_date", { ascending: false })
      .limit(5),
    supabase
      .from("maintenance_requests")
      .select("id, category, status, priority, created_at")
      .eq("tenant_id", tenant.id)
      .in("status", ["submitted", "in_progress", "scheduled"])
      .order("created_at", { ascending: false }),
    supabase
      .from("announcements")
      .select("id, title, body, published_at")
      .eq("property_id", tenant.property_id)
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  return {
    tenant,
    lease: leaseRes.data,
    recentPayments: paymentsRes.data ?? [],
    openMaintenance: maintenanceRes.data ?? [],
    announcements: announcementsRes.data ?? [],
  };
}

export async function getResidentPayments() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/resident/login");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!tenant) redirect("/resident/login");

  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("payment_date", { ascending: false });

  return data ?? [];
}

export async function getResidentMaintenanceRequests() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/resident/login");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!tenant) redirect("/resident/login");

  const { data } = await supabase
    .from("maintenance_requests")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  return { requests: data ?? [], tenantId: tenant.id };
}

export async function submitMaintenanceRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/resident/login");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, unit_id, property_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!tenant) redirect("/resident/login");

  const { error } = await supabase.from("maintenance_requests").insert({
    tenant_id: tenant.id,
    unit_id: tenant.unit_id,
    property_id: tenant.property_id,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    priority: "medium",
    status: "submitted",
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/resident/maintenance");
}

export async function getResidentAnnouncements() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/resident/login");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("property_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!tenant) redirect("/resident/login");

  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("property_id", tenant.property_id)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  return data ?? [];
}
