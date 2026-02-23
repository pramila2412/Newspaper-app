import { Request, Response } from 'express';
import { PrayerRequest } from '../models/PrayerRequest';

export const createPrayerRequest = async (req: Request, res: Response) => {
    try {
        const prayer = await PrayerRequest.create(req.body);
        res.status(201).json(prayer);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const listPrayerRequests = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, type } = req.query;
        const filter: any = {};
        if (type) filter.type = type;
        const prayers = await PrayerRequest.find(filter)
            .sort({ createdAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const total = await PrayerRequest.countDocuments(filter);
        res.json({ prayers, total, page: +page, totalPages: Math.ceil(total / +limit) });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const approvePrayerRequest = async (req: Request, res: Response) => {
    try {
        const prayer = await PrayerRequest.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!prayer) return res.status(404).json({ message: 'Not found' });
        res.json(prayer);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const deletePrayerRequest = async (req: Request, res: Response) => {
    try {
        await PrayerRequest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const publicListPrayerRequests = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, type } = req.query;
        const filter: any = { isApproved: true };
        if (type) filter.type = type;
        const prayers = await PrayerRequest.find(filter)
            .sort({ createdAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const total = await PrayerRequest.countDocuments(filter);
        res.json({ prayers, total, page: +page, totalPages: Math.ceil(total / +limit) });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Public submit (anyone can submit a prayer request)
export const submitPrayerRequest = async (req: Request, res: Response) => {
    try {
        const prayer = await PrayerRequest.create({ ...req.body, isApproved: false });
        res.status(201).json({ message: 'Prayer request submitted for review', prayer });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
