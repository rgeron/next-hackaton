"use client";

import { getUsersByIds } from "@/app/actions/fetch/users";
import { Team } from "@/lib/types/database.types";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

type UserInfo = NonNullable<
  Awaited<ReturnType<typeof getUsersByIds>>["data"]
>[number];

export function TeamMemberInfo({ team }: { team: Team }) {
  const [membersInfo, setMembersInfo] = useState<UserInfo[]>([]);

  useEffect(() => {
    const fetchMembersInfo = async () => {
      const userIds = team.members.map((member) => member.user_id);
      const result = await getUsersByIds(userIds);
      if (result.data) {
        setMembersInfo(result.data);
      }
    };

    fetchMembersInfo();
  }, [team.members]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Information about your team members</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {team.members.map((member) => {
              const userInfo = membersInfo.find((u) => u.id === member.user_id);
              if (!userInfo) return null;

              return (
                <div
                  key={member.user_id}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {userInfo.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {userInfo.school}
                      </p>
                    </div>
                    <Badge
                      variant={
                        member.role === "Project Lead" ? "default" : "secondary"
                      }
                    >
                      {member.role}
                    </Badge>
                  </div>

                  {userInfo.bio && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        {userInfo.bio}
                      </p>
                    </div>
                  )}

                  {userInfo.skills && userInfo.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {userInfo.skills.map((skill: string) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {userInfo.links?.github && (
                      <a
                        href={userInfo.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        GitHub
                      </a>
                    )}
                    {userInfo.links?.linkedin && (
                      <a
                        href={userInfo.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
