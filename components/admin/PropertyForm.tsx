'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Upload, X, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface PropertyFormProps {
    initialData?: any;
}

export default function PropertyForm({ initialData }: PropertyFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        location: initialData?.location || '',
        address: initialData?.address || '', // Assuming address field exists or part of location
        city: initialData?.city || '',
        state: initialData?.state || '',
        propertyType: initialData?.propertyType || 'Apartment',
        beds: initialData?.beds || '',
        baths: initialData?.baths || '',
        area: initialData?.area || '',
    });

    useEffect(() => {
        if (initialData) {
            // Ensure fields are populated correctly if data comes in
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                price: initialData.price || '',
                location: initialData.location || '',
                address: initialData.address || '',
                city: initialData.city || '',
                state: initialData.state || '',
                propertyType: initialData.propertyType || 'Apartment',
                beds: initialData.beds || '',
                baths: initialData.baths || '',
                area: initialData.area || '',
            });
            setImages(initialData.images || []);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                // 1. Get signature
                const signRes = await fetch('/api/admin/sign-cloudinary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paramsToSign: { folder: 'properties' } }),
                });

                if (!signRes.ok) throw new Error('Failed to get signature');
                const { signature, timestamp, cloud_name, api_key } = await signRes.json(); // Assuming API signature route will return cloud_name/api_key too for convenience, or we use env vars if secure.
                // Wait, my sign route only returns signature. 
                // I need timestamp and folder in payload to sign.
                // And I need cloud_name to POST to.

                // Let's adjust the sign route usage or logic depending on what we implemented.
                // The sign route I implemented: returns { signature }.
                // It signs whatever is in `paramsToSign`.
                // So I should pass timestamp and folder there.

                const timestampForUpload = Math.round(new Date().getTime() / 1000);
                const paramsToSign = {
                    folder: 'properties',
                    timestamp: timestampForUpload
                };

                const signRes2 = await fetch('/api/admin/sign-cloudinary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paramsToSign }),
                });

                if (!signRes2.ok) throw new Error('Signature failed');
                const { signature: signature2 } = await signRes2.json();


                // 2. Upload to Cloudinary
                const formData = new FormData();
                formData.append('file', file);
                formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ''); // Need public env var
                formData.append('timestamp', timestampForUpload.toString());
                formData.append('signature', signature2);
                formData.append('folder', 'properties');

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
            const finalImages = [...images, ...newImageUrls];

            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                beds: parseInt(formData.beds),
                baths: parseInt(formData.baths),
                area: parseInt(formData.area),
                images: finalImages,
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
                        <label className="mb-2 block text-sm font-medium">Price ($)</label>
                        <input
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0.00"
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

            {/* Details */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Property Details</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Type</label>
                        <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Plot">Plot</option>
                            <option value="House">House</option>
                            <option value="Cottage">Cottage</option>
                            <option value="Penthouse">Penthouse</option>
                            <option value="Commercial">Commercial</option>
                        </select>
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
