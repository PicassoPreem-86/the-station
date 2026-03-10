export const UNIT_TYPE_LABELS: Record<string, string> = {
  studio: "Studio",
  "1br": "1 Bed",
  "2br": "2 Bed",
  "3br": "3 Bed",
  "4br": "4 Bed",
  penthouse: "Penthouse",
};

export const UNIT_STATUS_LABELS: Record<string, string> = {
  available: "Available",
  occupied: "Occupied",
  maintenance: "Maintenance",
  offline: "Offline",
};

export const TENANT_STATUS_LABELS: Record<string, string> = {
  applicant: "Applicant",
  approved: "Approved",
  active: "Active",
  notice_given: "Notice Given",
  moved_out: "Moved Out",
};

export const LEASE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  expiring_soon: "Expiring Soon",
  expired: "Expired",
  renewed: "Renewed",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  partial: "Partial",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  check: "Check",
  ach: "ACH",
  card: "Card",
};

export const MAINTENANCE_STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  in_progress: "In Progress",
  scheduled: "Scheduled",
  completed: "Completed",
  closed: "Closed",
};

export const MAINTENANCE_PRIORITY_LABELS: Record<string, string> = {
  emergency: "Emergency",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const MAINTENANCE_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance",
  "Structural",
  "Pest Control",
  "Locks & Keys",
  "Painting",
  "Flooring",
  "General",
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
