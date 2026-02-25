import { Request, Response } from 'express';
import { Obituary, ObituaryStatus } from '../models/Obituary';
import { AuthRequest } from '../middlewares/auth';
import { createAuditLog } from '../services/audit.service';

export const createObituary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, age, district, deathDate, photo, contentBlocks, status } = req.body;

        const obituary = await Obituary.create({
            name, age, district,
            deathDate: new Date(deathDate),
            photo: photo || '',
            contentBlocks: contentBlocks || [],
            status: status || ObituaryStatus.DRAFT,
            createdBy: req.userId,
        });

        await createAuditLog(req.userId!, 'CREATE_OBITUARY', 'Obituary', String(obituary._id), null, { name });
        res.status(201).json(obituary);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateObituary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const obituary = await Obituary.findById(req.params.id);
        if (!obituary) {
            res.status(404).json({ message: 'Obituary not found' });
            return;
        }

        const before = { name: obituary.name, status: obituary.status };
        Object.assign(obituary, req.body);
        if (req.body.deathDate) obituary.deathDate = new Date(req.body.deathDate);
        await obituary.save();

        await createAuditLog(req.userId!, 'UPDATE_OBITUARY', 'Obituary', String(obituary._id), before, { name: obituary.name, status: obituary.status });
        res.json(obituary);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteObituary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const obituary = await Obituary.findByIdAndDelete(req.params.id);
        if (!obituary) {
            res.status(404).json({ message: 'Obituary not found' });
            return;
        }

        await createAuditLog(req.userId!, 'DELETE_OBITUARY', 'Obituary', req.params.id, { name: obituary.name }, null);
        res.json({ message: 'Obituary deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const listObituaries = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (req.query.status) filter.status = req.query.status;

        const [items, total] = await Promise.all([
            Obituary.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Obituary.countDocuments(filter),
        ]);

        res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPublicObituaries = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const filter = { status: ObituaryStatus.ACTIVE };

        const [items, total] = await Promise.all([
            Obituary.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Obituary.countDocuments(filter),
        ]);

        res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
export const getPublicObituaryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const obituary = await Obituary.findOneAndUpdate(
            { _id: req.params.id, status: ObituaryStatus.ACTIVE },
            { $inc: { viewCount: 1 } },
            { new: true }
        );

        if (!obituary) {
            res.status(404).json({ message: 'Obituary not found' });
            return;
        }

        res.json(obituary);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
