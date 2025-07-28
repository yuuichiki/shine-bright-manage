import express from 'express';
const router = express.Router();

// Get all customer groups with member count
router.get('/', async (req, res) => {
  try {
    const groups = req.db.all(`
      SELECT cg.*, COUNT(cgm.customer_id) as member_count
      FROM customer_groups cg
      LEFT JOIN customer_group_members cgm ON cg.id = cgm.customer_group_id
      GROUP BY cg.id
      ORDER BY cg.created_at DESC
    `);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get group members
router.get('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const members = req.db.all(`
      SELECT c.*, cgm.assigned_date
      FROM customers c
      JOIN customer_group_members cgm ON c.id = cgm.customer_id
      WHERE cgm.customer_group_id = ?
      ORDER BY cgm.assigned_date DESC
    `, [id]);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create customer group
router.post('/', async (req, res) => {
  try {
    const { name, description, criteria } = req.body;

    const result = req.db.run(`
      INSERT INTO customer_groups (name, description, criteria)
      VALUES (?, ?, ?)
    `, [name, description, criteria]);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      description,
      criteria,
      member_count: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer group
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, criteria } = req.body;

    req.db.run(`
      UPDATE customer_groups SET name = ?, description = ?, criteria = ?
      WHERE id = ?
    `, [name, description, criteria, id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete customer group
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Remove all members first
    req.db.run('DELETE FROM customer_group_members WHERE customer_group_id = ?', [id]);
    // Remove group
    req.db.run('DELETE FROM customer_groups WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add customer to group
router.post('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id } = req.body;

    req.db.run(`
      INSERT OR IGNORE INTO customer_group_members (customer_id, customer_group_id)
      VALUES (?, ?)
    `, [customer_id, id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove customer from group
router.delete('/:id/members/:customer_id', async (req, res) => {
  try {
    const { id, customer_id } = req.params;

    req.db.run(`
      DELETE FROM customer_group_members 
      WHERE customer_group_id = ? AND customer_id = ?
    `, [id, customer_id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;