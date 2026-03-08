# MFH Attendance

Frontend UI for the MFH church attendance tracking system. Records and visualises service attendance with demographic breakdowns (male, female, children) across multiple service types.

---

## Project Structure

```
mfh_frontend/
├── app/
│   ├── api/
│   │   └── attendance/
│   │       ├── route.ts          # POST — create attendance record
│   │       └── range/route.ts    # GET  — fetch records by date range
│   ├── attendance/
│   │   └── page.tsx              # Main dashboard (charts + table)
│   ├── new/
│   │   └── page.tsx              # New attendance form
│   ├── layout.tsx                # Root layout (sidebar, providers, font)
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── app-sidebar.tsx           # Navigation sidebar
│   ├── site-header.tsx           # Top header bar
│   ├── form.tsx                  # Attendance submission form
│   ├── date-picker.tsx           # Date picker wrapper
│   └── select.tsx                # Select wrapper
├── hooks/
│   └── use-mobile.ts             # Mobile breakpoint hook
├── lib/
│   └── utils.ts                  # cn() class merge utility
├── providers/
│   └── queryProvider.tsx         # React Query client provider
├── .env.local                    # Local environment variables
├── components.json               # shadcn/ui config
└── next.config.ts                # Next.js config
```

### Key Pages

| Route | Description |
|---|---|
| `/` | Redirects to `/attendance` |
| `/attendance` | Dashboard — stats cards, area/bar charts, full records table |
| `/new` | Form to log a new service attendance |

---

## Running Locally

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd mfh_frontend
npm install
```

2. Create a `.env.local` file in the project root:

```env
ATTENDANCE_API_URL=https://attendance-service-production-c339.up.railway.app/api/attendance
```

3. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |

---

## Libraries

| Library | Purpose | Docs |
|---|---|---|
| [Next.js](https://nextjs.org) | React framework with App Router and API routes | [docs](https://nextjs.org/docs) |
| [React](https://react.dev) | UI library | [docs](https://react.dev) |
| [TanStack Query](https://tanstack.com/query) | Server state management, caching, background refetching | [docs](https://tanstack.com/query/latest) |
| [React Hook Form](https://react-hook-form.com) | Performant form state management | [docs](https://react-hook-form.com/docs) |
| [Zod](https://zod.dev) | Schema validation for forms and API routes | [docs](https://zod.dev) |
| [shadcn/ui](https://ui.shadcn.com) | Accessible component library built on Radix UI | [docs](https://ui.shadcn.com/docs) |
| [Radix UI](https://www.radix-ui.com) | Unstyled accessible UI primitives | [docs](https://www.radix-ui.com/docs/primitives) |
| [Recharts](https://recharts.org) | Chart library (area chart, bar chart) | [docs](https://recharts.org/en-US/api) |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS framework | [docs](https://tailwindcss.com/docs) |
| [Lucide React](https://lucide.dev) | Icon library | [docs](https://lucide.dev/guide/packages/lucide-react) |
| [date-fns](https://date-fns.org) | Date utility functions | [docs](https://date-fns.org/docs) |
| [Sonner](https://sonner.emilkowal.ski) | Toast notifications | [docs](https://sonner.emilkowal.ski) |

---

## External API

All data is persisted via the **MFH Attendance Service** — a REST API deployed on [Railway](https://railway.app).

**Base URL:** `https://attendance-service-production-c339.up.railway.app`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/attendance` | Create a new attendance record |
| `GET` | `/api/attendance/range` | Fetch records for a date range |

The frontend does not call this API directly. Requests go through local Next.js API routes (`/api/attendance` and `/api/attendance/range`), which act as a proxy — validating input with Zod before forwarding to the backend.

### Attendance Record Shape

```ts
{
  id: string
  activityType: string
  maleCount: number
  femaleCount: number
  childrenCount: number
  totalAttendance: number
  attendanceDate: string  // ISO 8601
}
```
