import { Request, Response } from 'express';
import { News } from '../models/News';

export const searchAll = async (req: Request, res: Response) => {
    try {
        const { q, page = 1, limit = 20 } = req.query;
        if (!q || typeof q !== 'string') return res.status(400).json({ message: 'Query parameter "q" is required' });

        const regex = new RegExp(q, 'i');
        const filter = {
            status: 'PUBLISHED',
            $or: [
                { title: regex },
                { subtitle: regex },
                { 'seoKeywords': regex },
                { 'tags': regex },
            ],
        };

        const results = await News.find(filter)
            .populate('categoryId', 'name slug')
            .select('title slug subtitle heroImage categoryId publishedAt viewCount')
            .sort({ publishedAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);

        const total = await News.countDocuments(filter);
        res.json({ results, total, page: +page, totalPages: Math.ceil(total / +limit) });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getPopularNews = async (req: Request, res: Response) => {
    try {
        const { period = 'week', limit = 10 } = req.query;
        let dateFilter: Date = new Date();

        if (period === 'week') dateFilter.setDate(dateFilter.getDate() - 7);
        else if (period === 'month') dateFilter.setMonth(dateFilter.getMonth() - 1);
        else dateFilter = new Date(0); // all time

        const filter: any = { status: 'PUBLISHED' };
        if (period !== 'all') filter.publishedAt = { $gte: dateFilter };

        const news = await News.find(filter)
            .populate('categoryId', 'name slug')
            .select('title slug heroImage categoryId publishedAt viewCount')
            .sort({ viewCount: -1 })
            .limit(+limit);

        res.json(news);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getBreakingNews = async (_req: Request, res: Response) => {
    try {
        const news = await News.find({ status: 'PUBLISHED', isBreaking: true })
            .select('title slug')
            .sort({ publishedAt: -1 })
            .limit(10);
        res.json(news);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getFeaturedNews = async (req: Request, res: Response) => {
    try {
        const { sponsored } = req.query;
        const filter: any = { status: 'PUBLISHED', isFeatured: true };
        if (sponsored === 'true') filter.isSponsored = true;

        const news = await News.find(filter)
            .populate('categoryId', 'name slug')
            .select('title slug subtitle heroImage categoryId publishedAt viewCount')
            .sort({ publishedAt: -1 })
            .limit(20);

        res.json(news);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getPopularTags = async (_req: Request, res: Response) => {
    try {
        const tags = await News.aggregate([
            { $match: { status: 'PUBLISHED' } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 30 },
        ]);
        res.json(tags.map(t => ({ tag: t._id, count: t.count })));
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getNewsBySubCategory = async (req: Request, res: Response) => {
    try {
        const { subCategory, page = 1, limit = 20 } = req.query;
        const filter: any = { status: 'PUBLISHED' };
        if (subCategory && subCategory !== 'all') filter.subCategory = subCategory;

        const news = await News.find(filter)
            .populate('categoryId', 'name slug')
            .select('title slug subtitle heroImage categoryId publishedAt viewCount')
            .sort({ publishedAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);

        const total = await News.countDocuments(filter);
        res.json({ news, total, page: +page, totalPages: Math.ceil(total / +limit) });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
