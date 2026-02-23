import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';

interface ProcessedImages {
    originalUrl: string;
    thumbnailUrl: string;
    mediumUrl: string;
    largeUrl: string;
    webpUrl: string;
}

export const processImage = async (file: Express.Multer.File): Promise<ProcessedImages> => {
    const uploadDir = path.resolve(env.UPLOAD_DIR);
    const baseName = path.parse(file.filename).name;

    const thumbPath = path.join(uploadDir, `${baseName}_thumb.webp`);
    const mediumPath = path.join(uploadDir, `${baseName}_medium.webp`);
    const largePath = path.join(uploadDir, `${baseName}_large.webp`);
    const webpPath = path.join(uploadDir, `${baseName}.webp`);

    const inputPath = file.path;

    // Generate thumbnail (150x150)
    await sharp(inputPath)
        .resize(150, 150, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(thumbPath);

    // Generate medium (600px wide)
    await sharp(inputPath)
        .resize(600, null, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(mediumPath);

    // Generate large (1200px wide)
    await sharp(inputPath)
        .resize(1200, null, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(largePath);

    // Generate WebP version of original
    await sharp(inputPath)
        .webp({ quality: 90 })
        .toFile(webpPath);

    const baseUrl = `/uploads`;

    return {
        originalUrl: `${baseUrl}/${file.filename}`,
        thumbnailUrl: `${baseUrl}/${baseName}_thumb.webp`,
        mediumUrl: `${baseUrl}/${baseName}_medium.webp`,
        largeUrl: `${baseUrl}/${baseName}_large.webp`,
        webpUrl: `${baseUrl}/${baseName}.webp`,
    };
};
