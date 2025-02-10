import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/types/database.types";
import { GithubIcon, LinkedinIcon, PhoneIcon, SchoolIcon } from "lucide-react";

export function ProfileCard(props: { user: User }) {
  const { user } = props;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback>{user.full_name?.slice(0, 2) || "??"}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.full_name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {user.bio && (
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          )}

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
  );
}
