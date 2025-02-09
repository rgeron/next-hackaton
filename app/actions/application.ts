"use server";

import { createClient } from "@/utils/supabase/server";

type UserApplication = {
  id: number;
  post_id: number;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
};

export type Application = {
  team_id: number;
  message: string;
};

export async function applyToTeam(application: Application) {
  console.log("Server: Starting application process", application);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  console.log("Server: User authenticated", user.id);

  // Check if user already has a team
  const { data: userData } = await supabase
    .from("users")
    .select("has_team, applications")
    .eq("id", user.id)
    .single();

  console.log("Server: User team status", userData);
  if (userData?.has_team) return { error: "You already have a team" };

  // Check if user has already applied to this team
  const existingApplication = userData?.applications?.find(
    (app: UserApplication) =>
      app.post_id === application.team_id && app.status === "pending"
  );

  if (existingApplication) {
    return { error: "You have already applied to this team" };
  }

  // Check if team exists and has space
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("*")
    .eq("id", application.team_id)
    .single();

  console.log("Server: Team query result", { team, teamError });
  if (teamError) {
    console.error("Team query error:", teamError);
    return { error: "Error finding team" };
  }
  if (!team) return { error: "Team not found" };

  // Check team capacity
  if (team.members.length >= (team.max_members || 5)) {
    return { error: "Team is already full" };
  }

  // Create application
  console.log("Server: Attempting to create application with:", {
    user_id: user.id,
    team_id: application.team_id,
    message: application.message,
  });

  // Update user's applications array
  const newApplication = {
    id: Date.now(), // temporary ID
    post_id: application.team_id,
    message: application.message,
    status: "pending" as const,
    created_at: new Date().toISOString(),
  };

  const { data: updatedUser, error } = await supabase
    .from("users")
    .update({
      applications: [...(userData?.applications || []), newApplication],
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Server: Application creation error details:", {
      code: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message,
    });
    return { error: `Failed to create application: ${error.message}` };
  }

  console.log("Server: Application created successfully:", newApplication);
  return { data: newApplication };
}

export async function respondToApplication(
  applicationId: number,
  accept: boolean
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get all users and find the one with the matching application
  const { data: users } = await supabase
    .from("users")
    .select("id, applications");

  const applicantData = users?.find((user) =>
    user.applications?.some((app: UserApplication) => app.id === applicationId)
  );

  if (!applicantData) return { error: "Application not found" };

  const application = applicantData.applications.find(
    (app: UserApplication) => app.id === applicationId
  );
  if (!application) return { error: "Application not found" };

  // Get team details
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("id", application.post_id)
    .single();

  if (!team) return { error: "Team not found" };
  if (team.creator_id !== user.id) return { error: "Not authorized" };

  if (accept) {
    // Check if team is still has space
    if (team.members.length >= (team.max_members || 5)) {
      return { error: "Team is already full" };
    }

    // Add user to team
    const { error: teamError } = await supabase
      .from("teams")
      .update({
        members: [
          ...team.members,
          {
            user_id: applicantData.id,
            role: "Member",
            joined_at: new Date().toISOString(),
          },
        ],
      })
      .eq("id", application.post_id);

    if (teamError) return { error: teamError.message };

    // Update user's has_team status
    const { error: userError } = await supabase
      .from("users")
      .update({ has_team: true })
      .eq("id", applicantData.id);

    if (userError) return { error: userError.message };
  }

  // Update application status in the applications array
  const updatedApplications = applicantData.applications.map(
    (app: UserApplication) =>
      app.id === applicationId
        ? { ...app, status: accept ? "accepted" : "rejected" }
        : app
  );

  const { data, error } = await supabase
    .from("users")
    .update({
      applications: updatedApplications,
    })
    .eq("id", applicantData.id)
    .select()
    .single();

  if (error) return { error: error.message };
  return {
    data: data.applications.find(
      (app: UserApplication) => app.id === applicationId
    ),
  };
}
