import winston from 'winston';
import Transport from 'winston-transport';
import Log from '@/models/Log';
import dbConnect from '@/lib/db';

const { combine, timestamp, printf } = winston.format;

const customLogFormat = printf(({ level, message, timestamp }) => {
    const tag = level === 'error' ? '[ERROR]' : '[MSG]';
    return `${timestamp} ${tag}: ${message}`;
});

// Custom Transport for MongoDB
class MongoDBTransport extends Transport {
    constructor(opts?: Transport.TransportStreamOptions) {
        super(opts);
    }

    log(info: any, next: () => void) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        // Fire and forget - don't await to avoid blocking
        (async () => {
            try {
                // Ensure DB is connected
                await dbConnect();

                await Log.create({
                    level: info.level,
                    message: info.message,
                    meta: info,
                    timestamp: new Date()
                });
            } catch (err) {
                // Use stderr to avoid infinite loops if console transport captures this
                process.stderr.write(`Failed to save log to MongoDB: ${err}\n`);
            }
        })();

        next();
    }
}

const transports: winston.transport[] = [
    new winston.transports.Console({
        format: combine(
            winston.format.colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            customLogFormat
        )
    }),
];

// Use MongoDB transport in production (or if configured), File transport in dev
if (process.env.NODE_ENV === 'production') {
    transports.push(new MongoDBTransport());
} else {
    // File logging with daily rotation for development
    // Dynamic require to prevent 'fs' module issues in production serverless environment
    try {
        const DailyRotateFile = require('winston-daily-rotate-file');
        const fileRotateTransport = new DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                customLogFormat
            )
        });
        // Explicit cast to any to avoid strict type mismatch if different winston versions
        transports.push(fileRotateTransport as unknown as winston.transport);
    } catch (error) {
        console.warn('Failed to load winston-daily-rotate-file', error);
    }
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports,
});

export default logger;
