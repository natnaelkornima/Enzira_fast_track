-- =========================================================
-- ENZIRA BEGENA TRAINING - SUPABASE DATABASE & STORAGE SETUP
-- Run this entire script in your Supabase Project's SQL Editor
-- =========================================================

-- 1. Create the registrations table (if not already existing)
create table if not exists public.registrations (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  country_code text not null,
  phone_number text not null,
  telegram text not null,
  payment_receipt_path text not null,
  status text default 'pending'::text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Turn on Row Level Security (RLS) on registrations
alter table public.registrations enable row level security;

-- Drop existing registration policies to avoid "already exists" errors
drop policy if exists "Allow anonymous inserts" on public.registrations;
drop policy if exists "Allow public inserts" on public.registrations;
drop policy if exists "Allow anonymous selects" on public.registrations;
drop policy if exists "Allow public selects" on public.registrations;
drop policy if exists "Allow authenticated selects" on public.registrations;
drop policy if exists "Allow authenticated updates" on public.registrations;
drop policy if exists "Allow authenticated deletes" on public.registrations;

-- 3. Allow anyone (anon + authenticated) to submit a registration
create policy "Allow public inserts" on public.registrations 
  for insert to public 
  with check (true);

-- 4. Allow anyone to look up their registration status
create policy "Allow public selects" on public.registrations 
  for select to public 
  using (true);

-- 5. Allow admin (authenticated user) to read, update and delete registrations
create policy "Allow authenticated selects" on public.registrations 
  for select to authenticated 
  using (true);

create policy "Allow authenticated updates" on public.registrations 
  for update to authenticated 
  using (true)
  with check (true);

create policy "Allow authenticated deletes" on public.registrations 
  for delete to authenticated 
  using (true);

-- =========================================================
-- 6. STORAGE SETUP FOR PAYMENT RECEIPTS ('receipts' bucket)
-- =========================================================

-- Create the 'receipts' storage bucket if it does not exist (public = true)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
values (
  'receipts', 
  'receipts', 
  true, 
  10485760, -- 10MB limit
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set 
  public = true,
  file_size_limit = 10485760;

-- Ensure RLS is enabled on storage.objects
alter table storage.objects enable row level security;

-- Drop existing storage policies to ensure clean idempotent setup
drop policy if exists "Allow anonymous uploads" on storage.objects;
drop policy if exists "Allow public viewing" on storage.objects;
drop policy if exists "Allow public uploads to receipts" on storage.objects;
drop policy if exists "Allow public selects on receipts" on storage.objects;
drop policy if exists "Allow public updates on receipts" on storage.objects;

-- Allow any visitor (anon & authenticated) to upload receipts to the 'receipts' bucket
create policy "Allow public uploads to receipts" on storage.objects 
  for insert to public 
  with check ( bucket_id = 'receipts' );

-- Allow anyone to view images in the 'receipts' bucket
create policy "Allow public selects on receipts" on storage.objects 
  for select to public 
  using ( bucket_id = 'receipts' );

-- Allow updates/upserts to receipts
create policy "Allow public updates on receipts" on storage.objects 
  for update to public 
  using ( bucket_id = 'receipts' )
  with check ( bucket_id = 'receipts' );
