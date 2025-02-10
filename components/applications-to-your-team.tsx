"use client";

import { respondToApplication } from "@/app/actions/application";
import { getTeamApplications } from "@/app/actions/fetch/teams";
import { Team } from "@/lib/types/database.types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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

export function ApplicationsToYourTeam({ team }: { team: Team }) {
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

  if (applications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Applications</CardTitle>
        <CardDescription>People who want to join your team</CardDescription>
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
                <Button
                  onClick={() =>
                    handleApplicationResponse(application.id, true)
                  }
                  size="sm"
                >
                  Accept
                </Button>
                <Button
                  onClick={() =>
                    handleApplicationResponse(application.id, false)
                  }
                  variant="destructive"
                  size="sm"
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
