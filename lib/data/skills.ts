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
  { id: "llm", name: "Large Language Models (LLMs)", category: "technical" },
  { id: "blockchain", name: "Blockchain", category: "technical" },
  { id: "aws", name: "AWS", category: "technical" },
  { id: "gcp", name: "Google Cloud Platform", category: "technical" },
  { id: "azure", name: "Microsoft Azure", category: "technical" },
  { id: "docker", name: "Docker", category: "technical" },
  { id: "k8s", name: "Kubernetes", category: "technical" },
  { id: "ci_cd", name: "CI/CD", category: "technical" },
  { id: "devops", name: "DevOps", category: "technical" },
  { id: "cybersec", name: "Cybersecurity", category: "technical" },
  { id: "iot", name: "Internet of Things (IoT)", category: "technical" },
  { id: "ar_vr", name: "AR/VR Development", category: "technical" },
  { id: "mobile", name: "Mobile Development", category: "technical" },
  { id: "flutter", name: "Flutter", category: "technical" },
  { id: "react_native", name: "React Native", category: "technical" },
  { id: "ux", name: "UI/UX Design", category: "technical" },
  { id: "figma", name: "Figma", category: "technical" },
  { id: "web3", name: "Web3 Development", category: "technical" },

  // Business Skills
  { id: "pm", name: "Project Management", category: "business" },
  { id: "strategy", name: "Business Strategy", category: "business" },
  { id: "marketing", name: "Marketing", category: "business" },
  { id: "analytics", name: "Business Analytics", category: "business" },
  { id: "pitching", name: "Pitching & Storytelling", category: "business" },
  { id: "user_research", name: "User Research", category: "business" },
  { id: "legal", name: "Legal & Compliance", category: "business" },
  { id: "financial", name: "Financial Modeling", category: "business" },
  { id: "branding", name: "Branding & Positioning", category: "business" },
];
