
import express from 'express';
import cors from 'cors';
import getDb from './database.js';
// Import routes
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

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

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
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/batches', batchesRoutes);

// Root endpoint for API health check
app.get('/api', (req, res) => {
  res.json({ status: 'API is running' });
});

// Catch-all route for 404 errors
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

export default app;
