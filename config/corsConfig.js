import cors from "cors";

const allowedOrigins = ['http://localhost:5173/', 'https://vital-swap-frontend.vercel.app/']

const corsConfig = ()=> {
    return cors({
        origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(new Error("Origin is not allowed"));
                },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        preflightContinue: false,
        maxAge: 600,
        optionsSuccessStatus: 204,
    })
}

export default corsConfig;