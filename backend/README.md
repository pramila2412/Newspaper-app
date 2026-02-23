# GoodNews Backend

Malayalam Christian Newspaper Portal — Backend API

## Tech Stack
- Node.js + Express + TypeScript
- MongoDB + Mongoose ODM
- JWT Authentication (Access + Refresh tokens)
- Sharp (Image Processing)
- node-cron (Scheduler)

## Setup

```bash
# Install dependencies
npm install

# Create .env (already included, update for production)

# Seed database (creates Super Admin + Categories)
npm run seed

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| MONGODB_URI | mongodb://localhost:27017/goodnews | MongoDB connection |
| JWT_ACCESS_SECRET | (change) | JWT access token secret |
| JWT_REFRESH_SECRET | (change) | JWT refresh token secret |
| JWT_ACCESS_EXPIRY | 15m | Access token expiry |
| JWT_REFRESH_EXPIRY | 7d | Refresh token expiry |
| UPLOAD_DIR | uploads | Image upload directory |
| SUPER_ADMIN_EMAIL | admin@goodnews.in | Super admin email |
| SUPER_ADMIN_PASSWORD | Admin@123456 | Super admin password |
| FRONTEND_URL | http://localhost:5173 | Frontend URL for CORS |

## Default Login
- **Email**: admin@goodnews.in
- **Password**: Admin@123456

## API Endpoints
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh token
- `GET /api/categories` — List categories (public)
- `GET /api/news/public` — Public news list
- `GET /api/news/public/slug/:slug` — Single article
- `POST /api/media/upload` — Upload image
- Full REST CRUD for all entities
