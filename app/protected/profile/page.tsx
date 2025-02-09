import { getUserProfile } from "@/app/actions/profile";
import { getUserTeam } from "@/app/actions/team";
import { ProfileForm } from "@/components/profile-form";
import { TeamSection } from "@/components/team-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ProfilePage() {
  const team = await getUserTeam();
  const { data: profile } = await getUserProfile();

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="team">My Team</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileForm initialData={profile} />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <TeamSection team={team} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
