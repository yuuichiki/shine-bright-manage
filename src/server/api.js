const express = require('express');
const cors = require('cors');
const { getDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Tăng giới hạn kích thước để xử lý hình ảnh

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    req.db = await getDb();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// --- AUTH API ---

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).json({ error: "Thiếu username hoặc password" });
    }
    // Truy vấn tài khoản
    const user = req.db.get(
      "SELECT id, username, display_name FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    if (!user) {
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }
    // Đơn giản trả thẳng user object (demo)
    return res.json({
      user,
      token: "dummy-demo-token" // Production: trả JWT
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// --- INVENTORY API ---

// Lấy danh sách tồn kho
app.get('/api/inventory', async (req, res) => {
  try {
    const inventory = req.db.all(`
      SELECT i.*, pc.name as category_name, b.batch_code
      FROM inventory i
      LEFT JOIN product_categories pc ON i.category_id = pc.id
      LEFT JOIN batches b ON i.batch_id = b.id
    `);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy chi tiết sản phẩm
app.get('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = req.db.get(`
      SELECT i.*, pc.name as category_name, b.batch_code
      FROM inventory i
      LEFT JOIN product_categories pc ON i.category_id = pc.id
      LEFT JOIN batches b ON i.batch_id = b.id
      WHERE i.id = ?
    `, [id]);

    if (!item) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm sản phẩm mới
app.post('/api/inventory', async (req, res) => {
  try {
    const {
      name,
      category,
      type,
      quantity,
      unit,
      unit_price,
      reorder_point,
      usage_rate,
      batch_id,
      import_date,
      invoice_image
    } = req.body;

    // Kiểm tra và tìm hoặc tạo danh mục sản phẩm mới
    let categoryId = null;
    if (category) {
      const existingCategory = req.db.get('SELECT id FROM product_categories WHERE name = ?', [category]);
      
      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const result = req.db.run('INSERT INTO product_categories (name) VALUES (?)', [category]);
        categoryId = result.lastInsertRowid;
      }
    }

    const result = req.db.run(`
      INSERT INTO inventory 
      (name, category_id, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, invoice_image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, categoryId, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, invoice_image]);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      category,
      type,
      quantity,
      unit,
      unit_price,
      reorder_point,
      usage_rate,
      batch_id,
      import_date
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật sản phẩm
app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      type,
      quantity,
      unit,
      unit_price,
      reorder_point,
      usage_rate,
      batch_id,
      import_date,
      invoice_image
    } = req.body;

    // Kiểm tra sản phẩm có tồn tại không
    const existingItem = req.db.get('SELECT * FROM inventory WHERE id = ?', [id]);
    if (!existingItem) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    // Kiểm tra và tìm hoặc tạo danh mục sản phẩm mới
    let categoryId = null;
    if (category) {
      const existingCategory = req.db.get('SELECT id FROM product_categories WHERE name = ?', [category]);
      
      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const result = req.db.run('INSERT INTO product_categories (name) VALUES (?)', [category]);
        categoryId = result.lastInsertRowid;
      }
    }

    // Update with or without invoice image
    if (invoice_image) {
      req.db.run(`
        UPDATE inventory 
        SET name = ?, category_id = ?, type = ?, quantity = ?, unit = ?, 
            unit_price = ?, reorder_point = ?, usage_rate = ?, 
            batch_id = ?, import_date = ?, invoice_image = ?
        WHERE id = ?
      `, [name, categoryId, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, invoice_image, id]);
    } else {
      req.db.run(`
        UPDATE inventory 
        SET name = ?, category_id = ?, type = ?, quantity = ?, unit = ?, 
            unit_price = ?, reorder_point = ?, usage_rate = ?, 
            batch_id = ?, import_date = ?
        WHERE id = ?
      `, [name, categoryId, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, id]);
    }

    res.json({ 
      id: Number(id),
      name,
      category,
      type,
      quantity,
      unit,
      unit_price,
      reorder_point,
      usage_rate,
      batch_id,
      import_date
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa sản phẩm
app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra sản phẩm có tồn tại không
    const existingItem = req.db.get('SELECT * FROM inventory WHERE id = ?', [id]);
    if (!existingItem) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    // Xóa sản phẩm
    req.db.run('DELETE FROM inventory WHERE id = ?', [id]);
    
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CUSTOMERS API ---

// Lấy danh sách khách hàng
app.get('/api/customers', async (req, res) => {
  try {
    const customers = req.db.all('SELECT * FROM customers');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm khách hàng mới
app.post('/api/customers', async (req, res) => {
  try {
    const { name, phone, email, discount_rate, notes } = req.body;
    
    const result = req.db.run(`
      INSERT INTO customers (name, phone, email, discount_rate, notes)
      VALUES (?, ?, ?, ?, ?)
    `, [name, phone, email, discount_rate || 0, notes]);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      phone,
      email,
      discount_rate: discount_rate || 0,
      notes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- INVOICES API ---

// Lấy danh sách hóa đơn
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = req.db.all(`
      SELECT i.*, c.name as customer_name, c.phone as customer_phone
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      ORDER BY i.date DESC
    `);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- SERVICES API ---

// Lấy danh sách dịch vụ
app.get('/api/services', async (req, res) => {
  try {
    const services = req.db.all('SELECT * FROM services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- BATCHES API ---

// Lấy danh sách lô hàng
app.get('/api/batches', async (req, res) => {
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

// Thêm lô hàng mới
app.post('/api/batches', async (req, res) => {
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

// Khởi động server
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

module.exports = app;
