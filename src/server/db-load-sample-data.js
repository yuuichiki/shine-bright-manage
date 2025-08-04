
/**
 * Load demo/sample data after tables creation for SQLite memory DB.
 */
function loadSampleData(db) {
  console.log('Loading sample data...');

  // 1. Product Categories
  db.run(`INSERT INTO product_categories (name, description) VALUES 
    ('Dầu gội', 'Các loại dầu gội chăm sóc xe'),
    ('Wax', 'Sáp đánh bóng xe'),
    ('Hóa chất', 'Các loại hóa chất rửa xe'),
    ('Phụ kiện', 'Phụ kiện và dụng cụ rửa xe'),
    ('Thiết bị', 'Máy móc thiết bị rửa xe')`);

  // 2. Suppliers (correct fields: name, contact, phone, email, address)
  db.run(`INSERT INTO suppliers (name, contact, phone, email, address) VALUES 
    ('Công ty CP Hóa chất ABC', 'Nguyễn Văn A', '0901234567', 'nguyenvana@abc.com', '123 Đường ABC, Q1, TP.HCM'),
    ('Thiết bị rửa xe XYZ', 'Trần Thị B', '0912345678', 'tranthib@xyz.com', '456 Đường XYZ, Q2, TP.HCM'),
    ('Phân phối dầu gội DEF', 'Lê Văn C', '0923456789', 'levanc@def.com', '789 Đường DEF, Q3, TP.HCM')`);

  // 3. Batches (correct fields: batch_code, supplier_id, import_date, notes)
  db.run(`INSERT INTO batches (batch_code, supplier_id, import_date, notes) VALUES 
    ('BATCH-2024-001', 1, '2024-01-15', 'Lô hàng hóa chất ABC đầu tiên'),
    ('BATCH-2024-002', 2, '2024-01-20', 'Lô thiết bị rửa xe XYZ'),
    ('BATCH-2024-003', 3, '2024-01-25', 'Lô dầu gội DEF')`);

  // 4. Landed Costs
  db.run(`INSERT INTO landed_costs (batch_id, cost_type, amount, description) VALUES 
    (1, 'Vận chuyển', 200000, 'Phí vận chuyển từ kho'),
    (1, 'Thuế', 300000, 'Thuế nhập khẩu'),
    (2, 'Vận chuyển', 400000, 'Phí vận chuyển thiết bị'),
    (3, 'Vận chuyển', 150000, 'Phí vận chuyển dầu gội')`);

  // 5. Inventory (correct fields: name, category_id, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date, invoice_image)
  db.run(`INSERT INTO inventory (name, category_id, type, quantity, unit, unit_price, reorder_point, usage_rate, batch_id, import_date) VALUES 
    ('Dầu gội Turtle Wax', 1, 'consumable', 50, 'chai', 150000, 10, '5 chai/tháng', 1, '2024-01-15'),
    ('Wax Meguiars', 2, 'consumable', 30, 'hộp', 250000, 5, '3 hộp/tháng', 1, '2024-01-15'),
    ('Máy rửa xe Karcher', 5, 'equipment', 2, 'cái', 15000000, 1, NULL, 2, '2024-01-20'),
    ('Vòi phun cao áp', 4, 'equipment', 10, 'cái', 500000, 2, NULL, 2, '2024-01-20'),
    ('Hóa chất tẩy rửa', 3, 'consumable', 20, 'lít', 80000, 5, '2 lít/tuần', 3, '2024-01-25')`);

  // 6. Customers (correct fields: name, phone, email, discount_rate, notes, registration_date)
  db.run(`INSERT INTO customers (name, phone, email, discount_rate, notes) VALUES 
    ('Nguyễn Văn Nam', '0987654321', 'nam@email.com', 0.15, 'Khách hàng VIP'),
    ('Trần Thị Lan', '0976543210', 'lan@email.com', 0.10, 'Khách hàng thường xuyên'),
    ('Lê Hoàng Minh', '0965432109', 'minh@email.com', 0.05, 'Khách hàng mới'),
    ('Phạm Thị Hoa', '0954321098', 'hoa@email.com', 0.20, 'Khách hàng doanh nghiệp')`);

  // 7. Customer Vehicles (correct fields: customer_id, vehicle_type, license_plate, brand, model, year)
  db.run(`INSERT INTO customer_vehicles (customer_id, vehicle_type, license_plate, brand, model, year) VALUES 
    (1, 'Sedan', '51A-12345', 'Toyota', 'Camry', 2022),
    (1, 'SUV', '51B-67890', 'Honda', 'CR-V', 2021),
    (2, 'SUV', '51C-11111', 'Mazda', 'CX-5', 2023),
    (3, 'Sedan', '51D-22222', 'Hyundai', 'Accent', 2020),
    (4, 'Pickup', '51E-33333', 'Ford', 'Ranger', 2023)`);

  // 8. Car Categories (correct fields: name, description, service_multiplier)
  db.run(`INSERT INTO car_categories (name, description, service_multiplier) VALUES 
    ('Xe con 4 chỗ', 'Xe sedan, hatchback kích thước nhỏ', 1.0),
    ('Xe con 7 chỗ', 'Xe SUV, MPV kích thước trung bình', 1.3),
    ('Xe bán tải', 'Xe pickup, bán tải các loại', 1.5),
    ('Xe sang', 'Xe hạng sang, siêu xe', 2.0)`);

  // 9. Services (correct fields: name, description, price, duration)
  db.run(`INSERT INTO services (name, description, price, duration) VALUES 
    ('Rửa xe cơ bản', 'Rửa bên ngoài, lau khô', 50000, 30),
    ('Rửa xe cao cấp', 'Rửa toàn bộ, vệ sinh nội thất', 100000, 60),
    ('Đánh bóng xe', 'Đánh bóng sơn xe, bảo vệ lâu dài', 200000, 90),
    ('Vệ sinh nội thất', 'Hút bụi, vệ sinh ghế da', 80000, 45),
    ('Thay dầu máy', 'Thay dầu và lọc dầu', 150000, 30)`);

  // 9. Customer Groups (correct fields: name, description, criteria, created_at)
  db.run(`INSERT INTO customer_groups (name, description, criteria) VALUES 
    ('VIP', 'Khách hàng VIP', 'Doanh thu trên 10 triệu/tháng'),
    ('Thường xuyên', 'Khách hàng thường xuyên', 'Sử dụng dịch vụ hàng tuần'),
    ('Doanh nghiệp', 'Khách hàng doanh nghiệp', 'Hợp đồng theo tháng'),
    ('Mới', 'Khách hàng mới', 'Lần đầu sử dụng dịch vụ')`);

  // 10. Customer Group Members (correct fields: customer_id, customer_group_id, assigned_date)
  db.run(`INSERT INTO customer_group_members (customer_id, customer_group_id) VALUES 
    (1, 1), (2, 2), (3, 4), (4, 3)`);

  // 11. Employees (correct fields: name, employee_id, card_id, position, department, phone, email, hire_date, is_active, created_at)
  db.run(`INSERT INTO employees (name, employee_id, card_id, position, department, phone, email, hire_date, is_active) VALUES 
    ('Nguyễn Thành Long', 'EMP001', 'CARD001', 'Quản lý', 'Điều hành', '0911111111', 'long@carwash.com', '2023-01-01', 1),
    ('Trần Văn Đức', 'EMP002', 'CARD002', 'Nhân viên rửa xe', 'Vận hành', '0922222222', 'duc@carwash.com', '2023-02-01', 1),
    ('Lê Thị Mai', 'EMP003', 'CARD003', 'Thu ngân', 'Tài chính', '0933333333', 'mai@carwash.com', '2023-03-01', 1),
    ('Phạm Văn Hùng', 'EMP004', 'CARD004', 'Thợ máy', 'Kỹ thuật', '0944444444', 'hung@carwash.com', '2023-04-01', 1)`);

  // 12. Users (correct fields: username, password, display_name, created_at)
  db.run(`INSERT INTO users (username, password, display_name) VALUES 
    ('admin', 'admin123', 'Quản trị viên'),
    ('cashier', 'cashier123', 'Thu ngân'),
    ('manager', 'manager123', 'Quản lý')`);

  // 13. Promotions (correct fields: name, description, type, discount_type, discount_value, min_purchase_amount, max_discount_amount, start_date, end_date, is_active, usage_limit, used_count, applicable_products, applicable_services, created_date)
  db.run(`INSERT INTO promotions (name, description, type, discount_type, discount_value, min_purchase_amount, start_date, end_date, is_active, usage_limit, used_count, applicable_services) VALUES 
    ('Giảm giá cuối tuần', 'Giảm 20% các dịch vụ cuối tuần', 'seasonal', 'percentage', 20, 0, '2024-01-01', '2024-12-31', 1, 1000, 0, '1,2,3,4,5'),
    ('Khuyến mãi khách mới', 'Giảm 50,000đ cho khách hàng mới', 'welcome', 'fixed', 50000, 100000, '2024-01-01', '2024-06-30', 1, 500, 0, '1,2,3,4,5'),
    ('Combo rửa xe + đánh bóng', 'Giảm 15% khi sử dụng 2 dịch vụ', 'combo', 'percentage', 15, 200000, '2024-02-01', '2024-05-31', 1, 200, 0, '2,3')`);

  // 14. Vouchers (correct fields: code, promotion_id, customer_id, customer_group_id, discount_type, discount_value, min_purchase_amount, max_discount_amount, valid_from, valid_until, is_used, used_date, used_invoice_id, created_at)
  db.run(`INSERT INTO vouchers (code, promotion_id, customer_id, customer_group_id, discount_type, discount_value, min_purchase_amount, valid_from, valid_until, is_used, used_date, used_invoice_id) VALUES 
    ('WEEKEND20', 1, NULL, NULL, 'percentage', 20, 0, '2024-01-01', '2024-12-31', 0, NULL, NULL),
    ('NEWCUST50', 2, 3, NULL, 'fixed', 50000, 100000, '2024-01-15', '2024-06-30', 1, '2024-01-20', 3),
    ('COMBO15', 3, NULL, NULL, 'percentage', 15, 200000, '2024-02-01', '2024-05-31', 0, NULL, NULL)`);

  // 15. Invoices (correct fields: invoice_number, customer_id, vehicle_id, date, total_amount, discount_amount, vat_amount, vat_included, final_amount, payment_method, payment_status, notes)
  db.run(`INSERT INTO invoices (invoice_number, customer_id, vehicle_id, date, total_amount, discount_amount, vat_amount, vat_included, final_amount, payment_method, payment_status, notes) VALUES 
    ('INV-2024-001', 1, 1, '2024-01-20', 250000, 37500, 0, 0, 212500, 'cash', 'paid', 'Áp dụng giảm giá VIP 15%'),
    ('INV-2024-002', 2, 3, '2024-01-21', 180000, 18000, 0, 0, 162000, 'card', 'paid', 'Áp dụng giảm giá thường xuyên 10%'),
    ('INV-2024-003', 3, 4, '2024-01-22', 130000, 50000, 0, 0, 80000, 'cash', 'paid', 'Sử dụng voucher khách mới'),
    ('INV-2024-004', 4, 5, '2024-01-23', 450000, 90000, 0, 0, 360000, 'transfer', 'paid', 'Áp dụng giảm giá doanh nghiệp 20%')`);

  // 16. Invoice Services (correct fields: invoice_id, service_id, quantity, unit_price, subtotal)
  db.run(`INSERT INTO invoice_services (invoice_id, service_id, quantity, unit_price, subtotal) VALUES 
    (1, 2, 1, 100000, 100000),
    (1, 3, 1, 150000, 150000),
    (2, 2, 1, 100000, 100000),
    (2, 4, 1, 80000, 80000),
    (3, 1, 1, 50000, 50000),
    (3, 4, 1, 80000, 80000),
    (4, 2, 1, 100000, 100000),
    (4, 3, 1, 200000, 200000),
    (4, 5, 1, 150000, 150000)`);

  // 17. Invoice Products (correct fields: invoice_id, product_id, quantity, unit_price, subtotal, batch_id)
  db.run(`INSERT INTO invoice_products (invoice_id, product_id, quantity, unit_price, subtotal, batch_id) VALUES 
    (1, 1, 1, 50000, 50000, 1),
    (4, 4, 2, 75000, 150000, 2)`);

  // 18. Oil Changes (correct fields: invoice_id, vehicle_id, oil_type, current_odometer, next_change_odometer, next_change_date, notes)
  db.run(`INSERT INTO oil_changes (invoice_id, vehicle_id, oil_type, current_odometer, next_change_odometer, next_change_date, notes) VALUES 
    (1, 1, 'Fully Synthetic 5W-30', 25000, 30000, '2024-04-20', 'Thay dầu định kỳ'),
    (2, 3, 'Semi-Synthetic 10W-40', 35000, 40000, '2024-04-21', 'Thay dầu và lọc gió'),
    (4, 5, 'Conventional 15W-40', 15000, 20000, '2024-04-25', 'Chỉ thay dầu')`);

  // 19. Attendance (correct fields: employee_id, date, check_in, check_out, work_hours, status, created_at)
  db.run(`INSERT INTO attendance (employee_id, date, check_in, check_out, work_hours, status) VALUES 
    (1, '2024-01-20', '08:00', '17:00', 9.0, 'on_time'),
    (2, '2024-01-20', '08:15', '17:00', 8.75, 'late'),
    (3, '2024-01-20', '08:00', '17:00', 9.0, 'on_time'),
    (4, '2024-01-20', '08:00', '16:30', 8.5, 'early_leave'),
    (1, '2024-01-21', '08:00', '17:00', 9.0, 'on_time'),
    (3, '2024-01-21', '08:00', '17:00', 9.0, 'on_time'),
    (4, '2024-01-21', '08:00', '17:00', 9.0, 'on_time')`);

  console.log('✅ Sample data loaded successfully!');
}
export default loadSampleData;