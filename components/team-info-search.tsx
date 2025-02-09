"use client";

import { Team } from "@/lib/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function TeamInfoSearch({ team }: { team: Team }) {
  const [hasTeam, setHasTeam] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserTeam = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("users")
          .select("has_team")
          .eq("id", user.id)
          .single();

        setHasTeam(!!data?.has_team);
      }
      setIsLoading(false);
    };

    checkUserTeam();
  }, []);

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

        {!hasTeam && (
          <Button className="w-full" disabled={isLoading}>
            Ask to Join
          </Button>
        )}
      </div>
    </div>
  );
}
