import { createClient } from './server';
export type Property = { id: string; title: string; slug: string; property_type: string; purpose: string; price: number | null; currency: string; location: string; size: string; bedrooms: number | null; bathrooms: number | null; description: string | null; image_urls: string[]; featured: boolean; status: string };
export type Project = { id: string; title: string; slug: string; location: string; status: string; description: string | null; image_urls: string[]; division: string };
export async function getPublishedProperties() {
  const supabase = await createClient(); if (!supabase) return [] as Property[];
  const { data, error } = await supabase.from('properties').select('*').eq('status','available').not('published_at','is',null).order('featured',{ascending:false}).order('created_at',{ascending:false});
  if (error) { console.error('Property query failed', error.message); return [] as Property[]; }
  return (data ?? []) as Property[];
}
export async function getProperty(slug: string) {
  const supabase = await createClient(); if (!supabase) return null;
  const { data } = await supabase.from('properties').select('*').eq('slug',slug).eq('status','available').not('published_at','is',null).maybeSingle();
  return data as Property | null;
}
export async function getPublishedProjects() {
  const supabase = await createClient(); if (!supabase) return [] as Project[];
  const { data, error } = await supabase.from('construction_projects').select('*').eq('is_published',true).order('created_at',{ascending:false});
  if (error) { console.error('Project query failed', error.message); return [] as Project[]; }
  return (data ?? []) as Project[];
}
export async function getProject(slug: string) {
  const supabase = await createClient(); if (!supabase) return null;
  const { data } = await supabase.from('construction_projects').select('*').eq('slug',slug).eq('is_published',true).maybeSingle();
  return data as Project | null;
}
