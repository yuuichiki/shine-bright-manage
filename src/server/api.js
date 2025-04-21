
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Tăng giới hạn kích thước để xử lý hình ảnh

// API Routes

// --- INVENTORY API ---

// Lấy danh sách tồn kho
app.get('/api/inventory', (req, res) => {
  try {
    const inventory = db.prepare(`
      SELECT i.*, pc.name as category_name, b.batch_code
      FROM inventory i
      LEFT JOIN product_categories pc ON i.category_id = pc.id
      LEFT JOIN batches b ON i.batch_id = b.id
    `).all();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy chi tiết sản phẩm
app.get('/api/inventory/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = db.prepare(`
      SELECT i.*, pc.name as category_name, b.batch_code
      FROM inventory i
      LEFT JOIN product_categories pc ON i.category_id = pc.id
      LEFT JOIN batches b ON i.batch_id = b.id
      WHERE i.id = ?
    `).get(id);

    if (!item) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm sản phẩm mới
app.post('/api/inventory', (req, res) => {
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
      const existingCategory = db.prepare('SELECT id FROM product_categories WHERE name = ?').get(category);
      
      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const result = db.prepare('INSERT INTO product_categories (name) VALUES (?)').run(category);
        categoryId = result.lastInsertRowid;
      }
    }

    const result = db.prepare(`
      INSERT INTO inventory 
      (name, category_id, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, invoice_image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, categoryId, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, invoice_image);

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
app.put('/api/inventory/:id', (req, res) => {
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
    const existingItem = db.prepare('SELECT * FROM inventory WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    // Kiểm tra và tìm hoặc tạo danh mục sản phẩm mới
    let categoryId = null;
    if (category) {
      const existingCategory = db.prepare('SELECT id FROM product_categories WHERE name = ?').get(category);
      
      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const result = db.prepare('INSERT INTO product_categories (name) VALUES (?)').run(category);
        categoryId = result.lastInsertRowid;
      }
    }

    db.prepare(`
      UPDATE inventory 
      SET name = ?, category_id = ?, type = ?, quantity = ?, unit = ?, 
          unit_price = ?, reorder_point = ?, usage_rate = ?, 
          batch_id = ?, import_date = ?, invoice_image = COALESCE(?, invoice_image)
      WHERE id = ?
    `).run(
      name, 
      categoryId, 
      type, 
      quantity, 
      unit, 
      unit_price, 
      reorder_point, 
      usage_rate, 
      batch_id, 
      import_date,
      invoice_image || null,
      id
    );

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
app.delete('/api/inventory/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra sản phẩm có tồn tại không
    const existingItem = db.prepare('SELECT * FROM inventory WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    // Xóa sản phẩm
    db.prepare('DELETE FROM inventory WHERE id = ?').run(id);
    
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CUSTOMERS API ---

// Lấy danh sách khách hàng
app.get('/api/customers', (req, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers').all();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm khách hàng mới
app.post('/api/customers', (req, res) => {
  try {
    const { name, phone, email, discount_rate, notes } = req.body;
    
    const result = db.prepare(`
      INSERT INTO customers (name, phone, email, discount_rate, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, phone, email, discount_rate || 0, notes);

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
app.get('/api/invoices', (req, res) => {
  try {
    const invoices = db.prepare(`
      SELECT i.*, c.name as customer_name, c.phone as customer_phone
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      ORDER BY i.date DESC
    `).all();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo hóa đơn mới
app.post('/api/invoices', (req, res) => {
  const {
    invoice_number,
    customer_id,
    vehicle_id,
    date,
    total_amount,
    discount_amount,
    vat_amount,
    vat_included,
    final_amount,
    payment_method,
    payment_status,
    notes,
    services,
    products,
    oil_change
  } = req.body;

  // Bắt đầu transaction
  const transaction = db.transaction(() => {
    // Thêm hóa đơn
    const result = db.prepare(`
      INSERT INTO invoices (
        invoice_number, customer_id, vehicle_id, date, 
        total_amount, discount_amount, vat_amount, vat_included, final_amount, 
        payment_method, payment_status, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      invoice_number,
      customer_id,
      vehicle_id,
      date,
      total_amount,
      discount_amount || 0,
      vat_amount || 0,
      vat_included ? 1 : 0,
      final_amount,
      payment_method,
      payment_status || 'pending',
      notes
    );

    const invoiceId = result.lastInsertRowid;

    // Thêm dịch vụ vào hóa đơn
    if (services && services.length > 0) {
      const insertServiceStmt = db.prepare(`
        INSERT INTO invoice_services (invoice_id, service_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `);

      services.forEach(service => {
        insertServiceStmt.run(
          invoiceId,
          service.service_id,
          service.quantity || 1,
          service.unit_price,
          service.subtotal
        );
      });
    }

    // Thêm sản phẩm vào hóa đơn và cập nhật tồn kho
    if (products && products.length > 0) {
      const insertProductStmt = db.prepare(`
        INSERT INTO invoice_products (invoice_id, product_id, quantity, unit_price, subtotal, batch_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const updateInventoryStmt = db.prepare(`
        UPDATE inventory SET quantity = quantity - ? WHERE id = ?
      `);

      products.forEach(product => {
        insertProductStmt.run(
          invoiceId,
          product.product_id,
          product.quantity,
          product.unit_price,
          product.subtotal,
          product.batch_id
        );

        // Giảm số lượng trong kho
        updateInventoryStmt.run(product.quantity, product.product_id);
      });
    }

    // Lưu thông tin thay dầu nếu có
    if (oil_change && vehicle_id) {
      db.prepare(`
        INSERT INTO oil_changes (
          invoice_id, vehicle_id, oil_type, current_odometer,
          next_change_odometer, next_change_date, notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        invoiceId,
        vehicle_id,
        oil_change.oil_type,
        oil_change.current_odometer,
        oil_change.next_change_odometer,
        oil_change.next_change_date,
        oil_change.notes
      );
    }

    return invoiceId;
  });

  try {
    const invoiceId = transaction();
    res.status(201).json({ 
      id: invoiceId,
      invoice_number,
      message: 'Hóa đơn đã được tạo thành công'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- SERVICES API ---

// Lấy danh sách dịch vụ
app.get('/api/services', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services').all();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- BATCHES API ---

// Lấy danh sách lô hàng
app.get('/api/batches', (req, res) => {
  try {
    const batches = db.prepare(`
      SELECT b.*, s.name as supplier_name
      FROM batches b
      LEFT JOIN suppliers s ON b.supplier_id = s.id
      ORDER BY b.import_date DESC
    `).all();
    
    res.json(batches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm lô hàng mới
app.post('/api/batches', (req, res) => {
  try {
    const { batch_code, supplier_id, import_date, notes } = req.body;
    
    const result = db.prepare(`
      INSERT INTO batches (batch_code, supplier_id, import_date, notes)
      VALUES (?, ?, ?, ?)
    `).run(batch_code, supplier_id, import_date, notes);

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
