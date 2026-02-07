import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
    title: string;
    description: string;
    price: number;
    location: string;
    propertyType: 'Apartment' | 'Villa' | 'Plot';
    beds: number;
    baths: number;
    area: number;
    images: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PropertySchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        location: { type: String, required: true },
        propertyType: {
            type: String,
            enum: ['Apartment', 'Villa', 'Plot', 'House', 'Cottage', 'Penthouse', 'Commercial'],
            required: true,
        },
        beds: { type: Number, default: 0 },
        baths: { type: Number, default: 0 },
        area: { type: Number, required: true },
        images: { type: [String], default: [] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
