"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getLeases() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leases")
    .select("*, tenants(first_name, last_name), units(unit_number)")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createLease(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("leases").insert({
    unit_id: formData.get("unit_id") as string,
    tenant_id: formData.get("tenant_id") as string,
    property_id: formData.get("property_id") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    monthly_rent: Number(formData.get("monthly_rent")),
    deposit: Number(formData.get("deposit")),
    status: formData.get("status") as string,
    terms: (formData.get("terms") as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/leases");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateLease(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("leases")
    .update({
      unit_id: formData.get("unit_id") as string,
      tenant_id: formData.get("tenant_id") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      monthly_rent: Number(formData.get("monthly_rent")),
      deposit: Number(formData.get("deposit")),
      status: formData.get("status") as string,
      terms: (formData.get("terms") as string) || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/leases");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteLease(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leases").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/leases");
  revalidatePath("/dashboard");
  return { success: true };
}
