import express from 'express';
const router = express.Router();

// Get attendance records by date
const API_BASE_URL = 'http://localhost:5177/api/Attendances';

router.get('/', async (req, res) => {
  // try {
  //   const { date } = req.query;
  //   const targetDate = date || new Date().toISOString().split('T')[0];
    
  //   const records = req.db.all(`
  //     SELECT a.*, e.name as employee_name, e.card_id
  //     FROM attendance a
  //     JOIN employees e ON a.employee_id = e.id
  //     WHERE DATE(a.date) = ?
  //     ORDER BY a.check_in DESC
  //   `, [targetDate]);
    
  //   res.json(records);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }

  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const url = `${API_BASE_URL}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Lỗi khi lấy dữ liệu chấm công');
    }

    const records = await response.json();
    return records;
  } catch (error) {
    throw new Error(error.message);
  }


});

// Card swipe for attendance
router.post('/swipe', async (req, res) => {
  try {
    const { card_id } = req.body;
    
    // Find employee by card_id
    const employee = req.db.get('SELECT * FROM employees WHERE card_id = ?', [card_id]);
    if (!employee) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên với mã thẻ này' });
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    // Check if employee already checked in today
    const existingRecord = req.db.get(`
      SELECT * FROM attendance 
      WHERE employee_id = ? AND DATE(date) = ?
    `, [employee.id, today]);

    if (existingRecord && !existingRecord.check_out) {
      // Check out
      const checkInTime = new Date(existingRecord.check_in);
      const workHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
      
      req.db.run(`
        UPDATE attendance SET 
          check_out = ?, 
          work_hours = ?,
          status = ?
        WHERE id = ?
      `, [
        now.toISOString(),
        workHours,
        workHours >= 8 ? 'full_time' : 'partial_time',
        existingRecord.id
      ]);
      
      res.json({ message: 'Đã chấm công ra', type: 'check_out' });
    } else if (existingRecord && existingRecord.check_out) {
      res.status(400).json({ error: 'Nhân viên đã chấm công đầy đủ hôm nay' });
    } else {
      // Check in
      const standardStartTime = new Date();
      standardStartTime.setHours(8, 0, 0, 0);
      const isLate = now > standardStartTime;
      
      const result = req.db.run(`
        INSERT INTO attendance (
          employee_id, date, check_in, status
        ) VALUES (?, ?, ?, ?)
      `, [
        employee.id,
        today,
        now.toISOString(),
        isLate ? 'late' : 'on_time'
      ]);
      
      res.json({ 
        message: 'Đã chấm công vào', 
        type: 'check_in',
        id: result.lastInsertRowid
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get HR statistics
router.get('/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const totalEmployees = req.db.get('SELECT COUNT(*) as count FROM employees WHERE is_active = 1').count;
    
    const presentToday = req.db.get(`
      SELECT COUNT(DISTINCT employee_id) as count 
      FROM attendance 
      WHERE DATE(date) = ?
    `, [today]).count;
    
    const lateToday = req.db.get(`
      SELECT COUNT(*) as count 
      FROM attendance 
      WHERE DATE(date) = ? AND status = 'late'
    `, [today]).count;
    
    const recentAttendance = req.db.all(`
      SELECT e.name as employee_name, a.check_in, a.status
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE DATE(a.date) = ?
      ORDER BY a.check_in DESC
      LIMIT 5
    `, [today]);
    
    res.json({
      totalEmployees,
      presentToday,
      absentToday: totalEmployees - presentToday,
      lateToday,
      recentAttendance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;