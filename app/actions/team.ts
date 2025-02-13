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

  // Update user's has_team status and is_team_creator
  const { error: userError } = await supabase
    .from("users")
    .update({ has_team: true, is_team_creator: true })
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

  // Update creator's is_team_creator status
  const { error: creatorError } = await supabase
    .from("users")
    .update({ is_team_creator: false })
    .eq("id", user.id);

  if (creatorError) return { error: creatorError.message };

  // Delete team
  const { error } = await supabase.from("teams").delete().eq("id", teamId);

  if (error) return { error: error.message };
  return { success: true };
}
