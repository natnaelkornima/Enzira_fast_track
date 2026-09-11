-- =========================================================
-- ENZIRA BEGENA TRAINING - SUPABASE DATABASE SETUP
-- Run this script in your Supabase Project's SQL Editor
-- =========================================================

-- 1. Create the registrations table (if not already existing)
create table if not exists public.registrations (
  id uuid default gen_random_uuid() primary key,
  name text,
  phone_number text not null,
  username text,
  uploaded_screenshot text,
  -- Additional fields for international formatting & status tracking
  full_name text,
  country_code text default '+251',
  telegram text,
  payment_receipt_path text,
  status text default 'pending'::text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all requested columns exist even if the table was previously created
alter table public.registrations add column if not exists name text;
alter table public.registrations add column if not exists phone_number text;
alter table public.registrations add column if not exists username text;
alter table public.registrations add column if not exists uploaded_screenshot text;
alter table public.registrations add column if not exists full_name text;
alter table public.registrations add column if not exists country_code text default '+251';
alter table public.registrations add column if not exists telegram text;
alter table public.registrations add column if not exists payment_receipt_path text;
alter table public.registrations add column if not exists status text default 'pending';
alter table public.registrations add column if not exists created_at timestamp with time zone default timezone('utc'::text, now());

-- 2. Turn on Row Level Security (RLS) on registrations
alter table public.registrations enable row level security;

-- Drop existing registration policies to avoid conflicts
drop policy if exists "Allow anonymous inserts" on public.registrations;
drop policy if exists "Allow public inserts" on public.registrations;
drop policy if exists "Allow anonymous selects" on public.registrations;
drop policy if exists "Allow public selects" on public.registrations;
drop policy if exists "Allow authenticated selects" on public.registrations;
drop policy if exists "Allow authenticated updates" on public.registrations;
drop policy if exists "Allow authenticated deletes" on public.registrations;
drop policy if exists "Allow public updates" on public.registrations;
drop policy if exists "Allow public deletes" on public.registrations;

-- 3. Allow anyone (anon + authenticated) to submit a registration
create policy "Allow public inserts" on public.registrations 
  for insert to public 
  with check (true);

-- 4. Allow anyone to look up their registration status
create policy "Allow public selects" on public.registrations 
  for select to public 
  using (true);

-- 5. Allow admin to read, update and delete registrations
create policy "Allow public updates" on public.registrations 
  for update to public 
  using (true)
  with check (true);

create policy "Allow public deletes" on public.registrations 
  for delete to public 
  using (true);

-- 6. Insert 'receipts' bucket into storage.buckets (safe insert)
insert into storage.buckets (id, name, public, file_size_limit)
values ('receipts', 'receipts', true, 10485760)
on conflict (id) do update set public = true;
