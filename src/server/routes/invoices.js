
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const invoices = req.db.all(`
      SELECT i.*, c.name as customer_name, c.phone as customer_phone
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      ORDER BY i.date DESC
    `);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
