"use client";

import { respondToApplication } from "@/app/actions/application";
import { getTeamApplications } from "@/app/actions/fetch/teams";
import { Team } from "@/lib/types/database.types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateTeamForm } from "./create-team-form";
import { TeamInfo } from "./team-info-profile";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Application = {
  id: string;
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
    applicationId: string,
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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateTeamForm />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <TeamInfo team={team} />

      {applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Team Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{application.users.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.users.email}
                    </p>
                    <p className="text-sm mt-2">{application.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleApplicationResponse(application.id, true)
                      }
                      className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleApplicationResponse(application.id, false)
                      }
                      className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
