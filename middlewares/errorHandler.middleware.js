import ApiError from '../utils/ApiError.js';

export const globalErrorHandler = (err, req, res, next) => {
    // 1. Set defaults for the error object
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }

    // 2. Production: Operational errors (trusted errors we created)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    // 3. Production: Programming or unknown errors (don't leak details)
    console.error('💥 ERROR:', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
    // Note: next() is usually not called after sending a response in an error handler
};