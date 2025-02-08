import { getTeams } from "@/app/actions/fetch/teams";
import { TeamInfoSearch } from "@/components/team-info-search";

export async function SearchPage() {
  const { data: teams, error } = await getTeams();

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Find Your Team</h1>

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
            <div
              key={team.id}
              className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <TeamInfoSearch team={team} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
