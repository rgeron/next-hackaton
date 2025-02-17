"use client";

import { getUsersWithoutTeam } from "@/app/actions/fetch/users";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileFilters } from "@/components/profile/profile-filters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/lib/types/database.types";
import { useEffect, useState } from "react";

export default function SearchProfilePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsersWithoutTeam();
      setUsers(result || []);
      setFilteredUsers(result || []);
    };
    fetchUsers();
  }, []);

  const handleFiltersChange = ({
    school,
    skills,
  }: {
    school?: string;
    skills: string[];
  }) => {
    const filtered = users.filter((user) => {
      if (school && user.school !== school) {
        return false;
      }

      if (skills.length > 0) {
        if (!user.skills?.some((skill) => skills.includes(skill))) {
          return false;
        }
      }

      return true;
    });

    setFilteredUsers(filtered);
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Students without a Team
      </h1>

      <ProfileFilters onChange={handleFiltersChange} />

      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <ProfileCard key={user.id} user={user} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
