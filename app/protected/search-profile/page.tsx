import { getUsersWithoutTeam } from "@/app/actions/fetch/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GithubIcon, LinkedinIcon, PhoneIcon, SchoolIcon } from "lucide-react";

export default async function SearchProfilePage() {
  const users = await getUsersWithoutTeam();

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Available Profiles</h1>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <SchoolIcon className="h-4 w-4" />
                      <span>{user.school}</span>
                    </div>

                    {user.phone_number && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{user.phone_number}</span>
                      </div>
                    )}

                    <div className="flex gap-4">
                      {user.links?.github && (
                        <a
                          href={user.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <GithubIcon className="h-4 w-4" />
                        </a>
                      )}
                      {user.links?.linkedin && (
                        <a
                          href={user.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <LinkedinIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
