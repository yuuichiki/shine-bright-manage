
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const batches = req.db.all(`
      SELECT b.*, s.name as supplier_name
      FROM batches b
      LEFT JOIN suppliers s ON b.supplier_id = s.id
      ORDER BY b.import_date DESC
    `);
    
    res.json(batches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { batch_code, supplier_id, import_date, notes } = req.body;
    
    const result = req.db.run(`
      INSERT INTO batches (batch_code, supplier_id, import_date, notes)
      VALUES (?, ?, ?, ?)
    `, [batch_code, supplier_id, import_date, notes]);

    res.status(201).json({
      id: result.lastInsertRowid,
      batch_code,
      supplier_id,
      import_date,
      notes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
