"use client";

import { Team } from "@/lib/types/database.types";
import { Button } from "./ui/button";

export function TeamInfoSearch({
  team,
  hasTeam,
}: {
  team: Team;
  hasTeam: boolean;
}) {
  return (
    <div className="p-6 space-y-4 border-2 rounded-md">
      <div>
        <h2 className="text-lg font-semibold">Team: {team.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Project: {team.description}</p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div>
          <span className="font-medium">Project Type:</span>
          <span className="ml-2">{team.project_type}</span>
        </div>

        <div>
          <span className="font-medium">Looking for:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {team.looking_for.map((role) => (
              <span
                key={role}
                className="px-2 py-1 bg-secondary rounded-md text-sm"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="font-medium">Team Size:</span>
          <span className="ml-2">{team.members.length} members</span>
        </div>

        {!hasTeam && <Button className="w-full">Ask to Join</Button>}
      </div>
    </div>
  );
}
