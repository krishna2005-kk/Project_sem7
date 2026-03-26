import express from 'express';
import dotenv from 'dotenv';
import connectDb from './configs/db.js';
import authRouter from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
import courseRouter from './routes/courseRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import aiRouter from './routes/aiRoute.js';
import reviewRouter from './routes/reviewRoute.js';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server tools and same-origin requests without Origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/ai', aiRouter);
app.use('/api/review', reviewRouter);

app.get('/', (req, res) => {
  res.send('Hello From Server');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  connectDb();
});
