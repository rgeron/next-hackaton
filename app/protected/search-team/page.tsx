import { getTeams } from "@/app/actions/fetch/teams";
import { TeamInfoSearch } from "@/components/team-info-search";
import { createClient } from "@/utils/supabase/server";

export async function SearchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: teams, error }, { data: userData }] = await Promise.all([
    getTeams(),
    user
      ? supabase.from("users").select("team_id").eq("id", user.id).single()
      : { data: null },
  ]);

  const hasTeam = !!userData?.team_id;

  return (
    <div className="w-full max-w-6xl mx-auto8">
      <h1 className="text-2xl font-bold mb-6 text-center">Find Your Team</h1>

      {error && (
        <div className="p-4 rounded-lg border border-destructive">
          <p className="text-destructive">Error loading teams: {error}</p>
        </div>
      )}

      {!teams?.length ? (
        <div className="p-4 rounded-lg border">
          <p className="text-muted-foreground">No teams found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <div key={team.id} className="bg-card">
              <TeamInfoSearch team={team} hasTeam={hasTeam} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
