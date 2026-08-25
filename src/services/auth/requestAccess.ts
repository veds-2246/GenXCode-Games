import { supabase } from "../../lib/supabase";

export async function requestAccess() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: new Error("No authenticated user") };
  }

  const { data, error } = await supabase.from("access_requests").insert({
    player_id: user.id,
    status: "pending",
  });

  return { data, error };
}