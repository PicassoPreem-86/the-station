"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getTenants() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("*, units(unit_number)")
    .order("last_name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createTenant(formData: FormData) {
  const supabase = await createClient();

  const unitId = formData.get("unit_id") as string;

  const { error } = await supabase.from("tenants").insert({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    status: formData.get("status") as string,
    unit_id: unitId || null,
    property_id: formData.get("property_id") as string,
    emergency_contact_name: (formData.get("emergency_contact_name") as string) || null,
    emergency_contact_phone: (formData.get("emergency_contact_phone") as string) || null,
    move_in_date: (formData.get("move_in_date") as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/tenants");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTenant(id: string, formData: FormData) {
  const supabase = await createClient();

  const unitId = formData.get("unit_id") as string;

  const { error } = await supabase
    .from("tenants")
    .update({
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      status: formData.get("status") as string,
      unit_id: unitId || null,
      emergency_contact_name: (formData.get("emergency_contact_name") as string) || null,
      emergency_contact_phone: (formData.get("emergency_contact_phone") as string) || null,
      move_in_date: (formData.get("move_in_date") as string) || null,
      move_out_date: (formData.get("move_out_date") as string) || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/tenants");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTenant(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tenants").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/tenants");
  revalidatePath("/dashboard");
  return { success: true };
}
