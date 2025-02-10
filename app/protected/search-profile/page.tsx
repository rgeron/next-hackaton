import { getUsersWithoutTeam } from "@/app/actions/fetch/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function SearchProfilePage() {
  const users = await getUsersWithoutTeam();

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Available Profiles</h1>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="grid gap-4">
          {users?.map((user) => (
            <Card key={user.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>
                    {user.full_name?.slice(0, 2) || "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills?.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
