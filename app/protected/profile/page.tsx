import { getTeamInvitations } from "@/app/actions/fetch/teams";
import { getUserProfile } from "@/app/actions/profile";
import { ProfileForm } from "@/components/profile-form";
import { TeamInvitations } from "@/components/team-invitations";

export default async function ProfilePage() {
  const { data: profile } = await getUserProfile();
  const { data: invites = [] } = await getTeamInvitations();

  console.log("Debug - Team Invitations:", { invites });

  return (
    <main className="min-h-screen w-full py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 max-w-[90rem] space-y-6">
        <div className="bg-card p-4 sm:p-6 rounded-lg border-2">
          <ProfileForm initialData={profile} />
        </div>
        {invites.length > 0 && (
          <div className="bg-card p-4 sm:p-6 rounded-lg border-2">
            <TeamInvitations invites={invites} />
          </div>
        )}
      </div>
    </main>
  );
}
