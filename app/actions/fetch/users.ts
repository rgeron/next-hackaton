"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUsers(filters?: {
  school?: "X" | "HEC" | "ENSAE" | "Centrale" | "ENSTA";
  has_team?: boolean;
  skills?: string[];
}) {
  const supabase = await createClient();

  let query = supabase.from("users").select("*");

  if (filters?.school) {
    query = query.eq("school", filters.school);
  }

  if (filters?.has_team !== undefined) {
    query = query.eq("has_team", filters.has_team);
  }

  if (filters?.skills?.length) {
    query = query.contains("skills", filters.skills);
  }

  const { data, error } = await query;

  if (error) return { error: error.message };
  return { data };
}

export async function getUsersByIds(userIds: string[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("id", userIds);

  if (error) return { error: error.message };
  return { data };
}

export async function getUsersWithoutTeam() {
  const { data, error } = await getUsers({ has_team: false });
  if (error) return [];
  return data;
}
