
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

let db;
let SQL;

// Initialize the database
async function initializeDatabase() {
  try {
    // Initialize SQL.js
    SQL = await initSqlJs();
    
    // Create a new database
    db = new SQL.Database();
    
    console.log("SQLite database initialized in memory");
    
    // Create tables
    createTables();
    
    // Load sample data for testing
    loadSampleData();
    
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

function createTables() {
  // Bảng danh mục sản phẩm
  db.run(`
    CREATE TABLE IF NOT EXISTS product_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  // Bảng nhà cung cấp
  db.run(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT,
      phone TEXT,
      email TEXT,
      address TEXT
    );
  `);

  // Bảng lô hàng
  db.run(`
    CREATE TABLE IF NOT EXISTS batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_code TEXT NOT NULL UNIQUE,
      supplier_id INTEGER,
      import_date TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
    );
  `);

  // Bảng chi phí nhập hàng
  db.run(`
    CREATE TABLE IF NOT EXISTS landed_costs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id INTEGER NOT NULL,
      cost_type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      FOREIGN KEY (batch_id) REFERENCES batches (id)
    );
  `);

  // Bảng sản phẩm (inventory)
  db.run(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER,
      type TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      unit TEXT NOT NULL,
      unit_price REAL NOT NULL,
      reorder_point INTEGER NOT NULL DEFAULT 0,
      usage_rate TEXT,
      batch_id INTEGER,
      import_date TEXT NOT NULL,
      invoice_image TEXT,
      FOREIGN KEY (category_id) REFERENCES product_categories (id),
      FOREIGN KEY (batch_id) REFERENCES batches (id)
    );
  `);

  // Bảng khách hàng
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE,
      email TEXT,
      discount_rate REAL DEFAULT 0,
      notes TEXT,
      registration_date TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Bảng xe của khách hàng
  db.run(`
    CREATE TABLE IF NOT EXISTS customer_vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      vehicle_type TEXT NOT NULL,
      license_plate TEXT,
      brand TEXT,
      model TEXT,
      year INTEGER,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    );
  `);

  // Bảng dịch vụ
  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      duration INTEGER
    );
  `);

  // Bảng hóa đơn
  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE,
      customer_id INTEGER,
      vehicle_id INTEGER,
      date TEXT NOT NULL,
      total_amount REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      vat_amount REAL DEFAULT 0,
      vat_included BOOLEAN DEFAULT 0,
      final_amount REAL NOT NULL,
      payment_method TEXT,
      payment_status TEXT DEFAULT 'pending',
      notes TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers (id),
      FOREIGN KEY (vehicle_id) REFERENCES customer_vehicles (id)
    );
  `);

  // Bảng chi tiết hóa đơn - dịch vụ
  db.run(`
    CREATE TABLE IF NOT EXISTS invoice_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      unit_price REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices (id),
      FOREIGN KEY (service_id) REFERENCES services (id)
    );
  `);

  // Bảng chi tiết hóa đơn - sản phẩm
  db.run(`
    CREATE TABLE IF NOT EXISTS invoice_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      subtotal REAL NOT NULL,
      batch_id INTEGER,
      FOREIGN KEY (invoice_id) REFERENCES invoices (id),
      FOREIGN KEY (product_id) REFERENCES inventory (id),
      FOREIGN KEY (batch_id) REFERENCES batches (id)
    );
  `);

  // Bảng ghi nhớ thay dầu
  db.run(`
    CREATE TABLE IF NOT EXISTS oil_changes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      vehicle_id INTEGER NOT NULL,
      oil_type TEXT NOT NULL,
      current_odometer INTEGER NOT NULL,
      next_change_odometer INTEGER,
      next_change_date TEXT,
      notes TEXT,
      FOREIGN KEY (invoice_id) REFERENCES invoices (id),
      FOREIGN KEY (vehicle_id) REFERENCES customer_vehicles (id)
    );
  `);

  console.log("Database tables created successfully");
}

function loadSampleData() {
  // Insert sample data for categories
  const categories = ['Hóa chất', 'Bảo dưỡng', 'Dụng cụ lau chùi', 'Thiết bị'];
  categories.forEach(category => {
    try {
      db.run('INSERT INTO product_categories (name) VALUES (?)', [category]);
    } catch (err) {
      // Ignore duplicate entries
      console.log(`Category ${category} already exists`);
    }
  });

  // Insert sample supplier
  db.run('INSERT INTO suppliers (name, contact, phone) VALUES (?, ?, ?)',
    ['Nhà cung cấp Cleaner', 'Nguyễn Văn A', '0123456789']);

  // Insert sample batch
  try {
    db.run('INSERT INTO batches (batch_code, supplier_id, import_date, notes) VALUES (?, ?, ?, ?)',
      ['BATCH001', 1, '2025-04-10', 'Lô hàng đầu tháng 4']);
  } catch (err) {
    console.log('Batch BATCH001 already exists');
  }

  // Get category IDs
  const categoryIdMap = {};
  categories.forEach(category => {
    const result = db.exec(`SELECT id FROM product_categories WHERE name = '${category}'`);
    if (result.length > 0 && result[0].values.length > 0) {
      categoryIdMap[category] = result[0].values[0][0];
    }
  });

  // Sample inventory items
  const inventoryItems = [
    { name: 'Nước rửa xe', category: 'Hóa chất', type: 'consumable', quantity: 50, unit: 'Lít', unit_price: 40000, reorder_point: 20, usage_rate: '0.2 Lít/xe con, 0.3 Lít/xe lớn', batch_id: 1, import_date: '2025-04-10' },
    { name: 'Dầu động cơ 5W-30', category: 'Bảo dưỡng', type: 'consumable', quantity: 30, unit: 'Lít', unit_price: 180000, reorder_point: 15, usage_rate: '4 Lít/xe con, 6 Lít/xe lớn', batch_id: 1, import_date: '2025-04-10' },
    { name: 'Khăn lau microfiber', category: 'Dụng cụ lau chùi', type: 'consumable', quantity: 100, unit: 'Chiếc', unit_price: 15000, reorder_point: 50, usage_rate: '2 Chiếc/xe', batch_id: 1, import_date: '2025-04-12' },
    { name: 'Máy rửa xe áp lực cao', category: 'Thiết bị', type: 'equipment', quantity: 2, unit: 'Chiếc', unit_price: 5000000, reorder_point: 1, batch_id: 1, import_date: '2025-03-15' },
    { name: 'Máy hút bụi công nghiệp', category: 'Thiết bị', type: 'equipment', quantity: 2, unit: 'Chiếc', unit_price: 3000000, reorder_point: 1, batch_id: 1, import_date: '2025-03-20' }
  ];

  // Insert inventory items
  inventoryItems.forEach(item => {
    try {
      const categoryId = categoryIdMap[item.category];
      db.run(
        'INSERT INTO inventory (name, category_id, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [item.name, categoryId, item.type, item.quantity, item.unit, item.unit_price, item.reorder_point, item.usage_rate || null, item.batch_id, item.import_date]
      );
    } catch (err) {
      console.log(`Error adding inventory item ${item.name}: ${err.message}`);
    }
  });

  // Insert sample services
  const services = [
    { name: 'Rửa xe cơ bản', description: 'Rửa ngoại thất xe', price: 100000, duration: 30 },
    { name: 'Rửa xe full', description: 'Rửa ngoại thất và nội thất xe', price: 200000, duration: 60 },
    { name: 'Thay dầu máy', description: 'Thay dầu và lọc dầu', price: 300000, duration: 45 }
  ];

  services.forEach(service => {
    try {
      db.run(
        'INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)',
        [service.name, service.description, service.price, service.duration]
      );
    } catch (err) {
      console.log(`Service ${service.name} already exists`);
    }
  });

  console.log('Sample data loaded successfully');
}

// Helper functions for database operations

function all(query, params = []) {
  try {
    const result = db.exec(query, params);
    if (!result || result.length === 0) return [];
    
    const columns = result[0].columns;
    const rows = result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
    
    return rows;
  } catch (err) {
    console.error('Error executing query:', err);
    return [];
  }
}

function get(query, params = []) {
  try {
    const result = db.exec(query, params);
    if (!result || result.length === 0 || result[0].values.length === 0) return null;
    
    const columns = result[0].columns;
    const row = result[0].values[0];
    
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    
    return obj;
  } catch (err) {
    console.error('Error executing query:', err);
    return null;
  }
}

function run(query, params = []) {
  try {
    db.run(query, params);
    const lastId = db.exec('SELECT last_insert_rowid()');
    return {
      lastInsertRowid: lastId && lastId.length > 0 ? lastId[0].values[0][0] : null,
      changes: 1 // sql.js doesn't provide changes info, so we'll just assume 1
    };
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}

// Initialize database when this module is loaded
let dbPromise = initializeDatabase();

// Export a promise that resolves with the database interface
module.exports = {
  getDb: async () => {
    await dbPromise;
    return {
      all,
      get,
      run,
      exec: (query) => db.run(query)
    };
  }
};
