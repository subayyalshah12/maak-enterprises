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
 source:z.literal('website').default('website'),
 website:z.string().max(200).optional()
});

export async function POST(req:Request){
 const origin=req.headers.get('origin');
 if(!origin||origin!==new URL(req.url).origin)return NextResponse.json({error:'Invalid request origin.'},{status:403});
 if(!req.headers.get('content-type')?.toLowerCase().includes('application/json'))return NextResponse.json({error:'Expected a JSON request.'},{status:415});
 const raw=await req.text();
 if(new TextEncoder().encode(raw).byteLength>12000)return NextResponse.json({error:'Request is too large.'},{status:413});
 let body:unknown;
 try{body=JSON.parse(raw);}catch{return NextResponse.json({error:'Please check the form fields.'},{status:400});}
 const parsed=schema.safeParse(body);
 if(!parsed.success)return NextResponse.json({error:'Please check the form fields.'},{status:400});
 if(parsed.data.website)return NextResponse.json({ok:true},{status:201});
 const {website,...record}=parsed.data;
 void website;
 const supabase=await createClient();
 if(!supabase)return NextResponse.json({error:'Enquiry service is not configured yet.'},{status:503});
 const {error}=await supabase.from('inquiries').insert(record);
 if(error){console.error('Inquiry insert failed',error.message);return NextResponse.json({error:'Could not save enquiry.'},{status:500});}
 return NextResponse.json({ok:true},{status:201});
}
