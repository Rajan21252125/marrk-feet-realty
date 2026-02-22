import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import Message from '@/models/Message';

export async function GET() {
    try {
        await dbConnect();

        const activeListings = await Property.countDocuments({
            isActive: true,
        });

        const propertiesSold = await Property.countDocuments({
            status: 'Sold'
        });

        // Count unique emails from messages as "Happy Clients"
        const uniqueClients = await Message.distinct('email');
        const happyClientsCount = uniqueClients.length;

        // Base offsets for professional look on new sites
        const baseClients = 50;
        const baseSold = 30;

        return NextResponse.json({
            activeListings: activeListings,
            propertiesSold: propertiesSold + baseSold,
            happyClients: happyClientsCount + baseClients,
        });

    } catch (_error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
