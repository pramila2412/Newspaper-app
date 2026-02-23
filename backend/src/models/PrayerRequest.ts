import mongoose, { Schema, Document } from 'mongoose';

export interface IPrayerRequest extends Document {
    title: string;
    content: string;
    submittedBy: string;
    type: 'praise' | 'prayer';
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PrayerRequestSchema = new Schema<IPrayerRequest>(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        submittedBy: { type: String, default: 'Anonymous' },
        type: { type: String, enum: ['praise', 'prayer'], default: 'prayer' },
        isApproved: { type: Boolean, default: false },
    },
    { timestamps: true }
);

PrayerRequestSchema.index({ isApproved: 1, createdAt: -1 });

export const PrayerRequest = mongoose.model<IPrayerRequest>('PrayerRequest', PrayerRequestSchema);
