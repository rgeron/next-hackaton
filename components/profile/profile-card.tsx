"use client";

import { inviteToTeam } from "@/app/actions/interaction";
import { isTeamCreator } from "@/app/actions/user";
import { ProfileSkills } from "@/components/profile/profile-skills";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

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
    if (!creatorTeamId || !message.trim()) {
      return;
    }

    startTransition(async () => {
      const { error } = await inviteToTeam({
        team_id: creatorTeamId,
        message,
        receiver_id: user.id,
      });

      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Invitation sent successfully");
      setIsOpen(false);
      setMessage("");
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {user.bio && (
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          )}

          <ProfileSkills skillIds={user.skills || []} />

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
              {!user.team_id && creatorTeamId && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Invite to Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center">
                    <DialogHeader>
                      <DialogTitle>
                        Invite {user.full_name} to Your Team
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4 w-full">
                      <Textarea
                        placeholder="Add a message to your invitation..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Button
                        className="w-full"
                        onClick={handleInvite}
                        disabled={!message.trim() || isPending}
                      >
                        {isPending ? "Sending..." : "Send Invitation"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
