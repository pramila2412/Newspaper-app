import { Request, Response } from 'express';
import { News, NewsStatus } from '../models/News';
import { Ad } from '../models/Ad';
import { Matrimony, MatrimonyStatus } from '../models/Matrimony';
import { Obituary, ObituaryStatus } from '../models/Obituary';
import { User } from '../models/User';
import { Media } from '../models/Media';
import { AuthRequest } from '../middlewares/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const [
            totalNews, publishedNews, draftNews,
            totalMatrimony, activeMatrimony,
            totalObituaries, activeObituaries,
            totalUsers, totalMedia,
            totalAdClicks, totalAdImpressions,
            topArticles
        ] = await Promise.all([
            News.countDocuments(),
            News.countDocuments({ status: NewsStatus.PUBLISHED }),
            News.countDocuments({ status: NewsStatus.DRAFT }),
            Matrimony.countDocuments(),
            Matrimony.countDocuments({ status: MatrimonyStatus.ACTIVE }),
            Obituary.countDocuments(),
            Obituary.countDocuments({ status: ObituaryStatus.ACTIVE }),
            User.countDocuments(),
            Media.countDocuments(),
            Ad.aggregate([{ $group: { _id: null, total: { $sum: '$clicks' } } }]),
            Ad.aggregate([{ $group: { _id: null, total: { $sum: '$impressions' } } }]),
            News.find({ status: NewsStatus.PUBLISHED }).sort({ viewCount: -1 }).limit(10).select('title slug viewCount publishedAt'),
        ]);

        res.json({
            news: { total: totalNews, published: publishedNews, draft: draftNews },
            matrimony: { total: totalMatrimony, active: activeMatrimony },
            obituaries: { total: totalObituaries, active: activeObituaries },
            users: totalUsers,
            media: totalMedia,
            ads: {
                totalClicks: totalAdClicks[0]?.total || 0,
                totalImpressions: totalAdImpressions[0]?.total || 0,
            },
            topArticles,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getArticleAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [articles, total] = await Promise.all([
            News.find({ status: NewsStatus.PUBLISHED })
                .select('title slug viewCount publishedAt categoryId')
                .populate('categoryId', 'name')
                .sort({ viewCount: -1 })
                .skip(skip).limit(limit),
            News.countDocuments({ status: NewsStatus.PUBLISHED }),
        ]);

        res.json({ articles, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
