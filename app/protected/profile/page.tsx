import { CreateTeamForm } from "@/components/create-team-form";
import { ProfileForm } from "@/components/profile-form";
import { TeamInfo } from "@/components/team-info";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/server";

async function getUserTeam() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // First check if user is a member of any team
  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .contains("members", [{ user_id: user.id }]);

  return teams?.[0] || null;
}

export default async function ProfilePage() {
  const team = await getUserTeam();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
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
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Create a Team</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Your Team</DialogTitle>
                </DialogHeader>
                <CreateTeamForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
