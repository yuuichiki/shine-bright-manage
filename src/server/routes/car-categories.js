import express from 'express';
const router = express.Router();

// Get all car categories
router.get('/', async (req, res) => {
  try {
    const categories = req.db.all('SELECT * FROM car_categories ORDER BY id');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get car category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = req.db.get('SELECT * FROM car_categories WHERE id = ?', [id]);
    if (!category) {
      return res.status(404).json({ error: 'Car category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new car category
router.post('/', async (req, res) => {
  try {
    const { name, description, service_multiplier } = req.body;
    
    if (!name || service_multiplier === undefined) {
      return res.status(400).json({ error: 'Name and service_multiplier are required' });
    }

    const result = req.db.run(
      'INSERT INTO car_categories (name, description, service_multiplier) VALUES (?, ?, ?)',
      [name, description || '', service_multiplier]
    );

    const newCategory = req.db.get('SELECT * FROM car_categories WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update car category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, service_multiplier } = req.body;
    
    if (!name || service_multiplier === undefined) {
      return res.status(400).json({ error: 'Name and service_multiplier are required' });
    }

    const category = req.db.get('SELECT * FROM car_categories WHERE id = ?', [id]);
    if (!category) {
      return res.status(404).json({ error: 'Car category not found' });
    }

    req.db.run(
      'UPDATE car_categories SET name = ?, description = ?, service_multiplier = ? WHERE id = ?',
      [name, description || '', service_multiplier, id]
    );

    const updatedCategory = req.db.get('SELECT * FROM car_categories WHERE id = ?', [id]);
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete car category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = req.db.get('SELECT * FROM car_categories WHERE id = ?', [id]);
    if (!category) {
      return res.status(404).json({ error: 'Car category not found' });
    }

    req.db.run('DELETE FROM car_categories WHERE id = ?', [id]);
    res.json({ message: 'Car category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;