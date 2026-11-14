import { AdminShell } from '@/components/admin-shell'; import { requireAdmin } from '@/lib/supabase/auth'; import { PropertyEditor } from '@/components/property-editor';
export default async function NewProperty(){const {supabase}=await requireAdmin();return <AdminShell title="Add property"><PropertyEditor/></AdminShell>}
