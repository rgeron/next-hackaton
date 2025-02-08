"use server";

import { createClient } from "@/utils/supabase/server";

export type UserProfile = {
  full_name: string;
  school: "X" | "HEC" | "ENSAE" | "Centrale" | "ENSTA";
  bio?: string;
  skills?: string[];
  links: {
    github?: string;
    linkedin?: string;
  };
};

export async function createUserProfile(email: string) {
  const supabase = createClient();

  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();

  if (existingUser) return { error: "User already exists" };

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email,
        full_name: "",
        school: "X",
        has_team: false,
        links: { github: null, linkedin: null },
        applications: [],
      },
    ])
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function updateUserProfile(userData: UserProfile) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("id", user.id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}
