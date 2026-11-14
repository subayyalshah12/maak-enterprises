-- MAAK Enterprises initial schema and least-privilege policies.
-- Apply to a NEW Supabase project using the SQL editor or Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_maak_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_maak_admin() from public, anon;
grant execute on function public.is_maak_admin() to authenticated;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  property_type text not null,
  purpose text not null default 'sale' check (purpose in ('sale', 'rent')),
  price numeric(14,2) check (price is null or price >= 0),
  currency text not null default 'PKR',
  location text not null,
  size text not null,
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  description text,
  image_urls text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'archived' check (status in ('available', 'sold', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_public_idx
  on public.properties(status, published_at, featured, created_at desc);

create table if not exists public.construction_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  division text not null default 'construction'
    check (division in ('construction', 'real-estate', 'education')),
  location text not null,
  status text not null default 'In progress',
  description text,
  image_urls text[] not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_idx
  on public.construction_projects(is_published, created_at desc);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null default ''
    check (
      char_length(email) <= 254
      and (email = '' or (email !~ '[[:space:]]' and email ~ '^[^@]+@[^@]+[.][^@]+$'))
    ),
  phone text not null check (char_length(phone) between 7 and 40),
  division text not null
    check (division in ('general', 'real-estate', 'construction', 'education', 'property-submission')),
  property_id uuid references public.properties(id) on delete set null,
  message text not null check (char_length(message) between 3 and 5000),
  consent boolean not null default false check (consent = true),
  source text not null default 'website' check (source = 'website'),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'closed', 'spam')),
  internal_notes text,
  follow_up_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists inquiries_created_idx on public.inquiries(created_at desc);
create index if not exists inquiries_status_idx on public.inquiries(status, created_at desc);

alter table public.admin_users enable row level security;
alter table public.properties enable row level security;
alter table public.construction_projects enable row level security;
alter table public.inquiries enable row level security;

-- Reset API-role grants on these application tables, then grant only what is needed.
revoke all on public.admin_users from anon, authenticated;
revoke all on public.properties from anon, authenticated;
revoke all on public.construction_projects from anon, authenticated;
revoke all on public.inquiries from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on public.properties, public.construction_projects to anon, authenticated;
grant insert, update, delete on public.properties, public.construction_projects to authenticated;

grant select on public.admin_users to authenticated;

grant select, update on public.inquiries to authenticated;
grant insert (name, email, phone, division, property_id, message, consent, source)
  on public.inquiries to anon, authenticated;

drop policy if exists "Admins can read admin membership" on public.admin_users;
create policy "Admins can read admin membership"
  on public.admin_users for select to authenticated
  using (public.is_maak_admin());

drop policy if exists "Public can read published properties" on public.properties;
create policy "Public can read published properties"
  on public.properties for select to anon, authenticated
  using (status = 'available' and published_at is not null);

drop policy if exists "Admins manage properties" on public.properties;
create policy "Admins manage properties"
  on public.properties for all to authenticated
  using (public.is_maak_admin())
  with check (public.is_maak_admin());

drop policy if exists "Public can read published projects" on public.construction_projects;
create policy "Public can read published projects"
  on public.construction_projects for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Admins manage projects" on public.construction_projects;
create policy "Admins manage projects"
  on public.construction_projects for all to authenticated
  using (public.is_maak_admin())
  with check (public.is_maak_admin());

-- Visitors may insert only the column-level grant above. Staff-only fields cannot be set.
drop policy if exists "Visitors submit consented inquiries" on public.inquiries;
create policy "Visitors submit consented inquiries"
  on public.inquiries for insert to anon, authenticated
  with check (
    consent = true
    and status = 'new'
    and internal_notes is null
    and follow_up_at is null
  );

drop policy if exists "Admins read inquiries" on public.inquiries;
create policy "Admins read inquiries"
  on public.inquiries for select to authenticated
  using (public.is_maak_admin());

drop policy if exists "Admins update inquiries" on public.inquiries;
create policy "Admins update inquiries"
  on public.inquiries for update to authenticated
  using (public.is_maak_admin())
  with check (public.is_maak_admin());

-- Publicly readable, size- and MIME-restricted images. Only approved admins can write.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'maak-public-media',
  'maak-public-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view MAAK media" on storage.objects;
create policy "Public can view MAAK media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'maak-public-media');

drop policy if exists "Admins upload MAAK media" on storage.objects;
create policy "Admins upload MAAK media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'maak-public-media' and public.is_maak_admin());

drop policy if exists "Admins update MAAK media" on storage.objects;
create policy "Admins update MAAK media"
  on storage.objects for update to authenticated
  using (bucket_id = 'maak-public-media' and public.is_maak_admin())
  with check (bucket_id = 'maak-public-media' and public.is_maak_admin());

drop policy if exists "Admins delete MAAK media" on storage.objects;
create policy "Admins delete MAAK media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'maak-public-media' and public.is_maak_admin());

-- After creating the first staff account in Supabase Auth, manually insert its UUID:
-- insert into public.admin_users(user_id) values ('YOUR_AUTH_USER_UUID');
-- Never grant administrator membership through public signup.
