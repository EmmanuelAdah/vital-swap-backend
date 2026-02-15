import User from '../models/user.model.js';
import { userSchema } from '../middlewares/validator.middleware.js';
import { generateTokens } from "../middlewares/jwt.middleware.js";
import AppError from "../utils/ApiError.js";

export const signUp = async (req, res) => {
    const {firstName, lastName, email, role, password} = req.body;

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
            user: mapUserDetails(savedUser),
            token: token
        });
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

    const mapUserDetails = (savedUser) => {
           return {
                id: savedUser._id,
                email: savedUser.email,
                name: savedUser.firstName + " "+ savedUser.lastName,
                role: savedUser.role,
                imageUrl: savedUser.imageUrl
            }
    }

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email}).select('+password');

    try {
        if (user && (await user.matchPassword(password))) {
            const payload = {
                id: user._id,
                email: user.email,
                role: user.role
            }
            const token = generateTokens(payload);
            return res.status(200).json({
                user: mapUserDetails(user),
                token: token
            });
        } else {
            return res.status(400).json({message: 'Invalid username or password'})
        }
    }catch (e) {
        return res.status(500).json({message: e.message});
    }
}