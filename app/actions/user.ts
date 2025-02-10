"use server";

import { createClient } from "@/utils/supabase/server";

export async function isTeamCreator() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: false };

  // Check if user is a creator of any team
  const { data, error } = await supabase
    .from("teams")
    .select("creator_id")
    .eq("creator_id", user.id)
    .limit(1);

  if (error) return { error: error.message };
  return { data: data.length > 0 };
}
