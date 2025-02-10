"use client";

import { fetchTeamApplications } from "@/app/actions/fetch/interactions";
import { respondToInteraction } from "@/app/actions/interaction";
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

export function ApplicationsToYourTeam({ team }: { team: Team }) {
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

  const handleApplicationResponse = async (
    applicationId: number,
    accept: boolean
  ) => {
    const { error } = await respondToInteraction(applicationId, accept);
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
                <p className="font-medium">{application.applicant.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {application.applicant.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  School: {application.applicant.school}
                </p>
                {application.applicant.skills && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {application.applicant.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="px-2 py-0.5 bg-secondary text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm mt-2">{application.message}</p>
                <p className="text-xs text-muted-foreground">
                  Applied:{" "}
                  {new Date(application.created_at).toLocaleDateString()}
                </p>
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
