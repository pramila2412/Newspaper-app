import mongoose, { Schema, Document, Types } from 'mongoose';

export enum MatrimonyStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    PENDING = 'PENDING',
}

export interface IMatrimony extends Document {
    name: string;
    age: number;
    gender: string;
    education: string;
    denomination: string;
    district: string;
    description: string;
    contactNumber: string;
    photos: string[];
    planDuration: number; // in days
    startDate: Date;
    expiryDate: Date;
    status: MatrimonyStatus;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const MatrimonySchema = new Schema<IMatrimony>(
    {
        name: { type: String, required: true, trim: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true, enum: ['Male', 'Female'] },
        education: { type: String, required: true, trim: true },
        denomination: { type: String, required: true, trim: true },
        district: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        contactNumber: { type: String, required: true },
        photos: [{ type: String }],
        planDuration: { type: Number, required: true },
        startDate: { type: Date, required: true },
        expiryDate: { type: Date, required: true },
        status: { type: String, enum: Object.values(MatrimonyStatus), default: MatrimonyStatus.PENDING },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

MatrimonySchema.index({ status: 1, expiryDate: 1 });
MatrimonySchema.index({ district: 1 });

export const Matrimony = mongoose.model<IMatrimony>('Matrimony', MatrimonySchema);
