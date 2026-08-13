-- Habiliter l'extension UUID
create extension if not exists "uuid-ossp";

-- Table des groupes
create table if not exists groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contribution_amount numeric not null,
  currency text default 'FCFA',
  frequency text not null,
  cycle_number integer default 1,
  total_pot numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des membres du groupe
create table if not exists members (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references groups(id) on delete cascade,
  user_id uuid, -- lien optionnel vers l'authentification Supabase
  name text not null,
  phone text not null,
  avatar text default '👤',
  position integer not null,
  role text default 'member',
  paid_count integer default 0,
  total_due numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des réunions
create table if not exists meetings (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references groups(id) on delete cascade,
  meeting_number integer not null,
  date text not null,
  location text not null,
  beneficiary_id text not null,
  beneficiary_name text not null,
  pot_amount numeric not null,
  status text default 'in_progress',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des cotisations individuelles
create table if not exists contributions (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid references meetings(id) on delete cascade,
  member_id text not null,
  member_name text not null,
  amount numeric not null,
  status text default 'pending',
  paid_at text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table des demandes d'adhésion
create table if not exists join_requests (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references groups(id) on delete cascade,
  group_name text not null,
  member_name text not null,
  phone text not null,
  email text,
  momo_number text not null,
  momo_provider text not null,
  message text,
  status text default 'pending',
  requested_at text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
