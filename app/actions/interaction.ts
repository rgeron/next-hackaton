"use server";

import { createClient } from "@/utils/supabase/server";

export type InteractionRequest = {
  team_id: number;
  message: string;
};

export async function applyToTeam(application: InteractionRequest) {
  const supabase = await createClient();

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

  // Check if user has already applied to this team
  const { data: existingInteraction } = await supabase
    .from("interactions")
    .select("*")
    .eq("sender_id", user.id)
    .eq("team_involved_id", application.team_id)
    .eq("type", "team_application")
    .eq("status", "pending")
    .single();

  if (existingInteraction) {
    return { error: "You have already applied to this team" };
  }

  // Check if team exists and has space
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("*")
    .eq("id", application.team_id)
    .single();

  if (teamError) return { error: "Error finding team" };
  if (!team) return { error: "Team not found" };

  // Check team capacity
  if (team.members.length >= team.max_members) {
    return { error: "Team is already full" };
  }

  // Create interaction
  const { data: interaction, error } = await supabase
    .from("interactions")
    .insert({
      type: "team_application",
      status: "pending",
      message: application.message,
      sender_id: user.id,
      receiver_id: team.creator_id,
      team_involved_id: application.team_id,
    })
    .select()
    .single();

  if (error) {
    return { error: `Failed to create application: ${error.message}` };
  }

  return { data: interaction };
}

export async function respondToInteraction(
  interactionId: number,
  accept: boolean
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get interaction details
  const { data: interaction } = await supabase
    .from("interactions")
    .select("*, team:teams(*)")
    .eq("id", interactionId)
    .single();

  if (!interaction) return { error: "Interaction not found" };
  if (interaction.receiver_id !== user.id) return { error: "Not authorized" };

  if (accept) {
    if (interaction.type === "team_application") {
      // Check if team still has space
      if (interaction.team.members.length >= interaction.team.max_members) {
        return { error: "Team is already full" };
      }

      // Get applicant details
      const { data: applicant } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", interaction.sender_id)
        .single();

      // Add user to team
      const { error: teamError } = await supabase
        .from("teams")
        .update({
          members: [
            ...interaction.team.members,
            {
              user_id: interaction.sender_id,
              name: applicant?.full_name || "",
              role: "Member",
              joined_at: new Date().toISOString(),
              is_registered: true,
            },
          ],
        })
        .eq("id", interaction.team_involved_id);

      if (teamError) return { error: teamError.message };

      // Update user's has_team status
      const { error: userError } = await supabase
        .from("users")
        .update({ has_team: true })
        .eq("id", interaction.sender_id);

      if (userError) return { error: userError.message };
    } else if (interaction.type === "team_invite") {
      // Check if team still has space
      if (interaction.team.members.length >= interaction.team.max_members) {
        return { error: "Team is already full" };
      }

      // Get invitee details
      const { data: invitee } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", interaction.receiver_id)
        .single();

      // Add user to team
      const { error: teamError } = await supabase
        .from("teams")
        .update({
          members: [
            ...interaction.team.members,
            {
              user_id: interaction.receiver_id,
              name: invitee?.full_name || "",
              role: "Member",
              joined_at: new Date().toISOString(),
              is_registered: true,
            },
          ],
        })
        .eq("id", interaction.team_involved_id);

      if (teamError) return { error: teamError.message };

      // Update user's has_team status
      const { error: userError } = await supabase
        .from("users")
        .update({ has_team: true })
        .eq("id", interaction.receiver_id);

      if (userError) return { error: userError.message };
    }
  }

  // Update interaction status
  const { data, error } = await supabase
    .from("interactions")
    .update({
      status: accept ? "accepted" : "rejected",
      answer_at: new Date().toISOString(),
    })
    .eq("id", interactionId)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function inviteToTeam(invitation: {
  team_id: number;
  receiver_id: string;
  message: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify user is team creator
  const { data: team } = await supabase
    .from("teams")
    .select("creator_id, members, max_members")
    .eq("id", invitation.team_id)
    .single();

  if (!team || team.creator_id !== user.id) {
    return { error: "Not authorized" };
  }

  // Check if team is full
  if (team.members.length >= team.max_members) {
    return { error: "Team is already full" };
  }

  // Check if user is already invited
  const { data: existingInvite } = await supabase
    .from("interactions")
    .select("*")
    .eq("team_involved_id", invitation.team_id)
    .eq("receiver_id", invitation.receiver_id)
    .eq("type", "team_invite")
    .eq("status", "pending")
    .single();

  if (existingInvite) {
    return { error: "User already has a pending invitation" };
  }

  // Create interaction
  const { data: interaction, error } = await supabase
    .from("interactions")
    .insert({
      type: "team_invite",
      status: "pending",
      message: invitation.message,
      sender_id: user.id,
      receiver_id: invitation.receiver_id,
      team_involved_id: invitation.team_id,
    })
    .select()
    .single();

  if (error) {
    return { error: `Failed to create invitation: ${error.message}` };
  }

  return { data: interaction };
}
