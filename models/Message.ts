import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    name: string;
    email: string;
    phone: string;
    message: string;
    propertyId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: false },
        message: { type: String, required: true },
        propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    },
    { timestamps: true }
);

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
