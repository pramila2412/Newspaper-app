import { Request, Response } from 'express';
import { Media } from '../models/Media';
import { AuthRequest } from '../middlewares/auth';
import { processImage } from '../services/media.service';
import { createAuditLog } from '../services/audit.service';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

export const uploadMedia = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const processed = await processImage(req.file);

        const media = await Media.create({
            originalUrl: processed.originalUrl,
            thumbnailUrl: processed.thumbnailUrl,
            mediumUrl: processed.mediumUrl,
            largeUrl: processed.largeUrl,
            webpUrl: processed.webpUrl,
            altText: req.body.altText || '',
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.userId,
        });

        await createAuditLog(req.userId!, 'UPLOAD_MEDIA', 'Media', String(media._id), null, { fileName: req.file.originalname });

        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const listMedia = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 30;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Media.find().populate('uploadedBy', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
            Media.countDocuments(),
        ]);

        res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteMedia = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            res.status(404).json({ message: 'Media not found' });
            return;
        }

        // Delete physical files
        const uploadDir = path.resolve(env.UPLOAD_DIR);
        const urls = [media.originalUrl, media.thumbnailUrl, media.mediumUrl, media.largeUrl, media.webpUrl];
        for (const url of urls) {
            if (url) {
                const filePath = path.join(uploadDir, path.basename(url));
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        await Media.findByIdAndDelete(req.params.id);
        await createAuditLog(req.userId!, 'DELETE_MEDIA', 'Media', req.params.id, { fileName: media.fileName }, null);

        res.json({ message: 'Media deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMediaById = async (req: Request, res: Response): Promise<void> => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            res.status(404).json({ message: 'Media not found' });
            return;
        }
        res.json(media);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
