import express from 'express';
const router = express.Router();

// Tạo bảng expenses nếu chưa có
const createExpensesTable = (db) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      frequency TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_date TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

router.get('/', async (req, res) => {
  try {
    createExpensesTable(req.db.exec);
    
    const expenses = req.db.all('SELECT * FROM expenses ORDER BY name');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    createExpensesTable(req.db.exec);
    
    const { name, amount, type, description, frequency, is_active } = req.body;
    
    const result = req.db.run(`
      INSERT INTO expenses (name, amount, type, description, frequency, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, amount, type, description, frequency, is_active !== undefined ? is_active : 1]);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      amount,
      type,
      description,
      frequency,
      is_active: is_active !== undefined ? is_active : 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, type, description, frequency, is_active } = req.body;
    
    const existing = req.db.get('SELECT * FROM expenses WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    req.db.run(`
      UPDATE expenses 
      SET name = ?, amount = ?, type = ?, description = ?, frequency = ?, is_active = ?
      WHERE id = ?
    `, [name, amount, type, description, frequency, is_active, id]);

    res.json({
      id: parseInt(id),
      name,
      amount,
      type,
      description,
      frequency,
      is_active
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = req.db.get('SELECT * FROM expenses WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    req.db.run('DELETE FROM expenses WHERE id = ?', [id]);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;