import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ResidentSidebar } from "@/components/resident-sidebar";

export default async function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/resident/login");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!tenant) {
    // User is authenticated but not a tenant — sign them out and send to resident login
    await supabase.auth.signOut();
    redirect("/resident/login?error=This account is not linked to a resident profile");
  }

  const tenantName = `${tenant.first_name} ${tenant.last_name}`;

  return (
    <div className="min-h-screen">
      <ResidentSidebar tenantName={tenantName} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
