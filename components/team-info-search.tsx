"use client";

import { Team } from "@/lib/types/database.types";
import { Button } from "./ui/button";

export function TeamInfoSearch({ team }: { team: Team }) {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{team.name}</h2>
        <p className="mt-2 text-muted-foreground">{team.description}</p>
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

        <Button className="w-full">Ask to Join</Button>
      </div>
    </div>
  );
}
