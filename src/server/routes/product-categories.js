import express from 'express';
const router = express.Router();

// Get all product categories
router.get('/', async (req, res) => {
  try {
    const categories = req.db.all('SELECT * FROM product_categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product category
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const result = req.db.run(`
      INSERT INTO product_categories (name, description)
      VALUES (?, ?)
    `, [name, description]);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      description
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    req.db.run(`
      UPDATE product_categories SET name = ?, description = ?
      WHERE id = ?
    `, [name, description, id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    req.db.run('DELETE FROM product_categories WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;