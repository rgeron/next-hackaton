"use client";

import { fetchTeamApplications } from "@/app/actions/fetch/interactions";
import { Team } from "@/lib/types/database.types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApplicationsToYourTeam } from "./applications-to-your-team";
import { CreateTeamForm } from "./create-team-form";
import { TeamInfo } from "./team-info-profile";
import { TeamMemberInfo } from "./team-member-info";

type ApplicationWithUser = {
  id: number;
  message: string;
  status: string;
  created_at: string;
  applicant: {
    id: string;
    full_name: string;
    email: string;
    school: string;
    skills: string[] | null;
  };
};

export function TeamSection({ team }: { team: Team | null }) {
  const [applications, setApplications] = useState<ApplicationWithUser[]>([]);

  useEffect(() => {
    if (team) {
      fetchTeamApplications(team.id).then(({ data, error }) => {
        if (error) {
          toast.error(error);
          return;
        }
        if (data) {
          setApplications(data);
        }
      });
    }
  }, [team]);

  if (!team) {
    return <CreateTeamForm />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <TeamInfo team={team} />
        </div>
        <div>
          <TeamMemberInfo team={team} />
        </div>
      </div>
      <ApplicationsToYourTeam team={team} />
    </div>
  );
}
