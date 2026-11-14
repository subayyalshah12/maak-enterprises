import {NextResponse} from 'next/server';
import {z} from 'zod';
import {createClient} from '@/lib/supabase/server';
const schema=z.object({
 name:z.string().trim().min(2).max(120),
 email:z.string().trim().email().max(254).or(z.literal('')),
 phone:z.string().trim().min(7).max(40),
 division:z.enum(['general','real-estate','construction','education','property-submission']),
 property_id:z.string().uuid().nullable().optional(),
 message:z.string().trim().min(3).max(5000),
 consent:z.literal(true),
 source:z.string().max(60).default('website'),
 website:z.string().max(200).optional()
});
export async function POST(req:Request){
 const origin=req.headers.get('origin');
 if(!origin||origin!==new URL(req.url).origin)return NextResponse.json({error:'Invalid request origin.'},{status:403});
 const length=Number(req.headers.get('content-length')||0);
 if(length>12000)return NextResponse.json({error:'Request is too large.'},{status:413});
 const parsed=schema.safeParse(await req.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({error:'Please check the form fields.'},{status:400});
 if(parsed.data.website)return NextResponse.json({ok:true},{status:201});
 const {website,...record}=parsed.data;
 const supabase=await createClient();
 if(!supabase)return NextResponse.json({error:'Enquiry service is not configured yet.'},{status:503});
 const {error}=await supabase.from('inquiries').insert(record);
 if(error){console.error('Inquiry insert failed',error.message);return NextResponse.json({error:'Could not save enquiry.'},{status:500});}
 return NextResponse.json({ok:true},{status:201});
}
