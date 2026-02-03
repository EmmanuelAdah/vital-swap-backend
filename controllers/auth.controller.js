import User from '../models/user.model.js';
import { userSchema } from '../middlewares/validator.middleware.js';
import { generateTokens } from "../middlewares/jwt.middleware.js";
import AppError from "../utils/ApiError.js";

export const signUp = async (req, res) => {
    const {firstName, lastName, email, role, password} = req.body;
    console.log('Here is your details: ' + req.body.email);

    const isValidInput = userSchema.validate(firstName, lastName, email, role, password);
    if (!isValidInput) throw new AppError('Invalid input', 400);

    try {
        const savedUser = await User.create({
            firstName,
            lastName,
            email,
            role,
            password,
        });

        const token = generateTokens({id: savedUser._id, email: savedUser.email, role: savedUser.role});

        return res.status(201).json({
            user: {
                id: savedUser._id,
                email: savedUser.email,
                role: savedUser.role,
            },
            token: token
        });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        }
        const token = generateTokens(payload);
        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            },
            token: token
        });
    } else {
        throw new AppError('Invalid username or password', 400)
    }
}