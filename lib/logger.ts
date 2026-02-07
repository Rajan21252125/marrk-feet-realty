import winston from 'winston';

const { combine, timestamp, json, colorize, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp(),
        json()
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                logFormat
            )
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

export default logger;
