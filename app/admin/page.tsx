
import Link from "next/link";

const stats = [
  { label: "Products", value: "—", href: "/admin/products" },
  { label: "Categories", value: "—", href: "/admin/categories" },
  { label: "New enquiries", value: "—", href: "/admin/enquiries" },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">
        Overview
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Store activity and management summary.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border bg-card p-5 hover:border-primary"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Statistics will appear when the backend is connected.
            </p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg font-bold uppercase">
        Latest enquiries
      </h2>

      <ul className="mt-3 divide-y border bg-card">
        <li className="p-4 text-sm text-muted-foreground">
          Enquiries will appear here when the backend is connected.
        </li>
      </ul>
    </div>
  );
}
