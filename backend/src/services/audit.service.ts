import { AuditLog } from '../models/AuditLog';
import mongoose from 'mongoose';

export const createAuditLog = async (
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    before: Record<string, any> | null = null,
    after: Record<string, any> | null = null
): Promise<void> => {
    try {
        await AuditLog.create({
            userId: new mongoose.Types.ObjectId(userId),
            action,
            entity,
            entityId,
            before,
            after,
        });
    } catch (error) {
        console.error('Audit log error:', error);
    }
};
