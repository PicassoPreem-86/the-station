-- The Station Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROPERTIES
-- ============================================
create table properties (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  city text not null,
  state text not null,
  zip text not null,
  photo_url text,
  unit_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- UNITS
-- ============================================
create type unit_status as enum ('available', 'occupied', 'maintenance', 'offline');
create type unit_type as enum ('studio', '1br', '2br', '3br', '4br', 'penthouse');

create table units (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  unit_number text not null,
  unit_type unit_type not null default 'studio',
  square_feet integer not null default 0,
  floor integer not null default 1,
  rent_price numeric(10,2) not null default 0,
  status unit_status not null default 'available',
  bedrooms integer not null default 0,
  bathrooms numeric(3,1) not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(property_id, unit_number)
);

-- ============================================
-- STAFF MEMBERS
-- ============================================
create type staff_role as enum ('admin', 'property_manager', 'leasing_agent', 'maintenance_staff');

create table staff_members (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  role staff_role not null default 'property_manager',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, property_id)
);

-- ============================================
-- TENANTS
-- ============================================
create type tenant_status as enum ('applicant', 'approved', 'active', 'notice_given', 'moved_out');

create table tenants (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null default '',
  status tenant_status not null default 'applicant',
  unit_id uuid references units(id) on delete set null,
  property_id uuid not null references properties(id) on delete cascade,
  emergency_contact_name text,
  emergency_contact_phone text,
  move_in_date date,
  move_out_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- LEASES
-- ============================================
create type lease_status as enum ('draft', 'active', 'expiring_soon', 'expired', 'renewed');

create table leases (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references units(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  monthly_rent numeric(10,2) not null,
  deposit numeric(10,2) not null default 0,
  status lease_status not null default 'draft',
  terms text,
  document_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- PAYMENTS
-- ============================================
create type payment_status as enum ('paid', 'pending', 'overdue', 'partial');
create type payment_method as enum ('cash', 'check', 'ach', 'card');

create table payments (
  id uuid primary key default uuid_generate_v4(),
  lease_id uuid not null references leases(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  amount numeric(10,2) not null,
  status payment_status not null default 'pending',
  method payment_method not null default 'check',
  payment_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- MAINTENANCE REQUESTS
-- ============================================
create type maintenance_status as enum ('submitted', 'in_progress', 'scheduled', 'completed', 'closed');
create type maintenance_priority as enum ('emergency', 'high', 'medium', 'low');

create table maintenance_requests (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references units(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  assigned_to uuid references staff_members(id) on delete set null,
  category text not null,
  description text not null,
  priority maintenance_priority not null default 'medium',
  status maintenance_status not null default 'submitted',
  photos text[] default '{}',
  internal_notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- ANNOUNCEMENTS
-- ============================================
create table announcements (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  author_id uuid not null references staff_members(id) on delete cascade,
  title text not null,
  body text not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_units_property on units(property_id);
create index idx_units_status on units(status);
create index idx_tenants_property on tenants(property_id);
create index idx_tenants_status on tenants(status);
create index idx_tenants_unit on tenants(unit_id);
create index idx_leases_property on leases(property_id);
create index idx_leases_tenant on leases(tenant_id);
create index idx_leases_unit on leases(unit_id);
create index idx_leases_status on leases(status);
create index idx_payments_lease on payments(lease_id);
create index idx_payments_tenant on payments(tenant_id);
create index idx_payments_property on payments(property_id);
create index idx_maintenance_unit on maintenance_requests(unit_id);
create index idx_maintenance_tenant on maintenance_requests(tenant_id);
create index idx_maintenance_property on maintenance_requests(property_id);
create index idx_maintenance_status on maintenance_requests(status);
create index idx_announcements_property on announcements(property_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_properties_updated_at before update on properties for each row execute function update_updated_at();
create trigger trg_units_updated_at before update on units for each row execute function update_updated_at();
create trigger trg_staff_updated_at before update on staff_members for each row execute function update_updated_at();
create trigger trg_tenants_updated_at before update on tenants for each row execute function update_updated_at();
create trigger trg_leases_updated_at before update on leases for each row execute function update_updated_at();
create trigger trg_payments_updated_at before update on payments for each row execute function update_updated_at();
create trigger trg_maintenance_updated_at before update on maintenance_requests for each row execute function update_updated_at();
create trigger trg_announcements_updated_at before update on announcements for each row execute function update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table properties enable row level security;
alter table units enable row level security;
alter table staff_members enable row level security;
alter table tenants enable row level security;
alter table leases enable row level security;
alter table payments enable row level security;
alter table maintenance_requests enable row level security;
alter table announcements enable row level security;

-- Staff can access their property's data
create policy "Staff access properties" on properties for all using (
  exists (select 1 from staff_members where staff_members.property_id = properties.id and staff_members.user_id = auth.uid())
);

create policy "Staff access units" on units for all using (
  exists (select 1 from staff_members where staff_members.property_id = units.property_id and staff_members.user_id = auth.uid())
);

create policy "Staff access tenants" on tenants for all using (
  exists (select 1 from staff_members where staff_members.property_id = tenants.property_id and staff_members.user_id = auth.uid())
);

create policy "Staff access leases" on leases for all using (
  exists (select 1 from staff_members where staff_members.property_id = leases.property_id and staff_members.user_id = auth.uid())
);

create policy "Staff access payments" on payments for all using (
  exists (select 1 from staff_members where staff_members.property_id = payments.property_id and staff_members.user_id = auth.uid())
);

create policy "Staff access maintenance" on maintenance_requests for all using (
  exists (select 1 from staff_members where staff_members.property_id = maintenance_requests.property_id and staff_members.user_id = auth.uid())
);

create policy "Staff access announcements" on announcements for all using (
  exists (select 1 from staff_members where staff_members.property_id = announcements.property_id and staff_members.user_id = auth.uid())
);

create policy "Staff access staff" on staff_members for all using (
  user_id = auth.uid()
);

-- ============================================
-- SEED DATA: The Station at East Orange
-- ============================================
insert into properties (name, address, city, state, zip, unit_count)
values ('The Station at East Orange', '384 William St', 'East Orange', 'NJ', '07018', 120);
