
import express from 'express';
import cors from 'cors';
import getDb from './database.js';
// Import routes
import authRoutes from './routes/auth.js';
import inventoryRoutes from './routes/inventory.js';
import customersRoutes from './routes/customers.js';
import invoicesRoutes from './routes/invoices.js';
import servicesRoutes from './routes/services.js';
import batchesRoutes from './routes/batches.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    req.db = await getDb();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use('/api/login', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/batches', batchesRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

export default app;
