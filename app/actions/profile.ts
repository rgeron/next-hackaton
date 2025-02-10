"use server";

import { createClient } from "@/utils/supabase/server";

export type UserProfile = {
  full_name: string;
  school: "X" | "HEC" | "ENSAE" | "Centrale" | "ENSTA";
  bio?: string;
  phone_number?: string;
  skills?: string[];
  links: {
    github?: string;
    linkedin?: string;
  };
};

export async function createUserProfile(email: string) {
  const supabase = await createClient();
  console.log("Creating profile for email:", email);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Auth user:", user);
  if (!user) return { error: "Not authenticated" };

  // First check if user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select()
    .eq("id", user.id)
    .single();

  // If user already exists, just return success
  if (existingUser) return { data: existingUser };

  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: user.id,
          email,
          full_name: "",
          school: "X",
          has_team: false,
          is_team_creator: false,
          bio: null,
          phone_number: null,
          links: { github: null, linkedin: null },
          skills: [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      return { error: error.message };
    }
    return { data };
  } catch (e) {
    console.error("Exception creating profile:", e);
    return { error: "Failed to create profile" };
  }
}

export async function updateUserProfile(userData: UserProfile) {
  const supabase = await createClient();

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

export async function getUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", user.id)
    .single();

  if (error) return { error: error.message };
  return { data };
}
