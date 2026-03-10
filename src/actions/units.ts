"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getUnits() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .order("unit_number", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createUnit(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("units").insert({
    property_id: formData.get("property_id") as string,
    unit_number: formData.get("unit_number") as string,
    unit_type: formData.get("unit_type") as string,
    square_feet: Number(formData.get("square_feet")),
    floor: Number(formData.get("floor")),
    rent_price: Number(formData.get("rent_price")),
    bedrooms: Number(formData.get("bedrooms")),
    bathrooms: Number(formData.get("bathrooms")),
    status: formData.get("status") as string,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/units");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateUnit(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("units")
    .update({
      unit_number: formData.get("unit_number") as string,
      unit_type: formData.get("unit_type") as string,
      square_feet: Number(formData.get("square_feet")),
      floor: Number(formData.get("floor")),
      rent_price: Number(formData.get("rent_price")),
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      status: formData.get("status") as string,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/units");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteUnit(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("units").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/units");
  revalidatePath("/dashboard");
  return { success: true };
}
