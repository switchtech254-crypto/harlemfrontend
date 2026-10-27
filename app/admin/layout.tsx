
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderTree,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products & prices", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/homepage", label: "Deals & homepage", icon: Home },
  { to: "/admin/team", label: "Team", icon: Users, adminOnly: true },
] as const;

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();

  // Temporary UI-only role until the Python backend provides permissions.
  const isAdmin = true;
  const userEmail = "Admin access not connected";

  function signOut() {
    // Authentication will be connected to the Python backend later.
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-secondary md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b bg-primary text-primary-foreground md:min-h-screen md:border-b-0">
        <div className="p-5">
          <Link href="/" className="font-script text-3xl">
            Harlem Store
          </Link>
          <p className="text-[11px] uppercase tracking-widest opacity-80">
            Store management
          </p>
        </div>

        <nav
          aria-label="Admin navigation"
          className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible"
        >
          {nav
            .filter((item) => !("adminOnly" in item) || isAdmin)
            .map((item) => {
              const active =
                ("exact" in item && item.exact)
                    ? pathname === item.to
                    : pathname === item.to ||
                    pathname.startsWith(`${item.to}/`);

              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  href={item.to}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 px-3 py-2 text-sm hover:bg-primary-foreground/10 hover:opacity-100 ${
                    active
                      ? "bg-primary-foreground/15 font-semibold opacity-100"
                      : "opacity-85"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="hidden p-5 text-xs md:block">
          <p className="truncate opacity-80">{userEmail}</p>
          <p className="opacity-60">{isAdmin ? "Admin" : "Staff"}</p>
          <button
            onClick={signOut}
            className="mt-3 flex items-center gap-2 underline"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 p-5 md:p-8">
        <div className="mb-4 flex justify-end md:hidden">
          <Button size="sm" variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>

        {children}
      </main>
    </div>
  );
}
