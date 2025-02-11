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
    .eq("status", "pending")
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
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data: invites };
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
