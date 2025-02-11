"use client";

import { getUsersByIds } from "@/app/actions/fetch/users";
import { Team } from "@/lib/types/database.types";
import { useEffect, useState } from "react";

type UserInfo = NonNullable<
  Awaited<ReturnType<typeof getUsersByIds>>["data"]
>[number];

export function TeamMemberInfo(props: { team: Team }) {
  const [membersInfo, setMembersInfo] = useState<UserInfo[]>([]);

  useEffect(() => {
    const fetchMembersInfo = async () => {
      // Only fetch info for registered members
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
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-full">
        {props.team.members?.map((member) => (
          <div key={member.user_id} className="w-[300px] flex-none">
            <div className="bg-card rounded-lg p-4 h-full">
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {member.role}
              </p>
              {member.user_id === props.team.creator_id && (
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded mt-2">
                  Team Creator
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
