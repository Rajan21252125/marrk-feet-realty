import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
    level: string;
    message: string;
    meta?: any;
    timestamp: Date;
}

const LogSchema: Schema = new Schema(
    {
        level: { type: String, required: true },
        message: { type: String, required: true },
        meta: { type: Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        // Capped collection would be faster but less flexible for querying by level/text.
        // Let's use TTL index to auto-delete logs after 30 days.
    }
);

// Index for faster queries
LogSchema.index({ level: 1 });
LogSchema.index({ timestamp: -1 });

// TTL Index: Expire logs after 30 days
LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const Log = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

export default Log;
