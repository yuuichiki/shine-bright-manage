
import express from 'express';
import cors from 'cors';
import getDb from './database.js';
// Import routes
import inventoryRoutes from './routes/inventory.js';
import customersRoutes from './routes/customers.js';
import invoicesRoutes from './routes/invoices.js';
import servicesRoutes from './routes/services.js';
import batchesRoutes from './routes/batches.js';
import suppliersRoutes from './routes/suppliers.js';
import purchaseOrdersRoutes from './routes/purchase-orders.js';
import salesOrdersRoutes from './routes/sales-orders.js';
import expensesRoutes from './routes/expenses.js';
import promotionsRoutes from './routes/promotions.js';
import customerGroupsRoutes from './routes/customer-groups.js';
import vouchersRoutes from './routes/vouchers.js';
import employeesRoutes from './routes/employees.js';
import attendanceRoutes from './routes/attendance.js';
import productCategoriesRoutes from './routes/product-categories.js';
import carCategoriesRoutes from './routes/car-categories.js';

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
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/purchase-orders', purchaseOrdersRoutes);
app.use('/api/sales-orders', salesOrdersRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/customer-groups', customerGroupsRoutes);
app.use('/api/vouchers', vouchersRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/hr', attendanceRoutes);
app.use('/api/product-categories', productCategoriesRoutes);
app.use('/api/car-categories', carCategoriesRoutes);

// Routes without /api prefix for compatibility
app.use('/promotions', promotionsRoutes);
app.use('/vouchers', vouchersRoutes);
app.use('/customers', customersRoutes);
app.use('/customer-groups', customerGroupsRoutes);
app.use('/employees', employeesRoutes);
app.use('/hr', attendanceRoutes);
app.use('/suppliers', suppliersRoutes);
app.use('/purchase-orders', purchaseOrdersRoutes);
app.use('/invoices', invoicesRoutes);

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
