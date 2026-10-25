create table if not exists profiles (
  user_id text primary key,
  full_name text not null default '',
  is_subscribed boolean not null default false,
  subscription_expires_at timestamptz,
  daily_messages_sent integer not null default 0,
  quota_day date not null default current_date,
  age_ok boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id bigserial primary key,
  user_id text not null,
  sender text not null,
  body text not null,
  kind text not null default 'text',
  created_at timestamptz not null default now()
);

create index if not exists messages_user_idx on messages (user_id, id);

create table if not exists story_replies (
  id bigserial primary key,
  user_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists story_replies_user_idx on story_replies (user_id, id);

create table if not exists ratings (
  user_id text primary key,
  stars integer not null,
  created_at timestamptz not null default now()
);

create table if not exists support_notes (
  id bigserial primary key,
  user_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);
