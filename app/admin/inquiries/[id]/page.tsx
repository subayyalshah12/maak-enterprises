import { notFound } from 'next/navigation'; import { AdminShell } from '@/components/admin-shell'; import { requireAdmin } from '@/lib/supabase/auth'; import { InquiryDetail } from '@/components/inquiry-detail';
type Props={params:Promise<{id:string}>};
export default async function InquiryPage({params}:Props){const {id}=await params;const {supabase}=await requireAdmin();const {data}=await supabase.from('inquiries').select('*').eq('id',id).maybeSingle();if(!data)notFound();return <AdminShell title="Inquiry detail"><InquiryDetail inquiry={data}/></AdminShell>}
