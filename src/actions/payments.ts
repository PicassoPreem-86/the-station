"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getPayments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*, tenants(first_name, last_name)")
    .order("payment_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPayment(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("payments").insert({
    lease_id: formData.get("lease_id") as string,
    tenant_id: formData.get("tenant_id") as string,
    property_id: formData.get("property_id") as string,
    amount: Number(formData.get("amount")),
    status: formData.get("status") as string,
    method: formData.get("method") as string,
    payment_date: formData.get("payment_date") as string,
    notes: (formData.get("notes") as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePayment(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("payments")
    .update({
      amount: Number(formData.get("amount")),
      status: formData.get("status") as string,
      method: formData.get("method") as string,
      payment_date: formData.get("payment_date") as string,
      notes: (formData.get("notes") as string) || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard");
  return { success: true };
}
