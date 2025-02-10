"use client";

import { inviteToTeam } from "@/app/actions/team";
import { isTeamCreator } from "@/app/actions/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/types/database.types";
import { GithubIcon, LinkedinIcon, PhoneIcon, SchoolIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function ProfileCard(props: { user: User }) {
  const router = useRouter();
  const { user } = props;
  const [isPending, startTransition] = useTransition();
  const [creatorTeamId, setCreatorTeamId] = useState<number | null>(null);

  useEffect(() => {
    async function checkCreatorStatus() {
      try {
        const teamId = await isTeamCreator();
        setCreatorTeamId(teamId);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to check team creator status"
        );
      }
    }
    checkCreatorStatus();
  }, []);

  async function handleInvite() {
    if (!creatorTeamId) {
      return;
    }

    startTransition(async () => {
      const { error } = await inviteToTeam(user.id, creatorTeamId);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Invitation sent successfully");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarFallback>{user.full_name?.slice(0, 2) || "??"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle>{user.full_name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        {!user.has_team && creatorTeamId && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleInvite}
            disabled={isPending}
          >
            {isPending ? "Inviting..." : "Invite to Team"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {user.bio && (
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {user.skills?.map((skill: string) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <SchoolIcon className="h-4 w-4" />
              <span>{user.school}</span>
            </div>

            {user.phone_number && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <span>{user.phone_number}</span>
              </div>
            )}

            <div className="flex gap-4">
              {user.links?.github && (
                <a
                  href={user.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {user.links?.linkedin && (
                <a
                  href={user.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
