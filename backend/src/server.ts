import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { startScheduler } from './workers/scheduler';

const start = async (): Promise<void> => {
    await connectDB();
    startScheduler();

    app.listen(env.PORT, () => {
        console.log(`🚀 GoodNews Backend running on port ${env.PORT}`);
    });
};

start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
