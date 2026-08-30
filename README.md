# Nomini Group Digital Platform 🌿

A technical system for Agritech E-Commerce, Crowdfarming Investments, Digital Product Passport (DPP) Traceability, and Operations Team Management.

---

## 🏗️ Architecture & Tech Stack

- **Backend:** NestJS 10 (TypeScript), Passport JWT, Swagger/OpenAPI, Class Validator, RBAC Guards
- **Database & ORM:** PostgreSQL 16 with Prisma ORM 5
- **Frontend:** Next.js 14+ (App Router, TypeScript, Tailwind CSS)
- **State Management:** Zustand (Cart & Auth session switcher)
- **Drag-and-Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Standards:** EU ESPR / DPP Digital Product Passport Compliant

---

## 📂 Project Structure

```
nomini/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Step 1: Complete Prisma DB schema
│   │   └── seed.ts               # Database seed script with rich realistic demo data
│   ├── src/
│   │   ├── auth/                 # JWT Auth, RBAC Roles Decorator & Guard, Demo Switcher
│   │   ├── tasks/                # Step 2: Task Management (/api/v1/tasks endpoints)
│   │   ├── orders/               # Section 7: E-commerce Checkout (/api/v1/orders/checkout)
│   │   ├── investments/          # Section 7: Crowdfarm Share Booking (/api/v1/investments/book)
│   │   ├── dpp/                  # Section 7: Digital Product Passport (/api/v1/dpp/passport/:batchId)
│   │   ├── products/             # Product catalog linked to harvest batches
│   │   ├── users/                # Staff directory and employee listing
│   │   ├── prisma/               # Global Prisma client service
│   │   ├── app.module.ts
│   │   └── main.ts               # Swagger setup at /api/docs, CORS & Validation
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Navbar, CartDrawer, Root Layout
│   │   │   ├── page.tsx          # System Overview & Feature Jump Portal
│   │   │   ├── admin/tasks/      # Step 3: Admin & Operations Kanban Board
│   │   │   ├── dpp/[batchNumber] # Step 4: Mobile-First Digital Product Passport
│   │   │   ├── checkout/         # Step 4: E-Commerce Checkout with Zustand
│   │   │   ├── products/         # Storefront catalog with DPP passport badges
│   │   │   └── investments/      # Crowdfarming equity & share booking
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── RoleSwitcher.tsx  # Live JWT identity simulator (Admin, Employee, Investor, Customer)
│   │   │   ├── kanban/           # Dnd-kit Kanban Board, Columns, TaskCard, CreateTaskModal
│   │   │   ├── dpp/              # Sustainability Scorecard, TimelineView, LabReportModal, QrShareModal
│   │   │   └── cart/             # Zustand Slide-over Cart Drawer
│   │   ├── lib/
│   │   │   ├── api.ts            # Typed API client with Bearer token injection
│   │   │   └── store/            # Zustand cartStore & authStore
│   │   └── types/                # TypeScript interfaces
│   └── package.json
│
├── docker-compose.yml            # PostgreSQL 16 container setup
└── package.json                  # Root orchestration scripts
```

---

## 🔐 Section 7: API Endpoint Reference Matrix

| Method | Endpoint Route | Auth Level (RBAC) | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/orders/checkout` | Customer / Public | Executes e-commerce order payment & decrements inventory |
| `POST` | `/api/v1/investments/book` | Investor / Admin | Books farm investment shares & issues digital certificate |
| `GET` | `/api/v1/tasks` | Employee / Admin | Fetches assigned tasks based on user role |
| `POST` | `/api/v1/tasks/assign` | Admin | Creates a new task and assigns to an employee |
| `PATCH` | `/api/v1/tasks/:id/status` | Employee / Admin | Updates task status (e.g. to `COMPLETED`) and timestamps |
| `GET` | `/api/v1/dpp/passport/:batchId` | Public | Returns supply chain lifecycle, timeline & sustainability metrics |

---

## 🚀 Quickstart Guide

### 1. Database (PostgreSQL & Prisma)
```bash
# Start PostgreSQL container
docker run -d --name nomini-postgres -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nomini_db postgres:16-alpine

# In backend directory:
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 2. Run Backend (NestJS REST API)
```bash
cd backend
npm run start:dev
# API running on http://localhost:4000
# Swagger docs at http://localhost:4000/api/docs
```

### 3. Run Frontend (Next.js 14)
```bash
cd frontend
npm install
npm run dev
# Web app running on http://localhost:3000
```

---

## 👥 Demo User Accounts (Pre-Seeded)

Use the built-in **Role Switcher** in the top navigation bar to switch between user identities with pre-generated JWT tokens:

- **Admin:** `admin@nomini.group` (Marcus Vance - Full managerial & assignment permissions)
- **Employee (Farm Lead):** `liam.farmer@nomini.group` (Liam Thorne - Cultivation & Harvest)
- **Employee (Logistics Lead):** `sarah.logistics@nomini.group` (Sarah Chen - Cold Chain & Logistics)
- **Farm Operator:** `carlos.agronomist@nomini.group` (Carlos Mendez - Agronomy & QA)
- **Investor:** `elena.investor@nomini.group` (Elena Rostova - Private Equity / Shareholdings)
- **Customer:** `alex.buyer@nomini.group` (Alex Morgan - Storefront & Orders)
*(Password for all seeded accounts: `NominiPass2026!`)*
