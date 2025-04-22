
import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).json({ error: "Thiếu username hoặc password" });
    }
    
    const user = req.db.get(
      "SELECT id, username, display_name FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    
    if (!user) {
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }
    
    return res.json({
      user,
      token: "dummy-demo-token"
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
