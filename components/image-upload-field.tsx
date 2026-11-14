'use client';
import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {isSupabaseConfigured} from '@/lib/supabase/config';

const allowed = ['image/jpeg','image/png','image/webp','image/avif'];
const maxBytes = 10 * 1024 * 1024;

export function ImageUploadField({name,initialUrls=[]}:{name:string;initialUrls?:string[]}){
 const [urls,setUrls]=useState(initialUrls.join('\n'));
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 async function upload(event:React.ChangeEvent<HTMLInputElement>){
  const files=Array.from(event.target.files??[]);
  if(!files.length)return;
  if(!isSupabaseConfigured){setMessage('Supabase is not configured. You can add approved image URLs manually for local UI work.');event.target.value='';return;}
  setBusy(true);setMessage('');
  try{
   const supabase=createClient();
   const uploaded:string[]=[];
   for(const file of files){
    if(!allowed.includes(file.type))throw new Error('Use JPG, PNG, WebP or AVIF images only.');
    if(file.size>maxBytes)throw new Error('Each image must be 10 MB or smaller.');
    const safeName=file.name.toLowerCase().replace(/[^a-z0-9.-]+/g,'-').slice(-100);
    const path=`property-media/${crypto.randomUUID()}-${safeName}`;
    const {error}=await supabase.storage.from('maak-public-media').upload(path,file,{contentType:file.type,upsert:false});
    if(error)throw new Error(error.message);
    uploaded.push(supabase.storage.from('maak-public-media').getPublicUrl(path).data.publicUrl);
   }
   setUrls(current=>[current,...uploaded].filter(Boolean).join('\n'));
   setMessage(`${uploaded.length} image(s) uploaded. Save the form to attach these URLs to the record.`);
  }catch(error){setMessage(error instanceof Error?error.message:'Upload failed.');}
  finally{setBusy(false);event.target.value='';}
 }
 return <div className="image-upload-field">
  <label>Upload images (JPG, PNG, WebP, AVIF; max 10 MB each)
   <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={!isSupabaseConfigured||busy} onChange={upload}/>
  </label>
  {!isSupabaseConfigured&&<p className="muted">File upload activates after Supabase is configured and an authorised admin session is available. You can still paste image URLs below.</p>}
  <label>Image URLs (one per line)<textarea name={name} rows={4} value={urls} onChange={event=>setUrls(event.target.value)}/></label>
  {busy&&<p role="status">Uploading…</p>}
  {message&&<p role="status">{message}</p>}
 </div>;
}
