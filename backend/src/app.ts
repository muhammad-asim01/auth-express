import express from 'express';
import { Request, Response } from 'express';
import { asyncHandler, errorHandler } from './middleware/ErrorHandlar';
import { connectDB } from './models/dbConnect';
import authRouter from './routes/auth.routes';
import { requestLogger } from './middleware/requestLogger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(errorHandler);
app.use(requestLogger);

app.use('/api/v1/auth', authRouter);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDB();
});

app.get('/', asyncHandler(async (req: Request, res: Response) => {   
    res.status(200).json({
        sucess: true,
        data: [],
        message: 'Successfully running',
        error: false
    })
}))

export default app;