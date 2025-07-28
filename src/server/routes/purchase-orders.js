import express from 'express';
const router = express.Router();

// Tạo bảng purchase_orders nếu chưa có
const createPurchaseOrdersTable = (db) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER NOT NULL,
      order_date TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Đang chờ',
      packaging_images TEXT,
      notes TEXT,
      FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
    );
  `);
};

router.get('/', async (req, res) => {
  try {
    createPurchaseOrdersTable(req.db.exec);
    
    const orders = req.db.all(`
      SELECT po.*, s.name as supplier_name
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      ORDER BY po.order_date DESC
    `);
    
    // Parse packaging_images JSON
    const ordersWithImages = orders.map(order => ({
      ...order,
      packaging_images: order.packaging_images ? JSON.parse(order.packaging_images) : []
    }));
    
    res.json(ordersWithImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    createPurchaseOrdersTable(req.db.exec);
    
    const { supplier_id, total_amount, status, packaging_images, notes } = req.body;
    const order_date = new Date().toISOString().split('T')[0];
    
    const result = req.db.run(`
      INSERT INTO purchase_orders (supplier_id, order_date, total_amount, status, packaging_images, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [supplier_id, order_date, total_amount, status || 'Đang chờ', JSON.stringify(packaging_images || []), notes]);

    res.status(201).json({
      id: result.lastInsertRowid,
      supplier_id,
      order_date,
      total_amount,
      status: status || 'Đang chờ',
      packaging_images: packaging_images || [],
      notes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier_id, total_amount, status, packaging_images, notes } = req.body;
    
    const existing = req.db.get('SELECT * FROM purchase_orders WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    req.db.run(`
      UPDATE purchase_orders 
      SET supplier_id = ?, total_amount = ?, status = ?, packaging_images = ?, notes = ?
      WHERE id = ?
    `, [supplier_id, total_amount, status, JSON.stringify(packaging_images || []), notes, id]);

    res.json({
      id: parseInt(id),
      supplier_id,
      total_amount,
      status,
      packaging_images: packaging_images || [],
      notes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = req.db.get('SELECT * FROM purchase_orders WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    req.db.run('DELETE FROM purchase_orders WHERE id = ?', [id]);
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;