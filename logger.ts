import winston, { format, transports } from 'winston';

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    ),
    transports: [
        new transports.File({ filename: 'logs/errors.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple(),
            format.printf(
                ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
            ),
        ),
    }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorLogHandler = (func: () => any): any => {
    let returnVal;
    try {
        returnVal = func();
    } catch (err) {
        logger.error(new Error(err));
    }
    return returnVal;
};

export default logger;
