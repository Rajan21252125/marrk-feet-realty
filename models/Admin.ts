import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    passwordHash: string;
    role: 'admin';
    isVerified: boolean;
    verificationCode?: string;
    name?: string;
    profileImage?: string;
    companyName?: string;
    sessionVersion: number;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, default: 'admin', enum: ['admin'] },
        isVerified: { type: Boolean, default: false },
        verificationCode: { type: String },
        name: { type: String },
        profileImage: { type: String },
        companyName: { type: String },
        sessionVersion: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
