import type { Property, Unit, Tenant, Lease, Payment, MaintenanceRequest } from "@/types";

export const demoProperty: Property = {
  id: "prop-001",
  name: "The Station at East Orange",
  address: "384 William St",
  city: "East Orange",
  state: "NJ",
  zip: "07018",
  photo_url: null,
  unit_count: 120,
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2024-01-15T00:00:00Z",
};

export const demoUnits: Unit[] = [
  { id: "unit-001", property_id: "prop-001", unit_number: "101", unit_type: "studio", square_feet: 550, floor: 1, rent_price: 1200, status: "occupied", bedrooms: 0, bathrooms: 1, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
  { id: "unit-002", property_id: "prop-001", unit_number: "102", unit_type: "1br", square_feet: 750, floor: 1, rent_price: 1550, status: "occupied", bedrooms: 1, bathrooms: 1, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
  { id: "unit-003", property_id: "prop-001", unit_number: "103", unit_type: "2br", square_feet: 1050, floor: 1, rent_price: 2100, status: "available", bedrooms: 2, bathrooms: 2, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
  { id: "unit-004", property_id: "prop-001", unit_number: "201", unit_type: "1br", square_feet: 780, floor: 2, rent_price: 1600, status: "occupied", bedrooms: 1, bathrooms: 1, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
  { id: "unit-005", property_id: "prop-001", unit_number: "202", unit_type: "2br", square_feet: 1100, floor: 2, rent_price: 2200, status: "occupied", bedrooms: 2, bathrooms: 2, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
  { id: "unit-006", property_id: "prop-001", unit_number: "203", unit_type: "3br", square_feet: 1400, floor: 2, rent_price: 2800, status: "maintenance", bedrooms: 3, bathrooms: 2, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
  { id: "unit-007", property_id: "prop-001", unit_number: "301", unit_type: "studio", square_feet: 520, floor: 3, rent_price: 1150, status: "available", bedrooms: 0, bathrooms: 1, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
  { id: "unit-008", property_id: "prop-001", unit_number: "302", unit_type: "penthouse", square_feet: 2200, floor: 3, rent_price: 4500, status: "occupied", bedrooms: 3, bathrooms: 3, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
];

export const demoTenants: Tenant[] = [
  { id: "ten-001", user_id: null, first_name: "Marcus", last_name: "Johnson", email: "marcus@email.com", phone: "(512) 555-0101", status: "active", unit_id: "unit-001", property_id: "prop-001", emergency_contact_name: "Lisa Johnson", emergency_contact_phone: "(512) 555-0102", move_in_date: "2024-03-01", move_out_date: null, created_at: "2024-02-15T00:00:00Z", updated_at: "2024-02-15T00:00:00Z" },
  { id: "ten-002", user_id: null, first_name: "Sarah", last_name: "Chen", email: "sarah.chen@email.com", phone: "(512) 555-0201", status: "active", unit_id: "unit-002", property_id: "prop-001", emergency_contact_name: "David Chen", emergency_contact_phone: "(512) 555-0202", move_in_date: "2024-04-01", move_out_date: null, created_at: "2024-03-15T00:00:00Z", updated_at: "2024-03-15T00:00:00Z" },
  { id: "ten-003", user_id: null, first_name: "James", last_name: "Williams", email: "james.w@email.com", phone: "(512) 555-0301", status: "active", unit_id: "unit-004", property_id: "prop-001", emergency_contact_name: null, emergency_contact_phone: null, move_in_date: "2024-06-01", move_out_date: null, created_at: "2024-05-15T00:00:00Z", updated_at: "2024-05-15T00:00:00Z" },
  { id: "ten-004", user_id: null, first_name: "Emily", last_name: "Rodriguez", email: "emily.r@email.com", phone: "(512) 555-0401", status: "active", unit_id: "unit-005", property_id: "prop-002", emergency_contact_name: "Maria Rodriguez", emergency_contact_phone: "(512) 555-0402", move_in_date: "2024-01-15", move_out_date: null, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "ten-005", user_id: null, first_name: "Alexander", last_name: "Kim", email: "alex.kim@email.com", phone: "(512) 555-0501", status: "active", unit_id: "unit-008", property_id: "prop-002", emergency_contact_name: "Grace Kim", emergency_contact_phone: "(512) 555-0502", move_in_date: "2024-02-01", move_out_date: null, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
  { id: "ten-006", user_id: null, first_name: "Olivia", last_name: "Brown", email: "olivia.b@email.com", phone: "(512) 555-0601", status: "notice_given", unit_id: "unit-002", property_id: "prop-001", emergency_contact_name: null, emergency_contact_phone: null, move_in_date: "2023-08-01", move_out_date: "2026-04-30", created_at: "2023-07-15T00:00:00Z", updated_at: "2026-02-15T00:00:00Z" },
];

export const demoLeases: Lease[] = [
  { id: "lease-001", unit_id: "unit-001", tenant_id: "ten-001", start_date: "2024-03-01", end_date: "2025-02-28", monthly_rent: 1200, deposit: 1200, status: "active", terms: null, document_url: null, created_at: "2024-02-15T00:00:00Z", updated_at: "2024-02-15T00:00:00Z" },
  { id: "lease-002", unit_id: "unit-002", tenant_id: "ten-002", start_date: "2024-04-01", end_date: "2025-03-31", monthly_rent: 1550, deposit: 1550, status: "active", terms: null, document_url: null, created_at: "2024-03-15T00:00:00Z", updated_at: "2024-03-15T00:00:00Z" },
  { id: "lease-003", unit_id: "unit-004", tenant_id: "ten-003", start_date: "2024-06-01", end_date: "2025-05-31", monthly_rent: 1600, deposit: 1600, status: "expiring_soon", terms: null, document_url: null, created_at: "2024-05-15T00:00:00Z", updated_at: "2024-05-15T00:00:00Z" },
  { id: "lease-004", unit_id: "unit-005", tenant_id: "ten-004", start_date: "2024-01-15", end_date: "2026-01-14", monthly_rent: 2200, deposit: 2200, status: "active", terms: null, document_url: null, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "lease-005", unit_id: "unit-008", tenant_id: "ten-005", start_date: "2024-02-01", end_date: "2026-01-31", monthly_rent: 4500, deposit: 9000, status: "active", terms: null, document_url: null, created_at: "2024-01-15T00:00:00Z", updated_at: "2024-01-15T00:00:00Z" },
];

export const demoPayments: Payment[] = [
  { id: "pay-001", lease_id: "lease-001", tenant_id: "ten-001", amount: 1200, status: "paid", method: "ach", payment_date: "2026-03-01", notes: null, created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z" },
  { id: "pay-002", lease_id: "lease-002", tenant_id: "ten-002", amount: 1550, status: "paid", method: "card", payment_date: "2026-03-01", notes: null, created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z" },
  { id: "pay-003", lease_id: "lease-003", tenant_id: "ten-003", amount: 1600, status: "overdue", method: "check", payment_date: "2026-03-01", notes: "Awaiting check", created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-05T00:00:00Z" },
  { id: "pay-004", lease_id: "lease-004", tenant_id: "ten-004", amount: 2200, status: "paid", method: "ach", payment_date: "2026-03-01", notes: null, created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z" },
  { id: "pay-005", lease_id: "lease-005", tenant_id: "ten-005", amount: 4500, status: "paid", method: "ach", payment_date: "2026-03-01", notes: null, created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z" },
  { id: "pay-006", lease_id: "lease-001", tenant_id: "ten-001", amount: 1200, status: "paid", method: "ach", payment_date: "2026-02-01", notes: null, created_at: "2026-02-01T00:00:00Z", updated_at: "2026-02-01T00:00:00Z" },
  { id: "pay-007", lease_id: "lease-002", tenant_id: "ten-002", amount: 800, status: "partial", method: "card", payment_date: "2026-02-01", notes: "Partial payment", created_at: "2026-02-01T00:00:00Z", updated_at: "2026-02-01T00:00:00Z" },
];

export const demoMaintenanceRequests: MaintenanceRequest[] = [
  { id: "maint-001", unit_id: "unit-001", tenant_id: "ten-001", property_id: "prop-001", assigned_to: null, category: "Plumbing", description: "Kitchen faucet leaking under the sink", priority: "high", status: "submitted", photos: [], internal_notes: null, completed_at: null, created_at: "2026-03-08T10:00:00Z", updated_at: "2026-03-08T10:00:00Z" },
  { id: "maint-002", unit_id: "unit-002", tenant_id: "ten-002", property_id: "prop-001", assigned_to: null, category: "HVAC", description: "AC unit not cooling properly, blowing warm air", priority: "medium", status: "in_progress", photos: [], internal_notes: "Technician scheduled for Tuesday", completed_at: null, created_at: "2026-03-06T14:30:00Z", updated_at: "2026-03-07T09:00:00Z" },
  { id: "maint-003", unit_id: "unit-004", tenant_id: "ten-003", property_id: "prop-001", assigned_to: null, category: "Electrical", description: "Bathroom light fixture flickering intermittently", priority: "low", status: "scheduled", photos: [], internal_notes: null, completed_at: null, created_at: "2026-03-05T11:15:00Z", updated_at: "2026-03-06T08:00:00Z" },
  { id: "maint-004", unit_id: "unit-005", tenant_id: "ten-004", property_id: "prop-001", assigned_to: null, category: "Appliance", description: "Dishwasher not draining after cycle completes", priority: "medium", status: "completed", photos: [], internal_notes: "Replaced drain pump", completed_at: "2026-03-04T16:00:00Z", created_at: "2026-03-02T09:00:00Z", updated_at: "2026-03-04T16:00:00Z" },
  { id: "maint-005", unit_id: "unit-008", tenant_id: "ten-005", property_id: "prop-001", assigned_to: null, category: "Locks & Keys", description: "Front door deadbolt is sticking, hard to lock", priority: "emergency", status: "submitted", photos: [], internal_notes: null, completed_at: null, created_at: "2026-03-09T22:00:00Z", updated_at: "2026-03-09T22:00:00Z" },
];
