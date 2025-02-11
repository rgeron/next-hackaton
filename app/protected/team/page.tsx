import {
  fetchTeamApplications,
  fetchUserInvites,
} from "@/app/actions/fetch/interactions";
import { getUserTeam } from "@/app/actions/team";
import { ApplicationsToYourTeam } from "@/components/applications-to-your-team";
import { CreateTeamForm } from "@/components/create-team-form";
import { TeamInvitations } from "@/components/team-invitations";
import { TeamMemberInfo } from "@/components/team-member-info";
import { TeamInfo } from "@/components/team-info-profile";
export default async function TeamPage() {
  // Get team first to avoid circular reference
  const teamResult = await getUserTeam();

  const [{ data: invites = [] }, { data: applications = [], error }] =
    await Promise.all([
      fetchUserInvites(),
      teamResult
        ? fetchTeamApplications(teamResult.id)
        : Promise.resolve({ data: [], error: null }),
    ]);

  const isTeamCreator =
    teamResult?.creator_id ===
    teamResult?.members?.find(
      (m: { user_id: string | undefined }) =>
        m.user_id === teamResult.creator_id
    )?.user_id;

  return (
    <main className="min-h-screen w-full p-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 max-w-[90rem]">
        <h1 className="text-2xl font-bold text-center mb-8">
          {!teamResult
            ? "You don't have a team yet !"
            : isTeamCreator
              ? "Manage your team !"
              : "This is your team"}
        </h1>

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
            <TeamInfo team={teamResult} />
            <TeamMemberInfo team={teamResult} />
            {isTeamCreator && applications.length > 0 && (
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
