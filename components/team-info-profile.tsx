"use client";

import { Team } from "@/lib/types/database.types";
import { toast } from "sonner";
import { Button } from "./ui/button";

export function TeamInfo({ team }: { team: Team }) {
  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/invite/${team.id}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Team</h2>
        <Button onClick={copyInviteLink} variant="outline" size="sm">
          Copy Invite Link
        </Button>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div>
          <span className="font-medium">Name:</span>
          <span className="ml-2">{team.name}</span>
        </div>

        <div>
          <span className="font-medium">Description:</span>
          <p className="mt-1 text-muted-foreground">{team.description}</p>
        </div>

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
          <span className="font-medium">Team Members:</span>
          <div className="mt-2 space-y-2">
            {team.members.map((member) => (
              <div
                key={member.user_id}
                className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
              >
                <div className="flex items-center gap-2">
                  <span>{member.role}</span>
                  {team.creator_id === member.user_id && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Creator
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  Joined {new Date(member.joined_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {team.pending_invites.length > 0 && (
          <div>
            <span className="font-medium">Pending Invites:</span>
            <div className="mt-2 space-y-2">
              {team.pending_invites.map((invite) => (
                <div
                  key={invite.email}
                  className="flex items-center justify-between p-2 rounded-md bg-secondary/50"
                >
                  <span>{invite.email}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{invite.role}</span>
                    <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
