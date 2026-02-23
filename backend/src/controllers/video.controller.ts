import { Request, Response } from 'express';
import { Video } from '../models/Video';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

export const createVideo = async (req: Request, res: Response) => {
    try {
        const slug = slugify(req.body.title) + '-' + Date.now();
        const video = await Video.create({ ...req.body, slug });
        res.status(201).json(video);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const listVideos = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const videos = await Video.find()
            .sort({ createdAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const total = await Video.countDocuments();
        res.json({ videos, total, page: +page, totalPages: Math.ceil(total / +limit) });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const updateVideo = async (req: Request, res: Response) => {
    try {
        const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!video) return res.status(404).json({ message: 'Not found' });
        res.json(video);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteVideo = async (req: Request, res: Response) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const publicListVideos = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const videos = await Video.find({ status: 'PUBLISHED' })
            .sort({ publishedAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const total = await Video.countDocuments({ status: 'PUBLISHED' });
        res.json({ videos, total, page: +page, totalPages: Math.ceil(total / +limit) });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
