import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import documentRoutes from './routes/documents.js';
import goalRoutes from './routes/goals.js';
import reminderRoutes from './routes/reminders.js';
import notificationRoutes from './routes/notifications.js';
import familyRoutes from './routes/family.js';
import assistantRoutes from './routes/assistant.js';
import generatorRoutes from './routes/generator.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LifeFlow Backend' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/generator', generatorRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Attempt DB connection and start listening immediately
connectDB();

app.listen(PORT, () => {
  console.log(`LifeFlow Express Backend running on http://localhost:${PORT}`);
});
