"use server";

import { createClient } from "@/utils/supabase/server";

export async function getTeams(filters?: {
  project_type?: "physical product" | "website" | "mobile app" | "software";
  max_members?: number;
  looking_for?: string[];
}) {
  const supabase = await createClient();

  let query = supabase.from("teams").select("*");

  if (filters?.project_type) {
    query = query.eq("project_type", filters.project_type);
  }

  if (filters?.looking_for?.length) {
    query = query.contains("looking_for", filters.looking_for);
  }

  const { data, error } = await query;

  if (error) return { error: error.message };
  return { data };
}

export async function getTeam(teamId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teams")
    .select(
      `
      *,
      members:users(id, full_name, email)
    `
    )
    .eq("id", teamId)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function getTeamApplications(teamId: string) {
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

  // Get all users and filter in memory
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, applications");

  console.log("Query result:", { data, error });

  if (error) return { error: error.message };

  // Transform the data to match the expected format
  const applications = data
    ?.filter((user) =>
      user.applications?.some(
        (app: any) =>
          app.post_id === parseInt(teamId) && app.status === "pending"
      )
    )
    .map((user) => {
      const application = user.applications?.find(
        (app: any) =>
          app.post_id === parseInt(teamId) && app.status === "pending"
      );

      return {
        id: application.id,
        user_id: user.id,
        message: application.message,
        status: application.status,
        users: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
        },
      };
    }) as Application[];

  return { data: applications || [] };
}

export async function getTeamInvitations() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get user's pending invites directly from their record
  const { data, error } = await supabase
    .from("users")
    .select("pending_team_invites, teams!inner(id, name)")
    .eq("id", user.id)
    .eq("pending_team_invites[].status", "pending")
    .single();

  if (error) return { error: error.message };
  if (!data?.pending_team_invites) return { data: [] };

  // Transform the data to match the expected format
  const invites = data.pending_team_invites.map((invite: any) => ({
    team_id: invite.team_id,
    team_name:
      data.teams.find((t: any) => t.id === invite.team_id)?.name ||
      "Unknown Team",
    role: "Member",
    invited_at: invite.invited_at,
  }));

  return { data: invites };
}
