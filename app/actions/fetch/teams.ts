"use server";

import { createClient } from "@/utils/supabase/server";

export async function getTeams(filters?: {
  project_type?: "startup" | "association" | "student_project";
  has_space?: boolean;
  looking_for?: string[];
}) {
  const supabase = await createClient();

  let query = supabase.from("teams").select("*");

  if (filters?.project_type) {
    query = query.eq("project_type", filters.project_type);
  }

  if (filters?.has_space) {
    query = query.lt("members", "max_members");
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
      members:users(id, full_name, email),
      applications(id, user_id, message, status, users(id, full_name, email))
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

  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      users(id, full_name, email)
    `
    )
    .eq("team_id", teamId);

  if (error) return { error: error.message };
  return { data };
}
