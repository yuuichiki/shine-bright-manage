
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

  // 2. Suppliers
  db.run(`INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES 
    ('Công ty CP Hóa chất ABC', 'Nguyễn Văn A', '0901234567', 'nguyenvana@abc.com', '123 Đường ABC, Q1, TP.HCM'),
    ('Thiết bị rửa xe XYZ', 'Trần Thị B', '0912345678', 'tranthib@xyz.com', '456 Đường XYZ, Q2, TP.HCM'),
    ('Phân phối dầu gội DEF', 'Lê Văn C', '0923456789', 'levanc@def.com', '789 Đường DEF, Q3, TP.HCM')`);

  // 3. Batches
  db.run(`INSERT INTO batches (supplier_id, import_date, invoice_number, total_cost, status) VALUES 
    (1, '2024-01-15', 'INV-2024-001', 5000000, 'completed'),
    (2, '2024-01-20', 'INV-2024-002', 8000000, 'completed'),
    (3, '2024-01-25', 'INV-2024-003', 3000000, 'completed')`);

  // 4. Landed Costs
  db.run(`INSERT INTO landed_costs (batch_id, cost_type, amount, description) VALUES 
    (1, 'Vận chuyển', 200000, 'Phí vận chuyển từ kho'),
    (1, 'Thuế', 300000, 'Thuế nhập khẩu'),
    (2, 'Vận chuyển', 400000, 'Phí vận chuyển thiết bị'),
    (3, 'Vận chuyển', 150000, 'Phí vận chuyển dầu gội')`);

  // 5. Inventory
  db.run(`INSERT INTO inventory (name, category, quantity, unit, reorder_point, unit_price, type, usage_rate, import_date, batch_id) VALUES 
    ('Dầu gội Turtle Wax', 'Dầu gội', 50, 'chai', 10, 150000, 'consumable', '5 chai/tháng', '2024-01-15', 1),
    ('Wax Meguiars', 'Wax', 30, 'hộp', 5, 250000, 'consumable', '3 hộp/tháng', '2024-01-15', 1),
    ('Máy rửa xe Karcher', 'Thiết bị', 2, 'cái', 1, 15000000, 'equipment', 'N/A', '2024-01-20', 2),
    ('Vòi phun cao áp', 'Phụ kiện', 10, 'cái', 2, 500000, 'equipment', 'N/A', '2024-01-20', 2),
    ('Hóa chất tẩy rửa', 'Hóa chất', 20, 'lít', 5, 80000, 'consumable', '2 lít/tuần', '2024-01-25', 3)`);

  // 6. Customers
  db.run(`INSERT INTO customers (name, phone, email, address, notes) VALUES 
    ('Nguyễn Văn Nam', '0987654321', 'nam@email.com', '123 Nguyễn Huệ, Q1, TP.HCM', 'Khách hàng VIP'),
    ('Trần Thị Lan', '0976543210', 'lan@email.com', '456 Lê Lợi, Q3, TP.HCM', 'Khách hàng thường xuyên'),
    ('Lê Hoàng Minh', '0965432109', 'minh@email.com', '789 Võ Văn Tần, Q2, TP.HCM', 'Khách hàng mới'),
    ('Phạm Thị Hoa', '0954321098', 'hoa@email.com', '321 Pasteur, Q1, TP.HCM', 'Khách hàng doanh nghiệp')`);

  // 7. Customer Vehicles
  db.run(`INSERT INTO customer_vehicles (customer_id, license_plate, make, model, year, color, notes) VALUES 
    (1, '51A-12345', 'Toyota', 'Camry', 2022, 'Trắng', 'Xe sedan cao cấp'),
    (1, '51B-67890', 'Honda', 'CR-V', 2021, 'Đen', 'Xe SUV gia đình'),
    (2, '51C-11111', 'Mazda', 'CX-5', 2023, 'Đỏ', 'Xe mới'),
    (3, '51D-22222', 'Hyundai', 'Accent', 2020, 'Bạc', 'Xe cũ'),
    (4, '51E-33333', 'Ford', 'Ranger', 2023, 'Xanh', 'Xe bán tải')`);

  // 8. Services
  db.run(`INSERT INTO services (name, description, price, duration_minutes, category) VALUES 
    ('Rửa xe cơ bản', 'Rửa bên ngoài, lau khô', 50000, 30, 'Rửa xe'),
    ('Rửa xe cao cấp', 'Rửa toàn bộ, vệ sinh nội thất', 100000, 60, 'Rửa xe'),
    ('Đánh bóng xe', 'Đánh bóng sơn xe, bảo vệ lâu dài', 200000, 90, 'Đánh bóng'),
    ('Vệ sinh nội thất', 'Hút bụi, vệ sinh ghế da', 80000, 45, 'Nội thất'),
    ('Thay dầu máy', 'Thay dầu và lọc dầu', 150000, 30, 'Bảo dưỡng')`);

  // 9. Customer Groups
  db.run(`INSERT INTO customer_groups (name, description, discount_percentage) VALUES 
    ('VIP', 'Khách hàng VIP', 15),
    ('Thường xuyên', 'Khách hàng thường xuyên', 10),
    ('Doanh nghiệp', 'Khách hàng doanh nghiệp', 20),
    ('Mới', 'Khách hàng mới', 5)`);

  // 10. Customer Group Members
  db.run(`INSERT INTO customer_group_members (customer_id, group_id) VALUES 
    (1, 1), (2, 2), (3, 4), (4, 3)`);

  // 11. Employees
  db.run(`INSERT INTO employees (name, position, phone, email, hire_date, salary, status) VALUES 
    ('Nguyễn Thành Long', 'Quản lý', '0911111111', 'long@carwash.com', '2023-01-01', 15000000, 'active'),
    ('Trần Văn Đức', 'Nhân viên rửa xe', '0922222222', 'duc@carwash.com', '2023-02-01', 8000000, 'active'),
    ('Lê Thị Mai', 'Nhân viên thu ngân', '0933333333', 'mai@carwash.com', '2023-03-01', 7000000, 'active'),
    ('Phạm Văn Hùng', 'Thợ máy', '0944444444', 'hung@carwash.com', '2023-04-01', 10000000, 'active')`);

  // 12. Users
  db.run(`INSERT INTO users (username, password, email, role, employee_id, status) VALUES 
    ('admin', 'admin123', 'admin@carwash.com', 'admin', 1, 'active'),
    ('cashier', 'cashier123', 'cashier@carwash.com', 'cashier', 3, 'active'),
    ('manager', 'manager123', 'manager@carwash.com', 'manager', 1, 'active')`);

  // 13. Promotions
  db.run(`INSERT INTO promotions (name, description, discount_type, discount_value, start_date, end_date, status, conditions) VALUES 
    ('Giảm giá cuối tuần', 'Giảm 20% các dịch vụ cuối tuần', 'percentage', 20, '2024-01-01', '2024-12-31', 'active', 'Áp dụng thứ 7, chủ nhật'),
    ('Khuyến mãi khách mới', 'Giảm 50,000đ cho khách hàng mới', 'fixed', 50000, '2024-01-01', '2024-06-30', 'active', 'Khách hàng lần đầu sử dụng dịch vụ'),
    ('Combo rửa xe + đánh bóng', 'Giảm 15% khi sử dụng 2 dịch vụ', 'percentage', 15, '2024-02-01', '2024-05-31', 'active', 'Phải sử dụng cả 2 dịch vụ')`);

  // 14. Vouchers
  db.run(`INSERT INTO vouchers (code, promotion_id, customer_id, status, created_date, used_date) VALUES 
    ('WEEKEND20', 1, NULL, 'active', '2024-01-01', NULL),
    ('NEWCUST50', 2, 3, 'used', '2024-01-15', '2024-01-20'),
    ('COMBO15', 3, NULL, 'active', '2024-02-01', NULL)`);

  // 15. Invoices
  db.run(`INSERT INTO invoices (customer_id, date, total_amount, discount_amount, final_amount, payment_method, status, notes) VALUES 
    (1, '2024-01-20', 250000, 37500, 212500, 'cash', 'paid', 'Áp dụng giảm giá VIP 15%'),
    (2, '2024-01-21', 150000, 15000, 135000, 'card', 'paid', 'Áp dụng giảm giá thường xuyên 10%'),
    (3, '2024-01-22', 100000, 50000, 50000, 'cash', 'paid', 'Sử dụng voucher khách mới'),
    (4, '2024-01-23', 300000, 60000, 240000, 'transfer', 'paid', 'Áp dụng giảm giá doanh nghiệp 20%')`);

  // 16. Invoice Services
  db.run(`INSERT INTO invoice_services (invoice_id, service_id, quantity, unit_price, total_price) VALUES 
    (1, 2, 1, 100000, 100000),
    (1, 3, 1, 200000, 200000),
    (2, 2, 1, 100000, 100000),
    (2, 4, 1, 80000, 80000),
    (3, 1, 1, 50000, 50000),
    (3, 4, 1, 80000, 80000),
    (4, 2, 1, 100000, 100000),
    (4, 3, 1, 200000, 200000),
    (4, 5, 1, 150000, 150000)`);

  // 17. Invoice Products (if any products sold)
  db.run(`INSERT INTO invoice_products (invoice_id, product_name, quantity, unit_price, total_price) VALUES 
    (1, 'Nước hoa xe Febreze', 1, 50000, 50000),
    (4, 'Thảm lót sàn cao su', 2, 75000, 150000)`);

  // 18. Oil Changes
  db.run(`INSERT INTO oil_changes (vehicle_id, service_date, mileage, oil_type, filter_changed, next_service_mileage, notes) VALUES 
    (1, '2024-01-20', 25000, 'Fully Synthetic 5W-30', 1, 30000, 'Thay dầu định kỳ'),
    (2, '2024-01-18', 35000, 'Semi-Synthetic 10W-40', 1, 40000, 'Thay dầu và lọc gió'),
    (5, '2024-01-25', 15000, 'Conventional 15W-40', 0, 20000, 'Chỉ thay dầu')`);

  // 19. Attendance
  db.run(`INSERT INTO attendance (employee_id, date, check_in, check_out, status, notes) VALUES 
    (1, '2024-01-20', '08:00', '17:00', 'present', 'Đúng giờ'),
    (2, '2024-01-20', '08:15', '17:00', 'late', 'Trễ 15 phút'),
    (3, '2024-01-20', '08:00', '17:00', 'present', 'Đúng giờ'),
    (4, '2024-01-20', '08:00', '16:30', 'early_leave', 'Về sớm 30 phút'),
    (1, '2024-01-21', '08:00', '17:00', 'present', 'Đúng giờ'),
    (2, '2024-01-21', NULL, NULL, 'absent', 'Nghỉ ốm'),
    (3, '2024-01-21', '08:00', '17:00', 'present', 'Đúng giờ'),
    (4, '2024-01-21', '08:00', '17:00', 'present', 'Đúng giờ')`);

  console.log('✅ Sample data loaded successfully!');
}
export default loadSampleData;