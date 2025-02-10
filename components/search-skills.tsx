"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { skills } from "@/lib/data/skills";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import * as React from "react";
import { ScrollArea } from "./ui/scroll-area";

export function SearchSkills(props: {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const toggleSkill = (skillId: string) => {
    const updated = props.selectedSkills.includes(skillId)
      ? props.selectedSkills.filter((id) => id !== skillId)
      : [...props.selectedSkills, skillId];
    props.onSkillsChange(updated);
  };

  const selectedSkillsData = skills.filter((skill) =>
    props.selectedSkills.includes(skill.id)
  );

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  const technicalSkills = filteredSkills.filter(
    (skill) => skill.category === "technical"
  );
  const businessSkills = filteredSkills.filter(
    (skill) => skill.category === "business"
  );

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedSkillsData.length > 0
              ? `${selectedSkillsData.length} selected`
              : "Select skills..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[300px] p-0">
          <div className="flex items-center border-b px-3 pb-2 pt-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-0 p-0 text-sm focus-visible:ring-0"
            />
          </div>
          <ScrollArea className="h-72">
            {filteredSkills.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No skills found.
              </p>
            ) : (
              <div className="p-2">
                {technicalSkills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 px-2 text-sm font-medium text-muted-foreground">
                      Technical Skills
                    </h4>
                    {technicalSkills.map((skill) => (
                      <div
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className={cn(
                          "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent",
                          props.selectedSkills.includes(skill.id) &&
                            "bg-accent/50"
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            props.selectedSkills.includes(skill.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {skill.name}
                      </div>
                    ))}
                  </div>
                )}
                {businessSkills.length > 0 && (
                  <div>
                    <h4 className="mb-2 px-2 text-sm font-medium text-muted-foreground">
                      Business Skills
                    </h4>
                    {businessSkills.map((skill) => (
                      <div
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className={cn(
                          "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent",
                          props.selectedSkills.includes(skill.id) &&
                            "bg-accent/50"
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            props.selectedSkills.includes(skill.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {skill.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedSkillsData.map((skill) => (
          <Badge
            key={skill.id}
            variant="secondary"
            className="cursor-pointer select-none"
            onClick={() => toggleSkill(skill.id)}
          >
            {skill.name}
            <X className="ml-1 h-3 w-3" />
          </Badge>
        ))}
      </div>
    </div>
  );
}
