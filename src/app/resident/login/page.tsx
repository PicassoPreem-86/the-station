import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { Building2 } from "lucide-react";

export default async function ResidentLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  // If already authenticated as a tenant, redirect to resident dashboard
  if (!params.error) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: tenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .single();
      if (tenant) redirect("/resident");
    }
  }

  async function loginAction(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      redirect(`/resident/login?error=${encodeURIComponent(error.message)}`);
    }

    // Verify this user is a tenant
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: tenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (!tenant) {
        await supabase.auth.signOut();
        redirect("/resident/login?error=This account is not linked to a resident profile");
      }
    }

    redirect("/resident");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
            <Building2 size={24} className="text-white dark:text-zinc-900" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">The Station</h1>
          <p className="text-sm text-zinc-500">Resident Portal</p>
        </div>

        <form action={loginAction} className="space-y-4">
          {params.error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {params.error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="flex h-10 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
