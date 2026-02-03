import ApiError from '../utils/ApiError.js';

export const globalErrorHandler = (err, req, res, next) => {
    this.statusCode = err.statusCode || 500;
    this.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    console.error('💥 ERROR:', err);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
    next();
};
