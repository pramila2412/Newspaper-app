import mongoose, { Schema, Document } from 'mongoose';

export enum ClassifiedCategory {
    REAL_ESTATE = 'real-estate',
    RENT_LEASE = 'rent-lease',
    CONSTRUCTION = 'construction',
    OUTFITS = 'outfits',
    OTHER = 'other',
}

export enum ClassifiedStatus {
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    EXPIRED = 'EXPIRED',
    DRAFT = 'DRAFT',
}

export interface IClassified extends Document {
    title: string;
    slug: string;
    description: string;
    category: ClassifiedCategory;
    contactPhone: string;
    contactName: string;
    images: string[];
    location: string;
    price: string;
    status: ClassifiedStatus;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ClassifiedSchema = new Schema<IClassified>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, default: '' },
        category: { type: String, enum: Object.values(ClassifiedCategory), default: ClassifiedCategory.OTHER },
        contactPhone: { type: String, default: '' },
        contactName: { type: String, default: '' },
        images: [{ type: String }],
        location: { type: String, default: '' },
        price: { type: String, default: '' },
        status: { type: String, enum: Object.values(ClassifiedStatus), default: ClassifiedStatus.ACTIVE },
        viewCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

ClassifiedSchema.index({ slug: 1 });
ClassifiedSchema.index({ category: 1, status: 1 });

export const Classified = mongoose.model<IClassified>('Classified', ClassifiedSchema);
