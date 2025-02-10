import { getUserProfile } from "@/app/actions/profile";
import { getUserTeam } from "@/app/actions/team";
import { ProfileForm } from "@/components/profile-form";
import { TeamSection } from "@/components/team-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ProfilePage() {
  const team = await getUserTeam();
  const { data: profile } = await getUserProfile();

  return (
    <main className="min-h-screen w-full py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="team">My Team</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="w-full">
            <div className="bg-card p-6 rounded-lg border-2">
              <ProfileForm initialData={profile} />
            </div>
          </TabsContent>

          <TabsContent value="team" className="w-full">
            <div className="bg-card p-6 rounded-lg">
              <TeamSection team={team} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
