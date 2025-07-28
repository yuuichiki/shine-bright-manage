import express from 'express';
const router = express.Router();

// Tạo bảng sales_orders nếu chưa có
const createSalesOrdersTable = (db) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sales_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      order_date TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Chờ xử lý',
      delivery_date TEXT,
      notes TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    );
  `);
};

router.get('/', async (req, res) => {
  try {
    createSalesOrdersTable(req.db.exec);
    
    const orders = req.db.all(`
      SELECT so.*, c.name as customer_name, c.phone as customer_phone
      FROM sales_orders so
      LEFT JOIN customers c ON so.customer_id = c.id
      ORDER BY so.order_date DESC
    `);
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    createSalesOrdersTable(req.db.exec);
    
    const { customer_id, total_amount, status, delivery_date, notes } = req.body;
    const order_date = new Date().toISOString().split('T')[0];
    
    const result = req.db.run(`
      INSERT INTO sales_orders (customer_id, order_date, total_amount, status, delivery_date, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [customer_id, order_date, total_amount, status || 'Chờ xử lý', delivery_date, notes]);

    res.status(201).json({
      id: result.lastInsertRowid,
      customer_id,
      order_date,
      total_amount,
      status: status || 'Chờ xử lý',
      delivery_date,
      notes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, total_amount, status, delivery_date, notes } = req.body;
    
    const existing = req.db.get('SELECT * FROM sales_orders WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Sales order not found' });
    }

    req.db.run(`
      UPDATE sales_orders 
      SET customer_id = ?, total_amount = ?, status = ?, delivery_date = ?, notes = ?
      WHERE id = ?
    `, [customer_id, total_amount, status, delivery_date, notes, id]);

    res.json({
      id: parseInt(id),
      customer_id,
      total_amount,
      status,
      delivery_date,
      notes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = req.db.get('SELECT * FROM sales_orders WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Sales order not found' });
    }

    req.db.run('DELETE FROM sales_orders WHERE id = ?', [id]);
    res.json({ message: 'Sales order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;