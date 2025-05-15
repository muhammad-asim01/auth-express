import express from 'express';
import applyCors from './middleware/corsSetup';
import { requestLogger } from './middleware/requestLogger';
import authRouter from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './models/dbConnect';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 8000;

// 1) CORS
applyCors(app);

// 2) Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4) Logging
app.use(requestLogger);

// 5) Cookies Parser
app.use(cookieParser())

// 5) Your routes
app.use('/api/v1/auth', authRouter);
// … any other routes …

// 6) Error handler LAST
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
export default app;
