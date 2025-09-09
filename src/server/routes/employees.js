import express from 'express';
const router = express.Router();
const API_BASE_URL = '/api/employees';
// Get all employees
router.get('/', async (req, res) => {
  try {
    console.log(API_BASE_URL);
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Lỗi khi lấy danh sách nhân viên');
    }

    const employees = await response.json();
    return employees;
  } catch (error) {
    throw new Error(error.message);
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
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Lỗi khi xóa nhân viên');
  }
});

export default router;