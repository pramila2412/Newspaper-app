import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import newsRoutes from './routes/news.routes';
import matrimonyRoutes from './routes/matrimony.routes';
import obituaryRoutes from './routes/obituary.routes';
import mediaRoutes from './routes/media.routes';
import adRoutes from './routes/ad.routes';
import analyticsRoutes from './routes/analytics.routes';
import auditRoutes from './routes/audit.routes';
import classifiedRoutes from './routes/classified.routes';
import videoRoutes from './routes/video.routes';
import prayerRoutes from './routes/prayer.routes';
import subscriberRoutes from './routes/subscriber.routes';
import discoverRoutes from './routes/discover.routes';

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Static files (uploads)
app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/matrimony', matrimonyRoutes);
app.use('/api/obituary', obituaryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/classifieds', classifiedRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/discover', discoverRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

export default app;
