## Data Model (human-readable)

### Core entities
- **User**: staff members who log in.
- **Role**: job roles (admin, staff).
- **Permission**: fine-grained access keys.

- **Patient**: demographic and insurance data.
- **Provider**: clinicians and staff.
- **Appointment**: scheduled visits between patient and provider.

- **Invoice**: billing records tied to patients (and optionally appointments).
- **Payment**: money received for invoices.

- **AuditLog**: history of sensitive admin actions.
- **File**: document links attached to patients.

### Relationship summary
- User ⟷ Role (many-to-many)
- Role ⟷ Permission (many-to-many)
- Patient → Appointments (one-to-many)
- Provider → Appointments (one-to-many)
- Patient → Invoices (one-to-many)
- Invoice → Payments (one-to-many)
