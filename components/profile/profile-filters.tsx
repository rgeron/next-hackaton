"use client";

import { SearchSkills } from "@/components/search-skills";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const schools = ["X", "HEC", "ENSAE", "Centrale", "ENSTA"] as const;

type Filters = {
  school?: string;
  skills: string[];
};

export function ProfileFilters(props: {
  onChange: (filters: Filters) => void;
  initialSchool: string;
  initialSkills: string[];
}) {
  useEffect(() => {
    // Sync initial URL state
    props.onChange({
      school: props.initialSchool === "all" ? undefined : props.initialSchool,
      skills: props.initialSkills,
    });
  }, []);

  const handleSchoolChange = (value: string) => {
    props.onChange({
      school: value === "all" ? undefined : value,
      skills: props.initialSkills,
    });
  };

  const handleSkillsChange = (value: string[]) => {
    props.onChange({
      school: props.initialSchool === "all" ? undefined : props.initialSchool,
      skills: value,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select
        value={props.initialSchool || "all"}
        onValueChange={handleSchoolChange}
      >
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
          selectedSkills={props.initialSkills}
          onSkillsChange={handleSkillsChange}
        />
      </div>
    </div>
  );
}
