import { Request, Response } from 'express';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { News, NewsStatus } from '../models/News';
import { AuthRequest } from '../middlewares/auth';
import { createAuditLog } from '../services/audit.service';

export const createNews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, subtitle, categoryId, heroImage, contentBlocks, status, scheduledAt, seoTitle, seoDescription, seoKeywords, ogImage } = req.body;

        const baseSlug = slugify(title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;
        while (await News.findOne({ slug })) {
            slug = `${baseSlug}-${counter++}`;
        }

        const newsData: any = {
            title,
            slug,
            subtitle: subtitle || '',
            categoryId,
            authorId: req.userId,
            heroImage: heroImage || '',
            contentBlocks: contentBlocks || [],
            status: status || NewsStatus.DRAFT,
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || '',
            seoKeywords: seoKeywords || [],
            ogImage: ogImage || heroImage || '',
        };

        if (status === NewsStatus.PUBLISHED) {
            newsData.publishedAt = new Date();
        }
        if (status === NewsStatus.SCHEDULED && scheduledAt) {
            newsData.scheduledAt = new Date(scheduledAt);
        }

        const news = await News.create(newsData);
        await createAuditLog(req.userId!, 'CREATE_NEWS', 'News', String(news._id), null, { title, status: newsData.status });

        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateNews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            res.status(404).json({ message: 'News not found' });
            return;
        }

        const before = { title: news.title, status: news.status };

        const updates = req.body;
        if (updates.title) {
            news.title = updates.title;
            const baseSlug = slugify(updates.title, { lower: true, strict: true });
            let slug = baseSlug;
            let counter = 1;
            while (await News.findOne({ slug, _id: { $ne: news._id } })) {
                slug = `${baseSlug}-${counter++}`;
            }
            news.slug = slug;
        }

        if (updates.subtitle !== undefined) news.subtitle = updates.subtitle;
        if (updates.categoryId) news.categoryId = updates.categoryId;
        if (updates.heroImage !== undefined) news.heroImage = updates.heroImage;
        if (updates.contentBlocks) news.contentBlocks = updates.contentBlocks;
        if (updates.seoTitle !== undefined) news.seoTitle = updates.seoTitle;
        if (updates.seoDescription !== undefined) news.seoDescription = updates.seoDescription;
        if (updates.seoKeywords) news.seoKeywords = updates.seoKeywords;
        if (updates.ogImage !== undefined) news.ogImage = updates.ogImage;

        if (updates.status) {
            news.status = updates.status;
            if (updates.status === NewsStatus.PUBLISHED && !news.publishedAt) {
                news.publishedAt = new Date();
            }
            if (updates.status === NewsStatus.SCHEDULED && updates.scheduledAt) {
                news.scheduledAt = new Date(updates.scheduledAt);
            }
        }

        await news.save();
        await createAuditLog(req.userId!, 'UPDATE_NEWS', 'News', String(news._id), before, { title: news.title, status: news.status });

        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteNews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) {
            res.status(404).json({ message: 'News not found' });
            return;
        }

        await createAuditLog(req.userId!, 'DELETE_NEWS', 'News', req.params.id, { title: news.title }, null);
        res.json({ message: 'News deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getNewsList = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.categoryId) filter.categoryId = req.query.categoryId;

        const [news, total] = await Promise.all([
            News.find(filter).populate('categoryId', 'name slug').populate('authorId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
            News.countDocuments(filter),
        ]);

        res.json({ news, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getNewsById = async (req: Request, res: Response): Promise<void> => {
    try {
        const news = await News.findById(req.params.id).populate('categoryId', 'name slug').populate('authorId', 'name');
        if (!news) {
            res.status(404).json({ message: 'News not found' });
            return;
        }
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Public endpoints
export const getPublicNews = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const filter: any = { status: NewsStatus.PUBLISHED };
        if (req.query.categoryId) filter.categoryId = req.query.categoryId;

        const [news, total] = await Promise.all([
            News.find(filter).populate('categoryId', 'name slug').populate('authorId', 'name').sort({ publishedAt: -1 }).skip(skip).limit(limit),
            News.countDocuments(filter),
        ]);

        res.json({ news, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPublicNewsBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const news = await News.findOne({ slug: req.params.slug, status: NewsStatus.PUBLISHED }).populate('categoryId', 'name slug').populate('authorId', 'name');

        if (!news) {
            res.status(404).json({ message: 'Article not found' });
            return;
        }

        // Increment view count
        news.viewCount += 1;
        await news.save();

        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPublicNewsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const filter = { status: NewsStatus.PUBLISHED, categoryId: req.params.categoryId };

        const [news, total] = await Promise.all([
            News.find(filter).populate('categoryId', 'name slug').populate('authorId', 'name').sort({ publishedAt: -1 }).skip(skip).limit(limit),
            News.countDocuments(filter),
        ]);

        res.json({ news, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
