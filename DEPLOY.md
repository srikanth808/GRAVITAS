# GRAVITAS — Deployment Guide

## Prerequisites
- Node.js 18+
- Supabase project created and configured
- GitHub account
- Vercel account

---

## Step 1 — Push to GitHub

```bash
cd gravitas
git init   # (already done by create-next-app)
git add .
git commit -m "feat: initial GRAVITAS build"
git remote add origin https://github.com/YOUR_USERNAME/gravitas.git
git push -u origin main
```

---

## Step 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New → Project**.
3. Select your GitHub repo (`gravitas`).
4. Framework will be auto-detected as **Next.js** — leave defaults.

---

## Step 3 — Add Environment Variables

In the Vercel project settings, add these environment variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |

> [!CAUTION]
> Never commit `.env.local` to Git. It's in `.gitignore` by default.

---

## Step 4 — Deploy

Click **Deploy**. Vercel auto-detects Next.js — no config needed beyond env vars.
Build logs will show `✓ Compiled successfully`.

---

## Step 5 — Copy Deployment URL

After deploy, copy your Vercel URL:
```
https://gravitas-yourusername.vercel.app
```

---

## Step 6 — Add to Supabase Auth

1. Go to your [Supabase Dashboard](https://app.supabase.com).
2. Navigate to **Auth → URL Configuration**.
3. Add your Vercel URL to **Redirect URLs**:
   ```
   https://gravitas-yourusername.vercel.app/**
   ```
4. Set **Site URL** to:
   ```
   https://gravitas-yourusername.vercel.app
   ```

---

## Step 7 — Smoke Test on Live URL

- [ ] Open the Vercel URL — verify redirect to `/login`
- [ ] Register a new account
- [ ] Upload a PDF FIR report
- [ ] Verify classification appears on dashboard
- [ ] Click an incident to view detail page
- [ ] Confirm charts render with data

---

## Step 8 — Database SQL Migrations

Run these in **Supabase SQL Editor** (Dashboard → SQL Editor → New Query):

### Migration 1 — Schema

```sql
create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  role text not null default 'analyst' check (role in ('analyst','admin')),
  created_at timestamptz default now()
);

create table public.incidents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  original_filename text,
  storage_path text,
  extracted_text text,
  crime_type text not null check (crime_type in (
    'Theft','Assault','Fraud','Cybercrime',
    'Vandalism','Drug Offense','Missing Person','Other'
  )),
  severity text not null check (severity in ('Low','Medium','High','Critical')),
  location_text text,
  incident_date date,
  status text not null default 'Open' check (status in (
    'Open','Under Investigation','Closed'
  )),
  confidence_score float default 0,
  uploaded_at timestamptz default now()
);

create table public.entities (
  id uuid default uuid_generate_v4() primary key,
  incident_id uuid references public.incidents(id) on delete cascade not null,
  entity_type text check (entity_type in (
    'suspect','victim','witness','location','weapon','vehicle'
  )),
  entity_value text not null
);

create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  incident_id uuid references public.incidents(id) on delete cascade not null,
  tag text not null
);

create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  metadata jsonb default '{}',
  performed_at timestamptz default now()
);

create index idx_incidents_user_id    on public.incidents(user_id);
create index idx_incidents_crime_type on public.incidents(crime_type);
create index idx_incidents_severity   on public.incidents(severity);
create index idx_incidents_date       on public.incidents(incident_date);
create index idx_entities_incident    on public.entities(incident_id);
create index idx_tags_incident        on public.tags(incident_id);
create index idx_audit_user           on public.audit_logs(user_id);
```

### Migration 2 — RLS Policies

```sql
alter table public.profiles    enable row level security;
alter table public.incidents   enable row level security;
alter table public.entities    enable row level security;
alter table public.tags        enable row level security;
alter table public.audit_logs  enable row level security;

create policy "Users see own profile"
  on public.profiles for all using (auth.uid() = id);

create policy "Analysts see own incidents"
  on public.incidents for all using (auth.uid() = user_id);

create policy "Users see own entities"
  on public.entities for all
  using (incident_id in (select id from public.incidents where user_id = auth.uid()));

create policy "Users see own tags"
  on public.tags for all
  using (incident_id in (select id from public.incidents where user_id = auth.uid()));

create policy "Users see own logs"
  on public.audit_logs for all using (auth.uid() = user_id);
```

### Migration 3 — Trigger

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Analyst'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Migration 4 — Storage Bucket

1. Go to **Storage** in Supabase Dashboard.
2. Click **New bucket** → name: `incident-files`, toggle **Public** OFF.
3. Go to **Policies** tab for the bucket → **New Policy**:
   - Policy name: `Users upload own files`
   - Operation: `INSERT`
   - Expression: `auth.uid()::text = (storage.foldername(name))[1]`

---

> [!NOTE]
> After all steps, share your live Vercel URL in your project submission.
