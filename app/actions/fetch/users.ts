"use server";

import { createClient } from "@/utils/supabase/server";

export type UserFilters = {
  search?: string;
  hasTeam?: boolean;
};

export async function getUsers(filters?: UserFilters) {
  const supabase = await createClient();

  let query = supabase.from("users").select("*");

  if (filters?.search) {
    query = query.ilike("full_name", `%${filters.search}%`);
  }

  if (filters?.hasTeam !== undefined) {
    query = filters.hasTeam
      ? query.not("team_id", "is", null)
      : query.is("team_id", null);
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
  const { data, error } = await getUsers({ hasTeam: false });
  if (error) return [];
  return data;
}
