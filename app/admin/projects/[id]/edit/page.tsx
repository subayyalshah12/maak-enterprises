import { notFound } from 'next/navigation'; import { AdminShell } from '@/components/admin-shell'; import { requireAdmin } from '@/lib/supabase/auth'; import { ProjectEditor } from '@/components/project-editor';
type Props={params:Promise<{id:string}>};
export default async function EditProject({params}:Props){const {id}=await params;const {supabase}=await requireAdmin();const {data}=await supabase.from('construction_projects').select('*').eq('id',id).maybeSingle();if(!data)notFound();return <AdminShell title="Edit project"><ProjectEditor project={data}/></AdminShell>}
