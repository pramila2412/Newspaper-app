# GoodNews Frontend

Malayalam Christian Newspaper Portal — Frontend Application

## Tech Stack
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router v6
- Axios

## Setup

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build
npm run preview
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:5000/api | Backend API URL |

## Structure

- **Public Website**: Home, Category, Article, Matrimony, Obituary
- **Admin Panel** (`/admin`): Login, Dashboard, News, Categories, Matrimony, Obituary, Ads, Media, Users, Analytics, Audit Logs
- **Block Editor**: Heading, Paragraph, Bible Verse, Quote, Image, Divider, Callout, List, YouTube Embed

## Development

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000` automatically.

Run both backend and frontend simultaneously:
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`
