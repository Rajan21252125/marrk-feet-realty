'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

import { IProperty } from '@/models/Property';

interface PropertyFormData {
    title: string;
    description: string;
    price: string | number;
    builder: string;
    location: string;
    address: string;
    city: string;
    state: string;
    propertyType: string;
    beds: string | number;
    baths: string | number;
    area: string | number;
    furnishType: string;
    coveredParking: string | number;
    openParking: string | number;
    tenantPreference: string[];
    petFriendly: boolean;
    bhkType: string;
    ageOfProperty: string | number;
    balcony: string | number;
    floorNumber: string | number;
    totalFloors: string | number;
    facing: string;
    overlooking: string[];
    tags: string[];
    ownershipType: string;
    possessionStatus: string;
    listingType: string;
    status: string;
}

interface PropertyFormProps {
    initialData?: IProperty | null;
}

export default function PropertyForm({ initialData }: PropertyFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);

    const [formData, setFormData] = useState<PropertyFormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        builder: initialData?.builder || '',
        location: initialData?.location || '',
        address: '',
        city: '',
        state: '',
        propertyType: initialData?.propertyType || 'Apartment',
        beds: initialData?.beds || '',
        baths: initialData?.baths || '',
        area: initialData?.area || '',
        furnishType: initialData?.furnishType || '',
        coveredParking: initialData?.coveredParking || '',
        openParking: initialData?.openParking || '',
        tenantPreference: initialData?.tenantPreference || [],
        petFriendly: initialData?.petFriendly || false,
        bhkType: initialData?.bhkType || '',
        ageOfProperty: initialData?.ageOfProperty || '',
        balcony: initialData?.balcony || '',
        floorNumber: initialData?.floorNumber || '',
        totalFloors: initialData?.totalFloors || '',
        facing: initialData?.facing || '',
        overlooking: initialData?.overlooking || [],
        tags: initialData?.tags || [],
        ownershipType: initialData?.ownershipType || '',
        possessionStatus: initialData?.possessionStatus || '',
        listingType: initialData?.listingType || 'Sale',
        status: initialData?.status || 'Available',
    });

    useEffect(() => {
        if (initialData) {
            // Ensure fields are populated correctly if data comes in
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                price: initialData.price || '',
                builder: initialData.builder || '',
                location: initialData.location || '',
                address: '',
                city: '',
                state: '',
                propertyType: initialData.propertyType || 'Apartment',
                beds: initialData.beds || '',
                baths: initialData.baths || '',
                area: initialData.area || '',
                furnishType: initialData.furnishType || '',
                coveredParking: initialData.coveredParking || '',
                openParking: initialData.openParking || '',
                tenantPreference: initialData.tenantPreference || [],
                petFriendly: initialData.petFriendly || false,
                bhkType: initialData.bhkType || '',
                ageOfProperty: initialData.ageOfProperty || '',
                balcony: initialData.balcony || '',
                floorNumber: initialData.floorNumber || '',
                totalFloors: initialData.totalFloors || '',
                facing: initialData.facing || '',
                overlooking: initialData.overlooking || [],
                tags: initialData.tags || [],
                ownershipType: initialData.ownershipType || '',
                possessionStatus: initialData.possessionStatus || '',
                listingType: initialData.listingType || 'Sale',
                status: initialData.status || 'Available',
            });
            setImages(initialData.images || []);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleMultiSelect = (field: keyof PropertyFormData, value: string) => {
        setFormData((prev) => {
            const current = (prev[field] as string[]) || [];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter((item: string) => item !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const toggleBoolean = (field: keyof PropertyFormData, value: boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const newPreviews = newFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setPreviewImages(prev => [...prev, ...newPreviews]);
        }
    };

    const removePreviewImage = (index: number) => {
        setPreviewImages(prev => {
            const newPrev = [...prev];
            URL.revokeObjectURL(newPrev[index].preview);
            newPrev.splice(index, 1);
            return newPrev;
        });
    };

    const removeExistingImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImagesToCloudinary = async () => {
        if (previewImages.length === 0) return [];

        const uploadedUrls: string[] = [];

        for (const { file } of previewImages) {
            try {
                const timestampForUpload = Math.round(new Date().getTime() / 1000);
                const paramsToSign = {
                    folder: 'markfeet',
                    timestamp: timestampForUpload
                };

                const signRes = await fetch('/api/admin/sign-cloudinary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paramsToSign }),
                });

                if (!signRes.ok) throw new Error('Signature failed');
                const { signature } = await signRes.json();

                // 2. Upload to Cloudinary
                const formData = new FormData();
                formData.append('file', file);
                formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
                formData.append('timestamp', timestampForUpload.toString());
                formData.append('signature', signature);
                formData.append('folder', 'markfeet');

                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                if (!cloudName) throw new Error('Missing Cloudinary Cloud Name');

                const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    console.error('Cloudinary error:', err);
                    throw new Error('Image upload failed');
                }

                const data = await uploadRes.json();
                console.log('Uploaded image:', data.secure_url);
                uploadedUrls.push(data.secure_url);

            } catch (error) {
                console.error('Upload error:', error);
                toast.error(`Failed to upload ${file.name}`);
            }
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploading(true);

        try {
            // Upload new images
            const newImageUrls = await uploadImagesToCloudinary();
            console.log('New Image URLs:', newImageUrls);

            const finalImages = [...images, ...newImageUrls];
            console.log('Final Images Payload:', finalImages);

            const payload = {
                ...formData,
                price: parseFloat(formData.price.toString()),
                beds: parseInt(formData.beds.toString()),
                baths: parseInt(formData.baths.toString()),
                area: parseInt(formData.area.toString()),
                images: finalImages,
                coveredParking: formData.coveredParking ? parseInt(formData.coveredParking.toString()) : 0,
                openParking: formData.openParking ? parseInt(formData.openParking.toString()) : 0,
                ageOfProperty: formData.ageOfProperty ? parseInt(formData.ageOfProperty.toString()) : 0,
                balcony: formData.balcony ? parseInt(formData.balcony.toString()) : 0,
                floorNumber: formData.floorNumber ? parseInt(formData.floorNumber.toString()) : 0,
                totalFloors: formData.totalFloors ? parseInt(formData.totalFloors.toString()) : 0,
            };

            const url = initialData ? `/api/properties/${initialData._id}` : '/api/properties';
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save property');

            toast.success(initialData ? 'Property updated successfully' : 'Property created successfully');
            router.push('/admin/properties');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Property Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            type="text"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="e.g. Luxury Villa with Sea View"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Describe the property..."
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Price (₹)</label>
                        <input
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Builder / Company Name</label>
                        <input
                            name="builder"
                            value={formData.builder}
                            onChange={handleChange}
                            type="text"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="e.g. Godrej Properties"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Tags (comma separated)</label>
                        <input
                            name="tags"
                            value={formData.tags.join(', ')}
                            onChange={(e) => {
                                const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t !== '');
                                setFormData(prev => ({ ...prev, tags }));
                            }}
                            type="text"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="e.g. Luxury, Trending, Budget Pick"
                        />
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Location</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-medium">Location</label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            type="text"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="123 Street Name"
                        />
                    </div>
                    {/* Simplified for now based on Property Model which just has 'location'. 
                       The form has address, city, state in UI but model only has location.
                       We will just map location to the main field. 
                   */}
                </div>
            </div>

            {/* Property Details */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Property Details</h2>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Status:</label>
                        <Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="bg-transparent w-32"
                            containerClassName="w-auto"
                        >
                            <option value="Available" className="bg-white dark:bg-neutral-900">Available</option>
                            <option value="Sold" className="bg-white dark:bg-neutral-900">Sold</option>
                        </Select>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Listing Type</label>
                        <Select
                            name="listingType"
                            value={formData.listingType}
                            onChange={handleChange}
                            className="bg-transparent"
                        >
                            <option value="Sale" className="bg-white dark:bg-neutral-900">For Sale</option>
                            <option value="Rent" className="bg-white dark:bg-neutral-900">For Rent</option>
                        </Select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Type</label>
                        <Select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            className="bg-transparent"
                        >
                            <option value="Apartment" className="bg-white dark:bg-neutral-900">Apartment</option>
                            <option value="Villa" className="bg-white dark:bg-neutral-900">Villa</option>
                            <option value="Plot" className="bg-white dark:bg-neutral-900">Plot</option>
                            <option value="House" className="bg-white dark:bg-neutral-900">House</option>
                            <option value="Cottage" className="bg-white dark:bg-neutral-900">Cottage</option>
                            <option value="Penthouse" className="bg-white dark:bg-neutral-900">Penthouse</option>
                            <option value="Commercial" className="bg-white dark:bg-neutral-900">Commercial</option>
                        </Select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">BHK Type</label>
                        <Select
                            name="bhkType"
                            value={formData.bhkType}
                            onChange={handleChange}
                            className="bg-transparent"
                        >
                            <option value="" className="bg-white dark:bg-neutral-900">Select BHK</option>
                            <option value="1 RK" className="bg-white dark:bg-neutral-900">1 RK</option>
                            <option value="1 BHK" className="bg-white dark:bg-neutral-900">1 BHK</option>
                            <option value="2 BHK" className="bg-white dark:bg-neutral-900">2 BHK</option>
                            <option value="3 BHK" className="bg-white dark:bg-neutral-900">3 BHK</option>
                            <option value="4 BHK" className="bg-white dark:bg-neutral-900">4 BHK</option>
                            <option value="4+ BHK" className="bg-white dark:bg-neutral-900">4+ BHK</option>
                        </Select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Bedrooms</label>
                        <input
                            name="beds"
                            value={formData.beds}
                            onChange={handleChange}
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Bathrooms</label>
                        <input
                            name="baths"
                            value={formData.baths}
                            onChange={handleChange}
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Balcony</label>
                        <input
                            name="balcony"
                            value={formData.balcony}
                            onChange={handleChange}
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Area (sq ft)</label>
                        <input
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            required
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Age of Property (Years)</label>
                        <input
                            name="ageOfProperty"
                            value={formData.ageOfProperty}
                            onChange={handleChange}
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Floor Number</label>
                        <input
                            name="floorNumber"
                            value={formData.floorNumber}
                            onChange={handleChange}
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Total Floors</label>
                        <input
                            name="totalFloors"
                            value={formData.totalFloors}
                            onChange={handleChange}
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Facing</label>
                        <Select
                            name="facing"
                            value={formData.facing}
                            onChange={handleChange}
                            className="bg-transparent"
                        >
                            <option value="" className="bg-white dark:bg-neutral-900">Select Direction</option>
                            <option value="North" className="bg-white dark:bg-neutral-900">North</option>
                            <option value="South" className="bg-white dark:bg-neutral-900">South</option>
                            <option value="East" className="bg-white dark:bg-neutral-900">East</option>
                            <option value="West" className="bg-white dark:bg-neutral-900">West</option>
                            <option value="North-East" className="bg-white dark:bg-neutral-900">North-East</option>
                            <option value="North-West" className="bg-white dark:bg-neutral-900">North-West</option>
                            <option value="South-East" className="bg-white dark:bg-neutral-900">South-East</option>
                            <option value="South-West" className="bg-white dark:bg-neutral-900">South-West</option>
                        </Select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Possession Status</label>
                        <Select
                            name="possessionStatus"
                            value={formData.possessionStatus}
                            onChange={handleChange}
                            className="bg-transparent"
                        >
                            <option value="" className="bg-white dark:bg-neutral-900">Select Status</option>
                            <option value="Ready to Move" className="bg-white dark:bg-neutral-900">Ready to Move</option>
                            <option value="Under Construction" className="bg-white dark:bg-neutral-900">Under Construction</option>
                        </Select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Ownership Type</label>
                        <Select
                            name="ownershipType"
                            value={formData.ownershipType}
                            onChange={handleChange}
                            className="bg-transparent"
                        >
                            <option value="" className="bg-white dark:bg-neutral-900">Select Type</option>
                            <option value="Freehold" className="bg-white dark:bg-neutral-900">Freehold</option>
                            <option value="Leasehold" className="bg-white dark:bg-neutral-900">Leasehold</option>
                            <option value="Co-operative Society" className="bg-white dark:bg-neutral-900">Co-operative Society</option>
                            <option value="Power of Attorney" className="bg-white dark:bg-neutral-900">Power of Attorney</option>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Amenities & Features */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Amenities & Features</h2>
                <div className="grid gap-6">
                    {/* Furnish Type */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">Furnish Type</label>
                        <div className="flex flex-wrap gap-2">
                            {['Fully Furnished', 'Semi Furnished', 'Unfurnished'].map((type) => (
                                <button
                                    type="button"
                                    key={type}
                                    onClick={() => setFormData(prev => ({ ...prev, furnishType: type }))}
                                    className={`rounded-full px-4 py-2 text-sm border transition-colors ${formData.furnishType === type
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background hover:bg-muted border-input'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Parking */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Covered Parking</label>
                            <div className="flex gap-2">
                                {[0, 1, 2, 3].map((num) => (
                                    <button
                                        type="button"
                                        key={num}
                                        onClick={() => setFormData(prev => ({ ...prev, coveredParking: num }))}
                                        className={`h-10 w-10 rounded-md border text-sm flex items-center justify-center transition-colors ${
                                            // loose check for number vs string in formData
                                            formData.coveredParking == num
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background hover:bg-muted border-input'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <input
                                    type="number"
                                    name="coveredParking"
                                    value={formData.coveredParking}
                                    onChange={handleChange}
                                    placeholder="3+"
                                    className="h-10 w-16 rounded-md border border-input bg-background px-2 text-sm text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Open Parking</label>
                            <div className="flex gap-2">
                                {[0, 1, 2, 3].map((num) => (
                                    <button
                                        type="button"
                                        key={num}
                                        onClick={() => setFormData(prev => ({ ...prev, openParking: num }))}
                                        className={`h-10 w-10 rounded-md border text-sm flex items-center justify-center transition-colors ${formData.openParking == num
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background hover:bg-muted border-input'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <input
                                    type="number"
                                    name="openParking"
                                    value={formData.openParking}
                                    onChange={handleChange}
                                    placeholder="3+"
                                    className="h-10 w-16 rounded-md border border-input bg-background px-2 text-sm text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tenant Preference */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">Preferred Tenant Type</label>
                        <div className="flex flex-wrap gap-2">
                            {['Family', 'Bachelors', 'Company'].map((type) => (
                                <button
                                    type="button"
                                    key={type}
                                    onClick={() => handleMultiSelect('tenantPreference', type)}
                                    className={`rounded-full px-4 py-2 text-sm border transition-colors ${formData.tenantPreference?.includes(type)
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background hover:bg-muted border-input'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pet Friendly */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">Pet Friendly?</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => toggleBoolean('petFriendly', true)}
                                className={`flex-1 rounded-md px-4 py-2 text-sm border transition-colors ${formData.petFriendly === true
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background hover:bg-muted border-input'
                                    }`}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleBoolean('petFriendly', false)}
                                className={`flex-1 rounded-md px-4 py-2 text-sm border transition-colors ${formData.petFriendly === false
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background hover:bg-muted border-input'
                                    }`}
                            >
                                No
                            </button>
                        </div>
                    </div>

                    {/* Overlooking */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">Overlooking</label>
                        <div className="flex flex-wrap gap-2">
                            {['Park', 'Main Road', 'Club', 'Pool', 'Garden'].map((view) => (
                                <button
                                    type="button"
                                    key={view}
                                    onClick={() => handleMultiSelect('overlooking', view)}
                                    className={`rounded-full px-4 py-2 text-sm border transition-colors ${formData.overlooking?.includes(view)
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background hover:bg-muted border-input'
                                        }`}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Media */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Media</h2>

                {/* Existing Images */}
                {images.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {images.map((url, index) => (
                            <div key={url} className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                <Image src={url} alt={`Existing ${index}`} fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* New Previews */}
                {previewImages.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {previewImages.map((item, index) => (
                            <div key={item.preview} className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                <Image src={item.preview} alt={`Preview ${index}`} fill className="object-cover opacity-70" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">New</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removePreviewImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex w-full items-center justify-center rounded-md border-2 border-dashed px-6 py-10 transition-colors hover:bg-muted/50 border-input">
                    <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="mt-4 flex text-sm text-muted-foreground justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/90">
                                <span>Upload images</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {uploading ? 'Uploading...' : 'Saving...'}
                        </>
                    ) : (
                        initialData ? 'Update Property' : 'Save Property'
                    )}
                </Button>
            </div>
        </form>
    );
}
