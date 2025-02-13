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
    <div className="p-4 space-y-4 border-2 rounded-md">
      <div>
        <h2 className="text-lg font-semibold">Team: {team.name}</h2>
        <p className="mt-1 text-base font-semibold text-muted-foreground">
          Project: {team.description}
        </p>
      </div>

      <div className="space-y-4">
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
          <span className="ml-2">
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
