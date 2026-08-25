import { supabase } from "../../lib/supabase";
import type { Profile } from "../../types/domain";

export async function getProfile(userId: string): Promise<{ data: Profile | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: new Error("Profile not found") };
  }

  const profile: Profile = {
    id: data.id,
    name: data.name,
    whatsapp_number: data.whatsapp_number,
    role: data.role,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };

  return { data: profile, error: null };
}