import { Request, Response } from 'express';
import { Classified, ClassifiedStatus } from '../models/Classified';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

// Admin CRUD
export const createClassified = async (req: Request, res: Response) => {
    try {
        const slug = slugify(req.body.title) + '-' + Date.now();
        const classified = await Classified.create({ ...req.body, slug });
        res.status(201).json(classified);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const listClassifieds = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, category } = req.query;
        const filter: any = {};
        if (category) filter.category = category;
        const classifieds = await Classified.find(filter)
            .sort({ createdAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const total = await Classified.countDocuments(filter);
        res.json({ classifieds, total, page: +page, totalPages: Math.ceil(total / +limit) });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const updateClassified = async (req: Request, res: Response) => {
    try {
        const classified = await Classified.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!classified) return res.status(404).json({ message: 'Not found' });
        res.json(classified);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteClassified = async (req: Request, res: Response) => {
    try {
        await Classified.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Public
export const publicListClassifieds = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, category } = req.query;
        const filter: any = { status: ClassifiedStatus.ACTIVE };
        if (category) filter.category = category;
        const classifieds = await Classified.find(filter)
            .sort({ createdAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const total = await Classified.countDocuments(filter);
        res.json({ classifieds, total, page: +page, totalPages: Math.ceil(total / +limit) });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
