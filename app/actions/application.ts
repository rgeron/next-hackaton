"use server";

import { createClient } from "@/utils/supabase/server";

export type Application = {
  team_id: string;
  message: string;
};

export async function applyToTeam(application: Application) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Check if user already has a team
  const { data: userData } = await supabase
    .from("users")
    .select("has_team")
    .eq("id", user.id)
    .single();

  if (userData?.has_team) return { error: "You already have a team" };

  // Check if team exists and has space
  const { data: team } = await supabase
    .from("teams")
    .select("members, max_members")
    .eq("id", application.team_id)
    .single();

  if (!team) return { error: "Team not found" };
  if (team.members.length >= team.max_members)
    return { error: "Team is already full" };

  // Create application
  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        user_id: user.id,
        team_id: application.team_id,
        message: application.message,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function respondToApplication(
  applicationId: string,
  accept: boolean
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get application details
  const { data: application } = await supabase
    .from("applications")
    .select("*, teams!inner(*)")
    .eq("id", applicationId)
    .single();

  if (!application) return { error: "Application not found" };
  if (application.teams.creator_id !== user.id)
    return { error: "Not authorized" };

  if (accept) {
    // Check if team is still has space
    if (application.teams.members.length >= application.teams.max_members)
      return { error: "Team is already full" };

    // Add user to team
    const { error: teamError } = await supabase
      .from("teams")
      .update({
        members: [...application.teams.members, application.user_id],
      })
      .eq("id", application.team_id);

    if (teamError) return { error: teamError.message };

    // Update user's has_team status
    const { error: userError } = await supabase
      .from("users")
      .update({ has_team: true })
      .eq("id", application.user_id);

    if (userError) return { error: userError.message };
  }

  // Update application status
  const { data, error } = await supabase
    .from("applications")
    .update({
      status: accept ? "accepted" : "rejected",
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}
