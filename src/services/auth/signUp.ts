import { supabase } from "../../lib/supabase";
import type { Profile } from "../../types/domain";

export async function signUp(
  email: string,
  password: string,
  profileData: Omit<Profile, "id" | "role" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: profileData.name,
        whatsapp_number: profileData.whatsapp_number,
      },
    },
  });

  if (error || !data.user) {
    return { data: null, error };
  }

  // Profile is created automatically by database trigger handle_new_user()
  // No need to manually insert profile here

  return { data, error: null };
}