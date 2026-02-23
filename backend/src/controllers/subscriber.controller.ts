import { Request, Response } from 'express';
import { Subscriber } from '../models/Subscriber';

export const subscribe = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        const existing = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existing) {
            if (!existing.isActive) {
                existing.isActive = true;
                await existing.save();
                return res.json({ message: 'Welcome back! You have been re-subscribed.' });
            }
            return res.json({ message: 'You are already subscribed!' });
        }
        await Subscriber.create({ email });
        res.status(201).json({ message: 'Subscribed successfully!' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const unsubscribe = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await Subscriber.findOneAndUpdate({ email: email.toLowerCase() }, { isActive: false });
        res.json({ message: 'Unsubscribed successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const listSubscribers = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const subscribers = await Subscriber.find({ isActive: true })
            .sort({ subscribedAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const total = await Subscriber.countDocuments({ isActive: true });
        res.json({ subscribers, total, page: +page, totalPages: Math.ceil(total / +limit) });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
