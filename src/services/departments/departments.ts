import { supabase } from "../../lib/supabase";
import type { Department } from "../../types/domain";

export async function getDepartments(): Promise<{ data: Department[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    return { data: [], error };
  }

  const departments: Department[] = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    is_active: row.is_active,
    created_at: row.created_at,
  }));

  return { data: departments, error: null };
}

export async function getDepartmentBySlug(slug: string): Promise<{ data: Department | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    return { data: null, error };
  }

  const department: Department = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    is_active: data.is_active,
    created_at: data.created_at,
  };

  return { data: department, error: null };
}