"use server";

import { createClient } from "@/utils/supabase/server";

export type TeamCreate = {
  name: string;
  description: string;
  looking_for?: string[];
  project_type: "physical product" | "website" | "mobile app" | "software";
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

  // Get user's team - check creator_id first
  const { data: teams, error } = await supabase
    .from("teams")
    .select("*")
    .eq("creator_id", user.id);
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
    .select()
    .eq("id", teamId)
    .single();

  if (!team) return { error: "Team not found" };
  if (team.creator_id !== user.id) return { error: "Not authorized" };

  // Check if user is already invited
  const pendingInvites = team.pending_invites || [];
  if (pendingInvites.some((invite: TeamInvite) => invite.user_id === userId)) {
    return { error: "User already invited" };
  }

  // Add invitation
  const newInvite: TeamInvite = {
    user_id: userId,
    role: "Member",
    invited_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("teams")
    .update({
      pending_invites: [...pendingInvites, newInvite],
    })
    .eq("id", teamId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function respondToInvite(teamId: number, accept: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get team details
  const { data: team } = await supabase
    .from("teams")
    .select()
    .eq("id", teamId)
    .single();

  if (!team) return { error: "Team not found" };

  // Find and remove the invitation
  const pendingInvites = team.pending_invites || [];
  const inviteIndex = pendingInvites.findIndex(
    (invite: TeamInvite) => invite.user_id === user.id
  );

  if (inviteIndex === -1) return { error: "Invitation not found" };
  const invite = pendingInvites[inviteIndex];
  pendingInvites.splice(inviteIndex, 1);

  if (accept) {
    // Check if team still has space
    if (team.members.length >= (team.max_members || 5)) {
      return { error: "Team is already full" };
    }

    // Add user to team members
    team.members.push({
      user_id: user.id,
      role: invite.role,
      joined_at: new Date().toISOString(),
      is_registered: true,
    });

    // Update user's has_team status
    const { error: userError } = await supabase
      .from("users")
      .update({ has_team: true })
      .eq("id", user.id);

    if (userError) return { error: userError.message };
  }

  // Update team
  const { data, error } = await supabase
    .from("teams")
    .update({
      members: team.members,
      pending_invites: pendingInvites,
    })
    .eq("id", teamId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}
