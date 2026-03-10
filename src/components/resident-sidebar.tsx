"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  CreditCard,
  Wrench,
  Megaphone,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { residentLogout } from "@/actions/auth";

const navItems = [
  { href: "/resident", label: "Home", icon: Home },
  { href: "/resident/payments", label: "Payments", icon: CreditCard },
  { href: "/resident/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/resident/announcements", label: "Announcements", icon: Megaphone },
];

export function ResidentSidebar({ tenantName }: { tenantName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-zinc-900 p-2 text-white lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 text-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
          <Building2 size={24} className="text-white" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">The Station</span>
            <span className="text-xs text-zinc-400">{tenantName}</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/resident" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 px-3 py-4">
          <form action={residentLogout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
