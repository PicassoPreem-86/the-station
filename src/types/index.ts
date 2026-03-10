export type StaffRole = "admin" | "property_manager" | "leasing_agent" | "maintenance_staff";
export type UnitStatus = "available" | "occupied" | "maintenance" | "offline";
export type UnitType = "studio" | "1br" | "2br" | "3br" | "4br" | "penthouse";
export type TenantStatus = "applicant" | "approved" | "active" | "notice_given" | "moved_out";
export type LeaseStatus = "draft" | "active" | "expiring_soon" | "expired" | "renewed";
export type PaymentStatus = "paid" | "pending" | "overdue" | "partial";
export type PaymentMethod = "cash" | "check" | "ach" | "card";
export type MaintenancePriority = "emergency" | "high" | "medium" | "low";
export type MaintenanceStatus = "submitted" | "in_progress" | "scheduled" | "completed" | "closed";

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  photo_url: string | null;
  unit_count: number;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  unit_type: UnitType;
  square_feet: number;
  floor: number;
  rent_price: number;
  status: UnitStatus;
  bedrooms: number;
  bathrooms: number;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: TenantStatus;
  unit_id: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  move_in_date: string | null;
  move_out_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lease {
  id: string;
  unit_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  status: LeaseStatus;
  terms: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  lease_id: string;
  tenant_id: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  payment_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRequest {
  id: string;
  unit_id: string;
  tenant_id: string;
  property_id: string;
  assigned_to: string | null;
  category: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  photos: string[];
  internal_notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
