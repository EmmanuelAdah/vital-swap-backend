import Joi from 'joi';

export const userSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .pattern(/^[\p{L} ,.'-]{2,30}$/u)
        .messages({
            'string.pattern.base': 'First name must be 2-30 characters and contain only letters.',
            'any.required': 'First name is required.'
        })
        .required(),

    lastName: Joi.string()
        .trim()
        .pattern(/^[\p{L} ,.'-]{2,30}$/u)
        .messages({
            'string.pattern.base': 'Last name must be 2-30 characters and contain only letters.'
        })
        .required(),

    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
        .email({ tlds: { allow: ['com', 'net', 'org', 'io'] } }) // Added more common TLDs
        .lowercase()
        .max(50)
        .required(),

    password: Joi.string()
        .min(6)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.',
            'string.min': 'Password should be at least 8 characters long.'
        })
        .required(),

    role: Joi.string()
        .valid('customer', 'admin')
        .default('user')
});
