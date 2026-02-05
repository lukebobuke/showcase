<!-- @format -->

# Musician Landing Page Builder

A mobile-first landing page builder for musicians to showcase their music, tour dates, and content.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher) - either locally installed or via Docker
- **Git**

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/lukebobuke/showcase.git
cd showcase
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/showcase?schema=public"
JWT_SECRET=your_super_secret_key_change_this_later
```

**Important**: Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

---

## Database Setup

### Option 1: Using Local PostgreSQL

1. **Start PostgreSQL** service on your machine

2. **Create the database**:

```bash
psql -U postgres
CREATE DATABASE showcase;
\q
```

3. **Run Prisma migrations**:

```bash
cd backend
npx prisma migrate dev --name init
```

4. **Generate Prisma Client**:

```bash
npx prisma generate
```

### Option 2: Using Docker (Alternative)

```bash
cd backend
docker-compose up -d
npx prisma migrate dev --name init
npx prisma generate
```

---

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will run on **http://localhost:5000**

### 2. Start the Frontend Dev Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on **http://localhost:5173**

---

## Testing the Application

### 1. Test Backend Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response: `{"status":"ok"}`

### 2. Test Database Connection

**Get all users:**

```bash
curl http://localhost:5000/api/test/users
```

**Create a test user:**

```bash
curl -X POST http://localhost:5000/api/test/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'
```

### 3. Test Full Stack

1. Open **http://localhost:5173** in your browser
2. You should see the frontend connected to the backend
3. Try creating a new user through the web interface
4. The user list should update automatically

---

## Project Structure

```
showcase/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── server.js        # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── .env                 # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API calls
    │   ├── context/         # React context
    │   └── App.jsx          # Main component
    └── package.json
```

---

## Available Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create new migration

### Frontend

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL in `.env`
- Ensure the database exists: `psql -U postgres -l`

### Port Already in Use

- Backend (5000): Change `PORT` in `.env`
- Frontend (5173): Change port in `vite.config.js`

### Prisma Client Not Found

```bash
cd backend
npx prisma generate
```

---

## Next Steps

- [ ] Add authentication (JWT)
- [ ] Implement user registration/login
- [ ] Create landing page builder UI
- [ ] Add file upload for images
- [ ] Deploy to production

---

## License

MIT
