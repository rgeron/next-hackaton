import { getUserTeam } from "@/app/actions/team";
import { CreateTeamForm } from "@/components/create-team-form";
import { ProfileForm } from "@/components/profile-form";
import { TeamInfo } from "@/components/team-info-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const team = await getUserTeam();
  console.log("this is the team", team);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>

        {team ? (
          <TeamInfo team={team} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Team</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateTeamForm />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
