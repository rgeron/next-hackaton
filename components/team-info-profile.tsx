"use client";

import {
  deleteTeam,
  leaveTeam,
  TeamCreate,
  updateTeam,
} from "@/app/actions/team";
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

function EditTeamButton(props: {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}) {
  return props.isEditing ? (
    <Button onClick={props.onSave} variant="default">
      Save Changes
    </Button>
  ) : (
    <Button onClick={props.onEdit} variant="outline" size="sm">
      Edit Team
    </Button>
  );
}

function DeleteTeamButton(props: { onDelete: () => Promise<void> }) {
  return (
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
            This action cannot be undone. This will permanently delete your team
            and remove all members.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AddTeamMemberButton(props: {
  isAddingMember: boolean;
  setIsAddingMember: (value: boolean) => void;
  newMember: { name: string; role: string };
  setNewMember: (
    value:
      | { name: string; role: string }
      | ((prev: { name: string; role: string }) => {
          name: string;
          role: string;
        })
  ) => void;
  onAddMember: () => Promise<void>;
}) {
  return (
    <Dialog open={props.isAddingMember} onOpenChange={props.setIsAddingMember}>
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
              value={props.newMember.name}
              onChange={(e) =>
                props.setNewMember((prev) => ({
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
              value={props.newMember.role}
              onChange={(e) =>
                props.setNewMember((prev) => ({
                  ...prev,
                  role: e.target.value,
                }))
              }
              placeholder="e.g. Frontend Developer"
            />
          </div>
          <Button onClick={props.onAddMember} className="w-full">
            Add Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LeaveTeamButton(props: { onLeave: () => Promise<void> }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Leave Team
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove you from the team. You can always join
            another team or create your own later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.onLeave}>
            Leave Team
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function TeamInfo({
  team,
  isTeamCreator,
}: {
  team: Team;
  isTeamCreator: boolean;
}) {
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

  const handleLeaveTeam = async () => {
    if (!team?.id) {
      toast.error("Team ID not found");
      return;
    }

    const result = await leaveTeam(team.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("You have left the team");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-3 sm:p-4">
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="font-medium block">Name</span>
                <Input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <span className="font-medium block">Description</span>
                <Textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="h-full min-h-[120px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="font-medium block">Project Type</span>
                <select
                  value={editData.project_type}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      project_type: e.target
                        .value as TeamCreate["project_type"],
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="physical product">Physical Product</option>
                  <option value="website">Website</option>
                  <option value="mobile app">Mobile App</option>
                  <option value="software">Software</option>
                </select>
              </div>

              <div className="space-y-2">
                <span className="font-medium block">Looking for</span>
                <Input
                  value={editData.looking_for?.join(", ")}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      looking_for: e.target.value
                        .split(",")
                        .map((s) => s.trim()),
                    })
                  }
                  placeholder="Separate roles with commas"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <span className="font-medium block">Name</span>
                <p className="text-muted-foreground mt-2">{team.name}</p>
              </div>
              <div>
                <span className="font-medium block">Description</span>
                <p className="text-muted-foreground mt-2">{team.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-medium block">Project Type</span>
                <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mt-2">
                  {team.project_type}
                </span>
              </div>

              <div>
                <span className="font-medium block">Looking for</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {team.looking_for.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-0.5 bg-secondary rounded-md text-xs"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4">
        {isTeamCreator ? (
          <>
            <div className="flex flex-col sm:flex-row gap-2">
              <EditTeamButton
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleUpdateTeam}
              />
              <AddTeamMemberButton
                isAddingMember={isAddingMember}
                setIsAddingMember={setIsAddingMember}
                newMember={newMember}
                setNewMember={setNewMember}
                onAddMember={handleAddMember}
              />
            </div>
            <DeleteTeamButton onDelete={handleDeleteTeam} />
          </>
        ) : (
          <LeaveTeamButton onLeave={handleLeaveTeam} />
        )}
      </div>
    </div>
  );
}
