-- 1. Create the registrations table
create table public.registrations (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  country_code text not null,
  phone_number text not null,
  telegram text not null,
  payment_receipt_path text not null,
  status text default 'pending'::text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Turn on Row Level Security (RLS)
alter table public.registrations enable row level security;

-- 3. Allow anyone to submit a registration (anonymous inserts)
create policy "Allow anonymous inserts" on public.registrations for insert to anon with check (true);

-- 4. Allow the admin (authenticated user) to read and update registrations
create policy "Allow authenticated selects" on public.registrations for select to authenticated using (true);
create policy "Allow authenticated updates" on public.registrations for update to authenticated using (true);

-- 5. Create the storage bucket for receipts
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', true);

-- 6. Storage policies: anyone can upload, anyone can view
create policy "Allow anonymous uploads" on storage.objects for insert to anon with check ( bucket_id = 'receipts' );
create policy "Allow public viewing" on storage.objects for select to public using ( bucket_id = 'receipts' );
