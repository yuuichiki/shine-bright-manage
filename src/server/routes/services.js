
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const services = req.db.all('SELECT * FROM services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

