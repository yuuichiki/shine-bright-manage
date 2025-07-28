import express from 'express';
const router = express.Router();

// Get all vouchers with related data
router.get('/', async (req, res) => {
  try {
    const vouchers = req.db.all(`
      SELECT v.*, 
             c.name as customer_name,
             cg.name as group_name,
             p.name as promotion_name
      FROM vouchers v
      LEFT JOIN customers c ON v.customer_id = c.id
      LEFT JOIN customer_groups cg ON v.customer_group_id = cg.id
      LEFT JOIN promotions p ON v.promotion_id = p.id
      ORDER BY v.created_at DESC
    `);
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create voucher
router.post('/', async (req, res) => {
  try {
    const {
      code,
      promotion_id,
      customer_id,
      customer_group_id,
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      valid_from,
      valid_until
    } = req.body;

    const result = req.db.run(`
      INSERT INTO vouchers (
        code, promotion_id, customer_id, customer_group_id,
        discount_type, discount_value, min_purchase_amount,
        max_discount_amount, valid_from, valid_until
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      code, promotion_id, customer_id, customer_group_id,
      discount_type, discount_value, min_purchase_amount || 0,
      max_discount_amount, valid_from, valid_until
    ]);

    res.status(201).json({
      id: result.lastInsertRowid,
      code,
      promotion_id,
      customer_id,
      customer_group_id,
      discount_type,
      discount_value,
      min_purchase_amount: min_purchase_amount || 0,
      max_discount_amount,
      valid_from,
      valid_until,
      is_used: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update voucher
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      promotion_id,
      customer_id,
      customer_group_id,
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      valid_from,
      valid_until
    } = req.body;

    req.db.run(`
      UPDATE vouchers SET
        code = ?, promotion_id = ?, customer_id = ?, customer_group_id = ?,
        discount_type = ?, discount_value = ?, min_purchase_amount = ?,
        max_discount_amount = ?, valid_from = ?, valid_until = ?
      WHERE id = ?
    `, [
      code, promotion_id, customer_id, customer_group_id,
      discount_type, discount_value, min_purchase_amount || 0,
      max_discount_amount, valid_from, valid_until, id
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete voucher
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    req.db.run('DELETE FROM vouchers WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate voucher for use
router.post('/validate', async (req, res) => {
  try {
    const { code, purchase_amount, customer_id } = req.body;
    
    const voucher = req.db.get(`
      SELECT * FROM vouchers 
      WHERE code = ? AND is_used = 0 
      AND valid_from <= date('now') AND valid_until >= date('now')
    `, [code]);

    if (!voucher) {
      return res.status(404).json({ error: 'Voucher không hợp lệ hoặc đã hết hạn' });
    }

    if (voucher.customer_id && voucher.customer_id !== customer_id) {
      return res.status(400).json({ error: 'Voucher không dành cho khách hàng này' });
    }

    if (purchase_amount < voucher.min_purchase_amount) {
      return res.status(400).json({ 
        error: `Giá trị đơn hàng tối thiểu ${voucher.min_purchase_amount.toLocaleString('vi-VN')}đ` 
      });
    }

    let discount_amount = 0;
    if (voucher.discount_type === 'percentage') {
      discount_amount = (purchase_amount * voucher.discount_value) / 100;
    } else {
      discount_amount = voucher.discount_value;
    }

    if (voucher.max_discount_amount && discount_amount > voucher.max_discount_amount) {
      discount_amount = voucher.max_discount_amount;
    }

    res.json({
      valid: true,
      voucher,
      discount_amount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use voucher
router.post('/:id/use', async (req, res) => {
  try {
    const { id } = req.params;
    const { invoice_id } = req.body;

    req.db.run(`
      UPDATE vouchers SET 
        is_used = 1, 
        used_date = datetime('now'),
        used_invoice_id = ?
      WHERE id = ?
    `, [invoice_id, id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;