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
    <div className="container max-w-5xl py-6 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight bg-clip-text">
          MAKE IT REAL
        </h1>
        <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
          🚀 Turn your ideas into reality on April 5-6! 🚀
        </p>
      </section>

      {/* Concept Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">What is this Hackathon?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This is your chance to bring your project to life! Whether it's a
              physical product, a website, AI innovation, or a mechanical
              prototype, we want to see what you can build—not just a business
              plan.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Who Can Participate */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Who Can Participate?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-none">
              <li className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <span>
                  Open to all students from the Saclay campus (HEC,
                  Polytechnique, Centrale, ENSAE, and more).
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">💡</span>
                <span>The more diverse the teams, the better the demos!</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* How it Works */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How Does It Work?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-none">
              <li className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span>Submit your idea by the Sunday before the event.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span>
                  Form a team with a mix of skills (business, engineering, AI,
                  data science…).
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span>
                  Build your project during an intense weekend at Station F.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span>Showcase your demo at the end of the event!</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Why Join */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Why Join?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-none">
              <li className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span>
                  Create something real – No experience in entrepreneurship
                  needed!
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🤝</span>
                <span>
                  Meet like-minded innovators – Connect with students from
                  different backgrounds.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <span>
                  Challenge yourself in 48 hours – Test your skills and make
                  your idea happen!
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Registration Card */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Ready to push your limits?</CardTitle>
            <CardDescription>
              Join us at Station F on April 5-6!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {team ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  As a team creator, you can now apply for the hackathon at
                  Station F.
                </p>
                <Button asChild className="w-full">
                  <Link href="/protected/team/apply">
                    Apply for the Hackathon
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create or join a team to be eligible for the hackathon at
                  Station F.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/protected/team">Manage Team</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
