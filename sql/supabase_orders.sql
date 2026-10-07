-- Dopamina Ecommerce — schema da base de pedidos (Camada 2)
-- Como aplicar: Supabase Dashboard → SQL Editor → colar e rodar.
-- Secrets necessários depois: SUPABASE_URL, SUPABASE_SERVICE_KEY (export diário),
-- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (site).

create table if not exists orders (
  order_id        text primary key,          -- mesmo valor do code (SIM-YYYYMMDD-XXXX)
  code            text unique not null,      -- SIM-20261006-8F3A
  user_id         text,                      -- email ou "anon"
  user_pseudo_id  text,                      -- client_id do GA4 (costura web x pedidos)
  session_id      text,                      -- session_id do GA4 quando disponível
  created_at      timestamptz not null default now(),
  value_simulated numeric(12, 2) not null,   -- valor "gasto" fictício (BRL)
  items_count     int not null default 0,
  coupon          text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_content     text,
  referrer        text,
  landing_page    text,
  platform        text not null default 'web', -- web | twa | android
  checkout_ms     int,
  status          text not null default 'confirmed' -- confirmed | simulated_refund
);

create table if not exists order_items (
  id       bigint generated always as identity primary key,
  order_id text not null references orders (order_id) on delete cascade,
  sku      text not null,
  name     text not null,
  category text,
  price    numeric(12, 2) not null,
  qty      int not null default 1
);

create index if not exists idx_orders_created on orders (created_at desc);
create index if not exists idx_orders_pseudo on orders (user_pseudo_id);
create index if not exists idx_items_order on order_items (order_id);

-- RLS: escrita anônima só via INSERT (o site usa a anon key);
-- leitura e administração pela service_role (export diário).
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "anon insert orders" on orders;
create policy "anon insert orders" on orders
  for insert to anon with check (true);

drop policy if exists "anon insert items" on order_items;
create policy "anon insert items" on order_items
  for insert to anon with check (true);
