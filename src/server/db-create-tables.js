
/**
 * Table creation logic for the SQLite in-memory database.
 */
function createTables(db) {
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

  // Bảng users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      display_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Database tables created successfully");
}

module.exports = createTables;
