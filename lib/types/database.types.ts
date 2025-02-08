// User table type
type User = {
  id: string; // UUID, PRIMARY KEY
  email: string; // TEXT, UNIQUE, NOT NULL
  full_name: string; // TEXT, NOT NULL
  school: "X" | "HEC" | "ENSAE" | "Centrale" | "ENSTA"; // ENUM, NOT NULL
  bio: string | null; // TEXT
  created_at: Date; // TIMESTAMPTZ, DEFAULT NOW()
  skills: string[] | null; // TEXT[]
  has_team: boolean; // BOOLEAN, DEFAULT false
  links: {
    // JSONB
    github: string | null;
    linkedin: string | null;
  };
  applications: {
    // JSONB
    id: number;
    post_id: number;
    message: string | null;
    status: "pending" | "accepted" | "rejected";
    created_at: Date;
  }[];
};

// Team table type
type Team = {
  id: number; // SERIAL, PRIMARY KEY
  name: string; // TEXT, NOT NULL
  description: string | null; // TEXT
  creator_id: string; // UUID, REFERENCES users(id)
  created_at: Date; // TIMESTAMPTZ, DEFAULT NOW()
  members: {
    // JSONB
    id: number;
    user_id: string; // UUID (references users.id)
    role: string | null;
    joined_at: Date;
    is_leader: boolean;
  }[];
};
