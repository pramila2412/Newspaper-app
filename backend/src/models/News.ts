import mongoose, { Schema, Document, Types } from 'mongoose';

export enum NewsStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    SCHEDULED = 'SCHEDULED',
    ARCHIVED = 'ARCHIVED',
}

export interface IContentBlock {
    id: string;
    type: 'heading' | 'paragraph' | 'bible_verse' | 'quote' | 'image' | 'gallery' | 'divider' | 'callout' | 'list' | 'youtube';
    data: Record<string, any>;
}

export interface INews extends Document {
    title: string;
    slug: string;
    subtitle: string;
    categoryId: Types.ObjectId;
    authorId: Types.ObjectId;
    heroImage: string;
    contentBlocks: IContentBlock[];
    status: NewsStatus;
    publishedAt: Date | null;
    scheduledAt: Date | null;
    viewCount: number;
    isFeatured: boolean;
    isSponsored: boolean;
    isBreaking: boolean;
    tags: string[];
    subCategory: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    ogImage: string;
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

const NewsSchema = new Schema<INews>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true },
        subtitle: { type: String, default: '', trim: true },
        categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        heroImage: { type: String, default: '' },
        contentBlocks: [ContentBlockSchema],
        status: { type: String, enum: Object.values(NewsStatus), default: NewsStatus.DRAFT },
        publishedAt: { type: Date, default: null },
        scheduledAt: { type: Date, default: null },
        viewCount: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
        isSponsored: { type: Boolean, default: false },
        isBreaking: { type: Boolean, default: false },
        tags: [{ type: String }],
        subCategory: { type: String, default: '' },
        seoTitle: { type: String, default: '' },
        seoDescription: { type: String, default: '' },
        seoKeywords: [{ type: String }],
        ogImage: { type: String, default: '' },
    },
    { timestamps: true }
);

NewsSchema.index({ slug: 1 });
NewsSchema.index({ status: 1, publishedAt: -1 });
NewsSchema.index({ categoryId: 1, status: 1 });
NewsSchema.index({ scheduledAt: 1, status: 1 });

export const News = mongoose.model<INews>('News', NewsSchema);
