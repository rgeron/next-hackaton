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
