create table "hackathon_applications" (
  "id" uuid not null default uuid_generate_v4() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "team_id" uuid references "teams" ("id") on delete cascade not null,
  "why_participate" text not null,
  "team_strengths" text not null,
  "status" text not null check (status in ('pending', 'approved', 'rejected')),
  "feedback" text,
  constraint "unique_team_application" unique ("team_id")
); 