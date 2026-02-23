import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    EDITOR = 'EDITOR',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    INACTIVE = 'INACTIVE',
}

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
    status: UserStatus;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, default: '' },
        name: { type: String, required: true, trim: true },
        role: { type: String, enum: Object.values(UserRole), required: true },
        status: { type: String, enum: Object.values(UserStatus), default: UserStatus.PENDING },
        refreshToken: { type: String, default: null },
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, status: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
