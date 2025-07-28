import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const suppliers = req.db.all('SELECT * FROM suppliers ORDER BY name');
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, contact, phone, email, address } = req.body;
    
    const result = req.db.run(`
      INSERT INTO suppliers (name, contact, phone, email, address)
      VALUES (?, ?, ?, ?, ?)
    `, [name, contact, phone, email, address]);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      contact,
      phone,
      email,
      address
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, phone, email, address } = req.body;
    
    const existing = req.db.get('SELECT * FROM suppliers WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    req.db.run(`
      UPDATE suppliers 
      SET name = ?, contact = ?, phone = ?, email = ?, address = ?
      WHERE id = ?
    `, [name, contact, phone, email, address, id]);

    res.json({ id: parseInt(id), name, contact, phone, email, address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = req.db.get('SELECT * FROM suppliers WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    req.db.run('DELETE FROM suppliers WHERE id = ?', [id]);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;