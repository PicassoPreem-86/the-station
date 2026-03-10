# The Station — Product Requirements Document

## Vision
The Station is a modern property management platform that replaces legacy tools like RentCafe/Yardi with a purpose-built, best-in-class experience for both property staff and residents.

## Target Users

### Property Staff (Management Suite)
- **Property Managers** — oversee operations, reporting, tenant relations
- **Leasing Agents** — handle applications, tours, move-ins
- **Maintenance Staff** — receive and complete work orders
- **Accounting/Finance** — payment tracking, ledgers, reporting

### Residents (Resident App)
- **Current Tenants** — pay rent, request maintenance, book amenities, communicate with management
- **Prospective Tenants** — apply for units (Phase 4+)

---

## Product 1: Management Suite

### 1.1 Authentication & Roles
- Email/password login for staff
- Role-based access: Admin, Property Manager, Leasing Agent, Maintenance Staff
- Admins can invite/remove staff and assign roles
- Session management and password reset

### 1.2 Dashboard
- Overview of key metrics: occupancy rate, rent collected vs. outstanding, open maintenance requests, upcoming lease expirations
- Quick actions: add tenant, create work order, post announcement
- Activity feed of recent events

### 1.3 Property & Unit Management
- Create and manage properties (name, address, photos, amenities list)
- Manage units within a property: unit number, type (studio, 1BR, 2BR, etc.), square footage, floor plan, rent price, status (available, occupied, maintenance, offline)
- Unit history: past tenants, maintenance history, rent changes
- Bulk import units via CSV

### 1.4 Tenant Management
- Tenant profiles: name, contact info, emergency contact, lease details, payment history
- Tenant lifecycle: application → approved → active → notice given → moved out
- Associate tenants with units and leases
- Search and filter tenants by status, unit, lease end date, balance

### 1.5 Lease Management
- Create leases: unit, tenant(s), start date, end date, monthly rent, deposit, terms
- Lease statuses: draft, active, expiring soon, expired, renewed
- Renewal workflow: send renewal offer → tenant signs → lease updated
- Document storage: upload signed lease PDFs
- E-signature integration (Phase 3)

### 1.6 Payment Collection
- View all payments: paid, pending, overdue, partial
- Tenant ledger: running balance, charges, credits, payments
- Record manual payments (cash, check)
- Stripe integration for online payments
- Late fee automation: configurable grace period and fee amount
- Monthly rent roll report
- Payment export (CSV)

### 1.7 Maintenance Management
- Receive requests from residents (with photos, description, priority)
- Assign work orders to maintenance staff
- Status tracking: submitted → in progress → completed → closed
- Priority levels: emergency, high, medium, low
- Internal notes on work orders (not visible to residents)
- Completion photos and time tracking
- Maintenance cost tracking per unit

### 1.8 Communication
- Post community announcements (all residents or specific buildings/units)
- Direct messaging to individual tenants
- Notification preferences per message type
- Email + in-app notification delivery

### 1.9 Amenity Management
- Define bookable amenities: name, description, photos, capacity, rules
- Set availability windows and booking rules (max duration, advance booking limit)
- View and manage reservation calendar
- Approve/deny reservation requests (optional approval mode)

### 1.10 Reporting
- Occupancy report: current and historical occupancy rates
- Financial summary: income, expenses, net operating income
- Rent roll: all units with current tenant, rent amount, payment status
- Maintenance report: open/closed by period, average resolution time
- Lease expiration report: upcoming expirations by month
- Export all reports to CSV/PDF

---

## Product 2: Resident App

### 2.1 Authentication
- Email/password login
- Magic link option
- Account setup via invite from property management
- Password reset

### 2.2 Home Dashboard
- Current balance and next payment due date
- Active maintenance request status
- Recent announcements
- Quick actions: pay rent, submit request, book amenity

### 2.3 Rent Payments
- View current balance, monthly charges, and payment history
- One-time payment: ACH bank transfer or credit/debit card
- Autopay setup: choose payment method, payment date, amount
- Payment confirmation and receipts (email + in-app)
- View and download payment history

### 2.4 Maintenance Requests
- Submit new request: category, description, photos (up to 5), preferred access times
- Permission to enter toggle
- View all requests with status (submitted, in progress, scheduled, completed)
- Real-time status updates via push notification
- Rate completed maintenance (optional)

### 2.5 Lease & Documents
- View current lease details: dates, rent amount, terms
- Download lease document
- Receive and accept renewal offers
- E-signature for lease renewals (Phase 3)

### 2.6 Amenity Booking
- Browse available amenities with photos and descriptions
- Calendar view of availability
- Book time slots
- View and cancel upcoming reservations
- Booking confirmation notification

### 2.7 Announcements & Communication
- View community announcements
- Message property management
- Notification center: all recent notifications in one place
- Push notification preferences

### 2.8 Profile & Settings
- Update contact information
- Manage payment methods
- Notification preferences
- Emergency contact info
- Vehicle and pet information (if applicable)

---

## Non-Functional Requirements

### Performance
- Page load under 2 seconds
- Payment processing under 5 seconds
- Real-time updates within 1 second via Supabase Realtime

### Security
- All data encrypted in transit (TLS) and at rest
- Row Level Security on all database tables
- PCI compliance via Stripe (no card data touches our servers)
- Rate limiting on auth endpoints
- CSRF protection
- Input sanitization

### Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML
- Keyboard navigable
- Screen reader compatible

### Scalability
- Support 500+ units per property
- Support 2,000+ concurrent residents
- Supabase + Vercel scale automatically

---

## Phase Breakdown

### Phase 1 — Management Foundation
- Auth + role system
- Dashboard (static metrics initially)
- Property and unit CRUD
- Tenant CRUD and profiles
- Lease creation and tracking
- Basic payment recording (manual)

### Phase 2 — Resident App + Payments
- Resident auth (invite flow)
- Resident dashboard
- Stripe payment integration (both apps)
- Maintenance request submission + management workflow
- Announcements (create in management, view in resident)

### Phase 3 — Enhanced Features
- Amenity booking (both apps)
- E-signature for leases (DocuSign or native)
- Push notifications
- Reporting suite in management app
- Direct messaging between staff and residents

### Phase 4 — Growth Features
- Prospective tenant applications and screening
- Online tour scheduling
- Vendor management for maintenance
- Multi-property support
- Mobile native apps (React Native)

---

## Success Metrics
- Resident adoption rate > 80% within 60 days of launch
- Online rent payment rate > 90%
- Average maintenance request resolution time < 48 hours
- Resident satisfaction score > 4.5/5
- Staff time savings > 10 hours/week vs. previous tools
