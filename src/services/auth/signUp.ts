import { supabase } from "../../lib/supabase";
import type { Profile } from "../../types/domain";
import { USER_ROLES } from "../../constants/roles";

export async function signUp(
  email: string,
  password: string,
  profileData: Omit<Profile, "id" | "role" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return { data: null, error };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    ...profileData,
    role: USER_ROLES.PLAYER,
  });

  if (profileError) {
    return { data: null, error: profileError };
  }

  return { data, error: null };
}