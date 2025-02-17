import {
  fetchTeamApplications,
  fetchUserInvites,
} from "@/app/actions/fetch/interactions";
import { getTeamData } from "@/app/actions/fetch/teams";
import { getUserProfile } from "@/app/actions/profile";
import { ApplicationsToYourTeam } from "@/components/team/applications-to-your-team";
import { CreateTeamForm } from "@/components/team/create-team-form";
import { TeamInfo } from "@/components/team/team-info-profile";
import { TeamInvitations } from "@/components/team/team-invitations";
import { TeamMemberInfo } from "@/components/team/team-member-info";

export default async function TeamPage() {
  // Get user profile which includes team_id and is_team_creator
  const { data: userProfile } = await getUserProfile();
  if (!userProfile) return null;

  // Get team data if user has a team
  const { data: teamResult } = await getTeamData(userProfile.team_id);

  const [{ data: invites = [] }, { data: applications = [] }] =
    await Promise.all([
      !userProfile.team_id ? fetchUserInvites() : Promise.resolve({ data: [] }),
      userProfile.is_team_creator && teamResult
        ? fetchTeamApplications(teamResult.id)
        : Promise.resolve({ data: [] }),
    ]);

  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 max-w-[90rem]">
        <h1 className="text-2xl font-bold text-center mb-8">
          {!teamResult
            ? "You don't have a team yet !"
            : userProfile.is_team_creator
              ? "Manage your team !"
              : "This is your team"}
        </h1>

        {userProfile.is_team_creator && teamResult && (
          <div className="mb-8 flex justify-center">
            <a
              href="/protected/team/apply"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Apply to the hackathon with this team
            </a>
          </div>
        )}

        {!teamResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {invites.length > 0 && (
              <div className="bg-card p-3 sm:p-8 lg:p-12 rounded-lg">
                <h2 className="text-xl font-bold text-center mb-5">
                  Join a team
                </h2>
                <TeamInvitations invites={invites} />
              </div>
            )}
            <div className="bg-card p-3 sm:p-8 lg:p-12 rounded-lg">
              <h2 className="text-xl font-bold text-center mb-5">
                Create your own team
              </h2>
              <CreateTeamForm />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <TeamInfo
              team={teamResult}
              isTeamCreator={userProfile.is_team_creator}
            />
            <TeamMemberInfo team={teamResult} />
            {userProfile.is_team_creator && applications.length > 0 && (
              <div className="bg-card p-3 rounded-lg">
                <ApplicationsToYourTeam team={teamResult} />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
