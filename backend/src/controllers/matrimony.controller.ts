import { Request, Response } from 'express';
import { Matrimony, MatrimonyStatus } from '../models/Matrimony';
import { AuthRequest } from '../middlewares/auth';
import { createAuditLog } from '../services/audit.service';

export const createMatrimony = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, age, gender, education, denomination, district, description, contactNumber, photos, planDuration } = req.body;

        const startDate = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + (planDuration || 30));

        const matrimony = await Matrimony.create({
            name, age, gender, education, denomination, district, description, contactNumber,
            photos: photos || [],
            planDuration: planDuration || 30,
            startDate,
            expiryDate,
            status: MatrimonyStatus.ACTIVE,
            createdBy: req.userId,
        });

        await createAuditLog(req.userId!, 'CREATE_MATRIMONY', 'Matrimony', String(matrimony._id), null, { name });
        res.status(201).json(matrimony);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateMatrimony = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const matrimony = await Matrimony.findById(req.params.id);
        if (!matrimony) {
            res.status(404).json({ message: 'Matrimony listing not found' });
            return;
        }

        const before = { name: matrimony.name, status: matrimony.status };
        Object.assign(matrimony, req.body);
        await matrimony.save();

        await createAuditLog(req.userId!, 'UPDATE_MATRIMONY', 'Matrimony', String(matrimony._id), before, { name: matrimony.name, status: matrimony.status });
        res.json(matrimony);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteMatrimony = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const matrimony = await Matrimony.findByIdAndDelete(req.params.id);
        if (!matrimony) {
            res.status(404).json({ message: 'Matrimony listing not found' });
            return;
        }

        await createAuditLog(req.userId!, 'DELETE_MATRIMONY', 'Matrimony', req.params.id, { name: matrimony.name }, null);
        res.json({ message: 'Matrimony listing deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const listMatrimony = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (req.query.status) filter.status = req.query.status;

        const [items, total] = await Promise.all([
            Matrimony.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Matrimony.countDocuments(filter),
        ]);

        res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPublicMatrimony = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const filter = { status: MatrimonyStatus.ACTIVE, expiryDate: { $gte: new Date() } };

        const [items, total] = await Promise.all([
            Matrimony.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Matrimony.countDocuments(filter),
        ]);

        res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
