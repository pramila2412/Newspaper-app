import mongoose, { Schema, Document } from 'mongoose';

export interface IAdset extends Document {
    name: string;
    placement: string;
    createdAt: Date;
    updatedAt: Date;
}

const AdsetSchema = new Schema<IAdset>(
    {
        name: { type: String, required: true, trim: true },
        placement: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

export const Adset = mongoose.model<IAdset>('Adset', AdsetSchema);

// ---

export enum AdStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
}

export interface IAd extends Document {
    adsetId: mongoose.Types.ObjectId;
    mediaId: mongoose.Types.ObjectId;
    link: string;
    priority: 'premium' | 'standard';
    startDate: Date;
    endDate: Date;
    status: AdStatus;
    impressions: number;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
}

const AdSchema = new Schema<IAd>(
    {
        adsetId: { type: Schema.Types.ObjectId, ref: 'Adset', required: true },
        mediaId: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
        link: { type: String, required: true },
        priority: { type: String, enum: ['premium', 'standard'], default: 'standard' },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, enum: Object.values(AdStatus), default: AdStatus.ACTIVE },
        impressions: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
    },
    { timestamps: true }
);

AdSchema.index({ status: 1, priority: -1 });
AdSchema.index({ adsetId: 1, status: 1 });
AdSchema.index({ endDate: 1, status: 1 });

export const Ad = mongoose.model<IAd>('Ad', AdSchema);
