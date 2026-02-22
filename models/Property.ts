import mongoose, { Schema, Document } from 'mongoose';

export interface IPropertyData {
    _id: string; // Add _id for lean() objects
    title: string;
    description: string;
    price: number;
    builder?: string;
    location: string;
    propertyType: 'Apartment' | 'Villa' | 'Plot' | 'House' | 'Cottage' | 'Penthouse' | 'Commercial';
    beds: number;
    baths: number;
    area: number;
    tags?: string[];
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
    listingType: 'Sale' | 'Rent';
    status: 'Available' | 'Sold';
    createdAt: Date;
    updatedAt: Date;
}

export interface IProperty extends Document, Omit<IPropertyData, '_id'> { }

const PropertySchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        builder: { type: String },
        location: { type: String, required: true },
        propertyType: {
            type: String,
            enum: ['Apartment', 'Villa', 'Plot', 'House', 'Cottage', 'Penthouse', 'Commercial'],
            required: true,
        },
        beds: { type: Number, default: 0 },
        baths: { type: Number, required: true },
        area: { type: Number, required: true },
        tags: { type: [String], default: [] },
        images: { type: [String], required: true },
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
        listingType: { type: String, enum: ['Sale', 'Rent'], default: 'Sale' },
        status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
    },
    { timestamps: true }
);

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
