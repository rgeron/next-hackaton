"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchTeamApplications(teamId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify user is team creator
  const { data: team } = await supabase
    .from("teams")
    .select("creator_id")
    .eq("id", teamId)
    .single();

  if (!team || team.creator_id !== user.id) {
    return { error: "Not authorized" };
  }

  // Fetch applications with applicant details
  const { data: applications, error } = await supabase
    .from("interactions")
    .select(
      `
      *,
      applicant:sender_id(
        id,
        full_name,
        email,
        school,
        skills,
        links
      )
    `
    )
    .eq("team_involved_id", teamId)
    .eq("type", "team_application")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data: applications };
}

export async function fetchUserInvites() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Fetch invites with team and sender details
  const { data: invites, error } = await supabase
    .from("interactions")
    .select(
      `
      *,
      team:team_involved_id(
        id,
        name,
        description,
        project_type,
        looking_for,
        members,
        max_members
      ),
      sender:sender_id(
        id,
        full_name,
        email
      )
    `
    )
    .eq("receiver_id", user.id)
    .eq("type", "team_invite")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data: invites };
}
