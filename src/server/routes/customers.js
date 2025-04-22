
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const customers = req.db.all('SELECT * FROM customers');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, discount_rate, notes } = req.body;
    
    const result = req.db.run(`
      INSERT INTO customers (name, phone, email, discount_rate, notes)
      VALUES (?, ?, ?, ?, ?)
    `, [name, phone, email, discount_rate || 0, notes]);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      phone,
      email,
      discount_rate: discount_rate || 0,
      notes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
