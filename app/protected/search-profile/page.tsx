import { getUsersWithoutTeam } from "@/app/actions/fetch/users";
import { ProfileCard } from "@/components/profile-card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function SearchProfilePage() {
  const users = await getUsersWithoutTeam();

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Available Profiles</h1>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users?.map((user) => <ProfileCard key={user.id} user={user} />)}
        </div>
      </ScrollArea>
    </div>
  );
}
