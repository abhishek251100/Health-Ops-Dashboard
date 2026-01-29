## Setup

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
Copy `.env.example` to `.env` and update `DATABASE_URL`.

### 3) Initialize database
```bash
npx prisma migrate dev
npx prisma db seed
```

### 4) Run the app
```bash
npm run dev
```

Open `http://localhost:3000`

### Demo login
- Email: `admin@healthops.local`
- Password: `Admin123!`
