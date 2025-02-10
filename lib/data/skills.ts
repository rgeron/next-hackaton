export type SkillCategory = "technical" | "business";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
};

export const skills: Skill[] = [
  // Technical Skills
  { id: "js", name: "JavaScript", category: "technical" },
  { id: "ts", name: "TypeScript", category: "technical" },
  { id: "react", name: "React", category: "technical" },
  { id: "nextjs", name: "Next.js", category: "technical" },
  { id: "nodejs", name: "Node.js", category: "technical" },
  { id: "python", name: "Python", category: "technical" },
  { id: "git", name: "Git", category: "technical" },
  { id: "rest", name: "REST APIs", category: "technical" },
  { id: "graphql", name: "GraphQL", category: "technical" },
  { id: "sql", name: "SQL", category: "technical" },
  { id: "nosql", name: "NoSQL", category: "technical" },
  { id: "ml", name: "Machine Learning", category: "technical" },
  { id: "ds", name: "Data Science", category: "technical" },
  { id: "blockchain", name: "Blockchain", category: "technical" },
  { id: "aws", name: "AWS", category: "technical" },
  { id: "docker", name: "Docker", category: "technical" },
  { id: "k8s", name: "Kubernetes", category: "technical" },

  // Business Skills
  { id: "pm", name: "Project Management", category: "business" },
  { id: "prodm", name: "Product Management", category: "business" },
  { id: "strategy", name: "Business Strategy", category: "business" },
  { id: "marketing", name: "Marketing", category: "business" },
  { id: "sales", name: "Sales", category: "business" },
  { id: "analytics", name: "Business Analytics", category: "business" },
  { id: "consulting", name: "Consulting", category: "business" },
  { id: "leadership", name: "Leadership", category: "business" },
];
