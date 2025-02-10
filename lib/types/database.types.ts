// User table type
export type User = {
  id: string; // UUID, PRIMARY KEY
  email: string; // TEXT, UNIQUE, NOT NULL
  full_name: string; // TEXT, NOT NULL
  school: "X" | "HEC" | "ENSAE" | "Centrale" | "ENSTA"; // ENUM, NOT NULL
  bio: string | null; // TEXT
  created_at: Date; // TIMESTAMPTZ, DEFAULT NOW()
  phone_number: string | null; // TEXT
  skills: string[] | null; // TEXT[]
  has_team: boolean; // BOOLEAN, DEFAULT false
  is_team_creator: boolean; // BOOLEAN, DEFAULT false
  links: {
    // JSONB
    github: string | null;
    linkedin: string | null;
  };
};

// Team table type
export type Team = {
  id: number; // SERIAL, PRIMARY KEY
  name: string; // TEXT, NOT NULL
  description: string | null; // TEXT
  max_members: number; // INTEGER, NOT NULL
  creator_id: string; // UUID, REFERENCES users(id)
  created_at: Date; // TIMESTAMPTZ, DEFAULT NOW()
  project_type: "physical product" | "website" | "mobile app" | "software"; // ENUM, NOT NULL
  looking_for: string[]; // TEXT[], NOT NULL
  members: {
    role: string;
    user_id?: string; // Optional for manually added members
    name: string; // Required for manually added members
    joined_at: string;
    is_registered: boolean; // To distinguish between registered/manual members
  }[]; // JSONB, NOT NULL
};

export type Interaction = {
  id: number; // SERIAL, PRIMARY KEY
  type: "team_invite" | "team_application";
  status: "pending" | "accepted" | "rejected";
  created_at: Date; // TIMESTAMPTZ, DEFAULT NOW()
  answer_at: Date | null; // TIMESTAMPTZ | NULL
  message: string | null; // TEXT | NULL
  sender_id: string; // UUID, REFERENCES users(id)
  receiver_id: string; // UUID, REFERENCES users(id)
  team_involved_id: number; // INTEGER, REFERENCES teams(id)
};
