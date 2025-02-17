import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function ProtectedPage() {
  const cookieStore = cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("creator_id", user?.id)
    .single();

  return (
    <div className="container max-w-5xl py-6 space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to HEC Hackathon 2024
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join the most prestigious hackathon in France, where innovation meets
          excellence at HEC Paris.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
            <CardDescription>
              Access key features of the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/protected/search-profile">🔍 Find Team Members</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/protected/search-team">👥 Explore Teams</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/protected/profile">👤 Update Your Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hackathon Registration</CardTitle>
            <CardDescription>
              Submit your team for the on-site event at HEC Paris
            </CardDescription>
          </CardHeader>
          <CardContent>
            {team ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  As a team creator, you can now apply for the on-site hackathon
                  at HEC Paris.
                </p>
                <Button asChild className="w-full">
                  <Link href="/protected/team/apply">
                    Apply for HEC Hackathon
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create or join a team to be eligible for the on-site hackathon
                  at HEC Paris.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/protected/team">Manage Team</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
