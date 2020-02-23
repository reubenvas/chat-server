import winston, { format } from 'winston';

// const errorStackTracerFormat = winston.format((info) => {
//     if (info.meta && info.meta instanceof Error) {
//         info.message = `${info.message} ${info.meta.stack}`;
//     }
//     return info;
// });

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    ),
    defaultMeta: { service: 'your-service-name' },
    transports: [
        new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple(),
            format.printf(
                ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
            ),
        ),
    }));
}

export const errorLogHandler = (func: Function): void => {
    try {
        func();
    } catch (err) {
        logger.error(new Error(err));
    }
};

export default logger;
