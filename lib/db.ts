import mongoose from 'mongoose';

const MONGODB_URI =
    process.env.MONGODB_URI ??
    (process.env.NODE_ENV !== 'production'
        ? 'mongodb://localhost:27017/markfeet-realty'
        : undefined);

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
} else {
    // Do not log the full URI for security, just presence
    if (process.env.NODE_ENV === 'production') {
        console.log('MONGODB_URI is defined');
    }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
}

declare global {
    var mongooseCache: MongooseCache;
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose.connection;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
