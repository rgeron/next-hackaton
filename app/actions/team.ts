"use server";

import { createClient } from "@/utils/supabase/server";

export type TeamCreate = {
  name: string;
  description: string;
  looking_for?: string[];
  project_type: "physical product" | "website" | "mobile app" | "software";
  pending_invites?: {
    email: string;
    role: string;
  }[];
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
            role: "Project Lead",
            joined_at: new Date(),
          },
        ],
        pending_invites: (teamData.pending_invites || []).map((invite) => ({
          ...invite,
          invited_at: new Date(),
        })),
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

export async function deleteTeam(teamId: string) {
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

  // Update all team members has_team status
  const { error: userError } = await supabase
    .from("users")
    .update({ has_team: false })
    .in("id", team.members);

  if (userError) return { error: userError.message };

  // Delete team
  const { error } = await supabase.from("teams").delete().eq("id", teamId);

  if (error) return { error: error.message };
  return { success: true };
}
