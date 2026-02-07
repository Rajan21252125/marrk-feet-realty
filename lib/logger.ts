import winston from 'winston';

const { combine, timestamp, json, colorize, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const transports: winston.transport[] = [
    new winston.transports.Console({
        format: combine(
            colorize(),
            timestamp(),
            logFormat
        )
    }),
];

// Only enable file logging in development
if (process.env.NODE_ENV === 'development') {
    transports.push(
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    );
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp(),
        json()
    ),
    transports,
});

export default logger;
