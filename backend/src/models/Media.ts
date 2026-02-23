import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMedia extends Document {
    originalUrl: string;
    thumbnailUrl: string;
    mediumUrl: string;
    largeUrl: string;
    webpUrl: string;
    altText: string;
    fileName: string;
    mimeType: string;
    size: number;
    uploadedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
    {
        originalUrl: { type: String, required: true },
        thumbnailUrl: { type: String, default: '' },
        mediumUrl: { type: String, default: '' },
        largeUrl: { type: String, default: '' },
        webpUrl: { type: String, default: '' },
        altText: { type: String, default: '' },
        fileName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

MediaSchema.index({ uploadedBy: 1 });

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
