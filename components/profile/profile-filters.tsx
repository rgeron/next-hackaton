"use client";

import { SearchSkills } from "@/components/search-skills";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const schools = ["X", "HEC", "ENSAE", "Centrale", "ENSTA"] as const;

type Filters = {
  school?: string;
  skills: string[];
};

export function ProfileFilters(props: {
  onChange: (filters: Filters) => void;
}) {
  const [selectedSchool, setSelectedSchool] = useState<string>("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
    props.onChange({
      school: value === "all" ? undefined : value,
      skills: selectedSkills,
    });
  };

  const handleSkillsChange = (value: string[]) => {
    setSelectedSkills(value);
    props.onChange({
      school: selectedSchool === "all" ? undefined : selectedSchool,
      skills: value,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select value={selectedSchool} onValueChange={handleSchoolChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Select school" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Schools</SelectItem>
          {schools.map((school) => (
            <SelectItem key={school} value={school}>
              {school}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex-1">
        <SearchSkills
          selectedSkills={selectedSkills}
          onSkillsChange={handleSkillsChange}
        />
      </div>
    </div>
  );
}
