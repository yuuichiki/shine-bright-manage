
import express from 'express';
const router = express.Router();

// Get inventory list
router.get('/', async (req, res) => {
  try {
    const inventory = req.db.all(`
      SELECT i.*, pc.name as category_name, b.batch_code
      FROM inventory i
      LEFT JOIN product_categories pc ON i.category_id = pc.id
      LEFT JOIN batches b ON i.batch_id = b.id
    `);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = req.db.get(`
      SELECT i.*, pc.name as category_name, b.batch_code
      FROM inventory i
      LEFT JOIN product_categories pc ON i.category_id = pc.id
      LEFT JOIN batches b ON i.batch_id = b.id
      WHERE i.id = ?
    `, [id]);

    if (!item) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create inventory item
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      type,
      quantity,
      unit,
      unit_price,
      reorder_point,
      usage_rate,
      batch_id,
      import_date,
      invoice_image
    } = req.body;

    let categoryId = null;
    if (category) {
      const existingCategory = req.db.get('SELECT id FROM product_categories WHERE name = ?', [category]);
      
      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const result = req.db.run('INSERT INTO product_categories (name) VALUES (?)', [category]);
        categoryId = result.lastInsertRowid;
      }
    }

    const result = req.db.run(`
      INSERT INTO inventory 
      (name, category_id, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, invoice_image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, categoryId, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, invoice_image]);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      category,
      type,
      quantity,
      unit,
      unit_price,
      reorder_point,
      usage_rate,
      batch_id,
      import_date
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      type,
      quantity,
      unit,
      unit_price,
      reorder_point,
      usage_rate,
      batch_id,
      import_date,
      invoice_image
    } = req.body;

    const existingItem = req.db.get('SELECT * FROM inventory WHERE id = ?', [id]);
    if (!existingItem) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    let categoryId = null;
    if (category) {
      const existingCategory = req.db.get('SELECT id FROM product_categories WHERE name = ?', [category]);
      
      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const result = req.db.run('INSERT INTO product_categories (name) VALUES (?)', [category]);
        categoryId = result.lastInsertRowid;
      }
    }

    if (invoice_image) {
      req.db.run(`
        UPDATE inventory 
        SET name = ?, category_id = ?, type = ?, quantity = ?, unit = ?, 
            unit_price = ?, reorder_point = ?, usage_rate = ?, 
            batch_id = ?, import_date = ?, invoice_image = ?
        WHERE id = ?
      `, [name, categoryId, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, invoice_image, id]);
    } else {
      req.db.run(`
        UPDATE inventory 
        SET name = ?, category_id = ?, type = ?, quantity = ?, unit = ?, 
            unit_price = ?, reorder_point = ?, usage_rate = ?, 
            batch_id = ?, import_date = ?
        WHERE id = ?
      `, [name, categoryId, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, id]);
    }

    res.json({ 
      id: Number(id),
      name,
      category,
      type,
      quantity,
      unit,
      unit_price,
      reorder_point,
      usage_rate,
      batch_id,
      import_date
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingItem = req.db.get('SELECT * FROM inventory WHERE id = ?', [id]);
    if (!existingItem) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    req.db.run('DELETE FROM inventory WHERE id = ?', [id]);
    
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
