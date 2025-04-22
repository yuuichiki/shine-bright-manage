
const express = require('express');
const cors = require('cors');
const { getDb } = require('./database');

// Import routes
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const customersRoutes = require('./routes/customers');
const invoicesRoutes = require('./routes/invoices');
const servicesRoutes = require('./routes/services');
const batchesRoutes = require('./routes/batches');

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

module.exports = app;
