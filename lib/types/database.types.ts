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
export type Team = {
  id: number; // SERIAL, PRIMARY KEY
  name: string; // TEXT, NOT NULL
  description: string | null; // TEXT
  creator_id: string; // UUID, REFERENCES users(id)
  created_at: Date; // TIMESTAMPTZ, DEFAULT NOW()
  project_type: "physical product" | "website" | "mobile app" | "software"; // ENUM, NOT NULL
  looking_for: string[]; // TEXT[], NOT NULL
  members: {
    user_id: string; // UUID, REFERENCES users(id)
    role: string; // One of JOB_OPTIONS
    joined_at: Date;
  }[]; // JSONB, NOT NULL
  pending_invites: {
    email: string;
    role: string; // One of JOB_OPTIONS
    invited_at: Date;
  }[]; // JSONB, NOT NULL, DEFAULT []
};
