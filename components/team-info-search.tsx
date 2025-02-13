"use client";

import { applyToTeam } from "@/app/actions/interaction";
import { Team } from "@/lib/types/database.types";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

export function TeamInfoSearch({
  team,
  hasTeam,
}: {
  team: Team;
  hasTeam: boolean;
}) {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const { error } = await applyToTeam({
        team_id: team.id,
        message,
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Application sent successfully!");
      setIsOpen(false);
      setMessage("");
    } catch (e) {
      console.error("Application error:", e);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">{team.name}</h2>
        <p className="text-sm text-muted-foreground">{team.description}</p>
      </div>

      <div className="space-y-5">
        <div>
          <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            {team.project_type}
          </span>
        </div>

        <div>
          <span className="text-sm font-medium text-muted-foreground mb-2 block">
            Looking for
          </span>
          <div className="flex flex-wrap gap-2">
            {team.looking_for.map((role) => (
              <span
                key={role}
                className="px-2.5 py-1 bg-secondary/50 rounded-full text-xs font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center text-sm">
          <span className="text-muted-foreground">Team Size:</span>
          <span className="ml-2 font-medium">
            {team.members.length} / {team.max_members} members
          </span>
        </div>

        {!hasTeam && team.members.length < team.max_members && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Ask to Join</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join {team.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Textarea
                  placeholder="Tell us why you'd like to join this team..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!message.trim() || isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Application"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
