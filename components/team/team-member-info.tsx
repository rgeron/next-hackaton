"use client";

import { getUsersByIds } from "@/app/actions/fetch/users";
import { Team } from "@/lib/types/database.types";
import {
  GithubIcon,
  LinkedinIcon,
  PhoneIcon,
  SchoolIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type UserInfo = NonNullable<
  Awaited<ReturnType<typeof getUsersByIds>>["data"]
>[number];

export function TeamMemberInfo(props: { team: Team }) {
  const [membersInfo, setMembersInfo] = useState<UserInfo[]>([]);

  useEffect(() => {
    const fetchMembersInfo = async () => {
      const registeredMembers = props.team.members.filter(
        (m) => m.is_registered && m.user_id
      );
      const userIds = registeredMembers.map((member) => member.user_id!);

      if (userIds.length > 0) {
        const result = await getUsersByIds(userIds);
        if (result.data) {
          setMembersInfo(result.data);
        }
      }
    };

    fetchMembersInfo();
  }, [props.team.members]);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-4">Team Members</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {props.team.members?.map((member) => {
          const userInfo = membersInfo.find((u) => u.id === member.user_id);

          return (
            <div key={member.user_id || member.name} className="w-full border p-4 rounded-lg">
              <div className="bg-card rounded-lg p-4 h-full space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">{member.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{member.role}</p>

                {member.is_registered && userInfo && (
                  <>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <SchoolIcon className="h-4 w-4" />
                      <span>{userInfo.school}</span>
                    </div>
                    {userInfo.phone_number && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{userInfo.phone_number}</span>
                      </div>
                    )}
                    {userInfo.bio && (
                      <p className="text-sm text-muted-foreground">
                        {userInfo.bio}
                      </p>
                    )}
                    {userInfo.skills && userInfo.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {userInfo.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="text-xs bg-secondary px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4">
                      {userInfo.links?.github && (
                        <a
                          href={userInfo.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <GithubIcon className="h-4 w-4" />
                        </a>
                      )}
                      {userInfo.links?.linkedin && (
                        <a
                          href={userInfo.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <LinkedinIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </>
                )}

                <div className="flex flex-wrap gap-2">
                  {member.user_id === props.team.creator_id && (
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      Team Creator
                    </span>
                  )}
                  {!member.is_registered && (
                    <span className="inline-block px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded">
                      Manual Entry
                    </span>
                  )}
                  <span className="inline-block px-2 py-1 bg-secondary text-xs rounded">
                    Joined{" "}
                    {new Date(member.joined_at).toISOString().split("T")[0]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
