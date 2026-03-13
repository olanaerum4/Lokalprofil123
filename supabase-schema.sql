-- LokalProfil – kjør dette i Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Businesses (bruk auth user id som primærnøkkel for enkelhet)
create table if not exists businesses (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  google_review_link text,
  created_at timestamptz default now()
);

-- Customers
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  phone text not null,
  appointment_time timestamptz not null,
  reminded_24h boolean default false,
  reminded_2h boolean default false,
  review_requested boolean default false,
  created_at timestamptz default now()
);

-- Feedback
create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  rating int check (rating >= 1 and rating <= 5),
  message text,
  created_at timestamptz default now()
);

-- Messages (SMS inbox/outbox)
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  customer_id uuid references customers(id) on delete cascade,
  direction text check (direction in ('in', 'out')) not null,
  body text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table businesses enable row level security;
alter table customers enable row level security;
alter table feedback enable row level security;
alter table messages enable row level security;

-- Policies: brukere ser kun sin egen data
create policy "businesses_own" on businesses for all using (id = auth.uid());
create policy "customers_own" on customers for all using (business_id = auth.uid());
create policy "feedback_own" on feedback for all using (business_id = auth.uid());
create policy "messages_own" on messages for all using (business_id = auth.uid());

-- Realtime for meldinger
alter publication supabase_realtime add table messages;

-- Indekser
create index if not exists customers_business_id_idx on customers(business_id);
create index if not exists customers_appointment_time_idx on customers(appointment_time);
create index if not exists feedback_business_id_idx on feedback(business_id);
create index if not exists messages_customer_id_idx on messages(customer_id);
create index if not exists messages_business_id_idx on messages(business_id);
