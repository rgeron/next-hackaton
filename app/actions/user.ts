"use server";

import { createClient } from "@/utils/supabase/server";

export async function isTeamCreator(): Promise<number | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("teams")
    .select("id")
    .eq("creator_id", user.id)
    .limit(1);

  if (error) throw new Error(error.message);
  return data.length > 0 ? data[0].id : null;
}
