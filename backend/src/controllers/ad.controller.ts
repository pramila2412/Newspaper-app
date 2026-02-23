import { Request, Response } from 'express';
import { Ad, AdStatus, Adset } from '../models/Ad';
import { AuthRequest } from '../middlewares/auth';
import { createAuditLog } from '../services/audit.service';

// Adset CRUD
export const createAdset = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const adset = await Adset.create(req.body);
        await createAuditLog(req.userId!, 'CREATE_ADSET', 'Adset', String(adset._id), null, { name: adset.name });
        res.status(201).json(adset);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const listAdsets = async (_req: Request, res: Response): Promise<void> => {
    try {
        const adsets = await Adset.find().sort({ createdAt: -1 });
        res.json(adsets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteAdset = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const adset = await Adset.findByIdAndDelete(req.params.id);
        if (!adset) {
            res.status(404).json({ message: 'Adset not found' });
            return;
        }
        await createAuditLog(req.userId!, 'DELETE_ADSET', 'Adset', req.params.id, { name: adset.name }, null);
        res.json({ message: 'Adset deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Ad CRUD
export const createAd = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ad = await Ad.create({
            ...req.body,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
        });
        await createAuditLog(req.userId!, 'CREATE_AD', 'Ad', String(ad._id), null, { link: ad.link });
        res.status(201).json(ad);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateAd = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            res.status(404).json({ message: 'Ad not found' });
            return;
        }

        const before = { status: ad.status, priority: ad.priority };
        Object.assign(ad, req.body);
        if (req.body.startDate) ad.startDate = new Date(req.body.startDate);
        if (req.body.endDate) ad.endDate = new Date(req.body.endDate);
        await ad.save();

        await createAuditLog(req.userId!, 'UPDATE_AD', 'Ad', String(ad._id), before, { status: ad.status, priority: ad.priority });
        res.json(ad);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteAd = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ad = await Ad.findByIdAndDelete(req.params.id);
        if (!ad) {
            res.status(404).json({ message: 'Ad not found' });
            return;
        }
        await createAuditLog(req.userId!, 'DELETE_AD', 'Ad', req.params.id, { link: ad.link }, null);
        res.json({ message: 'Ad deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const listAds = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.adsetId) filter.adsetId = req.query.adsetId;

        const [items, total] = await Promise.all([
            Ad.find(filter).populate('adsetId').populate('mediaId').sort({ priority: -1, createdAt: -1 }).skip(skip).limit(limit),
            Ad.countDocuments(filter),
        ]);

        res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Public: get active ads
export const getPublicAds = async (req: Request, res: Response): Promise<void> => {
    try {
        const now = new Date();
        const filter: any = {
            status: AdStatus.ACTIVE,
            startDate: { $lte: now },
            endDate: { $gte: now },
        };
        if (req.query.placement) {
            const adsets = await Adset.find({ placement: req.query.placement });
            filter.adsetId = { $in: adsets.map(a => a._id) };
        }

        const ads = await Ad.find(filter)
            .populate('mediaId')
            .populate('adsetId')
            .sort({ priority: -1 })
            .limit(10);

        // Track impressions
        for (const ad of ads) {
            await Ad.findByIdAndUpdate(ad._id, { $inc: { impressions: 1 } });
        }

        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const trackAdClick = async (req: Request, res: Response): Promise<void> => {
    try {
        const ad = await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } }, { new: true });
        if (!ad) {
            res.status(404).json({ message: 'Ad not found' });
            return;
        }
        res.json({ link: ad.link });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
