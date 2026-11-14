'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/auth';

const value = (form: FormData, key: string) => String(form.get(key) ?? '').trim();
const nullable = (input: string) => input || null;
const imageUrls = (input: string) => input.split(/\r?\n/).map((url) => url.trim()).filter(Boolean).slice(0, 12);
const slugify = (input: string) => input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120);

function managedMediaPath(url: string): string | null {
  try {
    const parsed = new URL(url);
    const marker = '/storage/v1/object/public/maak-public-media/';
    const index = parsed.pathname.indexOf(marker);
    if (index < 0) return null;
    const path = decodeURIComponent(parsed.pathname.slice(index + marker.length));
    return path && !path.split('/').some((part) => part === '..') ? path : null;
  } catch {
    return null;
  }
}

async function removeDetachedMedia(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  previous: string[],
  current: string[],
) {
  const retained = new Set(current);
  const paths = previous.filter((url) => !retained.has(url)).map(managedMediaPath).filter((path): path is string => Boolean(path));
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from('maak-public-media').remove(paths);
  if (error) console.error('Could not remove detached MAAK media:', error.message);
}

function validateNonNegativeInteger(input: string, field: string): number | null {
  if (!input) return null;
  const parsed = Number(input);
  if (!Number.isSafeInteger(parsed) || parsed < 0) throw new Error(`${field} must be a non-negative whole number.`);
  return parsed;
}

export async function setPropertyStatus(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(form, 'id');
  const status = value(form, 'status');
  if (!id || !['available', 'sold', 'archived'].includes(status)) throw new Error('Invalid property status.');
  const { error } = await supabase.from('properties')
    .update({ status, published_at: status === 'available' ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) throw new Error('Could not update property.');
  revalidatePath('/admin/properties');
  revalidatePath('/real-estate');
  revalidatePath('/');
}

export async function saveProperty(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(form, 'id');
  const title = value(form, 'title');
  const slug = slugify(value(form, 'slug') || title);
  const location = value(form, 'location');
  const size = value(form, 'size');
  const propertyType = value(form, 'property_type');
  const purpose = value(form, 'purpose');
  const priceInput = value(form, 'price');
  const price = priceInput ? Number(priceInput) : null;
  const bedrooms = validateNonNegativeInteger(value(form, 'bedrooms'), 'Bedrooms');
  const bathrooms = validateNonNegativeInteger(value(form, 'bathrooms'), 'Bathrooms');

  if (!title || !slug || !location || !size || !propertyType) throw new Error('Complete all required property fields.');
  if (!['sale', 'rent'].includes(purpose)) throw new Error('Choose sale or rent.');
  if (price !== null && (!Number.isFinite(price) || price < 0)) throw new Error('Price must be non-negative.');

  const urls = imageUrls(value(form, 'image_urls'));
  const publish = form.get('publish') === 'on';
  const record = {
    title, slug, property_type: propertyType, purpose, price,
    currency: value(form, 'currency') || 'PKR', location, size,
    bedrooms, bathrooms, description: nullable(value(form, 'description')),
    image_urls: urls, featured: form.get('featured') === 'on',
    status: publish ? 'available' : 'archived',
    published_at: publish ? new Date().toISOString() : null,
  };

  let previousUrls: string[] = [];
  if (id) {
    const { data, error } = await supabase.from('properties').select('image_urls').eq('id', id).maybeSingle();
    if (error || !data) throw new Error('Could not find the property to update.');
    previousUrls = data.image_urls ?? [];
    const { error: updateError } = await supabase.from('properties').update(record).eq('id', id);
    if (updateError) throw new Error('Could not save property. Check the unique slug and entered values.');
  } else {
    const { error } = await supabase.from('properties').insert(record);
    if (error) throw new Error('Could not save property. Check the unique slug and entered values.');
  }

  await removeDetachedMedia(supabase, previousUrls, urls);
  revalidatePath('/admin/properties');
  revalidatePath('/real-estate');
  revalidatePath('/');
  redirect('/admin/properties');
}

export async function saveProject(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(form, 'id');
  const title = value(form, 'title');
  const slug = slugify(value(form, 'slug') || title);
  const division = value(form, 'division');
  const location = value(form, 'location');

  if (!title || !slug || !location || !['construction', 'real-estate', 'education'].includes(division)) {
    throw new Error('Complete all required project fields.');
  }

  const urls = imageUrls(value(form, 'image_urls'));
  const record = {
    title, slug, division, location,
    status: value(form, 'status') || 'In progress',
    description: nullable(value(form, 'description')),
    image_urls: urls,
    is_published: form.get('is_published') === 'on',
  };

  let previousUrls: string[] = [];
  if (id) {
    const { data, error } = await supabase.from('construction_projects').select('image_urls').eq('id', id).maybeSingle();
    if (error || !data) throw new Error('Could not find the project to update.');
    previousUrls = data.image_urls ?? [];
    const { error: updateError } = await supabase.from('construction_projects').update(record).eq('id', id);
    if (updateError) throw new Error('Could not save project. Check the unique slug and entered values.');
  } else {
    const { error } = await supabase.from('construction_projects').insert(record);
    if (error) throw new Error('Could not save project. Check the unique slug and entered values.');
  }

  await removeDetachedMedia(supabase, previousUrls, urls);
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/construction');
  revalidatePath('/');
  redirect('/admin/projects');
}

export async function setProjectStatus(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(form, 'id');
  const status = value(form, 'status');
  if (!id || !['draft', 'published', 'archived'].includes(status)) throw new Error('Invalid project status.');
  const record = {
    is_published: status === 'published',
    status: status === 'archived' ? 'Archived' : status === 'draft' ? 'Draft' : 'Published',
  };
  const { error } = await supabase.from('construction_projects').update(record).eq('id', id);
  if (error) throw new Error('Could not update project.');
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/construction');
  revalidatePath('/');
}

export async function updateInquiry(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(form, 'id');
  const status = value(form, 'status');
  const followUp = value(form, 'follow_up_at');
  if (!id || !['new', 'contacted', 'qualified', 'closed', 'spam'].includes(status)) {
    throw new Error('Invalid enquiry update.');
  }
  const followUpDate = followUp ? new Date(followUp) : null;
  if (followUpDate && Number.isNaN(followUpDate.getTime())) throw new Error('Enter a valid follow-up date.');
  const { error } = await supabase.from('inquiries').update({
    status,
    internal_notes: nullable(value(form, 'internal_notes')),
    follow_up_at: followUpDate?.toISOString() ?? null,
  }).eq('id', id);
  if (error) throw new Error('Could not update enquiry.');
  revalidatePath('/admin/inquiries');
  revalidatePath(`/admin/inquiries/${id}`);
  redirect('/admin/inquiries');
}
