const winston = require('winston');

const logger = winston.createLogger({
    level: 'info', // Your logging level. Can be info, debug, error, warn etc.
    format: winston.format.json(), // Formatting options, you can also use winston.format.simple()
    defaultMeta: { service: 'your-service-name' }, // Meta info for all log messages
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to error.log
        new winston.transports.File({ filename: 'combined.log' }) // Log all levels to combined.log
    ]
});

// If not in production, also log to the console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;
