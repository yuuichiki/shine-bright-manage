import express from 'express';
const router = express.Router();

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = req.db.all('SELECT * FROM employees ORDER BY name');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const {
      name,
      employee_id,
      card_id,
      position,
      department,
      phone,
      email,
      hire_date
    } = req.body;

    const result = req.db.run(`
      INSERT INTO employees (
        name, employee_id, card_id, position, department,
        phone, email, hire_date, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      name, employee_id, card_id, position, department,
      phone, email, hire_date || new Date().toISOString().split('T')[0]
    ]);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      employee_id,
      card_id,
      position,
      department,
      phone,
      email,
      hire_date: hire_date || new Date().toISOString().split('T')[0],
      is_active: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      employee_id,
      card_id,
      position,
      department,
      phone,
      email,
      hire_date,
      is_active
    } = req.body;

    req.db.run(`
      UPDATE employees SET
        name = ?, employee_id = ?, card_id = ?, position = ?,
        department = ?, phone = ?, email = ?, hire_date = ?, is_active = ?
      WHERE id = ?
    `, [
      name, employee_id, card_id, position, department,
      phone, email, hire_date, is_active, id
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    req.db.run('DELETE FROM employees WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;