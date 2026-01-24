-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users / Profiles Table
-- This table matches your domain User entity
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key, -- user id maps to auth.users if they have login, or generated if not
  full_name text not null,
  role text check (role in ('admin', 'maestro', 'acolito')) default 'acolito',
  phone text,
  birth_date date,
  limitations jsonb default '{"days": [], "sunday_times": []}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Users
alter table public.users enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can insert their own profile."
  on public.users for insert
  with check ( true ); -- Simplified for demo, ideally auth.uid() = id

create policy "Users can update own profile."
  on public.users for update
  using ( true ); -- Simplified

-- 2. Availability Table
create table if not exists public.availabilities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  day_of_week int not null, -- 0-6
  start_time time not null,
  end_time time not null,
  is_unavailable boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Masses Table
create table if not exists public.masses (
  id uuid default uuid_generate_v4() primary key,
  date date not null,
  time time not null,
  type text check (type in ('diaria', 'dominical', 'central')) default 'dominical',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Assignments Table
create table if not exists public.assignments (
  id uuid default uuid_generate_v4() primary key,
  mass_id uuid references public.masses(id) on delete cascade not null,
  -- Note: The column name might be user_id or acolyte_id depending on latest migrations.
  -- Consistency check: usage in code often points to 'user_id'. 
  -- If you face issues, check if this column should be named 'user_id'.
  acolyte_id uuid references public.users(id) on delete cascade not null, 
  status text check (status in ('pendiente', 'confirmado', 'rechazado')) default 'pendiente',
  attendance_status text check (attendance_status in ('pendiente', 'presente', 'ausente', 'justificado')) default 'pendiente',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(mass_id, acolyte_id)
);

-- 5. Events Table
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date_start timestamp with time zone not null,
  time text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Notices Table
create table if not exists public.notices (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Populate some dummy data
insert into public.masses (date, time, type) values
  (current_date + interval '1 day', '08:00', 'dominical'),
  (current_date + interval '1 day', '10:00', 'dominical'),
  (current_date + interval '1 day', '19:00', 'dominical');
