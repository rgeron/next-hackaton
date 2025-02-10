"use client";

import { respondToInvite } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

export function TeamInvitations(props: {
  invites: Array<{
    team_id: number;
    team_name: string;
    role: string;
    invited_at: string;
  }>;
}) {
  const { invites } = props;
  const [isPending, startTransition] = useTransition();

  if (!invites?.length) {
    return null;
  }

  async function handleResponse(teamId: number, accept: boolean) {
    startTransition(async () => {
      const { error } = await respondToInvite(teamId, accept);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success(
        accept ? "Invitation accepted successfully" : "Invitation declined"
      );
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Team Invitations</h2>
      <div className="grid gap-4">
        {invites.map((invite) => (
          <div
            key={`${invite.team_id}-${invite.invited_at}`}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{invite.team_name}</h3>
              <p className="text-sm text-muted-foreground">
                Role: {invite.role}
              </p>
              <p className="text-sm text-muted-foreground">
                Invited: {new Date(invite.invited_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResponse(invite.team_id, false)}
                disabled={isPending}
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => handleResponse(invite.team_id, true)}
                disabled={isPending}
              >
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
