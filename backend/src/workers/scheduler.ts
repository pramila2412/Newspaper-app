import cron from 'node-cron';
import { News, NewsStatus } from '../models/News';
import { Matrimony, MatrimonyStatus } from '../models/Matrimony';
import { Ad, AdStatus } from '../models/Ad';

export const startScheduler = (): void => {
    // Run every minute: publish scheduled news
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const result = await News.updateMany(
                { status: NewsStatus.SCHEDULED, scheduledAt: { $lte: now } },
                { $set: { status: NewsStatus.PUBLISHED, publishedAt: now } }
            );
            if (result.modifiedCount > 0) {
                console.log(`📰 Published ${result.modifiedCount} scheduled articles`);
            }
        } catch (error) {
            console.error('Scheduler error (news publish):', error);
        }
    });

    // Run every hour: expire matrimony listings
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const result = await Matrimony.updateMany(
                { status: MatrimonyStatus.ACTIVE, expiryDate: { $lte: now } },
                { $set: { status: MatrimonyStatus.EXPIRED } }
            );
            if (result.modifiedCount > 0) {
                console.log(`💍 Expired ${result.modifiedCount} matrimony listings`);
            }
        } catch (error) {
            console.error('Scheduler error (matrimony expire):', error);
        }
    });

    // Run every hour: expire ads
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const result = await Ad.updateMany(
                { status: AdStatus.ACTIVE, endDate: { $lte: now } },
                { $set: { status: AdStatus.EXPIRED } }
            );
            if (result.modifiedCount > 0) {
                console.log(`📢 Expired ${result.modifiedCount} ads`);
            }
        } catch (error) {
            console.error('Scheduler error (ad expire):', error);
        }
    });

    console.log('⏰ Scheduler started');
};
