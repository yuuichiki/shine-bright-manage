
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const services = req.db.all('SELECT * FROM services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
