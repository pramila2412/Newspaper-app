import mongoose, { Schema, Document, Types } from 'mongoose';
import { IContentBlock } from './News';

export enum ObituaryStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED',
    DRAFT = 'DRAFT',
}

export interface IObituary extends Document {
    name: string;
    age: number;
    district: string;
    deathDate: Date;
    photo: string;
    contentBlocks: IContentBlock[];
    status: ObituaryStatus;
    viewCount: number;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ContentBlockSchema = new Schema(
    {
        id: { type: String, required: true },
        type: {
            type: String,
            enum: ['heading', 'paragraph', 'bible_verse', 'quote', 'image', 'gallery', 'divider', 'callout', 'list', 'youtube'],
            required: true,
        },
        data: { type: Schema.Types.Mixed, default: {} },
    },
    { _id: false }
);

const ObituarySchema = new Schema<IObituary>(
    {
        name: { type: String, required: true, trim: true },
        age: { type: Number, required: true },
        district: { type: String, required: true, trim: true },
        deathDate: { type: Date, required: true },
        photo: { type: String, default: '' },
        contentBlocks: [ContentBlockSchema],
        status: { type: String, enum: Object.values(ObituaryStatus), default: ObituaryStatus.DRAFT },
        viewCount: { type: Number, default: 0 },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

ObituarySchema.index({ status: 1 });
ObituarySchema.index({ district: 1 });

export const Obituary = mongoose.model<IObituary>('Obituary', ObituarySchema);
