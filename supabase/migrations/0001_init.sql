-- Kuza Resume — initial schema
-- Run in Supabase SQL editor, or via `supabase db push` if you wire up the CLI.

-- Profiles: one row per auth user, created on signup via trigger.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile row on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Resumes: one logical resume per row (a user may have several).
create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled resume',
  template_id text not null default 'classic',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index resumes_user_id_idx on public.resumes(user_id);

alter table public.resumes enable row level security;

create policy "resumes_select_own" on public.resumes
  for select using (auth.uid() = user_id);

create policy "resumes_insert_own" on public.resumes
  for insert with check (auth.uid() = user_id);

create policy "resumes_update_own" on public.resumes
  for update using (auth.uid() = user_id);

create policy "resumes_delete_own" on public.resumes
  for delete using (auth.uid() = user_id);

-- Auto-update updated_at on any change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger resumes_set_updated_at
  before update on public.resumes
  for each row execute function public.set_updated_at();

-- Resume versions: a paid snapshot of resume data at the moment of payment.
-- Users can edit the live `resumes.data` freely; downloads always pull from a
-- paid version. A new version is created at each successful payment.
create table public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id text not null,
  data jsonb not null,
  paid_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days',
  payment_id uuid,
  created_at timestamptz not null default now()
);

create index resume_versions_resume_id_idx on public.resume_versions(resume_id);
create index resume_versions_user_id_idx on public.resume_versions(user_id);

alter table public.resume_versions enable row level security;

create policy "resume_versions_select_own" on public.resume_versions
  for select using (auth.uid() = user_id);

-- Inserts happen only via the server using the service role key (after webhook
-- verification). No insert policy for authenticated users on purpose.

-- Payments: one row per Flutterwave transaction attempt.
create type payment_status as enum ('pending', 'successful', 'failed', 'cancelled');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid not null references public.resumes(id) on delete cascade,
  tx_ref text not null unique,
  flw_transaction_id text,
  amount numeric(10,2) not null,
  currency text not null default 'KES',
  status payment_status not null default 'pending',
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_user_id_idx on public.payments(user_id);
create index payments_resume_id_idx on public.payments(resume_id);

alter table public.payments enable row level security;

create policy "payments_select_own" on public.payments
  for select using (auth.uid() = user_id);

-- Inserts and updates happen via the server (service role) only.

create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- Link the resume_versions.payment_id back to the payment that created it.
alter table public.resume_versions
  add constraint resume_versions_payment_fk
  foreign key (payment_id) references public.payments(id) on delete set null;
