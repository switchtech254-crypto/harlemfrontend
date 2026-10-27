
"use client";

import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

type TeamRole = "staff" | "admin";

type TeamMember = {
  id: string;
  email: string;
  role: TeamRole;
};

export default function TeamAdminPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("staff");
  const [busy, setBusy] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Enter a team member's email.");
      return;
    }

    if (team.some((member) => member.email === normalizedEmail)) {
      toast.error("This email is already on the list.");
      return;
    }

    setBusy(true);

    setTeam((current) => [
      ...current,
      {
        id: `${Date.now()}-${normalizedEmail}`,
        email: normalizedEmail,
        role,
      },
    ]);

    setEmail("");
    setRole("staff");
    setBusy(false);

    toast.info(
      "Member added to the local list only. Backend access management is not connected.",
    );
  }

  function removeMember(member: TeamMember) {
    if (!window.confirm(`Remove ${member.email} from this list?`)) {
      return;
    }

    setTeam((current) =>
      current.filter((item) => item.id !== member.id),
    );

    toast.info(
      "Member removed from the local list. No real account permissions were changed.",
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold uppercase">
        Team
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Manage staff and administrator roles for the store.
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        Staff can manage products, categories, enquiries, and the homepage.
        Admins can also manage the team. Actual permissions will be implemented
        when the backend is connected.
      </p>

      <form
        onSubmit={submit}
        className="mt-5 flex flex-wrap gap-2"
      >
        <Input
          className="max-w-xs bg-card"
          type="email"
          required
          placeholder="team.member@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <select
          aria-label="Role"
          className="border bg-card px-3 text-sm"
          value={role}
          onChange={(event) =>
            setRole(event.target.value as TeamRole)
          }
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <Button type="submit" disabled={busy}>
          Add to team
        </Button>
      </form>

      <ul className="mt-6 divide-y border bg-card">
        {team.map((member) => (
          <li
            key={member.id}
            className="flex items-center justify-between gap-3 p-4 text-sm"
          >
            <span className="min-w-0 break-all">{member.email}</span>

            <span className="flex shrink-0 items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {member.role}
              </span>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={`Remove ${member.email}`}
                onClick={() => removeMember(member)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </span>
          </li>
        ))}

        {team.length === 0 && (
          <li className="p-4 text-sm text-muted-foreground">
            No team members have been added in this session. Connect the
            backend to load and manage real team accounts.
          </li>
        )}
      </ul>
    </div>
  );
}
