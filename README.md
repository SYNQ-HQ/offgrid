# OffGrid Next.js Migration

This project has been migrated from a React SPA (with base44 backend) to a **Next.js 16** application with **Prisma** (SQLite) and self-hosted API routes.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Database Setup:**
    The project uses SQLite (`dev.db`). The schema is defined in `prisma/schema.prisma`.
    To apply migrations:
    ```bash
    npx prisma migrate dev
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Architecture Changes

-   **Framework:** Next.js (App Router)
-   **Database:** SQLite with Prisma ORM
-   **API:** Local Next.js API Routes (`app/api/entities/[model]/route.js`) replace the `base44` external service. A mock `api/base44Client.js` adapter is used to maintain compatibility with existing frontend code.
-   **Styling:** Tailwind CSS (v4)
-   **State:** TanStack Query (React Query)

## Key Directories

-   `app/`: Next.js App Router pages and API routes.
-   `components/`: Reusable UI components.
-   `prisma/`: Database schema and migrations.
-   `lib/`: Utility functions and Prisma client instance.
-   `api/`: `base44Client.js` adapter.

## Environment Variables

Ensure `.env` contains:
```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_STRIPE_KEY="your_stripe_key" # Optional for checkout
```
