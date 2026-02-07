import Link from 'next/link';
import Image from 'next/image';
import { Button } from './Button';
import { Bed, Bath, Move, MapPin } from 'lucide-react';

interface PropertyCardProps {
    id: string;
    title: string;
    price: number;
    location: string;
    beds: number;
    baths: number;
    area: number;
    imageUrl: string;
    category: string;
}

export function PropertyCard({
    id,
    title,
    price,
    location,
    beds,
    baths,
    area,
    imageUrl,
    category
}: PropertyCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-primary shadow-sm dark:bg-black/90">
                    {category}
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="line-clamp-1 text-lg font-semibold">{title}</h3>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {location}
                        </div>
                    </div>
                    <p className="text-lg font-bold text-primary">
                        ${price.toLocaleString()}
                    </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{beds}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{baths}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Move className="h-4 w-4" />
                            <span>{area} sqft</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Link href={`/properties/${id}`} className="w-full">
                        <Button className="w-full">View Details</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
