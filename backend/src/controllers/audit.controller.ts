import { Request, Response } from 'express';
import { AuditLog } from '../models/AuditLog';
import { AuthRequest } from '../middlewares/auth';

export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (req.query.entity) filter.entity = req.query.entity;
        if (req.query.userId) filter.userId = req.query.userId;
        if (req.query.action) filter.action = req.query.action;

        const [logs, total] = await Promise.all([
            AuditLog.find(filter).populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
            AuditLog.countDocuments(filter),
        ]);

        res.json({ logs, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
