import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
    email: string;
    isActive: boolean;
    subscribedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        isActive: { type: Boolean, default: true },
        subscribedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Subscriber = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
