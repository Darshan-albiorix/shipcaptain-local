## ShipCaptain-AuthFlow

A Turborepo monorepo with a Next.js admin app and shared packages.

### Requirements
- **Node**: >= 18 (Node 20/22 also OK)
- **npm** (repo uses npm workspaces and Turborepo)

### Install
```bash
npm install
```

### Develop (UI only)
Runs all apps in dev via Turborepo. The main app is `apps/super-admin` (Next.js).
```bash
npm run dev
```
Open `http://localhost:3000`.

### Build
```bash
npm run build
```

### Lint / Type Check
```bash
npm run lint
npm run check-types
```

### Monorepo Layout
- `apps/super-admin`: Next.js admin UI (Tailwind v4)
- `packages/ui`: Shared UI components
- `packages/database`: Prisma schema and DB helper
- `packages/*`: Shared configs (eslint, tsconfig, tailwind)

### Optional: Database Setup (Prisma / PostgreSQL)
Only needed if you plan to use `packages/database` locally.
1) Create a PostgreSQL database.
2) Set `DATABASE_URL` in `.env` (at repo root or `packages/database`):
```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/shipcaptain
```
3) Generate client and run migrations:
```bash
npx prisma generate --schema packages/database/prisma/schema.prisma
npx prisma migrate dev --schema packages/database/prisma/schema.prisma
```

### Notes
- Run commands from the repository root.
- If you cloned on a different OS, regenerate Prisma client as shown above.