import { AdminShell } from '@/components/admin-shell'; import { requireAdmin } from '@/lib/supabase/auth'; import { ProjectEditor } from '@/components/project-editor';
export default async function NewProject(){await requireAdmin();return <AdminShell title="Add construction project"><ProjectEditor/></AdminShell>}
