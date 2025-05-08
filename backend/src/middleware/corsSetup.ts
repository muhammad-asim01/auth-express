import cors, { CorsOptions } from 'cors';
import { ALLOWED_ORIGINS } from '../config/config';


const corsOptions: CorsOptions = {
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!requestOrigin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(requestOrigin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy: origin ${requestOrigin} not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export default function applyCors(app: any) {
    app.use(cors(corsOptions));
}
