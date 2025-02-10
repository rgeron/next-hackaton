"use client";

import { deleteTeam, TeamCreate, updateTeam } from "@/app/actions/team";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Team } from "@/lib/types/database.types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function TeamInfo({ team }: { team: Team }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", role: "" });
  const [editData, setEditData] = useState<Partial<TeamCreate>>({
    name: team.name || "",
    description: team.description || "",
    project_type: team.project_type as TeamCreate["project_type"],
    looking_for: team.looking_for || [],
  });
  const isTeamCreator =
    team.creator_id ===
    team.members.find((m) => m.user_id === team.creator_id)?.user_id;

  const handleDeleteTeam = async () => {
    if (!team?.id) {
      toast.error("Team ID not found");
      return;
    }

    const result = await deleteTeam(team.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Team deleted successfully");
    router.refresh();
  };

  const handleUpdateTeam = async () => {
    if (!team?.id) return;
    const result = await updateTeam(team.id.toString(), editData);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Team updated successfully");
    setIsEditing(false);
    router.refresh();
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role) {
      toast.error("Please fill all fields");
      return;
    }

    const memberData = {
      role: newMember.role,
      name: newMember.name,
      joined_at: new Date().toISOString(),
      is_registered: false,
    };

    const result = await updateTeam(team.id.toString(), {
      members: [...team.members, memberData],
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Member added successfully");
    setIsAddingMember(false);
    setNewMember({ name: "", role: "" });
    router.refresh();
  };

  return (
    <div className="space-y-4 border-2 rounded-lg p-4">
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-semibold mb-4">Your Team</h2>
        {isTeamCreator && (
          <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Member's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={newMember.role}
                    onChange={(e) =>
                      setNewMember((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                <Button onClick={handleAddMember} className="w-full">
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <span className="font-medium">Name:</span>
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <span className="font-medium">Description:</span>
              <Textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <span className="font-medium">Project Type:</span>
              <select
                value={editData.project_type}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    project_type: e.target.value as TeamCreate["project_type"],
                  })
                }
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="physical product">Physical Product</option>
                <option value="website">Website</option>
                <option value="mobile app">Mobile App</option>
                <option value="software">Software</option>
              </select>
            </div>

            <div>
              <span className="font-medium">Looking for:</span>
              <Input
                value={editData.looking_for?.join(", ")}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    looking_for: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                placeholder="Separate roles with commas"
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {isTeamCreator && (
        <div className="flex justify-between items-center pt-4">
          {isEditing ? (
            <Button onClick={handleUpdateTeam} variant="default">
              Save Changes
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              Edit Team
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Team
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your team and remove all members.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTeam}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
