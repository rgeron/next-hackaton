"use client";

import { getUsersWithoutTeam } from "@/app/actions/fetch/users";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileFilters } from "@/components/profile/profile-filters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchProfileParsers } from "@/lib/search-params";
import { User } from "@/lib/types/database.types";
import { useQueryStates } from "nuqs";
import { useEffect, useState } from "react";

export default function SearchProfilePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [{ school, skills }, setFilters] = useQueryStates(
    searchProfileParsers,
    {
      history: "push", // Enable back/forward navigation
    }
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsersWithoutTeam();
      setUsers(result || []);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
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

  const handleFiltersChange = ({
    school: newSchool,
    skills: newSkills,
  }: {
    school?: string;
    skills: string[];
  }) => {
    setFilters({
      school: newSchool || "",
      skills: newSkills,
    });
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Students without a Team
      </h1>

      <ProfileFilters
        onChange={handleFiltersChange}
        initialSchool={school}
        initialSkills={skills}
      />

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
