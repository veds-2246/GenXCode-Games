import { supabase } from "../../lib/supabase";
import type { Profile, UserRole } from "../../types/domain";

export async function getProfile(userId: string): Promise<{ data: Profile | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, departments(*)")
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
    department_id: data.department_id,
    department: data.departments ? {
      id: data.departments.id,
      name: data.departments.name,
      slug: data.departments.slug,
      is_active: data.departments.is_active,
      created_at: data.departments.created_at,
    } : undefined,
    whatsapp_number: data.whatsapp_number,
    role: data.role as UserRole,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };

  return { data: profile, error: null };
}