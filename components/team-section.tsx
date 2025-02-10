"use client";

import { respondToApplication } from "@/app/actions/application";
import { getTeamApplications } from "@/app/actions/fetch/teams";
import { Team } from "@/lib/types/database.types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApplicationsToYourTeam } from "./applications-to-your-team";
import { CreateTeamForm } from "./create-team-form";
import { TeamInfo } from "./team-info-profile";
import { TeamMemberInfo } from "./team-member-info";

type Application = {
  id: number;
  user_id: string;
  message: string;
  status: string;
  users: {
    id: string;
    full_name: string;
    email: string;
  };
};

export function TeamSection({ team }: { team: Team | null }) {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (team) {
      getTeamApplications(team.id.toString()).then(({ data, error }) => {
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

  const handleApplicationResponse = async (
    applicationId: number,
    accept: boolean
  ) => {
    const { error } = await respondToApplication(applicationId, accept);
    if (error) {
      toast.error(error);
      return;
    }

    toast.success(
      `Application ${accept ? "accepted" : "rejected"} successfully`
    );
    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
  };

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
