"use server";

import { createClient } from "@/utils/supabase/server";

export type TeamCreate = {
  name: string;
  description: string;
  looking_for?: string[];
  project_type: "physical product" | "website" | "mobile app" | "software";
  max_members: number;
  members?: {
    role: string;
    user_id?: string;
    name: string;
    joined_at: string;
    is_registered: boolean;
  }[];
};

export type TeamInvite = {
  user_id: string;
  role: string;
  invited_at: string;
};

export async function getUserTeam() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user's team - check both creator_id and membership
  const { data: teams, error } = await supabase
    .from("teams")
    .select("*")
    .or(`creator_id.eq.${user.id},members.cs.{"user_id":"${user.id}"}`);

  if (error) throw new Error(error.message);
  return teams?.[0] || null;
}

export async function createTeam(teamData: TeamCreate) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Start a transaction
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert([
      {
        ...teamData,
        creator_id: user.id,
        members: [
          {
            user_id: user.id,
            name: "", // Will be populated from user profile
            role: "Project Lead",
            joined_at: new Date().toISOString(),
            is_registered: true,
          },
          ...(teamData.members || []),
        ],
      },
    ])
    .select()
    .single();

  if (teamError) return { error: teamError.message };

  // Update user's has_team status
  const { error: userError } = await supabase
    .from("users")
    .update({ has_team: true })
    .eq("id", user.id);

  if (userError) {
    // Rollback team creation
    await supabase.from("teams").delete().eq("id", team.id);
    return { error: userError.message };
  }

  // TODO: Send email invites to pending_invites

  return { data: team };
}

export async function updateTeam(
  teamId: string,
  teamData: Partial<TeamCreate>
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify user is team creator
  const { data: team } = await supabase
    .from("teams")
    .select()
    .eq("id", teamId)
    .single();

  if (!team) return { error: "Team not found" };
  if (team.creator_id !== user.id) return { error: "Not authorized" };

  const { data, error } = await supabase
    .from("teams")
    .update(teamData)
    .eq("id", teamId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function deleteTeam(teamId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify user is team creator
  const { data: team } = await supabase
    .from("teams")
    .select("creator_id, members")
    .eq("id", teamId)
    .single();

  if (!team) return { error: "Team not found" };
  if (team.creator_id !== user.id) return { error: "Not authorized" };

  // Update registered team members has_team status
  const registeredMembers = (team.members ?? ([] as TeamCreate["members"]))
    .filter(
      (m: { is_registered?: boolean; user_id?: string }) =>
        m.is_registered && m.user_id
    )
    .map((m: { user_id: string }) => m.user_id);

  if (registeredMembers.length > 0) {
    const { error: userError } = await supabase
      .from("users")
      .update({ has_team: false })
      .in("id", registeredMembers);

    if (userError) return { error: userError.message };
  }

  // Delete team
  const { error } = await supabase.from("teams").delete().eq("id", teamId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function inviteToTeam(userId: string, teamId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify user is team creator
  const { data: team } = await supabase
    .from("teams")
    .select("name")
    .eq("id", teamId)
    .single();

  if (!team) return { error: "Team not found" };

  // Get current invites
  const { data: userData } = await supabase
    .from("users")
    .select("pending_team_invites")
    .eq("id", userId)
    .single();

  const currentInvites = userData?.pending_team_invites || [];

  // Check if already invited
  if (
    currentInvites.some(
      (invite: any) => invite.team_id === teamId && invite.status === "pending"
    )
  ) {
    return { error: "User already invited" };
  }

  // Add new invitation
  const { error: userError } = await supabase
    .from("users")
    .update({
      pending_team_invites: [
        ...currentInvites,
        {
          team_id: teamId,
          invited_at: new Date().toISOString(),
          status: "pending",
        },
      ],
    })
    .eq("id", userId);

  if (userError) return { error: userError.message };
  return { data: team };
}

export async function respondToInvite(teamId: number, accept: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get user's current invites
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("pending_team_invites")
    .eq("id", user.id)
    .single();

  if (userError) return { error: userError.message };

  // Find and update the invitation
  const pendingInvites = userData.pending_team_invites || [];
  const inviteIndex = pendingInvites.findIndex(
    (invite: any) => invite.team_id === teamId && invite.status === "pending"
  );

  if (inviteIndex === -1) return { error: "Invitation not found" };

  // Update invitation status
  pendingInvites[inviteIndex].status = accept ? "accepted" : "rejected";

  if (accept) {
    // Get team details
    const { data: team } = await supabase
      .from("teams")
      .select("members")
      .eq("id", teamId)
      .single();

    if (!team) return { error: "Team not found" };

    // Check if team still has space
    if (team.members.length >= 5) {
      return { error: "Team is already full" };
    }

    // Add user to team members
    const { error: teamError } = await supabase
      .from("teams")
      .update({
        members: [
          ...team.members,
          {
            user_id: user.id,
            role: "Member",
            joined_at: new Date().toISOString(),
            is_registered: true,
          },
        ],
      })
      .eq("id", teamId);

    if (teamError) return { error: teamError.message };

    // Update user's has_team status
    const { error: hasTeamError } = await supabase
      .from("users")
      .update({ has_team: true })
      .eq("id", user.id);

    if (hasTeamError) return { error: hasTeamError.message };
  }

  // Update user's pending invites
  const { error: updateError } = await supabase
    .from("users")
    .update({ pending_team_invites: pendingInvites })
    .eq("id", user.id);

  if (updateError) return { error: updateError.message };
  return { success: true };
}
