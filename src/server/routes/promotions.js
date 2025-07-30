import express from 'express';
const router = express.Router();

// Get all promotions
router.get('/', async (req, res) => {
  try {
    const promotions = req.db.all('SELECT * FROM promotions ORDER BY created_date DESC');
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create promotion
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      start_date,
      end_date,
      usage_limit,
      applicable_products,
      applicable_services
    } = req.body;

    const result = req.db.run(`
      INSERT INTO promotions (
        name, description, type, discount_type, discount_value,
        min_purchase_amount, max_discount_amount, start_date, end_date,
        usage_limit, applicable_products, applicable_services, created_date,
        is_active, used_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, description, type, discount_type, discount_value,
      min_purchase_amount || 0, max_discount_amount, start_date, end_date,
      usage_limit, applicable_products, applicable_services, 
      new Date().toISOString(), 1, 0
    ]);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      description,
      type,
      discount_type,
      discount_value,
      min_purchase_amount: min_purchase_amount || 0,
      max_discount_amount,
      start_date,
      end_date,
      usage_limit,
      applicable_products,
      applicable_services,
      is_active: 1,
      used_count: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update promotion
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      type,
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      start_date,
      end_date,
      is_active,
      usage_limit,
      applicable_products,
      applicable_services
    } = req.body;

    req.db.run(`
      UPDATE promotions SET
        name = ?, description = ?, type = ?, discount_type = ?,
        discount_value = ?, min_purchase_amount = ?, max_discount_amount = ?,
        start_date = ?, end_date = ?, is_active = ?, usage_limit = ?,
        applicable_products = ?, applicable_services = ?
      WHERE id = ?
    `, [
      name, description, type, discount_type, discount_value,
      min_purchase_amount || 0, max_discount_amount, start_date, end_date,
      is_active, usage_limit, applicable_products, applicable_services, id
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete promotion
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    req.db.run('DELETE FROM promotions WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;