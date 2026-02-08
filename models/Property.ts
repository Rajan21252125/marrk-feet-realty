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
    furnishType?: string;
    coveredParking?: number;
    openParking?: number;
    tenantPreference?: string[];
    petFriendly?: boolean;
    bhkType?: string;
    ageOfProperty?: number;
    balcony?: number;
    floorNumber?: number;
    totalFloors?: number;
    facing?: string;
    overlooking?: string[];
    ownershipType?: string;
    possessionStatus?: string;
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
        furnishType: { type: String, enum: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'] },
        coveredParking: { type: Number },
        openParking: { type: Number },
        tenantPreference: { type: [String] },
        petFriendly: { type: Boolean },
        bhkType: { type: String },
        ageOfProperty: { type: Number },
        balcony: { type: Number },
        floorNumber: { type: Number },
        totalFloors: { type: Number },
        facing: { type: String },
        overlooking: { type: [String] },
        ownershipType: { type: String },
        possessionStatus: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
