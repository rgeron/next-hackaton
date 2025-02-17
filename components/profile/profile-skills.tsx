import { Badge } from "@/components/ui/badge";
import { skills } from "@/lib/data/skills";

export function ProfileSkills(props: { skillIds: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {props.skillIds?.map((skillId: string) => {
        const skill = skills.find((s) => s.id === skillId);
        return (
          <Badge key={skillId} variant="secondary">
            {skill?.name || skillId}
          </Badge>
        );
      })}
    </div>
  );
}
