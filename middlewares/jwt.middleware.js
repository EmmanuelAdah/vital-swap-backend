import jwt from "jsonwebtoken";

export const generateTokens = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: '1d',
            issuer: 'Vital-Swap'
        });
}

export const jwtFilter = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({message: 'Access denied'});
    }
    try {
        const token = authHeader.split(' ')[1];
        req.user  = jwt.verify(token, process.env.JWT_SECRET_KEY);

        next()
    }catch(err) {
        return res.status(403).json({message: 'Access denied'});
    }
}