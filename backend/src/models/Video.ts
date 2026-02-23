import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVideo extends Document {
    title: string;
    slug: string;
    youtubeUrl: string;
    thumbnail: string;
    description: string;
    categoryId: Types.ObjectId;
    status: 'PUBLISHED' | 'DRAFT';
    viewCount: number;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true },
        youtubeUrl: { type: String, required: true },
        thumbnail: { type: String, default: '' },
        description: { type: String, default: '' },
        categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
        status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'DRAFT' },
        viewCount: { type: Number, default: 0 },
        publishedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

VideoSchema.index({ slug: 1 });
VideoSchema.index({ status: 1, publishedAt: -1 });

export const Video = mongoose.model<IVideo>('Video', VideoSchema);
