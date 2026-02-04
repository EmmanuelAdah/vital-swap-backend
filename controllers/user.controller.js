import User from '../models/user.model.js';

export const findById = async (req, res) => {
    try {
        const { id } = req.params;

        const existingUser = await User.findById(id)
            .populate('accounts', '-__v -userId')
            .lean();

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { accounts, ...userDetails } = existingUser;

        return res.status(200).json({
            user: userDetails,
            accounts: accounts || []
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const findByEmail = async (req, res) => {
    const { email } = req.params;

    const existingUser = await User.findOne({email: email});
    if (!existingUser) {
        return res.status(404).json({'message':'User not found'});
    }
    return res.status(200).json({'user': existingUser});
}

export const deleteById = async (req, res) => {
    const { id } = req.params;
    const existingUser = await User.findByIdAndDelete(id);

    if (!existingUser) {
        return res.status(404).json({'message':'User not found'});
    }
    return res.status(200).json({'message': 'user deleted successfully'});
}

export const deleteByEmail = async (req, res) => {
    const { email } = req.params;
    const existingUser = await User.findOneAndDelete({email: email});

    if (!existingUser) {
        return res.status(404).json({'message': 'User not found'});
    }
    return res.status(200).json({'message': 'user deleted successfully'});
}