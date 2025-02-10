import { getUserTeam } from "@/app/actions/team";
import { TeamSection } from "@/components/team-section";

export default async function TeamPage() {
  const team = await getUserTeam();

  return (
    <main className="min-h-screen w-full py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 max-w-[90rem]">
        <div className="bg-card p-3 sm:p-8 lg:p-12 rounded-lg">
          <TeamSection team={team} />
        </div>
      </div>
    </main>
  );
}
