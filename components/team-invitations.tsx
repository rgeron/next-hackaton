"use client";

import { respondToInteraction } from "@/app/actions/interaction";
import { Button } from "@/components/ui/button";
import { Interaction } from "@/lib/types/database.types";
import { useTransition } from "react";
import { toast } from "sonner";

type InteractionWithDetails = Interaction & {
  team: {
    name: string;
    members: Array<{ role: string }>;
  };
  sender: {
    full_name: string;
  };
};

export function TeamInvitations(props: { invites: InteractionWithDetails[] }) {
  const { invites } = props;
  const [isPending, startTransition] = useTransition();

  if (!invites?.length) {
    return null;
  }

  async function handleResponse(interactionId: number, accept: boolean) {
    startTransition(async () => {
      const { error } = await respondToInteraction(interactionId, accept);
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
            key={invite.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{invite.team.name}</h3>
              <p className="text-sm text-muted-foreground">
                From: {invite.sender.full_name}
              </p>
              {invite.message && (
                <p className="text-sm text-muted-foreground mt-2">
                  Message: {invite.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Invited: {new Date(invite.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResponse(invite.id, false)}
                disabled={isPending}
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => handleResponse(invite.id, true)}
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
