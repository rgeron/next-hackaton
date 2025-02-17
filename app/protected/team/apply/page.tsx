import { TeamApplicationForm } from "@/components/team/team-application-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TeamApplyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is a team creator
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("creator_id", user?.id)
    .single();

  if (!team) {
    redirect("/protected/team");
  }

  return (
    <div className="container max-w-3xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Apply for HEC Hackathon 2024</CardTitle>
          <CardDescription>
            Submit your team&apos;s application for the on-site hackathon at HEC
            Paris. Make sure to provide detailed information about your project
            and team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamApplicationForm team={team} />
        </CardContent>
      </Card>
    </div>
  );
}
