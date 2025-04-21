
/**
 * Load demo/sample data after tables creation for SQLite memory DB.
 */
function loadSampleData(db) {
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

  // Thêm tài khoản quản trị demo cho login:
  try {
    db.run(
      "INSERT INTO users (username, password, display_name) VALUES (?, ?, ?)",
      ["admin", "123456", "Quản trị viên"]
    );
  } catch (e) {}

  console.log('Sample data loaded successfully');
}

module.exports = loadSampleData;
