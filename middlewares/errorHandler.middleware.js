import ApiError from '../utils/ApiError.js';

export const globalErrorHandler = (err, req, res, next) => {
    // Default values
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Only send stack trace in development
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }

    // Production: don't leak stack traces
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    // Programming or unknown errors
    console.error('💥 ERROR:', err);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
    next();
};
