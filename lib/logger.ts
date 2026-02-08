import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf } = winston.format;

const customLogFormat = printf(({ level, message, timestamp }) => {
    const tag = level === 'error' ? '[ERROR]' : '[MSG]';
    // Format timestamp as YYYY-MM-DD HH:mm:ss if possible, or simplified
    // Standard timestamp() gives ISO string. We can use a custom function or just slice ISO.
    // Let's stick to the default ISO or just the provided timestamp for now, but user asked for date wise.
    // "logs all log should in one file but the log should be date wise" -> this refers to file rotation
    // "logs can be differentiate with [ERROR] ... and [MSG]" -> this refers to content

    // To make it cleaner inside the log line:
    return `${timestamp} ${tag}: ${message}`;
});

const transports: winston.transport[] = [
    new winston.transports.Console({
        format: combine(
            winston.format.colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            customLogFormat
        )
    }),
];

// File logging with daily rotation
const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customLogFormat
    )
});

transports.push(fileRotateTransport);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports,
});

export default logger;
