import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;

export const generateTokens = (payload) => {
    return jwt.sign(
        payload,
        secretKey,
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
        req.user  = jwt.verify(token, secretKey);

        next()
    }catch(err) {
        return res.status(403).json({message: 'Access denied'});
    }
}