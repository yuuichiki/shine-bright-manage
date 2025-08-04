
import express from 'express';
const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = req.db.all('SELECT * FROM services ORDER BY id');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const service = req.db.get('SELECT * FROM services WHERE id = ?', [id]);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new service
router.post('/', async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const result = req.db.run(
      'INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)',
      [name, description || '', price, duration || null]
    );

    const newService = req.db.get('SELECT * FROM services WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const service = req.db.get('SELECT * FROM services WHERE id = ?', [id]);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    req.db.run(
      'UPDATE services SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?',
      [name, description || '', price, duration || null, id]
    );

    const updatedService = req.db.get('SELECT * FROM services WHERE id = ?', [id]);
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = req.db.get('SELECT * FROM services WHERE id = ?', [id]);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    req.db.run('DELETE FROM services WHERE id = ?', [id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

