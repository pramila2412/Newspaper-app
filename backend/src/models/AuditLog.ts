import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
    userId: Types.ObjectId;
    action: string;
    entity: string;
    entityId: string;
    before: Record<string, any> | null;
    after: Record<string, any> | null;
    createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        action: { type: String, required: true },
        entity: { type: String, required: true },
        entityId: { type: String, required: true },
        before: { type: Schema.Types.Mixed, default: null },
        after: { type: Schema.Types.Mixed, default: null },
    },
    { timestamps: true }
);

AuditLogSchema.index({ entity: 1, entityId: 1 });
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
