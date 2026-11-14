import { redirect } from 'next/navigation';
import { createClient } from './server';
export async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) redirect('/admin/login?setup=required');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();
  if (!admin) redirect('/admin/login?unauthorized=1');
  return { supabase, user };
}
